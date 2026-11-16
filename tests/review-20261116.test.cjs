const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 16 appends six distinct bilingual explanations and preserves historical URLs', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const added = scenes.filter(s=>s.reviewCutoff==='2026-11-16T00:00:00Z');
  assert.equal(added.length,6);
  assert.equal(scenes[128].id,'motion-1115-scope');
  assert.equal(scenes[134].id,'motion-1116-scope');
  assert.equal(new Set(added.map(s=>s.visual.type)).size,6);
  assert.equal(added[0].chapterBreak,true);
  for (const scene of added) {
    assert.ok(scene.sources.length);
    for(const lang of ['ja','en']) assert.ok(scene[lang].title && scene[lang].points.length>=3);
  }
});
test('new November 16 topic pages link to their dated report and own language motion',()=> {
  const scenes={'gitea-2840-20cves-1116':136,'cyrus-sasl-okhttp-auth-1116':137,'vllm-dufs-kroki-server-1116':138,'assimp-gpac-littlefs-mquickjs-1116':139,'prestashop-frrouting-freedombox-1116':140,'zr-admin-geopulse-dnsmgr-1116':135,'draytek-dlink-router-firmware-1116':135,'wordpress-plugins-rce-auth-1116':135};
  for(const [id,scene] of Object.entries(scenes)) {
    for(const [suffix,lang] of [['','ja'],['.en','en']]) {
      const file='site/topics/'+id+suffix+'.html';
      assert.ok(fs.existsSync(file),file);
      const html=fs.readFileSync(file,'utf8');
      assert.ok(html.includes('/update-20261116-0900'+suffix),file);
      assert.ok(html.includes('/?lang='+lang+'#'+scene),file);
      assert.ok(html.includes('https://'),file);
      const report=fs.readFileSync('site/update-20261116-0900'+suffix+'.html','utf8');
      assert.ok(report.includes('href="/topics/'+id+suffix+'"'),id+' must be discoverable in '+lang);
    }
  }
});
