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
 const url=new URL('http://127.0.0.1:8096'+path);url.searchParams.set('responsive-qa',String(++navigation));
 await cdp('Page.navigate',{url:url.href});
 for(let i=0;i<80;i++){
  await new Promise(r=>setTimeout(r,50));
  if(await run('location.href==='+JSON.stringify(url.href)+' && ('+ready+')')){await new Promise(r=>setTimeout(r,80));return;}
 }
 throw Error('not ready: '+path);
}
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const [width,height] of [[320,480],[390,844],[601,700],[768,1024],[844,350],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const path of ['/database','/update-20261027-0747','/timeline','/database.en','/languages','/briefing']){
   await open(path,'document.readyState==="complete" && !!document.querySelector("h1")');
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth'),path+' horizontal overflow at '+width);
   if(path==='/database')assert.equal(await run('document.querySelectorAll("article").length'),23);
   if(path==='/database.en')assert.ok(await run('!!document.querySelector(".archive-notice")'),'older translations must identify their date');
   if(path==='/briefing')assert.equal(await run('document.querySelectorAll("article").length'),61);
   if(path==='/timeline')assert.ok(await run(`Array.from(document.querySelectorAll('.day-card')).every(e=>{const t=e.querySelector('time').getBoundingClientRect(),d=e.querySelector('div').getBoundingClientRect();return t.right<=d.left})`),'timeline date overlaps heading');
  }
 }
 await cdp('Emulation.setScriptExecutionDisabled',{value:false});
 const fs=await import('node:fs');
 for(const [width,height] of [[390,844],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const [name,path,ready] of [['report','/update-20261027-0747','document.readyState==="complete" && !!window.PRIVACY'],['motion','/?lang=ja&still=1#60','window.__booted===true']]){
   await open(path,ready);await run('document.getElementById("privacy-reject")?.click();true');
   const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/infosec-0747-'+name+'-'+width+'.png',Buffer.from(shot.data,'base64'));
  }
 }
 console.log('36 static reading checks: public23-topic data, archived translations,61-scene transcript and non-overlapping timeline at6sizes passed withoutJS');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close()}
