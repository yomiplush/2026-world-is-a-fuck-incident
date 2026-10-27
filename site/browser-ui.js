/* Optional browser compatibility. No storage, network calls or fingerprint probes. */
(function () {
  'use strict';
  const root = document.documentElement;
  const ua = navigator.userAgent || '';
  if (/OculusBrowser|Quest Browser/i.test(ua)) root.dataset.device = 'quest';
  if (/Android TV|GoogleTV|Smart-TV|HbbTV|\bBRAVIA\b|\bSHIELD\b/i.test(ua)) {
    root.dataset.device = 'tv';
    const panel = document.getElementById('panel');
    if (panel) { panel.tabIndex = 0; panel.setAttribute('aria-labelledby', 'title'); }
    // Left/right leave the language field; up/down retain native selection.
    window.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key) || event.defaultPrevented) return;
      const active = document.activeElement;
      if (active?.matches('input,textarea,[contenteditable]') ||
          (active?.matches('select') && ['ArrowUp','ArrowDown'].includes(event.key))) return;
      const scope = document.querySelector('dialog[open]') || document.querySelector('.briefing-preferences:not([hidden])') ||
        document.querySelector('.drawer.open') || document;
      const candidates = Array.from(scope.querySelectorAll('a[href],button:not(:disabled),select:not(:disabled),[tabindex="0"]')).filter(el => {
        const r = el.getBoundingClientRect();
        return !el.closest('[inert],[hidden]') && getComputedStyle(el).visibility !== 'hidden' &&
          r.width > 0 && r.height > 0;
      });
      if (!candidates.length) return;
      event.preventDefault();
      if (active === panel && ['ArrowUp','ArrowDown'].includes(event.key)) {
        const sign = event.key === 'ArrowUp' ? -1 : 1;
        const canScroll = sign < 0 ? panel.scrollTop > 0 : panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        if (canScroll) { panel.scrollBy(0, sign * panel.clientHeight * .65); return; }
      }
      if (!candidates.includes(active)) { candidates[0].focus(); return; }
      const box = active.getBoundingClientRect();
      const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      const sign = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      let best, score = Infinity;
      for (const el of candidates) {
        if (el === active) continue;
        const r = el.getBoundingClientRect();
        const dx = r.x + r.width / 2 - box.x - box.width / 2;
        const dy = r.y + r.height / 2 - box.y - box.height / 2;
        const forward = sign * (horizontal ? dx : dy);
        const distance = forward + Math.abs(horizontal ? dy : dx) * 3;
        if (forward > 1 && distance < score) { best = el; score = distance; }
      }
      if (best) best.focus();
    });
  }
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
