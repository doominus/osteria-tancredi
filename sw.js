// Service worker minimo: fa in modo che la pagina si apra anche senza
// connessione (una volta aperta almeno una volta online), es. tablet
// riavviato senza wifi. Non gestisce i dati delle prenotazioni (se ne
// occupa gia' il motore offline dentro index.html): serve solo a far
// caricare la pagina stessa.
const CACHE_NAME = "osteria-tancredi-v1";
const FILES_TO_CACHE = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
