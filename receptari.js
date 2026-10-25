/* ==========================================================================
   Receptari de casa · comportament compartit
   - Pestanyes: fletxes, Inici/Fi i tabindex mòbil a totes les pàgines
   - Barra d'eines: mode cuina (lletra gran + pantalla encesa) i imprimir
   - A GitHub Pages: enllaç a l'índex i funcionament sense connexió
   Les pàgines de claude.ai el porten incrustat; allà no hi ha manifest,
   i per tant no es registra el service worker ni surt l'enllaç a l'índex.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.lang = "ca";
  var web = !!doc.querySelector('link[rel="manifest"]');      // versió de GitHub Pages
  var dinsIndex = false;
  try { dinsIndex = window.top !== window.self && window.parent.location.origin === location.origin; } catch (e) {}
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Pestanyes accessibles ---------- */
  function tabsDe(list) { return Array.prototype.slice.call(list.querySelectorAll('[role="tab"]')); }
  function sincronitza(list) {
    var tabs = tabsDe(list), cap = tabs.some(function (t) { return t.getAttribute("aria-selected") === "true"; });
    tabs.forEach(function (t, i) {
      var sel = t.getAttribute("aria-selected") === "true" || (!cap && i === 0);
      t.tabIndex = sel ? 0 : -1;
      var id = t.getAttribute("aria-controls"), p = id && doc.getElementById(id);
      if (p && !p.hasAttribute("role")) { p.setAttribute("role", "tabpanel"); if (t.id) p.setAttribute("aria-labelledby", t.id); }
    });
  }
  function totesLesPestanyes() { Array.prototype.forEach.call(doc.querySelectorAll('[role="tablist"]'), sincronitza); }
  doc.addEventListener("keydown", function (e) {
    var t = e.target;
    if (e.defaultPrevented || !t || t.getAttribute && t.getAttribute("role") !== "tab") return;
    var list = t.closest('[role="tablist"]'); if (!list) return;
    var tabs = tabsDe(list), i = tabs.indexOf(t), j = -1, n = tabs.length;
    if (e.key === "ArrowRight") j = (i + 1) % n; else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0; else if (e.key === "End") j = n - 1; else return;
    e.preventDefault(); tabs[j].click(); tabs[j].focus(); sincronitza(list);
  });
  new MutationObserver(totesLesPestanyes).observe(doc.body || root, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-selected"] });

  /* ---------- Mode cuina ---------- */
  var lock = null, barra = null;
  function demanaLlum() {
    if (!root.classList.contains("cuina") || doc.visibilityState !== "visible" || !("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(function (l) { lock = l; estat(); l.addEventListener("release", function () { lock = null; estat(); }); })
      .catch(function () { lock = null; estat(); });
  }
  function estat() {
    if (!barra) return;
    var b = barra.querySelector("#rcCuina"), on = root.classList.contains("cuina");
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.title = on ? (lock ? "Mode cuina actiu: la pantalla no s'apagarà" : "Mode cuina actiu (aquest navegador no pot mantenir la pantalla encesa)") : "Lletra gran i pantalla sempre encesa";
  }
  function cuina(on) {
    root.classList.toggle("cuina", on);
    store.set("receptari-cuina", on ? "1" : null);
    if (on) demanaLlum(); else if (lock) { lock.release(); lock = null; }
    estat();
  }
  doc.addEventListener("visibilitychange", demanaLlum);

  /* ---------- Barra d'eines ---------- */
  function barraEines() {
    if (root.hasAttribute("data-sense-barra")) return;
    barra = doc.createElement("aside");
    barra.className = "rc-barra";
    barra.setAttribute("aria-label", "Eines de la pàgina");
    var h = "";
    if (web && !dinsIndex) h += '<a class="rc-b" href="index.html' + (location.pathname.split("/").pop() ? "#" + location.pathname.split("/").pop().replace(/\.html$/, "") : "") + '">← Receptari</a>';
    h += '<button type="button" class="rc-b" id="rcCuina" aria-pressed="false">Mode cuina</button>';
    h += '<button type="button" class="rc-b" id="rcPrint">Imprimeix</button>';
    barra.innerHTML = h;
    doc.body.appendChild(barra);
    barra.querySelector("#rcCuina").addEventListener("click", function () { cuina(!root.classList.contains("cuina")); });
    barra.querySelector("#rcPrint").addEventListener("click", function () { window.print(); });
    if (store.get("receptari-cuina") === "1") cuina(true); else estat();
  }

  /* ---------- Sense connexió (només a GitHub Pages) ---------- */
  function offline() {
    if (!web || !("serviceWorker" in navigator) || (location.protocol !== "https:" && location.hostname !== "localhost")) return;
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  function inici() { totesLesPestanyes(); barraEines(); if (!dinsIndex) offline(); }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", inici); else inici();
})();
