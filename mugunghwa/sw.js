// 홈 화면 앱: 한 번 열어 두면 인터넷이 없어도 놀 수 있게 파일을 기기에 보관해요.
// 카메라 영상은 여기를 지나가지 않아요 (영상은 네트워크로 보내지 않아요).
const CACHE = "mugunghwa-v3";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./vendor/vision_bundle.js",
  "./vendor/wasm/vision_wasm_internal.js",
  "./vendor/wasm/vision_wasm_internal.wasm",
  "./vendor/pose_landmarker_lite.task",
  "./img/scene.jpg",
  "./img/tagger-hide.png",
  "./img/tagger-watch.png",
  "./img/buddy-orange-run.png", "./img/buddy-orange-freeze.png", "./img/buddy-orange-caught.png",
  "./img/buddy-blue-run.png", "./img/buddy-blue-freeze.png", "./img/buddy-blue-caught.png",
  "../art/mugunghwa-game.png",
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("mugunghwa-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$|cdn\.jsdelivr\.net$/.test(url.hostname) && /font|woff|css/.test(req.destination + url.pathname);
  if (!sameOrigin && !isFont) return;
  if (sameOrigin && req.mode === "navigate") {
    // 페이지는 새 버전을 먼저, 인터넷이 없으면 보관본
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    });
    return hit || net;
  }));
});
