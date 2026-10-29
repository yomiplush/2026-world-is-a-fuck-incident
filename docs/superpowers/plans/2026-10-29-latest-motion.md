# Latest dated 3D briefing implementation plan

> **For agentic workers:** Use executing-plans to implement task by task.

**Goal:** Add six bilingual explanatory 3D scenes to the October 29 review, link directly from the article and entrance, and keep chapter navigation bounded as content grows.

**Architecture:** Extend existing Canvas/RIG3D compositions and append scene data without renumbering historical URLs. Build chapter groups of at most ten scenes, respecting an explicit break before the current review. Render a five-chapter window with ▲/▼ group controls and ● active indicator. Keep native article links and full text transcripts.

**Tech stack:** Existing vanilla JS, Canvas 2D projection, Python publishers, esbuild, Playwright Chromium.

**Authorization:** User requested latest-article motion, iPhone 13 responsiveness and scalable symbol navigation, then delegated design with “お任せで進めて”. Existing commit/push/deploy authorization persists.

## Constraints and review focus

- Retain old numeric scene links, source facts, dates and bilingual copy.
- Models are explanations, never simulated victim telemetry.
- No added runtime dependencies; respect reduced motion and low-device render budget.
- Navigation must stay inside 320px, iPhone 13 portrait/landscape and short webview bounds.
- Entrance links, corner icons and consent controls must not collide.
- Every new scene must animate, react to camera changes, and render deterministically when reduced motion is selected.

## Tasks

1. [x] Write failing model/content tests for chapter windows, large synthetic scene sets, stable old links and latest sourced scenes.
2. [x] Implement explicit chapter breaks and bounded navigation; preserve keyboard and automatic chapter following.
3. [x] Append six sourced Japanese/English scenes with distinct 3D compositions and link current article/entrance directly to #66. Rebuild bilingual transcripts.
4. [x] Verify no-overlap entrance and navigation at phone sizes, interactive/reduced-motion renders and full automated suites. Review branch, fix material findings, commit/push/deploy and compare production files.

## Progress

- Baseline: clean fresh clone on feature/latest-motion from b244e8b; existing dependencies installed.

- Model tests: observed missing chapterWindow and missing six scenes fail, then pass; synthetic 1,001 extra scenes remain reachable with bounded chapter windows.
- Verified: Node 40/40, Python 34/34, Chromium 108 checks across six desktop/iPhone-like viewports including reduced motion, camera reaction, unique diagrams, keyboard/audio and no-JS article links.
- Scope ruling: preserve immutable research registers; presentation routing lives in content/motion-reviews.json so translation source hashes remain valid.
- Legacy tests/browser.mjs and tests/chapters.mjs encode older UI assumptions; new tests/latest-motion-browser.cjs exercises the current navigation without relying on obsolete seven-chapter layouts.

- Final review: fresh reviewer found no Critical/Important production issue; flagged count provenance as Minor. Regraded as important for source verification and added frozen aggregation/impact references; test observed RED then GREEN. Full suites repeated.
- Final packaging: preserve current published baseline bundles as manifest.previous, not an unpublished intermediate generation.
- Ruling: ship responsive behavior verified in Chromium with iPhone-like dimensions, UA and touch; real iPhone Safari hardware is not available in this environment.

- Release gates passed: full Node 40/40, Python 34/34, 108 Chromium viewport/interaction checks, byte-hashed assets and clean diff. Commit/push authorized; deployment result will be recorded in private release log.
