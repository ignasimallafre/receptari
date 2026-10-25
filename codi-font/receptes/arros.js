// ===== Arrossos secs =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
// id, fam, ca, es, sci, taste, unit, min, max, step, typ, where, v, scaling
const ING=[
 ["arros","ar","Arròs bomba o sènia","","Oryza sativa","Gra rodó que xucla el brou sense passar-se","g",70,130,5,100,"S",{}],
 ["brou","ar","Brou o fumet","","","Es calcula sol segons l'arròs i el foc","ml",0,600,10,300,"C",{}],
 ["salsitxa","ca","Salsitxa de porc","","","Greix i gust de carn; a trossos d'un dit","g",0,200,10,100,"K",{car:3}],
 ["costella","ca","Costella de porc a trossets","","","La que fa el brou: ben daurada","g",0,200,10,100,"K",{car:3}],
 ["pollastre","ca","Pollastre a trossos","","","Cuixa i contracuixa, amb os","g",0,200,10,70,"K",{car:2}],
 ["conill","ca","Conill a trossos","","","Carn magra i fina; molt daurat","g",0,250,10,120,"K",{car:2,ter:1}],
 ["botinegra","ca","Botifarra negra","","","Especiada; s'afegeix al final perquè no es desfaci","g",0,100,10,40,"K",{car:2,esp:1}],
 ["cansalada","ca","Cansalada viada","","","Greix saborós per començar el sofregit","g",0,60,5,25,"K",{car:2}],
 ["caragols","ca","Caragols serrans o bovers","","","Nets i escaldats; el gust de muntanya","caragol",0,20,1,10,"M",{ter:2,car:1}],
 ["sipia","ma","Sípia","","Sepia officinalis","La base mariner de quasi tots: daurada a l'oli","g",0,200,10,70,"P",{mar:3}],
 ["calamar","ma","Calamar o calamarsó","","Loligo vulgaris","Més tendre que la sípia; el calamarsó, sencer","g",0,200,10,60,"P",{mar:3}],
 ["gamba","ma","Gamba vermella","","Aristeus antennatus","Els caps fan el fumet; marcar i treure","gamba",0,6,1,2,"P",{mar:3}],
 ["escamarla","ma","Escamarlà","","Nephrops norvegicus","Per sobre els últims minuts","escamarla",0,2,1,1,"P",{mar:3}],
 ["musclo","ma","Musclo","","Mytilus galloprovincialis","Obrir-los a part i aprofitar l'aigua","musclo",0,8,1,4,"P",{mar:2}],
 ["rap","ma","Rap a daus","","Lophius piscatorius","Carn ferma; el cap per al fumet","g",0,120,10,50,"P",{mar:2}],
 ["tinta","ma","Tinta de sípia","","Sepia officinalis","Color negre i gust de mar intens","g",0,8,.5,4,"P",{mar:2}],
 ["ceba","so","Ceba","","Allium cepa","Dolçor del sofregit; ben pochada","g",0,80,5,40,"M",{dol:2}],
 ["tomaquet","so","Tomàquet madur ratllat","","Solanum lycopersicum","El cor del sofregit: fins que perdi l'aigua","g",30,120,5,60,"M",{dol:2}],
 ["pebrot","so","Pebrot verd o vermell","","Capsicum annuum","Fregit amb la carn o al sofregit","g",0,60,5,30,"M",{dol:1,ter:1}],
 ["all","so","All","","Allium sativum","Fregit al principi per perfumar l'oli","gra",0,3,.5,1,"M",{esp:1}],
 ["alltendre","so","All tendre","","Allium sativum","Suau i verd; molt d'arròs de peix","g",0,40,5,15,"M",{ter:1}],
 ["pesols","so","Pèsols","","Pisum sativum","Dolços; a mitja cocció","g",0,40,5,20,"M",{ter:1}],
 ["carxofa","so","Carxofa","","Cynara cardunculus","Amargor elegant; de tardor a primavera","g",0,80,5,40,"M",{ter:2}],
 ["mongeta","so","Bajoqueta","","Phaseolus vulgaris","Verda i cruixent; amb la carn","g",0,60,5,30,"M",{ter:1}],
 ["bolets","bo","Bolets de temporada","","","Rovellons, camagrocs o ceps; nets en sec","g",0,120,10,60,"M",{ter:3}],
 ["xampinyo","bo","Xampinyons","","Agaricus bisporus","Tot l'any; menys gust que els de bosc","g",0,100,10,50,"S",{ter:2}],
 ["oli","co","Oli d'oliva verge extra","","Olea europaea","Per fregir els alls, la carn i el sofregit","ml",10,40,1,20,"S",{}],
 ["sal","co","Sal","","","Al brou, abans de l'arròs: tastar-lo","g",1.5,5,.25,3,"C",{},"sub"],
 ["pimento","co","Pebre vermell dolç","","Capsicum annuum","Color i gust; uns segons, que no es cremi","g",0,3,.25,1,"S",{esp:1,dol:1},"sub"],
 ["safra","co","Safrà","","Crocus sativus","Torrat i esmicolat al brou","g",0,.06,.005,.025,"S",{esp:2},"sub"],
 ["romani","co","Romaní","","Salvia rosmarinus","Una branca els últims minuts i fora","branca",0,2,1,1,"C",{ter:1,esp:1},"fix"],
 ["salmorreta","co","Salmorreta","","","Nyora, all i tomàquet: el toc alacantí","g",0,30,1,15,"C",{dol:2,esp:2}]
];
const FAM={ar:"Arròs i brou",ca:"Carn",ma:"Peix i marisc",so:"Sofregit i verdura",bo:"Bolets",co:"Oli i condiments"};
const FAMORD=["ar","ca","ma","so","bo","co"];
const DIMS=[["car","Carnós"],["mar","Mariner"],["ter","Terrós"],["dol","Sofregit"],["esp","Especiat"]];
const RT={bomba:[3.0,18,"Bomba"],senia:[2.4,16,"Sènia"],albufera:[2.7,17,"Albufera"]};
const FOC={cuina:[1,"Fogó de cuina"],gas:[1.06,"Paellero de gas"],llenya:[1.15,"Llenya"]};
const PSIZES=[26,30,34,38,40,42,46,50,55,60,65,70,80,90];
const P0=(id,s)=>s.doses[id]||0;
const has=(id,s)=>P0(id,s)>0;
const MARI=["sipia","calamar","gamba","escamarla","musclo","rap","tinta"];
const CARN=["salsitxa","costella","pollastre","conill","botinegra","cansalada","caragols"];

function idealDia(s){const area=s.n*P0("arros",s)/32;return 2*Math.sqrt(area/Math.PI)*10;}
function recDia(s){const d=idealDia(s);return PSIZES.find(x=>x>=d-2)||90;}
function salmo(g){const k=g/80;return {ny:Math.max(1,Math.ceil(3*k)),all:15*k,oli:50*k,tom:170*k};}
const sea=s=>MARI.some(id=>has(id,s));
const meat=s=>CARN.some(id=>has(id,s));

function base(tab){return {
  measure:{label:"Comensals",unit:"pers.",min:1,max:30,step:1,def:4,k:1,base:4,
    hint:(s,C)=>`Paella recomanada: <b class="num">Ø ${C.rec} cm</b> · brou <b class="num">${nf(C.brou/1000,2)} L</b>`},
  lotTitle:"La paella",calcTitle:"Arròs, brou i paella",mixTitle:"Ingredients",
  perLabel:"Per comensal",totLabel:"Total",
  fam:FAM,famOrd:FAMORD,derived:["brou"],noLevel:["ar"],famMax:{ca:3,ma:5,so:5,bo:2,co:5},
  derive:s=>{const kb=(tab==="carn"||tab==="conill")?1.2:1;s.doses.brou=Math.round(P0("arros",s)*RT[s.p.tipus][0]*FOC[s.p.foc][0]*kb/5)*5;},
  fmtTot:(x,a)=>{if(x.unit==="g"||x.unit==="ml"){if(x.id==="brou")return nf(a/1000,2)+" L";return (a<1?nf(a,2):a<10?nf(a,1):nf(Math.round(a),0))+" "+x.unit;}
    const v=Math.max(1,Math.round(a));const U={gamba:["gamba","gambes"],escamarla:["escamarlà","escamarlans"],musclo:["musclo","musclos"],caragol:["caragol","caragols"],gra:["gra","grans"],branca:["branca","branques"]}[x.unit]||[x.unit,x.unit];return v+" "+(v===1?U[0]:U[1]);},
  params:[
    {id:"tipus",label:"Varietat d'arròs",type:"select",def:"bomba",opts:[["bomba","Bomba (perdona; xucla molt brou)"],["senia","Sènia o bahia (més gust; es passa abans)"],["albufera","Albufera (entre els dos)"]],sec:"Arròs i foc",noCustom:true},
    {id:"foc",label:"Foc",type:"select",def:"gas",opts:[["cuina","Fogó de cuina o vitro"],["gas","Paellero de gas"],["llenya","Llenya"]],noCustom:true},
    {id:"paella",label:"Paella que tens",type:"select",def:"auto",opts:[["auto","La recomanada"],...PSIZES.map(d=>[d,`Ø ${d} cm`])],noCustom:true},
  ],
  calc:s=>calc(s,tab),
  warn:(s,C)=>warn(s,C,tab),
  tl:{mode:"h",startLabel:"Comences a cuinar (dia i hora)",defTime:"12:45"},
  timeline:(s,C)=>tline(s,C,tab),
  shopSkip:["brou","salmorreta"],
  shopExtra:(s,C)=>{const it=[];const L=nf(C.brou/1000,2)+" L";
    if(tab==="carn"||tab==="conill")it.push(["Aigua (el brou es fa a la paella)",L]);else it.push(["Fumet de peix casolà o de rap i galeres",L]);
    if(has("salmorreta",s)){const m=salmo(C.salm);it.push(["Nyores per a la salmorreta",m.ny+" "+(m.ny===1?"nyora":"nyores")],["Tomàquet per a la salmorreta",nf(Math.round(m.tom),0)+" g"],["All per a la salmorreta",nf(Math.round(m.all),0)+" g"]);}
    return [{h:"Brou i salmorreta",items:it}];},
  dims:DIMS,dimMax:10,
  flavExtra:(s,C,F)=>{F.car+=0;},
  loadNote:(s,C)=>`${nf(C.arros,0)} g d'arròs · ${nf(C.brou/1000,2)} L de brou`,
  pdfTaste:["Punt de l'arròs","Socarrat","Gust","Sal"],
};}

function calc(s,tab){
  const n=s.n,rt=RT[s.p.tipus],foc=FOC[s.p.foc];
  const arros=P0("arros",s)*n,brou=P0("brou",s)*n,rec=recDia(s),dia=s.p.paella==="auto"?rec:+s.p.paella;
  const area=Math.PI*Math.pow(dia/20,2);const dens=arros/area;
  const salm=P0("salmorreta",s)*n;
  const C={arros,brou,rec,dia,dens,salm,cook:rt[1]};
  const rows=[["§","Arròs i brou"],["Arròs",nf(arros,0)+" g",true],[tab==="carn"||tab==="conill"?"Aigua per al brou":"Fumet calent",nf(brou/1000,2)+" L",true],
    ["Proporció brou : arròs",nf(brou/arros,1)+" : 1"+(tab==="carn"||tab==="conill"?" (abans del bull)":"")],["Cocció de l'arròs",`${rt[1]}–${rt[1]+2} min + 5 de repòs`],
    ["§","Paella"],["Recomanada per a "+n,"Ø "+rec+" cm"],["La teva","Ø "+dia+" cm",dens>44||dens<24],["Arròs per dm²",nf(dens,0)+" g (ideal 28–38)"],["Foc",foc[1]]];
  if(salm>0){const m=salmo(salm);rows.push(["§","Salmorreta"],["Salmorreta",nf(salm,0)+" g",true],["Nyores (salmorreta)",String(m.ny)],["All (salmorreta)",nf(m.all,0)+" g"],["Oli (salmorreta)",nf(m.oli,0)+" ml"],["Tomàquet (salmorreta)",nf(m.tom,0)+" g"]);}
  C.rows=rows;
  C.note=`El brou ha d'arribar just als reblons de les nanses. ${tab==="carn"||tab==="conill"?"Hi ha un 20% més d'aigua perquè bull 15–20 min amb la carn abans de l'arròs. ":""}${s.p.foc==="llenya"?"A la llenya s'evapora més: ja hi he afegit un 15% de brou.":s.p.foc==="cuina"&&dia>40?"En un fogó de cuina, una paella tan gran no escalfa igual: gira-la sovint.":""}`;
  C.summary=`${n} comensals · ${nf(arros,0)} g d'arròs ${rt[2].toLowerCase()} · ${nf(brou/1000,2)} L de brou · paella Ø ${dia} cm · ${foc[1].toLowerCase()}`;
  return C;
}

function warn(s,C,tab){
  const w=[];const a=P0("arros",s);
  if(C.dens>44)w.push(["warn",`Massa arròs per a una paella de Ø ${C.dia} cm (${nf(C.dens,0)} g/dm²): la capa queda gruixuda, crua per dalt i passada per baix. Fes-la de Ø ${C.rec} cm.`]);
  if(C.dens<24)w.push(["warn",`Paella massa gran per a tan poc arròs (${nf(C.dens,0)} g/dm²): el brou s'evapora abans que l'arròs es faci. Fes-la de Ø ${C.rec} cm o afegeix-hi un 10% de brou.`]);
  if(s.p.foc==="cuina"&&C.dia>42)w.push(["warn",`Una paella de Ø ${C.dia} cm no escalfa bé en un fogó de cuina: el centre bull i les vores no. Millor un paellero o dues paelles.`]);
  if(a>120)w.push(["info","Més de 120 g d'arròs per comensal: per a un arròs sec en paella, 100 g és la mesura de referència."]);
  const carn=CARN.reduce((t,id)=>t+P0(id,s),0),mar=MARI.filter(i=>i!=="tinta").reduce((t,id)=>t+(id==="gamba"?P0(id,s)*15:id==="escamarla"?P0(id,s)*60:id==="musclo"?P0(id,s)*12:P0(id,s)),0);
  if(carn+mar>320)w.push(["warn","Molt de tropell: amb més de 300 g de carn o peix per comensal l'arròs queda ofegat i no fa socarrat."]);
  if(tab==="carn"&&!has("costella",s)&&!has("pollastre",s))w.push(["info","Sense costella ni pollastre el brou queda fluix: l'os és el que fa gust."]);
  if(has("tinta",s)&&!has("sipia",s)&&!has("calamar",s))w.push(["warn","Tinta sense sípia ni calamar: el negre queda sense cos."]);
  if(tab==="negre"&&!has("tinta",s))w.push(["bad","Un arròs negre sense tinta no és negre."]);
  if(has("botinegra",s))w.push(["info","La botifarra negra, a rodanxes, els últims 5 minuts: si bull tota l'estona es desfà."]);
  if(has("musclo",s))w.push(["info","Obre els musclos a part amb un raig d'aigua i afegeix aquest suc filtrat al brou."]);
  if(has("gamba",s)||has("escamarla",s))w.push(["info","Marca les gambes i els escamarlans a l'oli i treu-los; tornen a la paella els últims 5 minuts."]);
  if(has("salmorreta",s))w.push(["info","La salmorreta va després del sofregit i abans del brou: si la poses al brou es dilueix i no es nota."]);
  if(has("salmorreta",s)&&P0("salmorreta",s)>22)w.push(["warn","Molta salmorreta: la nyora tapa el gust del marisc o de la carn. Amb 12–18 g per comensal n'hi ha prou."]);
  if(has("safra",s)&&has("pimento",s)&&P0("pimento",s)>2)w.push(["info","Molt pebre vermell amb safrà: el pebre tapa el safrà."]);
  if(has("pimento",s))w.push(["info","El pebre vermell, uns segons i de seguida el tomàquet o el brou: si es crema, amarga."]);
  if(has("bolets",s)&&sea(s)&&tab!=="mixt")w.push(["info","Bolets amb marisc és mar i muntanya: bé, però baixa una mica el marisc perquè no es tapin."]);
  if(has("romani",s))w.push(["info","El romaní, una branca els últims 3–4 minuts i fora: si hi és tota l'estona amarga."]);
  if(has("caragols",s))w.push(["info","Els caragols, ja purgats, nets i escaldats 10 min amb una fulla de llorer abans d'afegir-los."]);
  if(s.p.tipus==="senia")w.push(["info","La sènia es passa abans: retalla 1–2 minuts de cocció i no remenis gens."]);
  if(sea(s))w.push(["info","Al·lèrgens: crustacis i mol·luscs. Si hi ha rap o fumet de peix, també peix."]);
  if(tab==="negre"||tab==="peix")w.push(["info","Serveix-lo amb allioli a part."]);
  w.push(["info","Un cop sembrat l'arròs, no el remenis: només sacsejar la paella. Els últims 1–2 minuts, foc fort per fer el socarrat (s'ha de sentir cruixir)."]);
  return w;
}

function tline(s,C,tab){
  const ev=[];let t=0;const fish=tab!=="carn"&&tab!=="conill";
  if(fish){ev.push([0,`Fumet: caps de gamba, espines de rap i galeres sofregits amb una ceba i un tomàquet, aigua i 25 min de bull. Cola'l: ${nf(C.brou/1000,2)} L.`]);t=.5;}
  if(has("salmorreta",s))ev.push([0,`Salmorreta (o treu-la del congelador): remulla ${salmo(C.salm).ny} nyores 30 min, fregeix l'all, la carn de la nyora i el tomàquet 30 min a foc lent i tritura-ho.`]);
  if(has("musclo",s))ev.push([t,"Obre els musclos a part i guarda'n l'aigua filtrada."]);
  ev.push([t,`Fregeix ${P0("all",s)?"els alls sencers en ":""}l'oli${P0("all",s)?" i retira'ls quan siguin rossos":""}.`]);t+=.05;
  if(meat(s)){ev.push([t,`Dora la carn${has("caragols",s)?"":""} en aquell oli, a foc mitjà, fins que estigui ben rossa (no et quedis curt: aquí hi ha el gust).`]);t+=.25;}
  if(has("sipia",s)||has("calamar",s)){ev.push([t,"Dora la sípia o el calamar fins que deixi anar l'aigua i es torri."]);t+=.12;}
  if(has("gamba",s)||has("escamarla",s))ev.push([t,"Marca les gambes i els escamarlans 1 min per banda i retira'ls."]);
  if(has("bolets",s)||has("xampinyo",s)){ev.push([t,"Saltetja els bolets."]);t+=.08;}
  if(has("mongeta",s)||has("carxofa",s)){ev.push([t,"Ofega la bajoqueta i la carxofa."]);t+=.08;}
  ev.push([t,`Sofregit amb l'oli que queda: ${["ceba","pebrot","tomaquet"].filter(i=>has(i,s)).map(i=>({ceba:"ceba",pebrot:"pebrot",tomaquet:"tomàquet"}[i])).join(", ")}, fins que el tomàquet perdi l'aigua i torni l'oli.`]);t+=.25;
  ev.push([t,`Pebre vermell uns segons${has("salmorreta",s)?" i la salmorreta":""}${has("tinta",s)?" i la tinta":""}.`]);t+=.03;
  if(fish){ev.push([t,`Afegeix l'arròs (${nf(C.arros,0)} g), nacra'l 1 min i aboca el fumet calent${has("safra",s)?" amb el safrà":""}. Tasta de sal.`]);}
  else{ev.push([t,`Aboca l'aigua (${nf(C.brou/1000,2)} L)${has("safra",s)?" i el safrà":""}, sala i deixa-la bullir 15 min amb la carn perquè faci brou.`]);t+=.25;
    ev.push([t,`Torna a ajustar el nivell als reblons, tasta de sal i sembra l'arròs (${nf(C.arros,0)} g) en creu. Reparteix-lo i no el toquis més.`]);}
  t+=.02;
  ev.push([t,"Foc fort 8 minuts."]);t+=8/60;
  ev.push([t,`Foc mitjà ${C.cook-10} minuts.${has("gamba",s)||has("escamarla",s)?" Posa-hi el marisc per sobre.":""}${has("botinegra",s)?" Posa-hi la botifarra negra.":""}${has("romani",s)?" Branca de romaní.":""}`]);t+=(C.cook-10)/60;
  ev.push([t,"Foc fort 1–2 minuts per fer el socarrat."]);t+=1.5/60;
  ev.push([t,"Apaga, tapa-la amb un drap o paper de diari i deixa-la reposar 5 minuts."]);t+=5/60;
  ev.push([t,"A taula."]);
  return {ev,tail:[["Sobres","A la nevera, tapat, 1 dia. Escalfa-ho a la paella amb un raig d'aigua."]]};
}

const REC={
  carn:{title:"Arròs recomanat",main:"Bomba o sènia D.O. Arròs de València o del Delta",why:"Amb la carn, el brou es fa a la mateixa paella: per això tot depèn de daurar bé la costella i la salsitxa."},
  mixt:{title:"Arròs recomanat",main:"Sènia o bomba, i un brou meitat de carn i meitat de peix",why:"El mixt funciona quan cap dels dos mons domina: poca carn amb os i marisc que es marca i es retira."},
  peix:{title:"Brou recomanat",main:"Fumet casolà de rap, galeres i caps de gamba",why:"Tot el gust d'aquest arròs és al fumet: un fumet de brik fa un arròs pla."},
  negre:{title:"Matèria primera",main:"Sípia fresca amb la seva bossa de tinta",why:"Si la tinta és de sobre, compta 4 g per comensal. Serveix-lo amb allioli."},
  conill:{title:"Matèria primera",main:"Conill de granja, caragols serrans i llenya de sarment",why:"És l'arròs de l'interior d'Alacant: a la llenya, amb romaní al final i, si pot ser, salmorreta."}
};
const HOW={
  carn:["Fregeix els alls sencers en l'oli i retira'ls quan siguin rossos: l'oli queda perfumat.","Dora la salsitxa i la costella en aquell oli, sense pressa, fins que siguin ben rosses.","Fes el sofregit de ceba, pebrot i tomàquet amb l'oli que ha quedat de la carn.","Pebre vermell (i salmorreta, si en poses), aigua, i 15 minuts de bull perquè la carn faci brou.","Sembra l'arròs en creu, reparteix-lo amb la cullera i ja no el toquis.","Si hi poses bolets, saltetja'ls després de la carn perquè deixin anar l'aigua."],
  mixt:["Dora el pollastre i la costella; després la sípia. Marca les gambes i retira-les.","Sofregit amb l'oli de tot plegat.","Salmorreta (opcional) i pebre vermell, l'arròs i el brou calent.","Els musclos oberts i les gambes, els últims 5 minuts."],
  peix:["Fes el fumet abans: és el que dona el gust.","Dora la sípia i el rap; marca el marisc i retira'l.","Sofregit de tomàquet (i ceba si vols) i salmorreta.","Nacra l'arròs, aboca el fumet calent i ja no el remenis.","Del senyoret: tot pelat, per menjar sense mans.","A banda: el peix del fumet se serveix a part, amb allioli."],
  negre:["Dora la sípia a trossets fins que es torri.","Sofregit de ceba, pebrot i tomàquet.","Tinta i pebre vermell, l'arròs i el fumet calent.","Allioli a part."],
  conill:["Dora el conill a foc mitjà fins que estigui molt ros: és el que fa el brou.","Pebrot vermell a tires, tomàquet i salmorreta.","Aigua i caragols, 20 minuts de bull.","Arròs, i als últims minuts una branca de romaní que es treu abans de servir.","A la llenya de sarment i a l'aire lliure és com ha de ser."]
};

const SALM="<b>Salmorreta (opcional, per a tots):</b> per 80 g, remulla 3 nyores 30 min i rasca'n la carn; fregeix 15 g d'all a làmines en 50 ml d'oli, afegeix la nyora 30 s i 170 g de tomàquet a trossos amb un pessic de sal; 30–40 min a foc lent, tritura i passa pel colador. <b>Com fer-la servir:</b> 12–18 g per comensal, just després del sofregit i l'arròs nacrat (o abans de l'aigua, si el brou es fa a la paella), mai dins el brou. Es congela bé en porcions.";
for(const k in HOW)HOW[k].push(SALM);
function make(tab,name,ing,req,profiles,def){
  return Object.assign(base(tab),{name,ing,req,profiles,def,rec:()=>REC[tab],how:HOW[tab]});
}
const DCOM={ceba:40,tomaquet:60,pebrot:30,all:1,oli:20,sal:3,pimento:1};
const recipes={
  carn:make("carn","De carn",["arros","brou","salsitxa","costella","pollastre","conill","botinegra","cansalada","ceba","tomaquet","pebrot","all","pesols","carxofa","mongeta","bolets","xampinyo","oli","sal","pimento","safra","romani","salmorreta"],["arros","brou","tomaquet","oli"],{
    casa:{name:"El de casa",desc:"Salsitxa, costella i un bon sofregit",d:{arros:100,salsitxa:100,costella:100,...DCOM}},
    bolets:{name:"Amb bolets",desc:"El de casa amb bolets de temporada",d:{arros:100,salsitxa:100,costella:100,bolets:60,...DCOM}},
    muntanya:{name:"De muntanya",desc:"Costella, botifarra negra, bolets i carxofa",d:{arros:100,salsitxa:60,costella:80,botinegra:40,bolets:50,carxofa:30,...DCOM}}
  },"casa"),
  mixt:make("mixt","Mixt",["arros","brou","pollastre","costella","conill","salsitxa","sipia","calamar","gamba","escamarla","musclo","ceba","tomaquet","pebrot","all","pesols","carxofa","mongeta","oli","sal","pimento","safra","salmorreta"],["arros","brou","tomaquet","oli"],{
    classic:{name:"Mixt clàssic",desc:"Pollastre, costella, sípia, gambes, musclos i pèsols",d:{arros:100,pollastre:60,costella:40,sipia:50,gamba:2,musclo:3,pesols:20,ceba:30,tomaquet:60,pebrot:30,all:1,oli:20,sal:3,pimento:1,safra:.025}},
    carxofa:{name:"Amb carxofa",desc:"Pollastre, sípia i carxofa, sense pèsols",d:{arros:100,pollastre:70,sipia:60,gamba:2,carxofa:40,ceba:30,tomaquet:60,pebrot:20,all:1,oli:20,sal:3,pimento:1,safra:.025}},
    salmo:{name:"Amb salmorreta",desc:"El clàssic amb el toc alacantí de nyora",d:{arros:100,pollastre:60,costella:40,sipia:50,gamba:2,musclo:3,tomaquet:50,pebrot:20,all:1,oli:20,sal:3,pimento:.5,salmorreta:15}}
  },"classic"),
  peix:make("peix","Peix i marisc",["arros","brou","sipia","calamar","gamba","escamarla","musclo","rap","ceba","tomaquet","pebrot","all","alltendre","carxofa","oli","sal","pimento","safra","salmorreta"],["arros","brou","tomaquet","oli"],{
    senyoret:{name:"Del senyoret",desc:"Tot pelat: sípia, calamar, gamba i rap",d:{arros:100,sipia:60,calamar:40,gamba:3,rap:50,tomaquet:50,all:1,oli:20,sal:3,pimento:.5,safra:.025,salmorreta:15}},
    marisc:{name:"De marisc",desc:"Sípia, gambes, escamarlans i musclos",d:{arros:100,sipia:60,gamba:2,escamarla:1,musclo:4,ceba:20,tomaquet:60,pebrot:20,all:1,oli:20,sal:3,pimento:1,safra:.025,salmorreta:15}},
    banda:{name:"A banda",desc:"Només arròs i sípia; el peix del fumet, a part",d:{arros:110,sipia:40,tomaquet:50,all:1.5,oli:20,sal:3,pimento:1,salmorreta:15}},
    alls:{name:"Sípia i alls tendres",desc:"Suau i verd, de temporada",d:{arros:100,sipia:90,alltendre:25,carxofa:30,tomaquet:40,all:1,oli:20,sal:3,pimento:.5}}
  },"senyoret"),
  negre:make("negre","Negre",["arros","brou","sipia","calamar","gamba","musclo","tinta","ceba","tomaquet","pebrot","all","alltendre","oli","sal","pimento","salmorreta"],["arros","brou","tinta","oli"],{
    classic:{name:"De sípia",desc:"El clàssic: sípia, sofregit i tinta",d:{arros:100,sipia:120,tinta:4,ceba:40,tomaquet:40,pebrot:20,all:1,oli:25,sal:3,pimento:.5}},
    calamarsons:{name:"Amb calamarsons",desc:"Calamarsons sencers, més tendres",d:{arros:100,calamar:120,tinta:4,ceba:40,tomaquet:40,all:1,oli:25,sal:3,pimento:.5}},
    gambes:{name:"Sípia, gambes i salmorreta",desc:"Més mariner, amb nyora",d:{arros:100,sipia:100,gamba:2,tinta:4,ceba:30,tomaquet:30,all:1,oli:25,sal:3,salmorreta:12}}
  },"classic"),
  conill:make("conill","Conill i caragols",["arros","brou","conill","caragols","pollastre","costella","pebrot","tomaquet","all","ceba","bolets","carxofa","mongeta","oli","sal","pimento","safra","romani","salmorreta"],["arros","brou","tomaquet","oli"],{
    alacant:{name:"Alacantí",desc:"Conill, caragols, pebrot vermell, romaní i salmorreta",d:{arros:100,conill:120,caragols:10,pebrot:30,tomaquet:60,all:1,oli:20,sal:3,pimento:1,safra:.025,romani:1,salmorreta:10}},
    horta:{name:"Amb bajoqueta i carxofa",desc:"Més verd, sense caragols",d:{arros:100,conill:120,mongeta:30,carxofa:30,pebrot:20,tomaquet:60,all:1,oli:20,sal:3,pimento:1,safra:.025,romani:1}},
    bolets:{name:"Conill i bolets",desc:"De tardor: conill, pollastre i rovellons",d:{arros:100,conill:80,pollastre:50,bolets:60,tomaquet:60,all:1,oli:20,sal:3,pimento:1,romani:1}}
  },"alacant")
};
window.PAGE={key:"arrossos-secs",title:"Arrossos secs",titleShort:"ARROSSOS SECS",
  where:{K:"Carnisseria",P:"Peixateria",M:"Mercat (verdura i bolets)",S:"Súper",C:"De casa"},
  units:{gamba:["gamba","gambes"],escamarla:["escamarlà","escamarlans"],musclo:["musclo","musclos"],caragol:["caragol","caragols"]},
  ing:ING,tabOrd:["carn","mixt","peix","negre","conill"],recipes,
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}};
})();
