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
 for(const [width,height,mobile]of [[320,480,true],[360,640,true],[390,844,true],[412,915,true],[600,700,true],[768,1024,true],[820,1180,true],[1024,768,true],[844,390,true],[915,412,true],[1280,720,false],[1440,900,false],[1920,1080,false]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:mobile});
  await cdp('Network.setUserAgentOverride',{userAgent:mobile?(width===390?'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Twitter for iPhone':'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36 TwitterAndroid'):'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'});
  await openMotion(width===768?'pl':width===820?'sv':width===1024?'uk':'ja');
  assert.equal(await run('!!document.getElementById("btn-text")'),true,'text toggle missing');
  await usable(['btn-text','btn-prev','btn-next','lang-select','btn-audio','btn-info']);
  assert.equal(await run('document.getElementById("btn-text").getAttribute("aria-expanded")'),'true');
  const before=await run('document.getElementById("scene").getBoundingClientRect().width');
  await run('document.getElementById("btn-text").click();true');await pause(100);
  assert.equal(await run('document.getElementById("panel").hidden'),true);
  assert.equal(await run('document.getElementById("btn-text").getAttribute("aria-expanded")'),'false');
  assert.equal(await run('document.getElementById("more").hidden'),true);
  if(width>=1100)assert.ok(await run('document.getElementById("scene").getBoundingClientRect().width')>before,'hidden text should free canvas space');
  await usable(['btn-text','btn-prev','btn-next']);
  await run('document.getElementById("btn-next").click();true');assert.equal(await run('document.getElementById("panel").hidden'),true,'scene navigation restores hidden panel');
  await run('document.getElementById("btn-info").click();true');await pause(350);
  assert.ok(await run('document.getElementById("drawer").classList.contains("open")'));
  await run('document.getElementById("btn-close").click();true');await pause(350);
  await run('document.getElementById("btn-text").focus();true');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(100);
  assert.equal(await run('document.getElementById("panel").hidden'),false);
  assert.equal(await run('document.activeElement.id'),'btn-text');
  assert.ok(await run('document.getElementById("panel").getBoundingClientRect().height>=45'));
  assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'));
 }
 // X app toolbars can change the visible viewport without a layout resize.
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
 await cdp('Emulation.setSafeAreaInsetsOverride',{insets:{top:47,bottom:34,left:0,right:0}});
 await openMotion();
 await run("Object.defineProperties(visualViewport,{height:{configurable:true,value:480},offsetTop:{configurable:true,value:60}});visualViewport.dispatchEvent(new Event('resize'));true");await pause(150);
 for(let i=0;i<2;i++){
  assert.ok(await run('document.getElementById("panel").hidden || document.getElementById("panel").getBoundingClientRect().height>=45'),'X toolbar leaves no readable text window');
  await usable(['btn-text','btn-prev','btn-next','lang-select','btn-info']);
  assert.ok(await run("['btn-text','btn-next','lang-select'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=60&&r.bottom<=540})"),'X toolbar obscures controls');
  await run('document.getElementById("btn-text").click();true');await pause(100);
 }
 const stableHeight=await run('document.documentElement.style.getPropertyValue("--app-height")');
 await run("Object.defineProperty(visualViewport,'scale',{configurable:true,value:2});visualViewport.dispatchEvent(new Event('resize'));true");await pause(100);
 assert.equal(await run('document.documentElement.style.getPropertyValue("--app-height")'),stableHeight,'pinch zoom must not change document sizing');
 await run("delete visualViewport.height;delete visualViewport.offsetTop;delete visualViewport.scale;visualViewport.dispatchEvent(new Event('resize'));true");
 await run('document.getElementById("btn-text").click();true');
 await cdp('Emulation.setSafeAreaInsetsOverride',{insets:{left:44,right:44,bottom:21,top:0}});
 await cdp('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true});await pause(150);
 assert.equal(await run('document.getElementById("panel").hidden'),true,'rotation should preserve hidden text');
 await usable(['btn-text','btn-prev','btn-next','lang-select','btn-info']);
 await run('document.getElementById("btn-text").click();true');await pause(100);
 const screenshot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/text-toggle-landscape.png',Buffer.from(screenshot.data,'base64'));
 console.log('Text/window toggle:13phone/tablet/desktop sizes, touch and keyboard, scene navigation, sources drawer and expanded canvas passed.');
}finally{await cdp('Emulation.setSafeAreaInsetsOverride',{insets:{}});await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});ws.close();}
