import assert from 'node:assert/strict';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9236}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
let sequence=0;const pending=new Map();
ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const injections=[];
let navigation=0;
async function open(path='/?still=1&lang=en#1'){
 const target=new URL('http://127.0.0.1:8096'+path);
 target.searchParams.set('privacy-test',String(++navigation));
 await cdp('Page.navigate',{url:target.href});
 for(let i=0;i<100;i++){await pause(40);if(await run('!!window.PRIVACY && (location.pathname!=="/" || !!window.__booted)'))return;}
 throw Error('Privacy boot timeout: '+path);
}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await cdp('Page.navigate',{url:'http://127.0.0.1:8096/'});await pause(150);
 await run('localStorage.clear();localStorage.setItem("briefing-lang","de");true');
 await cdp('Page.reload',{ignoreCache:true});await pause(250);
 assert.equal(await run('!!document.getElementById("briefing-preferences")'),true,'first visit needs an explicit accept/reject choice');
 assert.equal(await run(`(()=>{const b=document.getElementById('briefing-preferences');const r=b.getBoundingClientRect();return !b.hidden && getComputedStyle(b).display!=='none' && r.height>40 && r.width>200})()`),true,'locked splash must still show reject/accept');
 assert.equal(await run(`['Reject','拒否'].includes(document.getElementById('privacy-reject').textContent.trim())`),true,'reject label is Reject or 拒否');

 await open();
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'legacy preference must be removed before consent');
 assert.equal(await run('PRIVACY.getChoice()'),null);
 // Actual EasyList Cookie generic selectors used by Brave. No browser security changes.
 await run(`(()=>{const style=document.createElement('style');style.textContent='#privacy-banner,.privacy-banner{display:none!important}';document.head.append(style);return true})()`);
 assert.equal(await run(`(()=>{const b=document.querySelector('[aria-labelledby="privacy-title"]');return getComputedStyle(b).display!=='none'&&b.getBoundingClientRect().height>0})()`),true,'preference choices must remain visible with Brave EasyList Cookie selectors');

 const buttons=await run(`['privacy-reject','privacy-accept'].map(id=>{const b=document.getElementById(id),r=b.getBoundingClientRect(),s=getComputedStyle(b);return {width:r.width,height:r.height,bg:s.backgroundColor,color:s.color}})`);
 assert.deepEqual(buttons[0],buttons[1],'accept and reject must have equal prominence and target sizes');
 const title=await run('document.getElementById("title").textContent');
 const point=await run(`(()=>{const r=document.querySelector('#briefing-preferences p').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
 await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
 await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});await pause(80);
 assert.equal(await run('document.getElementById("title").textContent'),title,'tapping consent prose must not advance the underlying briefing');
 const tilt=await run('window.__tilt.tiltTarget.yaw');
 await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
 await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x-50,y:point.y+15,button:'left',buttons:1});
 await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x-50,y:point.y+15,button:'left',clickCount:1});await pause(60);
 assert.equal(await run('window.__tilt.tiltTarget.yaw'),tilt,'dragging consent prose must not rotate the diagram');
 await run('document.getElementById("privacy-reject").click();true');
 assert.equal(await run('PRIVACY.getChoice()'),false);
 assert.equal(await run('document.getElementById("title").textContent'),title,'privacy choice must not advance the briefing');
 await run('document.getElementById("lang-select").value="ja";document.getElementById("lang-select").dispatchEvent(new Event("change"));true');await pause(80);
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'reject must allow language changes without persistent preferences');
 await open('/?still=1#1');
 assert.equal(await run('PRIVACY.getChoice()'),false,'rejection must survive reload');
 assert.equal(await run('document.getElementById("briefing-preferences").hidden'),true);
 await run(`(()=>{const style=document.createElement('style');style.textContent='#privacy-banner,.privacy-banner{display:none!important}';document.head.append(style);return true})()`);
 await run('document.getElementById("privacy-settings").click();true');
 assert.equal(await run('getComputedStyle(document.getElementById("briefing-preferences")).display!=="none"'),true,'saved choices must be reopenable from settings');
 await run('document.getElementById("privacy-accept").click();true');
 assert.equal(await run('PRIVACY.getChoice()'),true);
 await run('document.getElementById("lang-select").value="de";document.getElementById("lang-select").dispatchEvent(new Event("change"));true');await pause(180);
 assert.equal(await run('localStorage.getItem("briefing-lang")'),'de','consent must gate real preference storage');
 await open('/?still=1#1');assert.equal(await run('document.documentElement.lang'),'de');
 await open('/privacypolicy/');
 assert.equal(await run('PRIVACY.getChoice()'),true,'policy page must share the same consent state');
 assert.ok(await run(`Array.from(document.links).some(a=>a.href==='mailto:contact@yomiplush.dev')`));
 await run('document.getElementById("privacy-settings").click();document.getElementById("privacy-reject").click();true');
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'withdrawal must remove the optional stored preference');
 await run(`const expired=JSON.parse(localStorage.getItem('briefing-consent'));expired.updatedAt=Date.now()-181*86400000;expired.expiresAt=Date.now()-86400000;localStorage.setItem('briefing-consent',JSON.stringify(expired));localStorage.setItem('briefing-lang','fr');true`);
 await open();assert.equal(await run('PRIVACY.getChoice()'),null);assert.equal(await run('localStorage.getItem("briefing-lang")'),null);
 await run('localStorage.setItem("briefing-consent","invalid-json");true');await open();assert.equal(await run('PRIVACY.getChoice()'),null);
 const block=await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage disabled','SecurityError')}})`});
 injections.push(block.identifier);
 await open();await run('document.getElementById("privacy-reject").click();true');assert.equal(await run('PRIVACY.getChoice()'),false,'blocked storage must fail safely without blocking viewing');
 await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:block.identifier});
 const quota=await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`const backing=window.localStorage;Object.defineProperty(window,'localStorage',{value:{getItem:key=>backing.getItem(key),removeItem:key=>backing.removeItem(key),setItem(key,value){if(key==='briefing-consent')throw new DOMException('Quota exceeded','QuotaExceededError');backing.setItem(key,value)}}})`});
 injections.push(quota.identifier);
 await open();await run('document.getElementById("privacy-accept").click();PRIVACY.setLanguage("fr");true');
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'failed consent persistence must not leave optional values behind');
 await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier:quota.identifier});
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});await open('/privacypolicy/');
  await run('document.getElementById("privacy-settings").click();true');
  const size=await run(`({width:document.documentElement.scrollWidth,bottom:document.getElementById('briefing-preferences').getBoundingClientRect().bottom})`);
  assert.ok(size.width<=width+1,'privacy UI must not cause horizontal overflow');assert.ok(size.bottom<=height+1);
 }
 console.log('Privacy consent: prior blocking, rejection, acceptance, real language persistence, withdrawal, expiry, invalid/blocked storage, shared policy state and responsive choices passed');
}finally{for(const identifier of injections)await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier}).catch(()=>{});ws.close()}
