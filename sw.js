/* CRC MOH OS — Service Worker
   v11 changes:
   - CACHE_NAME bumped, so returning users actually receive this build.
     (The old worker was cache-first on HTML/JS/CSS, which meant an installed
      PWA would keep serving the previous version of the app indefinitely.)
   - New assets registered: app-ui.css, academy-usher.js.
   - Strategy split: network-first for app code so updates land immediately,
     cache-first for images/fonts which never change.
*/
const CACHE_NAME = 'crc-moh-os-v21';

const CORE_ASSETS = [
  './',
  './index.html',
  './dashboard-extended.html',
  './leadership.html',
  './data.js',
  './academy-usher.js',
  './moh-data.js',
  './guide-content.js',
  './moh-data.js',
  './api.js',
  './bridge.js',
  './style.css',
  './theme-overrides.css',
  './responsive-app.css',
  './app-ui.css',
  './manifest.json',
  './assets/images/crc-logo.jpg',
  './assets/images/landing-01.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// App code should always try the network first so a deploy reaches everyone.
function isAppCode(url) {
  return /\.(html|js|css|json)$/.test(url.pathname) || url.pathname.endsWith('/');
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never cache cross-origin calls (Supabase, CDNs) — let them go straight out.
  if (url.origin !== self.location.origin) return;

  if (isAppCode(url)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, copy))
            .catch(() => null);
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(c => c || caches.match('./index.html'))
        )
    );
    return;
  }

  // Images, icons, fonts: cache-first is fine and much faster.
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ||
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copy))
          .catch(() => null);
        return response;
      }).catch(() => caches.match('./index.html'))
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './index.html#alerts';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener('push', event => {
  let payload = { title: 'MoH Alert', body: 'You have a new Ministry of Helps update.' };
  try { if (event.data) payload = event.data.json(); } catch (e) {}
  event.waitUntil(self.registration.showNotification(payload.title || 'MoH Alert', {
    body: payload.body || payload.message || 'You have a new Ministry of Helps update.',
    icon: './icon-192.png',
    badge: './favicon-32.png',
    data: { url: payload.url || './index.html#alerts' }
  }));
});
