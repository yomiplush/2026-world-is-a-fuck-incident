const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 18 appends six distinct bilingual explanations and preserves historical URLs', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const added = scenes.filter(s=>s.reviewCutoff==='2026-11-18T00:00:00Z');
  assert.equal(added.length,6);
  assert.equal(scenes[146].id,'motion-1117-scope');
  assert.equal(scenes[152].id,'motion-1118-scope');
  assert.equal(new Set(added.map(s=>s.visual.type)).size,6);
  assert.equal(added[0].chapterBreak,true);
  for (const scene of added) {
    assert.ok(scene.sources.length);
    for(const lang of ['ja','en']) assert.ok(scene[lang].title && scene[lang].points.length>=3);
  }
});
test('new November 18 topic pages link to their dated report and own language motion',()=> {
  const scenes={
    'libp2p-dos-eventloop-1118': 155,
    'simplesamlphp-artifact-signature-1118': 154,
    'egroupware-saml-idp-selection-1118': 154,
    'nextjs-nested-cache-leak-1118': 155,
    'aws-jdbc-wrapper-deserialization-1118': 156,
    'arize-phoenix-format-string-1118': 156,
    'filament-curator-svg-tenant-1118': 157,
    'qbee-agent-lpe-symlink-1118': 157,
    'circutor-rucio-auth-bypass-1118': 154,
    'npm-malware-packages-1118': 158
  };
  for(const [id,scene] of Object.entries(scenes)) {
    for(const [suffix,lang] of [['','ja'],['.en','en']]) {
      const file='site/topics/'+id+suffix+'.html';
      assert.ok(fs.existsSync(file),file);
      const html=fs.readFileSync(file,'utf8');
      assert.ok(html.includes('/update-20261118-0900'+suffix),file);
      assert.ok(html.includes('/?lang='+lang+'#'+scene),file);
      assert.ok(html.includes('https://'),file);
      const report=fs.readFileSync('site/update-20261118-0900'+suffix+'.html','utf8');
      assert.ok(report.includes('href="/topics/'+id+suffix+'"'),id+' must be discoverable in '+lang);
    }
  }
});
