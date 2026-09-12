// The session engine. All timing is derived from timestamps, never from
// counting interval ticks, so the timer stays accurate when the tab is in
// the background or the phone screen is off.

import * as store from './store.js';
import * as audio from './audio.js';
import { now, toKey, uid, MIN_MS } from './util.js';

const QUICK_MINUTES = 5;
const AUTO_RESUME_GRACE_MS = 2500; // break ended this recently -> auto-start next block

let listeners = new Set();
let interval = null;
let wakeLock = null;

export function on(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(kind, extra = {}) { for (const fn of listeners) fn(kind, extra); }

export function active() { return store.getActive(); }
function save(a) { store.setActive(a); }

function presetFromSettings() {
  const s = store.get().settings;
  return { focus: s.focusMinutes, short: s.shortBreak, long: s.longBreak, beforeLong: s.sessionsBeforeLongBreak };
}

function base(subjectId, goals, preset, quick) {
  const t = now();
  return {
    id: uid('s'), subjectId, goals: goals.filter(g => g.text.trim()).slice(0, 3).map(g => ({ text: g.text.trim(), done: !!g.done })),
    preset, quick, phase: 'focus', blockIndex: 1, blocksDone: 0,
    segStart: t, segEnd: t + (quick ? QUICK_MINUTES : preset.focus) * MIN_MS, pausedAt: null, runFrom: t,
    focusMs: 0, breaksTaken: 0, breakExtended: false, parked: [], startedAt: t, endedEarly: false,
  };
}

export function start({ subjectId, goals = [], preset = presetFromSettings() }) {
  const a = base(subjectId, goals, preset, false);
  save(a);
  beginFocusSideEffects(a);
  emit('start');
  return a;
}

export function startQuick(subjectId) {
  const a = base(subjectId, [], presetFromSettings(), true);
  save(a);
  beginFocusSideEffects(a);
  emit('start');
  return a;
}

function beginFocusSideEffects(a) {
  runLoop();
  requestWakeLock();
  audio.scheduleDing(a.segEnd - now());
  if (store.get().settings.ambientTick) audio.startTick(); else audio.stopTick();
}

export function remaining(a = active()) {
  if (!a) return { ms: 0, total: 1, fraction: 0 };
  const total = a.segEnd - a.segStart;
  const at = a.pausedAt ?? now();
  const ms = Math.max(0, a.segEnd - at);
  return { ms, total, fraction: total > 0 ? ms / total : 0 };
}

export function isPaused(a = active()) { return !!(a && a.pausedAt); }

export function pause() {
  const a = active(); if (!a || a.phase !== 'focus' || a.pausedAt) return;
  const t = now();
  a.pausedAt = t;
  a.focusMs += Math.max(0, t - a.runFrom);
  save(a);
  audio.cancelScheduled();
  audio.stopTick();
  emit('pause');
}

export function resume() {
  const a = active(); if (!a || a.phase !== 'focus' || !a.pausedAt) return;
  const t = now();
  const pausedFor = t - a.pausedAt;
  a.segStart += pausedFor; a.segEnd += pausedFor;
  a.pausedAt = null; a.runFrom = t;
  save(a);
  beginFocusSideEffects(a);
  emit('resume');
}

export function extend(minutes = 5) {
  const a = active(); if (!a || a.phase !== 'focus') return;
  a.segEnd += minutes * MIN_MS;
  if (a.quick) { a.quick = false; } // extending a 5-minute starter makes it a real block
  save(a);
  if (!a.pausedAt) audio.scheduleDing(a.segEnd - now());
  emit('extend');
}

export function toggleGoal(i) {
  const a = active(); if (!a || !a.goals[i]) return;
  a.goals[i].done = !a.goals[i].done;
  save(a);
  emit('goal', { index: i, done: a.goals[i].done });
  return a.goals[i].done;
}

export function park(text) {
  const a = active(); if (!a) return null;
  const clean = String(text || '').trim();
  if (!clean) return null;
  a.parked.push(clean);
  save(a);
  const item = store.park(clean, a.subjectId, a.id);
  emit('park');
  return item;
}

function breakLengthFor(a) {
  const isLong = a.preset.beforeLong > 0 && a.blocksDone % a.preset.beforeLong === 0;
  return { minutes: isLong ? a.preset.long : a.preset.short, isLong };
}

// Called when a focus segment's end time has passed.
function completeBlock(a, at) {
  a.focusMs += Math.max(0, a.segEnd - a.runFrom);
  a.blocksDone += 1;
  const dingAlready = audio.scheduledHasFired();
  audio.cancelScheduled();
  audio.stopTick();
  if (a.quick) {
    a.phase = 'prompt';
    a.segStart = a.segEnd; // no timer in prompt
    save(a);
    emit('block-complete', { dingAlready, quick: true });
    return;
  }
  const { minutes, isLong } = breakLengthFor(a);
  a.phase = 'break';
  a.breakExtended = false;
  a.breaksTaken += 1;
  a.segStart = a.segEnd;
  a.segEnd = a.segStart + minutes * MIN_MS;
  a.breakIsLong = isLong;
  save(a);
  emit('block-complete', { dingAlready, quick: false });
  audio.scheduleBreakEnd(a.segEnd - at);
  emit('break-start', { isLong, minutes });
}

function completeBreak(a, at) {
  const overrun = at - a.segEnd;
  const cueAlready = audio.scheduledHasFired();
  audio.cancelScheduled();
  if (overrun <= AUTO_RESUME_GRACE_MS && document.visibilityState === 'visible') {
    startFocusBlock(a, a.segEnd, cueAlready);
  } else {
    a.phase = 'ready';
    save(a);
    emit('ready', { cueAlready });
  }
}

function startFocusBlock(a, from = now(), cueAlready = false) {
  a.phase = 'focus';
  a.quick = false;
  a.blockIndex += 1;
  a.segStart = from;
  a.segEnd = from + a.preset.focus * MIN_MS;
  a.runFrom = from;
  a.pausedAt = null;
  save(a);
  if (!cueAlready) audio.breakEnd();
  beginFocusSideEffects(a);
  emit('break-end');
  emit('focus-start');
}

export function startNextBlock() {
  const a = active(); if (!a) return;
  if (a.phase === 'prompt') {
    // "Keep going?" after the 5-minute starter: a full block, same session.
    a.phase = 'focus';
    a.quick = false;
    const t = now();
    a.segStart = t; a.segEnd = t + a.preset.focus * MIN_MS; a.runFrom = t; a.pausedAt = null;
    save(a);
    beginFocusSideEffects(a);
    emit('focus-start');
    return;
  }
  if (a.phase === 'ready') { startFocusBlock(a, now(), true); return; }
  if (a.phase === 'break') { audio.cancelScheduled(); startFocusBlock(a, now(), true); }
}

export function extendBreak(minutes = 5) {
  const a = active(); if (!a || a.phase !== 'break' || a.breakExtended) return false;
  a.segEnd += minutes * MIN_MS;
  a.breakExtended = true;
  save(a);
  audio.scheduleBreakEnd(a.segEnd - now());
  emit('extend-break');
  return true;
}

export function skipBreak() { startNextBlock(); }

// Ends the session and writes the record. Returns the record, or null if
// nothing worth logging happened.
export function end() {
  const a = active(); if (!a) return null;
  const t = now();
  if (a.phase === 'focus' && !a.pausedAt) {
    a.focusMs += Math.max(0, Math.min(t, a.segEnd) - a.runFrom);
    if (t < a.segEnd) a.endedEarly = true;
  } else if (a.phase === 'focus' && a.pausedAt && a.pausedAt < a.segEnd) {
    a.endedEarly = true;
  }
  audio.cancelScheduled();
  audio.stopTick();
  stopLoop();
  releaseWakeLock();
  const minutes = Math.round(a.focusMs / MIN_MS);
  let rec = null;
  if (a.focusMs >= 30 * 1000) {
    rec = {
      id: a.id, date: toKey(new Date(a.startedAt)), subjectId: a.subjectId,
      plannedMinutes: a.quick && a.blocksDone <= 1 && a.blockIndex === 1 ? QUICK_MINUTES : a.preset.focus * a.blockIndex,
      actualMinutes: Math.max(1, minutes), goals: a.goals, parkedThoughts: a.parked,
      breaksTaken: a.breaksTaken, blocksCompleted: a.blocksDone, endedEarly: a.endedEarly,
      reflection: '', startedAt: a.startedAt, endedAt: t,
    };
    store.addSession(rec);
  }
  save(null);
  emit('end', { record: rec });
  return rec;
}

export function abandon() {
  audio.cancelScheduled(); audio.stopTick(); stopLoop(); releaseWakeLock();
  save(null);
  emit('end', { record: null });
}

// ---------- loop ----------
export function tick() {
  const a = active(); if (!a) { stopLoop(); return; }
  const t = now();
  if (a.phase === 'focus' && !a.pausedAt && t >= a.segEnd) {
    completeBlock(a, t);
    const b = active();
    if (b && b.phase === 'break' && t >= b.segEnd) completeBreak(b, t);
  } else if (a.phase === 'break' && t >= a.segEnd) {
    completeBreak(a, t);
  }
  emit('tick');
}

export function runLoop() {
  if (interval) return;
  interval = setInterval(tick, 250);
}
function stopLoop() { if (interval) { clearInterval(interval); interval = null; } }

// ---------- wake lock ----------
async function requestWakeLock() {
  try {
    if (!('wakeLock' in navigator) || wakeLock) return;
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch { wakeLock = null; }
}
function releaseWakeLock() {
  try { wakeLock && wakeLock.release(); } catch { /* ignore */ }
  wakeLock = null;
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (active()) { tick(); requestWakeLock(); runLoop(); }
  }
});

// Resume a session that survived a reload.
export function restore() {
  const a = active();
  if (!a) return null;
  runLoop();
  tick();
  return active();
}

export { QUICK_MINUTES };
