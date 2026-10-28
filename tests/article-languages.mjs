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
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height,ua] of [[390,540,'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Twitter for iPhone'],[360,480,'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Version/4.0 Chrome/130.0 Mobile Safari/537.36 TwitterAndroid'],[844,390,'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Twitter for iPhone']]){
  await cdp('Network.setUserAgentOverride',{userAgent:ua});await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
  for(const page of ['impact','update-20261028-1318','day-20261021','about','privacypolicy/index','briefing']){
   const ja=page==='privacypolicy/index'?'/privacypolicy/':'/'+page;
   await cdp('Page.navigate',{url:origin+ja+'?article-language-qa='+Date.now()});await loaded(ja);
   await run("document.querySelector('select[data-language-navigation]').value='/"+page+".en';document.querySelector('select[data-language-navigation]').dispatchEvent(new Event('change',{bubbles:true}));true");
   await loaded('/'+page+'.en');assert.equal(await run('document.documentElement.lang'),'en');
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'English overflow '+page+' '+width);
   assert.equal(await run("document.querySelector('select[data-language-navigation]').selectedOptions[0].dataset.code"),'en');
   if(page==='impact')assert.equal(await run("document.querySelector('.research-tabs a[href=\"/database.en\"]').textContent"),'Research database');
   await run(`document.querySelector('select[data-language-navigation]').value=${JSON.stringify(ja)};document.querySelector('select[data-language-navigation]').dispatchEvent(new Event('change',{bubbles:true}));true`);await loaded(ja);assert.equal(await run('document.documentElement.lang'),'ja');
  }
 }
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});await cdp('Page.navigate',{url:origin+'/impact.en?nojs=1'});await loaded('/impact.en');
 assert.ok(await run("!!document.querySelector('noscript a[href=\"/impact\"]')"));
 console.log('Japanese/English native dropdown navigation passed for6readingroutes in3X-style viewports; nooverflow; no-JS links available.');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close();}
