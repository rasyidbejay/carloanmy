const STATIC_CACHE = "carloan-static-v1";
const RUNTIME_CACHE = "carloan-runtime-v1";

function getBasePath() {
  const scopeUrl = new URL(self.registration.scope);
  return scopeUrl.pathname.endsWith("/") ? scopeUrl.pathname : `${scopeUrl.pathname}/`;
}

function buildAppUrl(pathname) {
  const basePath = getBasePath();
  const cleanPath = pathname.replace(/^\//, "");
  return new URL(cleanPath ? `${basePath}${cleanPath}` : basePath, self.location.origin).toString();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll([
        buildAppUrl(""),
        buildAppUrl("offline/"),
        buildAppUrl("manifest.webmanifest"),
        buildAppUrl("favicon.ico"),
        buildAppUrl("icon.svg"),
        buildAppUrl("apple-touch-icon.svg"),
      ]),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await caches.match(request);

    if (cached) {
      return cached;
    }

    return (
      (await caches.match(buildAppUrl("offline/"))) ||
      new Response("Offline", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        status: 503,
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (
    ["script", "style", "image", "font", "worker"].includes(request.destination) ||
    url.pathname.includes("/_next/")
  ) {
    event.respondWith(cacheFirst(request));
  }
});
