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
