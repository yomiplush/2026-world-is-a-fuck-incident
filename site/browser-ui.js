/* Optional browser compatibility. No storage, network calls or fingerprint probes. */
(function () {
  'use strict';
  function enableBrave() {
    const root = document.documentElement;
    if (root.dataset.browser === 'brave') return;
    root.dataset.browser = 'brave';
    window.dispatchEvent(new Event('briefingviewportchange'));
  }
  // Use the browser's explicit identity; Chromium's shared UA is not sufficient.
  try {
    // An explicit link also works when a browser suppresses its identity.
    if (new URLSearchParams(location.search).get('ui') === 'brave') enableBrave();
    if (navigator.userAgentData?.brands?.some(row => row.brand === 'Brave')) enableBrave();
    if (typeof navigator.brave?.isBrave === 'function') {
      Promise.resolve(navigator.brave.isBrave()).then(value => {
        if (value === true) enableBrave();
      }).catch(() => {});
    }
  } catch (_) { /* Identity may be unavailable under privacy settings. Keep the standard UI. */ }
})();
