// Entry and static report must work without starting the motion briefing.
import assert from 'node:assert/strict';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9236}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
let navigation=0;
async function open(path,ready){
 const url=new URL('http://127.0.0.1:8096'+path);url.searchParams.set('responsive-qa',Date.now()+'-'+String(++navigation));
 await cdp('Page.navigate',{url:url.href});
 for(let i=0;i<80;i++){
  await new Promise(r=>setTimeout(r,50));
  if(await run('location.href==='+JSON.stringify(url.href)+' && ('+ready+')')){await new Promise(r=>setTimeout(r,80));return;}
 }
 throw Error('not ready: '+path);
}
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await open('/?lang=ja&still=1#60','window.__booted===true');
 assert.equal(await run('!!navigator.brave && navigator.brave.isBrave()'),true,'run this test with real Brave');
 assert.equal(await run('document.documentElement.dataset.browser'),'brave','Brave compatibility mode must activate automatically');
 for(const [width,height] of [[320,480],[390,844],[601,700],[844,390],[1024,768],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const lang of ['ja','pl','sv'])for(const scene of [18,60,61]){
   await open('/?lang='+lang+'&still=1#'+scene,'window.__booted===true');
   await run('document.getElementById("privacy-reject")?.click();true');
   const state=await run(`(()=>{const p=document.getElementById('panel').getBoundingClientRect(),c=document.getElementById('scene').getBoundingClientRect(),f=document.querySelector('.hud-bottom').getBoundingClientRect();return {panel:p.toJSON(),canvas:c.toJSON(),footer:f.top,width:document.documentElement.scrollWidth,split:matchMedia('(min-width: 1100px), (min-width: 900px) and (min-height: 561px) and (min-aspect-ratio: 6/5)').matches,diagramVisible:getComputedStyle(document.getElementById('scene')).visibility!=='hidden',error:window.__drawErr}})()`);
   assert.ok(state.width<=width,'horizontal overflow');assert.equal(state.error,null);
   assert.ok(state.panel.height>=45 && state.panel.bottom<=state.footer+1,'copy clips into footer');
   if(!state.split)assert.ok(state.diagramVisible && state.canvas.bottom>state.panel.top,'Brave diagram must extend behind translucent copy: '+JSON.stringify(state));
   assert.deepEqual(await run(`({background:getComputedStyle(document.getElementById('panel')).backgroundColor,opacity:getComputedStyle(document.getElementById('panel')).opacity})`),{background:'rgba(8, 17, 27, 0.64)',opacity:'1'},'preserve opaque text over a translucent surface');
  }
 }
 console.log('Real Brave: automatic compatibility mode and54 scene/locale/viewport layouts passed');
}finally{ws.close()}
