/* Kept in ES5 so unsupported engines can still reach the static transcript. */
(function () {
  'use strict';
  function readingURL() {
    var language = 'en';
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < languages.length; i++) {
      var code = String(languages[i]).toLowerCase().split(/[-_]/)[0];
      if (code === 'ja' || code === 'en') { language = code; break; }
    }
    var match = (window.location.search || '').match(/[?&]lang=([^&#]*)/);
    if (match && /^(ja|en)$/i.test(match[1])) language = match[1].toLowerCase();
    return language.indexOf('ja') === 0 ? '/briefing' : '/briefing.en';
  }
  function essential() {
    return !!(window.Promise && window.Map && window.URL && window.URLSearchParams &&
      window.requestAnimationFrame && window.cancelAnimationFrame &&
      window.CSS && window.CSS.supports && window.CSS.supports('display', 'grid') &&
      document.createElement('canvas').getContext);
  }
  function media(query) {
    try { if (window.matchMedia) return window.matchMedia(query); } catch (_) {}
    return { matches: query.indexOf('prefers-reduced-motion') !== -1 };
  }
  function watchMedia(query, callback) {
    if (query.addEventListener) {
      query.addEventListener('change', callback);
      return function () { query.removeEventListener('change', callback); };
    }
    if (query.addListener) {
      query.addListener(callback);
      return function () { query.removeListener(callback); };
    }
    return function () {};
  }
  window.PLATFORM = { essential: essential, media: media, watchMedia: watchMedia, readingURL: readingURL };
  if (!essential()) window.location.replace(readingURL());
})();
