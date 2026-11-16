# Database refresh implementation plan

> **For agentic workers:** Execute inline with executing-plans; keep original snapshots unchanged.

**Goal:** Publish a source-backed November review and navigable monthly archives.

**Architecture:** Existing static generators retain historical reports. A focused monthly generator creates Japanese/English archives and the current review from a new dated register. Existing publishing metadata remains authoritative.

**Tech Stack:** Python standard library, existing static HTML/CSS/Canvas and Node checks.

**Spec:** ../specs/2026-11-16-database-refresh-design.md (approved)

## Global constraints
- Preserve original snapshots, source URLs and scene numbers.
- Save retrieval timestamps, decoded response hashes and failures.
- Distinguish publication, incident date, retrieval, patch availability and recovery.
- No incomplete API totals presented as worldwide or complete counts.
- Japanese and English reading pages, no new dependencies.

## Review focus
- Cross-month records must appear in the correct review month.
- Multiple reviews on one day must remain separately linked.
- Missing or failed source collections must not become zero incidents.
- Current navigation must lead to the new report while motion retains its date.
- Rebuilds must retain new pages and English translations.

### Task 1: Evidence and curation
- [ ] Capture current primary advisories and KEV; preserve raw bytes and errors under data/2026-11-16.
- [ ] Compare with October baseline, read advisory bodies, create sourced bilingual records and research notes.
- [ ] Verify hashes and source support; explicitly delimit partial collection scope.

### Task 2: Monthly and current reading pages
Files: tools/monthly_pages.py, tests/monthly_pages_test.py, tools/publish-site.py, data/latest.json.
- [ ] Test reverse chronological month grouping, duplicate dates, no-JS source links, English companions and incomplete counts.
- [ ] Run failing test, implement generator and integrate before metadata/discovery.
- [ ] Update latest pointer, entry links and current database without relabeling historical impact/motion evidence.
- [ ] Run targeted tests and complete build.

### Task 3: Delivery
- [ ] Inspect diff, internal links, source hashes and bilingual/current metadata.
- [ ] Run relevant existing checks, record failures and their causes.
- [ ] Commit and publish through the existing Cloudflare Pages project; confirm live report, JSON and archive URLs.

## Execution ledger
- Approved: monthly index and necessary explanations, then concrete design.
- Ruling: execute in existing checkout on a task branch; do not add a worktree because no preference was provided and the requested work is authorized in this workspace.
- Ruling: collect and curate bounded primary-source updates rather than claiming a complete nineteen-day NVD/GHSA census.
- Baseline correction: the initial checkout was outdated and had unrelated Git history. Fetched origin/main 9dd127a and created `/tmp/infosec-monthly-20261116` from it. Production was already current through 09:00 JST, so the final collection window is 09:00–11:33 JST, fully paginated (NVD 9/10, GHSA 2/2).
- Evidence complete: 41 decoded response hashes verified; KEV bytes equal the 09:00 baseline. Seven topics added and the existing GMO row updated, 337 total. Historical 330-topic/22-impact context remains explicitly separated from newly reviewed rows.
- Publication implemented: Japanese/English monthly indexes include ten legacy daily pages, four older report routes and all structured dated reviews. Four focused topic pairs and six bilingual motion scenes are added (146 scenes total).
- Review corrected diagram labels inherited from historical renderers, source-drawer gaps, legacy archive omissions and scope-review timestamp. Fresh reviewer found no remaining blocker after fixes.
- Verified: full build, 43 complete article language pairs, 3 month tests, 17 visual/rig checks, 14 SEO checks, 7 scope checks, 2 impact checks, asset freshness and whitespace. Final browser gate passed 216 no-JS/reading/motion checks over six viewports. Screenshots visually inspected.
- Production publication and public URL verification are the final delivery steps.
