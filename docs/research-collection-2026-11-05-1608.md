# Collection — 2026-11-05 16:08 JST

Fixed UTC window: 2026-11-03T07:20:00Z–2026-11-05T07:08:00Z. Both NVD queries are complete, without severity filtering; all pages are saved. GHSA published and modified queries cover reviewed, unreviewed and malware and follow Link pagination. Inclusive boundaries can overlap adjacent snapshots. Counts are unique within each query, not globally additive.

89 collection response records include 23 references to unchanged prior originals. A separate capture stores 219 advisory HTML responses (13 reviewed and 206 malware). The initial timeout on GHSA-7wfq-2q8j-q4xj succeeded on retry; its final retrieval time is retained. SHA-256 in collection-summary.json covers decoded bodies; update-infosec-evidence.json covers stored bytes, including gzip. That evidence manifest also retains historical originals with their historical retrieval times. It does not imply they were all reread now.

Failures: the CISA RSS feed returned HTTP 403; the old IPA feed URL returned 404 (the security-alert fallback succeeded); the Feishu research URL entered a redirect loop. These are not empty successful feeds. KEV JSON was obtained independently and succeeded. No completeness claim extends to the failed sources or to worldwide incidents.

Recollection: `python3 tools/intel/snapshot-20261105.py --output-dir data/recollect-2026-11-05-1608`. Always select a new directory. Later requests cannot recover past upstream revisions. The collector intentionally does not recreate the authored incident summaries or separate HTML capture; their exact source URLs, timestamps and hashes are published in the dated manifests.

Verification: `python3 -m unittest discover -s tests -p evidence_manifest_test.py`; `python3 tools/build-site.py`; `node tools/check-motion-locales.cjs`. Register, translation and rendered-page checks are offline. Source hashes establish integrity, not truth or upstream authenticity. Reviewed advisories and proof-of-concept reports do not by themselves establish exploitation in the wild.
