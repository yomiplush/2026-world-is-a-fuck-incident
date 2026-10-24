/* One owner for the Canvas surface and its frame budget.
   Callers configure intent, invalidate content, and resize the logical stage.
   Idle/static/occluded views own no animation-frame callbacks. */
window.RENDER = (function () {
  'use strict';
  const PIXEL_BUDGET = 1500000;
  function create({ canvas, draw, step }) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let bounds = { x: 0, y: 0, width: 1, height: 1 };
    let active = false, animated = false, interactive = false;
    let dirty = true, frame = 0, disposed = false, painted = -Infinity;
    let quality = 2, average = 0, expensive = 0;
    const constrained = !!(navigator.connection && navigator.connection.saveData) ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
    const baseRate = constrained ? 24 : 30;
    let rate = baseRate;

    function surface() {
      const dpr = Math.min(window.devicePixelRatio || 1, quality, constrained ? 1.5 : 2,
        Math.sqrt(PIXEL_BUDGET / (bounds.width * bounds.height)));
      const width = Math.max(1, Math.floor(bounds.width * dpr));
      const height = Math.max(1, Math.floor(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
        dirty = true;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function schedule() {
      if (!disposed && active && !frame) frame = requestAnimationFrame(tick);
    }
    function paint(now) {
      const start = performance.now();
      draw(now, ctx, bounds.width, bounds.height);
      const cost = performance.now() - start;
      average = average ? average * .9 + cost * .1 : cost;
      // Sustained pressure reduces raster work; a single expensive entrance or
      // resize never changes quality. No timers poll an idle or hidden page.
      expensive = average > 12 ? expensive + 1 : 0;
      if (expensive >= 12 && quality > 1) {
        quality = Math.max(1, quality - .25); rate = 24; expensive = 0;
        surface();
      } else dirty = false;
      painted = now;
    }
    function tick(now) {
      frame = 0;
      if (!active || disposed) return;
      const moving = !!step(now);
      const interval = 1000 / (interactive || moving ? 60 : rate);
      if (dirty || now - painted >= interval - .7) paint(now);
      if (animated || moving || dirty) schedule();
    }
    return {
      configure(next) {
        if (disposed) return;
        const wasActive = active, wasAnimated = animated;
        if (next.active != null) active = next.active;
        if (next.animated != null) animated = next.animated;
        if (next.interactive != null) interactive = next.interactive;
        if (!active) {
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
        } else if (!wasActive || animated !== wasAnimated || interactive) {
          dirty = true; schedule();
        }
      },
      invalidate(immediate = false) {
        if (disposed) return;
        dirty = true;
        if (immediate && active) {
          // Preserve synchronous camera feedback without painting twice in the
          // same input burst. Normal invalidations coalesce into one RAF.
          const now = performance.now();
          if (now - painted >= 1000 / 60) { step(now); paint(now); }
        }
        schedule();
      },
      resize(next) {
        if (disposed) return;
        const changed = ['x', 'y', 'width', 'height'].some(k => next[k] !== bounds[k]);
        if (changed) {
          bounds = { x: next.x, y: next.y, width: Math.max(1, next.width), height: Math.max(1, next.height) };
          canvas.style.left = bounds.x + 'px'; canvas.style.top = bounds.y + 'px';
          canvas.style.width = bounds.width + 'px'; canvas.style.height = bounds.height + 'px';
        }
        surface();
        if (changed || dirty) { dirty = true; schedule(); }
      },
      dispose() {
        disposed = true;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        canvas.width = canvas.height = 1;
      }
    };
  }
  return { create };
})();
