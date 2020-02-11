/**
 * Fix the self reference in order to have
 * service worker intellisense.
 * More info here:
 * https://github.com/Microsoft/TypeScript/issues/11781#issuecomment-503773748
 */
declare var self: ServiceWorkerGlobalScope;
export {};

import { version } from "../package.json";

const CACHE_NAME = `static-cache-${version}`;
const filesToCache = ["/"];

/**
 * Cache files on install
 */
self.addEventListener("install", event => {
  event.waitUntil(
    (async function() {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(filesToCache);
    })()
  );
});

/**
 * Delete outdated caches when activated
 */
self.addEventListener("activate", event => {
  self.clients.claim();

  event.waitUntil(
    (async function() {
      // Remove old caches.
      const promises = (await caches.keys()).map(cacheName => {
        if (CACHE_NAME !== cacheName) {
          return caches.delete(cacheName);
        }
      });

      await Promise.all<any>(promises);
    })()
  );
});

/**
 * Reply with cached data when possible
 */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    (async function() {
      const cachedResponse = await caches.match(event.request, {
        ignoreSearch: true
      });
      return cachedResponse || fetch(event.request);
    })()
  );
});
