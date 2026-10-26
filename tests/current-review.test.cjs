const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const latest = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const scope = {window: {}};
vm.runInNewContext(fs.readFileSync('site/data.js', 'utf8'), scope);
const content = scope.window.CONTENT;
assert.equal(content.review?.cutoff, latest.cutoff, 'motion must show the same cutoff as the public database');
const report = new URL(latest.site_report).pathname;
assert.equal(content.review.report, report);
for (const id of ['morning-consul-identity', 'morning-sandbox-auth']) {
  const scene = content.scenes.find(s => s.id === id);
  assert.ok(scene, 'morning response scene missing: ' + id);
  assert.ok(scene.ja.title && scene.en.title && scene.sources.length);
}
console.log('Current database cutoff, motion report and morning response scenes agree');
