// ===== Coca de brioix =====
(function(){
const nf=(n,d)=>(isFinite(n)?n:0).toLocaleString("ca-ES",{maximumFractionDigits:d,minimumFractionDigits:0});
const hf=h=>{if(!isFinite(h))return "—";const H=Math.floor(h+1e-6),M=Math.round((h-H)*60/5)*5;return M===60?`${H+1} h`:H?`${H} h${M?" "+String(M).padStart(2,"0")+" min":""}`:`${M} min`;};
const RT=[[0,.02],[4,.06],[8,.12],[12,.22],[16,.37],[20,.6],[22,.74],[24,.9],[25,1],[27,1.2],[30,1.45],[32,1.55],[35,1.5],[40,1.1]];
function rate(T){if(T<=RT[0][0])return RT[0][1];for(let i=1;i<RT.length;i++)if(T<=RT[i][0]){const [a,ra]=RT[i-1],[b,rb]=RT[i];return ra+(rb-ra)*(T-a)/(b-a);}return RT[RT.length-1][1];}
const YT={fresc:[1,"fresc"],instant:[3,"sec instantani"],actiu:[2,"sec actiu"]};
const TRAY={a:[30,20],b:[35,25],c:[40,30],d:[45,35]};

const ING=[
 ["farina","fa","Farina de força","","Triticum aestivum","W 300–350: sosté el greix i el sucre","g",100,100,1,100,"S",{}],
 ["llet","li","Llet sencera","","","Molla tendra i crosta daurada","g",0,45,1,25,"S",{mant:1,dol:.5}],
 ["aigua","li","Aigua","","","Molla més lleugera que amb llet","g",0,30,1,0,"C",{}],
 ["nata","li","Nata per muntar (35%)","","","Molla encara més tendra; compta com a greix","g",0,20,1,10,"S",{mant:2}],
 ["sal","li","Sal fina","","","Equilibra el dolç; no la posis en contacte amb el llevat","g",1.2,2.2,.1,1.8,"S",{}],
 ["llevat","li","Llevat de forner","","Saccharomyces cerevisiae","Dosi en llevat fresc; es converteix al tipus triat","g",.5,6,.1,3.5,"S",{}],
 ["ou","gr","Ou sencer batut","","","Volum i estructura","g",0,60,1,35,"S",{ou:3},"lin",["ou","ous",50]],
 ["rovell","gr","Rovell d'ou","","","Color i molla fina, més tendra que amb ou sencer","g",0,20,1,8,"S",{ou:3,mant:1},"lin",["rovell","rovells",18]],
 ["mantega","gr","Mantega","","","La clau de la flonjor: s'afegeix al final, freda però mal·leable","g",10,60,1,35,"S",{mant:4}],
 ["sucre","gr","Sucre","","","Dolçor; per sobre del 15% alenteix el llevat","g",5,25,.5,16,"S",{dol:3}],
 ["mel","gr","Mel","","","Humitat i aroma, la molla dura més tendra","g",0,8,.5,4,"S",{dol:2,arom:1}],
 ["lletpols","gr","Llet en pols","","","Més flonjor i color sense afegir aigua","g",0,6,.5,4,"S",{mant:1,dol:.5}],
 ["llimona","ar","Ratlladura de llimona","","Citrus × limon","Cítric fresc, clàssic de les coques","g",0,1.5,.1,.6,"C",{arom:3}],
 ["taronja","ar","Ratlladura de taronja","","Citrus × sinensis","Cítric dolç","g",0,2,.1,.8,"C",{arom:3}],
 ["azahar","ar","Aigua de flor de taronger","","Citrus × aurantium","Floral intens: poca quantitat","g",0,3,.25,1,"S",{arom:4}],
 ["vainilla","ar","Extracte de vainilla","","Vanilla planifolia","Dolçor aromàtica","g",0,2,.1,.6,"S",{arom:2,dol:.5}],
 ["anis","ar","Anís dolç (licor)","","Pimpinella anisum","Aroma de coca de Sant Joan","g",0,5,.5,2,"S",{esp:3}],
 ["canyella","ar","Canyella mòlta","","Cinnamomum verum","Càlid; frena una mica el llevat","g",0,1,.05,.3,"S",{esp:3}],
 ["cardamom","ar","Cardamom mòlt","","Elettaria cardamomum","Fresc i especiat, estil nòrdic","g",0,.8,.05,.3,"S",{esp:3,arom:1}],
 ["sucrecob","co","Sucre per sobre","","","Crosta cruixent caramel·litzada","g",0,15,.5,8,"S",{cru:3,dol:1}],
 ["perlat","co","Sucre perlat","","","Grans que no es fonen al forn","g",0,15,.5,6,"B",{cru:4,dol:1}],
 ["pinyons","co","Pinyons","","Pinus pinea","El clàssic de la coca catalana","g",0,15,.5,8,"S",{cru:3,arom:1}],
 ["ametlla","co","Ametlla laminada","","Prunus dulcis","Torrada i cruixent","g",0,15,.5,8,"S",{cru:3}],
 ["crema","co","Crema pastissera","","","Per sobre en línies o per farcir","g",0,60,1,30,"C",{dol:2,ou:1}],
 ["cabell","co","Cabell d'àngel","","Cucurbita ficifolia","Farcit tradicional, molt dolç","g",0,60,1,30,"S",{dol:3}],
 ["fruita","co","Fruita confitada","","","Per a coca de Sant Joan","g",0,30,1,15,"S",{dol:2,arom:1}],
 ["pintar","co","Ou per pintar","","","Brillantor; 1 ou batut amb un raig de llet","g",0,10,1,5,"S",{}]
];
const FAM={fa:"Farina",li:"Líquids, sal i llevat",gr:"Ou, mantega i sucre",ar:"Aromes",co:"Coberta i farcit"};
const FAMORD=["fa","li","gr","ar","co"];
const P0=(id,s)=>s.doses[id]||0;
const hyd=s=>P0("aigua",s)+.87*P0("llet",s)+.6*P0("nata",s)+.75*P0("ou",s)+.5*P0("rovell",s)+.16*P0("mantega",s)+.17*P0("mel",s)+.5*P0("anis",s)+.9*P0("azahar",s);
const fat=s=>P0("mantega",s)*.82+P0("nata",s)*.35+P0("rovell",s)*.3+P0("ou",s)*.1;
const COB=["sucrecob","perlat","pinyons","ametlla","crema","cabell","fruita","pintar"];
const doughSum=s=>{let t=0;for(const id in s.doses){if(COB.includes(id)||id==="llevat")continue;t+=s.doses[id];}return t+P0("llevat",s)/YT[s.p.yt][0];};

function model(s){
  const y=P0("llevat",s);
  const E=1+Math.max(0,P0("sucre",s)+P0("mel",s)-5)*.04+P0("mantega",s)*.01+(P0("ou",s)+P0("rovell",s))*.003+P0("canyella",s)*.3;
  const FULL=3*Math.pow(y/2,-.6)*E;const share=.42;const ra=rate(s.p.Ta);const o={y,E,FULL,share,ra};
  if(!s.p.cold){o.bulk=share*FULL/ra;o.proof=(1-share)*FULL/rate(s.p.Tp);o.total=o.bulk+o.proof;}
  else{const H=s.p.fH,cool=Math.min(4,H),Tf=s.p.Tf;const p1=s.p.pre*ra/FULL;const p2=(cool*rate((s.p.Ta+Tf)/2)+Math.max(0,H-cool)*rate(Tf))/FULL;
    o.pre=s.p.pre;o.p=p1+p2;o.over=o.p>share+.15;o.under=o.p<share-.1;o.after=o.p<share?(share-o.p)*FULL/ra:0;
    o.proof=(1-share)*FULL/rate(s.p.Tp)+.75;o.total=o.pre+H+o.after+o.proof;}
  return o;
}
function solve(s){
  const o=model(s);let FULLb;
  if(s.p.cold){const H=s.p.fH,cool=Math.min(4,H),Tf=s.p.Tf;FULLb=(s.p.pre*o.ra+cool*rate((s.p.Ta+Tf)/2)+Math.max(0,H-cool)*rate(Tf))/o.share/o.E;}
  else FULLb=s.p.tgt/(o.share/o.ra+(1-o.share)/rate(s.p.Tp))/o.E;
  let y=2*Math.pow(FULLb/3,-1/.6);let m="Llevat ajustat a l'horari";
  if(y<.5){y=.5;m="Horari molt llarg: llevat al mínim raonable";}if(y>6){y=6;m="Ni amb el màxim de llevat s'arriba a temps";}
  s.doses.llevat=Math.round(y*10)/10;return m;
}

// la safata mana: en canviar safata, gruix o nombre de coques, la farina s'ajusta perquè hi càpiga
function fitFlour(s){const [w,l]=TRAY[s.p.tray];const dens={f:.55,m:.75,g:.95}[s.p.thick];const sum=doughSum(s);
  const f=w*l*dens*s.p.pcs/(sum/100);s.n=Math.min(3000,Math.max(200,Math.round(f/10)*10));}
const R={
  name:"Coca de brioix",lotTitle:"La pastada",calcTitle:"Massa, safata i temps",mixTitle:"Fórmula (% forner)",
  measure:{label:"Farina",unit:"g",min:200,max:3000,step:50,def:600,k:.01,base:500,
    hint:(s,C)=>`Massa ≈ <b class="num">${nf(C.dough,0)} g</b> · ${s.p.pcs} ${s.p.pcs>1?"coques":"coca"} de ≈ <b class="num">${nf(C.dough/s.p.pcs,0)} g</b>`},
  pct:true,perLabel:"% forner",totLabel:"Grams",
  fam:FAM,famOrd:FAMORD,ing:ING.map(a=>a[0]),req:["farina","sal","llevat","mantega","sucre"],derived:["farina"],derive:s=>{s.doses.farina=100;},noLevel:["fa","li"],famMax:{ar:3,co:4},
  amount:(x,v,s,K)=>x.id==="llevat"?v*K/YT[s.p.yt][0]:v*K,
  fmtTot:(x,a,s)=>{if(x.id==="llevat")return `${nf(a,1)} g <span class="eqh">${YT[s.p.yt][1]}</span>`;let t=a<10?nf(a,1)+" g":nf(Math.round(a),0)+" g";if(x.eq){const n=Math.max(.5,Math.round(a/x.eq[2]*2)/2);t+=` <span class="eqh">(≈${nf(n,1)} ${n===1?x.eq[0]:x.eq[1]})</span>`;}return t;},
  per:(x,v)=>x.id==="llevat"?`${nf(v,1)} % fresc`:nf(v,v<1?2:v<10?1:0)+" %",
  params:[
    {id:"pcs",label:"Nombre de coques",type:"number",min:1,max:8,step:1,def:2,noCustom:true,rerender:true,onSet:fitFlour},
    {id:"tray",label:"Safata",type:"select",def:"b",opts:[["a","30 × 20 cm"],["b","35 × 25 cm"],["c","40 × 30 cm (de forn)"],["d","45 × 35 cm"]],noCustom:true,onSet:fitFlour,hint:"La safata, el gruix i el nombre de coques fixen la farina: es recalcula tota la recepta."},
    {id:"thick",label:"Gruix de la coca",type:"select",def:"m",opts:[["f","Fina (cruixent)"],["m","Mitjana"],["g","Gruixuda (molt flonja)"]],onSet:fitFlour},
    {id:"tz",label:"Tangzhong amb llet (més flonja i dura més tendra)",type:"check",def:true,sec:"Flonjor"},
    {id:"tzPct",label:"Farina al tangzhong",type:"range",min:3,max:8,step:.5,def:5,fmt:v=>nf(v,1)+" %",show:s=>s.p.tz,hint:"Es cou amb 5 vegades el seu pes de llet fins a 65 °C."},
    {id:"yt",label:"Tipus de llevat",type:"select",def:"fresc",opts:[["fresc","Fresc (pastilla)"],["instant","Sec instantani (÷3)"],["actiu","Sec actiu (÷2)"]],noCustom:true},
    {id:"Ta",label:"Temperatura de la cuina",type:"range",min:16,max:30,step:1,def:22,fmt:v=>v+" °C",group:"tl"},
    {id:"Tp",label:"Temperatura de l'aprest",type:"range",min:20,max:30,step:1,def:26,fmt:v=>v+" °C",group:"tl",hint:"El forn apagat amb un bol d'aigua bullint fa ≈26–28 °C. No passis de 28: la mantega es fon."},
    {id:"cold",label:"Bloc a la nevera (recomanat: es forma millor)",type:"check",def:true,group:"tl"},
    {id:"pre",label:"Bloc a temperatura ambient abans de la nevera",type:"range",min:0,max:2,step:.25,def:.75,fmt:hf,show:s=>s.p.cold,group:"tl"},
    {id:"fH",label:"Hores a la nevera",type:"range",min:6,max:48,step:1,def:12,fmt:v=>v+" h",show:s=>s.p.cold,group:"tl"},
    {id:"Tf",label:"Temperatura de la nevera",type:"range",min:2,max:8,step:1,def:4,fmt:v=>v+" °C",show:s=>s.p.cold,group:"tl"},
    {id:"tgt",label:"Vull que la fermentació duri",type:"range",min:2,max:10,step:.5,def:4,fmt:hf,show:s=>!s.p.cold,group:"tl",noCustom:true}
  ],
  actions:[{id:"solve",label:"Ajusta el llevat a aquest horari",group:"tl",run:s=>solve(s)},
    {id:"fit",label:"Torna a ajustar la farina a la safata",run:s=>{fitFlour(s);return "Farina ajustada a "+s.n+" g";}}],
  dims:[["mant","Mantegós"],["dol","Dolç"],["ou","Ou"],["arom","Aromàtic"],["esp","Especiat"],["cru","Cruixent"]],dimMax:10,
  flavExtra:(s,C,F)=>{if(s.p.tz)F.mant+=1;},
  calc:s=>{
    const F=s.n,o=model(s),sum=doughSum(s),dough=F*sum/100;const [w,l]=TRAY[s.p.tray];const area=w*l;
    const dens={f:.55,m:.75,g:.95}[s.p.thick];const ideal=area*dens;const per=dough/s.p.pcs;
    const C={m:o,sum,dough,area,ideal,per};const rows=[];
    rows.push(["§","Massa"]);
    rows.push(["Hidratació efectiva",nf(hyd(s),1)+" %",true]);
    rows.push(["Greix sobre farina",nf(fat(s),0)+" %"]);
    rows.push(["Massa total",nf(dough,0)+" g"]);
    rows.push(["Llevat "+YT[s.p.yt][1],nf(P0("llevat",s)*F/100/YT[s.p.yt][0],1)+" g"]);
    rows.push(["§","Safata"]);
    rows.push(["Massa per coca",nf(per,0)+" g",true]);
    rows.push(["Ideal per a aquesta safata",nf(ideal,0)+" g"]);
    rows.push(["Gruix aproximat en cru",nf(per/area/.9*10,0)+" mm"]);
    if(s.p.tz){const tf=F*s.p.tzPct/100;C.tz=[tf,tf*5];rows.push(["§","Tangzhong"]);rows.push(["Farina",nf(tf,0)+" g"]);rows.push(["Llet (de la fórmula)",nf(tf*5,0)+" g",true]);}
    rows.push(["§","Temps (estimació)"]);
    if(!s.p.cold){rows.push(["Bloc a "+s.p.Ta+" °C",hf(o.bulk),true]);rows.push(["Aprest a "+s.p.Tp+" °C",hf(o.proof),true]);rows.push(["Total de pastar a forn",hf(o.total)]);}
    else{rows.push(["Bloc abans de la nevera",hf(o.pre)]);rows.push(["Nevera",`${s.p.fH} h a ${s.p.Tf} °C`]);rows.push(["Bloc fet en sortir",nf(Math.min(o.p/o.share,9)*100,0)+" %",o.over||o.under]);
      if(o.after>.1)rows.push(["Bloc que falta, a temperatura ambient",hf(o.after),true]);rows.push(["Aprest a "+s.p.Tp+" °C (massa freda)",hf(o.proof),true]);rows.push(["Total",hf(o.total)]);}
    const Tl=Math.min(30,Math.max(1,3*24-2*s.p.Ta-16));rows.push(["Llet a",nf(Tl,0)+" °C"]);
    const mm=per/area/.9*10;const min=Math.round(12+mm*.6);C.oven={T:185,min,t:`185 °C, ${min}–${min+4} min`};
    rows.push(["Forn",C.oven.t]);
    C.rows=rows;
    C.note=`Model: llevat fresc ${nf(o.y,1)} %; el sucre i la mantega l'alenteixen ×${nf(o.E,2)}. L'aprest acaba quan la massa ha doblat i, en tocar-la, l'empremta torna a pujar a poc a poc.`;
    C.summary=`${nf(dough,0)} g de massa · ${s.p.pcs} × ${nf(per,0)} g en safata ${w}×${l} · mantega ${nf(P0("mantega",s),0)}% · ${s.p.cold?"bloc en fred "+s.p.fH+" h":"fermentació "+hf(o.total)} · ${C.oven.t}`;
    return C;
  },
  rec:s=>({title:"Farina recomanada",main:"Farina de força W 300–350 (Manitoba o «gran fuerza»)",sub:"12,5–14% de proteïna",why:"Amb un 30–45% de mantega i molt sucre, només un gluten fort fa la xarxa que reté el gas i dona la molla filosa i flonja."}),
  warn:(s,C)=>{
    const w=[];const o=C.m;const h=hyd(s),rh=54+(s.p.tz?s.p.tzPct*1.2:0);
    if(h>rh+8)w.push(["warn",`Hidratació efectiva ${nf(h,0)}%: massa molt tova i enganxosa. Per a brioix va bé ${nf(rh-4,0)}–${nf(rh+5,0)}%.`]);
    if(h<rh-6)w.push(["warn",`Hidratació efectiva ${nf(h,0)}%: queda dur i sec. Puja una mica la llet o l'ou.`]);
    if(P0("mantega",s)>50)w.push(["warn","Més del 50% de mantega: cal molt de domini i la massa es greixa. Per a una coca flonja, 30–40% és el punt."]);
    if(P0("mantega",s)<20)w.push(["info","Menys del 20% de mantega: és més un pa de llet que un brioix."]);
    if(P0("sucre",s)+P0("mel",s)>20)w.push(["warn","Més del 20% de sucre: el llevat pateix. Fes servir llevat sec osmotolerant o puja la dosi un 30%."]);
    if(P0("ou",s)+P0("rovell",s)>55)w.push(["warn","Molt ou: gust d'ou i molla gomosa. Substitueix part de l'ou per rovells o llet."]);
    if(P0("ou",s)+P0("rovell",s)<15)w.push(["info","Poc ou: la coca quedarà menys groga i menys aromàtica."]);
    if(s.p.Tp>28)w.push(["bad","Aprest per sobre de 28 °C: la mantega es fon i la massa s'aplana i greixa."]);
    if(s.p.Ta>25&&!s.p.cold)w.push(["warn","Cuina calenta: pasta amb llet de la nevera i, si cal, posa el bol 15 min a la nevera abans d'afegir la mantega."]);
    if(s.p.cold){if(o.over)w.push(["bad",`La massa surt de la nevera passada (${nf(o.p/o.share*100,0)}% del bloc): baixa el llevat o prova «Ajusta el llevat a aquest horari».`]);
      if(o.under)w.push(["info",`En sortir de la nevera duu el ${nf(o.p/o.share*100,0)}% del bloc: no passa res, l'aprest ho compensa (${hf(o.after)} més).`]);}
    else w.push(["info","Sense nevera la massa és tova i enganxosa de formar. Una nit al fred la fa dòcil i més gustosa."]);
    const r=C.per/C.ideal;if(r>1.25)w.push(["warn",`Massa massa gruixuda per a la safata (${nf(C.per,0)} g de ≈${nf(C.ideal,0)}): quedarà crua al mig. Fes més coques o una safata més gran.`]);
    if(r<.75)w.push(["warn",`Poca massa per a la safata (${nf(C.per,0)} g de ≈${nf(C.ideal,0)}): quedarà fina i seca.`]);
    if(P0("crema",s)&&P0("cabell",s))w.push(["info","Crema i cabell d'àngel alhora: molt dolça. Si les combines, baixa el sucre de la massa al 12%."]);
    if(P0("crema",s))w.push(["info","Crema pastissera freda i ben cuita (que bulli 1 min): posa-la amb mànega just abans d'enfornar."]);
    if(P0("pinyons",s))w.push(["info","Remulla els pinyons 10 min en aigua: així no es cremen al forn."]);
    if(P0("sucrecob",s))w.push(["info","El sucre de sobre, mullat amb unes gotes d'aigua o d'anís: fa la crosta cruixent típica."]);
    if(P0("canyella",s)>.5)w.push(["warn","Molta canyella dins la massa frena el llevat. Millor posa-la per sobre."]);
    if(P0("azahar",s)>2)w.push(["warn","La flor de taronger, per sobre del 2%, recorda el sabó."]);
    if(P0("anis",s)&&P0("cardamom",s))w.push(["info","Anís i cardamom competeixen: tria'n un."]);
    if(P0("lletpols",s)>5)w.push(["info","Molta llet en pols enfosqueix molt la crosta: baixa 5 °C el forn."]);
    w.push(["info","Afegeix la mantega freda però mal·leable, a daus, quan la massa ja faci vel. La massa no ha de passar de 26 °C."]);
    return w;
  },
  tl:{mode:"h",startLabel:"Comences (dia i hora)",defTime:"18:00"},
  timeline:(s,C)=>{
    const o=C.m;const ev=[];let t=0;
    if(s.p.tz&&C.tz){ev.push([0,`Tangzhong: cou ${nf(C.tz[0],0)} g de farina amb ${nf(C.tz[1],0)} g de llet fins que espesseixi (65 °C). Refreda'l tapat.`]);t=.75;}
    ev.push([t,`Pasta-ho tot menys la mantega (llet a ${C.rows.find(r=>r[0]==="Llet a")[1]}), 8–10 min fins que faci vel.`]);
    ev.push([t+.25,"Afegeix la mantega a daus en 3 tandes; pasta fins que la massa sigui llisa, brillant i desenganxi del bol."]);
    const t0=t+.5;
    if(!s.p.cold){const tb=t0+o.bulk;ev.push([tb,"Desgasifica, divideix i estira cada coca a la safata amb paper. Si s'encongeix, deixa-la reposar 10 min i torna-hi."]);
      const te=tb+o.proof;ev.push([te-.5,"Encén el forn a 185 °C. Pinta amb ou i posa-hi la coberta."]);ev.push([te,`Al forn: ${C.oven.t}. Si es daura massa, tapa-la amb paper.`]);ev.push([te+C.oven.min/60,"Treu-la i deixa-la refredar a la safata 10 min."]);}
    else{const tin=t0+s.p.pre;ev.push([tin,"Aplana la massa en un recipient tapat i a la nevera."]);const tout=tin+s.p.fH;
      ev.push([tout,"Treu la massa freda, divideix i estira cada coca a la safata (en fred s'estira fàcil)."]);
      const te=tout+o.after+o.proof;ev.push([Math.max(tout+.25,te-.5),"Encén el forn a 185 °C. Pinta amb ou i posa-hi la coberta."]);ev.push([te,`Al forn: ${C.oven.t}.`]);ev.push([te+C.oven.min/60,"Treu-la i deixa-la refredar 10 min a la safata."]);}
    return {ev,tail:[["Conservació","2–3 dies tapada amb film. Es congela a trossos; descongelada, 3 min al forn."]]};
  },
  loadNote:(s,C)=>`hidratació efectiva ${nf(hyd(s),0)} % · ${nf(C.dough,0)} g`,
  pdfTaste:["Crosta","Molla","Flonjor","Gust"],
  how:["Tots els ingredients freds de la nevera excepte la mantega, que ha de ser freda però que es doblegui sense trencar-se.","Pasta primer sense la mantega fins que la massa faci vel; després incorpora-la a poc a poc. Amb amassadora, velocitat mitjana.","Si la massa es greixa o s'escalfa per sobre de 26 °C, posa-la 15 min a la nevera i continua.","Per estirar-la, unta't les mans amb oli; fes els forats típics amb els dits abans de posar-hi la coberta.","Forn a 185 °C, a mitja alçada. És cuita quan és ben daurada per sota i fa 92 °C a dins."],
  def:"classica",
  profiles:{
    classica:{name:"Clàssica amb sucre i pinyons",desc:"Mantega 35%, nevera 12 h, crosta de sucre",d:{farina:100,llet:30,ou:30,rovell:6,mantega:35,sucre:16,sal:1.8,llevat:3,llimona:.6,sucrecob:8,pinyons:6,pintar:5},p:{cold:true,fH:12,pre:.75}},
    nuvol:{name:"Núvol (extra flonja)",desc:"Tangzhong 6%, nata i llet en pols",d:{farina:100,llet:30,nata:10,ou:25,rovell:8,mantega:30,sucre:15,lletpols:4,sal:1.8,llevat:3.2,vainilla:.6,perlat:6,pintar:5},p:{tz:true,tzPct:6,cold:true,fH:12}},
    crema:{name:"De crema",desc:"Línies de crema pastissera i ametlla",d:{farina:100,llet:30,ou:30,mantega:30,sucre:14,sal:1.8,llevat:3.2,llimona:.6,crema:35,ametlla:6,pintar:5},p:{cold:true,fH:12}},
    santjoan:{name:"Sant Joan",desc:"Anís, fruita confitada i pinyons",d:{farina:100,llet:25,ou:35,mantega:35,sucre:18,sal:1.8,llevat:3.5,llimona:.6,anis:3,crema:20,fruita:15,pinyons:6,sucrecob:6,pintar:5},p:{cold:true,fH:12}},
    rapida:{name:"Del mateix dia",desc:"Sense nevera, en ≈4 h",d:{farina:100,llet:30,ou:30,mantega:32,sucre:15,sal:1.8,llevat:4.5,llimona:.6,sucrecob:8,pinyons:6,pintar:5},p:{cold:false,tz:true,tzPct:5,tgt:4}}
  }
};
window.PAGE={key:"coca-brioix",title:"Coca de brioix",titleShort:"COCA DE BRIOIX",where:{S:"Súper",B:"Botiga de pastisseria",C:"De casa"},ing:ING,tabOrd:["coca"],recipes:{coca:R},
  pdf:{INK:[34,28,22],MUT:[91,81,70],ACC:[163,64,26],LN:[226,216,202],BAR:[208,138,60],RED:[168,37,27]}};
})();
