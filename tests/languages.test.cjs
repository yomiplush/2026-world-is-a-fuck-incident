const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),catalog=JSON.parse(fs.readFileSync(path.join(root,'content/site-languages.json'),'utf8')).languages;
function content(){const scope={window:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'site/data.js'),'utf8'),scope);return scope.window;}
test('native dropdown offers Japanese and English only',()=>{
 const data=content();assert.deepEqual(catalog.map(r=>r.code),['en','ja']);
 assert.deepEqual(Array.from(data.LANGUAGES,r=>r.code),['en','ja']);
});
test('both supported motion languages have every scene available',()=>{
 const data=content();const {audit}=require('../tools/check-motion-locales.cjs');
 assert.deepEqual(JSON.parse(JSON.stringify(data.MOTION_LOCALE_STATUS)),audit(root));
 assert.deepEqual(Object.keys(data.MOTION_LOCALE_STATUS),['en','ja']);
 for(const code of ['en','ja']){
  assert.equal(data.MOTION_LOCALE_STATUS[code].ready,true);
  assert.equal(data.MOTION_LOCALE_STATUS[code].translated,data.CONTENT.scenes.length);
 }
});
