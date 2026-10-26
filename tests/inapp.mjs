// Entry and static report must work without starting the motion briefing.
import assert from 'node:assert/strict';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9236}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
async function open(path,ready){await cdp('Page.navigate',{url:'http://127.0.0.1:8096'+path});for(let i=0;i<80;i++){await new Promise(r=>setTimeout(r,50));if(await run(ready))return;}throw Error('not ready: '+path);}
try {
 await cdp('Page.enable'); await cdp('Network.enable');
 await cdp('Network.setCacheDisabled', {cacheDisabled:true});
 await cdp('Network.setUserAgentOverride', {userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone'});
 for (const [width,height] of [[320,480],[390,620],[393,659],[844,350],[320,568],[390,844],[1440,900]]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  await open('/?lang=ja','!!window.ENTRY');
  await run('document.getElementById("privacy-reject")?.click();true');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'entry horizontal overflow '+width);
  const hit = await run(`(()=>{const b=document.getElementById('btn-start'),r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===b}})()`);
  assert.ok(hit.top>=0 && hit.bottom<=height && hit.hit,'unlock clipped or covered '+width+'x'+height+JSON.stringify(hit));
  await open('/?lang=ja&still=1#18','window.__booted===true');
  await run('document.getElementById("privacy-reject")?.click();true');
  assert.equal(await run('document.getElementById("title").textContent.includes("カーネル")'),true,'legacy #18 changed');
  assert.equal(await run('window.__drawErr'),null);
  const layout = await run(`(()=>{const p=document.getElementById('panel').getBoundingClientRect(),b=document.getElementById('btn-next').getBoundingClientRect(),d=document.querySelector('.privacy-dock').getBoundingClientRect();return {scroll:document.documentElement.scrollWidth,app:document.getElementById('app').getBoundingClientRect().height,panel:p.height,pbottom:p.bottom,btop:b.top,bbottom:b.bottom,dtop:d.top,hit:document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.closest('button')?.id}})()`);
  assert.ok(layout.scroll<=width && layout.panel>25 && layout.pbottom<=layout.btop && layout.bbottom<=layout.dtop && layout.hit==='btn-next','navigation clipped '+width+'x'+height+JSON.stringify(layout));
  await run('document.getElementById("btn-next").click();true');
  assert.equal(await run('document.getElementById("stamp").textContent'),'10.17','next should follow date order');
  assert.equal(await run('location.hash'),'#5','sharing should preserve stable target numbers');
  await run('location.hash="41";true');
  await new Promise(r=>setTimeout(r,60));
  assert.equal(await run('document.getElementById("title").textContent.includes("Tailworm")'),true,'hash navigation');
 }
 // Resize the visible viewport after load: controls must follow the shorter area.
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:480,deviceScaleFactor:1,mobile:true});
 await new Promise(r=>setTimeout(r,100));
 assert.equal(await run('Math.round(document.getElementById("app").getBoundingClientRect().height)'),480);
 // In-app browser overlay: visible area shrinks, while layout viewport stays tall.
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await open('/?lang=ja','!!window.ENTRY');
 await run(`document.getElementById('privacy-reject')?.click();Object.defineProperty(window.visualViewport,'height',{configurable:true,value:480});window.visualViewport.dispatchEvent(new Event('resize'));true`);
 const overlay = await run(`(()=>{const r=document.getElementById('btn-start').getBoundingClientRect(),latest=document.querySelector('.latest-update').getBoundingClientRect(),dock=document.querySelector('.privacy-dock').getBoundingClientRect();return {layout:innerHeight,app:document.getElementById('app').getBoundingClientRect().height,keyBottom:r.bottom,latestTop:latest.top,dockBottom:dock.bottom,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')?.id}})()`);
 assert.equal(overlay.layout,844,'layout viewport must remain tall');
 assert.equal(overlay.app,480,'app must follow visual viewport independently');
 assert.ok(overlay.keyBottom<=overlay.latestTop && overlay.dockBottom<=480 && overlay.hit==='btn-start','overlay toolbar hides entry '+JSON.stringify(overlay));
 await run('ENTRY.open();true');
 for(let i=0;i<80 && !(await run('ENTRY.state === "ready"'));i++) await new Promise(r=>setTimeout(r,50));
 await run('document.getElementById("btn-info").click();true');
 assert.ok(await run('document.getElementById("drawer").getBoundingClientRect().bottom<=480'),'sources drawer must fit visible viewport');
 await run(`delete window.visualViewport.height;window.visualViewport.dispatchEvent(new Event('resize'));true`);
 const shot=await cdp('Page.captureScreenshot',{format:'png'});
 const fs=await import('node:fs');fs.writeFileSync('/tmp/incident-x-390x480.png',Buffer.from(shot.data,'base64'));
 console.log('X user agent: 7 viewports, unlock, readable panel, visible controls, stable links and dynamic resize passed');
} finally { ws.close(); }
