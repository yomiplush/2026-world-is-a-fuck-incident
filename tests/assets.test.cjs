const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
test('HTML and generated entry refer to the same content-hashed production assets',()=>{
 const manifest=JSON.parse(fs.readFileSync('site/assets/manifest.json','utf8'));
 const html=fs.readFileSync('site/index.html','utf8');
 for(const key of ['platform','boot','css'])assert.ok(html.includes('/'+manifest.current[key]),key+' must be in HTML');
 for(const file of Object.values(manifest.current)) {
  const bytes=fs.readFileSync('site/'+file);
  assert.ok(file.includes(crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12)),file+' hash');
 }
 const boot=fs.readFileSync('site/'+manifest.current.boot,'utf8');
 assert.ok(boot.includes(manifest.current.motion),'entry must load its matching motion bundle');
 assert.ok(!html.includes('src="./entry.js'),'uncompressed entry must not also execute');
 assert.equal((html.match(/<link rel="stylesheet"/g)||[]).length,1);
 assert.equal((html.match(/<script src=/g)||[]).length,2);
 const motion=fs.readFileSync('site/'+manifest.current.motion,'utf8');
 assert.equal(/async\s+function\s/.test(motion),false,'motion must not require native async syntax');
});
test('ES5 compatibility guard can route a browser without Promise to the complete transcript',()=>{
 let destination;
 const scope={window:{location:{search:'?lang=ja',replace(url){destination=url}}},navigator:{language:'en'},document:{createElement:()=>({getContext(){}})}};
 vm.runInNewContext(fs.readFileSync('site/platform.js','utf8'),scope);
 assert.equal(destination,'/briefing');
});
