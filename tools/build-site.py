#!/usr/bin/env python3
"""Rebuild reading pages, locale pages and discovery metadata in the right order."""
from pathlib import Path
import json
import subprocess
import sys
ROOT=Path(__file__).resolve().parents[1]
def run(name,*args):subprocess.run([sys.executable,str(ROOT/'tools'/name),*args],cwd=ROOT,check=True)
run('build-daily.py')
run('build-noon.py')
for p in sorted((ROOT/'data').glob('*/incident-register.json')):
    if p.parent.name.endswith('-vendors'):continue
    if json.loads(p.read_text()).get('report'):run('build-review.py',str(p.relative_to(ROOT)))
run('build-tailworm.py')
run('build-languages.py')
run('publish-site.py')
subprocess.run(['node',str(ROOT/'tools/build-assets.cjs')],cwd=ROOT,check=True)
