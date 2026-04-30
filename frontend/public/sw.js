/* Nextra service worker — offline shell + SWR.
   Phase 8.5. Vanilla, no workbox.
   Bump CACHE name on changes to evict stale entries. */
const CACHE = 'nextra-shell-v2';
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

/** Stale-while-revalidate for same-origin GETs.
 *  Only caches successful (200) responses — caching 5xx
 *  was the cause of "Failed to load threads" persisting
 *  across sessions even after the API was fixed. */
function swr(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      const network = fetch(request).then((res) => {
        if (res && res.status === 200
            && res.type === 'basic') {
          cache.put(request, res.clone());
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    }),
  );
}

/** True for any API path, basePath-prefixed or not. */
function isApi(pathname) {
  return pathname.startsWith('/api/')
    || pathname.startsWith('/app/api/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (isApi(url.pathname)) {
    // Always go to the network; never cache API responses.
    event.respondWith(fetch(req));
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
