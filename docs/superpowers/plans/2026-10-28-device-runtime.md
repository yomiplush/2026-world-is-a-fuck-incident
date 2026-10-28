# Device Runtime Implementation Plan

**Goal:** Reduce entry requests, browser parsing and shared rendering work while
preserving the existing briefing and usable reading paths on limited devices.

**Architecture:** Keep existing global module interfaces. Build-time compression
and syntax lowering produce hashed static entry/motion/style assets. Optional
platform features are handled at the entry, media-listener and audio seams.

**Tech Stack:** Canvas2D, plain JavaScript/CSS, Python publication tools, esbuild
(development only), Node tests and Chrome DevTools Protocol browser checks.

**Spec:** `docs/superpowers/specs/2026-10-28-device-runtime-design.md`.

## Global constraints

- No paid APIs or new browser runtime dependencies.
- Preserve65 scenes, stable numbering, current five complete motion locales,
  reading/Tailworm languages, consent and gesture-gated streaming audio.
- Preserve reduced-motion behavior, native pinch zoom and adaptive budget ceilings.
- ES2015 distribution; optional browser APIs must not block reading/navigation.
- Compare measurements under identical conditions; do not claim hardware coverage
  based only on user-agent or viewport emulation.

## Tasks

- [x] 1. Capture baseline: run adaptive browser checks, record entry resources,
  create a repeatable65-scene command-trace and noop-Canvas timing harness using
  immutable baseline `73e5e54`. Save results outside the deployed asset directory.
- [x] 2. Write failing tests for legacy media listener changes, unavailable Canvas
  and throwing AudioContext, unchanged/burst viewport events. Implement small
  guarded helpers and feature fallbacks in `entry.js`, `app.js`, `audio.js`,
  `render.js`, `viewport.js` and CSS, maintaining existing public interfaces.
- [x] 3. Optimize `rig3d.js`: calculate depth/projection without transient rotation
  arrays; evaluate label candidates only until a placement is found; replace
  exhaustive fallback sorting with a nearest-valid scan. Compare complete command
  digests against the baseline, run rig tests and benchmark the same scenes.
- [x] 4. Add pinned esbuild dev dependency and `tools/build-assets.cjs`. Generate
  content-hashed `site/assets/motion-*.js`, `boot-*.js` and `shell-*.css` in order:
  motion(data→chronology→render→rig3d→visuals→app), then entry modules with the
  motion filename supplied as a build constant, then HTML references. Retain the
  previous bundle generation for in-flight documents. Compress all lazy locale
  distributions to the same syntax target. Test deterministic output and no
  stale HTML/motion references; integrate last into `tools/build-site.py`.
- [x] 5. Update browser assertions to inspect real bundled resources and the five
  available motion locales. Run source checks, publication builders, artifacts
  checks, all Node/Python suites and browser entry/language/adaptive/resources/
  device/compatibility checks sequentially on the shared tab. Capture sizes and
  request counts in `docs/performance-2026-10-28.md`.
- [x] 6. Request a bounded read-only code review, resolve important findings,
  verify clean output and source/build parity. Commit and push the reviewed
  change, deploy the existing production project, and repeat public-URL checks.
