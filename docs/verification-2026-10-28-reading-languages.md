# Reading languages and X-style viewport verification

Delivered native Japanese/English language selectors for 27 reading-page pairs, including impact, dated articles, review reports, about, language directory, policy and existing motion transcript. Existing database/Tailworm languages remain available. Latest English database now matches the 65-topic Japanese snapshot at2026-10-28T04:18:44Z.

Offline article memory contains2,089 source strings plus transcript shell additions; latest database has299 translated fields. Numbers, dates and CVE/GHSA identifiers checked. AI translation, not native-speaker proofreading. No runtime translation API or paid external service added. Complete text is served as staticHTML; native links support no-JavaScript readers.

X-style viewport regression reproduced entry links hidden above visualViewport.offsetTop=60, then passed after CSS fix. Landscape safe-area override left/right44px and bottom21px passed. Reading pages keep native scrolling,16px selects, touch targets and safe-area padding. These are automated Chromium simulations with iPhone/Android X-style UAs and viewport conditions, not a physical X-app/WKWebView certification.

Verification:

- Python22tests passed.
- Existing12Node regression files passed.
- Article dropdown tests:6routes x3X-style viewports; Japanese/English round trips; no horizontal overflow; no-JavaScript language links.
- X-style toolbar offsets and landscape notch area passed.
- Existing15-language UI regression passed at4sizes, including archived database languages and Tailworm.
- Asset manifest check passed; initial motion entry still3requests. Published previous CSS705c7e2cc103 retained.
- Read-only review found Japanese transcript shell text and incorrect rewriting of hreflang links; both fixed and identity regression checks added. Link localization now changes anchors only. English404 remains noindex and outside sitemap.

## Production

Sourcecommit32b553970b53136230e618b772e37830db249298; CloudflarePages release6a4ff4f4.

Live article language tests passed:6routes x3viewports, Japanese/English dropdown round trips and no-JavaScript links. Live X-style toolbar and landscape safe-area tests passed. ImpactJA/EN, latestEnglishreport and latestEnglishDB match localSHA-256. Englishpolicy matches after normalizing email_off comments removed by the host; visible markup and email links are unchanged. PublishingCSS matches local bytes. No physical X-app/WKWebView run was available.

