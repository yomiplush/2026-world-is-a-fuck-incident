import assert from 'node:assert/strict';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const cpuRate=Number(process.env.CPU_RATE||1);
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(tab=>tab.type==='page').webSocketDebuggerUrl);
await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
let id=0,navigation=0;const pending=new Map(),injections=[];
ws.onmessage=event=>{const message=JSON.parse(event.data);if(!message.id)return;const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(message.error):task.resolve(message.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});ws.send(JSON.stringify({id:next,method,params}))});
async function run(expression){const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(expression){
 for(let i=0;i<150;i++){
  try{if(await run(expression))return;}
  catch(error){if(error.code!==-32000||!/navigated|context/i.test(error.message||''))throw error;}
  await pause(40);
 }
 throw Error('Timed out: '+expression);
}
async function open(path,ready='window.__booted===true'){
 const url=new URL(path,origin);url.searchParams.set('compatibility-qa',String(++navigation));
 const previous=await run('performance.timeOrigin');
 await cdp('Page.navigate',{url:url.href});
 await until(`performance.timeOrigin!==${previous} && (${ready})`);
}
async function inject(source){const result=await cdp('Page.addScriptToEvaluateOnNewDocument',{source});injections.push(result.identifier);}
async function clear(){for(const identifier of injections.splice(0))await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier});}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Emulation.setCPUThrottlingRate',{rate:cpuRate});
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:640,deviceScaleFactor:1,mobile:true});
 await inject(`const nativeMatchMedia=window.matchMedia.bind(window);window.matchMedia=query=>{const result=nativeMatchMedia(query);Object.defineProperties(result,{addEventListener:{value:undefined},removeEventListener:{value:undefined}});return result};window.AudioContext=function(){throw new Error('disabled by device')};window.webkitAudioContext=undefined;`);
 await open('/?lang=en&still=1#18');
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'m'});
 assert.equal(await run('AUDIO.ready'),false);
 await run('document.getElementById("btn-next").click();true');
 assert.equal(await run('window.__drawErr'),null);
 assert.notEqual(await run('location.hash'),'#18','navigation must survive denied audio');
 await clear();
 await inject(`window.matchMedia=undefined;Object.defineProperty(window,'visualViewport',{value:undefined});`);
 await open('/?lang=ja&still=1#56');
 assert.equal(await run('document.documentElement.lang'),'ja');
 assert.equal(await run('window.__drawErr'),null);
 await clear();
 await inject('HTMLCanvasElement.prototype.getContext=()=>null;');
 await open('/?lang=en&still=1#18','location.pathname==="/briefing.en" && !!document.querySelector("h1")');
 assert.equal(await run('!!document.querySelector("a[href*=\\"#18\\"]")'),true,'fallback must retain access to the complete transcript');
 await clear();
 await inject('window.Promise=undefined;');
 await open('/?lang=ja','location.pathname==="/briefing" && !!document.querySelector("h1")');
 await clear();
 await inject(`CSS.supports=(property,value)=>property==='display'&&value==='grid'?false:true;`);
 await open('/?lang=en','location.pathname==="/briefing.en" && !!document.querySelector("h1")');
 await clear();
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 await open('/?lang=en','!!document.querySelector("noscript .static-fallback")');
 assert.equal(await run('document.querySelector("noscript .static-fallback").getBoundingClientRect().height>0'),true);
 await cdp('Emulation.setScriptExecutionDisabled',{value:false});
 await open('/?lang=en','!!window.ENTRY');
 const assets=await run(`performance.getEntriesByType('resource').map(entry=>new URL(entry.name).pathname)`);
 assert.equal(assets.filter(file=>file.startsWith('/assets/')&&/\.(?:js|css)$/.test(file)).length,3,'entry should use one stylesheet and two small scripts');
 assert.equal(assets.some(file=>file.includes('/motion-')||file.includes('/audio/')),false,'locked entry must defer engine and music');
 const listener=event=>{const message=JSON.parse(event.data);if(message.method==='Fetch.requestPaused')cdp('Fetch.fulfillRequest',{requestId:message.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:Buffer.from('not valid JavaScript !!!').toString('base64')}).catch(console.error)};
 ws.addEventListener('message',listener);
 await cdp('Fetch.enable',{patterns:[{urlPattern:'*/assets/motion-*'}]});
 await open('/?lang=en&still=1','window.ENTRY && ENTRY.state==="failed"');
 await cdp('Fetch.disable');ws.removeEventListener('message',listener);
 await run('window.__compatibilityErrors=[];window.addEventListener("error",event=>__compatibilityErrors.push(event.message));true');
 await run('document.getElementById("btn-start").click();true');
 try{await until('ENTRY.state==="ready"');}
 catch(error){throw Error(error.message+' '+JSON.stringify(await run('({state:ENTRY.state,errors:window.__compatibilityErrors,motion:performance.getEntriesByType("resource").filter(entry=>entry.name.includes("/motion-")).map(entry=>entry.name)})')));}
 console.log(`Compatibility passed at CPU rate ${cpuRate}: legacy media listeners, denied audio, absent optional APIs, missing Canvas/Promise/Grid, no-JS reading, initialization retry and three-resource lazy entry.`);
}finally{
 await clear();await cdp('Fetch.disable');await cdp('Emulation.setCPUThrottlingRate',{rate:1});await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close();
}
