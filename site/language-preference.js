/* Browser negotiation uses existing translations and consent-managed preferences.
   No new storage, requests to translation services, or server-side redirects. */
(function () {
  'use strict';
  const supported = code => code === 'ja' || code === 'en';
  const base = code => typeof code === 'string' ? code.toLowerCase().split(/[-_]/)[0] : '';
  function requested() {
    const code = base(new URL(location.href).searchParams.get('lang'));
    return supported(code) ? code : null;
  }
  function resolve(saved) {
    const query = requested();
    if (query) return query;
    if (saved === undefined) {
      try { saved = window.PRIVACY && window.PRIVACY.getLanguage(); } catch (_) { /* optional */ }
    }
    if (supported(saved)) return saved;
    const languages = Array.from(navigator.languages || []);
    if (!languages.length) languages.push(navigator.language || 'en');
    for (const language of languages) {
      const code = base(language);
      if (supported(code)) return code;
    }
    return 'en';
  }
  function initial(current) {
    const query = requested();
    if (query) return query;
    // A translated URL is an explicit choice, including shared/bookmarked links.
    if (/\.en(?:\.html)?\/?$/.test(location.pathname)) return current;
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin) return current;
    } catch (_) { /* An absent/unusable referrer permits first-visit negotiation. */ }
    return resolve();
  }
  function route() {
    const path = value => value.replace(/\/index(?:\.html)?\/?$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (path(location.pathname) === '/') return;
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalOrigin = canonical ? new URL(canonical.href, location.href).origin : location.origin;
    const choices = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'))
      .filter(link => supported(link.hreflang))
      .map(link => ({ code: link.hreflang, url: new URL(link.href, location.href) }))
      .filter(row => row.url.origin === location.origin || row.url.origin === canonicalOrigin)
      .map(row => ({ code: row.code, url: new URL(row.url.pathname, location.origin) }));
    const current = choices.find(row => path(row.url.pathname) === path(location.pathname));
    if (!current) return;
    const target = choices.find(row => row.code === initial(current.code));
    if (!target || target.code === current.code) return;
    target.url.search = location.search;
    target.url.hash = location.hash;
    location.replace(target.url.href);
  }
  window.BRIEFING_LANGUAGE = Object.freeze({ resolve, initial });
  // Defer until the privacy module can expose only consent-approved preferences.
  document.addEventListener('DOMContentLoaded', route);
})();
