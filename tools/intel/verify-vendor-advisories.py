#!/usr/bin/env python3
"""Fetch the twelve vendor advisories referenced by this fixed-cutoff review."""
import concurrent.futures,datetime as dt,gzip,hashlib,json,urllib.request
from pathlib import Path
p=Path(__file__).resolve().parents[2]/'data/2026-10-25-2318'
p.mkdir(parents=True,exist_ok=True)
ids=['GHSA-xf36-wx48-5rqp','GHSA-wx48-r3qh-jvh5','GHSA-rq3w-5c6f-p7wr','GHSA-qmg9-m772-5rm7','GHSA-ccp2-6q93-hggh','GHSA-44pm-2q5p-fm63','GHSA-xqmq-v4wj-rw5m','GHSA-vfp2-c8pq-v6h6','GHSA-4m6g-h9mv-wqjc','GHSA-rhcx-5729-88vg','GHSA-mm38-5g96-7j6x','GHSA-rwfw-xvg3-3937']
def fetch(id):
 repo = 'grokability/snipe-it' if id in ids[:2] else 'parse-community/parse-server' if id in ids[2:4] else 'YesWiki/yeswiki' if id==ids[4] else 'rclone/rclone' if id in ids[5:7] else 'vllm-project/vllm'
 url='https://api.github.com/repos/'+repo+'/security-advisories/'+id
 meta={'url':url,'retrieved_at':dt.datetime.now(dt.timezone.utc).isoformat()}
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'incident-review/1.0'}),timeout=35) as r:raw=r.read()
  d=json.loads(raw);f=id+'.json';(p/f).write_bytes(raw)
  meta.update(file=f,sha256=hashlib.sha256(raw).hexdigest(),status='ok',published_at=d.get('published_at'),updated_at=d.get('updated_at'))
  print(id,d.get('published_at'),d.get('summary'),json.dumps(d.get('vulnerabilities'),ensure_ascii=False),flush=True)
 except Exception as e:meta.update(error=str(e),status='error');print(id,meta,flush=True)
 return meta
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,ids))
(p/'primary-vendor-advisories.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
