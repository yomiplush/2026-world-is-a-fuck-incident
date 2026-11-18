#!/usr/bin/env python3
"""Recollect the November 18 09:00 JST API/source window into a fresh directory.
This preserves authored registers and cannot recreate historical upstream revisions.
"""
import argparse
import importlib.util
import json
import socket
import subprocess
import time
import urllib.request
import urllib.parse
from pathlib import Path

_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_first_getaddrinfo(*args, **kwargs):
    res = _orig_getaddrinfo(*args, **kwargs)
    ipv4 = [r for r in res if r[0] == socket.AF_INET]
    return ipv4 if ipv4 else res
socket.getaddrinfo = _ipv4_first_getaddrinfo

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir', default='data/recollect-2026-11-18-0900')
parser.add_argument('--github-auth', action='store_true', help='Use existing gh authentication only for api.github.com')
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
module.PREVIOUS = root / 'data/2026-11-17-0900'
module.START, module.END = '2026-11-17T00:00:00', '2026-11-18T00:00:00'
module.BASE.OUT, module.BASE.START, module.BASE.END = output, module.START, module.END

def patched_previous_source(name):
    summary = json.loads((module.PREVIOUS / 'collection-summary.json').read_text())
    if name.startswith('feed-'):
        return next((x for x in summary.get('feeds', []) if x.get('name') == name), {})
    if name in summary:
        return summary[name]
    if isinstance(summary.get('sources'), list):
        for item in summary['sources']:
            if isinstance(item, dict) and item.get('name') == name:
                return item
    return {}
module.previous_source = patched_previous_source

orig_nvd = module.BASE.nvd
def robust_nvd(mode):
    for attempt in range(4):
        res = orig_nvd(mode)
        if res.get('complete'):
            return res
        print(f"NVD {mode} attempt {attempt+1} failed: {res.get('error')}; retrying...", flush=True)
        time.sleep(5)
    return res
module.BASE.nvd = robust_nvd

if args.github_auth:
    credential = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True, check=True).stdout.strip()
    original_request = module.BASE.request
    def authenticated_request(url):
        if urllib.parse.urlsplit(url).netloc != 'api.github.com':
            return original_request(url)
        request = urllib.request.Request(url, headers={
            'User-Agent': module.BASE.UA, 'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + credential})
        with urllib.request.urlopen(request, timeout=55) as response:
            return response.read(), dict(response.headers)
    module.BASE.request = authenticated_request

module.main()
summary_path = output / 'collection-summary.json'
summary = json.loads(summary_path.read_text())
summary['cutoff_jst'] = '2026-11-18T09:00:00+09:00'
summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
