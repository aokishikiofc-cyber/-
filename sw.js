const CACHE_NAME="champions-selector-v7-5-6";
const APP=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);

  if(url.origin===self.location.origin){
    event.respondWith(
      fetch(event.request,{cache:"no-store"}).then(res=>{
        const copy=res.clone();
        caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html")))
    );
  }
});