const CACHE='cbc-x-solved-v0.5.0';
const CORE=['./','./index.html','./styles-v2.css','./app.js','./config.js','./manifest.webmanifest','./sun.svg','./assets/chemistry/unit-01/matter-models.svg','./assets/chemistry/unit-01/states-particles.svg','./assets/chemistry/unit-01/density-lab.svg','./assets/chemistry/unit-01/phases-components.svg','./assets/chemistry/unit-01/substances-molecules.svg','./assets/chemistry/unit-01/separation-methods.svg','./assets/chemistry/unit-01/composition-percent.svg'];

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith('cbc-x-solved-')&&key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  // Navegación y shell: red primero, caché sólo como respaldo offline.
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
    if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
    return response;
  }).catch(async()=>{
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached)return cached;
    if(request.mode==='navigate')return caches.match('./index.html');
    return Response.error();
  }));
});

