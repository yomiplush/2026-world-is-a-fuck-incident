/* X/WKWebView toolbars can resize the visible area without a window resize. */
(function () {
  const viewport = window.visualViewport;
  let frame = 0, previous = '';
  function sync() {
    frame = 0;
    // Preserve native pinch zoom: do not resize the document around a zoomed view.
    if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
    const height = Math.round(viewport ? viewport.height : window.innerHeight);
    const top = Math.round(viewport ? viewport.offsetTop : 0);
    const bottom = Math.max(0, window.innerHeight - height - top);
    const measurement = height + ':' + top + ':' + bottom;
    if (measurement === previous) return;
    previous = measurement;
    document.documentElement.style.setProperty('--app-height', height + 'px');
    document.documentElement.style.setProperty('--viewport-top', top + 'px');
    document.documentElement.style.setProperty('--viewport-bottom', bottom + 'px');
    document.documentElement.classList.toggle('compact-viewport', height <= 600);
    window.dispatchEvent(new Event('briefingviewportchange'));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(sync); }
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  if (viewport) {
    viewport.addEventListener('resize', schedule, { passive: true });
    viewport.addEventListener('scroll', schedule, { passive: true });
  }
  sync();
})();
