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
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await open('/tailworm.html?lang=ja','!!document.getElementById("actions") && !!window.TAILWORM_LANGUAGE_READY');
 assert.ok(await run('!!document.getElementById("lang-select")'),'Tailworm needs its own language dropdown');
 const codes=['en','ja','zh','ko','es','fr','de','pt','ru','ar','hi','id','uk'];
 await run('document.getElementById("privacy-reject")?.click();true');
 for (const code of codes) {
  await run(`document.getElementById('lang-select').value=${JSON.stringify(code)};document.getElementById('lang-select').dispatchEvent(new Event('change'));true`);
  for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,50));if(await run('document.documentElement.dataset.locale === '+JSON.stringify(code)+' && !!window.TAILWORM_LANGUAGE_READY'))break;}
  assert.equal(await run('document.documentElement.dataset.locale'),code,'locale did not change: '+code);
  assert.equal(await run('document.getElementById("lang-select").value'),code);
  assert.equal(await run('document.getElementById("lang-select").options.length'),13);
  assert.equal(await run('document.documentElement.dir'),code==='ar'?'rtl':'ltr');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,code+' horizontal overflow');
  assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'rejected storage must not persist '+code);
  assert.equal(await run('!!window.CONTENT || !!window.AUDIO'),false,'reading page must not start the motion briefing');
  assert.ok(await run('document.body.textContent.includes("1.104.2") && document.body.textContent.includes("0.29.5")'));
  assert.equal(await run(`new URL(document.querySelector('a[data-motion-link]').href).searchParams.get('lang')`),code);
  const target=await run(`(()=>{const s=document.querySelector('.language-picker-button')||document.getElementById('lang-select'),r=s.getBoundingClientRect();return {height:r.height,left:r.left,right:r.right,label:!!document.querySelector('label[for="lang-select"]')}})()`);
  assert.ok(target.label&&target.height>=44&&target.left>=0&&target.right<=390,code+' selector clipped');
 }
 for(const [width,height] of [[320,568],[844,390],[1440,900]]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const code of codes) {
   await open('/tailworm.html?lang='+code,'document.documentElement.dataset.locale === '+JSON.stringify(code)+' && !!window.TAILWORM_LANGUAGE_READY');
   assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,code+' overflow at '+width);
   assert.ok(await run('(document.querySelector(".language-picker-button")||document.getElementById("lang-select")).getBoundingClientRect().height>=44'));
  }
 }
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await open('/tailworm.html?lang=ar','document.documentElement.dataset.locale === "ar" && !!window.TAILWORM_LANGUAGE_READY');
 const fs=await import('node:fs');
 await run('document.getElementById("privacy-reject")?.click();true');
 const screenshot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/tailworm-ar-390.png',Buffer.from(screenshot.data,'base64'));
 // Consent allows the same language preference used by the main briefing.
 await run('document.getElementById("privacy-settings").click();document.getElementById("privacy-accept").click();document.getElementById("lang-select").value="en";document.getElementById("lang-select").dispatchEvent(new Event("change"));true');
 for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,50));if(await run('document.documentElement.dataset.locale==="en" && !!window.TAILWORM_LANGUAGE_READY'))break;}
 assert.equal(await run('localStorage.getItem("briefing-lang")'),'en');
 await open('/tailworm.html#actions','document.documentElement.dataset.locale === "en" && !!window.TAILWORM_LANGUAGE_READY');
 assert.equal(await run('location.hash'),'#actions','automatic locale redirect must preserve section');
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const code of codes){
  await open(code==='ja'?'/tailworm.html':'/tailworm.'+code+'.html','!!document.getElementById("actions")');
  assert.equal(await run('document.documentElement.dataset.locale'),code,'static locale missing '+code);
  assert.ok(await run('document.querySelector("h1").textContent.length>10'));
  assert.equal(await run('document.querySelectorAll(".language-fallback a").length'),13,'no-JS language links');
 }
 await cdp('Emulation.setScriptExecutionDisabled',{value:false});
 console.log('Tailworm:13 translated static locales at4sizes, native dropdown, RTL, shared links and consent passed');
} finally {await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close();}
