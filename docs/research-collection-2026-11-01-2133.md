# Collection provenance — November 1, 21:33:30 JST

The fixed inclusive window is 2026-10-31T01:02:11Z through 2026-11-01T12:33:30Z. The existing snapshot-1318.py collector was imported with OUT=data/2026-11-01-2133, PREVIOUS=data/2026-10-31-1010, START=2026-10-31T01:02:11 and END=2026-11-01T12:33:30; BASE.OUT/START/END were set to match. The summary's cutoff_jst was normalized to 2026-11-01T21:33:30+09:00. No historical snapshot was overwritten.

To recollect into a fresh directory, use Python 3 from the repository root:

```python
import importlib.util
from pathlib import Path
root = Path.cwd()
spec = importlib.util.spec_from_file_location('review', root/'tools/intel/snapshot-1318.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
m.OUT = root/'data/recollect-2026-11-01-2133'
assert not m.OUT.exists(), 'Choose a fresh output directory'
m.PREVIOUS = root/'data/2026-10-31-1010'
m.START, m.END = '2026-10-31T01:02:11', '2026-11-01T12:33:30'
m.BASE.OUT, m.BASE.START, m.BASE.END = m.OUT, m.START, m.END
m.main()
```

The inherited collector has a historical cutoff_jst literal: normalize that field to 2026-11-01T21:33:30+09:00 after recollection. Requests use the overridden UTC window. A recollection fetches later upstream revisions and does not regenerate authored editorial prose or historical response bodies.

All NVD published/modified and GHSA reviewed/unreviewed/malware published/modified pages completed. Counts were deduplicated within each window, not added across overlapping sets. Summary response hashes cover decompressed bytes; 55 response records were verified, including 34 references to unchanged historical bodies. The inherited IPA feed 404 and ZCode redirect-loop failure remain recorded. Neither is a verified source body.

Twenty-four new evidence captures cover twelve GHSA HTML pages, ten linked commit-pinned OpenSSF records, the Apache CNA record and an attempted official Apache announcement capture. The latter returned a JavaScript shell (HTTP 200), is marked with a content_warning, and is not used as a verified register source. advisory-fetch.json records HTTP status, UTC retrieval time, path, stored-byte SHA-256 and uncompressed size. update-infosec-evidence.json combines these with inherited evidence; historical retrieval timestamps remain historical. The API's original vulnerabilities objects are retained in each new advisory record.

The previous 168 topic IDs and 19 impact records remain. Retention is not a fresh verification of every old body. The primary-source note records limited vendor rechecks; no restoration or compensation completion is inferred. Unknown total losses stay null. English editorial translations reuse unchanged source strings and validate complete keys, identifiers and numeric tokens before publication.

Run `python3 -m unittest discover -s tests -p evidence_manifest_test.py` for current evidence, API pagination, historical ID retention and source-matched translation checks. Run the full Python suite and current-review JavaScript check after rebuilding the site. Older records and their evidence are retained unchanged.

Additional primary capture: northflank-status.html.gz, with stored-byte hash and actual UTC retrieval time in northflank-fetch.json and the consolidated evidence manifest. Its dated response updates fall within the fixed window. This increases new evidence captures to twenty-five.
