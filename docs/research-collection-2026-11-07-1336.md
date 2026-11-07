# Collection — 2026-11-07 13:36 JST

Fixed UTC window: 2026-11-05T07:08:00Z–2026-11-07T04:36:00Z. Both NVD queries completed without severity filtering, saving all pages. GHSA published and modified queries cover reviewed, unreviewed and malware, following Link pagination. Inclusive boundaries may overlap adjacent snapshots. Counts are unique within each query and must not be added as incident counts.

Collection began at 04:35:56 UTC, four seconds before cutoff. Vendor-page requests began then; NVD/GHSA requests followed cutoff. Actual retrieval times are retained. Later requests save current revisions, not a reconstruction of all cutoff-time content.

76 collection response records include 22 references to unchanged prior originals. A separate capture stores 88 responses: 67 global advisory pages (20 reviewed, 47 malware), 20 development-owner advisories and the SonicWall PSIRT shell. The shell is explicitly flagged as unverified advisory content and excluded from successful-body evidence. 164 total response hashes include that shell's integrity check, which does not establish its advisory content. The inherited evidence manifest preserves historical sources and their original retrieval times; it does not imply they were all reread now.

The decoded-body SHA-256 values in collection-summary.json differ from the stored-byte hashes in update-infosec-evidence.json when gzip is used. Every current topic and impact source URL resolves to saved successful evidence. Source matching, unchanged historical IDs, advisory package ranges and English package hashes are checked offline.

Failures: the old IPA feed URL returned HTTP 404; the current IPA security-alert fallback succeeded. The Feishu research URL entered a redirect loop. SonicWall PSIRT returned an HTTP-success JavaScript shell, not verified body text; the KEV record supports inclusion and alternate-credential preconditions, but no minimum fixed release is invented. These limitations are not empty successful feeds.

Recollection: `python3 tools/intel/snapshot-20261107.py --output-dir data/recollect-2026-11-07-1336`. Choose a fresh directory; existing directories are rejected. The collector does not recreate authored registers, translations or the separate advisory capture. Its source URLs and retrieval times are recorded in advisory-capture/sources.json and collection-summary.json.

Validation: `python3 -m unittest discover -s tests -p evidence_manifest_test.py`; `python3 tools/build-site.py`; `node tools/check-motion-locales.cjs`; `node --test tests/motion-freshness.test.cjs`. Hashes establish integrity, not factual truth. Advisory publication, patches, laboratory proofs, deployment, real exploitation and recovery remain different claims. Prior 199 topics and 20 impact records retain earlier context and have not undergone comprehensive narrative rereview.
