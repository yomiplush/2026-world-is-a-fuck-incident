const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('the newest motion chapter and entrance follow the database cutoff', () => {
  const latest = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
  const sandbox = {window: {}};
  vm.runInNewContext(fs.readFileSync('site/data.js', 'utf8'), sandbox);
  const c = sandbox.window.CONTENT;
  const dated = c.scenes.filter(s => s.reviewCutoff === latest.cutoff);
  assert.ok(dated.length >= 6, 'latest database review needs at least six dated explanatory scenes');
  const mapping = JSON.parse(fs.readFileSync('content/motion-reviews.json', 'utf8'));
  const first = mapping[new URL(latest.site_report).pathname.slice(1) + '.html'].start;
  for (const lang of ['ja', 'en']) {
    assert.ok(c.scenes.find(s => s.id === 'intro')[lang].points.some(p => p.includes(c.review.report + (lang === 'en' ? '.en' : ''))));
    assert.ok(c.scenes.find(s => s.id === 'intro')[lang].points.some(p => p.includes('#' + first)));
    for (const s of dated) assert.ok(s[lang].title && s[lang].points.length && s.sources.length);
  }
  assert.equal(c.review.cutoff, latest.cutoff);
});
