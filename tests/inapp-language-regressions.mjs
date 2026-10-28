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
 const failures=[];
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await open('/?lang=ja&still=1#56','window.__booted===true');
 await run('document.getElementById("privacy-reject")?.click();true');
 // A toolbar/keyboard can pan the visual viewport as well as shrink it.
 await run(`Object.defineProperties(visualViewport,{height:{configurable:true,value:480},offsetTop:{configurable:true,value:60}});visualViewport.dispatchEvent(new Event('resize'));true`);
 await pause(80);
 const offset=await run(`(()=>{const a=document.getElementById('app').getBoundingClientRect(),d=document.querySelector('.privacy-dock').getBoundingClientRect();return {top:a.top,bottom:a.bottom,dockBottom:d.bottom}})()`);
 if(offset.top!==60||offset.bottom!==540||offset.dockBottom>540)failures.push('visual viewport offset ignored: '+JSON.stringify(offset));
 await run('delete visualViewport.height;delete visualViewport.offsetTop;visualViewport.dispatchEvent(new Event("resize"));true');
 // Hold a real locale script until a later language has already been selected.
 await run(`window.originalAppend=document.head.appendChild;document.head.appendChild=function(s){if(s.tagName==='SCRIPT'&&(s.src.includes('/i18n/uk.js')||s.src.includes('/assets/locale-uk-'))){window.heldLocale=s;return s}return originalAppend.call(this,s)};true`);
 await choose('#lang-select','uk');await choose('#lang-select','ja');
 await run('document.head.appendChild=originalAppend;document.head.appendChild(heldLocale);true');
 await pause(500);
 if(await run('document.documentElement.lang')!=='ja')failures.push('a stale locale request overwrote the last selection');
 // A locale download failure must allow selecting the same language again.
 await open('/?lang=ja&still=1#56','window.__booted===true');
 await run(`window.originalAppend=document.head.appendChild;document.head.appendChild=function(s){if(s.tagName==='SCRIPT'&&(s.src.includes('/i18n/sv.js')||s.src.includes('/assets/locale-sv-'))){queueMicrotask(()=>s.onerror());return s}return originalAppend.call(this,s)};true`);
 await choose('#lang-select','sv');await pause(50);
 await run('document.head.appendChild=originalAppend;true');await choose('#lang-select','sv');await pause(500);
 if(await run('document.documentElement.lang')!=='sv')failures.push('failed locale download cannot be retried');
 // Native controls must retain focus for a TV remote / keyboard.
 await open('/?lang=ja&still=1#56','window.__booted===true');
 await run('document.getElementById("lang-select").focus();true');await choose('#lang-select','en');await pause(50);
 if(!(await run('document.activeElement===document.getElementById("lang-select")')))failures.push('language selection discards keyboard focus');
 await cdp('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Linux; Android 12; Android TV) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
 await open('/?lang=ja&still=1#56','window.__booted===true');await run('document.getElementById("privacy-reject")?.click();true');
 if(await run('document.documentElement.dataset.device')!=='tv')failures.push('Android TV reading layout is missing');
 await run('document.activeElement.blur();true');
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown'});
 if(!(await run('document.activeElement!==document.body')))failures.push('remote arrows cannot focus any control');
 await run('document.getElementById("lang-select").focus();true');
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
 if(!(await run('document.activeElement===document.getElementById("btn-audio")')))failures.push('remote cannot leave the language control');
 await run('document.getElementById("btn-info").click();true');
 await run(`document.getElementById('source-list').insertAdjacentHTML('beforeend',Array.from({length:30},(_,i)=>'<li><a href="#source-'+i+'">Source '+i+'</a></li>').join(''));document.getElementById('btn-close').focus();true`);
 for(let i=0;i<50;i++){if(await run('document.activeElement===document.querySelector("#source-list li:last-child a")'))break;await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown'});}
 if(!(await run('document.activeElement===document.querySelector("#source-list li:last-child a")')))failures.push('remote cannot reach sources below the drawer viewport');
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 if(await run('document.getElementById("drawer").classList.contains("open")'))failures.push('focused source drawer cannot close with Escape');
 await cdp('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 OculusBrowser/38.0 Chrome/130.0 VR Safari/537.36'});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
 await open('/?lang=ja&still=1#56','window.__booted===true');
 if(await run('document.getElementById("lang-select").getBoundingClientRect().height')<44)failures.push('Quest language control is too small');
 console.log(failures);assert.deepEqual(failures,[]);
 console.log('Visual viewport offsets, latest-language selection, locale retry and retained focus passed');
}finally{ws.close()}
