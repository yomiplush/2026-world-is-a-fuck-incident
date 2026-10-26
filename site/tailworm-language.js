/* Native language navigation; complete translations are also readable without JS. */
(function () {
  const codes = ['en', 'ja', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'id'];
  const current = document.documentElement.dataset.locale;
  const select = document.getElementById('lang-select');
  if (!select || !codes.includes(current)) return;

  function targetURL(code) {
    const target = new URL(location.href);
    target.pathname = target.pathname.replace(/tailworm(?:\.[a-z]{2})?(?:\.html)?\/?$/, code === 'ja' ? 'tailworm.html' : 'tailworm.' + code + '.html');
    target.searchParams.set('lang', code);
    return target;
  }
  const query = new URLSearchParams(location.search).get('lang');
  let preferred = codes.includes(query) ? query : current;
  // Explicit translated paths win over stored/browser preferences. The default
  // entrance uses the same consent-managed preference as the motion briefing.
  if (!query && current === 'ja') {
    let saved = null;
    try { saved = window.PRIVACY && window.PRIVACY.getLanguage(); } catch (_) { /* optional */ }
    const browser = (navigator.language || 'en').split('-')[0].toLowerCase();
    preferred = codes.includes(saved) ? saved : (codes.includes(browser) ? browser : 'en');
  }
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
