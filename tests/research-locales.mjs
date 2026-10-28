import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Fetch.requestPaused'){const {requestId,request}=m.params;cdp(request.url.startsWith(origin+'/')?'Fetch.continueRequest':'Fetch.failRequest',request.url.startsWith(origin+'/')?{requestId}:{requestId,errorReason:'BlockedByClient'}).catch(()=>{});return;}if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(path){for(let i=0;i<100;i++){await pause(50);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('.research-tabs')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('navigation timed out: '+path);}
async function loaded(path){for(let i=0;i<120;i++){await pause(40);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('select[data-language-navigation]')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('Not ready: '+path);}
const catalog=JSON.parse(fs.readFileSync('content/site-languages.json','utf8')).languages;
async function open(path){await cdp('Page.navigate',{url:origin+path+'?locale-qa='+Date.now()});await ready(path);}
async function waitPath(path){for(let n=0;n<150;n++){await pause(40);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('select[data-language-navigation]')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('Timeout: '+path);}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const width of [320,390,844]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:width===844?390:640,deviceScaleFactor:1,mobile:true});
  for(const language of catalog){
   const code=language.code,suffix=code==='ja'?'':'.'+code;
   await open('/impact'+suffix);
   assert.equal(await run('document.documentElement.lang'),language.html);
   assert.deepEqual(await run("Array.from(document.querySelector('select[data-language-navigation]').options).map(o=>o.dataset.code)"),catalog.map(r=>r.code));
   assert.equal(await run("document.querySelectorAll('.impact-card').length"),16);
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'impact overflow '+code+' '+width);
   if(code==='ar')assert.equal(await run('document.documentElement.dir'),'rtl');
   await run(`document.querySelector('.research-tabs a[href="/database${suffix}"]').click()`);await waitPath('/database'+suffix);
   assert.equal(await run('document.documentElement.lang'),language.html);
   assert.equal(await run('document.querySelectorAll("article").length'),65);
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'database overflow '+code+' '+width);
   await run('document.querySelector("details").open=true');
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'expanded version overflow '+code+' '+width);
   await run(`document.querySelector('.research-tabs a[href="/impact${suffix}"]').click()`);await waitPath('/impact'+suffix);
   assert.equal(await run("document.querySelector('select[data-language-navigation]').selectedOptions[0].dataset.code"),code);
  }
 }
 await open('/impact');
 await run("document.querySelector('select[data-language-navigation]').value='/impact.ar';document.querySelector('select[data-language-navigation]').dispatchEvent(new Event('change',{bubbles:true}));true");await waitPath('/impact.ar');assert.equal(await run('document.documentElement.dir'),'rtl');
 const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/impact-ar-844.png',Buffer.from(shot.data,'base64'));
 console.log('15locales x3viewport widths:16impact cases,65database topics, locale-preserving tabs, expandedversiondetails and ArabicRTL passed.');
}finally{ws.close();}
