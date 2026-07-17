const CACHE_NAME = "pausa-shell-v10";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/pausa-icon-v2-192.png", "/pausa-icon-v2-512.png", "/pausa-apple-touch-icon-v2.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  const networkFirst = fetch(request, { cache: "no-store" }).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
    }
    return response;
  });

  event.respondWith(networkFirst.catch(() => caches.match(request).then((cached) => cached || caches.match("/"))));
});
