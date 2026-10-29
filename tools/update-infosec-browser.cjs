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
    for (const [width,height] of [[320,480],[390,844],[844,350],[1440,900]]) {
      const context = await browser.newContext({viewport:{width,height}, javaScriptEnabled:false});
      const page = await context.newPage();
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
      const motion = await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
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
      await motion.close();
    }
    console.log(`${checks} current reading/motion viewport checks passed (including no-JS and chapter navigation)`);
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
