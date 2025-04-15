// 캐시 이름
const CACHE_NAME = 'budget-app-cache-v1';

// 캐싱할 파일 목록
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/add-transaction.html',
  '/css/style.css',
  '/js/storage.js',
  '/js/ui.js',
  '/js/app.js',
  '/js/add-transaction.js',
  '/manifest.json'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// 서비스 워커 활성화 이벤트
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// 네트워크 요청 가로채기
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