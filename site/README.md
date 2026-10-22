# Briefing site — `site/`

A single-page, tap-to-advance motion-graphic briefing of the October 2026 incidents, in
chronological order. Built for phones first (tap / swipe), keyboard on desktop (space, arrows, M,
S). Deployed to Cloudflare Pages.

```
site/
  index.html    markup + HUD (no build step, no framework)
  style.css     HUD/Briefing look, responsive, reduced-motion + ?still=1 static mode
  data.js       the 15 scenes: copy, numbers, per-scene sources
  visuals.js    ~13 pseudo-3D canvas renderers (radar, chain, bars, clock, keys, …)
  audio.js      Web Audio synthesis: 7 SFX + a generative lofi loop (no samples)
  app.js        scene controller, input, canvas loop, deep links, sources drawer
```

## Run it locally

```bash
cd site && python3 -m http.server 8088
# http://127.0.0.1:8088/          start screen (tap to begin, audio starts on the tap)
# http://127.0.0.1:8088/#9        jump to scene 9
# http://127.0.0.1:8088/?still=1#9   static render (no entrance animation) — screenshots, low-motion
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

## Content rule

The copy in `data.js` is a summary of `docs/` in the parent repository, which cites primary
sources. Every scene lists its own sources in the SOURCES drawer. Fourteen of the fifteen
October items are verified; ConnectWise is carried as **unverified** and the site says so.
