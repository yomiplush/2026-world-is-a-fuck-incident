# Collection — November 11 20:40 JST

Fixed UTC window: 2026-11-09T00:00:00Z–2026-11-11T11:40:00Z. Requests ran after cutoff; original retrieval timestamps and revisions are saved. NVD published/modified and GHSA reviewed/unreviewed/malware pagination completed with no severity filter. Inclusive boundaries can overlap the previous cutoff.

Counts: {"nvd_published": 2768, "nvd_modified": 6054, "published_modified_overlap": 2768, "ghsa": 3059, "ghsa_unreviewed": 2529, "ghsa_reviewed": 144, "ghsa_malware": 386, "ghsa_modified": 3572, "ghsa_published_modified_overlap": 3059, "ghsa_current_published_overlap": 2596, "ghsa_previous_published_overlap": 1}. KEV 2026.11.10: 1,779 records, 10 additions. These are not incident or victim counts. All 144 reviewed and 386 malware publications retain exact per-advisory package tables, update and withdrawal timestamps. The remaining unreviewed records are indexed, not presented as independently verified product narratives.

The collector verified 119 decoded response hashes, including 19 references to prior originals. Separate capture verified 9 primary responses including a Microsoft CVRF XML body (not JSON), vendor HTML and GitHub advisories. Combined response checks: 128. Historical evidence keeps original source timestamps; historical narrative retention does not imply rereview.

Failures: old IPA feed 404 (fallback succeeded); Feishu redirect loop. Initial anonymous GitHub requests hit a rate limit; the completed collection used existing gh authentication only for api.github.com. Credentials are not stored. API page URLs are the actual fetched evidence for grouped advisories; they are not represented as fetched advisory HTML.

Offline validation: python3 -m unittest discover -s tests -p evidence_manifest_test.py; python3 tools/build-site.py; node tools/check-motion-locales.cjs; node --test tests/review-20261111.test.cjs tests/motion-freshness.test.cjs. Hashes verify saved integrity, not truth or comprehensive global coverage.
