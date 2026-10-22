/* Controller: scene state, DOM text, canvas loop, input, audio cues. */
(function () {
  const scenes = window.SCENES || [];
  const V = window.VISUALS;
  const A = window.AUDIO;

  const el = {
    canvas: document.getElementById("scene"),
    panel: document.getElementById("panel"),
    kicker: document.getElementById("kicker"),
    stamp: document.getElementById("stamp"),
    title: document.getElementById("title"),
    lede: document.getElementById("lede"),
    points: document.getElementById("points"),
    metric: document.getElementById("metric"),
    metricVal: document.getElementById("metric-val"),
    metricLabel: document.getElementById("metric-label"),
    chapter: document.getElementById("chapter"),
    rail: document.getElementById("rail"),
    next: document.getElementById("btn-next"),
    prev: document.getElementById("btn-prev"),
    audio: document.getElementById("btn-audio"),
    info: document.getElementById("btn-info"),
    close: document.getElementById("btn-close"),
    drawer: document.getElementById("drawer"),
    sourceList: document.getElementById("source-list"),
    cover: document.getElementById("cover"),
    start: document.getElementById("btn-start"),
    hint: document.getElementById("hint")
  };

  const ctx = el.canvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let index = 0, started = false, sceneStart = 0, last = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- canvas sizing ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = el.canvas.clientWidth || window.innerWidth;
    h = el.canvas.clientHeight || window.innerHeight;
    el.canvas.width = Math.floor(w * dpr);
    el.canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (window.__booted) drawFrame(performance.now());
  }
  window.addEventListener("resize", resize, { passive: true });

  /* ---------- scene rendering ---------- */
  function drawFrame(now) {
    // rAF timestamps can predate sceneStart by a frame; never pass a negative t
    const elapsed = started ? Math.max(0, (now - sceneStart) / 1000) : 0;
    const wide = w > 900;
    const ox = wide ? w * 0.13 : 0;
    const oy = wide ? -h * 0.06 : -h * 0.13;
    try {
      V.draw(scenes[index].visual, ctx, w, h, elapsed, reduced, ox, oy);
      window.__drawErr = null;
    } catch (err) {
      window.__drawErr = err && err.message;
      window.__drawStack = err && err.stack ? String(err.stack).split("\n").slice(0, 4).join(" / ") : "";
    }
  }

  function loop(now) {
    last = now;
    drawFrame(now);
    requestAnimationFrame(loop);
  }

  /* ---------- DOM ---------- */
  function renderScene(i, dir) {
    const s = scenes[i];
    el.panel.classList.remove("swap");
    void el.panel.offsetWidth;               // restart CSS animation

    el.kicker.textContent = s.kicker;
    el.stamp.textContent = s.stamp;
    el.title.textContent = s.title;
    el.lede.textContent = s.lede || "";
    el.points.innerHTML = (s.points || []).map((p) => `<li>${p}</li>`).join("");
    if (s.metric) {
      el.metric.hidden = false;
      el.metricVal.textContent = s.metric.val;
      el.metricLabel.textContent = s.metric.label;
    } else {
      el.metric.hidden = true;
    }
    el.chapter.textContent = `BRIEFING ${String(i + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    el.panel.classList.add("swap");

    [...el.rail.children].forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
    el.prev.disabled = i === 0;
    const lastScene = i === scenes.length - 1;
    el.next.querySelector(".next-label").textContent = lastScene ? "REPLAY" : "TAP";
    el.hint.textContent = lastScene
      ? "最後です。タップで最初に戻ります"
      : "画面をタップ / クリック / スペース";
    buildSources(s);

    sceneStart = performance.now();
    if (started) {
      A.sfx(s.cue || "blip");
      if (dir !== 0) A.sfx("blip");
    }
  }

  function buildSources(s) {
    el.sourceList.innerHTML = (s.sources || []).map((src) => {
      const label = src.note ? `<em>${escapeHtml(src.note)}</em>` : "";
      return `<li><b>${escapeHtml(src.name)}</b>${label}
        <span><a href="${src.url}" target="_blank" rel="noopener">${escapeHtml(src.url)}</a></span></li>`;
    }).join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  /* ---------- navigation ---------- */
  function go(i, dir) {
    if (i < 0) return;
    if (i >= scenes.length) i = 0;
    index = i;
    renderScene(index, dir == null ? 1 : dir);
  }
  function next() { go(index + 1, 1); }
  function prev() { go(index - 1, -1); }

  el.next.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  el.prev.addEventListener("click", (e) => { e.stopPropagation(); prev(); });

  /* ---------- input ---------- */
  let downX = 0, downY = 0, downT = 0;
  document.addEventListener("pointerdown", (e) => {
    downX = e.clientX; downY = e.clientY; downT = Date.now();
  }, { passive: true });
  document.addEventListener("pointerup", (e) => {
    if (!started) return;
    if (e.target.closest("button, a, .drawer")) return;
    const dx = e.clientX - downX, dy = e.clientY - downY;
    const dt = Date.now() - downT;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) && dt < 700) {
      dx < 0 ? next() : prev();
      return;
    }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 700) next();
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
      if (!started) { start(); return; }
      e.preventDefault(); next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault(); prev();
    } else if (e.key === "m" || e.key === "M") {
      toggleAudio();
    } else if (e.key === "s" || e.key === "S") {
      toggleDrawer();
    } else if (e.key === "Escape") {
      el.drawer.classList.remove("open");
    }
  });

  /* ---------- audio + drawer ---------- */
  function toggleAudio() {
    if (!A.ready) { A.init(); }
    const on = A.toggle();
    el.audio.setAttribute("aria-pressed", on ? "true" : "false");
    el.audio.textContent = on ? "SOUND ON" : "SOUND OFF";
    if (on) A.sfx("confirm");
  }
  el.audio.addEventListener("click", (e) => { e.stopPropagation(); toggleAudio(); });

  function toggleDrawer() {
    const open = el.drawer.classList.toggle("open");
    el.drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) A.sfx("blip");
  }
  el.info.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });
  el.close.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });

  /* ---------- start ---------- */
  function start() {
    if (started) return;
    started = true;
    el.cover.classList.add("hidden");
    A.init();
    A.sfx("boot");
    setTimeout(() => go(0, 0), 120);
    setTimeout(() => { if (A.isOn()) A.sfx("whoosh"); }, 420);
  }
  el.start.addEventListener("click", (e) => { e.stopPropagation(); start(); });

  /* ---------- boot ---------- */
  function buildRail() {
    el.rail.innerHTML = "";
    scenes.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "tick";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `scene ${i + 1}: ${s.title}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!started) start();
        go(i, i > index ? 1 : -1);
      });
      el.rail.appendChild(b);
    });
  }

  if (new URLSearchParams(location.search).get("still") === "1") {
    document.body.classList.add("still");
  }

  resize();
  buildRail();

  // Deep link: #3 (or ?scene=3) opens that scene without the cover. Used for
  // sharing a single panel, and for headless screenshot checks.
  const deep = (function () {
    const m = (location.hash || "").match(/(\d+)/);
    if (m) return parseInt(m[1], 10) - 1;
    const q = new URLSearchParams(location.search).get("scene");
    return q ? parseInt(q, 10) - 1 : -1;
  })();

  if (deep >= 0 && deep < scenes.length) {
    started = true;
    el.cover.classList.add("hidden");
    index = deep;
    el.audio.setAttribute("aria-pressed", "false");
    el.audio.textContent = "SOUND OFF";
    A.on = false;                       // no audio until the user asks for it
  } else {
    started = false;
  }

  renderScene(index, 0);
  if (deep >= 0) started = true;
  window.__booted = true;
  drawFrame(performance.now());

  if (new URLSearchParams(location.search).get("debug") === "1") {
    setTimeout(function () {
      const d = ctx.getImageData(0, 0, el.canvas.width, el.canvas.height).data;
      let lit = 0, max = 0;
      for (let i = 0; i < d.length; i += 4) {
        const sum = d[i] + d[i + 1] + d[i + 2];
        if (sum > 120) lit++;
        if (sum > max) max = sum;
      }
      document.title = "DEBUG stack=" + (window.__drawStack || "-") +
        " err=" + (window.__drawErr || "none") +
        " band=" + (function () {
          const b = ctx.getImageData(Math.round(el.canvas.width * 0.3), Math.round(el.canvas.height * 0.15),
            Math.round(el.canvas.width * 0.65), Math.round(el.canvas.height * 0.55)).data;
          let n = 0; for (let i = 0; i < b.length; i += 4) { if (b[i] + b[i + 1] + b[i + 2] > 120) n++; }
          return n;
        })() +
        " lit=" + lit + " max=" + max +
        " size=" + el.canvas.width + "x" + el.canvas.height +
        " css=" + w + "x" + h + " scene=" + index +
        " visual=" + (scenes[index].visual || {}).type +
        " t=" + ((performance.now() - sceneStart) / 1000).toFixed(1);
    }, 1400);
  }
  requestAnimationFrame((now) => { last = now; loop(now); });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { last = performance.now(); }
  });
})();
