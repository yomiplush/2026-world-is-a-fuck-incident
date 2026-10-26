# Adaptive runtime and14:56 incident review implementation plan

> **For agentic workers:** Execute the checked tasks in this session. Research tasks run independently; the owning agent integrates, validates and publishes the result.

**Goal:** Reduce work on low-spec or busy devices and publish a primary-source security review with a2026-10-26 14:56 JST cutoff.

**Architecture:** Keep the buildless site and public URLs. Concentrate device hints, measured frame pressure, recovery and cancellation in the rendering module, behind its existing create/configure/invalidate/resize/dispose interface plus an optional budget-change callback. The controller applies presentation classes and preserves time-based camera motion. Collection remains immutable per snapshot, with a structured current index and clear cutoff/retrieval distinctions.

**Tech stack:** Native JavaScript, Canvas2D, CSS, Python standard library, Node test runner, existing Brave/CDP browser harness, Cloudflare Pages.

**Spec:** User request in this conversation: full site refactoring and automatic load reduction according to device capabilities; broad incident/vulnerability/remediation collection as of October26,14:56 JST; repository and site publication, with added pages/motion only where useful.

## Global constraints

- Preserve all existing scene IDs and numerical shared links,12 languages, Tailworm static translations and privacy-consent semantics.
- Keep initial entry free of scene/geometry/data/media loading until user intent.
- No recurring animation callbacks while hidden, occluded, disposed or settled in reduced-motion mode.
- Device core/memory/save-data hints are advisory; measured draw time must also reduce load. Recovery needs hysteresis and may not exceed the device's starting ceiling.
- Constrain interactive input as well as passive animation. Avoid converting every display refresh into a callback when targeting fewer frames.
- Keep actual camera motion time-based at12–30fps. Do not shorten source content or remove source links to save work.
- Security cutoff05:56 UTC; collection occurs afterwards. Never convert registration counts into incident counts or date-only same-day notices into timestamp-proven updates.

## Task1: Reproduce frame-pressure problems and implement adaptive runtime

Files: `tests/render.test.cjs`, `site/render.js`, `site/app.js`, `site/style.css`, `site/entry.js`.

- [x] Run a deterministic fake-clock harness against the real renderer. Assert low-device interaction rate, pressure reduction below24fps, callback count, no idle timers, and recovery ceiling. Observe failures before editing.
- [x] Refactor render scheduling to one cancellable timer/RAF chain. Choose a conservative initial core/memory/save-data budget; reduce fps and raster budget after sustained pressure, recover slowly after sustained headroom.
- [x] Emit budget changes through `onBudget`, which the controller uses to reduce decorative CSS effects. Integrate live connection save-data changes and release listeners on dispose.
- [x] Raise the camera delta cap sufficiently for12fps while retaining pause/BFCache handling. Coalesce resize/viewport layout measurements.
- [x] Verify the harness and existing resources, entry, viewport, privacy and browser journeys. Record draw/callback and raster-budget results; use a throttled real-browser profile for comparison.

## Task2: Collect and assemble the14:56 primary-source record

Files: `tools/intel/snapshot-1456.py`, `data/2026-10-26-1456/`, `data/2026-10-26-1456-vendors/`, `docs/research-collection-2026-10-26-1456.md`, `docs/research-2026-10-26-1456.md`, `data/latest.json`.

- [x] Collect all-severity fixed-window NVD publication/modification pages, GHSA, KEV, official feeds and vendor notices; preserve exact URL/time/response/hash/errors.
- [x] Validate pagination, duplicate identifiers, publication/modification overlap, unreviewed records, and prior-snapshot overlaps.
- [x] Curate actionable structured records with conditions, response, source links and certainty. Keep references without cutoff-proof separate. Create an explicit latest pointer without mutating historical data.

## Task3: Publish a useful report and current navigation

Files: report builder under `tools/`, latest report under `site/`, shared report/navigation builders, `README.md`, `README_jp.md`, sources lists and sitemap.

- [x] Add a14:56 reading report with a busy-reader summary, material changes, continuing actions and provenance/limits. Add or update motion scenes only for material findings that benefit from that explanation.
- [x] Replace current-entry links and metadata; historical report timestamps remain historical. Regenerate the daily pages and Tailworm locale pages from their sources when global navigation changes.
- [x] Validate generated pages, local routes/fragments, shared scene targets, all language paths, responsive layout and preserved consent.

## Task4: Review and release

- [x] Independent review of the final implementation and source/cutoff claims. Resolve material issues.
- [x] Run appropriate tests and provenance hashes. Fetch remote to avoid overwriting concurrent work.
- [ ] Commit and push the verified source.
- [ ] Deploy the matching commit to the existing Cloudflare Pages project. Check live custom-domain report/runtime assets and language navigation; stop task-owned preview/browser processes.
