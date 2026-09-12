// Boot, routing and screen transitions.

import * as store from './store.js';
import * as timer from './timer.js';
import * as audio from './audio.js';
import { go, currentRoute, toast, setMotionSetting, applyMotion, reducedMotion, closeSheet } from './ui.js';
import { renderToday, renderSetup, renderPlan, renderProgress, renderSettings } from './views.js';
import { mountSession, renderComplete } from './session-views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const NAV_ORDER = ['today', 'plan', 'progress', 'settings'];
const LIVE = new Set(['today', 'plan', 'progress']);
const SESSION_ROUTES = new Set(['session']);

let current = null;      // { path, cleanup }
let installPrompt = null;
let warnedMemory = false;

function applyTheme() {
  const s = store.get().settings;
  document.documentElement.dataset.theme = s.theme || 'blush';
  setMotionSetting(s.reducedMotion);
  applyMotion();
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', s.theme === 'dusk' ? '#1F0F1A' : '#FDF3F6');
}

function render() {
  const { path: rawPath, params } = currentRoute();
  let path = rawPath;
  const active = timer.active();

  if (active && !SESSION_ROUTES.has(path)) { go('#/session', true); return; }
  if (!active && path === 'session') { go('#/today', true); return; }

  closeSheet();
  if (current && current.cleanup) current.cleanup();

  const from = current ? current.path : null;
  const dir = from && NAV_ORDER.includes(from) && NAV_ORDER.includes(path)
    ? (NAV_ORDER.indexOf(path) > NAV_ORDER.indexOf(from) ? 'forward' : 'back')
    : (path === 'today' && from ? 'back' : 'forward');

  const screen = document.createElement('div');
  screen.className = `screen enter-${dir}`;
  screen.dataset.screen = path;
  let cleanup = null;

  switch (path) {
    case 'today': renderToday(screen); break;
    case 'setup': renderSetup(screen, params); break;
    case 'session': cleanup = mountSession(screen); break;
    case 'complete': renderComplete(screen, params); break;
    case 'plan': renderPlan(screen, params); break;
    case 'progress': renderProgress(screen); break;
    case 'settings': renderSettings(screen, { memoryOnly: store.isMemoryOnly(), installPrompt }); break;
    default: go('#/today', true); return;
  }

  app.replaceChildren(screen);
  window.scrollTo(0, 0);
  current = { path, cleanup };

  const showNav = NAV_ORDER.includes(path);
  nav.hidden = !showNav;
  document.body.classList.toggle('in-session', SESSION_ROUTES.has(path));
  document.body.classList.toggle('no-nav', !showNav);
  nav.querySelectorAll('.nav-item').forEach(a => {
    const on = a.dataset.route === path;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function boot() {
  store.load();
  applyTheme();
  audio.configure(store.get().settings);

  // Audio contexts must be created from a user gesture.
  const unlock = () => audio.unlock();
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => document.addEventListener(ev, unlock, { passive: true }));

  store.subscribe(() => {
    if (current && LIVE.has(current.path)) render();
  });

  window.addEventListener('hashchange', render);

  window.addEventListener('beforeunload', (e) => {
    const a = timer.active();
    if (a && a.phase === 'focus' && !a.pausedAt) { e.preventDefault(); e.returnValue = ''; }
  });

  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; });
  window.addEventListener('appinstalled', () => { installPrompt = null; toast('Added to your home screen.'); });

  timer.on((kind, extra) => {
    if (kind === 'end') {
      // The session view routes itself; this covers ends triggered elsewhere.
      if (!extra.record && currentRoute().path === 'session') go('#/today', true);
    }
  });

  if (store.isMemoryOnly() && !warnedMemory) {
    warnedMemory = true;
    setTimeout(() => toast('This browser cannot save data, so nothing will persist between visits.', { duration: 9000 }), 600);
  }

  const restored = timer.restore();
  if (restored) go('#/session', true); else render();
  registerServiceWorker();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      if (!w) return;
      w.addEventListener('statechange', () => {
        if (w.state === 'activated' && hadController) {
          toast('A newer version is ready.', { action: { label: 'Reload', onClick: () => location.reload() }, duration: 12000 });
        }
      });
    });
  }).catch(err => console.warn('Service worker not registered', err));
}

boot();
