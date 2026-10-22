/* Pseudo-3D canvas renderers. Orthographic-with-perspective projection, no libraries.
   Each renderer takes (ctx, w, h, t, opts) where t = seconds into the scene. */
window.VISUALS = (function () {
  const TAU = Math.PI * 2;
  const C = {
    amber: "#ffb545", cyan: "#58e0ff", red: "#ff5b57", green: "#6ef2b0",
    dim: "rgba(150,175,195,.45)", faint: "rgba(150,175,195,.16)", ink: "#e6eef6"
  };

  /* ---------- user tilt (drag / long-press) ---------- */
  const TILT = { yaw: 0, pitch: 0 };
  const SCREEN_SPACE = new Set(["radar", "clock", "matrix", "storm"]);

  /* ---------- camera ---------- */
  const VIEW = { zoom: 0.62 };
  function cam(t, opts) {
    const o = opts || {};
    return {
      yaw: (o.yaw || 0) + (o.spin ? Math.sin(t * 0.12) * 0.18 : 0) + TILT.yaw,
      pitch: (o.pitch || -0.30) + TILT.pitch,
      dist: (o.dist || 1000) * VIEW.zoom,
      f: 900
    };
  }
  function project(c, x, y, z, w, h) {
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const s = c.f / (c.f + z2 + c.dist);
    return [w / 2 + x1 * s, h / 2 + y2 * s, s];
  }
  function poly(ctx, pts, style, width, close) {
    if (!pts || pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (close) ctx.closePath();
    if (style) { ctx.strokeStyle = style; ctx.lineWidth = width || 1; ctx.stroke(); }
  }
  function line3(ctx, c, a, b, w, h, style, width) {
    poly(ctx, [project(c, a[0], a[1], a[2], w, h), project(c, b[0], b[1], b[2], w, h)], style, width, false);
  }
  function dot(ctx, p, r, color) {
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fillStyle = color; ctx.fill();
  }
  function glowDot(ctx, p, r, color, alpha) {
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha == null ? 0.5 : alpha;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p[0], p[1], r * 4, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    dot(ctx, p, r, color);
  }
  function label(ctx, p, text, color, size, align) {
    ctx.font = `${size || 10}px ui-monospace, Menlo, monospace`;
    ctx.fillStyle = color || C.dim;
    ctx.textAlign = align || "center";
    ctx.fillText(text, p[0], p[1]);
  }

  /* dashed/animated arrow along a 3D polyline */
  function arrowPath(ctx, c, pts, w, h, color, t, speed) {
    const P = pts.map((p) => project(c, p[0], p[1], p[2], w, h));
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.lineDashOffset = -((t * (speed || 40)) % 14);
    poly(ctx, P, color, 1.6, false);
    ctx.restore();
    // comet (wrapped into [0,1) so a negative t cannot produce a negative index)
    if (P.length < 2) return;
    const k = (((t * 0.35) % 1) + 1) % 1;
    const idx = Math.max(0, Math.min(P.length - 2, Math.floor(k * (P.length - 1))));
    const f = k * (P.length - 1) - idx;
    const x = P[idx][0] + (P[idx + 1][0] - P[idx][0]) * f;
    const y = P[idx][1] + (P[idx + 1][1] - P[idx][1]) * f;
    glowDot(ctx, [x, y], 2.6, color, 0.55);
  }

  function floorGrid(ctx, c, w, h, t) {
    const N = 14, S = 1300;
    for (let i = -N; i <= N; i++) {
      const x = (i / N) * S;
      const zA = -S, zB = S;
      const a = project(c, x, 420, zA, w, h), b = project(c, x, 420, zB, w, h);
      ctx.globalAlpha = 0.16 + 0.06 * Math.sin((i + t * 0.6) * 0.5);
      poly(ctx, [a, b], C.cyan, 1.3, false);
    }
    for (let i = -6; i <= 10; i++) {
      const z = (i / 10) * S;
      const a = project(c, -S, 420, z, w, h), b = project(c, S, 420, z, w, h);
      ctx.globalAlpha = 0.13 + 0.06 * Math.sin((i - t * 0.9) * 0.4);
      poly(ctx, [a, b], C.cyan, 1.3, false);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- scenes ---------- */
  const scenes = {};

  scenes.radar = (ctx, w, h, t) => {
    const cx = w * 0.62, cy = h * 0.40, R = Math.min(w, h) * 0.34;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath(); ctx.arc(cx, cy, (R * i) / 4, 0, TAU);
      ctx.strokeStyle = `rgba(88,224,255,${0.18 + i * 0.04})`; ctx.lineWidth = 1.4; ctx.stroke();
    }
    ctx.strokeStyle = "rgba(88,224,255,.16)";
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

    const a = (t * 0.9) % TAU;
    const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    grad.addColorStop(0, "rgba(110,242,176,.55)"); grad.addColorStop(1, "rgba(110,242,176,0)");
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a - 0.35, a); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = "rgba(110,242,176,.75)"; ctx.lineWidth = 1.5; ctx.stroke();

    const blips = [[0.3, 0.55], [0.75, 0.2], [0.5, 0.85], [0.15, 0.3], [0.65, 0.7]];
    blips.forEach((b, i) => {
      const ang = b[0] * TAU + i, rad = b[1] * R;
      const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
      const phase = (a - ang + TAU) % TAU;
      const alpha = Math.max(0, 1 - phase / 2.2);
      if (alpha > 0.05) glowDot(ctx, [x, y], 2.2, i === 2 ? C.amber : C.green, alpha * 0.8);
    });
    label(ctx, [cx, cy + R + 26], "SCANNING · OCT 2026", "rgba(88,224,255,.5)", 10);
  };

  scenes.timeline = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.18, dist: 1150, yaw: 0.35 });
    floorGrid(ctx, c, w, h, t);
    const marks = o.marks || ["A", "B", "C", "D"];
    const n = marks.length, span = 1400;
    for (let i = 0; i < n; i++) {
      const x = -span / 2 + (span * i) / (n - 1);
      const z = 0;
      const base = project(c, x, 220, z, w, h);
      const top = project(c, x, -120, z, w, h);
      poly(ctx, [base, top], "rgba(88,224,255,.35)", 1.5, false);
      glowDot(ctx, base, 3, C.cyan, 0.4);
      label(ctx, [top[0], top[1] - 10], marks[i], C.ink, 11);
    }
    // rail
    arrowPath(ctx, c, [[-span / 2, 220, 0], [span / 2, 220, 0]], w, h, C.amber, t, 55);
    // traveling marker
    const k = (t * 0.16) % 1;
    const x = -span / 2 + span * k;
    const p = project(c, x, 210, 0, w, h);
    glowDot(ctx, p, 5, C.red, 0.75);
    label(ctx, [p[0], p[1] - 18], "NOW", C.red, 10);
  };

  scenes.grid = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.55, dist: 850, spin: true });
    const cols = o.cols || 9, rows = o.rows || 5, gap = 190, size = 76;
    const hot = new Set(o.hot || []);
    const ox = -((cols - 1) * gap) / 2, oz = -((rows - 1) * gap) / 2;
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) {
        const idx = r * cols + k;
        const x = ox + k * gap, z = oz + r * gap;
        const isHot = hot.has(idx);
        const pulse = isHot ? 0.5 + 0.5 * Math.sin(t * 2.4 + idx) : 0;
        const hgt = isHot ? 90 + pulse * 50 : 34;
        const p0 = project(c, x, 260, z, w, h);
        const p1 = project(c, x, 260 - hgt, z, w, h);
        poly(ctx, [p0, p1], isHot ? `rgba(255,91,87,${0.4 + pulse * 0.5})` : "rgba(88,224,255,.42)", isHot ? 3 : 1.7, false);
        poly(ctx, [p1, [p1[0] + 12 * p1[2], p1[1] - 6 * p1[2]]],
             isHot ? "rgba(255,91,87,.6)" : "rgba(88,224,255,.3)", 1, false);
        if (isHot) {
          glowDot(ctx, p1, 2.6, C.red, 0.5 + pulse * 0.4);
          // inbound arrow
          if (pulse > 0.55) {
            ctx.save(); ctx.globalAlpha = (pulse - 0.55) * 1.6;
            const src = project(c, x, -160, z + 300, w, h);
            arrowPath(ctx, c, [[x, -160, z + 320], [x, 250 - hgt, z]], w, h, C.red, t, 70);
            ctx.restore();
            void src;
          }
        } else {
          dot(ctx, p1, 1.2, "rgba(88,224,255,.5)");
        }
      }
    }
  };

  scenes.fanout = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.22, dist: 1050, yaw: 0.25 });
    const hub = [0, 120, -260];
    const hubP = project(c, hub[0], hub[1], hub[2], w, h);
    glowDot(ctx, hubP, 7, C.amber, 0.6);
    label(ctx, [hubP[0], hubP[1] - 26], "CUSTOMER DB", C.amber, 10);
    const n = o.nodes || 14, R = 520;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + 0.2;
      const x = Math.cos(a) * R, z = Math.sin(a) * R + 200, y = 120 - Math.abs(Math.sin(a)) * 40;
      const p = project(c, x, y, z, w, h);
      const k = (t * 0.5 + i * 0.13) % 1;
      if (k < 0.6) {
        const ix = hub[0] + (x - hub[0]) * (k / 0.6);
        const iz = hub[2] + (z - hub[2]) * (k / 0.6);
        const ip = project(c, ix, hub[1], iz, w, h);
        glowDot(ctx, ip, 2.2, C.cyan, 0.5);
      }
      poly(ctx, [hubP, p], "rgba(88,224,255,.16)", 1, false);
      dot(ctx, p, 2.4, "rgba(230,238,246,.6)");
    }
  };

  scenes.keys = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.1, dist: 900, yaw: 0.15 });
    const n = o.count || 8, weak = o.weakIndex == null ? 3 : o.weakIndex;
    for (let i = 0; i < n; i++) {
      const a = -0.9 + (i / (n - 1)) * 1.8;
      const x = Math.sin(a) * 620, z = Math.cos(a) * 160, y = 60;
      const p = project(c, x, y, z, w, h);
      const s = 26 * p[2] + 10;
      const isWeak = i === weak;
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.rotate(a * 0.22);
      ctx.strokeStyle = isWeak ? C.red : "rgba(88,224,255,.6)";
      ctx.lineWidth = isWeak ? 2.2 : 1.2;
      ctx.strokeRect(-s * 0.7, -s, s * 1.4, s * 2);
      ctx.beginPath(); ctx.arc(0, -s * 0.72, s * 0.22, Math.PI, 0);
      ctx.stroke();
      if (isWeak) {
        ctx.strokeStyle = `rgba(255,91,87,${0.6 + 0.4 * Math.sin(t * 5)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-s * 0.5, -s * 0.6); ctx.lineTo(-s * 0.05, -s * 0.1);
        ctx.lineTo(-s * 0.35, s * 0.35); ctx.lineTo(s * 0.15, s * 0.75);
        ctx.stroke();
        ctx.font = `${Math.max(20, s * 1.1)}px ui-monospace, monospace`;
        ctx.fillStyle = C.red; ctx.textAlign = "center";
        ctx.fillText("4", 0, s * 0.55);
      }
      ctx.restore();
      label(ctx, [p[0], p[1] + s + 16], isWeak ? "WEAK" : `CA-${i + 1}`, isWeak ? C.red : C.dim, 9);
    }
    // broken trust line
    const a0 = project(c, -520, -150, 0, w, h), a1 = project(c, 520, -150, 0, w, h);
    poly(ctx, [a0, a1], `rgba(255,91,87,${0.25 + 0.25 * Math.sin(t * 3)})`, 1.4, false);
  };

  scenes.ladder = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.26, dist: 1000, yaw: -0.28 });
    const steps = o.steps || ["v1", "v2", "v3"];
    const hot = o.hot == null ? 0 : o.hot;
    const n = steps.length, gap = o.wide ? 240 : 210;
    for (let i = 0; i < n; i++) {
      const x = -((n - 1) * gap) / 2 + i * gap;
      const y = 240 - i * 62;
      const isHot = i === hot;
      const a = project(c, x - 108, y, 0, w, h), b = project(c, x + 108, y, 0, w, h);
      const a2 = project(c, x - 108, y - 30, 0, w, h), b2 = project(c, x + 108, y - 30, 0, w, h);
      ctx.globalAlpha = isHot ? 1 : 0.55;
      poly(ctx, [a, b, b2, a2], isHot ? C.amber : "rgba(88,224,255,.62)", isHot ? 2.8 : 1.6, true);
      ctx.globalAlpha = 1;
      label(ctx, [ (a[0]+b[0])/2, a[1] + 16 ], steps[i], isHot ? C.amber : C.dim, o.wide ? 9 : 10);
      if (isHot) glowDot(ctx, [(a2[0]+b2[0])/2, a2[1] - 8], 2.4, C.amber, 0.5 + 0.3 * Math.sin(t * 3));
    }
    // arrows marching up the stack
    const pts = [];
    for (let i = 0; i < n; i++) pts.push([-((n - 1) * gap) / 2 + i * gap, 210 - i * 62, 0]);
    arrowPath(ctx, c, pts, w, h, C.green, t, 60);
  };

  scenes.matrix = (ctx, w, h, t, o) => {
    const cols = o.cols || 11, rows = o.rows || 5, size = 34, gap = 12;
    const total = cols * rows;
    const ox = w / 2 - ((cols) * (size + gap)) / 2, oy = h * 0.30;
    const fill = Math.min(1, t / 2.2);
    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / cols), k = i % cols;
      const x = ox + k * (size + gap), y = oy + r * (size + gap);
      const on = i / total < fill;
      const isLast = i === total - 1;
      ctx.fillStyle = on ? (o.swap && isLast ? "rgba(110,242,176,.85)" : "rgba(255,181,69,.55)") : "rgba(120,150,170,.10)";
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = on ? "rgba(230,238,246,.35)" : "rgba(230,238,246,.12)"; ctx.lineWidth = on ? 1.2 : 1;
      ctx.strokeRect(x + 0.5, y + 0.5, size, size);
    }
    if (o.swap) {
      const k = Math.min(1, Math.max(0, (t - 1.4) / 1.6));
      if (k > 0) {
        const y = oy + rows * (size + gap) + 26;
        ctx.globalAlpha = k;
        ctx.font = "12px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,91,87,.85)";
        ctx.fillText("AFFECTED  21.0.12.1", w / 2 - 74, y);
        ctx.fillStyle = "rgba(110,242,176,.9)";
        ctx.fillText("FIXED  21.0.13", w / 2 + 92, y);
        ctx.strokeStyle = "rgba(230,238,246,.5)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(w / 2 - 8, y - 4); ctx.lineTo(w / 2 + 22, y - 4);
        ctx.lineTo(w / 2 + 15, y - 8); ctx.moveTo(w / 2 + 22, y - 4); ctx.lineTo(w / 2 + 15, y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  };

  scenes.chain = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.16, dist: 1000, yaw: 0.1 });
    const nodes = o.nodes || ["A", "B", "C", "D", "E"];
    const n = nodes.length, gap = 260;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const x = -((n - 1) * gap) / 2 + i * gap;
      const y = 120 + (i % 2 === 0 ? -60 : 60);
      pts.push([x, y, 0]);
    }
    // underlay so the path reads at a glance, then the animated dashes on top
    const P = pts.map((p) => project(c, p[0], p[1], p[2], w, h));
    poly(ctx, P, "rgba(255,91,87,.22)", 7, false);
    poly(ctx, P, "rgba(255,91,87,.45)", 2.6, false);
    arrowPath(ctx, c, pts, w, h, C.red, t, 65);
    pts.forEach((p, i) => {
      const q = project(c, p[0], p[1], p[2], w, h);
      const active = (t * 0.6) % n > i - 0.5;
      const col = i === n - 1 ? C.amber : C.cyan;
      ctx.beginPath(); ctx.arc(q[0], q[1], 13, 0, TAU);
      ctx.strokeStyle = col; ctx.globalAlpha = active ? 0.55 : 0.25; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.globalAlpha = 1;
      glowDot(ctx, q, active ? 6 : 3.6, col, active ? 0.8 : 0.4);
      label(ctx, [q[0], q[1] - 24], nodes[i], col, 11);
    });
    if (o.deadline) {
      const q = pts[n - 1];
      const p = project(c, q[0], q[1], q[2], w, h);
      const r = 46 + Math.sin(t * 2) * 4;
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU);
      ctx.setLineDash([4, 6]); ctx.strokeStyle = C.red; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, [p[0], p[1] + r + 16], "DUE 10-23", C.red, 10);
    }
  };

  scenes.clock = (ctx, w, h, t, o) => {
    const cx = w / 2, cy = h * 0.42, R = Math.min(w, h) * 0.30;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU);
    ctx.strokeStyle = "rgba(88,224,255,.34)"; ctx.lineWidth = 1.8; ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      const r0 = R - (i % 6 === 0 ? 14 : 7);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = i % 6 === 0 ? "rgba(230,238,246,.55)" : "rgba(88,224,255,.3)";
      ctx.stroke();
    }
    const marks = o.marks || [];
    marks.forEach((m, i) => {
      const a = -Math.PI / 2 + m[1] * TAU;
      const x = cx + Math.cos(a) * (R - 4), y = cy + Math.sin(a) * (R - 4);
      glowDot(ctx, [x, y], 3.4, i === 0 ? C.red : C.amber, 0.6);
      label(ctx, [cx + Math.cos(a) * (R + 26), cy + Math.sin(a) * (R + 26)], m[0], C.ink, 10);
    });
    if (marks.length >= 2) {
      const a0 = -Math.PI / 2 + marks[0][1] * TAU, a1 = -Math.PI / 2 + marks[1][1] * TAU;
      ctx.beginPath(); ctx.arc(cx, cy, R - 12, a0, a1);
      ctx.strokeStyle = "rgba(255,91,87,.65)"; ctx.lineWidth = 5; ctx.stroke();
      label(ctx, [cx, cy + 6], "6h17m", C.red, 16);
      label(ctx, [cx, cy + 24], "BEFORE FIX", "rgba(255,91,87,.6)", 9);
    }
    const hand = -Math.PI / 2 + ((t * 0.12) % 1) * TAU;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hand) * (R - 18), cy + Math.sin(hand) * (R - 18));
    ctx.strokeStyle = "rgba(110,242,176,.7)"; ctx.lineWidth = 1.6; ctx.stroke();
  };

  scenes.packages = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.24, dist: 980, yaw: 0.3 });
    const items = o.items || [];
    ctx.beginPath();
    const ring = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * TAU;
      ring.push(project(c, Math.cos(a) * 460, 60, Math.sin(a) * 460, w, h));
    }
    poly(ctx, ring, "rgba(88,224,255,.18)", 1.2, true);
    const core = [0, 60, 0];
    const cp = project(c, core[0], core[1], core[2], w, h);
    glowDot(ctx, cp, 8, C.amber, 0.55);
    label(ctx, [cp[0], cp[1] - 30], "CREDENTIALS", C.amber, 10);
    items.forEach((name, i) => {
      const a = (i / items.length) * TAU + t * 0.06;
      const R = 460;
      const x = Math.cos(a) * R, z = Math.sin(a) * R, y = 60 - Math.abs(Math.sin(a)) * 70;
      const p = project(c, x, y, z, w, h);
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = "rgba(88,224,255,.7)"; ctx.lineWidth = 1.6;
      const s = 24 * p[2] + 14;
      ctx.strokeRect(-s, -s * 0.7, s * 2, s * 1.4);
      ctx.restore();
      label(ctx, [p[0], p[1] + 22], name, C.dim, 9);
      const k = (t * 0.4 + i * 0.17) % 1;
      const ix = x * (1 - k), iz = z * (1 - k), iy = y + (core[1] - y) * k;
      const ip = project(c, ix, iy, iz, w, h);
      glowDot(ctx, ip, 2, C.red, 0.55);
    });
  };

  scenes.pillars = (ctx, w, h, t) => {
    const c = cam(t, { pitch: -0.2, dist: 1000, yaw: 0.2 });
    floorGrid(ctx, c, w, h, t);
    const xs = [-420, 0, 420];
    xs.forEach((x, i) => {
      const base = project(c, x, 300, 0, w, h);
      const top = project(c, x, -140, 0, w, h);
      poly(ctx, [base, top], "rgba(88,224,255,.5)", 2, false);
      const k = (t * 0.5 + i * 0.2) % 1;
      const y = 300 - 440 * k;
      const p = project(c, x, y, 0, w, h);
      glowDot(ctx, p, 2.6, C.amber, 0.6);
      label(ctx, [base[0], base[1] + 18], ["RAILWAY", "ZEABUR", "OPENCODE"][i], C.dim, 9);
    });
    const bar0 = project(c, -520, -210, 0, w, h), bar1 = project(c, 520, -210, 0, w, h);
    poly(ctx, [bar0, bar1], C.amber, 2, false);
    label(ctx, [(bar0[0] + bar1[0]) / 2, bar0[1] - 12], "AI PROVIDER KEYS", C.amber, 11);
  };

  scenes.bars = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.30, dist: 760, yaw: -0.22 });
    floorGrid(ctx, c, w, h, t);
    const values = o.values || [10, 1], labels = o.labels || ["A", "B"];
    const max = Math.max.apply(null, values);
    const baseY = 320;
    values.forEach((v, i) => {
      const x = -220 + i * 440;
      const hgt = (v / max) * 520 * Math.min(1, t / 1.2);
      const a = project(c, x - 92, baseY, 0, w, h);
      const b = project(c, x + 92, baseY, 0, w, h);
      const c2 = project(c, x + 92, baseY - hgt, 0, w, h);
      const d = project(c, x - 92, baseY - hgt, 0, w, h);
      const col = i === 0 ? "rgba(255,181,69,.35)" : "rgba(255,91,87,.7)";
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(d[0], d[1]);
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      poly(ctx, [a, b, c2, d], i === 0 ? C.amber : C.red, 2.6, true);
      label(ctx, [d[0], d[1] - 14], String(v), i === 0 ? C.amber : C.red, 16);
      label(ctx, [a[0], a[1] + 18], labels[i], C.dim, 10);
    });
    label(ctx, [w / 2, h * 0.16], "14 DAYS OF CRITICALS", "rgba(88,224,255,.5)", 10);
  };

  scenes.storm = (ctx, w, h, t) => {
    const N = 140, cx = w / 2, cy = h * 0.44;
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.34);
    core.addColorStop(0, "rgba(255,181,69,.10)");
    core.addColorStop(1, "rgba(255,181,69,0)");
    ctx.fillStyle = core; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < N; i++) {
      const a = (i * 2.399) % TAU, r = 60 + ((i * 37) % 420);
      const x = cx + Math.cos(a + t * 0.05) * r;
      const y = cy + Math.sin(a + t * 0.04) * r * 0.6;
      const s = 1.6 + ((i * 13) % 5) * 0.7;
      dot(ctx, [x, y], s, i % 7 === 0 ? C.amber : "rgba(170,210,235,.7)");
      if (i % 9 === 0) {
        const j = (i + 11) % N;
        const a2 = (j * 2.399) % TAU, r2 = 60 + ((j * 37) % 420);
        const x2 = cx + Math.cos(a2 + t * 0.05) * r2, y2 = cy + Math.sin(a2 + t * 0.04) * r2 * 0.6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(88,224,255,.18)"; ctx.lineWidth = 1.2; ctx.stroke();
      }
    }
    label(ctx, [cx, h * 0.82], "THE CODE WE TRUST", "rgba(255,181,69,.55)", 11);
  };

  scenes.leak = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.12, dist: 980, yaw: 0.18 });
    const ids = o.ids || ["33549", "33774", "33367", "34068", "34076", "32005"];
    const top = -300, gap = 120;
    // two rails: private security list (left) and public LKML (right)
    const railA = [[-430, top, 0], [-430, top + gap * (ids.length - 1) + 120, 0]];
    const railB = [[430, top, 0], [430, top + gap * (ids.length - 1) + 120, 0]];
    poly(ctx, railA.map((p) => project(c, p[0], p[1], p[2], w, h)), "rgba(88,224,255,.18)", 9, false);
    poly(ctx, railA.map((p) => project(c, p[0], p[1], p[2], w, h)), "rgba(88,224,255,.70)", 3, false);
    poly(ctx, railB.map((p) => project(c, p[0], p[1], p[2], w, h)), "rgba(255,91,87,.16)", 9, false);
    poly(ctx, railB.map((p) => project(c, p[0], p[1], p[2], w, h)), "rgba(255,91,87,.80)", 3, false);
    const la = project(c, railA[0][0], top - 60, 0, w, h);
    const lb = project(c, railB[0][0], top - 60, 0, w, h);
    label(ctx, [la[0], la[1] - 16], "SECURITY (PRIVATE)", C.cyan, 12);
    label(ctx, [lb[0], lb[1] - 16], "LKML (PUBLIC)", C.red, 12);

    ids.forEach((id, i) => {
      const y = top + i * gap;
      const src = project(c, -430, y, 0, w, h);
      const dst = project(c, 430, y, 0, w, h);
      // per-row guide so the crossing lines read as a grid
      poly(ctx, [project(c, -430, y, 0, w, h), project(c, 430, y, 0, w, h)], "rgba(150,175,195,.10)", 1, false);
      glowDot(ctx, src, 4, C.cyan, 0.45);
      const k = ((t * 0.42 + i * 0.13) % 1);
      const x = -430 + 860 * k;
      const p = project(c, x, y - Math.sin(k * Math.PI) * 60, 0, w, h);
      glowDot(ctx, p, 4, k > 0.75 ? C.red : C.amber, 0.75);
      glowDot(ctx, dst, 3.6 + (k > 0.9 ? 2.2 : 0), C.red, 0.6);
      label(ctx, [dst[0] + 46 * p[2], dst[1] + 5], `ZDI-CAN-${id}`, "rgba(255,91,87,.95)", 11, "left");
    });
    label(ctx, [w / 2, h * 0.84], "EMBARGO LOST", "rgba(255,91,87,.7)", 12);
  };

  scenes.dns = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.30, dist: 980, yaw: 0.12 });
    const cx = w / 2, cy = h / 2;
    // a resolver ring: one node, many queries
    const core = project(c, 0, 120, 0, w, h);
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(core[0], core[1], 46 * i, 0, TAU);
      ctx.strokeStyle = `rgba(88,224,255,${0.18 - i * 0.03})`;
      ctx.lineWidth = 1.4; ctx.stroke();
    }
    glowDot(ctx, core, 9, C.amber, 0.55);
    label(ctx, [core[0], core[1] + 4], "named", C.ink, 12);
    label(ctx, [core[0], core[1] + 62], "GSS-TSIG handler", "rgba(255,181,69,.7)", 10);

    const N = (o.clients || 7);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + 0.4;
      const R = 360;
      const x = Math.cos(a) * R, z = Math.sin(a) * R, y = 120 - Math.abs(Math.sin(a)) * 60;
      const p = project(c, x, y, z, w, h);
      dot(ctx, p, 3, "rgba(150,200,230,.6)");
      // signed query travelling in
      const k = ((t * 0.5 + i * 0.14) % 1);
      const qx = x * (1 - k), qz = z * (1 - k), qy = y + (120 - y) * k;
      const q = project(c, qx, qy, qz, w, h);
      glowDot(ctx, q, 2.4, C.cyan, 0.5);
      // the replay: same datagram, second pass, red
      const k2 = ((t * 0.5 + i * 0.14 + 0.45) % 1);
      if (k2 < 0.75) {
        const rx = x * (1 - k2), rz = z * (1 - k2), ry = y + (120 - y) * k2;
        const rp = project(c, rx, ry, rz, w, h);
        glowDot(ctx, rp, 3.2, C.red, 0.65);
      }
    }
    // memory-corruption flash around the core
    const flash = Math.max(0, Math.sin(t * 1.6)) ** 6;
    if (flash > 0.02) {
      const g = ctx.createRadialGradient(core[0], core[1], 0, core[0], core[1], 90);
      g.addColorStop(0, `rgba(255,91,87,${0.45 * flash})`);
      g.addColorStop(1, "rgba(255,91,87,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(core[0], core[1], 90, 0, TAU); ctx.fill();
    }
    label(ctx, [cx, h * 0.84], "REPLAY → CORRUPTION", "rgba(255,91,87,.7)", 11);
    void o;
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
    setTilt(yaw, pitch) { TILT.yaw = yaw; TILT.pitch = pitch; },
    getTilt() { return { yaw: TILT.yaw, pitch: TILT.pitch }; },
    draw(visual, ctx, w, h, t, reduced, ox, oy) {
      VIEW.zoom = Math.min(w, h) < 640 ? 0.56 : 0.63;
      const fn = scenes[visual && visual.type] || scenes.radar;
      ctx.clearRect(0, 0, w, h);
      // backdrop wash, full frame
      const g = ctx.createRadialGradient(w * 0.58, h * 0.40, 0, w * 0.58, h * 0.40, Math.max(w, h) * 0.72);
      g.addColorStop(0, "rgba(16,30,44,.70)");
      g.addColorStop(1, "rgba(4,7,11,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // keep the diagram clear of the text panel (bottom-left)
      const type = (visual && visual.type) || "radar";
      const tilted = Math.abs(TILT.yaw) + Math.abs(TILT.pitch) > 0.0005;
      ctx.save();
      ctx.translate(ox || 0, oy || 0);
      if (SCREEN_SPACE.has(type) && tilted) {
        // fake perspective: skew + slight rotate + scale, anchored at the centre
        ctx.translate(w / 2, h / 2);
        ctx.transform(1, TILT.yaw * 0.12, -TILT.yaw * 0.10, 1, 0, 0);
        ctx.rotate(TILT.yaw * 0.05);
        ctx.scale(1 + TILT.pitch * 0.03, 1 - TILT.pitch * 0.03);
        ctx.translate(-w / 2, -h / 2);
      }
      fn(ctx, w, h, reduced ? 1.2 : t, visual || {});
      ctx.restore();
      frame(ctx, w, h, t);
    }
  };
})();
