// Small shared helpers. Everything date-related works in local time and
// uses plain 'YYYY-MM-DD' strings as the canonical day key.

export const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_MS = 60 * 1000;

let todayOverride = null;
try {
  const p = new URLSearchParams(location.search).get('today');
  if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) todayOverride = p;
} catch { /* ignore */ }

export function now() {
  if (!todayOverride) return Date.now();
  // Keep the real clock time-of-day but on the overridden date (dev aid).
  const real = new Date();
  const [y, m, d] = todayOverride.split('-').map(Number);
  return new Date(y, m - 1, d, real.getHours(), real.getMinutes(), real.getSeconds(), real.getMilliseconds()).getTime();
}

export function pad2(n) { return String(n).padStart(2, '0'); }

export function toKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey() { return toKey(new Date(now())); }

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

export function diffDays(fromKeyStr, toKeyStr) {
  const a = fromKey(fromKeyStr), b = fromKey(toKeyStr);
  return Math.round((b - a) / DAY_MS);
}

export function dayOfWeek(key) { return fromKey(key).getDay(); } // 0 Sun .. 6 Sat
export function isFriday(key) { return dayOfWeek(key) === 5; }
export function isWeekend(key) { const d = dayOfWeek(key); return d === 0 || d === 6; }

// Monday-start weeks.
export function weekStart(key) {
  const d = fromKey(key);
  const shift = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - shift);
  return toKey(d);
}

export function eachDay(startKey, endKey) {
  const out = [];
  let k = startKey;
  while (k <= endKey) { out.push(k); k = addDays(k, 1); }
  return out;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtLong(key) {
  const d = fromKey(key);
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
export function fmtShort(key) {
  const d = fromKey(key);
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}
export function fmtDayMonth(key) {
  const d = fromKey(key);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}
export function fmtDayName(key, short = false) {
  return (short ? DAY_SHORT : DAY_NAMES)[dayOfWeek(key)];
}
export function fmtRange(startKey, endKey) {
  const a = fromKey(startKey), b = fromKey(endKey);
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MONTHS_SHORT[a.getMonth()]}`;
  return `${a.getDate()} ${MONTHS_SHORT[a.getMonth()]} – ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]}`;
}

export function relativeDay(key, today = todayKey()) {
  const n = diffDays(today, key);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n === -1) return 'Yesterday';
  return fmtShort(key);
}

export function fmtHours(h) {
  if (h == null || Number.isNaN(h)) return '0 h';
  const r = Math.round(h * 4) / 4;
  if (r === 0) return '0 h';
  if (Number.isInteger(r)) return `${r} h`;
  if (r < 1) return `${Math.round(r * 60)} min`;
  return `${r.toFixed(r * 2 % 1 === 0 ? 1 : 2).replace(/0$/, '')} h`;
}

export function fmtMinutes(min) {
  min = Math.round(min);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function fmtClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60), s = total % 60;
  return `${m}:${pad2(s)}`;
}

export function plural(n, one, many = one + 's') { return `${n} ${n === 1 ? one : many}`; }

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
export function round25(n) { return Math.round(n * 4) / 4; }

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function joinNatural(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
