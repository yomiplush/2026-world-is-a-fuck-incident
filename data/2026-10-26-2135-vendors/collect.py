#!/usr/bin/env python3
"""Read-only public-source snapshot; response bodies retain retrieval-time revisions."""
import concurrent.futures,datetime,gzip,hashlib,json,sys,urllib.request
from pathlib import Path
HERE=Path(__file__).resolve().parent
URLS=HERE/'sources.json'
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def collect(item):
 name,url=item;entry={'name':name,'url':url,'retrieved_at':now()}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'incident-research/1.0','Accept-Encoding':'identity'})
  with urllib.request.urlopen(req,timeout=40) as response:
   body=response.read();entry.update(status=response.status,final_url=response.url,headers=dict(response.headers))
   if response.headers.get('Content-Encoding')=='gzip':body=gzip.decompress(body)
   extension='.json' if 'json' in response.headers.get('Content-Type','') else '.html'
   filename=name+extension
   entry.update(sha256=hashlib.sha256(body).hexdigest(),bytes=len(body),sha256_is='decompressed HTTP response body bytes')
   if len(body)>250000:filename+='.gz';body=gzip.compress(body,mtime=0);entry['compression']='gzip'
   (HERE/filename).write_bytes(body);entry['file']=filename
 except Exception as exc:entry.update(status='error',error=str(exc))
 return name,entry
sources=json.loads(URLS.read_text())
if len(sys.argv)>1:sources={name:sources[name] for name in sys.argv[1:]}
summarypath=HERE/'collection-summary.json'
summary=json.loads(summarypath.read_text()) if summarypath.exists() else {'cutoff':'2026-10-26T12:35:00Z','cutoff_jst':'2026-10-26T21:35:00+09:00','delta_start':'2026-10-26T05:56:00Z','started_at':now(),'note':'Retrieved after cutoff. Preserved response bodies are retrieval-time revisions. Date-only same-day statements are reference-only unless separately timestamped.'}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
 for name,result in executor.map(collect,sources.items()):
  summary[name]=result;print(name,result['status'],result.get('bytes',0),flush=True)
summary['finished_at']=now();summarypath.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
