/* The 34 scene visuals. Every renderer draws through RIG3D: a perspective
   camera, depth-sorted solids and billboarded labels. Nothing here is a flat
   picture with a skew on it — dragging the scene turns the geometry.
   Renderer signature: (ctx, w, h, t, opts); t = seconds into the scene. */
window.VISUALS = (function () {
  const R = window.RIG3D;
  const TAU = R.TAU;
  const C = R.C;
  const A = R.a;
  const clamp = R.clamp;
  const scenes = {};
  /* phones have ~1/3 the pixels per world unit of a laptop, so the densest
     scenes drop their secondary label line there instead of overprinting it. */
  const isSmall = (w) => w < 640;

  /* ---------- shared staging helpers ---------- */
  /* ground grid: short segments so each one depth-sorts on its own */
  function floor(g, y, span, step, tone, alpha) {
    for (let i = -span; i <= span; i += step) {
      for (let j = -span; j < span; j += step) {
        g.beam([i, y, j], [i, y, j + step], A(tone, alpha), { width: 1, core: false });
        g.beam([j, y, i], [j + step, y, i], A(tone, alpha), { width: 1, core: false });
      }
    }
  }
  /* a packet travelling a straight 3D path */
  function packet(g, a, b, k, tone, r) {
    const p = [
      a[0] + (b[0] - a[0]) * k,
      a[1] + (b[1] - a[1]) * k,
      a[2] + (b[2] - a[2]) * k
    ];
    g.dot(p, r || 2.4, tone, { alpha: 0.85 });
    return p;
  }
  /* a curved 3D path (quadratic, lifted out of the plane) */
  function arc3(g, a, b, lift, tone, o) {
    o = o || {};
    const n = o.seg || 10;
    let prev = a;
    for (let i = 1; i <= n; i++) {
      const k = i / n;
      const p = [
        a[0] + (b[0] - a[0]) * k,
        a[1] + (b[1] - a[1]) * k - Math.sin(k * Math.PI) * lift,
        a[2] + (b[2] - a[2]) * k
      ];
      g.beam(prev, p, tone, o);
      prev = p;
    }
    return prev;
  }
  function caption(g, x, y, z, text, tone, size, o) {
    g.label([x, y, z], text, tone, size || 9.5, o || { plate: true });
  }

  /* ======================= the scenes ======================= */

  /* Intro sweep: a dish scanning Oct 2026. */
  scenes.radar = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.54, dist: 900, yaw: 0.16, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const Y = 120, Rr = 470;

    g.prism(0, Y + 190, 0, 110, 46, 8, C.steel, { alpha: 0.22, edge: 0.3 });
    g.beam([0, Y + 150, 0], [0, Y, 0], A(C.steel, 0.5), { width: 9 });

    for (let i = 1; i <= 4; i++) g.loop([0, Y, 0], (Rr * i) / 4, A(C.cyan, 0.14 + i * 0.045), { width: 1.2 });
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI;
      g.beam([Math.cos(ang) * Rr, Y, Math.sin(ang) * Rr],
        [-Math.cos(ang) * Rr, Y, -Math.sin(ang) * Rr], A(C.cyan, 0.09), { width: 1, core: false });
    }

    const head = (t * 0.9) % TAU;
    for (let k = 0; k < 18; k++) {
      const a1 = head - k * 0.055, a0 = a1 - 0.055;
      g.band([0, Y, 0], 0, Rr, a0, a1, A(C.green, 0.26 * (1 - k / 18)), { seg: 1, alpha: 0.26 * (1 - k / 18) });
    }
    g.beam([0, Y, 0], [Math.cos(head) * Rr, Y, Math.sin(head) * Rr], A(C.green, 0.85), { width: 2 });

    const blips = [[0.3, 0.55], [0.75, 0.2], [0.5, 0.85], [0.15, 0.3], [0.65, 0.7]];
    blips.forEach((b, i) => {
      const ang = b[0] * TAU + i, rad = b[1] * Rr;
      const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
      const age = ((head - ang) + TAU * 4) % TAU;
      const al = Math.max(0, 1 - age / 2.2);
      if (al <= 0.04) return;
      const tone = i === 2 ? C.amber : C.green;
      g.beam([x, Y, z], [x, Y - 80, z], A(tone, al * 0.4), { width: 1.6, core: false });
      g.dot([x, Y - 80, z], 2.6, tone, { alpha: al * 0.9 });
    });

    caption(g, 0, Y - 400, 0, "SCANNING · OCT 2026", A(C.cyan, 0.55), 10);
    g.flush();
  };

  /* Timeline: a read out of silence, then four dates. */
  scenes.timeline = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.34, dist: 1060, yaw: 0.34, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const marks = o.marks || ["A", "B", "C", "D"];
    const n = marks.length, span = isSmall(w) ? 880 : 1180, Y = 270;

    floor(g, Y + 130, 720, 240, C.cyan, 0.09);
    g.beam([-span / 2, Y, 0], [span / 2, Y, 0], A(C.amber, 0.85), { width: 3 });

    for (let i = 0; i < n; i++) {
      const x = -span / 2 + (span * i) / (n - 1);
      g.box(x, Y - 120, 0, 4, 120, 4, C.cyan, { alpha: 0.45, width: 0.8 });
      g.box(x, Y - 262, 0, 48, 16, 12, C.cyan, { alpha: 0.5 });
      g.label([x, Y - 302, 0], marks[i], C.ink, 10.5, { plate: true });
    }

    const k = (t * 0.16) % 1;
    const x = -span / 2 + span * k;
    g.octa(x, Y - 26, 0, 17, C.red, { alpha: 0.95, glow: true });
    g.label([x, Y - 66, 0], "NOW", C.red, 10, { plate: true });
    g.flush();
  };

  /* A dependency sweep: one cube per package, hits stand up. */
  scenes.grid = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.58, dist: 900, spin: true, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const cols = o.cols || 9, rows = o.rows || 5, base = 250;
    const gap = cols > 9 ? 104 : 124, size = cols > 9 ? 28 : 34;
    const hot = new Set(o.hot || []);
    const ox = -((cols - 1) * gap) / 2, oz = -((rows - 1) * gap) / 2;

    floor(g, base + 110, 900, 300, C.cyan, 0.07);
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) {
        const idx = r * cols + k;
        const x = ox + k * gap, z = oz + r * gap;
        const isHot = hot.has(idx);
        const pulse = isHot ? 0.5 + 0.5 * Math.sin(t * 2.4 + idx) : 0;
        const hgt = isHot ? 90 + pulse * 55 : 20;
        g.box(x, base - hgt / 2, z, size, hgt / 2, size, isHot ? C.red : C.cyan,
          { alpha: isHot ? 0.92 : 0.42, glow: isHot, edge: isHot ? 0.7 : 0.35 });
        if (isHot) {
          g.beam([x, base - hgt, z], [x, base - 330, z], A(C.red, 0.16 + pulse * 0.2),
            { width: 1.2, dash: [4, 8], core: false });
          g.dot([x, base - hgt - 12, z], 2.4, C.red, { alpha: 0.6 + pulse * 0.35 });
        }
      }
    }
    g.flush();
  };

  /* Fan-out: one customer database, many downstream services. */
  scenes.fanout = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.26, dist: 1080, yaw: 0.26 });
    const g = R.rig(ctx, c, w, h);
    const hub = [0, 120, -250];
    const n = o.nodes || 14, Rr = 520;

    g.box(hub[0], hub[1], hub[2], 74, 54, 62, C.amber, { alpha: 0.72, glow: true });
    g.label([hub[0], hub[1], hub[2] - 66], "CUSTOMER DB", C.amber, 10.5, { plate: true });

    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + 0.2;
      const x = Math.cos(ang) * Rr, z = Math.sin(ang) * Rr + 190;
      const y = 130 - Math.abs(Math.sin(ang)) * 44;
      const node = [x, y, z];
      g.beam(hub, node, A(C.cyan, 0.14), { width: 1, core: false });
      g.box(x, y, z, 20, 20, 20, C.cyan, { alpha: 0.42, edge: 0.5 });
      const k = (t * 0.5 + i * 0.13) % 1;
      if (k < 0.7) packet(g, hub, node, k / 0.7, C.cyan, 2.2);
    }
    g.flush();
  };

  /* Eight CA keys on a ring; one of them is weak. */
  scenes.keys = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.12, dist: 980, yaw: 0.18 });
    const g = R.rig(ctx, c, w, h);
    const n = o.count || 8, weak = o.weakIndex == null ? 3 : o.weakIndex;
    const railY = -300;
    const SP = isSmall(w) ? 0.60 : 1;          // phones: the ring must fit

    g.beam([-720 * SP, railY, 0], [720 * SP, railY, 0], A(C.steel, 0.28), { width: 2, core: false });
    for (let i = 0; i < n; i++) {
      const x = (-640 + (i / (n - 1)) * 1280) * SP;
      const y = -70 + Math.sin(i * 0.8) * 8;
      const isWeak = i === weak;
      const tone = isWeak ? C.red : C.cyan;

      g.beam([x, railY, 0], [x, y - 56, 0], A(C.steel, 0.3), { width: 1.2, core: false });
      g.loop([x, y - 40, 0], 19, A(tone, 0.85), { plane: "xy", width: 1.4 });
      g.box(x, y + 26, 0, 26, 54, 8, tone, { alpha: 0.42, edge: 0.6 });
      for (let s = 0; s < 3; s++) {
        g.box(x + 33, y + 52 + s * 16, 0, 9, 5, 8, tone, { alpha: 0.5, edge: 0.5 });
      }
      if (isWeak) {
        g.label([x, y + 22, -10], "4", C.red, 15, { bold: true, plate: true });
        g.beam([x - 20, y - 6, -10], [x + 22, y + 66, -10], A(C.red, 0.7), { width: 1.4, dash: [5, 5] });
      }
      g.label([x, y + 108, 0], isWeak ? "WEAK" : "CA-" + (i + 1),
        isWeak ? C.red : A(C.steel, 0.7), 9);
    }
    g.beam([-560, -220, 0], [560, -220, 0],
      A(C.red, 0.22 + 0.2 * Math.sin(t * 3)), { width: 1.4, dash: [6, 7], core: false });
    g.flush();
  };

  /* Version ladder: each rung is a release the bug rode along. */
  scenes.ladder = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1020, yaw: -0.26 });
    const g = R.rig(ctx, c, w, h);
    const steps = o.steps || ["v1", "v2", "v3"];
    const hot = o.hot == null ? 0 : o.hot;
    const n = steps.length;
    const gap = (o.wide ? 232 : 200) * (isSmall(w) ? 0.66 : 1), base = 250;

    for (let i = 0; i < n; i++) {
      const x = -((n - 1) * gap) / 2 + i * gap;
      const y = base - i * 64;
      const isHot = i === hot;
      g.box(x, y, 0, 100, 13, 42, isHot ? C.amber : C.cyan,
        { alpha: isHot ? 0.85 : 0.42, glow: isHot, edge: isHot ? 0.8 : 0.4 });
      g.label([x, y + 30, 0], steps[i], isHot ? C.amber : A(C.steel, 0.75), o.wide ? 9 : 10);
      if (isHot) g.dot([x, y - 24, 0], 2.6, C.amber, { alpha: 0.6 + 0.3 * Math.sin(t * 3) });
      if (i < n - 1) {
        const nx = -((n - 1) * gap) / 2 + (i + 1) * gap;
        g.beam([x + 100, y, 0], [nx - 100, y - 64, 0], A(C.green, 0.4), { width: 1.4, dash: [6, 6] });
      }
    }
    g.flush();
  };

  /* The patch matrix: 55 build cells, one of them the affected one. */
  scenes.matrix = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.50, dist: 1010, yaw: -0.30, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const cols = o.cols || 11, rows = o.rows || 5;
    const cell = 52, step = 70, base = 210;
    const total = cols * rows;
    const fill = Math.min(1, t / 2.2);
    const ox = -((cols - 1) * step) / 2, oz = -((rows - 1) * step) / 2;

    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / cols), k = i % cols;
      const x = ox + k * step, z = oz + r * step;
      const on = i / total < fill;
      const isLast = i === total - 1;
      const tone = on && o.swap && isLast ? C.green : on ? C.amber : C.steel;
      const hgt = on ? 34 : 10;
      g.box(x, base - hgt / 2, z, cell / 2, hgt / 2, cell / 2, tone,
        { alpha: on ? 0.72 : 0.14, edge: on ? 0.55 : 0.2 });
    }

    const y = base + 70;
    g.beam([-40, y, 0], [40, y, 0], A(C.ink, 0.5), { width: 1.4 });
    if (o.swap) {
      const k = Math.min(1, Math.max(0, (t - 1.4) / 1.6));
      g.label([-230, y, 0], "AFFECTED  21.0.12.1", A(C.red, 0.85 * k), 10);
      g.label([240, y, 0], "FIXED  21.0.13", A(C.green, 0.9 * k), 10);
    }
    g.flush();
  };

  /* Exploit chain: five nodes, each one hands the next a capability. */
  scenes.chain = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.18, dist: 1020, yaw: 0.12 });
    const g = R.rig(ctx, c, w, h);
    const nodes = o.nodes || ["A", "B", "C", "D", "E"];
    const n = nodes.length, gap = isSmall(w) ? 196 : 258;
    const pts = nodes.map((_, i) => [
      -((n - 1) * gap) / 2 + i * gap,
      120 + (i % 2 === 0 ? -64 : 64),
      0
    ]);

    for (let i = 0; i < n - 1; i++) {
      g.beam(pts[i], pts[i + 1], A(C.red, 0.3), { width: 7, core: false });
      g.beam(pts[i], pts[i + 1], A(C.red, 0.55), { width: 2.4, dash: [8, 7], offset: -((t * 60) % 15) });
      const k = ((t * 0.35 + i * 0.2) % 1 + 1) % 1;
      packet(g, pts[i], pts[i + 1], k, C.red, 2.6);
    }
    pts.forEach((p, i) => {
      const tone = i === n - 1 ? C.amber : C.cyan;
      const active = (t * 0.6) % n > i - 0.5;
      g.prism(p[0], p[1], p[2], 36, 13, 6, tone, { alpha: active ? 0.5 : 0.18, edge: active ? 0.85 : 0.35 });
      g.dot(p, active ? 5 : 3.2, tone, { alpha: active ? 0.9 : 0.45 });
      g.label([p[0], p[1] - 44, p[2]], nodes[i], tone, 10.5, { plate: true });
    });

    if (o.deadline) {
      const q = pts[n - 1];
      const r = 52 + Math.sin(t * 2) * 4;
      g.loop([q[0], q[1], q[2]], r, A(C.red, 0.6), { plane: "xy", dash: [5, 6], width: 1.4 });
      g.label([q[0], q[1] + r + 24, q[2]], "DUE 10-23", C.red, 10);
    }
    g.flush();
  };

  /* A 6h17m window, drawn as a dial. */
  scenes.clock = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.46, dist: 1000, yaw: 0.20, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const Y = 90, Rr = 350;
    const marks = o.marks || [];

    g.prism(0, Y + 20, 0, Rr + 34, 12, 40, C.steel, { alpha: 0.10, edge: 0.16, flat: true });
    g.loop([0, Y, 0], Rr, A(C.cyan, 0.34), { width: 1.6 });
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * TAU;
      const r0 = Rr - (i % 6 === 0 ? 32 : 16);
      g.beam([Math.cos(ang) * r0, Y - 6, Math.sin(ang) * r0],
        [Math.cos(ang) * Rr, Y - 6, Math.sin(ang) * Rr],
        A(C.ink, i % 6 === 0 ? 0.5 : 0.26), { width: 1.2, core: false });
    }

    if (marks.length >= 2) {
      const a0 = -Math.PI / 2 + marks[0][1] * TAU, a1 = -Math.PI / 2 + marks[1][1] * TAU;
      g.band([0, Y - 8, 0], Rr - 52, Rr - 24, a0, a1, A(C.red, 0.5), { seg: 22, alpha: 0.5 });
      marks.forEach((m, i) => {
        const ang = -Math.PI / 2 + m[1] * TAU;
        const x = Math.cos(ang) * (Rr - 6), z = Math.sin(ang) * (Rr - 6);
        g.box(x, Y - 12, z, 4, 14, 4, i === 0 ? C.red : C.amber, { alpha: 0.9 });
        g.label([Math.cos(ang) * (Rr + 46), Y - 20, Math.sin(ang) * (Rr + 46)], m[0],
          i === 0 ? C.red : C.amber, 9.5, { plate: true });
      });
    }

    const hand = -Math.PI / 2 + ((t * 0.12) % 1) * TAU;
    g.beam([0, Y - 14, 0], [Math.cos(hand) * (Rr - 30), Y - 14, Math.sin(hand) * (Rr - 30)],
      A(C.green, 0.85), { width: 3 });

    g.label([0, Y - 64, 0], "6h17m", C.red, 17, { bold: true });
    g.label([0, Y - 20, 0], "BEFORE FIX", A(C.red, 0.65), 9);
    g.flush();
  };

  /* Credential ring: every package reachable from one secret. */
  scenes.packages = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.26, dist: 1000, yaw: 0.30 });
    const g = R.rig(ctx, c, w, h);
    const items = o.items || [];
    const core = [0, 60, 0], Rr = 460;

    g.loop([0, 60, 0], Rr, A(C.cyan, 0.16), { width: 1.2 });
    g.box(core[0], core[1], core[2], 58, 42, 52, C.amber, { alpha: 0.7, glow: true });
    g.label([core[0], core[1], core[2] - 56], "CREDENTIALS", C.amber, 10, { plate: true });

    items.forEach((name, i) => {
      const ang = (i / items.length) * TAU + t * 0.06;
      const x = Math.cos(ang) * Rr, z = Math.sin(ang) * Rr;
      const y = 60 - Math.abs(Math.sin(ang)) * 74;
      g.box(x, y, z, 30, 18, 22, C.cyan, { alpha: 0.4, edge: 0.55 });
      g.label([x, y + 40, z], name, A(C.steel, 0.8), 9);
      const k = (t * 0.4 + i * 0.17) % 1;
      packet(g, [x, y, z], core, k, C.red, 2);
    });
    g.flush();
  };

  /* Three providers, one key type. */
  scenes.pillars = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.36, dist: 1020, yaw: 0.20, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const xs = [-420, 0, 420];
    const names = ["RAILWAY", "ZEABUR", "OPENCODE"];

    floor(g, 340, 720, 240, C.cyan, 0.08);
    xs.forEach((x, i) => {
      g.box(x, 60, 0, 46, 240, 46, C.cyan, { alpha: 0.3, edge: 0.5 });
      const k = (t * 0.5 + i * 0.2) % 1;
      g.dot([x, 300 - 440 * k, 0], 2.8, C.amber, { alpha: 0.7 });
      g.label([x, 350, 0], names[i], A(C.steel, 0.75), 9);
    });
    g.beam([-540, -230, 0], [540, -230, 0], A(C.amber, 0.85), { width: 3 });
    g.label([0, -272, 0], "AI PROVIDER KEYS", C.amber, 11, { plate: true });
    g.flush();
  };

  /* Two bars, one order of magnitude apart. */
  scenes.bars = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.40, dist: 800, yaw: -0.22, pitchMax: -0.32 });
    const g = R.rig(ctx, c, w, h);
    const values = o.values || [10, 1], labels = o.labels || ["A", "B"];
    const max = Math.max.apply(null, values);
    const base = 300;

    floor(g, base + 60, 700, 200, C.cyan, 0.08);
    values.forEach((v, i) => {
      const x = -220 + i * 440;
      const hgt = Math.max(14, (v / max) * 520 * Math.min(1, t / 1.2));
      const tone = i === 0 ? C.amber : C.red;
      g.box(x, base - hgt / 2, 0, 92, hgt / 2, 92, tone, { alpha: 0.55, edge: 0.75, glow: true });
      g.label([x, base - hgt - 26, 0], String(v), tone, 16, { bold: true });
      g.label([x, base + 34, 0], labels[i], A(C.steel, 0.8), 10);
    });
    g.label([0, base - 620, 0], "14 DAYS OF CRITICALS", A(C.cyan, 0.55), 10);
    g.flush();
  };

  /* The storm: everything the month ran on, drawn as depth. */
  scenes.storm = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.22, dist: 1000, yaw: 0.14, spin: true });
    const g = R.rig(ctx, c, w, h);
    const N = 150;
    const pos = [];

    for (let i = 0; i < N; i++) {
      const a = (i * 2.399) % TAU + t * 0.05;
      const rr = 140 + ((i * 37) % 560);
      const y = (((i * 53) % 420) - 210) * 0.9;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      pos.push([x, y, z]);
      g.dot([x, y, z], 1.6 + ((i * 13) % 5) * 0.5, i % 7 === 0 ? C.amber : C.cyan,
        { alpha: 0.75, glow: i % 9 === 0 });
    }
    for (let i = 0; i < N; i += 7) {
      const j = (i + 11) % N;
      g.beam(pos[i], pos[j], A(C.cyan, 0.14), { width: 1, core: false });
    }
    g.dot([0, 0, 0], 10, C.amber, { alpha: 0.5 });
    g.loop([0, 0, 0], 240, A(C.amber, 0.18), { plane: "xy", width: 1 });
    g.label([0, 430, 0], "THE CODE WE TRUST", A(C.amber, 0.6), 11);
    g.flush();
  };

  /* The embargo that did not hold: two rails, one crossing per id. */
  scenes.leak = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.16, dist: 1000, yaw: 0.16 });
    const g = R.rig(ctx, c, w, h);
    const ids = o.ids || ["33549", "33774", "33367", "34068", "34076", "32005"];
    const top = -300, gap = 120, X = 430;

    g.beam([-X, top, 0], [-X, top + gap * (ids.length - 1) + 120, 0], A(C.cyan, 0.16), { width: 10, core: false });
    g.beam([-X, top, 0], [-X, top + gap * (ids.length - 1) + 120, 0], A(C.cyan, 0.7), { width: 3 });
    g.beam([X, top, 0], [X, top + gap * (ids.length - 1) + 120, 0], A(C.red, 0.14), { width: 10, core: false });
    g.beam([X, top, 0], [X, top + gap * (ids.length - 1) + 120, 0], A(C.red, 0.75), { width: 3 });
    g.label([-X, top - 70, 0], "SECURITY (PRIVATE)", C.cyan, 11, { plate: true });
    g.label([X, top - 70, 0], "LKML (PUBLIC)", C.red, 11, { plate: true });

    ids.forEach((id, i) => {
      const y = top + i * gap;
      g.beam([-X, y, 0], [X, y, 0], A(C.steel, 0.10), { width: 1, core: false });
      g.dot([-X, y, 0], 3.6, C.cyan, { alpha: 0.5 });
      const k = (t * 0.42 + i * 0.13) % 1;
      const p = packet(g, [-X, y, 0], [X, y, 0], k, k > 0.75 ? C.red : C.amber, 3);
      // the crossing arcs over the aisle instead of sliding along it
      g.dot([p[0], y - Math.sin(k * Math.PI) * 70, p[2]], 2, C.red, { alpha: 0.35 });
      g.dot([X, y, 0], 3.2 + (k > 0.9 ? 2.2 : 0), C.red, { alpha: 0.6 });
      g.label([X + 60, y, 0], "ZDI-CAN-" + id, A(C.red, 0.95), 10, { align: "left", plate: true });
    });
    g.label([0, top + gap * (ids.length - 1) + 180, 0], "EMBARGO LOST", A(C.red, 0.75), 11);
    g.flush();
  };

  /* BIND: a resolver and the queries replayed at it. */
  scenes.dns = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1000, yaw: 0.12 });
    const g = R.rig(ctx, c, w, h);
    const core = [0, 110, 0];

    g.prism(core[0], core[1], core[2], 96, 58, 8, C.steel, { alpha: 0.16, edge: 0.32 });
    g.loop(core, 96, A(C.cyan, 0.22), { width: 1.2 });
    g.box(core[0], core[1], core[2], 52, 34, 46, C.amber, { alpha: 0.6, glow: true });
    g.label([core[0], core[1] - 2, core[2] - 50], "named", C.ink, 11, { plate: true });
    g.label([0, core[1] + 86, 0], "GSS-TSIG handler", A(C.amber, 0.75), 10, { plate: true });

    const N = o.clients || 7;
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * TAU + 0.4;
      const x = Math.cos(ang) * 380, z = Math.sin(ang) * 380;
      const y = 110 - Math.abs(Math.sin(ang)) * 56;
      const p = [x, y, z];
      g.box(x, y, z, 14, 14, 14, C.steel, { alpha: 0.4, edge: 0.5 });
      const k = (t * 0.5 + i * 0.14) % 1;
      packet(g, p, core, k, C.cyan, 2.2);
      const k2 = (t * 0.5 + i * 0.14 + 0.45) % 1;
      if (k2 < 0.78) packet(g, p, core, k2, C.red, 3);
    }

    const flash = Math.pow(Math.max(0, Math.sin(t * 1.6)), 6);
    if (flash > 0.02) {
      g.dot(core, 30, C.red, { alpha: 0.35 * flash, scale: 1.6 });
      g.loop(core, 120 + flash * 40, A(C.red, 0.6 * flash), { width: 1.6 });
    }
    g.label([0, 400, 0], "REPLAY → CORRUPTION", A(C.red, 0.75), 11);
    g.flush();
  };

  /* ================= postscript: kernel core, sweep, package deck ============ */

  /* Infinity Core: six subsystems hitting one kernel core, five root exits. */
  scenes.core = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.22, dist: 1100, spin: true, yaw: 0.22 });
    const g = R.rig(ctx, c, w, h);
    const parts = o.parts || ["TIMER", "SIGNAL", "MM", "FUTEX", "SCHED", "SLAB"];
    const Rr = 210, HY = 96;

    g.prism(0, 0, 0, Rr, HY, 6, C.cyan, { alpha: 0.24, edge: 0.55, glow: true, rot: Math.PI / 6 });
    g.prism(0, 0, 0, Rr * 0.62, HY * 1.02, 6, C.amber, { alpha: 0.22, edge: 0.5, rot: Math.PI / 6 });
    g.loop([0, -HY, 0], 300, A(C.cyan, 0.14), { dash: [3, 7], width: 1 });
    g.loop([0, HY, 0], 420, A(C.cyan, 0.12), { dash: [3, 7], width: 1 });

    let strikes = 0;
    parts.forEach((name, i) => {
      const ang = (i / 6) * TAU - Math.PI / 2;
      const p = [Math.cos(ang) * 430, Math.sin(ang) * 210, i % 2 ? 46 : -46];
      const panic = name === "SLAB";
      const k = (((t * 0.30 + i * 0.145) % 1) + 1) % 1;
      const hit = k < 0.3 ? Math.sin((k / 0.3) * Math.PI) : 0;
      if (hit > 0.02) {
        strikes += hit;
        g.beam(p, [0, 0, 0], A(C.red, 0.7 * hit), { width: 2.6 });
        packet(g, p, [0, 0, 0], hit, C.red, 3);
      }
      g.box(p[0], p[1], p[2], 22, 22, 22, panic ? C.steel : C.cyan,
        { alpha: panic ? 0.25 : 0.5, edge: panic ? 0.35 : 0.7 });
      g.label([p[0], p[1] + (p[1] > 0 ? 44 : -38), p[2]], name,
        panic ? A(C.steel, 0.7) : C.cyan, 9.5, { plate: true });
    });

    const pulse = Math.min(1, strikes / 2);
    g.dot([0, 0, 0], 22, C.red, { alpha: 0.2 + pulse * 0.5 });
    g.label([0, -4, 0], "KERNEL", C.ink, 11, { plate: true });

    const exitA = [isSmall(w) ? -440 : -660, 330, 0];
    g.beam(exitA, [-260, 130, 0], A(C.amber, 0.3 + pulse * 0.55), { width: 2, dash: [6, 7], offset: -((t * 34) % 13) });
    g.label([exitA[0], exitA[1] + 30, 0], "HOST ROOT", C.amber, 9.5, { plate: true });
    g.label([0, -330, 0], "5 OF 6 ESCAPE A CONTAINER", A(C.amber, 0.6), 9.5);
    if (o.fixed) g.label([0, -300, 0], o.fixed, A(C.green, 0.8), 9);
    g.flush();
  };

  /* The blind spot: four sweep columns, one item none of the first three see. */
  scenes.channels = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.28, dist: 1040, yaw: 0.34 });
    const g = R.rig(ctx, c, w, h);
    const labels = o.labels || ["PUBLISHED", "MODIFIED", "FEEDS", "OSS-SEC"];
    const halfH = 250, Y = 20, hw = 72, hd = 72;
    const xs = [-420, -140, 140, 420];

    labels.forEach((name, i) => {
      const x = xs[i], isGap = i === labels.length - 1;
      const tone = isGap ? C.green : C.cyan;
      g.box(x, Y, 0, hw, halfH, hd, tone,
        { wire: true, edge: isGap ? 0.5 : 0.32, width: 1, alpha: 0 });
      g.label([x, Y - halfH - 30, 0], name, isGap ? C.green : A(C.steel, 0.8), 9);

      for (let k = 0; k < 6; k++) {
        const yy = Y - halfH + ((k * 109 + t * 22) % (halfH * 2));
        const wd = (hw * 2) * (0.26 + ((k * 37) % 42) / 100);
        g.box(x, yy, 0, wd / 2, 1.6, 6, tone, { alpha: 0.22, edge: 0.2 });
      }
      const by = Y - halfH + ((t * 0.42 + i * 0.21) % 1) * (halfH * 2);
      g.box(x, by, 0, hw - 8, 1.4, hd - 8, isGap ? C.green : C.amber, { alpha: 0.55, flat: true });
    });

    // the item that none of the three sweeps can see, caught by the fourth
    const k = (t * 0.16) % 1;
    const yy = Y - halfH + 20 + k * (halfH * 2 - 40);
    const x = k < 0.62 ? -280 : -280 + ((-420 - -280) * ((k - 0.62) / 0.38));
    const caught = k > 0.8;
    g.octa(x, yy, 40, 15, caught ? C.green : C.red, { alpha: 0.9, glow: true });
    g.label([x, yy - 30, 40], caught ? "CAUGHT" : "INFINITY CORE", caught ? C.green : C.red, 9, { plate: true });

    g.label([-140, Y + halfH + 34, 0], "MISSED", A(C.red, 0.75), 9);
    g.label([420, Y + halfH + 34, 0], "CAUGHT", A(C.green, 0.85), 9);
    g.label([0, Y - halfH - 118, 0], "A SWEEP SEES WHAT THE DATABASE DID", A(C.cyan, 0.55), 9.5);
    g.label([0, Y - halfH - 86, 0], "NOT WHAT CHANGED MEANING", A(C.steel, 0.7), 9.5);
    g.flush();
  };

  /* The package deck: advisories as slabs, severity on the spine. */
  scenes.stack = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.36, dist: 1000, yaw: 0.30 });
    const g = R.rig(ctx, c, w, h);
    const cards = o.cards || [
      { name: "NEXT.JS use cache", sev: "crit", fix: "16.4.1", cve: null },
      { name: "NEXT.JS /_next/image", sev: "crit", fix: "15.5.28", cve: null },
      { name: "DOMPURIFY", sev: "crit", fix: "3.4.17", cve: "3.4.17" },
      { name: "PILLOW", sev: "crit", fix: "13.0.0", cve: "CVE-2026-96639" },
      { name: "GITPYTHON", sev: "high", fix: "3.2.1", cve: "CVE-2026-114145" },
      { name: "STORYBOOK", sev: "high", fix: "8.6.19", cve: "CVE-2026-114126" }
    ];
    const n = cards.length;
    const step = 88, drift = (t * 16) % step;

    for (let k = -1; k <= n; k++) {
      const i = ((k % n) + n) % n;
      const card = cards[i];
      if (!card) continue;
      const y = -120 + k * step - drift;
      if (y < -300 || y > 520) continue;
      const z = i * 16;
      const tone = card.sev === "crit" ? C.red : C.amber;
      g.box(0, y, z, 168, 32, 8, tone, { alpha: 0.3, edge: 0.55 });
      g.box(-150, y, z - 10, 6, 32, 9, tone, { alpha: 0.85, edge: 0.9 });
      g.label([-136, isSmall(w) ? y : y - 13, z - 12], card.name, C.ink, 9.5, { align: "left" });
      if (!isSmall(w)) g.label([-136, y + 16, z - 12], "-> " + card.fix, A(C.green, 0.9), 9, { align: "left" });
      if (!card.cve) {
        g.label([140, y, z - 12], "NO CVE", C.amber, 8.5, { align: "right", plate: true });
      } else {
        g.label([150, y, z - 12], card.cve, A(C.steel, 0.6), 7.5, { align: "right" });
      }
    }
    g.label([0, -300, 0], "58 ADVISORIES / 24 H", A(C.cyan, 0.55), 9.5);
    g.flush();
  };

  /* ================= 10-23 / 10-24 postscript ================= */

  /* Node2Shell: two paths reach the decoder, one never does. */
  scenes.decode = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.22, dist: 1120, yaw: 0.14, spin: true });
    const g = R.rig(ctx, c, w, h);
    const SX = isSmall(w) ? 0.74 : 1;      // phones: pull the far inputs in
    const sx = (p) => [p[0] * SX, p[1], p[2]];
    const inA = sx([-560, -170, 0]), inB = sx([-560, 60, 0]), bare = sx([-560, 300, 0]);
    const join = sx([-300, -55, 0]), core = [0, -55, 0], out = sx([400, -55, 0]);

    [[inA, "fetch()  ·  RESPONSE"], [inB, "express.json() / raw()"]].forEach(([p, name], i) => {
      g.box(p[0], p[1], p[2], 62, 26, 40, C.cyan, { alpha: 0.3, edge: 0.5 });
      g.beam(p, join, A(C.cyan, 0.5), { width: 1.6, dash: [7, 7], offset: -((t * 52) % 14) });
      g.label([p[0] - 78, p[1] - 22, p[2]], name, A(C.cyan, 0.85), 9, { align: "right", plate: true });
      const k = ((t * 0.5 + i * 0.5) % 1 + 1) % 1;
      packet(g, p, join, k, C.amber, 2.6);
    });

    // the bare server: nothing inflates the body, so nothing reaches the decoder
    g.box(bare[0], bare[1], bare[2], 62, 26, 40, C.steel, { alpha: 0.16, edge: 0.32 });
    g.beam(bare, [bare[0] + 150, bare[1] - 40, 0], A(C.steel, 0.35), { width: 1.2, dash: [4, 8] });
    g.label([bare[0] - 78, bare[1], bare[2]], "bare http.createServer()", A(C.steel, 0.6), 9, { align: "right" });
    g.label([bare[0] + 170, bare[1] - 48, 0], "no inflate → nothing reaches it", A(C.green, 0.65), 8.5, { align: "left" });

    g.beam(join, core, A(C.amber, 0.7), { width: 2, dash: [8, 7], offset: -((t * 70) % 15) });
    g.beam(core, out, A(C.red, 0.7), { width: 2, dash: [8, 7], offset: -((t * 70) % 15) });
    packet(g, join, core, ((t * 0.6) % 1 + 1) % 1, C.amber, 2.4);
    packet(g, core, out, ((t * 0.6 + 0.3) % 1 + 1) % 1, C.red, 2.4);

    const beat = 0.5 + 0.5 * Math.sin(t * 3.1);
    g.prism(core[0], core[1], core[2], 150, 60, 6, C.cyan,
      { alpha: 0.16, edge: 0.5, rot: Math.PI / 6, axis: "z" });
    g.prism(core[0], core[1], core[2], 96, 61, 6, C.red,
      { alpha: 0.1 + beat * 0.16, edge: 0.55, rot: Math.PI / 6, axis: "z" });
    g.dot(core, 4, C.red, { alpha: 0.35 + beat * 0.4 });
    g.label([core[0], core[1] - 14, core[2] - 64], "BROTLI", C.ink, 10, { plate: true });
    g.label([core[0], core[1] + 20, core[2] - 64], "DECODER", A(C.ink, 0.7), 8.5);
    g.label([core[0], core[1] + 62, core[2]], "c/dec/decode.c", A(C.steel, 0.6), 8);

    // the marker file only exists after the crafted block lands
    const landed = ((t * 0.30) % 1) > 0.22;
    const oe = out;
    g.box(oe[0], oe[1], oe[2], 28, 20, 6, landed ? C.red : C.steel,
      { alpha: landed ? 0.5 : 0.12, edge: landed ? 0.8 : 0.3, glow: landed });
    g.label([oe[0], oe[1] + 2, oe[2] - 8], "MARKER", landed ? C.red : A(C.steel, 0.5), 8.5);
    g.label([oe[0], oe[1] + 40, oe[2]], landed ? "CODE RAN" : "NOTHING",
      landed ? C.red : A(C.steel, 0.6), 8.5);

    // the fixed build, at the end of the same path
    const fixed = [out[0] + 120 * SX, out[1] + 250, 0];
    g.beam([out[0], out[1] + 40, 0], fixed, A(C.green, 0.35), { width: 1.2, dash: [4, 7] });
    g.box(fixed[0], fixed[1], fixed[2], 56, 18, 8, C.green, { alpha: 0.35, edge: 0.7 });
    g.label([fixed[0], fixed[1], fixed[2] - 8], "24.22.1", A(C.green, 0.95), 9);
    g.label([fixed[0], fixed[1] + 34, fixed[2]], "FORMAT ERROR", A(C.green, 0.65), 8);

    g.label([0, -300, 0], "OFFICIAL 24.22.0 · LINUX ARM64", A(C.cyan, 0.6), 9.5);
    g.label([0, -274, 0], "24.22.1 REJECTS THE SAME BYTES", A(C.green, 0.8), 9.5);
    g.flush();
  };

  /* php2shell: the attempt that sits to the left of PATCH. */
  scenes.before = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.34, dist: 1080, yaw: 0.26 });
    const g = R.rig(ctx, c, w, h);
    const X0 = isSmall(w) ? -460 : -540, X1 = -X0, Y = 160;
    const at = (f) => X0 + (X1 - X0) * f;
    const patch = at(0.70);

    // the patched stretch of the axis, as a lit strip on the ground
    g.quad([[patch, Y + 10, -90], [X1, Y + 10, -90], [X1, Y + 10, 90], [patch, Y + 10, 90]],
      null, { fill: A(C.green, 0.10) });
    g.beam([X0, Y, 0], [X1, Y, 0], A(C.steel, 0.45), { width: 1.6 });

    [["10.17", 0.02], ["10.21 02:00", 0.46], ["10.21 14:00", 0.70], ["10.22", 0.92]].forEach(([name, f], i) => {
      const x = at(f);
      g.beam([x, Y - 10, 0], [x, Y + 10, 0], A(C.ink, 0.55), { width: 1.4, core: false });
      g.label([x, Y + 44, 0], name, i === 2 ? C.green : A(C.steel, 0.75), 8.5);
    });

    // the patch line itself: a wall the attacks do not cross
    g.quad([[patch, Y - 150, -80], [patch, Y - 150, 80], [patch, Y + 100, 80], [patch, Y + 100, -80]],
      A(C.green, 0.8), { fill: A(C.green, 0.10), dash: [6, 6], width: 1.4 });
    g.label([patch + 12, Y - 178, 0], "PATCH", C.green, 9.5, { align: "left", plate: true });
    g.label([(X0 + patch) / 2, Y - 228, 0], "EMBARGO · ATTEMPTS", A(C.amber, 0.6), 8.5);
    g.label([(patch + X1) / 2, Y - 228, 0], "PATCHED · BROAD ATTEMPTS", A(C.green, 0.6), 8.5);

    // pre-disclosure attempt
    const pre = at(0.055);
    g.loop([pre, Y - 6, 0], 18 + 4 * Math.sin(t * 2.4), A(C.amber, 0.65), { plane: "xy", width: 1.4 });
    g.dot([pre, Y - 6, 0], 3.8, C.amber, { alpha: 0.9 });
    g.label([pre, Y - 46, 0], "ATTEMPT", C.amber, 9);

    for (let i = 0; i < 9; i++) {
      const f = 0.47 + (i / 9) * 0.21;
      const ph = (t * 0.6 + i * 0.17) % 2.4;
      g.dot([at(f) + ph * 26, Y - 14 - (i % 3) * 13, 0], 1.9, C.red, { alpha: Math.max(0, 1 - ph / 2.4), glow: false });
    }
    for (let i = 0; i < 12; i++) {
      const f = 0.72 + ((i * 0.017) % 0.19);
      const ph = (t * 0.5 + i * 0.21) % 2.0;
      g.dot([at(f) + ph * 22, Y + 16 + (i % 4) * 10, 0], 1.7, C.red, { alpha: Math.max(0, 1 - ph / 2.0) * 0.8, glow: false });
    }

    g.label([at(0.02), Y - 180, 0], "482,342", C.amber, 21, { align: "left", bold: true });
    g.label([at(0.02), Y - 124, 0], "REQUESTS / FIRST 24 H", A(C.steel, 0.75), 8.5, { align: "left" });
    g.label([at(0.02), Y - 96, 0], "21,998 sites · 103 countries", A(C.steel, 0.65), 8.5, { align: "left" });
    g.label([at(0.02), Y - 70, 0], "122,311 attack sessions", A(C.steel, 0.65), 8.5, { align: "left" });

    g.label([X1, Y + 150, 0], "0 CONFIRMED COMPROMISES", A(C.green, 0.85), 10, { align: "right" });
    g.label([X1, Y + 180, 0], "0 SUCCESSFUL MIRAIS", A(C.green, 0.6), 8.5, { align: "right" });
    g.label([pre, Y + 112, 0], "4 DAYS BEFORE THE ADVISORY", C.amber, 9.5, { align: "left" });
    g.label([0, -320, 0], "ATTEMPTED BEFORE IT WAS DISCLOSED", A(C.amber, 0.65), 9.5);
    g.flush();
  };

  /* The severity filter: cards hit the gate, one passes. */
  scenes.funnel = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1020, yaw: 0.30 });
    const g = R.rig(ctx, c, w, h);
    const cards = o.cards || [
      { id: "CVE-2026-111497", score: "9.2", kind: "CVSS 4.0" },
      { id: "CVE-2026-114625", score: "9.9", kind: "CNA" },
      { id: "CVE-2026-91637", score: "9.9", kind: "CNA" }
    ];
    const gate = 150;

    g.quad([[gate, -230, -110], [gate, -230, 110], [gate, 240, 110], [gate, 240, -110]],
      A(C.cyan, 0.5), { fill: A(C.cyan, 0.05), dash: [6, 7], width: 1.6 });
    g.label([gate, -266, 0], "cvssV3Severity=CRITICAL", A(C.cyan, 0.8), 9, { plate: true });

    cards.forEach((card, i) => {
      const cyc = (t * 0.42 + i * 0.31) % 1.35;
      const approach = Math.min(1, cyc / 0.7);
      const recoil = cyc > 0.7 ? Math.min(1, (cyc - 0.7) / 0.65) : 0;
      const x = -300 + (gate - 60 + 300) * approach - recoil * 150;
      const y = -120 + i * 92;
      const hit = cyc > 0.7;

      g.box(x, y, 0, 156, 17, 9, hit ? C.red : C.cyan,
        { alpha: 0.28 + approach * 0.45, edge: hit ? 0.8 : 0.5 });
      if (isSmall(w)) {
        g.label([x - 144, y, -10], card.id, C.ink, 8.5, { align: "left" });
        g.label([x + 144, y, -10], card.score, C.amber, 10, { align: "right", bold: true });
      } else {
        g.label([x - 144, y - 9, -10], card.id, C.ink, 8.5, { align: "left" });
        g.label([x - 144, y + 12, -10], card.kind + " · " + card.score, A(C.steel, 0.8), 8, { align: "left" });
      }
      if (hit) {
        g.label([x + 18, y - 1, -10], "0 ROWS", C.red, 10, { align: "left", plate: true });
        g.dot([gate, y, 0], 2.6, C.red, { alpha: 0.5 * (1 - recoil) });
      }
    });

    // one card the filter does accept: NVD's own primary score
    const passPh = (t * 0.30) % 1.6;
    const passX = -360 + (gate + 170 + 360) * Math.min(1, passPh / 1.2);
    const passY = 190;
    g.box(passX, passY, 0, 84, 15, 9, C.green, { alpha: 0.5, edge: 0.8 });
    g.label([passX - 76, passY, -10], "PRIMARY · 9.9", A(C.green, 0.9), 8.5, { align: "left" });
    if (passPh > 0.9) g.label([gate + 60, passY + 26, 0], "PASS", A(C.green, 0.85), 9, { align: "left" });

    g.label([gate + 190, -84, 0], "98", C.amber, 26, { align: "left", bold: true });
    g.label([gate + 190, -48, 0], "ROWS · 104 → 98", A(C.steel, 0.75), 8.5, { align: "left" });
    g.label([gate + 190, -22, 0], "6 OUT · 0 IN · NOTHING FIXED", A(C.steel, 0.6), 8, { align: "left" });
    g.label([gate + 190, 6, 0], "PRIMARY SCORES ONLY", A(C.cyan, 0.7), 8.5, { align: "left" });

    // the unfiltered sweep, as depth along the front edge
    for (let i = 0; i < 114; i++) {
      const x = -430 + (860 * i) / 113;
      const hgt = 4 + ((i * 37) % 13);
      g.box(x, 330 - hgt / 2, 190, 1.4, hgt / 2, 1.4, i % 19 === 0 ? C.amber : C.cyan,
        { alpha: 0.45, edge: 0.1 });
    }
    g.label([-430, 372, 190], "342 PUBLISHED / 24 H · ALL SEVERITIES", A(C.steel, 0.65), 8.5, { align: "left" });
    g.label([0, -330, 0], "A CNA 9.9 IS A ZERO-ROW ANSWER", A(C.red, 0.75), 9.5);
    g.flush();
  };

  /* Four incidents no CVE list named. */
  scenes.ledger = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.28, dist: 980, yaw: 0.22 });
    const g = R.rig(ctx, c, w, h);
    const rows = o.rows || [
      { name: "ARISTA VELOCLOUD", figure: "9.9", tag: "EXPLOITED · NEEDS LOGIN", tone: "red" },
      { name: "LINUX KSMBD", figure: "9.0", tag: "NO CVE · NO FIX", tone: "amber" },
      { name: "CAPCOM CAPCOM ID", figure: "11,774,247", tag: "EMAILS · BREACH", tone: "amber" },
      { name: "ONAMAE DESKTOP CLOUD", figure: "26,739", tag: "SERVERS SUSPENDED", tone: "amber" }
    ];
    const left = -400, right = 400;

    g.label([left, -300, 0], "NEWS CHANNEL", A(C.cyan, 0.7), 9, { align: "left" });
    g.label([right, -300, 0], "PRIMARY SOURCE", A(C.green, 0.75), 9, { align: "right" });

    rows.forEach((row, i) => {
      const ph = Math.min(1, Math.max(0, t * 1.5 - i * 0.18));
      const y = -180 + i * 116;
      const x = left + (1 - ph) * 40;
      const tone = row.tone === "red" ? C.red : row.tone === "amber" ? C.amber : C.steel;

      // each row is a slab, so the table has thickness as the camera turns
      g.box(0, y, 6, 404, 24, 8, C.steel, { alpha: 0.07 + ph * 0.06, edge: 0.18, width: 1 });
      g.beam([left, y, -4], [right, y, -4], A(tone, 0.18 + ph * 0.2), { width: 1, core: false });
      g.box(x - 40, y, -8, 8, 8, 8, C.cyan, { alpha: 0.3 + ph * 0.55 });

      if (isSmall(w)) {
        g.label([x, y - 2, -8], row.name, A(C.ink, 0.92), 9.5, { align: "left" });
      } else {
        g.label([x, y - 12, -8], row.name, A(C.ink, 0.92), 9.5, { align: "left" });
        g.label([x, y + 14, -8], row.tag, A(tone, 0.85), 8, { align: "left" });
      }
      g.label([150, y + 1, -8], row.figure, C.amber, 16, { align: "right", bold: true });

      // the primary-source plate, and the tick that says it was checked
      g.box(right, y, -8, 36, 17, 8, C.green, { alpha: 0.16 + ph * 0.28, edge: 0.5 });
      if (ph > 0.65) {
        g.beam([right - 6, y + 2, -14], [right + 2, y - 9, -14], C.green, { width: 2 });
        g.beam([right + 2, y - 9, -14], [right + 16, y + 10, -14], C.green, { width: 2 });
      }
    });

    g.label([0, -350, 0], "FOUR INCIDENTS, NO CVE LIST", A(C.cyan, 0.7), 9.5, { plate: true });
    g.label([0, 340, 0], "FIGURES AS THE VENDORS PUBLISHED THEM", A(C.steel, 0.65), 8.5);
    g.flush();
  };

  /* CVE-2026-115560: four conditions make the path; one line closes it. */
  scenes.checklist = (ctx, w, h, t, o) => {
    const c = R.cam(t, { pitch: -0.32, dist: 1000, yaw: 0.30 });
    const g = R.rig(ctx, c, w, h);
    const conds = o.conditions || [
      "handler = php_binary",
      "ini_set -> php at runtime",
      "before session_start()",
      "upload_progress on"
    ];
    const top = -180, step = 92, hx = 116, hy = 18;

    const column = (cx, title, colour, mitigated) => {
      g.label([cx, top - 70, 0], title, colour, 10, { plate: true });
      g.beam([cx, top - 40, 0], [cx, top + conds.length * step + 10, 0], A(colour, 0.35), { width: 1.4, core: false });
      conds.forEach((text, i) => {
        const y = top + i * step;
        const isLast = i === conds.length - 1;
        const on = !(mitigated && isLast);
        const reveal = Math.min(1, Math.max(0, t * 1.8 - i * 0.18 - (mitigated ? 0.5 : 0)));
        g.box(cx, y, 0, hx, hy, 8, on ? colour : C.green,
          { alpha: 0.16 + reveal * 0.34, edge: on ? 0.55 : 0.8 });
        if (!isSmall(w)) g.label([cx - hx + 16, y, -10], String(i + 1), A(C.steel, 0.6), 8.5, { align: "left" });
        g.label([cx - hx + (isSmall(w) ? 14 : 46), y, -10], text, A(C.ink, 0.85), 9, { align: "left" });
        if (reveal > 0.55) {
          const qx = cx + hx - 18;
          if (on) {
            g.beam([qx - 5, y, -10], [qx - 1, y + 5, -10], colour, { width: 1.8 });
            g.beam([qx - 1, y + 5, -10], [qx + 7, y - 7, -10], colour, { width: 1.8 });
          } else {
            g.beam([qx - 5, y - 5, -10], [qx + 5, y + 5, -10], C.green, { width: 1.8 });
            g.beam([qx + 5, y - 5, -10], [qx - 5, y + 5, -10], C.green, { width: 1.8 });
          }
        }
      });
    };

    column(-240, "EXPOSED", A(C.red, 0.9), false);
    column(240, "MITIGATED", A(C.green, 0.9), true);

    const y4 = top + (conds.length - 1) * step;
    g.label([240, y4 + 56, 0], "session.upload_progress.enabled = 0", A(C.green, 0.95), 9, { plate: true });
    g.label([240, y4 + 86, 0], "nothing else changes", A(C.steel, 0.6), 8);

    g.label([0, -300, 0], "FOUR CONDITIONS · ONE LINE", A(C.cyan, 0.65), 9.5);
    g.label([0, 330, 0], "PHP: UNLIKELY IS NOT IMPOSSIBLE", A(C.amber, 0.65), 8.5);
    g.flush();
  };

  /* Confluence: five feeds into one reviewed group. */
  scenes.intelConfluence = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.34, dist: 1000, yaw: 0.34 });
    const g = R.rig(ctx, c, w, h);
    const names = ["NVD", "GHSA", "KEV", "JVN", "FEEDS"];
    const tones = [C.cyan, C.cyan, C.red, C.green, C.amber];
    const hub = [0, 40, 0];

    g.loop([0, 40, 0], 190, A(C.cyan, 0.16), { width: 1 });
    g.loop([0, 40, 0], 300, A(C.cyan, 0.13), { width: 1 });
    g.loop([0, 40, 0], 250, A(C.cyan, 0.45), { width: 1.2, dash: [6, 13], offset: -t * 13 });

    names.forEach((name, i) => {
      const ang = -Math.PI / 2 + (i * TAU) / 5;
      const x = Math.cos(ang) * 360, z = Math.sin(ang) * 360;
      const y = -60;
      const src = [x, y, z];
      g.box(x, y, z, 62, 26, 40, tones[i], { alpha: 0.32, edge: 0.65 });
      g.label([x, y - 52, z], name, tones[i], 10, { plate: true });
      g.beam(src, hub, A(tones[i], 0.4), { width: 1.5, dash: [7, 8], offset: -((t * 30 + i * 7) % 15) });
      packet(g, src, hub, ((t * 0.35 + i * 0.2) % 1 + 1) % 1, tones[i], 2.4);
    });

    g.prism(hub[0], hub[1], hub[2], 118, 62, 6, C.amber, { alpha: 0.3, edge: 0.8, glow: true, rot: Math.PI / 6 });
    g.label([0, hub[1] - 10, -70], "24", C.amber, 26, { bold: true, plate: true });
    g.label([0, hub[1] + 30, -70], "REVIEWED GROUPS", C.ink, 10);
    g.label([0, 300, 0], "COLLECT  /  CROSS-CHECK  /  PRIORITIZE", A(C.steel, 0.8), 10);
    g.flush();
  };

  /* Isolation: two entry paths, one patch barrier that stops both. */
  scenes.exploitIsolation = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1060, yaw: 0.28 });
    const g = R.rig(ctx, c, w, h);
    const lanes = [
      { y: -120, name: "VCO", cond: "VALID SESSION" },
      { y: 120, name: "BUILT-IN CODE", cond: "NO AUTH / CODE STOPPED" }
    ];

    lanes.forEach((lane, i) => {
      const y = lane.y;
      const req = [-330, y, 0], wall = [-60, y, 0], srv = [310, y, 0];

      g.box(req[0], y, 0, 68, 36, 42, C.red, { alpha: 0.26, edge: 0.65 });
      g.label([req[0], y, -50], "REQUEST", A(C.red, 0.95), 10, { plate: true });
      g.label([req[0], y - 70, 0], lane.name, C.ink, 12);
      g.label([req[0], y + 62, 0], lane.cond, A(C.steel, 0.7), 9);

      g.beam(req, wall, A(C.red, 0.5), { width: 2, dash: [8, 7], offset: -((t * 40) % 15) });
      for (let j = 0; j < 4; j++) {
        const k = ((t * 0.5 + j * 0.25 + i * 0.4) % 1 + 1) % 1;
        packet(g, req, [wall[0] - 14, y, 0], Math.min(0.98, k), C.red, 2.2);
      }

      // the barrier: the attack terminates here, nothing crosses
      const pulse = (Math.sin(t * 3 + i) + 1) / 2;
      g.box(wall[0], y, 0, 8, 92, 80, C.green, { alpha: 0.1 + pulse * 0.08, edge: 0.55 });
      for (let j = 0; j < 5; j++) {
        g.beam([wall[0] - 4, y - 76 + j * 38, -60], [wall[0] + 4, y - 54 + j * 38, 60], A(C.green, 0.5), { width: 1, core: false });
      }
      g.beam([wall[0], y - 96, 0], [wall[0], y + 96, 0], C.green, { width: 3 });

      g.beam(wall, srv, A(C.green, 0.5), { width: 2, dash: [8, 7], offset: -((t * 36) % 15) });
      packet(g, wall, srv, ((t * 0.4 + i * 0.3) % 1 + 1) % 1, C.green, 2.2);

      g.box(srv[0], y, 0, 80, 48, 56, C.green, { alpha: 0.3, edge: 0.75 });
      g.label([srv[0], y - 12, -64], "SERVER", C.green, 11, { plate: true });
      g.label([srv[0], y + 18, -64], "PATCHED", A(C.green, 0.75), 9);
      g.label([srv[0], y + 76, 0], "UPDATE / INVESTIGATE", C.green, 10);
    });

    g.label([-200, -14, 0], "TWO ENTRY PATHS / PATCH + TRIAGE", C.amber, 11, { plate: true });
    g.flush();
  };

  /* Four packages, four different boundaries. */
  scenes.packageBoundaries = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1040, yaw: 0.26 });
    const g = R.rig(ctx, c, w, h);
    const names = ["PILLOW", "WASMTIME", "LARAVEL", "ECHO"];
    const tags = ["IMAGE", "WASM", "TOKEN", "PROXY"];
    const tones = [C.amber, C.cyan, C.green, C.amber];

    names.forEach((name, i) => {
      const x = -285 + i * 190;
      const y = 40;
      const tone = tones[i];

      g.box(x, y, 0, 72, 104, 44, tone, { alpha: 0.2, edge: 0.6 });
      // the inner box is the boundary that actually contains the payload
      g.box(x, y, 0, 46, 62, 26, tone, { alpha: 0.14, edge: 0.85, wire: true, width: 1.4 });
      g.label([x, y - 148, 0], name, tone, 11, { plate: true });
      g.label([x, y + 140, 0], tags[i], A(C.steel, 0.75), 9.5);

      const k = ((t * 0.3 + i * 0.21) % 1 + 1) % 1;
      g.dot([x, y - 84 + k * 44, 0], 2.8, C.red, { alpha: 0.85 });

      // the lock sits on the boundary, not on the screen
      g.box(x, y + 82, 0, 14, 12, 12, C.green, { alpha: 0.5, edge: 0.8 });
      g.loop([x, y + 70, 0], 9, C.green, { plane: "xy", a0: Math.PI, a1: TAU, width: 1.6 });
      g.label([x, y + 176, 0], "PATCH", C.green, 10);
    });

    g.label([0, -300, 0], "FOUR PACKAGES / FOUR DIFFERENT BOUNDARIES", A(C.steel, 0.85), 10.5);
    g.flush();
  };

  /* Bundled layers: patch the copy that actually runs. */
  scenes.bundledLayers = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1040, yaw: 0.34 });
    const g = R.rig(ctx, c, w, h);
    const names = ["RUBY", "PERL", "NGINX"];
    const layers = [
      ["APP INPUT", "REGEXP", "ONIGMO"],
      ["MODULE", "BUNDLED", "BROTLI"],
      ["REQUEST", "DIRECTIVES", "WORKER"]
    ];

    names.forEach((name, i) => {
      const x = -245 + i * 245;
      g.label([x, -250, 0], name, C.ink, 13, { plate: true });
      for (let j = 2; j >= 0; j--) {
        const y = -60 + j * 62;
        const tone = j === 1 ? C.amber : C.cyan;
        g.box(x, y, 0, 88, 21, 46, tone, { alpha: j === 1 ? 0.4 : 0.22, edge: j === 1 ? 0.8 : 0.5, glow: j === 1 });
        g.label([x, y, -48], layers[i][j], tone, 10.5, { plate: true });
      }
      const sweep = -110 + ((t * 34 + i * 36) % 250);
      g.box(x, sweep, 0, 92, 1.4, 50, C.green, { alpha: 0.6, flat: true });
      g.dot([x - 92, sweep, 0], 2.6, C.green, { alpha: 0.6 });
      g.beam([x, -190, 0], [x, -134, 0], A(C.red, 0.6), { width: 1.6, dash: [5, 5] });
    });

    g.beam([-340, 190, 0], [340, 190, 0], A(C.steel, 0.4), { width: 1, core: false });
    g.label([0, 225, 0], "PATCH THE COPY THAT ACTUALLY RUNS", C.green, 13, { plate: true });
    g.label([0, 255, 0], "APP  >  RUNTIME  >  EMBEDDED LIBRARY", A(C.steel, 0.8), 10);
    g.flush();
  };

  /* Authority has to pass every gate. */
  scenes.agentPermissions = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.32, dist: 1040, yaw: 0.34 });
    const g = R.rig(ctx, c, w, h);
    const targets = [
      [-300, -150, "AUTH", "REQUEST"],
      [300, -150, "TLS", "PROVIDER"],
      [-300, 150, "VAULT", "NOTES"],
      [300, 150, "MODEL", "LOADER"]
    ];
    const agent = [0, 0, 0];

    g.prism(0, 0, 0, 132, 8, 24, C.amber, { alpha: 0.1, edge: 0.2, flat: true });
    g.loop(agent, 96, A(C.amber, 0.5), { width: 1.2, dash: [9, 8], offset: -t * 18 });
    g.box(0, -6, 0, 38, 26, 32, C.amber, { alpha: 0.5, edge: 0.85, glow: true });
    g.label([0, 54, -34], "AGENT", C.amber, 11, { plate: true });

    targets.forEach(([x, y, gate, name], i) => {
      const gx = x * 0.5, gy = y * 0.5;
      const gateP = [gx, gy, 0], dst = [x, y, 0];
      g.beam(agent, gateP, A(C.amber, 0.55), { width: 1.6, dash: [6, 7], offset: -((t * 26 + i * 5) % 13) });
      g.beam(gateP, dst, A(C.green, 0.55), { width: 1.6, dash: [6, 7], offset: -((t * 26 + i * 5) % 13) });
      g.loop(gateP, 30, C.green, { plane: "xy", width: 1.5 });
      g.box(gx, gy, 0, 12, 10, 10, C.green, { alpha: 0.5, edge: 0.8 });
      g.label([gx, gy + (y < 0 ? -50 : 54), 0], gate, C.green, 10, { plate: true });
      g.box(x, y, 0, 62, 30, 38, C.cyan, { alpha: 0.24, edge: 0.6 });
      g.label([x, y, -44], name, C.cyan, 10, { plate: true });
      packet(g, agent, gateP, ((t * 0.4 + i * 0.18) % 1 + 1) % 1, C.amber, 2.2);
    });

    g.label([0, -280, 0], "AUTHORITY MUST PASS EVERY GATE", A(C.steel, 0.85), 10.5);
    g.label([0, 280, 0], "IDENTITY / TRANSPORT / SCOPE / INPUT", C.green, 10.5);
    g.flush();
  };

  /* Domestic routes: a locator map, not incident geography. */
  scenes.domesticRoutes = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.65, dist: 1000, yaw: 0.10, pitchMax: -0.36 });
    const g = R.rig(ctx, c, w, h);
    const islands = [
      [[50, -177], [74, -190], [110, -164], [101, -140], [73, -143], [57, -125], [38, -140]],
      [[58, -127], [74, -106], [60, -77], [42, -54], [33, -19], [8, 4], [-17, 15], [-30, 43], [-65, 57], [-85, 83], [-125, 92], [-158, 114], [-195, 114], [-211, 99], [-184, 79], [-143, 73], [-108, 57], [-89, 28], [-47, 12], [-26, -13], [4, -25], [17, -58], [43, -84]],
      [[-149, 115], [-116, 112], [-101, 126], [-136, 142], [-160, 133]],
      [[-207, 117], [-177, 131], [-181, 160], [-207, 184], [-230, 168], [-227, 139]]
    ];
    const map = (p) => [p[0] * 0.95, 0, p[1] * 0.95];

    islands.forEach((pts) => {
      g.quad(pts.map(map), A(C.cyan, 0.6), { fill: A(C.cyan, 0.05), width: 1.2 });
    });

    const nodes = [[24, -41], [-88, 64], [-198, 144]];
    const gate = [220, -30, -11], records = [220, 60, 137];
    nodes.forEach(([x, y], i) => {
      const p = map([x, y]);
      g.loop(p, 14 + ((t * 16 + i * 13) % 35), A(C.cyan, 0.2), { width: 1 });
      g.dot(p, 4, C.amber, { alpha: 0.9 });
      // two hops: node → gate, then gate → records
      arc3(g, p, gate, 90, A(C.cyan, 0.45), { width: 1.4, dash: [7, 7], offset: -((t * 20 + i * 6) % 14) });
      packet(g, p, gate, ((t * 0.35 + i * 0.2) % 1 + 1) % 1, C.cyan, 2.2);
    });

    g.box(gate[0], gate[1], gate[2], 52, 34, 44, C.green, { alpha: 0.3, edge: 0.75 });
    g.label([gate[0], gate[1] - 14, gate[2] - 50], "API", C.green, 10, { plate: true });
    g.label([gate[0], gate[1] + 20, gate[2] - 50], "ACCESS GATE", A(C.green, 0.75), 8.5);
    g.beam(gate, records, A(C.green, 0.5), { width: 1.6, dash: [6, 6] });
    packet(g, gate, records, ((t * 0.4) % 1 + 1) % 1, C.green, 2.2);
    g.box(records[0], records[1], records[2], 66, 26, 40, C.cyan, { alpha: 0.24, edge: 0.6 });
    g.label([records[0], records[1], records[2] - 46], "RECORDS", C.cyan, 10, { plate: true });

    // two blocked attempts that never reach the gate
    [-124, -75].forEach((y, i) => {
      const from = [150, 60, y];
      arc3(g, from, gate, 70, A(C.red, 0.5), { width: 1.4, dash: [5, 7], offset: -((t * 18 + i * 8) % 12) });
      g.beam([gate[0] - 20, gate[1] - 10, gate[2]], [gate[0] + 14, gate[1] + 16, gate[2]], C.red, { width: 2 });
      g.beam([gate[0] + 14, gate[1] - 10, gate[2]], [gate[0] - 20, gate[1] + 16, gate[2]], C.red, { width: 2 });
    });

    g.label([-250, -52, -220], "DOMESTIC SYSTEMS", C.ink, 12, { align: "left", plate: true });
    g.label([-250, -16, -220], "LDAP / LIFF / WEB APIs", A(C.steel, 0.7), 9.5, { align: "left" });
    g.label([0, 300, 0], "PER-ENDPOINT AUTHORIZATION / TOKEN SCOPE", C.green, 10.5);
    g.flush();
  };

  /* Firmware fleet: release lines, devices, and the fix that applies. */
  scenes.firmwareFleet = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.30, dist: 1040, yaw: 0.26 });
    const g = R.rig(ctx, c, w, h);
    const lines = ["10.8", "10.7", "10.4", "8.13", "8.10"];
    const fixes = ["10.8.1.2", "10.7.2.7", "10.4.1.14", "8.13.3.1", "8.10.0.24"];

    // eight warning marks refer to the eight CVSS-10.0 CVEs, not to devices
    for (let j = 0; j < 8; j++) {
      const x = -77 + j * 22;
      g.octa(x, -232, 0, 7, C.red, { alpha: 0.7 });
    }
    g.label([0, -196, 0], "8 MAX-SCORE CVEs / MATCH THE RELEASE LINE", A(C.steel, 0.8), 10);

    g.beam([-320, -140, 0], [320, -140, 0], A(C.cyan, 0.6), { width: 1.6 });

    lines.forEach((name, i) => {
      const x = -274 + i * 137;
      g.beam([x, -140, 0], [x, -84, 0], A(C.cyan, 0.5), { width: 1.4, dash: [5, 5], offset: -((t * 24 + i * 5) % 10) });
      g.label([x, -64, 0], name, C.cyan, 11, { plate: true });

      g.box(x, 40, 0, 46, 88, 30, C.cyan, { alpha: 0.22, edge: 0.55 });
      for (let slot = 0; slot < 4; slot++) {
        const sy = -12 + slot * 38;
        g.box(x, sy, -30, 40, 11, 2, C.steel, { alpha: 0.16, edge: 0.3 });
        for (let port = 0; port < 5; port++) {
          const on = port === Math.floor((t * 1.3 + i + slot) % 5);
          g.box(x - 30 + port * 15, sy, -33, 3, 3, 1.5, on ? C.green : C.cyan,
            { alpha: on ? 0.9 : 0.25, edge: 0 });
        }
      }
      const scan = -52 + ((t * 24 + i * 13) % 160);
      g.box(x, scan, -30, 46, 1.2, 3, C.green, { alpha: 0.55, flat: true });
      g.label([x, 148, 0], fixes[i], C.green, 10.5);
    });

    g.label([0, 214, 0], "72 CVEs IN THE HPE BULLETIN", C.amber, 14, { bold: true, plate: true });
    g.label([0, 246, 0], "PRODUCT + VERSION  >  APPLICABLE FIX", A(C.steel, 0.8), 10);
    g.flush();
  };

  /* Trust renewal: three certificates, one rejected branch. */
  scenes.trustRenewal = (ctx, w, h, t) => {
    const c = R.cam(t, { pitch: -0.26, dist: 1040, yaw: 0.28 });
    const g = R.rig(ctx, c, w, h);
    const names = ["CA BLOCK LIST", "SECURE BOOT", "CREDENTIALS"];
    const actions = ["REVOKE", "VERIFY DBX", "ROTATE"];

    g.beam([-360, -250, 0], [360, -250, 0], A(C.steel, 0.35), { width: 1.6, core: false });

    names.forEach((name, i) => {
      const x = -250 + i * 250;
      const bob = Math.sin(t * 0.7 + i) * 4;
      const y = -7 + bob;

      g.beam([x, -250, 0], [x, y - 92, 0], A(C.steel, 0.3), { width: 1, core: false });
      g.box(x, y, 0, 78, 90, 14, C.cyan, { alpha: 0.18, edge: 0.6 });
      g.box(x, y, -16, 56, 62, 1.5, C.cyan, { alpha: 0.1, edge: 0.35 });
      for (let j = 0; j < 3; j++) {
        g.beam([x - 46, y - 46 + j * 18, -18], [x + 10, y - 46 + j * 18, -18], A(C.steel, 0.5), { width: 1, core: false });
      }

      if (i === 0) {
        g.loop([x, y + 30, -18], 18, C.green, { plane: "xy", width: 1.5 });
        g.beam([x - 8, y + 30, -18], [x - 2, y + 36, -18], C.green, { width: 2 });
        g.beam([x - 2, y + 36, -18], [x + 10, y + 22, -18], C.green, { width: 2 });
      } else if (i === 1) {
        g.box(x, y + 26, -18, 22, 18, 2, C.green, { alpha: 0.2, edge: 0.7 });
        g.loop([x, y + 8, -18], 10, C.green, { plane: "xy", a0: Math.PI, a1: TAU, width: 1.6 });
        for (let j = 0; j < 4; j++) {
          g.beam([x - 30, y + 10 + j * 8, -18], [x - 22, y + 10 + j * 8, -18], C.green, { width: 1 });
          g.beam([x + 22, y + 10 + j * 8, -18], [x + 30, y + 10 + j * 8, -18], C.green, { width: 1 });
        }
      } else {
        g.loop([x - 12, y + 24, -18], 12, C.green, { plane: "xy", width: 2 });
        g.beam([x, y + 24, -18], [x + 26, y + 24, -18], C.green, { width: 2 });
        g.beam([x + 26, y + 24, -18], [x + 26, y + 34, -18], C.green, { width: 2 });
      }

      g.label([x, -140, 0], name, C.ink, 12, { plate: true });
      g.label([x, 116, 0], actions[i], C.green, 12, { plate: true });

      if (i < 2) {
        g.beam([x + 84, y, 0], [x + 160, y, 0], A(C.green, 0.5), { width: 1.6, dash: [6, 6], offset: -((t * 22 + i * 6) % 12) });
        packet(g, [x + 84, y, 0], [x + 160, y, 0], ((t * 0.4 + i * 0.3) % 1 + 1) % 1, C.green, 2.2);
      }

      // the old binary stays below the chain and never rejoins it
      g.beam([x, 92, 0], [x, 158, 0], A(C.steel, 0.3), { width: 1, core: false });
      g.box(x, 176, 0, 40, 18, 10, C.steel, { alpha: 0.1, edge: 0.3, wire: true, width: 1.1 });
      g.beam([x - 30, 164, -12], [x + 30, 188, -12], A(C.steel, 0.5), { width: 1.4 });
      g.beam([x + 30, 164, -12], [x - 30, 188, -12], A(C.steel, 0.5), { width: 1.4 });
    });

    g.label([0, -300, 0], "REPAIR THE CHAIN OF TRUST", C.amber, 13, { plate: true });
    g.label([0, 280, 0], "REVOKED CERT / OLD BOOT BINARY / EXPOSED KEY", A(C.steel, 0.8), 10);
    g.flush();
  };

  /* ---------- screen-space HUD frame ---------- */
  function frame(ctx, w, h, t) {
    const m = Math.max(14, Math.min(w, h) * 0.035);
    ctx.save();
    ctx.globalAlpha = 0.30;
    ctx.strokeStyle = "rgba(140,190,215,.8)";
    ctx.lineWidth = 1;
    const L = 22;
    [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y);
      ctx.stroke();
    });
    // centre reticle
    const cx = w * 0.62, cy = h * 0.40, r = Math.min(w, h) * 0.16;
    ctx.globalAlpha = 0.10;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.15, cy); ctx.lineTo(cx - r * 0.55, cy);
    ctx.moveTo(cx + r * 0.55, cy); ctx.lineTo(cx + r * 1.15, cy);
    ctx.moveTo(cx, cy - r * 1.15); ctx.lineTo(cx, cy - r * 0.55);
    ctx.moveTo(cx, cy + r * 0.55); ctx.lineTo(cx, cy + r * 1.15);
    ctx.stroke();
    // drifting tick strip
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 24; i++) {
      const x = ((i * 60 + t * 18) % (w + 120)) - 60;
      ctx.beginPath(); ctx.moveTo(x, h - m - 6); ctx.lineTo(x, h - m - 2); ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- entry ---------- */
  return {
    setTilt(yaw, pitch) { R.setTilt(yaw, pitch); },
    getTilt() { return R.getTilt(); },
    draw(visual, ctx, w, h, t, reduced, ox, oy) {
      R.setView(w, h);
      const type = (visual && visual.type) || "radar";
      const fn = scenes[type] || scenes.radar;
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w * 0.58, h * 0.40, 0, w * 0.58, h * 0.40, Math.max(w, h) * 0.72);
      g.addColorStop(0, "rgba(16,30,44,.70)");
      g.addColorStop(1, "rgba(4,7,11,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      // test hooks: the label sink is per-draw, and the offset is what the
      // canvas translate adds to every projected coordinate
      if (window.__labelSink) window.__labelSink.length = 0;
      window.__viewOffset = { x: ox || 0, y: oy || 0 };
      ctx.save();
      ctx.translate(ox || 0, oy || 0);
      fn(ctx, w, h, reduced ? 1.2 : t, visual || {});
      ctx.restore();
      frame(ctx, w, h, reduced ? 1.2 : t);
    }
  };
})();
