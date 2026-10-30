const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function load(extra=0){const s={window:{}};vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),s);for(let i=0;i<extra;i++)s.window.CONTENT.scenes.push({id:'future-'+i,stamp:'11.01',en:{},ja:{}});vm.runInNewContext(fs.readFileSync('site/chronology.js','utf8'),s);return s.window;}
test('chapter windows keep every chapter reachable with at most five chapter controls',()=>{
 const {BRIEFING_NAV:nav}=load(1001);
 for(let i=0;i<nav.chapters.length;i++){
  const w=nav.chapterWindow(i,5);assert.ok(w.first<=i&&i<w.last);assert.ok(w.last-w.first<=5);
  if(w.previous!==null)assert.ok(w.previous<w.first);
  if(w.next!==null)assert.equal(w.next,w.last);
 }
 assert.equal(nav.chapterWindow(0,5).previous,null);
 assert.equal(nav.chapterWindow(nav.chapters.length-1,5).next,null);
 for(const i of [-1,NaN,Infinity,nav.chapters.length])assert.equal(nav.chapterWindow(i),null);
 assert.equal(nav.chapterWindow(0,0),null);
});
test('six latest scenes form a dedicated chapter and keep all 65 historical URLs',()=>{
 const {CONTENT:c,BRIEFING_NAV:nav}=load();
 const ids=['latest-scope','latest-chain','latest-audit','latest-disclosure','latest-passwords','latest-care'];
 assert.equal(c.scenes.length,71);
 for(let i=0;i<ids.length;i++){
  const scene=c.scenes[65+i];assert.equal(scene.id,ids[i]);assert.ok(scene.ja.title&&scene.en.title&&scene.sources.length);
  assert.equal(scene.stamp,'10.29 · 14:01 JST');assert.ok(scene.visual.type.startsWith('latest'));
  assert.equal(nav.chapterFor(nav.indexFor(66+i)).index,7);
 }
 assert.equal(nav.numberFor(nav.indexFor(53)),53);
 assert.equal(nav.scenes[nav.indexFor(53)].id,'closing');
 assert.deepEqual(Array.from(nav.chapters,g=>g.end-g.start),[10,10,10,10,10,10,4,7]);
 for(let n=1;n<=65;n++)assert.equal(nav.numberFor(nav.indexFor(n)),n);
});
test('both current articles open their own language at the first latest scene',()=>{
 for(const [suffix,lang] of [['','ja'],['.en','en']]){
  const html=fs.readFileSync('site/update-20261029-1401'+suffix+'.html','utf8');
  assert.ok(html.includes('/?lang='+lang+'#66'),lang+' article should open latest motion in its language');
 }
});
test('scope counts link to their stored research aggregation rather than only KEV',()=>{
 const {CONTENT:c}=load();const frozen='20261029T050117Z-dbf8f2';
 const record=JSON.parse(fs.readFileSync('data/'+frozen+'/incident-register.json','utf8'));
 assert.equal(c.scenes.find(s=>s.id==='latest-scope').metric.val,String(record.records.length),'dated scope counts must retain their original snapshot');
 const source=c.scenes.find(s=>s.id==='latest-scope').sources;
 assert.ok(source.some(s=>s.url.endsWith('/data/'+frozen+'/collection-summary.json')),'scope must cite the frozen NVD/GHSA aggregation');
 assert.ok(source.some(s=>s.url.endsWith('/data/'+frozen+'/impact-register.json')),'impact count must cite the frozen impact register');
});
