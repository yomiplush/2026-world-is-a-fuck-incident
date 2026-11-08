# Collection — 2026-11-09 00:53 JST

Fixed UTC window: 2026-11-08T02:13:00Z–2026-11-08T15:53:00Z. NVD published and modified queries completed with no severity filter. GHSA published/modified queries separately covered reviewed, unreviewed and malware, following Link pagination. Inclusive boundaries can overlap the prior cutoff. API record counts are not incident counts.

API requests ran after cutoff; exact source retrieval times are saved. Bodies preserve retrieval-time revisions rather than every historical version. GitHub advisories for OpenAM, OpenEMR, Kyverno, Craft CMS, imgproxy and Hickory DNS carry earlier initial publication dates (August–October 2026) distinct from NVD registration on November 8.

The main collector verified 57 decoded response hashes, including 35 references to unchanged historical originals. Additional capture saved 31 HTTP-success responses (15 vendor/project GitHub advisories and 16 malware advisories), all with non-empty verified bodies, for 88 response-integrity checks in total. The inherited evidence manifest preserves original historical source timestamps and does not imply rereview of every retained narrative.

Failures: old IPA feed HTTP 404; Feishu redirect loop. IPA fallback succeeded. Separate release-line fixes (OpenEMR 8.3.0 vs. 8.4.0; imgproxy 4.0.16 vs. 4.0.17) and unpatched legacy crate ranges (hickory-proto 0.1..0.25.0-alpha.3) are preserved without rounding.

SHA-256 in collection-summary.json covers decoded bytes. update-infosec-evidence.json covers stored bytes, including gzip, and maps every topic and impact source URL to successful immutable evidence. Hashes establish saved integrity, not truth, upstream authenticity or worldwide coverage.

Recollection: `python3 tools/intel/snapshot-20261109.py --output-dir data/recollect-2026-11-09-0053`. The directory must be fresh. This does not regenerate authored registers, translations or the separate advisory capture. Capture URLs are in advisory-capture/sources.json. No credentials are required.

Offline validation: `python3 -m unittest discover -s tests -p evidence_manifest_test.py`; `python3 tools/build-site.py`; `node tools/check-motion-locales.cjs`; `node --test tests/motion-freshness.test.cjs`. Prior 222 topics and 20 impact records retain historical context; loss amounts remain unknown. Exploitation, laboratory demonstrations, patch availability, deployment and recovery remain distinct.
