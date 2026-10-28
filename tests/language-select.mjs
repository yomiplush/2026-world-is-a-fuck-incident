import assert from 'node:assert/strict';import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),requests=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function open(path,ready='!!document.querySelector("h1")'){await cdp('Page.navigate',{url:'http://127.0.0.1:8096'+path});await pause(120);for(let i=0;i<100;i++){if(await run(ready))return;await pause(40)}throw Error('not ready '+path)}
async function choose(selector,value){await run(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`)}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height] of [[320,480],[390,844],[844,350],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  await open('/?lang=ja&still=1#56','window.__booted===true');
  assert.equal(await run('document.getElementById("lang-select").options.length'),15);
  assert.equal(await run('!!document.querySelector("dialog,.language-picker-button,.language-select-enhanced")'),false,'search dialog must be removed');
  assert.equal(await run('performance.getEntriesByType("resource").some(r=>(r.name.includes("/i18n/uk.js")||r.name.includes("/assets/locale-uk-")))'),false,'Ukrainian remains lazy');
  await run('document.getElementById("privacy-reject")?.click();true');
  for(const code of ['uk','pl','sv']){
   await choose('#lang-select',code);
   for(let i=0;i<100;i++){await pause(30);if(await run('document.documentElement.lang==='+JSON.stringify(code)))break;}
   assert.equal(await run('document.documentElement.lang'),code);assert.equal(await run('location.hash'),'#56');
   assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'motion overflow '+code+' '+width);
   assert.equal(await run('window.__drawErr'),null,'render error '+code);
  }
  assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'declined preferences stay unpersisted');
  const bounds=await run('document.getElementById("lang-select").getBoundingClientRect().toJSON()');assert.ok(bounds.width>=44&&bounds.height>=(width<950?44:32)&&bounds.left>=0&&bounds.right<=width,'native select clipped '+width+' '+JSON.stringify(bounds));
  await run('document.getElementById("lang-select").focus();true');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowLeft',code:'ArrowLeft'});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowLeft',code:'ArrowLeft'});assert.equal(await run('location.hash'),'#56','native selection keys must not advance the motion');
  await open('/tailworm.uk','!!window.TAILWORM_LANGUAGE_READY');assert.equal(await run('document.getElementById("lang-select").value'),'uk');assert.equal(await run('!!document.querySelector("dialog,.language-picker-button")'),false);
  await choose('#lang-select','ja');for(let i=0;i<100;i++){await pause(30);if(await run('document.documentElement.dataset.locale==="ja" && !!window.TAILWORM_LANGUAGE_READY'))break;}assert.equal(await run('document.documentElement.dataset.locale'),'ja');
  for(const code of ['uk','pl','sv']){
   await open('/database.'+code,'!!document.querySelector("select[data-language-navigation]")');assert.equal(await run('document.documentElement.lang'),code);assert.equal(await run('document.querySelectorAll("article").length'),65);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'database overflow '+code);
  }
  await choose('select[data-language-navigation]','/database.fr');for(let i=0;i<100;i++){await pause(30);if(await run('document.documentElement.lang==="fr"'))break;}assert.equal(await run('document.documentElement.lang'),'fr');

 }
 assert.equal(requests.some(u=>/language-(?:picker|core|catalog)/.test(new URL(u).pathname)),false,'removed assets must not be requested');
 assert.equal(requests.some(u=>new URL(u).hostname==='translate.google.com'),false);
 await open('/languages');assert.equal(await run('document.querySelectorAll("select[data-language-navigation]").length'),4);assert.equal(await run('document.querySelector("section select").options.length'),16);assert.equal(await run('document.body.textContent.includes("249")'),false);
 const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/incident-native-languages.png',Buffer.from(shot.data,'base64'));
 console.log('Native15-language dropdowns:4sizes, lazy Ukrainian/Polish/Swedish motion,65-record databases, Tailworm navigation, keyboard isolation, consent and no search dialog/external translator passed');
}finally{ws.close()}
