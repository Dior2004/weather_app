const cacheName = "weather-app version2";

// const cacheAssets = ["/", "index.html", "/style.css", "/main.js"];

self.addEventListener("install", (event) => {
  console.log("service-worker installed");
  // event.waitUntil(
  //   caches
  //     .open(cacheName)
  //     .then((cache) => {
  //       console.log("service-worker cashing");
  //       cache.addAll(cacheAssets);
  //     })
  //     .then(() => self.skipWaiting())
  // );
});

self.addEventListener("activate", (event) => {
  console.log("service-worker activated");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((currentCache) => {
          if (currentCache !== cacheName) {
            console.log("service-worker clearing old caches");
            return caches.delete(currentCache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();

        caches.open(cacheName).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
