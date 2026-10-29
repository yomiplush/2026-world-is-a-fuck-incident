#!/usr/bin/env node
// Dynamic publication gate: use the current report and scene count, never a dated fixture.
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const root = path.resolve(process.argv[2] || '.');
  const site = path.join(root, 'site');
  const latest = JSON.parse(fs.readFileSync(path.join(root, 'data/latest.json')));
  const report = new URL(latest.site_report).pathname.replace(/\.html$/, '');
  const shots = process.env.INFOSEC_SCREENSHOTS;
  if (shots) fs.mkdirSync(shots, {recursive:true});
  const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css',
    '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png',
    '.mp3':'audio/mpeg','.opus':'audio/ogg','.woff2':'font/woff2'};
  const server = http.createServer((req,res)=>{
    let file;
    try {
      file = path.resolve(site, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if (!file.startsWith(site + path.sep) && file !== site) throw Error('outside root');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
      if (!fs.existsSync(file) && fs.existsSync(file+'.html')) file += '.html';
      if (!fs.statSync(file).isFile()) throw Error('not file');
      res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(404);res.end('Not found'); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  let checks = 0;
  try {
    browser = await chromium.launch({executablePath:process.env.INFOSEC_BROWSER,headless:true});
    for (const [width,height] of [[320,480],[390,844],[390,664],[844,390],[844,350],[1440,900]]) {
      const phone = width<=844 && height<=844;
      const device = phone ? {isMobile:true,hasTouch:true,deviceScaleFactor:3,
        userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'} : {};
      const context = await browser.newContext({...device,viewport:{width,height}, javaScriptEnabled:false});
      const page = await context.newPage();
      await page.goto(origin,{waitUntil:'load'});
      const boxes=await page.locator('.entry-library,.entry-latest,.entry-motion,.entry-impact,#repo-link,#patch-link').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {name:n.className,x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j];
        assert.ok(!(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y),'entrance controls overlap '+width+': '+a.name+' / '+b.name);
      }

      assert.equal(await page.locator('a.entry-motion').getAttribute('href'),'/?lang=ja#66');
      const latestLink=page.locator('a.entry-latest');
      assert.equal(await latestLink.getAttribute('href'),report);
      assert.match(await latestLink.innerText(),/10\/29 14:01/);
      assert.ok(await latestLink.isVisible(),'latest report link must be visible');
      assert.ok(await latestLink.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}),'latest link clipped');
      if(width===390)await page.screenshot({path:'/tmp/infosec-latest-entry.png'});
      await latestLink.click();
      assert.ok(await page.locator('h1').innerText(),'latest link must open article');
      checks++;
      for (const route of [report, report+'.en','/database','/database.en','/impact','/impact.en','/timeline','/briefing']) {
        const response = await page.goto(origin+route,{waitUntil:'load'});
        assert.equal(response.status(),200,route);
        assert.ok(await page.locator('h1').count(),route+' missing heading');
        assert.ok((await page.locator('main').innerText()).length>100,route+' empty transcript');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
        if (shots && width===390 && [report,'/impact','/timeline'].includes(route))
          await page.screenshot({path:path.join(shots,route.slice(1)+'-390.png'),fullPage:false});
        checks++;
      }
      await context.close();
      const motion = await browser.newContext({...device,viewport:{width,height},reducedMotion:'reduce'});
      const tab = await motion.newPage();
      const exceptions=[];
      tab.on('pageerror',e=>exceptions.push(e.message));
      await tab.goto(origin+'/?lang=ja&still=1#1');
      await tab.waitForFunction(()=>window.__booted===true,{timeout:20000});
      await tab.evaluate(()=>document.getElementById('privacy-reject')?.click());
      const rail=tab.locator('#rail');
      assert.ok(await rail.count(),'motion navigation missing');
      assert.ok(await rail.evaluate(e=>{
        const r=e.getBoundingClientRect();
        return e.scrollWidth<=e.clientWidth+1 && r.left>=-1 && r.right<=innerWidth+1 && r.top>=-1 && r.bottom<=innerHeight+1;
      }),'chapter navigation clipped '+width);
      const chapters=tab.locator('#rail .chapter-button');
      assert.ok(await chapters.count()>0,'no chapters');
      await chapters.first().click();
      assert.ok(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'motion overflow '+width);
      assert.deepEqual(exceptions,[],'motion exceptions');
      if (shots && width===390) await tab.screenshot({path:path.join(shots,'motion-390.png')});
      checks++;
      await tab.evaluate(()=>document.activeElement?.blur());
      const before = await tab.evaluate(()=>location.hash);
      await tab.keyboard.press('ArrowRight');
      await tab.waitForTimeout(100);
      assert.notEqual(await tab.evaluate(()=>location.hash),before,'keyboard next scene');
      const audio = tab.locator('#btn-audio');
      await audio.click();
      await audio.click();
      assert.equal(await audio.getAttribute('aria-pressed'),'false','audio must stop');
      checks++;
      assert.equal(await tab.locator('.chapter-button:not([hidden])').count(),5);
      await tab.locator('.chapter-page[data-direction=next]').click();
      assert.equal(await tab.locator('.chapter-button:not([hidden])').count(),3);
      await tab.locator('.chapter-button').nth(7).click();
      assert.equal(await tab.evaluate(()=>location.hash),'#66');
      assert.equal(await tab.locator('.chapter-button[aria-current=true] .chapter-square').innerText(),'●');
      assert.ok(await tab.locator('.chapter-page[data-direction=next]').isDisabled());
      const diagramChecks=await tab.evaluate(()=>{
        const canvas=document.createElement('canvas');canvas.width=480;canvas.height=340;
        const ctx=canvas.getContext('2d');const hashes=new Set();
        const hash=()=>{const a=ctx.getImageData(0,0,480,340).data;let h=2166136261;for(let i=0;i<a.length;i+=4)h=Math.imul(h^a[i]^a[i+1]^a[i+2],16777619)>>>0;return h;};
        for(const scene of CONTENT.scenes.slice(65)){
          VISUALS.setTilt(0,0);VISUALS.draw(scene.visual,ctx,480,340,1,false);const a=hash();
          VISUALS.draw(scene.visual,ctx,480,340,4.8,false);if(a===hash())throw Error(scene.id+' does not animate');
          if(hashes.has(a))throw Error(scene.id+' duplicates another diagram');hashes.add(a);
          VISUALS.setTilt(.6,.25);VISUALS.draw(scene.visual,ctx,480,340,1,false);if(hash()===a)throw Error(scene.id+' does not respond to camera');
          VISUALS.setTilt(0,0);VISUALS.draw(scene.visual,ctx,480,340,0,true);const still=hash();
          VISUALS.draw(scene.visual,ctx,480,340,20,true);if(hash()!==still)throw Error(scene.id+' ignores reduced motion');
        }
        return hashes.size;
      });
      assert.equal(diagramChecks,6);
      for(let number=66;number<=71;number++){
        await tab.evaluate(n=>{location.hash=String(n);},number);
        await tab.waitForTimeout(100);
        assert.ok(await tab.locator('#title').innerText());
        assert.ok(await rail.evaluate(e=>{const r=e.getBoundingClientRect();return e.scrollWidth<=e.clientWidth+1&&r.bottom<=innerHeight+1&&r.left>=-1&&r.right<=innerWidth+1;}),'latest rail clipped '+width);
        if(shots&&width===390&&height===844)await tab.screenshot({path:path.join(shots,'latest-'+number+'-390.png')});
        checks++;
      }
      await tab.locator('.chapter-page[data-direction=previous]').click();
      assert.equal(await tab.locator('.chapter-button:not([hidden])').count(),5);
      assert.deepEqual(exceptions,[],'latest diagram errors');
      checks++;
      await motion.close();
    }
    console.log(`${checks} current reading/motion viewport checks passed (including no-JS and chapter navigation)`);
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
