/* ==========================================================================
   Receptari de casa · comportament compartit
   Cada calculadora exposa window.RECEPTARI = {titol, mesura, ingredients,
   passos, compra, estat, carrega, resum}. A partir d'aquí, aquest fitxer hi
   afegeix el mateix per a totes:
   - pictograma i marca a la capçalera, barra d'accions (al mòbil, a baix)
   - mode cuina: ingredients per marcar i passos d'un en un
   - temporitzadors amb so i avís
   - enllaç per compartir la configuració (?estat=…)
   - afegir a la llista de la compra combinada (a l'índex, #compra)
   - resum fix al mòbil, detalls plegables, tema clar/fosc
   - pestanyes amb teclat i funcionament sense connexió
   A claude.ai (sense manifest) no hi ha índex: no surten compartir ni compra.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.lang = "ca";
  var web = !!doc.querySelector('link[rel="manifest"]');
  var dinsIndex = false;
  try { dinsIndex = window.top !== window.self && window.parent.location.origin === location.origin; } catch (e) {}
  var esIndex = root.hasAttribute("data-sense-barra");
  var ID = root.getAttribute("data-recepta") || "";
  var API = null;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    jget: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    jset: function (k, v) { return store.set(k, JSON.stringify(v)); }
  };
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Pictogrames (originals, de línia) ---------- */
  var ICONES = {
    "arrossos-secs": '<path d="M8 26v2c0 4.4 7.2 8 16 8s16-3.6 16-8v-2"/><ellipse cx="24" cy="26" rx="16" ry="7"/><path d="M8 27H3.5M40 27h4.5"/><path d="M18 15c-1.6-1.8 1.6-3.4 0-5.5M24 14c-1.6-1.8 1.6-3.4 0-5.5M30 15c-1.6-1.8 1.6-3.4 0-5.5"/><circle class="p" cx="18" cy="25" r="1.4"/><circle class="p" cx="23.5" cy="28" r="1.4"/><circle class="p" cx="29" cy="24.5" r="1.4"/><circle class="p" cx="31" cy="28.5" r="1.4"/><circle class="p" cx="16.5" cy="28.5" r="1.4"/>',
    "obrador-de-pa": '<path d="M7 31c0-8.8 7.6-15 17-15s17 6.2 17 15v2.5a2.5 2.5 0 0 1-2.5 2.5h-29A2.5 2.5 0 0 1 7 33.5z"/><path d="M16 21.5l2.5 5M23 19.5l2.5 6M30 21l2.5 5.5"/>',
    "coca-brioix": '<path d="M5 26.5a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M31 22.5v11"/><circle class="p" cx="11" cy="27" r="1.3"/><circle class="p" cx="16" cy="25.8" r="1.3"/><circle class="p" cx="21" cy="27.4" r="1.3"/><circle class="p" cx="26" cy="25.8" r="1.3"/><circle class="p" cx="36" cy="27" r="1.3"/><path d="M14 17c-1.4-1.6 1.4-3 0-4.8M22 16c-1.4-1.6 1.4-3 0-4.8"/>',
    "coca-iogurt-magdalenes": '<path d="M13 26h22l-3 14H16z"/><path d="M19 26l1 14M24 26v14M29 26l-1 14"/><path d="M11 26c-1.5-7 5-13 13-13s14.5 6 13 13"/><path d="M24 13c0-2 1-3.5 2.5-4.5"/>',
    "embotits-curats": '<path d="M24 4v5M19.5 9h9"/><rect x="17" y="9" width="14" height="33" rx="7"/><path d="M17.3 17.5c4.2 1.6 9.2 1.6 13.4 0M17 26c4.5 1.6 9.5 1.6 14 0M17.3 34.5c4.2 1.6 9.2 1.6 13.4 0"/><circle class="p" cx="21" cy="22" r="1.1"/><circle class="p" cx="27" cy="30" r="1.1"/><circle class="p" cx="22" cy="38.5" r="1.1"/>',
    "ensaimades": '<path d="M24 25.5a1.6 1.6 0 0 1 3.2 0a4.4 4.4 0 0 1-8.8 0a7.2 7.2 0 0 1 14.4 0a10 10 0 0 1-20 0a12.8 12.8 0 0 1 25.6 0"/>',
    "receptari-manitoba": '<path d="M8.5 13.5C13 10.6 18.3 9 24 9s11 1.6 15.5 4.5L24 42z"/><path d="M10.8 17.6C14.7 15.3 19.2 14 24 14s9.3 1.3 13.2 3.6"/><circle cx="20" cy="21.5" r="2.4"/><circle cx="28.5" cy="23" r="2.4"/><circle cx="24" cy="31" r="2.4"/>',
    "vermut-blanc": '<path d="M17.5 5h5M18.5 5v7.5c-3 1.8-5 4.8-5 8.5v18.5a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5V21c0-3.7-2-6.7-5-8.5V5"/><path d="M13.5 25h13M13.5 34h13"/><path d="M33 22h9l-.8 5.5a3.7 3.7 0 0 1-7.4 0z"/><path d="M37.5 31v9M34 40h7"/>'
  };
  function icona(id, cls) { var b = ICONES[id]; return b ? '<svg class="' + (cls || "rc-ico") + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + b + "</svg>" : ""; }
  var UI = {
    cuina: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20M9 7c0-1 1-1.5 1-2.5M14 7c0-1 1-1.5 1-2.5"/>',
    compra: '<path d="M3 9h18l-2 9.5a2 2 0 0 1-2 1.5H7a2 2 0 0 1-2-1.5z"/><path d="M8 9l3-5M16 9l-3-5M9 13v3.5M12 13v3.5M15 13v3.5"/>',
    comparteix: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    imprimeix: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    tema: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
    rellotge: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M18.5 6.5l1.5-1.5"/>',
    tanca: '<path d="M6 6l12 12M18 6L6 18"/>',
    pausa: '<path d="M9 6v12M15 6v12"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    mes: '<path d="M12 6v12M6 12h12"/>'
  };
  function ui(n) { return '<svg class="rc-ui" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + UI[n] + "</svg>"; }

  /* ---------- Tema ---------- */
  var TEMES = { auto: "automàtic", light: "clar", dark: "fosc" };
  function aplicaTema(t) { if (t === "light" || t === "dark") root.setAttribute("data-theme", t); else root.removeAttribute("data-theme"); doc.querySelectorAll(".rc-tema").forEach(function (b) { var k = t === "light" || t === "dark" ? t : "auto"; b.setAttribute("aria-label", "Tema: " + TEMES[k] + ". Canvia'l"); b.title = "Tema " + TEMES[k]; }); }
  function canviaTema() { var t = store.get("receptari-tema") || "auto"; var n = t === "auto" ? "light" : t === "light" ? "dark" : "auto"; store.set("receptari-tema", n === "auto" ? null : n); aplicaTema(n); }
  aplicaTema(store.get("receptari-tema"));

  /* ---------- Avisos breus ---------- */
  var avisEl = null;
  function avis(html, ms) {
    if (!avisEl) { avisEl = el("div", "rc-avis"); avisEl.setAttribute("role", "status"); doc.body.appendChild(avisEl); }
    avisEl.innerHTML = html; avisEl.classList.add("on");
    clearTimeout(avis.t); avis.t = setTimeout(function () { avisEl.classList.remove("on"); }, ms || 4000);
  }

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
  function totesLesPestanyes() { doc.querySelectorAll('[role="tablist"]').forEach(sincronitza); }
  doc.addEventListener("keydown", function (e) {
    var t = e.target;
    if (e.defaultPrevented || !t || !t.getAttribute || t.getAttribute("role") !== "tab") return;
    var list = t.closest('[role="tablist"]'); if (!list) return;
    var tabs = tabsDe(list), i = tabs.indexOf(t), j = -1, n = tabs.length;
    if (e.key === "ArrowRight") j = (i + 1) % n; else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0; else if (e.key === "End") j = n - 1; else return;
    e.preventDefault(); tabs[j].click(); tabs[j].focus(); sincronitza(list);
  });

  /* ---------- Pantalla encesa ---------- */
  var lock = null, volLlum = false;
  function llum(on) {
    volLlum = on;
    if (!on) { if (lock) { lock.release(); lock = null; } return; }
    if (doc.visibilityState !== "visible" || !("wakeLock" in navigator) || lock) return;
    navigator.wakeLock.request("screen").then(function (l) { lock = l; l.addEventListener("release", function () { lock = null; }); }).catch(function () {});
  }
  doc.addEventListener("visibilitychange", function () { if (volLlum) llum(true); });

  /* ---------- Capçalera: marca i pictograma ---------- */
  function capcalera() {
    var h1 = doc.querySelector("main h1") || doc.querySelector("h1"); if (!h1) return;
    var bloc = h1.parentNode;
    if (web && !dinsIndex) {
      var nom = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
      var a = el("a", "rc-marca", '<img src="icones/icona.svg" alt="">Receptari de casa');
      a.href = "index.html#" + (ID || nom);
      bloc.insertBefore(a, h1);
    }
    if (ICONES[ID] && !doc.getElementById("logo")) {
      var w = el("div", "rc-cap"), ic = el("span", "rc-ico-caixa", icona(ID));
      bloc.parentNode.insertBefore(w, bloc); w.appendChild(ic); w.appendChild(bloc);
    }
  }

  /* ---------- Barra d'accions ---------- */
  function boto(cls, icon, text, extra) { var b = el("button", "rc-acc " + cls, ui(icon) + '<span class="rc-l">' + text + "</span>"); b.type = "button"; if (extra) for (var k in extra) b.setAttribute(k, extra[k]); return b; }
  function accions() {
    var pdf = doc.getElementById("pdfBtn"), header = (pdf && pdf.closest("header")) || doc.querySelector("main header") || doc.querySelector("header");
    if (!header) return;
    var host = pdf ? pdf.parentNode : header;
    var g = el("div", "rc-accions"); g.setAttribute("role", "group"); g.setAttribute("aria-label", "Accions de la recepta");
    if (API && API.ingredients) { var c = boto("rc-primari", "cuina", "Mode cuina"); c.addEventListener("click", obreCuina); g.appendChild(c); }
    if (web && API && API.compra) { var b = boto("", "compra", "A la compra"); b.title = "Afegeix-ho a la llista de la compra combinada"; b.addEventListener("click", afegeixCompra); g.appendChild(b); }
    if (web && API && API.estat) { var s = boto("", "comparteix", "Comparteix"); s.title = "Copia un enllaç amb aquesta configuració"; s.addEventListener("click", comparteix); g.appendChild(s); }
    var p = boto("", "imprimeix", "Imprimeix"); p.addEventListener("click", function () { window.print(); }); g.appendChild(p);
    var t = boto("rc-tema", "tema", "Tema"); t.addEventListener("click", canviaTema); g.appendChild(t);
    host.insertBefore(g, host.firstChild);
    if (pdf) pdf.classList.remove("primary");
    header.classList.add("rc-header");
    aplicaTema(store.get("receptari-tema"));
  }

  /* ---------- Resum fix (mòbil) ---------- */
  var resumEl = null, resumPend = false;
  function resum() {
    if (!API || !API.resum) return;
    var header = doc.querySelector("header.rc-header") || doc.querySelector("main header"); if (!header) return;
    resumEl = el("div", "rc-resum"); resumEl.setAttribute("aria-hidden", "true");
    header.parentNode.insertBefore(resumEl, header.nextSibling);
    refresca();
    ["input", "change", "click"].forEach(function (ev) { doc.addEventListener(ev, function () { if (!resumPend) { resumPend = true; requestAnimationFrame(refresca); } }); });
  }
  function refresca() {
    resumPend = false; if (!resumEl) return;
    var r = []; try { r = API.resum() || []; } catch (e) {}
    resumEl.innerHTML = r.map(function (x) { return '<span><small>' + esc(x[0]) + "</small><b>" + esc(x[1]) + "</b></span>"; }).join("");
  }

  /* ---------- Detalls plegables a la taula (mòbil) ---------- */
  function detalls() {
    var row = doc.querySelector(".mrow:not(.head)"); if (!row) return;
    var panel = row.closest(".panel"), h2 = panel && panel.querySelector("h2"); if (!h2) return;
    var b = el("button", "rc-detalls", "Detalls"); b.type = "button";
    var on = store.get("receptari-detalls") === "1"; root.classList.toggle("rc-amb-detalls", on); b.setAttribute("aria-pressed", String(on));
    b.title = "Mostra el nom científic i la descripció de cada ingredient";
    b.addEventListener("click", function () { on = !on; root.classList.toggle("rc-amb-detalls", on); b.setAttribute("aria-pressed", String(on)); store.set("receptari-detalls", on ? "1" : null); });
    h2.insertAdjacentElement("afterend", b);
  }

  /* ---------- Temporitzadors ---------- */
  var TKEY = "receptari-temporitzadors", tempsEl = null, tempsLive = null, tick = null, actx = null, sonant = {};
  function temps() { return store.jget(TKEY, []); }
  function desaTemps(a) { store.jset(TKEY, a); pintaTemps(); }
  function resta(t) { return t.fi ? t.fi - Date.now() : t.resta; }
  function fmtT(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; var p = function (n) { return String(n).padStart(2, "0"); }; return h ? h + ":" + p(m) + ":" + p(x) : p(m) + ":" + p(x); }
  function so() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      [0, .25, .5].forEach(function (d) { var o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(actx.destination); var t0 = actx.currentTime + d; g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.35, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .18); o.start(t0); o.stop(t0 + .2); });
    } catch (e) {}
  }
  function nouTemps(nom, min) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); } catch (e) {}
    try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
    var a = temps(); var ms = Math.round(min * 60000);
    a.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nom: nom, fi: Date.now() + ms, resta: ms, total: ms });
    desaTemps(a); avis("Temporitzador en marxa: " + esc(nom) + " · " + fmtT(ms));
  }
  var firmaTemps = "";
  function pintaTemps() {
    if (!tempsEl) return;
    var a = temps();
    tempsEl.hidden = !a.length;
    var firma = a.map(function (t) { var r = resta(t); return t.id + (r <= 0 ? "f" : t.fi ? "m" : "p"); }).join(",");
    if (firma === firmaTemps) {
      a.forEach(function (t) { var x = tempsEl.querySelector('[data-t="' + t.id + '"] .rc-t-x'); if (x) x.textContent = resta(t) <= 0 ? "Fet!" : fmtT(resta(t)); });
    } else {
    firmaTemps = firma;
    tempsEl.innerHTML = a.map(function (t) {
      var r = resta(t), fet = r <= 0, pausat = !t.fi && !fet;
      return '<div class="rc-t' + (fet ? " rc-sona" : "") + '" data-t="' + t.id + '">' + ui("rellotge") +
        '<span class="rc-t-nom">' + esc(t.nom) + '</span><b class="rc-t-x">' + (fet ? "Fet!" : fmtT(r)) + "</b>" +
        (fet ? '<button type="button" class="rc-t-b" data-acc="ok">D\'acord</button>'
             : '<button type="button" class="rc-t-b" data-acc="mes" aria-label="Afegeix un minut a ' + esc(t.nom) + '">+1</button><button type="button" class="rc-t-b" data-acc="pausa" aria-label="' + (pausat ? "Continua " : "Pausa ") + esc(t.nom) + '">' + ui(pausat ? "play" : "pausa") + "</button>") +
        '<button type="button" class="rc-t-b" data-acc="treu" aria-label="Treu el temporitzador ' + esc(t.nom) + '">' + ui("tanca") + "</button></div>";
    }).join("");
    }
    var cal = a.some(function (t) { return t.fi; });
    if (cal && !tick) tick = setInterval(batec, 1000); else if (!cal && tick) { clearInterval(tick); tick = null; }
  }
  function batec() {
    var a = temps(), canvi = false;
    a.forEach(function (t) {
      if (t.fi && t.fi <= Date.now()) {
        t.resta = 0; t.fi = null; canvi = true;
        if (!sonant[t.id]) {
          sonant[t.id] = setInterval(so, 2500); so();
          setTimeout(function () { clearInterval(sonant[t.id]); }, 60000);
          if (tempsLive) tempsLive.textContent = "S'ha acabat el temps: " + t.nom;
          try { navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) {}
          try { if ("Notification" in window && Notification.permission === "granted") new Notification("Receptari: s'ha acabat el temps", { body: t.nom, icon: "icones/icona-192.png" }); } catch (e) {}
        }
      }
    });
    if (canvi) desaTemps(a); else pintaTemps();
  }
  function muntaTemps() {
    tempsEl = el("div", "rc-temps"); tempsEl.setAttribute("aria-label", "Temporitzadors"); tempsEl.setAttribute("role", "region"); tempsEl.hidden = true;
    tempsLive = el("div", "sr-only"); tempsLive.setAttribute("aria-live", "assertive");
    doc.body.appendChild(tempsEl); doc.body.appendChild(tempsLive);
    tempsEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-acc]"); if (!b) return;
      var id = b.closest("[data-t]").getAttribute("data-t"), a = temps(), t = a.filter(function (x) { return x.id === id; })[0]; if (!t) return;
      var acc = b.getAttribute("data-acc");
      if (acc === "treu" || acc === "ok") { a = a.filter(function (x) { return x.id !== id; }); clearInterval(sonant[id]); delete sonant[id]; }
      else if (acc === "mes") { if (t.fi) t.fi += 60000; else t.resta += 60000; t.total += 60000; }
      else if (acc === "pausa") { if (t.fi) { t.resta = t.fi - Date.now(); t.fi = null; } else { t.fi = Date.now() + t.resta; } }
      desaTemps(a);
      var q = tempsEl.querySelector('[data-t="' + id + '"] [data-acc="' + acc + '"]') || tempsEl.querySelector("button");
      if (q) q.focus(); else if (cuinaEl) cuinaEl.querySelector(".rc-tanca").focus();
    });
    pintaTemps(); batec();
  }

  /* ---------- Mode cuina ---------- */
  var cuinaEl = null, abansFocus = null, inertes = [];
  function claveCuina() { return "receptari-cuina:" + (ID || location.pathname) + ":" + (API.titol ? API.titol() : ""); }
  function minDeText(t) { var m = /(\d+(?:[.,]\d+)?)\s*(?:[–-]\s*(\d+(?:[.,]\d+)?)\s*)?(min\b|minuts?\b|h\b|hores?\b)/i.exec(t || ""); if (!m) return null; var v = parseFloat((m[2] || m[1]).replace(",", ".")); return /^h/i.test(m[3]) ? v * 60 : v; }
  function obreCuina() {
    var dades = { ing: API.ingredients() || [], pas: [] };
    try { dades.pas = (API.passos ? API.passos() : null) || []; } catch (e) {}
    if (!dades.pas.length) dades.pas = Array.prototype.map.call(doc.querySelectorAll("#timeline li, .tl li"), function (li) { var d = li.querySelector(".d"), t = li.querySelector(".t"); return { quan: d ? d.textContent.replace(/\s+/g, " ").trim() : "", t: (t || li).textContent.replace(/\s+/g, " ").trim(), min: null }; });
    dades.pas.forEach(function (p) { if (!p.min && p.min !== 0) { var m = minDeText(p.t + " " + (p.det || "")); if (m && m <= 180) p.min = m; } });
    var k = claveCuina(), mem = store.jget(k, { m: [], p: 0 });
    var marcats = {}; (mem.m || []).forEach(function (x) { marcats[x] = 1; });
    var pas = Math.min(mem.p || 0, Math.max(0, dades.pas.length - 1));
    var total = dades.ing.reduce(function (a, g) { return a + g.items.length; }, 0);
    abansFocus = doc.activeElement;
    cuinaEl = el("div", "rc-cuina");
    cuinaEl.setAttribute("role", "dialog"); cuinaEl.setAttribute("aria-modal", "true"); cuinaEl.setAttribute("aria-labelledby", "rcCT");
    cuinaEl.innerHTML =
      '<div class="rc-cuina-cap"><div class="rc-cuina-tit">' + (ICONES[ID] ? '<span class="rc-ico-caixa">' + icona(ID) + "</span>" : "") +
      '<div><p class="rc-ull">Mode cuina · la pantalla no s\'apaga</p><h2 id="rcCT">' + esc(API.titol ? API.titol() : doc.title) + '</h2><p class="rc-cuina-m">' + esc(API.mesura ? API.mesura() : "") + "</p></div></div>" +
      '<button type="button" class="rc-tanca" aria-label="Surt del mode cuina">' + ui("tanca") + "</button></div>" +
      '<div class="rc-cuina-tabs" role="tablist" aria-label="Mode cuina"><button type="button" role="tab" id="rcTI" aria-controls="rcPI" aria-selected="true">Ingredients <span class="rc-comp"></span></button><button type="button" role="tab" id="rcTP" aria-controls="rcPP" aria-selected="false">Passos</button></div>' +
      '<div class="rc-cuina-cos">' +
      '<section class="rc-sec" id="rcPI" role="tabpanel" aria-labelledby="rcTI"><h3 class="rc-sec-h">Ingredients <span class="rc-comp"></span></h3>' +
      dades.ing.map(function (g) { return '<h4>' + esc(g.grup) + '</h4><ul class="rc-llista">' + g.items.map(function (it) { var c = g.grup + "|" + it.nom; return '<li><label><input type="checkbox" data-c="' + esc(c) + '"' + (marcats[c] ? " checked" : "") + '><span class="rc-q">' + esc(it.q) + '</span><span class="rc-n">' + esc(it.nom) + "</span></label></li>"; }).join("") + "</ul>"; }).join("") +
      '<button type="button" class="rc-desmarca">Desmarca-ho tot</button></section>' +
      '<section class="rc-sec rc-amaga" id="rcPP" role="tabpanel" aria-labelledby="rcTP"><h3 class="rc-sec-h">Passos</h3>' +
      (dades.pas.length ? '<div class="rc-pas" aria-live="polite"></div><div class="rc-pas-nav"><button type="button" class="rc-ant">← Anterior</button><button type="button" class="rc-seg primary">Següent →</button></div><ol class="rc-pas-llista">' + dades.pas.map(function (p, i) { return '<li><button type="button" data-pas="' + i + '">' + esc(p.t) + "</button></li>"; }).join("") + "</ol>" : '<p class="note">Aquesta recepta no té passos amb horari.</p>') +
      "</section></div>";
    doc.body.appendChild(cuinaEl);
    inertes = Array.prototype.filter.call(doc.body.children, function (c) { return c !== cuinaEl && c !== tempsEl && c !== avisEl && !c.inert; });
    inertes.forEach(function (c) { c.inert = true; });
    root.classList.add("rc-bloc"); llum(true);

    function desa() { store.jset(k, { m: Object.keys(marcats), p: pas, t: Date.now() }); }
    function compte() { var n = Object.keys(marcats).length; cuinaEl.querySelectorAll(".rc-comp").forEach(function (s) { s.textContent = n + "/" + total; }); }
    function pintaPas() {
      var box = cuinaEl.querySelector(".rc-pas"); if (!box) return;
      var p = dades.pas[pas];
      box.innerHTML = '<p class="rc-pas-n">Pas ' + (pas + 1) + " de " + dades.pas.length + (p.quan ? " · " + esc(p.quan) : "") + '</p><p class="rc-pas-t">' + esc(p.t) + "</p>" + (p.det ? '<p class="rc-pas-d">' + esc(p.det) + "</p>" : "") +
        (p.min ? '<button type="button" class="rc-temp-ini">' + ui("rellotge") + "Temporitzador de " + (p.min >= 60 ? (Math.floor(p.min / 60) + " h" + (p.min % 60 ? " " + Math.round(p.min % 60) + " min" : "")) : Math.round(p.min) + " min") + "</button>" : "");
      cuinaEl.querySelector(".rc-ant").disabled = pas === 0;
      var sg = cuinaEl.querySelector(".rc-seg"); sg.textContent = pas === dades.pas.length - 1 ? "Fet!" : "Següent →";
      cuinaEl.querySelectorAll("[data-pas]").forEach(function (b) { b.setAttribute("aria-current", +b.getAttribute("data-pas") === pas ? "step" : "false"); });
      var tb = box.querySelector(".rc-temp-ini"); if (tb) tb.addEventListener("click", function () { nouTemps(p.t.length > 42 ? p.t.slice(0, 40) + "…" : p.t, p.min); });
      desa();
    }
    function mostra(q) {
      var ing = q === "ing";
      cuinaEl.querySelector("#rcTI").setAttribute("aria-selected", String(ing)); cuinaEl.querySelector("#rcTP").setAttribute("aria-selected", String(!ing));
      cuinaEl.querySelector("#rcPI").classList.toggle("rc-amaga", !ing); cuinaEl.querySelector("#rcPP").classList.toggle("rc-amaga", ing);
      sincronitza(cuinaEl.querySelector(".rc-cuina-tabs"));
    }
    cuinaEl.querySelector("#rcTI").addEventListener("click", function () { mostra("ing"); });
    cuinaEl.querySelector("#rcTP").addEventListener("click", function () { mostra("pas"); });
    cuinaEl.querySelector(".rc-tanca").addEventListener("click", tancaCuina);
    cuinaEl.querySelector(".rc-desmarca").addEventListener("click", function () { marcats = {}; cuinaEl.querySelectorAll("[data-c]").forEach(function (c) { c.checked = false; }); compte(); desa(); });
    cuinaEl.addEventListener("change", function (e) { var c = e.target.getAttribute && e.target.getAttribute("data-c"); if (c == null) return; if (e.target.checked) marcats[c] = 1; else delete marcats[c]; compte(); desa(); });
    if (dades.pas.length) {
      cuinaEl.querySelector(".rc-ant").addEventListener("click", function () { if (pas > 0) { pas--; pintaPas(); } });
      cuinaEl.querySelector(".rc-seg").addEventListener("click", function () { if (pas < dades.pas.length - 1) { pas++; pintaPas(); } else tancaCuina(); });
      cuinaEl.querySelector(".rc-pas-llista").addEventListener("click", function (e) { var b = e.target.closest("[data-pas]"); if (b) { pas = +b.getAttribute("data-pas"); pintaPas(); cuinaEl.querySelector(".rc-pas").scrollIntoView({ block: "nearest" }); } });
      pintaPas();
    }
    cuinaEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); tancaCuina(); return; }
      var t = e.target, tag = t.tagName;
      var fletxa = e.key === "ArrowRight" || e.key === "ArrowLeft";
      var passosVisibles = matchMedia("(min-width:900px)").matches || !cuinaEl.querySelector("#rcPP").classList.contains("rc-amaga");
      if (fletxa && dades.pas.length && passosVisibles && tag !== "INPUT" && t.getAttribute("role") !== "tab") {
        e.preventDefault(); if (e.key === "ArrowRight" && pas < dades.pas.length - 1) pas++; else if (e.key === "ArrowLeft" && pas > 0) pas--; pintaPas(); return;
      }
      if (e.key === "Tab") { var f = Array.prototype.filter.call(cuinaEl.querySelectorAll("button,input"), function (x) { return !x.disabled && x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && doc.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && doc.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
    compte(); sincronitza(cuinaEl.querySelector(".rc-cuina-tabs"));
    cuinaEl.querySelector(".rc-tanca").focus();
  }
  function tancaCuina() {
    if (!cuinaEl) return;
    inertes.forEach(function (c) { c.inert = false; }); inertes = [];
    cuinaEl.remove(); cuinaEl = null; root.classList.remove("rc-bloc"); llum(false);
    if (abansFocus && abansFocus.focus) abansFocus.focus();
  }

  /* ---------- Llista de la compra combinada ---------- */
  var CKEY = "receptari-compra";
  function afegeixCompra() {
    var items = []; try { items = API.compra() || []; } catch (e) {}
    if (!items.length) { avis("Aquesta recepta no té res per comprar."); return; }
    var L = store.jget(CKEY, { receptes: [], marcats: {} }), titol = API.titol ? API.titol() : doc.title, clau = ID + "|" + titol;
    var abans = L.receptes.length;
    L.receptes = L.receptes.filter(function (r) { return r.clau !== clau; });
    var nova = L.receptes.length === abans;
    L.receptes.push({ clau: clau, id: ID, fitxer: location.pathname.split("/").pop(), titol: titol, mesura: API.mesura ? API.mesura() : "", items: items, quan: Date.now() });
    if (!store.jset(CKEY, L)) { avis("Aquest navegador no deixa desar la llista."); return; }
    var n = L.receptes.length;
    avis((nova ? "Afegit a la llista de la compra" : "Llista de la compra actualitzada") + " · " + n + (n === 1 ? " recepta" : " receptes") + '. <a href="index.html#compra" target="_top">Obre la llista</a>', 6000);
  }

  /* ---------- Compartir la configuració ---------- */
  function b64(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64(t) { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; var s = atob(t), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function codifica(o) {
    var bytes = new TextEncoder().encode(JSON.stringify(o));
    if (!("CompressionStream" in window)) return Promise.resolve("j" + b64(bytes));
    var cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    return new Response(cs).arrayBuffer().then(function (b) { return "z" + b64(new Uint8Array(b)); }).catch(function () { return "j" + b64(bytes); });
  }
  function descodifica(t) {
    var bytes = unb64(t.slice(1));
    if (t[0] === "j") return Promise.resolve(JSON.parse(new TextDecoder().decode(bytes)));
    var ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Response(ds).text().then(JSON.parse);
  }
  function comparteix() {
    var titol = API.titol ? API.titol() : doc.title;
    codifica(API.estat()).then(function (c) {
      var u = new URL(web ? "index.html" : location.pathname, location.href);
      u.search = "?estat=" + c; u.hash = ID || "";
      var url = u.href;
      if (navigator.share && matchMedia("(pointer:coarse)").matches) { navigator.share({ title: titol, text: titol, url: url }).catch(function () {}); return; }
      var ok = function () { avis("Enllaç copiat. Qui l'obri veurà aquesta mateixa recepta, amb les teves quantitats."); };
      var ko = function () { avis('Copia aquest enllaç: <input class="rc-url" readonly value="' + esc(url) + '" aria-label="Enllaç per compartir">', 15000); var i = avisEl.querySelector("input"); i.focus(); i.select(); };
      try { navigator.clipboard.writeText(url).then(ok, ko); } catch (e) { ko(); }
    });
  }
  function llegeixEstat() {
    var c = null; try { c = new URLSearchParams(location.search).get("estat"); } catch (e) {}
    if (!c || !API || !API.carrega) return;
    descodifica(c).then(function (o) {
      if (API.carrega(o)) { avis("Has obert una recepta compartida: " + esc(API.titol ? API.titol() : "")); refresca(); }
      else avis("Aquest enllaç no correspon a cap recepta d'aquesta pàgina.");
    }).catch(function () { avis("No s'ha pogut llegir l'enllaç compartit."); })
      .then(function () { try { var u = new URL(location.href); u.searchParams.delete("estat"); history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (e) {} });
  }

  /* ---------- Sense connexió (només a GitHub Pages) ---------- */
  function offline() {
    if (!web || !("serviceWorker" in navigator) || (location.protocol !== "https:" && location.hostname !== "localhost")) return;
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  window.addEventListener("storage", function (e) {
    if (e.key === "receptari-tema") aplicaTema(e.newValue);
    if (e.key === TKEY) pintaTemps();
  });

  window.Receptari = { icona: icona, ui: ui, canviaTema: canviaTema, aplicaTema: aplicaTema, avis: avis, esc: esc };

  function inici() {
    API = window.RECEPTARI || null;
    totesLesPestanyes();
    new MutationObserver(totesLesPestanyes).observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-selected"] });
    if (!esIndex) { capcalera(); accions(); resum(); detalls(); muntaTemps(); llegeixEstat(); }
    if (!dinsIndex) offline();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", inici); else inici();
})();
