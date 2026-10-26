import assert from 'node:assert/strict';import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),requests=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function open(path,ready='!!window.LANGUAGE_PICKER'){const url=new URL('http://127.0.0.1:8096'+path);url.searchParams.set('picker-test',Date.now());await cdp('Page.navigate',{url:url.href});await pause(180);for(let i=0;i<100;i++){if(await run(ready))return;await pause(50)}throw Error('not ready '+path)}
async function panel(mode){await run('LANGUAGE_PICKER.open();true');for(let i=0;i<100;i++){if(await run('!!window.LANGUAGE_CATALOG'))break;await pause(30)}await run(`document.querySelector('[data-mode="${mode}"]').click();true`)}
async function query(value){await run(`document.getElementById('language-search').value=${JSON.stringify(value)};document.getElementById('language-search').dispatchEvent(new Event('input'));true`)}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  await open('/?lang=ja&still=1#56','window.__booted===true && !!window.LANGUAGE_PICKER');
  assert.equal(await run('!!window.LANGUAGE_CATALOG'),false,'catalog must be lazy');
  await run('document.getElementById("privacy-reject")?.click();true');await panel('google');
  assert.equal(await run('document.querySelectorAll(".language-results a").length'),249);
  const bounds=await run('document.getElementById("language-dialog").getBoundingClientRect().toJSON()');assert.ok(bounds.left>=0&&bounds.right<=width&&bounds.top>=0&&bounds.bottom<=height,JSON.stringify(bounds));
  for(const [search,code]of[['アフリカーンス','af'],['Cantonese','yue'],['ＺＨ－ＴＷ','zh-TW'],['francais','fr'],['bm-Nkoo','bm-Nkoo']]){
   await query(search);assert.equal(await run('document.querySelector(".language-results a")?.dataset.code'),code,search);
  }
  const link=await run('document.querySelector(".language-results a").href');const target=new URL(link);assert.equal(target.hostname,'translate.google.com');assert.equal(target.searchParams.get('u'),'https://www.infosec-briefing.net/briefing#scene-56');
  assert.equal(await run('localStorage.getItem("briefing-lang")'),null,'Google selection UI must not persist preferences');
  await query('no-such-language-zzzz');assert.equal(await run('document.querySelectorAll(".language-results a").length'),0);
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});assert.equal(await run('location.hash'),'#56');
  await query('');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await pause(80);assert.equal(await run('document.getElementById("language-dialog").open'),false);
 }
 await run('document.activeElement.blur();true');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'l'});
 for(let i=0;i<100;i++){await pause(30);if(await run('document.getElementById("lang-select").value==="zh"'))break;}
 assert.ok(await run('document.querySelector(".language-picker-button").textContent.includes("中文")'),'keyboard language changes must update the visible button');
 assert.equal(requests.some(u=>new URL(u).hostname==='translate.google.com'),false,'opening/searching the picker must not contact Google');
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await open('/?lang=ja#56','window.__booted===true && !!window.LANGUAGE_PICKER');
 await run('window.__languageDraws=0;const draw=VISUALS.draw;VISUALS.draw=(...a)=>{__languageDraws++;return draw(...a)};true');await panel('google');await pause(100);await run('__languageDraws=0');await pause(350);assert.equal(await run('__languageDraws'),0,'language panel must pause background rendering');
 await run('Object.defineProperty(visualViewport,"height",{configurable:true,value:400});visualViewport.dispatchEvent(new Event("resize"));true');await pause(80);
 assert.ok(await run('document.getElementById("language-dialog").getBoundingClientRect().bottom<=400'),'panel must fit the keyboard-reduced visual viewport');
 await run('delete visualViewport.height;document.querySelector(".language-close").click();true');await pause(250);assert.ok(await run('__languageDraws>0'),'closing the panel must resume animation');
 await open('/tailworm?lang=ja','!!window.TAILWORM_LANGUAGE_READY && !!window.LANGUAGE_PICKER');await panel('site');assert.equal(await run('document.querySelectorAll(".language-results button").length'),12);
 await run('document.querySelector(".language-option[data-code=en]").click();true');
 for(let i=0;i<100;i++){await pause(50);if(await run('document.documentElement.dataset.locale==="en" && !!window.TAILWORM_LANGUAGE_READY && !!window.LANGUAGE_PICKER'))break;}
 assert.equal(await run('document.documentElement.dataset.locale'),'en');await panel('google');assert.equal(await run('document.querySelector("#language-title").textContent'),'Choose a language');
 const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/incident-language-picker.png',Buffer.from(shot.data,'base64'));
 await open('/?lang=ja','!!window.LANGUAGE_PICKER');await panel('site');await run('document.querySelector(".language-option[data-code=fr]").click();true');
 for(let i=0;i<100;i++){await pause(50);if(await run('new URLSearchParams(location.search).get("lang")==="fr" && !!window.LANGUAGE_PICKER'))break;}
 assert.equal(await run('new URLSearchParams(location.search).get("lang")'),'fr');assert.equal(await run('typeof CONTENT'),'undefined','pre-unlock choice must not start heavy motion');
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});await open('/languages','!!document.querySelector("h1")');assert.equal(await run("Array.from(document.links).filter(a=>a.href.startsWith('https://translate.google.com/translate?')).length"),249); for(const path of ['/briefing','/briefing.en']){await open(path,'!!document.getElementById("scene-57")');assert.equal(await run('document.querySelectorAll("article").length'),57);assert.equal(await run('document.querySelector("article:last-of-type").id'),'scene-53');}
 console.log('249-language lazy searchable picker:4sizes, JA/EN/native/code search, no Google requests,12 on-site languages, Escape, no-JS directory and57-scene transcripts passed');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close()}
