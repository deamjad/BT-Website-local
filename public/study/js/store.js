// Single source of truth. State lives in memory, mirrors to localStorage when
// available, and notifies subscribers after every change.

import { seedState, defaultSettings, generatePlan, SUBJECTS, capFor, phaseFor } from './seed.js';
import { todayKey, addDays, weekStart, isFriday, diffDays, uid, round25, eachDay } from './util.js';

const KEY = 'ncea-study-companion:v1';

let state = null;
let memoryOnly = false;
const listeners = new Set();
const undoStack = [];

function storageAvailable() {
  try {
    const t = '__sc_test__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    return true;
  } catch { return false; }
}

export function isMemoryOnly() { return memoryOnly; }

export function load() {
  memoryOnly = !storageAvailable();
  if (!memoryOnly) {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = migrate(JSON.parse(raw));
    } catch (e) {
      console.warn('Could not read saved data, starting fresh. A copy was kept.', e);
      try { localStorage.setItem(`${KEY}:unreadable`, localStorage.getItem(KEY) || ''); } catch { /* ignore */ }
    }
  }
  if (!state) state = seedState();
  return state;
}

function migrate(s) {
  if (!s || typeof s !== 'object') return null;
  s.settings = { ...defaultSettings(), ...(s.settings || {}) };
  s.subjects = Array.isArray(s.subjects) && s.subjects.length ? s.subjects : SUBJECTS.map(x => ({ ...x }));
  s.planDays = Array.isArray(s.planDays) ? s.planDays : generatePlan();
  s.sessions = Array.isArray(s.sessions) ? s.sessions : [];
  s.notes = s.notes || {};
  s.parked = Array.isArray(s.parked) ? s.parked : [];
  s.meta = { wrapSeen: '', lastSessionId: null, ...(s.meta || {}) };
  s.active = s.active || null;
  s.version = 1;
  return s;
}

let saveTimer = null;
function persist() {
  if (memoryOnly) return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { console.warn('Could not save.', e); }
}

export function get() { return state; }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function update(mutator, { silent = false } = {}) {
  mutator(state);
  persist();
  if (!silent) for (const fn of listeners) fn(state);
}

// ---------- subjects ----------
export function subject(id) { return state.subjects.find(s => s.id === id) || null; }
export function subjectsByExam() { return [...state.subjects].sort((a, b) => a.examDate.localeCompare(b.examDate)); }
export function upcomingExams(today = todayKey()) {
  return subjectsByExam().filter(s => s.examDate >= today).map(s => ({ ...s, daysLeft: diffDays(today, s.examDate) }));
}
export function activeSubjectIds(today = todayKey()) {
  return state.subjects.filter(s => s.examDate >= today).map(s => s.id);
}

// ---------- plan ----------
export function day(key) { return state.planDays.find(d => d.date === key) || null; }

export function ensureDay(key) {
  let d = day(key);
  if (!d) {
    const phase = phaseFor(key);
    d = { date: key, blocks: [], isRestDay: isFriday(key), label: '', cap: capFor(key), phaseId: phase ? phase.id : null };
    state.planDays.push(d);
    state.planDays.sort((a, b) => a.date.localeCompare(b.date));
  }
  return d;
}

export function weekDays(anyKey) {
  const start = weekStart(anyKey);
  return eachDay(start, addDays(start, 6)).map(k => day(k) || { date: k, blocks: [], isRestDay: isFriday(k), label: '', cap: capFor(k), virtual: true });
}

export function planHours(d) { return d.blocks.reduce((a, b) => a + (Number(b.hours) || 0), 0); }

export function dayIssues(d) {
  const notes = [];
  if (d.isExamDay) return notes;
  const subjects = new Set(d.blocks.map(b => b.subjectId));
  if (subjects.size > 2) notes.push(`This day has ${subjects.size} subjects. The plan usually keeps to two.`);
  const cap = d.cap || capFor(d.date) || state.settings.dailyHoursTarget;
  const hours = planHours(d);
  if (cap && hours > cap + 0.01 && !d.isRestDay) notes.push(`${hours} hours is above the usual ${cap} for this day.`);
  if (isFriday(d.date) && d.blocks.length && !d.isRestDay) notes.push('Fridays are usually rest days.');
  if (d.isRestDay && d.blocks.length) notes.push('This is marked as a rest day but has blocks planned.');
  return notes;
}

// Undo support for plan edits (current browser session only).
function snapshotPlan(label) {
  undoStack.push({ label, planDays: JSON.parse(JSON.stringify(state.planDays)) });
  if (undoStack.length > 30) undoStack.shift();
}
export function canUndo() { return undoStack.length > 0; }
export function undo() {
  const entry = undoStack.pop();
  if (!entry) return null;
  update(s => { s.planDays = entry.planDays; });
  return entry.label;
}

export function editPlan(label, fn) {
  snapshotPlan(label);
  update(s => fn(s));
}

export function addBlock(key, subjectId, hours = 1, note = '') {
  editPlan('Add block', () => {
    const d = ensureDay(key);
    d.blocks.push({ id: uid('b'), subjectId, hours: round25(hours), note, done: false });
  });
}
export function updateBlock(key, blockId, patch) {
  editPlan('Edit block', () => {
    const d = day(key); if (!d) return;
    const b = d.blocks.find(x => x.id === blockId); if (!b) return;
    Object.assign(b, patch);
    if (patch.hours != null) b.hours = round25(Math.max(0.25, Number(patch.hours) || 0.25));
  });
}
export function deleteBlock(key, blockId) {
  editPlan('Delete block', () => {
    const d = day(key); if (!d) return;
    d.blocks = d.blocks.filter(b => b.id !== blockId);
  });
}
export function moveBlock(fromKey, blockId, toKey) {
  if (fromKey === toKey) return;
  editPlan('Move block', () => {
    const from = day(fromKey); if (!from) return;
    const i = from.blocks.findIndex(b => b.id === blockId); if (i < 0) return;
    const [b] = from.blocks.splice(i, 1);
    ensureDay(toKey).blocks.push(b);
  });
}
export function setRestDay(key, isRest) {
  editPlan(isRest ? 'Mark rest day' : 'Mark study day', () => {
    const d = ensureDay(key);
    d.isRestDay = isRest;
    if (isRest) d.blocks = [];
  });
}

// Redistribute the remaining study days of a week. Chosen subjects get double weight.
export function reshuffleWeek(anyKey, boostIds, today = todayKey()) {
  const days = weekDays(anyKey).filter(d => d.date >= today && !d.isRestDay && !d.isExamDay && !d.locked);
  if (!days.length) return { days: 0 };
  const active = activeSubjectIds(today).filter(id => subject(id));
  if (!active.length) return { days: 0 };
  const pool = days.reduce((a, d) => a + (planHours(d) || d.cap || capFor(d.date) || state.settings.dailyHoursTarget), 0);
  const weights = Object.fromEntries(active.map(id => [id, boostIds.includes(id) ? 2 : 1]));
  const wsum = Object.values(weights).reduce((a, b) => a + b, 0);
  const target = Object.fromEntries(active.map(id => [id, pool * weights[id] / wsum]));

  const notesUsed = {};
  const pickNote = (id, key) => {
    const phase = phaseFor(key);
    const tmpl = day(key)?.blocks.find(b => b.subjectId === id)?.note;
    if (tmpl) return tmpl;
    const s = subject(id);
    notesUsed[id] = (notesUsed[id] || 0) + 1;
    return phase && phase.id === 'p3' ? 'Full past paper, timed' : `Past questions: ${s.short}`;
  };

  const result = {};
  editPlan('Reshuffle week', () => {
    let prev = [];
    for (const dd of days) {
      const d = ensureDay(dd.date);
      const budget = planHours(d) || d.cap || capFor(d.date) || state.settings.dailyHoursTarget;
      const ranked = active
        .map(id => ({ id, left: target[id] - (result[id] || 0) - (prev.includes(id) ? 0.25 : 0) }))
        .filter(x => x.left > 0.1)
        .sort((a, b) => b.left - a.left);
      const picks = ranked.slice(0, 2);
      d.blocks = [];
      if (!picks.length) continue;
      let alloc;
      if (picks.length === 1) alloc = [budget];
      else {
        const first = Math.min(budget - 0.5, Math.max(0.5, round25(budget * picks[0].left / (picks[0].left + picks[1].left))));
        alloc = [first, round25(budget - first)];
      }
      picks.forEach((p, i) => {
        if (alloc[i] <= 0) return;
        d.blocks.push({ id: uid('b'), subjectId: p.id, hours: alloc[i], note: pickNote(p.id, d.date), done: false });
        result[p.id] = (result[p.id] || 0) + alloc[i];
      });
      prev = picks.map(p => p.id);
    }
  });
  return { days: days.length, hours: result };
}

// ---------- sessions ----------
export function sessionsOn(key) { return state.sessions.filter(s => s.date === key); }
export function minutesOn(key, subjectId = null) {
  return sessionsOn(key).filter(s => !subjectId || s.subjectId === subjectId).reduce((a, s) => a + (s.actualMinutes || 0), 0);
}
export function hoursOn(key, subjectId = null) { return minutesOn(key, subjectId) / 60; }

export function addSession(rec) {
  update(s => { s.sessions.push(rec); s.meta.lastSessionId = rec.id; });
  return rec;
}
export function patchSession(id, patch) {
  update(s => { const r = s.sessions.find(x => x.id === id); if (r) Object.assign(r, patch); });
}
export function session(id) { return state.sessions.find(x => x.id === id) || null; }

export function totals() {
  const bySubject = Object.fromEntries(state.subjects.map(s => [s.id, 0]));
  let minutes = 0, goalsDone = 0, goalsSet = 0;
  for (const s of state.sessions) {
    minutes += s.actualMinutes || 0;
    if (bySubject[s.subjectId] != null) bySubject[s.subjectId] += s.actualMinutes || 0;
    for (const g of s.goals || []) { goalsSet++; if (g.done) goalsDone++; }
  }
  return { minutes, hours: minutes / 60, sessions: state.sessions.length, goalsDone, goalsSet, bySubject };
}

export function weeklyHours(weeksBack = 8, today = todayKey()) {
  const out = [];
  let start = weekStart(today);
  for (let i = 0; i < weeksBack; i++) {
    const end = addDays(start, 6);
    const mins = state.sessions.filter(s => s.date >= start && s.date <= end).reduce((a, s) => a + (s.actualMinutes || 0), 0);
    out.unshift({ start, end, hours: mins / 60 });
    start = addDays(start, -7);
  }
  return out;
}

// Forgiving streak: rest days never break it; one missed day per week is forgiven.
export function streak(today = todayKey()) {
  const studied = new Set(state.sessions.filter(s => (s.actualMinutes || 0) >= 1).map(s => s.date));
  const isRest = k => { const d = day(k); return d ? (d.isRestDay || d.isExamDay) : isFriday(k); };
  let count = 0;
  let k = today;
  const graceUsed = new Set();
  if (!studied.has(today)) k = addDays(today, -1); // today is still open
  for (let guard = 0; guard < 400; guard++) {
    if (studied.has(k)) { count++; }
    else if (isRest(k)) { /* neutral */ }
    else {
      const wk = weekStart(k);
      if (graceUsed.has(wk)) break;
      graceUsed.add(wk);
    }
    k = addDays(k, -1);
    if (k < '2026-01-01') break;
  }
  return count;
}

// ---------- notes, parked thoughts ----------
export function noteFor(subjectId) { return state.notes[subjectId] || ''; }
export function setNote(subjectId, text) { update(s => { if (text) s.notes[subjectId] = text; else delete s.notes[subjectId]; }); }

export function park(text, subjectId = null, sessionId = null) {
  const item = { id: uid('t'), text, createdAt: Date.now(), subjectId, sessionId, done: false };
  update(s => { s.parked.unshift(item); });
  return item;
}
export function resolveParked(id, done = true) { update(s => { const t = s.parked.find(x => x.id === id); if (t) t.done = done; }); }
export function removeParked(id) { update(s => { s.parked = s.parked.filter(x => x.id !== id); }); }
export function openParked() { return state.parked.filter(t => !t.done); }

// ---------- active session ----------
export function setActive(active) { update(s => { s.active = active; }, { silent: true }); }
export function getActive() { return state.active; }

// ---------- settings ----------
export function setSettings(patch) { update(s => { Object.assign(s.settings, patch); }); }

// ---------- export / import / reset ----------
export function exportJSON() {
  const copy = { ...state, active: null, exportedAt: new Date().toISOString() };
  return JSON.stringify(copy, null, 2);
}
export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.planDays) || !Array.isArray(parsed.sessions)) {
    throw new Error('That file does not look like a Study Companion backup.');
  }
  const next = migrate(parsed);
  next.active = null;
  update(s => { Object.assign(s, next); for (const k of Object.keys(s)) if (!(k in next)) delete s[k]; });
}
export function resetAll() {
  undoStack.length = 0;
  state = seedState();
  persist();
  for (const fn of listeners) fn(state);
}
