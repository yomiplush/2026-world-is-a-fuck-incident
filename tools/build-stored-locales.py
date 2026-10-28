#!/usr/bin/env python3
"""Materialize validated stored motion, privacy and archived database translations."""
import importlib.util,json,re,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
articles=load('articles',ROOT/'tools/article_languages.py');manager=load('manager',ROOT/'tools/translations/manage.py')
catalog=json.loads((ROOT/'content/site-languages.json').read_text())['languages']
source=json.loads((articles.STORE/'source.json').read_text())
memories={r['code']:json.loads((articles.STORE/(r['code']+'.json')).read_text())['strings']for r in catalog if r['code']!='ja'}
motion=articles.motion_source()
privacy=json.loads((ROOT/'content/privacy-copy.json').read_text())
def translated(value,code,context=None):
 if isinstance(value,dict):return {k:translated(v,code,k) for k,v in value.items()}
 if isinstance(value,list):return [translated(v,code,context) for v in value]
 rendered=articles.render('<p>'+value+'</p>',memories[code],code)[3:-4]
 return rendered if context=='points' or re.search(r'<[a-zA-Z]',value) else html.unescape(rendered)
for row in catalog:
 code=row['code']
 if code in ('ja','en'):continue
 path=ROOT/'site/i18n'/(code+'.js')
 # Preserve authored existing translations; only add missing scene copy.
 import subprocess
 existing=json.loads(subprocess.check_output(['node','-e','const fs=require("fs"),vm=require("vm");vm.runInNewContext(fs.readFileSync(process.argv[1],"utf8"),{window:{registerLocale:(c,d)=>console.log(JSON.stringify(d))}})',str(path)],text=True))
 existing['ui'].update(translated(motion['ui'],code))
 for scene,copy in motion['scenes'].items():
  existing['scenes'][scene]=translated(copy,code)
 path.write_text('/* Stored translations; missing scenes filled by Google Cloud Translation. */\nwindow.registerLocale('+json.dumps(code)+','+json.dumps(existing,ensure_ascii=False,indent=2)+');\n')
# Consent remains synchronous, first party and available without another request.
allprivacy={'ja':privacy}
for code,values in memories.items():
 allprivacy[code]={k:values[articles.key(v)] for k,v in privacy.items()}
p=ROOT/'site/privacy.js';text=p.read_text()
start=min(i for i in (text.find('  const copies ='),text.find('  const japanese =')) if i>=0);end=text.index('  function get(',start)
text=text[:start]+'  const copies = '+json.dumps(allprivacy,ensure_ascii=False,separators=(',',':'))+';\n  const requested = new URLSearchParams(location.search).get("lang") || document.documentElement.lang || navigator.language || "en";\n  const code = requested.startsWith("zh") ? "zh" : requested.split("-")[0];\n  const japanese = code === "ja";\n  const copy = copies[code] || copies.en;\n'+text[end:]
p.write_text(text)
# Complete immutable historical packages from source-hashed memory.
for folder in sorted(manager.STORE.iterdir()):
 if not (folder/'source.json').exists():continue
 s=json.loads((folder/'source.json').read_text())
 for row in catalog:
  code=row['code'];p=folder/(code+'.json');old=json.loads(p.read_text()) if p.exists() else {}
  values=s['strings'] if code=='ja' else {k:memories[code].get(articles.key(v),v if not re.search('[\u3040-\u30ff\u3400-\u9fff]',v)else None) for k,v in s['strings'].items()}
  if code!='ja':
   # Preserve existing validated translations in the same snapshot.
   for k,v in old.get('strings',{}).items():
    if k in s['strings'] and manager.valid_string(s['strings'][k],v):values[k]=v
  manager.validate(s,values,code) if code!='ja' else None
  package={**old,'locale':code,'language':row,'snapshot':s['snapshot'],'source_hash':s['source_hash'],'register_hash':s['register_hash'],'string_hashes':s.get('string_hashes',{}),'status':'source' if code=='ja' else 'translated','strings':values,'database':manager.materialize(s,values)}
  if not old or old.get('status')not in ('translated','source'):package['provenance']={'engine':'Stored translation memory; Google Cloud Translation v2 for missing text','human_reviewed':False}
  manager.dump(p,package)
  manager.dump(ROOT/'site/data/translations'/folder.name/(code+'.json'),package)
 manifest=manager.manifest(s,{r['code']:r for r in catalog})
 manager.dump(ROOT/'site/data/translations'/folder.name/'manifest.json',manifest)
print('Materialized motion, consent, and historical database locales')
