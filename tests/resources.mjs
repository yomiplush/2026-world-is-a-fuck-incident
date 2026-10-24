import assert from 'node:assert/strict';
const tabs=await(await fetch('http://127.0.0.1:9236/json')).json();
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
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:2,mobile:false});
 await open('still=1#18');
 assert.equal(await count(),0,'static view must not keep redrawing');
 const memory=await run("document.getElementById('scene').width*document.getElementById('scene').height*4");
 assert.ok(memory<=6000000,'Canvas raster budget exceeded');
 await key('ArrowRight');await pause(80);assert.equal(await count(),0,'static navigation must settle');
 console.log('Static view and navigation sleep; canvas stays within 6 MB');
 await open('scene=18');
 const frames=await count(1000);assert.ok(frames>0&&frames<=33,'steady playback exceeds frame budget: '+frames);
 await run("document.getElementById('btn-info').click()");
 assert.equal(await count(),0,'source drawer must pause animation');
 await run("document.getElementById('btn-close').click()");
 assert.ok(await count()>0,'closing drawer must resume');
 // A trusted key starts audio. Visibility changes preserve user intent and time.
 await key('m');await pause(150);assert.equal(await run('AUDIO.on'),true);
 const before=await run('__drawTime');
 await run("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));true");
 assert.equal(await count(500),0,'hidden view must own no render loop');
 assert.equal(await run('AUDIO.track.paused'),true);assert.equal(await run('AUDIO.on'),true);
 assert.equal(await run('AUDIO.ctx.state'),'suspended');
 await run("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));true");await pause(70);
 assert.ok((await run('__drawTime'))-before<.22,'hidden time leaked into the animation timeline');
 assert.equal(await run('AUDIO.on'),true);assert.equal(await run('AUDIO.ctx.state'),'running');
 const beforeLanguage=await run('__drawTime');await key('l');await pause(100);
 assert.ok((await run('__drawTime'))>=beforeLanguage,'language switch restarted animation');
 await run("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));true");
 assert.equal(await count(),0,'BFCache page must sleep');
 await run("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));true");
 assert.ok(await count()>0,'BFCache page did not resume');
 // Disposing a document releases the Canvas backing store and audio graph.
 await run("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false}));true");await pause(60);
 assert.equal(await run("document.getElementById('scene').width*document.getElementById('scene').height"),1);
 assert.equal(await run('AUDIO.ready'),false);
 console.log('Frame budget, drawer, visibility, audio, timeline, BFCache and disposal passed');
} finally {ws.close()}
