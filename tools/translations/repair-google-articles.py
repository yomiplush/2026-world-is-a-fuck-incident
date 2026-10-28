#!/usr/bin/env python3
"""Retry rejected text with literal protected terms instead of opaque placeholders."""
import html,importlib.util,json,re,sys
from pathlib import Path
spec=importlib.util.spec_from_file_location('google_articles',Path(__file__).with_name('google-articles.py'));g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
def protect(text):
 parts=[];end=0
 for m in g.TECH.finditer(text):
  parts.extend([html.escape(text[end:m.start()]),'<span class="notranslate" translate="no">'+html.escape(m[0])+'</span>']);end=m.end()
 parts.append(html.escape(text[end:]));return ''.join(parts)
def normalize(output,code):
 # Spell Japanese word-based ordinals as Korean words, keeping the original ASCII digit inventory.
 if code=='ko':
  parts=re.split(r'(<span\b[^>]*>.*?</span>)',output,flags=re.S)
  for i in range(0,len(parts),2):
   for before,after in [('1차','일차'),('2차','이차'),('2단계','두 단계'),('2단','두 단계'),('제3자','제삼자')]:parts[i]=parts[i].replace(before,after)
  output=''.join(parts)
 return html.unescape(re.sub('<[^>]+>','',output))
def main():
 api=g.Google(sys.argv[1]);source=json.loads((g.articles.STORE/'source.json').read_text())
 for row in json.loads((g.ROOT/'content/site-languages.json').read_text())['languages']:
  code=row['code']
  if code=='ja':continue
  path=g.articles.STORE/(code+'.json');package=json.loads(path.read_text());values=package['strings']
  missing=[k for k,v in source['strings'].items() if not g.articles.valid(v,values.get(k),code)]
  failures=[]
  for offset in range(0,len(missing),40):
   keys=missing[offset:offset+40];outputs=api.translate([protect(source['strings'][k])for k in keys],code)
   for key,output in zip(keys,outputs):
    text=normalize(output,code)
    if g.articles.valid(source['strings'][key],text,code):values[key]=text
    else:failures.append({'key':key,'source':source['strings'][key],'output':output})
  package['source_hash']=source['source_hash']
  if missing:package.setdefault('provenance',[]).append({'engine':'Google Cloud Translation v2','source_language':'ja','repair':'Literal technical spans; Korean ordinals written as words','new_strings':len(missing)-len(failures),'human_reviewed':False})
  g.manager.dump(path,package)
  reject=g.articles.STORE/('rejected-'+code+'.json')
  if failures:g.manager.dump(reject,failures)
  else:reject.unlink(missing_ok=True)
  print(code,'repaired',len(missing)-len(failures),'remaining',len(failures),flush=True)
if __name__=='__main__':main()
