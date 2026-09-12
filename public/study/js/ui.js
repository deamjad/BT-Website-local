// Shared UI pieces: toasts, sheets, the progress ring, goal checkboxes, and
// the tiny hash router used by every screen.

import { esc } from './util.js';

// ---------- routing ----------
export function go(route, replace = false) {
  const hash = route.startsWith('#') ? route : `#${route}`;
  if (replace) history.replaceState(null, '', hash); else location.hash = hash;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}
export function currentRoute() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = h.split('?');
  return { path: path || 'today', params: Object.fromEntries(new URLSearchParams(query)) };
}

// ---------- motion ----------
const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
let motionSetting = 'auto';
export function setMotionSetting(v) { motionSetting = v || 'auto'; applyMotion(); }
export function reducedMotion() {
  if (motionSetting === 'on') return true;
  if (motionSetting === 'off') return false;
  return !!(mq && mq.matches);
}
export function applyMotion() {
  document.documentElement.dataset.motion = reducedMotion() ? 'reduced' : 'full';
}
if (mq) mq.addEventListener?.('change', applyMotion);

// ---------- toasts ----------
let toastEl = null, toastTimer = null;
export function toast(message, { action = null, duration = 5000 } = {}) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  clearTimeout(toastTimer);
  toastEl.innerHTML = `<span class="toast-text">${esc(message)}</span>${action ? `<button type="button" class="toast-action">${esc(action.label)}</button>` : ''}`;
  if (action) toastEl.querySelector('.toast-action').addEventListener('click', () => { hideToast(); action.onClick(); });
  toastEl.classList.add('is-on');
  toastTimer = setTimeout(hideToast, duration);
}
export function hideToast() { if (toastEl) toastEl.classList.remove('is-on'); }

// ---------- sheets ----------
let openSheet = null;
export function sheet({ title = '', body = '', actions = [], onOpen = null, wide = false, label = '' }) {
  closeSheet();
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `
    <div class="sheet-backdrop"></div>
    <div class="sheet${wide ? ' sheet-wide' : ''}" role="dialog" aria-modal="true" ${title ? 'aria-labelledby="sheet-title"' : `aria-label="${esc(label || 'Dialog')}"`}>
      ${title ? `<h2 class="sheet-title" id="sheet-title">${esc(title)}</h2>` : ''}
      <div class="sheet-body">${body}</div>
      ${actions.length ? `<div class="sheet-actions">${actions.map((a, i) => `<button type="button" class="btn ${a.kind || 'ghost'}" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}
    </div>`;
  document.body.appendChild(wrap);
  document.body.classList.add('has-sheet');
  const previouslyFocused = document.activeElement;
  const el = wrap.querySelector('.sheet');
  const close = () => {
    if (openSheet !== wrap) return;
    wrap.classList.remove('is-on');
    document.body.classList.remove('has-sheet');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => wrap.remove(), 220);
    openSheet = null;
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus({ preventScroll: true });
  };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables(el);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.sheet-backdrop').addEventListener('click', close);
  wrap.querySelectorAll('.sheet-actions .btn').forEach(b => {
    b.addEventListener('click', () => {
      const a = actions[Number(b.dataset.i)];
      const keep = a.onClick ? a.onClick(el) === false : false;
      if (!keep && a.close !== false) close();
    });
  });
  openSheet = wrap;
  requestAnimationFrame(() => {
    wrap.classList.add('is-on');
    const f = focusables(el);
    const first = el.querySelector('[autofocus]') || f.find(x => !x.classList.contains('ghost')) || f[0];
    if (first) first.focus({ preventScroll: true });
  });
  if (onOpen) onOpen(el, close);
  return close;
}
export function closeSheet() {
  if (!openSheet) return;
  const wrap = openSheet;
  openSheet = null;
  wrap.classList.remove('is-on');
  document.body.classList.remove('has-sheet');
  setTimeout(() => wrap.remove(), 220);
}
function focusables(root) {
  return Array.from(root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(x => !x.disabled);
}

export function confirm({ title, body = '', confirmLabel = 'Yes', cancelLabel = 'Cancel', danger = false }) {
  return new Promise(resolve => {
    let settled = false;
    const done = v => { if (!settled) { settled = true; resolve(v); } };
    sheet({
      title, body: body ? `<p>${body}</p>` : '',
      actions: [
        { label: cancelLabel, kind: 'ghost', onClick: () => done(false) },
        { label: confirmLabel, kind: danger ? 'danger' : 'primary', onClick: () => done(true) },
      ],
      onOpen: (el) => {
        const obs = new MutationObserver(() => { if (!document.body.contains(el)) { done(false); obs.disconnect(); } });
        obs.observe(document.body, { childList: true });
      },
    });
  });
}

// ---------- ring ----------
export const RING_R = 45;
export const RING_C = 2 * Math.PI * RING_R;
export function ringSVG({ fraction = 1, cls = '', stroke = 6 } = {}) {
  const off = RING_C * (1 - Math.min(1, Math.max(0, fraction)));
  return `
    <svg class="ring ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle class="ring-track" cx="50" cy="50" r="${RING_R}" stroke-width="${stroke}"></circle>
      <circle class="ring-fill" cx="50" cy="50" r="${RING_R}" stroke-width="${stroke}"
        stroke-dasharray="${RING_C.toFixed(3)}" stroke-dashoffset="${off.toFixed(3)}"></circle>
    </svg>`;
}
export function setRing(svg, fraction) {
  const fill = svg && svg.querySelector('.ring-fill');
  if (!fill) return;
  const off = RING_C * (1 - Math.min(1, Math.max(0, fraction)));
  fill.setAttribute('stroke-dashoffset', off.toFixed(3));
}

// ---------- goal checkbox ----------
export function checkbox({ id, checked = false, label, name = '' }) {
  return `
    <label class="check${checked ? ' is-checked' : ''}" for="${esc(id)}">
      <input type="checkbox" id="${esc(id)}" ${name ? `name="${esc(name)}"` : ''} ${checked ? 'checked' : ''}>
      <span class="check-box" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7.5"></path></svg>
      </span>
      <span class="check-label">${esc(label)}</span>
    </label>`;
}
export function bounce(el) {
  if (!el) return;
  el.classList.remove('bounce');
  void el.offsetWidth;
  el.classList.add('bounce');
}

// ---------- misc ----------
export function fillBar({ fraction = 0, color = '', cls = '' } = {}) {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return `<div class="fill ${cls}" role="presentation"><div class="fill-bar" style="width:${pct}%;${color ? `background:${esc(color)}` : ''}"></div></div>`;
}
export function dot(color) { return `<span class="dot" style="background:${esc(color)}" aria-hidden="true"></span>`; }

export function download(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
}
