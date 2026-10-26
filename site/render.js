/* Own Canvas raster, frame pacing and adaptive device budgets in one place.
   Schedule only the next useful paint; hidden/static views own no wakeups. */
window.RENDER = (function () {
  'use strict';
  function deviceBudget(connection) {
    const cores = navigator.hardwareConcurrency || 0, memory = navigator.deviceMemory || 0;
    if ((cores && cores <= 2) || (memory && memory <= 2)) {
      return { fps: 15, interactiveFps: 24, pixels: 500000, dpr: 1 };
    }
    if (connection && connection.saveData) {
      return { fps: 18, interactiveFps: 24, pixels: 700000, dpr: 1.25 };
    }
    if (!cores || cores <= 4 || (memory && memory <= 4)) {
      return { fps: 24, interactiveFps: 30, pixels: 900000, dpr: 1.5 };
    }
    return { fps: 30, interactiveFps: 60, pixels: 1500000, dpr: 2 };
  }

  function create({ canvas, draw, step, onBudget }) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const connection = navigator.connection;
    let device = deviceBudget(connection), budget;
    let bounds = { x: 0, y: 0, width: 1, height: 1 };
    let active = false, animated = false, interactive = false, moving = false;
    let dirty = true, frame = 0, timer = 0, disposed = false, painted = -Infinity;
    let level = 0, average = 0, pressure = 0, headroom = 0, changedAt = -Infinity;

    function surface() {
      const dpr = Math.min(window.devicePixelRatio || 1, budget.dprLimit,
        Math.sqrt(budget.pixelBudget / (bounds.width * bounds.height)));
      const width = Math.max(1, Math.floor(bounds.width * dpr));
      const height = Math.max(1, Math.floor(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height; dirty = true;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function updateBudget() {
      budget = Object.freeze({
        fps: Math.min(device.fps, [30, 24, 18, 12][level]),
        interactiveFps: Math.min(device.interactiveFps, [60, 30, 24, 18][level]),
        pixelBudget: Math.floor(device.pixels * [1, .75, .55, .4][level]),
        dprLimit: Math.max(.75, device.dpr - level * .25),
        effects: level >= 2 || device.fps <= 18 ? 'minimal' : (level || device.fps < 30 ? 'reduced' : 'full')
      });
      surface();
      if (onBudget) onBudget(budget);
    }
    function cancel() {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
      frame = timer = 0;
    }
    const interval = () => 1000 / (interactive || moving ? budget.interactiveFps : budget.fps);
    function schedule() {
      if (disposed || !active || frame || timer) return;
      // A short timer avoids polling every60/120Hz display refresh when only
      //12–30fps is useful. RAF still aligns the eventual paint to the display.
      const delay = interval() - (performance.now() - painted) - 3;
      if (delay > 1) {
        timer = setTimeout(() => { timer = 0; if (active && !disposed) frame = requestAnimationFrame(tick); }, delay);
      } else frame = requestAnimationFrame(tick);
    }
    function assess(cost, now, late) {
      // Clip a single entrance spike rather than making one resize determine
      // the rest of the session. Both pressure and recovery require a streak.
      average = average * .88 + Math.min(cost, 100) * .12;
      const allowed = Math.min(14, interval() * .32);
      pressure = average > allowed || late ? pressure + 1 : 0;
      headroom = !late && average < Math.max(2.5, interval() * .10) ? headroom + 1 : 0;
      if (pressure >= 12 && level < 3 && now - changedAt >= 1200) {
        level++; pressure = headroom = 0; changedAt = now; updateBudget();
      } else if (headroom >= 60 && level > 0 && now - changedAt >= 6000) {
        level--; pressure = headroom = 0; changedAt = now; updateBudget();
      }
    }
    function paint(now) {
      const late = animated && Number.isFinite(painted) && now - painted > interval() * 1.75;
      dirty = false;
      moving = !!step(now);
      const start = performance.now();
      draw(now, ctx, bounds.width, bounds.height);
      painted = now;
      assess(performance.now() - start, now, late);
    }
    function tick(now) {
      frame = 0;
      if (!active || disposed) return;
      if (now - painted >= interval() - .5) paint(now);
      if (animated || moving || dirty) schedule();
    }
    function connectionChanged() {
      if (disposed) return;
      device = deviceBudget(connection);
      pressure = headroom = 0;
      updateBudget();
      cancel(); schedule();
    }
    if (connection && connection.addEventListener) connection.addEventListener('change', connectionChanged);
    updateBudget();

    return {
      configure(next) {
        if (disposed) return;
        const wasActive = active, wasAnimated = animated, wasInteractive = interactive;
        if (next.active != null) active = next.active;
        if (next.animated != null) animated = next.animated;
        if (next.interactive != null) interactive = next.interactive;
        if (!active) { cancel(); moving = false; }
        else if (!wasActive || animated !== wasAnimated || interactive !== wasInteractive) {
          dirty = true; cancel(); schedule();
        }
      },
      invalidate(immediate = false) {
        if (disposed) return;
        dirty = true;
        // Pointer bursts cannot bypass the same device/pressure ceiling.
        if (immediate && active && performance.now() - painted >= interval()) {
          cancel(); paint(performance.now());
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
        disposed = true; cancel();
        if (connection && connection.removeEventListener) connection.removeEventListener('change', connectionChanged);
        canvas.width = canvas.height = 1;
      }
    };
  }
  return { create };
})();
