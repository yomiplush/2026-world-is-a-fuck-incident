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
const agents={
 phone:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Twitter for iPhone',
 quest:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 OculusBrowser/38.0 Chrome/130.0 VR Safari/537.36',
 tv:'Mozilla/5.0 (Linux; Android 12; Android TV) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'
};
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [device,sizes] of [['phone',[[320,480],[390,480],[390,844],[844,350],[768,1024],[1024,768]]],['quest',[[600,600],[900,700],[1280,720],[1920,1080]]],['tv',[[960,540],[1280,720],[1920,1080],[3840,2160]]]]) {
  await cdp('Network.setUserAgentOverride',{userAgent:agents[device]});
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:device!=='tv'});
  for(const [width,height] of sizes) {
   await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:device==='phone'});
   for(const lang of ['ja','de','ar']) {
    await open('/?lang='+lang+'&still=1#56','window.__booted===true && document.documentElement.lang==='+JSON.stringify(lang));
    await run('document.getElementById("privacy-reject")?.click();true');
    const bad=await run(`(()=>{
     const ids=['#lang-select','#btn-audio','#btn-info','#btn-next','#btn-prev','#repo-link','#patch-link'];
     const bad=[];
     for(const id of ids){const e=document.querySelector(id),r=e.getBoundingClientRect();if(r.left<0||r.right>innerWidth+1||r.top<0||r.bottom>innerHeight+1||document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button,a,select')!==e)bad.push(id+' clipped or covered')}
     const p=document.getElementById('panel').getBoundingClientRect(),f=document.querySelector('.hud-bottom').getBoundingClientRect();
     if(p.height<45||p.bottom>f.top+1)bad.push('panel clipped');
     if(document.documentElement.scrollWidth>innerWidth)bad.push('horizontal overflow');
     if(window.__drawErr)bad.push('canvas error');
     if(innerWidth>=1100){const c=document.getElementById('scene').getBoundingClientRect();if(c.width<innerWidth*.3)bad.push('split diagram collapsed');}
     if(getComputedStyle(document.getElementById('lang-select')).fontSize!=='16px')bad.push('language text too small');
     return bad;
    })()`);
    failures.push(...bad.map(x=>device+' '+width+'x'+height+' '+lang+': '+x));
   }
   const shot=await cdp('Page.captureScreenshot',{format:'png'});
   const fs=await import('node:fs');fs.writeFileSync('/tmp/infosec-'+device+'-'+width+'.png',Buffer.from(shot.data,'base64'));
  }
 }
 assert.deepEqual(failures,[]);
 console.log('42 touch/tablet/Quest/TV viewport-locale layouts: hit targets, readable language control, panel, overflow and canvas passed');
}finally{ws.close()}
