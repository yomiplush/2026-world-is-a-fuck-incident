import assert from 'node:assert/strict';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject({...m.error,method:p.method}):p.resolve(m.result)}};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,method});ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
async function open(path){const url='http://127.0.0.1:8096'+path;await cdp('Page.navigate',{url});for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,40));if(await run('location.href==='+JSON.stringify(url)+' && document.readyState==="complete"'))return;}throw Error('navigation '+path)}
async function languages(values) {
 await cdp('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 Chrome/145.0',acceptLanguage:values.join(',')});
}
async function visit(path,expected) {
 await cdp('Page.navigate',{url:'about:blank'});
 await cdp('Page.navigate',{url:'http://127.0.0.1:8096'+path});
 for(let i=0;i<150;i++){
  await new Promise(r=>setTimeout(r,40));
  try { if(await run('location.pathname==='+JSON.stringify(expected)+' && document.readyState==="complete" && !!window.PRIVACY'))return; } catch(error) { if(error.code!==-32000)throw error; }
 }
 throw Error('Language route did not settle: '+path+' -> '+expected+'; got '+await run('location.href'));
}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Storage.clearDataForOrigin',{origin:'http://127.0.0.1:8096',storageTypes:'local_storage'});
 await languages(['en-US','ja-JP']);
 await visit('/about?view=full#research-methodology','/about.en');
 assert.equal(await run('location.search+location.hash'),'?view=full#research-methodology');
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null);
 await visit('/about?lang=ja','/about');
 assert.equal(await run('document.documentElement.lang'),'ja');
 // Internal Japanese navigation remains a deliberate choice without consent.
 await run(`document.querySelector('nav.global a[href="/timeline"]').click()`);
 for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,40));if(await run('location.pathname==="/timeline" && document.readyState==="complete"'))break;}
 assert.equal(await run('location.pathname'),'/timeline');
 await languages(['ja-JP','en-US']);
 await visit('/about','/about');
 await visit('/about.en','/about.en');
 await languages(['fr-FR','ja-JP','en-US']);await visit('/about','/about');
 await languages(['fr-FR']);await visit('/about','/about.en');
 await languages(['en-US']);await visit('/about?lang=ja','/about');
 await run('document.getElementById("privacy-accept").click();PRIVACY.setLanguage("ja")');
 await visit('/about','/about');
 await visit('/?still=1#1','/');
 for(let i=0;i<150;i++){await new Promise(r=>setTimeout(r,40));if(await run('window.__booted===true'))break;}
 assert.equal(await run('document.documentElement.lang'),'ja','consented language must win in motion');
 await cdp('Storage.clearDataForOrigin',{origin:'http://127.0.0.1:8096',storageTypes:'local_storage'});
 await visit('/','/');
 assert.equal(await run('document.documentElement.lang'),'en','entrance must use browser language before unlock');
 assert.equal(await run('document.getElementById("privacy-reject").textContent'),'Reject');
 assert.equal(await run('new URL(document.querySelector(".privacy-dock a").href).pathname'),'/privacypolicy/index.en');
 assert.ok(await run('document.querySelector(".entry-latest").textContent.includes("Latest report")'));
 assert.equal(await run('new URL(document.querySelector(".entry-library").href).pathname'),'/database.en');
 assert.equal(await run('performance.getEntriesByType("resource").filter(r=>r.name.includes("/assets/motion-")).length'),0);
 await run('document.getElementById("privacy-reject").click()');
 await languages(['ja-JP']);
 await visit('/?lang=en&still=1#1','/');
 for(let i=0;i<150;i++){await new Promise(r=>setTimeout(r,40));if(await run('window.__booted===true'))break;}
 assert.equal(await run('document.documentElement.lang'),'en');
 assert.equal(await run('localStorage.getItem("briefing-lang")'),null);
 await visit('/tailworm?lang=ja','/tailworm');
 await run('document.getElementById("lang-select").value="en";document.getElementById("lang-select").dispatchEvent(new Event("change"))');
 for(let i=0;i<150;i++){await new Promise(r=>setTimeout(r,40));if(await run('location.pathname==="/tailworm.en" && document.readyState==="complete"'))break;}
 assert.equal(await run('location.pathname'),'/tailworm.en');
 await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 await open('/about');assert.equal(await run('document.documentElement.lang'),'ja');
 assert.ok(await run(`!!document.querySelector('noscript a[href="/about.en"]')`));
 console.log('Browser language negotiation passed: browser priority/fallback, explicit URLs, consent, manual navigation, motion entrance, Tailworm and no-JS links.');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close()}
