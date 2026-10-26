import assert from 'node:assert/strict';import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};const pause=ms=>new Promise(r=>setTimeout(r,ms));
const manifest=JSON.parse(fs.readFileSync('data/translations/2026-10-26-2135/manifest.json','utf8'));const ready=Object.entries(manifest.languages).filter(([_,v])=>['source','translated'].includes(v.status));
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Emulation.setScriptExecutionDisabled',{value:true});
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<950});
  for(const [code,state] of ready){
   if(code==='ja')continue;
   const pack=JSON.parse(fs.readFileSync(state.file,'utf8')),path='/database.'+code;
   await cdp('Page.navigate',{url:'http://127.0.0.1:8096'+path});await pause(120);
   assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,path+' overflow '+width);
   assert.equal(await run('document.querySelectorAll("article").length'),pack.database.records.length);
   assert.equal(await run('document.querySelector("h1").textContent'),pack.strings['ui.title']);
   assert.equal(await run('document.querySelector("link[rel=canonical]").href'),'https://www.infosec-briefing.net'+path);
   assert.equal(await run('document.querySelectorAll("link[hreflang]").length'),ready.length+1);
   assert.equal(await run('Array.from(document.links).some(a=>new URL(a.href).hostname==="translate.google.com")'),false);
  }
  await cdp('Page.navigate',{url:'http://127.0.0.1:8096/'});await pause(120);
  const visible=await run(`(()=>{const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),texts=[];let node;while(node=walker.nextNode()){if(!node.textContent.trim())continue;const el=node.parentElement;if(!el||el.closest('script,style,noscript,[hidden]'))continue;const st=getComputedStyle(el);if(st.visibility!=='visible'||st.display==='none')continue;const range=document.createRange();range.selectNodeContents(node);if([...range.getClientRects()].some(r=>r.width&&r.height))texts.push(node.textContent.trim())}return texts})()`);
  assert.deepEqual(visible,[],'locked splash must contain no visible words');
 }
 console.log('Stored database pages: actual37records, self canonical, reciprocal ready-only hreflang,4sizes, no-JS and text-free splash passed');
}finally{await cdp('Emulation.setScriptExecutionDisabled',{value:false});ws.close()}
