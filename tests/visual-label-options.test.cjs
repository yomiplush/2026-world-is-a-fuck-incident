const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function labelsFor(visual) {
  const labels = [];
  const noop = () => {};
  const geometry = new Proxy({ label(position, text) { labels.push(text); } },
    { get(target, key) { return target[key] || noop; } });
  const colors = new Proxy({}, { get(target, key) { return String(key); } });
  const scope = { window: { RIG3D: {
    C: colors, TAU: Math.PI * 2, a: color => color,
    clamp: (value, low, high) => Math.max(low, Math.min(high, value)),
    cam: () => ({}), rig: () => geometry, setView: noop
  } } };
  vm.runInNewContext(fs.readFileSync('site/visuals.js', 'utf8'), scope);
  const context = new Proxy({ createRadialGradient: () => ({ addColorStop: noop }) },
    { get(target, key) { return target[key] || noop; } });
  scope.window.VISUALS.draw(visual, context, 960, 700, 2, false);
  return labels;
}

const cases = [
  ['reviewScope', {labels:['NEW RECORDS','UPDATED RECORDS','MALWARE']}, ['NVD PUBLISHED','NVD MODIFIED','GHSA TYPES']],
  ['packageBoundaries', {labels:['SHARE','PUBLIC API','DAV KEY','STORAGE'],details:['KNOWN SLUG','NO LOGIN','REVOKE','INVESTIGATE']}, ['PILLOW','WASMTIME','LARAVEL','ECHO','IMAGE','WASM','TOKEN','PROXY']],
  ['bundledLayers', {labels:['PACKAGE','AFFECTED HOST','TRUSTED HOST'],layers:[['LOCKFILE','CACHE','ARTIFACT'],['ISOLATE','INVESTIGATE','REBUILD'],['REVOKE','REISSUE','AUDIT']]}, ['RUBY','PERL','NGINX','APP INPUT','REGEXP','ONIGMO','MODULE','BUNDLED','BROTLI','REQUEST','DIRECTIVES','WORKER']],
  ['agentPermissions', {centerLabel:'SEARCH API',labels:['USER','FILTER','JWT KEY','MANAGER'],details:['LOGIN','ALLOWLIST','ROTATE','REVOKE']}, ['AGENT','AUTH','IDENTITY','TLS','TRANSPORT','VAULT','SCOPE','MODEL','INPUT']],
  ['firmwareFleet', {labels:['CONTROL','SSH / SERVE','K8S PROXY','PATCH','RECOVERY'],details:['0.29.7','1.104.4+','1.104.7+','RUNNING','VERIFY'],footer:'CHECK EACH RUNNING COMPONENT'}, ['10.8','10.7','10.4','8.13','8.10','10.8.1.2','10.7.2.7','10.4.1.14','8.13.3.1','8.10.0.24','HPE AOS / 72 CVEs / 8 MAX-SCORE','MATCH THE RELEASE LINE / NOT DEVICE COUNT']],
  ['trustRenewal', {labels:['COMMENTS','MENTIONS','UPLOAD PATH'],details:['ESCAPE HTML','TREAT AS DATA','RESTRICT FILES']}, ['CERTIFICATE','SECURE BOOT','CREDENTIALS','REVOKE','VERIFY DBX','ROTATE']]
];

for (const [type, options, unrelated] of cases) {
  test(type + ': custom labels reach the drawn geometry without unrelated historical labels', () => {
    const drawn = labelsFor({type, ...options, heading:'CURRENT REVIEW'});
    assert.ok(drawn.includes('CURRENT REVIEW'));
    for (const text of [...(options.labels || []), ...(options.details || []), ...(options.layers || []).flat(), ...(options.centerLabel ? [options.centerLabel] : []), ...(options.footer ? [options.footer] : [])])
      assert.ok(drawn.includes(text), 'missing custom label: ' + text);
    for (const text of unrelated) assert.ok(!drawn.includes(text), 'misleading historical label: ' + text);
  });
  test(type + ': absent options preserve historical labels', () => {
    const drawn = labelsFor({type});
    for (const text of unrelated) assert.ok(drawn.includes(text), 'historical default changed: ' + text);
  });
}
