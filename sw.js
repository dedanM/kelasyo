const CACHE_VERSION = "v3";
const CACHE = "kelasyo-" + CACHE_VERSION;
const PRECACHE = ["./","./index.html","./equipe.html","./fichiers.html","./css/styles.css","./js/main.js","./js/db.js","./js/auth.js","./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("kelasyo-") && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
  if (e.data === "GET_VERSION") e.ports?.[0]?.postMessage({ version: CACHE_VERSION });
  if (e.data === "CLEAR_CACHE") {
    e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("kelasyo-")).map((k) => caches.delete(k)))));
  }
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === "navigate" || url.pathname.endsWith(".html")) {
    e.respondWith(
      fetch(e.request).then((r) => {
        caches.open(CACHE).then((c) => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request).then((c) => c || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const net = fetch(e.request).then((r) => {
        if (r && r.ok) cache.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return cached || net;
    })
  );
});

self.addEventListener("push", (e) => {
  let data = { title: "Kelasyo", body: "Nouvelle notification", link: "./index.html" };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body || "",
      tag: data.tag || "kelasyo-push",
      data: { link: data.link || "./index.html" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.link || "./index.html", self.location.origin).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (list) => {
      for (const c of list) {
        if (c.url.startsWith(self.location.origin) && "focus" in c) {
          await c.focus();
          if ("navigate" in c) await c.navigate(url);
          return;
        }
      }
      if (self.clients.openWindow) await self.clients.openWindow(url);
    })
  );
});
