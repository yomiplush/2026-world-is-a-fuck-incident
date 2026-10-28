# Japanese and English publication policy

The public site now supports only Japanese (`ja`) and English (`en`), as configured in `content/site-languages.json`. This applies to motion, reading pages, the database, impact pages, Tailworm, selectors and discovery metadata.

The offline build removes generated HTML, locale JavaScript and translation JSON for retired languages from `site/`. Public historical manifests are filtered to the active catalog. Translation source/history under `data/` and `content/` is retained; changing the publication policy does not delete historical research or its evidence. Old unsupported language query parameters fall back to an available language. Retired standalone translated routes are no longer published.

No Google Translation API request, API re-enablement or paid translation was used for this change. Existing English text was reused and a few short directory labels were edited locally. The incident research cutoff is unchanged.

Validation:

- `npm run build` and `npm run check:assets`, including a build with no `site/i18n` directory, as in a fresh checkout.
- `python -m unittest discover -s tests -p '*_test.py'`: 28 tests.
- `node --test tests/*.test.cjs`: 12 test files.
- `node tests/bilingual.mjs`: 48 page/language/viewport combinations, all 130 language/scene combinations, and retired-language fallback. Defaults to local site port 8096 and CDP port 9236; set `SITE_ORIGIN` to verify another origin.
