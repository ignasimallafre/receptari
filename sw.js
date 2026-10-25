/* Receptari de casa · service worker (generat per codi-font/build.py, no l'editis a mà)
   - Desa totes les pàgines en instal·lar-se, per poder cuinar sense connexió.
   - Pàgines del receptari: respon amb la còpia desada i l'actualitza en segon pla.
   - Fonts i jsPDF: es desen el primer cop que es baixen. */
const VERSIO = "receptari-b0211e9228";
const FITXERS = ["./", "index.html", "receptari.css", "receptari.js", "manifest.webmanifest", "icones/icona.svg", "icones/icona-180.png", "icones/icona-192.png", "icones/icona-512.png", "arrossos-secs.html", "manitoba.html", "obrador-de-pa.html", "coca-brioix.html", "coca-iogurt-magdalenes.html", "ensaimades.html", "vermut-blanc.html", "embotits-curats.html"];
const EXTERNS = ["https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSIO);
    await c.addAll(FITXERS);
    await Promise.all(EXTERNS.map(u => fetch(u, { mode: "cors" }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("receptari-") && k !== VERSIO) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const propi = url.origin === location.origin;
  const extern = /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname);
  if (!propi && !extern) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSIO);
    const clau = propi ? url.pathname.replace(/\/$/, "/index.html") : req.url;
    const desat = await c.match(clau, { ignoreSearch: propi });
    const xarxa = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) c.put(clau, r.clone()); return r; });
    if (desat) { e.waitUntil(xarxa.catch(() => {})); return desat; }
    try { return await xarxa; }
    catch (err) { return (propi && req.mode === "navigate" && await c.match("index.html")) || Response.error(); }
  })());
});
