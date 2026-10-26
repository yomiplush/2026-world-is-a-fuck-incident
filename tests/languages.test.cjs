const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),catalog=JSON.parse(fs.readFileSync(path.join(root,'content/site-languages.json'),'utf8')).languages;
function content(){const scope={window:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'site/data.js'),'utf8'),scope);return scope.window;}
test('native dropdown offers only the configured major languages including Ukrainian',()=>{
 const data=content();assert.equal(catalog.length,13);assert.deepEqual(Array.from(data.LANGUAGES,r=>r.code),catalog.map(r=>r.code));assert.equal(catalog.find(r=>r.code==='uk').native,'Українська');
 const page=fs.readFileSync(path.join(root,'site/index.html'),'utf8');assert.ok(!page.includes('language-picker'));assert.ok(!page.includes('language-dialog'));
});
test('Ukrainian motion copy covers every actual scene and UI key without an English scene fallback',()=>{
 const data=content();let locale;const scope={window:{registerLocale:(code,value)=>{assert.equal(code,'uk');locale=value}}};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'site/i18n/uk.js'),'utf8'),scope);
 assert.deepEqual(Object.keys(locale.scenes).sort(),Array.from(data.CONTENT.scenes,r=>r.id).sort());
 for(const key of Object.keys(data.CONTENT.ui.en))assert.equal(typeof locale.ui[key],'string',key);
 for(const scene of data.CONTENT.scenes){const copy=locale.scenes[scene.id];assert.ok(copy.title,scene.id);assert.equal(typeof copy.lede,'string',scene.id);if(scene.en.lede)assert.notEqual(copy.lede,scene.en.lede,scene.id);assert.equal(copy.points.length,scene.en.points.length,scene.id);}
});
