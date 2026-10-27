import assert from 'node:assert/strict';import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),requests=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};const pause=ms=>new Promise(r=>setTimeout(r,ms));
let navigation=0;
async function open(path,ready='!!document.querySelector("h1")'){
 const url=new URL('http://127.0.0.1:8096'+path);url.searchParams.set('regression-qa',Date.now()+'-'+(++navigation));
 await cdp('Page.navigate',{url:url.href});
 for(let i=0;i<100;i++){await pause(40);if(await run('location.href==='+JSON.stringify(url.href)+' && ('+ready+')'))return;}
 throw Error('not ready '+path);
}
async function choose(selector,value){await run(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`)}
try {
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height] of [[320,480],[390,844],[844,350],[1440,900]]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  await open('/?lang=ja&still=1#1','window.__booted===true');await run('document.getElementById("privacy-reject")?.click();true');
  assert.equal(await run('document.querySelectorAll("#rail .chapter-button").length'),7);
  assert.equal(await run('document.querySelectorAll("#rail .scene-tick:not([hidden])").length'),10);
  assert.ok(await run('document.getElementById("rail").scrollWidth<=document.getElementById("rail").clientWidth'));
  await run('document.querySelectorAll("#rail .chapter-button")[1].click();true');
  assert.equal(await run('document.getElementById("chapter-dialog").open'),false);
  assert.equal(await run('location.hash==="#"+BRIEFING_NAV.numberFor(10)'),true);
  assert.match(await run('document.getElementById("chapter").textContent'),/第2章.*1\/10/);
  await run('document.querySelectorAll("#rail .scene-tick")[4].focus();document.querySelectorAll("#rail .scene-tick")[4].click();true');
  assert.equal(await run('location.hash==="#"+BRIEFING_NAV.numberFor(14)'),true);
  assert.equal(await run('document.activeElement===document.querySelectorAll("#rail .scene-tick")[4]'),true,'scene selection retains keyboard focus');
  assert.equal(await run('document.querySelectorAll("#rail .scene-tick")[4].getAttribute("aria-current")'),'step');
  await run('document.querySelectorAll("#rail .chapter-button")[6].click();true');
  assert.equal(await run('document.querySelectorAll("#rail .scene-tick:not([hidden])").length'),5);
  await run('document.querySelectorAll("#rail .scene-tick")[4].click();true');
  assert.equal(await run('location.hash'),'#53');
  await run('location.hash=BRIEFING_NAV.numberFor(9);true');await pause(60);
  const boundary=await run('location.hash');
  await run('document.getElementById("btn-next").click();true');
  assert.equal(await run('document.getElementById("chapter-dialog").open'),true,'pause at the chapter boundary');
  assert.equal(await run('location.hash'),boundary);
  await run('document.getElementById("chapter-rest").click();true');await pause(50);
  assert.equal(await run('document.getElementById("chapter-dialog").open'),false);
  assert.equal(await run('location.hash'),boundary,'rest does not advance the scene');
  assert.equal(await run('document.getElementById("chapter").dataset.resting'),'true');
  assert.equal(await run('document.getElementById("btn-next").getAttribute("aria-label")===document.querySelector("#btn-next .next-label").textContent'),true,'resume accessible name matches visible action');
  await run('document.getElementById("btn-next").click();true');
  assert.equal(await run('location.hash==="#"+BRIEFING_NAV.numberFor(10)'),true,'resume at the next chapter');
  await run('location.hash=BRIEFING_NAV.numberFor(19);true');await pause(60);
  await run('document.getElementById("btn-next").click();document.getElementById("chapter-continue").click();true');
  assert.equal(await run('location.hash==="#"+BRIEFING_NAV.numberFor(20)'),true);
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 }
 // Localized chapter controls must remain usable on the shortest portrait layout.
 await cdp('Emulation.setDeviceMetricsOverride',{width:320,height:480,deviceScaleFactor:1,mobile:true});
 await open('/?lang=ja&still=1#1','window.__booted===true');
 const languages=await run('LANGUAGES.map(l=>({code:l.code,html:l.html}))');
 for(const language of languages) {
  await choose('#lang-select',language.code);
  for(let i=0;i<120;i++){if(await run('document.documentElement.lang==='+JSON.stringify(language.html)))break;await pause(30);}
  assert.equal(await run('document.documentElement.lang'),language.html);
  const state=await run(`(()=>{const rail=document.getElementById('rail'),r=rail.getBoundingClientRect();return {fit:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,count:rail.querySelectorAll('.scene-tick:not([hidden])').length}})()`);
  assert.equal(state.count,10);assert.ok(state.fit,language.code+' inline navigation clipped');
 }
 // A real animated scene stops drawing when a reader takes a break.
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 const boundaryNumber=await run('BRIEFING_NAV.numberFor(9)');
 await open('/?lang=ja#'+boundaryNumber,'window.__booted===true');
 await run('document.getElementById("privacy-reject")?.click();window.__chapterDraws=0;window.originalChapterDraw=VISUALS.draw;VISUALS.draw=(...args)=>{__chapterDraws++;return originalChapterDraw(...args)};document.getElementById("btn-next").click();document.getElementById("chapter-rest").click();true');
 await pause(80);await run('window.__chapterDraws=0;true');await pause(250);
 assert.equal(await run('__chapterDraws'),0,'rest must suspend recurring rendering');
 await run('document.getElementById("btn-next").click();true');await pause(180);
 assert.ok(await run('__chapterDraws>0'),'next chapter resumes animation');
 // TV arrows can reach scene and chapter controls directly.
 await cdp('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Linux; Android 12; Android TV) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
 await open('/?lang=ja&still=1#1','window.__booted===true');
 await run('document.querySelector("#rail .scene-tick").focus();true');
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
 assert.equal(await run('!!document.activeElement.closest("#rail")'),true);
 console.log('Inline chapters:4sizes,15languages, direct scene/chapter selection, TV arrows and rest/resume passed');
}finally{ws.close()}
