const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function model(){const scope={window:{}};vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),scope);scope.window.CONTENT.scenes=scope.window.CONTENT.scenes.slice(0,65);vm.runInNewContext(fs.readFileSync('site/chronology.js','utf8'),scope);return scope.window.BRIEFING_NAV;}
test('65 chronological scenes form six ten-scene chapters and one five-scene chapter',()=>{
 const nav=model();assert.ok(nav.chapters,'chapter model must be available');
 assert.deepEqual(Array.from(nav.chapters,g=>g.end-g.start),[10,10,10,10,10,10,5]);
 for(let i=0;i<nav.scenes.length;i++){
  const group=nav.chapterFor(i);assert.ok(group.start<=i&&i<group.end);
  assert.equal(nav.numberFor(nav.indexFor(nav.numberFor(i))),nav.numberFor(i),'shared scene numbers stay stable');
 }
 assert.equal(nav.chapterFor(64).end,65);assert.equal(nav.numberFor(64),53,'historical closing link remains53');
 assert.equal(nav.chapterFor(-1),null);assert.equal(nav.chapterFor(65),null);
});
