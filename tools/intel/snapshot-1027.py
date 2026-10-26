#!/usr/bin/env python3
"""Reproduce the fixed 2026-10-26 10:27 JST delta; save errors, provenance and raw responses.
Run from any directory. No credentials required. API content is the retrieval-time revision.
"""
import concurrent.futures, datetime as dt, gzip, hashlib, importlib.machinery, json
from pathlib import Path
import time, urllib.parse, urllib.request
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data/2026-10-26-1027'
START, END = '2026-10-25T14:18:00', '2026-10-26T01:27:00'
UA = 'incident-research/1.0 (+https://github.com/yomiplush/2026-world-is-a-fuck-incident)'

def now(): return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
def request(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'}), timeout=55) as r:
        return r.read(), dict(r.headers)
def save(name, data):
    raw = data if isinstance(data, bytes) else (json.dumps(data, ensure_ascii=False, indent=2)+'\n').encode()
    (OUT/name).write_bytes(raw)
    return hashlib.sha256(raw).hexdigest()

def source(name, url):
    item = {'name': name, 'url': url, 'retrieved_at': now()}
    try:
        raw, headers = request(url)
        filename = name + ('.json' if name in ('kev','reddit-response') else '.html')
        digest=hashlib.sha256(raw).hexdigest()
        if len(raw)>100000:
            filename += '.gz';save(filename,gzip.compress(raw,mtime=0))
            item.update(compression='gzip',sha256_is='decompressed bytes')
        else: save(filename,raw)
        item.update(file=filename, sha256=digest, bytes=len(raw), status='ok', last_modified=headers.get('Last-Modified'))
    except Exception as e: item.update(status='error', error=str(e))
    return item

def nvd(mode):
    key = 'pub' if mode=='published' else 'lastMod'
    rows, pages, index, total = [], [], 0, None
    while total is None or index < total:
        url = 'https://services.nvd.nist.gov/rest/json/cves/2.0?' + urllib.parse.urlencode({key+'StartDate':START+'.000',key+'EndDate':END+'.000','resultsPerPage':2000,'startIndex':index})
        stamp=now()
        try:
            raw,_=request(url); d=json.loads(raw)
            total=d['totalResults']; batch=d.get('vulnerabilities',[])
            file=f'nvd-{mode}-{index}.json.gz'
            save(file,gzip.compress(raw,mtime=0))
            pages.append({'url':url,'retrieved_at':stamp,'file':file,'totalResults':total,'returned':len(batch),'sha256':hashlib.sha256(raw).hexdigest()})
            rows.extend(batch)
            if not batch and index<total: raise ValueError('empty page before totalResults')
            index+=len(batch)
            if index<total: time.sleep(7)
        except Exception as e:
            return {'mode':mode,'complete':False,'totalResults':total,'returned':len(rows),'pages':pages,'error':str(e)}
    return {'mode':mode,'complete':True,'totalResults':total,'returned':len(rows),'pages':pages}

def ghsa():
    rows, pages, page = {}, [], 1
    while True:
        url='https://api.github.com/advisories?'+urllib.parse.urlencode({'per_page':100,'page':page,'sort':'published','direction':'desc','published':START+'Z..'+END+'Z'})
        try:
            raw,headers=request(url); batch=json.loads(raw)
            if not isinstance(batch,list): raise ValueError('expected advisory list')
            file=f'ghsa-{page}.json';save(file,raw)
            pages.append({'url':url,'retrieved_at':now(),'file':file,'returned':len(batch),'sha256':hashlib.sha256(raw).hexdigest()})
            for r in batch: rows[r['ghsa_id']]=r
            if 'rel="next"' not in headers.get('Link',''): break
            page+=1
        except Exception as e:return {'complete':False,'returned':len(rows),'pages':pages,'error':str(e)}
    return {'complete':True,'returned':len(rows),'pages':pages}

def feeds():
    m=importlib.machinery.SourceFileLoader('intel',str(ROOT/'tools/intel/fetch-intel')).load_module()
    jobs={**m.FEEDS,**m.NEWS_FEEDS,'jvn':'https://jvn.jp/rss/jvn.rdf','ipa':'https://www.ipa.go.jp/security/alert/index.html'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results=list(pool.map(lambda p:source('feed-'+p[0],p[1]),jobs.items()))
    return results

if __name__=='__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    sources={
      'dotnet-oob':'https://api.github.com/repos/dotnet/announcements/issues/493',
      'starman-changes':'https://metacpan.org/release/MIYAGAWA/Starman-0.4019/changes',
      'plack-changes':'https://metacpan.org/release/MIYAGAWA/Plack-1.0056/changes',
      'oss-starman':'https://seclists.org/oss-sec/2026/q4/388',
      'oss-psgi':'https://seclists.org/oss-sec/2026/q4/387',
      'oss-php-backport':'https://seclists.org/oss-sec/2026/q4/386',
      'snipe-vendor':'https://api.github.com/repos/grokability/snipe-it/security-advisories/GHSA-xf36-wx48-5rqp',
      'parse-vendor':'https://api.github.com/repos/parse-community/parse-server/security-advisories/GHSA-rq3w-5c6f-p7wr',
      'unit42-php':'https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/',
      'php-news':'https://www.php.net/archive/2026.php',
      'php-releases':'https://www.php.net/releases/index.php?json',
      'tailworm':'https://tailworm.com/',
      'firecrawl-issue':'https://github.com/firecrawl/firecrawl/issues/5256',
      'dokploy-pr':'https://github.com/Dokploy/dokploy/pull/5752',
      'paisa-release':'https://github.com/ananthakumaran/paisa/releases/tag/v0.7.8',
      'rotki-pr':'https://github.com/rotki/rotki/pull/13401',
      'ipa-fallback':'https://www.ipa.go.jp/security/security-alert/',
      'tailscale-bulletins':'https://tailscale.com/security-bulletins',
      'tailscale-changelog':'https://tailscale.com/changelog',
      'tailscale-ssh-docs':'https://tailscale.com/docs/features/tailscale-ssh',
      'connectwise':'https://www.connectwise.com/company/trust/advisories',
      'fortinet':'https://www.fortinet.com/blog/ciso-collective/fortinet-releases-security-hardening-release-for-multiple-products',
      'kev':'https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json',
      'reddit-response':'https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/.json?raw_json=1',
    }
    summary={'cutoff':'2026-10-26T01:27:00Z','delta_start':'2026-10-25T14:18:00Z','started_at':now(),'note':'Responses are retrieved after cutoff. Pages without precise publication time cannot establish cutoff availability. No severity filter. Published and modified overlap; do not sum.'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        futures={pool.submit(source,n,u):n for n,u in sources.items()}
        futures[pool.submit(nvd,'published')]='nvd-published'
        futures[pool.submit(nvd,'modified')]='nvd-modified'
        futures[pool.submit(ghsa)]='ghsa'
        futures[pool.submit(feeds)]='feeds'
        for f in concurrent.futures.as_completed(futures):
            name=futures[f]
            try: summary[name]=f.result()
            except Exception as e: summary[name]={'error':str(e)}
            save('collection-summary.json',summary)
            print(name, json.dumps(summary[name],ensure_ascii=False)[:350], flush=True)
    summary['finished_at']=now();save('collection-summary.json',summary)
