/* A language-independent lock, and the only loader for the briefing.
   Before a gesture: no scene data, renderer, Canvas allocation or music fetch.
   Deep links/static exports go straight to the requested briefing. */
(function initEntry() {
  'use strict';
  // Previous HTML may still request this editable URL after a deployment.
  // Keep that route working even though new HTML loads a separate guard.
  if (!window.PLATFORM) {
    const support = document.createElement('script');
    support.src = './platform.js';
    support.onload = () => { support.remove(); initEntry(); };
    support.onerror = () => {
      const requested = (location.search.match(/[?&]lang=([^&#]*)/) || [])[1] || navigator.language || '';
      location.replace(requested.indexOf('ja') === 0 ? '/briefing' : '/briefing.en');
    };
    document.head.appendChild(support);
    return;
  }
  if (!window.PLATFORM.essential()) return;
  const cover = document.getElementById('cover');
  const button = document.getElementById('btn-start');
  const query = new URLSearchParams(location.search);
  const deep = Number((location.hash.match(/(\d+)/) || [])[1] || query.get('scene'));
  const bypass = query.get('still') === '1' || deep > 0;
  const reduced = window.PLATFORM.media('(prefers-reduced-motion: reduce)');
  const files = typeof BRIEFING_MOTION_FILE !== 'undefined' ? [BRIEFING_MOTION_FILE] :
    ['data.js?v=20261028devices', 'chronology.js?v=20261027seamless', 'render.js?v=20261028devices', 'rig3d.js?v=20261028devices', 'visuals.js?v=202610271847', 'app.js?v=20261028devices'];
  const loaded = new Map(), preloads = [];
  let failedInitializations = 0;
  let motionTimer = 0;
  let state = bypass ? 'loading' : 'locked', start = null, pending = null;
  let resolveReady;
  const connected = new Promise(resolve => { resolveReady = resolve; });
  const japanese = (query.get('lang') || navigator.language || '').startsWith('ja');
  button.setAttribute('aria-label', japanese ? '解錠してブリーフィングを開く' : 'Unlock the briefing');
  button.disabled = false;

  function scriptURL(file) {
    // A rejected script can remain in the document's preload cache. An
    // initialization retry must request fresh bytes instead of replaying it.
    return './' + file + (failedInitializations
      ? (file.includes('?') ? '&' : '?') + 'entry-retry=' + failedInitializations : '');
  }
  function script(file) {
    if (loaded.has(file)) return loaded.get(file);
    const promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = scriptURL(file); s.async = false;
      s.onload = () => { s.remove(); resolve(); };
      s.onerror = () => { s.remove(); loaded.delete(file); reject(new Error('Unable to load ' + file)); };
      document.head.appendChild(s);
    });
    loaded.set(file, promise);
    return promise;
  }
  function prepare() {
    if (pending) return pending;
    try {
      if (!document.getElementById('scene').getContext('2d')) throw new Error('Canvas unavailable');
    } catch (_) {
      location.replace(window.PLATFORM.readingURL());
      return new Promise(() => {});
    }
    // Fetch in parallel, execute in dependency order. This also makes retries
    // stop at the failed dependency instead of running a half-loaded app.
    for (const file of files) {
      const link = document.createElement('link');
      link.rel = 'preload'; link.as = 'script'; link.href = scriptURL(file);
      document.head.appendChild(link); preloads.push(link);
    }
    const cleanup = () => { preloads.splice(0).forEach(link => link.remove()); };
    pending = files.reduce((chain, file) => chain.then(() => script(file)), Promise.resolve())
      .then(() => {
        // A downloaded script may still fail parsing or initialization. Do not
        // wait forever for an application that never registered its callback.
        if (!start) { loaded.clear(); failedInitializations++; throw new Error('Briefing initialization failed'); }
        return connected;
      }).then(value => { cleanup(); return value; }, error => { cleanup(); throw error; });
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
    if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea,summary,[contenteditable]')) return;
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
