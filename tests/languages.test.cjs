const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),catalog=JSON.parse(fs.readFileSync(path.join(root,'content/site-languages.json'),'utf8')).languages;
function content(){const scope={window:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'site/data.js'),'utf8'),scope);return scope.window;}
test('native dropdown offers only the configured major languages including Ukrainian, Polish and Swedish',()=>{
 const data=content();assert.equal(catalog.length,15);assert.deepEqual(Array.from(data.LANGUAGES,r=>r.code),catalog.map(r=>r.code));assert.equal(catalog.find(r=>r.code==='uk').native,'Українська');
 const page=fs.readFileSync(path.join(root,'site/index.html'),'utf8');assert.ok(!page.includes('language-picker'));assert.ok(!page.includes('language-dialog'));
});
test('motion dropdown availability matches the current translations and scene count',()=>{
 const data=content();
 assert.ok(data.MOTION_LOCALE_STATUS,'generated motion translation status is required');
 const {audit}=require('../tools/check-motion-locales.cjs');
 assert.deepEqual(JSON.parse(JSON.stringify(data.MOTION_LOCALE_STATUS)),audit(root));
 assert.deepEqual(Object.keys(data.MOTION_LOCALE_STATUS).filter(code=>data.MOTION_LOCALE_STATUS[code].ready),catalog.map(r=>r.code));
 for(const {code} of catalog){
  assert.equal(data.MOTION_LOCALE_STATUS[code].ready,true);
  assert.equal(data.MOTION_LOCALE_STATUS[code].translated,65);
  assert.equal(data.MOTION_LOCALE_STATUS[code].total,data.CONTENT.scenes.length);
 }
});
for(const code of catalog.map(r=>r.code).filter(c=>!['ja','en'].includes(c)))test(code+' motion copy covers every actual scene and UI key without an English scene fallback',()=>{
 const data=content();let locale;const scope={window:{registerLocale:(registered,value)=>{assert.equal(registered,code);locale=value}}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'site/i18n',code+'.js'),'utf8'),scope);
 assert.deepEqual(Object.keys(locale.scenes).sort(),Array.from(data.CONTENT.scenes,r=>r.id).sort());
 for(const key of Object.keys(data.CONTENT.ui.en))assert.equal(typeof locale.ui[key],'string',key);
 for(const scene of data.CONTENT.scenes){const copy=locale.scenes[scene.id];assert.ok(copy.title,scene.id);assert.equal(typeof copy.lede,'string',scene.id);if(scene.en.lede)assert.notEqual(copy.lede,scene.en.lede,scene.id);assert.equal(copy.points.length,scene.en.points.length,scene.id);
  const joined=c=>[c.kicker,c.title,c.lede,...c.points].join('\n');
  const technical=text=>(text.match(/CVE-\d{4}-\d+|GHSA-[a-z0-9]{4}(?:-[a-z0-9]{4}){2}|v?\d+(?:\.\d+)+/g)||[]).sort();
  const hrefs=text=>Array.from(text.matchAll(/href=["']([^"']+)["']/g),m=>m[1]).sort();
  assert.deepEqual(technical(joined(copy)),technical(joined(scene.en)),code+' technical identifiers: '+scene.id);
  assert.deepEqual(hrefs(joined(copy)),hrefs(joined(scene.en)),code+' source links: '+scene.id);
  if(scene.metric)assert.equal(typeof copy.metric,'string',code+' metric label: '+scene.id);
 }
});
