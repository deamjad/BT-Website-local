// All sound is synthesised with the Web Audio API — no asset files.
// The context is created lazily on the first user gesture and resumed on
// later gestures, which satisfies browser autoplay rules.

let ctx = null;
let master = null;
let settingsRef = { soundOn: true, volume: 0.7 };
let scheduled = null; // { nodes: [], when }
let tickTimer = null;

export function configure(settings) {
  settingsRef = settings;
  if (master) master.gain.value = settings.soundOn ? clampVol(settings.volume) : 0;
}

function clampVol(v) { return Math.min(1, Math.max(0, Number(v) || 0)); }

export function unlock() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = settingsRef.soundOn ? clampVol(settingsRef.volume) : 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return true;
  } catch (e) {
    console.warn('Audio unavailable', e);
    return false;
  }
}

export function ready() { return !!ctx && ctx.state === 'running'; }

function tone({ freq, at, dur, gain = 0.5, type = 'sine', attack = 0.012, partials = [], lowpass = 0, detune = 0 }) {
  if (!ctx) return [];
  const nodes = [];
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, at);
  out.gain.exponentialRampToValueAtTime(gain, at + attack);
  out.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  let dest = master;
  if (lowpass) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = lowpass; lp.Q.value = 0.7;
    lp.connect(master); dest = lp; nodes.push(lp);
  }
  out.connect(dest);
  const voices = [{ ratio: 1, level: 1 }, ...partials];
  for (const v of voices) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq * v.ratio;
    if (detune) osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = v.level;
    osc.connect(g); g.connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.05);
    nodes.push(osc, g);
  }
  nodes.push(out);
  return nodes;
}

// The signature reward: a warm two-note bell with a soft attack and a long,
// natural decay. Inharmonic partials give it a bell-like shimmer.
function bellAt(at) {
  const nodes = [];
  const note = (f, t, g) => {
    nodes.push(...tone({ freq: f, at: t, dur: 1.9, gain: g, attack: 0.018, lowpass: 3800,
      partials: [{ ratio: 2.0, level: 0.28 }, { ratio: 2.76, level: 0.12 }, { ratio: 4.07, level: 0.05 }] }));
    nodes.push(...tone({ freq: f, at: t, dur: 1.4, gain: g * 0.35, attack: 0.02, detune: 6, lowpass: 2400 }));
  };
  note(659.25, at, 0.42);          // E5
  note(880.00, at + 0.19, 0.38);   // A5
  return nodes;
}

export function ding() {
  if (!unlock()) return;
  cancelScheduled();
  bellAt(ctx.currentTime + 0.01);
}

// Pre-schedule the bell on the audio clock so it lands on time even when the
// tab is throttled. Returns nothing; call cancelScheduled() on pause/extend/end.
export function scheduleDing(inMs) {
  if (!ctx || ctx.state !== 'running') return;
  cancelScheduled();
  const when = ctx.currentTime + Math.max(0.05, inMs / 1000);
  scheduled = { when, nodes: bellAt(when) };
}

export function cancelScheduled() {
  if (!scheduled) return;
  for (const n of scheduled.nodes) {
    try { if (typeof n.stop === 'function') n.stop(); } catch { /* already stopped */ }
    try { n.disconnect(); } catch { /* ignore */ }
  }
  scheduled = null;
}

// True if a scheduled bell already rang (so a catch-up render should not ring again).
export function scheduledHasFired() {
  return !!(scheduled && ctx && ctx.currentTime >= scheduled.when - 0.05);
}

export function blip() {
  if (!unlock()) return;
  const t = ctx.currentTime + 0.005;
  tone({ freq: 1318.5, at: t, dur: 0.16, gain: 0.16, attack: 0.006, lowpass: 5000, partials: [{ ratio: 2, level: 0.15 }] });
}

export function softTap() {
  if (!unlock()) return;
  const t = ctx.currentTime + 0.005;
  tone({ freq: 523.25, at: t, dur: 0.35, gain: 0.18, attack: 0.01, lowpass: 2200, partials: [{ ratio: 2, level: 0.2 }] });
}

export function breakStart() {
  if (!unlock()) return;
  const t = ctx.currentTime + 0.01;
  tone({ freq: 783.99, at: t, dur: 0.55, gain: 0.22, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] });
  tone({ freq: 587.33, at: t + 0.22, dur: 0.75, gain: 0.22, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] });
}

export function breakEnd() {
  if (!unlock()) return;
  const t = ctx.currentTime + 0.01;
  tone({ freq: 587.33, at: t, dur: 0.5, gain: 0.22, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] });
  tone({ freq: 783.99, at: t + 0.22, dur: 0.8, gain: 0.24, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] });
}

export function scheduleBreakEnd(inMs) {
  if (!ctx || ctx.state !== 'running') return;
  cancelScheduled();
  const when = ctx.currentTime + Math.max(0.05, inMs / 1000);
  const nodes = [
    ...tone({ freq: 587.33, at: when, dur: 0.5, gain: 0.22, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] }),
    ...tone({ freq: 783.99, at: when + 0.22, dur: 0.8, gain: 0.24, attack: 0.02, lowpass: 2600, partials: [{ ratio: 2, level: 0.15 }] }),
  ];
  scheduled = { when, nodes };
}

// Optional gentle tick during focus: a very quiet filtered click each second.
export function startTick() {
  stopTick();
  if (!unlock()) return;
  const click = () => {
    if (!ctx || !settingsRef.soundOn) return;
    const t = ctx.currentTime + 0.005;
    tone({ freq: 1800, at: t, dur: 0.035, gain: 0.035, attack: 0.002, type: 'triangle', lowpass: 3000 });
  };
  tickTimer = setInterval(click, 1000);
}
export function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }
