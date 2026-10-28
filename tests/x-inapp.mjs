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
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Twitter for iPhone'});
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await cdp('Page.navigate',{url:origin+'/?x-inapp-qa='+Date.now()});
 for(let n=0;n<100;n++){await pause(50);if(await run("document.readyState==='complete' && !!document.querySelector('.entry-impact') && !!document.documentElement.style.getPropertyValue('--app-height')"))break;}
 await run("Object.defineProperties(visualViewport,{height:{configurable:true,value:480},offsetTop:{configurable:true,value:60}});visualViewport.dispatchEvent(new Event('resize'));true");await pause(100);
 for(const selector of ['.entry-library','.entry-impact','.entry-control']){
  const r=await run(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}})()`);
  assert.ok(r.top>=60 && r.bottom<=540,selector+' obscured by X toolbar: '+JSON.stringify(r));
 }
 await cdp('Emulation.setSafeAreaInsetsOverride',{insets:{left:44,right:44,top:0,bottom:21}});
 await cdp('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true});
 await cdp('Page.navigate',{url:origin+'/impact?x-inapp-qa='+Date.now()});await ready('/impact');
 const padding=await run("(()=>{const s=getComputedStyle(document.querySelector('main'));return {left:parseFloat(s.paddingLeft),right:parseFloat(s.paddingRight)}})()");
 assert.ok(padding.left>=44 && padding.right>=44,'reading text enters notch area: '+JSON.stringify(padding));
 console.log('X-style toolbar offsets keep entrance links visible; landscape safe areas keep reading text clear.');
}finally{await cdp('Emulation.setSafeAreaInsetsOverride',{insets:{}});ws.close();}
