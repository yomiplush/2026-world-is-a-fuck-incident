/* Google AdSense loader, gated by the first-party consent choice in privacy.js.
   Nothing is requested from Google until the visitor chooses "accept"; a later
   rejection removes the loader and expires the ad cookies it may have set. */
(function () {
  'use strict';
  const CLIENT = 'ca-pub-7152734866282122';
  const LOADER = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
  // First-party cookies AdSense may set on this origin when it serves ads.
  const AD_COOKIES = ['__gads', '__gpi', '__gsas', '__eoi'];
  let active = false;

  function allowed() {
    try {
      return !!(window.PRIVACY && window.PRIVACY.getChoice() === true);
    } catch (_) {
      return false; // unavailable consent state fails closed
    }
  }

  function start() {
    if (active || !allowed()) return;
    if (document.querySelector('script[data-adsense-loader]')) { active = true; return; }
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = LOADER;
    script.dataset.adsenseLoader = '';
    document.head.append(script);
    active = true;
  }

  function expireAdCookies() {
    const host = location.hostname;
    const domains = ['', '; domain=' + host, '; domain=.' + host];
    for (const name of AD_COOKIES) {
      for (const domain of domains) {
        document.cookie = name + '=; max-age=0; path=/' + domain;
      }
    }
  }

  function stop() {
    if (!active) return;
    const script = document.querySelector('script[data-adsense-loader]');
    if (script) script.remove();
    expireAdCookies();
    active = false;
  }

  function sync() {
    if (allowed()) start();
    else stop();
  }

  // privacy.js is deferred and owns the stored choice, so read it after it has run.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, { once: true });
  else sync();
  window.addEventListener('privacychange', sync);
  window.ADS = Object.freeze({ active: () => active });
})();
