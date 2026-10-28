import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(path){for(let i=0;i<100;i++){await pause(50);try{if(await run(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('.research-tabs')`))return;}catch(e){if(e.code!==-32000)throw e;}}throw Error('navigation timed out: '+path);}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const width of [320,390,768,1440]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:850,deviceScaleFactor:1,mobile:width<600});
  await cdp('Page.navigate',{url:origin+'/impact?qa='+Date.now()});await ready('/impact');
  assert.equal(await run('document.querySelectorAll(".impact-card").length'),16);
  assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'impact horizontal overflow at'+width);
  assert.equal(await run('document.querySelector(".research-tabs [aria-current=page]").pathname'),'/impact');
  assert.ok((await run('document.body.innerText')).includes('2,869,500'));
  const remote=await run('performance.getEntriesByType("resource").map(x=>x.name).filter(x=>!x.startsWith(location.origin))');
  assert.deepEqual(remote,[],'impact must not require remote services');
  if(width===390){const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/infosec-impact-390.png',Buffer.from(shot.data,'base64'));}
  await run('document.querySelector(".research-tabs a[href=\\"/database\\"]").click()');await ready('/database');
  assert.equal(await run('document.querySelector(".research-tabs [aria-current=page]").pathname'),'/database');
  assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'database horizontal overflow at'+width);
  await run('document.querySelector("details").open=true');
  assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'expanded advisory horizontal overflow at'+width);
  await run('document.querySelector(".research-tabs a[href=\\"/impact\\"]").click()');await ready('/impact');
 }
 for(const width of [320,390,768]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:640,deviceScaleFactor:1,mobile:width<600});
  await cdp('Page.navigate',{url:origin+'/?impact-entry-qa='+Date.now()});
  for(let n=0;n<100;n++){await pause(50);if(await run("location.pathname==='/' && document.readyState==='complete' && !!document.querySelector('.entry-impact')"))break;}
  const positions=await run("JSON.stringify(['.entry-impact','.entry-library','.patch-link','.repo-link'].map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect();return {selector,left:r.left,right:r.right,top:r.top,bottom:r.bottom,visible:!!e.offsetParent}}))");
  const [link,...others]=JSON.parse(positions);assert.ok(link.right<=width && link.left>=0);
  for(const other of others)assert.ok(link.right<=other.left || link.left>=other.right || link.bottom<=other.top || link.top>=other.bottom,'entrance links overlap at'+width+':'+other.selector);
 }
 const data=await(await fetch(origin+'/data/impact.json')).json();assert.equal(data.cutoff,'2026-10-28T04:18:44Z');
 console.log('Impact/database native tabs work without JavaScript at320/390/768/1440px;16sourcedexamples, nooverflow or remote resources.');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close();}
