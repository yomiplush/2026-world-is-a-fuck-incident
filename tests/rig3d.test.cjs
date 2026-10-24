const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const scope = { window: {} };
vm.runInNewContext(fs.readFileSync('site/rig3d.js', 'utf8'), scope);
const R = scope.window.RIG3D;

test('translucent scene colors retain valid channels when shaded', () => {
  assert.equal(R.shade('rgba(88,224,255,0.5)', 1), 'rgb(88,224,255)');
  assert.equal(R.a('rgba(88,224,255,0.5)', 0.4), 'rgba(88,224,255,0.2)');
  assert.equal(R.shade('#abc', 1), 'rgb(170,187,204)');
});

test('short viewports fit the world vertically as well as horizontally', () => {
  R.setView(844, 280);
  const c = R.cam(0, { pitch: 0, yaw: 0, dist: 1000 });
  const top = R.project(c, 0, -400, 0, 844, 280);
  const bottom = R.project(c, 0, 400, 0, 844, 280);
  assert.ok(top[1] >= 12, `top clipped at ${top[1]}`);
  assert.ok(bottom[1] <= 268, `bottom clipped at ${bottom[1]}`);
});
