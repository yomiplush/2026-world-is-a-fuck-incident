const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 11 review appends six varied, sourced bilingual scenes without moving old scenes', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const dated = scenes.filter(s=>s.reviewCutoff==='2026-11-11T11:40:00Z');
  assert.equal(dated.length,6);
  assert.equal(scenes[104].id,'motion-1109-0900-scope');
  assert.equal(scenes[110].id,'motion-1111-scope');
  assert.equal(new Set(dated.map(s=>s.visual.type)).size,6);
  assert.equal(dated[0].chapterBreak,true);
  for(const s of dated){
    assert.ok(s.sources.length);
    for(const lang of ['ja','en']) assert.ok(s[lang].title && s[lang].points.length>=3);
  }
});
