/* rig3d.js — the briefing's 3D engine. Canvas2D only: a perspective camera, a
   depth-sorted painter's queue, shaded solids, billboarded labels.
   Everything a scene draws goes through a rig, so tilting the camera (drag /
   swipe) changes real geometry instead of skewing a flat picture. */
window.RIG3D = (function () {
  "use strict";
  const TAU = Math.PI * 2;

  const C = {
    amber: "#ffb545", cyan: "#58e0ff", red: "#ff5b57", green: "#6ef2b0",
    steel: "#96afc3", ink: "#e6eef6", deep: "#0a1420"
  };

  /* user tilt: yaw/pitch are radians, added on top of each scene's own camera */
  const TILT = { yaw: 0, pitch: 0 };
  /* zoom shrinks the whole world on narrow screens so a 1000-unit diagram fits */
  const VIEW = { zoom: 0.6, s0: 0.6, w: 0, h: 0 };
  const LIGHT = (function () {
    const v = [-0.40, -0.68, -0.62];
    const m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hexCache = {};
  function rgb(hex) {
    let c = hexCache[hex];
    if (!c) {
      const s = hex.replace("#", "");
      c = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
      hexCache[hex] = c;
    }
    return c;
  }
  function a(hex, alpha) {
    const c = rgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha + ")";
  }
  /* multiply a colour toward black (k<1) or white (k>1) — per-face lighting */
  function shade(hex, k) {
    const c = rgb(hex);
    const f = (v) => Math.round(clamp(k <= 1 ? v * k : v + (255 - v) * (k - 1), 0, 255));
    return "rgb(" + f(c[0]) + "," + f(c[1]) + "," + f(c[2]) + ")";
  }

  /* ---------- camera ---------- */
  function setView(w, h) {
    VIEW.w = w; VIEW.h = h;
    VIEW.s0 = w < 640 ? (w * 0.95) / 1000 : 0.60;
    // dist = f/s0 - f, and cam() multiplies its base distance by VIEW.zoom
    VIEW.zoom = (900 / VIEW.s0 - 900) / 1000;
    return VIEW;
  }
  function cam(t, o) {
    o = o || {};
    // The user's tilt is added to the scene's own angle, then clamped: the camera
    // may swing far around a scene, but it never drops level with or below the
    // floor plane, where a whole diagram would collapse into a line.
    return {
      yaw: clamp((o.yaw || 0) + (o.spin ? Math.sin(t * 0.12) * 0.18 : 0) + TILT.yaw, -1.32, 1.32),
      pitch: clamp((o.pitch == null ? -0.30 : o.pitch) + TILT.pitch,
        o.pitchMin == null ? -1.25 : o.pitchMin,
        o.pitchMax == null ? 0.22 : o.pitchMax),
      dist: (o.dist || 1000) * VIEW.zoom,
      f: 900
    };
  }
  /* world → camera space (y points down: -y is up the screen) */
  function rot(c, x, y, z) {
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  }
  function project(c, x, y, z, w, h) {
    const p = rot(c, x, y, z);
    const s = c.f / (c.f + p[2] + c.dist);
    return [w / 2 + p[0] * s, h / 2 + p[1] * s, s];
  }
  function depth(c, x, y, z) { return rot(c, x, y, z)[2]; }
  /* camera-space normal → diffuse brightness for one face */
  function brightness(c, n) {
    const r = rot(c, n[0], n[1], n[2]);
    const d = r[0] * LIGHT[0] + r[1] * LIGHT[1] + r[2] * LIGHT[2];
    return 0.42 + 0.74 * Math.max(0, d);
  }
  /* fog: far geometry fades into the backdrop */
  function fogFor(z) { return clamp(1.06 - (z + 260) / 1500 * 0.5, 0.5, 1); }

  /* ---------- geometry ---------- */
  function boxFaces(x, y, z, hx, hy, hz) {
    const v = [
      [x - hx, y - hy, z - hz], [x - hx, y - hy, z + hz],
      [x + hx, y - hy, z + hz], [x + hx, y - hy, z - hz],
      [x - hx, y + hy, z - hz], [x - hx, y + hy, z + hz],
      [x + hx, y + hy, z + hz], [x + hx, y + hy, z - hz]
    ];
    return [
      { p: [v[0], v[1], v[2], v[3]], n: [0, -1, 0] },   // top  (-y is up)
      { p: [v[4], v[7], v[6], v[5]], n: [0, 1, 0] },    // bottom
      { p: [v[0], v[3], v[7], v[4]], n: [0, 0, -1] },   // front
      { p: [v[1], v[5], v[6], v[2]], n: [0, 0, 1] },    // back
      { p: [v[0], v[4], v[5], v[1]], n: [-1, 0, 0] },   // left
      { p: [v[3], v[2], v[6], v[7]], n: [1, 0, 0] }     // right
    ];
  }
  function prismFaces(x, y, z, r, hy, sides, rot0, axis) {
    const top = [], bot = [], alongZ = axis === "z";
    for (let i = 0; i < sides; i++) {
      const ang = (i / sides) * TAU + (rot0 || 0);
      const u = Math.cos(ang) * r, v = Math.sin(ang) * r;
      if (alongZ) {
        top.push([x + u, y + v, z - hy]);
        bot.push([x + u, y + v, z + hy]);
      } else {
        top.push([x + u, y - hy, z + v]);
        bot.push([x + u, y + hy, z + v]);
      }
    }
    const faces = [
      { p: top, n: alongZ ? [0, 0, -1] : [0, -1, 0] },
      { p: bot.slice().reverse(), n: alongZ ? [0, 0, 1] : [0, 1, 0] }
    ];
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      const ang = ((i + 0.5) / sides) * TAU + (rot0 || 0);
      faces.push({
        p: [top[i], top[j], bot[j], bot[i]],
        n: alongZ ? [Math.cos(ang), Math.sin(ang), 0] : [Math.cos(ang), 0, Math.sin(ang)]
      });
    }
    return faces;
  }
  function octaFaces(x, y, z, r) {
    const T = [x, y - r, z], B = [x, y + r, z];
    const E = [[x - r, y, z], [x, y, z - r], [x + r, y, z], [x, y, z + r]];
    const faces = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      faces.push({ p: [T, E[i], E[j]], n: [0, -1, 0] });
      faces.push({ p: [B, E[j], E[i]], n: [0, 1, 0] });
    }
    return faces;
  }
  function loopPoints(centre, r, plane, seg, a0, a1) {
    const pts = [];
    const from = a0 == null ? 0 : a0, to = a1 == null ? TAU : a1;
    for (let i = 0; i <= seg; i++) {
      const ang = from + (to - from) * (i / seg);
      const u = Math.cos(ang) * r, v = Math.sin(ang) * r;
      if (plane === "xy") pts.push([centre[0] + u, centre[1] + v, centre[2]]);
      else if (plane === "yz") pts.push([centre[0], centre[1] + u, centre[2] + v]);
      else pts.push([centre[0] + u, centre[1], centre[2] + v]);
    }
    return pts;
  }

  /* ---------- rig: the depth-sorted draw queue ---------- */
  function rig(ctx, c, w, h) {
    const items = [];
    const labels = [];
    let budget = 0;
    const P = (p) => project(c, p[0], p[1], p[2], w, h);
    const D = (p) => depth(c, p[0], p[1], p[2]);
    const push = (z, fn) => { items.push({ z, fn }); budget++; };
    const kOf = (s) => clamp(s / VIEW.s0, 0.55, 1.7);

    function faces(list, tone, o) {
      o = o || {};
      const alpha = o.alpha == null ? 0.94 : o.alpha;
      for (const f of list) {
        let z = 0;
        for (const p of f.p) z += D(p);
        z /= f.p.length;
        push(z, (fog) => {
          const pts = f.p.map(P);
          const b = o.flat ? 1 : brightness(c, f.n) * (o.dim || 1);
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          ctx.closePath();
          if (!o.wire) {
            ctx.globalAlpha = alpha * fog;
            ctx.fillStyle = o.fill || shade(tone, b);
            ctx.fill();
          }
          ctx.globalAlpha = (o.edge == null ? 0.5 : o.edge) * fog;
          ctx.strokeStyle = shade(tone, Math.min(1.8, b + 0.35));
          ctx.lineWidth = (o.width || 1) * kOf(pts[0][2]);
          ctx.stroke();
          if (o.glow) {
            ctx.globalAlpha = 0.16 * fog;
            ctx.lineWidth *= 3.4;
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        });
      }
    }

    const api = {
      ctx, cam: c, w, h, P, D, VIEW,
      /* a flat polygon floating in 3D */
      quad(pts, tone, o) {
        o = o || {};
        let z = 0;
        for (const p of pts) z += D(p);
        z /= pts.length;
        push(z, (fog) => {
          const q = pts.map(P);
          ctx.beginPath();
          ctx.moveTo(q[0][0], q[0][1]);
          for (let i = 1; i < q.length; i++) ctx.lineTo(q[i][0], q[i][1]);
          if (o.open !== true) ctx.closePath();
          if (o.fill) {
            ctx.globalAlpha = (o.alpha == null ? 0.9 : o.alpha) * fog;
            ctx.fillStyle = o.fill;
            ctx.fill();
          }
          if (tone) {
            ctx.globalAlpha = (o.line == null ? 0.8 : o.line) * fog;
            if (o.dash) { ctx.setLineDash(o.dash); ctx.lineDashOffset = o.offset || 0; }
            ctx.strokeStyle = tone;
            ctx.lineWidth = (o.width || 1) * kOf(q[0][2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.globalAlpha = 1;
        }, z);
      },
      /* solid cuboid, shaded per face */
      box(x, y, z, hx, hy, hz, tone, o) { faces(boxFaces(x, y, z, hx, hy, hz), tone, o); },
      prism(x, y, z, r, hy, sides, tone, o) {
        o = o || {};
        faces(prismFaces(x, y, z, r, hy, sides, o.rot, o.axis), tone, o);
      },
      octa(x, y, z, r, tone, o) {
        o = o || {};
        o.flat = true;
        faces(octaFaces(x, y, z, r), tone, o);
      },
      /* straight rod between two points */
      beam(A, B, tone, o) {
        o = o || {};
        const z = (D(A) + D(B)) / 2;
        push(z, (fog) => {
          const p = P(A), q = P(B);
          const k = kOf((p[2] + q[2]) / 2);
          ctx.lineCap = "round";
          ctx.setLineDash(o.dash || []);
          ctx.lineDashOffset = o.offset || 0;
          ctx.globalAlpha = (o.alpha == null ? 0.85 : o.alpha) * fog;
          ctx.strokeStyle = tone;
          ctx.lineWidth = Math.max(0.6, (o.width || 2) * k);
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
          if (o.core !== false) {
            ctx.globalAlpha = (o.alpha == null ? 0.85 : o.alpha) * fog * 0.45;
            ctx.strokeStyle = shade(tone, 1.75);
            ctx.lineWidth = Math.max(0.4, (o.width || 2) * k * 0.34);
            ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
          }
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        });
      },
      /* sphere-ish node with a halo */
      dot(p, r, tone, o) {
        o = o || {};
        const z = D(p);
        push(z, (fog) => {
          const q = P(p);
          const rr = Math.max(0.6, r * kOf(q[2]) * (o.scale || 1));
          const al = (o.alpha == null ? 1 : o.alpha) * fog;
          if (o.glow !== false) {
            const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr * 4);
            g.addColorStop(0, a(tone, 0.55 * al));
            g.addColorStop(1, a(tone, 0));
            ctx.globalAlpha = 1;
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(q[0], q[1], rr * 4, 0, TAU); ctx.fill();
          }
          ctx.globalAlpha = al;
          ctx.fillStyle = shade(tone, 1.15);
          ctx.beginPath(); ctx.arc(q[0], q[1], rr, 0, TAU); ctx.fill();
          ctx.globalAlpha = 1;
        });
      },
      /* circle / arc outline in one of the three planes */
      loop(centre, r, tone, o) {
        o = o || {};
        const seg = o.seg || 48;
        const pts = loopPoints(centre, r, o.plane, seg, o.a0, o.a1);
        for (let i = 0; i < seg; i++) {
          const A = pts[i], B = pts[i + 1];
          if (!A || !B) break;
          const z = (D(A) + D(B)) / 2;
          push(z, (fog) => {
            const p = P(A), q = P(B);
            ctx.setLineDash(o.dash || []);
            ctx.lineDashOffset = o.offset || 0;
            ctx.globalAlpha = (o.alpha == null ? 0.5 : o.alpha) * fog;
            ctx.strokeStyle = tone;
            ctx.lineWidth = Math.max(0.4, (o.width || 1.2) * kOf((p[2] + q[2]) / 2));
            ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
          });
        }
      },
      /* filled annulus sector on the xz plane — radar sweep, clock arc */
      band(centre, r0, r1, a0, a1, tone, o) {
        o = o || {};
        const seg = o.seg || 18;
        for (let i = 0; i < seg; i++) {
          const t0 = a0 + (a1 - a0) * (i / seg), t1 = a0 + (a1 - a0) * ((i + 1) / seg);
          const q = [
            [centre[0] + Math.cos(t0) * r1, centre[1], centre[2] + Math.sin(t0) * r1],
            [centre[0] + Math.cos(t1) * r1, centre[1], centre[2] + Math.sin(t1) * r1],
            [centre[0] + Math.cos(t1) * r0, centre[1], centre[2] + Math.sin(t1) * r0],
            [centre[0] + Math.cos(t0) * r0, centre[1], centre[2] + Math.sin(t0) * r0]
          ];
          const z = (D(q[0]) + D(q[1]) + D(q[2]) + D(q[3])) / 4;
          push(z, (fog) => {
            const pts = q.map(P);
            ctx.globalAlpha = (o.alpha == null ? 0.3 : o.alpha) * fog;
            ctx.fillStyle = o.fill || tone;
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let k = 1; k < 4; k++) ctx.lineTo(pts[k][0], pts[k][1]);
            ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
          });
        }
      },
      /* billboarded text: position follows the 3D point, glyphs stay upright */
      label(p, text, tone, size, o) {
        o = o || {};
        const z = D(p);
        labels.push({
          z, fn(fog) {
            const q = P(p);
            const px = Math.max(6, (size || 10) * kOf(q[2]));
            ctx.font = (o.bold ? "700 " : "") + px.toFixed(1) + "px ui-monospace, Menlo, monospace";
            ctx.textAlign = o.align || "center";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * (0.55 + 0.45 * fog);
            const x = q[0] + (o.dx || 0), y = q[1] + (o.dy || 0);
            const tw = ctx.measureText(text).width;
            // test hook: collects label boxes so collisions can be measured
            if (window.__labelSink) {
              window.__labelSink.push({ text, x, y, w: tw, h: px });
            }
            if (o.plate) {
              const pw = tw + px * 0.9, ph = px * 1.8;
              const ax = o.align === "left" ? x - px * 0.45 : o.align === "right" ? x - pw + px * 0.45 : x - pw / 2;
              ctx.globalAlpha *= 0.82;
              ctx.fillStyle = "rgba(6,12,19,.82)";
              ctx.fillRect(ax, y - ph / 2, pw, ph);
              ctx.globalAlpha /= 0.82;
            }
            ctx.fillStyle = tone;
            ctx.fillText(text, x, y);
            ctx.globalAlpha = 1;
          }
        });
      },
      flush() {
        items.sort((p, q) => q.z - p.z);
        for (const it of items) it.fn(fogFor(it.z));
        labels.sort((p, q) => q.z - p.z);
        for (const l of labels) l.fn(fogFor(l.z));
        items.length = 0; labels.length = 0;
      },
      get count() { return budget; }
    };
    return api;
  }

  return {
    TAU, C, VIEW, clamp, a, shade, rgb,
    setView, cam, project, depth, rig, loopPoints,
    setTilt(yaw, pitch) { TILT.yaw = yaw; TILT.pitch = pitch; },
    getTilt() { return { yaw: TILT.yaw, pitch: TILT.pitch }; }
  };
})();
