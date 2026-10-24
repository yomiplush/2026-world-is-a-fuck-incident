# Briefing site — `site/`

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
`CVE-2026-115560`: four conditions, one line, no emergency patch). **Drag or press-and-hold the
scene to tilt the 3D view** — release springs it back to the scene's own angle;
`?tilt=yaw,pitch` presets it.

```
site/
  index.html    markup + HUD (no build step, no framework)
  style.css     HUD/Briefing look, responsive, reduced-motion + ?still=1 static mode
  data.js       the 34 scenes: copy, numbers, per-scene sources
  visuals.js    23 canvas renderers (radar, chain, bars, clock, keys, leak, core, channels, stack,
                decode, before, funnel, ledger, checklist, …)
  audio.js      Web Audio synthesis: 7 SFX + a generative lofi loop (no samples)
  app.js        scene controller, input, canvas loop, deep links, sources drawer
```

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
set -a; . ~/.config/cf-briefing/env; set +a
npx wrangler@latest pages deploy site --project-name 2026-incident-briefing
```

Wrangler accepts `CLOUDFLARE_API_KEY` + `CLOUDFLARE_EMAIL` (legacy global key) or a scoped
`CLOUDFLARE_API_TOKEN`. **Do not commit the credentials** — they live outside the repository.

## Audio

Everything is synthesised in the browser; there are no audio files to license or ship.

- **SFX** (`audio.js`): short oscillator/noise bursts — `blip`, `whoosh`, `alarm`, `crack`,
  `confirm`, `glitch`, `boot`. Each scene declares a `cue`.
- **BGM**: a 72 BPM generative lofi loop — four Am9 / Fmaj9 / Cmaj9 / G6-9 voicings, detuned
  saw+triangle pads through a slow filter sweep and a 0.13 Hz tape-wobble LFO, sine bass,
  boom-bap kick/snare with swung 8th hats, vinyl noise plus random crackle, and a generated
  reverb impulse. Scheduled with a 140 ms lookahead so it does not drift.
- Audio only starts after a gesture (browser rule). `M` or the SOUND button toggles everything.

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

## Camera tilt (drag / hold)

`app.js` keeps a `tilt`/`tiltTarget` pair and pushes it into `VISUALS.setTilt()`; `visuals.js`
adds it to every camera's yaw/pitch, and applies a small skew/rotate/scale to the screen-space
renderers (radar, clock, matrix, storm) so every scene answers a drag, not just the 3D ones.

- **Tap** (no movement, < 700 ms) advances.
- **Drag** steers yaw ±1.1 rad and pitch ±0.5 rad. The angle is applied synchronously on input, so
  it responds even when `requestAnimationFrame` is throttled.
- **Press and hold** (280 ms) switches to a continuous turn with a slow pitch sway until release.
- Releasing springs back to the scene's default angle; changing scene resets it.

Swipe no longer changes scenes (that gesture now belongs to the camera); the next/prev buttons,
the rail and the keyboard still navigate.

## Phone layout

The page is viewport-locked (`height:100dvh`, one screen, no page scroll) and the **text panel is
its own scroller**: `@media (max-width:720px)` tightens type instead of hiding copy, and when a
scene's copy does not fit — common on landscape phones — the panel scrolls and a `▾ 続き / more`
chip appears until you reach the end. Animated assets are cached per deploy, so the scroll state
and the language survive scene changes; each scene resets to the top of its own text.

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
`localStorage`, and honours `?lang=en` / `?lang=ja`. The default follows `navigator.language`,
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
HPE/industrial devices, and trust/credential checks. Existing radar and matrix
renderers are reused; the 72-cell HPE visual counts CVEs, not attacks.

The update summarizes `docs/24-snapshot-20261024` and its 24-group structured
register. The 17 recent KEV additions and full collection windows remain in the
detailed snapshot. New scenes fall back to English in the other ten locales;
those locales explicitly label the eight new scenes as English. Existing scene
numbers are preserved through #25; the closing scene moves to #34.
