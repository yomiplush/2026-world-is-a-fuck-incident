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
const failures=[];
try {
 await cdp('Page.enable'); await cdp('Network.enable'); await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for (const [width,height] of [[320,480],[360,640],[600,700],[601,700],[640,480],[700,700],[768,1024],[900,600],[1024,768],[1100,700],[1440,900]]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const lang of ['ja','en','de','ru','ar','uk']) {
   await open('/?lang='+lang+'&still=1#57','window.__booted===true');
   await run('document.getElementById("privacy-reject")?.click();true');
   const result=await run(`(()=>{
    const ids=['.hud-left .tag','#chapter','#lang-select','#btn-audio','#btn-info','#repo-link','#patch-link','#btn-next','#btn-prev','#more','.privacy-dock'];
    const rects=ids.map(id=>{const e=document.querySelector(id),r=e.getBoundingClientRect();return {id,x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height,visible:!e.hidden&&r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'}}).filter(r=>r.visible);
    const bad=[];for(let i=0;i<rects.length;i++){const a=rects[i];if(a.x<-.5||a.right>innerWidth+.5||a.y<0||a.bottom>innerHeight+.5)bad.push(a.id+' outside viewport');for(let j=i+1;j<rects.length;j++){const b=rects[j];if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1)bad.push(a.id+' overlaps '+b.id)}}
    const p=document.getElementById('panel').getBoundingClientRect(),f=document.querySelector('.hud-bottom').getBoundingClientRect();
    if(p.height<45||p.bottom>f.top+1)bad.push('text panel clipped');
    return bad;
   })()`);
   failures.push(...result.map(s=>`${lang} ${width}x${height}: ${s}`));
   await run('document.getElementById("btn-info").click();true');
   await new Promise(r=>setTimeout(r,350));
   const closeHit=await run(`(()=>{const e=document.getElementById('btn-close'),r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===e})()`);
   if(!closeHit)failures.push(`${lang} ${width}x${height}: source close covered`);
  }
 }
 console.log(failures.join('\n'));
 assert.deepEqual(failures,[],'responsive controls must remain separate, inside the viewport and usable');
 console.log('Responsive controls, source drawer, panel: 66 viewport/locale combinations passed');
}finally{ws.close()}
