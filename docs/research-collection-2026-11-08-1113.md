# Collection — 2026-11-08 11:13 JST

Fixed UTC window: 2026-11-07T04:36:00Z–2026-11-08T02:13:00Z. NVD published and modified queries completed with no severity filter. GHSA published/modified queries separately covered reviewed, unreviewed and malware, following Link pagination. Inclusive boundaries can overlap the prior cutoff. API record counts are not incident counts.

Collection started at 02:12:59 UTC, one second before cutoff. API requests followed cutoff; exact source retrieval times are saved. Bodies preserve retrieval-time revisions rather than every historical version. IBM bulletins identify initial publication on November 5; Red Hat public_date 2026-01-07 differs from NVD registration on November 7 and is retained without silently correcting it.

The main collector verified 61 decoded response hashes, including 35 references to unchanged historical originals. Additional capture saved 15 HTTP-success responses, of which 2 Wordfence responses were empty and explicitly excluded from verified advisory-body evidence. 76 response-integrity checks include these empty responses; integrity is not substantive content verification. The inherited evidence manifest preserves original historical source timestamps and does not imply rereview of every retained narrative.

Failures: old IPA feed HTTP 404; Feishu redirect loop; two empty Wordfence bodies. IPA fallback succeeded. IBM V10/V12, Red Hat and WPScan body text were available. Selected IBM CVEs are a focused subset of the bulletins, not a complete IBM advisory census. Fixed versions are not inferred from an affected-range upper bound or an unverified release reference.

SHA-256 in collection-summary.json covers decoded bytes. update-infosec-evidence.json covers stored bytes, including gzip, and maps every topic and impact source URL to successful immutable evidence. Hashes establish saved integrity, not truth, upstream authenticity or worldwide coverage. Empty responses are listed as limitations and omitted from successful-body evidence.

Recollection: `python3 tools/intel/snapshot-20261108.py --output-dir data/recollect-2026-11-08-1113`. The directory must be fresh. This does not regenerate authored registers, translations or the separate advisory capture. Capture URLs are in advisory-capture/sources.json. No credentials are required.

Offline validation: `python3 -m unittest discover -s tests -p evidence_manifest_test.py`; `python3 tools/build-site.py`; `node tools/check-motion-locales.cjs`; `node --test tests/motion-freshness.test.cjs`. Prior 214 topics and 20 impact records retain historical context; loss amounts remain unknown. Exploitation, laboratory demonstrations, patch availability, deployment and recovery remain distinct.
