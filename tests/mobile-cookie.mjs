import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Fetch.requestPaused'){const {requestId,request}=m.params;cdp(request.url.startsWith(origin+'/')?'Fetch.continueRequest':'Fetch.failRequest',request.url.startsWith(origin+'/')?{requestId}:{requestId,errorReason:'BlockedByClient'}).catch(()=>{});return;}if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(path){for(let i=0;i<100;i++){await pause(50);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('.research-tabs')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('navigation timed out: '+path);}
async function loaded(path){for(let i=0;i<120;i++){await pause(40);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('select[data-language-navigation]')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('Not ready: '+path);}

async function openMotion(lang='ja'){
 const target=origin+'/?lang='+lang+'&still=1&toggle-qa='+Date.now()+'#57';
 await cdp('Page.navigate',{url:target});
 for(let n=0;n<180;n++){await pause(50);if(await run('location.href==='+JSON.stringify(target)+' && document.readyState==="complete" && window.__booted===true')){await run('document.getElementById("privacy-reject")?.click();true');await pause(120);return;}}
 throw Error('Motion failed to load');
}
async function usable(ids){
 const bad=await run(`(()=>{const ids=${JSON.stringify(ids)},rects=ids.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return {id,x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button,select')===e}});const bad=[];for(let i=0;i<rects.length;i++){const a=rects[i];if(a.x<0||a.right>innerWidth+1||a.y<0||a.bottom>innerHeight+1||a.h<44||!a.hit)bad.push(a);for(let j=i+1;j<rects.length;j++){const b=rects[j];if(Math.min(a.right,b.right)>Math.max(a.x,b.x)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y)+1)bad.push([a.id,b.id]);}}return bad})()`);
 assert.deepEqual(bad,[],'controls must be reachable without overlapping');
}

try{
 await cdp('Page.enable');await cdp('Page.bringToFront');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height]of [[320,480],[390,844],[430,932],[844,390]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  await openMotion();
  const r=await run("(()=>{const e=document.getElementById('privacy-settings'),r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,w:r.width,h:r.height,label:e.getAttribute('aria-label'),panel:document.getElementById('panel').getBoundingClientRect().height}})()");
  assert.ok(r.top<85,'cookie settings still uses bottom dock');assert.ok(r.w>=44&&r.h>=44);assert.ok(r.label);
  await usable(['privacy-settings','btn-info','lang-select','btn-text','btn-next']);
  await run('document.getElementById("privacy-settings").click();true');
  assert.equal(await run('document.getElementById("briefing-preferences").hidden'),false);
  assert.equal(await run('document.getElementById("privacy-settings").getAttribute("aria-expanded")'),'true');
  assert.ok(await run("Array.from(document.querySelectorAll('#briefing-preferences a')).some(a=>a.getAttribute('href')==='/privacypolicy/')"));
  await run('document.getElementById("privacy-reject").click();true');assert.equal(await run('document.activeElement.id'),'privacy-settings');
  await run('document.getElementById("btn-info").click();true');await pause(350);
  await usable(['btn-close']);
  await run('document.getElementById("btn-close").click();true');await pause(350);
 }
 console.log('Top cookie icon:4phone orientations,44px targets, policy access, settings/reject and returned focus passed.');
}finally{await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});ws.close();}
