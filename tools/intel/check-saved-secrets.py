#!/usr/bin/env python3
"""Offline check of tracked files, including gzip captures; never print matches."""
import gzip
import re
import subprocess
from pathlib import Path
PATTERN = re.compile(rb'AIza[0-9A-Za-z_-]{35}')
def contains_key(raw, compressed=False):
    return bool(PATTERN.search(gzip.decompress(raw) if compressed else raw))
def main():
    root = Path(__file__).resolve().parents[2]
    paths = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
    found = []
    for name in filter(None, paths):
        path = root / name
        if path.is_file() and contains_key(path.read_bytes(), name.endswith('.gz')):
            found.append(name)
    for name in found:
        print('Potential embedded Google API key: ' + name)
    print(f'Embedded Google API key check: {len(found)} affected tracked files')
    return int(bool(found))
if __name__ == '__main__':
    raise SystemExit(main())
