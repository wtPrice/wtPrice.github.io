const CACHE_NAME = 'tree-estimate-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  'https://photos.app.goo.gl/98ELkak8HKW5nXs56',
  'https://photos.app.goo.gl/98ELkak8HKW5nXs56',
  'https://photos.app.goo.gl/wDNtb9ewqvaW4TZQA',
  'https://photos.app.goo.gl/r8GcHQfjdtg8RR5s8',
  'https://photos.app.goo.gl/kVJfKQa1EchN6whS8',
];

// Install the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Update the service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
