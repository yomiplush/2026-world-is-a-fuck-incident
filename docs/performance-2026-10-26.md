# Adaptive rendering — October26,2026

The buildless site keeps its lazy entry, public scene numbers, translations and source text. `render.js` now owns device budgets, draw pressure, presentation lateness, recovery, raster sizing and cancellable scheduling. The controller receives only budget-change notifications for decorative effects.

| Device hint | Passive / interactive ceiling | Canvas pixels | DPR ceiling |
| --- | --- | --- | --- |
| ≤2 cores or ≤2GB reported memory |15 /24fps |500,000 |1 |
| Save-Data |18 /24fps |700,000 |1.25 |
| Unknown/≤4 cores or ≤4GB memory |24 /30fps |900,000 |1.5 |
| Higher reported capacity |30 /60fps |1,500,000 |2 |

Hints select an initial ceiling, not a hardware benchmark. Sustained JavaScript draw cost or late animation presentation lowers frame ceilings to24/18/12fps, lowers raster work and removes expensive decorative blur. Interaction respects its own reduced ceiling. Recovery requires60 headroom frames and a six-second cooldown, never exceeding the device ceiling. Late presentation is a scheduling-pressure proxy; it does not directly measure GPU work or battery consumption.

A cancellable timer followed by RAF schedules useful paints without continuously polling60/120Hz refreshes. Hidden views, an open sources drawer and settled static views have no recurring render jobs. Pointer invalidation cannot bypass the cap. Resize/VisualViewport events share one pending layout measurement. Camera integration uses elapsed time at the lower frame rates.

`rig3d.js` caches identical face material colors within each flush. Projection, opacity, fog, geometry and sort order stay per face. The cache is cleared after each flush. Comparison against the previous implementation covered384 material combinations and636 real scene/camera samples:1,964,844 Canvas commands matched exactly. A local no-op Canvas microbenchmark improved median JavaScript work by roughly9–26% across five representative scenes; this excludes rasterization/compositing and is not a device-wide speed or battery claim.

## Verification

- `node tests/render.test.cjs`: nine deterministic tests covering low CPU/memory, expensive draws, late presentation with cheap draws, bounded recovery,120Hz callback counts, pointer bursts, hidden/static/disposed scheduling and live Save-Data changes.
- `node tests/rig3d.test.cjs`: five tests including scoped material reuse.
- `CDP_PORT=9238 node tests/adaptive.mjs`: real Brave/CDP with emulated CPU/memory hints and injected28ms draw work. In a two-second observation, low-spec passive rendering produced30 paints versus60 for the higher-capacity profile; raster sizes were495,908 versus1,499,186 pixels. Sustained injected work reached the minimum effect tier and approximately12fps/599,424 pixels. Hidden/static checks produced zero paints and RAF callbacks.
- Full visual/browser suite:55 scenes ×4 direct-render configurations, all scenes across ten viewport/language layouts, pointer/keyboard/audio/motion preference and12 locales. Separate suites cover lazy loading, privacy, X user-agent/dynamic viewport behavior, reading pages and Tailworm translations.

The browser tests emulate low-capacity hints and expensive JavaScript work on the available machine. They do not establish thermal, energy or physical X iOS/Android behavior. Optional APIs absent on Safari select the conservative fallback; actual presentation pressure still adjusts it.
