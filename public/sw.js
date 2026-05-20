// 麻将计分器 — Service Worker
const CACHE = 'mahjong-scorer-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 优先用缓存，回退到网络
      return cached || fetch(event.request).then((response) => {
        // 成功请求后缓存
        return caches.open(CACHE).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
