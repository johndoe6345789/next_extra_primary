/* Nextra service worker — offline shell + smart cache.
   - HTML navigations: NETWORK-FIRST (timeout, cache fallback)
   - Static assets:    SWR (filenames are hashed)
   - API:              always network, never cached
   Bump CACHE name on changes to evict stale entries. */
const CACHE = 'nextra-shell-v3';
const NAV_TIMEOUT_MS = 1500;
const SHELL = [
  '/app/en',
  '/app/manifest.webmanifest',
  '/app/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE)
        .map((k) => caches.delete(k)),
    )).then(() => self.clients.claim()),
  );
});

/** Cache a 200 same-origin response and return it. */
function cachePut(cache, request, res) {
  if (res && res.status === 200
      && res.type === 'basic') {
    cache.put(request, res.clone());
  }
  return res;
}

/** Stale-while-revalidate (assets). */
function swr(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => cachePut(cache, request, res))
        .catch(() => cached);
      return cached || network;
    }),
  );
}

/** Network-first with timeout, cache fallback (HTML). */
function networkFirst(request) {
  return caches.open(CACHE).then((cache) =>
    Promise.race([
      fetch(request)
        .then((res) => cachePut(cache, request, res)),
      new Promise((resolve) => setTimeout(
        () => resolve(null), NAV_TIMEOUT_MS,
      )),
    ]).then((res) =>
      res || cache.match(request)
        .then((c) => c || fetch(request)),
    ).catch(() => cache.match(request)),
  );
}

/** True for any API path, basePath-prefixed or not. */
function isApi(pathname) {
  return pathname.startsWith('/api/')
    || pathname.startsWith('/app/api/');
}

/** True for top-level page navigations (HTML docs). */
function isNavigation(req) {
  return req.mode === 'navigate'
    || req.destination === 'document';
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (isApi(url.pathname)) {
    event.respondWith(fetch(req));
    return;
  }
  if (isNavigation(req)) {
    event.respondWith(networkFirst(req));
    return;
  }
  event.respondWith(swr(req));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'nextra-bg-sync') {
    event.waitUntil(Promise.resolve());
  }
});
