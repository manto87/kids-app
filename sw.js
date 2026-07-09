/* Service worker: rende l'app utilizzabile anche senza connessione.
   Alza VERSIONE quando cambiano i file, per aggiornare la cache. */

const VERSIONE = 'impara-v3';

const FILE_DA_SALVARE = [
  '.',
  'index.html',
  'css/style.css',
  'js/data.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSIONE).then((cache) => cache.addAll(FILE_DA_SALVARE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chiavi) =>
      Promise.all(chiavi.filter((c) => c !== VERSIONE).map((c) => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((salvato) => salvato || fetch(evento.request))
  );
});
