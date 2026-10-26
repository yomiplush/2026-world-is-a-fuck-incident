/* Controller: scene state, languages (lazy-loaded), DOM text, canvas loop, input, audio. */
(function () {
  const C = window.CONTENT || { ui: {}, scenes: [] };
  const navigation = window.BRIEFING_NAV;
  const scenes = navigation ? navigation.scenes : (C.scenes || []);
  const LANGS = window.LANGUAGES || [
    { code: "en", native: "English", html: "en", dir: "ltr" },
    { code: "ja", native: "日本語", html: "ja", dir: "ltr" }
  ];
  const V = window.VISUALS;
  const A = window.AUDIO;

  const el = {};
  [
    "scene", "panel", "kicker", "stamp", "title", "lede", "points", "metric", "metric-val",
    "metric-label", "chapter", "rail", "btn-next", "btn-prev", "btn-audio", "btn-info",
    "btn-close", "lang-select", "asof", "drawer", "source-list", "cover", "btn-start",
    "hint", "more", "drawer-title", "drawer-foot"
  ].forEach((id) => {
    el[id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = document.getElementById(id);
  });

  let index = 0, started = false, sceneStart = 0, last = 0;
  // Manual camera offset persists across scenes. Inertia carries a flick;
  // idle orbit resumes after input, and double tap restores the base angle.
  const tilt = { yaw: 0, pitch: 0 };
  const tiltTarget = { yaw: 0, pitch: 0 };
  const vel = { yaw: 0, pitch: 0 };
  let drag = null, holdTimer = null, holding = false;
  let lastTap = 0, pendingAdvance = 0;
  const YAW_LIMIT = Math.PI * 4, PITCH_LIMIT = 0.62;
  let orbit = 0, orbitReset = false, lastInteraction = -Infinity;
  const isTilted = () => Math.abs(tiltTarget.yaw) + Math.abs(tiltTarget.pitch) > 0.02;
  // test hook, alongside window.__in / window.__drawErr
  window.__tilt = { tilt, tiltTarget, vel };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let lang = "en";
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const still = new URLSearchParams(location.search).get("still") === "1";
  let reduced = motionPreference.matches || still;
  let visualViewport = null;
  let pausedAt = 0;
  const header = document.querySelector(".hud-top"), footer = document.querySelector(".hud-bottom");
  const splitLayout = window.matchMedia("(min-width: 1100px), (min-width: 900px) and (min-height: 561px) and (min-aspect-ratio: 6/5)");
  const renderer = window.RENDER.create({ canvas: el.scene, draw: drawFrame, step: stepCamera,
    onBudget(budget) { document.documentElement.dataset.renderEffects = budget.effects; }
  });
  let layoutFrame = 0;
  function syncRuntime() {
    const active = started && !document.hidden && !el.drawer.classList.contains("open");
    const now = performance.now();
    if (!active && !pausedAt) pausedAt = now;
    if (active && pausedAt) { sceneStart += now - pausedAt; pausedAt = 0; last = now; }
    renderer.configure({ active, animated: !reduced, interactive: !!drag || holding });
  }
  motionPreference.addEventListener("change", (event) => {
    reduced = event.matches || still;
    syncRuntime(); renderer.invalidate();
  });

  /* ---------- locales ---------- */
  const LOCALES = {};          // code -> { ui, scenes } for lazily loaded languages
  const loading = {};          // code -> Promise<boolean>

  window.registerLocale = function (code, data) {
    LOCALES[code] = data;
  };

  function meta(code) {
    return LANGS.find((l) => l.code === code) || LANGS[0];
  }

  function hasLocale(code) {
    return !!(C.ui[code] || LOCALES[code]);
  }

  function loadLocale(code) {
    if (loading[code]) return loading[code];
    loading[code] = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "./i18n/" + code + ".js?v=20261026night";
      s.async = true;
      s.onload = () => resolve(hasLocale(code));
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
    return loading[code];
  }

  const ui = (key) => {
    const a = (C.ui[lang] || {})[key];
    const b = ((LOCALES[lang] || {}).ui || {})[key];
    return a != null ? a : (b != null ? b : (C.ui.en || {})[key] || key);
  };

  function copyFor(scene) {
    // NB: a scene has its own `id` field, so a language code like "id" (Indonesian)
    // would otherwise return the scene's id string instead of its copy.
    const inline = scene[lang];
    if (inline && typeof inline === "object" && inline.title) return inline;
    const loc = (LOCALES[lang] || {}).scenes || {};
    return loc[scene.id] || scene.en;
  }

  function metricLabel(scene) {
    const inline = scene.metric.label[lang];
    if (inline) return inline;
    const loc = ((LOCALES[lang] || {}).scenes || {})[scene.id];
    return (loc && loc.metric) || scene.metric.label.en;
  }

  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.some((l) => l.code === q)) return q;
    try {
      const saved = window.PRIVACY && window.PRIVACY.getLanguage();
      if (saved && LANGS.some((l) => l.code === saved)) return saved;
    } catch (e) { /* private mode */ }
    const base = (navigator.language || "en").split("-")[0].toLowerCase();
    return LANGS.some((l) => l.code === base) ? base : "en";
  }

  /* ---------- chrome ---------- */
  function applyChrome() {
    const m = meta(lang);
    document.documentElement.lang = m.html;
    document.documentElement.dir = m.dir;

    el.chapter.textContent =
      `${ui("chapter")} ${String(index + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    if (el.langSelect && el.langSelect.value !== lang) el.langSelect.value = lang;
    if (el.asof) el.asof.textContent = ui("asof");
    el.btnAudio.textContent = `${ui("sound")} ${A.isOn && A.isOn() ? ui("on") : ui("off")}`;
    el.btnInfo.textContent = ui("sources");
    el.btnClose.textContent = ui("close");
    el.drawerTitle.textContent = lang === "ja" ? "出典 / SOURCES" : ui("sources");
    el.drawerFoot.innerHTML =
      `${ui("drawerFoot")}<br><a href="./timeline.html">日付別 / Daily record</a> · <a href="./update-20261026-2135.html">10/26 21:35</a><br><a href="https://github.com/yomiplush/2026-world-is-a-fuck-incident" target="_blank" rel="noopener">調査資料・ソースコード / Research repository</a>`;
    el.btnAudio.title = `${ui("sound")} (M)`;
    el.btnInfo.title = ui("sources");
    el.langSelect.title = `${ui("sources")} · L`;
    el.btnAudio.title = `${ui("sound")} (M)`;
    el.btnInfo.title = `${ui("sources")} (S)`;
    el.btnPrev.setAttribute("aria-label", ui("tap"));
    el.btnNext.querySelector(".next-label").textContent =
      index === scenes.length - 1 ? ui("replay") : ui("tap");
    el.hint.textContent = (index === scenes.length - 1 ? ui("hintEnd") : ui("hint")) +
      " · DRAG / SWIPE = 3D · 2×TAP = RESET";
  }

  async function setLang(code, opts) {
    if (!LANGS.some((l) => l.code === code)) code = "en";
    const ok = await (hasLocale(code) ? Promise.resolve(true) : loadLocale(code));
    lang = ok ? code : "en";
    if (el.langSelect) el.langSelect.value = lang;
    if (window.PRIVACY) window.PRIVACY.setLanguage(lang);
    try {
      const u = new URL(location.href);
      u.searchParams.set("lang", lang);
      history.replaceState(null, "", u);
    } catch (e) { /* file:// */ }
    applyChrome();
    renderScene(index, 0, true, true);
    if (opts && opts.silent !== true) A.sfx("blip");
  }

  /* ---------- canvas sizing ---------- */
  function resize() {
    if (document.hidden || layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      measureLayout(); renderer.invalidate();
    });
  }
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("briefingviewportchange", resize, { passive: true });

  /* ---------- drawing ---------- */
  function drawFrame(now, frameCtx, w, h) {
    const elapsed = started ? Math.max(0, (now - sceneStart) / 1000) : 0;
    try {
      V.draw(scenes[index].visual, frameCtx, w, h, elapsed, reduced, 0, 0, { x: 0, y: 0, width: w, height: h, anchorX: visualViewport.anchorX, anchorY: visualViewport.anchorY });
      window.__viewOffset = { x: visualViewport.x, y: visualViewport.y };
      window.__drawErr = null;
    } catch (err) {
      window.__drawErr = err && err.message;
      window.__drawStack = err && err.stack ? String(err.stack).split("\n").slice(0, 4).join(" / ") : "";
    }
  }

  function stepCamera(now) {
    const dt = Math.min(.1, (now - last) / 1000) || 1 / 60;
    last = now;
    const frames = dt * 60;
    if (holding) {
      orbit += .55 * dt;
      tilt.pitch = Math.sin(now / 900) * .16;
      tiltTarget.yaw = tilt.yaw; tiltTarget.pitch = tilt.pitch;
      vel.yaw = vel.pitch = 0;
    } else if (drag && drag.moved) {
      const follow = 1 - Math.pow(.65, frames);
      tilt.yaw += (tiltTarget.yaw - tilt.yaw) * follow;
      tilt.pitch += (tiltTarget.pitch - tilt.pitch) * follow;
      vel.yaw = vel.pitch = 0;
    } else {
      if (Math.abs(vel.yaw) + Math.abs(vel.pitch) > .0006) {
        const decay = Math.pow(.9, frames), distance = (1 - decay) / .1;
        tiltTarget.yaw = clamp(tiltTarget.yaw + vel.yaw * distance, -YAW_LIMIT, YAW_LIMIT);
        tiltTarget.pitch = clamp(tiltTarget.pitch + vel.pitch * distance, -PITCH_LIMIT, PITCH_LIMIT);
        vel.yaw *= decay; vel.pitch *= decay;
      } else vel.yaw = vel.pitch = 0;
      const follow = 1 - Math.pow(.84, frames);
      tilt.yaw += (tiltTarget.yaw - tilt.yaw) * follow;
      tilt.pitch += (tiltTarget.pitch - tilt.pitch) * follow;
    }
    if (orbitReset) {
      const delta = Math.atan2(Math.sin(-orbit), Math.cos(-orbit));
      if (Math.abs(delta) < .0001) { orbit = 0; orbitReset = false; }
      else orbit += delta * (1 - Math.pow(.84, frames));
    } else if (!reduced && !drag && !holding && now - lastInteraction > 2500) orbit = (orbit + .055 * dt) % (Math.PI * 2);
    V.setOrbit(orbit);
    const moving = orbitReset || holding || Math.abs(tilt.yaw - tiltTarget.yaw) + Math.abs(tilt.pitch - tiltTarget.pitch) > .0001 || Math.abs(vel.yaw) + Math.abs(vel.pitch) > .0006;
    if (!moving) { tilt.yaw = tiltTarget.yaw; tilt.pitch = tiltTarget.pitch; }
    V.setTilt(tilt.yaw, tilt.pitch);
    return moving;
  }

  /* ---------- text ---------- */
  function measureLayout() {
    updateMore();
    const box = el.panel.getBoundingClientRect();
    const top = header.getBoundingClientRect().bottom + 14;
    const split = splitLayout.matches, w = window.innerWidth, h = window.innerHeight;
    const rtl = document.documentElement.dir === "rtl";
    const left = split ? (rtl ? 16 : box.right + 24) : 10;
    const right = split ? (rtl ? box.left - 24 : w - 16) : w - 10;
    const bottom = footer.getBoundingClientRect().top - 12;
    const landscape = !split && w > h;
    visualViewport = { x: left, y: top, width: Math.max(80, right - left), height: Math.max(80, bottom - top),
      anchorX: landscape ? (rtl ? .28 : .72) : .5,
      anchorY: split || landscape ? .5 : .30 };
    renderer.resize(visualViewport);
  }
  function updateMore() {
    const p = el.panel;
    const over = p.scrollHeight - p.clientHeight > 2;
    const atEnd = p.scrollTop + p.clientHeight >= p.scrollHeight - 2;
    if (el.more) el.more.hidden = !(over && !atEnd);
    p.classList.toggle("scrollable", over);
  }

  function renderScene(i, dir, silent, preserveTime) {
    const s = scenes[i];
    const copy = copyFor(s);
    el.panel.lang = copy === s.en ? "en" : meta(lang).html;
    el.panel.classList.remove("swap");
    void el.panel.offsetWidth;

    el.kicker.textContent = copy.kicker || (s.en && s.en.kicker) || "";
    el.stamp.textContent = s.stamp;
    el.title.textContent = copy.title;
    el.lede.textContent = copy.lede || "";
    el.points.innerHTML = (copy.points || []).map((p) => `<li>${p}</li>`).join("");
    if (s.metric) {
      el.metric.hidden = false;
      el.metricVal.textContent = s.metric.val;
      el.metricLabel.textContent = metricLabel(s);
    } else {
      el.metric.hidden = true;
    }
    el.panel.classList.add("swap");
    el.panel.scrollTop = 0;

    [...el.rail.children].forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
    const activeTick = el.rail.children[i];
    if (activeTick) el.rail.scrollLeft = activeTick.offsetLeft - el.rail.offsetLeft - el.rail.clientWidth / 2 + activeTick.offsetWidth / 2;
    el.btnPrev.disabled = i === 0;
    applyChrome();
    buildSources(s);

    if (!preserveTime) { sceneStart = performance.now(); pausedAt = 0; }
    // the camera angle carries over: the next scene is the same object, turned.
    vel.yaw = vel.pitch = 0;
    if (layoutFrame) { cancelAnimationFrame(layoutFrame); layoutFrame = 0; }
    measureLayout();
    syncRuntime(); renderer.invalidate();
    if (started && !silent) {
      A.sfx(s.cue || "blip");
      if (dir !== 0) A.sfx("blip");
    }
  }

  function buildSources(s) {
    el.sourceList.innerHTML = (s.sources || []).map((src) => {
      const note = src.note ? `<em>${escapeHtml(src.note[lang] || src.note.ja || src.note.en || "")}</em>` : "";
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
    if (navigation) history.replaceState(null, '', '#' + navigation.numberFor(index));
    renderScene(index, dir == null ? 1 : dir);
  }
  const next = () => go(index + 1, 1);
  const prev = () => go(index - 1, -1);

  el.panel.addEventListener("scroll", updateMore, { passive: true });
  el.btnNext.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  el.btnPrev.addEventListener("click", (e) => { e.stopPropagation(); prev(); });

  // pull-down: a native <select>, so phones get the native picker
  el.langSelect.addEventListener("change", (e) => {
    e.stopPropagation();
    const want = el.langSelect.value;
    if (want === lang) return;
    setLang(want).then(() => el.langSelect.blur());
  });

  /* ---------- input ---------- */
  // Push the current tilt into the renderer and paint now. Called from input so the
  // scene answers even if requestAnimationFrame is throttled (background tab, tests).
  function applyTilt(snap) {
    if (snap) {
      tilt.yaw += (tiltTarget.yaw - tilt.yaw) * 0.55;
      tilt.pitch += (tiltTarget.pitch - tilt.pitch) * 0.55;
    }
    V.setTilt(tilt.yaw, tilt.pitch); V.setOrbit(orbit);
    syncRuntime(); renderer.invalidate(true);
  }

  function endDrag() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (drag || holding) lastInteraction = performance.now();
    holding = false;
    drag = null;
    syncRuntime(); renderer.invalidate();
    // NB: the angle is deliberately NOT reset — it stays where it was left.
  }

  function resetTilt() {
    orbitReset = true; lastInteraction = performance.now();
    vel.yaw = vel.pitch = 0;
    tiltTarget.yaw = 0;
    tiltTarget.pitch = 0;
    applyTilt(false);
    if (A.ready) A.sfx("blip");
  }

  document.addEventListener("pointerdown", (e) => {
    if (!started) return;
    if (e.target.closest("button, a, select, label, .drawer, .panel, .briefing-preferences, .privacy-dock")) return;
    lastInteraction = performance.now();
    drag = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    vel.yaw = vel.pitch = 0;
    window.__in = window.__in || { down: 0, move: 0, up: 0, hold: 0 };
    window.__in.down++;
    holdTimer = setTimeout(() => {
      if (drag && !drag.moved) {
        holding = true; window.__in.hold++;
        tilt.yaw += 0.16; tilt.pitch = 0.06;      // immediate feedback on hold
        tiltTarget.yaw = tilt.yaw; tiltTarget.pitch = tilt.pitch;
        applyTilt(false);
      }
    }, 300);
  }, { passive: true });

  document.addEventListener("pointermove", (e) => {
    if (!drag) return;
    lastInteraction = performance.now();
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    window.__in = window.__in || { down: 0, move: 0, up: 0, hold: 0 };
    window.__in.move++;
    window.__lastXY = [e.clientX, e.clientY, dx, dy, !!drag.moved];
    if (!drag.moved && Math.hypot(dx, dy) > 8) {
      drag.moved = true;
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      holding = false;
    }
    if (!drag.moved) return;
    drag.x = e.clientX; drag.y = e.clientY;
    const dyaw = dx * 0.006, dpitch = dy * 0.004;
    tiltTarget.yaw = clamp(tiltTarget.yaw + dyaw, -YAW_LIMIT, YAW_LIMIT);
    tiltTarget.pitch = clamp(tiltTarget.pitch + dpitch, -PITCH_LIMIT, PITCH_LIMIT);
    // a flick keeps coasting for a moment after the finger lifts
    vel.yaw = clamp(dyaw * 0.25, -0.03, 0.03);
    vel.pitch = clamp(dpitch * 0.25, -0.022, 0.022);
    applyTilt(true);
  }, { passive: true });

  document.addEventListener("pointerup", (e) => {
    if (!started) return;
    if (!drag) return;
    const wasTap = !drag.moved && !holding && Date.now() - drag.t < 700;
    endDrag();
    applyTilt(false);
    if (!wasTap) return;
    window.__in.up = (window.__in ? window.__in.up : 0) + 1;

    const now = Date.now();
    if (now - lastTap < 280) {
      // double tap = put the camera back to the scene's own angle
      lastTap = 0;
      if (pendingAdvance) { clearTimeout(pendingAdvance); pendingAdvance = 0; }
      resetTilt();
      return;
    }
    lastTap = now;
    if (isTilted()) {
      // hold the advance for one double-tap window; the angle is posed, so a
      // second tap most likely means "reset", not "next"
      pendingAdvance = setTimeout(() => { pendingAdvance = 0; next(); }, 240);
    } else {
      next();
    }
  }, { passive: true });

  document.addEventListener("pointercancel", endDrag, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.target.closest("a,button,input,select,textarea,[contenteditable]")) return;
    if (!started) return;
    if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault(); next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault(); prev();
    } else if (e.key === "m" || e.key === "M") {
      toggleAudio();
    } else if (e.key === "s" || e.key === "S") {
      toggleDrawer();
    } else if (e.key === "l" || e.key === "L") {
      const at = LANGS.findIndex((l) => l.code === lang);
      setLang(LANGS[(at + 1) % LANGS.length].code);
    } else if (e.key === "Escape") {
      el.drawer.classList.remove("open");
      el.drawer.setAttribute("aria-hidden", "true");
      syncRuntime();
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
    syncRuntime();
    if (open) A.sfx("blip");
  }
  el.btnInfo.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });
  el.btnClose.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawer(); });

  /* ---------- start ---------- */
  function start() {
    if (started) return;
    started = true;
    el.cover.classList.add("hidden");
    document.body.classList.remove("entry-locked");
    A.init();
    go(0, 0);
  }

  /* ---------- boot ---------- */
  function buildLanguageSelect() {
    el.langSelect.innerHTML = LANGS.map(
      (l) => `<option value="${l.code}"${l.code === lang ? " selected" : ""}>${escapeHtml(l.native)}</option>`
    ).join("");
    el.langSelect.value = lang;
  }

  function buildRail() {
    el.rail.innerHTML = "";
    scenes.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "tick";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `${i + 1}: ${s.stamp} · ${copyFor(s).title}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!started) start();
        go(i, i > index ? 1 : -1);
      });
      el.rail.appendChild(b);
    });
  }

  if (!scenes.length || !C.ui.en) {
    const u = new URL(location.href);
    if (!u.searchParams.get("fresh")) {
      u.searchParams.set("fresh", "1");
      location.replace(u.toString());
      return;
    }
    document.getElementById("title").textContent = "読み込みに失敗しました / failed to load assets";
    return;
  }

  lang = pickLang();
  if (new URLSearchParams(location.search).get("still") === "1") {
    document.body.classList.add("still");
  }

  buildLanguageSelect();
  buildRail();

  const deep = (function () {
    const m = (location.hash || "").match(/(\d+)/);
    if (m) return navigation ? navigation.indexFor(parseInt(m[1], 10)) : parseInt(m[1], 10) - 1;
    const q = new URLSearchParams(location.search).get("scene");
    return q ? (navigation ? navigation.indexFor(parseInt(q, 10)) : parseInt(q, 10) - 1) : -1;
  })();

  window.addEventListener('hashchange', () => {
    const number = Number(location.hash.slice(1));
    const target = navigation ? navigation.indexFor(number) : number - 1;
    if (target >= 0 && target < scenes.length) { if (!started) start(); go(target, 0); }
  });

  if ((deep >= 0 && deep < scenes.length) || still || (window.ENTRY && window.ENTRY.bypass)) {
    started = true;
    el.cover.classList.add("hidden");
    index = deep >= 0 && deep < scenes.length ? deep : 0;
    el.btnAudio.setAttribute("aria-pressed", "false");
    A.on = false;
  } else {
    started = false;
  }

  // first paint with whatever we already have (ja/en inline, others after load)
  renderScene(index, 0, true);
  if (deep >= 0 && deep < scenes.length) started = true;
  window.__booted = true;
  if (window.ENTRY) window.ENTRY.ready(start);
  syncRuntime(); renderer.invalidate();

  // ?tilt=yaw,pitch — preset the 3D angle (used for screenshots and for sharing a view)
  (function presetTilt() {
    const q = new URLSearchParams(location.search).get("tilt");
    if (!q) return;
    const [y, pch] = q.split(",").map(Number);
    if (!isFinite(y) || !isFinite(pch)) return;
    tilt.yaw = tiltTarget.yaw = clamp(y, -YAW_LIMIT, YAW_LIMIT);
    tilt.pitch = tiltTarget.pitch = clamp(pch, -PITCH_LIMIT, PITCH_LIMIT);
    V.setTilt(tilt.yaw, tilt.pitch);
    syncRuntime(); renderer.invalidate();
  })();

  // if the chosen language is lazy, load it and re-render in place
  if (!hasLocale(lang)) {
    const wanted = lang;
    loadLocale(wanted).then((ok) => {
      if (ok && wanted === lang) { applyChrome(); renderScene(index, 0, true, true); }
      else if (!ok) setLang("en", { silent: true });
    });
  }

  if (new URLSearchParams(location.search).get("debug") === "1") {
    setTimeout(function () {
      const ctx = el.scene.getContext('2d');
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
      document.title = "DEBUG tilt=" + tilt.yaw.toFixed(2) + "/" + tilt.pitch.toFixed(2) +
        " loaded=" + Object.keys(LOCALES).join(",") +
        " lang=" + lang + " dir=" + document.documentElement.dir +
        " locale=" + (hasLocale(lang) ? "loaded" : "missing") +
        " panel=" + el.panel.scrollHeight + "/" + el.panel.clientHeight +
        " more=" + (el.more && !el.more.hidden) + " points=" + el.points.children.length +
        " err=" + (window.__drawErr || "none") +
        " band=" + band + " lit=" + lit + " max=" + max +
        " scene=" + index + " title=" + el.title.textContent.slice(0, 24);
    }, 1500);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (layoutFrame) { cancelAnimationFrame(layoutFrame); layoutFrame = 0; }
      if (pendingAdvance) clearTimeout(pendingAdvance);
      pendingAdvance = 0; lastTap = 0; endDrag();
    }
    if (!document.hidden) resize();
    last = performance.now();
    syncRuntime();
    if (A.setVisible) A.setVisible(!document.hidden);
  });
  window.addEventListener("pagehide", (event) => {
    if (layoutFrame) { cancelAnimationFrame(layoutFrame); layoutFrame = 0; }
    renderer.configure({ active: false });
    if (A.setVisible) A.setVisible(false);
    if (!event.persisted) { renderer.dispose(); A.dispose(); }
  });
  window.addEventListener("pageshow", () => {
    resize();
    syncRuntime();
    if (A.setVisible) A.setVisible(!document.hidden);
  });
})();
