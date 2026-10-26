const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('site/data.js', 'utf8'), context);
const source = context.window.CONTENT.scenes;
const originalIDs = source.map(s => s.id).join(',');
if (fs.existsSync('site/chronology.js')) vm.runInContext(fs.readFileSync('site/chronology.js', 'utf8'), context);
assert.ok(context.window.BRIEFING_NAV, 'chronological navigation must be available');
const nav = context.window.BRIEFING_NAV;
assert.equal(nav.scenes[0].id, 'intro');
assert.equal(nav.scenes.at(-1).id, 'closing');
const position = id => nav.scenes.findIndex(s => s.id === id);
for (const [earlier, later] of [['infinity-core', 'teamupdraft'], ['prepatch', 'ovh'], ['node2shell', 'sweep'], ['http2shell', 'oct25-priorities']]) {
  assert.ok(position(earlier) < position(later), `${earlier} must precede ${later}`);
}
for (const [number, id] of [[18, 'infinity-core'], [40, 'http2shell'], [41, 'tailworm-overview'], [49, 'morning-cutoff']]) {
  assert.equal(nav.scenes[nav.indexFor(number)].id, id, `old #${number} must keep its target`);
  assert.equal(nav.numberFor(nav.indexFor(number)), number);
}
assert.equal(nav.indexFor(999), -1);
assert.equal(nav.indexFor(0), -1);
assert.equal(source.map(s => s.id).join(','), originalIDs, 'translations and existing integrations retain source order');
const dates = [...fs.readFileSync('site/timeline.html', 'utf8').matchAll(/<time datetime="([^"]+)"/g)].map(m => m[1]);
assert.equal(dates.join(','), [...dates].sort().join(','), 'daily pages must read oldest to newest');
console.log('Chronological playback, stable shared links and ascending daily archive passed');
