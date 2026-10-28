#!/usr/bin/env python3
"""Fill missing stored reading-page translations with Google Cloud Translation v2.
Uses existing ADC; never stores credentials in the repository. Reruns reuse validated text.
"""
import argparse,concurrent.futures,datetime,html,importlib.util,json,os,re,threading,time,urllib.request,urllib.parse,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
articles=load('articles',ROOT/'tools/article_languages.py')
manager=load('manager',ROOT/'tools/translations/manage.py')
TECH=re.compile(r'Civilization V|\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?|\d{1,2}/\d{1,2}|'+manager.TECH.pattern)
def protect(text):
 tokens=[]
 def replace(m):
  tokens.append(m[0]);return '__KEEP_'+str(len(tokens)-1).zfill(3)+'__'
 return TECH.sub(replace,text),tokens
class Google:
 def __init__(self,project):self.project=project;self.token=None;self.expiry=0;self.lock=threading.Lock();self.characters=0;self.request_lock=threading.Lock();self.next_request=0
 def headers(self):
  with self.lock:
   if time.time()>self.expiry:
    path=Path(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS',str(Path.home()/'.config/gcloud/application_default_credentials.json')))
    a=json.loads(path.read_text())
    if a.get('type')!='authorized_user':raise ValueError('This runner requires authorized_user ADC')
    body=urllib.parse.urlencode({k:a[k] for k in ('client_id','client_secret','refresh_token')}|{'grant_type':'refresh_token'}).encode()
    t=json.load(urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token',data=body),timeout=60))
    self.token=t['access_token'];self.expiry=time.time()+t.get('expires_in',3600)-120
   return {'Authorization':'Bearer '+self.token,'x-goog-user-project':self.project,'Content-Type':'application/json'}
 def translate(self,texts,code,source_language="ja"):
  payload=json.dumps({'q':texts,'source':source_language,'target':{'zh':'zh-CN','pt':'pt'}.get(code,code),'format':'html'}).encode()
  for attempt in range(12):
   try:
    with self.request_lock:
     delay=max(0,self.next_request-time.time())
     if delay:time.sleep(delay)
     self.next_request=time.time()+1.2
    r=urllib.request.Request('https://translation.googleapis.com/language/translate/v2',data=payload,headers=self.headers())
    result=json.load(urllib.request.urlopen(r,timeout=120))['data']['translations']
    if len(result)!=len(texts):raise ValueError('Wrong response count')
    with self.lock:self.characters+=sum(map(len,texts))
    return [x['translatedText'] for x in result]
   except urllib.error.HTTPError as e:
    detail=e.read().decode()
    if not (e.code in (429,500,502,503,504) or (e.code==403 and 'Rate Limit' in detail)) or attempt==11:raise RuntimeError(f'Translation HTTP {e.code}: {detail[:1200]}') from None
    print('Rate limit; retrying',code,attempt+1,flush=True);time.sleep(min(50,10*(attempt+1)))
 def fill(self,row,source):
  code=row['code'];store=articles.STORE/(code+'.json')
  package=json.loads(store.read_text()) if store.exists() else {};values=package.get('strings',{})
  # Reuse existing source-hashed memories from research and impact translations.
  memory={}
  for p in [ROOT/'data/translations/memory'/(code+'.json')]:
   if p.exists():memory.update(json.loads(p.read_text()))
  for p in (ROOT/'data/impact-translations').glob('*/'+code+'.json'):
   package_source=p.with_name('source.json')
   if package_source.exists():
    ss=json.loads(package_source.read_text());pv=json.loads(p.read_text()).get('strings',{})
    memory.update({articles.key(v):pv[k] for k,v in ss['strings'].items() if k in pv})
  for k,v in source['strings'].items():
   if not articles.valid(v,values.get(k),code) and articles.valid(v,memory.get(k)):values[k]=memory[k]
  missing=[k for k,v in source['strings'].items() if not articles.valid(v,values.get(k),code)]
  print(code,'missing',len(missing),flush=True)
  provenance=package.get('provenance',[])
  if isinstance(provenance,dict):provenance=[provenance]
  def save():
   result={'locale':code,'source_hash':source['source_hash'],'strings':values,'note':'Machine translation; not reviewed by a native speaker.','provenance':provenance}
   manager.dump(store,result)
  english=json.loads((articles.STORE/'en.json').read_text()).get('strings',{}) if code!='en' else {}
  failures=[];input_languages={}
  for offset in range(0,len(missing),80):
   keys=missing[offset:offset+80]
   language='en' if code!='en' and all(articles.valid(source['strings'][k],english.get(k),'en')for k in keys) else 'ja'
   inputs=[english[k] if language=='en' else source['strings'][k] for k in keys]
   protected=[protect(v) for v in inputs]
   texts=[re.sub(r'(__KEEP_\d+__)',r'<span translate="no">\1</span>',html.escape(p,quote=False)) for p,tokens in protected]
   output=self.translate(texts,code,language)
   input_languages[language]=input_languages.get(language,0)+len(keys)
   for k,translated,(p,tokens) in zip(keys,output,protected):
    try:
     text=html.unescape(re.sub('<[^>]+>','',translated));text=manager.restore(text,tokens)
     if not articles.valid(source['strings'][k],text,code):raise ValueError('changed number or source copy')
     values[k]=text
    except ValueError as exc:failures.append({'key':k,'source':source['strings'][k],'output':translated,'reason':str(exc)})
   save();print(code,min(offset+80,len(missing)),'/',len(missing),'rejected',len(failures),flush=True)
  provenance.append({'engine':'Google Cloud Translation v2','generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'original_source_language':'ja','api_source_languages':input_languages,'target_language':code,'new_strings':len(missing)-len(failures),'human_reviewed':False})
  save()
  if failures:manager.dump(articles.STORE/('rejected-'+code+'.json'),failures)
  else:(articles.STORE/('rejected-'+code+'.json')).unlink(missing_ok=True)
  return code,len(missing),len(failures)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--project',required=True);parser.add_argument('--locales');parser.add_argument('--workers',type=int,default=3);args=parser.parse_args()
 source=json.loads((articles.STORE/'source.json').read_text());rows=json.loads((ROOT/'content/site-languages.json').read_text())['languages']
 selected=args.locales.split(',') if args.locales else [r['code'] for r in rows if r['code']!='ja']
 api=Google(args.project)
 with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
  jobs=[pool.submit(api.fill,r,source) for r in rows if r['code'] in selected]
  results=[j.result() for j in jobs]
 print('Results',results,'API input characters',api.characters)
 if any(r[2] for r in results):raise SystemExit(1)
if __name__=='__main__':main()
