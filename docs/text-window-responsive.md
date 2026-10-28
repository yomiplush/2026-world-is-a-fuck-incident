# Text window and responsive controls

The motion briefing offers a native Show text / Hide text button on phones, tablets and PCs. The text window starts visible. Hiding it expands the drawing area and removes the text-overflow hint. Scene navigation, source drawer and language changes preserve this in-page state; refreshing starts with the text visible. The native button stays reachable with touch or keyboard, uses aria-controls/aria-expanded, and its label follows the supported motion language. No persistent storage, runtime translations, dependencies or network requests are added.

The footer uses an explicit grid row so removing the panel cannot pull navigation into its space. Touch layouts share three navigation columns with at least44px targets. X-like short portrait viewports reserve the notch inset even under compact layout rules; this fixes an observed overlap between the upper corner links and the sources button.

Validation:

- New browser test first failed because the toggle was absent, then passed after implementation.
-13viewport sizes from320x480 to1920x1080, phone portrait/landscape, tablet portrait/landscape and desktop;4available motion languages represented.
- Real DOM toggle, scene navigation while collapsed, source drawer, Enter activation and retained focus, and larger desktop canvas.
- Simulated X viewport480px tall with60px offset and47px/34px safe areas, live rotation while collapsed with44px side/21px bottom safe areas, and pinch scale2 document-size invariance.
- Existing responsive controls and source drawer suite across5motion languages, language/retry/viewport-offset suite and X-style entry/safe-area suite passed.
- Read-only code review found no actionable defects. Review's requested live-resize coverage was added.

These are Chromium emulations of screen dimensions, touch, user agents, safe areas and visualViewport changes. Actual X app / WKWebView hardware testing was not available.

Production build and all25Python tests passed, as did all12Node regression suites. Initial delivery stays at3requests with49,985bytes of initial assets; motion code is205,684bytes (74,973gzip).

Published runtime commit: `764c7f7302618e4cee7c32d11d8802e1249b83d4`; Cloudflare Pages production deployment `462476b5` (https://462476b5.2026-incident-briefing.pages.dev). Production HTML plus both current and retained previous boot/motion/CSS assets match local files byte for byte (7URLs).

The complete text-toggle browser suite also passed against https://www.infosec-briefing.net/ after publication, including the X-style viewport/safe-area/rotation and pinch-zoom assertions.
