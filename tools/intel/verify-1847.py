#!/usr/bin/env python3
"""Verify saved response hashes, fixed-window indexes and editorial counts offline."""
import gzip, hashlib, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'data/2026-10-27-1847'
sha=lambda raw:hashlib.sha256(raw).hexdigest()
summary=json.loads((OUT/'collection-summary.json').read_text())
verified=0

def visit(value):
 global verified
 if isinstance(value,dict):
  if 'file' in value and 'sha256' in value:
   path=OUT/value['file'];raw=path.read_bytes()
   if path.suffix=='.gz':raw=gzip.decompress(raw)
   assert sha(raw)==value['sha256'],path
   verified+=1
  for child in value.values():visit(child)
 elif isinstance(value,list):
  for child in value:visit(child)
visit(summary)
assert verified==summary['verification']['raw_response_hashes_verified']
for row in json.loads((OUT/'supplemental/collection-summary.json').read_text())['sources']:
 if row['status']!='ok':continue
 p=OUT/'supplemental'/row['file'];raw=p.read_bytes()
 if p.suffix=='.gz':raw=gzip.decompress(raw)
 assert sha(raw)==row['sha256'],p
 verified+=1
for row in json.loads((ROOT/'data/2026-10-27-1847-vendors/collection-summary.json').read_text()):
 assert sha((ROOT/row['path']).read_bytes())==row['sha256'],row['path']
 verified+=1
for row in json.loads((ROOT/'data/2026-10-27-1847-discovery/collection-summary.json').read_text()):
 if 'sha256' not in row:continue
 p=ROOT/'data/2026-10-27-1847-discovery'/row['file'];raw=p.read_bytes()
 assert sha(raw)==row['sha256'],p
 decoded=gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw
 assert sha(decoded)==row['decoded_sha256'],p
 verified+=1
idx=json.loads((OUT/'nvd-index.json').read_text())
record=json.loads((OUT/'incident-register.json').read_text())
assert record['cutoff']=='2026-10-27T09:47:00Z'
assert record['counts']['verified_response_records']==verified
assert record['counts']['record_topic_groups']==len(record['records'])
assert len(set(r['id'] for r in record['records']))==len(record['records'])
for mode in ['published','modified']:
 assert summary['nvd-'+mode]['complete']
 assert len({r['id'] for r in idx[mode]})==summary['counts']['nvd_'+mode]
for key in ['ghsa','ghsa-modified']:assert summary[key]['complete']
assert len({r['id'] for r in idx['published']}&{r['id'] for r in idx['modified']})==record['counts']['published_modified_overlap']
assert sum(r['status']=='Rejected' for r in idx['published'])==record['counts']['nvd_rejected_records']
result={'verified_response_records':verified,'deduplicated_previous_references':summary['verification']['deduplicated_references_verified'],'cutoff':record['cutoff'],'topic_groups':len(record['records']),'verified_at_note':'Offline verification; acquisition timestamps remain in original manifests.'}
(OUT/'verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
