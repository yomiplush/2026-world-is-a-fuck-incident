#!/usr/bin/env python3
"""Source-hashed Codex translation memory and immutable snapshot packages.
No Google translation service/API. Never fills missing translations with another language.
"""
import copy,argparse,concurrent.futures,datetime,hashlib,json,os,re,shutil,subprocess,sys,tempfile,threading,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
STORE=ROOT/'data/translations'
MEMORY=STORE/'memory'
PROMPT_VERSION='incident-translation-v1'
TECH=re.compile(r'https?://[^\s<>"） 、。]+|CVE-\d{4}-\d+|GHSA-[a-z0-9]{4}(?:-[a-z0-9]{4}){2}|[A-Za-z_][A-Za-z0-9_.]*=[A-Za-z0-9_.-]+|v?\d+(?:\.\d+)+(?:-[A-Za-z0-9.]+)?|\d{1,2}:\d{2}(?::\d{2})?|\d+')
UI={'title':'インシデント・脆弱性の調査データ','intro':'公開一次資料に基づく調査記録です。条件と留保を確認し、公式案内へ戻れる形で整理しています。','cutoff':'調査の基準時刻','actions':'確認すること','sources':'一次資料・出典','delta':'今回確認した登録・勧告の更新','scope-complement':'既存事案の対策と条件の補足','reference-only':'公開時刻などが未確定の参考情報','notice':'CodexによるAI翻訳です。母語話者による校閲は行われていません。製品名、版、設定と対策は原文・公式案内と照合してください。','original':'日本語の原文','data':'翻訳データをJSONで取得','home':'モーションへ','languages':'言語を選ぶ','evidence':'取得原本と調査方法','counts':'ここで扱う論点の数は、新たな被害事件の件数ではありません。','pending':'翻訳データを準備しています。'}
def dump(path,obj):
 path.parent.mkdir(parents=True,exist_ok=True);tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n');tmp.replace(path)
def sha(value):return hashlib.sha256(value.encode()).hexdigest()
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def prepare():
 latest=json.loads((ROOT/'data/latest.json').read_text());path=ROOT/'data'/latest['incident_register'];record=json.loads(path.read_text());snapshot=path.parent.name
 strings={}
 for row in record['records']:
  for field in ('title','body','action','time'):strings['records.'+row['id']+'.'+field]=row[field]
 for index,value in enumerate(record.get('caveats',[])):strings['caveats.'+str(index)]=value
 for key in ('title','headline','intro'):
  if record.get('report',{}).get(key):strings['report.'+key]=record['report'][key]
 for index,row in enumerate(record.get('report',{}).get('quick',[])):
  for key in ('title','text','label'):strings[f'quick.{index}.{key}']=row[key]
 strings.update({'ui.'+k:v for k,v in UI.items()})
 source={'snapshot':snapshot,'cutoff':record['cutoff'],'cutoff_jst':record['cutoff_jst'],'register':latest['incident_register'],'register_hash':sha(path.read_text()),'source_locale':'ja','source_hash':sha(json.dumps(strings,ensure_ascii=False,sort_keys=True)),'strings':strings,'string_hashes':{k:sha(v) for k,v in strings.items()},'prompt_version':PROMPT_VERSION}
 dump(STORE/snapshot/'source.json',source)
 catalog=json.loads((ROOT/'content/site-languages.json').read_text());targets={r['code']:r for r in catalog['languages']}
 ja={'locale':'ja','language':targets['ja'],'source_hash':source['source_hash'],'register_hash':source['register_hash'],'snapshot':snapshot,'status':'source','strings':strings,'string_hashes':source['string_hashes'],'provenance':{'engine':'original','note':'Japanese authored source; no translation required.'}}
 ja['database']=materialize(source,strings)
 dump(STORE/snapshot/'ja.json',ja)
 return source,targets
def materialize(source,values):
 raw=(ROOT/'data'/source['register']).read_text()
 if sha(raw)!=source['register_hash']:raise ValueError('Source register changed during translation; rerun against the corrected source')
 record=copy.deepcopy(json.loads(raw))
 for row in record['records']:
  for field in source.get('record_fields',('title','body','action','time')):row[field]=values['records.'+row['id']+'.'+field]
 record['caveats']=[values['caveats.'+str(i)] for i in range(len(record.get('caveats',[])))]
 for key in ('title','headline','intro'):
  if 'report.'+key in values:record['report'][key]=values['report.'+key]
 for i,row in enumerate(record.get('report',{}).get('quick',[])):
  for key in ('title','text','label'):row[key]=values[f'quick.{i}.{key}']
 return record

def protect(text):
 tokens=[]
 def replace(match):tokens.append(match[0]);return '__KEEP_'+str(len(tokens)-1).zfill(3)+'__'
 return TECH.sub(replace,text),tokens
def restore(text,tokens):
 expected=['__KEEP_'+str(i).zfill(3)+'__' for i in range(len(tokens))]
 actual=re.findall(r'__KEEP_\d+__',text)
 if sorted(actual)!=sorted(expected):raise ValueError('Protected identifiers/numbers changed or omitted')
 for key,value in zip(expected,tokens):text=text.replace(key,value)
 return text

def valid_string(original,text):
 if not isinstance(text,str) or not text.strip():return False
 if sorted(re.findall(r'\d+(?:\.\d+)*',original))!=sorted(re.findall(r'\d+(?:\.\d+)*',text)):return False
 for pattern in (r'CVE-\d{4}-\d+',r'GHSA-[a-z0-9]{4}(?:-[a-z0-9]{4}){2}'):
  if sorted(re.findall(pattern,original))!=sorted(re.findall(pattern,text)):return False
 return True

def validate(source,values,locale):
 if set(values)!=set(source['strings']):raise ValueError('Incomplete translation keys')
 for key,text in values.items():
  if not valid_string(source['strings'][key],text):raise ValueError('Empty translation or modified number/identifier: '+key)
 if locale!='ja' and all(source['strings'][k]==v for k,v in values.items()):raise ValueError('Untranslated source copy')
 long=[k for k,v in source['strings'].items() if len(v)>20]
 if locale!='ja' and long and sum(values[k]==source['strings'][k] for k in long)/len(long)>.2:raise ValueError('Too much untranslated source retained')
 en=STORE/source.get('snapshot','')/'en.json'
 if locale not in ('en','ja') and en.is_file():
  english=json.loads(en.read_text()).get('strings',{})
  if long and sum(values[k]==english.get(k) for k in long)/len(long)>.8:raise ValueError('English output copied into another target')

def is_current(source,package):
 return package.get('source_hash')==source['source_hash'] and package.get('register_hash')==source['register_hash']

def codex_command():
 binary=shutil.which('codex')
 if binary:return[binary]
 root=os.environ.get('CODEX_MANAGED_PACKAGE_ROOT')
 if root and (Path(root)/'bin/codex.js').exists():return['node',str(Path(root)/'bin/codex.js')]
 raise RuntimeError('Codex CLI not found. Install the official CLI or set PATH.')
SCHEMA={'type':'object','properties':{'supported':{'type':'boolean'},'language_name':{'type':'string'},'strings':{'type':'array','items':{'type':'string'}},'notes':{'type':'string'}},'required':['supported','language_name','strings','notes'],'additionalProperties':False}

def translate(source,target,run_root,stop):
 code=target['code'];folder=STORE/source['snapshot'];output=folder/(code+'.json')
 if code=='ja':return{'locale':code,'status':'source'}
 if output.exists():
  existing=json.loads(output.read_text())
  if is_current(source,existing) and existing.get('status')=='translated':
   try:
    validate(source,existing['strings'],code);return{'locale':code,'status':'cached'}
   except ValueError:pass
 if stop.is_set():return{'locale':code,'status':'pending'}
 memory_path=MEMORY/(code+'.json');memory=json.loads(memory_path.read_text()) if memory_path.exists() else {}
 values={key:memory[value] for key,value in source['string_hashes'].items() if value in memory and valid_string(source['strings'][key],memory[value])}
 keys=[k for k in source['strings'] if k not in values]
 usage={};native=target['en']
 if keys:
  protected=[protect(source['strings'][key]) for key in keys]
  language_info=json.dumps(target,ensure_ascii=False)
  prompt=f'''Translate a public cybersecurity incident database from Japanese into the exact target language/dialect/script described here: {language_info}.
Return JSON only, no tools, no browsing, no files except the requested final output. Translate each input string in order into natural, calm, respectful prose. This is stored data, not a summary. Preserve every condition, caveat and distinction between occurrence, publication, retrieval, patch availability and actual deployment/restoration. Do not invent facts. The target code is a catalog identifier, including legacy aliases and script variants. Use the target language, not English or a neighbouring language. Technical names stay recognizable. Keep all ASCII decimal digits unchanged; do not spell numbers out as words. Every __KEEP_NNN__ token is an immutable identifier/number/URL: include each exactly once in its corresponding string; do not translate the token. Do not add markdown fences. Never introduce ASCII digits for words that were spelled out in Japanese: translate terms such as 一次資料 as primary sources using words, not numeric ordinals. For 万 or 億, preserve the protected coefficient and express the ten-thousand or hundred-million unit in target-language words; do not convert it into a different coefficient or add numeric zeros. Preserve commas and other separators between adjacent numeric placeholders exactly; do not apply locale-specific grouping such as changing 1,760 to 1.760 or adding spaces. Keep dates slash-separated or use words between protected numeric tokens; never join separate date numbers with decimal periods.
Return supported=true only if you can translate this language faithfully. If you cannot, return supported=false, strings=[] and explain in notes; never fill it with English or Japanese. language_name is this language's own name. strings must contain exactly {len(keys)} strings, matching the order of this input array:
'''+json.dumps([x[0] for x in protected],ensure_ascii=False)
  work=run_root/code;work.mkdir(parents=True,exist_ok=True);schema=work/'schema.json';result=work/'result.json';log=work/'run.jsonl';schema.write_text(json.dumps(SCHEMA))
  command=codex_command()+['exec','--ignore-user-config','--ephemeral','--skip-git-repo-check','--sandbox','read-only','--json','--output-schema',str(schema),'--output-last-message',str(result),'-']
  for attempt in range(3):
   result.unlink(missing_ok=True)
   with log.open('w') as handle:run=subprocess.run(command,input=prompt,text=True,stdout=handle,stderr=subprocess.STDOUT,cwd=ROOT,timeout=1800)
   if run.returncode and '429' in log.read_text() and attempt<2:
    time.sleep(30*(attempt+1));continue
   break
  lines=log.read_text().splitlines();errors=[]
  for line in lines:
   try:
    event=json.loads(line)
    if event.get('type')=='turn.completed':usage=event.get('usage',{})
    if event.get('type')in ('error','turn.failed'):errors.append(str(event.get('message') or event.get('error') or event)[:600])
   except json.JSONDecodeError:pass
  if run.returncode or not result.exists():
   reason=' | '.join(errors)[-1200:] or 'Codex returned no result'
   if any(word in reason.lower() for word in ['usage limit','quota','rate_limit','insufficient_quota','429']):stop.set()
   return{'locale':code,'status':'failed','reason':reason,'usage':usage}
  response=json.loads(result.read_text())
  if not response['supported']:return{'locale':code,'status':'unsupported','reason':response['notes'],'usage':usage}
  if len(response['strings'])!=len(keys):raise ValueError(code+': wrong translated string count')
  native=response['language_name']
  invalid=[]
  for key,text,(_,tokens) in zip(keys,response['strings'],protected):
   try:
    value=restore(text,tokens)
    if not valid_string(source['strings'][key],value):raise ValueError('Modified number/identifier')
    values[key]=value
   except ValueError as exc:invalid.append(key+': '+str(exc))
  if invalid:
   # Keep verified strings for a focused repair, without publishing an incomplete package.
   subset=dict(source,strings={key:source['strings'][key] for key in values})
   validate(subset,values,code)
   for key,value in values.items():memory[source['string_hashes'][key]]=value
   dump(memory_path,memory)
   raise ValueError('Incomplete translation; valid strings retained in memory. '+ '; '.join(invalid[:5]))
 validate(source,values,code)
 for key,text in values.items():memory[source['string_hashes'][key]]=text
 dump(memory_path,memory)
 package={'locale':code,'language':target,'language_native':native,'snapshot':source['snapshot'],'source_hash':source['source_hash'],'register_hash':source['register_hash'],'string_hashes':source['string_hashes'],'status':'translated','strings':values,'provenance':{'engine':'OpenAI Codex CLI','model_selection':'CLI default; not overridden','prompt_version':PROMPT_VERSION,'generated_at':now(),'usage':usage,'human_reviewed':False}}
 package[source.get('output_key','database')]=materialize(source,values)
 dump(output,package)
 return{'locale':code,'status':'translated','strings':len(values),'usage':usage}

def manifest(source,targets):
 states={}
 for code,target in targets.items():
  path=STORE/source['snapshot']/(code+'.json');state={'language':target,'status':'pending'}
  if path.exists():
   row=json.loads(path.read_text());state['status']=row.get('status','pending') if is_current(source,row) else 'stale'
   if state['status']in ('translated','source'):
    try:validate(source,row['strings'],code)
    except ValueError:state['status']='needs-validation'
   if state['status']in ('translated','source'):state['file']=str(path.relative_to(ROOT));state['source_hash']=source['source_hash']
  job=STORE/source['snapshot']/'jobs'/(code+'.json')
  if state['status']=='pending' and job.exists():
   status=json.loads(job.read_text())
   if status.get('source_hash')==source['source_hash']:
    state['status']=status['status']
    if status.get('reason'):state['reason']=status['reason']
  states[code]=state
 obj={'snapshot':source['snapshot'],'source_hash':source['source_hash'],'register_hash':source['register_hash'],'target_count':len(targets),'ready_count':sum(x['status']in ('source','translated') for x in states.values()),'languages':states,'note':'Only complete source-matched Codex translations are published. Pending/unsupported languages are never filled with another language.'}
 dump(STORE/source['snapshot']/'manifest.json',obj);return obj

def main():
 parser=argparse.ArgumentParser();parser.add_argument('command',choices=['prepare','run','status']);parser.add_argument('--locales',help='Comma-separated catalog codes; omitted means configured site languages');parser.add_argument('--workers',type=int,default=1);parser.add_argument('--run-dir',default='/tmp/incident-codex-translations');args=parser.parse_args()
 source,targets=prepare()
 if args.command!='run':print(json.dumps(manifest(source,targets),ensure_ascii=False) if args.command=='status' else f'Prepared {len(source["strings"])} strings for {len(targets)} locales, snapshot {source["snapshot"]}');return
 selected=args.locales.split(',') if args.locales else list(targets)
 if any(code not in targets for code in selected):raise ValueError('Unknown target code')
 run_root=Path(args.run_dir);run_root.mkdir(parents=True,exist_ok=True);stop=threading.Event();outcomes=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(args.workers,4))) as pool:
  tasks={pool.submit(translate,source,targets[code],run_root,stop):code for code in selected}
  for task in concurrent.futures.as_completed(tasks):
   code=tasks[task]
   try:outcome=task.result()
   except Exception as exc:outcome={'locale':code,'status':'failed','reason':str(exc)[:1000]}
   outcomes.append(outcome);dump(STORE/source['snapshot']/'jobs'/(code+'.json'),dict(outcome,source_hash=source['source_hash'],updated_at=now()));dump(run_root/'outcomes.json',outcomes);current=manifest(source,targets)
   print(json.dumps(outcome,ensure_ascii=False),flush=True);print(f'Ready {current["ready_count"]}/{current["target_count"]}',flush=True)
 print('Translation run finished',flush=True)
if __name__=='__main__':main()
