const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('evening review keeps the requested cutoff across database, motion and dated report',()=>{
 const latest=JSON.parse(fs.readFileSync('data/latest.json','utf8'));
 assert.equal(latest.cutoff,'2026-10-27T09:47:00Z');
 const record=JSON.parse(fs.readFileSync('data/'+latest.incident_register,'utf8'));
 const scope={window:{}};vm.runInNewContext(fs.readFileSync('site/data.js','utf8'),scope);
 assert.equal(scope.window.CONTENT.review.cutoff,latest.cutoff);
 assert.equal(record.cutoff,latest.cutoff);
 assert.equal(scope.window.CONTENT.review.report,'/update-20261027-1847');
 for(const id of ['evening-disclosure','evening-release','evening-threshold','evening-package']){
  const scene=scope.window.CONTENT.scenes.find(s=>s.id===id);
  assert.ok(scene?.ja.title&&scene?.en.title&&scene?.sources.length,'missing authored evening scene '+id);
 }
 const html=fs.readFileSync('site/update-20261027-1847.html','utf8');
 assert.ok(html.includes('18:47 JST'));
 assert.ok(html.includes('KEVは2026.10.26版・1,758件で、前回保存原本に差分'),'KEV must describe the observed change');
 assert.ok(html.includes('CVE-2026-109618'));
 assert.equal(new Set(record.records.map(r=>r.id)).size,record.records.length);
 assert.equal(record.counts.record_topic_groups,record.records.length);
});
