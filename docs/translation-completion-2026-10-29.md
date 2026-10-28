# Fifteen-language translation completion

The configured catalog remains English, Japanese, Simplified Chinese, Korean, Spanish, French, German, Portuguese, Russian, Arabic, Hindi, Indonesian, Ukrainian, Polish and Swedish. This work completes stored translations of the public website; it does not change the incident research cutoff.

- Reading pages: 26 original routes × 15 languages = 390 pages, including the full motion transcript, daily/update reports, timeline, editorial policy, language directory, privacy policy and localized not-found pages.
- Motion: all 65 scenes and shared UI in all 15 languages, with no missing-scene English fallback. The pre-existing English runtime/Brotli scene now includes the Japanese original's upper affected-version bound, below `0.023`.
- Current database, impact register and Tailworm pages retain their existing complete 15-language packages.
- All five stored database snapshots now have 15/15 validated packages. Source dates, register hashes and evidence links remain intact.
- Consent copy and policy navigation follow the page language. Arabic reading pages use RTL. Native selectors link to the same article, and metadata/canonical URLs identify each companion separately.

`data/article-translations/source.json` holds 2,852 deduplicated source strings, including supplemental motion/UI and historical database strings. Each of its 14 target stores has all required keys and retains the source ASCII number inventory and CVE/GHSA identifiers. Existing valid translations were reused. Missing translations used Google Cloud Translation v2 through existing authorized-user ADC; quota attribution uses the caller-supplied project. No OAuth credentials, access tokens or client secrets are stored in this repository. Some rejected direct translations were retried through the existing English store; package provenance identifies the English pivot. Four remaining outputs received focused editorial corrections to restore numbers/conditions. Machine output has not been reviewed by native speakers.

## Rebuilding and adding translations

The normal build materializes stored motion, consent and archived database packages before generating pages and hashed assets:

```sh
npm ci
npm run build
python tools/article_languages.py
```

If preparation reports new missing strings, use an authenticated, billing-enabled Cloud Translation project. Translation requests consume that project's quota and may incur normal API charges:

```sh
python tools/translations/google-articles.py --project PROJECT_ID
python tools/translations/repair-google-articles.py PROJECT_ID
npm run build
```

Inspect rejected outputs and verify them against the original rather than weakening validators. Reruns retain validated translation memory. The build never contacts a translation service; published pages require no translation API key or runtime translation request.

## Verification

```sh
python -m unittest discover -s tests -p '*_test.py'
node --test tests/*.test.cjs
npm run check:assets
node tools/check-motion-locales.cjs
```

Real Chrome/CDP browser checks cover all 975 language/scene combinations, corrupted-locale recovery, 84 reading-page/viewport combinations with localized consent labels, and 15-language database/impact navigation and RTL. Browser scripts use the existing local server on port 8096 and a dedicated CDP browser on port 9236:

```sh
CDP_PORT=9236 node tests/locale-loading.mjs
node tests/article-fifteen.mjs
CDP_PORT=9236 node tests/research-locales.mjs
CDP_PORT=9236 node tests/privacy.mjs
```
