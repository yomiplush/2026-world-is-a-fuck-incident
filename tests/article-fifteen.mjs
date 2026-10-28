import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const tabs=await(await fetch('http://127.0.0.1:9236/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const catalog=JSON.parse(fs.readFileSync(new URL('../content/site-languages.json',import.meta.url))).languages;
const privacy=Object.fromEntries(catalog.filter(r=>r.code!=='ja').map(r=>[r.code,JSON.parse(fs.readFileSync(new URL('../data/article-translations/'+r.code+'.json',import.meta.url))).strings]));
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 let checked=0;
 for(const width of [390,320,844])for(const language of catalog){
  if(width!==390&&!['ja','en','ar'].includes(language.code))continue;
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  for(const route of ['/about','/briefing','/update-20261028-1318','/privacypolicy/index']){
   const target=language.code==='ja'&&route==='/privacypolicy/index'?'/privacypolicy/':route+(language.code==='ja'?'':'.'+language.code);
   await cdp('Page.navigate',{url:origin+target+'?translation-test='+Date.now()});
   let ready=false;
   for(let i=0;i<100;i++){await pause(30);if(await run('location.pathname==='+JSON.stringify(target)+' && !!window.PRIVACY && !!document.querySelector("select[data-language-navigation]")')){ready=true;break;}}
   assert.ok(ready,target+' did not load');
   assert.equal(await run('document.documentElement.lang'),language.html,target);
   assert.deepEqual(await run('Array.from(document.querySelector("select[data-language-navigation]").options,o=>o.dataset.code)'),catalog.map(r=>r.code),target);
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),target+' overflow '+width);
   if(language.code==='ar')assert.equal(await run('document.documentElement.dir'),'rtl');
   const reject=language.code==='ja'?'拒否':privacy[language.code][createHash('sha256').update('拒否').digest('hex')];
   assert.equal(await run('document.getElementById("privacy-reject").textContent.trim()'),reject,target+' consent locale');
   checked++;
  }
 }
 console.log('Reading pages, same-article selectors, consent and responsive layouts:',checked,'checks passed');
}finally{ws.close()}
