/* Native language navigation; complete translations are also readable without JS. */
(function () {
  const current = document.documentElement.dataset.locale;
  const select = document.getElementById('lang-select');
  if (!select) return;
  const codes = Array.from(select.options,option=>option.value);
  if (!codes.includes(current)) return;

  function targetURL(code) {
    const target = new URL(location.href);
    target.pathname = target.pathname.replace(/tailworm(?:\.[a-z]{2})?(?:\.html)?\/?$/, code === 'ja' ? 'tailworm' : 'tailworm.' + code);
    target.searchParams.set('lang', code);
    return target;
  }
  const query = new URLSearchParams(location.search).get('lang');
  const preferred = window.BRIEFING_LANGUAGE ? window.BRIEFING_LANGUAGE.initial(current) :
    (codes.includes(query) ? query : current);
  if (preferred !== current) { location.replace(targetURL(preferred).href); return; }

  select.disabled = false;
  select.value = current;
  document.documentElement.classList.add('has-language-select');
  window.TAILWORM_LANGUAGE_READY = true;
  select.addEventListener('change', () => {
    const code = select.value;
    if (!codes.includes(code)) return;
    try { if (window.PRIVACY) window.PRIVACY.setLanguage(code); } catch (_) { /* navigation still works */ }
    if (code !== current) location.assign(targetURL(code).href);
  });
  // Restore native select state after browser Back/Forward cache restoration.
  window.addEventListener('pageshow', () => { select.value = current; });
})();
