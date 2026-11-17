# November 17 collection provenance

See [the research review](research-2026-11-17-0900.md) ([English](research-2026-11-17-0900.en.md)) for interpretation and limitations.

The fixed API window is 2026-11-16T02:33:00Z through 2026-11-17T00:00:00Z (2026-11-16 11:33 JST to 2026-11-17 09:00 JST). All NVD pages (348 published, 1,395 modified) and all three GHSA categories (reviewed: 41, unreviewed: 245, malware: 119; total 405 published, 674 modified) completed. The collection includes raw pages, normalized NVD/GHSA indexes, feed indexes, KEV comparison, vendor captures, timestamps, errors, and hashes.

To recollect current revisions without overwriting the immutable authored snapshot:

```sh
python3 tools/intel/snapshot-20261117-0900.py --github-auth --output-dir data/recollect-2026-11-17-0900
```

Existing directories are rejected. Omit `--github-auth` for anonymous GitHub API access, subject to its rate limits. Authentication is attached only to `api.github.com`; credentials are never written into evidence. This command recollects current upstream revisions and does not reproduce historical response bytes or the curated register.

The summary's `verification.raw_response_hashes_verified` is 59; `deduplicated_references_verified` is 1 (KEV data verified against prior snapshot). CISA KEV catalog version `2026.11.13` contains 1,781 entries and is unchanged. Four upstream network errors occurred during feed/vendor polling and are recorded in the manifest: `feed-ipa` (HTTP 404), `zcode-research` (HTTP 302 redirect loop), and timeouts on `tailscale-bulletins` and `php-releases`.

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
