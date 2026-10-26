# Brave UI compatibility

Brave desktop was tested directly using `/opt/brave-bin/brave` with a temporary profile. The existing 66 responsive control checks passed before this change, so the user's original issue has not been established as a Brave-specific engine defect. This change supplies the requested conservative Brave composition.

`browser-ui.js` enables `data-browser="brave"` only when the browser explicitly identifies itself using its Brave brand or `navigator.brave.isBrave()`. Unavailable or rejected identity APIs retain the standard layout. No storage, fingerprinting probe, or external request is used. Automatic identification is best-effort. The explicit link `/?ui=brave` also selects the compatibility layout when browser identity is unavailable, including iOS.

`brave.css` applies opaque copy and drawer surfaces without backdrop filtering. In stacked layouts the renderer bounds end above the text panel; on very short viewports, an unusably small diagram is hidden so text and controls remain accessible. Desktop split layouts preserve their side-by-side composition. Shields and user content-blocking preferences are not changed.

Validation:

- Real Brave: 54 combinations of three scenes, three languages and six viewport sizes, including automatic compatibility activation and non-overlapping visible diagram/copy bounds.
- Real Brave: all 66 responsive control/drawer checks and privacy consent tests pass.
- Real Brave: 244 render combinations and all 61 scenes at ten viewport sizes pass, including camera, keyboard, audio and reduced-motion checks; no browser exceptions.
- Chrome: seven viewport and dynamic visible-area checks pass with the standard layout.
- Detection tests cover explicit API, brand/API deduplication, non-Brave browsers and blocked/rejected APIs.
- Existing Node and Python suites pass; dedicated Brave screenshots inspected at 390×844 and 1440×900.

These are desktop Brave tests with emulated mobile viewport dimensions, not physical Android or iOS device tests.
