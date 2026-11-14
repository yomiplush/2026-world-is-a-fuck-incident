# November 14 collection provenance

See [the research review](research-2026-11-14-0900.md) ([English](research-2026-11-14-0900.en.md)) for interpretation and limitations.

The fixed API window is 2026-11-13T09:25:00Z through 2026-11-14T00:00:00Z. All NVD pages and all three GHSA categories (reviewed, unreviewed, malware) completed for both publication and modification queries. The collection includes raw pages, normalized NVD/GHSA indexes, feed indexes, KEV comparison, vendor captures, timestamps, errors and hashes.

To recollect current revisions without overwriting the immutable authored snapshot:

```sh
python3 tools/intel/snapshot-20261114-0900.py --github-auth --output-dir data/recollect-2026-11-14-0900
```

Existing directories are rejected. Omit `--github-auth` for anonymous GitHub API access, subject to its rate limits. Authentication is attached only to `api.github.com`; credentials are never written into evidence. This command recollects current upstream revisions and does not reproduce historical response bytes or the curated register.

The summary's `verification.raw_response_hashes_verified` is 78; `deduplicated_references_verified` is 24. Eleven additional primary captures are in `advisory-capture/collection-summary.json`. The evidence manifest includes historical source references and current successful responses; its 1,417 rows are source records, not unique incidents.

Validation commands:

```sh
npm ci
npm run build
python3 -m unittest discover -s tests -p '*_test.py'
node --test tests/*.test.cjs
npm run check:assets
node tools/check-motion-locales.cjs
```

Run generation and verification sequentially: some existing tests import build modules that write generated pages. A completed build is required before browser/publication checks.
