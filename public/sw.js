
const CACHE_NAME = 'journday-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Handle background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'journal-reminder') {
    event.waitUntil(showJournalReminder());
  }
});

function showJournalReminder() {
  return self.registration.showNotification('JournDay Reminder', {
    body: 'Time for your mindful journaling session! 🪷',
    icon: '/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png',
    badge: '/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png',
    data: {
      url: '/'
    }
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
