self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open('bellagio-cache-v3').then(c=>c.addAll([
    './','./index.html','./styles.css','./app.js','./manifest.webmanifest'
  ])));
});
self.addEventListener('activate', (e)=>{clients.claim();});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(caches.match(e.request).then(resp=> resp || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
