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

Production source and live verification are recorded after publishing.
