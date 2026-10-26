#!/usr/bin/env python3
"""Validate stored response bytes and summarize comparison with the prior snapshot."""
import datetime,difflib,gzip,hashlib,json
from pathlib import Path
from bs4 import BeautifulSoup
HERE=Path(__file__).resolve().parent
PREVIOUS=HERE.parent/'2026-10-26-1456-vendors'
summary=json.loads((HERE/'collection-summary.json').read_text())
old=json.loads((PREVIOUS/'collection-summary.json').read_text())
def decoded(root,item):
 b=(root/item['file']).read_bytes()
 return gzip.decompress(b) if item.get('compression') else b
def normalized_html(b):
 h=BeautifulSoup(b,'html.parser');h=h.find('main') or h.find('article') or h
 for e in h(['script','style','nav','header','footer']):e.decompose()
 return h.get_text('\n',strip=True).splitlines()
responses=[];diffs={};unchanged=[]
for name,item in summary.items():
 if not isinstance(item,dict) or 'url' not in item:continue
 responses.append(item)
 if 'file' not in item:continue
 b=decoded(HERE,item)
 assert hashlib.sha256(b).hexdigest()==item['sha256'],name
 assert len(b)==item['bytes'],name
 if name in old and 'file' in old[name] and not item['file'].endswith('.json'):
  a=normalized_html(decoded(PREVIOUS,old[name]));z=normalized_html(b)
  if a==z:unchanged.append(name)
  else:diffs[name]=list(difflib.unified_diff(a,z,fromfile='14:56 retrieval',tofile='21:35 retrieval',n=2))
(HERE/'normalized-text-diff.json').write_text(json.dumps(diffs,ensure_ascii=False,indent=2)+'\n')
rendered=HERE/'tailscale-vendor-web-rendered.json'
rendered_capture={'url':'https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/','capture_file':rendered.name,'capture_sha256':hashlib.sha256(rendered.read_bytes()).hexdigest(),'saved_at':datetime.datetime.fromtimestamp(rendered.stat().st_mtime,datetime.timezone.utc).isoformat(),'artifact_type':'browser-rendered-tool-response; not an HTTP body','note':'Reddit direct HTTP200 was an unreadable JavaScript challenge, JSON403. Browser tool rendering contains vendor text but not independently confirmed edit timestamps.'}
summary['tailscale-vendor-reddit']['content_note']='HTTP200 JavaScript challenge; saved body is not the readable vendor statement. See browser-rendered supplement.'
summary['rendered_source_captures']=[rendered_capture]
(HERE/'collection-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
analysis={'cutoff':summary['cutoff'],'delta_start':summary['delta_start'],'http_url_attempts':len(responses),'saved_http_responses':sum('file' in r for r in responses),'raw_response_hashes_verified':sum('file' in r for r in responses),'failed_attempts':[r for r in responses if 'file' not in r],'retrieval_started_at':summary['started_at'],'retrieval_finished_at':summary['finished_at'],'normalized_text_unchanged_from_1456':unchanged,'normalized_text_changed_from_1456':list(diffs),'diff_file':'normalized-text-diff.json','rendered_supplements':[rendered_capture],'timing_notes':{'blastmail':'explicit17:00 JST update;345contracts,345notifications','gmo_sixth':'explicit21:00 JST status','jpcert':'16:25 JST officialfeed; JVN18:00 JST','neat':'article:modified_time2026-10-26T09:10:22Z; summaryedit, not rollout completion','tavinos':'article:modified_time2026-10-26T06:37:47Z; reservation conditions, not intrusion start','icewarp':'API edited_at12:39:58Z,updated_at12:40:23Z AFTER12:35Z cutoff; reference only','kawanishi':'date-only publication/restoration;HTTP Last-Modified07:00:20Z is server resource metadata, not exact restoration/publication confirmation','php_rce_report':'observation10/24;firstcommit20:25:39Z10/24;lastlinkaddition02:28:31Z10/26, before previous cutoff','tailscale_21942':'merged03:08:59Z10/26,before previous cutoff;latestreleasev1.104.2published02:55:49Z10/21','huntress':'primarypublication13:00Z10/22;July14–September22observations','wiz':'primarypublication17:55:33Z10/25;September15–October24observations','ucreator':'primarypublication14:57:50Z10/21;technicalcapability analysis, no reliable victim count'}}
(HERE/'analysis.json').write_text(json.dumps(analysis,ensure_ascii=False,indent=2)+'\n')
print('Verified',analysis['raw_response_hashes_verified'],'HTTP response hashes and1rendered supplement;',len(unchanged),'prior normalized pages unchanged')
