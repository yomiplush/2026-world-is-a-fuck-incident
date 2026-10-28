# Phone portrait spacing in X-style web views

User reported that the iPhone13 X app browser felt cramped and explicitly permitted phone-only font reductions. The portrait<=600px layout now uses one header row,14px body text with1.55line-height,21px headings,16px dates, smaller gaps and44px minimum control targets. The redundant header label and GitHub corner icon are removed during the briefing; the repository remains linked from the sources drawer, and both entrance corner links remain available. The patch link, language, audio and sources stay on the first row. The text panel has a less transparent background to reduce diagram/text interference.

The document remains responsive to visualViewport changes and safe-area insets. No new runtime JavaScript, storage, network dependency or translation service is introduced. Desktop/tablet and landscape rules remain in place.

Evidence:

- Test-first reproduction at320x480 visible pixels,60px toolbar offset,47px/34px safe areas: header111px, text panel59px, body16px/28.8px line height.
- After adjustment: header55px, panel152px, body14px/21.7px line height. The same152px panel is confirmed at390px width (iPhone13 CSS width).
-12phone width/visible-height combinations:320/360/390/430px and480/600/680px; every text panel>=150px, reachable controls and working text toggle.
- Existing13-size text-toggle suite and multi-language responsive/source-drawer suite passed, as did X-style entry/notch checks.
- Production build,25Python tests,12Node suites and asset-currentness validation passed. Read-only review found no must-fix issues.
- Tests use Chromium emulation. Physical iPhone13 and actual X/WKWebView were not available.

A plain static server initially failed the extensionless `/impact` route check. Rechecking against a local server supporting production-style clean URLs passed; this was a test-server routing mismatch.

Published runtime: `a8cd48bc38bf64f9b5b77a1ccded6a0da3fb463f`; Cloudflare Pages production deployment `b3ee18b2` (https://b3ee18b2.2026-incident-briefing.pages.dev). Production HTML and current/previous CSS match local artifacts. The full12-condition phone spacing suite also passed against https://www.infosec-briefing.net/ after publication.
