import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const tabs = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9238}/json`)).json();
const ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0, replacement = null;
const pending = new Map();
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Fetch.requestPaused') {
    const {requestId} = message.params;
    const action = replacement == null
      ? cdp('Fetch.continueRequest', {requestId})
      : cdp('Fetch.fulfillRequest', {requestId, responseCode: 200,
        responseHeaders: [{name: 'Content-Type', value: 'application/javascript'}],
        body: Buffer.from(replacement).toString('base64')});
    action.catch(error => { console.error(error); process.exitCode = 1; });
  }
  if (!message.id) return;
  const task = pending.get(message.id);
  pending.delete(message.id);
  message.error ? task.reject(message.error) : task.resolve(message.result);
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence; pending.set(id, {resolve, reject});
  ws.send(JSON.stringify({id, method, params}));
});
const run = async expression => {
  const result = await cdp('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
async function until(expression) {
  for (let i = 0; i < 100; i++) {
    if (await run(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  throw Error('Timed out: ' + expression);
}
const choose = code => run(`(()=>{const select=document.getElementById('lang-select');select.value=${JSON.stringify(code)};select.dispatchEvent(new Event('change'));return true})()`);
let navigation = 0;
async function open(query) {
  const url = new URL('http://127.0.0.1:8096/' + query);
  url.searchParams.set('locale-qa', String(++navigation));
  await run('window.__booted = false');
  await cdp('Page.navigate', {url: url.href});
  await until('window.__booted === true && location.href === ' + JSON.stringify(url.href));
}
try {
  await cdp('Page.enable');
  await cdp('Network.enable');
  await cdp('Network.setCacheDisabled', {cacheDisabled: true});
  await cdp('Fetch.enable', {patterns: [{urlPattern: '*/i18n/sv.js*'}, {urlPattern: '*/assets/locale-sv-*'}]});
  await open('?lang=ja&still=1#56');
  assert.deepEqual(await run('Array.from(document.getElementById("lang-select").options).filter(option=>!option.disabled).map(option=>option.value)'), ['en','ja','uk','pl','sv']);
  assert.equal(await run('document.querySelector("#lang-select option[value=fr]").textContent.includes("18/65")'), true);
  await choose('fr'); // Programmatic events must not bypass unavailable options.
  assert.equal(await run('document.documentElement.lang'), 'ja');
  assert.equal(await run('document.getElementById("lang-select").value'), 'ja');
  await run('document.getElementById("lang-select").blur();document.body.focus();true');
  await cdp('Input.dispatchKeyEvent', {type: 'keyDown', key: 'l', code: 'KeyL'});
  await until('document.documentElement.lang === "uk"');
  await open('?lang=fr&still=1#56');
  assert.equal(await run('document.getElementById("lang-select").value === "fr"'), false);
  assert.equal(await run('document.getElementById("panel").lang === document.documentElement.lang'), true);
  assert.equal(await run('performance.getEntriesByType("resource").some(entry=>(entry.name.includes("/i18n/fr.js")||entry.name.includes("/assets/locale-fr-")))'), false);
  assert.equal(await run('document.getElementById("hint").textContent.includes("18/65")'), true);
  for (const corrupt of [
    'window.registerLocale("sv", {ui:{},scenes:{}});',
    'window.registerLocale("sv", {ui:null,scenes:[]});',
    'window.registerLocale("wrong-code", {ui:{},scenes:{}});',
    'this is not valid JavaScript !!!'
  ]) {
    replacement = corrupt;
    await open('?lang=ja&still=1#56');
    await until('window.__booted === true && document.documentElement.lang === "ja"');
    const title = await run('document.getElementById("title").textContent');
    await choose('sv');
    await until('!document.getElementById("lang-select").hasAttribute("aria-busy")');
    assert.equal(await run('document.documentElement.lang'), 'ja', 'corrupt locale must retain the displayed language');
    assert.equal(await run('document.getElementById("title").textContent'), title);
    assert.equal(await run('document.getElementById("lang-select").value'), 'ja');
    assert.equal(await run('new URLSearchParams(location.search).get("lang")'), 'ja');
    assert.equal(await run('document.getElementById("lang-select").getAttribute("aria-invalid")'), 'true');
    replacement = null;
    await choose('sv');
    await until('document.documentElement.lang === "sv"');
    assert.equal(await run('document.getElementById("panel").lang'), 'sv');
    assert.equal(await run('location.hash'), '#56');
    assert.equal(await run('document.getElementById("lang-select").hasAttribute("aria-invalid")'), false);
  }
  replacement = 'window.registerLocale("sv", {ui:{},scenes:{}});';
  await open('?lang=sv&still=1#56');
  await until('!document.getElementById("lang-select").hasAttribute("aria-busy")');
  assert.equal(await run('document.documentElement.lang === "sv"'), false);
  assert.equal(await run('document.getElementById("panel").lang === document.documentElement.lang'), true);
  assert.equal(await run('new URLSearchParams(location.search).get("lang")'), 'sv', 'failed initial load must retain the requested URL');
  assert.equal(await run('document.getElementById("lang-select").getAttribute("aria-invalid")'), 'true');
  replacement = null;
  await open('?lang=uk&still=1#56');
  await until('document.documentElement.lang === "uk"');
  assert.equal(await run('location.hash'), '#56');
  const scope = {window: {}};
  vm.runInNewContext(fs.readFileSync(new URL('../site/data.js', import.meta.url), 'utf8'), scope);
  for (const code of ['en', 'ja', 'uk', 'pl', 'sv']) {
    await choose(code);
    await until('document.documentElement.lang === ' + JSON.stringify(code));
    let locale;
    if (!['en', 'ja'].includes(code)) vm.runInNewContext(fs.readFileSync(new URL(`../site/i18n/${code}.js`, import.meta.url), 'utf8'), {
      window: {registerLocale(_, value) { locale = value; }}
    });
    const expected = scope.window.CONTENT.scenes.map((scene, index) => ({number: index + 1,
      copy: locale ? locale.scenes[scene.id] : scene[code]}));
    const failures = await run(`(()=>{
      const failures=[];
      for(const scene of ${JSON.stringify(expected)}) {
        const index=BRIEFING_NAV.indexFor(scene.number);
        document.querySelectorAll('.chapter-button')[Math.floor(index/10)].click();
        document.querySelectorAll('.scene-tick')[index%10].click();
        if(document.getElementById('title').textContent!==scene.copy.title ||
           document.getElementById('lede').textContent!==(scene.copy.lede || '') ||
           document.getElementById('points').children.length!==scene.copy.points.length ||
           document.getElementById('panel').lang!==${JSON.stringify(code)}) failures.push({number:scene.number,title:document.getElementById("title").textContent,expected:scene.copy.title,panel:document.getElementById("panel").lang,points:document.getElementById("points").children.length,expectedPoints:scene.copy.points.length});
      }
      return failures;
    })()`);
    assert.deepEqual(failures, [], code + ' must display its own copy in all 65 scenes');
  }
  console.log('Corrupt, incomplete, wrong-code and syntax-error locales retain the current language; retries load Swedish in place.');
  console.log('All 65 scenes display the selected language in English, Japanese, Ukrainian, Polish and Swedish (325 scene checks).');
} finally {
  await cdp('Fetch.disable');
  ws.close();
}
