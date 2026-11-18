# November 18 collection provenance

See [the research review](research-2026-11-18-0900.md) ([English](research-2026-11-18-0900.en.md)) for interpretation and limitations.

The fixed API window is 2026-11-17T00:00:00Z through 2026-11-18T00:00:00Z (2026-11-17 09:00 JST to 2026-11-18 09:00 JST). All NVD pages (1,230 published, 2,390 modified) and all three GHSA categories (reviewed: 11, unreviewed: 564, malware: 126; total 701 published, 927 modified) completed. The collection includes raw pages, normalized NVD/GHSA indexes, feed indexes, KEV comparison, vendor captures, timestamps, errors, and hashes.

To recollect current revisions without overwriting the immutable authored snapshot:

```sh
python3 tools/intel/snapshot-20261118-0900.py --github-auth --output-dir data/recollect-2026-11-18-0900
```

Existing directories are rejected. Omit `--github-auth` for anonymous GitHub API access, subject to its rate limits. Authentication is attached only to `api.github.com`; credentials are never written into evidence. This command recollects current upstream revisions and does not reproduce historical response bytes or the curated register.

The summary's `verification.raw_response_hashes_verified` is 66; `deduplicated_references_verified` is 25. CISA KEV catalog version `2026.11.13` contains 1,781 entries and is unchanged. Upstream network errors occurred during feed/vendor polling and are recorded in the manifest: `zcode-research` (HTTP 302 redirect loop), and timeouts on `php-news` and `feed-oss-sec`.

Validation commands:

```sh
npm ci
npm run build
python3 -m unittest discover -s tests -p '*test*.py'
node --test tests/*.test.cjs
npm run check:assets
node tools/check-motion-locales.cjs
```

Run generation and verification sequentially: some existing tests import build modules that write generated pages. A completed build is required before browser/publication checks.
