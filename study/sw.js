// Offline support. The app shell is precached; fonts are cached on first use.
// IMPORTANT: bump VERSION on every deploy that changes any file in SHELL below
// (or any js/css). Browsers only re-check this worker when its own bytes
// change, so an unbumped VERSION means visitors keep the old cached code
// forever, even after clearing app data or resetting in-app settings.
const VERSION = 'study-companion-v2';
const SHELL = [
  './', './index.html', './styles.css', './manifest.webmanifest', './icon.svg',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './js/app.js', './js/ui.js', './js/util.js', './js/seed.js', './js/store.js',
  './js/timer.js', './js/audio.js', './js/confetti.js', './js/views.js', './js/session-views.js',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req));
    return;
  }
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, './index.html'));
    return;
  }
  // Code and styles must never go quietly stale: prefer the network whenever
  // it's reachable, and only fall back to the cache when offline. Images,
  // icons and the manifest change rarely, so they stay on the faster,
  // cache-first stale-while-revalidate path.
  const isCode = req.destination === 'script' || req.destination === 'style'
    || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
  event.respondWith(isCode ? networkFirst(req) : staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req, { ignoreVary: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (e) {
    // Offline with no cached copy: an empty stylesheet lets the fallback
    // fonts take over quietly instead of logging a failed request.
    if (req.destination === 'style') return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

// Always try the network first so a new deploy is visible on the very next
// load while online; only serve the cached copy when the network fails.
async function networkFirst(req, fallbackPath) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (fallbackPath) {
      const shell = await cache.match(fallbackPath, { ignoreSearch: true });
      if (shell) return shell;
    }
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req, { ignoreSearch: true });
  const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await network) || new Response('', { status: 504, statusText: 'Offline' });
}
