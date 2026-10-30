#!/usr/bin/env python3
"""Recollect the October 30 API/source window into a fresh directory.
This does not regenerate the authored editorial register or historical revisions.
"""
import argparse
import importlib.util
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir', default='data/recollect-2026-10-30-1031',
                    help='Fresh output directory; existing directories are never overwritten')
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
module.PREVIOUS = root / 'data/20261029T050117Z-dbf8f2'
module.START, module.END = '2026-10-29T05:01:25', '2026-10-30T10:31:35'
module.BASE.OUT, module.BASE.START, module.BASE.END = output, module.START, module.END
module.main()
summary_path = output / 'collection-summary.json'
summary = json.loads(summary_path.read_text())
summary['cutoff_jst'] = '2026-10-30T19:31:35+09:00'
summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
