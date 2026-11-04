// ===== Relleno de Sant Martí (pomes farcides) =====
// Recepta base: la de l'Ajuntament de Teià (la d'en Ignasi), per a 18 pomes.
// Les dosis són per poma; la mesura és el nombre de pomes.
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
const hf=m=>{m=Math.round(m/5)*5;const h=Math.floor(m/60),r=m%60;return h?`${h} h${r?" "+r+" min":""}`:`${r} min`;};
// id, fam, ca, es, sci, taste, unit, min, max, step, typ (per poma), where, v, scaling, eq
const ING=[
 ["poma","po","Poma de carn ferma","","Malus domestica","Vermelleta i dura: ha d'aguantar 4 coccions sense desfer-se","poma",1,1,1,1,"M",{dol:1},"lin"],
 ["vedella","ca","Carn de vedella","","","Rostida el dia abans; dona cos al tap","g",0,30,.5,11.1,"K",{car:3}],
 ["porc","ca","Magra de porc","","","Rostida amb la vedella; sucosa i gustosa","g",0,30,.5,11.1,"K",{car:3}],
 ["pollastre","ca","Pit de pollastre","","","«Si es vol»: fa el tap més generós i tendre","g",0,25,.5,13.9,"K",{car:2}],
 ["botifarra","ca","Botifarra dolça","","","Variant empordanesa (Vilabertran)","g",0,30,.5,12,"K",{car:3,dol:1}],
 ["cansalada","ca","Cansalada viada","","","Un punt de greix si la carn és molt magra","g",0,8,.5,3,"K",{car:2}],
 ["ou","li","Ous (pasta i per sucar)","","","Lliga la carn i segella el tap a la paella","ou",.05,.6,.01,.17,"S",{}],
 ["llimona","li","Llimona","","Citrus × limon","El suc a la pasta i les pells (escarrotxes) a la cassola","llimona",0,.15,.005,.056,"M",{cit:2},"sub"],
 ["llard","ro","Llard","","","Per rostir la carn i, si cal, per a la cassola","g",0,6,.25,2,"K",{car:1}],
 ["ceba","ro","Cebeta","","Allium cepa","Al rostit de la carn","g",0,15,.5,6.7,"M",{dol:.5}],
 ["pastanaga","ro","Pastanaga","","Daucus carota","Al rostit: dolçor i color al suc","g",0,10,.5,4.4,"M",{dol:.5}],
 ["all","ro","All","","Allium sativum","Al rostit, sencers i esclafats","gra",0,.4,.01,.17,"M",{},"sub"],
 ["viranci","ro","Vi ranci","","Vitis vinifera","Un raig al rostit: profunditat (recepta de la Mostra d'Arenys)","ml",0,5,.25,1.5,"S",{lic:2}],
 ["brou","co","Brou","","","Mig litre per a 18 pomes, fins a ⅓ de l'alçada","ml",15,45,1,27.8,"C",{car:1}],
 ["oli","co","Oli per fregir","","Olea europaea","No es consumeix tot: 1 cm a la paella","ml",5,25,1,14,"S",{}],
 ["sal","co","Sal","","","Un polset a la cassola","g",.1,1,.05,.35,"C",{},"sub"],
 ["melindro","pi","Melindros","","","Espesseixen el suc (i la pasta, si és tova)","g",2,15,.25,5.56,"F",{dol:2},"lin",["melindro","melindros",10]],
 ["ametlla","pi","Ametlla torrada","","Prunus dulcis","Ben fina a la picada","g",0,12,.25,2.78,"S",{xoc:1,dol:.5}],
 ["xocolata","pi","Xocolata negra sense llet","","Theobroma cacao","Color fosc i brillantor al suc (2 preses ≈ 25 g)","g",0,4,.1,1.4,"S",{xoc:3}],
 ["sucre","pi","Sucre","","","Part per escampar a la cassola i part a la picada","g",2,12,.25,5.56,"S",{dol:3}],
 ["canyella","pi","Canyella mòlta","","Cinnamomum verum","«Si es vol»: un polset","g",0,.15,.01,.05,"S",{esp:3},"sub"],
 ["torro","pi","Torró de Xixona","","","«Si es vol»: dolçor i ametlla torrada","g",0,6,.25,2,"F",{dol:2,xoc:1}],
 ["galeta","pi","Galetes (tipus Santa Coloma)","","","Escola d'Arenys: més picada i suc més espès","g",0,8,.25,3.4,"F",{dol:2}],
 ["carquinyoli","pi","Carquinyolis","","","Escola d'Arenys","g",0,8,.25,3.4,"F",{dol:1.5,xoc:.5}],
 ["avellana","pi","Avellana torrada","","Corylus avellana","Alternativa o complement a l'ametlla","g",0,6,.25,2,"S",{xoc:1}],
 ["noumosc","pi","Nou moscada","","Myristica fragrans","Un tocs (Mostra d'Arenys)","g",0,.05,.005,.01,"S",{esp:3},"sub"],
 ["conyac","lq","Conyac o brandi","","","Un raig a la pasta (Arenys)","ml",0,3,.1,.8,"S",{lic:3}],
 ["anis","lq","Anís dolç","","Pimpinella anisum","Vilabertran: mig got per a 2 kg de pomes","ml",0,4,.1,1.5,"S",{lic:3,esp:1}],
 ["moscatell","lq","Moscatell o mistela","","Vitis vinifera","Un raig a la cassola: perfum de fruita","ml",0,5,.25,2,"S",{lic:2,dol:1}]
];
const FAM={po:"La poma",ca:"Carn del farcit",li:"Lligar i segellar",ro:"Rostit de la carn",co:"A la cassola",pi:"Picada",lq:"Licors"};
const FAMORD=["po","ca","li","ro","co","pi","lq"];
const DIMS=[["dol","Dolç"],["car","Carnós"],["xoc","Torrat i xocolata"],["cit","Cítric"],["esp","Especiat"],["lic","Licor"]];
const P0=(id,s)=>s.doses[id]||0;
const CARN=["vedella","porc","pollastre","botifarra","cansalada"];
const PIC=["melindro","ametlla","xocolata","canyella","torro","galeta","carquinyoli","avellana","noumosc"];
const carnPP=s=>CARN.reduce((a,id)=>a+P0(id,s),0);
// calibre: pes (g), diàmetre (cm), capacitat del forat (g de farcit)
const CAL={p:["Petita (≈150 g)",150,6.8,24],m:["Mitjana (≈190 g)",190,7.6,34],g:["Grossa (≈240 g)",240,8.4,46]};
// varietat: minuts per sessió de reescalfada, minuts de la 1a cocció després de la picada, risc de desfer-se
const VAR={
  reineta:["Reineta",30,40,0,"Carn ferma i àcida: aguanta bé i equilibra el dolç."],
  gala:["Royal Gala o Fuji (vermella)",20,30,1,"És la «vermelleta» fàcil de trobar; escurça cada represa perquè no es desfaci."],
  golden:["Golden",15,25,2,"Es desfà amb facilitat: no és la millor per a 4 coccions."],
  ciri:["Del ciri o camosa",40,50,0,"La tradicional d'Arenys: molt ferma, demana coccions llargues."],
  donzella:["Verd donzella o capçada",35,45,0,"La de l'Empordà: ferma, aguanta coccions llargues."]
};
const CASS=[24,28,30,32,36,40];
const capOf=s=>CAL[s.p.cal][3]*(s.p.buidat==="gen"?1.5:1);
const polpaOf=s=>CAL[s.p.cal][1]/190*(s.p.buidat==="gen"?28:14); // g de poma que surt en buidar-la

function derive(s){ // ous: 1 per cada ≈350 g de carn (pasta) + 1 per cada 9 pomes (per sucar)
  if("ou" in s.doses)s.doses.ou=Math.round((carnPP(s)/350+1/9)*100)/100;
}
function cassola(s){
  const d=CAL[s.p.cal][2]+.4,n=s.n;const need=d*Math.sqrt(n/.78);
  const one=CASS.find(D=>D>=need);
  const per30=Math.floor(.78*Math.pow(30/d,2));
  return {need,one,per30,n30:Math.ceil(n/per30)};
}
function times(s){
  const V=VAR[s.p.var],c=s.p.cal==="g"?1.2:s.p.cal==="p"?.85:1;
  return {first:Math.round((30+V[2])*c),re:Math.round(V[1]*c),fry:Math.ceil(s.n/2.5)*5};
}

const R={
  name:"Relleno de Sant Martí",lotTitle:"Les pomes",calcTitle:"Quantitats, cassola i temps",mixTitle:"Ingredients",
  measure:{label:"Pomes",unit:"pomes",min:2,max:60,step:1,def:18,k:1,base:18,
    hint:(s,C)=>`≈ <b class="num">${nf(C.pers,0)}</b> ${C.pers===1?"persona":"persones"} (${s.p.pp} per persona) · cassola de ≈ <b class="num">Ø ${nf(C.cas.need,0)} cm</b>`},
  perLabel:"Per poma",totLabel:"Total",
  per:(x,v)=>x.unit==="poma"?"1 poma":x.unit==="ou"?nf(v,2)+" ous":x.unit==="llimona"?nf(v,3)+" llimones":x.unit==="gra"?nf(v,2)+" grans":(v<1?nf(v,2):nf(v,1))+" "+x.unit,
  fmtTot:(x,a,s)=>{
    if(x.unit==="poma")return `${nf(Math.round(a),0)} pomes`;
    if(x.unit==="ou"){const n=Math.max(1,Math.ceil(a-.15));return `${n} ${n===1?"ou":"ous"}`;}
    if(x.unit==="llimona"){const n=Math.max(1,Math.ceil(a-.1));return `${n} ${n===1?"llimona":"llimones"}`;}
    if(x.unit==="gra"){const n=Math.max(1,Math.round(a));return `${n} ${n===1?"gra":"grans"}`;}
    let t=a<1?nf(a,2)+" "+x.unit:a<10?nf(a,1)+" "+x.unit:nf(Math.round(a),0)+" "+x.unit;
    if(x.id==="xocolata")t+=` <span class="eqh">(≈${nf(Math.max(.5,Math.round(a/12.5*2)/2),1)} preses)</span>`;
    if(x.eq){const n=Math.max(.5,Math.round(a/x.eq[2]*2)/2);t+=` <span class="eqh">(≈${nf(n,1)} ${n===1?x.eq[0]:x.eq[1]})</span>`;}
    return t;},
  fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]),req:["poma","ou","brou","sucre","melindro","oli"],derived:["poma","ou"],
  derive,noLevel:["po","li","co"],famMax:{ca:4,pi:7,lq:2},
  params:[
    {id:"pp",label:"Pomes per persona",type:"select",def:2,opts:[[1,"1 (de postres o tast)"],[2,"2 (plat de festa)"],[3,"3 (molt bona gana)"]],noCustom:true},
    {id:"cal",label:"Calibre de la poma",type:"select",def:"m",opts:Object.entries(CAL).map(([k,v])=>[k,v[0]]),noCustom:true},
    {id:"var",label:"Varietat",type:"select",def:"gala",opts:Object.entries(VAR).map(([k,v])=>[k,v[0]]),noCustom:true,hint:"La recepta demana pomes «vermelletes i de carn forta»."},
    {id:"buidat",label:"Buidat de la poma",type:"select",def:"normal",sec:"Tècnica",opts:[["normal","Normal: un ull profund"],["gen","Generós (truc del taller): hi cap més farcit"]]},
    {id:"polpa",label:"Pica la poma que treus i posa-la dins el farcit (truc del taller)",type:"check",def:false},
    {id:"carn",label:"Carn del farcit",type:"select",def:"rostida",opts:[["rostida","Rostida el dia abans i trinxada (Teià)"],["crua","Crua i picada, amb part de la picada (Arenys)"]]},
    {id:"caramel",label:"Caramel al fons de la cassola (Empordà)",type:"check",def:false},
    {id:"res",label:"Picada que guardes per a l'última represa",type:"range",min:0,max:40,step:5,def:25,fmt:v=>v+" %",hint:"Si el suc no queda prou espès, «s'hi pot afegir una altra picada». Guardar-ne una part ho fa fàcil."},
    {id:"ses",label:"Coccions en total (dies)",type:"range",min:2,max:5,step:1,def:4,fmt:v=>v+" dies",group:"tl",hint:"«Es torna a cuinar l'endemà, l'altre, fins a tres o quatre vegades.» Cada represa fa el suc més perfumat i la poma més melosa."},
    {id:"concurs",label:"És per al concurs (2 pomes en cassoleta de ceràmica)",type:"check",def:true,group:"tl",noCustom:true,hint:"Teià 2026: dimecres 11 de novembre a les 11 h, plaça de Sant Martí. Amb 4 coccions, comença el rostit el dissabte 7 a la tarda."},
    {id:"lliura",label:"Hora de lliurament el darrer dia",type:"range",min:8,max:14,step:.5,def:11,fmt:v=>{const h=Math.floor(v),m=Math.round((v-h)*60);return `${h}:${String(m).padStart(2,"0")}`;},show:s=>s.p.concurs,group:"tl",noCustom:true}
  ],
  dims:DIMS,dimMax:10,
  calc:s=>{
    const n=s.n,cp=carnPP(s),cas=cassola(s),T=times(s),Cl=CAL[s.p.cal];
    const pers=n/s.p.pp,ous=P0("ou",s)*n,ouP=cp*n/350,ouS=Math.max(1,ous-ouP);
    const pic=PIC.reduce((a,id)=>a+P0(id,s),0),sucre=P0("sucre",s)*n;
    const C={n,cp,cas,T,pers,ous,ouP,ouS,pic,sucre};const rows=[];
    rows.push(["§","Pomes"]);
    rows.push(["Pomes a comprar",`${Math.ceil(n*1.2)} (amb recanvi)`,true]);
    rows.push(["Pes aproximat",`${nf(n*Cl[1]/1000,1)} kg`]);
    rows.push(["Racions",`${nf(pers,pers%1?1:0)} (${s.p.pp} per persona)`]);
    rows.push(["§","Farcit"]);
    rows.push(["Carn per poma",nf(cp,0)+" g",true]);
    rows.push(["Carn en total",nf(cp*n,0)+" g"]);
    rows.push(["Capacitat del forat",`≈ ${nf(capOf(s),0)} g`]);
    if(s.p.polpa)rows.push(["Poma buidada dins el farcit",`≈ ${nf(polpaOf(s)*n,0)} g (${nf(polpaOf(s),0)} g per poma)`]);
    rows.push(["Ous per a la pasta",nf(Math.max(1,Math.round(ouP)),0)]);
    rows.push(["Ous per sucar els taps",nf(Math.max(1,Math.round(ouS)),0)]);
    rows.push(["§","Picada i suc"]);
    rows.push(["Picada total",nf(pic*n,0)+" g"]);
    rows.push(["Picada del primer dia",nf(pic*n*(1-s.p.res/100),0)+" g",true]);
    if(s.p.res>0)rows.push(["Picada per a l'última represa",nf(pic*n*s.p.res/100,0)+" g"]);
    rows.push(["Sucre per poma",nf(P0("sucre",s),1)+" g"]);
    rows.push(["Brou",nf(P0("brou",s)*n,0)+" ml"]);
    rows.push(["§","Cassola i temps"]);
    rows.push(["Cassola d'una sola capa",cas.one?`Ø ${cas.one} cm`:`${cas.n30} cassoles de 30 cm`,true]);
    if(cas.one&&cas.one>32)rows.push(["O bé",`${cas.n30} × Ø 30 cm (${cas.per30} pomes)`]);
    rows.push(["Fregit dels taps",`≈ ${hf(T.fry)}`]);
    rows.push(["Primera cocció",`≈ ${hf(T.first+30)}`]);
    rows.push(["Cada represa",`≈ ${hf(T.re)}`,true]);
    rows.push(["Coccions",`${s.p.ses} dies`]);
    C.rows=rows;
    C.note=`Una sola capa de pomes, el tap amunt. Reescalfa sempre fins que bulli suau (70 °C al cor) i guarda la cassola a la nevera entre coccions.`;
    C.summary=`${n} pomes ${VAR[s.p.var][0].toLowerCase()} · ${nf(cp,0)} g de carn per poma (${s.p.carn}) · picada ${nf(pic*n,0)} g · sucre ${nf(sucre,0)} g · cassola Ø ${cas.one||30} cm · ${s.p.ses} coccions`;
    return C;
  },
  rec:s=>{const V=VAR[s.p.var];return {title:"La poma",main:V[0]+" · "+CAL[s.p.cal][0].toLowerCase(),sub:"Compra'n un 20 % més i tria-les bessones",why:V[4]+" Fes abans una prova amb una poma: ha de quedar tendra fins al cor però sencera."};},
  warn:(s,C)=>{
    const w=[];const cp=C.cp,cap=capOf(s),V=VAR[s.p.var];
    if(cp>cap*1.35)w.push(["warn",`${nf(cp,0)} g de carn per poma i el forat d'una poma ${CAL[s.p.cal][0].toLowerCase().replace(/ \(.*/,"")} n'agafa ≈${cap} g: el tap sobresortirà molt i pot caure. Buida més o fes servir pomes més grosses.`]);
    if(cp<cap*.4)w.push(["info",`Tap petit (${nf(cp,0)} g per poma): és l'estil d'Arenys. A Teià el tap és més generós (22–35 g).`]);
    if(cp<8)w.push(["bad","Gairebé no hi ha carn: sense carn no és relleno."]);
    if(V[3]===2)w.push(["warn",`${V[0]}: es desfà fàcilment. Amb ${s.p.ses} coccions corres el risc de perdre-les; baixa a 2–3 coccions curtes o canvia de poma.`]);
    if(V[3]===1&&s.p.ses>=4)w.push(["info",`Amb ${V[0].split(" (")[0]} i ${s.p.ses} coccions, fes represes curtes (${C.T.re} min) i no les remenis mai amb cullera: mou la cassola fent girs.`]);
    const su=P0("sucre",s)+P0("torro",s)*.6;
    if(su>11)w.push(["warn",`Molt dolç (≈${nf(su,1)} g de sucre per poma comptant el torró). En un concurs «tradicional», l'equilibri dolç-salat pesa més que la dolçor.`]);
    if(su<4)w.push(["info","Poc dolç: si les pomes són verdes o àcides, rectifica el sucre a cada represa."]);
    if(P0("xocolata",s)>4.5)w.push(["warn","Molta xocolata: el suc quedarà amarg i taparà la poma. Entre 1,5 i 3,5 g per poma el fan fosc, espès i brillant."]);
    if(P0("canyella",s)>.1)w.push(["warn","La canyella domina de seguida: un polset per a tota la cassola."]);
    if(P0("conyac",s)+P0("anis",s)+P0("moscatell",s)>4)w.push(["warn","Massa licor: més d'un raig per poma tapa el gust de la carn i de la poma."]);
    if(P0("anis",s)&&P0("canyella",s)>.05)w.push(["info","Anís i canyella competeixen: tria'n un de protagonista."]);
    if(P0("brou",s)<20)w.push(["warn","Poc brou: el relleno s'enganxa amb facilitat. Afegeix-ne si el suc s'espesseix massa entre represes."]);
    if(P0("brou",s)>38)w.push(["info","Molt brou: el suc quedarà aigualit. Redueix-lo el darrer dia en un cassó."]);
    if(C.pic*1<5)w.push(["warn","Poca picada: el suc no s'espessirà. Els melindros espesseixen i la xocolata dona color."]);
    if(s.p.res===0)w.push(["info","Guarda un 20–30 % de la picada per a l'última represa: és la manera fàcil d'ajustar l'espessor."]);
    if(!C.cas.one)w.push(["info",`Per a ${C.n} pomes en una sola capa necessites ${C.cas.n30} cassoles de 30 cm (${C.cas.per30} cadascuna).`]);
    else if(C.cas.one>36)w.push(["info",`Cassola de Ø ${C.cas.one} cm: si no en tens, reparteix-les en ${C.cas.n30} cassoles de 30 cm. Mai en dues capes.`]);
    if(s.p.polpa)w.push(["info","La poma picada dins el farcit li dona sucositat i lliga el gust del tap amb la poma; si la pasta queda tova, espesseix-la amb un melindro esmicolat."]);
    if(s.p.buidat==="gen")w.push(["info","Buidat generós: deixa almenys 1 cm de paret i el fons sencer, o la poma s'obrirà a la cassola."]);
    if(s.p.carn==="crua")w.push(["warn","Carn crua al tap: el fregit i la primera cocció l'han de coure del tot. Fes la primera cocció completa (≥45 min) i comprova que el centre del tap passi de 70 °C."]);
    if(s.p.caramel)w.push(["info","Caramel al fons: fes-lo rossenc, no fosc, i atura'l amb el brou calent abans de posar-hi les pomes. Baixa una mica el sucre de la picada."]);
    w.push(["warn",`Seguretat: entre coccions, la cassola tapada a la nevera; refreda-la en menys de 2 hores (mai més de 2 h a temperatura ambient). Cada dia, reescalfa fins que bulli suau, almenys 70 °C al cor del tap.`]);
    if(s.p.ses>=4)w.push(["info",`${s.p.ses+(s.p.carn==="rostida"?1:0)} dies des del rostit fins al tast és el màxim raonable: no rosteixis la carn abans d'hora, i l'últim reescalfat és el definitiu.`]);
    w.push(["info","Cassola de terrissa: treu-la de la nevera 15 min abans i comença sempre a foc mínim, damunt la planxa de ferro (evita el xoc tèrmic i que s'enganxi)."]);
    if(s.p.concurs)w.push(["info","Per al jurat: dues pomes bessones, el tap amunt, la pell sense esquerdes, el suc espès i brillant fins a un terç de l'alçada, i la cassoleta neta de degoteigs."]);
    w.push(["info","Al·lèrgens: ou, gluten (melindros, galetes), fruits secs (ametlla, torró) i llet (si la xocolata en porta)."]);
    return w;
  },
  tl:{mode:"h",startLabel:"Comences: rostit de la carn (dia i hora)",defTime:"17:00",defStart:"2026-11-07T17:00"},
  timerMax:4,
  timeline:(s,C)=>{
    const ev=[],T=C.T,n=C.n,crua=s.p.carn==="crua";let d=0;const res=s.p.res;
    if(!crua){
      ev.push([0,`Rosteix juntes les carns (${nf(C.cp*n,0)} g) amb el llard, la cebeta, la pastanaga i l'all${P0("viranci",s)?", i un raig de vi ranci":""}, a foc mitjà i tapat a estones, fins que siguin ben cuites i daurades (≈1 h 30).`]);
      ev.push([1.75,"Separa la carn del suc del rostit. Refreda-ho tot de pressa i guarda-ho tapat a la nevera, per separat: el suc és la base de la cassola."]);
      d=1;}
    const t0=d*24;
    ev.push([t0,crua?`Pica la carn crua i barreja-la amb el suc de llimona, ${nf(Math.max(1,Math.round(C.ouP)),0)} ou${C.ouP>1.5?"s":""} batut${C.ouP>1.5?"s":""}${P0("conyac",s)?", el conyac":""} i una mica de la picada fins que sigui una pasta espessa i modelable.`
      :`Trinxa la carn finament amb el suc de llimona i pasta-la amb ${nf(Math.max(1,Math.round(C.ouP)),0)} ou${C.ouP>1.5?"s":""} batut${C.ouP>1.5?"s":""}. Si queda massa sucosa, espesseix-la amb un melindro esmicolat.`]);
    ev.push([t0+.5,`Renta i asseca les ${n} pomes. Treu-los el cor i les llavors per la part oposada al pèndol, ${s.p.buidat==="gen"?"buidant-les generosament (parets d'1 cm, el fons sencer)":"com un ull profund, sense foradar-les del tot"}.${s.p.polpa?` Pica la poma que treus (sense cor ni llavors, ≈${nf(polpaOf(s)*n,0)} g) i barreja-la amb la pasta de carn.`:""} Farceix-les fins a ras.`]);
    ev.push([t0+1,`Paella amb oli. Suca el tap en ou batut, fregeix-lo cap per avall per afermar-lo i dona un tomb a tota la poma. 2–3 pomes a la vegada (≈${hf(T.fry)} en total).`]);
    const tc=t0+1+T.fry/60;
    ev.push([tc,`Cassola de terra plana i ampla amb el suc del rostit${s.p.caramel?" (i el caramel rossenc al fons)":""}. Pomes en una sola capa, el tap amunt; oli o llard si cal, 3–4 escarrotxes de llimona, un polset de sal, una escampada de sucre i ${nf(P0("brou",s)*n,0)} ml de brou. Foc lentíssim.`]);
    ev.push([tc+.5,`Quan les pomes canviïn de color, afegeix la picada (${nf(C.pic*n*(1-res/100),0)} g): melindros esmicolats, xocolata ratllada, ametlles ben fines, sucre${P0("torro",s)?", torró":""}${P0("canyella",s)?" i canyella":""}. No remenis: mou la cassola fent girs.`]);
    ev.push([tc+.5+T.first/60,"Apaga el foc. Deixa-la refredar destapada com a molt 1 hora i guarda-la tapada a la nevera."]);
    const last=d+s.p.ses-1;
    for(let k=d+1;k<=last;k++){
      const fin=k===last;
      if(fin&&s.p.concurs){const h=s.p.lliura;let sh=17;try{if(s.start){const dd=new Date(s.start);if(!isNaN(dd))sh=dd.getHours()+dd.getMinutes()/60;}}catch(e){}const base=k*24-(sh-h);
        ev.push([base-2.5,`Darrer dia: treu la cassola 15 min abans, planxa de ferro i foc mínim. Reescalfada curta fins que bulli suau (${T.re} min).${res>0&&s.p.ses<3?` Afegeix la picada reservada (${nf(C.pic*n*res/100,0)} g).`:""}`]);
        ev.push([base-1.25,"Tria les 2 pomes més boniques i passa-les a la cassoleta de ceràmica amb una cullera ampla. Redueix una mica de suc en un cassó fins que napi i brilli, i napa-les fins a un terç de l'alçada. Neteja les vores."]);
        ev.push([base,"Lliurament al jurat. Que no passi més de 2 hores a temperatura ambient fins al tast."]);
      }else{
        const pr=res>0&&k===last-(s.p.concurs?1:0)&&k>d;
        ev.push([k*24,`Represa ${k-d}: treu la cassola 15 min abans, planxa de ferro i foc lentíssim, ${T.re} min fins que bulli suau. Tasta i rectifica el sucre; afegeix brou si s'enganxa.${pr?` Afegeix-hi la picada reservada (${nf(C.pic*n*res/100,0)} g).`:""}`]);
        ev.push([k*24+T.re/60+.25,fin?"Serveix-les ben calentes amb el seu suc.":"Refreda-la de pressa i a la nevera, tapada."]);
      }
    }
    return {ev,tail:[["Conservació","Sempre a la nevera entre represes; el darrer reescalfament és el definitiu. Es pot congelar per racions amb el suc."]]};
  },
  phases:(s,C)=>{
    const n=C.n,g=id=>P0(id,s)*n,fq=v=>(v<10?nf(v,1):nf(Math.round(v),0))+" g",ml=v=>nf(Math.round(v),0)+" ml",NOM=Object.fromEntries(ING.map(a=>[a[0],a[2]]));
    const crua=s.p.carn==="crua",out=[],carn=CARN.filter(id=>P0(id,s)>0).map(id=>[NOM[id],fq(g(id))]);
    const lli=Math.max(1,Math.ceil(g("llimona")-.1)),res=s.p.res/100;
    if(!crua){const it=[...carn];if(g("llard"))it.push(["Llard",fq(g("llard"))]);if(g("ceba"))it.push(["Cebeta",fq(g("ceba"))]);if(g("pastanaga"))it.push(["Pastanaga",fq(g("pastanaga"))]);if(g("all"))it.push(["All",`${Math.max(1,Math.round(g("all")))} grans`]);if(g("viranci"))it.push(["Vi ranci",ml(g("viranci"))]);
      out.push({t:"Rostit (el dia abans)",quan:"Les carns juntes, ≈1 h 30",items:it});}
    const fa=[];if(crua)fa.push(...carn);else fa.push(["Carn rostida i trinxada",fq(C.cp*n)]);
    fa.push(["Suc de llimona",`${lli===1?"½":"1"} llimona`]);fa.push(["Ou batut",`${Math.max(1,Math.round(C.ouP))}`]);
    if(s.p.polpa)fa.push(["Poma buidada, picada",fq(polpaOf(s)*n)]);
    if(g("conyac"))fa.push(["Conyac",ml(g("conyac"))]);if(crua)fa.push(["Picada (una cullerada)","una mica"]);
    out.push({t:"Pasta del farcit",quan:`Per a ${n} pomes`,items:fa});
    out.push({t:"Segellar i fregir",quan:"2–3 pomes a la vegada",items:[[`Pomes farcides`,`${n}`],["Ous per sucar",`${Math.max(1,Math.round(C.ouS))}`],["Oli per fregir",ml(g("oli"))]]});
    const ca=[["Suc del rostit","tot"],["Brou",ml(g("brou"))],["Escarrotxes de llimona","3–4"],["Sal",fq(g("sal"))],["Sucre per escampar",fq(g("sucre")*.2)]];
    if(g("moscatell"))ca.push(["Moscatell",ml(g("moscatell"))]);if(g("anis"))ca.push(["Anís",ml(g("anis"))]);
    out.push({t:"A la cassola",quan:s.p.caramel?"Amb caramel rossenc al fons":"Una sola capa, el tap amunt",items:ca});
    const pi=[...PIC.filter(id=>P0(id,s)>0).map(id=>[NOM[id],fq(g(id)*(1-res))]),["Sucre",fq(g("sucre")*.8*(1-res))]];
    out.push({t:"Picada (primer dia)",quan:"Quan les pomes canviïn de color",items:pi});
    if(res>0)out.push({t:"Picada reservada",quan:"Per a l'última represa abans del tast",items:[...PIC.filter(id=>P0(id,s)>0).map(id=>[NOM[id],fq(g(id)*res)]),["Sucre",fq(g("sucre")*.8*res)]]});
    return out;
  },
  shopExtra:(s,C)=>[{h:"Mercat (fruita i verdura)",items:[[`Pomes ${VAR[s.p.var][0].split(" (")[0].toLowerCase()}, ${CAL[s.p.cal][0].toLowerCase()} (amb recanvi)`,`${Math.ceil(C.n*1.2)} pomes`]]},{h:"Material",items:[[`Cassola de terra plana${C.cas.one?" de Ø "+C.cas.one+" cm":" (o "+C.cas.n30+" de 30 cm)"}`,""],["Planxa de ferro (difusor) per al foc",""],...(s.p.concurs?[["Cassoleta de ceràmica petita per a 2 pomes",""]]:[])]}],
  shopSkip:["poma"],
  loadNote:(s,C)=>`${nf(C.cp,0)} g de carn per poma · ${C.n} pomes`,
  pdfTaste:["Poma","Tap","Suc","Equilibri"],
  how:["La poma no s'ha de desfer: una sola capa, ben juntes, i no les remenis mai amb cullera; mou la cassola fent girs.","El tap no ha de caure: la pasta ha de ser espessa i modelable (si és tova, melindro, no farina), i es fregeix primer cap per avall, sucada en ou.","Foc lentíssim i la cassola damunt una planxa de ferro: si s'enganxa, el foc és massa alt.","A cada represa, tasta el suc i rectifica el sucre; si no espesseix, una mica més de picada.","El darrer dia, separa una mica de suc i redueix-lo en un cassó fins que napi: és el que fa brillar les pomes."],
  def:"teia",
  profiles:{
    teia:{name:"Teià (la teva recepta)",desc:"La de l'Ajuntament de Teià, per a 18 pomes",d:{poma:1,vedella:11.1,porc:11.1,ou:.17,llimona:.056,llard:2,ceba:6.7,pastanaga:4.4,all:.17,brou:27.8,oli:14,sal:.35,melindro:5.56,ametlla:2.78,xocolata:1.4,sucre:5.56},p:{carn:"rostida",res:0}},
    pollastre:{name:"Teià amb pollastre",desc:"Amb el pit de pollastre «si es vol»: tap més generós",d:{poma:1,vedella:11.1,porc:11.1,pollastre:13.9,ou:.2,llimona:.056,llard:2,ceba:6.7,pastanaga:4.4,all:.17,brou:27.8,oli:14,sal:.35,melindro:5.56,ametlla:2.78,xocolata:1.4,sucre:5.56},p:{carn:"rostida",res:0}},
    concurs:{name:"Per al concurs",desc:"Teià amb els trucs del taller: buidat generós, poma dins el farcit, bé de sucre i xocolata",d:{poma:1,vedella:13,porc:13,pollastre:13.9,ou:.2,llimona:.056,llard:2,ceba:6.7,pastanaga:4.4,all:.17,brou:30,oli:14,sal:.35,melindro:7,ametlla:3.5,xocolata:3,sucre:8,torro:2,canyella:.05},p:{carn:"rostida",res:25,buidat:"gen",polpa:true}},
    arenys:{name:"Arenys de Munt",desc:"Tap petit de carn crua i picada generosa, amb galetes i carquinyolis",d:{poma:1,porc:12.5,ou:.15,llimona:.05,brou:30,oli:14,sal:.35,melindro:4.5,galeta:3.4,carquinyoli:3.4,ametlla:9,xocolata:3.4,sucre:4.5,conyac:.8},p:{carn:"crua",res:20,var:"ciri"}},
    emporda:{name:"Empordanès",desc:"Tap gros de vedella i porc, caramel a la cassola",d:{poma:1,vedella:18.75,porc:18.75,ou:.2,llimona:.05,llard:2,ceba:6.7,pastanaga:4.4,all:.17,brou:28,oli:14,sal:.35,melindro:4,ametlla:3.1,sucre:7.5},p:{carn:"rostida",caramel:true,res:0,var:"donzella",cal:"g"}}
  }
};
window.PAGE={key:"relleno-sant-marti",title:"Relleno de Sant Martí",titleShort:"RELLENO",
  where:{K:"Carnisseria",M:"Mercat (fruita i verdura)",F:"Forn i pastisseria",S:"Súper",C:"De casa"},
  units:{poma:["poma","pomes"]},ing:ING,tabOrd:["relleno"],recipes:{relleno:R},
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}};
})();
