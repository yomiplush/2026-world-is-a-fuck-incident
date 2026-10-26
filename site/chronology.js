/* Playback order is independent of the numeric URLs already shared publicly. */
(function () {
  const original = window.CONTENT.scenes;
  function dateKey(scene) {
    if (scene.id === 'intro') return '';
    if (scene.id === 'closing') return '9999';
    // Range summaries belong at the end of the range; dates without a time
    // keep editorial order within the day, without inventing an exact time.
    const stamp = scene.stamp.replace(/(\d{2})\.(\d{2})[–—-](\d{2})/, '$1.$3');
    return stamp.replace(/ · /g, ' ').replace(' JST', '');
  }
  const scenes = original.slice().sort((a, b) => dateKey(a).localeCompare(dateKey(b)));
  window.BRIEFING_NAV = {
    scenes,
    indexFor(number) { return scenes.indexOf(original[number - 1]); },
    numberFor(index) { return original.indexOf(scenes[index]) + 1; }
  };
})();
