const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('November 13 appends six distinct bilingual explanations and preserves historical URLs', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),context);
  const scenes = context.window.CONTENT.scenes;
  const added = scenes.filter(s=>s.reviewCutoff==='2026-11-13T09:25:00Z');
  assert.equal(added.length,6);
  assert.equal(scenes[110].id,'motion-1111-scope');
  assert.equal(scenes[116].id,'motion-1113-scope');
  assert.equal(new Set(added.map(s=>s.visual.type)).size,6);
  assert.equal(added[0].chapterBreak,true);
  for (const scene of added) {
    assert.ok(scene.sources.length);
    for(const lang of ['ja','en']) assert.ok(scene[lang].title && scene[lang].points.length>=3);
  }
});
test('new topic pages link to their dated report and own language motion',()=>{
  const scenes={'rucio-auth-1113':118,'rails-imagemagick-1113':119,'aspire-dashboard-1113':117,'hono-routing-1113':120,'pgedge-rag-1113':121,'screenconnect-response-1113':122,'air-terminal6-1113':117,'kusanagi-nginx-1113':117};
  for(const [id,scene] of Object.entries(scenes)) {
    for(const [suffix,lang] of [['','ja'],['.en','en']]) {
      const file='site/topics/'+id+suffix+'.html';
      assert.ok(fs.existsSync(file),file);
      const html=fs.readFileSync(file,'utf8');
      assert.ok(html.includes('/update-20261113-1825'+suffix),file);
      assert.ok(html.includes('/?lang='+lang+'#'+scene),file);
      assert.ok(html.includes('https://'),file);
      const report=fs.readFileSync('site/update-20261113-1825'+suffix+'.html','utf8');
      assert.ok(report.includes('href="/topics/'+id+suffix+'"'),id+' must be discoverable in '+lang);
    }
  }
});
