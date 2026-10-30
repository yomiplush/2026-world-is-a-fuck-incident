# English search discovery

The English research entrance is `/en/`. It links to complete static English
reports and reference pages; `/` remains the multilingual visual briefing.
These are different entrances, not a translated pair. Existing `.en` article
URLs, self canonicals, and reciprocal Japanese/English article alternates stay
in place.

`tools/publish-site.py` generates the entrance, English homepage links,
`feed.en.xml`, metadata, and the sitemap. Only complete published English
articles enter the English feed. English reading pages advertise and link to
that feed. Rebuild everything with `npm ci` followed by `npm run build`.

## Editing search copy

Edit `content/english-seo.json` for the hub title/description and targeted English
page overrides. Overrides apply to title, meta description, social previews,
and JSON-LD together. Keep copy factual and aligned with the visible article.
The October transcript title refers to the content's historical month; change
that record only when the transcript itself changes scope. A new latest report
is picked up automatically from `data/latest.json`, without reusing a previous
report's title override.

## Verified publication dates

`content/publication-dates.json` is intentionally empty: research cutoffs and
source-advisory dates do not establish when this site published an article.
Add a record only when actual publication/update timestamps can be verified
from deployment/editorial history. Record the evidence in the corresponding
editorial note. Each language is published independently; do not copy a
Japanese publication time to an English translation without evidence.

The record shape is a canonical path mapped to `published` and optionally
`modified`, both ISO 8601 timestamps with explicit timezone offsets. For example,
a path `/update-YYYYMMDD-HHMM.en` has a `published` value and a `modified` value
only if that version was substantively updated. Do not use build time or a
research cutoff. Dates without timezones, a modification without publication,
and modification preceding publication fail the build.

Verified dates appear visibly in the article and in Article JSON-LD. Sitemap
`lastmod` uses the verified modification time, or publication for an unchanged
article. RSS `pubDate` uses the verified publication time. Records lacking
verified dates omit these optional fields. Translation extraction skips the
generated date labels, so adding dates cannot invalidate saved translations.

## Validation

```sh
npm run build
python3 -m unittest discover -s tests -p '*_test.py'
node --test tests/*.test.cjs
npm run check:assets
```

The browser smoke test uses the same optional Playwright dependency as existing
browser gates. With Playwright available to Node and a Chromium executable:

```sh
INFOSEC_BROWSER=/path/to/chrome node tests/english-discovery-browser.cjs
```

It checks four viewports, static English links, route availability, horizontal
overflow, entrance-control overlap, and explicit English URLs in a Japanese
browser. `INFOSEC_SCREENSHOTS` optionally saves English hub screenshots.

## Next editorial work and measurement

Prefer original product-specific research explaining affected versions,
exploitation evidence, available fixes, response checks, and primary sources.
Keep daily reports as dated records; build individual topic pages only where
independent investigation provides lasting value. Avoid mass-producing pages
that merely paraphrase an advisory.

After deployment, inspect `/en/` and a representative English article with
Search Console URL Inspection, then submit the updated sitemap. Save an initial
28-day baseline of English-URL impressions, clicks, queries, and countries.
Review crawl discovery after 7 days and search trends after 28 and 56–90 days.
Neither English copy nor structured data guarantees indexing or higher rankings.
Search Console submission and production deployment must be confirmed separately
from a successful local build.

Official references: [multilingual URLs](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites),
[language alternatives](https://developers.google.com/search/docs/specialty/international/localized-versions),
[Article metadata](https://developers.google.com/search/docs/appearance/structured-data/article),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Search Console submission, language-sitemap monitoring, and the English URL
performance filter are documented in [the Japanese runbook](search-console.ja.md).
