const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup({url='https://example.test/about',languages=['en-US'],language='en-US',saved=null,referrer='',alternates={ja:'/about',en:'/about.en'},canonical=url}={}) {
 const redirects=[],listeners={};const location=new URL(url);location.replace=url=>redirects.push(url);
 const links=Object.entries(alternates).map(([hreflang,href])=>({hreflang,href:new URL(href,url).href}));
 const scope={URL,navigator:{languages,language},location,document:{referrer,querySelector:()=>({href:canonical}),querySelectorAll:()=>links,addEventListener:(name,fn)=>listeners[name]=fn},window:{PRIVACY:{getLanguage:()=>saved}}};
 const file='site/language-preference.js';
 if(fs.existsSync(file))vm.runInNewContext(fs.readFileSync(file,'utf8'),scope);
 return {scope,redirects,ready:()=>listeners.DOMContentLoaded?.()};
}
test('first external visit negotiates the first supported browser language and keeps deep links',()=>{
 const page=setup({url:'https://example.test/about?view=full#research-methodology',languages:['fr-FR','en-GB','ja-JP']});page.ready();
 assert.deepEqual(page.redirects,['https://example.test/about.en?view=full#research-methodology']);
});
test('Japanese browser and unsupported-language fallback choose available counterparts',()=>{
 const ja=setup({languages:['ja-JP','en-US']});ja.ready();assert.deepEqual(ja.redirects,[]);
 const other=setup({languages:['fr-FR']});other.ready();assert.deepEqual(other.redirects,['https://example.test/about.en']);
});
test('explicit URL choices override browser and saved preferences',()=>{
 const ja=setup({url:'https://example.test/about?lang=ja',saved:'en'});ja.ready();assert.deepEqual(ja.redirects,[]);
 const enPath=setup({url:'https://example.test/about.en',languages:['ja-JP'],saved:'ja'});enPath.ready();assert.deepEqual(enPath.redirects,[]);
 const query=setup({url:'https://example.test/about.en?lang=ja',languages:['en-US']});query.ready();assert.deepEqual(query.redirects,['https://example.test/about?lang=ja']);
});
test('consent-managed preference wins but internal navigation is not redirected',()=>{
 const saved=setup({saved:'en',languages:['ja-JP']});saved.ready();assert.deepEqual(saved.redirects,['https://example.test/about.en']);
 const internal=setup({referrer:'https://example.test/about.en'});internal.ready();assert.deepEqual(internal.redirects,[]);
});
test('missing or cross-origin counterparts never redirect',()=>{
 for(const alternates of [{ja:'/about'},{ja:'/about',en:'https://other.test/about.en'}]){const p=setup({alternates});p.ready();assert.deepEqual(p.redirects,[]);}
});
test('shared resolution normalizes browser tags and ignores unavailable stored preferences',()=>{
 const p=setup({languages:['JA-jp'],saved:'de'});assert.equal(p.scope.window.BRIEFING_LANGUAGE?.resolve(),'ja');
 const fallback=setup({languages:[],language:'en-GB'});assert.equal(fallback.scope.window.BRIEFING_LANGUAGE?.resolve(),'en');
});

test('preview hosts negotiate canonical-language counterparts without leaving the preview',()=>{
 const page=setup({url:'http://127.0.0.1:8096/about',canonical:'https://www.infosec-briefing.net/about',alternates:{ja:'https://www.infosec-briefing.net/about',en:'https://www.infosec-briefing.net/about.en'}});page.ready();
 assert.deepEqual(page.redirects,['http://127.0.0.1:8096/about.en']);
});

test('legacy fallback follows the first supported browser language without modern APIs',()=>{
 let destination;
 const scope={window:{location:{search:'',replace:url=>destination=url}},navigator:{languages:['fr-FR','ja-JP','en-US'],language:'fr-FR'},document:{createElement:()=>({})}};
 vm.runInNewContext(fs.readFileSync('site/platform.js','utf8'),scope);
 assert.equal(destination,'/briefing');
});
