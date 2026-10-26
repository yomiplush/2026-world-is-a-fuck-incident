# Briefing site — `site/`

**Current: 53 scenes, October 26, 10:27 JST cutoff.** Latest report: `update-20261026.html`; dated archive: `timeline.html` and ten `day-YYYYMMDD.html` pages. Tailworm remains at #41–46; morning update #49–52; closing #53. Earlier dated sections below retain site history.

A single-page, tap-to-advance motion-graphic briefing of the October 2026 incidents, in
chronological order. Built for phones first, keyboard on desktop (space, arrows, M, S, L).
Deployed to Cloudflare Pages.

**Thirty-four scenes**: the fifteen checked incidents, two addenda (Apache, and six ZDI reports
posted to the public LKML), and — appended on 2026-10-23 — **seven postscript scenes**: *Infinity
Core* (six kernel core LPEs, five with public root PoCs), *the blind spot* (why no sweep found
them), *the ecosystem* (58 package advisories in 24 h, two criticals with no CVE), then a
second set added with `docs/22`: *Node2Shell* (a working exploit on a stock Node.js build),
*the pre-disclosure attempts* (php2shell from 10-17), *the filter* (a CNA 9.9 is a 0-row
answer), *the wide sweep* (four incidents no CVE list named), and *the follow-on* (PHP's
`CVE-2026-115560`: four conditions, one line, no emergency patch). **Every scene is real 3D**:
drag or swipe to turn the camera (a flick coasts briefly). Idle scenes orbit slowly; manual
input pauses the orbit for 2.5 seconds, and double tap springs back to the base angle. `?tilt=yaw,pitch` presets the angle.

```
site/
  index.html    markup + HUD (no build step, no framework)
  style.css     HUD/Briefing look, responsive, reduced-motion + ?still=1 static mode
  data.js       the 34 scenes: copy, numbers, per-scene sources
  rig3d.js      the 3D engine: perspective camera, depth-sorted painter queue, shaded solids
                (box / prism / octahedron / rod / ring / annulus band), billboarded labels
  visuals.js    31 scene renderers (radar, chain, bars, clock, keys, leak, core, channels, stack,
                decode, before, funnel, ledger, checklist, …), all drawn through rig3d.js
  entry.js      symbolic unlock and deferred, ordered loading with retry
  render.js     frame scheduling, bounded Canvas surface and adaptive quality
  audio.js      bounded Web Audio SFX + gesture-activated streaming BGM
  app.js        scene controller, input, canvas loop, deep links, sources drawer
```

## Motion rebuild (2026-10-25)

All 31 renderers (34 scenes, including parameterized variants) were rebuilt on
`RIG3D`. The site stays framework-free and buildless. Scene IDs, order, data,
source citations, locale fallback, audio, deep links and camera gestures retain
their existing contracts.

- Dark shaded solids, lit insets, grounded instrument decks and deliberate
  entrance easing replace the previous compositions. Each scene keeps a
  distinct topology and motion that explains the relationship it illustrates.
- `VISUALS.draw` still accepts its original arguments. An optional final
  `{ x, y, width, height }` viewport lets the controller reserve space between
  the actual header, text panel and footer. Portrait screens place the drawing
  above and behind the translucent, independently scrolling text; desktop and
  suitable tablet landscape screens use two columns.
- Perspective scaling fits both dimensions. Projected labels retain a readable
  minimum size, stay inside the viewport and seek nearby free positions with
  leader lines when the camera would otherwise stack them.
- Color shading accepts hexadecimal, RGB and RGBA tones. Nested alpha composition
  retains transparency instead of producing invalid color channels.
- `?still=1` now freezes Canvas as well as CSS. Both static and reduced-motion
  rendering use a deterministic, fully revealed frame at four seconds; camera
  gestures remain available. Changes to the OS motion preference apply immediately.

### Verification

From the repository root, run `node tests/rig3d.test.cjs` for color composition
and short-viewport projection regressions.

For integration checks, serve `site/` on `127.0.0.1:8096`, launch a dedicated
Chrome with `--headless=new --remote-debugging-port=9236` and a temporary user-data
directory, then run `node tests/browser.mjs`. The test uses native Node WebSocket
and Chrome DevTools Protocol, with no npm dependencies. It checks real Canvas
pixels for distinct scenes, motion, camera response and static determinism;
projected-label overlap at three camera poses; all 34 scenes in Japanese,
English and Arabic plus landscape; the source drawer, camera persistence and
all twelve locale selections. Screenshots and the verification report go to
`/tmp/infosec-motion-rebuild-artifacts` (override with `MOTION_ARTIFACTS`).

## Resource ownership and symbolic entry

The root entrance is an inline SVG key and lock, with an accessible native button.
Only `audio.js` and `entry.js` load initially: no scene data, engine, Canvas raster
allocation or media request until intent. Tap/Enter/Space turns the key, lifts the
shackle and reveals the briefing after a finite 1.25-second sequence. Reduced
motion skips the decorative delay. Asset failures expose a retry control. Scene
deep links and `?still=1` bypass the entry and keep audio off until interaction.
The fixed top-right GitHub SVG links to the source repository in all layouts.
The decorative entry backdrop is derived from the supplied `img-map/map.png`:
`images/entry-map-{768,1440}.webp` provides phone/large-screen variants (about
53/139 KB). A noninteractive picture layer and gradient veil keep the key clear;
portrait phones use a centered regional crop. No new animation loop is added.

`render.js` owns the only Canvas RAF chain. Normal playback targets 30 fps (24
with Save-Data or at most four logical cores); manual motion targets 60 fps.
Sustained draw cost can reduce quality. The Canvas covers only the diagram area,
with at most 1.5 million backing pixels (6 MB RGBA). Static/settled reduced motion,
locked entry, open source drawers and hidden pages perform no recurring draws.
Hidden pages suspend audio while preserving the sound preference and animation
time. BFCache restores resume; a discarded document releases its Canvas and audio.
Color, text measurement, circle geometry, noise buffers and SFX voices are bounded.

Run `node tests/entry.mjs` and `node tests/resources.mjs` against the same local
server/Chrome setup for deferred loading, unlock/retry, native keyboard links,
frame budgets, visibility/audio suspension, BFCache and resource disposal.
`tests/browser.mjs` also checks ten phone/tablet/desktop layouts, translucent
phone layering, top-right GitHub placement and slow idle orbit.

## Run it locally

```bash
cd site && python3 -m http.server 8088
# http://127.0.0.1:8088/          start screen (tap to begin, audio starts on the tap)
# http://127.0.0.1:8088/#9        jump to scene 9
# http://127.0.0.1:8088/?still=1#9   static render (no entrance animation) — screenshots, low-motion
# http://127.0.0.1:8088/?tilt=0.6,0.2&lang=ja#6   preset the 3D angle (debug / sharing a view)
```

`#N` and `?scene=N` deep-link to a scene, and `?still=1` disables entrance animations. Both
exist so a single panel can be shared or screenshotted.

## Deploy

```bash
npx wrangler pages deploy site --project-name 2026-incident-briefing --branch main
```

Use the existing Wrangler OAuth login where available. An obsolete API-key environment
file can override that valid login; on 2026-10-25 the stored cf-briefing key was rejected
and the existing OAuth login succeeded. Unset invalid API-key/email/token overrides
when using OAuth. Wrangler also accepts `CLOUDFLARE_API_KEY` + `CLOUDFLARE_EMAIL` (legacy global key) or a scoped
`CLOUDFLARE_API_TOKEN`. **Do not commit the credentials** — they live outside the repository.

## Audio

BGM is the user-supplied `infosec.mp3`, optimized as stereo Opus (80 kb/s VBR)
and MP3 (VBR q5, 44.1 kHz) fallback in `audio/`. Embedded artwork and metadata
are removed. The looping media element starts after a user gesture and streams
through the existing music gain; SOUND/M pauses/resumes it and mutes SFX.
SFX remain synthesized. No generative BGM scheduler runs.

## The 10-23 postscript (eight scenes, 18-25)

Added after the broad sweep in `docs/21`: the deck keeps its chronological body and appends a
postscript, because these are **not** new incidents — they are older CVEs whose meaning changed.

- **18 `infinity-core`** (`visual: core`) — six satellites firing into a hex kernel core, with an
  exit to `HOST ROOT` that lights as the strikes land. The date chip says `10.16` (the disclosure)
  while the deck reads it on 10-23; the lede says so explicitly.
- **19 `blindspot`** (`visual: channels`) — four columns: published / modified / feeds, then the
  disclosure channel. The marker falls between the first three and is caught by the fourth.
- **20 `ecosystem`** (`visual: stack`) — a drifting deck of GitHub advisories; `NO CVE` is stamped
  on the two Next.js criticals that have no CVE id.

Scenes 21-24 came with `docs/22` and are `ja`/`en` inline in `data.js`; scene 25 with `docs/23`:

- **21 `node2shell`** (`visual: decode`) — two entry paths into the decoder Node.js bundles, one
  path that never reaches it, and a marker file that appears in the process only after the crafted
  block lands. The fixed build sits on the same wire, labelled `FORMAT ERROR`.
- **22 `prepatch`** (`visual: before`) — the axis is time, and the first attempt sits four days to
  the left of `PATCH`; the numbers above it are the first 24 hours of attempts, not compromises.
- **23 `filters`** (`visual: funnel`) — three cards (CVSS 4.0 only, CNA, CNA) hit the
  `cvssV3Severity=CRITICAL` gate and bounce back as `0 ROWS`; one primary-scored card passes.
- **24 `wide`** (`visual: ledger`) — four incidents the CVE lists did not name, each row marked
  through the news channel on the left and verified against the vendor page on the right.
- **25 `php-next`** (`visual: checklist`) — the four conditions of `CVE-2026-115560` in two
  columns: all four ticked on the left, the last one crossed off on the right, where the one-line
  mitigation sits. PHP calls the setup unlikely; the scene does not upgrade that to "safe".

All eight are `ja`/`en` inline in `data.js`. The other ten locales fall back to English for these
scenes (field-by-field fallback, by design) until someone translates them; `i18n/<code>.js` gains
eight entries each when that happens.

## Camera (drag / swipe / double tap)

`app.js` keeps a `tilt`/`tiltTarget`/`vel` triple and pushes it into `VISUALS.setTilt()`; `rig3d.js`
adds it to every scene camera and re-projects the geometry. There is no screen-space skew any
more: turning the view moves real solids, changes the shading of each face, and re-sorts the
depth queue.

- **Tap** (no movement, < 700 ms) advances.
- **Drag / swipe** steers yaw ±4π rad and pitch ±0.62 rad on top of the scene's own angle. The
  angle is applied synchronously on input, so it responds even when `requestAnimationFrame` is
  throttled.
- **Release keeps the manual offset**, and a flick coasts on time-corrected inertia. The
  offset carries across scenes. Slow automatic orbit resumes after 2.5 seconds without input.
- **Double tap** springs the camera back to the scene's own angle. While the view is tilted, a tap
  is latched for 240 ms so the second tap can mean "reset" instead of advancing twice.
- **Press and hold** (300 ms) switches to a continuous turn with a slow pitch sway until release;
  the angle it ends on is kept.
- The camera never drops level with a scene's floor plane: renderers use positive pitch in the engine’s y-down coordinates, with
  `pitchMin` / `pitchMax` bounds on the total so a floor grid cannot collapse into a line at the end of a drag.

Swipe no longer changes scenes (that gesture belongs to the camera); the next/prev buttons, the
rail and the keyboard still navigate.

## Phone layout

The page is viewport-locked (`height:100dvh`, one screen, no page scroll) and the **text panel is
its own scroller**: `@media (max-width:720px)` tightens type instead of hiding copy, and when a
scene's copy does not fit — common on landscape phones — the panel scrolls and a `▾ 続き / more`
chip appears until you reach the end. The phone/tablet portrait panel uses translucent backgrounds with fully opaque text,
so the diagram remains visible underneath. Text scroll does not rotate the camera; each scene
resets to the top of its own text. The language preference survives scene changes.

## Languages (12)

English, 日本語, 中文（简体）, 한국어, Español, Français, Deutsch, Português, Русский,
العربية, हिन्दी, Bahasa Indonesia.

- The pull-down is a native `<select>` (native picker on phones); the list comes from
  `LANGUAGES` in `data.js` (code, native name, BCP-47 tag, direction).
- `ja` and `en` live inline in `data.js`; the other ten are **lazy-loaded** from `i18n/<code>.js`
  on first selection, so the initial page stays small. Any field a locale omits falls back to
  English, so a partial translation degrades field by field instead of breaking the page.
- `ar` switches the document to `dir="rtl"`; the panel border side, list bullets, the pull-down
  caret and the diagram offset all flip (the canvas moves to the opposite side of the panel).
- Adding a language is one entry in `LANGUAGES` plus one `i18n/<code>.js` with the same scene
  ids; nothing else needs to change.
- Careful: a scene has its own `id` field, so the Indonesian code `id` is looked up with a
  type guard in `copyFor()` — otherwise it resolves to the scene's id string.

## Bilingual (JA / EN)

Every scene carries `ja` and `en` copy in `data.js`; numbers, visuals and audio cues are shared.
The HUD switch (or `L`) flips language without restarting the scene, remembers the choice in
`localStorage` only after optional-preference consent, and honours `?lang=en` / `?lang=ja`. The default follows `navigator.language`,
so a Japanese browser opens in Japanese and everything else in English. `<html lang>` is updated
with the text, and the rail's aria-labels follow too.

## Sharing and discovery

- `og.png` — 1200×630 social preview, generated locally with PIL (HUD frame, title, radar arc).
  Regenerate it by re-running the snippet in the commit message if the headline changes.
- `index.html` carries `og:*` and `twitter:*` tags plus **12 `hreflang` alternates** and an
  `x-default`, so each `?lang=` URL is understood as the same page in another language.
- `sitemap.xml` lists the twelve language URLs with `xhtml:link` alternates; `robots.txt` points at
  it. Hash fragments (`#9`) are not separate pages, so they are deliberately not in the sitemap.

## Content rule

The copy in `data.js` is a summary of `docs/` in the parent repository, which cites primary
sources. Every scene lists its own sources in the SOURCES drawer. Fourteen of the fifteen
October items are verified; ConnectWise is carried as **unverified** and the site says so.

## October 24 broad update (eight scenes, 26–33)

Eight JA/EN scenes precede the closing scene: scope, exploited Arista/Collabora,
Pillow/Wasmtime/Laravel/Echo, Ruby/Perl/NGINX, AI/MCP, Japanese business systems,
HPE/industrial devices, and trust/credential checks. Each update has a dedicated
Canvas composition in `visuals.js`:

| Scene | Renderer | Motion |
|---|---|---|
| 26 scope | `intelConfluence` | Five source channels converge on a layered hexagonal register |
| 27 exploitation | `exploitIsolation` | Two request streams terminate at patch barriers |
| 28 packages | `packageBoundaries` | Image, Wasm, token and proxy chambers animate independently |
| 29 runtime | `bundledLayers` | Isometric application/runtime/library stacks receive patch sweeps |
| 30 agents | `agentPermissions` | Agent requests pass identity, TLS, vault and model gates |
| 31 Japan | `domesticRoutes` | Schematic archipelago routes traffic through an API access gate |
| 32 devices | `firmwareFleet` | Five release-line racks receive firmware streams and scan sweeps |
| 33 trust | `trustRenewal` | Certificate, boot and credential checks separate revoked artifacts |

Motion illustrates relationships, not live attack telemetry. The Japan outline
is a locator, not an attribution of incidents to cities. Eight warning glyphs
in the HPE scene count maximum-score CVEs, not compromised devices. All eight are
built from 3D primitives in world space (nested boxes, barrier planes, slab
stacks, a tilted map plane), respond to the camera, and retain complete geometry
when reduced motion fixes their timeline at four seconds.

The update summarizes `docs/24-snapshot-20261024` and its 24-group structured
register. The 17 recent KEV additions and full collection windows remain in the
detailed snapshot. New scenes fall back to English in the other ten locales;
those locales explicitly label the eight new scenes as English. Existing scene
numbers are preserved through #25; the closing scene moves to #34.

## October 25 content update (six scenes, 34–39)

The 16:34 JST cutoff review adds six JA/EN scenes before closing: priorities,
Fortinet hardening, Java/Python trust, DNS, cloud permissions and bundled copies.
There are now **40 scenes**. Existing parameterized 3D compositions illustrate
the relationships; motion does not show live attack telemetry. Earlier scene
IDs remain stable; closing moves from #34 to #40. Ten other locales label the
new addendum as English and use the existing fallback.

`update-20261025.html` provides a readable static Japanese response table, linked
from the locked entrance, without unlocking, JavaScript or audio. The primary
canonical host is now `infosec-briefing.yomiplush.dev`. Older factual snapshots
remain historical; October 25 sources supersede the old ConnectWise uncertainty.

Source: `docs/25-snapshot-20261025{,.ja}.md`, two research notes and
`data/2026-10-25/`. The 99/5,432 NVD counts use fully paginated, fixed-window
queries; rolling collector output is kept separately with its limitations.

## Patch link and Brotli post follow-up

The top-right amber bandage icon links to Patch the Planet, beside GitHub. Both
are native 44px links available before unlocking, with accessible names and
keyboard behavior that does not unlock or advance the briefing. Mobile headers
reserve the first row for the two links.

The requested HTTP2Shell post now has a verified, bilingual scene #40; closing
moves to #41. The static response page gains a `#brotli-post` section. There are
**41 scenes**. `docs/26-brotli-http2shell{,.ja}.md` and the follow-up metadata
distinguish the same Brotli CVE from HTTP/2 protocol flaws and record Envoy/Istio
versions, client-decode conditions, support status and source uncertainty.

## Privacy and browser storage

`/privacypolicy` is a dedicated Japanese/English notice. `privacy.js` and
`privacy.css` run on the briefing, report and policy pages without third-party
CMP scripts or network calls. The persistent footer links to the notice and
reopens equal-prominence accept/reject choices. Continued browsing is not consent.

Only language persistence is optional; no analytics or advertising was added.
The existing `briefing-lang` value is now accessed through `PRIVACY`, which keeps
it off before consent and removes legacy/withdrawn/expired values. The necessary
`briefing-consent` record stores version, boolean choice and timestamps for 180
days, including rejection. Expiry is enforced on loading/access rather than
assuming localStorage expires automatically. Denial of browser storage keeps
choices in memory. Provider security processing is disclosed separately and is
not claimed to stop when optional preferences are rejected.

Run `node tests/privacy.mjs` against the local :8096 / Chrome CDP :9236 setup.
It covers prior blocking, actual preference persistence, rejection, withdrawal,
expiry, malformed data, unavailable/quota-limited storage, cross-page state and
responsive choices. Primary reference notes are in `docs/privacy-source-notes.md`.

### Brave preference panel regression

Brave 155.1.97.59 reproduced a visible script-created consent panel being hidden
on production (`hidden=false`, computed `display:none`, empty rectangle).
EasyList Cookie includes both `###privacy-banner` and `##.privacy-banner`:
https://secure.fanboy.co.nz/fanboy-cookiemonster_ubo.txt . Brave documents default
Cookie notice filtering at https://brave.com/privacy-updates/21-blocking-cookie-notices/ .
The site-specific component is now named `briefing-preferences`, including the
briefing gesture exclusion. It does not override injected filter styles or change
Shields settings. Optional storage remains off until explicit acceptance; saved
choices can be reopened through the persistent Cookie settings control.

For a separate Brave CDP profile listening on 9237, run
`CDP_PORT=9237 node tests/privacy.mjs`. The regression applies the two exact generic
selectors above, checks visible choices and reopening, and retains storage and
responsive checks. Browser, entry and resource checks also accept `CDP_PORT`.

## October 25, 23:18 JST — Tailworm special and nightly review

The briefing now has **49 scenes**. Stable scenes #1–40 are retained; #41–46
cover Tailworm scope, SSH privilege boundaries, headscale, experimental conn25,
Serve/Funnel and response; #47–48 cover the fixed-window delta and ConnectWise’s
14:00 UTC restoration update. Closing moves to #49. Eight dedicated 3D renderers
illustrate prerequisites and controls, not live attack activity. All support
camera gestures and deterministic reduced motion. New copy is JA/EN; the other
ten locales use English fallback with the current cutoff shown.

The large native Tailworm entry links to `tailworm.html` before unlocking or
loading scene code/music. The static special and `update-20261025-2318.html`
work without the briefing runtime. Researcher findings, vendor confirmation,
unresolved fixes and observed exploitation remain separate. In particular,
Tailscale 1.104.2 is not labeled a Tailworm fix.

Run `node tests/tailworm.mjs` against the existing local server/CDP setup for
entry visibility, four widths, static action access, deferred audio and six
bilingual deep links. `tests/browser.mjs` covers all49 scenes, 196 renderer-size
combinations,10 layouts and12 locales. Sources and captured response hashes
live under `data/2026-10-25-2318/`; reproduce the fixed cutoff collection with
`python3 tools/intel/snapshot-2318.py` (network required, later content revisions).


## October 26 — daily reading companion and morning review

`python3 tools/build-daily.py` generates the latest report, date archive and ten static dated pages from `data/2026-10-26-1027/daily-record.json`. No network or dependencies. All reading content and date navigation work without JavaScript; only the existing privacy preferences script is included. The existing lock/audio loading contract is retained. The four new motion scenes distinguish evidence/attribution, the .NET socket repair, embedded PHP and dated records. JA/EN copy; other locales fall back to English with the current cutoff.

`node tests/daily.mjs` checks the ten-day reading journey without JS, source links, date state, four widths, current entry and scene #49. The existing browser suite checks all 53 scenes and renderer combinations. Run CDP/browser tests sequentially because they share a browser tab. Source notes and collection manifest are under `docs/` and `data/2026-10-26-1027/`; use `python3 tools/intel/snapshot-1027.py` for a fixed-window re-fetch with current revisions.
