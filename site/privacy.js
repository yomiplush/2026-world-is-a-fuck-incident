/* First-party preference consent. No network requests, cookies or analytics. */
(function () {
  'use strict';
  const KEY = 'briefing-consent', LANGUAGE = 'briefing-lang';
  const VERSION = 1, LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const japanese = (new URLSearchParams(location.search).get('lang') || navigator.language || '').startsWith('ja');
  const copy = japanese ? {
    title: 'Cookieの利用について',
    body: 'このサイトが独自に置く任意Cookieはありません。任意の保存は表示言語の記憶だけです。同意するまで保存せず、拒否してもすべての内容を閲覧できます。解析・広告用Cookieは導入していません。',
    required: '配信・防御に必要なCloudflareのCookieや通信情報は、この任意設定の対象外です。選択自体は180日間、このブラウザーに保存します。',
    reject: '拒否', accept: '同意',
    policy: 'プライバシーポリシー', settings: 'Cookie設定',
    unknown: '任意の保存：未選択（無効）', yes: '言語の保存：同意済み', no: '任意の保存：拒否済み',
    saved: '選択を保存しました。Cookie設定からいつでも変更できます。',
    temporary: 'このブラウザーでは保存できません。選択はこのページを開いている間だけ適用されます。'
  } : {
    title: 'Cookie notice',
    body: 'We set no optional cookies of our own. Optional storage only remembers your display language. It stays off until you agree. You can reject it and still read everything. We do not use analytics or advertising cookies.',
    required: 'Cloudflare delivery and security cookies and traffic processing are separate from this optional setting. Your choice is saved in this browser for 180 days.',
    reject: 'Reject', accept: 'Accept',
    policy: 'Privacy policy', settings: 'Cookie settings',
    unknown: 'Optional storage: not chosen (off)', yes: 'Language storage: allowed', no: 'Optional storage: rejected',
    saved: 'Choice saved. You can change it anytime in Cookie settings.',
    temporary: 'Browser storage is unavailable. This choice applies only while this page remains open.'
  };
  function get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function remove(key) { try { localStorage.removeItem(key); } catch (_) { /* storage may be unavailable */ } }
  function put(key, value) { try { localStorage.setItem(key, value); return true; } catch (_) { return false; } }
  function readChoice() {
    try {
      const value = JSON.parse(get(KEY));
      const now = Date.now();
      if (value && value.version === VERSION && typeof value.preferences === 'boolean' &&
          Number.isFinite(value.updatedAt) && Number.isFinite(value.expiresAt) &&
          value.updatedAt <= now && value.expiresAt > now && value.expiresAt > value.updatedAt &&
          value.expiresAt <= value.updatedAt + LIFETIME) return value;
    } catch (_) { /* malformed or unavailable storage fails closed */ }
    remove(KEY);
    return null;
  }
  let choice = readChoice(), language = null, returnFocus = null;
  let persistent = !!choice;
  if (!choice || !choice.preferences) remove(LANGUAGE);

  const banner = document.createElement('section');
  banner.id = 'briefing-preferences'; banner.className = 'briefing-preferences';
  banner.setAttribute('role', 'region'); banner.setAttribute('aria-labelledby', 'privacy-title');
  const label = document.createElement('span'); label.className = 'preferences-label'; label.textContent = 'BRIEFING / PREFERENCES';
  const heading = document.createElement('h2'); heading.id = 'privacy-title'; heading.textContent = copy.title;
  const description = document.createElement('p'); description.textContent = copy.body;
  const detail = document.createElement('p'); detail.className = 'privacy-detail'; detail.textContent = copy.required;
  const policy = document.createElement('a'); policy.href = '/privacypolicy/'; policy.textContent = copy.policy;
  const copyBlock = document.createElement('div'); copyBlock.className = 'privacy-copy';
  copyBlock.append(heading, description, detail, policy);
  const actions = document.createElement('div'); actions.className = 'privacy-actions';
  const reject = document.createElement('button'); reject.type = 'button'; reject.id = 'privacy-reject'; reject.textContent = copy.reject;
  const accept = document.createElement('button'); accept.type = 'button'; accept.id = 'privacy-accept'; accept.textContent = copy.accept;
  actions.append(reject, accept);
  const bar = document.createElement('div'); bar.className = 'privacy-bar'; bar.append(copyBlock, actions);
  banner.append(label, bar);
  const dock = document.createElement('nav'); dock.className = 'privacy-dock'; dock.setAttribute('aria-label', copy.policy);
  const policyLink = policy.cloneNode(true);
  const settings = document.createElement('button'); settings.type = 'button'; settings.id = 'privacy-settings';
  settings.setAttribute('aria-label', copy.settings); settings.title = copy.settings;
  const cookieIcon = document.createElement('span'); cookieIcon.className = 'privacy-cookie-icon'; cookieIcon.setAttribute('aria-hidden', 'true'); cookieIcon.textContent = '🍪';
  const settingsText = document.createElement('span'); settingsText.className = 'privacy-settings-text'; settingsText.textContent = copy.settings;
  settings.append(cookieIcon, settingsText);
  if (document.getElementById('app')) { document.body.classList.add('motion-page'); dock.classList.add('motion-privacy'); }
  settings.setAttribute('aria-controls', banner.id); settings.setAttribute('aria-expanded', 'false');
  dock.append(policyLink, settings);
  const status = document.createElement('p'); status.className = 'privacy-status'; status.setAttribute('role', 'status');
  document.body.append(dock, banner, status);

  function update() {
    const text = !choice ? copy.unknown : choice.preferences ? copy.yes : copy.no;
    document.querySelectorAll('[data-privacy-status]').forEach(el => { el.textContent = text; });
    settings.setAttribute('aria-expanded', String(!banner.hidden));
    dock.hidden = !banner.hidden;
  }
  function currentChoice() {
    if (choice && choice.expiresAt <= Date.now()) {
      choice = null; persistent = false; remove(KEY); remove(LANGUAGE); banner.hidden = false; update();
    }
    return choice;
  }
  function getLanguage() {
    const value = currentChoice();
    return value && value.preferences && persistent ? get(LANGUAGE) : null;
  }
  function setLanguage(code) {
    if (typeof code !== 'string' || !/^[a-z]{2}$/.test(code)) return;
    language = code;
    const value = currentChoice();
    if (value && value.preferences && persistent) put(LANGUAGE, code);
  }
  function showSettings() {
    currentChoice(); returnFocus = document.activeElement;
    banner.hidden = false; update(); reject.focus({ preventScroll: true });
  }
  function choose(preferences) {
    const now = Date.now();
    choice = { version: VERSION, preferences, updatedAt: now, expiresAt: now + LIFETIME };
    const persisted = persistent = put(KEY, JSON.stringify(choice));
    if (!persisted) { remove(KEY); remove(LANGUAGE); }
    if (preferences && persisted) {
      const select = document.getElementById('lang-select');
      const current = language || (select && select.value);
      if (current) setLanguage(current);
    } else remove(LANGUAGE);
    banner.hidden = true; update(); status.textContent = persisted ? copy.saved : copy.temporary;
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    else settings.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent('privacychange', { detail: { preferences } }));
  }
  window.PRIVACY = Object.freeze({
    getLanguage, setLanguage, showSettings,
    getChoice() { const value = currentChoice(); return value ? value.preferences : null; }
  });
  reject.addEventListener('click', () => choose(false));
  accept.addEventListener('click', () => choose(true));
  settings.addEventListener('click', showSettings);
  document.querySelectorAll('[data-privacy-open]').forEach(el => el.addEventListener('click', showSettings));
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = readChoice(); persistent = !!choice;
    if (!choice || !choice.preferences) remove(LANGUAGE);
    banner.hidden = !!choice; update();
  });
  banner.hidden = !!choice; update();
})();
