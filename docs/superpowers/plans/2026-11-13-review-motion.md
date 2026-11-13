# November 13 research and motion implementation plan

> **For agentic workers:** Use executing-plans to implement this plan task by task.

**Goal:** Update the database from November 11 20:40 to November 13 18:25 JST, add useful bilingual topic pages and explanatory motion.

**Architecture:** Preserve immutable evidence and historical scene URLs. Reuse the existing collectors, hashed translation packages, static generators and Canvas scenes. Extend focused topic generation while retaining existing topic pages.

**Tech Stack:** Python, vanilla JavaScript, Canvas, esbuild and Chromium.

**Spec:** User requests database updates, more pages and MotionGraphic as needed, and delegates decisions with おまかせ. Existing site structure and research methodology remain authoritative.

## Global constraints
- Do not equate advisory totals, publications or modifications with attacks or victims.
- Preserve exact package ranges, patch availability, publication and retrieval timestamps.
- Retain historical records and all existing numeric scene links.
- Publish Japanese and English text; support static reading and reduced motion.
- No new runtime dependency; verify at 320px and mobile/desktop viewports.

## Review focus
- API completeness, pagination and failures must remain explicit.
- Primary evidence must cover all newly authored CVE claims and source URLs.
- Historical context must not imply a fresh security review.
- New topic links must open current reports and matching language/motion scenes.
- Asset manifests, discovery metadata and live publication must match the latest cutoff.

## Tasks
- [x] Capture NVD, all GHSA types, KEV and selected vendor evidence; verify hashes and completeness.
- [x] Author a dated register, report, impact context and source-matched English packages; update latest and scope review.
- [x] Add meaningful bilingual topic pages and varied explanatory scenes; observe contract tests fail before implementation.
- [x] Build and verify Python/Node/browser suites, inspect screenshots and review the complete diff.
- [ ] Commit, push a reviewable branch and use the established publication mechanism if authorized and available; verify published output.

## Ledger
- User delegated scope and implementation choices. Execute directly in this session.
- Existing local main is stale; isolated branch starts at production commit 6e13f5d.
- Baseline passed: Python 54/54 and Node 50/50.

- Collection: NVD 984 published / 4,762 modified, GHSA 1,017 published / 1,468 modified; all four windows complete. KEV unchanged at 1,779. Nine selected primary captures; 1,352 evidence records including historical references.
- Editorial: 27 additions, 283 topics; all 50 reviewed and 139 malware advisory version tables retained. Prior 256 topics preserved. Impact register adds one bounded ScreenConnect case to the original 20.
- Presentation: eight new topic pairs and a dated report pair (18 additional reading pages), six scenes #117–122. Topic navigation opens matching scenes where available.
- Review: fresh independent reviewer found no Critical/Important issues. Suggested per-topic motion links were implemented. English discovery was verified in final artifacts (article_languages creates it after topic generation).
- Visual inspection: mobile report, tenant-index and technician-boundary screenshots checked; browser gate also verifies distinct animation, camera interaction and deterministic reduced motion.
- Ruling: run build and tests sequentially because existing imported build modules mutate generated pages; concurrent checks caused temporary inconsistent artifacts. A fresh sequential build/test run replaces those invalid results.

- Additional landscape gate reproduced English-entry overlap at 844×390: the narrow two-column research links wrap, growing beyond their original reserved height. Increased the landscape English-link offset from 172px to 192px; the original failing browser assertion now passes.
- Asset manifest previous generation explicitly retains the production baseline assets, rather than an unpublished intermediate build.

- Final pre-publication verification: Python 55/55, Node 52/52, current reading/motion browser 228/228 and English discovery browser 18/18; source and asset freshness gates passed. Embedded Google API key scan found zero affected tracked files.
- Raw captured HTML/feed whitespace is preserved byte-for-byte for evidence hashes; authored files pass the whitespace check.
