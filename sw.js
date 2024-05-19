import { registerSW } from 'workbox-service-worker';

registerSW();
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-app-cache').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'styles.css',
        'script.js',
        'images/image1.jpg',
        'images/image2.jpg'
      ]);
    })
  );
});
