const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 14 appends six distinct bilingual explanations and preserves historical URLs', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const added = scenes.filter(s=>s.reviewCutoff==='2026-11-14T00:00:00Z');
  assert.equal(added.length,6);
  assert.equal(scenes[116].id,'motion-1113-scope');
  assert.equal(scenes[122].id,'motion-1114-scope');
  assert.equal(new Set(added.map(s=>s.visual.type)).size,6);
  assert.equal(added[0].chapterBreak,true);
  for (const scene of added) {
    assert.ok(scene.sources.length);
    for(const lang of ['ja','en']) assert.ok(scene[lang].title && scene[lang].points.length>=3);
  }
});
test('new November 14 topic pages link to their dated report and own language motion',()=> {
  const scenes={'kev-unrealircd-1114':124,'kev-checkpoint-dynamiccli-1114':125,'screenconnect-sckit-1114':126,'apisix-auth-mcp-1114':127,'dropbear-streamlocal-1114':128,'nltk-canonical-1114':123,'sveltekit-adapters-1114':123,'opentelemetry-js-go-py-1114':123};
  for(const [id,scene] of Object.entries(scenes)) {
    for(const [suffix,lang] of [['','ja'],['.en','en']]) {
      const file='site/topics/'+id+suffix+'.html';
      assert.ok(fs.existsSync(file),file);
      const html=fs.readFileSync(file,'utf8');
      assert.ok(html.includes('/update-20261114-0900'+suffix),file);
      assert.ok(html.includes('/?lang='+lang+'#'+scene),file);
      assert.ok(html.includes('https://'),file);
      const report=fs.readFileSync('site/update-20261114-0900'+suffix+'.html','utf8');
      assert.ok(report.includes('href="/topics/'+id+suffix+'"'),id+' must be discoverable in '+lang);
    }
  }
});
