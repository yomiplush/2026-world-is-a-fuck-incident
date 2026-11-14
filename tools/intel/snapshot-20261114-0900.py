#!/usr/bin/env python3
"""Recollect the November 14 09:00 JST API/source window into a fresh directory.
This preserves authored registers and cannot recreate historical upstream revisions.
"""
import argparse
import importlib.util
import json
import socket
import subprocess
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
parser.add_argument('--output-dir', default='data/recollect-2026-11-14-0900')
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
module.PREVIOUS = root / 'data/2026-11-13-1825'
module.START, module.END = '2026-11-13T09:25:00', '2026-11-14T00:00:00'
module.BASE.OUT, module.BASE.START, module.BASE.END = output, module.START, module.END
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
summary['cutoff_jst'] = '2026-11-14T09:00:00+09:00'
summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
