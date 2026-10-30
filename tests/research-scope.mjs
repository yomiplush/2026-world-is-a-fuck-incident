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
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const width of [320,390,768,844,1440]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<900});
  for(const suffix of ['', '.en']){
   await cdp('Page.navigate',{url:origin+'/database'+suffix+'?lang='+(suffix?'en':'ja')});await ready('/database'+suffix);
   const result=await run(`({lang:document.documentElement.lang,counts:['global','japan','regional','unresolved'].map(s=>document.querySelectorAll('#scope-'+s+' article').length),overflow:document.documentElement.scrollWidth>innerWidth,articles:document.querySelectorAll('article').length,links:[...document.querySelectorAll('a[href^="#scope-"]')].every(a=>!!document.getElementById(a.hash.slice(1)))})`);
   assert.deepEqual(result,{lang:suffix?'en':'ja',counts:[129,4,2,0],overflow:false,articles:135,links:true});
   await run(`document.querySelector('a[href="#scope-japan"]').click()`);
   assert.equal(await run('location.hash'),'#scope-japan');
  }
 }
 console.log('Scope sections: English/Japanese, five widths, 135 records, native navigation, no JavaScript or horizontal overflow: PASS');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});await cdp('Emulation.clearDeviceMetricsOverride');ws.close();}
