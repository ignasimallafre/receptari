// ===== Coca de croissant (massa fullada en rectangle, amb sucre per sobre) =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
const hf=h=>{if(!isFinite(h))return "—";const H=Math.floor(h+1e-6),M=Math.round((h-H)*60/5)*5;return M===60?`${H+1} h`:H?`${H} h${M?" "+String(M).padStart(2,"0")+" min":""}`:`${M} min`;};
const RT=[[0,.02],[4,.06],[8,.12],[12,.22],[16,.37],[20,.6],[22,.74],[24,.9],[25,1],[27,1.2],[30,1.45],[32,1.55],[35,1.5],[40,1.1]];
function rate(T){if(T<=RT[0][0])return RT[0][1];for(let i=1;i<RT.length;i++)if(T<=RT[i][0]){const [a,ra]=RT[i-1],[b,rb]=RT[i];return ra+(rb-ra)*(T-a)/(b-a);}return RT[RT.length-1][1];}
const YT={fresc:[1,"fresc"],instant:[3,"sec instantani"],actiu:[2,"sec actiu"]};
const TRAY={a:[20,30],b:[30,40],c:[40,60]};
const DENS={f:.39,m:.58,g:.77}; // g de massa per cm² de safata: ≈4, 6 i 8 mm en cru

const ING=[
 ["farina","fa","Farina de força","","Triticum aestivum","W 280–320: aguanta les voltes sense trencar-se","g",100,100,1,100,"S",{}],
 ["llet","li","Llet sencera freda","","","Molla tendra i crosta daurada","g",25,50,1,37,"S",{mant:1,dol:.5}],
 ["aigua","li","Aigua freda","","","Ajusta la hidratació de la massa","g",0,30,1,17,"C",{}],
 ["sal","li","Sal fina","","","Equilibra el dolç","g",1.5,2.5,.1,2,"S",{}],
 ["llevat","li","Llevat de forner","","Saccharomyces cerevisiae","Dosi en llevat fresc; es converteix al tipus triat","g",1.5,6,.1,3,"S",{}],
 ["sucre","gr","Sucre","","","Dolçor i color; per sobre del 15% alenteix el llevat","g",5,20,.5,12,"S",{dol:3}],
 ["mel","gr","Mel","","","Aroma i humitat, la molla dura més tendra","g",0,4,.5,0,"S",{dol:2,arom:1}],
 ["mantega","gr","Mantega a la massa","","","Tova, barrejada amb la massa: la fa més dòcil","g",0,15,1,8,"S",{mant:2}],
 ["mantegatour","gr","Mantega de tourage (82% MG)","","","El bloc que fa les capes: freda però mal·leable","g",40,70,1,55,"S",{mant:6}],
 ["vainilla","ar","Extracte de vainilla","","Vanilla planifolia","Dolçor aromàtica","g",0,2,.1,0,"S",{arom:2,dol:.5}],
 ["llimona","ar","Ratlladura de llimona","","Citrus × limon","Cítric fresc","g",0,1.5,.1,0,"C",{arom:3}],
 ["taronja","ar","Ratlladura de taronja","","Citrus × sinensis","Cítric dolç","g",0,2,.1,0,"C",{arom:3}],
 ["canyella","ar","Canyella mòlta","","Cinnamomum verum","Càlid; frena una mica el llevat","g",0,1,.05,0,"S",{arom:3}],
 ["sucrecob","co","Sucre gruixut per sobre","","","Crosta caramel·litzada i cruixent","g",0,25,1,14,"S",{cru:3,dol:1}],
 ["perlat","co","Sucre perlat","","","Grans que no es fonen al forn","g",0,25,1,0,"B",{cru:4,dol:1}],
 ["ametlla","co","Ametlla laminada","","Prunus dulcis","Torrada i cruixent","g",0,20,1,0,"S",{cru:3}],
 ["xocolata","co","Pepites de xocolata negra","","Theobroma cacao","Per sobre, amb el sucre","g",0,30,1,0,"S",{dol:1,arom:2}],
 ["crema","co","Crema pastissera","","","En línies, per sobre, abans d'enfornar","g",0,40,1,0,"C",{dol:2}],
 ["pintar","co","Ou per pintar","","","Brillantor; 1 ou batut amb una mica de llet","g",0,15,1,7,"S",{}]
];
const FAM={fa:"Farina",li:"Líquids, sal i llevat",gr:"Mantega i sucre",ar:"Aromes",co:"Coberta i farcit"};
const FAMORD=["fa","li","gr","ar","co"];
const P0=(id,s)=>s.doses[id]||0;
const COB=["sucrecob","perlat","ametlla","xocolata","crema","pintar"];
// hidratació de la détrempe: aigua + aigua de la llet i de la mantega de la massa
const hyd=s=>P0("aigua",s)+.87*P0("llet",s)+.16*P0("mantega",s);
const fatPct=s=>(P0("mantega",s)+P0("mantegatour",s))*.82+P0("llet",s)*.036;
const doughSum=s=>{let t=0;for(const id in s.doses){if(COB.includes(id)||id==="llevat")continue;t+=s.doses[id];}return t+P0("llevat",s)/YT[s.p.yt][0];};
const detrSum=s=>doughSum(s)-P0("mantegatour",s);

// aprest final: ≈2 h 15 min a 25 °C amb un 3% de llevat fresc i un 12% de sucre
function prm(s){
  const y=P0("llevat",s),E=1+Math.max(0,P0("sucre",s)+P0("mel",s)-5)*.03+P0("canyella",s)*.3;
  const P25=2.25*Math.pow(y/3,-.6)*(E/1.21);
  const proof=Math.min(6,Math.max(.75,P25*rate(25)/rate(s.p.Tp)));
  const o={y,E,P25,proof};
  if(s.p.mode==="nit"){o.frac=s.p.fH2*rate(4)/(P25*rate(25));o.rem=Math.max(.5,(1-Math.min(o.frac,1))*proof);o.over=o.frac>.8;}
  return o;
}
function fitFlour(s){const [w,l]=TRAY[s.p.tray];const f=w*l*DENS[s.p.thick]*s.p.pcs/(doughSum(s)/100);s.n=Math.min(1500,Math.max(100,Math.round(f/10)*10));}
const ovenOf=(per,area)=>{const mm=per/area/.95*10;const n=Math.max(8,Math.round(mm*1.8));return {mm,n,min:10+n,t:`200 °C 10 min i 180 °C ${n}–${n+2} min`,short:`200→180 °C, ${10+n}–${12+n} min`};};

const R={
  name:"Coca de croissant",lotTitle:"La pastada",calcTitle:"Massa, mantega i temps",mixTitle:"Fórmula (% forner)",
  measure:{label:"Farina",unit:"g",min:100,max:1500,step:10,def:300,k:.01,base:300,
    hint:(s,C)=>`Massa ≈ <b class="num">${nf(C.dough,0)} g</b> · ${s.p.pcs} ${s.p.pcs>1?"coques":"coca"} de ≈ <b class="num">${nf(C.dough/s.p.pcs,0)} g</b>`},
  pct:true,perLabel:"% forner",totLabel:"Grams",
  fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]),req:["farina","sal","llevat","mantegatour"],derived:["farina"],derive:s=>{s.doses.farina=100;},noLevel:["fa","li","gr"],famMax:{ar:3,co:4},
  amount:(x,v,s,K)=>x.id==="llevat"?v*K/YT[s.p.yt][0]:v*K,
  fmtTot:(x,a,s)=>{if(x.id==="llevat")return `${nf(a,1)} g <span class="eqh">${YT[s.p.yt][1]}</span>`;return (a<10?nf(a,1):nf(Math.round(a),0))+" g";},
  per:(x,v)=>x.id==="llevat"?`${nf(v,1)} % fresc`:nf(v,v<1?2:v<10?1:0)+" %",
  params:[
    {id:"pcs",label:"Nombre de coques",type:"number",min:1,max:4,step:1,def:1,noCustom:true,rerender:true,onSet:fitFlour},
    {id:"tray",label:"Safata",type:"select",def:"b",opts:[["a","20 × 30 cm"],["b","30 × 40 cm (safata de forn)"],["c","40 × 60 cm (plaque de pastisseria)"]],noCustom:true,onSet:fitFlour,hint:"La safata, el gruix i el nombre de coques fixen la farina: es recalcula tota la recepta."},
    {id:"thick",label:"Gruix en cru",type:"select",def:"m",opts:[["f","Fina, 4 mm (molt cruixent)"],["m","Mitjana, 6 mm"],["g","Gruixuda, 8 mm (més alta)"]],onSet:fitFlour},
    {id:"turns",label:"Voltes (de plegar en tres)",type:"select",def:"3",opts:[["2","2 voltes: 9 capes"],["3","3 voltes: 27 capes"],["4","4 voltes: 81 capes"]],hint:"Amb 3 voltes surt la fullada clàssica. Amb 4 les capes són molt fines i es poden fondre."},
    {id:"mode",label:"Quan dones forma a la coca",type:"select",def:"mati",sec:"Horari",opts:[["mati","El matí, abans d'enfornar"],["nit","La nit abans (aprest lent a la nevera)"]],noCustom:true,
      onSet:(s,v)=>{if(v==="nit"){s.p.fH=4;s.p.fH2=7;}else{s.p.fH=11;}},
      hint:"Si la formes el matí, la massa sencera passa la nit a la nevera. Si la formes la nit abans, l'aprest es fa de matinada, a la nevera, i queda menys alta."},
    {id:"fH",label:"Nevera abans de donar forma",type:"range",min:2,max:20,step:.5,def:11,fmt:v=>hf(v),group:"tl"},
    {id:"fH2",label:"Nevera amb la coca ja formada",type:"range",min:4,max:14,step:.5,def:8,fmt:v=>hf(v),show:s=>s.p.mode==="nit",group:"tl"},
    {id:"Tp",label:"Temperatura de l'aprest",type:"range",min:20,max:28,step:1,def:25,fmt:v=>v+" °C",group:"tl",hint:"El forn apagat amb un bol d'aigua calenta fa ≈25 °C. No passis de 27: la mantega suaria."},
    {id:"yt",label:"Tipus de llevat",type:"select",def:"fresc",opts:[["fresc","Fresc (pastilla)"],["instant","Sec instantani (÷3)"],["actiu","Sec actiu (÷2)"]],noCustom:true}
  ],
  dims:[["mant","Mantegós"],["dol","Dolç"],["cru","Cruixent"],["arom","Aromàtic"]],dimMax:10,
  calc:s=>{
    const F=s.n,o=prm(s),sum=doughSum(s),dough=F*sum/100,[w,l]=TRAY[s.p.tray],area=w*l;
    const per=dough/s.p.pcs,ideal=area*DENS[s.p.thick],ov=ovenOf(per,area);
    const tour=F*P0("mantegatour",s)/100,tp=tour/s.p.pcs,side=Math.sqrt(tp/(.91*.9));
    const detr=F*detrSum(s)/100;
    const C={m:o,sum,dough,area,ideal,per,oven:ov,tour,side,detr,n:+s.p.turns};
    const rows=[];
    rows.push(["§","Massa"]);
    rows.push(["Massa total",nf(dough,0)+" g",true]);
    rows.push(["Détrempe",nf(detr,0)+" g"]);
    rows.push(["Mantega de tourage",nf(tour,0)+" g",true]);
    rows.push(["Hidratació",nf(hyd(s),0)+" %"]);
    rows.push(["Greix sobre el total",nf(fatPct(s)/sum*100,0)+" %"]);
    rows.push(["Llevat "+YT[s.p.yt][1],nf(P0("llevat",s)*F/100/YT[s.p.yt][0],1)+" g"]);
    rows.push(["§","Laminació"]);
    rows.push(["Bloc de mantega"+(s.p.pcs>1?" (per coca)":""),`${nf(side,0)} × ${nf(side,0)} cm, ≈9 mm`,true]);
    rows.push(["Détrempe oberta",`${nf(side+1,0)} × ${nf(side*2+2,0)} cm`]);
    rows.push(["Capes de massa",nf(Math.pow(3,C.n),0)]);
    rows.push(["Mantega sobre la massa",nf(tour/dough*100,0)+" %"]);
    rows.push(["§","Safata"]);
    rows.push(["Massa per coca",nf(per,0)+" g",true]);
    rows.push(["Ideal per a aquesta safata",nf(ideal,0)+" g"]);
    rows.push(["Gruix en cru",nf(ov.mm,0)+" mm"]);
    rows.push(["§","Temps (estimació)"]);
    rows.push(["Aprest final a "+s.p.Tp+" °C",hf(s.p.mode==="nit"?o.rem:o.proof),true]);
    rows.push(["Forn",ov.short]);
    C.rows=rows;
    C.note=`Model: llevat fresc ${nf(o.y,1)} %; el sucre l'alenteix ×${nf(o.E/1.21,2)}. L'aprest acaba quan la coca ha pujat al voltant del doble, es veuen les capes i, en moure la safata, tremola.`;
    C.summary=`${nf(dough,0)} g de massa · ${s.p.pcs} × ${nf(per,0)} g en safata ${w}×${l} · ${nf(Math.pow(3,C.n),0)} capes · mantega ${nf(P0("mantegatour",s),0)}% · ${s.p.mode==="nit"?"formada la nit abans":"formada al matí"} · ${ov.t}`;
    return C;
  },
  rec:s=>({title:"Ingredients clau",main:"Farina de força W 280–320 i mantega de tourage (82% MG)",sub:"12–13% de proteïna",why:"La farina de força aguanta les voltes sense trencar-se. La mantega de tourage, amb menys aigua, queda plàstica i dona capes netes; amb mantega normal (80%) és més difícil de treballar."}),
  warn:(s,C)=>{
    const w=[],o=C.m,h=hyd(s),t=P0("mantegatour",s);
    if(h<44)w.push(["warn",`Hidratació de la détrempe ${nf(h,0)}%: massa dura, costa estirar-la i es trenca. Puja una mica la llet o l'aigua.`]);
    if(h>58)w.push(["warn",`Hidratació de la détrempe ${nf(h,0)}%: massa tova i enganxosa, la mantega s'hi barreja.`]);
    if(t<45)w.push(["info","Menys del 45% de mantega de tourage: la coca queda menys fullada i més seca."]);
    if(t>62)w.push(["warn","Més del 62% de mantega de tourage: es filtra pels cantons i la coca queda greixosa."]);
    if(P0("sucre",s)+P0("mel",s)>16)w.push(["warn","Més del 16% de sucre a la massa: el llevat pateix. Posa el sucre extra per sobre."]);
    if(s.p.Tp>27)w.push(["bad","Aprest per sobre de 27 °C: la mantega es fon i es perden les capes."]);
    if(s.p.Tp<22)w.push(["info","Aprest per sota de 22 °C: serà molt llarg."]);
    if(C.n>=4)w.push(["warn","Quatre voltes: capes molt fines, difícils de mantenir. Amb 3 voltes surt la coca fullada clàssica."]);
    if(C.n<=2)w.push(["info","Dues voltes: més pa de llet fullat que croissant, molla més oberta."]);
    if(s.p.mode==="mati"){
      if(s.p.fH<4)w.push(["warn","Menys de 4 h a la nevera abans de formar: la massa torna enrere en estirar-la i no s'ha refredat prou."]);
      if(o.y>4&&s.p.fH>10)w.push(["warn","Molt llevat i moltes hores a la nevera: la massa creix i pot sortir de l'embolcall. Posa-hi menys llevat o deixa-hi espai."]);}
    else{
      if(s.p.fH<2)w.push(["warn","Dona forma a la massa quan hagi reposat com a mínim 2–3 h a la nevera."]);
      if(o.over)w.push(["bad","Amb tantes hores a la nevera la coca s'infla massa: baixa el llevat al 2–2,5% o escurça la nevera."]);
      else if(o.y>3)w.push(["info","Si dones forma la nit abans, un 2–2,5% de llevat evita que s'infli massa a la nevera."]);}
    const r=C.per/C.ideal;
    if(r>1.25)w.push(["warn",`Massa per a la safata: ${nf(C.per,0)} g per ≈${nf(C.ideal,0)} g. Quedarà crua al mig. Fes més coques o una safata més gran.`]);
    if(r<.75)w.push(["warn",`Poca massa per a la safata (${nf(C.per,0)} g de ≈${nf(C.ideal,0)}): quedarà molt fina.`]);
    if(P0("canyella",s)>.4)w.push(["warn","Molta canyella dins la massa frena el llevat. Millor barreja-la amb el sucre de sobre."]);
    if(P0("xocolata",s)&&P0("sucrecob",s)>14)w.push(["info","Xocolata i molt sucre per sobre: es cremen abans. Baixa el forn 10 °C a l'últim tram si fosqueja."]);
    if(P0("crema",s))w.push(["info","La crema pastissera, freda i ben cuita, en línies just abans d'enfornar."]);
    if(P0("sucrecob",s)>0)w.push(["info","Si el sucre s'enfosqueix massa, tapa la coca amb paper d'alumini els últims minuts."]);
    w.push(["info","No cal amassar a fons ni fer bloc a l'aire: la massa és només lligada i va freda a la nevera. El gluten es forma amb el repòs i les voltes."]);
    return w;
  },
  tl:{mode:"h",startLabel:"Comences (dia i hora)",defTime:"14:00",defStart:"2026-11-12T14:00"},
  timerMax:3,
  timeline:(s,C)=>{
    const o=C.m,ev=[],n=C.n,g=id=>s.n*P0(id,s)/100;
    ev.push([0,`Détrempe: lliga-ho tot (3–4 min) sense amassar a fons, amb ${nf(g("mantega"),0)} g de mantega tova i la resta freda. Rectangle de 2 cm, embolicat.`]);
    ev.push([.12,`Bloc de mantega: ${nf(C.tour/s.p.pcs,0)} g, ${nf(C.side,0)} × ${nf(C.side,0)} cm i ≈9 mm, entre paperets. A la nevera.`]);
    ev.push([.25,"Détrempe a la nevera fins que estigui ben freda (≈5 °C)."]);
    const t1=1.75;
    for(let i=1;i<=n;i++){const t=t1+(i-1)*.75;
      ev.push([t,i===1?`Volta 1: estén la détrempe a ${nf(C.side+1,0)} × ${nf(C.side*2+2,0)} cm, tanca-hi la mantega, estira a 20 × 60 cm i plega en tres. Nevera 30 min. (Treu la mantega 10 min abans.)`:`Volta ${i}: gira-la 90°, estira a 20 × 60 cm i plega en tres. ${i<n?"Nevera 30 min.":"Embolica-la bé."}`]);}
    const wrap=t1+(n-1)*.75+.25;let bake;
    if(s.p.mode==="mati"){
      ev.push([wrap,`A la nevera tota la nit (${hf(s.p.fH)} a ≈4 °C), ben tapada.`]);
      const out=wrap+s.p.fH;
      ev.push([out,`Treu-la i espera 10–15 min; estén-la a ${C.dimTxt} (≈${nf(C.oven.mm,0)} mm) sobre paper, a la safata.`]);
      ev.push([out+.25,`Aprest a ${s.p.Tp} °C, tapada, ${hf(o.proof)}: ha de pujar al doble, amb capes visibles.`]);
      bake=out+.25+o.proof;
    }else{
      ev.push([wrap,`A la nevera ${hf(s.p.fH)}, ben tapada, perquè es relaxi.`]);
      const sh=wrap+s.p.fH;
      ev.push([sh,`Estén-la a ${C.dimTxt} (≈${nf(C.oven.mm,0)} mm) sobre paper, a la safata; tapada i a la nevera.`]);
      const out2=sh+.25+s.p.fH2;
      ev.push([out2,`Treu la safata (${hf(s.p.fH2)} de fred). Aprest a ${s.p.Tp} °C, tapada: ${hf(o.rem)} més.`]);
      bake=out2+o.rem;
    }
    ev.push([bake-.5,"Encén el forn a 200 °C, amb la safata a mitja alçada."]);
    ev.push([bake,`Pinta amb l'ou, posa el sucre i enforna: ${C.oven.t}.`]);
    ev.push([bake+C.oven.min/60,"Treu-la i deixa-la refredar 10 min a la safata."]);
    C.bake=bake;
    return {ev,tail:[["Conservació","Millor el mateix dia; l'endemà, 5 min al forn a 160 °C perquè recuperi la cruixença."]]};
  },
  phases:(s,C)=>{
    const F=s.n,g=id=>F*P0(id,s)/100,yt=YT[s.p.yt],NOM=Object.fromEntries(ING.map(a=>[a[0],a[2]]));
    const fq=v=>(v<10?nf(v,1):nf(Math.round(v),0))+" g";
    const m=[["Farina de força",fq(F)],["Llet freda",fq(g("llet"))]];
    if(P0("aigua",s)>0)m.push(["Aigua freda",fq(g("aigua"))]);
    for(const id of ["sucre","mel","sal","vainilla","llimona","taronja","canyella"])if(P0(id,s)>0)m.push([NOM[id],fq(g(id))]);
    m.push([`Llevat ${yt[1]}`,fq(P0("llevat",s)*F/100/yt[0])]);
    if(P0("mantega",s)>0)m.push(["Mantega tova",fq(g("mantega"))]);
    const out=[{t:"Détrempe",quan:"El primer dia: només lligar, sense amassar a fons, i a la nevera",items:m},
      {t:"Bloc de mantega",quan:`Entre paperets, ${nf(C.side,0)} × ${nf(C.side,0)} cm i ≈9 mm, a la nevera`,items:[["Mantega de tourage (82% MG)",fq(C.tour)]]}];
    const cb=COB.filter(id=>P0(id,s)>0).map(id=>[NOM[id],fq(g(id))]);
    if(cb.length)out.push({t:"Coberta",quan:"Just abans d'enfornar",items:cb});
    return out;
  },
  phasesNote:"El que poses a cada pas: la détrempe, el bloc de mantega per a les voltes i la coberta.",
  loadNote:(s,C)=>`${nf(C.dough,0)} g · ${nf(Math.pow(3,C.n),0)} capes`,
  pdfTaste:["Capes","Crosta","Flonjor","Gust"],
  how:["Tot ha d'estar fred: llet, aigua i, sobretot, la mantega, que ha de doblegar-se sense trencar-se (≈14 °C). Si suaria, 15 min de nevera.","Amassar poc: la détrempe només ha de lligar. El gluten fort faria que la massa s'encongís en estirar-la.","Estira sempre en la mateixa direcció, amb una mica de farina, sense aixafar els cantons. Talla'ls amb un ganivet ben afilat.","L'aprest, a 25 °C com a màxim. Si la mantega es veu a la superfície, la massa és massa calenta.","Si no vols que s'infli gaire al forn, punxa-la una mica amb una forquilla abans d'enfornar; per a una coca més alta, deixa-la sense punxar.","Forn a 200 °C els primers 10 min per a l'impuls i a 180 °C per acabar. És cuita quan és ben daurada per sota."],
  def:"classica",
  profiles:{
    classica:{name:"Coca de pastisseria",desc:"Rectangle fullat amb sucre per sobre; formada al matí",d:{farina:100,llet:37,aigua:17,sal:2,llevat:3,sucre:12,mantega:8,mantegatour:55,sucrecob:14,pintar:7},p:{mode:"mati",fH:11,turns:"3",Tp:25,thick:"m",tray:"b",pcs:1}},
    nit:{name:"Formada la nit abans",desc:"Dones forma al vespre i l'aprest es fa a la nevera; menys llevat",d:{farina:100,llet:37,aigua:17,sal:2,llevat:2.4,sucre:12,mantega:8,mantegatour:55,sucrecob:14,pintar:7},p:{mode:"nit",fH:4,fH2:7,turns:"3",Tp:25,thick:"m",tray:"b",pcs:1}},
    xocolata:{name:"Amb xocolata",desc:"Pepites de xocolata negra i sucre per sobre",d:{farina:100,llet:37,aigua:17,sal:2,llevat:3,sucre:12,mantega:8,mantegatour:55,sucrecob:8,xocolata:15,pintar:7},p:{mode:"mati",fH:11,turns:"3",Tp:25,thick:"m",tray:"b",pcs:1}},
    ametlla:{name:"Amb ametlla",desc:"Ametlla laminada torrada i sucre per sobre",d:{farina:100,llet:37,aigua:17,sal:2,llevat:3,sucre:12,mantega:8,mantegatour:55,sucrecob:12,ametlla:10,pintar:7},p:{mode:"mati",fH:11,turns:"3",Tp:25,thick:"m",tray:"b",pcs:1}},
    fina:{name:"Fina i molt cruixent",desc:"4 mm i 4 voltes: capes finíssimes i menys molla",d:{farina:100,llet:37,aigua:17,sal:2,llevat:2.5,sucre:12,mantega:8,mantegatour:58,sucrecob:16,pintar:7},p:{mode:"mati",fH:11,turns:"4",Tp:25,thick:"f",tray:"b",pcs:1}}
  }
};
// text de les mides de la coca estesa, calculat un cop al motor
const _calc=R.calc;R.calc=s=>{const C=_calc(s);const [w,l]=TRAY[s.p.tray];C.dimTxt=`${w} × ${l} cm`;return C;};
window.PAGE={key:"coca-croissant",title:"Coca de croissant",titleShort:"COCA DE CROISSANT",where:{S:"Súper",B:"Botiga de pastisseria",C:"De casa"},ing:ING,tabOrd:["coca"],recipes:{coca:R},
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}};
})();
