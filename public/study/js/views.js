// The quiet, utilitarian screens: Today, Setup, Plan, Progress, Settings.
// Each export renders into a container and wires its own events.

import * as store from './store.js';
import * as timer from './timer.js';
import * as audio from './audio.js';
import { PHASES, phaseFor, capFor } from './seed.js';
import { go, sheet, confirm, toast, checkbox, fillBar, dot, download, setMotionSetting } from './ui.js';
import { todayKey, fmtLong, fmtShort, fmtDayMonth, fmtRange, fmtHours, fmtMinutes, diffDays, weekStart, addDays,
  isFriday, eachDay, plural, esc, joinNatural, relativeDay, fmtDayName, now, clamp, round25 } from './util.js';

const PRESETS = [
  { id: 'short', name: 'Short', focus: 15, brk: 5, hint: 'Good for drills' },
  { id: 'standard', name: 'Standard', focus: 25, brk: 5, hint: 'The default' },
  { id: 'deep', name: 'Deep', focus: 50, brk: 10, hint: 'For essays' },
];

// Which subject should a session default to right now?
export function suggestedSubject(today = todayKey()) {
  const d = store.day(today);
  if (d && d.blocks.length) {
    const open = d.blocks.find(b => !b.done && store.hoursOn(today, b.subjectId) < b.hours - 0.01);
    return (open || d.blocks[0]).subjectId;
  }
  const next = store.upcomingExams(today)[0];
  return next ? next.id : store.get().subjects[0].id;
}

function phaseLabel(today) {
  const p = phaseFor(today);
  if (!p) return '';
  const week = Math.floor(diffDays(p.start, today) / 7) + 1;
  const weeks = Math.ceil((diffDays(p.start, p.end) + 1) / 7);
  return `${p.name}${weeks > 1 ? ` · week ${week} of ${weeks}` : ''}`;
}

function wrapSentence(today) {
  const hour = new Date(now()).getHours();
  const line = (key, lead) => {
    const sessions = store.sessionsOn(key);
    if (!sessions.length) return '';
    const mins = sessions.reduce((a, s) => a + s.actualMinutes, 0);
    const subjects = [...new Set(sessions.map(s => store.subject(s.subjectId)?.short).filter(Boolean))];
    const goals = sessions.reduce((a, s) => a + (s.goals || []).filter(g => g.done).length, 0);
    return `${lead}: ${fmtMinutes(mins)} across ${joinNatural(subjects)}${goals ? `, ${plural(goals, 'goal')} ticked` : ''}.`;
  };
  if (hour >= 18) return line(today, 'Today');
  if (hour < 12) return line(addDays(today, -1), 'Yesterday');
  return '';
}

// ---------------------------------------------------------------- Today
export function renderToday(root) {
  const today = todayKey();
  const d = store.day(today);
  const subjects = store.get().subjects;
  const blocks = d ? d.blocks : [];
  const planned = blocks.reduce((a, b) => a + b.hours, 0);
  const doneH = store.hoursOn(today);
  const exams = store.upcomingExams(today);
  const nearest = exams[0];
  const streak = store.streak(today);
  const parked = store.openParked();
  const everStudied = store.get().sessions.length > 0;
  const restDay = d ? d.isRestDay : (isFriday(today) && today >= PHASES[0].start && today <= PHASES[3].end);
  const examDay = d && d.isExamDay ? store.subject(d.examSubjectId) : null;
  const beforePlan = today < PHASES[0].start;
  const afterPlan = today > PHASES[3].end;

  let heading;
  if (examDay) heading = `${examDay.name} exam`;
  else if (restDay) heading = 'Rest day';
  else if (blocks.length) heading = joinNatural([...new Set(blocks.map(b => store.subject(b.subjectId)?.short).filter(Boolean))]);
  else if (beforePlan) heading = 'Not started yet';
  else if (afterPlan) heading = 'Exams are done';
  else heading = 'Nothing planned';

  const startLabel = restDay ? 'Light session anyway' : examDay ? 'Light session' : 'Start session';
  const wrap = wrapSentence(today);

  const upcoming = [];
  for (let i = 1; upcoming.length < 4 && i <= 10; i++) {
    const k = addDays(today, i);
    if (k > PHASES[3].end) break;
    const dd = store.day(k);
    if (dd) upcoming.push(dd);
  }

  root.innerHTML = `
  <div class="page wide today">
    <header class="page-head">
      <p class="meta">${esc(fmtLong(today))}${phaseLabel(today) ? ` · ${esc(phaseLabel(today))}` : ''}</p>
      <h1 class="title">${esc(heading)}</h1>
      ${d && d.label && !examDay ? `<p class="meta">${esc(d.label)}</p>` : ''}
    </header>

    <div class="today-grid">
      <section class="today-main">
        ${nearest ? `
        <div class="countdown" aria-label="Next exam">
          <span class="countdown-num">${nearest.daysLeft}</span>
          <span class="countdown-text">${nearest.daysLeft === 1 ? 'day' : 'days'} until <strong>${esc(nearest.name)}</strong>${exams.length > 1 ? `<br><span class="meta">then ${esc(exams[1].short)} ${exams[1].daysLeft - nearest.daysLeft === 1 ? 'the next day' : `${exams[1].daysLeft - nearest.daysLeft} days later`}</span>` : ''}</span>
        </div>` : ''}

        ${examDay ? `<p class="lede">${esc(d.label)}. Nothing else is planned. Breathe, eat something, and trust the work you have done.</p>` : ''}
        ${restDay && !examDay ? `<p class="lede">Nothing planned. Rest is part of the plan. If you feel like a light session, it is here whenever you want it.</p>` : ''}
        ${beforePlan ? `<p class="lede">Your plan starts on ${esc(fmtLong(PHASES[0].start))}. You can still start a session any time.</p>` : ''}
        ${afterPlan ? `<p class="lede">Every exam is behind you. Well done.</p>` : ''}
        ${!restDay && !examDay && !beforePlan && !afterPlan && !blocks.length ? `<p class="lede">Nothing is planned for today. Pick any subject and start.</p>` : ''}

        ${blocks.length ? `
        <div class="today-blocks" aria-label="Today's plan">
          ${blocks.map(b => {
            const s = store.subject(b.subjectId); if (!s) return '';
            const done = store.hoursOn(today, s.id);
            const frac = b.hours ? Math.min(1, done / b.hours) : 0;
            return `
            <article class="subject-card" style="--subject:${esc(s.color)}">
              <div class="subject-card-main">
                <h2 class="subject-name">${esc(s.name)}</h2>
                <p class="subject-note">${esc(b.note || '')}</p>
              </div>
              <div class="subject-card-side">
                <span class="subject-hours">${esc(fmtHours(b.hours))}</span>
                ${done > 0 ? `<span class="meta">${esc(fmtHours(done))} done</span>` : ''}
              </div>
              ${fillBar({ fraction: frac, color: s.color, cls: 'subject-fill' })}
            </article>`;
          }).join('')}
        </div>` : ''}

        <div class="start-actions">
          <button type="button" class="btn primary big round" id="start-session">${esc(startLabel)}</button>
          <button type="button" class="btn ghost" id="start-quick">Start with 5 minutes</button>
        </div>
      </section>

      <aside class="today-side">
        ${(doneH > 0 || planned > 0) ? `
        <section class="side-card today-progress" aria-label="Today's progress">
          <div class="row between">
            <span>${doneH > 0 ? `<strong>${esc(fmtHours(doneH))}</strong> done today` : 'Nothing logged yet today'}</span>
            ${planned ? `<span class="meta">${esc(fmtHours(planned))} planned</span>` : ''}
          </div>
          ${fillBar({ fraction: planned ? doneH / planned : (doneH > 0 ? 1 : 0), cls: 'today-fill' })}
          ${streak > 0 ? `<p class="streak"><span class="streak-mark" aria-hidden="true"></span>${streak === 1 ? 'A new streak started today' : `${streak} days in a row`}</p>`
            : everStudied ? `<p class="meta streak-neutral">New streak starts today.</p>` : ''}
        </section>` : (streak > 0 ? `<p class="streak"><span class="streak-mark" aria-hidden="true"></span>${streak === 1 ? 'A new streak started today' : `${streak} days in a row`}</p>` : everStudied ? `<p class="meta streak-neutral">New streak starts today.</p>` : '')}

        ${wrap ? `<p class="wrap">${esc(wrap)}</p>` : ''}

        ${parked.length ? `
        <section class="side-card parked" aria-label="Parked thoughts">
          <h2 class="h3">Parked thoughts</h2>
          <ul class="list">
            ${parked.map(t => `
              <li class="list-item parked-item">
                <span class="parked-text">${esc(t.text)}</span>
                <button type="button" class="btn small ghost" data-resolve="${esc(t.id)}">Done</button>
              </li>`).join('')}
          </ul>
        </section>` : ''}

        ${upcoming.length ? `
        <section class="side-card coming-up" aria-label="Coming up">
          <h2 class="h3">Coming up</h2>
          <ul class="list compact">
            ${upcoming.map(dd => {
              const exam = dd.isExamDay ? store.subject(dd.examSubjectId) : null;
              const what = exam ? `${esc(exam.short)} exam` : dd.isRestDay ? 'Rest day' : dd.blocks.length ? dd.blocks.map(b => { const sb = store.subject(b.subjectId); return sb ? `<span class="coming-item">${dot(sb.color)}${esc(sb.short)} <span class="meta">${esc(fmtHours(b.hours))}</span></span>` : ''; }).join('') : 'Nothing planned';
              return `<li class="list-item"><span class="coming-day">${esc(fmtDayName(dd.date, true))} <span class="meta">${esc(fmtDayMonth(dd.date))}</span></span><span class="coming-what">${what}</span></li>`;
            }).join('')}
          </ul>
          <a class="btn link inline" href="#/plan">Open the plan</a>
        </section>` : ''}
      </aside>
    </div>
  </div>`;

  root.querySelector('#start-session').addEventListener('click', () => go('#/setup'));
  root.querySelector('#start-quick').addEventListener('click', () => {
    audio.unlock();
    timer.startQuick(suggestedSubject(today));
    go('#/session');
  });
  root.querySelectorAll('[data-resolve]').forEach(b => b.addEventListener('click', () => {
    audio.blip();
    store.resolveParked(b.dataset.resolve);
  }));
}

// ---------------------------------------------------------------- Setup
export function renderSetup(root, params = {}) {
  const today = todayKey();
  const subjects = store.get().subjects;
  let subjectId = params.subject && store.subject(params.subject) ? params.subject : suggestedSubject(today);
  const s0 = store.get().settings;
  let preset = PRESETS.find(p => p.focus === s0.focusMinutes && p.brk === s0.shortBreak) || { id: 'custom', name: 'Custom', focus: s0.focusMinutes, brk: s0.shortBreak, hint: 'From settings' };

  const draw = () => {
    const note = store.noteFor(subjectId);
    const subj = store.subject(subjectId);
    const presets = preset.id === 'custom' ? [...PRESETS, preset] : PRESETS;
    root.innerHTML = `
    <div class="page setup">
      <button type="button" class="btn link back" id="back">Back</button>
      <header class="page-head">
        <h1 class="title">Set up your session</h1>
      </header>

      ${note ? `
      <aside class="carry" aria-label="Note from last time">
        <p class="meta">Last time in ${esc(subj.short)} you wrote</p>
        <p class="carry-text">${esc(note)}</p>
        <button type="button" class="btn small ghost" id="clear-note">Clear</button>
      </aside>` : ''}

      <section class="field-group" role="radiogroup" aria-labelledby="subject-label">
        <p class="label" id="subject-label">Subject</p>
        <div class="chips">
          ${subjects.map(s => `
            <button type="button" role="radio" aria-checked="${s.id === subjectId}" class="chip subject-chip${s.id === subjectId ? ' is-on' : ''}" data-subject="${esc(s.id)}" style="--subject:${esc(s.color)}">
              ${dot(s.color)}${esc(s.short)}
            </button>`).join('')}
        </div>
      </section>

      <section class="field-group" role="radiogroup" aria-labelledby="length-label">
        <p class="label" id="length-label">Length</p>
        <div class="segmented">
          ${presets.map(p => `
            <button type="button" role="radio" aria-checked="${p.id === preset.id}" class="seg${p.id === preset.id ? ' is-on' : ''}" data-preset="${p.id}">
              <span class="seg-name">${esc(p.name)}</span>
              <span class="seg-hint">${p.focus} min focus · ${p.brk} break</span>
            </button>`).join('')}
        </div>
      </section>

      <section class="field-group">
        <p class="label" id="goals-label">Goals for this session <span class="meta">optional, up to three</span></p>
        <div class="stack-sm">
          ${[0, 1, 2].map(i => `<input class="input" type="text" id="goal-${i}" maxlength="120" aria-labelledby="goals-label" placeholder="${['e.g. finish two past paper questions', 'e.g. write the intro paragraph', 'e.g. make flashcards for chapter 3'][i]}" autocomplete="off">`).join('')}
        </div>
      </section>

      <div class="actions">
        <button type="button" class="btn primary big round" id="start">Start session</button>
        <button type="button" class="btn ghost" id="skip">Skip goals and start</button>
      </div>
    </div>`;

    root.querySelector('#back').addEventListener('click', () => go('#/today'));
    root.querySelectorAll('[data-subject]').forEach(b => b.addEventListener('click', () => {
      const goals = readGoals();
      subjectId = b.dataset.subject; draw(); writeGoals(goals);
    }));
    root.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
      const goals = readGoals();
      preset = presets.find(p => p.id === b.dataset.preset); draw(); writeGoals(goals);
    }));
    root.querySelector('#clear-note')?.addEventListener('click', () => { store.setNote(subjectId, ''); draw(); });
    const begin = (useGoals) => {
      audio.unlock();
      const goals = useGoals ? readGoals().filter(Boolean).map(text => ({ text, done: false })) : [];
      timer.start({ subjectId, goals, preset: { focus: preset.focus, short: preset.brk, long: s0.longBreak, beforeLong: s0.sessionsBeforeLongBreak } });
      go('#/session');
    };
    root.querySelector('#start').addEventListener('click', () => begin(true));
    root.querySelector('#skip').addEventListener('click', () => begin(false));
    root.querySelectorAll('.input').forEach((inp, i) => inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); const next = root.querySelector(`#goal-${i + 1}`); next ? next.focus() : begin(true); }
    }));
  };
  const readGoals = () => [0, 1, 2].map(i => (root.querySelector(`#goal-${i}`)?.value || '').trim());
  const writeGoals = (vals) => vals.forEach((v, i) => { const el = root.querySelector(`#goal-${i}`); if (el) el.value = v; });
  draw();
}

// ---------------------------------------------------------------- Plan
let planView = 'week';
let planWeek = null;

export function renderPlan(root, params = {}) {
  const today = todayKey();
  if (params.week) planWeek = weekStart(params.week);
  if (params.view) planView = params.view;
  if (!planWeek) planWeek = weekStart(today < PHASES[0].start ? PHASES[0].start : today > PHASES[3].end ? PHASES[3].end : today);

  root.innerHTML = `
  <div class="page wide plan">
    <header class="page-head plan-head">
      <h1 class="title">Plan</h1>
      <div class="segmented compact" role="tablist" aria-label="Plan view">
        <button type="button" role="tab" class="seg${planView === 'week' ? ' is-on' : ''}" aria-selected="${planView === 'week'}" data-view="week">Week</button>
        <button type="button" role="tab" class="seg${planView === 'phases' ? ' is-on' : ''}" aria-selected="${planView === 'phases'}" data-view="phases">Phases</button>
      </div>
    </header>
    <div id="plan-body"></div>
  </div>`;
  root.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { planView = b.dataset.view; renderPlan(root); }));
  const body = root.querySelector('#plan-body');
  if (planView === 'week') renderWeek(body, today); else renderPhases(body, today);
}

function renderWeek(body, today) {
  const days = store.weekDays(planWeek);
  const end = addDays(planWeek, 6);
  const phase = phaseFor(planWeek) || phaseFor(end);
  const subjects = store.get().subjects;
  const weekPlanned = days.reduce((a, d) => a + store.planHours(d), 0);
  const weekDone = days.reduce((a, d) => a + store.hoursOn(d.date), 0);
  const canShuffle = days.some(d => d.date >= today && !d.isRestDay && !d.isExamDay);

  body.innerHTML = `
    <div class="week-nav">
      <div class="week-title">
        <strong>${esc(fmtRange(planWeek, end))}</strong>
        <span class="meta">${phase ? esc(phase.name) + ' · ' : ''}${esc(fmtHours(weekPlanned))} planned${weekDone > 0 ? ` · ${esc(fmtHours(weekDone))} done` : ''}</span>
      </div>
      <div class="week-buttons">
        <button type="button" class="btn small ghost" id="prev-week">Previous week</button>
        ${planWeek !== weekStart(today) ? `<button type="button" class="btn small ghost" id="this-week">This week</button>` : ''}
        <button type="button" class="btn small ghost" id="next-week">Next week</button>
        ${canShuffle ? `<button type="button" class="btn small ghost push-right" id="reshuffle">Reshuffle this week</button>` : ''}
      </div>
    </div>
    ${phase ? `<p class="meta guardrails">Usual shape: up to ${phase.weekdayCap} h on weekdays, ${phase.weekendCap} h on weekends, two subjects a day, Fridays off. Drag a block to another day to move it.</p>` : ''}

    <div class="plan-days">
      ${days.map(d => dayCard(d, today)).join('')}
    </div>`;

  body.querySelector('#prev-week').addEventListener('click', () => { planWeek = addDays(planWeek, -7); renderWeek(body, today); });
  body.querySelector('#next-week').addEventListener('click', () => { planWeek = addDays(planWeek, 7); renderWeek(body, today); });
  body.querySelector('#this-week')?.addEventListener('click', () => { planWeek = weekStart(today); renderWeek(body, today); });
  body.querySelectorAll('[data-edit-block]').forEach(b => b.addEventListener('click', () => editBlockSheet(b.dataset.day, b.dataset.editBlock)));
  body.querySelectorAll('[data-add-block]').forEach(b => b.addEventListener('click', () => addBlockSheet(b.dataset.addBlock)));
  body.querySelectorAll('[data-toggle-rest]').forEach(b => b.addEventListener('click', async () => {
    const key = b.dataset.toggleRest;
    const d = store.day(key);
    const makingRest = !(d && d.isRestDay);
    if (makingRest && d && d.blocks.length) {
      const ok = await confirm({ title: 'Make this a rest day?', body: `The ${plural(d.blocks.length, 'block')} planned for ${esc(fmtShort(key))} will be removed. You can undo this.`, confirmLabel: 'Make it a rest day' });
      if (!ok) return;
    }
    store.setRestDay(key, makingRest);
    undoToast(makingRest ? 'Rest day set' : 'Study day set');
  }));
  body.querySelector('#reshuffle')?.addEventListener('click', () => reshuffleSheet(today));

  // Drag and drop between days (pointer devices); tap-to-edit covers touch.
  let dragging = null;
  body.querySelectorAll('.plan-block[draggable="true"]').forEach(el => {
    el.addEventListener('dragstart', e => { dragging = { day: el.dataset.day, id: el.dataset.editBlock }; el.classList.add('is-dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', el.dataset.editBlock); });
    el.addEventListener('dragend', () => { dragging = null; el.classList.remove('is-dragging'); body.querySelectorAll('.is-over').forEach(x => x.classList.remove('is-over')); });
  });
  body.querySelectorAll('.plan-day:not(.is-locked)').forEach(card => {
    card.addEventListener('dragover', e => { if (dragging) { e.preventDefault(); card.classList.add('is-over'); } });
    card.addEventListener('dragleave', () => card.classList.remove('is-over'));
    card.addEventListener('drop', e => {
      e.preventDefault(); card.classList.remove('is-over');
      if (!dragging) return;
      const to = card.dataset.day;
      if (to !== dragging.day) {
        const dd = store.day(to);
        if (dd && dd.isRestDay) store.setRestDay(to, false);
        store.moveBlock(dragging.day, dragging.id, to);
        undoToast(`Moved to ${fmtShort(to)}`);
      }
      dragging = null;
    });
  });
}

function dayCard(d, today) {
  const isToday = d.date === today;
  const past = d.date < today;
  const issues = store.dayIssues(d);
  const exam = d.isExamDay ? store.subject(d.examSubjectId) : null;
  const total = store.planHours(d);
  return `
  <article class="plan-day${isToday ? ' is-today' : ''}${past ? ' is-past' : ''}${d.locked ? ' is-locked' : ''}${d.isRestDay ? ' is-rest' : ''}" data-day="${d.date}">
    <header class="plan-day-head">
      <div class="plan-day-title">
        <strong><span class="day-long">${esc(fmtDayName(d.date))}</span><span class="day-short">${esc(fmtDayName(d.date, true))}</span></strong> <span class="meta">${esc(fmtDayMonth(d.date))}${isToday ? ' · today' : ''}</span>
      </div>
      <span class="meta">${exam ? '' : d.isRestDay ? 'Rest day' : total ? esc(fmtHours(total)) : ''}</span>
    </header>
    ${exam ? `<p class="plan-exam">${esc(d.label || `${exam.name} exam`)}</p>` : ''}
    ${d.label && !exam ? `<p class="meta">${esc(d.label)}</p>` : ''}
    ${d.blocks.length ? `<ul class="plan-blocks">
      ${d.blocks.map(b => {
        const s = store.subject(b.subjectId); if (!s) return '';
        const done = store.hoursOn(d.date, s.id);
        const complete = b.done || done >= b.hours - 0.01;
        return `
        <li>
          <button type="button" class="plan-block${complete ? ' is-done' : ''}" data-edit-block="${esc(b.id)}" data-day="${d.date}" ${d.locked ? 'disabled' : 'draggable="true"'} style="--subject:${esc(s.color)}">
            ${dot(s.color)}
            <span class="plan-block-main">
              <span class="plan-block-name">${esc(s.short)}</span>
              <span class="plan-block-hours meta">${esc(fmtHours(b.hours))}${done > 0 && !complete ? ` · ${esc(fmtHours(done))} done` : ''}</span>
              ${b.note ? `<span class="plan-block-note">${esc(b.note)}</span>` : ''}
            </span>
            ${complete ? '<span class="plan-block-tick" aria-label="done">✓</span>' : ''}
          </button>
        </li>`;
      }).join('')}
    </ul>` : ''}
    ${issues.map(n => `<p class="note">${esc(n)}</p>`).join('')}
    ${d.locked ? '' : `
    <footer class="plan-day-foot">
      <button type="button" class="btn small ghost" data-add-block="${d.date}">Add block</button>
      <button type="button" class="btn small ghost" data-toggle-rest="${d.date}" aria-label="${d.isRestDay ? 'Make this a study day' : 'Make this a rest day'}">${d.isRestDay ? 'Study day' : 'Rest day'}</button>
    </footer>`}
  </article>`;
}

function subjectOptions(selected) {
  return store.get().subjects.map(s => `<option value="${esc(s.id)}"${s.id === selected ? ' selected' : ''}>${esc(s.name)}</option>`).join('');
}

function blockForm(b, key) {
  const dayOpts = eachDay(addDays(key, -7), addDays(key, 14)).map(k => `<option value="${k}"${k === key ? ' selected' : ''}>${esc(relativeDay(k))}${isFriday(k) ? ' (rest day)' : ''}</option>`).join('');
  return `
    <div class="form">
      <label class="field"><span class="label">Subject</span>
        <select class="input" name="subjectId">${subjectOptions(b.subjectId)}</select></label>
      <label class="field"><span class="label">Hours</span>
        <div class="stepper">
          <button type="button" class="btn small ghost" data-step="-0.25" aria-label="Less time">−</button>
          <input class="input" type="number" name="hours" min="0.25" max="8" step="0.25" value="${b.hours}" inputmode="decimal">
          <button type="button" class="btn small ghost" data-step="0.25" aria-label="More time">+</button>
        </div></label>
      <label class="field"><span class="label">Note</span>
        <input class="input" type="text" name="note" maxlength="140" value="${esc(b.note || '')}" placeholder="What to work on"></label>
      <label class="field"><span class="label">Day</span>
        <select class="input" name="day">${dayOpts}</select></label>
      ${b.id ? checkbox({ id: 'block-done', checked: !!b.done, label: 'Mark as done', name: 'done' }) : ''}
    </div>`;
}

function readBlockForm(el) {
  const f = el.querySelector('.form');
  return {
    subjectId: f.querySelector('[name=subjectId]').value,
    hours: round25(clamp(Number(f.querySelector('[name=hours]').value) || 0.25, 0.25, 8)),
    note: f.querySelector('[name=note]').value.trim(),
    day: f.querySelector('[name=day]').value,
    done: !!f.querySelector('[name=done]')?.checked,
  };
}

function wireStepper(el) {
  el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const inp = el.querySelector('[name=hours]');
    inp.value = round25(clamp((Number(inp.value) || 0) + Number(b.dataset.step), 0.25, 8));
  }));
}

function editBlockSheet(key, blockId) {
  const d = store.day(key); const b = d && d.blocks.find(x => x.id === blockId);
  if (!b) return;
  sheet({
    title: 'Edit block',
    body: blockForm(b, key),
    onOpen: wireStepper,
    actions: [
      { label: 'Delete', kind: 'danger-ghost', close: false, onClick: async (el) => {
          const ok = await confirm({ title: 'Delete this block?', body: 'You can undo this straight after.', confirmLabel: 'Delete', danger: true });
          if (ok) { store.deleteBlock(key, blockId); undoToast('Block deleted'); }
          return false;
        } },
      { label: 'Cancel', kind: 'ghost' },
      { label: 'Save', kind: 'primary', onClick: (el) => {
          const v = readBlockForm(el);
          store.updateBlock(key, blockId, { subjectId: v.subjectId, hours: v.hours, note: v.note, done: v.done });
          if (v.day !== key) {
            const dd = store.day(v.day);
            if (dd && dd.isRestDay) store.setRestDay(v.day, false);
            store.moveBlock(key, blockId, v.day);
          }
          undoToast('Block saved');
        } },
    ],
  });
}

function addBlockSheet(key) {
  const d = store.day(key);
  const used = new Set((d?.blocks || []).map(b => b.subjectId));
  const pick = store.activeSubjectIds().find(id => !used.has(id)) || store.get().subjects[0].id;
  const phase = phaseFor(key);
  const cap = capFor(key);
  const left = cap ? Math.max(0.25, round25(cap - store.planHours(d || { blocks: [] }))) : 1;
  sheet({
    title: `Add a block to ${relativeDay(key)}`,
    body: blockForm({ subjectId: pick, hours: Math.min(left, 1.5), note: '' }, key),
    onOpen: wireStepper,
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      { label: 'Add block', kind: 'primary', onClick: (el) => {
          const v = readBlockForm(el);
          const target = store.day(v.day);
          if (target && target.isRestDay) store.setRestDay(v.day, false);
          store.addBlock(v.day, v.subjectId, v.hours, v.note);
          undoToast('Block added');
        } },
    ],
  });
}

function reshuffleSheet(today) {
  const subjects = store.get().subjects.filter(s => s.examDate >= today);
  const end = addDays(planWeek, 6);
  sheet({
    title: 'Reshuffle this week',
    body: `
      <p class="meta">Pick the subjects that need more time. The hours already planned for ${esc(fmtRange(Math.max(planWeek, today) === today ? today : planWeek, end))} get redistributed, keeping two subjects a day and the usual daily hours. Days that have already passed stay as they are.</p>
      <div class="stack-sm">
        ${subjects.map(s => checkbox({ id: `boost-${s.id}`, label: s.name, name: s.id })).join('')}
      </div>`,
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      { label: 'Reshuffle', kind: 'primary', onClick: (el) => {
          const boost = Array.from(el.querySelectorAll('input[type=checkbox]:checked')).map(i => i.name);
          const r = store.reshuffleWeek(planWeek, boost, today);
          if (!r.days) { toast('Nothing left to reshuffle this week.'); return; }
          undoToast(`Reshuffled ${plural(r.days, 'day')}`);
        } },
    ],
  });
}

function undoToast(message) {
  toast(message, { action: { label: 'Undo', onClick: () => { const l = store.undo(); if (l) toast('Undone.'); } }, duration: 7000 });
}

function renderPhases(body, today) {
  const subjects = store.get().subjects;
  body.innerHTML = '<div class="phases-grid">' + PHASES.map(p => {
    const keys = eachDay(p.start, p.end);
    const days = keys.map(k => store.day(k)).filter(Boolean);
    const bySubject = Object.fromEntries(subjects.map(s => [s.id, 0]));
    let total = 0;
    for (const d of days) for (const b of d.blocks) { bySubject[b.subjectId] = (bySubject[b.subjectId] || 0) + b.hours; total += b.hours; }
    const isCurrent = today >= p.start && today <= p.end;
    const weeks = [];
    let ws = weekStart(p.start);
    while (ws <= p.end) { weeks.push(keys.filter(k => weekStart(k) === ws)); ws = addDays(ws, 7); }
    return `
    <section class="phase${isCurrent ? ' is-current' : ''}${p.end < today ? ' is-past' : ''}">
      <header class="phase-head">
        <h2 class="h2">${esc(p.name)}${isCurrent ? ' <span class="tag">now</span>' : ''}</h2>
        <p class="meta">${esc(fmtRange(p.start, p.end))} · ${esc(fmtHours(total))} planned</p>
        <p class="phase-blurb">${esc(p.blurb)}</p>
      </header>
      <div class="phase-bars">
        ${subjects.filter(s => bySubject[s.id] > 0).map(s => `
          <div class="bar-row">
            <span class="bar-label">${dot(s.color)}${esc(s.short)}</span>
            ${fillBar({ fraction: total ? bySubject[s.id] / Math.max(...Object.values(bySubject)) : 0, color: s.color })}
            <span class="bar-value">${esc(fmtHours(bySubject[s.id]))}</span>
          </div>`).join('')}
      </div>
      <div class="phase-weeks">
        ${weeks.map(wk => `
          <button type="button" class="phase-week" data-week="${wk[0]}">
            <span class="phase-week-range">${esc(fmtRange(wk[0], wk[wk.length - 1]))}</span>
            <span class="phase-week-days">
              ${wk.map(k => { const d = store.day(k); const exam = d?.isExamDay ? store.subject(d.examSubjectId) : null;
                return `<span class="mini-day${d?.isRestDay ? ' is-rest' : ''}${exam ? ' is-exam' : ''}${k === today ? ' is-today' : ''}" title="${esc(fmtShort(k))}">
                  <span class="mini-day-name">${esc(fmtDayName(k, true)[0])}</span>
                  ${exam ? `<span class="mini-exam" style="background:${esc(exam.color)}"></span>` : (d?.blocks || []).map(b => dot(store.subject(b.subjectId)?.color || '#999')).join('')}
                </span>`; }).join('')}
            </span>
          </button>`).join('')}
      </div>
    </section>`;
  }).join('') + '</div>';
  body.querySelectorAll('[data-week]').forEach(b => b.addEventListener('click', () => {
    planWeek = weekStart(b.dataset.week); planView = 'week'; renderPlan(body.closest('.screen') || body.parentElement.parentElement);
  }));
}

// ---------------------------------------------------------------- Progress
let logExpanded = false;
export function renderProgress(root) {
  const today = todayKey();
  const t = store.totals();
  const subjects = store.get().subjects;
  const maxSubj = Math.max(1, ...Object.values(t.bySubject));
  const firstWeek = weekStart(PHASES[0].start);
  const weeksSince = Math.max(4, Math.min(12, Math.floor(diffDays(firstWeek, today) / 7) + 1));
  const weeks = store.weeklyHours(weeksSince, today);
  const maxWeek = Math.max(1, ...weeks.map(w => w.hours));
  const exams = store.subjectsByExam().map(s => ({ ...s, daysLeft: diffDays(today, s.examDate) }));
  const streak = store.streak(today);
  const sessions = [...store.get().sessions].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  const shown = logExpanded ? sessions : sessions.slice(0, 12);

  root.innerHTML = `
  <div class="page wide progress">
    <header class="page-head"><h1 class="title">Progress</h1></header>

    <section class="stats" aria-label="Totals">
      <div class="stat"><span class="stat-num">${esc(fmtHours(t.hours))}</span><span class="stat-label">studied</span></div>
      <div class="stat"><span class="stat-num">${t.sessions}</span><span class="stat-label">${t.sessions === 1 ? 'session' : 'sessions'}</span></div>
      <div class="stat"><span class="stat-num">${t.goalsDone}</span><span class="stat-label">${t.goalsDone === 1 ? 'goal ticked' : 'goals ticked'}</span></div>
      <div class="stat${streak > 0 ? ' stat-amber' : ''}"><span class="stat-num">${streak}</span><span class="stat-label">${streak === 1 ? 'day in a row' : 'days in a row'}</span></div>
    </section>

    ${t.sessions === 0 ? `<p class="lede">Nothing logged yet. Your first session will show up here, and every one after it.</p>` : ''}

    <div class="two-col">
      <section aria-labelledby="h-subjects">
        <h2 class="h2" id="h-subjects">Hours by subject</h2>
        <div class="bars">
          ${subjects.map(s => `
            <div class="bar-row">
              <span class="bar-label">${dot(s.color)}${esc(s.short)}</span>
              ${fillBar({ fraction: t.bySubject[s.id] / maxSubj, color: s.color })}
              <span class="bar-value">${esc(fmtHours(t.bySubject[s.id] / 60))}</span>
            </div>`).join('')}
        </div>
      </section>

      <section aria-labelledby="h-weeks">
        <h2 class="h2" id="h-weeks">Hours by week</h2>
        <div class="columns" role="img" aria-label="${esc(weeks.map(w => `${fmtRange(w.start, w.end)}: ${fmtHours(w.hours)}`).join('. '))}">
          ${weeks.map(w => `
            <div class="column${w.start === weekStart(today) ? ' is-current' : ''}">
              <span class="column-value">${w.hours > 0 ? esc(fmtHours(w.hours)) : ''}</span>
              <div class="column-track"><div class="column-bar" style="height:${Math.round(w.hours / maxWeek * 100)}%"></div></div>
              <span class="column-label">${esc(fmtDayMonth(w.start))}</span>
            </div>`).join('')}
        </div>
      </section>
    </div>

    <section aria-labelledby="h-exams">
      <h2 class="h2" id="h-exams">Exams</h2>
      <div class="exam-chips">
        ${exams.map((s, i) => `
          <div class="exam-chip${s.daysLeft < 0 ? ' is-past' : ''}${i === exams.findIndex(x => x.daysLeft >= 0) ? ' is-near' : ''}" style="--subject:${esc(s.color)}">
            <span class="exam-chip-name">${esc(s.name)}</span>
            <span class="exam-chip-days">${s.daysLeft < 0 ? 'done' : s.daysLeft === 0 ? 'today' : `${s.daysLeft} ${s.daysLeft === 1 ? 'day' : 'days'}`}</span>
            <span class="meta">${esc(fmtShort(s.examDate))} · ${s.examSession}</span>
          </div>`).join('')}
      </div>
    </section>

    ${sessions.length ? `
    <section aria-labelledby="h-log">
      <h2 class="h2" id="h-log">Session log</h2>
      <div class="table-wrap">
        <table class="log">
          <thead><tr><th scope="col">When</th><th scope="col">Subject</th><th scope="col">Length</th><th scope="col">Goals</th><th scope="col">Note for next time</th></tr></thead>
          <tbody>
            ${shown.map(s => { const sub = store.subject(s.subjectId); const g = s.goals || []; return `
              <tr class="log-row">
                <td>${esc(relativeDay(s.date, today))}<span class="meta log-time"> · ${new Date(s.startedAt || 0).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></td>
                <td><span class="bar-label">${dot(sub?.color || '#999')}${esc(sub?.short || 'Subject')}</span></td>
                <td>${esc(fmtMinutes(s.actualMinutes))}${s.blocksCompleted ? `<span class="meta"> · ${plural(s.blocksCompleted, 'block')}</span>` : ''}</td>
                <td>${g.length ? `${g.filter(x => x.done).length} of ${g.length}` : '<span class="meta">none set</span>'}</td>
                <td class="log-note">${s.reflection ? esc(s.reflection) : ''}</td>
              </tr>`; }).join('')}
          </tbody>
        </table>
      </div>
      ${sessions.length > 12 ? `<button type="button" class="btn ghost small" id="log-more">${logExpanded ? 'Show fewer' : `Show all ${sessions.length}`}</button>` : ''}
    </section>` : ''}
  </div>`;
  root.querySelector('#log-more')?.addEventListener('click', () => { logExpanded = !logExpanded; renderProgress(root); });
}

// ---------------------------------------------------------------- Settings
export function renderSettings(root, { memoryOnly = false, installPrompt = null } = {}) {
  const s = store.get().settings;
  const switchRow = (key, label, hint = '') => `
    <label class="field row between switch-row">
      <span><span class="field-label">${esc(label)}</span>${hint ? `<span class="meta">${esc(hint)}</span>` : ''}</span>
      <input type="checkbox" class="switch" name="${key}" ${s[key] ? 'checked' : ''}>
    </label>`;
  const numRow = (key, label, min, max, step = 1, unit = 'min') => `
    <label class="field row between">
      <span class="field-label">${esc(label)}</span>
      <span class="num-unit"><input class="input num" type="number" name="${key}" min="${min}" max="${max}" step="${step}" value="${s[key]}" inputmode="numeric"> <span class="meta">${unit}</span></span>
    </label>`;

  root.innerHTML = `
  <div class="page wide settings">
    <header class="page-head"><h1 class="title">Settings</h1></header>
    ${memoryOnly ? `<p class="note">Saving is not available in this browser, so changes last only until you close the tab. Export a backup before you leave.</p>` : ''}
    <div class="settings-grid">

    <section class="settings-group" aria-labelledby="h-timer">
      <h2 class="h2" id="h-timer">Timer</h2>
      <div class="segmented compact presets">
        ${PRESETS.map(p => `<button type="button" class="seg${s.focusMinutes === p.focus && s.shortBreak === p.brk ? ' is-on' : ''}" data-preset="${p.id}">${p.name} <span class="seg-hint">${p.focus}/${p.brk}</span></button>`).join('')}
      </div>
      ${numRow('focusMinutes', 'Focus block', 5, 120)}
      ${numRow('shortBreak', 'Short break', 1, 30)}
      ${numRow('longBreak', 'Long break', 5, 60)}
      ${numRow('sessionsBeforeLongBreak', 'Blocks before a long break', 0, 8, 1, 'blocks')}
      ${numRow('dailyHoursTarget', 'Target on days with nothing planned', 0.25, 8, 0.25, 'hours')}
    </section>

    <section class="settings-group" aria-labelledby="h-sound">
      <h2 class="h2" id="h-sound">Sound and motion</h2>
      ${switchRow('soundOn', 'Sound')}
      <label class="field row between">
        <span class="field-label">Volume</span>
        <input type="range" class="range" name="volume" min="0" max="1" step="0.05" value="${s.volume}">
      </label>
      <div class="row gap">
        <button type="button" class="btn small ghost" id="preview-bell">Play the bell</button>
        <button type="button" class="btn small ghost" id="preview-blip">Play the tick</button>
      </div>
      ${switchRow('ambientTick', 'Gentle tick during focus', 'A very quiet click each second')}
      ${switchRow('waterReminder', 'Water and stand reminder', 'Only during breaks')}
      ${switchRow('confettiOn', 'Confetti when a block ends')}
      <label class="field row between">
        <span class="field-label">Reduce motion</span>
        <select class="input" name="reducedMotion">
          <option value="auto"${s.reducedMotion === 'auto' ? ' selected' : ''}>Follow the phone</option>
          <option value="on"${s.reducedMotion === 'on' ? ' selected' : ''}>On</option>
          <option value="off"${s.reducedMotion === 'off' ? ' selected' : ''}>Off</option>
        </select>
      </label>
      <label class="field row between">
        <span class="field-label">Theme</span>
        <select class="input" name="theme">
          <option value="blush"${s.theme === 'blush' ? ' selected' : ''}>Blush</option>
          <option value="dusk"${s.theme === 'dusk' ? ' selected' : ''}>Dusk</option>
        </select>
      </label>
    </section>

    <section class="settings-group" aria-labelledby="h-data">
      <h2 class="h2" id="h-data">Your data</h2>
      <p class="meta">Everything lives on this device. A backup is a small file you can keep anywhere.</p>
      <div class="row gap wrap-row">
        <button type="button" class="btn ghost" id="export">Export backup</button>
        <button type="button" class="btn ghost" id="import">Import backup</button>
        <input type="file" id="import-file" accept="application/json,.json" hidden>
      </div>
      <div class="row gap">
        <button type="button" class="btn danger-ghost" id="reset">Reset everything</button>
      </div>
    </section>

    <section class="settings-group" aria-labelledby="h-app">
      <h2 class="h2" id="h-app">Install as an app</h2>
      <p class="meta">The app works offline once it has loaded. ${installPrompt ? 'You can install it so it opens in its own window.' : 'In Chrome or Edge, use the install icon at the right of the address bar to open it in its own window. On a phone, use “Add to Home Screen” from the browser menu.'}</p>
      ${installPrompt ? `<button type="button" class="btn ghost" id="install">Install</button>` : ''}
      <p class="meta">Keyboard: during a focus block, Space pauses and resumes. Escape closes any dialog.</p>
    </section>
    </div>
  </div>`;

  const commit = (patch) => { store.setSettings(patch); audio.configure(store.get().settings); };
  root.querySelectorAll('input[type=number]').forEach(inp => inp.addEventListener('change', () => {
    const v = clamp(Number(inp.value) || Number(inp.min), Number(inp.min), Number(inp.max));
    inp.value = v; commit({ [inp.name]: v });
    root.querySelectorAll('[data-preset]').forEach(b => { const p = PRESETS.find(x => x.id === b.dataset.preset); b.classList.toggle('is-on', store.get().settings.focusMinutes === p.focus && store.get().settings.shortBreak === p.brk); });
  }));
  root.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
    const p = PRESETS.find(x => x.id === b.dataset.preset);
    commit({ focusMinutes: p.focus, shortBreak: p.brk });
    root.querySelector('[name=focusMinutes]').value = p.focus; root.querySelector('[name=shortBreak]').value = p.brk;
    root.querySelectorAll('[data-preset]').forEach(x => x.classList.toggle('is-on', x === b));
  }));
  root.querySelectorAll('.switch').forEach(sw => sw.addEventListener('change', () => { commit({ [sw.name]: sw.checked }); if (sw.name === 'soundOn' && sw.checked) audio.blip(); }));
  root.querySelector('[name=volume]').addEventListener('input', e => commit({ volume: Number(e.target.value) }));
  root.querySelector('[name=volume]').addEventListener('change', () => audio.blip());
  root.querySelector('#preview-bell').addEventListener('click', () => { audio.unlock(); audio.ding(); });
  root.querySelector('#preview-blip').addEventListener('click', () => { audio.unlock(); audio.blip(); });
  root.querySelector('[name=reducedMotion]').addEventListener('change', e => { commit({ reducedMotion: e.target.value }); setMotionSetting(e.target.value); });
  root.querySelector('[name=theme]').addEventListener('change', e => { commit({ theme: e.target.value }); document.documentElement.dataset.theme = e.target.value; });

  root.querySelector('#export').addEventListener('click', () => download(`study-companion-${todayKey()}.json`, store.exportJSON()));
  root.querySelector('#import').addEventListener('click', () => root.querySelector('#import-file').click());
  root.querySelector('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const ok = await confirm({ title: 'Replace everything with this backup?', body: `It has ${plural((parsed.sessions || []).length, 'session')} and ${plural((parsed.planDays || []).length, 'plan day')}. Your current data will be replaced.`, confirmLabel: 'Replace' });
      if (!ok) return;
      store.importJSON(text);
      audio.configure(store.get().settings);
      toast('Backup imported.');
      go('#/today');
    } catch (err) {
      toast(err.message || 'That file could not be read.');
    } finally { e.target.value = ''; }
  });
  root.querySelector('#reset').addEventListener('click', async () => {
    const ok = await confirm({ title: 'Reset everything?', body: 'Your sessions, notes and plan edits will be removed and the original plan restored. Export a backup first if you might want them back.', confirmLabel: 'Reset', danger: true });
    if (!ok) return;
    const sure = await confirm({ title: 'Last check', body: 'This cannot be undone.', confirmLabel: 'Yes, reset', danger: true });
    if (!sure) return;
    store.resetAll();
    audio.configure(store.get().settings);
    document.documentElement.dataset.theme = store.get().settings.theme;
    toast('Fresh start.');
    go('#/today');
  });
  root.querySelector('#install')?.addEventListener('click', async () => {
    try { installPrompt.prompt(); await installPrompt.userChoice; } catch { /* ignore */ }
  });
}

export { PRESETS };
