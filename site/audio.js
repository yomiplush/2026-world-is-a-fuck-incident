/* Audio: everything is synthesised at runtime with Web Audio.
   No samples, no external files — the SFX are oscillator/noise bursts and the BGM is a
   generative lofi loop (detuned pads, tape wobble, vinyl noise, swung drums). */
window.AUDIO = (function () {
  const A = {
    ctx: null, master: null, music: null, sfxBus: null, verb: null,
    on: true, ready: false, _timer: null, _next: 0, _step: 0,
    bpm: 72, lookahead: 0.14
  };

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
    const buf = ctx.createBuffer(1, len, rate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  A.init = function () {
    if (A.ready) { A.ctx.resume && A.ctx.resume(); return; }
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
    A.music.connect(A.verb);

    A.sfxBus = ctx.createGain(); A.sfxBus.gain.value = 0.55;
    A.sfxBus.connect(A.master);
    const sfxVerb = ctx.createGain(); sfxVerb.gain.value = 0.5;
    A.sfxBus.connect(sfxVerb); sfxVerb.connect(A.verb);

    A.ready = true;
    A._next = ctx.currentTime + 0.15;
    A._step = 0;
    A._timer = setInterval(scheduleAhead, 25);
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
    o.start(t); o.stop(t + dur + 0.05);
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
    src.start(t); src.stop(t + dur + 0.05);
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
    if (!A.ready || !A.on) return;
    const t = A.ctx.currentTime + 0.01;
    (SFX[name] || SFX.blip)(t);
  };

  /* ---------------- generative lofi ---------------- */
  // A3-based voicings: Am9, Fmaj9, Cmaj9, G6/9 — 4 bars, one chord per bar.
  const CHORDS = [
    [57, 60, 64, 67, 71],
    [53, 57, 60, 64, 67],
    [48, 52, 55, 59, 62],
    [55, 59, 62, 64, 69]
  ];
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const stepDur = () => 60 / A.bpm / 4;      // 16th note

  function pad(t, chord, barLen) {
    const ctx = A.ctx;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(680, t);
    filt.frequency.linearRampToValueAtTime(1250, t + barLen * 0.5);
    filt.frequency.linearRampToValueAtTime(720, t + barLen);
    filt.Q.value = 0.6;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.055, t + barLen * 0.28);
    g.gain.linearRampToValueAtTime(0.0001, t + barLen * 0.98);
    filt.connect(g); g.connect(A.music);

    // top three voices only — keeps it airy
    chord.slice(-3).forEach((note, i) => {
      [-7, 6].forEach((cents, j) => {
        const o = ctx.createOscillator();
        o.type = j ? "triangle" : "sawtooth";
        o.frequency.value = mtof(note);
        o.detune.value = cents + (i - 1) * 1.5;
        // tape wobble
        const lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = 0.13 + i * 0.03; lg.gain.value = 5;
        lfo.connect(lg); lg.connect(o.detune);
        o.connect(filt);
        o.start(t); lfo.start(t);
        o.stop(t + barLen + 0.2); lfo.stop(t + barLen + 0.2);
      });
    });
  }

  function bass(t, rootMidi, barLen) {
    const f = mtof(rootMidi - 24);
    const ctx = A.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + barLen * 0.55);
    const o = ctx.createOscillator();
    o.type = "sine"; o.frequency.value = f;
    o.connect(g); g.connect(A.music);
    o.start(t); o.stop(t + barLen);
    // sub hit on the second half
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t + barLen * 0.52);
    g2.gain.exponentialRampToValueAtTime(0.10, t + barLen * 0.56);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + barLen * 0.9);
    const o2 = ctx.createOscillator();
    o2.type = "sine"; o2.frequency.value = f;
    o2.connect(g2); g2.connect(A.music);
    o2.start(t + barLen * 0.5); o2.stop(t + barLen);
  }

  function kick(t, peak) {
    const ctx = A.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(112, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak || 0.28, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g); g.connect(A.music);
    o.start(t); o.stop(t + 0.4);
  }

  function snare(t) {
    noise(t, 0.16, 0.12, "bandpass", 1700, 900, A.music);
    tone("triangle", 186, t, 0.09, 0.07, A.music);
  }

  function hat(t, peak) {
    noise(t, 0.035, peak || 0.045, "highpass", 7200, null, A.music);
  }

  function vinyl(t, dur) {
    const ctx = A.ctx;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, dur);
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 2600;
    const g = ctx.createGain(); g.gain.value = 0.012;
    src.connect(f); f.connect(g); g.connect(A.music);
    src.start(t); src.stop(t + dur);
    // a few pops
    for (let i = 0; i < 4; i++) {
      noise(t + Math.random() * dur, 0.012, 0.05, "highpass", 2500, null, A.music);
    }
  }

  function scheduleAhead() {
    const ctx = A.ctx;
    if (!ctx) return;
    while (A._next < ctx.currentTime + A.lookahead) {
      const bar = Math.floor(A._step / 16) % 4;
      const step = A._step % 16;
      const t = A._next;
      const sd = stepDur();

      if (step === 0) {
        pad(t, CHORDS[bar], sd * 16);
        bass(t, CHORDS[bar][0], sd * 16);
        vinyl(t, sd * 16);
      }
      // boom-bap: kick 1 and a late 3, snare on 2 and 4
      if (step === 0 || step === 10) kick(t);
      if (step === 7 && bar % 2 === 1) kick(t, 0.18);
      if (step === 4 || step === 12) snare(t);
      // swung 8th hats
      if (step % 4 === 0) hat(t, 0.05);
      if (step % 4 === 2) hat(t + sd * 0.18, 0.03);

      A._next += sd;
      A._step++;
    }
  }

  A.toggle = function () {
    if (!A.ready) return A.on;
    A.on = !A.on;
    const now = A.ctx.currentTime;
    A.master.gain.cancelScheduledValues(now);
    A.master.gain.setTargetAtTime(A.on ? 0.9 : 0.0, now, 0.08);
    return A.on;
  };

  A.isOn = () => A.on;

  return A;
})();
