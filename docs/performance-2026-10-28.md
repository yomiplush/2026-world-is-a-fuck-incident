# Runtime and device compatibility — October28,2026

Baseline: `73e5e54`. Same65 scenes, scene numbers, content, existing reading pages,
consent model and five complete motion languages. No paid APIs were used.

## Delivery

| Entry/motion assets | Before | After |
| --- | ---: | ---: |
| Initial JS/CSS requests |10|3|
| Initial uncompressed bytes |57,764|46,875|
| Initial gzip bytes |19,107|14,257|
| Deferred motion requests |6|1|
| Deferred motion uncompressed bytes |278,559|204,715|
| Deferred motion gzip bytes |83,098|73,542|

These counts exclude HTML, images, favicon and any locale selected later. Gzip
figures use Python's gzip defaults per file; actual Cloudflare encoding and
transfer sizes vary. Initial bytes fall18.9% and motion bytes26.5%; these are
delivery measurements, not a claim about battery life or every device's speed.

Sources remain separate and readable. `tools/build-assets.cjs` compresses them
into content-hashed platform, entry, motion, stylesheet and lazy locale assets.
The platform guard uses ES5; other JavaScript distributions target ES2015,
including transformed async functions. The entry remains gesture-gated; optional
audio is streamed, not decoded into a full music buffer. An ES2015 target alone
does not imply browser API or CSS support: see [esbuild's target documentation](https://esbuild.github.io/api/#target).

Build with `npm ci && npm run build`; verify with `npm run check:assets`.
The full build runs reading-page generation, publication metadata, then asset
packaging. Source hashes and byte hashes detect stale generated output. Previous unbundled entry/controller URLs remain bootable during migration. One prior
asset generation is retained for documents opened before an update.

## Shared rendering and events

- Projection and depth no longer allocate an intermediate rotation array.
- Label placement tries nearby positions on demand instead of constructing all
  candidates for every label. Crowded fallback finds the nearest valid position
  with a scan instead of allocating and sorting the complete candidate list.
- VisualViewport bursts share one animation-frame update. Identical rounded
  dimensions cause no repeated style writes or layout events. Pinch zoom remains
  native. A deterministic test sends100 unchanged events: one callback, zero
  style writes and zero layout notifications.
- Limited-device SFX reverb uses36,000 samples at48kHz instead of230,400, an84.4%
  reduction in that buffer allocation. Its voice ceiling is12 instead of48.
  Normal devices retain their original audio settings.

`node tools/benchmark-render.cjs 73e5e54` compared260 scene/time/viewport/camera
samples: all783,952 recorded Canvas commands matched exactly. Representative
JS-only timings with a no-op Canvas changed from3.122→3.039ms (intro),
2.964→2.811ms (npm),2.069→1.755ms (Tailworm),1.708→1.556ms (Consul), and
4.631→4.671ms (closing). The closing sample is slightly slower within ordinary
timing variation; this is not an across-the-board frame-time claim. These
microbenchmarks exclude browser rasterization, GPU work and thermal effects.

Existing adaptive caps remain in force. Real-browser checks retained roughly
15fps/481,580 pixels for low-capacity hints and30fps/1,499,438 pixels for a
higher-capacity profile. Injected28ms JS work reduced to12fps/599,690 pixels.
Hidden and settled static views produced zero render callbacks/paints.

## Compatibility and verification

Legacy MediaQueryList listeners work without modern change-event methods.
Missing optional media/viewport APIs choose conservative behavior. Audio
constructor/setup/playback failures do not block the briefing. Missing essential
APIs, CSS Grid or Canvas context lead to the full JA/EN transcript; a visible
no-JavaScript reading link also remains. Basic viewport, fixed-position, sizing
and safe-area CSS have fallbacks. Downloaded-but-invalid motion code now becomes
a retryable entry error instead of waiting indefinitely for initialization. A
failed initialization advances the retry URL to avoid replaying corrupt bytes
from the document preload cache; the6×CPU regression verifies recovery.

Verification includes12 Node test files,18 Python publication/translation tests,
the full260 direct-render checks and650 scene/layout checks,325 language/scene
checks, entry retries, consent/storage denial and withdrawal, adaptive/resource
tests, and60 phone/tablet/Quest/TV viewport-language layouts. Compatibility
fixtures remove optional APIs, disable Canvas/Promise/Grid/audio, disable page
JavaScript, and corrupt the motion response before retrying. CPU throttling is
available through `CPU_RATE=6 CDP_PORT=9238 node tests/compatibility.mjs`.

Browser tests use Chromium with emulated dimensions, hints, API availability and
CPU throttling. They do not certify physical Safari, Quest, Android TV hardware,
all embedded webviews, or actual energy savings. Unsupported layouts get a
readable transcript rather than a promise that animation works everywhere.
