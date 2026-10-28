#!/usr/bin/env python3
"""Prepare and translate the same impact register into the site's language catalog."""
import argparse,concurrent.futures,importlib.util,json,threading
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);value=importlib.util.module_from_spec(spec);spec.loader.exec_module(value);return value
manager=module('impact_translation_manager',ROOT/'tools/translations/manage.py')
views=module('impact_views',ROOT/'tools/impact_pages.py')
manager.STORE=ROOT/'data/impact-translations'
FIELDS=('title','confirmed','unknown','response','category','as_of')
def prepare():
 latest=json.loads((ROOT/'data/latest.json').read_text());path=ROOT/'data'/latest['impact_register'];record=json.loads(path.read_text());snapshot=path.parent.name
 strings={'ui.'+k:v for k,v in views.COPY.items()}
 for row in record['records']:
  for field in FIELDS:strings['records.'+row['id']+'.'+field]=row.get(field,'')
 for i,text in enumerate(record['caveats']):strings['caveats.'+str(i)]=text
 source={'snapshot':snapshot,'cutoff':record['cutoff'],'cutoff_jst':record['cutoff_jst'],'register':latest['impact_register'],'register_hash':manager.sha(path.read_text()),'source_locale':'ja','strings':strings,'string_hashes':{k:manager.sha(v)for k,v in strings.items()},'source_hash':manager.sha(json.dumps(strings,ensure_ascii=False,sort_keys=True)),'prompt_version':manager.PROMPT_VERSION,'record_fields':FIELDS,'output_key':'impact'}
 targets={r['code']:r for r in json.loads((ROOT/'content/site-languages.json').read_text())['languages']}
 manager.dump(manager.STORE/snapshot/'source.json',source)
 ja={'locale':'ja','language':targets['ja'],'snapshot':snapshot,'source_hash':source['source_hash'],'register_hash':source['register_hash'],'status':'source','strings':strings,'impact':record,'provenance':{'engine':'Japanese original'}}
 manager.dump(manager.STORE/snapshot/'ja.json',ja)
 return source,targets

def main():
 parser=argparse.ArgumentParser();parser.add_argument('command',choices=['prepare','run']);parser.add_argument('--locales');parser.add_argument('--workers',type=int,default=3);parser.add_argument('--run-dir',default='/tmp/infosec-impact-locales');args=parser.parse_args();source,targets=prepare()
 print('Impact source:',source['snapshot'],len(source['strings']),'strings',flush=True)
 if args.command=='prepare':return
 chosen=args.locales.split(',')if args.locales else list(targets)
 stop=threading.Event();work=Path(args.run_dir);work.mkdir(parents=True,exist_ok=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers)as pool:
  jobs={pool.submit(manager.translate,source,targets[code],work,stop):code for code in chosen}
  for job in concurrent.futures.as_completed(jobs):
   try:result=job.result()
   except Exception as error:result={'locale':jobs[job],'status':'failed','reason':str(error)}
   print(json.dumps(result,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
