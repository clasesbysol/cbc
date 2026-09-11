const CACHE='cbc-x-solved-v0.16.0';
const CORE=['./','./index.html','./styles-v2.css','./cbc-refresh.css','./cbc-branding.css','./app.js','./cbc-refresh.js','./cbc-branding.js','./config.js','./manifest.webmanifest','./cbc-logo.png','./cbc-icon-192.png','./cbc-icon-512.png','./cbc-icon-maskable-192.png','./cbc-icon-maskable-512.png','./cbc-favicon-32.png','./cbc-apple-touch-icon.png','./sun.svg','./assets/chemistry/periodic-table.json','./assets/chemistry/history/jj-thomson.jpg','./assets/chemistry/history/ernest-rutherford.jpg','./assets/chemistry/history/niels-bohr.jpg','./assets/chemistry/unit-01/matter-models.svg','./assets/chemistry/unit-01/states-particles.svg','./assets/chemistry/unit-01/density-lab.svg','./assets/chemistry/unit-01/phases-components.svg','./assets/chemistry/unit-01/substances-molecules.svg','./assets/chemistry/unit-01/separation-methods.svg','./assets/chemistry/unit-01/composition-percent.svg','./assets/chemistry/unit-02/atomic-models.svg','./assets/chemistry/unit-02/rutherford-experiment-wikimedia.svg','./assets/chemistry/unit-02/nuclear-notation.svg','./assets/chemistry/unit-02/hydrogen-spectrum-wikimedia.png','./assets/chemistry/unit-02/orbital-clouds-wikimedia.png','./assets/chemistry/unit-02/electron-configuration.svg','./assets/chemistry/unit-02/periodic-trends.svg','./assets/chemistry/unit-03/electronegativity-trend.jpg','./assets/chemistry/unit-03/ionic-bonding-nacl.jpg','./assets/chemistry/unit-03/covalent-bonds.png','./assets/chemistry/unit-03/lewis-steps.jpg','./assets/chemistry/unit-03/nitrate-resonance.png','./assets/chemistry/unit-03/octet-exceptions.jpg','./assets/chemistry/unit-03/metallic-bonding.jpg','./assets/chemistry/unit-04/vsepr-chart.jpg','./assets/chemistry/unit-04/dipole-polarity.jpg','./assets/chemistry/unit-04/hydrogen-bond.png','./assets/chemistry/unit-04/intermolecular-forces.jpg','./assets/chemistry/unit-04/ion-dipole.jpg','./assets/chemistry/unit-04/boiling-halides.jpg','./assets/chemistry/unit-04/solubility-polarity.jpg'];

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
