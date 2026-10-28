// Replay the previous release's cached loader against current source modules.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tabs=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT||9238}/json`)).json();
const ws=new WebSocket(tabs.find(tab=>tab.type==='page').webSocketDebuggerUrl);
await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
let id=0,legacyLoader=false;const pending=new Map(),errors=[],nonce=Date.now();
const page=fs.readFileSync(new URL('../site/index.html',import.meta.url),'utf8').replace(/<!-- runtime-assets:start -->[\s\S]*?<!-- runtime-assets:end -->/,
 '<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/mobile.css"><link rel="stylesheet" href="/privacy.css">'+
 ['browser-ui','viewport','privacy','audio','entry'].map(file=>`<script src="/${file}.js?v=previous-release" defer></script>`).join(''));
const previous=fs.readFileSync(new URL('./fixtures/legacy-entry.js',import.meta.url),'utf8');
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});ws.send(JSON.stringify({id:next,method,params}))});
ws.onmessage=event=>{
 const message=JSON.parse(event.data);
 if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
 if(message.method==='Fetch.requestPaused'){
  const request=message.params;
  const html=new URL(request.request.url).pathname==='/';
  const result=html||legacyLoader?cdp('Fetch.fulfillRequest',{requestId:request.requestId,responseCode:200,
   responseHeaders:[{name:'Content-Type',value:html?'text/html; charset=utf-8':'application/javascript'}],body:Buffer.from(html?page:previous).toString('base64')}):cdp('Fetch.continueRequest',{requestId:request.requestId});
  result.catch(console.error);
 }
 if(!message.id)return;const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(message.error):task.resolve(message.result);
};
async function run(expression){const result=await cdp('Runtime.evaluate',{expression,returnByValue:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
try{
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp('Fetch.enable',{patterns:[{urlPattern:'http://127.0.0.1:8096/?legacy-delivery*',resourceType:'Document'},{urlPattern:'*/entry.js*'}]});
 for(const old of [false,true]){
  legacyLoader=old;const previousTime=await run('performance.timeOrigin');
  await cdp('Page.navigate',{url:'http://127.0.0.1:8096/?legacy-delivery='+Number(old)+'-'+nonce+'&lang=ja&still=1#56'});
  let ready=false;
  for(let i=0;i<120;i++){
   await new Promise(resolve=>setTimeout(resolve,40));
   if(await run(`performance.timeOrigin!==${previousTime} && window.__booted===true && ENTRY.state==='ready'`)){ready=true;break;}
  }
  assert.equal(ready,true,(old?'cached previous entry must load current modules':'previous HTML must load current entry')+' '+JSON.stringify({errors,state:await run('({url:location.href,entry:window.ENTRY?.state,platform:!!window.PLATFORM,booted:window.__booted,files:performance.getEntriesByType("resource").map(row=>new URL(row.name).pathname)})')}));
  assert.equal(await run('document.documentElement.lang'),'ja');
  assert.equal(await run('location.hash'),'#56');
 }
 console.log('Previous HTML with current entry, and cached previous entry with current controller, both boot successfully.');
}finally{await cdp('Fetch.disable');ws.close();}
