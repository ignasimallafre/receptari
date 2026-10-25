// ===== Coca de iogurt i magdalenes =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
// grams per got de iogurt (125 ml)
const CUP={sucre:105,farina:70,integral:65,ametllam:55,cacau:50,oli:115,olioliva:115,mantega:120,llet:125,iogurt:125,grec:125,iogllim:125,coco:40};
const ING=[
 ["iogurt","ba","Iogurt natural","","","La base: humitat i un punt àcid que activa el llevat","g",0,250,5,125,"S",{lac:3}],
 ["grec","ba","Iogurt grec","","","Més greix: molla més tendra i densa","g",0,250,5,125,"S",{lac:3,gre:1}],
 ["iogllim","ba","Iogurt de llimona","","","La versió de tota la vida, ja aromatitzada","g",0,250,5,125,"S",{lac:2,cit:2,dol:1}],
 ["llet","ba","Llet sencera","","","Afluixa la massa","g",0,150,5,50,"S",{lac:1}],
 ["ou","ba","Ous","","","Estructura i volum (≈50 g sense closca)","g",50,300,5,150,"S",{},"lin",["ou","ous",50]],
 ["farina","fa","Farina de rebosteria","","Triticum aestivum","Farina fluixa (W 100–150): molla tendra","g",100,350,5,210,"S",{}],
 ["integral","fa","Farina integral fina","","Triticum aestivum","Gust de cereal, molla més humida","g",0,120,5,50,"S",{esp:.5}],
 ["ametllam","fa","Ametlla mòlta","","Prunus dulcis","Molla humida i rica; substitueix part de la farina","g",0,120,5,50,"S",{fru:1,gre:1}],
 ["cacau","fa","Cacau pur en pols","","Theobroma cacao","Treu-ne el mateix pes de farina","g",0,50,1,25,"S",{xoc:4}],
 ["llevat","fa","Llevat químic (impulsor)","","","4–6,5% de la farina; un sobre de 16 g és per a 250 g","g",4,24,.5,16,"S",{},"sub"],
 ["sal","fa","Sal","","","Un pessic realça tots els sabors","g",0,3,.25,1,"S",{},"sub"],
 ["sucre","dg","Sucre blanc","","","Dolçor i crosta daurada","g",80,300,5,200,"S",{dol:3}],
 ["moreno","dg","Sucre moreno","","","Gust de caramel, molla més humida","g",0,150,5,60,"S",{dol:2,esp:1}],
 ["mel","dg","Mel","","","Aroma i molla humida; es daura abans","g",0,80,5,40,"S",{dol:2}],
 ["oli","dg","Oli de gira-sol","","Helianthus annuus","Neutre: molla tendra que no s'endureix a la nevera","g",0,160,5,110,"S",{gre:3}],
 ["olioliva","dg","Oli d'oliva suau","","Olea europaea","Gust afruitat; ideal amb cítrics","g",0,160,5,110,"S",{gre:3,fru:1}],
 ["mantega","dg","Mantega fosa","","","Més gust, molla més ferma en fred","g",0,160,5,110,"S",{gre:3,lac:1}],
 ["llimona","ar","Ratlladura de llimona","","Citrus × limon","Cítric fresc","g",0,8,.5,3,"C",{cit:4}],
 ["taronja","ar","Ratlladura i suc de taronja","","Citrus × sinensis","Cítric dolç","g",0,40,1,15,"C",{cit:3}],
 ["vainilla","ar","Extracte de vainilla","","Vanilla planifolia","Rodó i dolç","g",0,10,.5,5,"S",{dol:1}],
 ["canyella","ar","Canyella mòlta","","Cinnamomum verum","Càlida; fantàstica amb poma","g",0,5,.25,2,"S",{esp:4}],
 ["anis","ar","Anís (licor) o matafaluga","","Pimpinella anisum","Aroma de rebosteria tradicional","g",0,15,1,6,"S",{esp:3}],
 ["xips","ex","Xips de xocolata","","Theobroma cacao","Enfarinades perquè no s'enfonsin","g",0,150,5,80,"S",{xoc:3,dol:1}],
 ["nabius","ex","Nabius","","Vaccinium corymbosum","Àcids i sucosos","g",0,180,5,100,"M",{fru:3,cit:1}],
 ["poma","ex","Poma a daus","","Malus domestica","Molla molt humida","g",0,250,10,150,"M",{fru:3}],
 ["platan","ex","Plàtan madur aixafat","","Musa × paradisiaca","Dolç; substitueix part de l'oli","g",0,250,10,120,"M",{fru:3,dol:1}],
 ["coco","ex","Coco ratllat","","Cocos nucifera","Aroma tropical, molla més seca","g",0,80,5,40,"S",{fru:2,gre:1}],
 ["nous","ex","Nous picades","","Juglans regia","Cruixents i lleugerament amargants","g",0,100,5,50,"S",{fru:1,esp:1}],
 ["sucrecob","co","Sucre per sobre","","","Crosta cruixent","g",0,30,1,15,"S",{dol:1}],
 ["llustre","co","Sucre de llustre","","","Per empolsar en fred","g",0,30,1,10,"S",{dol:1}],
 ["glas","co","Glacejat de llimona (sucre llustre + suc)","","","Sucre llustre amb suc de llimona: crosta blanca","g",0,150,5,80,"S",{dol:2,cit:2}],
 ["xocfosa","co","Cobertura de xocolata","","Theobroma cacao","Xocolata negra fosa amb un raig de nata","g",0,200,10,100,"S",{xoc:3}]
];
const FAM={ba:"Iogurt, lactis i ous",fa:"Farines i impulsor",dg:"Sucre i greix",ar:"Aromes",ex:"Extres",co:"Cobertura"};
const FAMORD=["ba","fa","dg","ar","ex","co"];
const DIMS=[["dol","Dolç"],["cit","Cítric"],["lac","Làctic"],["gre","Greix"],["xoc","Xocolata"],["fru","Fruita"],["esp","Especiat"]];
const P0=(id,s)=>s.doses[id]||0;
const flour=s=>P0("farina",s)+P0("integral",s)+P0("ametllam",s)*.5+P0("cacau",s);
const sugar=s=>P0("sucre",s)+P0("moreno",s)+.8*P0("mel",s)+.15*(P0("iogllim",s));
const fatG=s=>P0("oli",s)+P0("olioliva",s)+.82*P0("mantega",s)+.1*P0("grec",s)+.1*P0("ou",s)+.5*P0("ametllam",s)+.6*P0("coco",s);
const liq=s=>.85*(P0("iogurt",s)+P0("iogllim",s))+.75*P0("grec",s)+.88*P0("llet",s)+.75*P0("ou",s)+.15*P0("taronja",s)+.7*P0("platan",s)+.4*P0("poma",s)+.2*P0("mel",s);
const BAT=["iogurt","grec","iogllim","llet","ou","farina","integral","ametllam","cacau","llevat","sal","sucre","moreno","mel","oli","olioliva","mantega","llimona","taronja","vainilla","canyella","anis","xips","nabius","poma","platan","coco","nous"];
const batter=(s,k)=>BAT.reduce((t,id)=>t+P0(id,s),0)*k;
const cups=(id,g)=>CUP[id]?` <span class="eqh">≈${nf(Math.round(g/CUP[id]*4)/4,2)} ${g/CUP[id]>1.1?"gots":"got"}</span>`:"";

function commonWarn(s,w,base){
  const f=flour(s);const L=P0("llevat",s)/Math.max(1,P0("farina",s)+P0("integral",s)+P0("cacau",s))*100;
  if(L>7)w.push(["warn",`Llevat químic al ${nf(L,1)}% de la farina: puja massa de pressa i s'enfonsa, amb gust metàl·lic. L'ideal és 4–6,5% (un sobre de 16 g és per a 250 g de farina).`]);
  if(L<3)w.push(["warn",`Llevat químic al ${nf(L,1)}%: molla densa i baixa.`]);
  const sr=sugar(s)/f;if(sr>1.15)w.push(["warn","Més sucre que farina: crosta enganxosa i molla que s'enfonsa en refredar."]);
  if(sr<.6)w.push(["info","Poc sucre: queda menys tendra i es daura menys."]);
  const fr=fatG(s)/f;if(fr>.95)w.push(["warn","Molt greix respecte a la farina: molla oliosa que es desfà."]);
  if(fr<.3)w.push(["warn","Poc greix: s'asseca en un dia."]);
  const lr=liq(s)/f;if(lr>1.35)w.push(["warn","Massa molt líquida per a la farina: pot quedar crua i compacta al centre."]);
  if(lr<.65)w.push(["warn","Massa espessa: la molla quedarà seca. Afegeix una mica de llet."]);
  if(P0("mantega",s)&&(P0("oli",s)||P0("olioliva",s)))w.push(["info","Mantega i oli junts funcionen bé: gust de mantega i molla tendra."]);
  const nIog=["iogurt","grec","iogllim"].filter(i=>P0(i,s)).length;if(nIog>1)w.push(["info","Dos tipus de iogurt: el pes total és el que compta."]);
  if(P0("cacau",s)&&P0("farina",s)>base.farina)w.push(["warn","Amb cacau, treu el mateix pes de farina; si no, queda seca."]);
  if(P0("cacau",s)&&L<4.5)w.push(["info","El cacau és àcid i pesa: amb un 5% de llevat queda més lleugera."]);
  if(P0("nabius",s)||P0("xips",s))w.push(["info","Passa els nabius i les xips per una mica de farina perquè no s'enfonsin."]);
  if(P0("poma",s)>180||P0("platan",s)>180)w.push(["warn","Molta fruita humida: allarga 10 min el forn i comprova amb una broqueta."]);
  if(P0("platan",s)&&fr>.5)w.push(["info","El plàtan ja aporta humitat i tendresa: pots baixar l'oli un 25%."]);
  if(P0("canyella",s)>3)w.push(["warn","Molta canyella amarga: amb 1–2 g per iogurt n'hi ha prou."]);
  if(P0("llimona",s)&&P0("taronja",s)&&P0("iogllim",s))w.push(["info","Triple cítric: molt perfumat. Potser n'hi ha prou amb dos."]);
  if(P0("mel",s)>40)w.push(["info","Molta mel: es daura de pressa. Baixa el forn 10 °C."]);
  if(P0("olioliva",s)&&P0("xocfosa",s))w.push(["info","Oli d'oliva i xocolata fan bona parella; tria un oli suau o arbequina."]);
}

const coca={
  name:"Coca de iogurt",lotTitle:"La coca",calcTitle:"Massa, motlle i forn",mixTitle:"Ingredients",
  measure:{label:"Receptes d'un iogurt",unit:"× iogurt",min:.5,max:4,step:.5,def:1,k:1,base:1,
    hint:(s,C)=>`Massa ≈ <b class="num">${nf(C.bat,0)} g</b> · ocupa el <b class="num">${nf(C.fill*100,0)} %</b> del motlle`},
  perLabel:"Per iogurt",totLabel:"Total",
  per:(x,v)=>`${nf(v,v<10?1:0)} g`+cups(x.id,v),
  fmtTot:(x,a)=>{let t=(a<10?nf(a,1):nf(Math.round(a),0))+" g";if(x.eq){const n=Math.max(1,Math.round(a/50));t+=` <span class="eqh">(≈${n} ${n===1?"ou":"ous"})</span>`;}else t+=cups(x.id,a);return t;},
  fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]),req:["ou","farina","llevat"],noLevel:["ba","fa"],famMax:{ex:2,ar:3,co:2,dg:4},
  params:[
    {id:"pan",label:"Motlle",type:"select",def:"r22",opts:[["r20","Rodó de 20 cm"],["r22","Rodó de 22 cm"],["r24","Rodó de 24 cm"],["r26","Rodó de 26 cm"],["p25","Plum-cake 25 × 11 cm"],["p30","Plum-cake 30 × 11 cm"],["s","Safata 30 × 20 cm"],["bund","Bundt / corona de 24 cm"]],noCustom:true},
    {id:"met",label:"Mètode",type:"select",def:"tot",opts:[["tot","Tot batut (de tota la vida)"],["blanq","Ous i sucre blanquejats 5 min"],["clares","Clares muntades a part (més esponjosa)"]]},
    {id:"forn",label:"Forn",type:"select",def:"conv",opts:[["conv","Dalt i baix, sense ventilador"],["vent","Amb ventilador (−15 °C)"]],noCustom:true}
  ],
  actions:[{id:"fit",label:"Ajusta les quantitats al motlle",run:(s,C)=>{const k=C.panV*.5/(C.bat/s.n/1.05);s.n=Math.max(.5,Math.min(4,Math.round(k*2)/2));return `Ara són ${nf(s.n,1)} receptes d'iogurt`;}}],
  dims:DIMS,dimMax:10,
  calc:s=>{
    const PAN={r20:[Math.PI*100*6,"rodó",5.5],r22:[Math.PI*121*6,"rodó",5.5],r24:[Math.PI*144*6,"rodó",5.5],r26:[Math.PI*169*6,"rodó",5.5],p25:[25*11*8,"plum",7],p30:[30*11*8,"plum",7],s:[30*20*5,"safata",4],bund:[2400,"bundt",8]}[s.p.pan];
    const bat=batter(s,s.n);const vol=bat/1.05;const fill=vol/PAN[0];const C={bat,panV:PAN[0],fill};
    const area=s.p.pan[0]==="r"?Math.PI*Math.pow(+s.p.pan.slice(1)/2,2):s.p.pan==="p25"?275:s.p.pan==="p30"?330:s.p.pan==="s"?600:Math.PI*144*.75;
    const hRaw=vol/area;const hBaked=hRaw*2.2;
    const T=s.p.forn==="vent"?165:180;const min=Math.round(18+hRaw*6+(PAN[1]==="plum"?12:0)+(PAN[1]==="bundt"?8:0));C.oven={T,min};
    const f=flour(s);
    C.rows=[["§","Massa"],["Massa total",nf(bat,0)+" g"],["Volum aproximat",nf(vol/1000,2)+" L"],
      ["Sucre / farina",nf(sugar(s)/f,2)],["Greix / farina",nf(fatG(s)/f,2)],["Líquid / farina",nf(liq(s)/f,2)],
      ["Llevat sobre farina",nf(P0("llevat",s)/Math.max(1,P0("farina",s)+P0("integral",s)+P0("cacau",s))*100,1)+" %"],
      ["§","Motlle"],["Volum del motlle",nf(PAN[0]/1000,1)+" L"],["Ompliment",nf(fill*100,0)+" %",fill>.7||fill<.3],
      ["Alçada en cru",nf(hRaw,1)+" cm"],["Alçada cuita (aprox.)",nf(hBaked,1)+" cm"],
      ["§","Forn"],["Temperatura",T+" °C",true],["Temps",`${min}–${min+8} min`,true],["Prova","broqueta neta i 96 °C a dins"]];
    C.note="Els gots són de 125 ml (el got del iogurt). Pesar és més fiable: un got de farina pot variar ±10 g.";
    C.summary=`${nf(bat,0)} g de massa · ${s.p.pan.startsWith("r")?"motlle rodó "+s.p.pan.slice(1)+" cm":PAN[1]} (${nf(fill*100,0)}%) · ${T} °C ${min}–${min+8} min`;
    return C;
  },
  warn:(s,C)=>{const w=[];commonWarn(s,w,{farina:210*s.n/s.n});
    if(C.fill>.7)w.push(["bad",`La massa omple el ${nf(C.fill*100,0)}% del motlle: vessarà. Màxim 2/3; usa «Ajusta les quantitats al motlle».`]);
    if(C.fill<.3)w.push(["warn",`Només omple el ${nf(C.fill*100,0)}% del motlle: quedarà baixa i seca.`]);
    if(s.p.met==="clares")w.push(["info","Amb clares muntades, incorpora-les al final amb moviments envolvents i enforna de seguida."]);
    if(s.p.pan==="bund")w.push(["info","Motlle bundt: unta'l molt bé amb mantega i farina, també el con central."]);
    return w;},
  rec:s=>({title:"Truc de la casa",main:"Mesura-ho tot amb el got del iogurt",sub:"1 iogurt · 3 ous · 1 got d'oli · 2 de sucre · 3 de farina · 1 sobre de llevat",why:"És la proporció 1-1-2-3 de sempre. La calculadora la converteix a grams perquè pugis o baixis quantitats sense perdre l'equilibri."}),
  tl:{mode:"h",startLabel:"Comences (dia i hora)",defTime:"17:00"},
  timeline:(s,C)=>{const ev=[];const pre=0;
    ev.push([0,`Encén el forn a ${C.oven.T} °C. Unta el motlle amb mantega i farina o folra'l amb paper.`]);
    ev.push([.05,s.p.met==="clares"?"Separa els ous. Bat els rovells amb el sucre, afegeix iogurt, oli i aromes.":s.p.met==="blanq"?"Bat els ous amb el sucre 5 min fins que blanquegin i dupliquin volum.":"Bat els ous amb el sucre fins que facin escuma."]);
    ev.push([.15,"Afegeix iogurt, oli i aromes. Tamisa la farina amb el llevat i la sal i barreja només fins que no quedin grumolls."+(s.p.met==="clares"?" Munta les clares amb un pessic de sal i incorpora-les.":"")]);
    ev.push([.3,"Aboca-ho al motlle"+(P0("sucrecob",s)?" i escampa el sucre per sobre":"")+". Al forn, a mitja alçada, sense obrir la porta els primers 25 min."]);
    ev.push([.3+C.oven.min/60,"Punxa amb una broqueta: si surt neta, és cuita."]);
    ev.push([.3+C.oven.min/60+.17,"Desemmotlla després de 10 min i deixa-la refredar sobre una reixa."]);
    if(P0("glas",s)||P0("xocfosa",s))ev.push([.3+C.oven.min/60+1,"Quan sigui freda, cobreix-la amb el glacejat o la xocolata."]);
    return {ev,tail:[["Conservació","3–4 dies tapada a temperatura ambient; amb oli es manté tendra més dies. Es congela a llesques."]]};},
  loadNote:(s,C)=>`${nf(C.bat,0)} g de massa`,
  pdfTaste:["Alçada","Molla","Humitat","Gust"],
  def:"llimona",
  profiles:{
    llimona:{name:"Clàssica de llimona",desc:"La de tota la vida: 1-1-2-3",d:{iogurt:125,ou:150,oli:110,sucre:200,farina:210,llevat:13,sal:1,llimona:3}},
    taronja:{name:"Taronja i oli d'oliva",desc:"Ratlladura i suc de taronja, oli suau",d:{iogurt:125,ou:150,olioliva:110,sucre:190,farina:210,llevat:13,sal:1,taronja:20,glas:60}},
    xocolata:{name:"Marbre de xocolata",desc:"Meitat de la massa amb cacau",d:{iogurt:125,ou:150,oli:110,sucre:200,farina:190,cacau:20,llevat:14,sal:1,vainilla:5,xocfosa:80}},
    poma:{name:"Poma i canyella",desc:"Daus de poma i sucre moreno",d:{iogurt:125,ou:150,oli:100,sucre:140,moreno:50,farina:210,llevat:13,sal:1,canyella:2,poma:150,sucrecob:12}},
    grec:{name:"Grec i nabius",desc:"Iogurt grec, nabius, glacejat",d:{grec:125,ou:150,oli:90,sucre:190,farina:220,llevat:14,sal:1,llimona:3,nabius:100,glas:60}}
  }
};

const mag={
  name:"Magdalenes",lotTitle:"La fornada",calcTitle:"Massa, càpsules i forn",mixTitle:"Ingredients (per a 12)",
  measure:{label:"Nombre de magdalenes",unit:"u.",min:6,max:60,step:1,def:12,k:1/12,base:12,
    hint:(s,C)=>`≈ <b class="num">${nf(C.per,0)} g</b> de massa per càpsula`},
  perLabel:"Per a 12",totLabel:"Total",
  per:(x,v)=>`${nf(v,v<10?1:0)} g`,
  fmtTot:(x,a)=>{let t=(a<10?nf(a,1):nf(Math.round(a),0))+" g";if(x.eq){const n=Math.max(1,Math.round(a/50));t+=` <span class="eqh">(≈${n} ${n===1?"ou":"ous"})</span>`;}return t;},
  fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]).filter(i=>!["glas","xocfosa","bund"].includes(i)),req:["ou","farina","llevat","sucre"],noLevel:["ba","fa"],famMax:{ex:2,ar:3,co:2,dg:4},
  params:[
    {id:"cap",label:"Càpsula",type:"select",def:"std",opts:[["mini","Mini (Ø 3,5 cm)"],["std","Estàndard de magdalena (Ø 5 cm)"],["muf","Muffin (Ø 7 cm)"]],noCustom:true},
    {id:"rest",label:"Repòs de la massa a la nevera",type:"range",min:0,max:24,step:1,def:12,fmt:v=>v?v+" h":"sense repòs",group:"tl",hint:"El repòs en fred i el xoc tèrmic del forn calent fan el copet."},
    {id:"forn",label:"Forn",type:"select",def:"conv",opts:[["conv","Dalt i baix, sense ventilador"],["vent","Amb ventilador (−15 °C)"]],noCustom:true}
  ],
  dims:DIMS,dimMax:10,
  calc:s=>{
    const CAP={mini:[20,15,"mini"],std:[50,40,"estàndard"],muf:[95,80,"muffin"]}[s.p.cap];
    const bat=batter(s,s.n/12);const per=bat/s.n;const fillR=per/CAP[0];
    const pre=s.p.forn==="vent"?205:220,bake=s.p.forn==="vent"?185:200;const min=s.p.cap==="mini"?11:s.p.cap==="std"?17:22;
    const C={bat,per,cap:CAP,fillR,oven:{pre,bake,min}};const f=flour(s);
    C.rows=[["§","Massa"],["Massa total",nf(bat,0)+" g"],["Per càpsula",nf(per,0)+" g",true],["Ideal per a la càpsula",`${CAP[1]}–${CAP[0]} g`],
      ["Sucre / farina",nf(sugar(s)/f,2)],["Greix / farina",nf(fatG(s)/f,2)],["Líquid / farina",nf(liq(s)/f,2)],
      ["Llevat sobre farina",nf(P0("llevat",s)/Math.max(1,P0("farina",s)+P0("integral",s)+P0("cacau",s))*100,1)+" %"],
      ["§","Forn"],["Preescalfar a",pre+" °C",true],["Coure a",`${bake} °C`,true],["Temps",`${min}–${min+3} min`,true],["Safates de 12",String(Math.ceil(s.n/12))]];
    C.note="El copet surt de tres coses: massa freda i reposada, sucre per sobre i forn molt calent que es baixa en entrar.";
    C.summary=`${s.n} magdalenes ${CAP[2]} de ≈${nf(per,0)} g · repòs ${s.p.rest} h · forn ${pre}→${bake} °C ${min} min`;
    return C;
  },
  warn:(s,C)=>{const w=[];commonWarn(s,w,{farina:200});
    if(C.per>C.cap[0]*1.1)w.push(["bad",`${nf(C.per,0)} g per càpsula: vessarà. Omple-les fins a 3/4 (${C.cap[0]} g) o fes més magdalenes.`]);
    if(C.per<C.cap[1]*.85)w.push(["warn",`Només ${nf(C.per,0)} g per càpsula: no faran copet. Baixa el nombre de magdalenes.`]);
    if(s.p.rest<1)w.push(["warn","Sense repòs en fred el copet surt baix. Mínim 1 h a la nevera; millor tota la nit."]);
    if(!P0("sucrecob",s))w.push(["info","Un pessic de sucre per sobre de cada magdalena ajuda a fer el copet i la crosta."]);
    if(P0("mantega",s)&&!P0("oli",s)&&!P0("olioliva",s))w.push(["info","Només amb mantega queden més dures l'endemà: les magdalenes clàssiques porten oli."]);
    if(s.p.rest>24)w.push(["warn","Més de 24 h el llevat químic perd força."]);
    return w;},
  rec:s=>({title:"Secret del copet",main:"Massa freda + forn a 220 °C",sub:"baixa a 200 °C en tancar la porta",why:"El xoc tèrmic fa que el llevat reaccioni de cop al centre quan les vores ja s'han fixat: el centre puja i obre el copet."}),
  tl:{mode:"h",startLabel:"Comences (dia i hora)",defTime:"20:00"},
  timeline:(s,C)=>{const ev=[];
    ev.push([0,"Bat els ous amb el sucre fins que blanquegin (5 min). Afegeix-hi l'oli a fil, el iogurt o la llet i les aromes."]);
    ev.push([.15,"Tamisa la farina amb el llevat i la sal; barreja-ho suaument, sense batre més del compte."]);
    const r=s.p.rest;ev.push([.2,r?`Tapa la massa amb film en contacte i a la nevera ${r} h.`:"Deixa reposar la massa 15 min."]);
    const tf=.2+(r||.25);
    ev.push([tf-.4,`Encén el forn a ${C.oven.pre} °C (20–25 min perquè sigui ben calent).`]);
    ev.push([tf,"Remena un moment la massa freda i omple les càpsules fins a 3/4. Sucre per sobre."+(P0("nabius",s)||P0("xips",s)?" Reparteix-hi els nabius o les xips per sobre.":"")]);
    ev.push([tf+.05,`Al forn i baixa a ${C.oven.bake} °C: ${C.oven.min}–${C.oven.min+3} min sense obrir la porta.`]);
    ev.push([tf+.05+C.oven.min/60,"Treu-les i deixa-les refredar a la reixa."+(s.n>12?" Torna a pujar el forn abans de cada safata.":"")]);
    return {ev,tail:[["Conservació","4–5 dies en una capsa tancada. Es congelen molt bé."]]};},
  loadNote:(s,C)=>`${nf(C.bat,0)} g · ${nf(C.per,0)} g per càpsula`,
  pdfTaste:["Copet","Molla","Humitat","Gust"],
  def:"clas",
  profiles:{
    clas:{name:"Magdalenes de llimona",desc:"Les de copet, amb oli i llimona",d:{ou:150,sucre:130,oli:130,llet:40,farina:170,llevat:8,sal:.5,llimona:3,sucrecob:12},p:{rest:12}},
    iog:{name:"De iogurt",desc:"Més tendres, amb iogurt natural",d:{iogurt:70,ou:100,sucre:110,oli:100,farina:160,llevat:8,sal:.5,llimona:2,sucrecob:12},p:{rest:12}},
    xoc:{name:"Xocolata",desc:"Cacau i xips de xocolata",d:{iogurt:70,ou:100,sucre:115,oli:100,farina:140,cacau:20,llevat:8.5,sal:.5,xips:50,sucrecob:10},p:{rest:8}},
    nabius:{name:"Muffins de nabius",desc:"Grosses, de grec i nabius",d:{grec:125,ou:100,sucre:150,mantega:60,oli:60,llet:60,farina:260,llevat:13,sal:1.5,llimona:3,nabius:150,sucrecob:15},p:{cap:"muf",rest:2},n:8},
    taronja:{name:"Taronja i ametlla",desc:"Oli d'oliva i ametlla mòlta",d:{iogurt:70,ou:100,sucre:110,olioliva:95,farina:130,ametllam:40,llevat:8,sal:.5,taronja:12,sucrecob:12},p:{rest:12}}
  }
};
window.PAGE={key:"coca-iogurt",title:"Coca de iogurt i magdalenes",titleShort:"COCA DE IOGURT I MAGDALENES",where:{S:"Súper",M:"Mercat / fruita",C:"De casa"},ing:ING,tabOrd:["coca","mag"],recipes:{coca,mag},
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}};
})();
