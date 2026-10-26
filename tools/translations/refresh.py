#!/usr/bin/env python3
"""Resume real stored translations with a bounded cooldown after provider failures.
No publication or external writes: inspect and deploy generated pages after validation.
"""
import argparse,importlib.util,json,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('manager',Path(__file__).with_name('manage.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--rounds',type=int,default=12);parser.add_argument('--cooldown',type=int,default=600);parser.add_argument('--run-dir',default='/tmp/incident-codex-refresh');args=parser.parse_args()
 if not 1<=args.rounds<=24 or args.cooldown<60:parser.error('Use1–24rounds and a cooldown of at least60seconds')
 for attempt in range(args.rounds):
  source,targets=m.prepare();manifest=m.manifest(source,targets)
  selected=[code for code,row in manifest['languages'].items() if row['status']not in ('source','translated','unsupported')]
  if not selected:break
  print(f'Round {attempt+1}: {manifest["ready_count"]}/{len(targets)} ready, {len(selected)} pending/retry targets',flush=True)
  subprocess.run([sys.executable,str(Path(__file__).with_name('manage.py')),'run','--workers','1','--locales',','.join(selected),'--run-dir',args.run_dir],cwd=ROOT,check=True)
  # Build complete locale pages even when some targets remain unsupported or rate-limited.
  subprocess.run([sys.executable,str(ROOT/'tools/build-languages.py')],cwd=ROOT,check=True)
  subprocess.run([sys.executable,str(ROOT/'tools/publish-site.py')],cwd=ROOT,check=True)
  latest,targets=m.prepare();state=m.manifest(latest,targets)
  retry=[r for r in state['languages'].values() if r['status']not in ('source','translated','unsupported')]
  if not retry:break
  if attempt+1<args.rounds:print(f'Cooling down for {args.cooldown}s before retry',flush=True);time.sleep(args.cooldown)
 state=m.manifest(*m.prepare());print(f'Finished: {state["ready_count"]}/{state["target_count"]} ready. Unsupported or failed targets remain explicit.',flush=True)
 return 0 if state['ready_count']==state['target_count'] else 2
if __name__=='__main__':sys.exit(main())
