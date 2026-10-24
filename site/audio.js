/* Synthesized SFX with a streamed, optimized infosec BGM track. */
window.AUDIO = (function () {
  const A = {
    ctx: null, master: null, music: null, sfxBus: null, verb: null,
    on: true, ready: false, track: null, visible: !document.hidden
  };

  const noiseCache = new Map();
  const voices = new Set();
  function retain(source) {
    if (voices.size >= 48) {
      const oldest = voices.values().next().value;
      try { oldest.stop(); } catch (_) { /* already ended */ }
      voices.delete(oldest);
    }
    voices.add(source);
  }
  function playback() {
    if (!A.ready) return;
    if (A.on && A.visible) {
      A.ctx.resume().catch(() => {});
      if (A.track.paused) A.track.play().catch(() => {});
    } else {
      for (const source of voices) { try { source.stop(); } catch (_) { /* already ended */ } }
      voices.clear();
      A.track.pause();
      A.ctx.suspend().catch(() => {});
    }
  }
  A.setVisible = function (visible) { A.visible = visible; playback(); };

  /* ---------------- setup ---------------- */
  function makeIR(ctx, seconds, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return buf;
  }

  function noiseBuffer(ctx, seconds) {
    const rate = ctx.sampleRate, len = Math.floor(rate * seconds);
    const key = rate + ":" + len;
    if (noiseCache.has(key)) return noiseCache.get(key);
    const buf = ctx.createBuffer(1, len, rate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    if (noiseCache.size >= 8) noiseCache.delete(noiseCache.keys().next().value);
    noiseCache.set(key, buf);
    return buf;
  }

  A.init = function () {
    if (A.ready) {
      playback();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = A.ctx = new AC();

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 24;
    comp.ratio.value = 4; comp.attack.value = 0.006; comp.release.value = 0.25;

    A.master = ctx.createGain(); A.master.gain.value = 0.9;
    A.master.connect(comp); comp.connect(ctx.destination);

    A.verb = ctx.createConvolver();
    A.verb.buffer = makeIR(ctx, 2.4, 3.0);
    const verbGain = ctx.createGain(); verbGain.gain.value = 0.30;
    A.verb.connect(verbGain); verbGain.connect(A.master);

    A.music = ctx.createGain(); A.music.gain.value = 0.0;   // faded in below
    A.music.connect(A.master);
    // Keep the mastered recording dry; reverb remains on synthesized SFX.

    A.sfxBus = ctx.createGain(); A.sfxBus.gain.value = 0.55;
    A.sfxBus.connect(A.master);
    const sfxVerb = ctx.createGain(); sfxVerb.gain.value = 0.5;
    A.sfxBus.connect(sfxVerb); sfxVerb.connect(A.verb);

    A.ready = true;
    const track = A.track = new Audio();
    track.preload = "none";
    track.loop = true;
    track.src = track.canPlayType('audio/ogg; codecs="opus"')
      ? "./audio/infosec.opus" : "./audio/infosec.mp3";
    ctx.createMediaElementSource(track).connect(A.music);
    playback();
    A.music.gain.setTargetAtTime(0.42, ctx.currentTime, 1.2);
  };

  /* ---------------- primitives ---------------- */
  function env(gain, t, a, d, peak) {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + a);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  function tone(type, freq, t, dur, peak, dest, detune) {
    const ctx = A.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (detune) o.detune.value = detune;
    env(g, t, 0.005, dur, peak);
    o.connect(g); g.connect(dest || A.sfxBus);
    o.onended = () => { voices.delete(o); o.disconnect(); g.disconnect(); };
    o.start(t); o.stop(t + dur + 0.05); retain(o);
    return o;
  }

  function noise(t, dur, peak, filterType, f0, f1, dest) {
    const ctx = A.ctx;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, Math.max(0.2, dur + 0.05));
    const f = ctx.createBiquadFilter();
    f.type = filterType || "bandpass";
    f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest || A.sfxBus);
    src.onended = () => { voices.delete(src); src.disconnect(); f.disconnect(); g.disconnect(); };
    src.start(t); src.stop(t + dur + 0.05); retain(src);
  }

  /* ---------------- SFX ---------------- */
  const SFX = {
    blip(t) {
      noise(t, 0.03, 0.06, "highpass", 3000, null);
      tone("sine", 1180, t, 0.07, 0.16);
      tone("sine", 1770, t + 0.012, 0.05, 0.08);
    },
    whoosh(t) {
      noise(t, 0.42, 0.20, "bandpass", 260, 2400);
      tone("sine", 90, t, 0.30, 0.10);
    },
    alarm(t) {
      [0, 0.16, 0.32].forEach((d, i) => {
        tone("square", i % 2 ? 392 : 523, t + d, 0.13, 0.075);
      });
      noise(t, 0.5, 0.05, "bandpass", 900, 400);
    },
    crack(t) {
      noise(t, 0.09, 0.30, "highpass", 1800, null);
      tone("sine", 2600, t, 0.07, 0.12);
      tone("sine", 1300, t + 0.03, 0.10, 0.06);
    },
    confirm(t) {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        tone("triangle", f, t + i * 0.055, 0.16, 0.09);
      });
    },
    glitch(t) {
      for (let i = 0; i < 7; i++) {
        const f = 120 + Math.random() * 1800;
        tone("square", f, t + i * 0.028, 0.03, 0.05);
      }
      noise(t, 0.24, 0.16, "bandpass", 2400, 300);
    },
    boot(t) {
      tone("sine", 58, t, 0.9, 0.20);
      tone("sine", 87, t + 0.1, 0.7, 0.12);
      noise(t, 1.1, 0.12, "bandpass", 200, 3000);
    }
  };

  A.sfx = function (name) {
    if (!A.ready || !A.on || !A.visible) return;
    const t = A.ctx.currentTime + 0.01;
    (SFX[name] || SFX.blip)(t);
  };

  A.toggle = function () {
    if (!A.ready) return A.on;
    A.on = !A.on;
    playback();
    const now = A.ctx.currentTime;
    A.master.gain.cancelScheduledValues(now);
    A.master.gain.setTargetAtTime(A.on ? 0.9 : 0.0, now, 0.08);
    return A.on;
  };

  A.dispose = function () {
    if (!A.ready) return;
    A.setVisible(false);
    A.track.removeAttribute("src"); A.track.load();
    A.ctx.close().catch(() => {});
    noiseCache.clear(); voices.clear();
    A.ready = false;
    A.ctx = A.master = A.music = A.sfxBus = A.verb = A.track = null;
  };
  A.isOn = () => A.on;

  return A;
})();
