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

test('camera edits continue to change projection', () => {
  R.setView(960,700);
  const c=R.cam(0,{yaw:0,pitch:0,dist:1000});
  const initial=R.project(c,150,80,60,960,700);
  c.yaw=.6;c.pitch=-.4;
  const changed=R.project(c,150,80,60,960,700);
  const x=150*Math.cos(.6)-60*Math.sin(.6), z=150*Math.sin(.6)+60*Math.cos(.6);
  const y=80*Math.cos(-.4)-z*Math.sin(-.4), depth=80*Math.sin(-.4)+z*Math.cos(-.4);
  const scale=c.f/(c.f+depth+c.dist);
  assert.notEqual(changed[0],initial[0]);
  assert.ok(Math.abs(changed[0]-(480+x*scale))<1e-9);
  assert.ok(Math.abs(changed[1]-(350+y*scale))<1e-9);
});

test('default camera looks down from above the floor', () => {
  R.setView(960,700);R.setTilt(0,0);
  const c=R.cam(0,{});
  assert.ok(c.pitch>0,'y-down world needs positive pitch for an elevated camera');
  const near=R.project(c,0,0,-200,960,700),far=R.project(c,0,0,200,960,700);
  assert.ok(near[1]>far[1],'near floor edge should appear below the far edge');
});
