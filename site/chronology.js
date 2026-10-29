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
  const chapters = [];
  scenes.forEach((scene, index) => {
    let group = chapters[chapters.length - 1];
    if (!group || index - group.start >= 10 || scene.chapterBreak) {
      group = { index: chapters.length, start: index, end: index };
      chapters.push(group);
    }
    group.end = index + 1;
  });
  window.BRIEFING_NAV = {
    scenes,
    chapters,
    chapterFor(index) {
      return Number.isInteger(index) && index >= 0 && index < scenes.length ? chapters.find(group => group.start <= index && index < group.end) : null;
    },
    chapterWindow(index, capacity = 5) {
      if (!Number.isInteger(index) || index < 0 || index >= chapters.length ||
          !Number.isInteger(capacity) || capacity < 1) return null;
      const first = Math.floor(index / capacity) * capacity;
      const last = Math.min(first + capacity, chapters.length);
      return { first, last, previous: first ? Math.max(0, first - capacity) : null,
        next: last < chapters.length ? last : null };
    },
    indexFor(number) { return scenes.indexOf(original[number - 1]); },
    numberFor(index) { return original.indexOf(scenes[index]) + 1; }
  };
})();
