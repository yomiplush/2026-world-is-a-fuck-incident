#!/usr/bin/env python3
"""Capture selected primary URLs with bounded requests; preserve failures and hashes."""
import concurrent.futures
import datetime as dt
import gzip
import hashlib
import json
from pathlib import Path
import sys
import urllib.parse
import urllib.request

folder = Path(sys.argv[1]).resolve()
urls = json.loads((folder / 'sources.json').read_text())
summary_path = folder / 'collection-summary.json'
previous = json.loads(summary_path.read_text())['sources'] if summary_path.exists() else []
cached = {row['url']: row for row in previous if row.get('status') == 'ok'
          and not row.get('content_warning')
          and hashlib.sha256(gzip.decompress((folder / row['file']).read_bytes())).hexdigest() == row['sha256']}

def capture(url):
    if url in cached:
        return cached[url]
    row = {'url': url, 'retrieved_at': dt.datetime.now(dt.timezone.utc).isoformat()}
    try:
        parsed = urllib.parse.urlsplit(url)
        safe = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc,
               urllib.parse.quote(parsed.path, safe='/%:@'), parsed.query, ''))
        request = urllib.request.Request(safe, headers={'User-Agent': 'incident-research/1.0'})
        with urllib.request.urlopen(request, timeout=35) as response:
            raw = response.read()
            row['final_url'] = response.url
            row['content_type'] = response.headers.get('Content-Type')
        name = hashlib.sha256(url.encode()).hexdigest()[:20] + '.txt.gz'
        (folder / name).write_bytes(gzip.compress(raw, mtime=0))
        row.update(status='ok', file=name, bytes=len(raw),
                   sha256=hashlib.sha256(raw).hexdigest(), sha256_is='decompressed bytes')
        if b'Client Challenge' in raw or b'Just a moment...' in raw:
            row['content_warning'] = 'Challenge response; not verified advisory body'
    except Exception as exc:
        row.update(status='error', error=str(exc))
    return row

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    rows = list(pool.map(capture, urls))
summary = {'cutoff': '2026-10-28T04:18:44Z', 'sources': rows,
           'note': 'Current revisions retrieved after cutoff. HTTP success alone does not verify content.',
           'counts': {key: sum(r['status'] == key for r in rows) for key in ('ok', 'error')}}
summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2)+'\n')
print(summary['counts'])
