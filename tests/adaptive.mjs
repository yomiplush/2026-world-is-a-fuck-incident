import assert from 'node:assert/strict';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9236}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function open(args){
 await cdp('Page.navigate',{url:'http://127.0.0.1:8096/?lang=en&perf='+Date.now()+'&'+args});
 for(let i=0;i<80;i++){await pause(50);if(await run('window.__booted===true'))break;}
 await pause(180);
 await run('window.__drawCount=0;window.__drawTime=0;const draw=VISUALS.draw;VISUALS.draw=(...a)=>{__drawCount++;__drawTime=a[4];return draw(...a)};true');
}
async function count(ms=400){await run('__drawCount=0');await pause(ms);return run('__drawCount')}
async function key(k){await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:k});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:k})}
async function meter(ms){await run('__drawCount=0;window.__rafCount=0');await pause(ms);return run(`({draws:__drawCount,callbacks:__rafCount,pixels:document.getElementById('scene').width*document.getElementById('scene').height,effects:document.documentElement.dataset.renderEffects})`)}
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 const profile=async(cores,memory)=>{
  await cdp('Emulation.setHardwareConcurrencyOverride',{hardwareConcurrency:cores});
  return cdp('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>${memory}});const raf=requestAnimationFrame;window.__rafCount=0;window.requestAnimationFrame=fn=>raf(t=>{__rafCount++;fn(t)})`});
 };
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:2,mobile:false});
 let injection=await profile(2,2);await open('scene=18');
 const low=await meter(2000);assert.ok(low.draws>5&&low.draws<=31,JSON.stringify(low));assert.ok(low.pixels<=500000);assert.equal(low.effects,'minimal');assert.ok(low.callbacks<=low.draws*2+4);
 await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:1050,y:320,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:1150,y:345,button:'left',buttons:1});
 const interacting=await meter(2000);assert.ok(interacting.draws<=49,'low-device interaction exceeds24fps: '+JSON.stringify(interacting));
 await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:1150,y:345,button:'left',clickCount:1});
 await run(`Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));true`);const hidden=await meter(500);assert.equal(hidden.draws,0);assert.equal(hidden.callbacks,0);
 await run(`delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));true`);
 await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:injection.identifier});
 injection=await profile(8,8);await open('scene=18');
 const normal=await meter(2000);assert.ok(normal.draws>10&&normal.draws<=61,JSON.stringify(normal));assert.ok(normal.callbacks<=normal.draws*2+4);
 await run(`window.__layoutReads=0;const getRect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){if(this.id==='panel'||this.classList.contains('hud-top')||this.classList.contains('hud-bottom'))__layoutReads++;return getRect.call(this)};window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('briefingviewportchange'));true`);await pause(100);
 assert.ok(await run('__layoutReads<=3'),'resize should measure only once per frame');
 await run(`window.__realDraw=VISUALS.draw;VISUALS.draw=(...a)=>{const start=performance.now();while(performance.now()-start<28){}return __realDraw(...a)};true`);await pause(6500);
 const pressure=await meter(2000);assert.equal(pressure.effects,'minimal');assert.ok(pressure.pixels<normal.pixels);assert.ok(pressure.draws<=37,JSON.stringify(pressure));
 await run('VISUALS.draw=__realDraw;true');
 await open('still=1#18');const still=await meter(500);assert.equal(still.draws,0);assert.equal(still.callbacks,0);
 await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:injection.identifier});
 const fs=await import('node:fs');fs.writeFileSync('/tmp/incident-adaptive-verification.json',JSON.stringify({low,interacting,normal,pressure,hidden,still},null,2));
 console.log('Adaptive real-browser: '+JSON.stringify({low,interacting,normal,pressure,hidden,still}));
}finally{ws.close()}
