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
  const SCREEN_SPACE = new Set(["radar", "clock", "matrix", "storm", "channels", "stack",
    "before", "funnel", "ledger", "checklist"]);

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


  /* ---------- postscript: kernel core, disclosure gap, package deck ---------- */

  /* Infinity Core: a hex "kernel core" with six satellite subsystems, each of
     which periodically strikes the core (the UAF), and a marked exit to root.
     Reproduced from docs/20 — six CVEs, five with public root PoCs. */
  scenes.core = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.20, dist: 1080, spin: true, yaw: 0.22 });
    const parts = o.parts || ["TIMER", "SIGNAL", "MM", "FUTEX", "SCHED", "SLAB"];
    // a thin orbit instead of a floor: the horizon line competes with the core
    ctx.save();
    ctx.setLineDash([3, 7]);
    for (let k = 0; k < 2; k++) {
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * TAU;
        pts.push(project(c, Math.cos(a) * (300 + k * 120), Math.sin(a) * (170 + k * 70), k ? 90 : -90, w, h));
      }
      poly(ctx, pts, "rgba(88,224,255,.16)", 1.1, true);
    }
    ctx.restore();
    const R = 152, zA = -72, zB = 72;

    const hexAt = (r, z) => Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * TAU + Math.PI / 6;
      return project(c, Math.cos(a) * r, Math.sin(a) * r * 0.62, z, w, h);
    });
    const inner = hexAt(R * 0.62, 0);
    poly(ctx, hexAt(R, zA), "rgba(88,224,255,.20)", 1.3, true);
    for (let i = 0; i < 6; i++) {
      const a = hexAt(R, zA)[i], b = hexAt(R, zB)[i];
      poly(ctx, [a, b], "rgba(88,224,255,.34)", 1.2, false);
    }

    let strikes = 0;
    const centre = project(c, 0, 0, 0, w, h);
    parts.forEach((name, i) => {
      const ang = (i / 6) * TAU - Math.PI / 2;
      const p3 = [Math.cos(ang) * 372, Math.sin(ang) * 196, i % 2 ? 46 : -46];
      const q = project(c, p3[0], p3[1], p3[2], w, h);
      // each satellite fires once per loop; the last one is the panic-only SLAB bug
      const k = (((t * 0.30 + i * 0.145) % 1) + 1) % 1;
      const s2 = k < 0.3 ? Math.sin((k / 0.3) * Math.PI) : 0;
      if (s2 > 0.02) {
        strikes += s2;
        poly(ctx, [q, centre], `rgba(255,91,87,${0.62 * s2})`, 2.4, false);
        glowDot(ctx, [q[0] + (centre[0] - q[0]) * 0.5, q[1] + (centre[1] - q[1]) * 0.5], 2.4, C.red, 0.55 * s2);
      }
      const panic = name === "SLAB";
      ctx.beginPath(); ctx.arc(q[0], q[1], 10, 0, TAU);
      ctx.strokeStyle = panic ? C.dim : C.cyan; ctx.lineWidth = 1.3; ctx.stroke();
      glowDot(ctx, q, panic ? 2.6 : 3.4 + s2 * 2, panic ? C.dim : C.cyan, 0.35 + s2 * 0.5);
      label(ctx, [q[0], q[1] + (p3[1] > 0 ? 24 : -18)], name, panic ? C.dim : C.cyan, 9.5);
    });

    const pulse = Math.min(1, strikes / 2);
    poly(ctx, hexAt(R, zB), `rgba(255,91,87,${0.35 + pulse * 0.5})`, 2, true);
    poly(ctx, inner, `rgba(255,181,69,${0.3 + pulse * 0.55})`, 1.6, true);
    const gr = ctx.createRadialGradient(centre[0], centre[1], 0, centre[0], centre[1], 96);
    gr.addColorStop(0, `rgba(255,91,87,${0.10 + pulse * 0.22})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(centre[0], centre[1], 120, 0, TAU); ctx.fill();
    label(ctx, [centre[0], centre[1] + 4], "KERNEL", C.ink, 11);

    // exit to root: lights up once the strikes land
    const exitA = project(c, -640, 300, 0, w, h), exitB = project(c, -240, 128, 0, w, h);
    ctx.save();
    ctx.setLineDash([6, 7]);
    ctx.lineDashOffset = -((t * 34) % 13);
    poly(ctx, [exitA, exitB], `rgba(255,181,69,${0.25 + pulse * 0.55})`, 1.6, false);
    ctx.restore();
    label(ctx, [exitA[0], exitA[1] + 20], "HOST ROOT", C.amber, 9.5);
    label(ctx, [w / 2, h * 0.13], "5 OF 6 ESCAPE A CONTAINER", "rgba(255,181,69,.55)", 9.5);
    if (o.fixed) label(ctx, [w / 2, h * 0.13 + 16], o.fixed, "rgba(110,242,176,.75)", 9.5);
  };

  /* The blind spot: three sweep columns (published / modified / feeds) with a
     falling marker that passes between them, and a fourth column — the
     disclosure channel — that catches it. See docs/21 §3. */
  scenes.channels = (ctx, w, h, t, o) => {
    const m = Math.max(18, Math.min(w, h) * 0.05);
    const labels = o.labels || ["PUBLISHED", "MODIFIED", "FEEDS", "OSS-SEC"];
    const top = h * 0.16, bot = h * 0.80;
    const span = w - m * 2;
    const cw = Math.min(118, span / 5.4);
    const xs = labels.map((_, i) => m + span * (0.18 + i * 0.215));

    labels.forEach((name, i) => {
      const x = xs[i], isGap = i === labels.length - 1;
      ctx.save();
      ctx.globalAlpha = isGap ? 0.9 : 0.55;
      ctx.strokeStyle = isGap ? C.green : C.cyan;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x - cw / 2, top, cw, bot - top);
      ctx.restore();
      label(ctx, [x, top - 12], name, isGap ? C.green : C.dim, 9);

      // records drifting down inside the column
      for (let k = 0; k < 6; k++) {
        const y = top + ((k * 109 + t * 22) % (bot - top));
        const wd = cw * (0.26 + ((k * 37) % 42) / 100);
        ctx.globalAlpha = 0.11 + 0.07 * Math.sin((k + t) * 1.3);
        ctx.fillStyle = isGap ? C.green : C.cyan;
        ctx.fillRect(x - wd / 2, y, wd, 2.5);
      }
      ctx.globalAlpha = 1;
      // the scan beam
      const by = top + ((t * 0.42 + i * 0.21) % 1) * (bot - top);
      ctx.globalAlpha = 0.35;
      poly(ctx, [[x - cw / 2, by], [x + cw / 2, by]], isGap ? C.green : C.amber, 1.6, false);
      ctx.globalAlpha = 1;
    });

    // the item that none of the three sweeps can see, caught by the fourth
    const k = ((t * 0.16) % 1);
    const y = top + 12 + k * (bot - top - 40);
    const xa = xs[0] + (xs[1] - xs[0]) / 2, xb = xs[1] + (xs[2] - xs[1]) / 2;
    const x = k < 0.62 ? xa + (xb - xa) * (k / 0.62) : xs[3] + (xb - xs[3]) * ((k - 0.62) / 0.38) * -1 + (xb - xs[3]) * ((k - 0.62) / 0.38);
    const caught = k > 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y - 9); ctx.lineTo(x + 9, y); ctx.lineTo(x, y + 9); ctx.lineTo(x - 9, y);
    ctx.closePath();
    ctx.strokeStyle = caught ? C.green : C.red;
    ctx.lineWidth = 1.6; ctx.stroke();
    glowDot(ctx, [x, y], 2.4, caught ? C.green : C.red, 0.7);
    label(ctx, [x, y - 16], caught ? "CAUGHT" : "INFINITY CORE", caught ? C.green : C.red, 9);

    label(ctx, [xs[1], bot + 18], "MISSED", "rgba(255,91,87,.7)", 9);
    label(ctx, [xs[3], bot + 18], "CAUGHT", "rgba(110,242,176,.8)", 9);
    label(ctx, [w / 2, h * 0.09], "A SWEEP SEES WHAT THE DATABASE DID", "rgba(88,224,255,.5)", 9.5);
    label(ctx, [w / 2, h * 0.09 + 15], "NOT WHAT CHANGED MEANING", "rgba(150,175,195,.65)", 9.5);
  };

  /* The package deck: GitHub advisories published in 24 h, severity on the
     spine, and the two criticals that carry no CVE at all (docs/21 §2.3). */
  scenes.stack = (ctx, w, h, t, o) => {
    const cards = o.cards || [
      { name: "NEXT.JS use cache", sev: "crit", fix: "16.4.1", cve: null },
      { name: "NEXT.JS /_next/image", sev: "crit", fix: "15.5.28", cve: null },
      { name: "DOMPURIFY", sev: "crit", fix: "3.4.17", cve: "3.4.17" },
      { name: "PILLOW", sev: "crit", fix: "13.0.0", cve: "CVE-2026-96639" },
      { name: "GITPYTHON", sev: "high", fix: "3.2.1", cve: "CVE-2026-114145" },
      { name: "STORYBOOK", sev: "high", fix: "8.6.19", cve: "CVE-2026-114126" }
    ];
    const n = cards.length;
    const cw = Math.min(w * 0.42, 306), ch = Math.min(60, h * 0.085);
    const cx = w * 0.54;
    const drift = (t * 16) % (n * (ch + 18));
    for (let pass = 0; pass < 2; pass++) {
      cards.forEach((card, i) => {
        const raw = i * (ch + 18) - drift + pass * n * (ch + 18);
        const y = h * 0.22 + raw * 0.62;
        if (y < -ch || y > h * 1.1) return;
        const depth = 1 - i * 0.055;
        const w2 = cw * depth, h2 = ch * depth;
        const x = cx + i * 14 - (n * 7);
        const alpha = 0.55 + 0.35 * depth;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(10,20,30,.92)";
        ctx.fillRect(x - w2 / 2, y, w2, h2);
        ctx.strokeStyle = card.sev === "crit" ? C.red : C.amber;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x - w2 / 2, y, w2, h2);
        ctx.fillStyle = card.sev === "crit" ? C.red : C.amber;
        ctx.fillRect(x - w2 / 2, y, 4, h2);
        ctx.restore();
        label(ctx, [x - w2 / 2 + 12, y + h2 * 0.44], card.name, C.ink, 9.5, "left");
        label(ctx, [x - w2 / 2 + 12, y + h2 * 0.76], "-> " + card.fix, C.green, 9, "left");
        if (!card.cve) {
          const bw = 52;
          ctx.save();
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = C.amber; ctx.lineWidth = 1;
          ctx.strokeRect(x + w2 / 2 - bw - 8, y + h2 * 0.30, bw, 15);
          ctx.restore();
          label(ctx, [x + w2 / 2 - bw / 2 - 8, y + h2 * 0.30 + 11], "NO CVE", C.amber, 8.5);
        } else {
          label(ctx, [x + w2 / 2 - 10, y + h2 * 0.30 + 11], card.cve, "rgba(150,175,195,.6)", 7.5, "right");
        }
      });
    }
    label(ctx, [w * 0.5, h * 0.13], "58 ADVISORIES / 24 H", "rgba(88,224,255,.5)", 9.5);
  };


  /* ---------- 10-23 postscript, second set (docs/22) ---------- */

  /* Node2Shell: two paths reach the decoder Node.js bundles, one path never
     does, and the marker file appears inside the process. 24.22.0 ran it;
     24.22.1 rejects the same bytes. See docs/22 §2. */
  scenes.decode = (ctx, w, h, t, o) => {
    const c = cam(t, { pitch: -0.20, dist: 1120, yaw: 0.14, spin: true });
    const P = (p) => project(c, p[0], p[1], p[2], w, h);
    const inA = [-560, -170, 0], inB = [-560, 60, 0], bare = [-560, 300, 0];
    const join = [-300, -55, 0], core = [0, -55, 0], out = [400, -55, 0];

    [[inA, "fetch()  ·  RESPONSE"], [inB, "express.json() / raw()"]].forEach(([p, name], i) => {
      arrowPath(ctx, c, [p, join], w, h, C.cyan, t + i * 0.5, 52);
      const q = P(p);
      label(ctx, [q[0] - 10, q[1] - 10], name, "rgba(88,224,255,.8)", 9, "right");
    });

    // the bare server: nothing inflates the body, so nothing reaches the decoder
    const qb = P(bare);
    ctx.save();
    ctx.setLineDash([4, 8]);
    poly(ctx, [qb, [qb[0] + 118, qb[1] - 34]], "rgba(150,175,195,.30)", 1.2, false);
    ctx.restore();
    label(ctx, [qb[0] - 10, qb[1] + 4], "bare http.createServer()", "rgba(150,175,195,.55)", 9, "right");
    label(ctx, [qb[0] + 128, qb[1] - 42], "no inflate → nothing reaches it", "rgba(110,242,176,.6)", 8.5, "left");

    arrowPath(ctx, c, [join, core], w, h, C.amber, t, 70);
    arrowPath(ctx, c, [core, out], w, h, C.red, t, 70);

    const hex = (r, z) => Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * TAU + Math.PI / 6;
      return project(c, core[0] + Math.cos(a) * r, core[1] + Math.sin(a) * r * 0.66, z, w, h);
    });
    const beat = 0.5 + 0.5 * Math.sin(t * 3.1);
    poly(ctx, hex(146, -54), "rgba(88,224,255,.20)", 1.3, true);
    for (let i = 0; i < 6; i++) {
      poly(ctx, [hex(146, -54)[i], hex(146, 54)[i]], "rgba(88,224,255,.32)", 1.2, false);
    }
    poly(ctx, hex(146, 54), `rgba(255,91,87,${0.35 + beat * 0.45})`, 2, true);
    const cc = P(core);
    glowDot(ctx, cc, 3.2, C.red, 0.3 + beat * 0.4);
    label(ctx, [cc[0], cc[1] - 2], "BROTLI", C.ink, 10);
    label(ctx, [cc[0], cc[1] + 14], "DECODER", "rgba(230,238,246,.7)", 8.5);
    label(ctx, [cc[0], cc[1] + 46], "c/dec/decode.c", "rgba(150,175,195,.55)", 8);

    // bracket the untrusted side: where the bytes come from, and where they land
    const bt = P([-620, -300, 0]), bb = P([-300, 210, 0]);
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = "rgba(255,181,69,.30)";
    ctx.lineWidth = 1.1;
    ctx.strokeRect(bt[0] - 12, bt[1] - 8, Math.abs(bb[0] - bt[0]) + 24, Math.abs(bb[1] - bt[1]) + 16);
    ctx.restore();
    label(ctx, [bt[0], bt[1] - 16], "UNTRUSTED", "rgba(255,181,69,.55)", 8, "left");

    // the marker file: it is absent until the crafted block lands, then it stays
    const oe = P(out);
    // `?still=1` freezes t at 1.2, so most of the cycle must read as "landed"
    const landed = ((t * 0.30) % 1) > 0.22;
    ctx.save();
    ctx.globalAlpha = landed ? 0.95 : 0.25;
    ctx.strokeStyle = landed ? C.red : "rgba(150,175,195,.4)";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(oe[0] - 26, oe[1] - 18, 52, 36);
    ctx.restore();
    label(ctx, [oe[0], oe[1] + 2], "MARKER", landed ? C.red : "rgba(150,175,195,.45)", 8.5);
    label(ctx, [oe[0], oe[1] + 34], landed ? "CODE RAN" : "NOTHING", landed ? C.red : C.dim, 8.5);

    // byte packets: three per entry, so the arrows read as data, not as decoration
    [[inA, join], [inB, join]].forEach(([a, b], j) => {
      for (let i = 0; i < 3; i++) {
        const k = (((t * 0.5 + i * 0.33 + j * 0.5) % 1) + 1) % 1;
        const p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, 0];
        const q = P(p);
        ctx.save();
        ctx.globalAlpha = 0.45 + 0.45 * Math.sin(k * Math.PI);
        ctx.fillStyle = C.amber;
        ctx.fillRect(q[0] - 2.5, q[1] - 2.5, 5, 5);
        ctx.restore();
      }
    });

    // the fixed build, at the end of the same path
    const qf = P([out[0] + 150, out[1] + 250, 0]);
    ctx.save();
    ctx.setLineDash([4, 7]);
    poly(ctx, [P([out[0], out[1] + 60, 0]), [qf[0], qf[1] - 22]], "rgba(110,242,176,.35)", 1.2, false);
    ctx.restore();
    ctx.strokeStyle = "rgba(110,242,176,.65)"; ctx.lineWidth = 1.3;
    ctx.strokeRect(qf[0] - 54, qf[1] - 16, 108, 32);
    label(ctx, [qf[0], qf[1] + 1], "24.22.1", "rgba(110,242,176,.9)", 9);
    label(ctx, [qf[0], qf[1] + 30], "FORMAT ERROR", "rgba(110,242,176,.6)", 8);

    label(ctx, [w / 2, h * 0.115], "OFFICIAL 24.22.0 · LINUX ARM64", "rgba(88,224,255,.55)", 9.5);
    label(ctx, [w / 2, h * 0.115 + 15], "24.22.1 REJECTS THE SAME BYTES", "rgba(110,242,176,.75)", 9.5);
  };

  /* php2shell: the attempt that predates the advisory, and the 24 h that
     followed it. The axis is time; the point is which side of PATCH the
     first marker sits on. See docs/22 §3. */
  scenes.before = (ctx, w, h, t, o) => {
    const x0 = w * 0.13, x1 = w * 0.90, y = h * 0.58;
    const patch = x0 + (x1 - x0) * 0.70;
    const at = (f) => x0 + (x1 - x0) * f;

    // patched region
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = C.green;
    ctx.fillRect(patch, y - 96, x1 - patch, 192);
    ctx.restore();
    poly(ctx, [[x0, y], [x1, y]], "rgba(150,175,195,.38)", 1.4, false);

    [["10.17", 0.02], ["10.21 02:00", 0.46], ["10.21 14:00", 0.70], ["10.22", 0.92]].forEach(([name, f], i) => {
      const x = at(f);
      poly(ctx, [[x, y - 7], [x, y + 7]], "rgba(230,238,246,.5)", 1.2, false);
      label(ctx, [x, y + 24], name, i === 2 ? C.green : C.dim, 8.5);
    });

    // the patch line, and the fact that something happened to its left
    ctx.save();
    ctx.setLineDash([5, 6]);
    poly(ctx, [[patch, y - 108], [patch, y + 74]], C.green, 1.5, false);
    ctx.restore();
    label(ctx, [patch + 9, y - 116], "PATCH", C.green, 9.5, "left");
    label(ctx, [(x0 + patch) / 2, y - 120], "EMBARGO · ATTEMPTS", "rgba(255,181,69,.55)", 8.5);
    label(ctx, [(patch + x1) / 2, y - 120], "PATCHED · BROAD ATTEMPTS", "rgba(110,242,176,.55)", 8.5);

    // pre-disclosure attempt
    const pre = at(0.055);
    const ring = 16 + 4 * Math.sin(t * 2.4);
    ctx.beginPath(); ctx.arc(pre, y, ring, 0, TAU);
    ctx.strokeStyle = "rgba(255,181,69,.6)"; ctx.lineWidth = 1.4; ctx.stroke();
    glowDot(ctx, [pre, y], 3.6, C.amber, 0.8);
    label(ctx, [pre, y - 34], "ATTEMPT", C.amber, 9);

    // PoC wave before the patch, then broad attempts after it
    for (let i = 0; i < 9; i++) {
      const f = 0.47 + (i / 9) * 0.21;
      const ph = (t * 0.6 + i * 0.17) % 2.4;
      const x = at(f) + ph * 26;
      ctx.globalAlpha = Math.max(0, 1 - ph / 2.4);
      dot(ctx, [x, y - 8 - (i % 3) * 11], 1.8, C.red);
      ctx.globalAlpha = 1;
    }
    for (let i = 0; i < 12; i++) {
      const f = 0.72 + ((i * 0.017) % 0.19);
      const ph = (t * 0.5 + i * 0.21) % 2.0;
      const x = at(f) + ph * 22;
      ctx.globalAlpha = Math.max(0, 1 - ph / 2.0) * 0.8;
      dot(ctx, [x, y + 8 + (i % 4) * 9], 1.6, C.red);
      ctx.globalAlpha = 1;
    }

    // the numbers, above the axis
    label(ctx, [at(0.02), h * 0.215], "482,342", C.amber, 20, "left");
    label(ctx, [at(0.02), h * 0.215 + 18], "REQUESTS / FIRST 24 H", "rgba(150,175,195,.7)", 8.5, "left");
    label(ctx, [at(0.02), h * 0.215 + 42], "21,998 sites · 103 countries", "rgba(150,175,195,.6)", 8.5, "left");
    label(ctx, [at(0.02), h * 0.215 + 58], "122,311 attack sessions", "rgba(150,175,195,.6)", 8.5, "left");

    label(ctx, [x1, h * 0.775], "0 CONFIRMED COMPROMISES", "rgba(110,242,176,.8)", 10, "right");
    label(ctx, [x1, h * 0.775 + 16], "0 SUCCESSFUL MIRAIS", "rgba(110,242,176,.55)", 8.5, "right");
    label(ctx, [at(0.055), y + 52], "4 DAYS BEFORE THE ADVISORY", C.amber, 9.5, "left");
    label(ctx, [w * 0.5, h * 0.105], "ATTEMPTED BEFORE IT WAS DISCLOSED", "rgba(255,181,69,.6)", 9.5);
  };

  /* The severity filter: a CNA 9.9 is a 0-row answer, because the filter
     counts only NVD's own CVSS 3.x score. Measured on the API itself;
     docs/22 §1.2. */
  scenes.funnel = (ctx, w, h, t, o) => {
    const cards = o.cards || [
      { id: "CVE-2026-111497", score: "9.2", kind: "CVSS 4.0" },
      { id: "CVE-2026-114625", score: "9.9", kind: "CNA" },
      { id: "CVE-2026-91637", score: "9.9", kind: "CNA" }
    ];
    const bar = w * 0.575, top = h * 0.30;
    const rowH = Math.min(64, (h * 0.44) / cards.length);

    // the gate
    ctx.save();
    ctx.setLineDash([6, 7]);
    poly(ctx, [[bar, h * 0.20], [bar, h * 0.78]], "rgba(88,224,255,.45)", 1.6, false);
    ctx.restore();
    label(ctx, [bar, h * 0.185], "cvssV3Severity=CRITICAL", "rgba(88,224,255,.75)", 9);

    // the unfiltered lane: 342 CVEs published in the day the filter was read
    const laneY = h * 0.845, laneX0 = w * 0.16, laneX1 = w * 0.84;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 114; i++) {
      const x = laneX0 + (laneX1 - laneX0) * (i / 113);
      const hgt = 4 + ((i * 37) % 13);
      ctx.fillStyle = i % 19 === 0 ? C.amber : "rgba(88,224,255,.45)";
      ctx.fillRect(x, laneY - hgt, 1.4, hgt);
    }
    ctx.restore();
    label(ctx, [laneX0, laneY + 16], "342 PUBLISHED / 24 H · ALL SEVERITIES", "rgba(150,175,195,.6)", 8.5, "left");

    // one card that the filter does accept: NVD's own primary score
    const passPh = (t * 0.30) % 1.6;
    const passX = w * 0.235 + (bar - w * 0.235 + 118) * Math.min(1, passPh / 1.2);
    const passY = top + cards.length * rowH + 14;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "rgba(10,20,30,.92)";
    ctx.fillRect(passX - 168, passY - 15, 168, 30);
    ctx.strokeStyle = C.green; ctx.lineWidth = 1.2;
    ctx.strokeRect(passX - 168, passY - 15, 168, 30);
    ctx.restore();
    label(ctx, [passX - 158, passY + 3], "PRIMARY · 9.9", "rgba(110,242,176,.85)", 8.5, "left");
    if (passPh > 0.9) label(ctx, [bar + 34, passY + 26], "PASS", "rgba(110,242,176,.8)", 9, "left");

    cards.forEach((card, i) => {
      const cyc = (t * 0.42 + i * 0.31) % 1.35;
      const approach = Math.min(1, cyc / 0.7);
      const recoil = cyc > 0.7 ? Math.min(1, (cyc - 0.7) / 0.65) : 0;
      const x = w * 0.235 + (bar - w * 0.235 - 96) * approach - recoil * 74;
      const y = top + i * rowH;
      const hit = cyc > 0.7;
      const cw = 168, ch = 34;

      ctx.save();
      ctx.globalAlpha = 0.35 + approach * 0.6;
      ctx.fillStyle = "rgba(10,20,30,.92)";
      ctx.fillRect(x - cw, y - ch / 2, cw, ch);
      ctx.strokeStyle = hit ? C.red : "rgba(88,224,255,.55)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x - cw, y - ch / 2, cw, ch);
      ctx.restore();

      label(ctx, [x - cw + 10, y - 3], card.id, C.ink, 8.5, "left");
      label(ctx, [x - cw + 10, y + 10], card.kind + " · " + card.score, "rgba(150,175,195,.75)", 8, "left");
      if (hit) label(ctx, [x + 12, y + 3], "0 ROWS", C.red, 10, "left");
      if (hit) glowDot(ctx, [bar, y], 2.6, C.red, 0.5 * (1 - recoil));
    });

    // what does come out
    label(ctx, [bar + 34, h * 0.45], "98", C.amber, 26, "left");
    label(ctx, [bar + 34, h * 0.45 + 18], "ROWS · 104 → 98", "rgba(150,175,195,.7)", 8.5, "left");
    label(ctx, [bar + 34, h * 0.45 + 34], "6 OUT · 0 IN · NOTHING FIXED", "rgba(150,175,195,.55)", 8, "left");
    label(ctx, [bar + 34, h * 0.45 + 56], "PRIMARY SCORES ONLY", "rgba(88,224,255,.65)", 8.5, "left");

    label(ctx, [w * 0.5, h * 0.105], "A CNA 9.9 IS A ZERO-ROW ANSWER", "rgba(255,91,87,.7)", 9.5);
    label(ctx, [w * 0.5, h * 0.85], "THE UNFILTERED SWEEP RETURNED 342 / 24 H", "rgba(150,175,195,.6)", 8.5);
  };

  /* Four incidents the CVE lists did not name: each row arrived through the
     news channel first, then was checked against the vendor's own page.
     docs/22 §4. */
  scenes.ledger = (ctx, w, h, t, o) => {
    const rows = o.rows || [
      { name: "ARISTA VELOCLOUD", figure: "9.9", tag: "EXPLOITED · NEEDS LOGIN", tone: "red" },
      { name: "LINUX KSMBD", figure: "9.0", tag: "NO CVE · NO FIX", tone: "amber" },
      { name: "CAPCOM CAPCOM ID", figure: "11,774,247", tag: "EMAILS · BREACH", tone: "amber" },
      { name: "ONAMAE DESKTOP CLOUD", figure: "26,739", tag: "SERVERS SUSPENDED", tone: "amber" }
    ];
    const left = w * 0.16, right = w * 0.90;
    const top = h * 0.24, step = Math.min(84, (h * 0.48) / rows.length);

    label(ctx, [left, h * 0.145], "NEWS CHANNEL", "rgba(88,224,255,.6)", 9, "left");
    label(ctx, [right, h * 0.145], "PRIMARY SOURCE", "rgba(110,242,176,.65)", 9, "right");

    rows.forEach((row, i) => {
      const ph = Math.min(1, Math.max(0, t * 1.5 - i * 0.18));
      const y = top + i * step;
      const x = left + (1 - ph) * 42;
      ctx.save();
      ctx.globalAlpha = 0.25 + ph * 0.75;
      // connector: the channel on the left, the verification on the right
      poly(ctx, [[left - 8, y], [right, y]], "rgba(150,175,195,.18)", 1, false);
      ctx.restore();

      const tone = row.tone === "red" ? "rgba(255,91,87,.8)"
        : row.tone === "amber" ? "rgba(255,181,69,.75)" : "rgba(150,175,195,.66)";
      // the channel marker: this row arrived as a headline first
      ctx.save();
      ctx.globalAlpha = 0.35 + ph * 0.5;
      ctx.beginPath();
      ctx.moveTo(left - 26, y - 4); ctx.lineTo(left - 21, y + 1);
      ctx.lineTo(left - 26, y + 6); ctx.lineTo(left - 31, y + 1);
      ctx.closePath(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
      label(ctx, [x, y - 4], row.name, "rgba(230,238,246,.88)", 9.5, "left");
      label(ctx, [x, y + 11], row.tag, tone, 8, "left");
      label(ctx, [w * 0.60, y + 2], row.figure, C.amber, 15, "right");

      if (ph > 0.65) {
        const q = [right - 10, y - 4];
        ctx.beginPath();
        ctx.moveTo(q[0] - 6, q[1]); ctx.lineTo(q[0] - 1, q[1] + 5); ctx.lineTo(q[0] + 7, q[1] - 6);
        ctx.strokeStyle = C.green; ctx.lineWidth = 1.8; ctx.stroke();
      }
    });

    label(ctx, [w * 0.5, h * 0.115], "FOUR INCIDENTS, NO CVE LIST", "rgba(88,224,255,.6)", 9.5);
    label(ctx, [w * 0.5, h * 0.82], "FIGURES AS THE VENDORS PUBLISHED THEM", "rgba(150,175,195,.55)", 8.5);
  };


  /* CVE-2026-115560: four conditions make the path; the same four with the
     last one off close it. PHP calls the setup unlikely and still says turn
     the feature off. docs/23. */
  scenes.checklist = (ctx, w, h, t, o) => {
    const conds = o.conditions || [
      "handler = php_binary",
      "ini_set -> php at runtime",
      "before session_start()",
      "upload_progress on"
    ];
    const top = h * 0.30, step = Math.min(72, h * 0.13);
    const colW = Math.min(w * 0.30, 268);
    const leftX = w * 0.25, rightX = w * 0.66;

    const column = (cx, title, colour, mitigated) => {
      label(ctx, [cx, h * 0.225], title, colour, 10);
      conds.forEach((text, i) => {
        const y = top + i * step;
        const isLast = i === conds.length - 1;
        const on = !(mitigated && isLast);
        const reveal = Math.min(1, Math.max(0, t * 1.8 - i * 0.18 - (mitigated ? 0.5 : 0)));
        ctx.save();
        ctx.globalAlpha = 0.20 + reveal * 0.5;
        ctx.fillStyle = "rgba(10,20,30,.9)";
        ctx.fillRect(cx - colW / 2, y - 16, colW, 34);
        ctx.strokeStyle = on ? colour : "rgba(110,242,176,.8)";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(cx - colW / 2, y - 16, colW, 34);
        ctx.restore();
        label(ctx, [cx - colW / 2 + 30, y + 3], String(i + 1), "rgba(150,175,195,.55)", 8.5, "left");
        label(ctx, [cx - colW / 2 + 44, y + 3], text, "rgba(230,238,246,.82)", 9, "left");
        if (reveal > 0.55) {
          const q = [cx + colW / 2 - 20, y];
          if (on) {
            ctx.beginPath();
            ctx.moveTo(q[0] - 5, q[1]); ctx.lineTo(q[0] - 1, q[1] + 4); ctx.lineTo(q[0] + 6, q[1] - 6);
            ctx.strokeStyle = colour; ctx.lineWidth = 1.8; ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(q[0] - 4, q[1] - 4); ctx.lineTo(q[0] + 4, q[1] + 4);
            ctx.moveTo(q[0] + 4, q[1] - 4); ctx.lineTo(q[0] - 4, q[1] + 4);
            ctx.strokeStyle = C.green; ctx.lineWidth = 1.8; ctx.stroke();
          }
        }
      });
    };

    column(leftX, "EXPOSED", "rgba(255,91,87,.85)", false);
    column(rightX, "MITIGATED", "rgba(110,242,176,.85)", true);

    // the mitigation line itself
    const y4 = top + (conds.length - 1) * step;
    label(ctx, [rightX, y4 + 34], "session.upload_progress.enabled = 0", "rgba(110,242,176,.9)", 9);
    label(ctx, [rightX, y4 + 50], "nothing else changes", "rgba(150,175,195,.55)", 8);

    label(ctx, [w / 2, h * 0.115], "FOUR CONDITIONS · ONE LINE", "rgba(88,224,255,.6)", 9.5);
    label(ctx, [w / 2, h * 0.83], "PHP: UNLIKELY IS NOT IMPOSSIBLE", "rgba(255,181,69,.6)", 8.5);
  };

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
