#!/usr/bin/env python3
"""Collect the 09:00–11:33 JST API window without altering historical snapshots."""
import concurrent.futures
import argparse
import importlib.util
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('snapshot', ROOT/'tools/intel/snapshot-1318.py')
snapshot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(snapshot)
snapshot.OUT = ROOT/'data/2026-11-16-1133'
snapshot.PREVIOUS = ROOT/'data/2026-11-16-0900'
snapshot.START, snapshot.END = '2026-11-16T00:00:00', '2026-11-16T02:33:00'
snapshot.BASE.OUT, snapshot.BASE.START, snapshot.BASE.END = snapshot.OUT, snapshot.START, snapshot.END

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir',default='data/recollect-2026-11-16-1133')
    args=parser.parse_args()
    evidence=snapshot.OUT
    output=Path(args.output_dir)
    if not output.is_absolute():output=ROOT/output
    if output.exists():parser.error('Output directory exists; choose a fresh directory')
    output.mkdir(parents=True)
    snapshot.OUT=snapshot.BASE.OUT=output
    sources = json.loads((evidence/'collection-summary.json').read_text())['sources']
    for source in sources:
        if source.get('file'):shutil.copy2(evidence/source['file'],output/source['file'])
    result = {'cutoff':snapshot.END+'Z', 'cutoff_jst':'2026-11-16T11:33:00+09:00',
              'delta_start':snapshot.START+'Z', 'started_at':snapshot.BASE.now(),
              'note':'Retrieval-time revisions; publication, modification and incidents differ.',
              'sources':sources}
    jobs = {'nvd-published':lambda:snapshot.BASE.nvd('published'),
            'nvd-modified':lambda:snapshot.BASE.nvd('modified'),
            'ghsa':lambda:snapshot.ghsa('published'),
            'ghsa-modified':lambda:snapshot.ghsa('modified')}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures={pool.submit(fn):name for name,fn in jobs.items()}
        for future in concurrent.futures.as_completed(futures):
            name=futures[future]
            try:result[name]=future.result()
            except Exception as exc:result[name]={'complete':False,'error':str(exc)}
            print(name,json.dumps(result[name])[:300],flush=True)
            snapshot.BASE.save('collection-summary.json',result)
    published=snapshot.list_nvd(result['nvd-published'])
    modified=snapshot.list_nvd(result['nvd-modified'])
    ghsa={};updates={}
    for key,target in [('ghsa',ghsa),('ghsa-modified',updates)]:
        for page in result[key].get('pages',[]):
            for row in json.loads(snapshot.decoded(snapshot.OUT/page['file'])):target[row['ghsa_id']]=row
    result['counts']={'nvd_published':len(published),'nvd_modified':len(modified),
        'published_modified_overlap':len({r['id'] for r in published}&{r['id'] for r in modified}),
        'ghsa':len(ghsa),'ghsa_reviewed':sum(r['type']=='reviewed' for r in ghsa.values()),
        'ghsa_unreviewed':sum(r['type']=='unreviewed' for r in ghsa.values()),
        'ghsa_malware':sum(r['type']=='malware' for r in ghsa.values()),'ghsa_modified':len(updates),
        'ghsa_published_modified_overlap':len(set(ghsa)&set(updates))}
    result['verification']=snapshot.verify_responses(result)
    result['finished_at']=snapshot.BASE.now()
    snapshot.BASE.save('collection-summary.json',result)
    snapshot.BASE.save('nvd-index.json',{'published':published,'modified':modified,'ghsa':list(ghsa.values()),'ghsa_modified':list(updates.values())})
    print(json.dumps(result['counts']),flush=True)

if __name__=='__main__':main()
