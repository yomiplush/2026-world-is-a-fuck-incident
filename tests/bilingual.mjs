import assert from 'node:assert/strict';
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:8096';
const tabs=await(await fetch('http://127.0.0.1:9236/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)};
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function open(path,ready='!!window.PRIVACY'){
 const target=new URL(origin+path);target.searchParams.set('bilingual',String(Date.now()));
 await cdp('Page.navigate',{url:target.href});
 for(let i=0;i<150;i++){await pause(30);if(await run('location.href==='+JSON.stringify(target.href)+' && document.readyState==="complete" && ('+ready+')'))return;}
 throw Error('Not ready: '+path);
}
try{
 await cdp('Page.enable');await cdp('Network.enable');await cdp('Network.setCacheDisabled',{cacheDisabled:true});
 let count=0;
 for(const width of [320,390,844])for(const code of ['ja','en']){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  for(const route of ['/about','/briefing','/languages','/database','/impact','/tailworm','/update-20261028-1318','/privacypolicy/index']){
   const target=code==='ja'?(route==='/privacypolicy/index'?'/privacypolicy/':route):route+'.en';
   await open(target+(route==='/tailworm'?'?lang='+code:''),`document.documentElement.lang===${JSON.stringify(code)} && !!window.PRIVACY && !!document.querySelector('select')`);
   const options=await run(`Array.from(document.querySelectorAll('select')).map(s=>Array.from(s.options).filter(o=>!o.disabled).map(o=>o.dataset.code||o.value.split('.').at(-1)))`);
   for(const codes of options)assert.equal(codes.length,2,target+' selector');
   assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),target+' overflow '+width);
   assert.equal(await run('document.getElementById("privacy-reject").textContent.trim()'),code==='ja'?'拒否':'Reject');
   count++;
  }
 }
 for(const code of ['en','ja']){
  await open('/?lang='+code+'&still=1#1','window.__booted===true && document.documentElement.lang==='+JSON.stringify(code));
  assert.deepEqual(await run('Array.from(document.getElementById("lang-select").options,o=>o.value)'),['en','ja']);
  const errors=await run(`(()=>{let errors=[];for(let n=1;n<=65;n++){const i=BRIEFING_NAV.indexFor(n);document.querySelectorAll('.chapter-button')[Math.floor(i/10)].click();document.querySelectorAll('.scene-tick')[i%10].click();const s=BRIEFING_NAV.scenes[i];if(document.getElementById('title').textContent!==s[${JSON.stringify(code)}].title)errors.push(n);}return errors})()`);
  assert.deepEqual(errors,[],code+' all scenes');
 }
 await open('/?lang=fr&still=1#1','window.__booted===true');
 assert.ok(['en','ja'].includes(await run('document.documentElement.lang')));
 assert.deepEqual(await run('Array.from(document.getElementById("lang-select").options,o=>o.value)'),['en','ja']);
 console.log('Bilingual site:',count,'reading/viewport checks, 130 motion scenes, retired-language fallback passed');
}finally{ws.close()}
