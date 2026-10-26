#!/usr/bin/env python3
"""Collect the fixed 21:35 JST–00:18 JST window; preserve retrieval-time revisions.
Run from any directory. Uses the established collector's request/pagination logic.
No credentials or severity filter; later runs cannot recreate earlier revisions.
"""
import concurrent.futures
import datetime as dt
import gzip
import hashlib
import importlib.machinery
import json
import os
import re
import urllib.parse
from pathlib import Path
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data/2026-10-27-0018'
PREVIOUS = ROOT / 'data/2026-10-26-2135'
START, END = '2026-10-26T12:35:00', '2026-10-26T15:18:00'
BASE = importlib.machinery.SourceFileLoader('snapshot_base', str(ROOT/'tools/intel/snapshot-1027.py')).load_module()
BASE.OUT, BASE.START, BASE.END = OUT, START, END
ORIGINAL_SOURCE = BASE.source


def decoded(path):
    raw = path.read_bytes()
    return gzip.decompress(raw) if path.suffix == '.gz' else raw


def previous_source(name):
    summary = json.loads((PREVIOUS/'collection-summary.json').read_text())
    if name.startswith('feed-'):
        return next((x for x in summary.get('feeds', []) if x.get('name') == name), {})
    return summary.get(name, {})


def source(name, url):
    item = ORIGINAL_SOURCE(name, url)
    if item.get('status') == 'ok':
        current = OUT/item['file']
        previous_meta = previous_source(name)
        previous = (PREVIOUS/previous_meta['file']).resolve() if previous_meta.get('file') else PREVIOUS/item['file']
        if previous.exists() and hashlib.sha256(decoded(previous)).hexdigest() == item['sha256']:
            current.unlink()
            item['file'] = os.path.relpath(previous, OUT)
            item['unchanged_from_previous'] = True
        if b'Client Challenge' in decoded(OUT/item['file']):
            item['content_warning'] = 'HTTP success but an anti-bot challenge, not the requested advisory body'
    return item

BASE.source = source


def ghsa(mode):
    """Explicitly include reviewed, unreviewed and malware, following Link URLs."""
    rows, pages = {}, []
    for advisory_type in ('reviewed', 'unreviewed', 'malware'):
        query = {'per_page':100, 'sort':'published' if mode=='published' else 'updated',
                 'direction':'desc', 'type':advisory_type,
                 mode:START+'Z..'+END+'Z'}
        url='https://api.github.com/advisories?'+urllib.parse.urlencode(query)
        page=1
        while url:
            stamp=BASE.now()
            try:
                raw, headers=BASE.request(url)
                batch=json.loads(raw)
                if not isinstance(batch,list): raise ValueError('Expected advisory list')
                filename=f'ghsa-{mode}-{advisory_type}-{page}.json'
                BASE.save(filename,raw)
                pages.append({'url':url,'retrieved_at':stamp,'file':filename,
                              'type':advisory_type,'returned':len(batch),
                              'sha256':hashlib.sha256(raw).hexdigest()})
                for row in batch: rows[row['ghsa_id']]=row
                following=re.search(r'<([^>]+)>;\s*rel="next"',headers.get('Link',''))
                url=following[1] if following else None
                page+=1
            except Exception as exc:
                return {'mode':mode,'complete':False,'returned':len(rows),'pages':pages,
                        'error':str(exc),'failed_url':url,'retrieved_at':stamp}
    return {'mode':mode,'complete':True,'returned':len(rows),'pages':pages}


def list_nvd(result):
    rows = []
    for page in result.get('pages', []):
        for row in json.loads(decoded(OUT/page['file'])).get('vulnerabilities', []):
            cve = row['cve']
            rows.append({'id':cve['id'], 'published':cve['published'], 'modified':cve['lastModified'],
                         'status':cve.get('vulnStatus'),
                         'description':next((x['value'] for x in cve.get('descriptions', []) if x['lang']=='en'), ''),
                         'references':cve.get('references', []), 'metrics':cve.get('metrics', {})})
    return rows


def feed_index(feeds):
    rows = []
    for feed in feeds:
        record = {'name':feed['name'], 'status':feed['status'], 'url':feed['url'], 'entries':[]}
        if feed['status'] == 'ok':
            try:
                tree = ET.fromstring(decoded(OUT/feed['file']))
                for node in list(tree.iter()):
                    if node.tag.split('}')[-1] not in ('item', 'entry'): continue
                    entry = {}
                    for child in node:
                        tag = child.tag.split('}')[-1]
                        if tag in ('title','pubDate','date','published','updated'): entry[tag] = child.text
                        elif tag == 'link': entry['url'] = child.get('href') or child.text
                    stamp = entry.get('published') or entry.get('pubDate') or entry.get('date')
                    if stamp:
                        try:
                            when = dt.datetime.fromisoformat(stamp.replace('Z','+00:00')) if 'T' in stamp else parsedate_to_datetime(stamp)
                            entry['publication_utc'] = when.astimezone(dt.timezone.utc).isoformat()
                            entry['in_publication_window'] = START+'+00:00' <= entry['publication_utc'] <= END+'+00:00'
                        except (ValueError, TypeError): entry['date_parse_error'] = True
                    record['entries'].append(entry)
            except Exception as exc: record['parse_error'] = str(exc)
        rows.append(record)
    return rows


def verify_responses(result):
    count, deduplicated, errors = 0, 0, []
    def visit(item):
        nonlocal count, deduplicated
        if isinstance(item, dict):
            if 'file' in item and 'sha256' in item:
                actual = hashlib.sha256(decoded(OUT/item['file'])).hexdigest()
                if actual != item['sha256']:
                    raise ValueError('Response hash mismatch: ' + item['file'])
                count += 1
                deduplicated += item['file'].startswith('../')
            if item.get('status') == 'error':
                errors.append({'name':item.get('name'), 'error':item['error']})
            for value in item.values(): visit(value)
        elif isinstance(item, list):
            for value in item: visit(value)
    visit(result)
    return {'raw_response_hashes_verified':count,
            'deduplicated_references_verified':deduplicated, 'errors':errors}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sources = {
        'kev':'https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json',
        'ipa-fallback':'https://www.ipa.go.jp/security/security-alert/',
        'tailscale-bulletins':'https://tailscale.com/security-bulletins',
        'tailscale-changelog':'https://tailscale.com/changelog',
        'connectwise':'https://www.connectwise.com/company/trust/advisories',
        'pan-php':'https://security.paloaltonetworks.com/CVE-2026-109618',
        'unit42-php':'https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/',
        'php-news':'https://www.php.net/archive/2026.php',
        'php-releases':'https://www.php.net/releases/index.php?json',
        'fortinet':'https://www.fortinet.com/blog/ciso-collective/fortinet-releases-security-hardening-release-for-multiple-products',
        'dotnet-oob':'https://api.github.com/repos/dotnet/announcements/issues/493',
        'dotnet-brotli':'https://api.github.com/repos/dotnet/announcements/issues/494',
        'brotli-1-0-10':'https://api.github.com/repos/google/brotli/releases/tags/v1.0.10',
        'brotli-1-1-1':'https://api.github.com/repos/google/brotli/releases/tags/v1.1.1',
        'brotli-1-2-1':'https://api.github.com/repos/google/brotli/releases/tags/v1.2.1',
        'neat-devices':'https://support.neat.no/article/neat-devices-version-26-5-4/',
        'emudhra-statement':'https://emudhra.com/en/press-release/emudhra-confirms-no-impact-middle-east-africa-global-tls-incident',
        'gougu-research':'https://raw.githubusercontent.com/Gum29/rrrreeeeeeee-readme/main/images/img/GouguOA-RCE-Standard-Vuln-Report-EN.md',
        'yoosee-research':'https://akosibrylle.me/writeups/yoosee-cve',
        'halo-code':'https://raw.githubusercontent.com/halo-dev/halo/main/application/src/main/java/run/halo/app/theme/DefaultViewNameResolver.java',
        'nocodb-code':'https://raw.githubusercontent.com/nocodb/nocodb/develop/packages/nocodb/src/services/users/users.service.ts',
        'nocodb-issue':'https://github.com/nocodb/nocodb/issues/14684',
        'nocodb-commits':'https://api.github.com/repos/nocodb/nocodb/commits?path=packages/nocodb/src/services/users/users.service.ts&per_page=10',
        'nocodb-user-model':'https://raw.githubusercontent.com/nocodb/nocodb/develop/packages/nocodb/src/models/User.ts',
        'nocodb-pinned-service':'https://raw.githubusercontent.com/nocodb/nocodb/9e57d237c8964ff74ae9ab1fb131d25a2a637a8e/packages/nocodb/src/services/users/users.service.ts',
        'nocodb-pinned-user':'https://raw.githubusercontent.com/nocodb/nocodb/9e57d237c8964ff74ae9ab1fb131d25a2a637a8e/packages/nocodb/src/models/User.ts',
        'zcode-research':'https://mcniyfj5bw9b.feishu.cn/docx/ZRTudN7cPoJUaZxv89ycn3rbnTG',
        'openssh-redhat-55653':'https://access.redhat.com/hydra/rest/securitydata/cve/CVE-2026-55653.json',
        'openssh-redhat-55655':'https://access.redhat.com/hydra/rest/securitydata/cve/CVE-2026-55655.json',
    }
    supplemental = OUT/'supplemental-sources.json'
    if supplemental.exists():
        sources.update(json.loads(supplemental.read_text()))
    result = {'cutoff':END+'Z','cutoff_jst':'2026-10-27T00:18:00+09:00','delta_start':START+'Z',
              'started_at':BASE.now(), 'note':'Retrieved after cutoff; sources are current revisions. Publication, modification, detection and retrieval are separate. No severity filter. Inclusive window boundary may overlap prior cutoff. API metadata does not prove original publication content. Deduplicated file paths are relative to this directory.'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        jobs={pool.submit(source,n,u):n for n,u in sources.items()}
        jobs[pool.submit(BASE.nvd,'published')]='nvd-published'
        jobs[pool.submit(BASE.nvd,'modified')]='nvd-modified'
        jobs[pool.submit(ghsa,'published')]='ghsa'
        jobs[pool.submit(ghsa,'modified')]='ghsa-modified'
        jobs[pool.submit(BASE.feeds)]='feeds'
        for job in concurrent.futures.as_completed(jobs):
            name=jobs[job]
            try: result[name]=job.result()
            except Exception as exc: result[name]={'error':str(exc)}
            BASE.save('collection-summary.json',result)
            print(name,json.dumps(result[name],ensure_ascii=False)[:250],flush=True)
    published=list_nvd(result['nvd-published']);modified=list_nvd(result['nvd-modified'])
    advisories=[]
    for page in result['ghsa'].get('pages',[]):advisories.extend(json.loads(decoded(OUT/page['file'])))
    advisory_updates=[]
    for page in result['ghsa-modified'].get('pages',[]):advisory_updates.extend(json.loads(decoded(OUT/page['file'])))
    advisories=list({x['ghsa_id']:x for x in advisories}.values())
    advisory_updates=list({x['ghsa_id']:x for x in advisory_updates}.values())
    previous_ids=set()
    for page in PREVIOUS.glob('nvd-published-*.json.gz'):
        previous_ids.update(x['cve']['id'] for x in json.loads(decoded(page))['vulnerabilities'])
    pub_ids={x['id'] for x in published};mod_ids={x['id'] for x in modified};ghsa_ids={x.get('cve_id') for x in advisories}
    result['counts']={'nvd_published':len(pub_ids),'nvd_modified':len(mod_ids),'published_modified_overlap':len(pub_ids&mod_ids),
                      'ghsa':len(advisories),'ghsa_unreviewed':sum(x.get('type')=='unreviewed' for x in advisories),
                      'ghsa_reviewed':sum(x.get('type')=='reviewed' for x in advisories),
                      'ghsa_malware':sum(x.get('type')=='malware' for x in advisories),
                      'ghsa_modified':len(advisory_updates),
                      'ghsa_published_modified_overlap':len({x['ghsa_id'] for x in advisories}&{x['ghsa_id'] for x in advisory_updates}),
                      'ghsa_current_published_overlap':len(ghsa_ids&pub_ids),'ghsa_previous_published_overlap':len(ghsa_ids&previous_ids)}
    kev=result.get('kev',{})
    if kev.get('status')=='ok':
        catalog=json.loads(decoded(OUT/kev['file']));previous_kev=PREVIOUS/previous_source('kev')['file'];old=json.loads(decoded(previous_kev))
        result['kev_comparison']={'catalog_version':catalog['catalogVersion'],'count':catalog['count'],
                                  'same_bytes':hashlib.sha256(decoded(OUT/kev['file'])).hexdigest()==hashlib.sha256(decoded(previous_kev)).hexdigest(),
                                  'added_ids':sorted({x['cveID'] for x in catalog['vulnerabilities']}-{x['cveID'] for x in old['vulnerabilities']})}
    BASE.save('nvd-index.json',{'cutoff':END+'Z','delta_start':START+'Z','published':published,'modified':modified,'ghsa':[{'id':x['ghsa_id'],'cve_id':x.get('cve_id'),'type':x.get('type'),'summary':x.get('summary'),'published_at':x.get('published_at'),'updated_at':x.get('updated_at'),'url':x['html_url'],'references':x.get('references',[])} for x in advisories]})
    BASE.save('ghsa-modified-index.json',{'cutoff':END+'Z','delta_start':START+'Z','advisories':advisory_updates})
    BASE.save('feed-index.json',feed_index(result.get('feeds',[])))
    result['verification']=verify_responses(result)
    result['finished_at']=BASE.now();BASE.save('collection-summary.json',result)
    print(json.dumps(result['counts']),flush=True)


if __name__=='__main__': main()
