#!/usr/bin/env python3
"""Remove generated public artifacts for languages absent from the site catalog.
Historical translation stores outside site/ remain untouched. No network requests.
"""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];SITE=ROOT/'site'
active={r['code']for r in json.loads((ROOT/'content/site-languages.json').read_text())['languages']}
removed=[]
for path in SITE.rglob('*'):
 if not path.is_file():continue
 code=None
 if path.suffix=='.html':
  match=re.search(r'\.([a-z]{2})\.html$',path.name)
  if match:code=match[1]
 elif path.parent==SITE/'i18n' and path.suffix=='.js':code=path.stem
 elif path.parent==SITE/'assets':
  match=re.match(r'locale-([a-z]{2})-[a-f0-9]{12}\.js$',path.name)
  if match:code=match[1]
 elif path.suffix=='.json':
  if SITE/'data/translations' in path.parents and re.fullmatch('[a-z]{2}',path.stem):code=path.stem
  match=re.fullmatch(r'impact\.([a-z]{2})',path.stem)
  if match:code=match[1]
 if code and code not in active:path.unlink();removed.append(str(path.relative_to(SITE)))
 # Retained historical public manifests must agree with the current catalog.
 if path.name=='manifest.json' and SITE/'data/translations' in path.parents:
  data=json.loads(path.read_text());languages=data.get('languages')
  if isinstance(languages,dict):data['languages']={k:v for k,v in languages.items()if k in active};rows=data['languages'].values()
  elif isinstance(languages,list):data['languages']=[r for r in languages if r['code']in active];rows=data['languages']
  else:continue
  data['target_count']=len(data['languages']);data['ready_count']=sum(r.get('status')in ('source','translated')for r in rows)
  path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Removed retired public locale artifacts:',len(removed))
