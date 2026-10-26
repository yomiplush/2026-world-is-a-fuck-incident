// Real browser integration checks. Start site on :8096 and Chrome CDP on :9236.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const targets = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9236}/json`)).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let seq = 0;
const pending = new Map(), errors = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); }
  else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
const run = async expression => {
  const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
await cdp('Runtime.enable'); await cdp('Page.enable');
await cdp('Network.enable'); await cdp('Network.setCacheDisabled', { cacheDisabled: true });
async function open(lang, width, height, args = 'still=1#1') {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  await cdp('Page.navigate', { url: `http://127.0.0.1:8096/?qa=${Date.now()}&lang=${lang}&${args}` });
  for (let i = 0; i < 60; i++) {
    await pause(60);
    if (args === '' ? await run("window.ENTRY && ENTRY.state === 'locked'") : await run('window.__booted === true && document.documentElement.lang === (window.LANGUAGES || []).find(l => l.code === ' + JSON.stringify(lang) + ')?.html')) return;
  }
  throw Error('Boot timeout: ' + lang);
}
const mode = process.argv[2];
const artifactDir = process.env.MOTION_ARTIFACTS || '/tmp/infosec-motion-rebuild-artifacts';
fs.mkdirSync(artifactDir, { recursive: true });
try {
  if (mode === 'baseline') {
    for (const [name, lang, w, h, n] of [['desktop','en',1440,900,18],['mobile','ja',390,844,25]]) {
      await open(lang, w, h, `still=1#${n}`); await pause(400);
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${artifactDir}/before-${name}.png`, Buffer.from(shot.data, 'base64'));
    }
  } else {
    await open('en', 1440, 900);
    await pause(250);
    // ?still=1 must freeze Canvas as well as CSS, even as the RAF loop advances.
    await run("window.__stillSnapshot = document.getElementById('scene').toDataURL(); true");
    await pause(160);
    assert.equal(await run("document.getElementById('scene').toDataURL() === window.__stillSnapshot"), true, 'still mode Canvas moved');
    const renderReport = await run(`(() => {
      const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
      const hash = () => { const d = ctx.getImageData(0,0,canvas.width,canvas.height).data; let h = 2166136261, lit = 0;
        for(let i=0;i<d.length;i+=4){h=Math.imul(h^d[i]^d[i+1]^d[i+2],16777619)>>>0; if(d[i]+d[i+1]+d[i+2]>170)lit++;} return [h,lit]; };
      const report = [], unique = new Set();
      for (const [w,h] of [[960,700],[390,320],[400,260],[320,220]]) {
        canvas.width=w; canvas.height=h;
        for (const scene of CONTENT.scenes) {
          VISUALS.setTilt(0,0);
          VISUALS.draw(scene.visual,ctx,w,h,1.2,false); const a=hash();
          VISUALS.draw(scene.visual,ctx,w,h,4.8,false); const b=hash();
          if(a[0]===b[0])throw Error(scene.id+' has no animation');
          if(a[1]<150)throw Error(scene.id+' is blank');
          if(w===960){if(unique.has(a[0]))throw Error(scene.id+' duplicate scene');unique.add(a[0]);}
          VISUALS.setTilt(.7,.3);VISUALS.draw(scene.visual,ctx,w,h,1.2,false);
          if(hash()[0]===a[0])throw Error(scene.id+' ignores camera');
          VISUALS.setTilt(0,0);VISUALS.draw(scene.visual,ctx,w,h,0,true);const c=hash();
          VISUALS.draw(scene.visual,ctx,w,h,12,true);if(hash()[0]!==c[0])throw Error(scene.id+' reduced motion moved');
          for(const [yaw,pitch] of [[0,0],[.8,.4],[-.8,-.4]]) {
            window.__labelSink=[];VISUALS.setTilt(yaw,pitch);VISUALS.draw(scene.visual,ctx,w,h,4,true);
            const labels=window.__labelSink;
            for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++) {
              const a=labels[i],b=labels[j];
              if(Math.abs(a.x-b.x)<(a.w+b.w)/2 && Math.abs(a.y-b.y)<(a.h+b.h)/2)
                throw Error(scene.id+' labels overlap at '+w+'x'+h+' / '+yaw+','+pitch);
            }
          }
          window.__labelSink=null;
          report.push(scene.id+' '+w+'x'+h);
        }
      }
      return report;
    })()`);
    console.log(`${renderReport.length} render combinations: unique scenes, animation, tilt, reduced motion passed`);
    const sceneCount = await run('CONTENT.scenes.length');
    assert.equal(sceneCount,61,'Tailworm, nightly and 07:47 morning updates must be present');
    for (const [lang, width, height] of [['ja',390,844],['en',1440,900],['ar',390,844],['ja',844,390],['ja',320,568],['en',375,667],['ja',768,1024],['en',1024,768],['ja',1280,800],['en',1920,1080]]) {
      await open(lang,width,height);
      const layout=await run(`(() => {const c=document.getElementById('scene').getBoundingClientRect(),p=document.getElementById('panel'),b=p.getBoundingClientRect(),a=document.getElementById('repo-link'),r=a.getBoundingClientRect();return {canvasBottom:c.bottom,panelTop:b.top,brave:document.documentElement.dataset.browser==="brave",canvasVisible:getComputedStyle(document.getElementById("scene")).visibility!=="hidden",bg:getComputedStyle(p).backgroundImage,bgc:getComputedStyle(p).backgroundColor,opacity:getComputedStyle(p).opacity,href:a.href,svg:!!a.querySelector('svg'),right:r.right,top:r.top}})()`);
      assert.equal(layout.href,'https://github.com/yomiplush/2026-world-is-a-fuck-incident');
      assert.ok(layout.svg && layout.right<=width && layout.right>width-60 && layout.top<=44,'GitHub must remain at top right');
      if(width<500){assert.ok(layout.canvasBottom>layout.panelTop+64,'phone diagram must remain visible behind translucent copy');assert.equal(layout.bgc,'rgba(8, 17, 27, 0.64)','only the panel background should be translucent');assert.equal(layout.opacity,'1','copy must remain opaque');}
      for (let i=0;i<sceneCount;i++) {
        const state=await run(`(() => {
          const panel=document.getElementById('panel'), box=panel.getBoundingClientRect();
          return {error:window.__drawErr, title:document.getElementById('title').textContent,
            sources:document.querySelectorAll('#source-list a').length, rail:document.querySelectorAll('.tick').length,
            docWidth:document.documentElement.scrollWidth, panelWidth:box.width, panelTop:box.top,
            panelBottom:box.bottom, footerTop:document.querySelector('.hud-bottom').getBoundingClientRect().top,
            more:!document.getElementById('more').hidden,overflow:panel.scrollHeight>panel.clientHeight+2};
        })()`);
        assert.equal(state.error,null,`${lang} scene ${i+1} draw error`);
        assert.equal(state.rail,sceneCount);assert.ok(state.title);assert.ok(state.sources>0);
        assert.ok(state.docWidth<=width+1,`${lang} horizontal overflow`);
        assert.ok(state.panelBottom<=state.footerTop+2,`${lang} panel overlaps footer`);
        if(state.overflow)assert.ok(state.more,`${lang} missing scroll affordance`);
        if ([0,5,17,20,24,25,29,31,33,40,41,42,43,44,45,46,47].includes(i) && height>500) {
          await pause(30);const shot=await cdp('Page.captureScreenshot',{format:'png'});
          fs.writeFileSync(`${artifactDir}/${lang}-${width}-${i+1}.png`,Buffer.from(shot.data,'base64'));
        }
        await run("document.getElementById('btn-next').click()"); await pause(20);
      }
      console.log(`${lang} ${width}x${height}: all ${sceneCount} scenes, copy, sources, layout passed`);
    }
    // Actual pointer input must rotate and retain the camera across navigation.
    await open('en',1440,900,'scene=18');
    const idleYaw=await run('RIG3D.cam(0,{yaw:0}).yaw');await pause(650);
    const orbitDelta=(await run('RIG3D.cam(0,{yaw:0}).yaw'))-idleYaw;
    assert.ok(orbitDelta>.015 && orbitDelta<.08,'idle orbit must be slow and continuous');
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:1050,y:320,button:'left',clickCount:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:1150,y:345,button:'left',buttons:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:1150,y:345,button:'left',clickCount:1});
    await pause(400);
    assert.ok(await run('VISUALS.getTilt().yaw > .2'),'drag did not rotate camera');
    await run("document.getElementById('btn-next').click()"); await pause(150);
    assert.ok(await run('VISUALS.getTilt().yaw > .2'),'camera angle lost after navigation');
    await run("document.getElementById('btn-info').click()");
    assert.equal(await run("document.getElementById('drawer').getAttribute('aria-hidden')"),'false');
    await run("document.getElementById('btn-close').click()");
    // A double tap resets the posed camera without advancing the scene.
    const titleBeforeReset=await run("document.getElementById('title').textContent");
    for(let i=0;i<2;i++) {
      await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:1100,y:320,button:'left',clickCount:i+1});
      await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:1100,y:320,button:'left',clickCount:i+1});
      await pause(70);
    }
    await pause(500);
    assert.ok(await run('Math.abs(VISUALS.getTilt().yaw)<.02'),'double tap did not reset camera');
    assert.equal(await run("document.getElementById('title').textContent"),titleBeforeReset);
    // Test the real start cover and keyboard commands, including synthesized audio.
    await open('en',1440,900,'');
    assert.equal(await run("document.getElementById('cover').classList.contains('hidden')"),false);
    const key=async k=>{
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:k});
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:k});
    };
    await key('Enter');
    for(let i=0;i<80;i++){await pause(50);if(await run("window.__booted === true && ENTRY.state === 'ready'"))break;}
    assert.equal(await run("document.getElementById('cover').classList.contains('hidden')"),true);
    await key('m');assert.equal(await run("document.getElementById('btn-audio').getAttribute('aria-pressed')"),'false');
    await key('m');assert.equal(await run("document.getElementById('btn-audio').getAttribute('aria-pressed')"),'true');
    await key('ArrowRight');
    assert.equal(await run("document.getElementById('title').textContent"),await run('CONTENT.scenes[1].en.title'));
    await key('ArrowLeft');await key('l');await pause(80);
    assert.equal(await run('document.documentElement.lang'),'ja');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await pause(200);await run("window.__stillSnapshot=document.getElementById('scene').toDataURL();true");
    await pause(140);
    assert.equal(await run("document.getElementById('scene').toDataURL()===window.__stillSnapshot"),true,'OS reduced-motion change did not freeze Canvas');
    await cdp('Emulation.setEmulatedMedia',{features:[]});
    // Every lazy locale must load and preserve all scene navigation entries.
    for(const lang of ['zh','ko','es','fr','de','pt','ru','hi','id']){
      await open(lang,390,844);await pause(120);
      assert.equal(await run("document.getElementById('lang-select').value"),lang);
      assert.equal(await run("document.querySelectorAll('.tick').length"),sceneCount);
      assert.equal(await run('window.__drawErr'),null);
    }
    assert.deepEqual(errors,[],'browser exceptions');
    console.log('Pointer input, camera retention/reset, keyboard, audio, OS motion preference, 12 locales: passed; no browser exceptions');
    fs.writeFileSync(`${artifactDir}/verification.json`,JSON.stringify({renderCombinations:renderReport.length,uiSceneChecks:sceneCount*10,locales:12,errors},null,2));
  }
} finally { ws.close(); }
