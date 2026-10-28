#!/usr/bin/env python3
"""Complete current DB and impact packages, reusing validated strings on retries."""
import argparse,concurrent.futures,importlib.util,json,threading
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--locales',default='zh,ko,es,fr,de,pt,ru,ar,hi,id,uk,pl,sv');parser.add_argument('--workers',type=int,default=2);parser.add_argument('--passes',type=int,default=3);parser.add_argument('--run-dir',default='/tmp/infosec-research-complete');args=parser.parse_args()
 db=load('complete_database',ROOT/'tools/translations/manage.py');impact=load('complete_impact',ROOT/'tools/translations/impact.py')
 ds,targets=db.prepare();isource,_=impact.prepare();selected=args.locales.split(',')
 if any(code not in targets for code in selected):raise ValueError('Unknown locale')
 stop=threading.Event();work=Path(args.run_dir);work.mkdir(parents=True,exist_ok=True)
 def complete(code):
  results=[]
  for kind,manager,source in [('database',db,ds),('impact',impact.manager,isource)]:
   for attempt in range(args.passes):
    try:outcome=manager.translate(source,targets[code],work/kind,stop)
    except Exception as exc:outcome={'locale':code,'status':'failed','reason':str(exc)}
    manager.dump(manager.STORE/source['snapshot']/'jobs'/(code+'.json'),dict(outcome,source_hash=source['source_hash'],updated_at=manager.now()))
    print(json.dumps(dict(kind=kind,attempt=attempt+1,**outcome),ensure_ascii=False),flush=True)
    if outcome['status']in ('source','translated','cached')or stop.is_set():break
   results.append(outcome['status'])
  return code,results
 with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(4,args.workers)))as pool:
  results=dict(pool.map(complete,selected))
 db.manifest(ds,targets);impact.manager.manifest(isource,targets)
 (work/'outcomes.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
 if any(status not in ('source','translated','cached')for rows in results.values()for status in rows):raise SystemExit(1)
if __name__=='__main__':main()
