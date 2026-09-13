// Seed data: the six subjects, the four study phases, and a deterministic
// generator for the day-by-day plan. Everything produced here is editable
// by the user afterwards; this only runs on first launch (or after a reset).

import { eachDay, isFriday, isWeekend, dayOfWeek, uid, round25 } from './util.js';

export const SUBJECTS = [
  { id: 'eng3', name: 'L3 English',            short: 'English L3', level: 3, examDate: '2026-11-11', examSession: 'AM', color: '#E0457B' },
  { id: 'eng2', name: 'L2 English',            short: 'English L2', level: 2, examDate: '2026-11-12', examSession: 'AM', color: '#D9678F' },
  { id: 'chem', name: 'L2 Chemistry',          short: 'Chemistry',  level: 2, examDate: '2026-11-16', examSession: 'PM', color: '#E8705A' },
  { id: 'phys', name: 'L2 Physics',            short: 'Physics',    level: 2, examDate: '2026-11-18', examSession: 'PM', color: '#A366A0' },
  { id: 'math', name: 'L2 Maths & Statistics', short: 'Maths',      level: 2, examDate: '2026-11-19', examSession: 'AM', color: '#8E2A5E' },
  { id: 'dtec', name: 'L2 Digital Tech',       short: 'Digital Tech', level: 2, examDate: '2026-11-27', examSession: 'PM', color: '#B3305C' },
];

export const SUBJECT_COLORS = ['#E0457B', '#8E2A5E', '#E8705A', '#D9678F', '#A366A0', '#B3305C'];

export const PHASES = [
  { id: 'p1', name: 'Foundations',        start: '2026-09-14', end: '2026-10-11', weekdayCap: 4, weekendCap: 6,
    blurb: 'Notes, key ideas and getting back into the habit.',
    weights: { eng3: 1.15, eng2: 1, chem: 1, phys: 1, math: 1, dtec: 0.85 } },
  { id: 'p2', name: 'Build',              start: '2026-10-12', end: '2026-10-29', weekdayCap: 4, weekendCap: 6,
    blurb: 'Practice questions and timed writing.',
    weights: { eng3: 1.2, eng2: 1.1, chem: 1, phys: 1, math: 1, dtec: 0.8 } },
  { id: 'p3', name: 'Holiday intensive',  start: '2026-10-30', end: '2026-11-08', weekdayCap: 4, weekendCap: 6,
    blurb: 'Full past papers under exam conditions.',
    weights: { eng3: 1.6, eng2: 1.4, chem: 1, phys: 1, math: 1, dtec: 0.6 } },
  { id: 'p4', name: 'Exam countdown',     start: '2026-11-09', end: '2026-11-27', weekdayCap: 3,   weekendCap: 3,
    blurb: 'One exam at a time.' },
];

export const PLAN_START = PHASES[0].start;
export const PLAN_END = PHASES[PHASES.length - 1].end;

// Public holidays inside the plan window get weekend caps.
const HOLIDAYS = { '2026-10-26': 'Labour Day' };

export function phaseFor(key) {
  return PHASES.find(p => key >= p.start && key <= p.end) || null;
}

export function capFor(key, phase = phaseFor(key)) {
  if (!phase) return 0;
  if (isFriday(key)) return 0;
  return (isWeekend(key) || HOLIDAYS[key]) ? phase.weekendCap : phase.weekdayCap;
}

// Short activity notes, cycled per subject per phase so the plan reads like a plan.
const NOTES = {
  eng3: {
    p1: ['Re-read the set text; note key quotes', 'Plan an essay from a past question', 'Unfamiliar texts: one passage, annotated'],
    p2: ['Timed essay, 45 minutes', 'Unfamiliar texts under time', 'Rework an old essay to Excellence'],
    p3: ['Full past paper, timed', 'Review marked essays; tighten intros', 'Memorise quotes; plan two essays'],
  },
  eng2: {
    p1: ['Character and theme notes', 'Plan an essay from a past question', 'Unfamiliar texts: one passage'],
    p2: ['Timed essay, 40 minutes', 'Unfamiliar texts under time', 'Quote bank: 15 quotes, sorted by theme'],
    p3: ['Full past paper, timed', 'Rewrite one paragraph to Excellence', 'Essay plans for three likely questions'],
  },
  chem: {
    p1: ['Organic: reaction types summary', 'Bonding and structure flashcards', 'Energy changes: worked examples'],
    p2: ['Past paper questions: organic', 'Past paper questions: bonding', 'Past paper questions: energy'],
    p3: ['Full past paper, timed', 'Excellence-level explain questions', 'Redo every question you got wrong'],
  },
  phys: {
    p1: ['Mechanics: formula sheet and units', 'Waves: diagrams and definitions', 'Electricity: circuit examples'],
    p2: ['Past paper: mechanics', 'Past paper: waves', 'Past paper: electricity and magnetism'],
    p3: ['Full past paper, timed', 'Redo every question you got wrong', 'Explain-type questions in full sentences'],
  },
  math: {
    p1: ['Algebra: solving and factorising', 'Calculus: differentiation drills', 'Probability: tables and tree diagrams'],
    p2: ['Past paper: algebra', 'Past paper: calculus', 'Past paper: probability'],
    p3: ['Full past paper, timed', 'Excellence questions only', 'Fix the three things you keep getting wrong'],
  },
  dtec: {
    p1: ['Data representation and encoding', 'Human-computer interaction notes', 'Algorithms and complexity summary'],
    p2: ['Past exam questions: explain and justify', 'Write two model answers', 'Compare and contrast questions'],
    p3: ['Full past paper, timed', 'Review marked answers', 'Key terms: define each in one line'],
  },
};

export const BREAK_IDEAS = [
  'Stand up and stretch your arms over your head.',
  'Get a glass of water.',
  'Look out a window at something far away.',
  'Walk to another room and back.',
  'Roll your shoulders, then your neck. Slowly.',
  'Step outside for a minute if you can.',
  'Close your eyes and take five slow breaths.',
  'Shake out your hands and wrists.',
];

function makeBlock(subjectId, hours, note) {
  return { id: uid('b'), subjectId, hours: round25(hours), note: note || '', done: false };
}

// Fair round-robin scheduler for phases 1–3: two subjects a day, hours split
// evenly, least-served (by weight) subject goes first, no subject two days running.
function scheduleFairPhase(phase, days) {
  const served = Object.fromEntries(SUBJECTS.map(s => [s.id, 0]));
  const noteIdx = Object.fromEntries(SUBJECTS.map(s => [s.id, 0]));
  let yesterday = [];
  const out = [];
  for (const key of days) {
    const cap = capFor(key, phase);
    const day = { date: key, blocks: [], isRestDay: isFriday(key), label: HOLIDAYS[key] || '', cap };
    if (cap > 0) {
      const ranked = SUBJECTS
        .map(s => ({ id: s.id, score: served[s.id] / (phase.weights[s.id] || 1) + (yesterday.includes(s.id) ? 0.35 : 0) }))
        .sort((a, b) => a.score - b.score || SUBJECTS.findIndex(s => s.id === a.id) - SUBJECTS.findIndex(s => s.id === b.id));
      const picks = ranked.slice(0, 2).map(r => r.id);
      const each = cap / 2;
      for (const id of picks) {
        const notes = NOTES[id][phase.id];
        day.blocks.push(makeBlock(id, each, notes[noteIdx[id] % notes.length]));
        noteIdx[id]++;
        served[id] += each;
      }
      yesterday = picks;
    }
    out.push(day);
  }
  return out;
}

// Phase 4 is handcrafted around the exam timetable.
function scheduleExamPhase(phase, days) {
  const exams = Object.fromEntries(SUBJECTS.map(s => [s.examDate, s]));
  const plan = {
    '2026-11-09': [['eng3', 2, 'Two essay plans and quote run-through'], ['eng2', 1, 'Unfamiliar texts: one passage']],
    '2026-11-10': [['eng3', 2, 'Light review of quotes and essay plans. Early night.'], ['eng2', 0.5, 'Skim your quote bank']],
    '2026-11-11': [['eng2', 1, 'Afternoon: a light look over essay plans. You have done the work.']],
    '2026-11-12': [],
    '2026-11-14': [['chem', 2, 'Past paper: organic and bonding'], ['phys', 1, 'Mechanics past questions']],
    '2026-11-15': [['chem', 2, 'Past paper: energy; check every explain question'], ['math', 1, 'Calculus past questions']],
    '2026-11-16': [['chem', 1, 'Morning: skim summary notes, then stop by 11am']],
    '2026-11-17': [['phys', 2, 'Past paper: waves and electricity'], ['math', 1, 'Algebra and probability past questions']],
    '2026-11-18': [['phys', 1, 'Morning: formula sheet and one past question'], ['math', 0.5, 'Evening: formula skim only. Early night.']],
    '2026-11-19': [],
    '2026-11-21': [['dtec', 2.5, 'Full past paper, timed']],
    '2026-11-22': [['dtec', 2.5, 'Review marked answers; write model answers']],
    '2026-11-23': [['dtec', 2, 'Explain and justify questions']],
    '2026-11-24': [['dtec', 2, 'Key terms: define each in one line']],
    '2026-11-25': [['dtec', 2, 'Past paper, timed']],
    '2026-11-26': [['dtec', 1.5, 'Light review. Early night.']],
    '2026-11-27': [],
  };
  return days.map(key => {
    const exam = exams[key];
    const blocks = (plan[key] || []).map(([id, h, note]) => makeBlock(id, h, note));
    const day = { date: key, blocks, isRestDay: !exam && isFriday(key), label: '', cap: capFor(key, phase) };
    if (exam) {
      day.isExamDay = true;
      day.examSubjectId = exam.id;
      day.locked = true;
      day.label = `${exam.name} exam · ${exam.examSession === 'AM' ? 'morning' : 'afternoon'}`;
      if (key === '2026-11-27') day.label = 'Last exam · afternoon. Then you are done.';
    }
    return day;
  });
}

export function generatePlan() {
  const days = [];
  for (const phase of PHASES) {
    const keys = eachDay(phase.start, phase.end);
    const chunk = phase.id === 'p4' ? scheduleExamPhase(phase, keys) : scheduleFairPhase(phase, keys);
    for (const d of chunk) d.phaseId = phase.id;
    days.push(...chunk);
  }
  return days;
}

export function defaultSettings() {
  return {
    focusMinutes: 25, shortBreak: 5, longBreak: 20, sessionsBeforeLongBreak: 4,
    soundOn: true, volume: 0.7, confettiOn: true, reducedMotion: 'auto',
    ambientTick: false, waterReminder: false, dailyHoursTarget: 1.5, theme: 'blush',
  };
}

export function seedState() {
  return {
    version: 1,
    createdAt: Date.now(),
    subjects: SUBJECTS.map(s => ({ ...s })),
    planDays: generatePlan(),
    sessions: [],
    settings: defaultSettings(),
    notes: {},      // carry-forward note per subjectId
    parked: [],     // parked thoughts {id, text, createdAt, subjectId, done}
    active: null,   // in-flight session, survives reloads
    meta: { wrapSeen: '', lastSessionId: null },
  };
}

export { dayOfWeek };
