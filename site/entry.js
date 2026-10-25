/* A language-independent lock, and the only loader for the briefing.
   Before a gesture: no scene data, renderer, Canvas allocation or music fetch.
   Deep links/static exports go straight to the requested briefing. */
(function () {
  'use strict';
  const cover = document.getElementById('cover');
  const button = document.getElementById('btn-start');
  const query = new URLSearchParams(location.search);
  const deep = Number((location.hash.match(/(\d+)/) || [])[1] || query.get('scene'));
  const bypass = query.get('still') === '1' || deep > 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const files = ['data.js?v=20261025', 'render.js?v=19', 'rig3d.js?v=19', 'visuals.js?v=19', 'app.js?v=19'];
  const loaded = new Map(), preloads = [];
  let motionTimer = 0;
  let state = bypass ? 'loading' : 'locked', start = null, pending = null;
  let resolveReady;
  const connected = new Promise(resolve => { resolveReady = resolve; });
  const japanese = (query.get('lang') || navigator.language || '').startsWith('ja');
  button.setAttribute('aria-label', japanese ? '解錠してブリーフィングを開く' : 'Unlock the briefing');
  button.disabled = false;

  function script(file) {
    if (loaded.has(file)) return loaded.get(file);
    const promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = './' + file; s.async = false;
      s.onload = resolve;
      s.onerror = () => { s.remove(); loaded.delete(file); reject(new Error('Unable to load ' + file)); };
      document.head.appendChild(s);
    });
    loaded.set(file, promise);
    return promise;
  }
  function prepare() {
    if (pending) return pending;
    // Fetch in parallel, execute in dependency order. This also makes retries
    // stop at the failed dependency instead of running a half-loaded app.
    for (const file of files) {
      const link = document.createElement('link');
      link.rel = 'preload'; link.as = 'script'; link.href = './' + file;
      document.head.appendChild(link); preloads.push(link);
    }
    pending = files.reduce((chain, file) => chain.then(() => script(file)), Promise.resolve())
      .then(() => connected)
      .finally(() => { preloads.splice(0).forEach(link => link.remove()); });
    return pending;
  }
  function visibility() {
    cover.classList.toggle('entry-asleep', document.hidden);
    if (window.AUDIO) window.AUDIO.setVisible(!document.hidden);
  }
  function finish() {
    state = 'ready';
    clearTimeout(motionTimer); motionTimer = 0;
    window.removeEventListener('keydown', keydown);
    document.removeEventListener('visibilitychange', visibility);
    document.body.classList.remove('entry-locked');
    cover.classList.add('hidden'); cover.setAttribute('aria-hidden', 'true');
    button.disabled = true;
    if (!bypass && start) start();
    // The hidden overlay owns no persistent animations or compositing layer.
    cover.classList.remove('unlocking', 'entry-waiting');
  }
  function fail() {
    state = 'failed'; pending = null;
    clearTimeout(motionTimer); motionTimer = 0;
    cover.classList.remove('unlocking', 'entry-waiting'); cover.classList.add('entry-error');
    button.disabled = false; button.removeAttribute('aria-busy');
    button.setAttribute('aria-label', japanese ? '再試行' : 'Retry');
    if (window.AUDIO) window.AUDIO.setVisible(false);
  }
  function open() {
    if (state === 'unlocking' || state === 'ready') return;
    state = 'unlocking';
    cover.classList.remove('entry-error'); cover.classList.add('unlocking');
    button.disabled = true; button.setAttribute('aria-busy', 'true');
    // Audio activation stays inside the trusted input event. The recording is
    // streamed only now; no autoplay attempt occurs on a plain page visit.
    if (window.AUDIO) { window.AUDIO.setVisible(!document.hidden); window.AUDIO.init(); window.AUDIO.sfx('crack'); }
    const duration = reduced.matches ? 0 : 1250;
    const motion = new Promise(resolve => { motionTimer = setTimeout(() => {
      cover.classList.add('entry-waiting'); resolve();
    }, duration); });
    Promise.all([prepare(), motion]).then(() => {
      if (window.AUDIO) window.AUDIO.sfx('confirm');
      finish();
    }).catch(fail);
  }
  function keydown(event) {
    if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea,[contenteditable]')) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  }
  window.ENTRY = {
    bypass,
    open,
    ready(callback) { start = callback; resolveReady(); },
    get state() { return state; }
  };
  button.addEventListener('click', open);
  window.addEventListener('keydown', keydown);
  document.addEventListener('visibilitychange', visibility);
  if (bypass) {
    cover.classList.add('hidden');
    prepare().then(finish).catch(() => {
      // A failed deep link can still retry through the same symbolic control.
      cover.classList.remove('hidden'); fail();
    });
  }
})();
