const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const worker=new Function(fs.readFileSync(require('node:path').join(__dirname,'../site/_worker.js'),'utf8').replace('export default','return'))();
test('legacy hosts permanently redirect while preserving path, query and browser fragment',async()=>{
 for(const host of ['infosec-briefing.net','infosec-briefing.yomiplush.dev','www.infosec-briefing.yomiplush.dev','2026-incident-briefing.pages.dev']){
  const r=await worker.fetch(new Request(`https://${host}/tailworm?lang=ja&from=x`),{});
  assert.equal(r.status,301);assert.equal(r.headers.get('Location'),'https://www.infosec-briefing.net/tailworm?lang=ja&from=x');
 }
});
test('canonical and preview assets pass through unchanged without loops',async()=>{
 const response=new Response('asset',{headers:{'Content-Security-Policy':"default-src 'self'"}});
 for(const host of ['www.infosec-briefing.net','preview.2026-incident-briefing.pages.dev']){
  const request=new Request('https://'+host+'/render.js');
  const r=await worker.fetch(request,{ASSETS:{fetch:r=>{assert.equal(r,request);return response}}});assert.equal(r,response);
 }
});

test('canonical HTTP is upgraded to HTTPS',async()=>{
 const r=await worker.fetch(new Request('http://www.infosec-briefing.net/database?q=test'),{});
 assert.equal(r.status,301);assert.equal(r.headers.get('Location'),'https://www.infosec-briefing.net/database?q=test');
});
