// GreenSwap migrated from a Vite shell to the Next.js App Router.
// Replace the legacy cache with a no-op worker, then unregister it so old
// cached index.html responses cannot mask the current server-rendered app.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
