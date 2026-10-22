/* Controller: scene state, language, DOM text, canvas loop, input, audio cues. */
(function () {
  const C = window.CONTENT || { ui: {}, scenes: [] };
  const scenes = C.scenes || [];
  const V = window.VISUALS;
  const A = window.AUDIO;

  const el = {};
  [
    "scene", "panel", "kicker", "stamp", "title", "lede", "points", "metric", "metric-val",
    "metric-label", "chapter", "rail", "btn-next", "btn-prev", "btn-audio", "btn-info",
    "btn-close", "btn-lang", "drawer", "source-list", "cover", "btn-start", "hint",
    "cover-kicker", "cover-title-a", "cover-title-b", "cover-sub", "cover-foot",
    "drawer-title", "drawer-foot"
  ].forEach((id) => {
    const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    el[key] = document.getElementById(id);
  });

  const ctx = el.scene.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let index = 0, started = false, sceneStart = 0, last = 0;
  let lang = "ja";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ui = (key) => (C.ui[lang] && C.ui[lang][key]) || key;

  /* ---------- language ---------- */
  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "en") return q;
    try {
      const saved = localStorage.getItem("briefing-lang");
      if (saved === "ja" || saved === "en") return saved;
    } catch (e) { /* private mode */ }
    return (navigator.language || "en").toLowerCase().startsWith("ja") ? "ja" : "en";
  }

  function applyChrome() {
    document.documentElement.lang = lang;
    el.chapter.textContent = `${ui("chapter")} ${String(index + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    el.btnLang.textContent = lang === "ja" ? "EN" : "JA";
    el.btnAudio.textContent = `${ui("sound")} ${A.isOn && A.isOn() ? ui("on") : ui("off")}`;
    el.btnInfo.textContent = ui("sources");
    el.btnClose.textContent = ui("close");
    el.coverKicker.textContent = ui("coverKicker");
    el.coverTitleA.textContent = ui("coverTitleA");
    el.coverTitleB.textContent = ui("coverTitleB");
    el.coverSub.innerHTML = ui("coverSub");
    el.btnStart.textContent = ui("coverStart");
    el.coverFoot.textContent = ui("coverFoot");
    el.drawerTitle.textContent = lang === "ja" ? "出典 / SOURCES" : "SOURCES";
    el.drawerFoot.innerHTML =
      `${ui("drawerFoot")}<br><a href="https://github.com/yomiplush/2026-world-is-a-fuck-incident" target="_blank" rel="noopener">github.com/yomiplush/2026-world-is-a-fuck-incident</a>`;
    el.btnPrev.setAttribute("aria-label", lang === "ja" ? "前へ" : "previous");
    el.btnNext.querySelector(".next-label").textContent =
      index === scenes.length - 1 ? ui("replay") : ui("tap");
    el.hint.textContent = index === scenes.length - 1 ? ui("hintEnd") : ui("hint");
  }

  function setLang(next, opts) {
    lang = next;
    try { localStorage.setItem("briefing-lang", lang); } catch (e) { /* ignore */ }
    applyChrome();
    renderScene(index, 0, true);
    if (opts && opts.silent !== true) A.sfx("blip");
  }

  /* ---------- canvas sizing ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = el.scene.clientWidth || window.innerWidth;
    h = el.scene.clientHeight || window.innerHeight;
    el.scene.width = Math.floor(w * dpr);
    el.scene.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (window.__booted) drawFrame(performance.now());
  }
  window.addEventListener("resize", resize, { passive: true });

  /* ---------- drawing ---------- */
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
  function renderScene(i, dir, silent) {
    const s = scenes[i];
    const copy = s[lang] || s.ja || s.en;
    el.panel.classList.remove("swap");
    void el.panel.offsetWidth;               // restart CSS animation

    el.kicker.textContent = copy.kicker;
    el.stamp.textContent = s.stamp;
    el.title.textContent = copy.title;
    el.lede.textContent = copy.lede || "";
    el.points.innerHTML = (copy.points || []).map((p) => `<li>${p}</li>`).join("");
    if (s.metric) {
      el.metric.hidden = false;
      el.metricVal.textContent = s.metric.val;
      el.metricLabel.textContent = s.metric.label[lang] || s.metric.label.ja;
    } else {
      el.metric.hidden = true;
    }
    el.panel.classList.add("swap");

    [...el.rail.children].forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
    el.btnPrev.disabled = i === 0;
    applyChrome();
    buildSources(s);

    sceneStart = performance.now();
    if (started && !silent) {
      A.sfx(s.cue || "blip");
      if (dir !== 0) A.sfx("blip");
    }
  }

  function buildSources(s) {
    el.sourceList.innerHTML = (s.sources || []).map((src) => {
      const note = src.note ? `<em>${escapeHtml(src.note[lang] || src.note.ja || "")}</em>` : "";
      return `<li><b>${escapeHtml(src.name)}</b>${note}
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
  const next = () => go(index + 1, 1);
  const prev = () => go(index - 1, -1);

  el.btnNext.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  el.btnPrev.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  el.btnLang.addEventListener("click", (e) => {
    e.stopPropagation();
    setLang(lang === "ja" ? "en" : "ja");
    if (!started) return;
  });

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
    } else if (e.key === "l" || e.key === "L") {
      setLang(lang === "ja" ? "en" : "ja");
    } else if (e.key === "Escape") {
      el.drawer.classList.remove("open");
    }
  });

  /* ---------- audio + drawer ---------- */
  function toggleAudio() {
    if (!A.ready) A.init();
    const on = A.toggle();
    el.btnAudio.setAttribute("aria-pressed", on ? "true" : "false");
    applyChrome();
    if (on) A.sfx("confirm");
  }
  el.btnAudio.addEventListener("click", (e) => { e.stopPropagation(); toggleAudio(); });

  function toggleDrawer() {
    const open = el.drawer.classList.toggle("open");
    el.drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) A.sfx("blip");
  }
  el.btnInfo.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });
  el.btnClose.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });

  /* ---------- start ---------- */
  function start() {
    if (started) return;
    started = true;
    el.cover.classList.add("hidden");
    A.init();
    A.sfx("boot");
    setTimeout(() => go(0, 0), 120);
    setTimeout(() => { if (!A.isOn || A.isOn()) A.sfx("whoosh"); }, 420);
  }
  el.btnStart.addEventListener("click", (e) => { e.stopPropagation(); start(); });

  /* ---------- boot ---------- */
  function buildRail() {
    el.rail.innerHTML = "";
    scenes.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "tick";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `${i + 1}: ${(s[lang] || s.ja).title}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!started) start();
        go(i, i > index ? 1 : -1);
      });
      el.rail.appendChild(b);
    });
  }

  lang = pickLang();
  if (new URLSearchParams(location.search).get("still") === "1") {
    document.body.classList.add("still");
  }

  resize();
  buildRail();

  // Deep link: #3 (or ?scene=3) opens that scene without the cover.
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
    el.btnAudio.setAttribute("aria-pressed", "false");
    A.on = false;                       // no audio until the user asks for it
  } else {
    started = false;
  }

  renderScene(index, 0, true);
  if (deep >= 0) started = true;
  window.__booted = true;
  drawFrame(performance.now());

  if (new URLSearchParams(location.search).get("debug") === "1") {
    setTimeout(function () {
      const d = ctx.getImageData(0, 0, el.scene.width, el.scene.height).data;
      let lit = 0, max = 0;
      for (let i = 0; i < d.length; i += 4) {
        const sum = d[i] + d[i + 1] + d[i + 2];
        if (sum > 120) lit++;
        if (sum > max) max = sum;
      }
      const b = ctx.getImageData(Math.round(el.scene.width * 0.3), Math.round(el.scene.height * 0.15),
        Math.round(el.scene.width * 0.65), Math.round(el.scene.height * 0.55)).data;
      let band = 0;
      for (let i = 0; i < b.length; i += 4) { if (b[i] + b[i + 1] + b[i + 2] > 120) band++; }
      document.title = "DEBUG lang=" + lang + " err=" + (window.__drawErr || "none") +
        " stack=" + (window.__drawStack || "-") + " band=" + band + " lit=" + lit +
        " max=" + max + " size=" + el.scene.width + "x" + el.scene.height +
        " scene=" + index + " visual=" + (scenes[index].visual || {}).type +
        " t=" + ((performance.now() - sceneStart) / 1000).toFixed(1);
    }, 1400);
  }

  requestAnimationFrame((now) => { last = now; loop(now); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) last = performance.now();
  });
})();
