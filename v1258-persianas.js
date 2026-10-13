
/* === V12.8.3 • PERSIANAS AMORIM + HORIZONTAL 25MM REQUINTE === */
(function(){
  const MODELS=['ROLÔ','ROMANA','HORIZONTAL 25MM'];
  const ACCESSORY_COLORS=['BRANCO','MARFIM','PRETO','CINZA','BRONZE','MARROM'];
  const CONJUNTOS={SIMPLES:0,DUPLEX:50,TRIPLEX:100,QUADRIPLEX:150};
  const VALIDATION_TEXT='NECESSITA SER VALIDADO JUNTO À FÁBRICA ANTES DE CONFIRMAR O VALOR!';

  const H25=[
    {n:1,collection:'RQ - LISA',price:145.95},
    {n:2,collection:'RQ - METALIZADA',price:149.10},
    {n:3,collection:'RQ - DUPLA FACE',price:171.15},
    {n:4,collection:'RQ - LISA SEM FURO APARENTE',price:181.65},
    {n:5,collection:'RQ - METALIZADO SEM FURO APARENTE',price:189.00},
    {n:6,collection:'RQ - TEXTURIZADO',price:199.50},
    {n:7,collection:'RQ - DUPLA FACE SEM FURO APARENTE',price:207.90},
    {n:8,collection:'RQ - TEXTURIZADO SEM FURO APARENTE',price:233.10},
    {n:9,collection:'RQ - PERFURADA',price:221.55}
  ];

  const ROLO=[
    {collection:'SCREEN 1%', color:'0001, 0005 e 0006, 1010, 1030 e 1031', max:3.00, amorim:108.29},
    {collection:'SCREEN 3%', color:'3001, 3002, 3008, 3017, 3060 e 3061', max:3.00, amorim:102.44},
    {collection:'SCREEN 3%', color:'3009 ao 3011, 3018 e 3019', max:3.00, amorim:130.78},
    {collection:'SCREEN 3%', color:'3012, 3013', max:3.00, amorim:124.61},
    {collection:'SCREEN 3%', color:'3014 e 3015', max:3.00, amorim:140.60},
    {collection:'SCREEN 5%', color:'3070 ao 3076, 3078, 3079', max:3.00, amorim:92.69},
    {collection:'SCREEN 5%', color:'3096, 3097 e 3098', max:2.50, amorim:92.69},
    {collection:'SCREEN RÚSTICO 3%', color:'3150 e 3151', max:3.00, amorim:142.42},
    {collection:'SCREEN RÚSTICO 5%', color:'3155', max:3.00, amorim:156.72},
    {collection:'SCREEN RÚSTICO 5%', color:'3159, 3160, 3161, 3162 e 3163', max:2.50, amorim:135.98},
    {collection:'SCREEN REFLEX', color:'3121 e 3122 e 3123', max:3.00, amorim:166.53},
    {collection:'SCREEN BK', color:'3200, 3201 e 3203', max:2.50, amorim:149.96},
    {collection:'IBIZA', color:'3350, 3351 e 3353', max:2.60, amorim:99.78},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186 ao 0190 - larg. especial 2,5', max:2.50, amorim:96.40},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186, 0187 e 0190 - larg. especial 3,0', max:3.00, amorim:99.32},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186, 0187 e 0190', max:2.00, amorim:90.94},
    {collection:'REQUINTE BK', color:'0088', max:2.00, amorim:114.27},
    {collection:'REQUINTE BK', color:'0101, 0102, 3042, 3044, 7517 ao 7523', max:3.00, amorim:88.53},
    {collection:'REQUINTE BK', color:'0103', max:2.50, amorim:88.53},
    {collection:'REQUINTE BK', color:'0105, 7511 ao 7516', max:3.00, amorim:105.50},
    {collection:'REQUINTE BK', color:'0106 e 0107', max:2.40, amorim:105.50},
    {collection:'REQUINTE BK', color:'3038', max:3.00, amorim:101.27},
    {collection:'REQUINTE BK', color:'3037', max:3.00, amorim:101.27},
    {collection:'REQUINTE BK', color:'3040', max:2.80, amorim:135.01},
    {collection:'REQUINTE BK', color:'3039', max:3.00, amorim:135.01},
    {collection:'REQUINTE BK', color:'3043', max:2.50, amorim:122.27},
    {collection:'REQUINTE BK', color:'3041', max:2.50, amorim:105.50},
    {collection:'REQUINTE BK', color:'0090, 0096, 7500, 7501, 7504 e 7508', max:2.80, amorim:114.34},
    {collection:'OXFORD BLACKOUT', color:'0410, 0411 e 0414', max:3.00, amorim:168.03},
    {collection:'FLORENÇA', color:'0356', max:2.00, amorim:97.18},
    {collection:'RUSTIC', color:'0053', max:2.00, amorim:114.86},
    {collection:'ELEGANCY', color:'0162', max:2.00, amorim:82.55},
    {collection:'ELEGANCY', color:'0161', max:3.00, amorim:82.55},
    {collection:'ELEGANCY', color:'0126', max:2.50, amorim:75.99},
    {collection:'ELEGANCY', color:'0128', max:2.50, amorim:75.99},
    {collection:'ELEGANCY', color:'0170, 0177', max:3.00, amorim:82.55},
    {collection:'ELEGANCY', color:'0171 e 0178', max:2.50, amorim:82.55},
    {collection:'VENEZA', color:'0076 e 0077', max:2.50, amorim:82.10},
    {collection:'DUBAI', color:'0221 e 0227', max:2.60, amorim:156.78},
    {collection:'MANHATTAN', color:'0485 ao 0489', max:2.80, amorim:96.92},
    {collection:'SEVILHA', color:'3354, 3355, 3356, 3357, 3358 e 3361', max:2.50, amorim:74.36},
    {collection:'LISBOA', color:'3380, 3381, 3382, 3383, 3384, 3385, 3386', max:2.80, amorim:74.36},
    {collection:'BARCELONA', color:'3390, 3391, 3392, 3393, 3394', max:2.80, amorim:96.92},
    {collection:'FINESSE BK', color:'6500 ao 6808', max:3.00, amorim:135.07},
    {collection:'TRONCOSO', color:'8800 ao 8804', max:3.00, amorim:81.45},
    {collection:'CARAÍVA BK', color:'8900 ao 8904', max:3.00, amorim:112.78},
    {collection:'CAMBURI BK', color:'9200 ao 9209', max:3.00, amorim:112.78},
    {collection:'MARAGOGI BK', color:'7600 ao 7604', max:2.80, amorim:146.64},
    {collection:'IPANEMA', color:'7800 ao 7804', max:2.80, amorim:103.48},
    {collection:'NORONHA', color:'8600 ao 8606', max:2.80, amorim:103.48},
    {collection:'LEBLON', color:'8200 ao 8205', max:2.80, amorim:103.48}
  ];

  const ROMANA=[
    {collection:'SCREEN 1%', color:'0001, 0005 e 0006, 1010, 1030 e 1031', max:3.00, amorim:211.00},
    {collection:'SCREEN FIBER GLASS 1%', color:'6001', max:3.00, amorim:304.80},
    {collection:'SCREEN 3%', color:'3001, 3002, 3008, 3017, 3060 e 3061', max:3.00, amorim:190.90},
    {collection:'SCREEN 3%', color:'3009 ao 3011, 3018 e 3019', max:3.00, amorim:204.40},
    {collection:'SCREEN 3%', color:'3012 e 3013', max:3.00, amorim:194.60},
    {collection:'SCREEN 3%', color:'3014, 3015', max:3.00, amorim:213.40},
    {collection:'SCREEN FIBER GLASS 3%', color:'6101', max:3.00, amorim:268.60},
    {collection:'SCREEN 5%', color:'3070 ao 3076, 3078 e 3079', max:3.00, amorim:178.20},
    {collection:'SCREEN 5%', color:'3096, 3097 e 3098', max:2.50, amorim:178.20},
    {collection:'SCREEN FIBER GLASS 5%', color:'6202', max:3.00, amorim:250.70},
    {collection:'SCREEN RÚSTICO 3%', color:'3150 e 3151', max:3.00, amorim:205.30},
    {collection:'SCREEN RÚSTICO 5%', color:'3159, 3160, 3161, 3162 e 3163', max:2.50, amorim:202.40},
    {collection:'SCREEN RÚSTICO 5%', color:'3155', max:3.00, amorim:225.70},
    {collection:'SCREEN REFLEX', color:'3121, 3122 e 3123', max:3.00, amorim:275.00},
    {collection:'SCREEN BK', color:'3200, 3201 e 3203', max:2.50, amorim:283.10},
    {collection:'IBIZA', color:'3350, 3351 e 3353', max:2.60, amorim:202.50},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186 ao 0190 - larg. especial 2,5', max:2.50, amorim:187.80},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186, 0187 e 0190 - larg. especial 3,0', max:3.00, amorim:193.60},
    {collection:'BLACKOUT PINPOINT', color:'0180 ao 0183 e 0186, 0187 e 0190', max:2.00, amorim:177.20},
    {collection:'REQUINTE BK', color:'0088', max:2.00, amorim:212.80},
    {collection:'REQUINTE BK', color:'0101, 0102, 3042, 3044, 7517 ao 7523', max:3.00, amorim:172.50},
    {collection:'REQUINTE BK', color:'0103', max:2.50, amorim:172.50},
    {collection:'REQUINTE BK', color:'0105, 7511 ao 7516', max:3.00, amorim:174.40},
    {collection:'REQUINTE BK', color:'0106 e 0107', max:2.40, amorim:174.40},
    {collection:'REQUINTE BK', color:'3040', max:2.80, amorim:218.50},
    {collection:'REQUINTE BK', color:'3037, 3038 e 3039', max:3.00, amorim:218.50},
    {collection:'REQUINTE BK', color:'3043', max:2.50, amorim:214.50},
    {collection:'REQUINTE BK', color:'3041', max:2.50, amorim:174.40},
    {collection:'REQUINTE BK', color:'7500 e 7501', max:2.80, amorim:212.80},
    {collection:'REQUINTE BK', color:'0090, 0096, 7504 e 7508', max:2.80, amorim:181.80},
    {collection:'OXFORD BLACKOUT', color:'0410, 0411 e 0414', max:3.00, amorim:210.50},
    {collection:'FLORENÇA', color:'0356', max:2.00, amorim:161.50},
    {collection:'RUSTIC', color:'0053', max:2.00, amorim:185.70},
    {collection:'ELEGANCY', color:'0162', max:2.00, amorim:144.80},
    {collection:'ELEGANCY', color:'0161', max:3.00, amorim:144.80},
    {collection:'ELEGANCY', color:'0126', max:2.50, amorim:133.30},
    {collection:'ELEGANCY', color:'0128', max:2.50, amorim:133.30},
    {collection:'ELEGANCY', color:'0170 e 0177', max:3.00, amorim:144.80},
    {collection:'ELEGANCY', color:'0171 e 0178', max:2.50, amorim:144.80},
    {collection:'VENEZA', color:'0060', max:2.50, amorim:172.30},
    {collection:'VENEZA', color:'0076 e 0077', max:2.50, amorim:144.00},
    {collection:'DUBAI', color:'0221 e 0227', max:2.60, amorim:229.60},
    {collection:'MANHATTAN', color:'0485 ao 0490', max:2.80, amorim:174.50},
    {collection:'SEVILHA', color:'3354, 3355, 3356, 3357, 3358 e 3361', max:2.50, amorim:144.00},
    {collection:'FINESSE BK', color:'6500 ao 6808', max:3.00, amorim:218.60},
    {collection:'TRONCOSO', color:'8800 ao 8804', max:3.00, amorim:150.30},
    {collection:'CARAÍVA BK', color:'8900 ao 8904', max:3.00, amorim:208.20},
    {collection:'CAMBURI BK', color:'9200 ao 9209', max:3.00, amorim:208.20},
    {collection:'IPANEMA', color:'7800 ao 7804', max:2.80, amorim:191.00},
    {collection:'NORONHA', color:'8600 ao 8606', max:2.80, amorim:191.00},
    {collection:'LEBLON', color:'8200 ao 8205', max:2.80, amorim:191.00}
  ];

  const TUBES={
    '32MM':{minW:0.40,maxW:1.80,minH:0.30,minBillH:1.00,maxH:3.00,maxArea:3.50},
    '38MM':{minW:0.40,maxW:2.40,minH:0.30,minBillH:1.00,maxH:3.50,maxArea:5.20},
    '38MM RED. PESO MOLA':{minW:0.85,maxW:2.40,minH:0.30,minBillH:1.00,maxH:4.00,maxArea:8.20},
    'AUTO STOP':{minW:0.40,maxW:3.00,minH:0.30,minBillH:1.00,maxH:4.50,maxArea:5.20},
    '53MM':{minW:0.90,maxW:3.00,minH:0.30,minBillH:1.00,maxH:6.00,maxArea:12.00},
    '53MM RED. PESO MOLA':{minW:0.90,maxW:3.00,minH:0.30,minBillH:1.00,maxH:6.00,maxArea:12.00}
  };
  const BARS=[
    {name:'SEM BARRA / SEM BANDÔ', compat:{'32MM':true,'38MM':true,'38MM RED. PESO MOLA':true,'AUTO STOP':false,'53MM':true,'53MM RED. PESO MOLA':true}},
    {name:'BARRA NIVELADORA', compat:{'32MM':true,'38MM':true,'38MM RED. PESO MOLA':true,'AUTO STOP':true,'53MM':true,'53MM RED. PESO MOLA':true}},
    {name:'BANDÔ CONJUGADO', compat:{'32MM':true,'38MM':true,'38MM RED. PESO MOLA':true,'AUTO STOP':false,'53MM':false,'53MM RED. PESO MOLA':false}},
    {name:'BANDÔ FLAT / FLAT REVESTIDO', compat:{'32MM':true,'38MM':true,'38MM RED. PESO MOLA':true,'AUTO STOP':true,'53MM':true,'53MM RED. PESO MOLA':true}},
    {name:'BANDÔ BOX 90', compat:{'32MM':true,'38MM':true,'38MM RED. PESO MOLA':false,'AUTO STOP':false,'53MM':false,'53MM RED. PESO MOLA':false}},
    {name:'BANDÔ BOX 70', compat:{'32MM':true,'38MM':false,'38MM RED. PESO MOLA':false,'AUTO STOP':false,'53MM':false,'53MM RED. PESO MOLA':false}},
    {name:'BANDÔ BOX GRANDE', compat:{'32MM':false,'38MM':false,'38MM RED. PESO MOLA':false,'AUTO STOP':true,'53MM':true,'53MM RED. PESO MOLA':true}},
    {name:'BANDÔ SEMI-BOX GRANDE', compat:{'32MM':false,'38MM':false,'38MM RED. PESO MOLA':false,'AUTO STOP':true,'53MM':true,'53MM RED. PESO MOLA':true}}
  ];

  function cfg(){
    db.settings=db.settings||{};
    db.settings.blindsV1283=db.settings.blindsV1283||{minArea:1.2,cashDiscount:8};
    db.settings.blindInventory=db.settings.blindInventory||[];
    return db.settings.blindsV1283;
  }
  function p18Factor(){return 1 + Number(db.priceConfig?.terms?.p18AddPct||0)/100}
  function h25P18Factor(){return p18Factor()}
  function quotePreviewValues(p4){return {p4, cash:p4*0.92, p18:p4*p18Factor()};}
  function fixed(n){return Number(n||0).toFixed(2).replace('.',',')}
  function toM(v){return Number(v||0)/100}
  function billAreaFromCm(wCm,hCm){const w=toM(wCm),h=toM(hCm),billH=Math.max(1.0,h);return Math.max(1.2,w*billH)}
  function h25InventoryItem(r){return {id:uid(),seedKey:`RQ-H25-${r.n}`,sku:`RQ-H25-${String(r.n).padStart(2,'0')}`,supplier:'REQUINTE',model:'HORIZONTAL 25MM',collection:r.collection,color:'CÓDIGO DIGITÁVEL',maxWidthM:0,maxHeightCm:0,cost:Number(r.price),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:r.n};}
  function seedInventory(){
    cfg();
    if(!db.settings.blindInventoryResetV1284){
      const historical=(db.settings.blindInventory||[]).filter(x=>x.model==='HORIZONTAL 25MM');
      const list=[];
      for(const r of H25){const old=historical.find(x=>String(x.seedKey)==='RQ-H25-'+r.n);list.push(old||h25InventoryItem(r));}
      for(const model of ['ROLÔ','ROMANA']) for(const row of currentCatalog(model)) for(const color of expandColorCodes(row.color)){
        const key=`AM-${model}-${row.collection}-${color}-${row.max}`;
        list.push({id:uid(),seedKey:key,sku:`AM-${model==='ROLÔ'?'RL':'RM'}-${String(list.length).padStart(5,'0')}`,supplier:'AMORIM',model,collection:row.collection,color,maxWidthM:row.max,maxHeightCm:0,amorimPrice:row.amorim,cost:row.amorim*.70,markup:100,stockMode:'ILIMITADO',qty:0,active:true});
      }
      db.settings.blindInventory=list;db.settings.blindInventoryResetV1284=true;
    }
  }

  function inv(){seedInventory();return db.settings.blindInventory||[]}
  function availableInventory(){return inv().filter(x=>x.active!==false&&(x.stockMode==='ILIMITADO'||Number(x.qty||0)>0));}
  function itemById(id){return inv().find(x=>String(x.id)===String(id));}
  function nextBlindSku(){
    const used=new Set(inv().map(x=>String(x.sku||'').toUpperCase()).filter(Boolean));
    let i=1;while(used.has(`PER-${String(i).padStart(6,'0')}`))i++;return `PER-${String(i).padStart(6,'0')}`;
  }
  function uniq(arr){return [...new Set(arr.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));}
  function expandColorCodes(label){
    const txt=String(label||'').split(' - ')[0].replace(/\s+e\s+/gi,',').replace(/;/g,',');
    const out=[];
    for(const part of txt.split(',')){
      const st=part.trim();const m=st.match(/^(\d{3,4})\s+(?:ao|a)\s+(\d{3,4})$/i);
      if(m){const from=Number(m[1]),to=Number(m[2]);if(to>=from&&to-from<=200){for(let j=from;j<=to;j++)out.push(String(j).padStart(m[1].length,'0'));}continue;}
      const single=st.match(/^(\d{3,4})$/);if(single)out.push(single[1]);
    }
    return [...new Set(out)];
  }
  function currentCatalog(model){return model==='ROLÔ'?ROLO:model==='ROMANA'?ROMANA:[]}
  function currentCollections(model){return model==='HORIZONTAL 25MM'?H25.map(x=>x.collection):uniq(currentCatalog(model).map(x=>x.collection))}
  function currentEntries(model,collection){return model==='HORIZONTAL 25MM'?H25.filter(x=>x.collection===collection):currentCatalog(model).filter(x=>x.collection===collection)}
  function currentColors(model,collection){return model==='HORIZONTAL 25MM'?['CÓDIGO DIGITÁVEL']:uniq(currentEntries(model,collection).flatMap(x=>expandColorCodes(x.color)))}
  function selectedEntry(model,collection,color){
    if(model==='HORIZONTAL 25MM') return H25.find(x=>x.collection===collection) || H25[0];
    const stored=(db.settings.blindInventory||[]).find(x=>x.model===model&&x.collection===collection&&x.color===color&&x.active!==false);if(stored)return {...stored,max:stored.maxWidthM,amorim:Number(stored.amorimPrice||0)};return currentEntries(model,collection).find(x=>expandColorCodes(x.color).includes(color))||null;
  }
  function tubeOptions(){return Object.keys(TUBES).map(x=>`<option>${esc(x)}</option>`).join('')}
  function barOptions(){return BARS.map(x=>`<option>${esc(x.name)}</option>`).join('')}
  function configOptions(){return Object.keys(CONJUNTOS).map(x=>`<option>${esc(x)}</option>`).join('')}
  function eligibleTube(t,w,h){const x=TUBES[t];return x&&w>=x.minW&&w<=x.maxW&&h>=x.minH&&h<=x.maxH&&w*h<=x.maxArea;}
  function autoTube(w,h){return ['32MM','38MM','53MM'].find(k=>eligibleTube(k,w,h))||'53MM';}
  function blindCalc(model,item,opts){
    const w=toM(opts.w),h=toM(opts.h); if(!(w>0&&h>0)) return null;
    const area=w*h, billArea=billAreaFromCm(opts.w,opts.h), alerts=[], info=[];
    let p4=0, cash=0, p18=0;

    if(model==='HORIZONTAL 25MM'){
      p4=billArea*Number(item.price||0)*2;
      ({cash,p18}=quotePreviewValues(p4));
    } else {
      const costAmorim=Number(item.amorim||0)*0.70;
      p4=billArea*costAmorim*2;
      if(model==='ROLÔ'){const t=String(opts.tube||'32MM');const perc=t.startsWith('38MM')?.05:t.startsWith('53MM')?.10:0;const fixedAdd=t==='38MM RED. PESO MOLA'?80:t==='53MM RED. PESO MOLA'?150:0;p4=p4*(1+perc)+fixedAdd;}p4 += Number(CONJUNTOS[opts.config]||0);
      ({cash,p18}=quotePreviewValues(p4));
      if(w>Number(item.max||0)+1e-9) alerts.push(`Largura máxima da coleção: ${fixed(item.max)} m.`);
      if(h<0.30) alerts.push('Altura mínima de fabricação: 0,30 m.');
      if(h > 3*w) alerts.push('Altura superior a 3 vezes a largura: risco de canoamento, rugas, flacidez e efeito cone.');
      if(/BLACKOUT PINPOINT/i.test(item.collection) && /(2,5|3,0)/.test(String(item.color))) alerts.push('BK PINPOINT / largura especial pode apresentar diferença considerável de tonalidade.');
      info.push('Metragem mínima cobrada por peça: 1,20 m². Altura mínima cobrada: 1,00 m.');
      info.push('O tecido da cortina rolô é 3,5 cm menor que a largura total da peça.');
      if(model==='ROLÔ'){
        const tube=TUBES[opts.tube]||TUBES['38MM'];
        if(w < Number(tube.minW||0)-1e-9) alerts.push(`Largura mínima do ${opts.tube}: ${fixed(tube.minW)} m.`);
        if(w > Number(tube.maxW||999)+1e-9) alerts.push(`Largura máxima do ${opts.tube}: ${fixed(tube.maxW)} m.`);
        if(h > Number(tube.maxH||999)+1e-9) alerts.push(`Altura máxima do ${opts.tube}: ${fixed(tube.maxH)} m.`);
        if(area > Number(tube.maxArea||999)+1e-9) alerts.push(`Área máxima do ${opts.tube}: ${fixed(tube.maxArea)} m².`);
        const bar=BARS.find(x=>x.name===opts.bar) || BARS[0];
        if(bar && bar.compat && bar.compat[opts.tube]===false) alerts.push(`O modelo de barra / bandô “${opts.bar}” não é compatível com o tubo ${opts.tube}.`);
        if(opts.tube==='AUTO STOP'){
          if(!/BANDÔ|BARRA NIVELADORA/.test(opts.bar||'')) alerts.push('Auto Stop exige obrigatoriamente bandô ou barra niveladora.');
          info.push('Auto Stop utiliza base redonda.');
        }
        if(/BANDÔ CONJUGADO/i.test(opts.bar||'') && w>3.5) alerts.push('Bandô conjugado permite largura máxima de 3,50 m.');
        if(/BANDÔ BOX 90/i.test(opts.bar||'') && w>3.5) alerts.push('Bandô Box 90 permite largura máxima de 3,50 m.');
        if(/BANDÔ BOX 70/i.test(opts.bar||'') && opts.tube!=='32MM') alerts.push('Bandô Box 70 somente para tubos de 32 mm.');
        if(/NOBLETTE/i.test(item.collection)){
          if(h>2.8) alerts.push('Coleções Noblette possuem altura máxima de 2,80 m.');
          if(/BANDÔ/i.test(opts.bar||'')) alerts.push('Rolô com tecido Noblette não pode ter rolamento invertido quando solicitado com bandô.');
        }
      }
    }
    return {area,billArea,p4,cash,p18,alerts,info,needsValidation:true};
  }

  if(!NAV.some(x=>x[0]==='blindInventory')) NAV.splice(Math.max(0,NAV.findIndex(x=>x[0]==='inventory')+1),0,['blindInventory','ESTOQUE DE PERSIANAS','gestor']);
  const sg=NAV_GROUPS.find(x=>x.id==='stock'); if(sg && !sg.items.includes('blindInventory')) sg.items.splice(Math.max(0,sg.items.indexOf('inventory')+1),0,'blindInventory');
  function ensureView(){
    if(document.getElementById('view-blindInventory')) return;
    const main=document.querySelector('.main'); if(!main) return;
    const s=document.createElement('section'); s.id='view-blindInventory'; s.className='view';
    s.innerHTML=`<header class="topbar"><div><h1>Estoque de Persianas</h1><p>Catálogo ativo: somente Horizontal 25mm Alumínio (Requinte).</p></div><div class="actions"><button id="blindNewBtn" class="btn primary">+ NOVO ITEM</button></div></header><div id="blindInventorySummary" class="kpis" style="margin-bottom:14px"></div><div class="card"><div class="toolbar"><input id="blindInventorySearch" class="search" placeholder="Buscar coleção, cor ou SKU"><select id="blindInventoryModelFilter"><option value="">TODOS OS MODELOS</option></select></div><div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Modelo</th><th>Coleção</th><th>Cor</th><th>4x/m²</th><th>À vista/m²</th><th>18x/m²</th><th>Status</th><th>Ações</th></tr></thead><tbody id="blindInventoryTable"></tbody></table></div></div>`;
    main.insertBefore(s,document.getElementById('view-receivables')||null);
    document.getElementById('blindNewBtn').onclick=()=>openBlindItemEditor();
    document.getElementById('blindInventorySearch').oninput=renderBlindInventory;
    document.getElementById('blindInventoryModelFilter').onchange=renderBlindInventory;
  }
  window.renderBlindInventory=function(){
    ensureView(); seedInventory();
    const list=inv(), q=norm(document.getElementById('blindInventorySearch')?.value||''), mf=document.getElementById('blindInventoryModelFilter')?.value||'';
    const models=uniq(list.map(x=>x.model));
    const sel=document.getElementById('blindInventoryModelFilter'); if(sel){ const old=sel.value; sel.innerHTML='<option value="">TODOS OS MODELOS</option>'+models.map(x=>`<option ${old===x?'selected':''}>${esc(x)}</option>`).join(''); }
    const rows=list.filter(x=>(!mf||x.model===mf)&&(!q||norm([x.sku,x.model,x.collection,x.color].join(' ')).includes(q)));
    const tb=document.getElementById('blindInventoryTable'); if(!tb) return;
    document.getElementById('blindInventorySummary').innerHTML=[['Itens cadastrados',list.length],['Disponíveis',availableInventory().length],['Modelo ativo','HORIZONTAL 25MM'],['Fornecedor','REQUINTE']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    tb.innerHTML=rows.map(x=>{ const p4=Number(x.cost||0)*2, cash=p4*0.92, p18=p4*p18Factor(); return `<tr><td>${esc(x.sku)}</td><td>${esc(x.model)}</td><td>${esc(x.collection)}</td><td>${esc(x.color)}</td><td>${money(p4)}</td><td>${money(cash)}</td><td>${money(p18)}</td><td><span class="badge ${x.active===false?'warn':'ok'}">${x.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" onclick="openBlindItemEditor('${esc(x.id)}')">Editar</button> <button class="btn danger" onclick="deleteBlindItem('${esc(x.id)}')">Excluir</button></td></tr>` }).join('') || '<tr><td colspan="9">Nenhum item.</td></tr>';
  }
  window.openBlindItemEditor=function(id){
    seedInventory(); const p=typeof id==='string'?itemById(id):id; if(id&&!p) return alert('Item não encontrado.');
    const autoSku=p?.sku||nextBlindSku();
    openModal(`<h2>${p?'Editar':'Novo'} item • Estoque de Persianas</h2><div class="grid two"><label class="field">SKU <span class="muted">(automático)</span><input id="biSku" value="${esc(autoSku)}" readonly style="background:#f2f5f4;cursor:not-allowed"></label><label class="field">Fornecedor<input id="biSupplier" value="${esc(p?.supplier||'REQUINTE')}"></label><label class="field">Modelo<select id="biModel">${MODELS.map(x=>`<option ${p?.model===x?'selected':''}>${esc(x)}</option>`).join('')}</select></label><label class="field">Coleção<input id="biCollection" value="${esc(p?.collection||'')}"></label><label class="field">Cor<input id="biColor" value="${esc(p?.color||'')}"></label><label class="field">Custo / tabela por m²<input id="biCost" type="number" step="0.01" min="0" value="${Number(p?.cost||0)}"></label><label class="field">Markup (%)<input id="biMarkup" type="number" step="0.01" min="0" value="${Number(p?.markup??100)}"></label><label class="field">Status<select id="biActive"><option value="1">ATIVO</option><option value="0">INATIVO</option></select></label></div><div class="actions" style="margin-top:14px"><button id="biSave" class="btn primary">SALVAR</button></div>`);
    document.getElementById('biActive').value=p?.active===false?'0':'1';
    document.getElementById('biSave').onclick=()=>{ const o=p||{id:uid()}; Object.assign(o,{sku:p?.sku||document.getElementById('biSku').value.trim()||nextBlindSku(),supplier:document.getElementById('biSupplier').value.trim()||'REQUINTE',model:document.getElementById('biModel').value.trim().toUpperCase(),collection:document.getElementById('biCollection').value.trim().toUpperCase(),color:document.getElementById('biColor').value.trim().toUpperCase(),cost:Number(document.getElementById('biCost').value||0),markup:Number(document.getElementById('biMarkup').value||100),active:document.getElementById('biActive').value==='1',stockMode:'ILIMITADO',qty:0,seedKey:p?.seedKey||''}); if(!o.model||!o.collection||!o.color) return alert('Informe modelo, coleção e cor.'); if(!p) inv().push(o); queueSave(); closeModal(); renderBlindInventory(); };
  }
  window.deleteBlindItem=function(id){ const p=itemById(id); if(!p||!confirm(`Excluir ${p.model} • ${p.collection}?`)) return; db.settings.blindInventory=inv().filter(x=>String(x.id)!==String(id)); queueSave(); renderBlindInventory(); };

  function bindBlindButton(){ const old=document.getElementById('addBlindBtn'); if(!old||old.dataset.v1283) return; const b=old.cloneNode(true); b.dataset.v1283='1'; old.parentNode.replaceChild(b,old); b.onclick=openBlindV1258; }
  function show(el,on){ const n=document.getElementById(el); if(n) n.style.display=on?'block':'none'; }
  function opt(list, current=''){ return list.map(x=>`<option ${String(x)===String(current)?'selected':''}>${esc(String(x))}</option>`).join(''); }
  window.openBlindV1258=function(){
    seedInventory();
    openModal(`<h2>+ Persiana</h2><p class="muted">Utilizando apenas as tabelas informadas hoje: Rolô Amorim, Romana Amorim e Horizontal 25mm Alumínio Requinte.</p><div class="grid two"><label class="field">Modelo da persiana<select id="bpModel"><option value="">SELECIONE O MODELO</option>${opt(MODELS)}</select></label><label class="field">Ambiente<input id="bpEnv" placeholder="Ex.: SALA"></label><label class="field">Coleção<select id="bpCollection"></select></label><label class="field">Cor<select id="bpColor"></select></label><label class="field" id="bpColorCodeWrap" style="display:none">Código da cor<input id="bpColorCode" placeholder="Digite o código da cor"></label><label class="field">Largura (cm)<input id="bpW" type="number" min="1"></label><label class="field">Altura (cm)<input id="bpH" type="number" min="1"></label><label class="field">Quantidade<input id="bpQty" type="number" min="1" step="1" value="1"></label><label class="field" id="bpCmdWrap">Lado do comando<select id="bpCmd"><option>DIREITO</option><option>ESQUERDO</option></select></label><div id="bpMultiCommands" style="grid-column:1/-1"></div><label class="field">Altura do comando (cm)<input id="bpCmdH" type="number" min="0" value="120"></label><label class="field">Acionamento<select id="bpDrive"><option value="MANUAL">MANUAL</option><option value="ELETRÔNICO">ELETRÔNICO</option></select></label><label class="field" id="bpTubeWrap">Tubo / mecanismo<select id="bpTube">${tubeOptions()}</select></label><label class="field" id="bpBarWrap">Modelo da barra / bandô<select id="bpBar">${barOptions()}</select></label><label class="field" id="bpCfgWrap">Tipo de conjunto<select id="bpCfg">${configOptions()}</select></label><label class="field" id="bpAccWrap">Cor dos acessórios<select id="bpAccColor">${ACCESSORY_COLORS.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label></div><div id="bpPreview" class="notice" style="margin-top:14px">Preencha as medidas para calcular.</div><div class="actions" style="margin-top:14px"><button id="bpSave" class="btn primary">ADICIONAR PERSIANA AO ORÇAMENTO</button></div>`);
    const $id=id=>document.getElementById(id);
    const state={calc:null};
    function selected(){ return selectedEntry($id('bpModel').value,$id('bpCollection').value,$id('bpColor').value); }
    function fillCollections(){const model=$id('bpModel').value;const selected=!!model;for(const el of $id('bpCollection').closest('.grid').querySelectorAll('.field')){if(!el.querySelector('#bpModel'))el.style.display=selected?'':'none';} $id('bpCollection').innerHTML=selected?opt(currentCollections(model)):'';fillColors();}
    function fillColors(){ const model=$id('bpModel').value, collection=$id('bpCollection').value; $id('bpColor').innerHTML=opt(currentColors(model,collection)); refresh(); }
    function refresh(){
      const cnt={SIMPLES:1,DUPLEX:2,TRIPLEX:3,QUADRIPLEX:4}[$id('bpCfg').value]||1, box=$id('bpMultiCommands');if(box&&Number(box.dataset.count||0)!==cnt){box.dataset.count=cnt;box.innerHTML=cnt>1?Array.from({length:cnt},(_,j)=>`<label class="field">Comando parte ${j+1} (da esquerda para direita)<select id="bpCmdPart${j+1}"><option>DIREITO</option><option>ESQUERDO</option></select></label>`).join(''):'';} show('bpCmdWrap',cnt===1);
      const model=$id('bpModel').value; const collection=$id('bpCollection').value; const item=selected();
      show('bpColorCodeWrap', model==='HORIZONTAL 25MM');
      show('bpTubeWrap', model==='ROLÔ'); show('bpBarWrap', model==='ROLÔ'); show('bpCfgWrap', model==='ROLÔ'); show('bpAccWrap', model==='ROLÔ');
      const result=item?blindCalc(model,item,{w:$id('bpW').value,h:$id('bpH').value,tube:$id('bpTube').value,bar:$id('bpBar').value,config:$id('bpCfg').value,drive:$id('bpDrive').value}):null;
      state.calc=result;
      if(!model){$id('bpPreview').innerHTML='Selecione primeiro o modelo da persiana.';return;} if(!item){ $id('bpPreview').innerHTML='Selecione a coleção.'; return; }
      if($id('bpDrive').value==='ELETRÔNICO'){$id('bpPreview').innerHTML='<strong style="color:#9b2200">CONSULTAR NA PLATAFORMA DO FORNECEDOR — PERSIANA ELETRÔNICA NÃO PODE SER INSERIDA PELO ERP.</strong>';return;} if(!result){ $id('bpPreview').innerHTML=`<strong>${esc(model)}</strong><br>${esc(collection)}<br>${model==='HORIZONTAL 25MM'?'Informe o código da cor e as medidas.':'Informe as medidas para cálculo e alertas.'}`; return; }
      let html=`<strong>Área real:</strong> ${fixed(result.area)} m² • <strong>Área cobrada:</strong> ${fixed(result.billArea)} m²<br><strong>18x:</strong> ${money(result.p18)} • <strong>4x:</strong> ${money(result.p4)} • <strong>À vista:</strong> ${money(result.cash)}<br><strong style="color:#9b5d00">${VALIDATION_TEXT}</strong>`;
      if(result.alerts.length) html+=`<br><br><strong>Alertas:</strong><ul style="margin:6px 0 0 18px">${result.alerts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
      if(result.info.length) html+=`<br><strong>Observações técnicas:</strong><ul style="margin:6px 0 0 18px">${result.info.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
      $id('bpPreview').innerHTML=html;
    }
    ['bpModel','bpCollection','bpColor','bpW','bpH','bpQty','bpCmd','bpCmdH','bpDrive','bpTube','bpBar','bpCfg','bpAccColor','bpColorCode'].forEach(id=>{ const el=$id(id); if(el){ el.oninput=refresh; el.onchange=refresh; } });
    ['bpW','bpH'].forEach(id=>{$id(id).addEventListener('change',()=>{if($id('bpModel').value==='ROLÔ'){$id('bpTube').value=autoTube(toM($id('bpW').value),toM($id('bpH').value));refresh();}})});$id('bpModel').onchange=fillCollections; $id('bpCollection').onchange=fillColors; $id('bpColor').onchange=refresh; fillCollections();
    $id('bpSave').onclick=()=>{
      if($id('bpDrive').value==='ELETRÔNICO')return alert('CONSULTAR NA PLATAFORMA DO FORNECEDOR. Persiana eletrônica não será incluída.');const model=$id('bpModel').value, item=selected(), w=Number($id('bpW').value), h=Number($id('bpH').value), qty=Math.max(1,Number($id('bpQty').value||1));
      if(!item||!state.calc||!(w>0)||!(h>0)) return alert('Informe modelo, coleção, cor e medidas.');
      const code=($id('bpColorCode').value||'').trim();
      if(model==='HORIZONTAL 25MM' && !code) return alert('Informe o código da cor.');
      const alerts=(state.calc.alerts||[]).slice();const sideCount={SIMPLES:1,DUPLEX:2,TRIPLEX:3,QUADRIPLEX:4}[$id('bpCfg').value]||1;const sideList=sideCount===1?[$id('bpCmd').value]:Array.from({length:sideCount},(_,j)=>$id('bpCmdPart'+(j+1))?.value||'DIREITO');
      const notes=[...(state.calc.info||[]), VALIDATION_TEXT, ...alerts];
      const color=model==='HORIZONTAL 25MM'?code:$id('bpColor').value;
      const detail=[];
      if(model==='ROLÔ'){ detail.push(`Tubo: ${$id('bpTube').value}`); detail.push(`Barra/Bandô: ${$id('bpBar').value}`); detail.push(`Conjunto: ${$id('bpCfg').value}`); detail.push(`Acessórios: ${$id('bpAccColor').value}`); }
      draft.blinds=draft.blinds||[];
      draft.blinds.push({
        id:uid(), inventoryId:(availableInventory().find(x=>x.model===model&&x.collection===item.collection&&x.color===(model==='HORIZONTAL 25MM'?'CÓDIGO DIGITÁVEL':$id('bpColor').value))?.id||''), environment:$id('bpEnv').value.trim()||'PERSIANA',
        blindModel:model, collection:item.collection, model:`${model} • ${item.collection}`, color,
        bando:model==='ROLÔ' ? $id('bpBar').value : '', width:w, height:h, qty,
        area:state.calc.area, billArea:state.calc.billArea, commandSide:`${sideList.map((x,i)=>`PARTE ${i+1}: ${x}`).join(' / ')} • ALT. ${Number($id('bpCmdH').value||0)} CM${detail.length?` • ${detail.join(' • ')}`:''}`,
        commandHeight:Number($id('bpCmdH').value||0), drive:$id('bpDrive').value, notes, alerts, validationRequired:true, validationText:VALIDATION_TEXT,
        p18:state.calc.p18, p4:state.calc.p4, cash:state.calc.cash, cost:model==='HORIZONTAL 25MM'?Number(item.price||0):Number(item.amorim||0)*0.70, markup:100,
        perM2P18:state.calc.billArea?state.calc.p18/state.calc.billArea:0, perM2P4:state.calc.billArea?state.calc.p4/state.calc.billArea:0, perM2Cash:state.calc.billArea?state.calc.cash/state.calc.billArea:0,
        sourceSku:availableInventory().find(x=>x.model===model&&x.collection===item.collection&&x.color===(model==='HORIZONTAL 25MM'?'CÓDIGO DIGITÁVEL':$id('bpColor').value))?.sku||''
      });
      closeModal(); renderQuote();
    };
  };

  const oldLoad=loadCloud; loadCloud=async function(){ await oldLoad(); seedInventory(); if(isGestor()) queueSave(); };
  const oldSet=setView; setView=function(id){ oldSet(id); if(id==='blindInventory') renderBlindInventory(); };
  ensureView(); seedInventory(); bindBlindButton(); setTimeout(()=>{ try{renderNav();}catch(_){} bindBlindButton(); },50);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ ensureView(); seedInventory(); try{renderNav();}catch(_){} bindBlindButton(); },250));
})();
