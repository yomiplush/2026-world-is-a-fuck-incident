# Google Translate consumer language coverage — 2026-10-26

The public **consumer Google Translate website picker exposes 249 target language codes** in this observed snapshot. Its source selector also has `auto` (“Detect language”), which is not a target language and is excluded. The count comes from the actual public UI, not the paid Cloud Translation API's language list.

## Reproducible catalog

- Catalog: [`content/google-translate-languages.json`](../content/google-translate-languages.json).
- Fetch/parser: [`tools/fetch-google-translate-languages.py`](../tools/fetch-google-translate-languages.py).
- Public sources: [English Google Translate website-mode UI](https://translate.google.com/?sl=auto&tl=en&op=websites&hl=en) and [Japanese Google Translate website-mode UI](https://translate.google.com/?sl=auto&tl=en&op=websites&hl=ja).
- Both UI responses expose exactly the same set of 249 target codes. English and Japanese labels are extracted from `role="option"` elements bearing `data-language-code`, using their visible label text. Duplicate menus must agree. The parser excludes `auto`, checks nonempty labels, checks equality between UI locales and fails on incomplete/changed markup.
- JSON shape: `{sourceURL, sources: [{language, url, retrievedAt, sha256}], retrievedAt, targetCount, languages: [{code, en, ja}]}`. Retrieval timestamps and source SHA-256 hashes are recorded. In offline mode timestamps derive from the saved response files' modification times, not the replay time.

Refresh intentionally, outside the website runtime:

```sh
python tools/fetch-google-translate-languages.py
```

Replay this audit's downloaded public HTML without a network request:

```sh
python tools/fetch-google-translate-languages.py --html-dir /tmp --output /tmp/google-translate-catalog-replay.json
```

The offline directory must contain `google-translate-ui-en.html` and `google-translate-ui-ja.html`. The current raw responses are approximately 3 MB each and remain in `/tmp`; they are not shipped to visitors. The checked-in catalog is roughly 23 KB. No login, billing, token, translation request API, undocumented `translate_a` endpoint, or Cloud Translation API is used to obtain the list.

The UI provides English and Japanese labels here, not verified autonyms for every language. Do not invent native labels or imply those labels came from Google. The parent implementation can add local `Intl.DisplayNames` autonyms only when its locale is supported, preserving the Google English/Japanese label and exact code as searchable fallbacks. A browser's CLDR coverage is distinct from Google's translation coverage.

Preserve Google's **exact target codes**, including aliases and script/region variants such as `iw`, `jw`, `zh-CN`, `zh-TW`, `bm-Nkoo`, `mni-Mtei` and `ndc-ZW`. They are service identifiers; normalizing every code to a different ISO/BCP-47 spelling before constructing the outbound URL may change service behavior.

## Verified public website-translation link

Use an ordinary user-selected navigation to the consumer website translator:

```text
https://translate.google.com/translate?sl=auto&tl=TARGET&u=ENCODED_PUBLIC_PAGE_URL
```

Build the parameters with `URLSearchParams` so the nested URL's query/fragment is encoded correctly. Source language can also be explicit when known. This URL is a consumer navigation entry point, not a paid translation API contract.

Direct GET checks on 2026-10-26, with redirects disabled, verified:

```text
GET https://translate.google.com/translate?sl=auto&tl=af&u=https%3A%2F%2Fwww.infosec-briefing.net%2Ftimeline
302 Location: https://www-infosec--briefing-net.translate.goog/timeline?_x_tr_sl=auto&_x_tr_tl=af&_x_tr_hl=ja

GET https://translate.google.com/translate?sl=auto&tl=yue&u=https%3A%2F%2Fwww.infosec-briefing.net%2Ftimeline
302 Location: https://www-infosec--briefing-net.translate.goog/timeline?_x_tr_sl=auto&_x_tr_tl=yue&_x_tr_hl=ja
```

Google's official help documents the consumer Websites workflow and switching target language on the translated page. It notes regional availability limits. It does not publish an immutable URL-parameter API contract or guarantee every combination of site, language and region. [Google Translate Help: translate websites](https://support.google.com/translate/answer/2534559?hl=en).

Keep the stable all-language fallback entry available: [Google Translate Websites](https://translate.google.com/?sl=auto&op=websites). When the catalog changes or a proxy translation is unavailable, users can select a target using Google's own current picker. Do not manufacture a `.translate.goog` hostname yourself; navigate through Google's consumer entry point and let Google construct its destination.

## Legacy widget status

An official Google Search Central post, updated **September 1, 2026**, states that support for the **Website Translator Widget ends October 1, 2026**. This affects the embedded widget. The precise announcement is about support ending; it does not establish that every existing widget endpoint immediately stops returning bytes on that date. [Google Search Central: Website Translator announcement and update](https://developers.google.com/search/blog/2020/05/google-translates-website-translator?hl=en).

The older widget paragraph still visible in generic Translate Help should not override the explicit, dated retirement notice. Use the consumer website translation flow rather than introducing `translate_a/element.js` or `google.translate.TranslateElement`. The requested implementation requires no Cloud Translation API enrollment or paid API calls.

## Integration implications

1. Keep the existing 12 built-in translations available locally and label them separately from **“Open with Google Translate”**. A destination using Google's automatic translation is not another reviewed local translation or a self-hosted language page.
2. A searchable modal can search exact code, Google English/Japanese labels, existing native labels and supported local autonyms. Names are more useful than country flags for multilingual and cross-border languages. Keep a clear “all languages on Google Translate” fallback.
3. Load the catalog locally or generate a compact local JavaScript asset at build time. Merely opening the language chooser should not fetch Google scripts, make third-party requests or require an API key. External navigation occurs only when the visitor selects it.
4. Provide a static HTML transcript of the briefing so every scene's text is available before any animation gesture. Google website translation cannot translate pixels already painted into Canvas, and translating the entry chrome does not supply the complete briefing. This is an inference from the site's Canvas/gesture architecture, not a Google promise about a particular page.
5. Link automatic translation to the relevant readable report or transcript, retaining useful URL fragments for context. Keep the original source URL available. Machine-translated security advice should preserve access to the original wording and primary sources.
6. No 249-language `hreflang` cluster should be advertised for outbound Google links. The site's own reciprocal language annotations remain limited to actual local translated pages.

This snapshot demonstrates the complete target list exposed by the observed consumer UI, not an indefinite guarantee that all 249 targets will remain available or that each individual page has been translated and validated. Two public redirect checks verify the link format; they do not test every language's translation quality or every proxy destination.
