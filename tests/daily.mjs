// Reader journeys: static date navigation without JS, then stable motion links.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tabs = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9236}/json`)).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); } };
const cdp = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const run = async expression => { const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
const pause = ms => new Promise(r => setTimeout(r, ms));
async function open(path) { await cdp('Page.navigate', { url: 'http://127.0.0.1:8096' + path }); await pause(250); }
try {
  await cdp('Page.enable'); await cdp('Network.enable');
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  for (const width of [320, 390, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
    await open('/timeline.html');
    assert.equal(await run('!!document.querySelector("h1")'), true, 'date archive must work without JavaScript');
    const days = await run('[...document.querySelectorAll(".day-card")].map(a=>a.getAttribute("href"))');
    assert.equal(days.length, 10, 'every date from PHP attempts to cutoff needs a page');
    for (const href of days) {
      await open('/' + href.replace('./', ''));
      assert.equal(await run('document.documentElement.scrollWidth <= innerWidth'), true, href + ' overflows at ' + width);
      assert.equal(await run('document.querySelectorAll("nav.dates a").length'), 10);
      assert.equal(await run(`document.querySelectorAll('nav.dates a[aria-current="page"]').length`), 1);
      assert.ok(await run(`document.querySelector('article a[href^="https://"]') !== null`), 'each day needs source links');
    }
    await open('/update-20261026.html');
    assert.equal(await run('document.documentElement.scrollWidth <= innerWidth'), true);
    assert.ok(await run('document.body.textContent.includes("10:27") && document.body.textContent.includes("撤回")'));
    await open('/update-20261026-1301.html');
    assert.equal(await run('document.documentElement.scrollWidth <= innerWidth'), true, 'noon report overflows');
    assert.equal(await run('document.querySelectorAll("#delta article").length'), 10);
    assert.equal(await run('document.querySelectorAll("#incidents article").length'), 7);
    assert.equal(await run('document.querySelectorAll("#reference article").length'), 1);
    assert.ok(await run('document.body.textContent.includes("13:01") && document.body.textContent.includes("未確定")'));
    assert.equal(await run(`[...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1)))`), true, 'report jumps need a target');
    if (width === 390 || width === 1440) {
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`/tmp/incident-latest-${width}.png`, Buffer.from(shot.data, 'base64'));
    }
  }
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  await open('/?lang=ja');
  assert.equal(await run('document.querySelector(".latest-update").getAttribute("href")'), './update-20261026-1301.html');
  assert.equal(await run('typeof CONTENT'), 'undefined', 'entry still defers briefing');
  await open('/?lang=ja&still=1#49');
  for (let i = 0; i < 80 && !(await run('window.__booted === true')); i++) await pause(50);
  assert.equal(await run('CONTENT.scenes.length'), 53);
  assert.ok(await run('document.getElementById("asof").textContent.includes("2026-10-26 13:01")'));
  assert.ok(await run('document.getElementById("title").textContent.includes("10:27")'));
  assert.equal(await run('window.__drawErr'), null);
  console.log('10 daily pages without JS, date navigation, sources, 4 widths, latest entry and morning scene passed');
} finally { ws.close(); }
