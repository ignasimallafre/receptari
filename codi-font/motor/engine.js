// ===== Motor comú del receptari (basat en la calculadora de vermut) =====
(function(){
const P=window.PAGE;
const $=id=>document.getElementById(id);
const I=P.ing.map(a=>({id:a[0],fam:a[1],ca:a[2],es:a[3],sci:a[4],taste:a[5],unit:a[6],min:a[7],max:a[8],step:a[9],typ:a[10],where:a[11],v:a[12]||{},scaling:a[13]||"lin",eq:a[14]||null}));
const BY=Object.fromEntries(I.map(x=>[x.id,x]));
P.BY=BY;
const LVL={low:["Baixa",.7],mid:["Mitja",1],high:["Alta",1.3]};
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
P.nf=nf;
const UNITS=Object.assign({g:["g","g"],ml:["ml","ml"],ou:["ou","ous"],unitat:["unitat","unitats"],fulla:["fulla","fulles"],beina:["beina","beines"],gra:["gra","grans"],branca:["branca","branques"],llimona:["llimona","llimones"],taronja:["taronja","taronges"]},P.units||{});
const CONT=new Set(["g","ml"]);
const INTU=new Set(["gra","unitat"]);
const unitLbl=(u,n)=>{const p=UNITS[u]||[u,u];return Math.abs(n-1)<1e-9?p[0]:p[1];};
function fmtAmt(x,a,plain){
  if(CONT.has(x.unit)){const d=a<.1?3:a<1?2:a<10?1:0;let s=nf(a>=200?Math.round(a/5)*5:a,d)+" "+x.unit;
    if(x.eq&&!plain){const n=a/x.eq[2];const r=Math.max(.5,Math.round(n*2)/2);s+=` <span class="eqh">(≈${nf(r,1)} ${r===1?x.eq[0]:x.eq[1]})</span>`;}
    return s;}
  let v=INTU.has(x.unit)?Math.max(1,Math.round(a)):Math.max(.5,Math.round(a*2)/2);
  return nf(v,1)+" "+unitLbl(x.unit,v);
}
P.fmtAmt=fmtAmt;
const strip=s=>String(s).replace(/<[^>]+>/g,"");

// ---------- estat ----------
const S={tab:P.tabOrd[0],tabs:{}};
const R=()=>P.recipes[S.tab];
const st=()=>S.tabs[S.tab];
function freshState(k){
  const r=P.recipes[k];const s={n:r.measure.def,p:{},doses:{},profile:r.def,custom:false,lvl:{},start:null};
  for(const q of (r.params||[]))s.p[q.id]=q.def;
  return s;
}
function loadProfile(k){
  const r=R(),s=st(),pr=r.profiles[k];
  s.profile=k;s.custom=false;s.doses={...pr.d};s.lvl={};
  for(const q of (r.params||[]))s.p[q.id]=q.def;
  Object.assign(s.p,pr.p||{});
  if(pr.n!=null)s.n=pr.n;
  render();
}
function setLevel(f,l){
  const s=st(),r=R();
  const items=I.filter(x=>x.fam===f&&x.id in s.doses&&!(r.derived||[]).includes(x.id));const n=items.length;if(!n)return;
  const k=n>2?Math.sqrt(2/n):1;
  for(const x of items){let v=x.typ*LVL[l][1]*k;v=Math.min(x.max,Math.max(x.min,Math.round(v/x.step)*x.step));s.doses[x.id]=+v.toFixed(4);}
  s.lvl[f]=l;
}
function derive(){const r=R();if(r.derive)r.derive(st());}

// ---------- quantitats ----------
function K(x){const r=R(),s=st(),m=r.measure;
  if(x.scaling==="fix")return 1;
  if(x.scaling==="sub"){const b=m.base||m.def;return b*m.k*Math.pow(s.n/b,.8);}
  return s.n*m.k;}
function amount(x,v){const r=R();return r.amount?r.amount(x,v,st(),K(x)):v*K(x);}
P.amount=(id)=>{const s=st();return id in s.doses?amount(BY[id],s.doses[id]):0;};
function perStr(x,v){const r=R();if(r.per)return r.per(x,v,st());
  if(r.pct)return nf(v,v<1?2:v<10?1:0)+" %";
  return fmtAmt(x,v,true)+(r.perSuffix||"");}
function totStr(x,v){const r=R();const a=amount(x,v);return r.fmtTot?r.fmtTot(x,a,st()):fmtAmt(x,a);}

// ---------- sabor ----------
function flavour(C){
  const r=R(),s=st();const F=Object.fromEntries(r.dims.map(d=>[d[0],0]));
  for(const [id,val] of Object.entries(s.doses)){const x=BY[id];if(!x)continue;const q=x.typ?val/x.typ:0;for(const k in x.v)if(k in F)F[k]+=x.v[k]*q;}
  if(r.flavExtra)r.flavExtra(s,C,F);
  return F;
}

// ---------- avisos ----------
function warnings(C,F){
  const r=R(),s=st();const w=r.warn?r.warn(s,C,F):[];
  const famCount={};for(const id in s.doses){const f=BY[id].fam;famCount[f]=(famCount[f]||0)+1;}
  const lim=r.famMax||{};
  for(const f of r.famOrd){const L=lim[f]||4;if((famCount[f]||0)>L)w.push(["warn",`Tens ${famCount[f]} ingredients de ${r.fam[f].toLowerCase()}: el perfil es difumina.`]);}
  return w;
}

// ---------- renders ----------
function renderTabs(){
  const nav=$("tabs");if(P.tabOrd.length<2){nav.hidden=true;return;}
  nav.innerHTML=P.tabOrd.map(k=>`<button type="button" class="tab" role="tab" id="tab-${k}" data-tab="${k}" aria-controls="panel" aria-selected="${S.tab===k}" tabindex="${S.tab===k?0:-1}">${P.recipes[k].name}</button>`).join("");
  const pn=$("panel");if(pn){pn.setAttribute("role","tabpanel");pn.setAttribute("aria-labelledby","tab-"+S.tab);}
}
$("tabs").addEventListener("keydown",e=>{const i=P.tabOrd.indexOf(S.tab);let j=-1;
  if(e.key==="ArrowRight")j=(i+1)%P.tabOrd.length;else if(e.key==="ArrowLeft")j=(i-1+P.tabOrd.length)%P.tabOrd.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=P.tabOrd.length-1;else return;
  e.preventDefault();showTab(P.tabOrd[j]);const t=$("tab-"+P.tabOrd[j]);if(t)t.focus();});
document.documentElement.lang="ca";
function paramHTML(q,s){
  if(q.show&&!q.show(s))return "";
  const v=s.p[q.id];let h=q.sec?`<div class="sub">${q.sec}</div>`:"";
  if(q.type==="range")h+=`<label class="f">${q.label}: <span class="num" id="pl-${q.id}">${q.fmt?q.fmt(v,s):v}</span><input type="range" id="p-${q.id}" data-p="${q.id}" min="${q.min}" max="${q.max}" step="${q.step}" value="${v}"></label>`;
  else if(q.type==="select")h+=`<label class="f">${q.label}<select id="p-${q.id}" data-p="${q.id}">${q.opts.map(([k,n])=>`<option value="${k}"${String(k)===String(v)?" selected":""}>${n}</option>`).join("")}</select></label>`;
  else if(q.type==="check")h+=`<label class="f chk"><input type="checkbox" id="p-${q.id}" data-p="${q.id}"${v?" checked":""}> ${q.label}</label>`;
  else if(q.type==="number")h+=`<label class="f">${q.label}<input type="number" id="p-${q.id}" data-p="${q.id}" min="${q.min}" max="${q.max}" step="${q.step}" value="${v}"></label>`;
  if(q.hint)h+=`<p class="hint">${typeof q.hint==="function"?q.hint(s):q.hint}</p>`;
  return h;
}
function renderParams(){
  const r=R(),s=st();const ps=r.params||[];
  const acts=g=>(r.actions||[]).filter(a=>(a.group||"main")===g&&(!a.show||a.show(s))).map(a=>`<button type="button" data-act="${a.id}">${a.label}</button>`).join("");
  $("params").innerHTML=ps.filter(q=>q.group!=="tl").map(q=>paramHTML(q,s)).join("")+(acts("main")?`<div class="btnrow">${acts("main")}</div>`:"");
  $("paramsTl").innerHTML=ps.filter(q=>q.group==="tl").map(q=>paramHTML(q,s)).join("")+(acts("tl")?`<div class="btnrow">${acts("tl")}</div>`:"");
}
function renderMeasure(){
  const r=R(),s=st(),m=r.measure;
  $("h-lot").textContent=r.lotTitle||"La pastada";$("mLabel").textContent=m.label;$("mUnit").textContent=m.unit||"";
  const inp=$("mVal");inp.min=m.min;inp.max=m.max;inp.step=m.step;inp.value=s.n;
}
function renderProfiles(){
  const r=R(),s=st();
  $("profiles").innerHTML=Object.entries(r.profiles).map(([k,p])=>`<button type="button" class="prof" data-prof="${k}" aria-pressed="${s.profile===k}"><b>${p.name}</b><span>${p.desc}</span></button>`).join("");
  $("customTag").hidden=!s.custom;
}
function renderRec(C){
  const r=R(),s=st();const rec=r.rec?r.rec(s,C):null;const b=$("recBox");
  if(!rec){b.hidden=true;return;}b.hidden=false;
  b.innerHTML=`<h3>${rec.title}</h3><b>${rec.main}</b>${rec.sub?`<span class="num" style="font-size:.82rem">${rec.sub}</span>`:""}<span class="why">${rec.why}</span>`;
}
function renderMix(){
  const r=R(),s=st();const der=r.derived||[];
  $("h-mix").textContent=r.mixTitle||"Ingredients";
  let h=`<div class="mrow head"><span>Ingredient</span><span>Dosi</span><span style="text-align:right">${r.perLabel}</span><span style="text-align:right">${r.totLabel||"Total"}</span><span></span></div>`;
  for(const f of r.famOrd){
    const items=I.filter(x=>x.fam===f&&x.id in s.doses);if(!items.length)continue;
    const lvlable=items.some(x=>!der.includes(x.id)&&!(r.noLevel||[]).includes(f));
    h+=`<div class="famhead"><span class="fn">${r.fam[f]}</span>${lvlable?`<span class="lvl" role="group" aria-label="Intensitat de ${r.fam[f].toLowerCase()}">${Object.entries(LVL).map(([k,[n]])=>`<button type="button" data-lvl="${f}:${k}" aria-pressed="${s.lvl&&s.lvl[f]===k}">${n}</button>`).join("")}</span>`:""}</div>`;
    for(const x of items){const v=s.doses[x.id];const req=r.req.includes(x.id);const dv=der.includes(x.id);
      h+=`<div class="mrow"><div class="nm"><b>${x.ca}</b>${req?'<span class="req">obligatori</span>':''}${dv?'<span class="calc">calculat</span>':''}${x.sci?` <span class="sci">${x.sci}</span>`:""}<span class="taste">${x.taste}</span></div>
      <div class="sl"><input type="range" id="r-${x.id}" data-dose="${x.id}" min="${x.min}" max="${x.max}" step="${x.step}" value="${v}" aria-label="Dosi de ${x.ca}"${dv?" disabled":""}></div>
      <div class="val pb" data-l="${r.perLabel}">${perStr(x,v)}</div>
      <div class="val tot">${totStr(x,v)}</div>
      <div class="rm"><button type="button" class="ghost" data-rm="${x.id}" ${req?"disabled":""} aria-label="Treure ${x.ca}" title="${req?"Obligatori":"Treure"}">✕</button></div></div>`;}
  }
  $("mix").innerHTML=h;
}
function updateRowValues(){
  const s=st();
  document.querySelectorAll(".mix .mrow:not(.head)").forEach(row=>{const inp=row.querySelector("[data-dose]");const x=BY[inp.dataset.dose];const v=s.doses[x.id];
    if(inp.disabled||document.activeElement!==inp)inp.value=v;
    row.querySelector(".pb").innerHTML=perStr(x,v);row.querySelector(".tot").innerHTML=totStr(x,v);});
}
function renderCatalog(){
  const r=R(),s=st();let h="";
  for(const f of r.famOrd){const items=I.filter(x=>x.fam===f&&r.ing.includes(x.id)&&!(x.id in s.doses));if(!items.length)continue;
    h+=`<div><h3>${r.fam[f]}</h3><div class="chips" style="margin-top:6px">${items.map(x=>`<button type="button" class="chip" data-add="${x.id}" title="${x.taste}${x.sci?" · "+x.sci:""}"><span class="plus">+</span>${x.ca}</button>`).join("")}</div></div>`;}
  $("catalog").innerHTML=h||'<p class="ok">Ja hi són tots.</p>';
}
function renderCalc(C){
  $("h-calc").textContent=R().calcTitle||"Càlculs";
  $("calc").innerHTML=C.rows.map(r=>r[0]==="§"?`<dt class="sec">${r[1]}</dt>`:`<dt>${r[0]}</dt><dd${r[2]?' class="hl"':""}>${r[1]}</dd>`).join("");
  $("calcNote").innerHTML=C.note||"";
}
function renderFlavour(F){
  const r=R();const max=r.dimMax||10;
  $("flav").innerHTML=r.dims.map(([k,n])=>`<span>${n}</span><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,F[k]/max*100))}%"></div></div><span class="num" style="text-align:right">${nf(Math.max(0,F[k]),0)}</span>`).join("");
}
function renderWarnings(w){
  const lbl={bad:"Conflicte",warn:"Avís",info:"Consell"};const ord={bad:0,warn:1,info:2};w.sort((a,b)=>ord[a[0]]-ord[b[0]]);
  $("warns").innerHTML=w.length?w.map(([s,t])=>`<li class="w ${s}"><span class="tag">${lbl[s]}</span><span>${t}</span></li>`).join(""):'<li class="ok">Cap conflicte. La recepta està equilibrada.</li>';
}
function shopGroups(C){
  const r=R(),s=st();const g={};
  for(const id in s.doses){const x=BY[id];if(r.shopSkip&&r.shopSkip.includes(id))continue;const a=amount(x,s.doses[id]);if(a<=0)continue;(g[x.where]=g[x.where]||[]).push([x,a]);}
  const out=[];
  for(const k of Object.keys(P.where))if(g[k])out.push({h:P.where[k],items:g[k].map(([x,a])=>[x.ca,r.fmtTot?r.fmtTot(x,a,s):fmtAmt(x,a)])});
  if(r.shopExtra)out.push(...r.shopExtra(s,C));
  return out;
}
function renderShop(C){
  $("shop").innerHTML=shopGroups(C).map(gr=>`<div><h3>${gr.h}</h3><ul>${gr.items.map(([n,a])=>`<li>${n}${a?`: <span class="num">${a}</span>`:""}</li>`).join("")}</ul></div>`).join("");
}
function shopText(C){return shopGroups(C).map(gr=>gr.h+"\n"+gr.items.map(([n,a])=>"- "+n+(a?": "+strip(a):"")).join("\n")).join("\n\n");}

// ---------- cronologia ----------
const mode=()=>R().tl.mode;
function startDate(){const s=st();
  if(mode()==="d")return s.start?new Date(s.start.slice(0,10)+"T12:00:00"):new Date();
  return s.start?new Date(s.start):new Date();}
function addOff(d,o){const r=new Date(d);if(mode()==="d")r.setDate(r.getDate()+o);else r.setTime(r.getTime()+o*3600000);return r;}
const fdD=d=>d.toLocaleDateString("ca-ES",{weekday:"short",day:"numeric",month:"short"});
const fdT=d=>d.toLocaleTimeString("ca-ES",{hour:"2-digit",minute:"2-digit"});
function offLbl(o){if(mode()==="d")return "dia "+Math.round(o);const h=Math.floor(o+1e-6),m=Math.round((o-h)*60);return `+${h} h${m?" "+String(m).padStart(2,"0"):""}`;}
function evDate(o){const d=addOff(startDate(),o);return mode()==="d"?fdD(d):`${fdD(d)} ${fdT(d)}`;}
function events(C){const T=R().timeline(st(),C);T.ev.sort((a,b)=>a[0]-b[0]);return T;}
function renderTimeline(C){
  $("startLbl").textContent=R().tl.startLabel||"Comences";
  const T=events(C);
  $("timeline").innerHTML=T.ev.map(([o,t])=>`<li><span class="d">${evDate(o)}<small>${offLbl(o)}</small></span><span class="t">${t}</span></li>`).join("")+
    (T.tail||[]).map(([a,b])=>`<li><span class="d" style="color:var(--muted)">${a}</span><span class="t">${b}</span></li>`).join("");
}
function renderHow(){const r=R();const h=typeof r.how==="function"?r.how(st()):r.how;$("howPanel").hidden=!h;if(h)$("how").innerHTML=h.map(t=>`<li>${t}</li>`).join("");}

// ---------- muntatge ----------
let lastC=null;
function computeAll(){derive();const C=R().calc(st());lastC=C;return C;}
function render(){
  const s=st();
  renderTabs();renderMeasure();renderParams();renderProfiles();
  const C=computeAll();renderMix();renderCatalog();renderComputedWith(C);
  const sd=$("startDate");sd.type=mode()==="d"?"date":"datetime-local";sd.value=mode()==="d"?(s.start||"").slice(0,10):(s.start||"");
  renderHow();
}
function renderComputed(){const C=computeAll();updateRowValues();renderComputedWith(C);}
function renderComputedWith(C){
  const F=flavour(C);
  renderCalc(C);renderRec(C);renderFlavour(F);renderWarnings(warnings(C,F));renderShop(C);renderTimeline(C);
  const r=R(),s=st();if(r.measure.hint)$("mHint").innerHTML=r.measure.hint(s,C);else $("mHint").textContent="";
  $("loadNote").textContent=r.loadNote?r.loadNote(s,C):`${Object.keys(s.doses).length} ingredients`;
  for(const q of (r.params||[]))if(q.type==="range"&&q.fmt){const l=$("pl-"+q.id);if(l)l.textContent=q.fmt(s.p[q.id],s);}
  document.querySelectorAll(".prof").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.prof===s.profile)));
}
function markCustom(){const s=st();if(!s.custom){s.custom=true;$("customTag").hidden=false;}}

// ---------- esdeveniments ----------
document.addEventListener("click",e=>{
  const s=st(),r=R();
  const tb=e.target.closest("[data-tab]");if(tb){showTab(tb.dataset.tab);return;}
  const p=e.target.closest("[data-prof]");if(p){loadProfile(p.dataset.prof);return;}
  const ac=e.target.closest("[data-act]");if(ac){const a=(r.actions||[]).find(z=>z.id===ac.dataset.act);if(a){const m=a.run(s,lastC);markCustom();render();if(m)flash(m);}return;}
  const lv=e.target.closest("[data-lvl]");if(lv){const [f,l]=lv.dataset.lvl.split(":");setLevel(f,l);markCustom();render();return;}
  const a=e.target.closest("[data-add]");if(a){const x=BY[a.dataset.add];s.doses[x.id]=x.typ;if(s.lvl[x.fam])setLevel(x.fam,s.lvl[x.fam]);markCustom();render();return;}
  const rm=e.target.closest("[data-rm]");if(rm&&!rm.disabled){const f=BY[rm.dataset.rm].fam;delete s.doses[rm.dataset.rm];if(s.lvl[f])setLevel(f,s.lvl[f]);markCustom();render();return;}
});
document.addEventListener("input",e=>{
  const t=e.target,s=st(),r=R();
  if(t.dataset.dose){s.doses[t.dataset.dose]=parseFloat(t.value);const f=BY[t.dataset.dose].fam;if(s.lvl[f]){delete s.lvl[f];document.querySelectorAll(`[data-lvl^="${f}:"]`).forEach(b=>b.setAttribute("aria-pressed","false"));}markCustom();renderComputed();return;}
  if(t.dataset.p){const q=r.params.find(z=>z.id===t.dataset.p);
    let v=q.type==="check"?t.checked:q.type==="select"?(isNaN(+t.value)?t.value:+t.value):parseFloat(t.value);
    if(q.type==="number"){if(isNaN(v))return;v=Math.min(q.max,Math.max(q.min,v));}
    s.p[q.id]=v;if(!q.noCustom)markCustom();
    if(q.type==="select"||q.type==="check"||q.rerender){if(q.onSet)q.onSet(s,v);render();}else{if(q.onSet)q.onSet(s,v);renderComputed();}
    return;}
  if(t.id==="mVal"){const m=r.measure;const n=parseFloat(t.value);if(isNaN(n))return;s.n=Math.min(m.max,Math.max(m.min,n));renderComputed();return;}
  if(t.id==="startDate"){s.start=t.value;renderComputed();return;}
});
$("mMinus").onclick=()=>{const m=R().measure,s=st();s.n=Math.max(m.min,+(s.n-m.step).toFixed(3));$("mVal").value=s.n;renderComputed();};
$("mPlus").onclick=()=>{const m=R().measure,s=st();s.n=Math.min(m.max,+(s.n+m.step).toFixed(3));$("mVal").value=s.n;renderComputed();};
function showTab(k){S.tab=k;try{localStorage.setItem(P.key+"-tab",k);}catch(_){}render();}

// ---------- text ----------
function recipeText(C){
  const r=R(),s=st(),pr=r.profiles[s.profile];
  let t=`${P.titleShort||P.title} — ${r.name} · ${pr.name}${s.custom?" (personalitzat)":""}\n${r.measure.label}: ${nf(s.n,2)} ${r.measure.unit||""}\n`;
  if(C.summary)t+=C.summary+"\n";
  t+="\n";
  for(const row of C.rows)t+=row[0]==="§"?`\n${row[1]}\n`:`- ${strip(row[0])}: ${strip(row[1])}\n`;
  t+=`\nIngredients (${r.perLabel.toLowerCase()} · ${(r.totLabel||"total").toLowerCase()}):\n`;
  for(const f of r.famOrd)for(const x of I.filter(x=>x.fam===f&&x.id in s.doses))t+=`- ${x.ca}${x.sci?" ("+x.sci+")":""}: ${strip(perStr(x,s.doses[x.id]))} · ${strip(totStr(x,s.doses[x.id]))}\n`;
  const T=events(C);t+="\nCronologia:\n";
  for(const [o,tx] of T.ev)t+=`- ${evDate(o)} (${offLbl(o)}): ${strip(tx)}\n`;
  for(const [a,b] of (T.tail||[]))t+=`- ${a}: ${strip(b)}\n`;
  return t;
}
function flash(m){$("toast").textContent=m;clearTimeout(flash.t);flash.t=setTimeout(()=>$("toast").textContent="",2500);}
function copy(text,ok){
  const show=()=>{const pre=$("recipeTxt");pre.textContent=text;pre.hidden=false;const rg=document.createRange();rg.selectNodeContents(pre);const sl=getSelection();sl.removeAllRanges();sl.addRange(rg);flash("Text seleccionat: copia'l amb Ctrl+C");};
  try{navigator.clipboard.writeText(text).then(()=>flash(ok),show);}catch(_){show();}
}
$("copyShop").onclick=()=>copy(shopText(lastC),"Llista copiada");
$("copyRecipe").onclick=()=>copy(recipeText(lastC),"Recepta copiada");

// ---------- PDF ----------
const PS=s=>strip(s).replace(/≈/g,"~").replace(/[—–]/g,"-").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/…/g,"...").replace(/→/g,"->").replace(/×/g,"x").replace(/≥/g,">=").replace(/≤/g,"<=").replace(/·/g,"·").replace(/[½]/g,"1/2").replace(/[⅓]/g,"1/3").replace(/[¼]/g,"1/4").replace(/ | /g," ");
const dmy=d=>d.toLocaleDateString("ca-ES",{day:"2-digit",month:"2-digit",year:"numeric"});
function buildPDF(){
  const {jsPDF}=window.jspdf;const d=new jsPDF({unit:"mm",format:"a4"});
  const r=R(),s=st(),C=computeAll(),F=flavour(C),pr=r.profiles[s.profile];const K0=P.pdf;
  const col=a=>d.setTextColor(...a);const font=(z,y)=>{d.setFont("helvetica",z);d.setFontSize(y);};
  const T=(t,x,y,o)=>d.text(PS(t),x,y,o);
  const fit=(t,w)=>{t=PS(t);if(d.getTextWidth(t)<=w)return t;while(t.length>1&&d.getTextWidth(t+".")>w)t=t.slice(0,-1);return t+".";};
  const H=(t,x,y)=>{font("bold",7.5);col(K0.ACC);d.text(PS(t.toUpperCase()),x,y,{charSpace:.35});};
  const line=(x1,y,x2)=>{d.setDrawColor(...K0.LN);d.setLineWidth(.2);d.line(x1,y,x2,y);};
  const M=12,RR=198,BOT=285;let y=17;
  font("bold",16);col(K0.INK);T(fit(`${r.name} · ${pr.name}${s.custom?" (personalitzat)":""}`,125),M,y);
  font("normal",8.5);col(K0.MUT);T("Lot",142,y-1);line(149,y-.6,RR);
  const lot=$("saveName").value.trim();if(lot){font("bold",9);col(K0.INK);T(fit(lot,48),150,y-1.6);}
  y+=6;font("normal",8.6);col(K0.MUT);
  const sumL=d.splitTextToSize(PS(`${r.measure.label}: ${nf(s.n,2)} ${r.measure.unit||""}${C.summary?" · "+C.summary:""}`),RR-M).slice(0,2);
  sumL.forEach(l=>{d.text(l,M,y);y+=4.2;});
  y-=.7;d.setDrawColor(...K0.ACC);d.setLineWidth(.7);d.line(M,y,RR,y);y+=6;
  // càlculs i sabor
  H(r.calcTitle||"Càlculs",M,y);H("Perfil de sabor",112,y);
  const rows=C.rows.filter(x=>x[0]!=="§");const crh=Math.min(4.4,58/Math.max(1,rows.length));const cfs=Math.min(8.6,crh*2);
  let ly=y+5;for(const [k,v] of rows){font("normal",cfs);col(K0.MUT);T(fit(k,62),M,ly);font("bold",cfs);col(K0.INK);T(fit(v,34),102,ly,{align:"right"});line(M,ly+1.1,102);ly+=crh;}
  let fy=y+5;for(const [k,n] of r.dims){const val=Math.max(0,F[k]),mx=r.dimMax||10;
    font("normal",8);col(K0.MUT);T(n,112,fy);d.setFillColor(...K0.LN);d.rect(136,fy-2.4,52,2.8,"F");
    d.setFillColor(...K0.BAR);d.rect(136,fy-2.4,Math.max(.3,Math.min(52,val/mx*52)),2.8,"F");
    font("bold",8);col(K0.INK);T(nf(val,0),RR,fy,{align:"right"});fy+=4.2;}
  y=Math.max(ly,fy)+1.5;
  const ws=warnings(C,F).filter(w=>w[0]!=="info").slice(0,3);
  for(const [sv,t] of ws){font("bold",7.6);col(sv==="bad"?K0.RED:K0.ACC);const l=d.splitTextToSize(PS((sv==="bad"?"Conflicte: ":"Avís: ")+t),RR-M)[0];d.text(l,M,y);y+=3.8;}
  y+=2.5;
  // taula
  const tr=[];for(const f of r.famOrd){const it=I.filter(x=>x.fam===f&&x.id in s.doses);if(!it.length)continue;tr.push({fam:r.fam[f]});it.forEach(x=>tr.push({x}));}
  const T2=events(C);const bottomH=Math.max(78,Math.min(110,30+T2.ev.length*8.4));const avail=BOT-bottomH-y;
  const rh=Math.max(3.1,Math.min(4.8,avail/(tr.length+1)));const fs=Math.max(6.1,Math.min(8.8,rh*1.9));
  H("Ingredients",M,y);y+=1.5;font("bold",fs-.6);col(K0.MUT);y+=rh;
  T("Ingredient",M,y);T("Nom científic",80,y);T(r.perLabel,163,y,{align:"right"});T(r.totLabel||"Total",RR,y,{align:"right"});line(M,y+1.2,RR);
  for(const z of tr){y+=rh;if(z.fam){font("bold",fs-1);col(K0.ACC);T(z.fam.toUpperCase(),M,y);continue;}
    const x=z.x,v=s.doses[x.id];font("bold",fs);col(K0.INK);T(fit(x.ca,64),M,y);font("italic",fs);col(K0.MUT);T(fit(x.sci||"",48),80,y);font("normal",fs);col(K0.MUT);T(fit(perStr(x,v),24),163,y,{align:"right"});
    font("bold",fs);col(K0.INK);T(fit(totStr(x,v),32),RR,y,{align:"right"});line(M,y+rh*.32,RR);}
  y+=7;
  // procés
  H("Procés",M,y);
  let py=y+5.5;const pstep=Math.min(8.6,Math.max(6.6,(BOT-y-30)/Math.max(1,T2.ev.length)));
  for(const [o,t] of T2.ev){if(py>BOT-6)break;font("bold",7.8);col(K0.INK);T(fit(t.replace(/\.$/,""),94),M,py);font("normal",7.2);col(K0.MUT);
    const dd=addOff(startDate(),o);T(`previst ${mode()==="d"?dmy(dd):dmy(dd)+" "+fdT(dd)} (${offLbl(o)})`,M,py+3.3);T("real",70,py+3.3);line(76,py+3.6,104);py+=pstep;}
  // nota de tast o registre de pes
  let ty=y;
  if(r.pdfLog){H("Registre de pes",112,ty);ty+=5.5;font("bold",7.4);col(K0.MUT);T("Data",112,ty);T("Pes (g)",140,ty);T("% pèrdua",164,ty);T("HR / °C",RR,ty,{align:"right"});ty+=2;line(112,ty,RR);
    const tgt=C.target?`Objectiu: ${C.target}`:"";for(let i=0;i<9;i++){ty+=6.2;line(112,ty,RR);}ty+=4.6;font("bold",7.6);col(K0.ACC);if(tgt)T(fit(tgt,86),112,ty);ty+=2;}
  else{H("Nota de tast",112,ty);ty+=5.5;font("normal",8.2);col(K0.MUT);T("Data del tast",112,ty);line(133,ty+.4,RR);ty+=6.6;
    T("Valoració",112,ty);d.setDrawColor(...K0.MUT);d.setLineWidth(.25);for(let i=0;i<5;i++)d.circle(133+i*6.5,ty-1.1,2,"S");ty+=6.6;
    for(const t of (r.pdfTaste||["Aspecte","Aroma","Textura","Gust"])){font("normal",8.2);col(K0.MUT);T(t,112,ty);line(133,ty+.4,RR);ty+=6.6;}}
  y=Math.max(py,ty)+2;
  if(y<BOT-8){H("Notes i canvis per a la propera vegada",M,y);for(let ny=y+7;ny<=BOT-1;ny+=7)line(M,ny,RR);}
  font("normal",6.8);col(K0.MUT);T(`${P.title} · generat el ${dmy(new Date())}`,M,BOT+6);
  return d;
}
$("pdfBtn").onclick=async()=>{
  const msg=m=>{$("pdfMsg").textContent=m;clearTimeout(msg.t);msg.t=setTimeout(()=>$("pdfMsg").textContent="",4000);};
  if(!window.jspdf){msg("No s'ha pogut carregar el generador de PDF. Torna a carregar la pàgina.");return;}
  const s=st();const fname=`${P.key}-${S.tab}-${s.profile}-${new Date().toISOString().slice(0,10)}.pdf`;
  if(!window.claude){try{buildPDF().save(fname);msg("PDF desat");}catch(e){console.error(e);msg("No s'ha pogut generar el PDF");}return;}
  let dl=null;try{dl=window.claude.use?await window.claude.use("downloads"):null;}catch(_){dl=null;}
  if(!dl){msg("La descàrrega no està disponible en aquesta vista. Copia la recepta en text.");return;}
  try{await dl.save({filename:fname,data:buildPDF().output("blob")});msg("PDF desat");}
  catch(e){const c=e&&e.code;msg(c==="declined"?"Descàrrega cancel·lada":c==="rate_limited"?"Ja hi ha una descàrrega pendent":"No s'ha pogut desar el PDF");}
};

// ---------- receptes guardades ----------
const KEY=P.key+"-receptes-v1";
function getSaved(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return[];}}
function setSaved(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(_){return false;}}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function renderSaved(){
  const a=getSaved();
  $("saved").innerHTML=a.length?a.map((z,i)=>{const rr=P.recipes[z.tab];return `<div class="srow"><div style="min-width:0"><b>${esc(z.name)}</b> <span class="meta">${rr?rr.name:""} · ${rr&&rr.profiles[z.st.profile]?rr.profiles[z.st.profile].name:""} · ${new Date(z.when).toLocaleDateString("ca-ES")}</span>${z.notes?`<div class="meta">${esc(z.notes)}</div>`:""}</div><div class="btnrow" style="flex:none"><button type="button" data-load="${i}">Carregar</button><button type="button" class="ghost" data-del="${i}" aria-label="Esborrar ${esc(z.name)}">✕</button></div></div>`;}).join(""):'<p class="ok">Encara no n\'has guardat cap.</p>';
}
$("saveBtn").onclick=()=>{
  const r=R(),s=st();const name=$("saveName").value.trim()||`${r.name} · ${r.profiles[s.profile].name} · ${new Date().toLocaleDateString("ca-ES")}`;
  const a=getSaved();a.unshift({name,notes:$("saveNotes").value.trim(),when:Date.now(),tab:S.tab,st:JSON.parse(JSON.stringify(s))});
  if(setSaved(a)){flash("Recepta guardada");$("saveName").value="";$("saveNotes").value="";renderSaved();}else flash("Aquest navegador no permet guardar");
};
$("saved").addEventListener("click",e=>{
  const l=e.target.closest("[data-load]"),dl=e.target.closest("[data-del]");const a=getSaved();
  if(l){const z=a[+l.dataset.load];if(!P.recipes[z.tab])return;S.tab=z.tab;S.tabs[z.tab]=Object.assign(freshState(z.tab),JSON.parse(JSON.stringify(z.st)));render();flash("Recepta carregada");window.scrollTo({top:0,behavior:"smooth"});}
  if(dl){a.splice(+dl.dataset.del,1);setSaved(a);renderSaved();}
});

// ---------- inici ----------
const pad=n=>String(n).padStart(2,"0");
const now=new Date();const local=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
for(const k of P.tabOrd){S.tabs[k]=freshState(k);const s=S.tabs[k];const pr=P.recipes[k].profiles[s.profile];s.doses={...pr.d};Object.assign(s.p,pr.p||{});if(pr.n!=null)s.n=pr.n;
  s.start=P.recipes[k].tl.mode==="d"?local:`${local}T${P.recipes[k].tl.defTime||"09:00"}`;}
let t0=null;try{t0=localStorage.getItem(P.key+"-tab");}catch(_){}
if(t0&&P.recipes[t0])S.tab=t0;
const hs=(location.hash||"").slice(1);if(P.recipes[hs])S.tab=hs;
render();renderSaved();
})();
