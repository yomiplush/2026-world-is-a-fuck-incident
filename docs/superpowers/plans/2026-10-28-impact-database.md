# October 28 database and real-world impact implementation plan

Goal: free primary-source scan through2026-10-28T04:18:44Z; reproducible snapshot and separately readable actual impacts.

Architecture: retain static build and historical snapshots. New impact JSON is the sole source for /impact and downloadableJSON. Existing publisher renders native navigation links styled as tabs; no runtime dependencies, no required JavaScript, no fabricated unified loss score.

1. Collect NVD published/modified, GHSA reviewed/unreviewed/malware, KEV, public feeds and selected official vendor/incident notices. Record raw hashes, retrievals, failedrequests, API pagination and overlaps.
2. Curate new snapshot: distinguish registration/publication/event times, observed harm vs exploitation vs potential. Preserve original prior records as historical; carry forward active issues explicitly. Capture first-party advisories referenced by reviewedGHSA and preserve exact affected/patched ranges.
3. Add integrity regression test first for cutoff alignment, sourced impact records, unknown values, route/tab accessibility and noJavaScript content. Implement impact renderer in separate module and integrate publisher. Expose link from root and latest report.
4. Build latest report/database/translations (oldertranslations clearly archived); keep65 existing motion scenes stable, update current-review metadata only. Add currentstatus link rather than rewrite historical scene narratives.
5. Verify source hashes/counts/links, all unit suites and responsive noJS browser behavior. Review factual boundaries and code, address findings, normal commit/push/deploy and inspect liveJSON/pages.

Evidence rules: no claim of complete worldwidecoverage. CVSS is potential severity. KEV confirms vulnerabilityexploitation without identifying all victim products. Counts of records, organizations, accounts and payments remain separate; no sum across incidents. Recovery readiness is not restoredservice. Monetary reimbursementcaps are not totaldamages. Dates lacking timestamps go into reference-only if intraday cutoff uncertain.
