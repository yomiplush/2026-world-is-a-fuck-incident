/* X/WKWebView toolbars can resize the visible area without a window resize. */
(function () {
  const viewport = window.visualViewport;
  function sync() {
    // Preserve native pinch zoom: do not resize the document around a zoomed view.
    if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
    const height = Math.round(viewport ? viewport.height : window.innerHeight);
    const top = Math.round(viewport ? viewport.offsetTop : 0);
    document.documentElement.style.setProperty('--app-height', height + 'px');
    document.documentElement.style.setProperty('--viewport-top', top + 'px');
    document.documentElement.style.setProperty('--viewport-bottom', Math.max(0, window.innerHeight - height - top) + 'px');
    document.documentElement.classList.toggle('compact-viewport', height <= 600);
    window.dispatchEvent(new Event('briefingviewportchange'));
  }
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('pageshow', sync, { passive: true });
  if (viewport) {
    viewport.addEventListener('resize', sync, { passive: true });
    viewport.addEventListener('scroll', sync, { passive: true });
  }
  sync();
})();
