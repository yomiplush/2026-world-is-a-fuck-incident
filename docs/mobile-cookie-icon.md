# Mobile motion privacy control

On phone-sized motion pages, the permanent bottom privacy-policy/settings dock is replaced by a44px top cookie button. It keeps an accessible Cookie settings label, expanded state and keyboard focus return. The existing settings panel contains the privacy-policy link and equal accept/reject controls. The initial choice panel remains; no consent or storage behavior changes. Reading pages and desktop retain the existing text dock. The entry screen retains its existing hidden settings-dock behavior.

On mobile motion screens the cookie icon reuses the corner-link position; GitHub remains accessible from the sources drawer. Bottom padding drops from54px to12px plus safe-area inset. At390px width and480px visible height with60px viewport offset and47/34px safe areas, the text window grows from152px to194px. Existing text transparency and hide/show controls remain.

Validation: new test first failed against the bottom dock, then passed for4phone portrait/landscape sizes,44px hit targets, policy access, rejecting settings, returned focus and source-drawer close-button hit tests. Existing12phone spacing cases,13text-toggle sizes, multi-language responsive/source-drawer checks,25Python tests and12Node suites passed. Asset generation/currentness checks passed. Review and responsive tests identified the cookie covering the source close button; the icon now uses z-index26 below drawer30. Hidden policy-link specificity also overrides the common touch display rule. Browser waits now require the exact destination document and completed load.

These are Chromium emulations, not physical X/WKWebView device tests.
