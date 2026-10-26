// New reading surfaces remain useful without executing the motion application.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const register=JSON.parse(fs.readFileSync('data/2026-10-26-2135/incident-register.json','utf8'));
async function open(path){await cdp('Page.navigate',{url:'http://127.0.0.1:8096'+path});await pause(250)}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const path of ['/update-20261026-2135','/database','/about']){
   await open(path);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,path+' overflow at '+width);
   assert.ok(await run('!!document.querySelector("h1")'));assert.equal(await run('typeof CONTENT'),'undefined');
   assert.equal(await run('document.querySelector("link[rel=canonical]").href'),'https://www.infosec-briefing.net'+path);
   if(path==='/update-20261026-2135'){
    for(const [selector,kind]of[['#delta','delta'],['#continuity','scope-complement'],['#reference','reference-only']])assert.equal(await run(`document.querySelectorAll('${selector} article').length`),register.records.filter(r=>r.kind===kind).length);
    assert.ok(await run('document.body.textContent.includes("345契約") && document.body.textContent.includes("21:35")'));
   }
   if(path==='/database')assert.equal(await run('document.querySelectorAll("article").length'),37);
   if(path==='/about')assert.equal(await run('document.querySelector("a[href^=mailto]").getAttribute("href")'),'mailto:contact@yomiplush.dev');
  }
  await open('/?lang=ja');
  assert.equal(await run('document.querySelector(".entry-library").getAttribute("href")'),'/database');
  assert.equal(await run('document.querySelector(".entry-library").textContent.trim()'),'','no-JS entrance must use symbols');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
  if(width===390){const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/incident-reading-390.png',Buffer.from(shot.data,'base64'))}
 }
 console.log('Static21:35report37topics, database, editorial policy and symbolic root database access at4sizes passed withoutJS');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close()}
