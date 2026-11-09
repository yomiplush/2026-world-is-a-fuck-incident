# Collection — 2026-11-09 09:00 JST

Fixed UTC window: 2026-11-08T15:53:00Z–2026-11-09T00:00:00Z. NVD published and modified queries completed with no severity filter. GHSA published/modified queries separately covered reviewed, unreviewed and malware, following Link pagination. Inclusive boundaries can overlap the prior cutoff. API record counts are not incident counts.

API requests ran after cutoff; exact source retrieval times are saved. Bodies preserve retrieval-time revisions rather than every historical version. IBM security bulletins and Patchstack advisories carry earlier initial publication dates (October–November 6, 2026) distinct from NVD registration in this window.

The main collector verified 54 decoded response hashes, including 36 references to unchanged historical originals. Additional capture saved 16 HTTP-success responses (11 IBM security bulletins and 5 Patchstack WordPress plugin advisories), all with non-empty verified bodies, for 70 response-integrity checks in total. The inherited evidence manifest preserves original historical source timestamps and does not imply rereview of every retained narrative.

Failures: old IPA feed HTTP 404; Feishu redirect loop. IPA fallback succeeded. Interim-fix and delivery boundaries (IBM Process Mining 2.2.1 affected vs. 2.2.1 IF001 fixed, with On-Prem delivery via support case), version-table contradictions (Qiskit SDK CVE-2026-116499 listing v2.6.2 as both affected and fixed), and partial workarounds (IBM Bob Shell repository precautions) are preserved without rounding.

SHA-256 in collection-summary.json covers decoded bytes. update-infosec-evidence.json covers stored bytes, including gzip, and maps every topic and impact source URL to successful immutable evidence. Hashes establish saved integrity, not truth, upstream authenticity or worldwide coverage.

Recollection: `python3 tools/intel/snapshot-20261109-0900.py --output-dir data/recollect-2026-11-09-0900`. The directory must be fresh. This does not regenerate authored registers, translations or the separate advisory capture. Capture URLs are in advisory-capture/sources.json. No credentials are required.

Offline validation: `python3 -m unittest discover -s tests -p evidence_manifest_test.py`; `python3 tools/build-site.py`; `node tools/check-motion-locales.cjs`; `node --test tests/motion-freshness.test.cjs`. Prior 231 topics and 20 impact records retain historical context; loss amounts remain unknown. Exploitation, laboratory demonstrations, patch availability, deployment and recovery remain distinct.
