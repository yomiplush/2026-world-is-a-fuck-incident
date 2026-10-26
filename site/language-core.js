/* Pure language search/link helpers; no storage or network. */
window.LANGUAGE_CORE = (function () {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filter(rows, query) {
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);
    return rows.filter(row => words.every(word => normalize([row.code,row.en,row.ja,row.native].join(' ')).includes(word)));
  }
  function publicURL(value) {
    const url = new URL(value);
    if (url.origin !== 'https://www.infosec-briefing.net' || url.username || url.password) throw new Error('Expected public briefing URL');
    return url;
  }
  function translationURL(code, source) {
    if (!/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{2,8})*$/.test(code)) throw new Error('Invalid language code');
    const url = new URL('https://translate.google.com/translate');
    url.searchParams.set('sl','auto'); url.searchParams.set('tl',code);
    url.searchParams.set('u', publicURL(source).href);
    return url.href;
  }
  function readingURL(canonical, current) {
    const url = publicURL(canonical), now = new URL(current);
    if (url.pathname === '/') {
      url.pathname = '/briefing'; url.search = '';
      const number = (now.hash.match(/^#(\d+)$/) || [])[1] || now.searchParams.get('scene');
      if (/^\d+$/.test(number || '')) url.hash = 'scene-' + number;
    } else url.hash = now.hash;
    return url.href;
  }
  return { filter, translationURL, readingURL };
})();
