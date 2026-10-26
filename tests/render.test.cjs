const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');

function runtime({ cores = 8, memory = 8, saveData = false, refresh = 120, cost = 1 } = {}) {
  let now = 0, sequence = 0, drawCost = cost, frames = 0, callbacks = 0;
  const jobs = new Map(), listeners = new Set(), budgets = [];
  const connection = { saveData,
    addEventListener(name, fn) { listeners.add(fn); },
    removeEventListener(name, fn) { listeners.delete(fn); }
  };
  const enqueue = (fn, at, raf = false) => { const id = ++sequence; jobs.set(id, { fn, at, raf }); return id; };
  const canvas = { width: 1, height: 1, style: {}, getContext() { return { setTransform() {} }; } };
  const context = { window: { devicePixelRatio: 2 }, navigator: { hardwareConcurrency: cores, deviceMemory: memory, connection },
    performance: { now: () => now },
    requestAnimationFrame: fn => enqueue(fn, (Math.floor((now + .001) / (1000 / refresh)) + 1) * (1000 / refresh), true),
    cancelAnimationFrame: id => jobs.delete(id),
    setTimeout: (fn, delay) => enqueue(fn, now + Math.max(0, delay)), clearTimeout: id => jobs.delete(id)
  };
  vm.runInNewContext(fs.readFileSync('site/render.js', 'utf8'), context);
  const renderer = context.window.RENDER.create({ canvas,
    draw() { frames++; now += drawCost; }, step() { return false; },
    onBudget(budget) { budgets.push(budget); }
  });
  function advance(ms) {
    const until = now + ms;
    let count = 0;
    while (jobs.size) {
      const [id, job] = [...jobs].sort((a, b) => a[1].at - b[1].at)[0];
      if (job.at > until) break;
      jobs.delete(id); now = Math.max(now, job.at);
      if (job.raf) callbacks++;
      job.fn(job.raf ? now : undefined);
      assert.ok(++count < 100000, 'scheduler spun without advancing time');
    }
    now = Math.max(now, until);
  }
  renderer.resize({ x: 0, y: 0, width: 1600, height: 900 });
  return { renderer, canvas, budgets, advance, jobs, listeners, connection,
    get frames() { return frames; }, get callbacks() { return callbacks; },
    set cost(value) { drawCost = value; },
    connectionChange(value) { connection.saveData = value; listeners.forEach(fn => fn()); }
  };
}

test('low-core and low-memory devices start with bounded raster and frame work', () => {
  const r = runtime({ cores: 2, memory: 2 });
  r.renderer.configure({ active: true, animated: true }); r.advance(3000);
  assert.ok(r.frames <= 46, `low device drew${r.frames} frames in3s`);
  assert.ok(r.canvas.width * r.canvas.height <= 500000);
  const before = r.frames;
  r.renderer.configure({ interactive: true }); r.advance(3000);
  assert.ok(r.frames - before <= 73, 'interaction must also obey the low-device ceiling');
});

test('low memory is recognized independently of reported CPU count', () => {
  const r = runtime({ cores: 16, memory: 2 });
  r.renderer.configure({ active: true, animated: true }); r.advance(1000);
  assert.ok(r.frames <= 16, 'many logical cores must not hide low memory');
});

test('sustained expensive frames reduce fps as well as raster work', () => {
  const r = runtime({ cost: 28 });
  r.renderer.configure({ active: true, animated: true }); r.advance(6000);
  assert.ok(r.budgets.at(-1)?.fps <= 18, 'frame pressure must lower fps below24');
  const count = r.frames; r.advance(2000);
  assert.ok(r.frames - count <= 37, 'actual draws must follow the reduced ceiling');
});

test('recovery is gradual and cannot exceed the starting device budget', () => {
  const r = runtime({ cores: 4, memory: 4, cost: 30 });
  r.renderer.configure({ active: true, animated: true }); r.advance(7000);
  const pressure = r.budgets.at(-1);
  assert.ok(pressure?.fps <= 18);
  r.cost = 1; r.advance(20000);
  const recovered = r.budgets.at(-1);
  assert.ok(recovered.fps > pressure.fps && recovered.fps <= 24, 'recover inside the device ceiling');
});

test('low target rates do not poll every120Hz display refresh', () => {
  const r = runtime({ refresh: 120 });
  r.renderer.configure({ active: true, animated: true }); r.advance(3000);
  assert.ok(r.callbacks <= r.frames * 1.5 + 2, `${r.callbacks} RAF callbacks for${r.frames} paints`);
});

test('repeated pointer invalidations cannot bypass a low-device frame cap', () => {
  const r = runtime({ cores: 2, memory: 2 });
  r.renderer.configure({ active: true, animated: true, interactive: true });
  for (let i = 0; i < 1000; i++) { r.renderer.invalidate(true); r.advance(2); }
  assert.ok(r.frames <= 50, `${r.frames} interaction paints in2s exceeds low-device limit`);
});

test('hidden, static and disposed views leave no callbacks or timers', () => {
  const r = runtime();
  r.renderer.configure({ active: true, animated: false }); r.advance(1000);
  assert.equal(r.frames, 1); assert.equal(r.jobs.size, 0);
  r.renderer.configure({ animated: true }); r.advance(500);
  r.renderer.configure({ active: false });
  const count = r.frames; r.advance(1000);
  assert.equal(r.frames, count); assert.equal(r.jobs.size, 0);
  r.renderer.dispose(); assert.equal(r.jobs.size, 0); assert.equal(r.listeners.size, 0);
});

test('save-data changes update an active budget and release the listener on dispose', () => {
  const r = runtime();
  r.renderer.configure({ active: true, animated: true }); r.advance(1000);
  r.connectionChange(true);
  assert.ok(r.budgets.at(-1)?.fps <= 18, 'respect newly enabled save-data');
  r.renderer.dispose(); assert.equal(r.listeners.size, 0);
});

test('sustained late presentation reduces load even when JS draw time is cheap', () => {
  const r = runtime({ refresh: 10, cost: 1 });
  r.renderer.configure({ active: true, animated: true }); r.advance(6000);
  assert.ok(r.budgets.at(-1)?.fps <= 18, 'late presentation must affect the budget');
});
