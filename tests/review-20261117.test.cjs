const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 17 appends six distinct bilingual explanations and preserves historical URLs', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const added = scenes.filter(s=>s.reviewCutoff==='2026-11-17T00:00:00Z');
  assert.equal(added.length,6);
  assert.equal(scenes[140].id,'motion-1116-1133-scope');
  assert.equal(scenes[146].id,'motion-1117-scope');
  assert.equal(new Set(added.map(s=>s.visual.type)).size,6);
  assert.equal(added[0].chapterBreak,true);
  for (const scene of added) {
    assert.ok(scene.sources.length);
    for(const lang of ['ja','en']) assert.ok(scene[lang].title && scene[lang].points.length>=3);
  }
});
test('new November 17 topic pages link to their dated report and own language motion',()=> {
  const scenes={
    'aiohttp-security-release-1117': 148,
    'nuxt-security-fixes-1117': 149,
    'sveltekit-security-fixes-1117': 149,
    'nextjs-cache-leak-1117': 149,
    'mcp-security-kubeshark-codereview-1117': 150,
    'silverstripe-rce-auth-1117': 151,
    'mail-parser-batch-traversal-1117': 152,
    'nltk-code-exec-traversal-1117': 152,
    'qbee-agent-zipslip-directus-1117': 152,
    'npm-malware-packages-1117': 152
  };
  for(const [id,scene] of Object.entries(scenes)) {
    for(const [suffix,lang] of [['','ja'],['.en','en']]) {
      const file='site/topics/'+id+suffix+'.html';
      assert.ok(fs.existsSync(file),file);
      const html=fs.readFileSync(file,'utf8');
      assert.ok(html.includes('/update-20261117-0900'+suffix),file);
      assert.ok(html.includes('/?lang='+lang+'#'+scene),file);
      assert.ok(html.includes('https://'),file);
      const report=fs.readFileSync('site/update-20261117-0900'+suffix+'.html','utf8');
      assert.ok(report.includes('href="/topics/'+id+suffix+'"'),id+' must be discoverable in '+lang);
    }
  }
});
