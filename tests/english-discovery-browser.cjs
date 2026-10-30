#!/usr/bin/env node
// Run with Playwright available and INFOSEC_BROWSER pointing to a Chromium binary.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const site=path.resolve(__dirname,'../site');
const latest=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../data/latest.json')));
const englishReport=new URL(latest.site_report).pathname.replace(/\.html$/,'')+'.en';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(site,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==site&&!file.startsWith(site+path.sep))throw Error('outside root');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)&&fs.existsSync(file+'.html'))file+='.html';
  if(!fs.statSync(file).isFile())throw Error('not file');
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Not found');}
});
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser,checks=0;
 try{
  browser=await chromium.launch({executablePath:process.env.INFOSEC_BROWSER,headless:true,args:['--no-sandbox']});
  for(const [width,height] of [[320,480],[390,844],[844,390],[1440,900]]){
   const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:false});
   const page=await context.newPage();
   for(const route of ['/en/','/briefing.en',englishReport]){
    assert.equal((await page.goto(origin+route)).status(),200,route);
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+route+' '+width);
    assert.ok(await page.locator('a[href="/en/"]').first().isVisible());
    if(route==='/en/'){
     const hrefs=await page.locator('main a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
     for(const href of new Set(hrefs.filter(x=>x.startsWith('/'))))assert.equal((await page.request.get(origin+href)).status(),200,href);
     if(process.env.INFOSEC_SCREENSHOTS){fs.mkdirSync(process.env.INFOSEC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.INFOSEC_SCREENSHOTS,'english-hub-'+width+'.png'),fullPage:true});}
    }
    checks++;
   }
   await page.goto(origin+'/');
   const english=page.locator('.english-entry');
   const box=await english.boundingBox();
   assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=height,'English links outside viewport '+width);
   for(const selector of ['.entry-links','.entry-control','#repo-link','#patch-link','#sponsor-link']){
    const control=await page.locator(selector).boundingBox();
    if(control)assert.ok(!overlap(box,control),'English links overlap '+selector+' at '+width);
   }
   await english.locator('a[href="/en/"]').click();
   assert.equal(new URL(page.url()).pathname,'/en/');
   checks++;await context.close();
  }
  // Explicit English URLs remain English even for Japanese browser preferences.
  const context=await browser.newContext({locale:'ja-JP',viewport:{width:390,height:844}});
  const page=await context.newPage();
  for(const route of ['/en/',englishReport]){
   await page.goto(origin+route);await page.waitForLoadState('networkidle');
   assert.equal(new URL(page.url()).pathname,route);
   assert.equal(await page.locator('html').getAttribute('lang'),'en');checks++;
  }
  await context.close();console.log('English discovery browser checks passed:',checks);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
