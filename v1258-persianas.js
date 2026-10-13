/* === V12.5.9 • SKU AUTOMÁTICO + ESTOQUE DE PERSIANAS + MOTOR REQUINTE === */
(function(){
  const MODELS=['ROLO SEM BANDO','ROLO COM BANDO','ROMANA','HORIZONTAL 25MM','STRIPE SEM BANDO','STRIPE COM BANDO'];
  const BANDO_COLORS=['BRANCO','PRETO','CINZA','MARFIM','MARROM'];
  const REQ=[
    {n:2,c:'SCREEN DOHA 3%',colors:['WHITE','GREY'],max:2.95,price:{'ROLO SEM BANDO':123,'ROLO COM BANDO':148,'ROMANA':168}},
    {n:3,c:'SCREEN DH 5%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':130,'ROLO COM BANDO':150,'ROMANA':162}},
    {n:4,c:'SCREEN DH 3%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':138,'ROLO COM BANDO':159,'ROMANA':169}},
    {n:5,c:'SCREEN DH 1%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':152,'ROLO COM BANDO':169}},
    {n:6,c:'SCREEN ORION LIGHT 5%',colors:['WHITE','BEIGE','IVORY'],max:2.50,price:{'ROLO SEM BANDO':112.32,'ROLO COM BANDO':140.40,'ROMANA':155}},
    {n:7,c:'SCREEN ORION 5%',colors:['BOURBON','ASH MESCLA','IVORY MESCLA','GREY MESCLA'],max:2.50,price:{'ROLO SEM BANDO':120,'ROLO COM BANDO':146.50,'ROMANA':161.50}},
    {n:8,c:'SCREEN ORION 3%',colors:['BOURBON','IVORY','ASH','MUSHROOM','BROWN'],max:2.50,price:{'ROLO SEM BANDO':126,'ROLO COM BANDO':149.50,'ROMANA':169}},
    {n:9,c:'SCREEN ORION 1%',colors:['IVORY DUO','TITANIO DUO'],max:2.50,price:{'ROLO SEM BANDO':149,'ROLO COM BANDO':173}},
    {n:10,c:'SCREEN ORION 0,5%',colors:['WHITE','TITANIO','BLACK','GREY MESCLA','ASH MESCLA'],max:2.50,price:{'ROLO SEM BANDO':142,'ROLO COM BANDO':165}},
    {n:11,c:'STRIPE',colors:['RAMI PALHA','PRETO','BRANCO','CINZA'],max:2.20,price:{'STRIPE SEM BANDO':166.40,'STRIPE COM BANDO':190.32}},
    {n:12,c:'MADRID (PRESTIGE) BLACK OUT',colors:['WHITE NEVE','WHITE','CREAM','SANDO','GREY'],max:1.95,price:{'ROLO SEM BANDO':151.84,'ROLO COM BANDO':177.68,'ROMANA':200.41}},
    {n:13,c:'TJ 2606 BK',colors:['NATURAL'],max:1.95,price:{'ROLO SEM BANDO':159.12,'ROLO COM BANDO':195.31,'ROMANA':197.96}},
    {n:14,c:'DUNA BLACKOUT',colors:['WHITE','ICE','NATURAL','IVORY','BROWN'],max:2.35,price:{'ROLO SEM BANDO':146.80,'ROLO COM BANDO':170.35,'ROMANA':190.79}},
    {n:15,c:'NÁPOLES BLACK-OUT',colors:['TODAS AS CORES'],max:2.35,price:{'ROLO SEM BANDO':153.71,'ROLO COM BANDO':180.44,'ROMANA':192.50}},
    {n:16,c:'VANCOUVER BLACK-OUT',colors:['BRANCO','BEGE','CINZA','CHUMBO','PRETO'],max:2.45,price:{'ROLO SEM BANDO':145.60,'ROLO COM BANDO':172.64,'ROMANA':182}},
    {n:17,c:'TRANSLÚCIDO AM 2861',colors:['NATURAL','BRANCO'],max:1.95,price:{'ROLO SEM BANDO':128.70,'ROLO COM BANDO':148.98,'ROMANA':164.48}}
  ];
  const PH25=[
    [1,'LISA',145.95],[2,'METALIZADA',149.10],[3,'DUPLA FACE',171.15],[4,'LISA SEM FURO APARENTE',181.65],[5,'METALIZADO SEM FURO APARENTE',189.00],[6,'TEXTURIZADO',199.50],[7,'DUPLA FACE SEM FURO APARENTE',207.90],[8,'TEXTURIZADO SEM FURO APARENTE',233.10],[9,'PERFURADA',221.55]
  ];
  // V12.8.1: catálogo AMORIM fornecido pela Nova Imagem; tabela por m².
  // Os códigos agrupados permanecem como uma opção textual e não se presumem cores individuais.
  const AMORIM_ROLO=`1|SCREEN 1%|0001, 0005 e 0006, 1010, 1030 e 1031|3|108.29
3|SCREEN 3%|3001,3002,3008,3017,3060 e 3061|3|102.44
4|SCREEN 3%|3009 a 3011,3018 e 3019|3|130.78
5|SCREEN 3%|3012,3013|3|124.61
6|SCREEN 3%|3014 e 3015|3|140.60
8|SCREEN 5%|3070 a 3076,3078,3079|3|92.69
9|SCREEN 5%|3096,3097 e 3098|2.5|92.69
10|SCREEN RÚSTICO 3%|3150 e 3151|3|142.42
11|SCREEN RÚSTICO 3%|3155|3|156.72
13|SCREEN RÚSTICO 5%|3159,3160,3161,3162 e 3163|2.5|135.98
14|SCREEN REFLEX|3121,3122 e 3123|3|166.53
15|SCREEN BK|3200,3201 e 3203|2.5|149.96
16|IBIZA|3350,3351 e 3353|2.6|99.78
18|BLACKOUT PINPOINT|0180 a 0183 e 0186 a 0190 - LARGURA ESPECIAL 2,5|2.5|96.40
19|BLACKOUT PINPOINT|0180 a 0183 e 0186, 0187 e 0190 - LARGURA ESPECIAL 3|3|99.32
21|BLACKOUT PINPOINT|0180 a 0183,0186,0187 e 0190|2|90.94
22|REQUINTE BK|0088|2|114.27
23|REQUINTE BK|0101,0102,3042,3044,7517 a 7523|3|88.53
24|REQUINTE BK|0103|2.5|88.53
25|REQUINTE BK|0105,7511 a 7516|3|105.50
26|REQUINTE BK|0106 e 0107|2.4|105.50
27|REQUINTE BK|3038|3|101.27
28|REQUINTE BK|3037|3|101.27
29|REQUINTE BK|3040|2.8|135.01
30|REQUINTE BK|3039|3|135.01
31|REQUINTE BK|3043|2.5|122.27
32|REQUINTE BK|3041|2.5|105.50
33|REQUINTE BK|0090,0096,7500,7501,7504 e 7508|2.8|114.34
34|OXFORD BLACKOUT|0410,0411 e 0414|3|108.03
35|FLORENÇA|0356|2|97.18
36|RUSTIC|0053|2|114.86
37|ELEGANCY|0162|2|82.55
38|ELEGANCY|0161|3|82.55
39|ELEGANCY|0126|2.5|75.99
40|ELEGANCY|0128|2.5|75.99
41|ELEGANCY|0170,0177|3|82.55
42|ELEGANCY|0171 e 0178|2.5|82.55
43|VENEZA|0076 e 0077|2.5|82.10
45|DUBAI|0221 e 0227|2.6|156.78
46|MANHATTAN|0485 a 0489|2.8|96.92
47|SEVILHA|3354,3355,3356,3357,3358 e 3361|2.5|74.36
48|LISBOA|3380,3381,3382,3383,3384,3385,3386|2.8|74.36
49|BARCELONA|3390,3391,3392,3393,3394|2.8|96.92
50|FINESSE BK|6500 a 6808|3|135.07
51|TRANCOSO|8800 a 8804|3|81.45
52|CARAÍVA BK|8900 a 8904|3|112.78
53|CAMBURI BK|9200 a 9209|3|112.78
54|MARAGOGI BK|7600 a 7604|2.8|146.64
55|IPANEMA|7800 a 7804|2.8|103.48
56|NORONHA|8600 a 8606|2.8|103.48
57|LEBLON|8200 a 8205|2.8|103.48`;
  const AMORIM_ROMANA=`1|SCREEN 1%|0001,0005 e 0006,1010,1030 e 1031|3|211
2|SCREEN FIBER GLASS 1%|6001|3|304.80
3|SCREEN 3%|3001,3002,3008,3017,3060 e 3061|3|190.90
4|SCREEN 3%|3009 a 3011,3018 e 3019|3|204.40
5|SCREEN 3%|3012 e 3013|3|194.60
6|SCREEN 3%|3014 e 3015|3|213.40
7|SCREEN FIBER GLASS 3%|6101|3|268.60
8|SCREEN 5%|3070 a 3076,3078 e 3079|3|178.20
9|SCREEN 5%|3096,3097 e 3098|2.5|178.20
10|SCREEN FIBER GLASS 5%|6202|3|250.70
11|SCREEN RÚSTICO 3%|3150 e 3151|3|205.30
12|SCREEN RÚSTICO 3%|3159,3160,3161,3162 e 3163|2.5|202.40
13|SCREEN RÚSTICO 5%|3155|3|225.70
14|SCREEN REFLEX|3121,3122 e 3123|3|275.00
15|SCREEN BK|3200,3201 e 3203|2.5|283.10
16|IBIZA|3350,3351 e 3353|2.6|202.50
18|BLACKOUT PINPOINT|0180 a 0183 e 0186 a 0190 - LARGURA ESPECIAL 2,5|2.5|187.80
19|BLACKOUT PINPOINT|0180 a 0183 e 0186,0187 e 0190 - LARGURA ESPECIAL 3|3|193.60
21|BLACKOUT PINPOINT|0180 a 0183,0186,0187 e 0190|2|177.20
22|REQUINTE BK|0088|2|212.80
23|REQUINTE BK|0101,0102,3042,3044,7517 a 7523|3|172.50
24|REQUINTE BK|0103|2.5|172.50
25|REQUINTE BK|0105,7511 a 7516|3|174.40
26|REQUINTE BK|0106 e 0107|2.4|174.40
27|REQUINTE BK|3040|2.8|218.50
28|REQUINTE BK|3037,3038 e 3039|3|218.50
29|REQUINTE BK|3043|2.5|214.50
30|REQUINTE BK|3041|2.5|174.40
32|REQUINTE BK|7500 e 7501|2.8|212.80
33|REQUINTE BK|0090,0096,7504 e 7508|2.8|181.10
34|OXFORD BLACKOUT|0410,0411 e 0414|3|210.50
35|FLORENÇA|0356|2|161.50
36|RUSTIC|0053|2|185.70
37|ELEGANCY|0162|2|144.80
38|ELEGANCY|0161|3|144.80
39|ELEGANCY|0126|2.5|133.30
40|ELEGANCY|0128|2.5|133.30
41|ELEGANCY|0170,0177|3|144.80
42|ELEGANCY|0171 e 0178|2.5|144.80
43|VENEZA|0060|2.5|172.30
44|VENEZA|0076 e 0077|2.5|144.00
45|DUBAI|0221 e 0227|2.6|229.60
46|MANHATTAN|0485 a 0490|2.8|174.50
47|SEVILHA|3354,3355,3356,3357,3358 e 3361|2.5|144.00
48|FINESSE BK|6500 a 6808|3|218.60
49|TRANCOSO|8800 a 8804 - LANÇAMENTOS|3|150.20
50|CARAÍVA BK|8900 a 8904 - LANÇAMENTOS|3|208.20
51|CAMBURI BK|9200 a 9209 - LANÇAMENTOS|3|208.20
52|IPANEMA|7800 a 7804 - LANÇAMENTOS|2.8|191.00
53|NORONHA|8600 a 8606 - LANÇAMENTOS|2.8|191.00
54|LEBLON|8200 a 8205 - LANÇAMENTOS|2.8|191.00`;
  const AMORIM_BANDOS=[['SEM BANDÔ / BARRA PADRÃO',0],['BANDÔ CONJUGADO',106.60],['BANDÔ FLAT',73.74],['BANDÔ FLAT REVESTIDO',97.92],['BANDÔ CURVADO 11 CM',32.46],['BANDÔ BOX 70',83.04],['BANDÔ BOX 90',97.92],['BANDÔ BOX GRANDE',205.14],['BANDÔ SEMI BOX',143.58],['BARRA NIVELADORA',10.56],['BARRA NIVELADORA LARGA',13.74],['BARRA NIVELADORA GRANDE',88.98]];
  const AMORIM_TUBOS=[{n:'32 MM',min:.4,max:1.8,h:3,area:3.5,b:['BANDÔ CONJUGADO','BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BANDÔ BOX 90','BANDÔ BOX 70','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']},{n:'38 MM',min:.4,max:2.4,h:3.5,area:5.2,b:['BANDÔ CONJUGADO','BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BANDÔ BOX 90','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']},{n:'38 MM RED. PESO MOLA',min:.85,max:2.4,h:4,area:8.2,b:['BANDÔ CONJUGADO','BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']},{n:'AUTO STOP',min:.85,max:1.8,h:3,area:3.5,b:['BANDÔ CONJUGADO','BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']},{n:'53 MM',min:.4,max:3,h:4.5,area:5.2,b:['BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BANDÔ BOX GRANDE','BANDÔ SEMI BOX','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']},{n:'53 MM RED. PESO MOLA',min:.9,max:3,h:6,area:12,b:['BANDÔ FLAT','BANDÔ FLAT REVESTIDO','BANDÔ BOX GRANDE','BANDÔ SEMI BOX','BARRA NIVELADORA','BANDÔ CURVADO 11 CM']}];
  function amorimSeed(){cfg();const list=db.settings.blindInventory;const all=new Set(list.map(x=>x.seedKey));for(const [model,lines] of [['ROLO',AMORIM_ROLO],['ROMANA',AMORIM_ROMANA]])for(const line of lines.split('\n')){const [no,collection,color,mx,table]=line.split('|');const key=`AMORIM-${model}-${no}`;if(all.has(key))continue;list.push({id:uid(),seedKey:key,sku:`AM-${model==='ROLO'?'R':'M'}-${no.padStart(3,'0')}`,supplier:'AMORIM',model,collection,color,maxWidthM:Number(mx),cost:Number(table)*.70,amorimTable:Number(table),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:Number(no)});} }
  const AMORIM_ALERT='NECESSITA SER VALIDADO JUNTO À FÁBRICA ANTES DE CONFIRMAR O VALOR!';
  function cfg(){
    db.settings=db.settings||{};
    db.settings.blindsV1258=db.settings.blindsV1258||{minArea:1.2,cashDiscount:5,p10Divider:.82,wifiMotorCost:1015,control4Cost:185,largeWidthPct:10,reinforcedPct:10,bandMaxHeightCm:440};
    db.settings.blindInventory=db.settings.blindInventory||[];
    db.settings.deletedBlindSeedKeys=db.settings.deletedBlindSeedKeys||[];
    return db.settings.blindsV1258;
  }
  function seed(){
    cfg();
    const inv=db.settings.blindInventory;
    const deleted=new Set(db.settings.deletedBlindSeedKeys||[]);
    const keys=new Set(inv.map(x=>x.seedKey).filter(Boolean));
    for(const r of REQ){for(const [model,cost] of Object.entries(r.price)){for(const color of r.colors){
      const k=`REQ-${r.n}-${model}-${color}`; if(keys.has(k)||deleted.has(k))continue;
      inv.push({id:uid(),seedKey:k,sku:`PR-${String(r.n).padStart(2,'0')}-${model.replace(/[^A-Z]/g,'').slice(0,5)}-${color.replace(/[^A-Z0-9]/g,'').slice(0,6)}`,supplier:'REQUINTE',model,collection:r.c,color,maxWidthM:r.max,maxHeightCm:model.includes('COM BANDO')?440:0,cost:Number(cost),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:r.n});
    }}}
    for(const [n,collection,cost] of PH25){const k=`PH25-${n}`;if(keys.has(k)||deleted.has(k))continue;inv.push({id:uid(),seedKey:k,sku:`PH25-${String(n).padStart(2,'0')}`,supplier:'REQUINTE',model:'HORIZONTAL 25MM',collection,color:'CÓDIGO DIGITÁVEL',maxWidthM:0,maxHeightCm:0,cost:Number(cost),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:n});}
  }
  function inv(){seed();amorimSeed();return db.settings.blindInventory||[]}
  function available(){return inv().filter(x=>x.active!==false&&(x.stockMode==='ILIMITADO'||Number(x.qty||0)>0));}
  function itemById(id){return inv().find(x=>String(x.id)===String(id));}
  function nextBlindSku(){
    const used=new Set(inv().map(x=>String(x.sku||'').toUpperCase()).filter(Boolean));
    let max=0;
    for(const sku of used){const m=sku.match(/^PER-(\d{4,})$/);if(m)max=Math.max(max,Number(m[1]||0));}
    let n=max+1,sku;
    do{sku=`PER-${String(n++).padStart(6,'0')}`;}while(used.has(sku));
    return sku;
  }
  function p4PerM2(item){return Number(item.cost||0)*(1+Number(item.markup??100)/100)}
  function calc(item,wCm,hCm,drive){
    const c=cfg(),w=Number(wCm)/100,h=Number(hCm)/100,area=w*h,billArea=Math.max(Number(c.minArea||1.2),w*Math.max(1,h)); if(!(w>0&&h>0))return null;
    if(Number(item.maxWidthM||0)>0&&w>Number(item.maxWidthM)+1e-9&&item.supplier!=='AMORIM')return {error:`Largura máxima desta coleção: ${Number(item.maxWidthM).toFixed(2).replace('.',',')} m.`};
    if(item.model.includes('COM BANDO')&&Number(c.bandMaxHeightCm||440)>0&&Number(hCm)>Number(c.bandMaxHeightCm))return {error:`Altura máxima para persiana com bandô: ${Number(c.bandMaxHeightCm)} cm.`};
    const notes=[];let baseCost=billArea*Number(item.cost||0);
    if(w>2.5){baseCost*=1+Number(c.largeWidthPct||10)/100;notes.push('ACRÉSCIMO TUBO 50MM');}
    if(area>6){baseCost*=1+Number(c.reinforcedPct||10)/100;notes.push('TUBO REFORÇADO');}
    let motorCost=0;if(drive==='ELETRÔNICO'){motorCost=Number(c.wifiMotorCost||1015)+Number(c.control4Cost||185);notes.push('ACIONAMENTO ELETRÔNICO');}
    const totalCost=baseCost+motorCost,markup=Number(item.markup??100),p4=totalCost*(1+markup/100),cash=p4*(1-(item.supplier==='AMORIM'?8:Number(c.cashDiscount||5))/100),p10=cash/Number(c.p10Divider||.82);
    // Compatibilidade com o ERP: a coluna 18x continua seguindo os parâmetros gerais do Nova Imagem.
    const p18=p4*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100);
    const fabricP4=p4PerM2(item),fabricCash=fabricP4*(1-(item.supplier==='AMORIM'?8:Number(c.cashDiscount||5))/100),fabricP10=fabricCash/Number(c.p10Divider||.82);
    return {area,billArea,baseCost,motorCost,totalCost,p4,cash,p10,p18,fabricP4,fabricCash,fabricP10,notes};
  }

  function blindWarnings(p,wCm,hCm,tubeName,bar){
    const a=[],w=wCm/100,h=hCm/100,t=AMORIM_TUBOS.find(t=>t.n===tubeName);
    if(p.maxWidthM&&w>p.maxWidthM)a.push(`Largura da coleção excedida: ${p.maxWidthM} m`);
    if(w&&h&&h>3*w)a.push('Altura superior a três vezes a largura: risco de instabilidade/canoamento');
    if(p.collection.includes('PINPOINT'))a.push('Blackout Pinpoint: conferir tonalidade entre larguras especiais');
    if(t&&p.model==='ROLO'){
      if(w<t.min||w>t.max)a.push(`Largura fora da capacidade do tubo ${t.n} (${t.min}–${t.max} m)`);
      if(h>t.h)a.push(`Altura acima do limite do tubo ${t.n}: ${t.h} m`);
      if(w*h>t.area)a.push(`Área excede o limite de ${t.area} m² do tubo ${t.n}`);
      if(bar!=='SEM BANDÔ / BARRA PADRÃO'&&!t.b.includes(bar))a.push(`Barra/bandô ${bar} não homologada para tubo ${t.n}`);
      if(t.n==='AUTO STOP'&&bar==='SEM BANDÔ / BARRA PADRÃO')a.push('Auto Stop exige bandô ou barra niveladora');
    }
    if(w*h>6)a.push('TUBO REFORÇADO — conferir acréscimo e fabricação com a Amorim');
    return a;
  }
  // ----- MENU / TELA DE ESTOQUE DE PERSIANAS -----
  if(!NAV.some(x=>x[0]==='blindInventory'))NAV.splice(NAV.findIndex(x=>x[0]==='inventory')+1,0,['blindInventory','ESTOQUE DE PERSIANAS','gestor']);
  const sg=NAV_GROUPS.find(x=>x.id==='stock');if(sg&&!sg.items.includes('blindInventory'))sg.items.splice(sg.items.indexOf('inventory')+1,0,'blindInventory');
  function ensureView(){
    if(document.getElementById('view-blindInventory'))return;
    const main=document.querySelector('.main');if(!main)return;
    const s=document.createElement('section');s.id='view-blindInventory';s.className='view';s.innerHTML=`<header class="topbar"><div><h1>Estoque de Persianas</h1><p>Modelos, coleções, cores, custos, markup, disponibilidade e estoque.</p></div><div class="actions"><button id="blindNewBtn" class="btn primary">+ NOVO ITEM</button></div></header><div id="blindInventorySummary" class="kpis" style="margin-bottom:14px"></div><div class="card"><div class="toolbar"><input id="blindInventorySearch" class="search" placeholder="Buscar modelo, coleção, cor ou SKU"><select id="blindInventoryModelFilter"><option value="">TODOS OS MODELOS</option></select></div><div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Modelo</th><th>Coleção</th><th>Cor</th><th>Larg. máx.</th><th>Estoque</th><th>Custo/m²</th><th>Markup</th><th>4x/m²</th><th>À vista/m²</th><th>10x/m²</th><th>Status</th><th>Ações</th></tr></thead><tbody id="blindInventoryTable"></tbody></table></div></div>`;main.insertBefore(s,document.getElementById('view-receivables')||null);
    document.getElementById('blindNewBtn').onclick=()=>openBlindItemEditor();document.getElementById('blindInventorySearch').oninput=renderBlindInventory;document.getElementById('blindInventoryModelFilter').onchange=renderBlindInventory;
  }
  window.renderBlindInventory=function(){
    ensureView();seed();const list=inv(),q=norm(document.getElementById('blindInventorySearch')?.value||''),mf=document.getElementById('blindInventoryModelFilter')?.value||'';
    const models=[...new Set(list.map(x=>x.model).filter(Boolean))].sort();const sel=document.getElementById('blindInventoryModelFilter');if(sel){const old=sel.value;sel.innerHTML='<option value="">TODOS OS MODELOS</option>'+models.map(x=>`<option ${old===x?'selected':''}>${esc(x)}</option>`).join('')}
    const rows=list.filter(x=>(!mf||x.model===mf)&&(!q||norm([x.sku,x.model,x.collection,x.color].join(' ')).includes(q))).sort((a,b)=>String(`${a.model} ${a.collection} ${a.color}`).localeCompare(String(`${b.model} ${b.collection} ${b.color}`),'pt-BR'));
    document.getElementById('blindInventorySummary').innerHTML=[['Itens cadastrados',list.length],['Disponíveis',available().length],['Estoque zerado',list.filter(x=>x.stockMode==='CONTROLADO'&&Number(x.qty||0)<=0).length],['Markup padrão','100%']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    document.getElementById('blindInventoryTable').innerHTML=rows.map(x=>{const p4=p4PerM2(x),ca=p4*(x.supplier==='AMORIM'?.92:.95),p10=ca/.82;return `<tr><td>${esc(x.sku||'-')}</td><td><strong>${esc(x.model||'-')}</strong></td><td>${esc(x.collection||'-')}</td><td>${esc(x.color||'-')}</td><td>${Number(x.maxWidthM||0)>0?Number(x.maxWidthM).toFixed(2)+' m':'—'}</td><td>${x.stockMode==='ILIMITADO'?'<span class="badge ok">ILIMITADO</span>':Number(x.qty||0)}</td><td>${money(x.cost||0)}</td><td>${Number(x.markup??100).toFixed(0)}%</td><td>${money(p4)}</td><td>${money(ca)}</td><td>${money(p10)}</td><td>${x.active===false?'<span class="badge warn">INATIVO</span>':'<span class="badge ok">ATIVO</span>'}</td><td><div class="actions"><button class="btn ghost" data-be="${x.id}">Editar</button><button class="btn secondary" data-bd="${x.id}">Duplicar</button><button class="btn danger" data-bx="${x.id}">Excluir</button></div></td></tr>`}).join('')||'<tr><td colspan="13">Nenhum item encontrado.</td></tr>';
    document.querySelectorAll('[data-be]').forEach(b=>b.onclick=()=>openBlindItemEditor(itemById(b.dataset.be)));
    document.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>duplicateBlindItem(b.dataset.bd));
    document.querySelectorAll('[data-bx]').forEach(b=>b.onclick=()=>deleteBlindItem(b.dataset.bx));
  };
  window.openBlindItemEditor=function(p=null){
    if(!isGestor())return alert('Somente o gestor pode alterar o estoque de persianas.');
    const autoSku=p?.sku||nextBlindSku();
    openModal(`<h2>${p?'Editar':'Novo'} item • Estoque de Persianas</h2><div class="grid two"><label class="field">SKU <span class="muted">(automático)</span><input id="biSku" value="${esc(autoSku)}" readonly style="background:#f2f5f4;cursor:not-allowed"></label><label class="field">Fornecedor<input id="biSupplier" value="${esc(p?.supplier||'REQUINTE')}"></label><label class="field">Modelo<input id="biModel" list="biModels" value="${esc(p?.model||'ROLO SEM BANDO')}"><datalist id="biModels">${MODELS.map(x=>`<option value="${x}">`).join('')}</datalist></label><label class="field">Coleção<input id="biCollection" value="${esc(p?.collection||'')}"></label><label class="field">Cor<input id="biColor" value="${esc(p?.color||'')}"></label><label class="field">Largura máxima (m)<input id="biMaxW" type="number" step="0.01" min="0" value="${Number(p?.maxWidthM||0)}"></label><label class="field">Altura máxima (cm)<input id="biMaxH" type="number" step="1" min="0" value="${Number(p?.maxHeightCm||0)}"></label><label class="field">Custo por m²<input id="biCost" type="number" step="0.01" min="0" value="${Number(p?.cost||0)}"></label><label class="field">Markup (%)<input id="biMarkup" type="number" step="0.01" min="0" value="${Number(p?.markup??100)}"></label><label class="field">Controle de estoque<select id="biStockMode"><option value="ILIMITADO">ILIMITADO</option><option value="CONTROLADO">CONTROLADO</option></select></label><label class="field">Quantidade<input id="biQty" type="number" step="1" min="0" value="${Number(p?.qty||0)}"></label><label class="field">Status<select id="biActive"><option value="1">ATIVO</option><option value="0">INATIVO</option></select></label></div><div class="actions" style="margin-top:14px"><button id="biSave" class="btn primary">SALVAR</button></div>`);
    document.getElementById('biStockMode').value=p?.stockMode||'ILIMITADO';document.getElementById('biActive').value=p?.active===false?'0':'1';
    document.getElementById('biSave').onclick=()=>{const o=p||{id:uid()};Object.assign(o,{sku:p?.sku||document.getElementById('biSku').value.trim()||nextBlindSku(),supplier:document.getElementById('biSupplier').value.trim()||'REQUINTE',model:document.getElementById('biModel').value.trim().toUpperCase(),collection:document.getElementById('biCollection').value.trim().toUpperCase(),color:document.getElementById('biColor').value.trim().toUpperCase(),maxWidthM:Number(document.getElementById('biMaxW').value||0),maxHeightCm:Number(document.getElementById('biMaxH').value||0),cost:Number(document.getElementById('biCost').value||0),markup:Number(document.getElementById('biMarkup').value||100),stockMode:document.getElementById('biStockMode').value,qty:Number(document.getElementById('biQty').value||0),active:document.getElementById('biActive').value==='1',seedKey:p?.seedKey||''});if(!o.model||!o.collection||!o.color)return alert('Informe modelo, coleção e cor.');if(!p)inv().push(o);queueSave();closeModal();renderBlindInventory();};
  };
  window.duplicateBlindItem=function(id){const p=itemById(id);if(!p)return;const c=clone(p);c.id=uid();c.seedKey='';c.sku=nextBlindSku();c.collection=p.collection+' • CÓPIA';inv().push(c);queueSave();renderBlindInventory();openBlindItemEditor(c);};
  window.deleteBlindItem=function(id){const p=itemById(id);if(!p||!confirm(`Excluir ${p.model} • ${p.collection} • ${p.color}?`))return;if(p.seedKey){db.settings.deletedBlindSeedKeys=db.settings.deletedBlindSeedKeys||[];if(!db.settings.deletedBlindSeedKeys.includes(p.seedKey))db.settings.deletedBlindSeedKeys.push(p.seedKey)}db.settings.blindInventory=inv().filter(x=>String(x.id)!==String(id));queueSave();renderBlindInventory();};

  // ----- NOVO MOTOR +PERSIANA -----
  function bindBlindButton(){const old=document.getElementById('addBlindBtn');if(!old||old.dataset.v1258)return;const b=old.cloneNode(true);b.dataset.v1258='1';old.parentNode.replaceChild(b,old);b.onclick=openBlindV1258;}
  function blindOptions(items,field){return [...new Set(items.map(x=>x[field]).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join('')}
  window.openBlindV1258=function(){
    seed();amorimSeed();const items=available();if(!items.length)return alert('Não há persianas disponíveis no Estoque de Persianas.');
    openModal(`<h2>+ Persiana</h2><p class="muted">Amorim • valores sujeitos à validação com a fábrica.</p><label class="field">MODELO DA PERSIANA<select id="bpFirst"><option value="">SELECIONE</option><option value="ROLO">ROLÔ</option><option value="ROMANA">ROMANA</option></select></label><div id="bpRest" style="display:none"><div class="grid two"><label class="field">Ambiente<input id="bpEnv" placeholder="Ex.: SALA"></label><label class="field">Modelo<select id="bpModel"></select></label><label class="field">Coleção<select id="bpCollection"></select></label><label class="field">Cor<select id="bpColor"></select></label><label class="field" id="bpColorCodeWrap" style="display:none">Código da cor<input id="bpColorCode" placeholder="Digite o código da cor"></label><label class="field">Largura (cm)<input id="bpW" type="number" min="1"></label><label class="field">Altura (cm)<input id="bpH" type="number" min="1"></label><label class="field">Quantidade<input id="bpQty" type="number" min="1" step="1" value="1"></label><label class="field">Lado do comando<select id="bpCmd"><option>DIREITO</option><option>ESQUERDO</option><option>SEM COMANDO</option></select></label><label class="field">Altura do comando (cm)<input id="bpCmdH" type="number" min="0" value="120"></label><label class="field" id="bpBandoWrap" style="display:none">Cor do bandô<select id="bpBando">${BANDO_COLORS.map(x=>`<option>${x}</option>`).join('')}</select></label><label class="field">Acionamento<select id="bpDrive"><option value="MANUAL">MANUAL</option><option value="ELETRÔNICO">ELETRÔNICO</option></select></label></div><div id="bpAmorimOptions" class="grid two"><label class="field" id="bpTubeWrap">TUBO / MECANISMO<select id="bpTube">${AMORIM_TUBOS.map(t=>`<option>${t.n}</option>`).join('')}</select></label><label class="field" id="bpBarWrap">MODELO DA BARRA / BANDÔ<select id="bpBar">${AMORIM_BANDOS.map(t=>`<option>${t[0]}</option>`).join('')}</select></label><label class="field">CONJUNTO<select id="bpSet"><option value="1">SIMPLES</option><option value="2">DUPLEX (+ R$ 50)</option><option value="3">TRIPLEX (+ R$ 100)</option><option value="4">QUADRIPLEX (+ R$ 150)</option></select></label><label class="field">COR DOS ACESSÓRIOS<select id="bpAccColor">${['BRANCO','MARFIM','PRETO','CINZA','BRONZE','MARROM'].map(t=>`<option>${t}</option>`).join('')}</select></label></div><div id="bpPreview" class="notice" style="margin-top:14px">Informe as medidas para calcular.</div><div class="actions" style="margin-top:14px"><button id="bpSave" class="btn primary">ADICIONAR PERSIANA AO ORÇAMENTO</button></div></div>`);
    const model=document.getElementById('bpModel'),collection=document.getElementById('bpCollection'),color=document.getElementById('bpColor');
    function modelItems(){return items.filter(x=>x.supplier==='AMORIM'&&x.model===model.value)}function collectionItems(){return modelItems().filter(x=>x.collection===collection.value)}
    function fillModels(){model.innerHTML=`<option>${document.getElementById('bpFirst').value}</option>`;fillCollections()};document.getElementById('bpFirst').onchange=()=>{document.getElementById('bpRest').style.display=document.getElementById('bpFirst').value?'block':'none';document.getElementById('bpAmorimOptions').style.display='grid';document.getElementById('bpTubeWrap').style.display=document.getElementById('bpFirst').value==='ROLO'?'block':'none';document.getElementById('bpBarWrap').style.display=document.getElementById('bpFirst').value==='ROLO'?'block':'none';if(document.getElementById('bpFirst').value)fillModels()};
    function fillCollections(){const a=modelItems();collection.innerHTML=blindOptions(a,'collection');fillColors()}
    function fillColors(){const a=collectionItems();color.innerHTML=blindOptions(a,'color');refresh()}
    function selected(){return collectionItems().find(x=>x.color===color.value)||collectionItems()[0]}
    function refresh(){const p=selected();if(!p)return;const code=p.model==='HORIZONTAL 25MM'||String(p.color).includes('DIGITÁVEL');document.getElementById('bpColorCodeWrap').style.display=code?'block':'none';const hasBando=p.model.includes('COM BANDO');document.getElementById('bpBandoWrap').style.display=hasBando?'block':'none';const r=calc(p,document.getElementById('bpW').value,document.getElementById('bpH').value,document.getElementById('bpDrive').value);if(!r){document.getElementById('bpPreview').innerHTML=`Custo ${money(p.cost)}/m² • Markup ${Number(p.markup??100)}% • Largura máxima ${p.maxWidthM?Number(p.maxWidthM).toFixed(2)+' m':'conforme fabricante'}`;return;}if(r.error){document.getElementById('bpPreview').innerHTML=`<strong style="color:#a33">${esc(r.error)}</strong>`;return;}document.getElementById('bpPreview').innerHTML=`<strong>Área real:</strong> ${r.area.toFixed(2)} m² • <strong>Área de cálculo:</strong> ${r.billArea.toFixed(2)} m²<br><strong>Valor/m²:</strong> 10x ${money(r.fabricP10)} • 4x ${money(r.fabricP4)} • à vista ${money(r.fabricCash)}<br><strong>Total:</strong> 10x ${money(r.p10)} • 4x ${money(r.p4)} • à vista ${money(r.cash)}${r.notes.length?`<br><strong>${esc(r.notes.join(' • '))}</strong>`:''}`;const warnings=blindWarnings(p,Number(document.getElementById('bpW').value),Number(document.getElementById('bpH').value),document.getElementById('bpTube').value,document.getElementById('bpBar').value);document.getElementById('bpPreview').innerHTML+=`<hr><strong style="color:#9b4e00">${AMORIM_ALERT}</strong>${warnings.map(x=>`<div style="color:#aa3600">⚠ ${esc(x)}</div>`).join('')}`;}
    model.onchange=fillCollections;collection.onchange=fillColors;color.onchange=refresh;['bpW','bpH','bpDrive','bpTube','bpBar','bpSet'].forEach(id=>document.getElementById(id).oninput=refresh);fillModels();
    document.getElementById('bpSave').onclick=()=>{const p=selected(),w=Number(document.getElementById('bpW').value),h=Number(document.getElementById('bpH').value),qty=Math.max(1,Number(document.getElementById('bpQty').value||1)),drive=document.getElementById('bpDrive').value,r=calc(p,w,h,drive);if(!p||!r)return alert('Informe produto e medidas.');if(r.error)return alert(r.error);const code=(document.getElementById('bpColorCode').value||'').trim();if((p.model==='HORIZONTAL 25MM'||String(p.color).includes('DIGITÁVEL'))&&!code)return alert('Informe o código da cor.');const blindColor=code||p.color,bando=p.model==='ROLO'?document.getElementById('bpBar').value:'';const tube=p.model==='ROLO'?document.getElementById('bpTube').value:'';const setQty=Number(document.getElementById('bpSet').value);const surcharge=(setQty-1)*50;const warnings=blindWarnings(p,w,h,tube,bando);draft.blinds=draft.blinds||[];draft.blinds.push({id:uid(),inventoryId:p.id,environment:document.getElementById('bpEnv').value.trim()||'PERSIANA',blindModel:p.model,collection:p.collection,model:`${p.model} • ${p.collection}`,color:blindColor,bando,tube,setQty,accessoryColor:document.getElementById('bpAccColor').value,factoryValidationPending:true,validationAlert:AMORIM_ALERT,technicalWarnings:warnings,width:w,height:h,qty,area:r.area,billArea:r.billArea,commandSide:`${document.getElementById('bpCmd').value} • ALT. ${Number(document.getElementById('bpCmdH').value||0)} CM`,commandHeight:Number(document.getElementById('bpCmdH').value||0),drive,notes:r.notes,p10:r.p10+surcharge*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100),p18:r.p18+surcharge*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100),p4:r.p4+surcharge,cash:r.cash+surcharge*.92,perM2P10:r.fabricP10,perM2P4:r.fabricP4,perM2Cash:r.fabricCash,cost:Number(p.cost||0),markup:Number(p.markup??100),sourceSku:p.sku});closeModal();renderQuote();};
  };

  // Recarrega dados e semeia defaults sem apagar itens editados/criados.
  const oldLoad=loadCloud;loadCloud=async function(){await oldLoad();seed();amorimSeed();if(isGestor()){queueSave();await v1281WaveStockOnce();}};
  const oldSet=setView;setView=function(id){oldSet(id);if(id==='blindInventory')renderBlindInventory();};
  ensureView();seed();bindBlindButton();setTimeout(()=>{renderNav();bindBlindButton();},50);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensureView();seed();renderNav();bindBlindButton();},250));
})();
