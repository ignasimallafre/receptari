// ===== Pa: barra, rodó i motlle abrioixat =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
const hf=h=>{if(!isFinite(h))return "—";const H=Math.floor(h+1e-6),M=Math.round((h-H)*60/5)*5;return M===60?`${H+1} h`:H?`${H} h${M?" "+String(M).padStart(2,"0")+" min":""}`:`${M} min`;};
// velocitat relativa del llevat respecte a 25 °C
const RT=[[0,.02],[4,.06],[8,.12],[12,.22],[16,.37],[20,.6],[22,.74],[24,.9],[25,1],[27,1.2],[30,1.45],[32,1.55],[35,1.5],[40,1.1]];
function rate(T){if(T<=RT[0][0])return RT[0][1];for(let i=1;i<RT.length;i++)if(T<=RT[i][0]){const [a,ra]=RT[i-1],[b,rb]=RT[i];return ra+(rb-ra)*(T-a)/(b-a);}return RT[RT.length-1][1];}
const YT={fresc:[1,"fresc"],instant:[3,"sec instantani"],actiu:[2,"sec actiu"]};
const PF={none:"Sense prefermet",poolish:"Poolish (100% hidratació)",biga:"Biga (50% hidratació)",vella:"Massa vella (massa de pa del dia abans)"};
const PFH={poolish:1,biga:.5,vella:.65};
const PFY={poolish:1,biga:2,vella:1.5};

const ING=[
 ["farina","fa","Farina de blat","","Triticum aestivum","La base: força per a motlle i rodó, panificable per a barra","g",0,100,1,100,"S",{}],
 ["integral","fa","Farina integral de blat","","Triticum aestivum","Gust de cereal, molla més densa; beu més aigua","g",0,60,1,20,"S",{rus:4}],
 ["segol","fa","Farina de sègol","","Secale cereale","Terrós, lleugerament àcid; gluten feble","g",0,35,1,10,"B",{rus:4,comp:1}],
 ["espelta","fa","Farina d'espelta","","Triticum spelta","Gust de nou, gluten fràgil: pastar poc","g",0,60,1,20,"B",{rus:2,dol:1}],
 ["semola","fa","Sèmola de blat dur rimacinada","","Triticum durum","Molla groguenca i crosta daurada","g",0,40,1,15,"B",{dol:1,torr:2}],
 ["malt","fa","Malt diastàsic","","Hordeum vulgare","Ajuda el color de la crosta amb farines poc enzimàtiques","g",.1,1,.05,.3,"B",{torr:2}],
 ["aigua","ba","Aigua","","","Hidratació: més aigua, molla més oberta i massa més enganxosa","g",40,90,1,68,"C",{}],
 ["sal","ba","Sal fina","","","Sabor i força del gluten; frena una mica el llevat","g",1.2,2.6,.1,2,"S",{}],
 ["llevat","ba","Llevat de forner","","Saccharomyces cerevisiae","Dosi en llevat fresc; es converteix al tipus triat","g",.05,3.5,.05,1,"S",{}],
 ["llet","en","Llet sencera","","","Molla tendra i crosta més fosca","g",0,75,1,40,"S",{tend:3,dol:1}],
 ["mantega","en","Mantega","","","Tendresa i aroma; per sobre del 15% ja és brioix","g",0,20,.5,10,"S",{tend:4,dol:1}],
 ["sucre","en","Sucre","","","Dolçor i color; per sobre del 8% alenteix el llevat","g",0,15,.5,6,"S",{dol:3,tend:1}],
 ["mel","en","Mel","","","Dolçor aromàtica, conserva la molla humida","g",0,10,.5,4,"S",{dol:3,aro:1}],
 ["ou","en","Ou batut","","","Color, volum i molla fina","g",0,25,1,10,"S",{tend:2,dol:.5},"lin",["ou","ous",50]],
 ["lletpols","en","Llet en pols","","","Molla esponjosa i crosta daurada","g",0,6,.5,3,"S",{tend:2,dol:1}],
 ["oli","en","Oli d'oliva verge extra","","Olea europaea","Crosta més fina i molla suau","g",0,10,.5,3,"S",{tend:2,aro:1}],
 ["sesam","ex","Sèsam","","Sesamum indicum","Torrat, a la massa o per sobre","g",0,15,.5,6,"S",{torr:3}],
 ["girasol","ex","Pipes de gira-sol pelades","","Helianthus annuus","Suau, cruixent; millor torrades","g",0,15,.5,8,"S",{torr:2,rus:1}],
 ["lli","ex","Llavors de lli","","Linum usitatissimum","Mucilaginoses: cal remullar-les abans","g",0,10,.5,5,"B",{rus:1,torr:1}],
 ["civada","ex","Flocs de civada","","Avena sativa","Molla tendra, gust de cereal","g",0,15,.5,8,"S",{rus:2,tend:1}],
 ["nous","ex","Nous","","Juglans regia","Torrat i una mica tànic; tenyeixen la molla","g",0,25,1,12,"S",{torr:3,aro:1}],
 ["panses","ex","Panses","","Vitis vinifera","Dolces; remullades, no roben aigua","g",0,25,1,12,"S",{dol:3}],
 ["olives","ex","Olives negres desossades","","Olea europaea","Salades i aromàtiques: baixa una mica la sal","g",0,25,1,15,"S",{aro:3}],
 ["romani","ex","Romaní fresc picat","","Salvia rosmarinus","Resinós; poca quantitat","g",0,1,.05,.4,"C",{aro:3}]
];
const FAM={fa:"Farines",ba:"Aigua, sal i llevat",en:"Enriquidors",ex:"Llavors i extres"};
const FAMORD=["fa","ba","en","ex"];
const ALL=ING.map(a=>a[0]);
const DIMS=[["rus","Rústic"],["comp","Complexitat"],["tend","Tendresa"],["dol","Dolçor"],["torr","Torrat"],["aro","Aromàtic"]];

const P0=(id,s)=>s.doses[id]||0;
function hyd(s){return P0("aigua",s)+.87*P0("llet",s)+.75*P0("ou",s)+.16*P0("mantega",s)+.17*P0("mel",s);}
function recHyd(s,tab){const base={barra:67,rodo:70,motlle:62}[tab];return base+.2*P0("integral",s)+.15*P0("segol",s)-.05*P0("espelta",s)+.05*P0("semola",s)+.4*P0("civada",s)+(s.p.tz?P0("farina",s)*0+s.p.tzPct*1.2:0);}
function sumPct(s){let t=0;for(const id in s.doses){if(id==="llevat")continue;t+=s.doses[id];}return t+P0("llevat",s)/YT[s.p.yt][0];}

function model(s,tab){
  const y=P0("llevat",s);const pf=s.p.pf;
  const boost=pf==="none"?0:s.p.pfPct/100*(pf==="biga"?1.2:pf==="vella"?1:1.5);
  const yeff=Math.max(.02,y+boost);
  const E=1+Math.max(0,P0("sucre",s)+P0("mel",s)-5)*.04+P0("mantega",s)*.01+P0("ou",s)*.003;
  const FULL=3*Math.pow(yeff/2,-.6)*E;
  const share=tab==="motlle"?.5:.62;const Ta=s.p.Ta,ra=rate(Ta);
  const o={y,boost,yeff,E,FULL,share,ra};
  if(!s.p.cold){o.bulk=share*FULL/ra;o.proof=(1-share)*FULL/ra;o.total=o.bulk+o.proof;}
  else{
    const H=s.p.fH,cool=Math.min(4,H),Tf=s.p.Tf;
    const pre=s.p.pre;const p1=pre*ra/FULL;const p2=(cool*rate((Ta+Tf)/2)+Math.max(0,H-cool)*rate(Tf))/FULL;
    o.pre=pre;o.p=p1+p2;o.over=o.p>share+.15;o.under=o.p<share-.12;
    o.after=o.p<share?(share-o.p)*FULL/ra:0;
    o.proof=(1-share)*FULL/ra+.5;o.total=pre+H+o.after+o.proof;
  }
  // prefermet
  if(pf!=="none"){
    const Tp=s.p.pfT,H=s.p.pfH;let yp=1.5*Math.pow(H*rate(Tp)/2.04,-1/.6)*PFY[pf];
    o.pfYraw=yp;o.pfY=Math.min(2,Math.max(.02,yp));
  }
  return o;
}
function solveYeast(s,tab){
  const o=model(s,tab);const ra=o.ra;let FULLb;
  if(s.p.cold){const H=s.p.fH,cool=Math.min(4,H),Tf=s.p.Tf,Ta=s.p.Ta;
    FULLb=(s.p.pre*ra+cool*rate((Ta+Tf)/2)+Math.max(0,H-cool)*rate(Tf))/o.share/o.E;}
  else FULLb=s.p.tgt*ra/o.E;
  const yeff=2*Math.pow(FULLb/3,-1/.6);let y=yeff-o.boost;
  const lo=.05,hi=3.5;let m="";
  if(y<lo){m="El prefermet ja aporta gairebé tota la força: llevat al mínim";y=lo;}
  else if(y>hi){m="Ni amb el màxim de llevat s'arriba a temps: allarga l'horari o puja la temperatura";y=hi;}
  else m="Llevat ajustat a l'horari";
  s.doses.llevat=Math.round(y*20)/20;return m;
}
function yeastG(s,pctFresh,flour){return pctFresh*flour/100/YT[s.p.yt][0];}

function makeRecipe(tab){
  const isM=tab==="motlle";
  const R={
    name:{barra:"Barra",rodo:"Rodó",motlle:"Motlle abrioixat"}[tab],
    lotTitle:"La pastada",calcTitle:"Massa, prefermet i temps",mixTitle:"Fórmula (% forner)",
    measure:{label:"Farina total",unit:"g",min:200,max:4000,step:50,def:{barra:500,rodo:750,motlle:450}[tab],k:.01,base:500,
      hint:(s,C)=>`Massa total ≈ <b class="num">${nf(C.dough,0)} g</b> · ${s.p.pcs} ${isM?(s.p.pcs>1?"motlles":"motlle"):(s.p.pcs>1?"peces":"peça")} de ≈ <b class="num">${nf(C.dough/s.p.pcs,0)} g</b>`},
    pct:true,perLabel:"% forner",totLabel:"Grams",
    fam:FAM,famOrd:FAMORD,ing:ALL.filter(id=>isM||!["lletpols"].includes(id)),
    req:["farina","sal","llevat"].concat(isM?[]:["aigua"]),derived:["farina"],noLevel:["ba"],
    famMax:{fa:4,ex:3,en:5},
    derive:s=>{let o=0;for(const id of ["integral","segol","espelta","semola"])o+=P0(id,s);s.doses.farina=Math.max(0,100-o);},
    amount:(x,v,s,K)=>x.id==="llevat"?v*K/YT[s.p.yt][0]:v*K,
    fmtTot:(x,a,s)=>{if(x.id==="llevat")return `${nf(a,a<10?1:0)} g <span class="eqh">${YT[s.p.yt][1]}</span>`;return a<10?nf(a,1)+" g":nf(a>=200?Math.round(a/5)*5:Math.round(a),0)+" g"+(x.id==="ou"?` <span class="eqh">(≈${nf(Math.max(.5,Math.round(a/50*2)/2),1)} ${Math.round(a/50*2)/2===1?"ou":"ous"})</span>`:"");},
    per:(x,v,s)=>x.id==="llevat"?`${nf(v,2)} % fresc`:nf(v,v<1?2:v<10?1:0)+" %",
    params:[
      {id:"pcs",label:isM?"Nombre de motlles":"Nombre de peces",type:"number",min:1,max:30,step:1,def:{barra:3,rodo:1,motlle:1}[tab],noCustom:true},
      ...(isM?[
        {id:"pan",label:"Motlle",type:"select",def:"1kg",opts:[["500g","Petit 20×10×8 cm (≈1,4 L)"],["1kg","Estàndard 25×11×10 cm (≈2,4 L)"],["pull","Pullman 30×10×10 cm (≈3 L)"]],noCustom:true},
        {id:"tz",label:"Tangzhong (escaldat de farina amb llet)",type:"check",def:true,sec:"Molla"},
        {id:"tzPct",label:"Farina al tangzhong",type:"range",min:3,max:10,step:.5,def:5,fmt:v=>nf(v,1)+" %",show:s=>s.p.tz,hint:"Es cou amb 5 vegades el seu pes de líquid fins a 65 °C."}
      ]:[]),
      {id:"yt",label:"Tipus de llevat",type:"select",def:"fresc",opts:[["fresc","Fresc (pastilla)"],["instant","Sec instantani (÷3)"],["actiu","Sec actiu (÷2)"]],sec:"Llevat i prefermet",noCustom:true},
      {id:"pf",label:"Prefermet",type:"select",def:"none",opts:Object.entries(PF)},
      {id:"pfPct",label:"Farina al prefermet",type:"range",min:10,max:60,step:5,def:30,fmt:v=>v+" %",show:s=>s.p.pf!=="none"},
      {id:"pfH",label:"Hores de prefermet",type:"range",min:2,max:24,step:1,def:12,fmt:v=>v+" h",show:s=>s.p.pf!=="none"},
      {id:"pfT",label:"Temperatura del prefermet",type:"range",min:4,max:28,step:1,def:20,fmt:v=>v+" °C",show:s=>s.p.pf!=="none",hint:"Per sota de 8 °C és a la nevera: llavors calen 2–3 vegades més hores."},
      {id:"Ta",label:"Temperatura de la massa / cuina",type:"range",min:16,max:30,step:1,def:22,fmt:v=>v+" °C",group:"tl"},
      {id:"cold",label:"Fermentació en bloc a la nevera",type:"check",def:false,group:"tl"},
      {id:"pre",label:"Bloc a temperatura ambient abans de la nevera",type:"range",min:0,max:3,step:.25,def:1,fmt:hf,show:s=>s.p.cold,group:"tl"},
      {id:"fH",label:"Hores a la nevera",type:"range",min:6,max:72,step:1,def:16,fmt:v=>v+" h",show:s=>s.p.cold,group:"tl"},
      {id:"Tf",label:"Temperatura de la nevera",type:"range",min:2,max:8,step:1,def:4,fmt:v=>v+" °C",show:s=>s.p.cold,group:"tl"},
      {id:"tgt",label:"Vull que la fermentació (bloc + aprest) duri",type:"range",min:1.5,max:16,step:.5,def:4,fmt:hf,show:s=>!s.p.cold,group:"tl",noCustom:true}
    ],
    actions:[{id:"solve",label:"Ajusta el llevat a aquest horari",group:"tl",run:s=>solveYeast(s,tab)},
      ...(isM?[{id:"fitpan",label:"Ajusta la farina als motlles",run:(s,C)=>{const f=C.panDough*s.p.pcs/(C.sum/100);s.n=Math.max(200,Math.round(f/10)*10);return "Farina ajustada a "+s.n+" g";}}]:[])],
    dims:DIMS,dimMax:10,
    flavExtra:(s,C,F)=>{const o=C.m;F.comp+=(s.p.pf!=="none"?s.p.pfPct/10:0)+(s.p.cold?Math.min(4,s.p.fH/8):0)+Math.min(3,Math.max(0,o.FULL-3)/2);
      if(!isM)F.torr+=2.5;F.tend+=Math.max(0,(hyd(s)-65)/5);if(isM&&s.p.tz)F.tend+=2;},
    calc:s=>calcPa(s,tab),
    warn:(s,C,F)=>warnPa(s,C,tab),
    rec:(s,C)=>recPa(s,C,tab),
    tl:{mode:"h",startLabel:"Comences (dia i hora)",defTime:"09:00"},
    timeline:(s,C)=>tlPa(s,C,tab),
    shopSkip:[],
    shopExtra:(s,C)=>{const o=C.m;const it=[];if(s.p.pf!=="none")it.push([`Llevat per al prefermet (${YT[s.p.yt][1]})`,nf(C.pfYg,2)+" g"]);
      return it.length?[{h:"Prefermet",items:it}]:[];},
    loadNote:(s,C)=>`hidratació ${isM?"efectiva ":""}${nf(hyd(s),0)} % · ${nf(C.dough,0)} g de massa`,
    pdfTaste:["Crosta","Molla","Aroma","Gust"],
    how:HOW[tab],
    def:{barra:"baguet",rodo:"pages",motlle:"abrioixat"}[tab],
    profiles:PROFILES[tab]
  };
  return R;
}

function calcPa(s,tab){
  const isM=tab==="motlle";const F=s.n;const o=model(s,tab);
  const sum=sumPct(s);const dough=F*sum/100;
  const g=id=>P0(id,s)*F/100;
  const rows=[];const C={m:o,sum,dough};
  rows.push(["§","Massa"]);
  rows.push(["Hidratació"+(isM?" efectiva":""),nf(hyd(s),1)+" %",true]);
  if(isM)rows.push(["Aigua + llet",nf(g("aigua")+g("llet"),0)+" g"]);
  rows.push(["Massa total",nf(dough,0)+" g"]);
  rows.push([isM?"Massa per motlle":"Pes per peça",nf(dough/s.p.pcs,0)+" g",true]);
  rows.push([`Llevat ${YT[s.p.yt][1]} (massa)`,nf(yeastG(s,o.y,F),1)+" g"]);
  if(isM){
    const PAN={"500g":[1400,"20×10×8"],"1kg":[2400,"25×11×10"],"pull":[3000,"30×10×10"]}[s.p.pan];
    const pd=PAN[0]*.42;C.panDough=pd;
    rows.push(["Massa ideal per motlle",nf(pd,0)+" g"]);
    if(s.p.tz){const tf=F*s.p.tzPct/100;const tl=tf*5;C.tz=[tf,tl];
      rows.push(["§","Tangzhong"]);rows.push(["Farina",nf(tf,0)+" g"]);rows.push([g("llet")>=tl?"Llet (de la fórmula)":"Llet + aigua (de la fórmula)",nf(tl,0)+" g",true]);}
  }
  let pfYg=0;
  if(s.p.pf!=="none"){
    const pff=F*s.p.pfPct/100,pfw=pff*PFH[s.p.pf];pfYg=yeastG(s,o.pfY,pff);C.pfYg=pfYg;const pfs=s.p.pf==="vella"?pff*.02:0;
    C.pf={f:pff,w:pfw,s:pfs};
    rows.push(["§",PF[s.p.pf].split(" (")[0]]);
    rows.push(["Farina",nf(pff,0)+" g"]);rows.push(["Aigua",nf(pfw,0)+" g"]);
    if(pfs)rows.push(["Sal",nf(pfs,1)+" g"]);
    rows.push([`Llevat ${YT[s.p.yt][1]}`,(pfYg<.3?nf(pfYg,2):nf(pfYg,1))+" g",true]);
    rows.push(["Llevat sobre la farina del prefermet",nf(o.pfY*(s.p.yt==="fresc"?1:1/YT[s.p.yt][0]),2)+" %"]);
    rows.push(["Maduració",`${s.p.pfH} h a ${s.p.pfT} °C`]);
    const wTot=isM?g("aigua"):g("aigua");
    rows.push(["§","Massa final"]);
    rows.push(["Prefermet sencer",nf(pff+pfw+pfs+pfYg,0)+" g"]);
    rows.push(["Farina restant",nf(F-pff,0)+" g"]);
    rows.push(["Aigua restant",nf(Math.max(0,wTot-pfw),0)+" g",wTot<pfw]);
    if(pfs)rows.push(["Sal restant",nf(g("sal")-pfs,1)+" g"]);
  }
  C.pfYg=pfYg;
  rows.push(["§","Temps (estimació)"]);
  if(!s.p.cold){rows.push(["Fermentació en bloc",hf(o.bulk),true]);rows.push([isM?"Aprest al motlle":"Aprest (peça formada)",hf(o.proof),true]);rows.push(["Total de pastar a forn",hf(o.total)]);}
  else{rows.push(["Bloc abans de la nevera",hf(o.pre)]);rows.push(["Nevera",`${s.p.fH} h a ${s.p.Tf} °C`]);
    rows.push(["Fermentació feta en sortir",nf(Math.min(o.p/o.share,9)*100,0)+" % del bloc",o.over||o.under]);
    if(o.after>.1)rows.push(["Bloc que falta, a temperatura ambient",hf(o.after),true]);
    rows.push(["Aprest després de formar",hf(o.proof),true]);rows.push(["Total de pastar a forn",hf(o.total)]);}
  const DDT=isM?25:24,fr=isM?12:8;const Tw=(s.p.pf!=="none"?4:3)*DDT-s.p.Ta-s.p.Ta-fr-(s.p.pf!=="none"?s.p.pfT:0);
  rows.push(["Aigua a",`${nf(Math.min(40,Math.max(2,Tw)),0)} °C`]);
  const oven=ovenPa(s,tab,dough/s.p.pcs);C.oven=oven;
  rows.push(["Forn",oven.t]);
  C.rows=rows;
  C.note=`Temps a ${s.p.Ta} °C amb el model: llevat fresc equivalent ${nf(o.yeff,2)} %${o.boost?" (inclou el prefermet)":""}. És una guia: mira la massa, que ha de créixer un 50–75% en bloc${isM?" i sobrepassar 1–2 cm la vora del motlle":""}.`;
  C.summary=`${nf(dough,0)} g de massa · hidratació ${nf(hyd(s),0)}% · ${s.p.pcs} × ${nf(dough/s.p.pcs,0)} g · ${s.p.pf==="none"?"directe":PF[s.p.pf].split(" (")[0].toLowerCase()+" "+s.p.pfPct+"%"} · ${s.p.cold?"bloc en fred "+s.p.fH+" h":"fermentació "+hf(o.total)} · ${oven.t}`;
  return C;
}
function ovenPa(s,tab,w){
  if(tab==="barra"){const m=Math.round(18+.02*(w-250));return {T:240,min:m,t:`240 °C amb vapor, ${m}–${m+4} min`};}
  if(tab==="rodo"){const m=Math.round(40+15*(w/1000-.8));return {T:250,min:m,t:`250 °C, ${Math.round(m*.5)} min tapat + ${Math.round(m*.5)}–${Math.round(m*.5)+5} destapat`};}
  const m=Math.round(30+12*(w/1000-.8));return {T:180,min:m,t:`180 °C, ${m}–${m+5} min (94 °C a dins)`};
}
function recPa(s,C,tab){
  const w=P0("integral",s)+P0("segol",s)+P0("espelta",s);
  if(tab==="motlle")return {title:"Farina recomanada",main:"Farina de força (W 300–350, 12–13% proteïna)",sub:"Manitoba o «gran fuerza»",why:"Els greixos i el sucre debiliten el gluten: cal una farina forta perquè la molla quedi esfilagarsada i el pa pugi per sobre del motlle."};
  if(tab==="barra")return {title:"Farina recomanada",main:"Farina panificable (W 180–250, 11–12% proteïna)",sub:w?`+ ${nf(w,0)}% d'altres farines`:"",why:"Una farina mitjana dona barres extensibles, crosta fina i molla alveolada. Amb força, la barra queda dura i costa allargar-la."};
  return {title:"Farina recomanada",main:"Farina de força suau (W 250–300) o meitat panificable i meitat força",sub:w?`+ ${nf(w,0)}% d'altres farines`:"",why:"El rodó fermenta més estona i aguanta el seu pes sense motlle: necessita un gluten una mica més fort que la barra."};
}
function warnPa(s,C,tab){
  const w=[];const o=C.m;const isM=tab==="motlle";const h=hyd(s),rh=recHyd(s,tab);
  if(h>rh+8)w.push(["warn",`Hidratació ${nf(h,0)}% força per sobre del que admet aquesta farina (≈${nf(rh,0)}%): massa enganxosa i peça plana. Fes plecs o baixa aigua.`]);
  else if(h<rh-6)w.push(["warn",`Hidratació ${nf(h,0)}% baixa per a aquesta barreja de farines (≈${nf(rh,0)}%): molla tancada i seca.`]);
  if(P0("sal",s)<1.6)w.push(["warn","Menys de l'1,6% de sal: pa insípid i fermentació més ràpida del compte."]);
  if(P0("sal",s)>2.3)w.push(["warn","Més del 2,3% de sal: salat i el llevat treballa més lent."]);
  if(s.p.cold){
    if(o.over)w.push(["bad",`Amb aquest llevat, la massa surt de la nevera passada (${nf(o.p/o.share*100,0)}% del bloc). Baixa el llevat o les hores fora: prova «Ajusta el llevat a aquest horari».`]);
    else if(o.under)w.push(["info",`La massa surt de la nevera amb el ${nf(o.p/o.share*100,0)}% del bloc fet: deixa-la ${hf(o.after)} a temperatura ambient abans de formar.`]);
    if(s.p.Tf>6)w.push(["info","Una nevera a més de 6 °C fermenta prou ràpid: vigila la massa a partir de les 10 h."]);
    if(s.p.fH>48&&P0("llevat",s)>.3)w.push(["warn","Més de 48 h a la nevera amb aquest llevat: el gluten es degrada i el pa queda àcid i pla."]);
  }else{
    if(P0("llevat",s)>2.5&&s.p.pf==="none"&&!isM)w.push(["info","Molt llevat i fermentació curta: el pa queda amb gust de llevat i s'asseca aviat. Amb un prefermet o nevera guanya molt."]);
    if(o.total>14&&s.p.Ta>=20)w.push(["warn",`Fermentació de ${hf(o.total)} a ${s.p.Ta} °C: és fàcil passar-se'n. Per a temps tan llargs, millor el bloc a la nevera.`]);
  }
  if(s.p.Ta>27)w.push(["warn","Cuina a més de 27 °C: fes servir aigua freda i escurça els temps."]);
  if(s.p.Ta<19)w.push(["info","Cuina freda: posa la massa dins el forn apagat amb un bol d'aigua calenta per guanyar 4–6 °C."]);
  if(s.p.pf!=="none"){
    if(o.pfYraw<.02)w.push(["warn",`El prefermet a ${s.p.pfT} °C durant ${s.p.pfH} h necessitaria menys llevat del que es pot pesar. Fes-lo a la nevera o escurça les hores.`]);
    if(o.pfYraw>2)w.push(["warn","Prefermet massa curt per a aquesta temperatura: no madurarà. Allarga'l o fes-lo més calent."]);
    if(s.p.pf==="poolish"&&s.p.pfPct>50)w.push(["warn","Més del 50% de la farina en poolish: massa molt extensible i una mica àcida."]);
    if(C.pf&&C.pf.w>P0("aigua",s)*s.n/100)w.push(["bad","El prefermet necessita més aigua de la que hi ha a la fórmula. Puja l'aigua o baixa el % de prefermet."]);
    if(s.p.pf==="vella")w.push(["info","La massa vella porta sal (2%): ja està descomptada de la massa final."]);
  }
  if(tab==="barra"){
    const pw=C.dough/s.p.pcs;if(pw<200||pw>420)w.push(["warn",`Barres de ${nf(pw,0)} g: per a un forn de casa van bé entre 220 i 380 g.`]);
    if(P0("segol",s)>15)w.push(["warn","Més del 15% de sègol en una barra: la massa no aguanta la forma allargada."]);
    if(P0("integral",s)+P0("segol",s)>35)w.push(["warn","Molta farina integral per a barra: quedarà baixa i densa. Prova-ho en rodó."]);
    if(P0("oli",s)>4)w.push(["info","Amb oli la crosta de la barra queda més tova i menys cruixent."]);
  }
  if(tab==="rodo"){const pw=C.dough/s.p.pcs;if(pw>1500)w.push(["info",`Rodó de ${nf(pw,0)} g: allarga 10–15 min el forn i comprova 96 °C a dins.`]);
    if(P0("segol",s)>25)w.push(["info","Amb més del 25% de sègol la molla queda densa i humida: deixa'l reposar 12 h abans de tallar."]);}
  if(isM){
    if(P0("mantega",s)>14||P0("ou",s)>18)w.push(["warn","Amb tanta mantega o ou ja és brioix. El motlle abrioixat va bé amb un 6–14% de mantega i fins a un 15% d'ou."]);
    if(P0("mantega",s)<5)w.push(["info","Menys del 5% de mantega: més aviat un pa de motlle normal que abrioixat."]);
    if(P0("sucre",s)+P0("mel",s)>10)w.push(["warn","Més del 10% de sucre alenteix molt el llevat: puja'l un 20–30% o fes servir llevat sec osmotolerant."]);
    const per=C.dough/s.p.pcs;if(per>C.panDough*1.15)w.push(["bad",`Massa per motlle (${nf(per,0)} g) massa gran: vessarà. L'ideal són ≈${nf(C.panDough,0)} g. Usa «Ajusta la farina als motlles».`]);
    else if(per<C.panDough*.8)w.push(["warn",`Poca massa per al motlle (${nf(per,0)} g de ≈${nf(C.panDough,0)} g): quedarà baix.`]);
    if(s.p.tz&&C.tz&&C.tz[1]>P0("llet",s)*s.n/100+P0("aigua",s)*s.n/100)w.push(["bad","El tangzhong demana més líquid del que hi ha a la fórmula. Baixa el % de tangzhong."]);
    if(s.p.tz&&s.p.tzPct>8)w.push(["info","Més del 8% de tangzhong: molla molt humida i costa de formar."]);
    w.push(["info","Afegeix la mantega tova quan la massa ja faci vel, en 2–3 tandes."]);
  }
  if(P0("espelta",s)>40)w.push(["info","Molta espelta: pasta la meitat del temps; el gluten s'esquinça si es treballa massa."]);
  if(P0("lli",s))w.push(["info","Remulla el lli amb el doble del seu pes d'aigua 1 h abans (no compta a la hidratació)."]);
  if(P0("panses",s))w.push(["info","Remulla les panses 15 min i escorre-les. Afegeix-les al final del pastat."]);
  if(P0("nous",s))w.push(["info","Torra les nous 8 min a 170 °C. Tenyeixen la molla de color lila: és normal."]);
  if(P0("olives",s)&&P0("sal",s)>1.8)w.push(["info","Les olives ja són salades: baixa la sal a l'1,7–1,8%."]);
  if(P0("malt",s)>.6)w.push(["warn","Massa malt diastàsic: molla enganxosa i crosta massa fosca."]);
  if(P0("romani",s)>.7)w.push(["warn","Molt romaní: amarga i tapa el gust del pa."]);
  const extras=P0("sesam",s)+P0("girasol",s)+P0("lli",s)+P0("civada",s)+P0("nous",s)+P0("panses",s)+P0("olives",s);
  if(extras>35)w.push(["warn",`${nf(extras,0)}% de llavors i extres: trenquen el gluten. Per sobre del 30% el pa no puja.`]);
  if(s.p.yt!=="fresc"&&P0("llevat",s)/YT[s.p.yt][0]*s.n/100<.3)w.push(["info","Menys de 0,3 g de llevat sec: pesa'n 1 g, desfés-lo en 100 g d'aigua i agafa'n la part proporcional."]);
  return w;
}
function tlPa(s,C,tab){
  const o=C.m;const ev=[];const isM=tab==="motlle";let t=0;
  if(s.p.pf!=="none"){const pf=C.pf;ev.push([0,`Prepara el ${PF[s.p.pf].split(" (")[0].toLowerCase()}: ${nf(pf.f,0)} g de farina, ${nf(pf.w,0)} g d'aigua${pf.s?`, ${nf(pf.s,1)} g de sal`:""} i ${nf(C.pfYg,2)} g de llevat. Tapa'l a ${s.p.pfT} °C.`]);t=s.p.pfH;}
  if(isM&&s.p.tz&&C.tz)ev.push([Math.max(0,t-.75)+(t?0:0),`Tangzhong: cou ${nf(C.tz[0],0)} g de farina amb ${nf(C.tz[1],0)} g de llet remenant fins que espesseixi (65 °C). Deixa'l refredar tapat.`]);
  if(isM&&s.p.tz&&C.tz&&!t)t=.75;
  ev.push([t,`Pasta${s.p.pf!=="none"?" amb el prefermet":""}. Aigua a ${C.rows.find(r=>r[0]==="Aigua a")[1]}; massa a ≈${isM?25:24} °C.${isM?" Mantega quan faci vel.":""}`]);
  const t0=t+(isM?.4:.25);
  if(!isM&&hyd(s)>=68){const lim=s.p.cold?s.p.pre:o.bulk;const n=Math.min(3,Math.floor(lim/.5));for(let i=1;i<=n;i++)ev.push([t0+i*.5-.5+.5,`Plec ${i}: estira i plega la massa sobre ella mateixa (4 costats).`]);}
  if(!s.p.cold){
    const tb=t0+o.bulk;ev.push([tb,isM?"Divideix, boleja en 2–3 boles per motlle i posa-les al motlle untat.":"Divideix i preforma. Repòs de 20 min tapat."]);
    let tf=tb;if(!isM){tf=tb+.33;ev.push([tf,tab==="barra"?"Forma les barres i posa-les sobre una tela enfarinada, amb plecs entre peces.":"Forma el rodó i posa'l al cistell enfarinat, costura amunt."]);}
    const te=tf+o.proof;ev.push([Math.max(tf,te-.75),`Encén el forn a ${C.oven.T} °C${tab==="rodo"?" amb l'olla de ferro a dins":tab==="barra"?" amb una safata per al vapor":""}.`]);
    ev.push([te,`Al forn: ${C.oven.t}.`]);ev.push([te+C.oven.min/60,"Treu-lo i deixa'l refredar sobre una reixa (mínim 1 h)."]);
  }else{
    const tin=t0+s.p.pre;ev.push([tin,`A la nevera (${s.p.Tf} °C) en un recipient tapat i untat.`]);
    let tout=tin+s.p.fH;ev.push([tout,o.after>.1?`Treu la massa i deixa-la ${hf(o.after)} a temperatura ambient fins que hagi crescut un 50–75%.`:"Treu la massa: ha de ser inflada i amb bombolles a les vores."]);
    let tf=tout+o.after;
    ev.push([tf,isM?"Divideix en freda, boleja i posa les boles al motlle.":"Divideix en freda i preforma. Repòs de 20–30 min."]);
    if(!isM){tf+=.4;ev.push([tf,tab==="barra"?"Forma les barres sobre una tela enfarinada.":"Forma el rodó i posa'l al cistell."]);}
    const te=tf+o.proof-.5;ev.push([Math.max(tf,te-.75),`Encén el forn a ${C.oven.T} °C.`]);
    ev.push([te,`Al forn: ${C.oven.t}.`]);ev.push([te+C.oven.min/60,"Refreda-ho sobre una reixa (mínim 1 h)."]);
  }
  const tail=[["Conservació",tab==="barra"?"El mateix dia; l'endemà, 5 min al forn. Congela-la el dia que la fas.":tab==="rodo"?"3–4 dies en una bossa de tela, tall avall. Es congela a llesques.":"4–5 dies en una bossa tancada. Es congela a llesques."]];
  return {ev,tail};
}
const HOW={
  barra:["Si la massa és força hidratada, barreja farina i aigua 30 min abans (autòlisi) i afegeix-hi després la sal i el llevat.","Pasta 8–10 min fins que sigui llisa. Amb hidratacions altes, pasta poc i fes plecs durant el bloc.","Divideix sense desgasificar del tot, preforma rectangles enrotllats i deixa'ls reposar tapats.","Forma les barres plegant cap a tu i segellant; allarga-les rodant des del centre.","Fes 3–5 grenyes gairebé paral·leles amb una fulla. Vapor els primers 10 min: aboca un got d'aigua en una safata calenta.","Les últimes 2–3 min, obre la porta perquè surti el vapor i la crosta s'assequi."],
  rodo:["Pasta fins que la massa faci vel; si porta molt integral o sègol, pasta menys i fes-hi plecs.","Formar: plega les vores al centre, gira-la i tensa la superfície arrossegant-la cap a tu.","Cistell (banneton) enfarinat amb farina d'arròs: no s'enganxa.","Gira-la sobre paper de forn, fes un tall decidit de 1 cm i posa-la a l'olla de ferro calenta. El tapat fa el vapor.","Està cuit quan sona buit per sota i fa 96–98 °C a dins."],
  motlle:["Barreja-ho tot menys la mantega (inclòs el tangzhong fred). Pasta fins que la massa faci vel.","Afegeix la mantega tova en 2–3 tandes i continua fins que torni a fer vel fi.","Divideix en 2 o 3 boles per motlle (estil shokupan): estira cada bola, enrotlla-la i col·loca-les al llarg del motlle.","Aprest fins que sobresurti 1–2 cm de la vora. Pinta amb ou batut amb un raig de llet si vols crosta brillant.","Desemmotlla'l en sortir del forn i refreda'l de costat sobre una reixa: si no, s'humiteja i s'enfonsa."]
};
const PROFILES={
  barra:{
    baguet:{name:"Baguet de poolish",desc:"Crosta fina i cruixent, molla oberta",d:{farina:100,aigua:68,sal:2,llevat:1.2},p:{pf:"poolish",pfPct:30,pfH:12,pfT:20,pcs:3}},
    rustica:{name:"Barra rústica de nevera",desc:"Bloc en fred 16 h, 15% integral, més sabor",d:{farina:85,integral:15,aigua:74,sal:2,llevat:.9},p:{cold:true,pre:1,fH:16,pcs:3}},
    pages:{name:"Barra de pagès",desc:"Massa vella, una mica de sègol",d:{farina:90,segol:5,integral:5,aigua:70,sal:2,llevat:1.3},p:{pf:"vella",pfPct:20,pfH:12,pfT:18,pcs:3}},
    rapida:{name:"Directa ràpida",desc:"Sense prefermet, en 3 hores",d:{farina:100,aigua:65,sal:2,llevat:2},p:{pcs:3,tgt:3}}
  },
  rodo:{
    pages:{name:"Rodó de pagès",desc:"Biga, 10% integral, molla humida",d:{farina:90,integral:10,aigua:72,sal:2,llevat:.8},p:{pf:"biga",pfPct:30,pfH:16,pfT:18}},
    integral:{name:"Integral de nevera",desc:"40% integral, bloc en fred 18 h",d:{farina:60,integral:40,aigua:78,sal:2,llevat:.9},p:{cold:true,pre:1,fH:18}},
    segolnous:{name:"Sègol i nous",desc:"20% sègol, nous torrades",d:{farina:80,segol:20,aigua:75,sal:2,llevat:.8,nous:12},p:{pf:"poolish",pfPct:20,pfH:12,pfT:20}},
    espelta:{name:"Espelta",desc:"50% espelta, pastat curt",d:{farina:50,espelta:50,aigua:68,sal:2,llevat:1},p:{tgt:5}}
  },
  motlle:{
    abrioixat:{name:"Motlle abrioixat",desc:"Mantega 10%, ou i tangzhong: tendre però no brioix",d:{farina:100,llet:50,aigua:15,mantega:10,sucre:7,ou:10,sal:1.8,llevat:2.4},p:{tz:true,tzPct:5,tgt:3.5}},
    shokupan:{name:"Shokupan",desc:"Estil japonès: tangzhong 7%, llet en pols, sense ou",d:{farina:100,llet:60,aigua:15,mantega:8,sucre:8,lletpols:4,sal:1.8,llevat:2.2},p:{tz:true,tzPct:7,tgt:3.5}},
    integral:{name:"Integral suau",desc:"30% integral, mel i oli",d:{farina:70,integral:30,llet:40,aigua:30,mel:5,mantega:6,sal:1.9,llevat:2.2},p:{tz:false,tgt:3.5}},
    nevera:{name:"Abrioixat de nevera",desc:"Bloc en fred 14 h, es forma millor",d:{farina:100,llet:45,aigua:15,mantega:12,sucre:7,ou:12,sal:1.8,llevat:1.2},p:{tz:true,tzPct:5,cold:true,pre:.75,fH:14}}
  }
};

window.PAGE={
  key:"pa-casola",title:"Obrador de pa",titleShort:"PA",
  lede:"Barra, rodó i motlle abrioixat amb percentatges de forner. Tria la farina, la hidratació i el prefermet, i calcula els temps segons el llevat i la temperatura, també amb el bloc a la nevera.",
  where:{S:"Súper",B:"Botiga especialitzada / molí",C:"De casa"},
  ing:ING,tabOrd:["barra","rodo","motlle"],
  recipes:{barra:makeRecipe("barra"),rodo:makeRecipe("rodo"),motlle:makeRecipe("motlle")},
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}
};
})();
