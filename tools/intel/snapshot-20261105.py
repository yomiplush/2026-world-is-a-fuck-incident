#!/usr/bin/env python3
"""Recollect the November 5 API/source window into a fresh directory.
This preserves authored registers and cannot recreate historical upstream revisions.
"""
import argparse
import importlib.util
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir', default='data/recollect-2026-11-05-1608')
args = parser.parse_args()
output = Path(args.output_dir)
if not output.is_absolute():
    output = root / output
if output.exists():
    parser.error('Output directory already exists; choose a fresh --output-dir')
spec = importlib.util.spec_from_file_location('current', root / 'tools/intel/snapshot-1318.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.OUT = output
module.PREVIOUS = root / 'data/2026-11-03-1620'
module.START, module.END = '2026-11-03T07:20:00', '2026-11-05T07:08:00'
module.BASE.OUT, module.BASE.START, module.BASE.END = output, module.START, module.END
module.main()
summary_path = output / 'collection-summary.json'
summary = json.loads(summary_path.read_text())
summary['cutoff_jst'] = '2026-11-05T16:08:00+09:00'
summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
