/* Controller: scene state, languages (lazy-loaded), DOM text, canvas loop, input, audio. */
(function () {
  const C = window.CONTENT || { ui: {}, scenes: [] };
  const scenes = C.scenes || [];
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
    "hint", "more", "cover-kicker", "cover-title-a", "cover-title-b", "cover-sub",
    "cover-foot", "drawer-title", "drawer-foot"
  ].forEach((id) => {
    el[id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = document.getElementById(id);
  });

  const ctx = el.scene.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let index = 0, started = false, sceneStart = 0, last = 0;
  // 3D camera: a drag or swipe poses it and the angle STAYS. Inertia carries it
  // a little after release; a double tap springs it back to the scene's angle.
  const tilt = { yaw: 0, pitch: 0 };
  const tiltTarget = { yaw: 0, pitch: 0 };
  const vel = { yaw: 0, pitch: 0 };
  let drag = null, holdTimer = null, holding = false;
  let lastTap = 0, pendingAdvance = 0;
  const YAW_LIMIT = 1.15, PITCH_LIMIT = 0.62;
  const isTilted = () => Math.abs(tiltTarget.yaw) + Math.abs(tiltTarget.pitch) > 0.02;
  // test hook, alongside window.__in / window.__drawErr
  window.__tilt = { tilt, tiltTarget, vel };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let lang = "en";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      s.src = "./i18n/" + code + ".js?v=13";
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
      const saved = localStorage.getItem("briefing-lang");
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
    el.coverKicker.textContent = ui("coverKicker");
    el.coverTitleA.textContent = ui("coverTitleA");
    el.coverTitleB.textContent = ui("coverTitleB");
    el.coverSub.innerHTML = ui("coverSub");
    el.btnStart.textContent = ui("coverStart");
    el.coverFoot.textContent = ui("coverFoot");
    el.drawerTitle.textContent = lang === "ja" ? "出典 / SOURCES" : ui("sources");
    el.drawerFoot.innerHTML =
      `${ui("drawerFoot")}<br><a href="https://github.com/yomiplush/2026-world-is-a-fuck-incident" target="_blank" rel="noopener">github.com/yomiplush/2026-world-is-a-fuck-incident</a>`;
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
    try { localStorage.setItem("briefing-lang", lang); } catch (e) { /* ignore */ }
    try {
      const u = new URL(location.href);
      u.searchParams.set("lang", lang);
      history.replaceState(null, "", u);
    } catch (e) { /* file:// */ }
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
    if (window.__booted) { drawFrame(performance.now()); updateMore(); }
  }
  window.addEventListener("resize", resize, { passive: true });

  /* ---------- drawing ---------- */
  function drawFrame(now) {
    const elapsed = started ? Math.max(0, (now - sceneStart) / 1000) : 0;
    const wide = w > 900;
    const rtl = document.documentElement.dir === "rtl";
    // the text panel sits bottom-left in LTR and bottom-right in RTL: move the
    // diagram to the opposite side so the two never overlap
    const ox = wide ? (rtl ? -w * 0.13 : w * 0.13) : 0;
    // the text panel is bottom-anchored and tall on phones, so the diagram sits
    // above it: on a 390x844 screen the panel can own the bottom 45%.
    const oy = wide ? -h * 0.08 : -h * 0.22;
    try {
      V.draw(scenes[index].visual, ctx, w, h, elapsed, reduced, ox, oy);
      window.__drawErr = null;
    } catch (err) {
      window.__drawErr = err && err.message;
      window.__drawStack = err && err.stack ? String(err.stack).split("\n").slice(0, 4).join(" / ") : "";
    }
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 0;
    last = now;
    if (holding) {
      // hold: keep turning, with a slow pitch sway, so it reads as "grabbed"
      tilt.yaw += 0.55 * dt;
      tilt.pitch = Math.sin(now / 900) * 0.16;
      tiltTarget.yaw = tilt.yaw;
      tiltTarget.pitch = tilt.pitch;
      vel.yaw = vel.pitch = 0;
    } else if (drag && drag.moved) {
      // the pointer owns the angle while it is down
      tilt.yaw += (tiltTarget.yaw - tilt.yaw) * 0.35;
      tilt.pitch += (tiltTarget.pitch - tilt.pitch) * 0.35;
      vel.yaw = vel.pitch = 0;
    } else {
      // released: the angle persists, and a flick coasts to a stop
      if (Math.abs(vel.yaw) + Math.abs(vel.pitch) > 0.0006) {
        tiltTarget.yaw = clamp(tiltTarget.yaw + vel.yaw, -YAW_LIMIT, YAW_LIMIT);
        tiltTarget.pitch = clamp(tiltTarget.pitch + vel.pitch, -PITCH_LIMIT, PITCH_LIMIT);
        vel.yaw *= 0.90;
        vel.pitch *= 0.90;
      }
      tilt.yaw += (tiltTarget.yaw - tilt.yaw) * 0.16;
      tilt.pitch += (tiltTarget.pitch - tilt.pitch) * 0.16;
    }
    V.setTilt(tilt.yaw, tilt.pitch);
    drawFrame(now);
    requestAnimationFrame(loop);
  }

  /* ---------- text ---------- */
  function updateMore() {
    const p = el.panel;
    const over = p.scrollHeight - p.clientHeight > 2;
    const atEnd = p.scrollTop + p.clientHeight >= p.scrollHeight - 2;
    if (el.more) el.more.hidden = !(over && !atEnd);
    p.classList.toggle("scrollable", over);
  }

  function renderScene(i, dir, silent) {
    const s = scenes[i];
    const copy = copyFor(s);
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
    el.btnPrev.disabled = i === 0;
    applyChrome();
    buildSources(s);

    sceneStart = performance.now();
    // the camera angle carries over: the next scene is the same object, turned.
    vel.yaw = vel.pitch = 0;
    requestAnimationFrame(updateMore);
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
    V.setTilt(tilt.yaw, tilt.pitch);
    drawFrame(performance.now());
  }

  function endDrag() {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    holding = false;
    drag = null;
    // NB: the angle is deliberately NOT reset — it stays where it was left.
  }

  function resetTilt() {
    vel.yaw = vel.pitch = 0;
    tiltTarget.yaw = 0;
    tiltTarget.pitch = 0;
    applyTilt(false);
    if (A.ready) A.sfx("blip");
  }

  document.addEventListener("pointerdown", (e) => {
    if (!started) return;
    if (e.target.closest("button, a, select, label, .drawer")) return;
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
      const at = LANGS.findIndex((l) => l.code === lang);
      setLang(LANGS[(at + 1) % LANGS.length].code);
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
      b.setAttribute("aria-label", `${i + 1}: ${copyFor(s).title}`);
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

  resize();
  buildLanguageSelect();
  buildRail();

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
    A.on = false;
  } else {
    started = false;
  }

  // first paint with whatever we already have (ja/en inline, others after load)
  renderScene(index, 0, true);
  if (deep >= 0) started = true;
  window.__booted = true;
  drawFrame(performance.now());

  // ?tilt=yaw,pitch — preset the 3D angle (used for screenshots and for sharing a view)
  (function presetTilt() {
    const q = new URLSearchParams(location.search).get("tilt");
    if (!q) return;
    const [y, pch] = q.split(",").map(Number);
    if (!isFinite(y) || !isFinite(pch)) return;
    tilt.yaw = tiltTarget.yaw = clamp(y, -YAW_LIMIT, YAW_LIMIT);
    tilt.pitch = tiltTarget.pitch = clamp(pch, -PITCH_LIMIT, PITCH_LIMIT);
    V.setTilt(tilt.yaw, tilt.pitch);
    drawFrame(performance.now());
  })();

  // if the chosen language is lazy, load it and re-render in place
  if (!hasLocale(lang)) {
    const wanted = lang;
    loadLocale(wanted).then((ok) => {
      if (ok && wanted === lang) { applyChrome(); renderScene(index, 0, true); }
      else if (!ok) setLang("en", { silent: true });
    });
  }

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

  requestAnimationFrame((now) => { last = now; loop(now); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) last = performance.now();
  });
})();
