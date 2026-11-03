/* Анкета · Логик Сфера — офлайн-кэш. При обновлении приложения увеличьте номер версии. */
const VERSION = "ls-anketa-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./fonts/manrope.woff", "./fonts/unbounded.woff"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // Свои файлы: сразу из кэша, в фоне — проверка обновления
  e.respondWith(caches.open(VERSION).then(c =>
    c.match(req, {ignoreSearch: true}).then(hit => {
      const net = fetch(req).then(res => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      return net.then(res => res || (req.mode === "navigate" ? c.match("./index.html") : Response.error()));
    })
  ));
});
