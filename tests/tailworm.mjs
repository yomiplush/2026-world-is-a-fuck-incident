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
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const width of [320,390,768,1440]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:width===390?844:900,deviceScaleFactor:1,mobile:width<500});
  await open('/?lang=ja','!!window.ENTRY');
  assert.equal(await run('typeof CONTENT'),'undefined','entry must retain deferred loading');
  await run('document.getElementById("privacy-reject")?.click();true');
  const link=await run(`(()=>{const a=document.querySelector('.tailworm-feature');if(!a)return null;const r=a.getBoundingClientRect();return {href:a.getAttribute('href'),h:r.height,left:r.left,right:r.right,visible:getComputedStyle(a).display!=='none'}})()`);
  assert.ok(link,'Tailworm needs a prominent native entry link');assert.equal(link.href,'./tailworm.html');
  assert.ok(link.visible&&link.h>=44&&link.left>=0&&link.right<=width,'feature link clipped');
  assert.equal(await run(`(()=>{const a=document.querySelector('.tailworm-feature'),r=a.getBoundingClientRect(),b=document.querySelector('.latest-update').getBoundingClientRect();return r.bottom<=b.top && document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest('a')===a})()`),true,'feature must remain clickable and not overlap latest link');
  await run("document.querySelector('.tailworm-feature').click()");
  for(let i=0;i<80;i++){await new Promise(r=>setTimeout(r,50));if(await run("location.pathname==='/tailworm.html' && !!document.querySelector('#actions')"))break;}
  assert.equal(await run('!!document.querySelector("#actions")'),true,'feature link should reach actionable report');
  assert.equal(await run('!!window.CONTENT || !!window.AUDIO'),false,'static feature should not load briefing or audio');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'feature page overflow');
 }
 await open('/?lang=ja&still=1#41','window.__booted===true');
 assert.equal(await run('document.getElementById("title").textContent.includes("Tailworm")'),true,'stable feature deep link');
 assert.equal(await run('CONTENT.scenes.filter(s=>s.id.startsWith("tailworm-")).length'),6);
 for(let n=41;n<=46;n++){
  await open('/?lang=en&still=1#'+n,'window.__booted===true');
  assert.ok(await run('document.getElementById("title").textContent.length>8'));
  assert.ok(await run('CONTENT.scenes['+(n-1)+'].sources.length>=2'));
 }
 console.log('Tailworm entry, 4 widths, static actions, deferred audio and 6 bilingual deep links passed');
}finally{ws.close()}
