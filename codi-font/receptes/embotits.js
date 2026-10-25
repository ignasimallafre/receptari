// ===== Embotits curats: cansalada, capocollo, llom =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
const ING=[
 ["sal","sa","Sal marina fina","","","Cura i deshidrata. Al 2,5–3% del pes, sense iode","g",18,40,.5,28,"S",{sal:4}],
 ["nitro","sa","Sal nitro (la teva)","","","Nitrit: color rosat, gust de curat i protecció contra el botulisme","g",.05,.3,.01,.15,"B",{}],
 ["sucre","su","Sucre","","","Suavitza la sal","g",0,10,.5,4,"S",{dol:3}],
 ["dextrosa","su","Dextrosa","","","Menys dolça que el sucre; aliment dels bacteris bons","g",0,8,.5,3,"B",{dol:1.5}],
 ["mel","su","Mel","","","Dolçor aromàtica, típica de la pancetta","g",0,10,.5,5,"S",{dol:3,aro:1}],
 ["pebre","es","Pebre negre trencat","","Piper nigrum","El clàssic: picor neta","g",0,10,.5,4,"S",{esp:3,pic:1}],
 ["pebreb","es","Pebre blanc mòlt","","Piper nigrum","Més fi i perfumat","g",0,4,.25,1.5,"S",{esp:2}],
 ["pimdolc","es","Pebre vermell dolç","","Capsicum annuum","Color i gust del llom embotit","g",0,30,1,15,"S",{esp:2,dol:1}],
 ["pimfum","es","Pebre vermell de la Vera","","Capsicum annuum","Fumat","g",0,20,1,8,"S",{esp:2,fum:4}],
 ["pimpic","es","Pebre vermell picant","","Capsicum annuum","Picor càlida (coppa calabresa)","g",0,15,.5,6,"S",{pic:4,esp:1}],
 ["guindilla","es","Bitxo sec triturat","","Capsicum annuum","Picor viva","g",0,4,.25,1,"S",{pic:5}],
 ["nou","es","Nou moscada","","Myristica fragrans","Càlida, de la coppa piacentina","g",0,1,.05,.3,"S",{esp:3}],
 ["clau","es","Clau mòlt","","Syzygium aromaticum","Molt intens: dosi mínima","g",0,.5,.05,.15,"S",{esp:4}],
 ["canyella","es","Canyella mòlta","","Cinnamomum verum","Punt dolç i càlid","g",0,1,.05,.3,"S",{esp:2,dol:.5}],
 ["coriandre","es","Coriandre en gra","","Coriandrum sativum","Cítric i especiat","g",0,4,.25,1.5,"S",{esp:2,aro:1}],
 ["fonoll","es","Llavors de fonoll","","Foeniculum vulgare","Anisat dolç, del capocollo i lonzino","g",0,5,.25,2,"S",{aro:4}],
 ["ginebre","es","Baies de ginebre aixafades","","Juniperus communis","Resinós, de la pancetta","g",0,6,.25,2,"S",{her:2,aro:2}],
 ["all","he","All","","Allium sativum","Pelat i picat o en pasta amb el vi","g",0,10,.5,4,"C",{her:1,aro:2}],
 ["llorer","he","Llorer","","Laurus nobilis","Esmicolat; perfuma la salaó","fulla",0,4,.5,2,"S",{her:3}],
 ["romani","he","Romaní sec","","Salvia rosmarinus","Resinós","g",0,3,.25,1,"S",{her:3}],
 ["farigola","he","Farigola seca","","Thymus vulgaris","Herbaci, mediterrani","g",0,3,.25,1,"S",{her:3}],
 ["orenga","he","Orenga seca","","Origanum vulgare","Clàssica del llom adobat","g",0,4,.25,1.5,"S",{her:3}],
 ["vi","li","Vi negre o blanc","","Vitis vinifera","Per rentar la peça i desfer l'all","ml",0,40,1,15,"S",{aro:1}],
 ["conyac","li","Conyac o brandi","","","Un raig: aroma i ajuda a netejar","ml",0,15,1,5,"S",{aro:1}]
];
const FAM={sa:"Sal i curat",su:"Sucres",es:"Espècies",he:"Herbes i all",li:"Líquids"};
const FAMORD=["sa","su","es","he","li"];
const DIMS=[["sal","Salat"],["esp","Especiat"],["pic","Picant"],["her","Herbaci"],["aro","Aromàtic"],["dol","Dolç"],["fum","Fumat"]];
const P0=(id,s)=>s.doses[id]||0;

const TYPE={
  cansalada:{name:"Cansalada",carn:"Cansalada de porc (panxa), amb pell o sense",shape:"slab",dim:["Gruix de la peça",2,7,.5,4],loss:[20,40,28],def:1.5,
    tripa:null,tie:"Cordill de cuina (si l'enrotlles)",
    finish:"Penja-la plana amb un ganxo o, si és enrotllada (arrotolata), lligada ben atapeïda i embolicada en tripa o tela."},
  capocollo:{name:"Capocollo",carn:"Carn de coll de porc (cabota), sencera",shape:"cyl",dim:["Diàmetre de la peça",6,14,.5,9],loss:[30,45,35],def:1.8,
    tripa:"Budell de bou (Ø 90–110 mm) o malla elàstica",tie:"Cordill de cuina i malla",
    finish:"Embotit en budell de bou remullat, punxat per treure l'aire i lligat en espiral."},
  llom:{name:"Llom (filet de porc)",carn:"Llom de porc sencer, sense greix exterior gruixut",shape:"cyl",dim:["Diàmetre de la peça",5,11,.5,7],loss:[30,45,37],def:1.5,
    tripa:"Tripa de col·lagen o cular (Ø 70–90 mm)",tie:"Cordill de cuina",
    finish:"Embotit en tripa de col·lagen ben ajustada, punxat i lligat cada 4–5 cm."}
};
function dryModel(s,t){
  const T=TYPE[t];const d=T.shape==="slab"?1.8*s.p.dim:s.p.dim;
  const fT=1-(s.p.T-13)*.06,fH=1+(s.p.HR-75)*.04,fL=Math.pow(s.p.loss/35,1.5);
  const days=.6*d*d*Math.max(.5,fT)*Math.max(.6,fH)*fL;
  const salt=T.shape==="slab"?Math.max(7,Math.ceil(s.p.dim)+4):Math.max(7,Math.ceil(s.p.dim*1.2));
  return {days:Math.round(days),salt};
}
function make(t){
  const T=TYPE[t];
  return {
    name:T.name,lotTitle:"La peça",calcTitle:"Salaó i assecat",mixTitle:"Adob (per kg de carn)",
    measure:{label:"Pes de la carn",unit:"kg",min:.3,max:8,step:.1,def:T.def,k:1,base:1,
      hint:(s,C)=>`Pes objectiu ≈ <b class="num">${nf(C.tgt,0)} g</b> (−${s.p.loss} %)`},
    perLabel:"Per kg",totLabel:"Total",
    per:(x,v)=>x.unit==="g"?nf(v,v<1?2:v<10?1:0)+" g":x.unit==="ml"?nf(v,0)+" ml":nf(v,1)+" "+(v===1?"fulla":"fulles"),
    fmtTot:(x,a)=>x.unit==="g"?(a<1?nf(a,2):a<10?nf(a,1):nf(Math.round(a),0))+" g":x.unit==="ml"?nf(Math.round(a),0)+" ml":P_fmtLeaf(a),
    fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]),req:["sal","nitro"],noLevel:["sa"],famMax:{es:5,he:3},
    params:[
      {id:"dim",label:T.dim[0],type:"range",min:T.dim[1],max:T.dim[2],step:T.dim[3],def:T.dim[4],fmt:v=>nf(v,1)+" cm",noCustom:true},
      {id:"nmax",label:"Dosi màxima de la teva sal nitro (g/kg)",type:"number",min:.05,max:5,step:.01,def:.15,noCustom:true,hint:"La que indica l'envàs. La calculadora no et deixarà passar-la sense avisar."},
      {id:"loss",label:"Pèrdua de pes objectiu",type:"range",min:T.loss[0],max:T.loss[1],step:1,def:T.loss[2],fmt:v=>v+" %",sec:"Assecat"},
      {id:"T",label:"Temperatura de l'assecador",type:"range",min:8,max:18,step:1,def:13,fmt:v=>v+" °C"},
      {id:"HR",label:"Humitat relativa",type:"range",min:60,max:90,step:1,def:75,fmt:v=>v+" %"},
      {id:"eq",label:"Repòs al buit després d'assecar (iguala la humitat)",type:"check",def:true,group:"tl"},
      {id:"now",label:"Pes d'avui (g), per seguir l'assecat",type:"number",min:0,max:20000,step:1,def:0,noCustom:true,group:"tl",hint:"Deixa-ho a 0 si encara no l'has penjada."},
      {id:"w0",label:"Pes en penjar-la (g)",type:"number",min:0,max:20000,step:1,def:0,noCustom:true,group:"tl",hint:"Si és 0, es fa servir el pes de la carn crua."}
    ],
    dims:DIMS,dimMax:10,
    calc:s=>{
      const W=s.n*1000;const M=dryModel(s,t);const w0=s.p.w0>0?s.p.w0:W;const tgt=w0*(1-s.p.loss/100);
      const C={M,tgt,w0};const rows=[];
      rows.push(["§","Salaó en equilibri (al buit)"]);
      rows.push(["Sal",nf(P0("sal",s)*s.n,0)+` g (${nf(P0("sal",s)/10,2)} %)`,true]);
      rows.push(["Sal nitro",nf(P0("nitro",s)*s.n,2)+" g",true]);
      rows.push(["Sucres",nf((P0("sucre",s)+P0("dextrosa",s)+P0("mel",s))*s.n,0)+" g"]);
      rows.push(["Dies a la nevera (2–4 °C)",M.salt+" dies",true]);
      rows.push(["§","Assecat"]);
      rows.push(["Pes de referència",nf(w0,0)+" g"]);
      rows.push(["Pes objectiu",nf(tgt,0)+" g",true]);
      rows.push(["Dies d'assecat (estimació)",`${M.days} dies (≈${nf(M.days/7,0)} setmanes)`,true]);
      rows.push(["Condicions",`${s.p.T} °C · ${s.p.HR} % HR`]);
      if(s.p.now>0){const l=(1-s.p.now/w0)*100;const left=s.p.now-tgt;C.cur=l;
        rows.push(["§","Seguiment"]);rows.push(["Pèrdua actual",nf(l,1)+" %",true]);
        rows.push([left>0?"Falten":"Passat de",nf(Math.abs(left),0)+" g"]);
        rows.push(["Progrés",nf(Math.min(100,l/s.p.loss*100),0)+" %"]);}
      C.rows=rows;C.target=`${nf(tgt,0)} g (-${s.p.loss}% de ${nf(w0,0)} g)`;
      C.note=`Dies d'assecat estimats per ${T.shape==="slab"?"gruix":"diàmetre"}, temperatura i humitat; el que mana és el pes. Pesa la peça cada setmana.`;
      C.summary=`${nf(W,0)} g de carn · sal ${nf(P0("sal",s)/10,1)}% · nitro ${nf(P0("nitro",s),2)} g/kg · salaó ${M.salt} dies · assecat ≈${M.days} dies a ${s.p.T} °C/${s.p.HR}% fins a ${nf(tgt,0)} g`;
      return C;
    },
    rec:s=>({title:"La carn",main:T.carn,sub:T.tripa||"",why:"Carn de carnisseria, ben freda (per sota de 4 °C) i treballada amb les mans i els estris nets. Si és de matança, cal l'anàlisi de triquina."}),
    warn:(s,C)=>{
      const w=[];const sp=P0("sal",s)/10;
      if(sp<2.2)w.push(["bad",`Sal al ${nf(sp,1)}%: per sota del 2,2% no és segur per a un curat llarg.`]);
      if(sp>3.5)w.push(["warn",`Sal al ${nf(sp,1)}%: quedarà molt salat. En equilibri, 2,5–3% és el punt.`]);
      if(P0("nitro",s)>s.p.nmax+1e-9)w.push(["bad",`Sal nitro per sobre de la dosi del fabricant (${nf(s.p.nmax,2)} g/kg). El nitrit en excés és tòxic: no la passis.`]);
      if(P0("nitro",s)<s.p.nmax*.8&&t!=="cansalada")w.push(["warn","Sal nitro per sota de la dosi del fabricant en una peça de curat llarg: perds protecció contra el botulisme i el color. Fes servir la dosi indicada."]);
      if(P0("nitro",s)*s.n<2)w.push(["info",`Només ${nf(P0("nitro",s)*s.n,2)} g de sal nitro: pesa-la amb una bàscula de joier (0,01 g), no amb la de cuina.`]);
      if(s.p.nmax>1)w.push(["info","Amb una sal nitro de més d'1 g/kg, és probable que sigui una barreja de sal i nitrit: aquesta sal també sala. Pots baixar la sal fina en la mateixa quantitat."]);
      const su=P0("sucre",s)+P0("dextrosa",s)+P0("mel",s);if(su>9)w.push(["warn","Massa sucre: pot fermentar a l'assecador i fer gust agre."]);
      if(s.p.HR>85)w.push(["warn","Humitat per sobre del 85%: floridura verda o negra. Ventila o baixa la humitat."]);
      if(s.p.HR<68)w.push(["bad","Humitat per sota del 68%: es forma una crosta seca per fora i el centre queda humit (case hardening)."]);
      if(s.p.T>16)w.push(["warn","Per sobre de 16 °C s'assequen ràpid però amb més risc de ranciesa i floridures."]);
      if(s.p.T<10)w.push(["info","Per sota de 10 °C l'assecat és molt lent; segur, però compta setmanes de més."]);
      if(t!=="cansalada"&&s.p.dim>11)w.push(["warn","Peça molt gruixuda: tarda mesos i el centre s'asseca tard. Mantén la humitat alta (78–80%) les primeres setmanes."]);
      if(t==="cansalada"&&s.p.loss>35)w.push(["info","Amb més d'un 35% de pèrdua, la cansalada queda dura per menjar crua; és per tallar molt fi o per cuinar."]);
      if(t!=="cansalada"&&s.p.loss<32)w.push(["warn","Per sota del 32% de pèrdua un capocollo o un llom encara és humit al centre."]);
      if(P0("all",s)>6)w.push(["info","Molt all: domina el gust. En pasta amb el vi es reparteix millor."]);
      if(P0("all",s))w.push(["info","Tritura l'all amb el vi, deixa-ho 1 h i cola-ho: el gust hi és i no queden trossos que facin floridura."]);
      if(P0("clau",s)>.3)w.push(["warn","El clau per sobre de 0,3 g/kg domina tota la peça."]);
      if(P0("pimdolc",s)+P0("pimfum",s)>25)w.push(["info","Molt pebre vermell: crosta gruixuda i molt color, estil llom embotit."]);
      if(P0("pimfum",s)&&P0("fonoll",s))w.push(["info","El fumat tapa el fonoll: tria'n un."]);
      if(P0("pimpic",s)+P0("guindilla",s)*2>10)w.push(["warn","Molt picant per a una peça sencera: la picor es concentra en assecar."]);
      if(P0("vi",s)>25)w.push(["info","Massa líquid a la bossa: si n'hi ha, escorre'l abans de tancar al buit."]);
      w.push(["info","Pesa la peça el dia que la penges: és la referència de la pèrdua. Floridura blanca i pulverulenta: bona. Verda o negra: neteja-la amb vinagre."]);
      return w;
    },
    tl:{mode:"d",startLabel:"Dia que la poses en salaó"},
    timeline:(s,C)=>{
      const M=C.M;const ev=[];
      ev.push([0,"Pesa la carn, barreja la sal, la sal nitro, els sucres i les espècies, i frega-la per totes bandes. Bossa al buit i a la nevera (2–4 °C)."]);
      ev.push([1,"Gira la bossa i massatja la peça. Fes-ho cada dia."]);
      ev.push([M.salt,"Treu-la, renta-la amb vi o aigua freda i asseca-la bé. Deixa-la 1 dia a la nevera sense tapar."]);
      const h=M.salt+1;ev.push([h,T.finish+" Pesa-la i anota el pes. Penja-la a "+s.p.T+" °C i "+s.p.HR+" % HR."]);
      for(let d=7;d<M.days-3;d+=7)ev.push([h+d,`Pesa-la: setmana ${d/7}. Objectiu final ${nf(C.tgt,0)} g.`]);
      ev.push([h+M.days,`Data estimada: quan arribi a ${nf(C.tgt,0)} g ja està.`]);
      if(s.p.eq)ev.push([h+M.days+21,"Després de 3 setmanes al buit a la nevera la humitat s'iguala: ja la pots tallar."]);
      return {ev,tail:[["Conservació","Al buit a la nevera, mesos. Un cop començada, tapa el tall amb paper i guarda-la a la nevera."]]};
    },
    shopExtra:(s,C)=>{const it=[[T.carn,nf(s.n,1)+" kg"],["Bosses per envasar al buit",""]];if(T.tripa)it.push([T.tripa,""]);it.push([T.tie,""]);return [{h:"Carn i material",items:it}];},
    loadNote:(s,C)=>`sal ${nf(P0("sal",s)/10,1)} % · ${C.M.salt} dies de salaó · ≈${C.M.days} dies d'assecat`,
    pdfLog:true,
    how:HOW[t],
    def:Object.keys(PROF[t])[0],profiles:PROF[t]
  };
}
function P_fmtLeaf(a){const v=Math.max(.5,Math.round(a*2)/2);return nf(v,1)+" "+(v===1?"fulla":"fulles");}
const HOW={
  cansalada:["Escull una panxa de gruix uniforme. Treu els cartílags i escaira els costats perquè la sal entri igual.","Salaó en equilibri: tota la sal i el nitro calculats al gram, en bossa al buit; no cal tirar sal sobrant.","Per fer pancetta enrotllada, treu la pell, posa espècies a l'interior i enrotlla-la ben atapeïda, sense bosses d'aire.","Penja-la en un lloc fosc i ventilat. Amb 25–30% de pèrdua es pot menjar crua a làmines fines."],
  capocollo:["Retalla la peça de coll perquè sigui un cilindre regular, sense penjolls.","Salaó en equilibri al buit, girant-la cada dia.","Embotir: budell de bou remullat 30 min en aigua amb vinagre. Punxa les bombolles amb una agulla neta.","Les 2 primeres setmanes són les crítiques: humitat 78–80% perquè no faci crosta. Després pots baixar al 72–75%.","Està a punt quan ha perdut el 35% i, en prémer-la, és ferma de punta a punta."],
  llom:["Treu el greix exterior gruixut i la membrana platejada.","Salaó en equilibri al buit, girant-lo cada dia.","Per al llom embotit, arrebossa'l amb el pebre vermell i l'orenga després de rentar-lo i abans d'embotir.","Tripa de col·lagen ben ajustada, punxada, i lligat cada 4–5 cm.","A punt amb un 35–40% de pèrdua. El repòs al buit iguala el centre i la vora."]
};
const PROF={
  cansalada:{
    tesa:{name:"Pancetta tesa",desc:"Pebre, ginebre i llorer, plana",d:{sal:28,nitro:.15,sucre:4,pebre:5,ginebre:2,llorer:2,all:3,nou:.2},p:{loss:28}},
    arrotolata:{name:"Pancetta enrotllada",desc:"Sense pell, enrotllada, més pebre",d:{sal:27,nitro:.15,dextrosa:3,pebre:6,ginebre:1.5,nou:.3,clau:.1,llorer:1,all:3},p:{loss:30,dim:5}},
    pimento:{name:"Cansalada adobada",desc:"Pebre vermell, all i orenga",d:{sal:27,nitro:.15,sucre:3,pimdolc:12,pimfum:4,all:4,orenga:1},p:{loss:28}},
    mel:{name:"Amb mel i romaní",desc:"Dolça, herbes de muntanya",d:{sal:27,nitro:.15,mel:6,pebre:3,romani:1,farigola:1,llorer:1},p:{loss:27}}
  },
  capocollo:{
    clas:{name:"Capocollo clàssic",desc:"Pebre negre, fonoll, all i vi",d:{sal:28,nitro:.15,dextrosa:3,sucre:2,pebre:4,fonoll:2,all:3,vi:15},p:{loss:35}},
    piacentina:{name:"Coppa piacentina",desc:"Pebre, canyella, clau i nou moscada",d:{sal:28,nitro:.15,sucre:3,pebre:4,canyella:.3,clau:.1,nou:.3,llorer:1,vi:10},p:{loss:35}},
    calabresa:{name:"Coppa calabresa",desc:"Pebre vermell dolç i picant",d:{sal:28,nitro:.15,dextrosa:3,pimdolc:10,pimpic:6,fonoll:1,all:3,vi:10},p:{loss:36}}
  },
  llom:{
    embotit:{name:"Llom embotit",desc:"Pebre vermell, all i orenga",d:{sal:27,nitro:.15,sucre:3,pimdolc:15,pimfum:3,all:4,orenga:1.5,vi:10},p:{loss:37}},
    pebre:{name:"Llom al pebre",desc:"Crosta de pebre negre gruixut",d:{sal:27,nitro:.15,dextrosa:3,pebre:8,coriandre:1,all:2,conyac:5},p:{loss:37}},
    lonzino:{name:"Lonzino",desc:"Fonoll, pebre i ginebre",d:{sal:27,nitro:.15,dextrosa:3,pebre:3,fonoll:2,ginebre:1.5,llorer:1,vi:10},p:{loss:38}}
  }
};
window.PAGE={key:"embotits-curats",title:"Assecador d'embotits",titleShort:"EMBOTITS CURATS",where:{S:"Súper",B:"Botiga especialitzada / en línia",C:"De casa / mercat"},ing:ING,tabOrd:["cansalada","capocollo","llom"],
  recipes:{cansalada:make("cansalada"),capocollo:make("capocollo"),llom:make("llom")},
  pdf:{INK:[36,32,31],MUT:[98,90,87],ACC:[140,28,43],LN:[210,204,200],BAR:[194,125,125],RED:[176,40,28]}};
})();
