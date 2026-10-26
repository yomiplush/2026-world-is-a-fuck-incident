const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const file=path.join(__dirname,'../site/language-core.js');
function core(){const context={window:{},URL};vm.createContext(context);vm.runInContext(fs.readFileSync(file,'utf8'),context);return context.window.LANGUAGE_CORE;}
test('search matches names, aliases and exact Google script/region codes',()=>{
 const c=core(),languages=[{code:'zh-TW',en:'Chinese (Traditional)',ja:'中国語（繁体）',native:'繁體中文'},{code:'fr',en:'French',ja:'フランス語',native:'Français'}];
 assert.equal(c.filter(languages,'繁體')[0].code,'zh-TW');assert.equal(c.filter(languages,'francais')[0].code,'fr');assert.equal(c.filter(languages,'ＺＨ－ＴＷ')[0].code,'zh-TW');assert.equal(c.filter(languages,'no-such-language').length,0);
});
test('translation links are external, encode trusted public URLs and preserve valid target codes',()=>{
 const c=core(),url=new URL(c.translationURL('bm-Nkoo','https://www.infosec-briefing.net/tailworm?lang=ja#actions'));
 assert.equal(url.origin,'https://translate.google.com');assert.equal(url.searchParams.get('tl'),'bm-Nkoo');assert.equal(url.searchParams.get('u'),'https://www.infosec-briefing.net/tailworm?lang=ja#actions');
 assert.throws(()=>c.translationURL('fr','javascript:alert(1)'));assert.throws(()=>c.translationURL('fr','https://evil.example/path'));assert.throws(()=>c.translationURL('fr&u=evil','https://www.infosec-briefing.net/'));
});
test('motion translation uses static transcript with the stable original scene number',()=>{
 const c=core();assert.equal(c.readingURL('https://www.infosec-briefing.net/','https://www.infosec-briefing.net/?lang=ru#56'),'https://www.infosec-briefing.net/briefing#scene-56');
 assert.equal(c.readingURL('https://www.infosec-briefing.net/tailworm?lang=ja','https://www.infosec-briefing.net/tailworm?lang=ja#actions'),'https://www.infosec-briefing.net/tailworm?lang=ja#actions');
});
