// The hero of the app: the focus session, its breaks, and the completion
// screen. Nothing else is on screen while a session runs.

import * as store from './store.js';
import * as timer from './timer.js';
import * as audio from './audio.js';
import * as confetti from './confetti.js';
import { BREAK_IDEAS } from './seed.js';
import { go, sheet, toast, checkbox, bounce, ringSVG, setRing, fillBar, reducedMotion } from './ui.js';
import { fmtClock, fmtMinutes, fmtHours, todayKey, esc, plural, now, MIN_MS } from './util.js';

let lastCelebrationAt = 0;

function settings() { return store.get().settings; }

function celebrate({ ding = true } = {}) {
  lastCelebrationAt = Date.now();
  if (ding) audio.ding();
  confetti.burst({ enabled: settings().confettiOn, reducedMotion: reducedMotion() });
}

// ---------------------------------------------------------------- Session
export function mountSession(root) {
  let shownPhase = null;
  let holdUntil = 0;
  let parkOpen = false;
  const baseTitle = document.title;

  const render = () => {
    const a = timer.active();
    if (!a) return;
    const samePhase = shownPhase === a.phase;
    const focusedId = root.contains(document.activeElement) ? document.activeElement.id : '';
    shownPhase = a.phase;
    const subj = store.subject(a.subjectId) || { name: 'Study', short: 'Study', color: '#E0457B' };
    if (a.phase === 'focus') renderFocus(a, subj);
    else if (a.phase === 'break') renderBreak(a, subj);
    else if (a.phase === 'prompt') renderPrompt(a, subj);
    else if (a.phase === 'ready') renderReady(a, subj);
    updateClock();
    // Keep keyboard focus on the same control when the screen re-renders in place.
    if (samePhase && focusedId) root.querySelector(`#${focusedId}`)?.focus({ preventScroll: true });
    else if (!samePhase) { const primary = root.querySelector('.btn.primary, #pause, #extend-break'); if (primary && focusedId) primary.focus({ preventScroll: true }); }
  };

  const renderFocus = (a, subj) => {
    const { fraction } = timer.remaining(a);
    const totalMin = Math.round((a.segEnd - a.segStart) / MIN_MS);
    root.innerHTML = `
    <div class="session focus${a.pausedAt ? ' is-paused' : ''}" data-phase="focus" style="--subject:${esc(subj.color)}">
      <p class="session-meta">${a.quick ? 'Just 5 minutes' : `Block ${a.blockIndex} · ${totalMin} min`}</p>
      <div class="ring-wrap">
        ${ringSVG({ fraction, cls: 'ring-focus', stroke: 5 })}
        <div class="clock" role="timer" aria-live="off">
          <span class="clock-digits" id="clock">${fmtClock(timer.remaining(a).ms)}</span>
          <span class="clock-state" id="clock-state">${a.pausedAt ? 'paused' : ''}</span>
        </div>
      </div>
      <h1 class="session-subject">${esc(subj.name)}</h1>
      ${a.goals.length ? `<ul class="session-goals">${a.goals.map((g, i) => `<li>${checkbox({ id: `sg-${i}`, checked: g.done, label: g.text })}</li>`).join('')}</ul>` : ''}
      <div class="session-controls">
        <button type="button" class="btn ctrl" id="pause">${a.pausedAt ? 'Resume' : 'Pause'}</button>
        <button type="button" class="btn ctrl" id="extend">Add 5 min</button>
        <button type="button" class="btn ctrl quiet" id="end">End</button>
      </div>
      <div class="park">
        <button type="button" class="btn link park-btn" id="park-toggle" aria-expanded="${parkOpen}">Park a thought</button>
        <form class="park-form" id="park-form" ${parkOpen ? '' : 'hidden'}>
          <input class="input" type="text" id="park-text" maxlength="200" placeholder="Type it, park it, come back to it later" autocomplete="off">
          <button type="submit" class="btn small primary">Park it</button>
        </form>
      </div>
    </div>`;

    root.querySelector('#pause').addEventListener('click', () => { audio.unlock(); timer.isPaused() ? timer.resume() : timer.pause(); });
    root.querySelector('#extend').addEventListener('click', () => { audio.unlock(); timer.extend(5); toast('Five more minutes.'); });
    root.querySelector('#end').addEventListener('click', endSheet);
    root.querySelectorAll('.session-goals input').forEach((inp, i) => inp.addEventListener('change', () => {
      const done = timer.toggleGoal(i);
      const label = inp.closest('.check');
      label.classList.toggle('is-checked', done);
      if (done) { audio.blip(); bounce(label.querySelector('.check-box')); }
    }));
    const form = root.querySelector('#park-form');
    const toggle = root.querySelector('#park-toggle');
    toggle.addEventListener('click', () => {
      parkOpen = !parkOpen;
      form.hidden = !parkOpen;
      toggle.setAttribute('aria-expanded', String(parkOpen));
      if (parkOpen) root.querySelector('#park-text').focus();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = root.querySelector('#park-text');
      if (timer.park(inp.value)) { audio.blip(); toast('Parked. It will be waiting on Today.'); }
      inp.value = '';
      parkOpen = false; form.hidden = true; toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    });
    root.querySelector('#park-text').addEventListener('keydown', e => { if (e.key === 'Escape') { parkOpen = false; form.hidden = true; toggle.focus(); } });
  };

  const renderBreak = (a, subj) => {
    const { fraction } = timer.remaining(a);
    const minutes = Math.round((a.segEnd - a.segStart) / MIN_MS);
    const s = settings();
    const idx = (a.breaksTaken + new Date(now()).getDate()) % BREAK_IDEAS.length;
    const idea = s.waterReminder ? (a.breaksTaken % 2 ? 'Stand up and move for a minute.' : 'Get a glass of water.') : BREAK_IDEAS[idx];
    root.innerHTML = `
    <div class="session break" data-phase="break" style="--subject:${esc(subj.color)}">
      <p class="session-meta">${a.breakIsLong ? 'Long break' : 'Break'} · ${minutes} min</p>
      <div class="ring-wrap">
        ${ringSVG({ fraction, cls: 'ring-break', stroke: 4 })}
        <div class="clock" role="timer" aria-live="off">
          <span class="clock-digits" id="clock">${fmtClock(timer.remaining(a).ms)}</span>
          <span class="clock-state" id="clock-state"></span>
        </div>
      </div>
      <p class="break-idea">${esc(idea)}</p>
      <p class="session-meta">Then block ${a.blockIndex + 1} · ${a.preset.focus} min of ${esc(subj.short)}</p>
      <div class="session-controls">
        <button type="button" class="btn ctrl" id="extend-break" ${a.breakExtended ? 'disabled' : ''}>${a.breakExtended ? 'Extended' : 'Extend 5 min'}</button>
        <button type="button" class="btn ctrl" id="skip-break">Start now</button>
        <button type="button" class="btn ctrl quiet" id="finish">Finish</button>
      </div>
    </div>`;
    root.querySelector('#extend-break').addEventListener('click', () => { audio.unlock(); if (timer.extendBreak(5)) render(); });
    root.querySelector('#skip-break').addEventListener('click', () => { audio.unlock(); timer.skipBreak(); });
    root.querySelector('#finish').addEventListener('click', finish);
  };

  const renderPrompt = (a, subj) => {
    root.innerHTML = `
    <div class="session prompt" data-phase="prompt" style="--subject:${esc(subj.color)}">
      <p class="session-meta">Five minutes done</p>
      <div class="ring-wrap small">${ringSVG({ fraction: 1, cls: 'ring-focus is-full', stroke: 5 })}<div class="clock"><span class="clock-digits">5:00</span></div></div>
      <h1 class="session-subject">Keep going?</h1>
      <p class="lede center">You are in it now. A full block is ${a.preset.focus} minutes.</p>
      <div class="stack-sm center">
        <button type="button" class="btn primary big round" id="keep">Yes, ${a.preset.focus} more minutes</button>
        <button type="button" class="btn ghost" id="finish">Finish here</button>
      </div>
    </div>`;
    root.querySelector('#keep').addEventListener('click', () => { audio.unlock(); timer.startNextBlock(); });
    root.querySelector('#finish').addEventListener('click', finish);
  };

  const renderReady = (a, subj) => {
    root.innerHTML = `
    <div class="session ready" data-phase="ready" style="--subject:${esc(subj.color)}">
      <p class="session-meta">Break is over</p>
      <div class="ring-wrap small">${ringSVG({ fraction: 1, cls: 'ring-focus is-full', stroke: 5 })}<div class="clock"><span class="clock-digits">${a.preset.focus}:00</span></div></div>
      <h1 class="session-subject">Ready for block ${a.blockIndex + 1}?</h1>
      <p class="lede center">${esc(subj.name)} · ${plural(Math.round(a.focusMs / MIN_MS), 'minute')} so far.</p>
      <div class="stack-sm center">
        <button type="button" class="btn primary big round" id="next">Start block ${a.blockIndex + 1}</button>
        <button type="button" class="btn ghost" id="finish">Finish session</button>
      </div>
    </div>`;
    root.querySelector('#next').addEventListener('click', () => { audio.unlock(); timer.startNextBlock(); });
    root.querySelector('#finish').addEventListener('click', finish);
  };

  const updateClock = () => {
    const a = timer.active(); if (!a) return;
    if (a.phase !== 'focus' && a.phase !== 'break') { document.title = baseTitle; return; }
    const { ms, fraction } = timer.remaining(a);
    const digits = root.querySelector('#clock');
    if (digits) { const txt = fmtClock(ms); if (digits.textContent !== txt) digits.textContent = txt; }
    setRing(root.querySelector('.ring'), fraction);
    const subj = store.subject(a.subjectId);
    document.title = `${fmtClock(ms)} · ${a.phase === 'break' ? 'Break' : (subj ? subj.short : 'Focus')}`;
  };

  const finish = () => {
    audio.unlock();
    const rec = timer.end();
    document.title = baseTitle;
    if (rec) go(`#/complete?id=${rec.id}`, true);
    else { toast('Nothing logged this time. Whenever you are ready.'); go('#/today', true); }
  };

  const endSheet = () => {
    const a = timer.active(); if (!a) return;
    const t = now();
    const doneMs = a.focusMs + (a.phase === 'focus' && !a.pausedAt ? Math.max(0, t - a.runFrom) : 0);
    const mins = Math.round(doneMs / MIN_MS);
    const worth = doneMs >= 30 * 1000;
    sheet({
      title: 'End this session?',
      body: `<p>${worth ? `You have done ${plural(Math.max(1, mins), 'minute')}. That counts, and it will be logged.` : 'Nothing to log yet, and that is fine.'}</p>`,
      actions: [
        { label: 'Keep going', kind: 'ghost' },
        { label: worth ? 'End and log it' : 'End', kind: 'primary', onClick: () => { if (worth) finish(); else { timer.abandon(); go('#/today', true); } } },
      ],
    });
  };

  const off = timer.on((kind, extra) => {
    const a = timer.active();
    if (kind === 'end') return;
    if (kind === 'block-complete') {
      const el = root.querySelector('.session');
      if (el) el.classList.add('is-complete');
      const digits = root.querySelector('#clock'); if (digits) digits.textContent = '0:00';
      setRing(root.querySelector('.ring'), 0);
      celebrate({ ding: !extra.dingAlready });
      const hold = reducedMotion() ? 900 : 1500;
      holdUntil = performance.now() + hold;
      setTimeout(() => { holdUntil = 0; render(); }, hold);
      return;
    }
    if (kind === 'break-start') { if (!extra.silent) audio.breakStart(); return; }
    if (kind === 'ready' || kind === 'focus-start' || kind === 'pause' || kind === 'resume' || kind === 'extend-break') {
      if (performance.now() < holdUntil) return;
      render(); return;
    }
    if (kind === 'tick') {
      if (!a) return;
      if (a.phase !== shownPhase) { if (performance.now() < holdUntil) return; render(); return; }
      updateClock();
    }
  });

  render();
  return () => { off(); document.title = baseTitle; };
}

// ---------------------------------------------------------------- Complete
export function renderComplete(root, params = {}) {
  const rec = store.session(params.id) || store.session(store.get().meta.lastSessionId);
  if (!rec) { go('#/today', true); return; }
  const subj = store.subject(rec.subjectId) || { name: 'Study', short: 'Study', color: '#E0457B' };
  const today = todayKey();
  const todayMins = store.minutesOn(rec.date);
  const d = store.day(rec.date);
  const planned = d ? store.planHours(d) : 0;
  const parkedHere = store.get().parked.filter(t => t.sessionId === rec.id);

  root.innerHTML = `
  <div class="page complete" style="--subject:${esc(subj.color)}">
    <header class="page-head">
      <p class="meta">Session logged</p>
      <h1 class="title">${esc(fmtMinutes(rec.actualMinutes))} of ${esc(subj.short)}</h1>
      <p class="meta">${rec.blocksCompleted ? `${plural(rec.blocksCompleted, 'block')} finished` : 'Started, and that counts'}${rec.breaksTaken ? ` · ${plural(rec.breaksTaken, 'break')}` : ''}</p>
    </header>

    <section class="today-progress" aria-label="Today's total">
      <div class="row between">
        <span><strong>${esc(fmtHours(todayMins / 60))}</strong> ${rec.date === today ? 'today' : `on ${esc(rec.date)}`}</span>
        ${planned ? `<span class="meta">${esc(fmtHours(planned))} planned</span>` : ''}
      </div>
      ${fillBar({ fraction: planned ? todayMins / 60 / planned : 1, cls: 'today-fill' })}
    </section>

    ${rec.goals.length ? `
    <section class="field-group">
      <p class="label">What did you get done?</p>
      <ul class="goal-list">
        ${rec.goals.map((g, i) => `<li>${checkbox({ id: `cg-${i}`, checked: g.done, label: g.text })}</li>`).join('')}
      </ul>
    </section>` : ''}

    ${parkedHere.length ? `
    <section class="field-group">
      <p class="label">Parked thoughts</p>
      <ul class="list">${parkedHere.map(t => `<li class="list-item"><span>${esc(t.text)}</span></li>`).join('')}</ul>
      <p class="meta">They are waiting for you on Today.</p>
    </section>` : ''}

    <section class="field-group">
      <label class="label" for="reflection">Anything to pick up next time?</label>
      <input class="input" type="text" id="reflection" maxlength="160" value="${esc(rec.reflection || '')}" placeholder="e.g. start from question 4" autocomplete="off">
      <p class="meta">This will be at the top of your next ${esc(subj.short)} session.</p>
    </section>

    <div class="actions">
      <button type="button" class="btn primary big round" id="done">Done</button>
      <button type="button" class="btn ghost" id="again">Start another session</button>
    </div>
  </div>`;

  root.querySelectorAll('.goal-list input').forEach((inp, i) => inp.addEventListener('change', () => {
    const goals = rec.goals.map((g, j) => j === i ? { ...g, done: inp.checked } : g);
    store.patchSession(rec.id, { goals });
    const label = inp.closest('.check');
    label.classList.toggle('is-checked', inp.checked);
    if (inp.checked) { audio.blip(); bounce(label.querySelector('.check-box')); }
  }));
  const refl = root.querySelector('#reflection');
  const saveReflection = () => {
    const text = refl.value.trim();
    store.patchSession(rec.id, { reflection: text });
    store.setNote(rec.subjectId, text);
  };
  refl.addEventListener('change', saveReflection);
  refl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveReflection(); root.querySelector('#done').focus(); } });
  root.querySelector('#done').addEventListener('click', () => { saveReflection(); go('#/today'); });
  root.querySelector('#again').addEventListener('click', () => { saveReflection(); go(`#/setup?subject=${rec.subjectId}`); });

  if (Date.now() - lastCelebrationAt > 60 * 1000 && rec.actualMinutes >= 1) {
    setTimeout(() => celebrate({ ding: true }), 120);
  }
}
