// V11.3.6: garras oficiais específicas por tipo/cor de trilho, estoque inicial 150 un., custo R$3,00, preços R$5,00 à vista / R$5,38 4x / R$6,02 18x
// HOTFIX CORDAO: usa NI-0191 CORDAO WAVE BRANCO existente; 1m por metro de largura Wave
// HOTFIX DESLIZANTES: 1/5cm por acabamento + 1/5cm por forro; completa multiplo de 4 acima
// V11.3 HOTFIX 2: 2 tampas por trilho/ambiente; garras 1/50cm min 2; CORDAO WAVE 5X5 branco R$4 markup 120%
// V11.3.1 FIXAÇÃO: trilho/varão + garras trilho suíço 1/60cm (mín 2) + 2 tampas
const $=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0);
const today=()=>new Date().toISOString().slice(0,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const norm=s=>String(s||'').trim().toUpperCase();
const clone=o=>JSON.parse(JSON.stringify(o));
const fmtDate=v=>{if(!v)return'-';const [y,m,d]=v.split('-');return y&&m&&d?`${d}/${m}/${y}`:v};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);

function nextQuoteNumber(){
  const nums=(db.quotes||[]).map(q=>Number(q.numero)||0);
  return Math.max(0,...nums)+1;
}
function nextOrderNumber(){
  const nums=(db.orders||[]).map(o=>Number(o.numero)||0);
  return Math.max(0,...nums)+1;
}

const DEFAULT_PRICE_CONFIG={
  finishes:{
    'LINHO SINTÉTICO':{price:42,normalMax:280,specialMax:305,specialPct:10,rollWidth:3},
    'LINHO COMPOSTO 6%':{price:55,normalMax:300,specialMax:300,specialPct:0,rollWidth:3},
    'LINHO COMPOSTO 12%':{price:60,normalMax:300,specialMax:300,specialPct:0,rollWidth:3},
    'LINHO NACIONAL':{price:90,normalMax:300,specialMax:300,specialPct:0,rollWidth:3},
    'VOIL LISO':{price:27,normalMax:280,specialMax:280,specialPct:0,rollWidth:3},
    'VOIL SUPER':{price:32,normalMax:280,specialMax:280,specialPct:0,rollWidth:3},
    'VOIL TRABALHADO COMPOSTO':{price:42,normalMax:280,specialMax:280,specialPct:0,rollWidth:3}
  },
  linings:{
    'MICROFIBRA LEVE':{price:31,normalMax:300,rollWidth:3},
    'GABARDINE 70%':{price:45,normalMax:280,rollWidth:3},
    'BLACKOUT 100% LEVE':{price:65,normalMax:280,rollWidth:3},
    'BLACKOUT 100% PESADO':{price:85,normalMax:280,rollWidth:3}
  },
  pleatLabor:{'FRANZIDO':10,'FRANZIDO SUÍÇO':10,'WAVE':20,'SOBREPOSTO':20,'OUTRO':0},
  sliders:{finish:0.70,lining:0.65,spacingCm:5},
  sewingPerMeter:8,
  swiss:{tiers:[{m:1.5,p:48},{m:2,p:65},{m:2.5,p:97},{m:3,p:115},{m:3.5,p:130},{m:4,p:145},{m:4.5,p:160},{m:5,p:180},{m:5.5,p:190},{m:6,p:200}],clamp:7,end:7},
  wave:{rodPerMeter:35,support:38,end:0,maxSupportSpan:1.6},
  cordPct:35,
  motor:{baseSingle:2000,singlePct:15,baseComplete:3500,completePct:25,basePerLeaf:2000,hardwarePct:15},
  install:[{maxH:3,price:60},{maxH:3.5,price:80},{maxH:4,price:180},{maxH:5,price:250},{maxH:6,price:300},{maxH:99,price:300}],
  installationMatrix:{simple:{maxH:3.5,up4:60,up5:75,up6:95},double:{maxH:5.5,up4:160,up5:275,up6:395},high:{maxH:999,up4:360,up5:475,up6:595}},
  terms:{cashDiscountPct:8,p18AddPct:14},
  commissionDefault:5
};
const DEFAULT_USERS=[
  {username:'VENDAS1',name:'Vendas 1',role:'sales',commission:5,builtIn:true},
  {username:'VENDAS2',name:'Vendas 2',role:'sales',commission:5,builtIn:true},
  {username:'GESTOR',name:'Gestor',role:'gestor',commission:0,builtIn:true},
  {username:'ERIC.DELGOBO',name:'Eric Luiz Delgobo',role:'gestor',commission:0,builtIn:true},
  {username:'LUIZ.SERGIO',name:'Luiz Sergio Delgobo',role:'gestor',commission:0,builtIn:true}
];
const STOCK_SEED=[
  ['TECIDO DE ACABAMENTO','LINHO SINTÉTICO',['BRANCO','CINZA','AREIA','BEGE','OFF WHITE','TRIGO'],'M'],
  ['TECIDO DE ACABAMENTO','LINHO COMPOSTO 6%',['BRANCO','CRU','TRIGO','CINZA'],'M'],
  ['TECIDO DE ACABAMENTO','LINHO COMPOSTO 12%',['CRU','BEGE','TRIGO'],'M'],
  ['TECIDO DE ACABAMENTO','LINHO NACIONAL',['BEGE','AZUL','ROSA','BRANCO','CINZA'],'M'],
  ['TECIDO DE ACABAMENTO','VOIL LISO',['BRANCO','MARFIM'],'M'],
  ['TECIDO DE ACABAMENTO','VOIL TRABALHADO COMPOSTO',['CRU'],'M'],
  ['TECIDO DE FORRO','FORRO LEVE',['BRANCO','CINZA','AREIA','OFF WHITE'],'M'],
  ['TECIDO DE FORRO','GABARDINE',['BRANCO','MARFIM'],'M'],
  ['TECIDO DE FORRO','BLACKOUT 100% LEVE',['BRANCO','MARFIM'],'M'],
  ['TECIDO DE FORRO','BLACKOUT 100% PESADO',['MARFIM'],'M'],
  ['AVIAMENTO','FITA WAVE 10X10',['SEM COR'],'M'],
  ['AVIAMENTO','FITA WAVE 10X12',['SEM COR'],'M'],
  ['AVIAMENTO','FITA WAVE 12X12',['SEM COR'],'M'],
  ['AVIAMENTO','FITA WAVE 10X15',['SEM COR'],'M'],
  ['AVIAMENTO','FITA WAVE 12X16',['SEM COR'],'M'],
  ['AVIAMENTO','FITA WAVE 18X16',['SEM COR'],'M'],
  ['ACESSÓRIOS','TRILHO SUÍÇO',['PRETO','BRANCO'],'M'],
  ['AVIAMENTO','GARRAS DE TRILHO',['PRETO','BRANCO'],'UN'],
  ['ACESSÓRIOS','ACABAMENTO TRILHO SUÍÇO',['PRETO','BRANCO'],'UN'],
  ['ACESSÓRIOS','VARÃO WAVE 28',['PRATA ESCOVADO','CROMADO','PRETO','DOURADO','OURO VELHO','BRANCO'],'M'],
  ['ACESSÓRIOS','SUPORTE WAVE 28',['PRATA ESCOVADO','CROMADO','PRETO','DOURADO','OURO VELHO','BRANCO'],'UN'],
  ['ACESSÓRIOS','TAMPA VARÃO WAVE 28',['PRATA ESCOVADO','CROMADO','PRETO','DOURADO','OURO VELHO','BRANCO'],'UN']
];
const WAVE_TAPE_BY_GATHER={'2.0':'FITA WAVE 10X10','2.5':'FITA WAVE 12X12','3.0':'FITA WAVE 10X15','3.5':'FITA WAVE 12X16','4.0':'FITA WAVE 16X18'};
const stockName=n=>{const x=norm(n);if(x==='MICROFIBRA LEVE')return 'FORRO LEVE';if(x==='GABARDINE 70%')return 'GABARDINE';if(x==='VOIL TRABALHADO')return 'VOIL TRABALHADO COMPOSTO';return x};
const cleanText=s=>norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
function canonicalProductType(v){const x=cleanText(v);if(['ACESSORIOS','AVIAMENTO','ACESSORIO'].includes(x))return 'ACESSÓRIO';if(x==='TECIDO DE ACABAMENTO')return 'TECIDO DE ACABAMENTO';if(x==='TECIDO DE FORRO')return 'TECIDO DE FORRO';if(x==='TECIDO ESPECIAL')return 'TECIDO ESPECIAL';return 'OUTRO'}
function productIdentity(type,name,color,unit){return [canonicalProductType(type),cleanText(stockName(name)),cleanText(color||'SEM COR'),cleanText(unit||'UN')].join('|')}
function findProductByIdentity(type,name,color,unit){const key=productIdentity(type,name,color,unit);return (db.products||[]).find(p=>productIdentity(p.type,p.name,p.color,p.unit)===key)}
function ensureProductCode(p){if(p&&!p.code)p.code=nextProductCode();return p}
function weightedAverageCost(oldQty,oldCost,inQty,inCost){oldQty=Number(oldQty||0);oldCost=Number(oldCost||0);inQty=Number(inQty||0);inCost=Number(inCost||0);const total=oldQty+inQty;return total>0?((oldQty*oldCost)+(inQty*inCost))/total:(inCost||oldCost)}
function priceConfigFor(type,name){const x=stockName(name);if(type==='finish')return db.priceConfig.finishes[name]||db.priceConfig.finishes[x];if(x==='FORRO LEVE')return db.priceConfig.linings['FORRO LEVE']||db.priceConfig.linings['MICROFIBRA LEVE'];if(x==='GABARDINE')return db.priceConfig.linings['GABARDINE']||db.priceConfig.linings['GABARDINE 70%'];return db.priceConfig.linings[name]||db.priceConfig.linings[x]}
function resolveSellerUser(obj={}){if(obj.sellerUser)return norm(obj.sellerUser);if(obj.ownerUser)return norm(obj.ownerUser);const byName=allUsers().find(u=>norm(u.name)===norm(obj.seller)||norm(u.username)===norm(obj.seller));return norm(byName?.username||currentUser?.username||'')}
function displaySeller(obj={}){const u=resolveSellerUser(obj);return u?sellerName(u):(obj.seller||'-')}

function ensureInitialInventory(){
  db.products=db.products||[];
  for(const [type,name,colors,unit='M'] of STOCK_SEED){
    for(const color of colors){
      const exists=findProductByIdentity(type,name,color,unit);
      if(!exists) db.products.push({id:uid(),code:nextProductCode(),supplierCode:'',type,category:'ESTOQUE PADRÃO',name,color,qty:500,cost:0,markup:80,unit,minimumStock:0,stockManaged:true,movements:[{id:uid(),date:today(),type:'SALDO INICIAL',qty:500,balance:500,unit,by:'SISTEMA',reason:'Carga inicial V10'}],createdAt:new Date().toISOString()});
      else {exists.stockManaged=exists.stockManaged!==false;ensureProductCode(exists)}
    }
  }
}
function findStockProduct(type,name,color,unit){if(unit){const p=findProductByIdentity(type,name,color,unit);return p?.stockManaged?p:null}return (db.products||[]).find(p=>p.stockManaged&&canonicalProductType(p.type)===canonicalProductType(type)&&cleanText(stockName(p.name))===cleanText(stockName(name))&&cleanText(p.color||'SEM COR')===cleanText(color||'SEM COR'))||null}
function stockRequirements(q){
  const req=[];
  const add=(type,name,color,qty,unit,environment)=>{qty=Number(qty||0);if(qty>0)req.push({type,name,color:color||'SEM COR',qty,unit:unit||'M',environment})};
  for(const e of q.environments||[]){
    const c=calcEnvironment(e);if(!c)continue;
    if(c.finishCalc){
      add('TECIDO DE ACABAMENTO',e.finish,e.finishColor,c.finishCalc.consumption,'M',e.name);
      if(e.finishPleat==='WAVE')add('AVIAMENTO',WAVE_TAPE_BY_GATHER[String(e.finishGather)],'SEM COR',c.finishCalc.gathered,'M',e.name);
    }
    if(c.liningCalc){
      add('TECIDO DE FORRO',e.lining,e.liningColor,c.liningCalc.consumption,'M',e.name);
      if(e.liningPleat==='WAVE')add('AVIAMENTO',WAVE_TAPE_BY_GATHER[String(e.liningGather)],'SEM COR',c.liningCalc.gathered,'M',e.name);
    }
    const f=c.fixationCalc||{};
    if((e.finishPleat==='WAVE'||e.liningPleat==='WAVE')){
      add('ACESSÓRIO','CORDAO WAVE','BRANCO',Number(e.width||0)/100,'M',e.name);
    }
    if(String(e.fixation||'').startsWith('TRILHO')){
      add('ACESSÓRIOS',e.fixation||'TRILHO SUÍÇO',e.fixColor,f.meters,'M',e.name);
      add('AVIAMENTO','GARRAS DE TRILHO',e.fixColor,Math.max(2,Math.ceil((Number(e.width||0)/100)/0.6)),'UN',e.name);
      add('ACESSÓRIOS','ACABAMENTO TRILHO SUÍÇO',e.fixColor,2,'UN',e.name);
    }else if(String(e.fixation||'').startsWith('TUBO ')){
      if(Array.isArray(f.parts))f.parts.forEach(x=>add(officialProductById(x.productId),x.qty,e.name,x.name));else{add(officialProductById(f.supportProductId),f.supports,e.name,f.supportName||'SUPORTE');add(officialProductById(f.capProductId),f.ends,e.name,f.capName||'TAMPA PARA TUBO');}
    }else if(String(e.fixation||'').startsWith('VARÃO WAVE')){
      add('ACESSÓRIOS','VARÃO WAVE 28',e.fixColor,f.meters,'M',e.name);
      add('ACESSÓRIOS','SUPORTE WAVE 28',e.fixColor,f.supports,'UN',e.name);
      add('ACESSÓRIOS','TAMPA VARÃO WAVE 28',e.fixColor,f.ends,'UN',e.name);
    }
  }
  for(const a of q.looseProducts||[]){if(a.stockManaged!==false)add(a.type,a.name,a.color,Number(a.qty||0),a.unit||'UN',a.description||'PRODUTO AVULSO')}
  return req;
}
// V11 ETAPA 2: baixa do estoque oficial (price_products) para SKUs já resolvidos no orçamento.
function officialProductById(id){return (priceProducts||[]).find(p=>Number(p.id)===Number(id))||null}
function officialProductByName(name,color=''){return (priceProducts||[]).find(p=>Number(p.active??1)===1&&norm(p.product_name)===norm(name)&&(!color||norm(p.color)===norm(color)))||null}
function officialSliderProduct(fixColor=''){const list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name)==='DESLIZANTE WAVE');if(!list.length)return null;const c=norm(fixColor);return list.find(p=>norm(p.color)===c)||list.find(p=>norm(p.color)==='BRANCO')||list[0]}
function officialProductLike(words,color=''){const ws=words.map(norm);const list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&ws.every(w=>norm(p.product_name).includes(w)));if(!list.length)return null;const c=norm(color);return list.find(p=>!c||norm(p.color)===c)||list.find(p=>norm(p.color)==='BRANCO')||list[0]}
function officialWaveCord(color=''){
  return (priceProducts||[]).find(p=>norm(p.internal_code)==='NI-0191')
    || officialProductByName('CORDAO WAVE','BRANCO')
    || officialProductByName('CORDÃO WAVE','BRANCO')
    || officialProductLike(['CORDÃO','WAVE'],'BRANCO')
    || officialProductLike(['CORDAO','WAVE'],'BRANCO');
}
function officialSwissRails(){
  const allowed=['TRILHO SIMPLES','TRILHO SIMPLES ALTO','TRILHO DUPLO','TRILHO DUPLO ESPAÇADO','TRILHO TRIPLO','TRILHO 3 VIAS','TRILHO COM ABA','TRILHO CURVO'];
  return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&allowed.some(n=>norm(p.product_name)===norm(n)));
}
function officialRailProduct(e){
  if(e.railProductId){const p=officialProductById(e.railProductId);if(p)return p}
  if(e.railInternalCode){const p=(priceProducts||[]).find(p=>norm(p.internal_code)===norm(e.railInternalCode));if(p)return p}
  // Compatibilidade com pedidos antigos: só usa busca textual quando não existe SKU salvo.
  const color=e.fixColor||'';const name=norm(e.fixation||'');
  if(name==='TRILHO SUÍÇO')return officialSwissRails().find(p=>!color||norm(p.color)===norm(color))||null;
  if(name.includes('MOTORIZADO'))return officialProductLike(['TRILHO','DUPLO','ESPAÇADO'],color)||null;
  return null;
}
function officialRailClaw(rail){
  if(!rail)return null;
  const exactName=`GARRA ${String(rail.product_name||'').trim()}`;
  return (priceProducts||[]).find(p=>Number(p.active??1)===1&&norm(p.product_name)===norm(exactName)&&norm(p.color)===norm(rail.color||''))||null;
}
async function ensureOfficialRailClaws(){
  try{
    const r=await api('prices',{method:'POST',body:JSON.stringify({action:'SINCRONIZAR_GARRAS_TRILHOS'})});
    if(Number(r?.created||0)>0){const prices=await api('prices');priceProducts=Array.isArray(prices.products)?prices.products:priceProducts}
    return r;
  }catch(e){console.error('Falha ao sincronizar garras oficiais:',e);return null}
}
function officialSupportProduct(e,f){
  if(f?.supportProductId){const p=officialProductById(f.supportProductId);if(p)return p}
  if(e.model==='COMPLETE')return officialProductLike(['SUPORTE','28/28'],e.fixColor)||officialProductLike(['SUPORTE','DUPLO'],e.fixColor)||officialProductLike(['SUPORTE','WAVE'],e.fixColor);
  return officialProductLike(['SUPORTE','WAVE','28'],e.fixColor)||officialProductLike(['SUPORTE','SIMPLES'],e.fixColor)||officialProductLike(['SUPORTE','WAVE'],e.fixColor);
}
function officialWaveTape(gather){
  const map={'2.0':'FITA WAVE 10X10','2.5':'FITA WAVE 12X12','3.0':'FITA WAVE 10X15','3.5':'FITA WAVE 12X16','4.0':'FITA WAVE 16X18'};
  const name=map[String(gather)]||'';return name?officialProductByName(name):null;
}
function officialOrderRequirements(q){
  const req=[];
  const add=(p,qty,environment,source)=>{qty=Number(qty||0);if(p&&qty>0)req.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment,source,cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)})};
  for(const e of q.environments||[]){
    const c=calcEnvironment(e);if(!c)continue;
    if(c.finishCalc){add(officialProductById(c.finishCalc.productId),c.finishCalc.consumption,e.name,'TECIDO DE ACABAMENTO');if(e.finishPleat==='WAVE')add(officialWaveTape(e.finishGather),c.finishCalc.gathered,e.name,'FITA WAVE ACABAMENTO')}
    if(c.liningCalc){add(officialProductById(c.liningCalc.productId),c.liningCalc.consumption,e.name,'TECIDO DE FORRO');if(e.liningPleat==='WAVE')add(officialWaveTape(e.liningGather),c.liningCalc.gathered,e.name,'FITA WAVE FORRO')}
    const f=c.fixationCalc||{};
    const waveLayers=(e.finishPleat==='WAVE'?1:0)+(e.liningPleat==='WAVE'?1:0);
    if(waveLayers){
      add(officialSliderProduct(e.fixColor),(e.finishPleat==='WAVE'?c.finishSliders:0)+(e.liningPleat==='WAVE'?c.liningSliders:0),e.name,'DESLIZANTE WAVE');
      add(officialWaveCord(e.fixColor),(Number(e.width||0)/100),e.name,'CORDÃO WAVE');
    }
    if(c.finishAccessory?.qty)add(officialProductById(c.finishAccessory.productId),c.finishAccessory.qty,e.name,c.finishAccessory.name);
    if(c.liningAccessory?.qty)add(officialProductById(c.liningAccessory.productId),c.liningAccessory.qty,e.name,c.liningAccessory.name);
    if(String(e.fixation||'').startsWith('TUBO ')){
      if(Array.isArray(f.parts))f.parts.forEach(x=>add(officialProductById(x.productId),x.qty,e.name,x.name));else{add(officialProductById(f.supportProductId),f.supports,e.name,f.supportName||'SUPORTE');add(officialProductById(f.capProductId),f.ends,e.name,f.capName||'TAMPA PARA TUBO');}
    }else if(String(e.fixation||'').startsWith('VARÃO WAVE')){
      add(officialSupportProduct(e,f),f.supports,e.name,f.supportName||'SUPORTE');
      add(officialProductByName('VARÃO WAVE 28',e.fixColor)||officialProductLike(['VARÃO','WAVE'],e.fixColor),f.meters,e.name,'VARÃO WAVE 28');
      add(officialProductLike(['TAMPA','VARÃO'],e.fixColor),f.ends,e.name,'TAMPA DE VARÃO WAVE');
    }else if(String(e.fixation||'').startsWith('TRILHO')){
      const rail=officialRailProduct(e);
      add(rail,f.meters,e.name,e.fixation==='TRILHO MOTORIZADO'?'TRILHO BASE MOTORIZADO':(e.fixation||'TRILHO'));
      add(officialRailClaw(rail),Math.max(2,Math.ceil(Number(e.width||0)/60)),e.name,'GARRA ESPECÍFICA DO TRILHO');
      add(officialProductLike(['TAMPA','TRILHO'],e.fixColor)||officialProductLike(['ACABAMENTO','TRILHO'],e.fixColor),2,e.name,'TAMPA / ACABAMENTO DE TRILHO');
    }
  }
  const grouped={};
  for(const r of req){
    const k=[String(r.product_id),String(r.environment||'')].join('|');
    if(!grouped[k])grouped[k]={...r,qty:0,environments:[]};
    grouped[k].qty+=r.qty;
    if(r.environment&&!grouped[k].environments.includes(r.environment))grouped[k].environments.push(r.environment);
  }
  return Object.values(grouped);
}
function officialBomRows(order){return (order?.officialStockSnapshot||[]).map(x=>`<tr><td>${esc(x.internal_code||'-')}</td><td>${esc(x.product_name||'-')}</td><td>${esc(x.color||'-')}</td><td>${Number(x.qty||0).toFixed(norm(x.unit)==='M'?2:0)} ${esc(norm(x.unit||'UN'))}</td><td>${esc((x.environments||[]).join(', ')||'-')}</td></tr>`).join('')}
async function consumeOfficialStock(q,order){
  const items=officialOrderRequirements(q);if(!items.length){order.officialStockMovements=[];return {ok:true}}
  try{
    const res=await api('prices',{method:'POST',body:JSON.stringify({action:'CONSUMIR_PEDIDO',order_number:order.numero,items:items.map(x=>({product_id:x.product_id,qty:x.qty,environment:x.environments.join(', ')}))})});
    order.officialStockMovements=(res.movements||[]).map(m=>{const snap=items.find(x=>Number(x.product_id)===Number(m.product_id))||{};return {...m,snapshot:{internal_code:snap.internal_code,product_name:snap.product_name,color:snap.color,unit:snap.unit,cost:snap.cost,markup_percent:snap.markup_percent,price_cash:snap.price_cash,price_4x:snap.price_4x,price_18x:snap.price_18x}}});
    order.officialStockSnapshot=items.map(x=>clone(x));
    await reloadOfficialProducts();return {ok:true};
  }catch(e){return {ok:false,error:e.message||'Não foi possível baixar o estoque oficial.'}}
}
async function restoreOfficialStock(order){
  if(order?.officialStockRestored||!(order?.officialStockMovements||[]).length)return {ok:true};
  try{await api('prices',{method:'POST',body:JSON.stringify({action:'ESTORNAR_PEDIDO',order_number:order.numero,items:order.officialStockMovements.map(m=>({product_id:m.product_id,qty:m.qty}))})});order.officialStockRestored=true;await reloadOfficialProducts();return {ok:true}}catch(e){return {ok:false,error:e.message||'Não foi possível estornar o estoque oficial.'}}
}
function validateAndConsumeStock(q,order){
  // Durante a migração V11, tecidos e ferragens Wave já baixados em price_products não são baixados novamente no estoque legado.
  const officialIds=new Set(officialOrderRequirements(q).map(x=>Number(x.product_id)));
  const req=stockRequirements(q).filter(r=>{
    if(['TECIDO DE ACABAMENTO','TECIDO DE FORRO'].includes(canonicalProductType(r.type)))return false;
    if(['VARÃO WAVE 28','SUPORTE WAVE 28','TAMPA VARÃO WAVE 28'].includes(stockName(r.name)))return false;
    if(norm(r.name).startsWith('FITA WAVE')){const p=officialProductByName(r.name);if(p&&officialIds.has(Number(p.id)))return false}
    // Componentes já consumidos no estoque oficial (price_products) não podem ser
    // procurados/baixados novamente no estoque legado.
    const rn=norm(r.name);
    if(rn.includes('CORDAO WAVE')||rn.includes('CORDÃO WAVE'))return false;
    if(rn.includes('DESLIZANTE WAVE'))return false;
    if(rn.startsWith('TRILHO')||rn.includes('GARRA')||rn.includes('ACABAMENTO TRILHO')||rn.includes('TAMPA TRILHO'))return false;
    return true;
  }), grouped={};
  for(const r of req){const key=[norm(r.type),stockName(r.name),norm(r.color),norm(r.unit)].join('|');grouped[key]??={...r,qty:0};grouped[key].qty+=Number(r.qty||0)}
  for(const r of Object.values(grouped)){const p=findStockProduct(r.type,r.name,r.color,r.unit);if(!p)return {ok:false,error:`Produto de estoque não encontrado: ${r.name} / ${r.color}.`};if(Number(p.qty||0)+1e-9<r.qty)return {ok:false,error:`Estoque insuficiente de ${r.name} / ${r.color}. Necessário ${r.qty.toFixed(r.unit==='M'?2:0)} ${r.unit}; disponível ${Number(p.qty||0).toFixed(r.unit==='M'?2:0)} ${r.unit}.`}}
  order.stockMovements=[];
  for(const r of Object.values(grouped)){const p=findStockProduct(r.type,r.name,r.color,r.unit);p.qty=Number(p.qty||0)-r.qty;p.movements=p.movements||[];p.movements.push({id:uid(),date:today(),type:'SAÍDA POR PEDIDO',qty:-r.qty,balance:p.qty,unit:r.unit||p.unit,by:currentUsername(),reason:`Pedido ${order.numero||''} • ${r.environment||''}`});order.stockMovements.push({productId:p.id,type:r.type,name:r.name,color:r.color,qty:r.qty,unit:r.unit||p.unit})}
  return {ok:true};
}
function restoreOrderStock(order){if(order?.stockRestored)return;for(const m of order?.stockMovements||[]){const p=(db.products||[]).find(x=>x.id===m.productId)||findStockProduct(m.type,m.name,m.color,m.unit);if(p){p.qty=Number(p.qty||0)+Number(m.qty||0);p.movements=p.movements||[];p.movements.push({id:uid(),date:today(),type:'ESTORNO DE PEDIDO',qty:Number(m.qty||0),balance:p.qty,unit:m.unit||p.unit,by:currentUsername(),reason:`Estorno do pedido ${order.numero||''}`})}}order.stockRestored=true}
const STAGES=['RECEPÇÃO','CORTE','COSTURA','BARRA','PASSADORIA','EXPEDIÇÃO'];
const NAV=[
  ['commercialPanel','Painel Comercial','all'],['quote','Novo Orçamento','all'],['quotes','Orçamentos','all'],['clients','Clientes','sales'],['orders','Pedidos','all'],['agenda','Agenda','all'],['wholesaleDashboard','Dashboard Atacado','gestor'],['wholesaleClients','Clientes Atacado','gestor'],['wholesaleSale','Nova Venda','gestor'],['wholesaleOrders','Pedidos Atacado','gestor'],
  ['production','Produção','production'],['install','Instalações','all'],['rework','Retrabalho','all'],
  ['suppliers','Compras e Fornecedores','gestor'],['inventory','Estoque','gestor'],
  ['receivables','Contas a Receber','gestor'],['revenues','Receitas Totais','gestor'],['productionCosts','Custos de Instalação','gestor'],['sewingCost','Custo de Costura','gestor'],['results','Resultados dos Pedidos','gestor'],['hr','Departamento Pessoal','gestor'],['users','Usuários','gestor'],
  ['kpis','Dashboard Gestão','gestor'],['inspirations','Overview','gestor'],['npsResults','Resultado NPS','gestor'],['npsEvolution','Evolução NPS','gestor'],['payables','Contas a Pagar','gestor'],['monthlyClose','Fechamento Mensal','gestor'],['settings','Configurações','gestor'],['audit','Auditoria','gestor'],['backup','Backup','gestor'],['help','AJUDA','all']
];
const NAV_GROUPS=[
 {id:'commercial',label:'COMERCIAL',items:['commercialPanel','quote','quotes','clients','orders','agenda']},
 {id:'wholesale',label:'ATACADO',items:['wholesaleDashboard','wholesaleClients','wholesaleSale','wholesaleOrders']},
 {id:'operational',label:'OPERACIONAL',items:['production','install','rework']},
 {id:'stock',label:'COMPRAS E ESTOQUE',items:['suppliers','inventory']},
 {id:'management',label:'GESTÃO',items:['kpis','receivables','revenues','payables','productionCosts','sewingCost','results','monthlyClose','hr','users','settings','audit','backup']},
 {id:'nps',label:'NPS - CLIENTES',items:['npsResults','npsEvolution']},
 {id:'inspirations',label:'CONFIGURAÇÕES DO PORTAL',items:['inspirations']},
 {id:'help',label:'AJUDA',items:['help']}
];
let token=sessionStorage.getItem('novaV9Token')||'';
let currentUser=JSON.parse(sessionStorage.getItem('novaV9User')||'null');
let db={quotes:[],orders:[],clients:[],wholesaleClients:[],wholesaleSales:[],users:[],disabledUsers:[],products:[],suppliers:[],payables:[],purchaseOrders:[],reworks:[],agenda:[],purchaseAlerts:[],auditLog:[],attachments:[],customerFeedback:[],discountApprovals:[],userAlerts:[],inspirations:[],blogPosts:[],candidates:[],jobs:[],priceConfig:clone(DEFAULT_PRICE_CONFIG),settings:{}};
let wholesaleDraft={clientId:'',date:today(),termDays:28,dueDate:'',items:[]};
let draft={numero:null,client:'',date:today(),address:'',street:'',number:'',complement:'',neighborhood:'',cep:'',document:'',contact:'',seller:'',sellerUser:'',travel:0,discountPercent:0,discountReason:'',environments:[],blinds:[],looseProducts:[]};
let quoteEditingEnvironmentId=null;
let quoteExcludeFixation=false;
let editingClientId=null;
let priceProducts=[];
let selectedPriceProductIds=new Set();
let homeClockTimer=null;
let stockSort={key:'internal_code',dir:1};

async function sha256(text){const data=new TextEncoder().encode(String(text));const digest=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function api(path,options={}){const r=await fetch('/api/'+path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Falha na comunicação com a nuvem.');return j}
function cloud(msg,warn=false){const e=$('cloudStatus');if(!e)return;e.textContent=msg;e.className='cloud'+(warn?' warn':'')}
function isGestor(){return norm(currentUser?.role)==='GESTOR'||['ERIC.DELGOBO','LUIZ.SERGIO','GESTOR'].includes(currentUsername())}
function isProduction(){return currentUser?.role==='production'}
function currentUsername(){return norm(currentUser?.username)}
function permissionKeys(){return NAV.map(x=>x[0])}
function userPermissionRecord(username){const key=norm(username);const base=[...DEFAULT_USERS,...(db.users||[])].find(x=>norm(x.username)===key)||currentUser||{};const profile=db.settings?.builtInUserProfiles?.[key]||{};const override=db.settings?.userPermissions?.[key];return {...base,...profile,permissions:Array.isArray(override)?override:(base.permissions||null)}}
function hasPermission(area){if(area==='help')return true;if(area==='commercialPanel'){const r=norm(userPermissionRecord(currentUsername()).role);return isGestor()||['SALES','PARTNER'].includes(r);}if(isGestor())return true;const u=userPermissionRecord(currentUsername());if(Array.isArray(u.permissions))return u.permissions.includes('*')||u.permissions.includes(area);if(u.role==='production')return ['orders','production','install'].includes(area);if(u.role==='sales')return ['quote','quotes','clients','orders','install'].includes(area);return false}
function allUsers(){const disabled=new Set((db.disabledUsers||[]).map(norm));return [...DEFAULT_USERS,...(db.users||[])].filter((u,i,a)=>a.findIndex(x=>norm(x.username)===norm(u.username))===i).map(u=>({...u,...(db.settings?.builtInUserProfiles?.[norm(u.username)]||{})})).filter(u=>!disabled.has(norm(u.username)))}
function sellerName(username){return allUsers().find(u=>norm(u.username)===norm(username))?.name||username||'-'}
function sellerCommission(username){return Number(allUsers().find(u=>norm(u.username)===norm(username))?.commission ?? db.priceConfig.commissionDefault ??5)}
function canSeeQuote(q){return isGestor()||isProduction()||resolveSellerUser(q)===currentUsername()}
function canSeeOrder(o){return isGestor()||isProduction()||resolveSellerUser(o)===currentUsername()}
function mergeConfig(c){const base=clone(DEFAULT_PRICE_CONFIG);if(!c)return base;for(const k of Object.keys(c)){if(c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k])&&base[k]&&typeof base[k]==='object'&&!Array.isArray(base[k]))base[k]={...base[k],...c[k]};else base[k]=c[k]}return base}
function suggestedInstallDate(baseDate=today()){const d=new Date(String(baseDate||today())+'T12:00:00');d.setDate(d.getDate()+30);return d.toISOString().slice(0,10)}
function installPrice(heightM,widthM){const h=Number(heightM||0),w=Number(widthM||0);const m=db.priceConfig?.installationMatrix||DEFAULT_PRICE_CONFIG.installationMatrix;const band=h<=Number(m.simple?.maxH??3.5)?m.simple:h<=Number(m.double?.maxH??5.5)?m.double:m.high;const key=w<=4?'up4':w<=5?'up5':'up6';return Number(band?.[key]||0)}
async function ensureCordaoWaveOfficial(){return true}
async function ensureV115Accessories(){if(!isGestor())return;try{await api('prices',{method:'POST',body:JSON.stringify({action:'SINCRONIZAR_V115_ACESSORIOS'})});const prices=await api('prices');priceProducts=Array.isArray(prices.products)?prices.products:priceProducts}catch(e){console.error('Falha ao sincronizar acessórios V11.5:',e)}}
async function loadCloud(){try{cloud('Sincronizando...');const j=await api('data');db={...db,...j,priceConfig:mergeConfig(j.priceConfig)};db.wholesaleClients=db.wholesaleClients||[];db.wholesaleSales=db.wholesaleSales||[];db.auditLog=db.auditLog||[];db.attachments=db.attachments||[];db.customerFeedback=db.customerFeedback||[];db.discountApprovals=db.discountApprovals||[];db.userAlerts=db.userAlerts||[];db.blogPosts=db.blogPosts||[];db.settings=db.settings||{};let accessCodesAdded=false;if(isGestor()){for(const o of db.orders||[]){if(!/^\d{6}$/.test(String(o.clientAccessCode||''))){o.clientAccessCode=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');accessCodesAdded=true}}}const before=(db.products||[]).length;ensureInitialInventory();try{const prices=await api('prices');priceProducts=Array.isArray(prices.products)?prices.products:[];await ensureCordaoWaveOfficial();await ensureOfficialRailClaws();await ensureV115Accessories();await ensureV12BlackoutWide()}catch(e){priceProducts=[];console.error('Falha ao carregar price_products:',e)}cloud('Dados sincronizados na nuvem');renderAll();if((db.products||[]).length!==before||accessCodesAdded)queueSave()}catch(e){cloud('Sem conexão com a nuvem',true);alert(e.message)}}
let saveTimer=null;function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveCloud,250)}
async function saveCloud(){if(!token)return;try{cloud('Salvando...');const j=await api('data',{method:'POST',body:JSON.stringify(db)});db.updatedAt=j.updatedAt;cloud('Dados salvos na nuvem')}catch(e){cloud('Falha ao salvar',true);alert('Não foi possível salvar: '+e.message)}}

function renderNav(){const nav=$('nav');if(!nav)return;nav.innerHTML='';if(!$('accordionNavStyle')){const st=document.createElement('style');st.id='accordionNavStyle';st.textContent='.nav-group{border-bottom:1px solid #e5efed}.nav-group-title{width:100%;border:0;background:transparent;text-align:left;padding:12px 10px;font-weight:850;color:#075b5b;display:flex;justify-content:space-between;align-items:center}.nav-group-title:hover{background:#eef7f5}.nav-group-items{display:none;padding:0 0 7px 8px}.nav-group.open .nav-group-items{display:grid;gap:4px}.nav-group-items .nav-btn{padding:9px 10px;font-size:13px}.nav-group-title .chev{transition:.15s}.nav-group.open .chev{transform:rotate(90deg)}';document.head.appendChild(st)}const visible=new Set(NAV.filter(x=>hasPermission(x[0])).map(x=>x[0]));let openId=sessionStorage.getItem('novaV11NavGroup')||'';for(const g of NAV_GROUPS){const ids=g.items.filter(id=>visible.has(id));if(!ids.length)continue;const wrap=document.createElement('div');wrap.className='nav-group'+(g.id===openId?' open':'');const head=document.createElement('button');head.type='button';head.className='nav-group-title';head.innerHTML=`<span>${g.label}</span><span class="chev">▶</span>`;const items=document.createElement('div');items.className='nav-group-items';for(const id of ids){const item=NAV.find(x=>x[0]===id);const b=document.createElement('button');b.className='nav-btn';b.dataset.view=id;b.textContent=item[1];b.onclick=()=>setView(id);items.appendChild(b)}head.onclick=()=>{const opening=!wrap.classList.contains('open');nav.querySelectorAll('.nav-group').forEach(x=>x.classList.remove('open'));if(opening){wrap.classList.add('open');sessionStorage.setItem('novaV11NavGroup',g.id)}else sessionStorage.removeItem('novaV11NavGroup')};wrap.append(head,items);nav.appendChild(wrap)}}
function setView(id){if(id!=='home'&&!hasPermission(id))return alert('Seu usuário não possui permissão para acessar esta área.');document.querySelectorAll('.view').forEach(v=>v.classList.remove('active','print-target'));$('view-'+id)?.classList.add('active');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',id!=='home'&&b.dataset.view===id));if(id==='home')renderHome();if(id==='commercialPanel')renderCommercialPanel();if(id==='wholesaleDashboard')renderWholesaleDashboard();if(id==='wholesaleClients')renderWholesaleClients();if(id==='wholesaleSale')renderWholesaleSale();if(id==='wholesaleOrders')renderWholesaleOrders();if(id==='kpis')renderKpis();if(id==='results')renderResults();if(id==='productionCosts')renderProductionCosts();if(id==='sewingCost')renderSewingCost();if(id==='help')renderHelp();if(id==='pricing')renderPricing();if(id==='hr')renderHR();if(id==='receivables')renderReceivables();if(id==='revenues')renderRevenues();if(id==='settings')renderSettings();if(id==='audit')renderAudit();if(id==='monthlyClose')renderMonthlyClose();if(id==='npsResults')renderNpsResults();if(id==='npsEvolution')renderNpsEvolution()}
function renderHome(){renderPurchaseAlerts();renderDiscountApprovalAlerts();renderAgendaHome();renderUserHomeAlerts();const name=currentUser?.name||currentUser?.username||'USUÁRIO';if($('homeWelcome'))$('homeWelcome').textContent=`BEM-VINDO - ${String(name).toUpperCase()}`;const quotes=[['No longo prazo, estaremos todos mortos.','John Maynard Keynes'],['O consumo é o único fim e propósito de toda produção.','Adam Smith'],['Nada é tão permanente quanto um programa temporário do governo.','Milton Friedman'],['A dificuldade não está nas novas ideias, mas em escapar das antigas.','John Maynard Keynes'],['A liberdade econômica é requisito essencial da liberdade política.','Milton Friedman'],['A riqueza não consiste em possuir grandes bens, mas em ter poucas necessidades.','Epicteto — filosofia econômica clássica']];const q=quotes[Math.floor(Math.random()*quotes.length)];if($('homeQuote'))$('homeQuote').textContent='“'+q[0]+'”';if($('homeQuoteAuthor'))$('homeQuoteAuthor').textContent='— '+q[1];const tick=()=>{const now=new Date();if($('homeDate'))$('homeDate').textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});if($('homeTime'))$('homeTime').textContent=now.toLocaleTimeString('pt-BR')};tick();if(homeClockTimer)clearInterval(homeClockTimer);homeClockTimer=setInterval(tick,1000)}
function goHome(){setView('home')}
function renderAll(){renderHome();renderNav();renderCommercialPanel();renderQuote();renderQuotes();renderClients();renderWholesaleDashboard();renderWholesaleClients();renderWholesaleSale();renderWholesaleOrders();renderOrders();renderAgenda();renderProduction();renderInstall();renderProducts();renderProductionCosts();renderPricing();renderKpis();renderPayables();renderResults();renderReceivables();renderRevenues();renderSuppliers();renderPurchases();renderHR();renderReworks();renderUsers();renderAudit();renderNpsResults();renderNpsEvolution();}

function fillSelect(el,items,selected){el.innerHTML=items.map(x=>`<option ${x===selected?'selected':''}>${esc(x)}</option>`).join('')}
function stockOptions(type){return (db.products||[]).filter(p=>p.stockManaged&&canonicalProductType(p.type)===canonicalProductType(type)&&Number(p.qty||0)>0)}
function uniqueSorted(a){return [...new Set(a.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'))}
function setSelectOptions(el,items,preferred){if(!el)return;const old=preferred??el.value;const vals=uniqueSorted(items);el.innerHTML=vals.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(vals.includes(old))el.value=old;else if(vals.length)el.value=vals[0]}
// V11: catálogo oficial do orçamento vem de price_products. A baixa de estoque continua separada nesta etapa.
function officialQuoteProducts(category){return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.category)===norm(category))}
function quoteFabricName(p){
  let n=norm(p?.product_name||'');
  if(n==='LINHO 300 CM SINTÉTICO'||n==='LINHO SINTÉTICO WIDE 330 CM')return 'LINHO SINTÉTICO';
  if(n==='LINHO 300CM COMPOSTO 6%'||n==='LINHO 6% WIDE 330 CM')return 'LINHO COMPOSTO 6%';
  if(n==='FORRO LEVE'||n==='FORRO LEVE WIDE 330')return 'FORRO LEVE';
  if(n==='BLACKOUT 100% WIDE')return 'BLACKOUT 100% LEVE';
  // Agrupa variações do mesmo tecido por largura (ex.: BLACKOUT 280/320 CM).
  return n.replace(/\s+WIDE\b/g,'').replace(/\s+\d{3}\s*CM\b/g,'').replace(/\s+/g,' ').trim();
}
function officialFabricWidthCm(p){
  const w=Number(p?.width_cm||0);if(w>0)return w;
  const n=norm(p?.product_name||'');const m=n.match(/(\d{3})\s*CM/);if(m)return Number(m[1]);
  if(n.includes('WIDE')&&n.includes('330'))return 330;
  return 300;
}
async function ensureV12BlackoutWide(){try{const r=await api('prices',{method:'POST',body:JSON.stringify({action:'SINCRONIZAR_BLACKOUT_WIDE'})});if(Number(r?.created||0)>0||r?.updated){const prices=await api('prices');priceProducts=Array.isArray(prices.products)?prices.products:priceProducts}return r}catch(e){console.error('Falha ao sincronizar Blackout Wide:',e);return null}}
function resolveOfficialFabric(category,name,color,heightCm){
  let list=officialQuoteProducts(category).filter(p=>quoteFabricName(p)===norm(name)&&norm(p.color)===norm(color));
  // BLACKOUT 100%: abaixo de 275 cm usa o comum; de 275 a 310 cm usa WIDE 320 cm; acima disso entra por alturas.
  if(category==='TECIDO DE FORRO'&&norm(name)==='BLACKOUT 100% LEVE'){
    const all=officialQuoteProducts(category).filter(p=>['BLACKOUT 100% LEVE','BLACKOUT 100% WIDE'].includes(norm(p.product_name))&&norm(p.color)===norm(color));
    const h=Number(heightCm||0);const wide=all.find(p=>norm(p.product_name)==='BLACKOUT 100% WIDE');const common=all.find(p=>norm(p.product_name)==='BLACKOUT 100% LEVE');
    if(h>=275&&h<=310&&wide)return wide;if(h<275&&common)return common;if(h>310&&common)return common;list=all.length?all:list;
  }
  if(!list.length)return null;
  const required=Number(heightCm||0)+25;
  const ordered=[...list].sort((a,b)=>officialFabricWidthCm(a)-officialFabricWidthCm(b));
  return ordered.find(p=>officialFabricWidthCm(p)>=required)||ordered[ordered.length-1]||null;
}
function refreshFinishColors(){const name=$('eFinish')?.value;setSelectOptions($('eFinishColor'),officialQuoteProducts('TECIDO DE ACABAMENTO').filter(p=>quoteFabricName(p)===norm(name)).map(p=>p.color),$('eFinishColor')?.value)}
function refreshLiningColors(){const name=$('eLining')?.value;setSelectOptions($('eLiningColor'),officialQuoteProducts('TECIDO DE FORRO').filter(p=>quoteFabricName(p)===norm(name)).map(p=>p.color),$('eLiningColor')?.value)}
function fixationColors(kind){
  if(String(kind||'').startsWith('VARÃO WAVE')){
    const rod=stockOptions('ACESSÓRIOS').filter(p=>stockName(p.name)==='VARÃO WAVE 28').map(p=>norm(p.color));
    const sup=stockOptions('ACESSÓRIOS').filter(p=>stockName(p.name)==='SUPORTE WAVE 28').map(p=>norm(p.color));
    const cap=stockOptions('ACESSÓRIOS').filter(p=>stockName(p.name)==='TAMPA VARÃO WAVE 28').map(p=>norm(p.color));
    return rod.filter(c=>sup.includes(c)&&cap.includes(c));
  }
  if(kind==='TRILHO MOTORIZADO')return ['BRANCO','PRETO'];
  if(String(kind||'').startsWith('TUBO '))return ['IMBUIA','PRATA ESCOVADO','CROMADO','BRANCO','MARFIM'];
  return [];
}
function refreshSwissRailProducts(){
  const sel=$('eRailProduct'),wrap=$('eRailProductWrap'),colorWrap=$('eFixColorWrap'),kind=$('eFixation')?.value;
  if(!sel)return;
  const swiss=kind==='TRILHO SUÍÇO';if(wrap)wrap.classList.toggle('hidden',!swiss);if(colorWrap)colorWrap.classList.toggle('hidden',swiss);
  if(!swiss)return;
  const old=sel.value;const rails=officialSwissRails();sel.innerHTML='<option value="">SELECIONE O TIPO DE TRILHO</option>'+rails.map(p=>`<option value="${p.id}">${esc(p.product_name)} • ${esc(p.color||'SEM COR')} • ${esc(p.internal_code||'-')} • ${money(p.price_4x||0)}/m • estoque ${Number(p.stock_quantity||0).toFixed(2)} ${esc(p.unit||'M')}</option>`).join('');
  if([...sel.options].some(o=>o.value===old))sel.value=old;else{const def=rails.find(p=>norm(p.product_name).includes('DUPLO ESPAÇADO')&&norm(p.color)==='BRANCO');if(def)sel.value=String(def.id)}
}
function refreshFixColors(){
  const kind=$('eFixation')?.value;refreshSwissRailProducts();
  if(kind!=='TRILHO SUÍÇO')setSelectOptions($('eFixColor'),fixationColors(kind),$('eFixColor')?.value);
}
function setupSelectors(){
  setSelectOptions($('eFinish'),officialQuoteProducts('TECIDO DE ACABAMENTO').map(quoteFabricName),$('eFinish')?.value);refreshFinishColors();
  setSelectOptions($('eLining'),officialQuoteProducts('TECIDO DE FORRO').map(quoteFabricName),$('eLining')?.value);refreshLiningColors();
  fillSelect($('eFinishPleat'),['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'],'WAVE');fillSelect($('eLiningPleat'),['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'],'FRANZIDO SUÍÇO');fillSelect($('eFinishGather'),['1.5','2.0','2.5','3.0','3.5','4.0'],'3.0');fillSelect($('eLiningGather'),['1.5','2.0','2.5','3.0','3.5','4.0'],'2.0');
  const fix=[];if(officialSwissRails().length)fix.push('TRILHO SUÍÇO');if(fixationColors('VARÃO WAVE').length){fix.push('VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA')}fix.push('TUBO 19 MM','TUBO 28 MM','TRILHO MOTORIZADO');setSelectOptions($('eFixation'),fix,$('eFixation')?.value);refreshFixColors();applyPleatGatherRules();updateModelFields();
}
function applyPleatGatherRules(){[['eFinishPleat','eFinishGather'],['eLiningPleat','eLiningGather']].forEach(([pid,gid])=>{const pleat=$(pid),gather=$(gid);if(!pleat||!gather)return;const locked=pleat.value==='SOBREPOSTO';if(locked)gather.value='4.0';gather.disabled=locked;gather.title=locked?'Prega sobreposta exige franzimento mínimo/fixo de 4,0:1':''})}
function updateModelFields(){const m=$('eModel').value;document.querySelectorAll('.finish-field').forEach(x=>x.classList.toggle('hidden',m==='LINING'));document.querySelectorAll('.lining-field').forEach(x=>x.classList.toggle('hidden',m==='FINISH'));document.querySelectorAll('.choice').forEach(x=>x.classList.toggle('active',x.dataset.model===m));updatePreview()}
function fabricCalc(type,name,widthM,heightM,gather,productId,color){const category=type==='finish'?'TECIDO DE ACABAMENTO':'TECIDO DE FORRO';const hCm=heightM*100;let sku=(priceProducts||[]).find(p=>Number(p.id)===Number(productId));if(!sku)sku=resolveOfficialFabric(category,name,color,hCm);if(!sku)return null;const gathered=widthM*Number(gather);const fabricWidth=officialFabricWidthCm(sku);let mode='LARGURA',panels=0,cutLength=0,consumption=gathered;if(hCm+25>fabricWidth){mode='ALTURA';cutLength=heightM+0.10+(heightM*0.10);panels=Math.ceil(gathered/(fabricWidth/100));consumption=panels*cutLength}const unitPrice=Number(sku.price_4x||0);return {name,gathered,mode,panels,cutLength,consumption,unitPrice,pricePct:0,cost:consumption*unitPrice,productId:sku.id,internalCode:sku.internal_code,officialName:sku.product_name,fabricWidthCm:fabricWidth}}
function fixationCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){const c=db.priceConfig;
  const swissBase=()=>{const rounded=Math.max(1.5,Math.ceil(widthM*2)/2);const tier=(c.swiss.tiers||[]).find(t=>rounded<=Number(t.m))||c.swiss.tiers[c.swiss.tiers.length-1];const clamps=Math.max(2,Math.ceil(widthM/0.5));const ends=2;const base=Number(tier?.p||0)+clamps*Number(c.swiss.clamp||0)+ends*Number(c.swiss.end||0);return {rounded,clamps,ends,base}};
  if(kind==='TRILHO SUÍÇO'){const rail=officialProductById(railProductId);const railName=norm(rail?.product_name||'');const simpleRail=railName===norm('TRILHO SIMPLES')||railName===norm('TRILHO SIMPLES ALTO');const meters=(model==='COMPLETE'&&simpleRail)?widthM*2:widthM;const clamps=Math.max(2,Math.ceil(widthM/0.60));const ends=2;const railUnit=Number(rail?.price_4x||0);const claw=officialRailClaw(rail);const cap=officialProductLike(['TAMPA','TRILHO'],rail?.color||'')||officialProductLike(['ACABAMENTO','TRILHO'],rail?.color||'');const total=meters*railUnit+clamps*Number(claw?.price_4x||0)+ends*Number(cap?.price_4x||0);return {kind,meters,clamps,ends,railProductId:rail?.id||null,railInternalCode:rail?.internal_code||'',railName:rail?.product_name||'TRILHO SUÍÇO',railColor:rail?.color||'',hardwareBase:total,total,detail:`${rail?.product_name||'Selecione o trilho'} • ${meters.toFixed(2)}m • ${clamps} garras • ${ends} tampas`}}
  if(kind==='TRILHO MOTORIZADO'){const x=swissBase(),complete=model==='COMPLETE';const fixed=Number(complete?(c.motor.baseComplete??3500):(c.motor.baseSingle??2000));const pct=Number(complete?(c.motor.completePct??25):(c.motor.singlePct??15));const total=fixed+x.base*(1+pct/100);return {kind,meters:x.rounded,clamps:x.clamps,ends:x.ends,hardwareBase:x.base,total,detail:`Base trilho suíço duplo espaçado ${x.rounded.toFixed(1)}m • motor ${money(fixed)} + ${pct}% do sistema`}}
  const multiplier=model==='COMPLETE'?2:1;const rodMeters=widthM*multiplier;const supports=widthM<=2?2:widthM<=3.5?3:widthM<=4.5?4:5;const ends=model==='COMPLETE'?4:2;const isTube=String(kind||'').startsWith('TUBO ');const tubeSize=kind.includes('19')?'19':'28';const mat=norm(supportMaterial)==='PVC'?'PVC':'ALUMINIO';const supportName=isTube?(model==='COMPLETE'?`SUPORTE 19/28 ${mat}`:`SUPORTE ${tubeSize}MM ${mat}`):(model==='COMPLETE'?'SUPORTE 28/28':'SUPORTE WAVE 28');const supportSku=(priceProducts||[]).find(p=>Number(p.active??1)===1&&norm(p.category).includes('ACESS')&&norm(p.product_name)===norm(supportName)&&norm(p.color)===norm(fixColor||''));const capName=isTube?`TAMPA PARA TUBO EM ALUMINIO ${tubeSize}MM`:'';const capSku=isTube?officialProductByName(capName,fixColor):null;const supportUnit=supportSku?Number(supportSku.price_4x||0):Number(c.wave.support||0);const rodUnit=isTube?0:Number(c.wave.rodPerMeter||0);const capUnit=capSku?Number(capSku.price_4x||0):Number(c.wave.end||0);const base=rodMeters*rodUnit+supports*supportUnit+ends*capUnit;let total=base;if(kind.includes('COMANDO'))total=base*(1+Number(c.cordPct||0)/100);return {kind,meters:rodMeters,supports,ends,supportName,supportProductId:supportSku?.id||null,supportInternalCode:supportSku?.internal_code||'',capName,capProductId:capSku?.id||null,hardwareBase:base,total,detail:`${rodMeters.toFixed(2)}m • ${supports} ${supportName.toLowerCase()} • ${ends} tampas${isTube?' • tubo sem preço cadastrado':''}`}}

function calcEnvironment(e){
  const w=Number(e.width)/100,h=Number(e.height)/100,leaves=Number(e.leaves||1);
  if(!w||!h)return null;
  const finish=e.model!=='LINING'?fabricCalc('finish',e.finish,w,h,e.finishGather,e.finishProductId,e.finishColor):null;
  const lining=e.model!=='FINISH'?fabricCalc('lining',e.lining,w,h,e.liningGather,e.liningProductId,e.liningColor):null;
  const layers=[finish,lining].filter(Boolean).length;
  const lateral=h*2*leaves*layers;
  const bars=(finish?.gathered||0)+(lining?.gathered||0);
  const sewingMeters=lateral+bars;
  const sewingCost=sewingMeters*Number(db.priceConfig.sewingPerMeter||0);
  const finishPleat=finish?finish.consumption*Number(db.priceConfig.pleatLabor[e.finishPleat]||0):0;
  const liningPleat=lining?lining.consumption*Number(db.priceConfig.pleatLabor[e.liningPleat]||0):0;
  const customPleat=Number(e.customPleat||0);
  let sliderQtyPerLayer=Math.floor(Number(e.width)/Number(db.priceConfig.sliders.spacingCm||5));
  if(sliderQtyPerLayer%2!==0)sliderQtyPerLayer=Math.max(0,sliderQtyPerLayer-1);
  let finishSliders=finish?sliderQtyPerLayer:0,liningSliders=lining?sliderQtyPerLayer:0;
  if(finish&&lining){
    const totalRaw=Number(e.width)/3;
    const totalRounded=Math.ceil(totalRaw/4)*4;
    const finishUsesWave=e.finishPleat==='WAVE';
    const liningUsesWave=e.liningPleat==='WAVE';
    if(finishUsesWave&&!liningUsesWave){finishSliders=totalRounded;liningSliders=0}
    else if(!finishUsesWave&&liningUsesWave){finishSliders=0;liningSliders=totalRounded}
    else{finishSliders=totalRounded/2;liningSliders=totalRounded/2}
  }
  const accessoryFor=(pleat,calc)=>{
    if(!calc)return {qty:0,cost:0,name:'',labor:0};
    const gatheredCm=Number(calc.gathered||0)*100;let name='',spacing=0,laborUnit=0,header=0;
    if(pleat==='FRANZIDO COM ARGOLAS 19MM'){name='ARGOLA 19MM';spacing=7;laborUnit=1.20}
    else if(pleat==='FRANZIDO COM ARGOLAS 29MM'){name='ARGOLA 29MM';spacing=7;laborUnit=1.20}
    else if(pleat==='ILHÓS REDONDO'){name='ILHOS REDONDO';spacing=14;laborUnit=1.50;header=Number(calc.gathered||0)*9}
    else if(pleat==='ILHÓS QUADRADO'){name='ILHOS QUADRADO';spacing=14;laborUnit=1.50;header=Number(calc.gathered||0)*9}
    else return {qty:0,cost:0,name:'',labor:0};
    let qty=Math.ceil(gatheredCm/spacing);if(qty%2)qty++;
    const sku=officialProductByName(name,e.fixColor)||officialProductLike(name.split(' '),e.fixColor);
    return {qty,name,productId:sku?.id||null,unitPrice:Number(sku?.price_4x||0),cost:qty*Number(sku?.price_4x||0),labor:qty*laborUnit+header}
  };
  const finishAccessory=accessoryFor(e.finishPleat,finish),liningAccessory=accessoryFor(e.liningPleat,lining);
  const accessoryCost=finishAccessory.cost+liningAccessory.cost;
  const accessoryLabor=finishAccessory.labor+liningAccessory.labor;
  const sliderCost=finishSliders*Number(db.priceConfig.sliders.finish||0)+liningSliders*Number(db.priceConfig.sliders.lining||0);
  const rawFixation=fixationCalc(e.fixation,w,e.model,leaves,e.fixColor,e.railProductId,e.supportMaterial);
  const rawInstall=installPrice(h,w);
  const excluded=!!e.excludeFixation;
  const fixation=excluded?{...rawFixation,total:0,hardwareBase:0,detail:'FIXAÇÃO EXCLUÍDA'}:rawFixation;
  const install=excluded?0:rawInstall;
  const laborTotal=sewingCost+finishPleat+liningPleat+customPleat+accessoryLabor+install;
  const base4=(finish?.cost||0)+(lining?.cost||0)+sliderCost+accessoryCost+fixation.total+laborTotal;
  const p18=base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);
  const cash=base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);
  return {...e,finishCalc:finish,liningCalc:lining,lateral,bars,sewingMeters,sewingCost,finishPleat,liningPleat,sliderQtyPerLayer,finishSliders,liningSliders,sliderCost,finishAccessory,liningAccessory,accessoryCost,accessoryLabor,fixationCalc:fixation,installCost:install,laborTotal,base4,p18,cash,alerts:[finish?.mode==='ALTURA'?'ACABAMENTO POR ALTURA':'',lining?.mode==='ALTURA'?'FORRO POR ALTURA':'',finish?.pricePct?`LINHO SINTÉTICO +${finish.pricePct}%`:''].filter(Boolean)}
}
function envFromForm(){
  applyPleatGatherRules();
  const height=Number($('eHeight').value),finish=$('eFinish').value,finishColor=$('eFinishColor').value,lining=$('eLining').value,liningColor=$('eLiningColor').value;
  const finishSku=resolveOfficialFabric('TECIDO DE ACABAMENTO',finish,finishColor,height),liningSku=resolveOfficialFabric('TECIDO DE FORRO',lining,liningColor,height);
  return {
    id:uid(),name:$('eName').value.trim(),width:Number($('eWidth').value),height,leaves:Number($('eLeaves').value),
    model:$('eModel').value,finish,finishColor,finishProductId:finishSku?.id||null,finishInternalCode:finishSku?.internal_code||'',finishOfficialName:finishSku?.product_name||'',
    lining,liningColor,liningProductId:liningSku?.id||null,liningInternalCode:liningSku?.internal_code||'',liningOfficialName:liningSku?.product_name||'',
    finishPleat:$('eFinishPleat').value,finishGather:$('eFinishGather').value,liningPleat:$('eLiningPleat').value,liningGather:$('eLiningGather').value,
    fixation:$('eFixation').value,
    fixColor:$('eFixation').value==='TRILHO SUÍÇO'?(officialProductById($('eRailProduct')?.value)?.color||''):$('eFixColor').value,
    railProductId:$('eFixation').value==='TRILHO SUÍÇO'?Number($('eRailProduct')?.value||0)||null:null,
    railInternalCode:$('eFixation').value==='TRILHO SUÍÇO'?(officialProductById($('eRailProduct')?.value)?.internal_code||''):'',
    railProductName:$('eFixation').value==='TRILHO SUÍÇO'?(officialProductById($('eRailProduct')?.value)?.product_name||''):'',
    supportMaterial:$('eSupportMaterial')?.value||'ALUMINIO',customPleat:Number($('eCustomPleat').value||0),notes:$('eNotes').value.trim(),
    excludeFixation:!!quoteExcludeFixation
  }
}
function updatePreview(){
  const e=envFromForm();
  if(!e.name||!e.width||!e.height){$('calcPreview').innerHTML='Preencha ambiente, medidas e configuração para visualizar o cálculo.';return}
  const c=calcEnvironment(e);if(!c)return;
  const f=c.finishCalc,l=c.liningCalc;
  $('calcPreview').innerHTML=`<strong>${esc(e.name)}</strong>${c.alerts.length?` <span class="badge warn">${esc(c.alerts.join(' • '))}</span>`:''}${e.excludeFixation?' <span class="badge warn">FIXAÇÃO EXCLUÍDA</span>':''}<div class="detail-list"><div class="detail-item"><span>Acabamento</span><strong>${f?`${f.consumption.toFixed(2)}m • ${money(f.cost)}`:'—'}</strong></div><div class="detail-item"><span>Forro</span><strong>${l?`${l.consumption.toFixed(2)}m • ${money(l.cost)}`:'—'}</strong></div><div class="detail-item"><span>Costura</span><strong>${c.sewingMeters.toFixed(2)}m • ${money(c.sewingCost)}</strong></div><div class="detail-item"><span>Deslizantes</span><strong>${c.finishSliders+c.liningSliders} un • ${money(c.sliderCost)}</strong></div><div class="detail-item"><span>Fixação</span><strong>${e.excludeFixation?'EXCLUÍDA':money(c.fixationCalc.total)}</strong></div><div class="detail-item"><span>Mão de obra total</span><strong>${money(c.laborTotal)}</strong></div></div><div class="price-strip"><div class="price-box"><span>18x</span><strong>${money(c.p18)}</strong></div><div class="price-box"><span>4x</span><strong>${money(c.base4)}</strong></div><div class="price-box"><span>À vista</span><strong>${money(c.cash)}</strong></div><div class="price-box"><span>Fixação</span><strong>${esc(c.fixationCalc.detail)}</strong></div></div>`
}
function clearEnv(){
  ['eName','eWidth','eHeight','eNotes'].forEach(id=>$(id).value='');
  $('eCustomPleat').value=0;
  quoteEditingEnvironmentId=null;
  quoteExcludeFixation=false;
  if($('addEnvBtn'))$('addEnvBtn').textContent='+ Adicionar ambiente';
  applyEnvironmentFixationUI();
  updatePreview()
}

function applyEnvironmentFixationUI(){
  const ids=['eFixationWrap','eRailProductWrap','eFixColorWrap','eSupportMaterialWrap','eFinishTubeWrap','eLiningTubeWrap','eMotorAngleWrap'];
  ids.forEach(id=>{
    const el=$(id);if(!el)return;
    if(quoteExcludeFixation){
      if(el.dataset.preExcludeDisplay===undefined)el.dataset.preExcludeDisplay=el.style.display||'';
      el.style.display='none';
    }else{
      el.style.display=el.dataset.preExcludeDisplay||'';
    }
  });
  const b=$('toggleEnvFixBtn');
  if(b){b.textContent=quoteExcludeFixation?'RESTAURAR FIXAÇÃO':'EXCLUIR FIXAÇÃO';b.className='btn '+(quoteExcludeFixation?'danger':'secondary')}
}

function loadEnvironmentForEdit(e){
  if(!e)return;
  quoteEditingEnvironmentId=e.id;
  quoteExcludeFixation=!!e.excludeFixation;
  const set=(id,v)=>{const el=$(id);if(el&&v!==undefined&&v!==null)el.value=String(v)};
  set('eModel',e.model);try{updateModelFields()}catch(_){}
  set('eName',e.name);set('eWidth',e.width);set('eHeight',e.height);set('eLeaves',e.leaves);
  set('eFinish',e.finish);try{refreshFinishColors()}catch(_){}set('eFinishColor',e.finishColor);set('eFinishPleat',e.finishPleat);set('eFinishGather',e.finishGather);
  set('eLining',e.lining);try{refreshLiningColors()}catch(_){}set('eLiningColor',e.liningColor);set('eLiningPleat',e.liningPleat);set('eLiningGather',e.liningGather);
  set('eFixation',e.fixation);try{refreshFixColors()}catch(_){};try{typeof v12RefreshFixations==='function'&&v12RefreshFixations()}catch(_){}
  set('eRailProduct',e.railProductId||'');set('eFixColor',e.fixColor);set('eSupportMaterial',e.supportMaterial||'ALUMINIO');
  set('eFinishBar',e.finishBar||'BARRA SIMPLES');set('eSoutacheColor',e.soutacheColor||'');set('eCustomPleat',e.customPleat||0);set('eNotes',e.notes||'');
  if($('eAngle')){$('eAngle').checked=!!e.angle;try{$('eAngle').dispatchEvent(new Event('change',{bubbles:true}))}catch(_){}}
  set('eAngleA',e.angleA||'');set('eAngleAHeight',e.angleAHeight||'');set('eAngleB',e.angleB||'');set('eAngleBHeight',e.angleBHeight||'');set('eMotorAngleMode',e.motorAngleMode||'CURVA');
  if($('addEnvBtn'))$('addEnvBtn').textContent='SALVAR EDIÇÕES';
  applyEnvironmentFixationUI();
  updatePreview();
  $('eName')?.scrollIntoView({behavior:'smooth',block:'center'})
}
function ensureSellerControl(){const old=$('qSeller');if(!old||old.tagName==='SELECT')return;const sel=document.createElement('select');sel.id='qSeller';sel.className=old.className;old.replaceWith(sel)}
function refreshSellerControl(preferred=''){ensureSellerControl();const el=$('qSeller');if(!el)return;const active=allUsers().filter(u=>['sales','gestor'].includes(u.role));el.innerHTML=active.map(u=>`<option value="${esc(u.username)}">${esc(u.name||u.username)}</option>`).join('');const wanted=norm(preferred||draft.sellerUser||currentUser?.username);if([...el.options].some(o=>norm(o.value)===wanted))el.value=wanted;else if(el.options.length)el.selectedIndex=0;el.disabled=!isGestor();el.onchange=()=>{draft.sellerUser=norm(el.value);draft.seller=sellerName(draft.sellerUser)}}

function renderQuote(){
  refreshSellerControl(draft.sellerUser||resolveSellerUser(draft));
  $('qClient').value=draft.client||'';$('qDate').value=draft.date||today();if($('qSuggestedInstall'))$('qSuggestedInstall').value=draft.suggestedDeliveryDate||suggestedInstallDate(draft.date||today());$('qDocument').value=draft.document||'';$('qStreet').value=draft.street||'';$('qNumber').value=draft.number||'';$('qComplement').value=draft.complement||'';$('qNeighborhood').value=draft.neighborhood||'';$('qCep').value=draft.cep||'';$('qContact').value=draft.contact||'';$('qTravel').value=draft.travel||0;$('qDiscount').value=draft.discountPercent||0;$('qDiscountReason').value=draft.discountReason||'';
  {const role=norm(userPermissionRecord(draft.sellerUser||currentUsername()).role),lim=Number(userPermissionRecord(draft.sellerUser||currentUsername()).maxDiscount??100);$('qDiscount').max='100';$('qDiscount').oninput=()=>{if(Number($('qDiscount').value)<0)$('qDiscount').value=0};$('qDiscount').title=['SALES','PARTNER'].includes(role)?`Limite sem aprovação: ${lim}%`:'Desconto do orçamento';}
  const tbody=$('envTable');tbody.innerHTML='';let labor=0;
  for(const e of draft.environments||[]){
    const c=calcEnvironment(e);if(!c)continue;const pm=1+quotePartnerMarkup(draft)/100;labor+=c.laborTotal;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><strong>${esc(e.name)}</strong>${c.alerts.length?`<br><span class="badge warn">${esc(c.alerts.join(' • '))}</span>`:''}${e.excludeFixation?'<br><span class="badge warn">FIXAÇÃO EXCLUÍDA</span>':''}</td><td>${e.width} × ${e.height} cm<br>${Math.max(0,Number(e.leaves||1)-1)} abertura(s)</td><td>${e.model==='COMPLETE'?'Cortina completa':e.model==='LINING'?'Apenas forro':'Apenas acabamento'}</td><td>${c.finishCalc?`${esc(e.finish)}<br>${esc(e.finishColor)} • ${e.finishPleat} ${e.finishGather}:1`:'—'}</td><td>${c.liningCalc?`${esc(e.lining)}<br>${esc(e.liningColor)} • ${e.liningPleat} ${e.liningGather}:1`:'—'}</td><td>${e.excludeFixation?'SEM FIXAÇÃO / SEM INSTALAÇÃO':`${esc(e.fixation)}<br>${esc(e.fixColor)}`}</td><td>${money(c.laborTotal)}</td><td>${money(c.p18*pm)}</td><td>${money(c.base4*pm)}</td><td>${money(c.cash*pm)}</td><td class="no-print"><button class="btn secondary" data-edit-env="${e.id}">Editar</button> <button class="btn danger" data-del-env="${e.id}">Excluir</button></td>`;
    tbody.appendChild(tr)
  }
  for(const b of draft.blinds||[]){const qty=Number(b.qty||1);const tr=document.createElement('tr');tr.className='blind-row';tr.innerHTML=`<td><strong>${esc(b.environment||'PERSIANA')}</strong><br><span class="badge blue">PERSIANA</span></td><td>${b.width} × ${b.height} cm<br>${qty} un.</td><td>Persiana</td><td>${esc(b.model)}<br>${esc(b.color||'-')}</td><td>—</td><td>${esc(b.commandSide||'-')}${b.bando?`<br>Bandô: ${esc(b.bando)}`:''}</td><td>—</td><td>${money(Number(b.p18||0)*qty)}</td><td>${money(Number(b.p4||0)*qty)}</td><td>${money(Number(b.cash||0)*qty)}</td><td class="no-print"><button class="btn danger" data-del-blind="${b.id}">Excluir</button></td>`;tbody.appendChild(tr)}
  for(const a of draft.looseProducts||[]){const qty=Number(a.qty||1),tr=document.createElement('tr');tr.className='loose-row';tr.innerHTML=`<td><strong>${esc(a.description||a.name)}</strong><br><span class="badge blue">${a.stockManaged===false?'FORA DE ESTOQUE':'PRODUTO AVULSO'}</span></td><td>${qty} ${esc(a.unit||'UN')}</td><td>${esc(a.type||'')}</td><td>${esc(a.name)}<br>${esc(a.color||'')}</td><td>—</td><td>${a.priceOverride?`Preço ajustado<br><small>${esc(a.priceReason||'')}</small>`:'Preço padrão'}</td><td>—</td><td>${money(Number(a.p18||0)*qty)}</td><td>${money(Number(a.p4||0)*qty)}</td><td>${money(Number(a.cash||0)*qty)}</td><td class="no-print"><button class="btn danger" data-del-loose="${a.id}">Excluir</button></td>`;tbody.appendChild(tr)}
  const t=quoteTotals(draft);$('qCount').textContent=(draft.environments?.length||0)+(draft.blinds?.length||0)+(draft.looseProducts?.length||0);$('q18').textContent=money(t.p18);$('q4').textContent=money(t.p4);$('qCash').textContent=money(t.cash);$('sumLabor').textContent=money(labor);$('sum18').textContent=money(t.p18);$('sum4').textContent=money(t.p4);$('sumCash').textContent=money(t.cash);
  document.querySelectorAll('[data-edit-env]').forEach(b=>b.onclick=()=>{const e=(draft.environments||[]).find(x=>String(x.id)===String(b.dataset.editEnv));if(e)loadEnvironmentForEdit(e)});
  document.querySelectorAll('[data-del-env]').forEach(b=>b.onclick=()=>{draft.environments=draft.environments.filter(x=>String(x.id)!==String(b.dataset.delEnv));renderQuote()});
  document.querySelectorAll('[data-del-blind]').forEach(b=>b.onclick=()=>{draft.blinds=(draft.blinds||[]).filter(x=>x.id!==b.dataset.delBlind);renderQuote()});
  document.querySelectorAll('[data-del-loose]').forEach(b=>b.onclick=()=>{draft.looseProducts=(draft.looseProducts||[]).filter(x=>x.id!==b.dataset.delLoose);renderQuote()})
}
function syncDraft(){draft.client=$('qClient').value.trim();draft.date=$('qDate').value;draft.suggestedDeliveryDate=suggestedInstallDate(draft.date||today());if($('qSuggestedInstall'))$('qSuggestedInstall').value=draft.suggestedDeliveryDate;draft.document=$('qDocument').value.replace(/\D/g,'');draft.street=$('qStreet').value.trim();draft.number=$('qNumber').value.replace(/\D/g,'');draft.complement=$('qComplement').value.trim();draft.neighborhood=$('qNeighborhood').value.trim();draft.cep=$('qCep').value.replace(/\D/g,'');draft.address=[draft.street,draft.number,draft.neighborhood,draft.cep,draft.complement].filter(Boolean).join(', ');draft.contact=$('qContact').value.replace(/\D/g,'');draft.sellerUser=norm($('qSeller').value||currentUser?.username);draft.seller=sellerName(draft.sellerUser);draft.travel=Number($('qTravel').value||0);draft.discountPercent=Number($('qDiscount').value||0);draft.discountReason=$('qDiscountReason').value.trim()}
function partnerMarkupPercent(username){const u=allUsers().find(x=>norm(x.username)===norm(username));if(!['SALES','PARTNER'].includes(norm(u?.role)))return 0;const m=Number(u?.markupPercent||0);return m>0?Math.max(1,Math.min(10,m)):0}
function quotePartnerMarkup(q){if(Number.isFinite(Number(q?.partnerMarkupPercent)))return Math.max(0,Math.min(10,Number(q.partnerMarkupPercent)));return partnerMarkupPercent(q?.sellerUser||q?.ownerUser||currentUsername())}
function quoteTotals(q){let p18=0,p4=0,cash=0,labor=0;const curtainFactor=1+quotePartnerMarkup(q)/100;for(const e of q.environments||[]){const c=calcEnvironment(e);if(c){p18+=c.p18*curtainFactor;p4+=c.base4*curtainFactor;cash+=c.cash*curtainFactor;labor+=c.laborTotal}}for(const b of q.blinds||[]){const qty=Number(b.qty||1);p18+=Number(b.p18||0)*qty;p4+=Number(b.p4||0)*qty;cash+=Number(b.cash||0)*qty}for(const a of q.looseProducts||[]){const qty=Number(a.qty||1);p18+=Number(a.p18||0)*qty;p4+=Number(a.p4||0)*qty;cash+=Number(a.cash||0)*qty}const t=Number(q.travel||0);p18+=t*(1+db.priceConfig.terms.p18AddPct/100);p4+=t;cash+=t*(1-db.priceConfig.terms.cashDiscountPct/100);const d=Math.max(0,Math.min(100,Number(q.discountPercent||0)));return {p18:p18*(1-d/100),p4:p4*(1-d/100),cash:cash*(1-d/100),labor,discountPercent:d}}
function saveQuote(print=false){syncDraft();draft.partnerMarkupPercent=partnerMarkupPercent(draft.sellerUser||currentUsername());if(!draft.client)return alert('Informe o cliente.');if(!draft.numero)draft.numero=nextQuoteNumber();if(!draft.environments.length&&!(draft.blinds||[]).length&&!(draft.looseProducts||[]).length)return alert('Adicione pelo menos um ambiente, persiana ou produto avulso.');if(Number(draft.discountPercent||0)>0&&!draft.discountReason)return alert('Informe a justificativa do desconto.');const existing=db.quotes.findIndex(q=>Number(q.numero)===Number(draft.numero));const q={...clone(draft),ownerUser:draft.sellerUser||currentUsername(),sellerUser:draft.sellerUser||currentUsername(),seller:sellerName(draft.sellerUser||currentUsername()),createdAt:existing>=0?db.quotes[existing].createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),status:db.quotes[existing]?.status||'ORÇAMENTO'};if(existing>=0)db.quotes[existing]=q;else db.quotes.unshift(q);upsertClientFromQuote(q);queueSave();renderAll();$('quoteStatus').textContent=`Orçamento ${String(q.numero).padStart(6,'0')} salvo.`;if(print)printQuote(q,'summary')}
function resetQuote(){if(!confirm('Zerar todos os dados do orçamento atual?'))return;draft={numero:null,client:'',date:today(),address:'',street:'',number:'',complement:'',neighborhood:'',cep:'',document:'',contact:'',seller:sellerName(currentUser?.username),sellerUser:currentUsername(),travel:0,discountPercent:0,discountReason:'',environments:[],blinds:[],looseProducts:[]};renderQuote();clearEnv()}
function upsertClientFromQuote(q){const key=norm(q.client);let c=db.clients.find(x=>norm(x.name)===key);const data={address:q.address,document:q.document||'',contact:q.contact||'',street:q.street||'',number:q.number||'',complement:q.complement||'',neighborhood:q.neighborhood||'',cep:q.cep||'',addressStructured:!!(q.street||q.number||q.neighborhood||q.cep||q.complement),lastSeller:q.seller,updatedAt:new Date().toISOString()};if(c)Object.assign(c,data);else db.clients.unshift({id:uid(),name:q.client,...data,createdAt:new Date().toISOString()})}
function printQuote(q,type='summary'){const t=quoteTotals(q),detailed=type==='detail';let rows='';for(const e of q.environments||[]){const c=calcEnvironment(e);if(!c)continue;rows+=`<tr><td><strong>${esc(e.name)}</strong>${detailed&&e.notes?`<br><small>${esc(e.notes)}</small>`:''}</td><td>${e.width} × ${e.height} cm<br>${Math.max(0,Number(e.leaves||1)-1)} abertura(s)</td><td>${esc(e.model==='COMPLETE'?'CORTINA COMPLETA':e.model==='LINING'?'APENAS FORRO':'APENAS ACABAMENTO')}</td><td>${c.finishCalc?esc(e.finish+' '+(e.finishColor||'')):'—'}</td><td>${c.liningCalc?esc(e.lining+' '+(e.liningColor||'')):'—'}</td><td>${esc(e.fixation||'-')}<br>${esc(e.fixColor||'')}</td><td>${money(c.labor)}</td><td>${money(c.p18)}</td><td>${money(c.base4)}</td><td>${money(c.cash)}</td></tr>`}for(const x of q.blinds||[]){const qty=Number(x.qty||1);rows+=`<tr><td><strong>${esc(x.environment||'PERSIANA')}</strong></td><td>${x.width} × ${x.height} cm<br>${qty} un.</td><td>PERSIANA</td><td>${esc(x.model||'-')} ${esc(x.color||'')}</td><td>—</td><td>${esc(x.commandSide||'-')}</td><td>—</td><td>${money(Number(x.p18||0)*qty)}</td><td>${money(Number(x.p4||0)*qty)}</td><td>${money(Number(x.cash||0)*qty)}</td></tr>`}if(Number(q.travel||0)>0)rows+=`<tr><td><strong>DESLOCAMENTO</strong></td><td colspan="5">Atendimento / instalação fora da praça</td><td>—</td><td>${money(Number(q.travel)*(1+db.priceConfig.terms.p18AddPct/100))}</td><td>${money(q.travel)}</td><td>${money(Number(q.travel)*(1-db.priceConfig.terms.cashDiscountPct/100))}</td></tr>`;const html=`<div class="quote-client-head"><div class="quote-brand"><img src="${location.origin}/icon-512.png"><div><h2>ORÇAMENTO Nº ${String(q.numero).padStart(6,'0')}</h2><strong>${detailed?'DETALHADO':'RESUMIDO'}</strong></div></div><div class="quote-date"><small>Data</small><div>${fmtDate(q.date)}</div></div></div><div class="section-title">▪ &nbsp; Dados do cliente</div><div class="client-grid"><div><small>Cliente</small><strong>${esc(q.client||'-')}</strong></div><div><small>Contato</small><strong>${esc(q.contact||'-')}</strong></div><div><small>Endereço</small><strong>${esc(q.address||'-')}</strong></div><div><small>Vendedor</small><strong>${esc(q.seller||'-')}</strong></div></div><div class="section-title">▪ &nbsp; Resumo do orçamento</div><table class="client-quote"><thead><tr><th>AMBIENTE</th><th>MEDIDAS</th><th>MODELO</th><th>TECIDO ACABAMENTO</th><th>FORRO</th><th>FIXAÇÃO</th><th>MÃO DE OBRA TOTAL</th><th>18X</th><th>4X</th><th>À VISTA</th></tr></thead><tbody>${rows}<tr class="total-row"><th colspan="6">TOTAL</th><th>${money((q.environments||[]).reduce((a,e)=>a+(calcEnvironment(e)?.labor||0),0))}</th><th>${money(t.p18)}</th><th>${money(t.p4)}</th><th>${money(t.cash)}</th></tr></tbody></table>${q.discountPercent?`<p><strong>Desconto aplicado:</strong> ${q.discountPercent}% • ${esc(q.discountReason||'')}</p>`:''}<div class="section-title">▪ &nbsp; Condições</div><ol class="conditions"><li>Validade do orçamento: 5 dias.</li><li>Medidas, tecidos, cores e fixações devem ser conferidos antes da ordem de produção.</li><li>Prazo sugerido para a instalação de 30 dias, devendo ser agendado no pedido.</li></ol>`;printWindow(html)}

function renderQuotes(){const tb=$('quotesTable');if(!tb)return;const q=norm($('quoteSearch')?.value);const converted=new Set(db.orders.map(o=>Number(o.quoteNumber)));tb.innerHTML='';for(const x of db.quotes.filter(canSeeQuote).filter(x=>!q||norm(`${x.numero} ${x.client} ${displaySeller(x)}`).includes(q))){const t=quoteTotals(x),conv=converted.has(Number(x.numero));const tr=document.createElement('tr');tr.innerHTML=`<td>${String(x.numero).padStart(6,'0')}</td><td>${fmtDate(x.date)}</td><td>${esc(x.client)}</td><td>${esc(displaySeller(x))}</td><td>${(x.environments?.length||0)+(x.blinds?.length||0)+(x.looseProducts?.length||0)}</td><td>${money(t.cash)}</td><td><span class="badge ${conv?'blue':'ok'}">${conv?'PEDIDO':'ORÇAMENTO'}</span></td><td><div class="actions"><button class="btn ghost" data-q-load="${x.numero}">Abrir</button><button class="btn ghost" data-q-print="${x.numero}">PDF</button>${conv?`<button class="btn danger" data-q-revert="${x.numero}">Reverter</button>`:`<button class="btn primary" data-q-convert="${x.numero}">Converter</button>`}${isGestor()?`<button class="btn danger" data-q-delete="${x.numero}">Excluir</button>`:''}</div></td>`;tb.appendChild(tr)}bindQuoteActions()}
function bindQuoteActions(){document.querySelectorAll('[data-q-load]').forEach(b=>b.onclick=()=>{const q=db.quotes.find(x=>Number(x.numero)===Number(b.dataset.qLoad));if(q){draft=clone(q);quoteEditingEnvironmentId=null;quoteExcludeFixation=false;renderQuote();clearEnv();setView('quote')}});document.querySelectorAll('[data-q-print]').forEach(b=>b.onclick=()=>{const q=db.quotes.find(x=>Number(x.numero)===Number(b.dataset.qPrint));if(q)openPrintChoice(q)});document.querySelectorAll('[data-q-convert]').forEach(b=>b.onclick=()=>convertQuote(Number(b.dataset.qConvert)));document.querySelectorAll('[data-q-revert]').forEach(b=>b.onclick=()=>revertQuote(Number(b.dataset.qRevert)));document.querySelectorAll('[data-q-delete]').forEach(b=>b.onclick=()=>deleteQuote(Number(b.dataset.qDelete)))}
function deleteQuote(n){if(!isGestor())return alert('Apenas o GESTOR pode excluir orçamentos.');const linked=db.orders.find(o=>Number(o.quoteNumber)===n);if(linked)return alert('Este orçamento já virou pedido. Exclua ou reverta o pedido primeiro.');if(!confirm('Excluir definitivamente este orçamento?'))return;db.quotes=db.quotes.filter(q=>Number(q.numero)!==n);queueSave();renderAll()}
function openPrintChoice(q){printQuote(q,'summary')}
let conversionInProgress=false;
function convertQuote(n){if(conversionInProgress)return alert('Conversão já está em andamento. Aguarde.');const q=db.quotes.find(x=>Number(x.numero)===n);if(!q)return;if(db.orders.some(o=>Number(o.quoteNumber)===n))return alert('Este orçamento já foi convertido em pedido.');const t=quoteTotals(q);openModal(`<h2>Converter em pedido</h2><div class="grid two"><label class="field">Condição<select id="convCond"><option value="cash">À vista</option><option value="p4">Até 4x</option><option value="p18">Até 18x</option></select></label><label class="field">Data de instalação / entrega<input id="convDate" type="date" value="${q.suggestedDeliveryDate||suggestedInstallDate(today())}"></label><label class="field">Desconto adicional (%)<input id="convDiscount" type="number" min="0" max="100" value="0"></label><label class="field">Justificativa<input id="convReason"></label></div><p class="muted">À vista ${money(t.cash)} • 4x ${money(t.p4)} • 18x ${money(t.p18)}</p><p class="notice">A baixa do estoque acontece somente ao confirmar a geração do pedido.</p><button id="convGo" class="btn primary">Gerar pedido</button>`);$('convGo').onclick=async()=>{if(conversionInProgress)return;conversionInProgress=true;$('convGo').disabled=true;$('convGo').textContent='Convertendo...';const cond=$('convCond').value,date=$('convDate').value,disc=Number($('convDiscount').value||0),reason=$('convReason').value.trim();if(!date){conversionInProgress=false;$('convGo').disabled=false;return alert('Informe a data.');}if(disc>0&&!reason){conversionInProgress=false;$('convGo').disabled=false;return alert('Justifique o desconto.');}if(isPartner()&&(Number(q.discountPercent||0)+disc)>5){conversionInProgress=false;$('convGo').disabled=false;return alert('Seu limite total de desconto é 5%. Solicite ao GESTOR um desconto excepcional; nesse caso sua comissão será zerada.');}if(db.orders.some(o=>Number(o.quoteNumber)===Number(n))){conversionInProgress=false;closeModal();renderAll();return alert('Este orçamento já possui pedido. O pedido existente foi mantido.');}const base=cond==='cash'?t.cash:cond==='p18'?t.p18:t.p4;const order={id:uid(),numero:nextOrderNumber(),clientAccessCode:String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0'),quoteNumber:q.numero,partnerMarkupPercent:quotePartnerMarkup(q),ownerUser:q.ownerUser||currentUsername(),client:q.client,address:q.address,document:q.document||'',street:q.street||'',number:q.number||'',complement:q.complement||'',neighborhood:q.neighborhood||'',cep:q.cep||'',contact:q.contact,seller:displaySeller(q),sellerUser:resolveSellerUser(q),environments:clone(q.environments),blinds:clone(q.blinds||[]),looseProducts:clone(q.looseProducts||[]),createdDate:today(),deliveryDate:date,paymentCondition:cond,originalValue:base,discountPercent:disc,discountReason:reason,agreedValue:base*(1-disc/100),productionStage:'RECEPÇÃO',productionHistory:[{stage:'RECEPÇÃO',at:new Date().toISOString(),by:currentUsername()}],installation:{responsible:'',completedDate:''},payments:[],createdAt:new Date().toISOString()};const totalPartnerDiscount=Number(q.discountPercent||0)+Number(disc||0);order.commissionPercent=partnerCommissionForDiscount(resolveSellerUser(q),totalPartnerDiscount);order.partnerDiscountPercent=totalPartnerDiscount;order.costSnapshot={createdAt:new Date().toISOString(),installationMatrix:clone(db.priceConfig.installationMatrix),environments:(order.environments||[]).map(e=>{const c=calcEnvironment(e);return {name:e.name,installation:Number(c?.installCost||0),production:Number((c?.sewingCost||0)+(c?.finishPleat||0)+(c?.liningPleat||0)+(c?.customPleat||0)),cashSale:Number(c?.cash||0)*(1+quotePartnerMarkup(q)/100)}})};const officialStock=await consumeOfficialStock(q,order);if(!officialStock.ok){conversionInProgress=false;$('convGo').disabled=false;return alert(officialStock.error);}const stock=validateAndConsumeStock(q,order);if(!stock.ok){await restoreOfficialStock(order);conversionInProgress=false;$('convGo').disabled=false;return alert(stock.error)}db.orders.unshift(order);createPurchaseAlertForOrder(order);for(const b of q.blinds||[]){const qty=Number(b.qty||1);db.products.unshift({id:uid(),code:'PER-'+String(Date.now()).slice(-6)+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),type:'PERSIANA',category:'FORNECEDOR PARCEIRO',name:b.model,color:b.color,qty,cost:Number(b.cash||0)/1.60,markup:60,unit:'UN',orderNumber:order.numero,stockManaged:false})}for(const a of q.looseProducts||[]){if(a.stockManaged===false)db.products.unshift({id:uid(),code:'ESP-'+String(Date.now()).slice(-6)+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),type:a.type,category:'FORA DE ESTOQUE',name:a.name,color:a.color||'SEM COR',qty:0,cost:0,markup:0,unit:a.unit||'UN',orderNumber:order.numero,stockManaged:false,specialQty:Number(a.qty||0),specialReason:a.specialReason||'',movements:[{id:uid(),date:today(),type:'ENTRADA E SAÍDA DIRETA',qty:0,balance:0,unit:a.unit||'UN',by:currentUsername(),reason:`Pedido ${order.numero} • ${a.specialReason||'produto específico'}`} ]})}q.status='PEDIDO';q.convertedOrderNumber=order.numero;queueSave();conversionInProgress=false;closeModal();renderAll();setView('orders')}}
async function revertQuote(n){const idx=db.orders.findIndex(o=>Number(o.quoteNumber)===n);if(idx<0)return;const order=db.orders[idx];if(!confirm(isGestor()?'Excluir o pedido vinculado e retornar o orçamento ao status ORÇAMENTO?':'Reverter este pedido para orçamento?'))return;const officialRestore=await restoreOfficialStock(order);if(!officialRestore.ok)return alert(officialRestore.error);restoreOrderStock(order);db.products=(db.products||[]).filter(p=>Number(p.orderNumber)!==Number(order.numero));db.orders.splice(idx,1);const q=db.quotes.find(x=>Number(x.numero)===n);if(q)q.status='ORÇAMENTO';queueSave();renderAll()}

function orderPaid(o){return (o.payments||[]).reduce((a,p)=>a+Number(p.value||0),0)}
function orderBalance(o){return Math.max(0,Number(o.agreedValue||0)-orderPaid(o))}
function financialStatus(o){const paid=orderPaid(o),val=Number(o.agreedValue||0);if(val>0&&paid>=val-0.005)return'QUITADO';if(paid>0)return'PARCIAL';return'EM ABERTO'}
function paymentMethodLabel(x){return x||'NÃO INFORMADO'}
function clientAddressText(c){return c?.addressStructured?[c.street,c.number,c.neighborhood,c.cep,c.complement].filter(Boolean).join(', '):(c?.address||'')}
function renderClients(){const tb=$('clientsTable');if(!tb)return;const s=norm($('clientSearch')?.value);tb.innerHTML='';for(const c of db.clients.filter(c=>!s||norm(`${c.name} ${c.contact} ${c.document||''} ${clientAddressText(c)}`).includes(s))){const os=db.orders.filter(o=>norm(o.client)===norm(c.name)),bal=os.reduce((a,o)=>a+orderBalance(o),0);const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(c.name)}</td><td>${esc(c.contact||'-')}</td><td>${esc(clientAddressText(c)||'-')}</td><td>${esc(c.lastSeller||'-')}</td><td>${money(bal)}</td><td><button class="btn primary" data-client-history="${c.id}">Abrir ficha</button> <button class="btn ghost" data-client-att="${c.id}">Anexos</button> <button class="btn ghost" data-client-edit="${c.id}">Editar</button> <button class="btn danger" data-client-del="${c.id}">Excluir</button></td>`;tb.appendChild(tr)}document.querySelectorAll('[data-client-history]').forEach(b=>b.onclick=()=>openClientHistory(db.clients.find(c=>c.id===b.dataset.clientHistory)));document.querySelectorAll('[data-client-att]').forEach(b=>{b.onclick=()=>{const c=db.clients.find(x=>x.id===b.dataset.clientAtt);if(c)openAttachments('CLIENT',c.id,c.name)}});document.querySelectorAll('[data-client-edit]').forEach(b=>b.onclick=()=>openClientModal(db.clients.find(c=>c.id===b.dataset.clientEdit)));document.querySelectorAll('[data-client-del]').forEach(b=>b.onclick=()=>{if(confirm('Excluir este cliente?')){db.clients=db.clients.filter(c=>c.id!==b.dataset.clientDel);queueSave();renderClients()}})}
function openClientHistory(c){if(!c)return;const qs=db.quotes.filter(q=>norm(q.client)===norm(c.name)),os=db.orders.filter(o=>norm(o.client)===norm(c.name));const pays=os.flatMap(o=>(o.payments||[]).map(p=>({...p,orderNumber:o.numero}))).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));const total=os.reduce((a,o)=>a+Number(o.agreedValue||0),0),paid=os.reduce((a,o)=>a+orderPaid(o),0);openModal(`<h2>Ficha do cliente • ${esc(c.name)}</h2><div class="kpis"><div class="kpi"><span>Pedidos</span><strong>${os.length}</strong></div><div class="kpi"><span>Total contratado</span><strong>${money(total)}</strong></div><div class="kpi"><span>Total recebido</span><strong>${money(paid)}</strong></div><div class="kpi"><span>Saldo devedor</span><strong>${money(Math.max(0,total-paid))}</strong></div></div><p><strong>Contato:</strong> ${esc(c.contact||'-')}<br><strong>Endereço:</strong> ${esc(c.address||'-')}</p><h3>Orçamentos</h3><div class="table-wrap"><table class="table"><tr><th>Nº</th><th>Data</th><th>Status</th><th>À vista</th></tr>${qs.map(q=>`<tr><td>${String(q.numero).padStart(6,'0')}</td><td>${fmtDate(q.date)}</td><td>${esc(q.status||'ORÇAMENTO')}</td><td>${money(quoteTotals(q).cash)}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum orçamento.</td></tr>'}</table></div><h3>Pedidos</h3><div class="table-wrap"><table class="table"><tr><th>Pedido</th><th>Data</th><th>Contratado</th><th>Pago</th><th>Saldo</th><th>Status</th></tr>${os.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${fmtDate(o.createdDate)}</td><td>${money(o.agreedValue)}</td><td>${money(orderPaid(o))}</td><td>${money(orderBalance(o))}</td><td>${financialStatus(o)}</td></tr>`).join('')||'<tr><td colspan="6">Nenhum pedido.</td></tr>'}</table></div><h3>Histórico de pagamentos</h3><div class="table-wrap"><table class="table"><tr><th>Data</th><th>Pedido</th><th>Valor</th><th>Forma</th><th>Observação</th></tr>${pays.map(x=>`<tr><td>${fmtDate(x.date)}</td><td>${String(x.orderNumber).padStart(6,'0')}</td><td>${money(x.value)}</td><td>${esc(paymentMethodLabel(x.method))}</td><td>${esc(x.notes||'-')}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum pagamento.</td></tr>'}</table></div>`)}
function wholesaleAddressText(c){return [c?.street,c?.number,c?.complement,c?.neighborhood,c?.city,c?.state,c?.cep].filter(Boolean).join(', ')}

const WHOLESALE_DEFAULT_MARKUP=65;
function wholesaleSettings(){db.settings=db.settings||{};db.settings.wholesale=db.settings.wholesale||{};const w=db.settings.wholesale;if(!Number.isFinite(Number(w.defaultMarkup)))w.defaultMarkup=WHOLESALE_DEFAULT_MARKUP;if(!Number.isFinite(Number(w.minMarkup)))w.minMarkup=35;if(!Number.isFinite(Number(w.defaultTermDays)))w.defaultTermDays=28;if(typeof w.creditBlock!=='boolean')w.creditBlock=true;return w}
function wholesaleProductLabel(p){return `${p.internal_code||'-'} • ${p.product_name||'-'}${p.color?` • ${p.color}`:''}`}
function wholesaleSaleTotal(){return (wholesaleDraft.items||[]).reduce((a,x)=>a+Number(x.qty||0)*Number(x.unitPrice||0),0)}
function wholesaleSaleCost(sale=wholesaleDraft){return (sale?.items||[]).reduce((a,x)=>a+Number(x.qty||0)*Number(x.cost||0),0)}
function wholesaleSaleProfit(sale=wholesaleDraft){return Number(sale?.total??wholesaleSaleTotal())-wholesaleSaleCost(sale)}
function wholesaleSaleMargin(sale=wholesaleDraft){const t=Number(sale?.total??wholesaleSaleTotal());return t>0?wholesaleSaleProfit(sale)/t*100:0}
function wholesaleSalePaid(s){return (s?.payments||[]).reduce((a,p)=>a+Number(p.value||0),0)}
function wholesaleSaleBalance(s){return Math.max(0,Number(s?.total||0)-wholesaleSalePaid(s))}
function wholesaleFinancialStatus(s){const paid=wholesaleSalePaid(s),bal=wholesaleSaleBalance(s);if(bal<=0.005)return'QUITADO';if(s?.dueDate&&s.dueDate<today())return'VENCIDO';if(paid>0)return'PARCIAL';return'EM ABERTO'}
function wholesaleDaysOverdue(s){if(wholesaleSaleBalance(s)<=0.005||!s?.dueDate||s.dueDate>=today())return 0;return Math.max(0,Math.floor((new Date(today()+'T12:00:00')-new Date(s.dueDate+'T12:00:00'))/86400000))}
function wholesaleAddDays(date,days){const d=new Date(String(date||today())+'T12:00:00');d.setDate(d.getDate()+Number(days||0));return d.toISOString().slice(0,10)}
function wholesaleMonthKey(date=today()){return String(date||today()).slice(0,7)}
function wholesaleClientSales(id){return (db.wholesaleSales||[]).filter(s=>s.clientId===id&&s.cancelled!==true)}
function wholesaleClientStats(clientOrId){
  const id=typeof clientOrId==='object'?clientOrId?.id:clientOrId,client=typeof clientOrId==='object'?clientOrId:(db.wholesaleClients||[]).find(c=>c.id===id);
  const sales=wholesaleClientSales(id),total=sales.reduce((a,s)=>a+Number(s.total||0),0),paid=sales.reduce((a,s)=>a+wholesaleSalePaid(s),0),debt=Math.max(0,total-paid),limit=Math.max(0,Number(client?.creditLimit||0)),available=Math.max(0,limit-debt),overdue=sales.reduce((a,s)=>a+(wholesaleFinancialStatus(s)==='VENCIDO'?wholesaleSaleBalance(s):0),0),maxDays=sales.reduce((m,s)=>Math.max(m,wholesaleDaysOverdue(s)),0),month=wholesaleMonthKey(),monthTotal=sales.filter(s=>String(s.date||'').slice(0,7)===month).reduce((a,s)=>a+Number(s.total||0),0),goal=Math.max(0,Number(client?.monthlyGoal||0)),cost=sales.reduce((a,s)=>a+wholesaleSaleCost(s),0),profit=total-cost,margin=total>0?profit/total*100:0;
  return {sales,total,paid,debt,limit,available,overLimit:Math.max(0,debt-limit),overdue,maxDays,monthTotal,goal,cost,profit,margin,utilization:limit>0?debt/limit*100:(debt>0?100:0)};
}
function wholesaleRisk(client){const st=wholesaleClientStats(client);if(st.overdue>0&&st.maxDays>=15)return {label:'ALTO',class:'warn',score:3};if(st.overdue>0||st.utilization>=90)return {label:'ATENÇÃO',class:'blue',score:2};return {label:'NORMAL',class:'ok',score:1}}
function wholesaleABC(rows,valueKey='value'){const sorted=rows.slice().sort((a,b)=>Number(b[valueKey]||0)-Number(a[valueKey]||0)),total=sorted.reduce((a,x)=>a+Number(x[valueKey]||0),0);let acc=0;return sorted.map(x=>{acc+=Number(x[valueKey]||0);const pct=total>0?acc/total*100:100;return {...x,abc:pct<=80?'A':pct<=95?'B':'C'}})}
function wholesaleDefaultMarkupForClient(c){const w=wholesaleSettings();return Number.isFinite(Number(c?.defaultMarkup))?Number(c.defaultMarkup):Number(w.defaultMarkup||65)}
function wholesaleDefaultTermForClient(c){const w=wholesaleSettings();return Number.isFinite(Number(c?.defaultTermDays))?Number(c.defaultTermDays):Number(w.defaultTermDays||28)}
function renderWholesaleClientCreditPreview(){
  const c=(db.wholesaleClients||[]).find(x=>x.id===($('wsClient')?.value||wholesaleDraft.clientId)),st=c?wholesaleClientStats(c):null,total=wholesaleSaleTotal(),projected=st?st.debt+total:0;
  if($('wsClientPurchased'))$('wsClientPurchased').textContent=st?money(st.total):money(0);if($('wsClientDebt'))$('wsClientDebt').textContent=st?money(st.debt):money(0);if($('wsClientLimit'))$('wsClientLimit').textContent=st?money(st.limit):money(0);if($('wsClientAvailable'))$('wsClientAvailable').textContent=st?money(st.available):money(0);
  if($('wsCreditNotice'))$('wsCreditNotice').innerHTML=c&&projected>st.limit+0.005?`<div class="notice"><strong>CRÉDITO:</strong> com esta venda o saldo projetado será ${money(projected)}, acima do limite de ${money(st.limit)}. O fechamento exigirá autorização do gestor.</div>`:'';
}
function syncWholesaleDueDate(force=false){const c=(db.wholesaleClients||[]).find(x=>x.id===($('wsClient')?.value||wholesaleDraft.clientId));let term=$('wsTerm')?.value;if(force||!term){const days=wholesaleDefaultTermForClient(c);term=String(days);if($('wsTerm')&&!['0','7','14','21','28'].includes(term))$('wsTerm').value='custom';else if($('wsTerm'))$('wsTerm').value=term;wholesaleDraft.termDays=days}else if(term!=='custom')wholesaleDraft.termDays=Number(term||0);if(term!=='custom'){wholesaleDraft.dueDate=wholesaleAddDays($('wsDate')?.value||wholesaleDraft.date||today(),wholesaleDraft.termDays);if($('wsDueDate'))$('wsDueDate').value=wholesaleDraft.dueDate}else if($('wsDueDate')&&!$('wsDueDate').value)$('wsDueDate').value=wholesaleDraft.dueDate||wholesaleAddDays($('wsDate')?.value||today(),wholesaleDraft.termDays||0)}
function renderWholesaleSale(){
  const client=$('wsClient'),product=$('wsProduct');if(!client||!product)return;db.wholesaleSales=db.wholesaleSales||[];wholesaleDraft.items=wholesaleDraft.items||[];const clients=(db.wholesaleClients||[]).filter(c=>c.active!==false).slice().sort((a,b)=>String(a.fantasyName||a.legalName||'').localeCompare(String(b.fantasyName||b.legalName||''),'pt-BR'));const cv=wholesaleDraft.clientId||client.value;client.innerHTML='<option value="">Selecione o cliente</option>'+clients.map(c=>`<option value="${c.id}">${esc(c.fantasyName||c.legalName||'-')}</option>`).join('');client.value=cv;wholesaleDraft.clientId=client.value;if($('wsDate'))$('wsDate').value=wholesaleDraft.date||today();
  const products=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&Number(p.stock_quantity||0)>0).slice().sort((a,b)=>String(a.product_name||'').localeCompare(String(b.product_name||''),'pt-BR'));const pv=product.value;product.innerHTML='<option value="">Selecione um produto do estoque</option>'+products.map(p=>`<option value="${p.id}">${esc(wholesaleProductLabel(p))}</option>`).join('');if(products.some(p=>String(p.id)===String(pv)))product.value=pv;syncWholesaleDueDate(!wholesaleDraft.dueDate);drawWholesaleSaleItems();updateWholesaleProductPreview(false);renderWholesaleClientCreditPreview();
}
function updateWholesaleProductPreview(resetMarkup=true){const p=(priceProducts||[]).find(x=>Number(x.id)===Number($('wsProduct')?.value)),c=(db.wholesaleClients||[]).find(x=>x.id===($('wsClient')?.value||wholesaleDraft.clientId));if(!p){if($('wsStock'))$('wsStock').value='';if($('wsUnitPrice'))$('wsUnitPrice').value='';return}if(resetMarkup&&$('wsMarkup'))$('wsMarkup').value=wholesaleDefaultMarkupForClient(c);const markup=Math.max(0,Number($('wsMarkup')?.value||wholesaleDefaultMarkupForClient(c))),price=Number(p.cost||0)*(1+markup/100);if($('wsStock'))$('wsStock').value=`${Number(p.stock_quantity||0).toFixed(String(p.unit||'').toUpperCase()==='M'?2:0)} ${p.unit||'UN'}`;if($('wsUnitPrice'))$('wsUnitPrice').value=price.toFixed(2)}
function addWholesaleItem(){const p=(priceProducts||[]).find(x=>Number(x.id)===Number($('wsProduct')?.value));if(!p)return alert('Selecione um produto do estoque.');const c=(db.wholesaleClients||[]).find(x=>x.id===($('wsClient')?.value||wholesaleDraft.clientId)),qty=Number($('wsQty')?.value||0),markup=Math.max(0,Number($('wsMarkup')?.value||wholesaleDefaultMarkupForClient(c)));if(qty<=0)return alert('Informe a quantidade.');const already=(wholesaleDraft.items||[]).filter(x=>Number(x.productId)===Number(p.id)).reduce((a,x)=>a+Number(x.qty||0),0);if(already+qty>Number(p.stock_quantity||0))return alert(`Estoque insuficiente. Disponível: ${Number(p.stock_quantity||0)} ${p.unit||'UN'}.`);wholesaleDraft.items.push({id:uid(),productId:Number(p.id),internalCode:p.internal_code||'',name:p.product_name||'',color:p.color||'',unit:p.unit||'UN',qty,cost:Number(p.cost||0),markup,unitPrice:Number(p.cost||0)*(1+markup/100)});if($('wsQty'))$('wsQty').value=1;drawWholesaleSaleItems()}
function drawWholesaleSaleItems(){const tb=$('wsItems');if(!tb)return;const min=Number(wholesaleSettings().minMarkup||0);tb.innerHTML=(wholesaleDraft.items||[]).map((x,i)=>`<tr><td>${esc(x.internalCode)}</td><td>${esc(x.name)}${x.color?`<br><small>${esc(x.color)}</small>`:''}</td><td><input data-ws-qty="${i}" type="number" min="0.01" step="0.01" value="${Number(x.qty||0)}" style="width:90px"> ${esc(x.unit||'')}</td><td><input data-ws-markup="${i}" type="number" min="0" step="0.01" value="${Number(x.markup||0)}" style="width:90px">%${Number(x.markup||0)<min?'<br><small class="badge warn">ABAIXO DO MÍNIMO</small>':''}</td><td>${money(x.unitPrice)}</td><td>${money(Number(x.qty||0)*Number(x.unitPrice||0))}</td><td><button class="btn danger" data-ws-del="${i}">Remover</button></td></tr>`).join('')||'<tr><td colspan="7">Nenhum produto adicionado.</td></tr>';document.querySelectorAll('[data-ws-markup]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.wsMarkup),x=wholesaleDraft.items[i];x.markup=Math.max(0,Number(el.value||0));x.unitPrice=Number(x.cost||0)*(1+x.markup/100);drawWholesaleSaleItems()});document.querySelectorAll('[data-ws-qty]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.wsQty),x=wholesaleDraft.items[i],p=(priceProducts||[]).find(p=>Number(p.id)===Number(x.productId));let q=Math.max(0,Number(el.value||0));const other=wholesaleDraft.items.filter((_,j)=>j!==i&&Number(_.productId)===Number(x.productId)).reduce((a,z)=>a+Number(z.qty||0),0);if(p&&other+q>Number(p.stock_quantity||0)){q=Math.max(0,Number(p.stock_quantity||0)-other);el.value=q}x.qty=q;drawWholesaleSaleItems()});document.querySelectorAll('[data-ws-del]').forEach(b=>b.onclick=()=>{wholesaleDraft.items.splice(Number(b.dataset.wsDel),1);drawWholesaleSaleItems()});const total=wholesaleSaleTotal();if($('wsTotal'))$('wsTotal').textContent=money(total);renderWholesaleClientCreditPreview()}
async function saveWholesaleSale(){
  const client=(db.wholesaleClients||[]).find(c=>c.id===($('wsClient')?.value||wholesaleDraft.clientId));
  if(!client)return alert('Selecione o cliente do atacado.');
  if(!(wholesaleDraft.items||[]).length)return alert('Adicione pelo menos um produto.');
  wholesaleDraft.date=$('wsDate')?.value||today();
  wholesaleDraft.clientId=client.id;
  wholesaleDraft.dueDate=$('wsDueDate')?.value||wholesaleAddDays(wholesaleDraft.date,wholesaleDraft.termDays||0);
  if(!wholesaleDraft.dueDate)return alert('Informe o vencimento.');
  const w=wholesaleSettings(),low=wholesaleDraft.items.filter(x=>Number(x.markup||0)<Number(w.minMarkup||0));
  let lowOverride=false;
  if(low.length){
    if(!isGestor())return alert(`Existe item com markup abaixo do mínimo de ${Number(w.minMarkup||0)}%.`);
    if(!confirm(`Há ${low.length} item(ns) abaixo do markup mínimo de ${Number(w.minMarkup||0)}%. Autorizar excepcionalmente esta venda?`))return;
    lowOverride=true;
  }
  const st=wholesaleClientStats(client),projected=st.debt+wholesaleSaleTotal();
  let creditOverride=false;
  if(w.creditBlock&&projected>st.limit+0.005){
    if(!isGestor())return alert('Venda bloqueada por limite de crédito.');
    if(!confirm(`O saldo projetado (${money(projected)}) supera o limite de crédito (${money(st.limit)}). Autorizar excepcionalmente?`))return;
    creditOverride=true;
  }
  const btn=$('wsSave');
  try{
    if(btn){btn.disabled=true;btn.textContent='Finalizando...'}
    cloud('Finalizando venda de atacado...');
    const res=await api('wholesale-sale',{method:'POST',body:JSON.stringify({clientId:client.id,date:wholesaleDraft.date,dueDate:wholesaleDraft.dueDate,termDays:Number(wholesaleDraft.termDays||0),creditOverride,lowMarkupOverride:lowOverride,items:(wholesaleDraft.items||[]).map(x=>({productId:Number(x.productId),qty:Number(x.qty),markup:Number(x.markup||0)}))})});
    const data=await api('data');
    db={...db,...data,priceConfig:mergeConfig(data.priceConfig)};
    db.wholesaleClients=db.wholesaleClients||[];db.wholesaleSales=db.wholesaleSales||[];db.settings=db.settings||{};
    try{await reloadOfficialProducts()}catch(e){console.error('Venda salva, mas falhou a atualização visual do estoque:',e)}
    wholesaleDraft={clientId:'',date:today(),termDays:Number(w.defaultTermDays||28),dueDate:'',items:[]};
    renderAll();setView('wholesaleOrders');
    alert(`Venda de atacado ${String(res.sale?.number||'').padStart(6,'0')} registrada com sucesso.`);
  }catch(e){alert('Não foi possível finalizar a venda de atacado: '+(e?.message||'erro desconhecido.'));cloud('Falha ao finalizar venda',true)}
  finally{if(btn){btn.disabled=false;btn.textContent='Finalizar venda'}}
}
function renderWholesaleOrders(){const tb=$('wholesaleOrdersTable');if(!tb)return;const sr=norm($('wholesaleOrderSearch')?.value),sf=$('wholesaleOrderStatus')?.value||'';const rows=(db.wholesaleSales||[]).filter(s=>s.cancelled!==true&&(!sr||norm(`${s.number} ${s.clientName}`).includes(sr))&&(!sf||(s.logisticsStatus||'SEPARAÇÃO')===sf)).slice().sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||'')));tb.innerHTML=rows.map(s=>{const paid=wholesaleSalePaid(s),bal=wholesaleSaleBalance(s),fin=wholesaleFinancialStatus(s),cls=fin==='QUITADO'?'ok':fin==='VENCIDO'?'warn':fin==='PARCIAL'?'blue':'warn';return `<tr><td>${String(s.number||0).padStart(6,'0')}</td><td>${fmtDate(s.date)}</td><td>${fmtDate(s.dueDate||s.date)}${wholesaleDaysOverdue(s)?`<br><small>${wholesaleDaysOverdue(s)} dia(s) em atraso</small>`:''}</td><td>${esc(s.clientName||'-')}</td><td>${money(s.total)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td><span class="badge ${cls}">${fin}</span></td><td><select data-ws-logistics="${s.id}"><option ${s.logisticsStatus==='SEPARAÇÃO'||!s.logisticsStatus?'selected':''}>SEPARAÇÃO</option><option ${s.logisticsStatus==='PRONTO'?'selected':''}>PRONTO</option><option ${s.logisticsStatus==='RETIRADO/ENVIADO'?'selected':''}>RETIRADO/ENVIADO</option><option ${s.logisticsStatus==='CONCLUÍDO'?'selected':''}>CONCLUÍDO</option></select></td><td>${bal>0.005?`<button class="btn primary" data-ws-pay="${s.id}">Pagamento</button>`:''} <button class="btn ghost" data-ws-open="${s.id}">Abrir</button> <button class="btn secondary" data-ws-dup="${s.id}">Duplicar</button></td></tr>`}).join('')||'<tr><td colspan="10">Nenhum pedido de atacado registrado.</td></tr>';document.querySelectorAll('[data-ws-open]').forEach(b=>b.onclick=()=>openWholesaleOrder(b.dataset.wsOpen));document.querySelectorAll('[data-ws-pay]').forEach(b=>b.onclick=()=>openWholesalePayment(b.dataset.wsPay));document.querySelectorAll('[data-ws-dup]').forEach(b=>b.onclick=()=>duplicateWholesaleOrder(b.dataset.wsDup));document.querySelectorAll('[data-ws-logistics]').forEach(el=>el.onchange=()=>{const s=(db.wholesaleSales||[]).find(x=>x.id===el.dataset.wsLogistics);if(!s)return;s.logisticsStatus=el.value;s.logisticsHistory=s.logisticsHistory||[];s.logisticsHistory.push({status:el.value,at:new Date().toISOString(),by:currentUsername()});audit('ATACADO','LOGÍSTICA',s.clientName,`Pedido ${String(s.number).padStart(6,'0')} → ${el.value}`);queueSave();renderWholesaleDashboard()})}
function duplicateWholesaleOrder(id){const s=(db.wholesaleSales||[]).find(x=>x.id===id);if(!s)return;wholesaleDraft={clientId:s.clientId,date:today(),termDays:Number(s.termDays??wholesaleDefaultTermForClient((db.wholesaleClients||[]).find(c=>c.id===s.clientId))),dueDate:'',items:(s.items||[]).map(x=>({...clone(x),id:uid()}))};wholesaleDraft.dueDate=wholesaleAddDays(wholesaleDraft.date,wholesaleDraft.termDays);setView('wholesaleSale');alert('Pedido copiado para uma nova venda. Confira o estoque, quantidades e preços antes de finalizar.')}
function openWholesalePayment(id){const s=(db.wholesaleSales||[]).find(x=>x.id===id);if(!s)return;const bal=wholesaleSaleBalance(s);if(bal<=0.005)return alert('Este pedido de atacado já está quitado.');openModal(`<h2>Registrar pagamento • Atacado ${String(s.number||0).padStart(6,'0')}</h2><div class="kpis"><div class="kpi"><span>Pedido</span><strong>${money(s.total)}</strong></div><div class="kpi"><span>Recebido</span><strong>${money(wholesaleSalePaid(s))}</strong></div><div class="kpi"><span>Saldo</span><strong>${money(bal)}</strong></div></div><div class="grid two"><label class="field">Data<input id="wspDate" type="date" value="${today()}"></label><label class="field">Valor<input id="wspValue" type="number" min="0.01" step="0.01" value="${bal.toFixed(2)}"></label><label class="field">Forma<select id="wspMethod"><option>PIX</option><option>DINHEIRO</option><option>BOLETO</option><option>TRANSFERÊNCIA</option><option>CARTÃO</option><option>OUTRO</option></select></label><label class="field">Observação<input id="wspNotes"></label></div><button id="wspSave" class="btn primary">Registrar pagamento</button>`);$('wspSave').onclick=()=>{const value=Number($('wspValue').value||0);if(value<=0)return alert('Informe o valor.');if(value>wholesaleSaleBalance(s)+0.005)return alert('O pagamento não pode ser maior que o saldo do pedido.');s.payments=s.payments||[];s.payments.push({id:uid(),date:$('wspDate').value||today(),value,method:$('wspMethod').value,notes:$('wspNotes').value.trim(),at:new Date().toISOString(),by:currentUsername()});audit('ATACADO','PAGAMENTO',s.clientName,`Pedido ${String(s.number).padStart(6,'0')} • ${money(value)}`);queueSave();closeModal();renderAll()}}
function openWholesaleOrder(id){const s=(db.wholesaleSales||[]).find(x=>x.id===id);if(!s)return;const paid=wholesaleSalePaid(s),bal=wholesaleSaleBalance(s);openModal(`<h2>Pedido Atacado ${String(s.number||0).padStart(6,'0')}</h2><p><strong>${esc(s.clientName||'-')}</strong> • ${fmtDate(s.date)} • vencimento ${fmtDate(s.dueDate||s.date)}</p><div class="kpis"><div class="kpi"><span>Total</span><strong>${money(s.total)}</strong></div><div class="kpi"><span>Recebido</span><strong>${money(paid)}</strong></div><div class="kpi"><span>Saldo</span><strong>${money(bal)}</strong></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Produto</th><th>Qtd.</th><th>Valor unitário</th><th>Total</th></tr></thead><tbody>${(s.items||[]).map(x=>`<tr><td>${esc(x.internalCode||'')} • ${esc(x.name||'')}${x.color?` / ${esc(x.color)}`:''}</td><td>${Number(x.qty||0)} ${esc(x.unit||'')}</td><td>${money(x.unitPrice)}</td><td>${money(Number(x.qty||0)*Number(x.unitPrice||0))}</td></tr>`).join('')}</tbody></table></div><h3>Pagamentos</h3><div class="table-wrap"><table class="table"><tr><th>Data</th><th>Valor</th><th>Forma</th><th>Observação</th><th>Usuário</th></tr>${(s.payments||[]).map(p=>`<tr><td>${fmtDate(p.date)}</td><td>${money(p.value)}</td><td>${esc(p.method||'-')}</td><td>${esc(p.notes||'-')}</td><td>${esc(p.by||'-')}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum pagamento registrado.</td></tr>'}</table></div>${s.creditOverride?'<div class="notice">Venda autorizada acima do limite de crédito.</div>':''}${s.lowMarkupOverride?'<div class="notice">Venda possui condição comercial excepcional autorizada pelo gestor.</div>':''}${bal>0.005?`<button id="wsoPay" class="btn primary">Registrar pagamento</button>`:''} <button id="wsoDup" class="btn secondary">Duplicar pedido</button>`);if($('wsoPay'))$('wsoPay').onclick=()=>{closeModal();openWholesalePayment(s.id)};if($('wsoDup'))$('wsoDup').onclick=()=>{closeModal();duplicateWholesaleOrder(s.id)}}
function renderWholesaleClients(){const tb=$('wholesaleClientsTable');if(!tb)return;db.wholesaleClients=db.wholesaleClients||[];const sr=norm($('wholesaleClientSearch')?.value),month=wholesaleMonthKey();const rows=db.wholesaleClients.filter(c=>!sr||norm(`${c.fantasyName||''} ${c.legalName||''} ${c.responsible||''} ${c.phone||''} ${c.document||''} ${c.city||''} ${c.state||''}`).includes(sr));tb.innerHTML=rows.map(c=>{const st=wholesaleClientStats(c),r=wholesaleRisk(c),goalPct=st.goal>0?Math.min(999,st.monthTotal/st.goal*100):0;return `<tr><td><strong>${esc(c.fantasyName||c.legalName||'-')}</strong>${c.legalName&&c.fantasyName?`<br><small class="muted">${esc(c.legalName)}</small>`:''}</td><td>${esc(c.responsible||'-')}</td><td>${money(st.total)}<br><small class="muted">${money(st.monthTotal)} em ${month}</small></td><td><strong>${money(st.debt)}</strong>${st.overdue>0?`<br><small>${money(st.overdue)} vencido</small>`:''}</td><td>${money(st.available)}<br><small class="muted">Limite ${money(st.limit)}</small></td><td>${st.goal>0?`${money(st.monthTotal)} / ${money(st.goal)}<br><small>${goalPct.toFixed(0)}%</small>`:'-'}</td><td><span class="badge ${r.class}">${r.label}</span></td><td>${c.active===false?'INATIVO':'ATIVO'}</td><td><button class="btn primary" data-wholesale-close="${c.id}">Fechamento</button> <button class="btn ghost" data-wholesale-edit="${c.id}">Editar</button> <button class="btn danger" data-wholesale-del="${c.id}">Excluir</button></td></tr>`}).join('')||'<tr><td colspan="9">Nenhum cliente de atacado cadastrado.</td></tr>';document.querySelectorAll('[data-wholesale-close]').forEach(b=>b.onclick=()=>openWholesaleClientClosing(b.dataset.wholesaleClose));document.querySelectorAll('[data-wholesale-edit]').forEach(b=>b.onclick=()=>openWholesaleClient(db.wholesaleClients.find(x=>x.id===b.dataset.wholesaleEdit)));document.querySelectorAll('[data-wholesale-del]').forEach(b=>b.onclick=()=>{const c=db.wholesaleClients.find(x=>x.id===b.dataset.wholesaleDel);if(!c||!confirm(`Excluir ${c.fantasyName||c.legalName||'este cliente'} do atacado?`))return;if((db.wholesaleSales||[]).some(s=>s.clientId===c.id))return alert('Este cliente possui pedidos de atacado e não pode ser excluído. Inative o cadastro se necessário.');db.wholesaleClients=db.wholesaleClients.filter(x=>x.id!==c.id);audit('ATACADO','EXCLUSÃO',c.fantasyName||c.legalName||'', 'Cliente atacadista excluído');queueSave();renderWholesaleClients()})}
function wholesaleClientStatement(c,month=''){const sales=wholesaleClientSales(c.id).filter(s=>!month||String(s.date||'').slice(0,7)===month),mov=[];for(const s of sales){mov.push({date:s.date,type:'PEDIDO',ref:String(s.number||0).padStart(6,'0'),value:Number(s.total||0),delta:Number(s.total||0)});for(const p of s.payments||[])mov.push({date:p.date,type:'PAGAMENTO',ref:String(s.number||0).padStart(6,'0'),value:Number(p.value||0),delta:-Number(p.value||0)})}return mov.sort((a,b)=>String(a.date).localeCompare(String(b.date)))}
function openWholesaleClientClosing(id){const c=(db.wholesaleClients||[]).find(x=>x.id===id);if(!c)return;const month=wholesaleMonthKey(),draw=(m)=>{const st=wholesaleClientStats(c),sales=st.sales.filter(s=>!m||String(s.date||'').slice(0,7)===m).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))),statement=wholesaleClientStatement(c,m);let running=0;const statementRows=statement.map(x=>{running+=x.delta;return `<tr><td>${fmtDate(x.date)}</td><td>${x.type}</td><td>${x.ref}</td><td>${x.delta>=0?'+':'-'} ${money(Math.abs(x.delta))}</td><td>${money(running)}</td></tr>`}).join('');const selectedTotal=sales.reduce((a,s)=>a+Number(s.total||0),0),selectedPaid=sales.reduce((a,s)=>a+wholesaleSalePaid(s),0),selectedCost=sales.reduce((a,s)=>a+wholesaleSaleCost(s),0),selectedProfit=selectedTotal-selectedCost;openModal(`<h2>Fechamento Atacado • ${esc(c.fantasyName||c.legalName||'-')}</h2><div class="grid four"><label class="field">Competência<input id="wcfMonth" type="month" value="${m||month}"></label><div class="field"><span>&nbsp;</span><button id="wcfAll" class="btn ghost">Todo o histórico</button></div></div><div class="kpis"><div class="kpi"><span>Comprado</span><strong>${money(selectedTotal)}</strong></div><div class="kpi"><span>Recebido</span><strong>${money(selectedPaid)}</strong></div><div class="kpi"><span>Saldo</span><strong>${money(Math.max(0,selectedTotal-selectedPaid))}</strong></div><div class="kpi"><span>Lucro bruto</span><strong>${money(selectedProfit)}</strong></div><div class="kpi"><span>Limite</span><strong>${money(st.limit)}</strong></div><div class="kpi"><span>Crédito disponível</span><strong>${money(st.available)}</strong></div><div class="kpi"><span>Vencido</span><strong>${money(st.overdue)}</strong></div></div><h3>Extrato</h3><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Movimento</th><th>Pedido</th><th>Valor</th><th>Saldo do período</th></tr></thead><tbody>${statementRows||'<tr><td colspan="5">Sem movimentos no período.</td></tr>'}</tbody></table></div><h3>Pedidos</h3><div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Data</th><th>Venc.</th><th>Total</th><th>Recebido</th><th>Saldo</th><th>Status</th><th>Ação</th></tr></thead><tbody>${sales.map(s=>{const paid=wholesaleSalePaid(s),bal=wholesaleSaleBalance(s);return `<tr><td>${String(s.number||0).padStart(6,'0')}</td><td>${fmtDate(s.date)}</td><td>${fmtDate(s.dueDate||s.date)}</td><td>${money(s.total)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td>${wholesaleFinancialStatus(s)}</td><td>${bal>0.005?`<button class="btn primary" data-wcf-pay="${s.id}">Pagar</button>`:''} <button class="btn ghost" data-wcf-open="${s.id}">Abrir</button></td></tr>`}).join('')||'<tr><td colspan="8">Nenhum pedido.</td></tr>'}</tbody></table></div><button id="wcfPrint" class="btn secondary">PDF / Imprimir fechamento</button>`);$('wcfMonth').onchange=()=>draw($('wcfMonth').value);$('wcfAll').onclick=()=>draw('');$('wcfPrint').onclick=()=>window.print();document.querySelectorAll('[data-wcf-pay]').forEach(b=>b.onclick=()=>{closeModal();openWholesalePayment(b.dataset.wcfPay)});document.querySelectorAll('[data-wcf-open]').forEach(b=>b.onclick=()=>{closeModal();openWholesaleOrder(b.dataset.wcfOpen)})};draw(month)}
function openWholesaleClient(c=null){if(!isGestor())return alert('Apenas o GESTOR pode administrar clientes do atacado.');const w=wholesaleSettings();openModal(`<h2>${c?'Editar':'Novo'} cliente de atacado</h2><div class="grid two"><label class="field">Nome Fantasia<input id="wFantasy" value="${esc(c?.fantasyName||'')}"></label><label class="field">Razão Social<input id="wLegal" value="${esc(c?.legalName||'')}"></label><label class="field">CNPJ / CPF<input id="wDocument" inputmode="numeric" maxlength="14" value="${esc(c?.document||'')}"></label><label class="field">Responsável pela loja<input id="wResponsible" value="${esc(c?.responsible||'')}"></label><label class="field">Telefone / WhatsApp<input id="wPhone" inputmode="numeric" value="${esc(c?.phone||'')}"></label><label class="field">E-mail<input id="wEmail" type="email" value="${esc(c?.email||'')}"></label><label class="field">Rua<input id="wStreet" value="${esc(c?.street||'')}"></label><label class="field">Número<input id="wNumber" value="${esc(c?.number||'')}"></label><label class="field">Bairro<input id="wNeighborhood" value="${esc(c?.neighborhood||'')}"></label><label class="field">CEP<input id="wCep" inputmode="numeric" maxlength="8" value="${esc(c?.cep||'')}"></label><label class="field">Cidade<input id="wCity" value="${esc(c?.city||'')}"></label><label class="field">UF<input id="wState" maxlength="2" value="${esc(c?.state||'')}"></label><label class="field" style="grid-column:1/-1">Complemento<input id="wComplement" value="${esc(c?.complement||'')}"></label><label class="field">Status<select id="wActive"><option value="1">ATIVO</option><option value="0" ${c?.active===false?'selected':''}>INATIVO</option></select></label><label class="field">Tipo de loja<input id="wStoreType" placeholder="Ex.: cortinas, decoração, móveis" value="${esc(c?.storeType||'')}"></label><label class="field">Limite de crédito (R$)<input id="wCreditLimit" type="number" min="0" step="0.01" value="${Number(c?.creditLimit||0).toFixed(2)}"></label><label class="field">Meta mensal (R$)<input id="wMonthlyGoal" type="number" min="0" step="0.01" value="${Number(c?.monthlyGoal||0).toFixed(2)}"></label><label class="field">Markup padrão (%)<input id="wDefaultMarkup" type="number" min="0" step="0.01" value="${Number(c?.defaultMarkup??w.defaultMarkup).toFixed(2)}"></label><label class="field">Prazo padrão (dias)<input id="wDefaultTerm" type="number" min="0" step="1" value="${Number(c?.defaultTermDays??w.defaultTermDays)}"></label><label class="field" style="grid-column:1/-1">Observações<textarea id="wNotes" rows="4">${esc(c?.notes||'')}</textarea></label></div><button id="wSave" class="btn primary">Salvar cliente</button>`);['wDocument','wPhone','wCep'].forEach(id=>{const el=$(id);if(el)el.oninput=()=>el.value=el.value.replace(/\D/g,'')});if($('wState'))$('wState').oninput=()=>$('wState').value=$('wState').value.replace(/[^a-zA-Z]/g,'').toUpperCase().slice(0,2);$('wSave').onclick=()=>{const fantasy=$('wFantasy').value.trim(),legal=$('wLegal').value.trim();if(!fantasy&&!legal)return alert('Informe o nome fantasia ou a razão social.');const document=$('wDocument').value.replace(/\D/g,'');if(document&&![11,14].includes(document.length))return alert('CPF deve ter 11 dígitos ou CNPJ 14 dígitos.');const obj={...(c||{}),id:c?.id||uid(),fantasyName:fantasy,legalName:legal,document,responsible:$('wResponsible').value.trim(),phone:$('wPhone').value.replace(/\D/g,''),email:$('wEmail').value.trim(),street:$('wStreet').value.trim(),number:$('wNumber').value.trim(),neighborhood:$('wNeighborhood').value.trim(),cep:$('wCep').value.replace(/\D/g,''),city:$('wCity').value.trim(),state:$('wState').value.trim().toUpperCase(),complement:$('wComplement').value.trim(),active:$('wActive').value==='1',storeType:$('wStoreType').value.trim(),creditLimit:Math.max(0,Number($('wCreditLimit').value||0)),monthlyGoal:Math.max(0,Number($('wMonthlyGoal').value||0)),defaultMarkup:Math.max(0,Number($('wDefaultMarkup').value||w.defaultMarkup)),defaultTermDays:Math.max(0,Number($('wDefaultTerm').value||w.defaultTermDays)),notes:$('wNotes').value.trim(),updatedAt:new Date().toISOString(),createdAt:c?.createdAt||new Date().toISOString()};db.wholesaleClients=db.wholesaleClients||[];const i=db.wholesaleClients.findIndex(x=>x.id===obj.id);if(i>=0){db.wholesaleClients[i]=obj;audit('ATACADO','ALTERAÇÃO',obj.fantasyName||obj.legalName,'Cadastro/política comercial atualizados')}else{db.wholesaleClients.unshift(obj);audit('ATACADO','INCLUSÃO',obj.fantasyName||obj.legalName,'Novo cliente atacadista')}queueSave();closeModal();renderAll()}}
function renderWholesaleDashboard(){const box=$('wholesaleDashboardKpis');if(!box)return;const month=wholesaleMonthKey(),sales=(db.wholesaleSales||[]).filter(s=>s.cancelled!==true),monthSales=sales.filter(s=>String(s.date||'').slice(0,7)===month),revenue=monthSales.reduce((a,s)=>a+Number(s.total||0),0),cost=monthSales.reduce((a,s)=>a+wholesaleSaleCost(s),0),profit=revenue-cost,margin=revenue>0?profit/revenue*100:0,open=sales.reduce((a,s)=>a+wholesaleSaleBalance(s),0),overdue=sales.reduce((a,s)=>a+(wholesaleFinancialStatus(s)==='VENCIDO'?wholesaleSaleBalance(s):0),0),ticket=monthSales.length?revenue/monthSales.length:0;box.innerHTML=`<div class="kpi"><span>Faturamento ${month}</span><strong>${money(revenue)}</strong></div><div class="kpi"><span>Saldo em aberto</span><strong>${money(open)}</strong></div><div class="kpi"><span>Vencido</span><strong>${money(overdue)}</strong></div><div class="kpi"><span>Ticket médio</span><strong>${money(ticket)}</strong></div><div class="kpi"><span>Lucro bruto mês</span><strong>${money(profit)}</strong></div><div class="kpi"><span>Margem média</span><strong>${margin.toFixed(1)}%</strong></div>`;
  const alerts=[];for(const c of db.wholesaleClients||[]){const st=wholesaleClientStats(c);if(st.overdue>0)alerts.push(`${c.fantasyName||c.legalName}: ${money(st.overdue)} vencido`);else if(st.limit>0&&st.utilization>=90)alerts.push(`${c.fantasyName||c.legalName}: ${st.utilization.toFixed(0)}% do limite utilizado`);if(st.goal>0&&st.monthTotal<st.goal*.5&&new Date().getDate()>=20)alerts.push(`${c.fantasyName||c.legalName}: abaixo de 50% da meta mensal`);const last=st.sales.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0];if(last&&((Date.now()-new Date(last.date+'T12:00:00').getTime())/86400000)>45)alerts.push(`${c.fantasyName||c.legalName}: mais de 45 dias sem comprar`)}const criticalCount=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&Number(p.stock_quantity||0)<officialMinimumStock(p)).length;if(criticalCount)alerts.push(`${criticalCount} produto(s) abaixo do estoque mínimo`);const stalled=sales.filter(s=>(s.logisticsStatus||'SEPARAÇÃO')==='SEPARAÇÃO'&&((Date.now()-new Date(s.createdAt||s.date).getTime())/86400000)>2);for(const s of stalled)alerts.push(`Pedido ${String(s.number).padStart(6,'0')} está em separação há mais de 2 dias`);$('wholesaleDashboardAlerts').innerHTML=alerts.length?`<div class="notice"><strong>Alertas:</strong><br>${alerts.slice(0,12).map(esc).join('<br>')}</div>`:'<div class="notice"><strong>Sem alertas críticos no atacado.</strong></div>';
  const clients=wholesaleABC((db.wholesaleClients||[]).map(c=>{const st=wholesaleClientStats(c),r=wholesaleRisk(c);return {c,st,r,value:st.total}}));$('wholesaleClientRanking').innerHTML=`<div class="table-wrap"><table class="table"><thead><tr><th>ABC</th><th>Cliente</th><th>Faturamento</th><th>Margem</th><th>Saldo</th><th>Risco</th></tr></thead><tbody>${clients.map(x=>`<tr><td><strong>${x.abc}</strong></td><td>${esc(x.c.fantasyName||x.c.legalName||'-')}</td><td>${money(x.st.total)}</td><td>${x.st.margin.toFixed(1)}%</td><td>${money(x.st.debt)}</td><td><span class="badge ${x.r.class}">${x.r.label}</span></td></tr>`).join('')||'<tr><td colspan="6">Sem clientes.</td></tr>'}</tbody></table></div>`;
  const prodMap=new Map();for(const s of sales)for(const i of s.items||[]){const k=String(i.productId),x=prodMap.get(k)||{id:i.productId,name:`${i.name||''}${i.color?' / '+i.color:''}`,qty:0,value:0,profit:0};x.qty+=Number(i.qty||0);x.value+=Number(i.qty||0)*Number(i.unitPrice||0);x.profit+=Number(i.qty||0)*(Number(i.unitPrice||0)-Number(i.cost||0));prodMap.set(k,x)}const prods=wholesaleABC([...prodMap.values()]),restock=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&Number(p.stock_quantity||0)<officialMinimumStock(p)).sort((a,b)=>(Number(a.stock_quantity||0)-officialMinimumStock(a))-(Number(b.stock_quantity||0)-officialMinimumStock(b)));$('wholesaleProductRanking').innerHTML=`<div class="table-wrap"><table class="table"><thead><tr><th>ABC</th><th>Produto</th><th>Vendas</th><th>Lucro</th></tr></thead><tbody>${prods.slice(0,10).map(x=>`<tr><td><strong>${x.abc}</strong></td><td>${esc(x.name)}</td><td>${money(x.value)}</td><td>${money(x.profit)}</td></tr>`).join('')||'<tr><td colspan="4">Sem vendas.</td></tr>'}</tbody></table></div><h3>Sugestão de reposição</h3><div class="table-wrap"><table class="table"><thead><tr><th>Produto</th><th>Saldo</th><th>Mínimo</th><th>Sugerido</th></tr></thead><tbody>${restock.slice(0,10).map(p=>{const min=officialMinimumStock(p),qty=Number(p.stock_quantity||0);return `<tr><td>${esc(p.internal_code||'')} • ${esc(p.product_name||'')} ${esc(p.color||'')}</td><td>${qty} ${esc(p.unit||'')}</td><td>${min}</td><td><strong>${Math.max(0,min-qty)}</strong></td></tr>`}).join('')||'<tr><td colspan="4">Nenhum item abaixo do mínimo.</td></tr>'}</tbody></table></div>`;
  const w=wholesaleSettings();if($('wdDefaultMarkup'))$('wdDefaultMarkup').value=Number(w.defaultMarkup||65);if($('wdMinMarkup'))$('wdMinMarkup').value=Number(w.minMarkup||35);if($('wdDefaultTerm'))$('wdDefaultTerm').value=Number(w.defaultTermDays||28);if($('wdCreditBlock'))$('wdCreditBlock').value=w.creditBlock?'1':'0';
}
function saveWholesaleSettings(){const w=wholesaleSettings();w.defaultMarkup=Math.max(0,Number($('wdDefaultMarkup').value||65));w.minMarkup=Math.max(0,Number($('wdMinMarkup').value||0));w.defaultTermDays=Math.max(0,Number($('wdDefaultTerm').value||0));w.creditBlock=$('wdCreditBlock').value==='1';audit('ATACADO','CONFIGURAÇÃO','POLÍTICA COMERCIAL',`Markup padrão ${w.defaultMarkup}% • mínimo ${w.minMarkup}% • prazo ${w.defaultTermDays} dias • crédito ${w.creditBlock?'bloqueado':'livre'}`);queueSave();renderWholesaleDashboard();alert('Configurações do atacado salvas.')}
function exportWholesaleCsv(){const rows=[['Pedido','Data','Vencimento','Cliente','Total','Recebido','Saldo','Status financeiro','Status logístico','Custo','Lucro','Margem %']];for(const s of db.wholesaleSales||[]){if(s.cancelled)continue;const cost=wholesaleSaleCost(s),profit=Number(s.total||0)-cost,margin=Number(s.total||0)>0?profit/Number(s.total||0)*100:0;rows.push([s.number,s.date,s.dueDate||'',s.clientName||'',Number(s.total||0).toFixed(2),wholesaleSalePaid(s).toFixed(2),wholesaleSaleBalance(s).toFixed(2),wholesaleFinancialStatus(s),s.logisticsStatus||'SEPARAÇÃO',cost.toFixed(2),profit.toFixed(2),margin.toFixed(2)])}const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`ATACADO-${today()}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

function openClientModal(c=null){editingClientId=c?.id||null;const legacy=!c?.addressStructured&&!!c?.address;openModal(`<h2>${c?'Editar':'Novo'} cliente</h2><div class="grid two"><label class="field">Nome / Razão Social<input id="mClientName" value="${esc(c?.name||'')}"></label><label class="field">Nome Fantasia<input id="mClientFantasy" value="${esc(c?.fantasyName||'')}"></label><label class="field">CPF / CNPJ<input id="mClientDocument" inputmode="numeric" maxlength="14" value="${esc(c?.document||'')}"></label><label class="field">Telefone<input id="mClientPhone" inputmode="numeric" value="${esc(c?.contact||'')}"></label><label class="field">Rua<input id="mClientStreet" value="${esc(c?.street||'')}"></label><label class="field">Número<input id="mClientNumber" inputmode="numeric" value="${esc(c?.number||'')}"></label><label class="field">Bairro<input id="mClientNeighborhood" value="${esc(c?.neighborhood||'')}"></label><label class="field">CEP<input id="mClientCep" inputmode="numeric" maxlength="8" value="${esc(c?.cep||'')}"></label><label class="field" style="grid-column:1/-1">Complemento<input id="mClientComplement" value="${esc(c?.complement||'')}"></label>${legacy?`<div class="notice" style="grid-column:1/-1"><strong>Endereço legado preservado:</strong> ${esc(c.address)}<br><small>Preencha os campos acima quando quiser estruturar este endereço. O texto antigo não será apagado automaticamente.</small></div>`:''}</div><button id="mClientSave" class="btn primary">Salvar</button>`);const digits=id=>{const el=$(id);if(el)el.oninput=()=>el.value=el.value.replace(/\D/g,'')};['mClientDocument','mClientPhone','mClientNumber','mClientCep'].forEach(digits);$('mClientSave').onclick=()=>{const name=$('mClientName').value.trim();if(!name)return alert('Informe o nome / razão social.');const document=$('mClientDocument').value.replace(/\D/g,'');if(document&&![11,14].includes(document.length))return alert('CPF deve ter 11 dígitos ou CNPJ 14 dígitos.');const structured=[$('mClientStreet').value,$('mClientNumber').value,$('mClientNeighborhood').value,$('mClientCep').value,$('mClientComplement').value].some(x=>x.trim());const obj={id:editingClientId||uid(),name,fantasyName:$('mClientFantasy').value.trim(),document,contact:$('mClientPhone').value.replace(/\D/g,''),street:$('mClientStreet').value.trim(),number:$('mClientNumber').value.replace(/\D/g,''),neighborhood:$('mClientNeighborhood').value.trim(),cep:$('mClientCep').value.replace(/\D/g,''),complement:$('mClientComplement').value.trim(),addressStructured:structured,lastSeller:c?.lastSeller||sellerName(currentUser?.username),updatedAt:new Date().toISOString()};obj.address=structured?clientAddressText(obj):(c?.address||'');if(editingClientId){const i=db.clients.findIndex(x=>x.id===editingClientId);db.clients[i]={...db.clients[i],...obj};audit('CLIENTES','ALTERAÇÃO',name,'Cadastro atualizado')}else{db.clients.unshift(obj);audit('CLIENTES','INCLUSÃO',name,'Novo cliente')}queueSave();closeModal();renderClients()}}
function addOrderEvent(o,type,detail=''){o.timeline=o.timeline||[];o.timeline.push({id:uid(),type,detail,at:new Date().toISOString(),by:currentUsername()})}
function orderTimeline(o){const ev=[...(o.timeline||[])];if(o.createdAt&&!ev.some(x=>x.type==='PEDIDO CRIADO'))ev.unshift({type:'PEDIDO CRIADO',detail:`Orçamento ${o.quoteNumber||'-'}`,at:o.createdAt,by:o.ownerUser||'-'});for(const h of o.productionHistory||[])ev.push({type:'PRODUÇÃO',detail:h.stage,at:h.at,by:h.by});for(const pay of o.payments||[])ev.push({type:'PAGAMENTO',detail:`${money(pay.value)} • ${paymentMethodLabel(pay.method)}`,at:pay.at||pay.date,by:pay.by});return ev.sort((a,b)=>String(b.at||'').localeCompare(String(a.at||'')))}
function openTimeline(n){const o=db.orders.find(x=>Number(x.numero)===Number(n));if(!o)return;const rows=orderTimeline(o).map(x=>`<tr><td>${new Date(x.at).toLocaleString('pt-BR')}</td><td><strong>${esc(x.type)}</strong></td><td>${esc(x.detail||'-')}</td><td>${esc(x.by||'-')}</td></tr>`).join('');openModal(`<h2>Linha do tempo • Pedido ${String(o.numero).padStart(6,'0')}</h2><div class="table-wrap"><table class="table"><tr><th>Data / hora</th><th>Evento</th><th>Detalhe</th><th>Usuário</th></tr>${rows||'<tr><td colspan="4">Sem eventos.</td></tr>'}</table></div>`)}
function audit(area,action,reference='',detail=''){db.auditLog=db.auditLog||[];db.auditLog.unshift({id:uid(),at:new Date().toISOString(),by:currentUsername(),area,action,reference:String(reference||''),detail:String(detail||'')});if(db.auditLog.length>5000)db.auditLog.length=5000}
function renderAudit(){const tb=$('auditTable');if(!tb)return;tb.innerHTML=(db.auditLog||[]).slice(0,1000).map(a=>`<tr><td>${new Date(a.at).toLocaleString('pt-BR')}</td><td>${esc(a.by||'-')}</td><td>${esc(a.area||'-')}</td><td>${esc(a.action||'-')}</td><td>${esc(a.reference||'-')}</td><td>${esc(a.detail||'-')}</td></tr>`).join('')||'<tr><td colspan="6">Nenhum evento registrado.</td></tr>'}
function companySettings(){db.settings=db.settings||{};db.settings.company=db.settings.company||{tradeName:'Nova Imagem Cortinas e Persianas',legalName:'Luiz Sergio Delgobo ME',cnpj:'15.115.803/0001-69',ie:'90.588.753-06',address:'Av. Bonifácio Vilela, 170, Ponta Grossa–PR, CEP 84010-330',phone:'42 98801-1435',version:'V11.5',clauses:'O cliente declara ter conferido medidas, tecidos, cores, acabamentos e condições comerciais. Alterações após a liberação para produção poderão alterar prazo e custos. O prazo contratado considera as condições registradas no pedido.'};return db.settings.company}
function renderSettings(){const c=companySettings();[['cfgTradeName','tradeName'],['cfgLegalName','legalName'],['cfgCnpj','cnpj'],['cfgIe','ie'],['cfgAddress','address'],['cfgPhone','phone'],['cfgVersion','version'],['cfgClauses','clauses']].forEach(([id,k])=>{if($(id))$(id).value=c[k]||''})}
function saveCompanySettings(){const c=companySettings(),before=JSON.stringify(c);Object.assign(c,{tradeName:$('cfgTradeName').value.trim(),legalName:$('cfgLegalName').value.trim(),cnpj:$('cfgCnpj').value.trim(),ie:$('cfgIe').value.trim(),address:$('cfgAddress').value.trim(),phone:$('cfgPhone').value.trim(),version:$('cfgVersion').value.trim()||'V11.5',clauses:$('cfgClauses').value.trim()});audit('CONFIGURAÇÕES','ALTERAÇÃO','EMPRESA',before===JSON.stringify(c)?'Sem mudança':'Dados da empresa/contrato atualizados');queueSave();alert('Configurações salvas.')}
function downloadJson(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function backupFile(kind){const stamp=today();if(kind==='full')return downloadJson(`NOVA-IMAGEM-V11-BACKUP-COMPLETO-${stamp}.json`,db);if(kind==='clients')return downloadJson(`V11-CLIENTES-${stamp}.json`,db.clients||[]);if(kind==='orders')return downloadJson(`V11-PEDIDOS-${stamp}.json`,db.orders||[]);if(kind==='finance')return downloadJson(`V11-FINANCEIRO-${stamp}.json`,{payables:db.payables||[],orders:(db.orders||[]).map(o=>({numero:o.numero,client:o.client,agreedValue:o.agreedValue,payments:o.payments||[]}))});if(kind==='stock')return downloadJson(`V11-ESTOQUE-OFICIAL-${stamp}.json`,priceProducts)}
function entityAttachments(type,id){return (db.attachments||[]).filter(a=>a.entityType===type&&String(a.entityId)===String(id))}
function openAttachments(type,id,title){const rows=entityAttachments(type,id);openModal(`<h2>Anexos • ${esc(title)}</h2><p class="muted">Arquivos pequenos ficam sincronizados no banco da V11. Limite atual: 750 KB por arquivo.</p><label class="field">Tipo<select id="attType"><option>FOTO DE MEDIÇÃO</option><option>FOTO DO AMBIENTE</option><option>INSTALAÇÃO CONCLUÍDA</option><option>COMPROVANTE</option><option>CONTRATO ASSINADO</option><option>OUTRO</option></select></label><label class="field">Arquivo<input id="attFile" type="file"></label><button id="attSave" class="btn primary">Anexar</button><div class="table-wrap" style="margin-top:12px"><table class="table"><tr><th>Tipo</th><th>Arquivo</th><th>Data</th><th>Usuário</th><th>Ação</th></tr>${rows.map(a=>`<tr><td>${esc(a.type)}</td><td>${esc(a.name)}</td><td>${new Date(a.at).toLocaleString('pt-BR')}</td><td>${esc(a.by)}</td><td><a class="btn ghost" href="${a.dataUrl}" download="${esc(a.name)}">Abrir</a> <button class="btn danger" data-att-del="${a.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="5">Nenhum anexo.</td></tr>'}</table></div>`);$('attSave').onclick=()=>{const f=$('attFile').files[0];if(!f)return alert('Selecione um arquivo.');if(f.size>750*1024)return alert('Arquivo acima de 750 KB. Para arquivos maiores, a próxima evolução será armazenamento dedicado.');const r=new FileReader();r.onload=()=>{db.attachments=db.attachments||[];db.attachments.unshift({id:uid(),entityType:type,entityId:String(id),type:$('attType').value,name:f.name,mime:f.type,size:f.size,dataUrl:r.result,at:new Date().toISOString(),by:currentUsername()});audit('ANEXOS','INCLUSÃO',`${type}:${id}`,`${$('attType').value} • ${f.name}`);queueSave();openAttachments(type,id,title)};r.readAsDataURL(f)};document.querySelectorAll('[data-att-del]').forEach(b=>b.onclick=()=>{if(confirm('Excluir este anexo?')){db.attachments=db.attachments.filter(a=>a.id!==b.dataset.attDel);audit('ANEXOS','EXCLUSÃO',`${type}:${id}`,b.dataset.attDel);queueSave();openAttachments(type,id,title)}})}
function renderOrders(){const tb=$('ordersTable');if(!tb)return;tb.innerHTML='';for(const o of db.orders.filter(canSeeOrder)){const install=o.installation?.completedDate?'CONCLUÍDA':o.productionStage==='EXPEDIÇÃO'?'PRONTO PARA INSTALAÇÃO':'AGUARDANDO',paid=orderPaid(o),bal=orderBalance(o),fs=financialStatus(o);const tr=document.createElement('tr');tr.innerHTML=`<td>${String(o.numero).padStart(6,'0')}</td><td>${String(o.quoteNumber).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(displaySeller(o))}</td><td>${money(o.agreedValue)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td><span class="badge ${fs==='QUITADO'?'ok':fs==='PARCIAL'?'blue':'warn'}">${fs}</span></td><td><span class="badge blue">${esc(o.productionStage||'RECEPÇÃO')}</span></td><td><span class="badge ${install==='CONCLUÍDA'?'ok':'warn'}">${install}</span></td><td><button class="btn primary" data-order-pay="${o.numero}">Inserir pagamento</button> <button class="btn ghost" data-order-open="${o.numero}">Abrir</button> ${isGestor()?`<button class="btn danger" data-order-delete="${o.numero}">Excluir</button>`:''}</td>`;tb.appendChild(tr)}document.querySelectorAll('[data-order-open]').forEach(b=>b.onclick=()=>openOrder(Number(b.dataset.orderOpen)));document.querySelectorAll('[data-order-pay]').forEach(b=>b.onclick=()=>openPayment(Number(b.dataset.orderPay)));document.querySelectorAll('[data-order-delete]').forEach(b=>b.onclick=()=>deleteOrder(Number(b.dataset.orderDelete)))}
async function deleteOrder(n){if(!isGestor())return alert('Apenas o GESTOR pode excluir pedidos.');const o=db.orders.find(x=>Number(x.numero)===n);if(!o)return;if((o.payments||[]).length&&!confirm('ATENÇÃO: este pedido possui pagamentos registrados. Excluir o pedido também removerá esses recebimentos do financeiro. Continuar?'))return;if(!confirm('Excluir este pedido? O estoque utilizado será devolvido e o orçamento voltará ao status ORÇAMENTO.'))return;const officialRestore=await restoreOfficialStock(o);if(!officialRestore.ok)return alert(officialRestore.error);restoreOrderStock(o);db.products=(db.products||[]).filter(p=>Number(p.orderNumber)!==Number(o.numero));db.orders=db.orders.filter(x=>Number(x.numero)!==n);const q=db.quotes.find(x=>Number(x.numero)===Number(o.quoteNumber));if(q)q.status='ORÇAMENTO';queueSave();renderAll()}
function openPayment(n){const o=db.orders.find(x=>Number(x.numero)===Number(n));if(!o)return;const bal=orderBalance(o);if(bal<=0.005)return alert('Este pedido já está quitado.');openModal(`<h2>Inserir pagamento • Pedido ${String(o.numero).padStart(6,'0')}</h2><div class="kpis"><div class="kpi"><span>Valor contratado</span><strong>${money(o.agreedValue)}</strong></div><div class="kpi"><span>Já recebido</span><strong>${money(orderPaid(o))}</strong></div><div class="kpi"><span>Saldo devedor</span><strong>${money(bal)}</strong></div></div><div class="grid two"><label class="field">Valor recebido<input id="payVal" type="number" min="0.01" max="${bal}" step="0.01" value="${bal.toFixed(2)}"></label><label class="field">Data do recebimento<input id="payDate" type="date" value="${today()}"></label><label class="field">Forma de pagamento<select id="payMethod"><option>PIX</option><option>DINHEIRO</option><option>CARTÃO</option><option>TRANSFERÊNCIA</option><option>BOLETO</option><option>OUTRO</option></select></label><label class="field">Observação<input id="payNotes" placeholder="Ex.: entrada, parcela 2/4..."></label></div><button id="paySave" class="btn primary">Confirmar recebimento</button>`);$('paySave').onclick=()=>{const v=Number($('payVal').value),d=$('payDate').value;if(!v||!d)return alert('Informe valor e data.');if(v>orderBalance(o)+0.005)return alert(`O pagamento não pode ultrapassar o saldo devedor de ${money(orderBalance(o))}.`);o.payments=o.payments||[];o.payments.push({id:uid(),value:v,date:d,method:$('payMethod').value,notes:$('payNotes').value.trim(),by:currentUsername(),at:new Date().toISOString()});addOrderEvent(o,'RECEBIMENTO REGISTRADO',`${money(v)} • ${$('payMethod').value}`);audit('FINANCEIRO','RECEBIMENTO',`PEDIDO ${o.numero}`,`${money(v)} • ${$('payMethod').value}`);queueSave();closeModal();renderAll()}}
function renderReceivables(){const tb=$('receivablesTable');if(!tb)return;const list=db.orders.filter(o=>orderBalance(o)>0.005);tb.innerHTML=list.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${fmtDate(o.createdDate)}</td><td>${paymentConditionLabel(o.paymentCondition)}</td><td>${money(o.agreedValue)}</td><td>${money(orderPaid(o))}</td><td><strong>${money(orderBalance(o))}</strong></td><td><span class="badge ${financialStatus(o)==='PARCIAL'?'blue':'warn'}">${financialStatus(o)}</span></td><td><button class="btn primary" data-rec-pay="${o.numero}">Receber</button></td></tr>`).join('');document.querySelectorAll('[data-rec-pay]').forEach(b=>b.onclick=()=>openPayment(Number(b.dataset.recPay)));const total=list.reduce((a,o)=>a+orderBalance(o),0);if($('receivablesSummary'))$('receivablesSummary').innerHTML=`<div class="kpi"><span>Pedidos com saldo</span><strong>${list.length}</strong></div><div class="kpi"><span>Total a receber</span><strong>${money(total)}</strong></div>`}
function allRevenuePayments(){return db.orders.flatMap(o=>(o.payments||[]).map(p=>({...p,orderNumber:o.numero,client:o.client,seller:displaySeller(o)}))).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))}
function renderRevenues(){const tb=$('revenuesTable');if(!tb)return;const f=$('revFrom')?.value||'',t=$('revTo')?.value||'';const all=allRevenuePayments(),list=all.filter(p=>(!f||p.date>=f)&&(!t||p.date<=t));tb.innerHTML=list.map(p=>`<tr><td>${fmtDate(p.date)}</td><td>${String(p.orderNumber).padStart(6,'0')}</td><td>${esc(p.client)}</td><td>${esc(p.seller||'-')}</td><td>${esc(paymentMethodLabel(p.method))}</td><td><strong>${money(p.value)}</strong></td><td>${esc(p.notes||'-')}</td><td>${esc(p.by||'-')}</td></tr>`).join('');if($('revenuesSummary'))$('revenuesSummary').innerHTML=`<div class="kpi"><span>Recebimentos no filtro</span><strong>${list.length}</strong></div><div class="kpi"><span>Receita efetivamente recebida</span><strong>${money(list.reduce((a,p)=>a+Number(p.value||0),0))}</strong></div>`}
function paymentConditionLabel(cond){return cond==='cash'?'À VISTA':cond==='p18'?'ATÉ 18X':'ATÉ 4X'}
function environmentConditionValue(c,cond){return cond==='cash'?Number(c.cash||0):cond==='p18'?Number(c.p18||0):Number(c.base4||0)}
function environmentMaterialRows(e,cond=''){const rows=officialOrderRequirements({environments:[e]});return rows.map(x=>{const unit=cond==='cash'?Number(x.price_cash||0):cond==='p18'?Number(x.price_18x||0):Number(x.price_4x||0);return `<tr><td>${esc(x.internal_code||'-')}</td><td>${esc(x.product_name||'-')}</td><td>${esc(x.color||'-')}</td><td>${Number(x.qty||0).toFixed(norm(x.unit)==='M'?2:0)} ${esc(norm(x.unit||'UN'))}</td>${cond?`<td>${money(unit)}</td><td>${money(unit*Number(x.qty||0))}</td>`:''}</tr>`}).join('')}
function customerPortalUrl(orderNumber){const n=String(orderNumber).padStart(6,'0');return `${location.origin}${location.pathname}?cliente=${encodeURIComponent(n)}`}
function customerPortalQrUrl(orderNumber){return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(customerPortalUrl(orderNumber))}`}
function orderEnvironmentCommercialSummary(o,e){
 const c=calcEnvironment(e);if(!c)return {sale:0,inputs:0,labor:0};
 const sale=environmentConditionValue(c,o.paymentCondition);
 const reqs=officialOrderRequirements({environments:[e]});
 const inputs=reqs.reduce((a,x)=>{const unit=o.paymentCondition==='cash'?Number(x.price_cash||0):o.paymentCondition==='p18'?Number(x.price_18x||0):Number(x.price_4x||0);return a+unit*Number(x.qty||0)},0);
 const labor=Number(c.laborTotal||0);
 return {sale,inputs,labor};
}
function generateOrderLabelsV127(orderNumber){
 const o=(db.orders||[]).find(x=>Number(x.numero)===Number(orderNumber));if(!o)return alert('Pedido não encontrado.');
 const labels=[];
 for(const e of o.environments||[]){
   const n=Math.max(1,Number(e.leaves||1));
   if(e.model!=='LINING')for(let i=1;i<=n;i++)labels.push({env:e.name,size:`${e.width} x ${e.height} cm`,fabric:[e.finish,e.finishColor].filter(Boolean).join(' • '),id:`ACABAMENTO ${i}/${n}`});
   if(e.model!=='FINISH')for(let i=1;i<=n;i++)labels.push({env:e.name,size:`${e.width} x ${e.height} cm`,fabric:[e.lining,e.liningColor].filter(Boolean).join(' • '),id:`FORRO ${i}/${n}`});
 }
 if(!labels.length)return alert('Não há folhas para etiquetar neste pedido.');
 const w=window.open('about:blank','_blank');if(!w)return alert('Libere pop-ups para gerar as etiquetas.');
 w.document.write(`<html><head><title>Etiquetas • Pedido ${String(o.numero).padStart(6,'0')}</title><style>@page{size:A4 portrait;margin:8mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#000}.tools{margin:0 0 6mm}.tools button{padding:8px 12px;margin-right:6px}.sheet{display:grid;grid-template-columns:repeat(4,40mm);gap:3mm;align-items:start}.label{width:40mm;height:55mm;border:1.2px solid #000;padding:2.2mm;overflow:hidden;break-inside:avoid;font-size:7.2pt;line-height:1.12}.logo{height:8mm;text-align:center;border-bottom:1px solid #000;margin-bottom:1.5mm}.logo img{height:7mm;max-width:25mm;object-fit:contain}.client{font-size:8pt;font-weight:800;margin-bottom:1mm}.row{margin:.8mm 0}.check{font-size:7pt;margin:1.2mm 0;border-top:1px solid #bbb;border-bottom:1px solid #bbb;padding:.8mm 0}.leaf{font-weight:900;font-size:8.3pt;margin-top:1mm}@media print{.tools{display:none}.sheet{gap:3mm}}</style></head><body><div class="tools"><button onclick="window.print()">IMPRIMIR</button><button onclick="window.close()">RETORNAR</button> ${labels.length} etiqueta(s)</div><div class="sheet">${labels.map(l=>`<div class="label"><div class="logo"><img src="${location.origin}/icon-512.png"></div><div class="client">${esc(o.client||'-')}</div><div class="row"><b>PEDIDO:</b> ${String(o.numero).padStart(6,'0')}</div><div class="row"><b>AMBIENTE:</b> ${esc(l.env||'-')}</div><div class="row"><b>MEDIDA:</b> ${esc(l.size)}</div><div class="check">☐ EXATO &nbsp;&nbsp; ☐ DAR DESCONTO</div><div class="row"><b>TECIDO:</b> ${esc(l.fabric||'-')}</div><div class="leaf">${esc(l.id)}</div></div>`).join('')}</div></body></html>`);w.document.close();w.focus();
}
function openOrderDateEditor(orderNumber){
 if(!isGestor())return alert('Apenas o GESTOR pode alterar a data do pedido.');
 const o=(db.orders||[]).find(x=>Number(x.numero)===Number(orderNumber));if(!o)return;
 const oldDate=String(o.createdDate||o.date||today()).slice(0,10);
 openModal(`<h2>Alterar data do pedido ${String(o.numero).padStart(6,'0')}</h2><div class="grid two"><label class="field">Data atual<input value="${oldDate}" disabled></label><label class="field">Nova data<input id="newOrderDate" type="date" value="${oldDate}"></label></div><div id="orderDateImpact" class="notice" style="margin:12px 0"></div><div class="actions"><button id="confirmOrderDate" class="btn primary">CONFIRMAR</button><button id="cancelOrderDate" class="btn ghost">CANCELAR</button></div>`);
 const refresh=()=>{const nd=$('newOrderDate').value||oldDate,oldComp=oldDate.slice(0,7),newComp=nd.slice(0,7);$('orderDateImpact').innerHTML=oldComp===newComp?`A alteração permanece na mesma competência (${oldComp}).`:`Este pedido sairá do fechamento <strong>${oldComp}</strong> e entrará no fechamento <strong>${newComp}</strong>.<br>Valor transferido entre competências: <strong>${money(Number(o.agreedValue||0))}</strong>.`;};
 $('newOrderDate').onchange=refresh;refresh();$('cancelOrderDate').onclick=closeModal;
 $('confirmOrderDate').onclick=()=>{const nd=$('newOrderDate').value;if(!nd)return alert('Informe a nova data.');if(nd===oldDate)return closeModal();const before=oldDate;o.createdDate=nd;o.date=nd;o.dateHistory=o.dateHistory||[];o.dateHistory.unshift({from:before,to:nd,at:new Date().toISOString(),by:currentUsername()});audit('PEDIDOS','ALTERAÇÃO DE DATA',String(o.numero).padStart(6,'0'),`Data alterada de ${before} para ${nd}`);queueSave();closeModal();renderAll();setTimeout(()=>openOrder(o.numero),0)};
}
function printCustomerOrder(o){
 const q=db.quotes.find(x=>Number(x.numero)===Number(o.quoteNumber));const cond=paymentConditionLabel(o.paymentCondition);let envs='';
 for(const e of o.environments||[]){const c=calcEnvironment(e);if(!c)continue;const mats=environmentMaterialRows(e,o.paymentCondition),sum=orderEnvironmentCommercialSummary(o,e);envs+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td colspan="3">${e.excludeFixation?'SEM FIXAÇÃO / SEM INSTALAÇÃO':`${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}`}</td></tr><tr><th>VALOR DESTE AMBIENTE</th><td><strong>${money(sum.sale)}</strong></td><th>INSUMOS</th><td><strong>${money(sum.inputs)}</strong></td></tr><tr><th>MÃO DE OBRA</th><td colspan="3"><strong>${money(sum.labor)}</strong> <small>(confecção + instalação)</small></td></tr>${e.notes?`<tr><th>Observações</th><td colspan="3">${esc(e.notes)}</td></tr>`:''}</table><div class="section-title">Materiais deste ambiente</div><table class="summary-table"><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>${mats||'<tr><td colspan="6">Sem material oficial vinculado.</td></tr>'}</table></div>`}
 const body=`<div class="screen-only" style="margin-bottom:8px"><button onclick="window.opener && window.opener.generateOrderLabelsV127(${Number(o.numero)})">GERAR ETIQUETAS</button></div><div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas e Persianas</strong><br>Luiz Sergio Delgobo ME<br>CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330<br><br><strong>PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br><strong>Cliente:</strong> ${esc(o.client||'-')}<br><strong>Contato:</strong> ${esc(o.contact||'-')}<br><strong>Endereço:</strong> ${esc(o.address||'-')}<br><strong>Data do pedido:</strong> ${fmtDate(o.createdDate)}<br><strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}</div></div>${envs}<div class="section-title">Acompanhe seu pedido</div><div class="customer-access-box"><img class="customer-qr" src="${customerPortalQrUrl(o.numero)}" alt="QR Code para acompanhar o pedido"><div><strong>Portal do Cliente Nova Imagem</strong><br><span>Aponte a câmera do celular para o QR Code.</span><br><br>Pedido: <strong>${String(o.numero).padStart(6,'0')}</strong><br>Senha: <strong>${esc(o.clientAccessCode||'NÃO GERADA')}</strong><br><br><strong>Acesso pelo PDF:</strong><br><a class="customer-portal-link" href="${customerPortalUrl(o.numero)}" target="_blank">Clique aqui para acompanhar seu pedido</a></div></div><div class="section-title">Condição contratada</div><p class="totals">${cond}: ${money(o.agreedValue)}</p><div class="section-title">CONTRATO DE FORNECIMENTO E INSTALAÇÃO</div><div class="conditions"><p><strong>CONTRATADA:</strong> Luiz Sergio Delgobo ME, CNPJ 15.115.803/0001-69.</p><p><strong>CONTRATANTE:</strong> ${esc(o.client||'-')}, endereço ${esc(o.address||'-')}.</p><p><strong>OBJETO:</strong> fornecimento e instalação dos produtos descritos neste pedido.</p><p><strong>CONDIÇÃO:</strong> ${esc(cond)}, valor contratado de ${money(o.agreedValue)}.</p><p><strong>PRAZO PREVISTO:</strong> instalação/entrega em ${fmtDate(o.deliveryDate)}.</p></div><div class="signature-grid"><div><div class="signature-line"></div><strong>Cliente / Contratante</strong></div><div><div class="signature-line"></div><strong>Nova Imagem / Vendedor</strong></div></div>`;printWindow(body)}
function printProductionOrder(o){let envs='';for(const e of o.environments||[]){const c=calcEnvironment(e);if(!c)continue;const mats=environmentMaterialRows(e);envs+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td>${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td><th>Deslizantes</th><td>${c.finishSliders||0} acabamento + ${c.liningSliders||0} forro</td></tr><tr><th>Costura</th><td colspan="3">${Number(c.sewingMeters||0).toFixed(2)} m</td></tr>${e.notes?`<tr style="background:#fff3a8"><th style="font-weight:900">OBSERVAÇÕES</th><td colspan="3" style="font-weight:800">${esc(e.notes)}</td></tr>`:`<tr><th>Observações</th><td colspan="3">Sem observações.</td></tr>`}</table><div class="section-title">Materiais / separação</div><table class="summary-table"><tr><th>SKU</th><th>Material</th><th>Cor</th><th>Quantidade</th></tr>${mats||'<tr><td colspan="4">Sem material oficial vinculado.</td></tr>'}</table></div>`}const body=`<div class="screen-only" style="margin-bottom:8px"><button onclick="window.opener && window.opener.generateOrderLabelsV127(${Number(o.numero)})">GERAR ETIQUETAS</button></div><div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>ORDEM DE SERVIÇO / PRODUÇÃO</strong><br><br><strong>Pedido:</strong> ${String(o.numero).padStart(6,'0')}<br><strong>Cliente:</strong> ${esc(o.client||'-')}<br><strong>Contato:</strong> ${esc(o.contact||'-')}<br><strong>Endereço:</strong> ${esc(o.address||'-')}<br><strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}</div></div>${envs}<div class="section-title">Observações gerais</div><p>${esc((o.notes||'').trim()||'Sem observações gerais.')}</p>`;printWindow(body)}
function openOrder(n){const o=db.orders.find(x=>Number(x.numero)===n);if(!o)return;const paid=orderPaid(o);const payRows=(o.payments||[]).slice().reverse().map(p=>`<tr><td>${fmtDate(p.date)}</td><td>${money(p.value)}</td><td>${esc(paymentMethodLabel(p.method))}</td><td>${esc(p.notes||'-')}</td><td>${esc(p.by||'-')}</td></tr>`).join('');openModal(`<h2>Pedido ${String(o.numero).padStart(6,'0')}</h2><div class="detail-list"><div class="detail-item"><span>Cliente</span><strong>${esc(o.client)}</strong></div><div class="detail-item"><span>Valor contratado</span><strong>${money(o.agreedValue)}</strong></div><div class="detail-item"><span>Valor pago</span><strong>${money(paid)}</strong></div><div class="detail-item"><span>Saldo devedor</span><strong>${money(orderBalance(o))}</strong></div><div class="detail-item"><span>Status financeiro</span><strong>${financialStatus(o)}</strong></div><div class="detail-item"><span>Produção</span><strong>${esc(o.productionStage)}</strong></div><div class="detail-item"><span>Data do pedido</span><strong>${fmtDate(o.createdDate)}</strong></div><div class="detail-item"><span>Entrega</span><strong>${fmtDate(o.deliveryDate)}</strong></div><div class="detail-item"><span>Condição</span><strong>${paymentConditionLabel(o.paymentCondition)}</strong></div></div><div class="actions" style="margin:12px 0"><button id="openCustomerOrder" class="btn primary">ABRIR PEDIDO</button><button id="printOS" class="btn secondary">ABRIR ORDEM DE SERVIÇO</button><button id="labelsBtn" class="btn secondary">GERAR ETIQUETAS</button><button id="timelineBtn" class="btn ghost">LINHA DO TEMPO</button><button id="orderAttachmentsBtn" class="btn ghost">ANEXOS</button><button id="reworkOrderBtn" class="btn ghost">ABRIR RETRABALHO</button>${isGestor()?'<button id="changeOrderDateBtn" class="btn ghost">ALTERAR DATA DO PEDIDO</button><button id="printResult" class="btn ghost">RESULTADO DO PEDIDO</button>':''}${orderBalance(o)>0.005?'<button id="addPay" class="btn primary">INSERIR PAGAMENTO</button>':''}</div><h3>Histórico de recebimentos</h3><div class="table-wrap"><table class="table"><tr><th>Data</th><th>Valor</th><th>Forma</th><th>Observação</th><th>Usuário</th></tr>${payRows||'<tr><td colspan="5">Nenhum pagamento registrado.</td></tr>'}</table></div>`);$('openCustomerOrder').onclick=()=>printCustomerOrder(o);$('printOS').onclick=()=>printProductionOrder(o);$('labelsBtn').onclick=()=>generateOrderLabelsV127(o.numero);$('timelineBtn').onclick=()=>openTimeline(o.numero);$('orderAttachmentsBtn').onclick=()=>openAttachments('ORDER',o.numero,`Pedido ${String(o.numero).padStart(6,'0')}`);$('reworkOrderBtn').onclick=()=>openRework(o.numero);if($('changeOrderDateBtn'))$('changeOrderDateBtn').onclick=()=>openOrderDateEditor(o.numero);if($('printResult'))$('printResult').onclick=()=>printOrderResult(o);if($('addPay'))$('addPay').onclick=()=>openPayment(o.numero)}
function environmentCostSnapshot(o,e){const x=(o.costSnapshot?.environments||[]).find(v=>v.name===e.name);if(x)return x;const c=calcEnvironment(e);return {name:e.name,installation:Number(c?.installCost||0),production:Number((c?.sewingCost||0)+(c?.finishPleat||0)+(c?.liningPleat||0)+(c?.customPleat||0)),cashSale:Number(c?.cash||0)}}
function environmentResultRows(o){return (o.environments||[]).map(e=>{const snap=environmentCostSnapshot(o,e),discount=1-Number(o.discountPercent||0)/100,sale=Number(snap.cashSale||0)*discount;const mats=(o.officialStockSnapshot||[]).filter(x=>(x.environments||[]).includes(e.name));const inputs=mats.reduce((a,x)=>a+Number(x.qty||0)*Number(x.cost||0)/(Math.max(1,(x.environments||[]).length)),0);const installation=Number(snap.installation||0),production=Number(snap.production||0),commission=sale*Number(o.commissionPercent??sellerCommission(resolveSellerUser(o)))/100,totalCost=inputs+installation+production+commission,result=sale-totalCost,margin=sale?result/sale*100:0;return {name:e.name,sale,inputs,installation,production,commission,totalCost,result,margin}})}
function orderResultData(o){
 const materialRows=(o.officialStockSnapshot||[]).map(x=>({sku:x.internal_code||'-',name:x.product_name||'-',color:x.color||'-',qty:Number(x.qty||0),unit:norm(x.unit||'UN'),unitCost:Number(x.cost||0),total:Number(x.qty||0)*Number(x.cost||0),environments:x.environments||[]}));
 const officialCost=materialRows.reduce((a,x)=>a+x.total,0),env=environmentResultRows(o),envSale=env.reduce((a,x)=>a+x.sale,0),envInstallation=env.reduce((a,x)=>a+x.installation,0),envProduction=env.reduce((a,x)=>a+x.production,0),envCommission=env.reduce((a,x)=>a+x.commission,0);
 const legacyCost=(o.stockMovements||[]).reduce((a,m)=>{const p=(db.products||[]).find(x=>x.id===m.productId);return a+Number(m.qty||0)*Number(p?.cost||0)},0),blindSale=(o.blinds||[]).reduce((a,b)=>a+Number(b.cash||0)*Number(b.qty||1),0)*(1-Number(o.discountPercent||0)/100),blindPOs=(db.purchaseOrders||[]).filter(po=>Number(po.sourceOrderNumber)===Number(o.numero)&&['RECEBIDA','FINALIZADA'].includes(po.status)),actualBlindCost=blindPOs.reduce((a,po)=>a+(po.items||[]).filter(x=>x.isBlind||norm(x.category)==='PERSIANA').reduce((z,x)=>z+Number(x.qty||0)*Number(x.unitValue||0),0),0),blindsCost=actualBlindCost||((o.blinds||[]).reduce((a,b)=>a+(Number(b.cash||0)/1.60)*Number(b.qty||1),0)),specialCost=(o.looseProducts||[]).reduce((a,x)=>a+Number(x.cost||0)*Number(x.qty||0),0);
 const travelCost=Number(o.resultAdjustments?.travelCost||0),otherCost=Number(o.resultAdjustments?.otherCost||0),materialCost=officialCost+legacyCost+blindsCost+specialCost,totalCost=materialCost+envInstallation+envProduction+envCommission+travelCost+otherCost,revenue=envSale+blindSale,result=revenue-totalCost,margin=revenue?result/revenue*100:0,paid=orderPaid(o),cashResult=paid-totalCost;
 return {materialRows,officialCost,legacyCost,blindSale,blindsCost,specialCost,materialCost,commission:envCommission,installation:envInstallation,production:envProduction,travelCost,otherCost,totalCost,revenue,result,margin,paid,cashResult};
}
function printOrderResult(o){if(!isGestor())return alert('Apenas o GESTOR pode acessar o resultado do pedido.');const r=orderResultData(o),env=environmentResultRows(o),generated=new Date().toLocaleString('pt-BR');const mats=r.materialRows.map(x=>`<tr><td>${esc(x.sku)}</td><td>${esc(x.name)}</td><td>${esc(x.color)}</td><td>${x.qty.toFixed(x.unit==='M'?2:0)} ${esc(x.unit)}</td><td>${money(x.unitCost)}</td><td>${money(x.total)}</td></tr>`).join('');const er=env.map(x=>`<tr><td>${esc(x.name)}</td><td>${money(x.sale)}</td><td>${money(x.inputs)}</td><td>${money(x.installation)}</td><td>${money(x.production)}</td><td>${money(x.commission)}</td><td>${money(x.totalCost)}</td><td><strong>${money(x.result)}</strong></td><td><strong>${x.margin.toFixed(1)}%</strong></td></tr>`).join('');const et=env.reduce((a,x)=>{for(const k of ['sale','inputs','installation','production','commission','totalCost','result'])a[k]+=x[k];return a},{sale:0,inputs:0,installation:0,production:0,commission:0,totalCost:0,result:0});const em=et.sale?et.result/et.sale*100:0;printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>DEMONSTRATIVO DE RESULTADO DO PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br><br><strong>Cliente:</strong> ${esc(o.client)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}<br><strong>Data do pedido:</strong> ${fmtDate(o.createdDate)}<br><strong>Gerado em:</strong> ${esc(generated)}</div></div><div class="section-title">Resultado por ambiente</div><table class="summary-table"><tr><th>AMBIENTE</th><th>VENDA À VISTA</th><th>CUSTOS DE INSUMOS</th><th>CUSTO DE INSTALAÇÃO</th><th>CUSTO DE CONFECÇÃO</th><th>COMISSÃO</th><th>CUSTO TOTAL</th><th>RESULTADO LÍQUIDO</th><th>MARGEM DO PEDIDO</th></tr>${er}<tr><th>TOTAL DO PEDIDO</th><th>${money(et.sale)}</th><th>${money(et.inputs)}</th><th>${money(et.installation)}</th><th>${money(et.production)}</th><th>${money(et.commission)}</th><th>${money(et.totalCost)}</th><th>${money(et.result)}</th><th>${em.toFixed(1)}%</th></tr></table><div class="section-title">Persianas — repasse</div><table class="summary-table"><tr><th>VENDA DE PERSIANAS</th><th>CUSTO DE PERSIANAS</th><th>RESULTADO DE PERSIANAS</th></tr><tr><td>${money(r.blindSale||0)}</td><td>${money(r.blindsCost||0)}</td><td><strong>${money((r.blindSale||0)-(r.blindsCost||0))}</strong></td></tr></table><div class="section-title">Resumo gerencial</div><table class="summary-table"><tr><th>Venda à vista</th><td>${money(r.revenue)}</td><th>Recebido até agora</th><td>${money(r.paid)}</td></tr><tr><th>Insumos</th><td>${money(r.materialCost)}</td><th>Instalação</th><td>${money(r.installation)}</td></tr><tr><th>Confecção</th><td>${money(r.production)}</td><th>Comissão</th><td>${money(r.commission)}</td></tr><tr><th>Deslocamento / outros</th><td>${money(r.travelCost+r.otherCost)}</td><th>CUSTO TOTAL</th><td><strong>${money(r.totalCost)}</strong></td></tr><tr><th>RESULTADO LÍQUIDO</th><td><strong>${money(r.result)}</strong></td><th>MARGEM</th><td><strong>${r.margin.toFixed(1)}%</strong></td></tr></table><div class="section-title">Materiais oficiais — custo congelado no pedido</div><table class="summary-table"><tr><th>SKU</th><th>Material</th><th>Cor</th><th>Qtd.</th><th>Custo unit.</th><th>Custo total</th></tr>${mats||'<tr><td colspan="6">Sem materiais oficiais registrados.</td></tr>'}</table><p class="conditions">Relatório gerencial. Venda por ambiente considerada pelo valor à vista. Custos de instalação e confecção ficam congelados no pedido no momento da conversão para os novos pedidos.</p>`)}
function openResultAdjustments(n){if(!isGestor())return;const o=db.orders.find(x=>Number(x.numero)===Number(n));if(!o)return;o.resultAdjustments=o.resultAdjustments||{};openModal(`<h2>Custos complementares • Pedido ${String(o.numero).padStart(6,'0')}</h2><div class="grid two"><label class="field">Custo real de deslocamento<input id="resTravel" type="number" step="0.01" value="${Number(o.resultAdjustments.travelCost||0)}"></label><label class="field">Outros custos do pedido<input id="resOther" type="number" step="0.01" value="${Number(o.resultAdjustments.otherCost||0)}"></label><label class="field" style="grid-column:1/-1">Observações gerenciais<textarea id="resNotes">${esc(o.resultAdjustments.notes||'')}</textarea></label></div><button id="resSave" class="btn primary">Salvar custos</button>`);$('resSave').onclick=()=>{o.resultAdjustments={travelCost:Number($('resTravel').value||0),otherCost:Number($('resOther').value||0),notes:$('resNotes').value.trim(),updatedAt:new Date().toISOString(),by:currentUsername()};queueSave();closeModal();renderResults();renderKpis()}}
function renderResults(){const tb=$('resultsTable');if(!tb)return;const list=db.orders.slice().sort((a,b)=>Number(b.numero)-Number(a.numero));tb.innerHTML=list.map(o=>{const r=orderResultData(o);return `<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${money(r.revenue)}</td><td>${money(r.totalCost)}</td><td><strong>${money(r.result)}</strong></td><td><strong>${r.margin.toFixed(1)}%</strong></td><td>${money(r.paid)}</td><td><button class="btn primary" data-result-pdf="${o.numero}">PDF Resultado</button> <button class="btn ghost" data-result-cost="${o.numero}">Custos extras</button></td></tr>`}).join('');document.querySelectorAll('[data-result-pdf]').forEach(b=>b.onclick=()=>printOrderResult(db.orders.find(o=>Number(o.numero)===Number(b.dataset.resultPdf))));document.querySelectorAll('[data-result-cost]').forEach(b=>b.onclick=()=>openResultAdjustments(Number(b.dataset.resultCost)));const rr=list.map(orderResultData);if($('resultsSummary'))$('resultsSummary').innerHTML=`<div class="kpi"><span>Pedidos</span><strong>${list.length}</strong></div><div class="kpi"><span>Receita contratada</span><strong>${money(rr.reduce((a,x)=>a+x.revenue,0))}</strong></div><div class="kpi"><span>Custos atribuídos</span><strong>${money(rr.reduce((a,x)=>a+x.totalCost,0))}</strong></div><div class="kpi"><span>Resultado comercial</span><strong>${money(rr.reduce((a,x)=>a+x.result,0))}</strong></div>`}
function renderProduction(){const box=$('productionList');if(!box)return;box.innerHTML='';for(const o of db.orders){const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="card-title">Pedido ${String(o.numero).padStart(6,'0')} • ${esc(o.client)}</div><div class="stage-row">${STAGES.map(s=>`<button class="stage ${o.productionStage===s?'active':''}" data-stage-order="${o.numero}" data-stage="${s}">${s}</button>`).join('')}</div><p class="muted">Entrega: ${fmtDate(o.deliveryDate)} • ${o.environments?.length||0} ambiente(s). ${o.productionStage==='EXPEDIÇÃO'?'<strong>PEDIDO PRONTO PARA INSTALAÇÃO</strong>':''}</p><button class="btn secondary" data-production-open="${o.numero}">Abrir / Ver OP</button>`;box.appendChild(c)}document.querySelectorAll('[data-production-open]').forEach(b=>b.onclick=()=>printProductionOrder(db.orders.find(x=>Number(x.numero)===Number(b.dataset.productionOpen))));document.querySelectorAll('[data-stage-order]').forEach(b=>b.onclick=()=>{const o=db.orders.find(x=>Number(x.numero)===Number(b.dataset.stageOrder));if(!o)return;o.productionStage=b.dataset.stage;o.productionHistory=o.productionHistory||[];o.productionHistory.push({stage:b.dataset.stage,at:new Date().toISOString(),by:currentUsername()});addOrderEvent(o,'ETAPA DE PRODUÇÃO',b.dataset.stage);queueSave();renderProduction();renderOrders();renderInstall()})}
function renderInstall(){const tb=$('installTable');if(!tb)return;tb.innerHTML='';for(const o of db.orders.slice().sort((a,b)=>String(a.deliveryDate).localeCompare(String(b.deliveryDate)))){const ready=o.productionStage==='EXPEDIÇÃO',done=!!o.installation?.completedDate;const tr=document.createElement('tr');tr.innerHTML=`<td>${fmtDate(o.installation?.scheduledDate||o.deliveryDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(o.productionStage)}</td><td><span class="badge ${done?'ok':ready?'blue':'warn'}">${done?'INSTALADO':ready?'PRONTO PARA INSTALAÇÃO':'EM PRODUÇÃO'}</span></td><td>${esc(o.installation?.responsible||'-')} ${!done?`<button class="btn ghost" data-install="${o.numero}">Agendar / Atualizar</button>`:''}</td>`;tb.appendChild(tr)}document.querySelectorAll('[data-install]').forEach(b=>b.onclick=()=>openInstall(Number(b.dataset.install)))}
function openInstall(n){const o=db.orders.find(x=>Number(x.numero)===n);if(!o)return;const i=o.installation||{};openModal(`<h2>Instalação • Pedido ${String(n).padStart(6,'0')}</h2><div class="grid two"><label class="field">Data prometida<input type="date" value="${o.deliveryDate||''}" disabled></label><label class="field">Data agendada<input id="instSched" type="date" value="${i.scheduledDate||''}"></label><label class="field">Equipe / responsável<input id="instResp" value="${esc(i.responsible||'')}"></label><label class="field">Data realmente instalada<input id="instDate" type="date" value="${i.completedDate||''}"></label><label class="field" style="grid-column:1/-1">Observações<textarea id="instNotes">${esc(i.notes||'')}</textarea></label></div><button id="instSave" class="btn primary">Salvar instalação</button>`);$('instSave').onclick=()=>{const before=JSON.stringify(o.installation||{});o.installation={...(o.installation||{}),responsible:$('instResp').value.trim(),scheduledDate:$('instSched').value,completedDate:$('instDate').value,notes:$('instNotes').value.trim()};addOrderEvent(o,o.installation.completedDate?'INSTALAÇÃO CONCLUÍDA':'INSTALAÇÃO ATUALIZADA',`Agendada ${fmtDate(o.installation.scheduledDate)} • Responsável ${o.installation.responsible||'-'}`);queueSave();closeModal();renderInstall();renderOrders();renderKpis()}}

function productPrices(p){const base=Number(p.cost||0)*(1+Number(p.markup||0)/100);return {p4:base,p18:base*(1+db.priceConfig.terms.p18AddPct/100),cash:base*(1-db.priceConfig.terms.cashDiscountPct/100)}}
function officialMinimumStock(p){const cat=norm(p.category),name=norm(p.product_name);if(name.includes('MOTORIZAD')||(name.includes('VARÃO')&&name.includes('COMANDO')))return 0;if(name.includes('DESLIZANTE'))return 1000;if(cat.includes('TECIDO')||name.includes('TECIDO')||name.includes('LINHO')||name.includes('VOIL')||name.includes('BLACKOUT')||name.includes('FORRO')||name.includes('GABARDINE')||cat.includes('FITA')||name.includes('FITA'))return 80;if(cat.includes('TRILHO')||name.includes('TRILHO'))return 30;return 20}
function updateCombineButton(){const b=$('combineProductsBtn');if(!b)return;const n=selectedPriceProductIds.size;b.style.display='inline-flex';b.textContent=n?`Combinar Produtos (${n})`:'Combinar Produtos'}
async function reloadOfficialProducts(){const prices=await api('prices');priceProducts=Array.isArray(prices.products)?prices.products:[];for(const id of [...selectedPriceProductIds])if(!priceProducts.some(p=>Number(p.id)===Number(id)&&Number(p.active??1)===1))selectedPriceProductIds.delete(id);renderProducts()}
function renderProducts(){
 const tb=$('productsTable');if(!tb)return;const search=norm($('productSearch')?.value),cat=norm($('productCategoryFilter')?.value),sup=norm($('productSupplierFilter')?.value);tb.innerHTML='';
 const active=(priceProducts||[]).filter(p=>Number(p.active??1)===1);const cats=uniqueSorted(active.map(p=>p.category).filter(Boolean)),sups=uniqueSorted(active.map(p=>p.supplier).filter(Boolean));
 const fill=(id,vals,label)=>{const el=$(id);if(!el)return;const cur=el.value;el.innerHTML=`<option value="">${label}</option>`+vals.map(v=>`<option>${esc(v)}</option>`).join('');el.value=cur};fill('productCategoryFilter',cats,'Todas as categorias');fill('productSupplierFilter',sups,'Todos os fornecedores');
 const list=active.filter(p=>(!search||norm(`${p.internal_code} ${p.supplier_code} ${p.category} ${p.supplier} ${p.product_name} ${p.color} ${p.ncm}`).includes(search))&&(!cat||norm(p.category)===cat)&&(!sup||norm(p.supplier)===sup)).sort((a,b)=>{let x=a[stockSort.key],y=b[stockSort.key];if(['stock_quantity','cost'].includes(stockSort.key)){x=Number(x||0);y=Number(y||0);return (x-y)*stockSort.dir}return String(x||'').localeCompare(String(y||''),'pt-BR')*stockSort.dir});
 for(const p of list){const unit=norm(p.unit||'UN'),qty=Number(p.stock_quantity||0),min=officialMinimumStock(p),critical=qty<min,tr=document.createElement('tr');if(critical)tr.style.cssText='background:#fff3b0;color:#b00020;font-weight:700';tr.innerHTML=`<td class="check-col"><input type="checkbox" data-price-select="${p.id}" ${selectedPriceProductIds.has(Number(p.id))?'checked':''}></td><td>${esc(p.internal_code||'-')}</td><td>${esc(p.supplier_code||'-')}</td><td>${esc(p.category||'-')}</td><td>${esc(p.supplier||'-')}</td><td>${esc(p.product_name||'-')}</td><td>${esc(p.color||'-')}</td><td class="num-col">${critical?'⚠ ':''}${qty.toFixed(unit==='M'?2:0)} ${esc(unit)}${critical?`<br><span class="badge warn">CRÍTICO • mín. ${min} ${esc(unit)}</span>`:''}</td><td class="num-col">${money(p.cost)}</td><td class="num-col">${Number(p.markup_percent||0)}%</td><td class="num-col">${Number(p.price_cash||0)>0?(((Number(p.price_cash)-Number(p.cost||0))/Number(p.price_cash))*100).toFixed(1):'0.0'}%</td><td>${esc(p.ncm||'-')}</td><td>${esc(p.cfop_internal||'-')}</td><td>${esc(p.cfop_interstate||'-')}</td><td class="num-col">${money(p.price_18x)}</td><td class="num-col">${money(p.price_4x)}</td><td class="num-col">${money(p.price_cash)}</td><td><div class="actions"><button class="btn ghost" data-price-edit="${p.id}">Editar Produto</button><button class="btn danger" data-price-delete="${p.id}">Excluir Produto</button></div></td>`;tb.appendChild(tr)}
 document.querySelectorAll('[data-price-select]').forEach(el=>el.onchange=()=>{const id=Number(el.dataset.priceSelect);if(el.checked)selectedPriceProductIds.add(id);else selectedPriceProductIds.delete(id);updateCombineButton()});document.querySelectorAll('[data-price-edit]').forEach(b=>b.onclick=()=>openOfficialProductEdit(Number(b.dataset.priceEdit)));document.querySelectorAll('[data-price-delete]').forEach(b=>b.onclick=()=>inactivateOfficialProduct(Number(b.dataset.priceDelete)));document.querySelectorAll('[data-stock-sort]').forEach(h=>{h.style.cursor='pointer';h.title='Clique para ordenar';h.onclick=()=>{const k=h.dataset.stockSort;if(stockSort.key===k)stockSort.dir*=-1;else stockSort={key:k,dir:1};renderProducts()}});
 const criticalCount=active.filter(p=>Number(p.stock_quantity||0)<officialMinimumStock(p)).length,costValue=active.reduce((a,p)=>a+Number(p.stock_quantity||0)*Number(p.cost||0),0),cashValue=active.reduce((a,p)=>a+Number(p.stock_quantity||0)*Number(p.price_cash||0),0);if($('inventorySummary'))$('inventorySummary').innerHTML=[['Produtos oficiais',active.length],['Estoque crítico',criticalCount],['Valor de custo em estoque',money(costValue)],['Valor total de venda à vista',money(cashValue)]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');updateCombineButton()
}
function openOfficialProductEdit(id){const p=(priceProducts||[]).find(x=>Number(x.id)===Number(id));if(!p)return;openModal(`<h2>Editar Produto • ${esc(p.internal_code)}</h2><p><strong>${esc(p.product_name)}</strong> • ${esc(p.color||'-')} • ${esc(p.supplier||'-')}</p><div class="grid two"><label class="field">Quantidade<input id="opQty" type="number" min="0" step="0.01" value="${Number(p.stock_quantity||0)}"></label><label class="field">Custo<input id="opCost" type="number" min="0" step="0.01" value="${Number(p.cost||0)}"></label><label class="field">Markup (%)<input id="opMarkup" type="number" min="0" step="0.01" value="${Number(p.markup_percent||0)}"></label><label class="field">NCM<input id="opNcm" value="${esc(p.ncm||'')}"></label><label class="field">CFOP PR<input id="opCfopIn" value="${esc(p.cfop_internal||'')}"></label><label class="field">CFOP Interestadual<input id="opCfopOut" value="${esc(p.cfop_interstate||'')}"></label><label class="field">Motivo da alteração<input id="opReason" placeholder="Obrigatório"></label></div><p class="muted">Os preços 4x, à vista e 18x serão recalculados automaticamente a partir do custo e markup.</p><button id="opSave" class="btn primary">Salvar alteração</button>`);$('opSave').onclick=async()=>{const reason=$('opReason').value.trim();if(!reason)return alert('Informe o motivo da alteração.');try{$('opSave').disabled=true;await api('prices',{method:'POST',body:JSON.stringify({action:'EDITAR',id:p.id,stock_quantity:Number($('opQty').value),cost:Number($('opCost').value),markup_percent:Number($('opMarkup').value),ncm:$('opNcm').value.trim(),cfop_internal:$('opCfopIn').value.trim(),cfop_interstate:$('opCfopOut').value.trim(),reason})});closeModal();await reloadOfficialProducts()}catch(e){alert(e.message)}finally{if($('opSave'))$('opSave').disabled=false}}}
async function inactivateOfficialProduct(id){const p=(priceProducts||[]).find(x=>Number(x.id)===Number(id));if(!p)return;const reason=prompt(`Motivo para excluir/inativar ${p.internal_code} • ${p.product_name}:`);if(reason===null)return;if(!reason.trim())return alert('Informe o motivo.');if(!confirm('O produto será inativado, preservando o histórico. Confirmar?'))return;try{await api('prices',{method:'POST',body:JSON.stringify({action:'INATIVAR',id:p.id,reason:reason.trim()})});selectedPriceProductIds.delete(Number(id));await reloadOfficialProducts()}catch(e){alert(e.message)}}
function openNewOfficialProduct(){const sups=uniqueSorted((db.suppliers||[]).map(x=>x.name).concat((priceProducts||[]).map(x=>x.supplier).filter(Boolean)));openModal(`<h2>Novo Produto Oficial</h2><p class="muted">O SKU NI-XXXX é gerado automaticamente e nunca é reutilizado.</p><div class="grid two"><label class="field">Fornecedor<select id="npSupplier"><option value="">Selecione</option>${sups.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label class="field">Código do fornecedor<input id="npSupplierCode"></label><label class="field">Categoria<select id="npCategory"><option>TECIDO DE ACABAMENTO</option><option>TECIDO DE FORRO</option><option>ACESSÓRIO</option><option>OUTROS</option></select></label><label class="field">Produto<input id="npName"></label><label class="field">Cor<input id="npColor" value="SEM COR"></label><label class="field">Largura (cm)<input id="npWidth" type="number" min="0" step="1"></label><label class="field">Unidade<select id="npUnit"><option value="M">M</option><option value="UN">UN</option></select></label><label class="field">Quantidade inicial<input id="npStock" type="number" min="0" step="0.01" value="0"></label><label class="field">Custo<input id="npCost" type="number" min="0" step="0.01" value="0"></label><label class="field">Markup (%)<input id="npMarkup" type="number" min="0" step="0.01" value="130"></label><label class="field">NCM<input id="npNcm"></label><label class="field">CFOP PR<input id="npCfopIn"></label><label class="field">CFOP Interestadual<input id="npCfopOut"></label></div><button id="npSave" class="btn primary">Cadastrar Produto</button>`);$('npSave').onclick=async()=>{const body={action:'CRIAR',supplier:$('npSupplier').value,supplier_code:$('npSupplierCode').value,category:$('npCategory').value,product_name:$('npName').value,color:$('npColor').value,width_cm:Number($('npWidth').value||0),unit:$('npUnit').value,stock_quantity:Number($('npStock').value||0),cost:Number($('npCost').value||0),markup_percent:Number($('npMarkup').value||0),ncm:$('npNcm').value,cfop_internal:$('npCfopIn').value,cfop_interstate:$('npCfopOut').value};if(!body.supplier||!body.product_name)return alert('Informe fornecedor e produto.');try{$('npSave').disabled=true;const r=await api('prices',{method:'POST',body:JSON.stringify(body)});closeModal();await reloadOfficialProducts();alert(`Produto ${r.product?.internal_code||''} cadastrado com sucesso.`)}catch(e){alert(e.message)}finally{if($('npSave'))$('npSave').disabled=false}}}
function openCombineProducts(){const items=(priceProducts||[]).filter(p=>selectedPriceProductIds.has(Number(p.id)));if(items.length<2)return alert('Selecione pelo menos dois produtos.');openModal(`<h2>Combinar Produtos</h2><p class="muted">${items.length} produtos selecionados.</p><div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Produto</th><th>Saldo</th><th>Quantidade a usar</th></tr></thead><tbody>${items.map(p=>`<tr><td>${esc(p.internal_code)}</td><td>${esc(p.product_name)} / ${esc(p.color||'-')}</td><td>${Number(p.stock_quantity||0)} ${esc(p.unit||'')}</td><td><input data-combine-qty="${p.id}" type="number" min="0" step="0.01" value="0"></td></tr>`).join('')}</tbody></table></div><div class="notice">A seleção e a tela de combinação já estão prontas. A gravação da transformação será habilitada na próxima etapa do backend para garantir baixa transacional e histórico sem risco ao estoque.</div>`)}
function openProduct(p=null){
 const types=['TECIDO DE ACABAMENTO','TECIDO DE FORRO','TECIDO ESPECIAL','ACESSÓRIO','OUTRO'];
 openModal(`<h2>${p?'Editar':'Novo'} produto</h2><p class="muted">A combinação Tipo + Produto + Cor + Unidade é única. O código interno é automático se ficar vazio.</p><div class="grid two"><label class="field">Código interno<input id="pCode" value="${esc(p?.code||'')}" placeholder="Automático"></label><label class="field">Código do fornecedor<input id="pSupplierCode" value="${esc(p?.supplierCode||'')}"></label><label class="field">Tipo<select id="pType">${types.map(x=>`<option>${x}</option>`).join('')}</select></label><label class="field">Unidade<select id="pUnit"><option value="UN">UN</option><option value="M">M</option><option value="M2">M²</option><option value="KG">KG</option></select></label><label class="field">Categoria / observação<input id="pCat" value="${esc(p?.category||'')}"></label><label class="field">Nome<input id="pName" value="${esc(p?.name||'')}"></label><label class="field">Cor<input id="pColor" value="${esc(p?.color||'SEM COR')}"></label><label class="field">Largura da peça (cm)<input id="pRollWidth" type="number" value="${Number(p?.rollWidthCm||0)}"></label><label class="field">Quantidade<input id="pQty" type="number" step="0.01" value="${Number(p?.qty||0)}"></label><label class="field">Estoque mínimo<input id="pMin" type="number" step="0.01" value="${Number(p?.minimumStock||0)}"></label><label class="field">Custo de compra<input id="pCost" type="number" step="0.01" value="${Number(p?.cost||0)}"></label><label class="field">Markup (%)<input id="pMarkup" type="number" step="0.01" value="${Number(p?.markup??80)}"></label><label class="field" style="grid-column:1/-1">Motivo do ajuste de quantidade<input id="pReason" placeholder="Obrigatório quando alterar o saldo"></label></div><button id="pSave" class="btn primary">Salvar</button>`);
 if(p){$('pType').value=canonicalProductType(p.type);$('pUnit').value=p.unit||'UN'}
 $('pSave').onclick=()=>{const oldQty=Number(p?.qty||0),newQty=Number($('pQty').value||0),obj={...(p||{}),id:p?.id||uid(),code:$('pCode').value.trim()||p?.code||nextProductCode(),supplierCode:$('pSupplierCode').value.trim(),rollWidthCm:Number($('pRollWidth').value||0),type:$('pType').value,unit:$('pUnit').value,category:$('pCat').value.trim(),name:$('pName').value.trim(),color:$('pColor').value.trim()||'SEM COR',qty:newQty,minimumStock:Number($('pMin').value||0),cost:Number($('pCost').value||0),markup:Number($('pMarkup').value||0),stockManaged:p?.stockManaged!==false,movements:clone(p?.movements||[])};if(!obj.name)return alert('Informe o produto.');const dup=db.products.find(x=>x.id!==obj.id&&productIdentity(x.type,x.name,x.color,x.unit)===productIdentity(obj.type,obj.name,obj.color,obj.unit));if(dup)return alert(`Já existe este produto no estoque (${dup.code||dup.name}). Edite o cadastro existente para evitar duplicidade.`);if(obj.code&&db.products.some(x=>x.id!==obj.id&&norm(x.code)===norm(obj.code)))return alert('Já existe um produto com este código interno.');if(p&&Math.abs(newQty-oldQty)>1e-9){const reason=$('pReason').value.trim();if(!reason)return alert('Informe o motivo do ajuste manual da quantidade.');obj.movements.push({id:uid(),date:today(),at:new Date().toISOString(),type:'AJUSTE MANUAL',qty:newQty-oldQty,balance:newQty,unit:obj.unit,by:currentUsername(),reason})}const i=db.products.findIndex(x=>x.id===obj.id);if(i>=0)db.products[i]=obj;else db.products.unshift(obj);queueSave();closeModal();setupSelectors();renderProducts()}
}

function exportInventoryStockPdf(){
 const items=(priceProducts||[]).filter(p=>Number(p.active??1)===1).slice().sort((a,b)=>String(`${a.product_name||''} ${a.color||''}`).localeCompare(String(`${b.product_name||''} ${b.color||''}`),'pt-BR'));
 if(!items.length)return alert('Não há produtos oficiais ativos para exportar.');
 const totalCost=items.reduce((a,p)=>a+Number(p.stock_quantity||0)*Number(p.cost||0),0),totalCash=items.reduce((a,p)=>a+Number(p.stock_quantity||0)*Number(p.price_cash||0),0);
 const rows=items.map(p=>`<tr><td>${esc(p.internal_code||'-')}</td><td>${esc(p.supplier_code||'-')}</td><td>${esc(p.category||'-')}</td><td>${esc(p.product_name||'-')}</td><td>${esc(p.color||'-')}</td><td>${Number(p.stock_quantity||0).toFixed(norm(p.unit)==='M'?2:0)} ${esc(p.unit||'')}</td><td>${money(Number(p.cost||0))}</td><td>${Number(p.markup_percent||0).toFixed(1)}%</td><td>${money(Number(p.price_18x||0))}</td><td>${money(Number(p.price_4x||0))}</td><td>${money(Number(p.price_cash||0))}</td></tr>`).join('');
 printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>RELATÓRIO DE ESTOQUE</strong><br>Gerado em: ${esc(new Date().toLocaleString('pt-BR'))}</div></div><div class="section-title">Resumo do estoque</div><table class="summary-table"><tr><th>Produtos ativos</th><td>${items.length}</td><th>Valor de custo em estoque</th><td>${money(totalCost)}</td></tr><tr><th>Valor total de venda à vista</th><td colspan="3"><strong>${money(totalCash)}</strong></td></tr></table><div class="section-title">Dados do estoque</div><table class="summary-table"><tr><th>SKU</th><th>Cód. fornecedor</th><th>Categoria</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Custo</th><th>Markup</th><th>18x</th><th>4x</th><th>À vista</th></tr>${rows}</table><p class="conditions">Relatório gerencial de estoque. Os valores refletem os dados cadastrados no momento da geração.</p>`);
}
function exportPhysicalInventoryPdf(){
 const inputs=[...document.querySelectorAll('[data-official-count]')];
 if(!inputs.length)return alert('Não há itens no inventário para exportar.');
 const rows=inputs.map(el=>{const p=officialProductById(Number(el.dataset.officialCount));if(!p)return'';const sys=Number(p.stock_quantity||0),counted=Number(el.value||0),diff=counted-sys,dec=norm(p.unit)==='M'?2:0;return `<tr><td>${esc(p.internal_code||'-')}</td><td>${esc(p.product_name||'-')}</td><td>${esc(p.color||'-')}</td><td>${sys.toFixed(dec)} ${esc(p.unit||'')}</td><td>${counted.toFixed(dec)} ${esc(p.unit||'')}</td><td>${diff>0?'+':''}${diff.toFixed(dec)} ${esc(p.unit||'')}</td></tr>`}).join('');
 const reason=$('invReason')?.value?.trim()||'Inventário físico';
 printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>INVENTÁRIO FÍSICO DE ESTOQUE</strong><br>Gerado em: ${esc(new Date().toLocaleString('pt-BR'))}<br>Justificativa: ${esc(reason)}</div></div><table class="summary-table"><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Sistema</th><th>Contado</th><th>Divergência</th></tr>${rows}</table><p class="conditions">Este relatório registra a contagem informada na tela no momento da geração. A exportação não aplica divergências automaticamente.</p>`);
}
function openPhysicalInventory(){const items=(priceProducts||[]).filter(p=>Number(p.active??1)===1).slice().sort((a,b)=>String(`${a.product_name} ${a.color}`).localeCompare(String(`${b.product_name} ${b.color}`),'pt-BR'));if(!items.length)return alert('Não há produtos oficiais ativos.');openModal(`<h2>Inventário físico • Estoque oficial</h2><p class="muted">Informe a quantidade realmente contada. Somente divergências serão gravadas no D1, com histórico e justificativa.</p><div class="table-wrap" style="max-height:55vh"><table class="table"><thead><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Sistema</th><th>Contado</th></tr></thead><tbody>${items.map(p=>`<tr><td>${esc(p.internal_code||'-')}</td><td>${esc(p.product_name||'-')}</td><td>${esc(p.color||'-')}</td><td>${Number(p.stock_quantity||0).toFixed(norm(p.unit)==='M'?2:0)} ${esc(p.unit||'')}</td><td><input data-official-count="${p.id}" type="number" min="0" step="0.01" value="${Number(p.stock_quantity||0)}" style="width:110px"></td></tr>`).join('')}</tbody></table></div><label class="field">Justificativa geral<input id="invReason" value="Inventário físico"></label><div class="actions" style="margin-top:12px"><button id="invExportPdf" class="btn secondary">EXPORTAR INVENTÁRIO EM PDF</button><button id="invApply" class="btn primary">Aplicar divergências</button></div>`);$('invExportPdf').onclick=exportPhysicalInventoryPdf;$('invApply').onclick=async()=>{const reason=$('invReason').value.trim();if(!reason)return alert('Informe a justificativa.');const changes=[];document.querySelectorAll('[data-official-count]').forEach(el=>{const p=officialProductById(Number(el.dataset.officialCount)),counted=Number(el.value);if(p&&Number.isFinite(counted)&&counted>=0&&Math.abs(counted-Number(p.stock_quantity||0))>1e-9)changes.push({p,counted})});if(!changes.length)return alert('Nenhuma divergência encontrada.');if(!confirm(`Aplicar ${changes.length} ajuste(s) no estoque oficial?`))return;const btn=$('invApply');btn.disabled=true;try{for(const x of changes)await api('prices',{method:'POST',body:JSON.stringify({action:'EDITAR',id:x.p.id,stock_quantity:x.counted,cost:Number(x.p.cost||0),markup_percent:Number(x.p.markup_percent||0),ncm:x.p.ncm||'',cfop_internal:x.p.cfop_internal||'',cfop_interstate:x.p.cfop_interstate||'',reason})});closeModal();await reloadOfficialProducts();alert('Inventário físico aplicado com sucesso.')}catch(e){alert(e.message)}finally{if(btn)btn.disabled=false}}}

function openProductHistory(p){if(!p)return;const rows=(p.movements||[]).slice().reverse().map(m=>`<tr><td>${fmtDate(m.date||String(m.at||'').slice(0,10))}</td><td>${esc(m.type||'-')}</td><td>${Number(m.qty||0)>0?'+':''}${Number(m.qty||0).toFixed(p.unit==='M'?2:0)} ${esc(m.unit||p.unit||'')}</td><td>${m.balance==null?'—':Number(m.balance).toFixed(p.unit==='M'?2:0)}</td><td>${esc(m.by||'-')}</td><td>${esc(m.reason||'-')}</td></tr>`).join('');openModal(`<h2>Histórico de estoque • ${esc(p.name)} / ${esc(p.color||'-')}</h2><table class="table"><thead><tr><th>Data</th><th>Movimento</th><th>Quantidade</th><th>Saldo</th><th>Responsável</th><th>Motivo / referência</th></tr></thead><tbody>${rows||'<tr><td colspan="6">Nenhuma movimentação registrada.</td></tr>'}</tbody></table>`)}


function renderProductionCosts(){const root=$('productionCostsForm');if(!root)return;const m=db.priceConfig.installationMatrix||DEFAULT_PRICE_CONFIG.installationMatrix;root.innerHTML=`<section class="card"><div class="card-title">Instalação de Cortinas</div><p class="muted">O motor seleciona automaticamente o custo pela altura e largura informadas no ambiente do orçamento. Valores editáveis somente pela Gestão.</p><div class="table-wrap"><table class="table"><thead><tr><th>Altura da cortina</th><th>Até 4,00 m de largura</th><th>Até 5,00 m</th><th>Até 6,00 m</th></tr></thead><tbody><tr><td>Até 3,50 m</td><td>${prodCostInput('simple','up4',m.simple.up4)}</td><td>${prodCostInput('simple','up5',m.simple.up5)}</td><td>${prodCostInput('simple','up6',m.simple.up6)}</td></tr><tr><td>3,51 m até 5,50 m</td><td>${prodCostInput('double','up4',m.double.up4)}</td><td>${prodCostInput('double','up5',m.double.up5)}</td><td>${prodCostInput('double','up6',m.double.up6)}</td></tr><tr><td>Acima de 5,50 m</td><td>${prodCostInput('high','up4',m.high.up4)}</td><td>${prodCostInput('high','up5',m.high.up5)}</td><td>${prodCostInput('high','up6',m.high.up6)}</td></tr></tbody></table></div><p class="notice">Para larguras acima de 5,00 m, o motor usa a faixa “até 6,00 m”. Acima de 6,00 m permanece nesta faixa até definirmos uma regra específica.</p><button id="saveProductionCostsBtn" class="btn primary">Salvar custos de instalação</button></section>`;$('saveProductionCostsBtn').onclick=saveProductionCosts}
function prodCostInput(band,key,value){return `<input data-prod-cost="${band}:${key}" type="number" min="0" step="0.01" value="${Number(value||0).toFixed(2)}" style="max-width:140px">`}
function saveProductionCosts(){if(!isGestor())return alert('Apenas o GESTOR pode alterar custos.');const m=clone(db.priceConfig.installationMatrix||DEFAULT_PRICE_CONFIG.installationMatrix);document.querySelectorAll('[data-prod-cost]').forEach(i=>{const [band,key]=i.dataset.prodCost.split(':');m[band][key]=Number(i.value||0)});db.priceConfig.installationMatrix=m;queueSave();renderAll();alert('Custos de produção e instalação atualizados. Novos orçamentos e pedidos usarão os novos valores.')}
function renderPricing(){const root=$('pricingForm');if(!root)return;const c=db.priceConfig;root.innerHTML=`<div class="grid two"><section class="card"><div class="card-title">Tecidos de acabamento</div>${Object.entries(c.finishes).map(([n,v])=>priceRow('finish',n,v.price)).join('')}</section><section class="card"><div class="card-title">Tecidos de forro</div>${Object.entries(c.linings).map(([n,v])=>priceRow('lining',n,v.price)).join('')}</section><section class="card"><div class="card-title">Mão de obra e aviamentos</div>${numField('sewing','Costura por metro',c.sewingPerMeter)}${numField('sliderFinish','Deslizante acabamento',c.sliders.finish)}${numField('sliderLining','Deslizante forro',c.sliders.lining)}${numField('swissClamp','Garra trilho suíço',c.swiss.clamp)}${numField('swissEnd','Acabamento trilho suíço',c.swiss.end)}${numField('waveMeter','Varão Wave / metro',c.wave.rodPerMeter)}${numField('waveSupport','Suporte Wave',c.wave.support)}${numField('waveEnd','Tampa Wave (não informada no documento)',c.wave.end)}</section><section class="card"><div class="card-title">Condições e automação</div>${numField('cashPct','Desconto à vista (%)',c.terms.cashDiscountPct)}${numField('p18Pct','Acréscimo 18x (%)',c.terms.p18AddPct)}${numField('cordPct','Comando por corda (%)',c.cordPct)}${numField('motorBaseSingle','Motor: só forro/acabamento (R$)',c.motor.baseSingle??2000)}${numField('motorSinglePct','Motor: adicional sistema simples (%)',c.motor.singlePct??15)}${numField('motorBaseComplete','Motor: cortina completa (R$)',c.motor.baseComplete??3500)}${numField('motorCompletePct','Motor: adicional sistema completo (%)',c.motor.completePct??25)}${numField('commDefault','Comissão padrão (%)',c.commissionDefault)}</section></div><section class="card" style="margin-top:14px"><div class="card-title">Instalação por altura</div><div class="grid four">${c.install.map((x,i)=>`<label class="field">Até ${x.maxH>=99?'acima de 6':x.maxH}m<input data-install-price="${i}" type="number" step="0.01" value="${x.price}"></label>`).join('')}</div></section>`}
function priceRow(kind,name,val){return `<label class="field" style="margin:8px 0">${esc(name)} (R$/m)<input data-price-kind="${kind}" data-price-name="${esc(name)}" type="number" step="0.01" value="${val}"></label>`}
function numField(id,label,val){return `<label class="field" style="margin:8px 0">${label}<input id="price-${id}" type="number" step="0.01" value="${val}"></label>`}
function savePricing(){document.querySelectorAll('[data-price-kind]').forEach(i=>{const k=i.dataset.priceKind,n=i.dataset.priceName,v=Number(i.value||0);if(k==='finish')db.priceConfig.finishes[n].price=v;else db.priceConfig.linings[n].price=v});db.priceConfig.sewingPerMeter=Number($('price-sewing').value);db.priceConfig.sliders.finish=Number($('price-sliderFinish').value);db.priceConfig.sliders.lining=Number($('price-sliderLining').value);db.priceConfig.swiss.clamp=Number($('price-swissClamp').value);db.priceConfig.swiss.end=Number($('price-swissEnd').value);db.priceConfig.wave.rodPerMeter=Number($('price-waveMeter').value);db.priceConfig.wave.support=Number($('price-waveSupport').value);db.priceConfig.wave.end=Number($('price-waveEnd').value);db.priceConfig.terms.cashDiscountPct=Number($('price-cashPct').value);db.priceConfig.terms.p18AddPct=Number($('price-p18Pct').value);db.priceConfig.cordPct=Number($('price-cordPct').value);db.priceConfig.motor.baseSingle=Number($('price-motorBaseSingle').value);db.priceConfig.motor.singlePct=Number($('price-motorSinglePct').value);db.priceConfig.motor.baseComplete=Number($('price-motorBaseComplete').value);db.priceConfig.motor.completePct=Number($('price-motorCompletePct').value);db.priceConfig.commissionDefault=Number($('price-commDefault').value);document.querySelectorAll('[data-install-price]').forEach(i=>db.priceConfig.install[Number(i.dataset.installPrice)].price=Number(i.value||0));queueSave();setupSelectors();renderAll();alert('Tabela de preços atualizada.')}

function monthlyCloseData(month){
 const m=month||today().slice(0,7),start=m+'-01',last=new Date(Number(m.slice(0,4)),Number(m.slice(5,7)),0).getDate(),end=m+'-'+String(last).padStart(2,'0');
 const inMonth=d=>{const x=String(d||'').slice(0,10);return x>=start&&x<=end};
 const orders=(db.orders||[]).filter(o=>inMonth(o.createdDate||o.date));
 const results=orders.map(orderResultData),sales=results.reduce((a,r)=>a+r.revenue,0),directCosts=results.reduce((a,r)=>a+r.totalCost,0),commercialResult=sales-directCosts;
 const payments=[];for(const o of db.orders||[])for(const p of o.payments||[])if(inMonth(p.date||p.createdAt))payments.push({...p,order:o.numero,client:o.client});
 const received=payments.reduce((a,p)=>a+Number(p.value||p.amount||0),0);
 const paidPayables=(db.payables||[]).filter(x=>String(x.status||'').toUpperCase()==='PAGO'&&inMonth(x.paidDate||x.paymentDate||x.datePaid||x.updatedAt));
 const expenses=paidPayables.reduce((a,x)=>a+Number(x.paidValue??x.value??x.amount??0),0);
 const cashResult=received-expenses,margin=sales?commercialResult/sales*100:0,ticket=orders.length?sales/orders.length:0;
 const inputCost=results.reduce((a,x)=>a+Number(x.materialCost||0),0),laborTotal=results.reduce((a,x)=>a+Number(x.production||0),0),installTotal=results.reduce((a,x)=>a+Number(x.installation||0),0),internalServices=laborTotal+installTotal,cashFactor=1-Number(db.priceConfig.terms.cashDiscountPct||0)/100,productsSoldValue=Math.max(0,sales-internalServices*cashFactor),inputAddedValue=productsSoldValue-inputCost;
 return {month,start,end,orders,results,sales,directCosts,commercialResult,margin,ticket,payments,received,paidPayables,expenses,cashResult,inputCost,productsSoldValue,inputAddedValue,laborTotal,installTotal,internalServices};
}
function monthlyCloseHtml(r){const label=new Date(r.start+'T12:00:00').toLocaleDateString('pt-BR',{month:'long',year:'numeric'});const orderRows=r.orders.map(o=>{const x=orderResultData(o);return `<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client||'-')}</td><td>${money(x.revenue)}</td><td>${money(x.totalCost)}</td><td>${money(x.result)}</td><td>${x.margin.toFixed(1)}%</td></tr>`}).join('');const payRows=r.paidPayables.map(x=>`<tr><td>${fmtDate(x.paidDate||x.paymentDate||x.datePaid||x.updatedAt)}</td><td>${esc(x.title||x.definition||x.description||x.name||'-')}</td><td>${money(Number(x.paidValue??x.value??x.amount??0))}</td></tr>`).join('');return `<div class="card"><div class="card-title">Fechamento de ${esc(label)}</div><p class="muted">Período: ${fmtDate(r.start)} a ${fmtDate(r.end)}</p><div class="section-title">Resultado comercial dos pedidos gerados no mês</div><table class="summary-table"><tr><th>Vendas à vista</th><td>${money(r.sales)}</td><th>Custos diretos dos pedidos</th><td>${money(r.directCosts)}</td></tr><tr><th>RESULTADO COMERCIAL</th><td><strong>${money(r.commercialResult)}</strong></td><th>Margem</th><td><strong>${r.margin.toFixed(1)}%</strong></td></tr><tr><th>Pedidos</th><td>${r.orders.length}</td><th>Ticket médio</th><td>${money(r.ticket)}</td></tr></table><div class="section-title">Caixa do mês</div><table class="summary-table"><tr><th>Recebimentos efetivos</th><td>${money(r.received)}</td><th>Contas pagas</th><td>${money(r.expenses)}</td></tr><tr><th>RESULTADO DE CAIXA</th><td colspan="3"><strong>${money(r.cashResult)}</strong></td></tr></table><div class="section-title">Pedidos do período</div><table class="summary-table"><tr><th>Pedido</th><th>Cliente</th><th>Venda à vista</th><th>Custos</th><th>Resultado</th><th>Margem</th></tr>${orderRows||'<tr><td colspan="6">Nenhum pedido no período.</td></tr>'}</table><div class="section-title">RESUMO DOS PEDIDOS</div><table class="summary-table"><tr><th>CUSTO TOTAL DE INSUMOS</th><td><strong>${money(r.inputCost)}</strong></td></tr><tr><th>VALOR AGREGADO AOS INSUMOS</th><td><strong>${money(r.inputAddedValue)}</strong><br><small>Valor vendido dos produtos (${money(r.productsSoldValue)}) menos o custo dos produtos.</small></td></tr><tr><th>VALOR TOTAL DE MÃO DE OBRA</th><td><strong>${money(r.laborTotal)}</strong></td></tr><tr><th>VALOR TOTAL DE INSTALAÇÕES</th><td><strong>${money(r.installTotal)}</strong></td></tr><tr><th>SOMA INTERNA DE SERVIÇOS</th><td><strong>${money(r.internalServices)}</strong><br><small>Mão de obra + instalações.</small></td></tr></table><div class="section-title">Despesas efetivamente pagas no período</div><table class="summary-table"><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr>${payRows||'<tr><td colspan="3">Nenhuma conta paga no período.</td></tr>'}</table><p class="muted" style="margin-top:12px">O resultado comercial usa os custos atribuídos/congelados nos pedidos do mês. O resultado de caixa considera recebimentos e contas efetivamente pagas no período, evitando misturar competência comercial com fluxo de caixa.</p></div>`}
function renderMonthlyClose(){if(!isGestor())return;const inp=$('monthlyCloseMonth');if(inp&&!inp.value)inp.value=today().slice(0,7);const r=monthlyCloseData(inp?.value);if($('monthlyCloseSummary'))$('monthlyCloseSummary').innerHTML=`<div class="kpi"><span>Vendas à vista</span><strong>${money(r.sales)}</strong></div><div class="kpi"><span>Resultado comercial</span><strong>${money(r.commercialResult)}</strong></div><div class="kpi"><span>Recebido no mês</span><strong>${money(r.received)}</strong></div><div class="kpi"><span>Resultado de caixa</span><strong>${money(r.cashResult)}</strong></div>`;if($('monthlyCloseReport'))$('monthlyCloseReport').innerHTML=monthlyCloseHtml(r)}
function printMonthlyClose(){if(!isGestor())return;const r=monthlyCloseData($('monthlyCloseMonth')?.value);const label=new Date(r.start+'T12:00:00').toLocaleDateString('pt-BR',{month:'long',year:'numeric'});printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>FECHAMENTO MENSAL — ${esc(label.toUpperCase())}</strong><br>Período: ${fmtDate(r.start)} a ${fmtDate(r.end)}<br>Gerado em: ${esc(new Date().toLocaleString('pt-BR'))}</div></div>${monthlyCloseHtml(r).replace('<div class="card">','').replace(/<\/div>$/,'')}`)}

function renderSewingCost(){const root=$('sewingCostForm');if(!root)return;root.innerHTML=`<section class="card"><div class="card-title">Custo de Costura</div><p class="muted">Valor gerencial utilizado automaticamente no resultado dos pedidos.</p><label class="field" style="max-width:320px">Custo por metro de costura (R$/m)<input id="sewingCostValue" type="number" min="0" step="0.01" value="${Number(db.priceConfig.sewingPerMeter||0)}"></label><button id="saveSewingCostBtn" class="btn primary">Salvar custo de costura</button></section>`;$('saveSewingCostBtn').onclick=()=>{db.priceConfig.sewingPerMeter=Number($('sewingCostValue').value||0);audit('GESTÃO','ALTERAÇÃO','CUSTO DE COSTURA',money(db.priceConfig.sewingPerMeter)+'/m');queueSave();alert('Custo de costura salvo.')}}
const HELP_TEXT={quote:['Novo Orçamento','Cadastre ou selecione o cliente, informe os ambientes, medidas, tecidos, fixação e condições. Salve o orçamento ou gere o PDF.'],quotes:['Orçamentos','Consulte orçamentos salvos, abra, edite e converta em pedido quando aprovado.'],clients:['Clientes','Consulte a ficha do cliente, histórico, saldo, anexos e dados cadastrais.'],wholesaleDashboard:['Dashboard Atacado','Acompanhe faturamento, crédito, inadimplência, rentabilidade, curva ABC, alertas e reposição do atacado.'],wholesaleClients:['Clientes Atacado','Cadastre e organize lojas e revendedores atendidos no atacado, com política comercial, limite, meta, crédito e fechamento.'],wholesaleSale:['Nova Venda Atacado','Venda somente produtos disponíveis no estoque oficial. Cada item inicia com markup padrão de 65%, editável na própria venda.'],wholesaleOrders:['Pedidos Atacado','Consulte os pedidos, pagamentos, saldos em aberto e os markups aplicados em cada item.'],orders:['Pedidos','Consulte pedidos, via do cliente e registre pagamentos.'],agenda:['Agenda','Cadastre compromissos com cliente, contato, endereço, data, horário e descrição.'],production:['Produção','Acompanhe as etapas e use Abrir / Ver OP para conferir todos os materiais da produção.'],install:['Instalações','Acompanhe datas previstas, responsáveis e conclusão das instalações.'],rework:['Retrabalho','Registre e acompanhe ocorrências de retrabalho.'],suppliers:['Compras e Fornecedores','Cadastre fornecedores, gere ordens de compra, confirme recebimentos e duplicatas.'],inventory:['Estoque','Consulte saldos, faça inventário físico, cadastre produtos e combine produtos.'],receivables:['Contas a Receber','Acompanhe pedidos com saldo devedor e registre recebimentos.'],revenues:['Receitas Totais','Consulte os recebimentos efetivamente realizados.'],productionCosts:['Custos de Instalação','Configure a tabela gerencial de custos de instalação.'],sewingCost:['Custo de Costura','Configure o custo por metro de costura usado nos resultados.'],results:['Resultados dos Pedidos','Consulte receita, custos, resultado e margem de cada pedido.'],kpis:['Dashboard Gestão','Acompanhe indicadores comerciais, financeiros, produção e estoque.'],payables:['Contas a Pagar','Acompanhe títulos e pagamentos a fornecedores.'],monthlyClose:['Fechamento Mensal','Consulte o fechamento gerencial do período.'],hr:['Departamento Pessoal','Gerencie informações do departamento pessoal e prestadores.'],users:['Usuários','Crie usuários e configure perfis e permissões.'],settings:['Configurações','Configure dados da empresa e cláusulas dos documentos.'],audit:['Auditoria','Consulte o histórico de alterações e ações do sistema.'],backup:['Backup','Exporte cópias de segurança dos dados do ERP.']};
function renderHelp(){const root=$('helpContent');if(!root)return;const allowed=NAV.map(x=>x[0]).filter(id=>id!=='help'&&hasPermission(id)&&HELP_TEXT[id]);root.innerHTML=`<div class="card"><input id="helpSearch" class="search" placeholder="Buscar no manual..." style="width:100%;max-width:520px"></div><div id="helpTopics" class="grid two" style="margin-top:14px"></div>`;const draw=()=>{const q=norm($('helpSearch').value);$('helpTopics').innerHTML=allowed.filter(id=>!q||norm(HELP_TEXT[id].join(' ')).includes(q)).map(id=>`<section class="card"><div class="card-title">${esc(HELP_TEXT[id][0])}</div><p>${esc(HELP_TEXT[id][1])}</p></section>`).join('')||'<p class="muted">Nenhum tópico encontrado.</p>'};$('helpSearch').oninput=draw;draw()}

function renderKpis(){const cards=$('kpiCards'),seller=$('sellerKpis');if(!cards)return;const f=$('kpiFrom')?.value||'',t=$('kpiTo')?.value||'',sel=$('kpiSeller')?.value||'';const sellerSelect=$('kpiSeller');if(sellerSelect){const cur=sellerSelect.value;const names=[...new Set(db.orders.map(o=>resolveSellerUser(o)).filter(Boolean))].sort();sellerSelect.innerHTML='<option value="">LOJA TODA</option>'+names.map(n=>`<option value="${esc(n)}">${esc(sellerName(n))}</option>`).join('');sellerSelect.value=cur}const inRange=d=>{const x=(d||'').slice(0,10);return(!f||x>=f)&&(!t||x<=t)};const orders=db.orders.filter(o=>inRange(o.createdDate||o.date||'')&&(!sel||resolveSellerUser(o)===norm(sel))),quotes=db.quotes.filter(q=>inRange(q.date||q.createdAt||'')&&(!sel||resolveSellerUser(q)===norm(sel))),rr=orders.map(orderResultData);const revenue=rr.reduce((a,x)=>a+x.revenue,0),paid=orders.reduce((a,o)=>a+orderPaid(o),0),cost=rr.reduce((a,x)=>a+x.totalCost,0),result=rr.reduce((a,x)=>a+x.result,0),ticket=orders.length?revenue/orders.length:0,conversion=quotes.length?orders.length/quotes.length*100:0,margin=revenue?result/revenue*100:0;cards.innerHTML=[['Vendas / pedidos',orders.length],['Faturamento contratado',money(revenue)],['Receita recebida',money(paid)],['Saldo a receber',money(Math.max(0,revenue-paid))],['Custos atribuídos',money(cost)],['Resultado comercial',money(result)],['Margem consolidada',margin.toFixed(1)+'%'],['Ticket médio',money(ticket)],['Conversão',conversion.toFixed(1)+'%'],['Em produção',orders.filter(o=>o.productionStage!=='EXPEDIÇÃO').length],['Prontos / expedição',orders.filter(o=>o.productionStage==='EXPEDIÇÃO'&&!o.installation?.completedDate).length],['Instalados',orders.filter(o=>!!o.installation?.completedDate).length],['Retrabalhos',db.reworks.filter(r=>inRange(r.date||'')).length],['Estoque crítico',(priceProducts||[]).filter(p=>Number(p.active??1)===1&&Number(p.stock_quantity||0)<officialMinimumStock(p)).length]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');const by={};for(const o of orders){const k=resolveSellerUser(o)||'-',r=orderResultData(o);by[k]??={count:0,total:0,result:0};by[k].count++;by[k].total+=r.revenue;by[k].result+=r.result}seller.innerHTML=Object.entries(by).map(([k,v])=>`<div class="detail-item" style="margin:6px 0"><span>${esc(sellerName(k))}</span><strong>${v.count} pedido(s) • ${money(v.total)} • Resultado ${money(v.result)} • Comissão ${money(v.total*sellerCommission(k)/100)}</strong></div>`).join('')||'<p class="muted">Nenhum pedido no filtro selecionado.</p>'}
function printKpis(){renderKpis();const f=$('kpiFrom')?.value||'',t=$('kpiTo')?.value||'',sel=$('kpiSeller')?.value||'LOJA TODA';const cards=[...document.querySelectorAll('#kpiCards .kpi')].map(x=>`<div style="border:1px solid #c7d3d2;padding:8px"><div>${x.querySelector('span')?.textContent||''}</div><strong>${x.querySelector('strong')?.textContent||''}</strong></div>`).join('');printWindow(`<h2>RELATÓRIO DE KPIs</h2><p><strong>Período:</strong> ${f?fmtDate(f):'início'} até ${t?fmtDate(t):'hoje'} &nbsp; <strong>Vendedor:</strong> ${esc(sel)}</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${cards}</div><h3>Vendas por vendedor</h3>${$('sellerKpis')?.innerHTML||''}`)}
function payableStatus(p){const paid=Number(p.paidValue||0);const val=Number(p.value||0);if(val>0&&paid>=val-0.005)return'PAGO';if(p.paidDate&&paid>0)return paid>=val-0.005?'PAGO':'PENDENTE';if(p.dueDate&&p.dueDate<today())return'EM ATRASO';return'PENDENTE'}
function renderPayables(){const tb=$('payablesTable');if(!tb)return;const f=$('payFrom')?.value||'',t=$('payTo')?.value||'',st=$('payStatus')?.value||'';const all=db.payables||[];const list=all.filter(p=>(!f||p.dueDate>=f)&&(!t||p.dueDate<=t)&&(!st||payableStatus(p)===st));tb.innerHTML='';for(const p of list){const status=payableStatus(p),tr=document.createElement('tr');tr.innerHTML=`<td>${esc(p.documentNumber||p.title)}</td><td>${esc(p.definition||'-')}</td><td>${esc(p.quoteNumber||p.purchaseOrder||'-')}</td><td>${fmtDate(p.dueDate)}</td><td>${money(p.value)}</td><td>${money(p.paidValue)}</td><td>${fmtDate(p.paidDate)}</td><td><span class="badge ${status==='PAGO'?'ok':status==='EM ATRASO'?'danger':'warn'}">${status}</span></td><td><button class="btn ghost" data-payable-edit="${p.id}">Editar</button> <button class="btn danger" data-payable-del="${p.id}">Excluir</button></td>`;tb.appendChild(tr)}const sum=x=>x.reduce((a,p)=>a+Number(p.value||0),0),paid=x=>x.reduce((a,p)=>a+Number(p.paidValue||0),0),pending=x=>x.reduce((a,p)=>a+Math.max(0,Number(p.value||0)-Number(p.paidValue||0)),0),late=x=>x.filter(p=>payableStatus(p)==='EM ATRASO').reduce((a,p)=>a+Math.max(0,Number(p.value||0)-Number(p.paidValue||0)),0);if($('payableSummary'))$('payableSummary').innerHTML=[['Total geral',money(sum(all))],['Total filtrado',money(sum(list))],['Pago no filtro',money(paid(list))],['A pagar no filtro',money(pending(list))],['Em atraso',money(late(list))]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');document.querySelectorAll('[data-payable-edit]').forEach(b=>b.onclick=()=>openPayable(db.payables.find(x=>x.id===b.dataset.payableEdit)));document.querySelectorAll('[data-payable-del]').forEach(b=>b.onclick=()=>{if(confirm('Excluir este título definitivamente?')){db.payables=db.payables.filter(x=>x.id!==b.dataset.payableDel);queueSave();renderPayables()}})}
function openPayable(p=null){openModal(`<h2>${p?'Editar':'Novo'} título</h2><div class="grid two"><label class="field">Título / documento<input id="apTitle" value="${esc(p?.documentNumber||p?.title||'')}"></label><label class="field">Definição<input id="apDef" value="${esc(p?.definition||'')}"></label><label class="field">Referência<input id="apQuote" value="${esc(p?.quoteNumber||p?.purchaseOrder||'')}"></label><label class="field">Vencimento<input id="apDue" type="date" value="${p?.dueDate||''}"></label><label class="field">Valor<input id="apValue" type="number" step="0.01" value="${Number(p?.value||0)}"></label><label class="field">Valor pago<input id="apPaid" type="number" step="0.01" value="${Number(p?.paidValue||0)}"></label><label class="field">Data pagamento<input id="apPaidDate" type="date" value="${p?.paidDate||''}"></label><label class="field">Observações<textarea id="apNotes">${esc(p?.notes||'')}</textarea></label></div><button id="apSave" class="btn primary">Salvar</button>`);$('apSave').onclick=()=>{const doc=$('apTitle').value.trim();const obj={...(p||{}),id:p?.id||uid(),title:doc,documentNumber:doc,definition:$('apDef').value.trim(),quoteNumber:$('apQuote').value.trim(),dueDate:$('apDue').value,value:Number($('apValue').value||0),paidValue:Number($('apPaid').value||0),paidDate:$('apPaidDate').value,notes:$('apNotes').value.trim()};if(!obj.title)return alert('Informe o título/documento.');const i=db.payables.findIndex(x=>x.id===obj.id);if(i>=0)db.payables[i]=obj;else db.payables.unshift(obj);queueSave();closeModal();renderPayables()}}

function supplierOrders(id){return (db.purchaseOrders||[]).filter(o=>o.supplierId===id)}
function supplierPayables(id){const nums=new Set(supplierOrders(id).map(o=>o.number));return (db.payables||[]).filter(p=>nums.has(p.purchaseOrder)||supplierOrders(id).some(o=>o.id===p.purchaseOrderId))}
function openSupplierHistory(id,mode='orders'){const s=db.suppliers.find(x=>x.id===id);if(!s)return;const os=supplierOrders(id),ps=supplierPayables(id);if(mode==='orders'){const rows=os.map(o=>`<tr><td>${esc(o.number)}</td><td>${fmtDate(o.date)}</td><td>${esc(o.status||'-')}</td><td>${money(o.total||0)}</td></tr>`).join('');openModal(`<h2>Ordens de Compra • ${esc(s.name)}</h2><div class="table-wrap"><table class="table"><tr><th>OC</th><th>Data</th><th>Status</th><th>Valor</th></tr>${rows||'<tr><td colspan="4">Nenhuma ordem.</td></tr>'}</table></div>`) }else{const rows=ps.map(p=>`<tr><td>${esc(p.documentNumber||p.title)}</td><td>${fmtDate(p.dueDate)}</td><td>${money(p.value)}</td><td>${esc(payableStatus(p))}</td></tr>`).join('');openModal(`<h2>Títulos • ${esc(s.name)}</h2><div class="table-wrap"><table class="table"><tr><th>Documento</th><th>Vencimento</th><th>Valor</th><th>Status</th></tr>${rows||'<tr><td colspan="4">Nenhum título.</td></tr>'}</table></div>`)}}
function renderSuppliers(){const root=$('supplierList');if(!root)return;root.innerHTML='';for(const x of db.suppliers||[]){const os=supplierOrders(x.id),ps=supplierPayables(x.id),open=ps.reduce((a,p)=>a+Math.max(0,Number(p.value||0)-Number(p.paidValue||0)),0);const card=document.createElement('div');card.className='card';card.innerHTML=`<div class="card-title">${esc(x.name)}</div><p class="muted">CNPJ: ${esc(x.cnpj||'-')} • Contato: ${esc(x.contact||'-')}</p><p>${esc(x.productType||'-')} • Prazo médio ${Number(x.avgDays||0)} dias • Saldo de títulos ${money(open)}</p><div class="actions"><button class="btn ghost" data-sup-edit="${x.id}">Editar</button><button class="btn ghost" data-sup-titles="${x.id}">Ver títulos</button><button class="btn ghost" data-sup-orders="${x.id}">Ver ordens de compra</button><button class="btn secondary" data-sup-order="${x.id}">Nova ordem de compra</button><button class="btn danger" data-sup-del="${x.id}">Excluir</button></div>`;root.appendChild(card)}document.querySelectorAll('[data-sup-edit]').forEach(b=>b.onclick=()=>openSupplier(db.suppliers.find(x=>x.id===b.dataset.supEdit)));document.querySelectorAll('[data-sup-titles]').forEach(b=>b.onclick=()=>openSupplierHistory(b.dataset.supTitles,'titles'));document.querySelectorAll('[data-sup-orders]').forEach(b=>b.onclick=()=>openSupplierHistory(b.dataset.supOrders,'orders'));document.querySelectorAll('[data-sup-order]').forEach(b=>b.onclick=()=>openPurchase(null,b.dataset.supOrder));document.querySelectorAll('[data-sup-del]').forEach(b=>b.onclick=()=>{const has=(db.purchaseOrders||[]).some(o=>o.supplierId===b.dataset.supDel);if(has&&!confirm('Este fornecedor possui ordens de compra. Deseja excluir o cadastro mesmo assim?'))return;if(!has&&!confirm('Excluir fornecedor?'))return;db.suppliers=db.suppliers.filter(x=>x.id!==b.dataset.supDel);queueSave();renderSuppliers()})}
function openSupplier(s=null){openModal(`<h2>${s?'Editar':'Novo'} fornecedor</h2><div class="grid two"><label class="field">Razão social<input id="supName" value="${esc(s?.name||'')}"></label><label class="field">CNPJ<input id="supCnpj" value="${esc(s?.cnpj||'')}"></label><label class="field">Responsável / contato<input id="supContact" value="${esc(s?.contact||'')}"></label><label class="field">Telefone / e-mail<input id="supContactInfo" value="${esc(s?.contactInfo||'')}"></label><div class="field"><span>Materiais fornecidos</span><label><input type="checkbox" id="supFinish" ${s?.materialTypes?.includes('TECIDO DE ACABAMENTO')?'checked':''}> Tecido acabamento</label><label><input type="checkbox" id="supLining" ${s?.materialTypes?.includes('TECIDO DE FORRO')?'checked':''}> Tecido forro</label><label><input type="checkbox" id="supAccessory" ${s?.materialTypes?.includes('ACESSÓRIO')?'checked':''}> Acessório</label><label><input type="checkbox" id="supBlind" ${s?.materialTypes?.includes('PERSIANA')?'checked':''}> Persiana</label><label><input type="checkbox" id="supOther" ${s?.materialTypes?.includes('OUTROS')?'checked':''}> Outros</label></div><label class="field">Condição de venda<input id="supCond" value="${esc(s?.condition||'')}"></label><label class="field">Prazo médio entrega (dias)<input id="supDays" type="number" value="${Number(s?.avgDays||0)}"></label><label class="field">Observações<textarea id="supNotes">${esc(s?.notes||'')}</textarea></label></div><button id="supSave" class="btn primary">Salvar</button>`);$('supSave').onclick=()=>{const obj={id:s?.id||uid(),name:$('supName').value.trim(),cnpj:$('supCnpj').value.trim(),contact:$('supContact').value.trim(),contactInfo:$('supContactInfo').value.trim(),materialTypes:[['supFinish','TECIDO DE ACABAMENTO'],['supLining','TECIDO DE FORRO'],['supAccessory','ACESSÓRIO'],['supBlind','PERSIANA'],['supOther','OUTROS']].filter(x=>$(x[0])?.checked).map(x=>x[1]),productType:[['supFinish','TECIDO DE ACABAMENTO'],['supLining','TECIDO DE FORRO'],['supAccessory','ACESSÓRIO'],['supBlind','PERSIANA'],['supOther','OUTROS']].filter(x=>$(x[0])?.checked).map(x=>x[1]).join(', '),condition:$('supCond').value.trim(),avgDays:Number($('supDays').value||0),notes:$('supNotes').value.trim()};if(!obj.name)return alert('Informe a razão social.');const i=db.suppliers.findIndex(x=>x.id===obj.id);if(i>=0)db.suppliers[i]=obj;else db.suppliers.unshift(obj);queueSave();closeModal();renderSuppliers()}}

function renderReworks(){const tb=$('reworksTable');if(!tb)return;tb.innerHTML='';for(const r of db.reworks||[]){const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(r.number)}</td><td>${esc(r.orderNumber)}</td><td>${fmtDate(r.date)}</td><td>${esc(r.category||'-')}</td><td>${esc(r.summary)}</td><td><span class="badge ${r.status==='CONCLUÍDO'?'ok':'warn'}">${esc(r.status||'ABERTO')}</span></td><td><button class="btn ghost" data-rw-open="${r.id}">Abrir</button></td>`;tb.appendChild(tr)}document.querySelectorAll('[data-rw-open]').forEach(b=>b.onclick=()=>openRework(null,db.reworks.find(x=>x.id===b.dataset.rwOpen)))}
function openRework(orderNumber=null,existing=null){const cats=['MEDIÇÃO','CONFECÇÃO','INSTALAÇÃO','MATERIAL / FORNECEDOR','CLIENTE','OUTROS'];const stages=['ABERTO','PRODUÇÃO','EXPEDIÇÃO','AGENDAMENTO','INSTALAÇÃO','CONCLUÍDO'];openModal(`<h2>${existing?'Retrabalho '+esc(existing.number):'Novo retrabalho'}</h2><div class="grid two"><label class="field">Pedido<input id="rwOrder" value="${esc(existing?.orderNumber||orderNumber||'')}"></label><label class="field">Data<input id="rwDate" type="date" value="${existing?.date||today()}"></label><label class="field">Categoria<select id="rwCat">${cats.map(x=>`<option ${existing?.category===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Etapa<select id="rwStatus">${stages.map(x=>`<option ${existing?.status===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field" style="grid-column:1/-1">Descrição / observações<textarea id="rwSummary">${esc(existing?.summary||'')}</textarea></label><label class="field" style="grid-column:1/-1">Materiais utilizados / necessários<textarea id="rwMaterials">${esc(existing?.materials||'')}</textarea></label></div><p class="notice">Retrabalho é operacional: não cria nova venda, receita ou conta a receber.</p><button id="rwSave" class="btn primary">Salvar retrabalho</button>`);$('rwSave').onclick=()=>{const order=$('rwOrder').value.trim(),summary=$('rwSummary').value.trim();if(!order||!summary)return alert('Informe pedido e descrição.');const original=db.orders.find(o=>Number(o.numero)===Number(order));const obj={...(existing||{}),id:existing?.id||uid(),number:existing?.number||`RT-${String((db.settings.nextReworkNumber||1)).padStart(4,'0')}`,orderNumber:order,date:$('rwDate').value,category:$('rwCat').value,summary,materials:$('rwMaterials').value.trim(),status:$('rwStatus').value,updatedAt:new Date().toISOString(),by:currentUsername()};if(!existing){db.settings.nextReworkNumber=Number(db.settings.nextReworkNumber||1)+1;db.reworks.unshift(obj)}else{const idx=db.reworks.findIndex(x=>x.id===obj.id);db.reworks[idx]=obj}if(original)addOrderEvent(original,'RETRABALHO',`${obj.number} • ${obj.category} • ${obj.status}`);queueSave();closeModal();renderAll()}}

function renderUsers(){const tb=$('usersTable');if(!tb)return;const disabled=new Set((db.disabledUsers||[]).map(norm));tb.innerHTML='';for(const u0 of [...DEFAULT_USERS,...db.users].filter((u,i,a)=>a.findIndex(x=>norm(x.username)===norm(u.username))===i)){const u=userPermissionRecord(u0.username),dis=disabled.has(norm(u.username));const perms=(u.permissions||[]).includes('*')?'TODAS':(u.permissions||[]).map(k=>NAV.find(n=>n[0]===k)?.[1]||k).join(', ')||'Padrão do perfil';const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(u.username)}</td><td>${esc(u.name||'-')}</td><td>${esc(u.role)}</td><td>${Number(u.commission||0)}%</td><td style="max-width:260px">${esc(perms)}</td><td>${esc(u.createdBy||(u.builtIn?'SISTEMA':'-'))}</td><td>${u.createdAt?fmtDate(u.createdAt.slice(0,10)):'-'}</td><td><span class="badge ${dis?'danger':'ok'}">${dis?'DESATIVADO':'ATIVO'}</span> ${isGestor()?`<button class="btn ghost" data-user-profile="${esc(u.username)}">Editar</button> <button class="btn ghost" data-user-pass="${esc(u.username)}">Senha</button> <button class="btn ghost" data-user-edit="${esc(u.username)}">Permissões</button> <button class="btn danger" data-user-del="${esc(u.username)}">${u.builtIn?(dis?'Reativar':'Desativar'):'Excluir'}</button>`:''}</td>`;tb.appendChild(tr)}document.querySelectorAll('[data-user-profile]').forEach(b=>b.onclick=()=>openUserProfile(b.dataset.userProfile));document.querySelectorAll('[data-user-edit]').forEach(b=>b.onclick=()=>openUserPermissions(b.dataset.userEdit));document.querySelectorAll('[data-user-pass]').forEach(b=>b.onclick=()=>openResetPassword(b.dataset.userPass));document.querySelectorAll('[data-user-del]').forEach(b=>b.onclick=()=>deleteUser(b.dataset.userDel))}

function openUserProfile(username){if(!isGestor())return;const key=norm(username),custom=(db.users||[]).find(x=>norm(x.username)===key),u=userPermissionRecord(username);openModal(`<h2>Editar usuário • ${esc(username)}</h2><div class="grid two"><label class="field">Nome completo<input id="ueName" value="${esc(u.name||'')}"></label><label class="field">Perfil<select id="ueRole"><option value="sales">VENDAS</option><option value="production">PRODUÇÃO</option><option value="gestor">GESTOR</option></select></label><label class="field">Comissão (%)<input id="ueComm" type="number" step="0.01" value="${Number(u.commission||0)}"></label><div class="field"><span>Login</span><strong>${esc(username)}</strong></div></div><p class="muted">O login é a identidade permanente do vendedor e não é alterado para preservar o histórico.</p><button id="ueSave" class="btn primary">Salvar</button>`);$('ueRole').value=u.role||'sales';$('ueSave').onclick=async()=>{if(custom){custom.name=$('ueName').value.trim()||custom.name;custom.role=$('ueRole').value;custom.commission=Number($('ueComm').value||0)}else{db.settings=db.settings||{};db.settings.builtInUserProfiles=db.settings.builtInUserProfiles||{};db.settings.builtInUserProfiles[key]={name:$('ueName').value.trim()||u.name,role:$('ueRole').value,commission:Number($('ueComm').value||0)}}await saveCloud();closeModal();renderUsers();refreshSellerControl(draft.sellerUser)}}

function openResetPassword(username){if(!isGestor())return;openModal(`<h2>Redefinir senha • ${esc(username)}</h2><p class="muted">O Gestor define uma nova senha sem visualizar a senha atual.</p><label class="field">Nova senha<input id="resetPass" type="password" minlength="6"></label><label class="field">Confirmar nova senha<input id="resetPass2" type="password" minlength="6"></label><button id="resetPassSave" class="btn primary" style="margin-top:12px">Alterar senha</button>`);$('resetPassSave').onclick=async()=>{const a=$('resetPass').value,b=$('resetPass2').value;if(a.length<6)return alert('A senha precisa ter pelo menos 6 caracteres.');if(a!==b)return alert('As senhas não conferem.');const custom=(db.users||[]).find(x=>norm(x.username)===norm(username));const hash=await sha256(a);if(custom)custom.hash=hash;else{db.settings=db.settings||{};db.settings.userPasswordOverrides=db.settings.userPasswordOverrides||{};db.settings.userPasswordOverrides[norm(username)]=hash}await saveCloud();closeModal();alert('Senha alterada. Ela valerá no próximo login.')}}
function deleteUser(username){if(!isGestor())return alert('Apenas o GESTOR pode gerenciar usuários.');const u=[...DEFAULT_USERS,...db.users].find(x=>norm(x.username)===norm(username));if(!u)return;if(norm(username)===currentUsername())return alert('Você não pode excluir/desativar o usuário atualmente conectado.');db.disabledUsers=db.disabledUsers||[];if(u.builtIn){const i=db.disabledUsers.findIndex(x=>norm(x)===norm(username));if(i>=0){if(!confirm('Reativar este usuário?'))return;db.disabledUsers.splice(i,1)}else{if(!confirm('Desativar este usuário?'))return;db.disabledUsers.push(norm(username))}}else{if(!confirm('Excluir definitivamente este usuário?'))return;db.users=db.users.filter(x=>norm(x.username)!==norm(username));db.disabledUsers=db.disabledUsers.filter(x=>norm(x)!==norm(username));if(db.settings?.userPermissions)delete db.settings.userPermissions[norm(username)]}queueSave();renderUsers()}
function permissionChecklist(selected=[]){const set=new Set(selected);return `<div class="permission-grid">${NAV.map(([id,label])=>`<label class="perm"><input type="checkbox" data-perm="${id}" ${set.has('*')||set.has(id)?'checked':''}> ${esc(label)}</label>`).join('')}</div>`}
function collectPermissions(){return [...document.querySelectorAll('[data-perm]:checked')].map(x=>x.dataset.perm)}
function openUserPermissions(username){if(!isGestor())return;const u=userPermissionRecord(username);openModal(`<h2>Permissões • ${esc(username)}</h2><p>Marque as áreas que este usuário poderá ver e editar.</p>${permissionChecklist(u.permissions||(u.role==='gestor'?['*']:u.role==='production'?['orders','production','install']:['quote','quotes','clients','orders','install']))}<button id="permSave" class="btn primary" style="margin-top:12px">Salvar permissões</button>`);$('permSave').onclick=()=>{db.settings=db.settings||{};db.settings.userPermissions=db.settings.userPermissions||{};db.settings.userPermissions[norm(username)]=collectPermissions();queueSave();closeModal();renderUsers()}}
function openUser(){openModal(`<h2>Novo usuário</h2><div class="grid two"><label class="field">Usuário<input id="uUser"></label><label class="field">Nome completo<input id="uName"></label><label class="field">Senha<input id="uPass" type="password"></label><label class="field">Perfil<select id="uRole"><option value="sales">VENDAS</option><option value="production">PRODUÇÃO</option><option value="gestor">GESTOR</option></select></label><label class="field">Comissão (%)<input id="uComm" type="number" value="${db.priceConfig.commissionDefault||5}"></label></div><h3>Áreas que poderá acessar</h3>${permissionChecklist(['quote','quotes','clients','orders','install'])}<button id="uSave" class="btn primary" style="margin-top:12px">Criar usuário</button>`);$('uRole').onchange=()=>{const role=$('uRole').value,def=role==='gestor'?permissionKeys():role==='production'?['orders','production','install']:['quote','quotes','clients','orders','install'];document.querySelectorAll('[data-perm]').forEach(x=>x.checked=def.includes(x.dataset.perm))};$('uRole').onchange();$('uSave').onclick=async()=>{const username=norm($('uUser').value),name=$('uName').value.trim(),pass=$('uPass').value,role=$('uRole').value;if(username.length<3||pass.length<6)return alert('Usuário deve ter 3+ caracteres e senha 6+ caracteres.');if(allUsers().some(x=>norm(x.username)===username))return alert('Usuário já existe.');db.users.push({username,name,role,commission:Number($('uComm').value||0),hash:await sha256(pass),builtIn:false,createdBy:currentUsername(),createdAt:new Date().toISOString(),permissions:collectPermissions()});await saveCloud();closeModal();renderUsers();alert('Usuário criado e liberado para login.')}}

let modalDirty=false;let modalClosingByAction=false;
function openModal(html){modalDirty=false;$('modalBody').innerHTML=html;$('modal').classList.add('open')}
function closeModal(force=false){if(!force&&!modalClosingByAction&&modalDirty){if(!confirm('Existem informações preenchidas que ainda não foram salvas. Deseja descartar as alterações?'))return;}modalDirty=false;modalClosingByAction=false;$('modal').classList.remove('open');$('modalBody').innerHTML=''}
document.addEventListener('click',e=>{if(e.target.closest('#modalBody button')&&!e.target.matches('#modalClose')) modalClosingByAction=true;});
document.addEventListener('input',e=>{if($('modal')?.classList.contains('open')&&e.target.closest('#modalBody')) modalDirty=true;});

async function doLogin(){const user=norm($('loginUser').value),pass=$('loginPass').value;if(!user||!pass)return $('loginError').textContent='Informe usuário e senha.';try{$('loginBtn').disabled=true;$('loginError').textContent='';const j=await api('auth',{method:'POST',body:JSON.stringify({username:user,passwordHash:await sha256(pass)})});token=j.token;currentUser={username:j.username,role:j.role,name:j.name||j.username};sessionStorage.setItem('novaV9Token',token);sessionStorage.setItem('novaV9User',JSON.stringify(currentUser));document.body.classList.remove('auth-locked');$('loginScreen').classList.add('hidden');$('sessionUser').textContent=`${j.name||j.username} • ${String(j.role).toUpperCase()}`;draft.sellerUser=norm(j.username);draft.seller=sellerName(j.username);await loadCloud();refreshSellerControl(draft.sellerUser);setupSelectors();renderQuote();goHome()}catch(e){$('loginError').textContent=e.message}finally{$('loginBtn').disabled=false}}
function logout(){sessionStorage.removeItem('novaV9Token');sessionStorage.removeItem('novaV9User');location.reload()}
async function restore(){if(!token||!currentUser)return false;try{await api('data');document.body.classList.remove('auth-locked');$('loginScreen').classList.add('hidden');$('sessionUser').textContent=`${currentUser.name||currentUser.username} • ${String(currentUser.role).toUpperCase()}`;await loadCloud();setupSelectors();goHome();return true}catch{token='';currentUser=null;sessionStorage.clear();return false}}


function openLooseProduct(){
  const available=(db.products||[]).filter(p=>p.stockManaged&&Number(p.qty||0)>0).sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
  if(!available.length)return alert('Não há produtos disponíveis no estoque.');
  openModal(`<h2>Adicionar Produto Avulso</h2><p class="muted">Venda de tecido, trilho, varão, suporte, fita ou acessório sem criar ambiente. O preço padrão vem do estoque e pode ser alterado com justificativa.</p><div class="grid two"><label class="field">Produto<select id="lpProduct">${available.map(p=>`<option value="${p.id}">${esc(p.name)} • ${esc(p.color||'SEM COR')} • saldo ${Number(p.qty||0).toFixed(p.unit==='M'?2:0)} ${esc(p.unit||'')}</option>`).join('')}</select></label><label class="field">Quantidade<input id="lpQty" type="number" step="0.01" min="0.01" value="1"></label><label class="field" style="grid-column:1/-1">Descrição no orçamento<input id="lpDesc" placeholder="Opcional; por padrão usa o nome do produto"></label><label class="field">Preço à vista unitário<input id="lpCash" type="number" step="0.01"></label><label class="field">Justificativa da alteração<input id="lpReason" placeholder="Obrigatória somente se alterar o preço"></label></div><div id="lpPreview" class="notice"></div><button id="lpSave" class="btn primary">Adicionar produto</button>`);
  const productEl=$('lpProduct'), saveEl=$('lpSave'), qtyEl=$('lpQty'), cashEl=$('lpCash'), reasonEl=$('lpReason'), descEl=$('lpDesc'), previewEl=$('lpPreview');
  if(!productEl||!saveEl||!qtyEl||!cashEl||!reasonEl||!descEl||!previewEl){console.warn('Modal de produto avulso incompleto; ação cancelada.');return}
  productEl.onchange=()=>{const p=db.products.find(x=>x.id===productEl.value);if(!p)return;const pr=productPrices(p);cashEl.value=pr.cash.toFixed(2);previewEl.textContent=`Preço padrão à vista: ${money(pr.cash)} • 4x: ${money(pr.p4)} • 18x: ${money(pr.p18)}`;descEl.placeholder=p.name};
  productEl.dispatchEvent(new Event('change'));
  saveEl.onclick=()=>{const p=db.products.find(x=>x.id===productEl.value),qty=Number(qtyEl.value||0);if(!p||qty<=0)return alert('Informe produto e quantidade.');if(qty>Number(p.qty||0)+1e-9)return alert(`Estoque insuficiente. Disponível: ${p.qty} ${p.unit}.`);const std=productPrices(p),cash=Number(cashEl.value||0),reason=reasonEl.value.trim(),changed=Math.abs(cash-std.cash)>0.01;if(changed&&!reason)return alert('Informe a justificativa da alteração do preço.');const factor=std.cash>0?cash/std.cash:1;draft.looseProducts=draft.looseProducts||[];draft.looseProducts.push({id:uid(),productId:p.id,stockManaged:true,type:p.type,name:p.name,color:p.color,unit:p.unit,qty,description:descEl.value.trim()||p.name,standardCash:std.cash,cash,p4:std.p4*factor,p18:std.p18*factor,priceOverride:changed,priceReason:reason});closeModal();renderQuote()}
}



function openCombineProducts(){const active=()=>priceProducts.filter(p=>Number(p.active??1)===1);openModal(`<h2>Combinar Produtos</h2><p class="muted">Transforme insumos do estoque oficial em outro produto oficial. A operação baixa os insumos e dá entrada no produto resultante, mantendo histórico.</p><div id="combInputs"></div><button id="combAdd" class="btn secondary">+ Insumo</button><hr><div class="grid two"><label class="field">Produto resultante<select id="combOutput"><option value="">Selecione</option>${active().map(p=>`<option value="${p.id}">${esc(p.internal_code)} • ${esc(p.product_name)} • ${esc(p.color||'-')}</option>`).join('')}</select></label><label class="field">Quantidade gerada<input id="combOutputQty" type="number" min="0.01" step="0.01" value="1"></label><label class="field" style="grid-column:1/-1">Justificativa<input id="combReason" placeholder="Ex.: transformação / confecção própria"></label></div><button id="combSave" class="btn primary">Confirmar combinação</button>`);let rows=[...selectedPriceProductIds].filter(id=>active().some(p=>Number(p.id)===Number(id))).map(id=>({product_id:Number(id),qty:1}));if(!rows.length)rows=[{product_id:null,qty:1}];const draw=()=>{$('combInputs').innerHTML=rows.map((r,i)=>`<div class="grid three purchase-item"><label class="field" style="grid-column:span 2">Insumo<select data-ci="${i}"><option value="">Selecione</option>${active().map(p=>`<option value="${p.id}" ${Number(r.product_id)===Number(p.id)?'selected':''}>${esc(p.internal_code)} • ${esc(p.product_name)} • ${esc(p.color||'-')} • saldo ${Number(p.stock_quantity||0)}</option>`).join('')}</select></label><label class="field">Quantidade<input data-cq="${i}" type="number" min="0.01" step="0.01" value="${Number(r.qty||1)}"></label></div>`).join('');document.querySelectorAll('[data-ci]').forEach(x=>x.onchange=()=>rows[Number(x.dataset.ci)].product_id=Number(x.value));document.querySelectorAll('[data-cq]').forEach(x=>x.oninput=()=>rows[Number(x.dataset.cq)].qty=Number(x.value))};draw();$('combAdd').onclick=()=>{rows.push({product_id:null,qty:1});draw()};$('combSave').onclick=async()=>{const out=Number($('combOutput').value),qty=Number($('combOutputQty').value),reason=$('combReason').value.trim();if(!out||qty<=0||rows.some(r=>!r.product_id||r.qty<=0))return alert('Preencha insumos, produto resultante e quantidades.');if(!reason)return alert('Informe a justificativa.');try{$('combSave').disabled=true;await api('prices',{method:'POST',body:JSON.stringify({action:'COMBINAR_PRODUTOS',inputs:rows,output:{product_id:out,qty},reason})});closeModal();await reloadOfficialProducts();renderProducts();alert('Combinação registrada com sucesso.')}catch(e){alert(e.message)}finally{if($('combSave'))$('combSave').disabled=false}}}

function openSpecialProduct(){openModal(`<h2>Produto Fora de Estoque</h2><p class="muted">Use para um item especial comprado especificamente para este pedido. Ele não cria saldo positivo no estoque.</p><div class="grid two"><label class="field">Tipo<select id="spType"><option>TECIDO ESPECIAL</option><option>ACESSÓRIO</option><option>OUTRO</option><option>TECIDO DE ACABAMENTO</option><option>TECIDO DE FORRO</option></select></label><label class="field">Produto<input id="spName"></label><label class="field">Cor / modelo<input id="spColor"></label><label class="field">Unidade<select id="spUnit"><option>UN</option><option>M</option><option value="M2">M²</option><option>KG</option></select></label><label class="field">Quantidade<input id="spQty" type="number" step="0.01" value="1"></label><label class="field">Descrição no orçamento<input id="spDesc"></label><label class="field">18x unitário<input id="sp18" type="number" step="0.01"></label><label class="field">4x unitário<input id="sp4" type="number" step="0.01"></label><label class="field">À vista unitário<input id="spCash" type="number" step="0.01"></label><label class="field">Observação / motivo<input id="spReason" placeholder="Ex.: item sob encomenda"></label></div><button id="spSave" class="btn primary">Adicionar</button>`);$('spSave').onclick=()=>{const name=$('spName').value.trim(),qty=Number($('spQty').value||0);if(!name||qty<=0)return alert('Informe produto e quantidade.');draft.looseProducts=draft.looseProducts||[];draft.looseProducts.push({id:uid(),stockManaged:false,type:canonicalProductType($('spType').value),name,color:$('spColor').value.trim()||'SEM COR',unit:$('spUnit').value,qty,description:$('spDesc').value.trim()||name,p18:Number($('sp18').value||0),p4:Number($('sp4').value||0),cash:Number($('spCash').value||0),specialReason:$('spReason').value.trim(),outsideStock:true});closeModal();renderQuote()}}

function openBlind(){openModal(`<h2>Incluir persiana</h2><p class="muted">Informe manualmente os dados e valores trazidos do sistema da Amorim. O ERP não calcula o preço da persiana.</p><div class="grid two"><label class="field">Ambiente<input id="bEnv"></label><label class="field">Modelo<input id="bModel"></label><label class="field">Cor<input id="bColor"></label><label class="field">Bandô<input id="bBando"></label><label class="field">Largura (cm)<input id="bW" type="number"></label><label class="field">Altura (cm)<input id="bH" type="number"></label><label class="field">Quantidade (un.)<input id="bQty" type="number" min="1" value="1"></label><label class="field">Lado do comando<select id="bCmd"><option>DIREITO</option><option>ESQUERDO</option><option>SEM COMANDO</option></select></label><label class="field">18x por unidade (R$)<input id="b18" type="number" step="0.01"></label><label class="field">4x por unidade (R$)<input id="b4" type="number" step="0.01"></label><label class="field">À vista por unidade (R$)<input id="bCash" type="number" step="0.01"></label></div><button id="bSave" class="btn primary">Adicionar persiana</button>`);$('bSave').onclick=()=>{const w=Number($('bW').value),h=Number($('bH').value),qty=Math.max(1,Number($('bQty').value||1));const b={id:uid(),environment:$('bEnv').value.trim()||'PERSIANA',model:$('bModel').value.trim(),color:$('bColor').value.trim(),bando:$('bBando').value.trim(),width:w,height:h,qty,area:(w/100)*(h/100),commandSide:$('bCmd').value,p18:Number($('b18').value||0),p4:Number($('b4').value||0),cash:Number($('bCash').value||0)};if(!b.model||!w||!h)return alert('Informe modelo, largura e altura.');draft.blinds=draft.blinds||[];draft.blinds.push(b);closeModal();renderQuote()}}
function renderPurchases(){const tb=$('purchaseTable');if(!tb)return;db.purchaseOrders=db.purchaseOrders||[];tb.innerHTML='';for(const o of db.purchaseOrders){const st=o.status||'ABERTA',received=['RECEBIDA','FINALIZADA'].includes(st),total=Number(o.total||((o.items||[]).reduce((a,x)=>a+Number(x.qty||0)*Number(x.unitValue||0),0))),tr=document.createElement('tr');tr.innerHTML=`<td>${esc(o.number)}</td><td>${fmtDate(o.date)}</td><td>${esc(o.supplierName||'-')}</td><td>${esc(o.responsible||'-')}</td><td>${money(total)}</td><td><span class="badge ${st==='FINALIZADA'?'ok':received?'blue':'warn'}">${esc(st)}</span></td><td><button class="btn ${received?'ghost':'primary'}" data-po-receive="${o.id}">${received?'Recebida':'Confirmar recebimento'}</button> <button class="btn secondary" data-po-values="${o.id}" ${!received?'disabled title="Confirme o recebimento primeiro"':''}>Inserir valores</button> <button class="btn ghost" data-po-edit="${o.id}">Abrir</button> <button class="btn ghost" data-po-print="${o.id}">PDF</button> <button class="btn danger" data-po-delete="${o.id}">Excluir</button></td>`;tb.appendChild(tr)}document.querySelectorAll('[data-po-edit]').forEach(b=>b.onclick=()=>openPurchase(db.purchaseOrders.find(x=>x.id===b.dataset.poEdit)));document.querySelectorAll('[data-po-print]').forEach(b=>b.onclick=()=>printPurchase(db.purchaseOrders.find(x=>x.id===b.dataset.poPrint)));document.querySelectorAll('[data-po-receive]').forEach(b=>b.onclick=()=>openPurchaseReceipt(db.purchaseOrders.find(x=>x.id===b.dataset.poReceive)));document.querySelectorAll('[data-po-values]').forEach(b=>b.onclick=()=>openPurchaseValues(db.purchaseOrders.find(x=>x.id===b.dataset.poValues)));document.querySelectorAll('[data-po-delete]').forEach(b=>b.onclick=()=>deletePurchaseOrder(b.dataset.poDelete))}
function deletePurchaseOrder(id){const o=(db.purchaseOrders||[]).find(x=>x.id===id);if(!o)return;if(['RECEBIDA','FINALIZADA'].includes(o.status))return alert('Esta ordem já teve recebimento lançado. Estorne o recebimento antes de excluir.');if(!confirm(`Excluir ${o.number}?`))return;db.purchaseOrders=db.purchaseOrders.filter(x=>x.id!==id);const a=(db.purchaseAlerts||[]).find(x=>x.purchaseOrderId===id);if(a){a.resolved=false;delete a.purchaseOrderId}queueSave();renderPurchases();renderHome()}
function openPurchase(o=null,presetSupplierId='',sourceOrder=null,sourceAlert=null){db.purchaseOrders=db.purchaseOrders||[];const sups=db.suppliers.map(s=>`<option value="${s.id}" ${(o?.supplierId||presetSupplierId)===s.id?'selected':''}>${esc(s.name)}</option>`).join('');openModal(`<h2>${o?'Ordem '+esc(o.number):'Nova Ordem de Compra'}</h2>${sourceOrder?`<div class="notice"><strong>PEDIDO ${String(sourceOrder.numero).padStart(6,'0')}</strong> • Vendedor: ${esc(displaySeller(sourceOrder))} • Cliente: ${esc(sourceOrder.client)}<br><strong>DATA DE INSTALAÇÃO: ${fmtDate(sourceOrder.deliveryDate)}</strong><br><br><strong>MATERIAIS A SOLICITAR</strong>${purchaseMaterialsForOrder(sourceOrder).map(x=>`<div>• ${esc(x.name)} • ${esc(x.color)} • ${Number(x.qty).toFixed(x.unit==='M'?2:0)} ${x.unit}</div>`).join('')||'<div>Nenhum material externo identificado.</div>'}</div>`:''}<div class="grid two"><label class="field">Fornecedor<select id="poSup"><option value="">Selecione</option>${sups}</select></label><label class="field">Data da compra<input id="poDate" type="date" value="${o?.date||today()}"></label><label class="field">Responsável<input id="poResp" value="${esc(o?.responsible||sellerName(currentUser?.username))}"></label><label class="field">Solicitante<input id="poRequester" value="${esc(o?.requester||sellerName(currentUser?.username))}"></label><label class="field" style="grid-column:1/-1">Observações<textarea id="poNotes">${esc(o?.notes||'')}</textarea></label></div><h3>Produtos solicitados</h3><p class="muted">Produtos de estoque usam SKU oficial. Persianas são repasse: o nome é livre/editável e não gera saldo físico.</p><div id="poItems"></div><button id="poAdd" class="btn secondary">+ Produto do Estoque</button> <button id="poAddBlind" class="btn secondary">+ Persiana (repasse)</button> <button id="poConfirm" class="btn primary">${o?'Salvar alterações':'Criar Ordem de Compra'}</button>`);let items=clone(o?.items||[]);const active=()=>priceProducts.filter(p=>Number(p.active??1)===1);const draw=()=>{$('poItems').innerHTML=items.map((x,i)=>x.isBlind?`<div class="grid four purchase-item"><label class="field" style="grid-column:span 2">Persiana / descrição editável<input data-pblindname="${i}" value="${esc(x.name||'PERSIANA')}"></label><label class="field">Quantidade<input data-pq="${i}" type="number" min="0.01" step="1" value="${Number(x.qty||1)}"></label><label class="field">Custo unitário<input data-pcost="${i}" type="number" min="0" step="0.01" value="${Number(x.unitValue??0)}"></label><button class="btn danger" data-prm="${i}" type="button">Remover</button></div>`:`<div class="grid four purchase-item"><label class="field" style="grid-column:span 2">SKU / Produto / Cor<select data-psku="${i}"><option value="">Selecione</option>${active().map(p=>`<option value="${p.id}" ${Number(x.productId)===Number(p.id)?'selected':''}>${esc(p.internal_code)} • ${esc(p.product_name)} • ${esc(p.color||'-')} • ${esc(p.unit||'')}</option>`).join('')}</select></label><label class="field">Quantidade<input data-pq="${i}" type="number" min="0.01" step="0.01" value="${Number(x.qty||1)}"></label><label class="field">Custo unitário<input data-pcost="${i}" type="number" min="0" step="0.01" value="${Number(x.unitValue??0)}"></label><button class="btn danger" data-prm="${i}" type="button">Remover</button></div>`).join('');document.querySelectorAll('[data-pblindname]').forEach(el=>el.oninput=()=>items[Number(el.dataset.pblindname)].name=el.value);document.querySelectorAll('[data-psku]').forEach(el=>el.onchange=()=>{const p=officialProductById(Number(el.value));if(p){items[Number(el.dataset.psku)]={...items[Number(el.dataset.psku)],productId:Number(p.id),internalCode:p.internal_code,name:p.product_name,color:p.color||'SEM COR',unit:p.unit||'UN',supplierCode:p.supplier_code||'',category:p.category||'',unitValue:Number(p.cost||0)};draw()}});document.querySelectorAll('[data-pq]').forEach(el=>el.oninput=()=>items[Number(el.dataset.pq)].qty=Number(el.value));document.querySelectorAll('[data-pcost]').forEach(el=>el.oninput=()=>items[Number(el.dataset.pcost)].unitValue=Number(el.value));document.querySelectorAll('[data-prm]').forEach(el=>el.onclick=()=>{items.splice(Number(el.dataset.prm),1);draw()})};draw();$('poAdd').onclick=()=>{items.push({productId:null,qty:1,unitValue:0});draw()};$('poAddBlind').onclick=()=>{items.push({productId:null,isBlind:true,category:'PERSIANA',name:'PERSIANA',color:'',unit:'UN',internalCode:'REPASSE',qty:1,unitValue:0});draw()};$('poConfirm').onclick=()=>{const sid=$('poSup').value,sup=db.suppliers.find(x=>x.id===sid);if(!sid||!items.length)return alert('Selecione o fornecedor e adicione ao menos um produto.');if(items.some(x=>(!x.isBlind&&!x.productId)||(x.isBlind&&!String(x.name||'').trim())||Number(x.qty)<=0))return alert('Selecione o SKU ou informe o nome da persiana e a quantidade de todos os itens.');const obj={...(o||{}),id:o?.id||uid(),number:o?.number||`OC-${String((db.settings.nextPurchaseNumber||1)).padStart(6,'0')}`,date:$('poDate').value,responsible:$('poResp').value.trim(),requester:$('poRequester').value.trim(),supplierId:sid,supplierName:sup.name,supplierCnpj:sup.cnpj||'',supplierContact:sup.contact||'',notes:$('poNotes').value.trim(),items,status:o?.status||'AGUARDANDO RECEBIMENTO',sourceOrderNumber:o?.sourceOrderNumber||sourceOrder?.numero||null,sourceSeller:o?.sourceSeller||(sourceOrder?displaySeller(sourceOrder):''),sourceClient:o?.sourceClient||sourceOrder?.client||'',sourceDeliveryDate:o?.sourceDeliveryDate||sourceOrder?.deliveryDate||''};if(!o){db.settings.nextPurchaseNumber=Number(db.settings.nextPurchaseNumber||1)+1;db.purchaseOrders.unshift(obj)}else{const i=db.purchaseOrders.findIndex(x=>x.id===obj.id);db.purchaseOrders[i]=obj}if(sourceAlert){sourceAlert.resolved=true;sourceAlert.purchaseOrderId=obj.id}queueSave();closeModal();renderPurchases();renderHome()}}
function changePurchaseStatus(o){openPurchaseReceipt(o)}
function openPurchaseReceipt(o){if(!o)return;if(['RECEBIDA','FINALIZADA'].includes(o.status))return alert(`Recebimento já confirmado em ${fmtDate(o.receivedDate)}. NF: ${o.invoice||'-'}`);openModal(`<h2>Confirmar recebimento • ${esc(o.number)}</h2><p><strong>${esc(o.supplierName)}</strong></p><div class="grid two"><label class="field">Data do recebimento<input id="recDate" type="date" value="${today()}"></label><label class="field">Nº da Nota Fiscal<input id="recNF"></label></div><h3>Recebimento da compra</h3><p class="muted">Persianas são repasse e não entram no estoque físico.</p><div id="recItems">${(o.items||[]).map((x,i)=>`<div class="grid four purchase-item"><label class="field">SKU<input value="${esc(x.internalCode||'-')}" disabled></label><label class="field">Produto<input value="${esc(x.name||'')} / ${esc(x.color||'-')}" disabled></label><label class="field">Quantidade<input value="${Number(x.qty||0)} ${esc(x.unit||'')}" disabled></label><label class="field">Custo unitário NF<input data-ri-cost="${i}" type="number" min="0" step="0.01" value="${Number(x.unitValue||0)}"></label></div>`).join('')}</div><label class="field">Observações / divergências<textarea id="recNotes"></textarea></label><button id="recConfirm" class="btn primary">Confirmar recebimento</button>`);$('recConfirm').onclick=async()=>{const nf=$('recNF').value.trim();if(!nf)return alert('Informe o número da Nota Fiscal.');document.querySelectorAll('[data-ri-cost]').forEach(el=>o.items[Number(el.dataset.riCost)].unitValue=Number(el.value||0));try{$('recConfirm').disabled=true;const stockItems=(o.items||[]).filter(x=>!x.isBlind&&x.productId);if(stockItems.length)await api('prices',{method:'POST',body:JSON.stringify({action:'RECEBER_COMPRA',order_number:o.number,invoice:nf,items:stockItems.map(x=>({product_id:Number(x.productId),qty:Number(x.qty),unit_cost:Number(x.unitValue||0)}))})});o.receivedDate=$('recDate').value;o.invoice=nf;o.receiptCheck=$('recNotes').value.trim();o.status='RECEBIDA';o.total=(o.items||[]).reduce((a,x)=>a+Number(x.qty||0)*Number(x.unitValue||0),0);queueSave();closeModal();await reloadOfficialProducts();renderAll();setTimeout(()=>openPurchaseValues(o),100)}catch(e){alert(e.message)}finally{if($('recConfirm'))$('recConfirm').disabled=false}}}
function openPurchaseValues(o){if(!o||!['RECEBIDA','FINALIZADA'].includes(o.status))return alert('Confirme o recebimento e a Nota Fiscal antes de inserir as duplicatas.');let rows=clone(o.duplicates||[]);if(!rows.length)rows=[{documentNumber:o.invoice||'',dueDate:'',value:o.total||0}];openModal(`<h2>Valores / duplicatas • ${esc(o.number)}</h2><p><strong>Fornecedor:</strong> ${esc(o.supplierName)} &nbsp; <strong>NF:</strong> ${esc(o.invoice||'-')} &nbsp; <strong>Total da NF:</strong> ${money(o.total||0)}</p><div id="dupCheck" class="kpis"></div><div id="dupRows"></div><button id="dupAdd" class="btn secondary">+ Duplicata</button> <button id="dupSave" class="btn primary">Salvar e enviar ao Contas a Pagar</button>`);const update=()=>{const total=rows.reduce((a,x)=>a+Number(x.value||0),0),diff=Number(o.total||0)-total;$('dupCheck').innerHTML=`<div class="kpi"><span>Total da NF</span><strong>${money(o.total||0)}</strong></div><div class="kpi"><span>Distribuído nas duplicatas</span><strong>${money(total)}</strong></div><div class="kpi"><span>Diferença</span><strong>${money(diff)}</strong></div>`};const draw=()=>{$('dupRows').innerHTML=rows.map((x,i)=>`<div class="grid three purchase-item"><label class="field">Nº documento<input data-ddoc="${i}" value="${esc(x.documentNumber||'')}"></label><label class="field">Vencimento<input data-ddue="${i}" type="date" value="${x.dueDate||''}"></label><label class="field">Valor<input data-dval="${i}" type="number" step="0.01" value="${Number(x.value||0)}"></label></div>`).join('');document.querySelectorAll('[data-ddoc]').forEach(el=>el.oninput=()=>rows[el.dataset.ddoc].documentNumber=el.value);document.querySelectorAll('[data-ddue]').forEach(el=>el.oninput=()=>rows[el.dataset.ddue].dueDate=el.value);document.querySelectorAll('[data-dval]').forEach(el=>el.oninput=()=>{rows[el.dataset.dval].value=Number(el.value);update()});update()};draw();$('dupAdd').onclick=()=>{rows.push({documentNumber:o.invoice||'',dueDate:'',value:0});draw()};$('dupSave').onclick=()=>{if(rows.some(x=>!x.documentNumber||!x.dueDate||Number(x.value)<=0))return alert('Preencha documento, vencimento e valor de todas as duplicatas.');const sum=rows.reduce((a,x)=>a+Number(x.value||0),0);if(Math.abs(sum-Number(o.total||0))>0.01)return alert(`A soma das duplicatas (${money(sum)}) precisa ser igual ao total da NF (${money(o.total||0)}).`);o.duplicates=rows;o.paymentDataEntered=true;o.status='FINALIZADA';db.payables=(db.payables||[]).filter(p=>p.purchaseOrderId!==o.id);rows.forEach((x,i)=>db.payables.unshift({id:uid(),title:x.documentNumber,documentNumber:x.documentNumber,definition:`COMPRA • ${o.supplierName}`,purchaseOrder:o.number,purchaseOrderId:o.id,quoteNumber:o.number,dueDate:x.dueDate,value:Number(x.value),paidValue:0,paidDate:'',notes:`NF ${o.invoice} • parcela ${i+1}/${rows.length}`}));queueSave();closeModal();renderAll()}}
function printPurchase(o){const c=companySettings();const rows=(o.items||[]).map(x=>`<tr><td>${esc(x.internalCode||'-')}</td><td>${esc(x.name||'-')}<br><small>${esc(x.color||'')}</small></td><td>${esc(x.supplierCode||'-')}</td><td>${Number(x.qty||0)} ${esc(x.unit||'')}</td><td>${money(x.unitValue||0)}</td><td>${money(Number(x.qty||0)*Number(x.unitValue||0))}</td></tr>`).join('');const total=(o.items||[]).reduce((a,x)=>a+Number(x.qty||0)*Number(x.unitValue||0),0);const body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>${esc(c.tradeName||'Nova Imagem Cortinas e Persianas')}</strong><br>${esc(c.legalName||'')}<br>CNPJ ${esc(c.cnpj||'-')} • IE ${esc(c.ie||'-')}<br>${esc(c.address||'')}<br>${esc(c.phone||'')}<br><br><strong>ORDEM DE COMPRA ${esc(o.number)}</strong></div></div><div class="section-title">Identificação da ordem de compra</div><div class="purchase-meta"><div><strong>Data:</strong> ${fmtDate(o.date)}<br><strong>Responsável:</strong> ${esc(o.responsible||'-')}<br><strong>Solicitante:</strong> ${esc(o.requester||'-')}</div><div><strong>Fornecedor:</strong> ${esc(o.supplierName||'-')}<br><strong>CNPJ:</strong> ${esc(o.supplierCnpj||'-')}<br><strong>Contato:</strong> ${esc(o.supplierContact||'-')}</div></div>${o.sourceOrderNumber?`<div class="section-title">Referência do pedido</div><p><strong>Pedido:</strong> ${String(o.sourceOrderNumber).padStart(6,'0')} &nbsp; <strong>Vendedor:</strong> ${esc(o.sourceSeller||'-')} &nbsp; <strong>Cliente:</strong> ${esc(o.sourceClient||'-')}<br><strong>DATA DE INSTALAÇÃO: ${fmtDate(o.sourceDeliveryDate)}</strong></p>`:''}<div class="section-title">Itens</div><table class="summary-table"><thead><tr><th>SKU</th><th>Produto / Cor</th><th>Cód. fornecedor</th><th>Quantidade</th><th>V. unit.</th><th>V. total</th></tr></thead><tbody>${rows||'<tr><td colspan="6">Sem itens.</td></tr>'}</tbody></table><div class="purchase-total">TOTAL: ${money(total)}</div><div class="section-title">Dados do faturamento</div><p><strong>NF:</strong> ${esc(o.invoice||'A informar')} &nbsp; <strong>Status:</strong> ${esc(o.status||'-')}<br><strong>Observações:</strong> ${esc(o.notes||'Sem observações.')}</p>`;printWindow(body)}

function printWindow(body){const w=window.open('about:blank','_blank');if(!w)return alert('O navegador bloqueou a abertura do PDF. Libere pop-ups para este site.');w.document.write(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nova Imagem ERP V11.6</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:8mm;color:#173638;font-size:10pt}h2{font-size:16pt;margin:0;color:#075b5b}.pdf-head{display:grid;grid-template-columns:6cm 1fr;gap:12px;align-items:start}.pdf-head img{width:6cm;height:4cm;object-fit:contain;object-position:left top}.store-client{font-size:12pt;line-height:1.35}.quote-number{font-size:12pt;font-weight:700;margin:6px 0 12px}.env-block{margin:0 0 12px;break-inside:avoid}.env-title{font-size:11pt;font-weight:700;padding:6px 8px;background:#eef6f5;border:1px solid #b9d1cf}.env-table,.summary-table{width:100%;border-collapse:collapse}.env-table th,.env-table td,.summary-table th,.summary-table td{border:1px solid #c7d8d6;padding:6px;font-size:10pt;text-align:left;vertical-align:top}.env-table th{width:17%;background:#f7faf9}.section-title{font-size:11pt;font-weight:700;color:#075b5b;margin:14px 0 6px}.totals{font-size:11pt;font-weight:700}.conditions{font-size:10pt;line-height:1.45}.sign{margin-top:16px}.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:24mm;margin-top:24mm;text-align:center;break-inside:avoid}.signature-line{border-top:1px solid #173638;margin-bottom:5px}.purchase-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.purchase-total{text-align:right;font-size:12pt;font-weight:700;margin-top:10px}.customer-access-box{display:grid;grid-template-columns:34mm 1fr;gap:10px;align-items:center;border:1px solid #b9d1cf;border-radius:8px;padding:8px;break-inside:avoid}.customer-qr{width:30mm;height:30mm;object-fit:contain}.customer-portal-link{color:#075b5b;font-weight:700;text-decoration:underline;word-break:break-all}.customer-access-box small{display:block;margin-top:4px;color:#486465}@page{size:A4 portrait;margin:8mm}@media print{body{margin:0}.screen-only{display:none!important}}</style></head><body><div class="screen-only" style="margin-bottom:12px"><button onclick="window.close()" style="padding:10px 16px;border:0;border-radius:8px;background:#075b5b;color:white;font-weight:700">← RETORNAR À PÁGINA ANTERIOR</button></div>${body}<script>window.addEventListener('afterprint',()=>{});<\/script></body></html>`);w.document.close();setTimeout(()=>{try{w.focus();w.print()}catch(e){}},450)}
function detailRows(c,e){const r=[];if(c.finishCalc)r.push([e.finish+' '+e.finishColor,c.finishCalc.consumption.toFixed(2)+' m',c.finishCalc.unitPrice,c.finishCalc.cost]);if(c.liningCalc)r.push([e.lining+' '+e.liningColor,c.liningCalc.consumption.toFixed(2)+' m',c.liningCalc.unitPrice,c.liningCalc.cost]);if(c.finishCalc&&e.finishPleat==='WAVE')r.push(['FITA WAVE COM BOTÕES INOX',c.finishCalc.consumption.toFixed(2)+' m',Number(db.priceConfig.pleatLabor.WAVE||0),c.finishPleat]);r.push(['DESLIZANTES',c.finishSliders+c.liningSliders+' un',c.sliderCost/Math.max(1,c.finishSliders+c.liningSliders),c.sliderCost]);if(e.finishPleat==='WAVE'||e.liningPleat==='WAVE')r.push(['CORDÃO WAVE',e.width/100+' m',0,0]);r.push([e.fixation+' '+e.fixColor,c.fixationCalc.meters?.toFixed(2)+' m',c.fixationCalc.total/Math.max(1,c.fixationCalc.meters||1),c.fixationCalc.total]);r.push(['ACABAMENTO / CONFECÇÃO',c.sewingMeters.toFixed(2)+' m',Number(db.priceConfig.sewingPerMeter||0),c.sewingCost+c.finishPleat+c.liningPleat]);r.push(['MÃO DE OBRA / INSTALAÇÃO','1',c.installCost,c.installCost]);return r}
function printQuote(q,type='summary'){
 const t=quoteTotals(q);let body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><span>ORÇAMENTO COMERCIAL</span><br><br><strong>Cliente:</strong> ${esc(q.client||'-')}<br><strong>Contato:</strong> ${esc(q.contact||'-')}<br><strong>Endereço:</strong> ${esc(q.address||'-')}<br><strong>Vendedor:</strong> ${esc(displaySeller(q))}<br><strong>Data:</strong> ${fmtDate(q.date)}</div></div><div class="quote-number">ORÇAMENTO Nº ${String(q.numero).padStart(6,'0')}</div>`;
 for(const e of q.environments||[]){const c=calcEnvironment(e);if(!c)continue;body+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td colspan="3">${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td></tr><tr><th>18x</th><td>${money(c.p18)}</td><th>4x</th><td>${money(c.base4)}</td></tr><tr><th>À vista</th><td colspan="3"><strong>${money(c.cash)}</strong></td></tr>${e.notes?`<tr><th>Observações</th><td colspan="3">${esc(e.notes)}</td></tr>`:''}</table></div>`}
 if((q.blinds||[]).length){body+=`<div class="section-title">Persianas</div>`;for(const x of q.blinds){const qty=Number(x.qty||1);body+=`<div class="env-block"><div class="env-title">${esc(x.environment||'PERSIANA')}</div><table class="env-table"><tr><th>Modelo</th><td>${esc(x.model||'-')}</td><th>Cor</th><td>${esc(x.color||'-')}</td></tr><tr><th>Medidas</th><td>${x.width} × ${x.height} cm</td><th>Quantidade</th><td>${qty} un.</td></tr><tr><th>Comando</th><td>${esc(x.commandSide||'-')}</td><th>Bandô</th><td>${esc(x.bando||'-')}</td></tr><tr><th>18x</th><td>${money(Number(x.p18||0)*qty)}</td><th>4x</th><td>${money(Number(x.p4||0)*qty)}</td></tr><tr><th>À vista</th><td colspan="3"><strong>${money(Number(x.cash||0)*qty)}</strong></td></tr></table></div>`}}
 if((q.looseProducts||[]).length){for(const [title,list] of [['Produtos Avulsos',(q.looseProducts||[]).filter(a=>a.stockManaged!==false)],['Produtos Fora de Estoque',(q.looseProducts||[]).filter(a=>a.stockManaged===false)]]){if(!list.length)continue;body+=`<div class="section-title">${title}</div><table class="summary-table"><tr><th>Descrição</th><th>Produto</th><th>Qtd.</th><th>18x</th><th>4x</th><th>À vista</th></tr>${list.map(a=>`<tr><td>${esc(a.description||a.name)}</td><td>${esc(a.name)} / ${esc(a.color||'')}</td><td>${a.qty} ${esc(a.unit||'')}</td><td>${money(Number(a.p18||0)*Number(a.qty||1))}</td><td>${money(Number(a.p4||0)*Number(a.qty||1))}</td><td>${money(Number(a.cash||0)*Number(a.qty||1))}</td></tr>`).join('')}</table>`}}
 if(Number(q.travel||0)>0)body+=`<p><strong>Deslocamento:</strong> ${money(q.travel)}</p>`;
 body+=`<div class="section-title">Resumo</div><table class="summary-table"><tr><th>Condição</th><th>Valor final</th></tr><tr><td>18x</td><td class="totals">${money(t.p18)}</td></tr><tr><td>Até 4x</td><td class="totals">${money(t.p4)}</td></tr><tr><td>À vista</td><td class="totals">${money(t.cash)}</td></tr></table>${q.discountPercent?`<p><strong>Desconto:</strong> ${q.discountPercent}% • ${esc(q.discountReason||'')}</p>`:''}<div class="section-title">Condições comerciais</div><div class="conditions">Validade do orçamento: 5 dias. Medidas, tecidos, cores e fixações devem ser conferidos antes da ordem de produção. Prazo sugerido para a instalação de 30 dias, devendo ser agendado no pedido.</div><p class="sign"><strong>Atenciosamente, ${esc(displaySeller(q))}</strong></p>`;printWindow(body)
}


function hrData(){db.settings=db.settings||{};db.settings.hr=db.settings.hr||{employees:[],providers:[],payrollClosings:[]};db.settings.hr.employees=db.settings.hr.employees||[];db.settings.hr.providers=db.settings.hr.providers||[];db.settings.hr.payrollClosings=db.settings.hr.payrollClosings||[];return db.settings.hr}
function renderHR(){const h=hrData(),et=$('employeeTable'),pt=$('providerTable');if(!et||!pt)return;et.innerHTML=h.employees.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.role||'-')}</td><td>${fmtDate(e.admissionDate)}</td><td>${money(e.salary)}</td><td><span class="badge ${e.active===false?'danger':'ok'}">${e.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-emp-edit="${e.id}">Editar</button></td></tr>`).join('');pt.innerHTML=h.providers.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.personType||'-')}</td><td>${esc(e.service||'-')}</td><td>${money(e.value)}</td><td><span class="badge ${e.active===false?'danger':'ok'}">${e.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-prov-edit="${e.id}">Editar</button> <button class="btn primary" data-prov-receipt="${e.id}">GERAR RECIBO</button></td></tr>`).join('');const activeEmp=h.employees.filter(x=>x.active!==false),activeProv=h.providers.filter(x=>x.active!==false);if($('hrSummary'))$('hrSummary').innerHTML=[['Colaboradores ativos',activeEmp.length],['Prestadores ativos',activeProv.length],['Folha-base',money(activeEmp.reduce((a,x)=>a+Number(x.salary||0),0))],['Serviços recorrentes',money(activeProv.reduce((a,x)=>a+Number(x.value||0),0))]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');document.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>openEmployee(h.employees.find(x=>x.id===b.dataset.empEdit)));document.querySelectorAll('[data-prov-edit]').forEach(b=>b.onclick=()=>openProvider(h.providers.find(x=>x.id===b.dataset.provEdit)));document.querySelectorAll('[data-prov-receipt]').forEach(b=>b.onclick=()=>openProviderReceipt(b.dataset.provReceipt))}
function openEmployee(e=null){openModal(`<h2>${e?'Editar':'Novo'} colaborador CLT</h2><div class="grid two"><label class="field">Nome completo<input id="hrName" value="${esc(e?.name||'')}"></label><label class="field">CPF<input id="hrCpf" value="${esc(e?.cpf||'')}"></label><label class="field">RG<input id="hrRg" value="${esc(e?.rg||'')}"></label><label class="field">Cargo<input id="hrRole" value="${esc(e?.role||'')}"></label><label class="field">Setor<input id="hrSector" value="${esc(e?.sector||'')}"></label><label class="field">Admissão<input id="hrAdm" type="date" value="${e?.admissionDate||''}"></label><label class="field">Salário-base<input id="hrSalary" type="number" step="0.01" value="${Number(e?.salary||0)}"></label><label class="field">Usuário vendedor vinculado<select id="hrUser"><option value="">SEM VÍNCULO</option>${allUsers().map(u=>`<option value="${u.username}" ${norm(e?.username)===norm(u.username)?'selected':''}>${esc(u.name||u.username)}</option>`).join('')}</select></label><label class="field">Status<select id="hrActive"><option value="1">ATIVO</option><option value="0" ${e?.active===false?'selected':''}>INATIVO</option></select></label><label class="field">Jornada / observações<input id="hrJourney" value="${esc(e?.journey||'')}"></label><label class="field" style="grid-column:1/-1">Documentos, exames, certificados e cursos<textarea id="hrDocs" rows="5" placeholder="Registre nome do documento, data, validade e observações. Para anexos binários, faremos a etapa de armazenamento dedicado.">${esc(e?.documents||'')}</textarea></label></div><button id="hrSave" class="btn primary">Salvar</button>`);$('hrSave').onclick=()=>{const h=hrData(),obj={...(e||{}),id:e?.id||uid(),name:$('hrName').value.trim(),cpf:$('hrCpf').value.trim(),rg:$('hrRg').value.trim(),role:$('hrRole').value.trim(),sector:$('hrSector').value.trim(),admissionDate:$('hrAdm').value,salary:Number($('hrSalary').value||0),username:$('hrUser').value,active:$('hrActive').value==='1',journey:$('hrJourney').value.trim(),documents:$('hrDocs').value.trim(),updatedAt:new Date().toISOString()};if(!obj.name)return alert('Informe o nome.');const i=h.employees.findIndex(x=>x.id===obj.id);if(i>=0)h.employees[i]=obj;else h.employees.unshift(obj);queueSave();closeModal();renderHR()}}
function openProvider(e=null){openModal(`<h2>${e?'Editar':'Novo'} prestador de serviços</h2><div class="grid two"><label class="field">PF/PJ<select id="pvType"><option>PF</option><option ${e?.personType==='PJ'?'selected':''}>PJ</option></select></label><label class="field">Nome / Razão social<input id="pvName" value="${esc(e?.name||'')}"></label><label class="field">CPF/CNPJ<input id="pvDoc" value="${esc(e?.document||'')}"></label><label class="field">Natureza do serviço<input id="pvService" value="${esc(e?.service||'')}"></label><label class="field">Valor recorrente / referência<input id="pvValue" type="number" step="0.01" value="${Number(e?.value||0)}"></label><label class="field">Periodicidade<select id="pvPeriod"><option>MENSAL</option><option>POR SERVIÇO</option><option>OUTRO</option></select></label><label class="field">Início contrato<input id="pvStart" type="date" value="${e?.contractStart||''}"></label><label class="field">Fim contrato<input id="pvEnd" type="date" value="${e?.contractEnd||''}"></label><label class="field">Status<select id="pvActive"><option value="1">ATIVO</option><option value="0" ${e?.active===false?'selected':''}>INATIVO</option></select></label><label class="field">Contrato / observações<textarea id="pvContract">${esc(e?.contract||'')}</textarea></label></div><button id="pvSave" class="btn primary">Salvar</button>`);if(e?.periodicity)$('pvPeriod').value=e.periodicity;$('pvSave').onclick=()=>{const h=hrData(),obj={...(e||{}),id:e?.id||uid(),personType:$('pvType').value,name:$('pvName').value.trim(),document:$('pvDoc').value.trim(),service:$('pvService').value.trim(),value:Number($('pvValue').value||0),periodicity:$('pvPeriod').value,contractStart:$('pvStart').value,contractEnd:$('pvEnd').value,active:$('pvActive').value==='1',contract:$('pvContract').value.trim(),updatedAt:new Date().toISOString()};if(!obj.name)return alert('Informe o prestador.');const i=h.providers.findIndex(x=>x.id===obj.id);if(i>=0)h.providers[i]=obj;else h.providers.unshift(obj);queueSave();closeModal();renderHR()}}
function payrollRows(competence){const h=hrData(),rows=[];for(const e of h.employees.filter(x=>x.active!==false)){const username=norm(e.username),commission=username?db.orders.filter(o=>resolveSellerUser(o)===username&&String(o.createdDate||'').slice(0,7)===competence).reduce((a,o)=>a+Number(o.agreedValue||0)*sellerCommission(username)/100,0):0;rows.push({kind:'CLT',refId:e.id,name:e.name,username,base:Number(e.salary||0),commission,total:Number(e.salary||0)+commission})}for(const p of h.providers.filter(x=>x.active!==false&&x.periodicity==='MENSAL'))rows.push({kind:'PRESTADOR',refId:p.id,name:p.name,base:Number(p.value||0),commission:0,total:Number(p.value||0)});return rows}
function previewPayroll(){const comp=$('hrCompetence')?.value;if(!comp)return alert('Informe a competência.');const rows=payrollRows(comp);$('payrollPreview').innerHTML=`<table class="table"><thead><tr><th>Pessoa</th><th>Tipo</th><th>Base</th><th>Comissão</th><th>Total</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.kind}</td><td>${money(r.base)}</td><td>${money(r.commission)}</td><td><strong>${money(r.total)}</strong></td></tr>`).join('')}</tbody></table>`;return rows}
function closePayroll(){const comp=$('hrCompetence')?.value,due=$('hrDueDate')?.value;if(!comp||!due)return alert('Informe competência e vencimento.');const h=hrData();if(h.payrollClosings.some(x=>x.competence===comp))return alert('Esta competência já foi fechada. Evitamos duplicidade.');const rows=payrollRows(comp);if(!rows.length)return alert('Não há remunerações para fechar.');for(const r of rows){db.payables.unshift({id:uid(),title:`DP-${comp}-${r.refId}`,documentNumber:`DP-${comp}-${r.refId}`,definition:r.kind==='CLT'?`REMUNERAÇÃO • ${r.name}`:`SERVIÇOS • ${r.name}`,quoteNumber:comp,dueDate:due,value:r.total,paidValue:0,paidDate:'',notes:r.commission?`Salário/base ${money(r.base)} + comissão ${money(r.commission)}`:`Competência ${comp}`,hrCompetence:comp,hrRefId:r.refId})}h.payrollClosings.push({id:uid(),competence:comp,dueDate:due,rows,closedAt:new Date().toISOString(),by:currentUsername()});queueSave();renderPayables();renderHR();alert('Competência fechada e enviada ao Contas a Pagar.')}


function agendaVisibleItems(){db.agenda=db.agenda||[];return db.agenda.filter(a=>isGestor()||norm(a.ownerUser)===currentUsername()).sort((a,b)=>String(a.date+' '+a.time).localeCompare(String(b.date+' '+b.time)))}
function renderAgenda(){const tb=$('agendaTable');if(!tb)return;tb.innerHTML=agendaVisibleItems().map(a=>`<tr><td>${fmtDate(a.date)}</td><td>${esc(a.time||'-')}</td><td>${esc(a.client||'-')}</td><td>${esc(a.contact||'-')}</td><td>${esc(a.address||'-')}</td><td>${esc(a.description||'-')}</td>${isGestor()?`<td>${esc(sellerName(a.ownerUser))}</td>`:''}<td><button class="btn ghost" data-agenda-edit="${a.id}">Editar</button> <button class="btn danger" data-agenda-del="${a.id}">Excluir</button></td></tr>`).join('')||`<tr><td colspan="${isGestor()?8:7}">Nenhum compromisso.</td></tr>`;document.querySelectorAll('[data-agenda-edit]').forEach(b=>b.onclick=()=>openAgenda(db.agenda.find(x=>x.id===b.dataset.agendaEdit)));document.querySelectorAll('[data-agenda-del]').forEach(b=>b.onclick=()=>{if(!confirm('Excluir compromisso?'))return;db.agenda=db.agenda.filter(x=>x.id!==b.dataset.agendaDel);queueSave();renderAgenda()})}
function openAgenda(a=null){const owner=a?.ownerUser||currentUsername();openModal(`<h2>${a?'Editar':'Novo'} compromisso</h2><div class="grid two"><label class="field">Cliente<input id="agClient" value="${esc(a?.client||'')}"></label><label class="field">Contato<input id="agContact" value="${esc(a?.contact||'')}"></label><label class="field" style="grid-column:1/-1">Endereço<input id="agAddress" value="${esc(a?.address||'')}"></label><label class="field" style="grid-column:1/-1">Descrição<textarea id="agDescription" rows="2">${esc(a?.description||'')}</textarea></label><label class="field">Data<input id="agDate" type="date" value="${a?.date||today()}"></label><label class="field">Horário<input id="agTime" type="time" value="${a?.time||''}"></label>${isGestor()?`<label class="field">Usuário<select id="agOwner">${allUsers().map(u=>`<option value="${esc(u.username)}" ${norm(u.username)===norm(owner)?'selected':''}>${esc(u.name||u.username)}</option>`).join('')}</select></label>`:''}</div><button id="agSave" class="btn primary">Salvar</button>`);$('agSave').onclick=()=>{const obj={...(a||{}),id:a?.id||uid(),client:$('agClient').value.trim(),contact:$('agContact').value.trim(),address:$('agAddress').value.trim(),description:$('agDescription').value.trim(),date:$('agDate').value,time:$('agTime').value,ownerUser:isGestor()?$('agOwner').value:currentUsername()};if(!obj.client||!obj.date||!obj.time)return alert('Informe cliente, data e horário.');const i=db.agenda.findIndex(x=>x.id===obj.id);if(i>=0)db.agenda[i]=obj;else db.agenda.push(obj);queueSave();closeModal();renderAgenda()}}
function purchaseMaterialsForOrder(o){
  const out=[];
  for(const b of (o?.blinds||[])) out.push({name:`PERSIANA${b.model?' • '+b.model:''}`,color:[b.color,b.bando?`Bandô: ${b.bando}`:'',b.commandSide?`Comando: ${b.commandSide}`:''].filter(Boolean).join(' • '),qty:Math.max(1,Number(b.qty||1)),unit:'UN',isBlind:true,category:'PERSIANA'});
  for(const e of (o?.environments||[])){
    const fix=String(e.fixation||'').toUpperCase();
    if(fix.includes('MOTORIZADO')) out.push({name:'TRILHO MOTORIZADO',color:e.fixColor||e.color||'',qty:1,unit:'UN',category:'ACESSÓRIO'});
    else if(fix.includes('COMANDO')) out.push({name:'TRILHO COM COMANDO',color:e.fixColor||e.color||'',qty:1,unit:'UN',category:'ACESSÓRIO'});
  }
  return out;
}
function orderNeedsPurchase(o){return purchaseMaterialsForOrder(o).length>0}
function createPurchaseAlertForOrder(o){db.purchaseAlerts=db.purchaseAlerts||[];if(orderNeedsPurchase(o)&&!db.purchaseAlerts.some(a=>Number(a.orderNumber)===Number(o.numero)))db.purchaseAlerts.push({id:uid(),orderNumber:o.numero,createdAt:new Date().toISOString(),resolved:false})}
function syncPurchaseAlerts(){db.purchaseAlerts=db.purchaseAlerts||[];db.purchaseOrders=db.purchaseOrders||[];for(const o of db.orders||[]){let a=db.purchaseAlerts.find(x=>Number(x.orderNumber)===Number(o.numero));if(!orderNeedsPurchase(o)){if(a&&!a.resolved){a.resolved=true;a.autoResolvedNoExternalMaterial=true}continue}const hasPO=db.purchaseOrders.some(po=>Number(po.sourceOrderNumber)===Number(o.numero));if(hasPO){if(a)a.resolved=true;continue}if(a?.ignored){a.resolved=true;continue}if(!a){db.purchaseAlerts.push({id:uid(),orderNumber:o.numero,createdAt:new Date().toISOString(),resolved:false,autoRecovered:true})}else if(!a.purchaseOrderId)a.resolved=false}}
function renderPurchaseAlerts(){const box=$('purchaseAlerts');if(!box)return;if(!isGestor()){box.innerHTML='';return}syncPurchaseAlerts();db.purchaseAlerts=db.purchaseAlerts||[];const pending=db.purchaseAlerts.filter(a=>!a.resolved).map(a=>({...a,order:db.orders.find(o=>Number(o.numero)===Number(a.orderNumber))})).filter(a=>a.order);box.innerHTML=pending.map(a=>`<div class="notice" style="margin:0 0 12px;text-align:left"><strong>VOCÊ TEM MATERIAIS PARA SOLICITAR!</strong><br>Pedido ${String(a.order.numero).padStart(6,'0')} • ${esc(a.order.client)} • Instalação: <strong>${fmtDate(a.order.deliveryDate)}</strong><br><button class="btn primary" style="margin-top:8px" data-purchase-alert="${a.id}">ABRIR</button></div>`).join('');document.querySelectorAll('[data-purchase-alert]').forEach(b=>b.onclick=()=>{const a=db.purchaseAlerts.find(x=>x.id===b.dataset.purchaseAlert),o=db.orders.find(x=>Number(x.numero)===Number(a?.orderNumber));if(o)openPurchase(null,'',o,a)})}

function bind(){
  const onClick=(id,fn)=>{const el=$(id);if(el)el.onclick=fn};
  const on=(id,event,fn)=>{const el=$(id);if(el)el.addEventListener(event,fn)};

  document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
    const model=$('eModel');
    if(model)model.value=b.dataset.model;
    updateModelFields();
  });

  ['eName','eWidth','eHeight','eLeaves','eFinish','eFinishColor','eFinishPleat','eFinishGather','eLining','eLiningColor','eLiningPleat','eLiningGather','eFixation','eFixColor','eRailProduct','eSupportMaterial','eCustomPleat']
    .forEach(id=>on(id,'input',updatePreview));

  on('eFinish','change',()=>{refreshFinishColors();updatePreview()});
  on('eLining','change',()=>{refreshLiningColors();updatePreview()});
  on('eFinishPleat','change',()=>{applyPleatGatherRules();updatePreview()});
  on('eLiningPleat','change',()=>{applyPleatGatherRules();updatePreview()});
  on('eFixation','change',()=>{refreshFixColors();updatePreview()});on('eRailProduct','change',()=>{const p=officialProductById($('eRailProduct').value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview()});

  onClick('toggleEnvFixBtn',()=>{
    quoteExcludeFixation=!quoteExcludeFixation;
    applyEnvironmentFixationUI();
    updatePreview();
  });

  onClick('addEnvBtn',()=>{
    const e=envFromForm();
    if(!e.name||!e.width||!e.height)return alert('Preencha ambiente, largura e altura.');
    if(!e.excludeFixation&&e.fixation==='TRILHO SUÍÇO'&&!e.railProductId)return alert('Selecione o Tipo de Trilho no estoque oficial.');
    if(quoteEditingEnvironmentId){
      const i=(draft.environments||[]).findIndex(x=>String(x.id)===String(quoteEditingEnvironmentId));
      if(i<0)return alert('Ambiente não encontrado para edição.');
      e.id=quoteEditingEnvironmentId;
      draft.environments[i]=e;
    }else draft.environments.push(e);
    renderQuote();
    clearEnv();
  });

  ['qClient','qDate','qDocument','qStreet','qNumber','qComplement','qNeighborhood','qCep','qContact','qSeller'].forEach(id=>on(id,'input',syncDraft));['qDocument','qNumber','qCep','qContact'].forEach(id=>on(id,'input',()=>{const el=$(id);if(el)el.value=el.value.replace(/\D/g,'')}));on('qClient','change',()=>{const c=(db.clients||[]).find(x=>norm(x.name)===norm($('qClient').value));if(!c)return;$('qDocument').value=c.document||'';$('qContact').value=c.contact||'';$('qStreet').value=c.street||'';$('qNumber').value=c.number||'';$('qComplement').value=c.complement||'';$('qNeighborhood').value=c.neighborhood||'';$('qCep').value=c.cep||'';syncDraft()});
  on('qTravel','input',()=>{syncDraft();renderQuote()});
  ['qDiscount','qDiscountReason'].forEach(id=>on(id,'input',()=>{syncDraft();renderQuote()}));

  onClick('addLooseBtn',openLooseProduct);
  onClick('addSpecialBtn',openSpecialProduct);
  onClick('addBlindBtn',openBlind);
  onClick('saveQuoteBtn',()=>saveQuote(false));
  onClick('savePrintBtn',()=>saveQuote(true));
  onClick('resetQuoteBtn',resetQuote);

  on('quoteSearch','input',renderQuotes);
  on('clientSearch','input',renderClients);
  on('wholesaleClientSearch','input',renderWholesaleClients);
  on('wsClient','change',()=>{wholesaleDraft.clientId=$('wsClient').value;const c=(db.wholesaleClients||[]).find(x=>x.id===wholesaleDraft.clientId);wholesaleDraft.termDays=wholesaleDefaultTermForClient(c);wholesaleDraft.dueDate='';syncWholesaleDueDate(true);if($('wsMarkup'))$('wsMarkup').value=wholesaleDefaultMarkupForClient(c);updateWholesaleProductPreview(false);renderWholesaleClientCreditPreview()});
  on('wsDate','change',()=>{wholesaleDraft.date=$('wsDate').value;syncWholesaleDueDate(false)});
  on('wsTerm','change',()=>syncWholesaleDueDate(false));
  on('wsDueDate','change',()=>{wholesaleDraft.dueDate=$('wsDueDate').value;if($('wsTerm'))$('wsTerm').value='custom'});
  on('wsProduct','change',()=>updateWholesaleProductPreview(true));
  on('wsMarkup','input',()=>updateWholesaleProductPreview(false));
  onClick('wsAddItem',addWholesaleItem);
  onClick('wsSave',saveWholesaleSale);
  on('wholesaleOrderSearch','input',renderWholesaleOrders);
  on('wholesaleOrderStatus','change',renderWholesaleOrders);
  onClick('wdSaveSettings',saveWholesaleSettings);
  onClick('wholesaleExportCsv',exportWholesaleCsv);
  onClick('wholesalePrintDashboard',()=>window.print());
  ['revFrom','revTo'].forEach(id=>on(id,'input',renderRevenues));
  on('productSearch','input',renderProducts);
  on('productCategoryFilter','change',renderProducts);
  on('productSupplierFilter','change',renderProducts);

  onClick('newClientBtn',()=>openClientModal());
  onClick('newWholesaleClientBtn',()=>openWholesaleClient());
  onClick('newAgendaBtn',()=>openAgenda());
  onClick('newProductBtn',openNewOfficialProduct);
  onClick('inventoryCountBtn',openPhysicalInventory);
  onClick('inventoryExportPdfBtn',exportInventoryStockPdf);
   onClick('combineProductsBtn',openCombineProducts);
   onClick('homeLogo',goHome);
   on('homeLogo','keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();goHome()}});
   onClick('calcMonthlyCloseBtn',renderMonthlyClose);
   on('monthlyCloseMonth','input',renderMonthlyClose);
   onClick('printMonthlyCloseBtn',printMonthlyClose);
  onClick('savePricesBtn',savePricing);
  onClick('newPayableBtn',()=>openPayable());
  onClick('newSupplierBtn',()=>openSupplier());
  onClick('newPurchaseBtn',()=>openPurchase());

  ['payFrom','payTo','payStatus'].forEach(id=>on(id,'input',renderPayables));
  onClick('clearPayFilters',()=>{
    if($('payFrom'))$('payFrom').value='';
    if($('payTo'))$('payTo').value='';
    if($('payStatus'))$('payStatus').value='';
    renderPayables();
  });
  onClick('printPayablesBtn',()=>{
    const rows=[...document.querySelectorAll('#payablesTable tr')]
      .map(tr=>'<tr>'+tr.innerHTML.replace(/<td><button[\s\S]*?<\/td>/,'')+'</tr>').join('');
    printWindow(`<h2>CONTAS A PAGAR</h2>${$('payableSummary')?.innerHTML||''}<table>${rows}</table>`);
  });

  onClick('newReworkBtn',openRework);
  onClick('newUserBtn',openUser);

  ['kpiFrom','kpiTo','kpiSeller'].forEach(id=>on(id,'input',renderKpis));
  onClick('clearKpiFilters',()=>{
    if($('kpiFrom'))$('kpiFrom').value='';
    if($('kpiTo'))$('kpiTo').value='';
    if($('kpiSeller'))$('kpiSeller').value='';
    renderKpis();
  });
  onClick('printKpisBtn',printKpis);
  onClick('saveCompanySettingsBtn',saveCompanySettings);
  onClick('backupFullBtn',()=>backupFile('full'));
  onClick('backupClientsBtn',()=>backupFile('clients'));
  onClick('backupOrdersBtn',()=>backupFile('orders'));
  onClick('backupFinanceBtn',()=>backupFile('finance'));
  onClick('backupStockBtn',()=>backupFile('stock'));

  onClick('newEmployeeBtn',()=>openEmployee());
  onClick('newProviderBtn',()=>openProvider());
  onClick('previewPayrollBtn',previewPayroll);
  onClick('closePayrollBtn',closePayroll);

  onClick('modalClose',closeModal);
  on('modal','click',e=>{if(e.target===$('modal'))closeModal()});

  onClick('clientLoginOpen',()=>{$('loginScreen').classList.add('hidden');$('clientLoginScreen').classList.remove('hidden');$('clientLoginError').textContent='';setTimeout(()=>$('clientOrderNumber')?.focus(),50)});onClick('clientLoginBack',()=>{$('clientLoginScreen').classList.add('hidden');$('loginScreen').classList.remove('hidden');$('clientLoginError').textContent=''});onClick('clientLoginBtn',doClientLogin);on('clientOrderPassword','keydown',e=>{if(e.key==='Enter')doClientLogin()});onClick('clientPortalLogout',closeClientPortal);
  onClick('loginBtn',doLogin);
  on('loginPass','keydown',e=>{if(e.key==='Enter')doLogin()});
  onClick('logoutBtn',logout);
}
async function init(){
  bind();
  db.priceConfig=mergeConfig(db.priceConfig);
  const portalOrder=new URLSearchParams(location.search).get('cliente');
  if(portalOrder){
    $('loginScreen')?.classList.add('hidden');
    $('clientLoginScreen')?.classList.remove('hidden');
    if($('clientOrderNumber'))$('clientOrderNumber').value=String(portalOrder).replace(/\D/g,'').slice(0,6);
    setTimeout(()=>$('clientOrderPassword')?.focus(),50);
    return;
  }
  if(await restore())return;
  const loginScreen=$('loginScreen');
  if(loginScreen)loginScreen.classList.add('hidden');
  $('publicHome')?.classList.remove('hidden');
  loadPublicHome();
}
init();


/* === V11.3.9: perfis, isolamento, agenda pessoal, instaladores e fechamento === */
function isPartner(){return norm(currentUser?.role)==='partner'}
function isInstaller(){return norm(currentUser?.role)==='installer'}
function isSalesLike(){return ['sales','partner'].includes(norm(currentUser?.role))}
function canManageProduction(){return isGestor()||isProduction()}
function hasPermission(area){
 if(area==='help')return true;if(isGestor())return true;
 const role=norm(currentUser?.role),u=userPermissionRecord(currentUsername());
 if(role==='installer')return area==='install';
 if(Array.isArray(u.permissions)&&u.permissions.length)return u.permissions.includes('*')||u.permissions.includes(area);
 if(role==='production')return ['orders','production','install'].includes(area);
 if(['sales','partner'].includes(role))return ['quote','quotes','clients','orders','install','agenda'].includes(area);
 return false;
}
function canSeeQuote(q){return isGestor()||isProduction()||resolveSellerUser(q)===currentUsername()}
function canSeeOrder(o){if(isGestor()||isProduction())return true;if(isInstaller())return norm(o.installation?.responsibleUser)===currentUsername();return resolveSellerUser(o)===currentUsername()}
function upsertClientFromQuote(q){const key=norm(q.client),owner=norm(q.ownerUser||q.sellerUser||currentUsername());let c=db.clients.find(x=>norm(x.name)===key&&norm(x.ownerUser||x.sellerUser||'')===owner);const data={address:q.address,document:q.document||'',contact:q.contact||'',street:q.street||'',number:q.number||'',complement:q.complement||'',neighborhood:q.neighborhood||'',cep:q.cep||'',addressStructured:!!(q.street||q.number||q.neighborhood||q.cep||q.complement),lastSeller:q.seller,ownerUser:owner,updatedAt:new Date().toISOString()};if(c)Object.assign(c,data);else db.clients.unshift({id:uid(),name:q.client,...data,createdAt:new Date().toISOString()})}
function renderClients(){const tb=$('clientsTable');if(!tb)return;const sr=norm($('clientSearch')?.value);const visible=db.clients.filter(c=>isGestor()||isProduction()||norm(c.ownerUser||c.sellerUser||c.lastSeller)===currentUsername());tb.innerHTML='';for(const c of visible.filter(c=>!sr||norm(`${c.name} ${c.contact} ${c.document||''} ${clientAddressText(c)}`).includes(sr))){const os=db.orders.filter(o=>norm(o.client)===norm(c.name)&&canSeeOrder(o)),bal=os.reduce((a,o)=>a+orderBalance(o),0);const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(c.name)}</td><td>${esc(c.contact||'-')}</td><td>${esc(clientAddressText(c)||'-')}</td><td>${esc(c.lastSeller||'-')}</td><td>${money(bal)}</td><td><button class="btn primary" data-client-history="${c.id}">Abrir ficha</button> <button class="btn ghost" data-client-att="${c.id}">Anexos</button> <button class="btn ghost" data-client-edit="${c.id}">Editar</button>${isGestor()?` <button class="btn danger" data-client-del="${c.id}">Excluir</button>`:''}</td>`;tb.appendChild(tr)}document.querySelectorAll('[data-client-history]').forEach(b=>b.onclick=()=>openClientHistory(db.clients.find(c=>c.id===b.dataset.clientHistory)));document.querySelectorAll('[data-client-att]').forEach(b=>b.onclick=()=>{const c=db.clients.find(x=>x.id===b.dataset.clientAtt);if(c)openAttachments('CLIENT',c.id,c.name)});document.querySelectorAll('[data-client-edit]').forEach(b=>b.onclick=()=>openClientModal(db.clients.find(c=>c.id===b.dataset.clientEdit)));document.querySelectorAll('[data-client-del]').forEach(b=>b.onclick=()=>{if(confirm('Excluir este cliente?')){db.clients=db.clients.filter(c=>c.id!==b.dataset.clientDel);queueSave();renderClients()}})}
function agendaVisibleItems(){db.agenda=db.agenda||[];return db.agenda.filter(a=>norm(a.ownerUser)===currentUsername()).sort((a,b)=>String(a.date+' '+a.time).localeCompare(String(b.date+' '+b.time)))}
function agendaDayLabel(d,idx){return idx===0?'HOJE':idx===1?'AMANHÃ':new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'}).toUpperCase()}
function renderAgenda(){const root=$('agendaDays');if(!root)return;const all=agendaVisibleItems(),base=new Date();base.setHours(12,0,0,0);let html='';for(let i=0;i<3;i++){const d=new Date(base);d.setDate(base.getDate()+i);const key=d.toISOString().slice(0,10),items=all.filter(a=>a.date===key);html+=`<section class="card" style="margin-bottom:14px"><div class="card-title">${agendaDayLabel(key,i)} • ${fmtDate(key)}</div><div class="table-wrap"><table class="table"><thead><tr><th>Horário</th><th>Cliente</th><th>Contato</th><th>Endereço</th><th>Descrição</th><th>Ações</th></tr></thead><tbody>${items.map(a=>`<tr><td>${esc(a.time||'-')}</td><td>${esc(a.client||'-')}</td><td>${esc(a.contact||'-')}</td><td>${esc(a.address||'-')}</td><td>${esc(a.description||'-')}</td><td><button class="btn ghost" data-agenda-edit="${a.id}">Editar</button> <button class="btn danger" data-agenda-del="${a.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum compromisso.</td></tr>'}</tbody></table></div></section>`}root.innerHTML=html;bindAgendaActions()}
function bindAgendaActions(){document.querySelectorAll('[data-agenda-edit]').forEach(b=>b.onclick=()=>openAgenda(db.agenda.find(x=>x.id===b.dataset.agendaEdit)));document.querySelectorAll('[data-agenda-del]').forEach(b=>b.onclick=()=>{const a=db.agenda.find(x=>x.id===b.dataset.agendaDel);if(!a||norm(a.ownerUser)!==currentUsername())return;if(!confirm('Excluir compromisso?'))return;db.agenda=db.agenda.filter(x=>x.id!==b.dataset.agendaDel);queueSave();renderAgenda()})}
function openAgenda(a=null){if(a&&norm(a.ownerUser)!==currentUsername())return alert('Este compromisso pertence a outro usuário.');openModal(`<h2>${a?'Editar':'Novo'} compromisso</h2><div class="grid two"><label class="field">Cliente<input id="agClient" value="${esc(a?.client||'')}"></label><label class="field">Contato<input id="agContact" value="${esc(a?.contact||'')}"></label><label class="field" style="grid-column:1/-1">Endereço<input id="agAddress" value="${esc(a?.address||'')}"></label><label class="field" style="grid-column:1/-1">Descrição<textarea id="agDescription" rows="2">${esc(a?.description||'')}</textarea></label><label class="field">Data<input id="agDate" type="date" value="${a?.date||today()}"></label><label class="field">Horário<input id="agTime" type="time" value="${a?.time||''}"></label></div><button id="agSave" class="btn primary">Salvar</button>`);$('agSave').onclick=()=>{const obj={...(a||{}),id:a?.id||uid(),client:$('agClient').value.trim(),contact:$('agContact').value.trim(),address:$('agAddress').value.trim(),description:$('agDescription').value.trim(),date:$('agDate').value,time:$('agTime').value,ownerUser:currentUsername()};if(!obj.client||!obj.date||!obj.time)return alert('Informe cliente, data e horário.');const i=db.agenda.findIndex(x=>x.id===obj.id);if(i>=0)db.agenda[i]=obj;else db.agenda.push(obj);queueSave();closeModal();renderAgenda()}}
function openPastAgenda(){const items=agendaVisibleItems().filter(a=>a.date<today()).sort((a,b)=>String(b.date+' '+b.time).localeCompare(String(a.date+' '+a.time)));openModal(`<h2>Eventos anteriores</h2><div class="table-wrap" style="max-height:65vh"><table class="table"><thead><tr><th>Data</th><th>Hora</th><th>Cliente</th><th>Descrição</th></tr></thead><tbody>${items.map(a=>`<tr><td>${fmtDate(a.date)}</td><td>${esc(a.time)}</td><td>${esc(a.client)}</td><td>${esc(a.description||'-')}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum evento anterior.</td></tr>'}</tbody></table></div>`)}
function installerProviders(){return hrData().providers.filter(p=>p.active!==false&&norm(p.service)==='INSTALADOR')}
function renderInstall(){const tb=$('installTable');if(!tb)return;const list=db.orders.filter(o=>isGestor()||isProduction()?true:isInstaller()?norm(o.installation?.responsibleUser)===currentUsername():canSeeOrder(o)).slice().sort((a,b)=>String(a.installation?.scheduledDate||a.deliveryDate).localeCompare(String(b.installation?.scheduledDate||b.deliveryDate)));tb.innerHTML='';for(const o of list){const ready=o.productionStage==='EXPEDIÇÃO',done=!!o.installation?.completedDate,i=o.installation||{},tr=document.createElement('tr');tr.innerHTML=`<td>${fmtDate(i.scheduledDate||o.deliveryDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(o.productionStage)}</td><td><span class="badge ${done?'ok':ready?'blue':'warn'}">${done?'INSTALADO':ready?'PRONTO PARA INSTALAÇÃO':'EM PRODUÇÃO'}</span></td><td>${esc(i.responsible||'-')} ${!isInstaller()?`<button class="btn ghost" data-install="${o.numero}">Agendar / Atualizar</button>`:''}</td>${isGestor()?`<td>${money(i.serviceValue||0)} <button class="btn secondary" data-install-value="${o.numero}">INSERIR VALOR DO SERVIÇO</button></td>`:''}`;tb.appendChild(tr)}document.querySelectorAll('[data-install]').forEach(b=>b.onclick=()=>openInstall(Number(b.dataset.install)));document.querySelectorAll('[data-install-value]').forEach(b=>b.onclick=()=>openInstallValue(Number(b.dataset.installValue)))}
function openInstall(n){const o=db.orders.find(x=>Number(x.numero)===n);if(!o||isInstaller())return;const i=o.installation||{},opts=installerProviders().map(p=>`<option value="${p.id}" ${p.id===i.responsibleId?'selected':''}>${esc(p.name)}</option>`).join('');openModal(`<h2>Instalação • Pedido ${String(n).padStart(6,'0')}</h2><div class="grid two"><label class="field">Data prometida<input type="date" value="${o.deliveryDate||''}" disabled></label><label class="field">Data agendada<input id="instSched" type="date" value="${i.scheduledDate||''}"></label><label class="field">Equipe / responsável<select id="instResp"><option value="">SEM RESPONSÁVEL</option>${opts}</select></label><label class="field">Data realmente instalada<input id="instDate" type="date" value="${i.completedDate||''}"></label><label class="field" style="grid-column:1/-1">Observações<textarea id="instNotes">${esc(i.notes||'')}</textarea></label></div><button id="instSave" class="btn primary">Salvar instalação</button>`);$('instSave').onclick=()=>{const p=installerProviders().find(x=>x.id===$('instResp').value);o.installation={...(o.installation||{}),responsibleId:p?.id||'',responsible:p?.name||'',responsibleUser:norm(p?.username||''),scheduledDate:$('instSched').value,completedDate:$('instDate').value,notes:$('instNotes').value.trim()};addOrderEvent(o,o.installation.completedDate?'INSTALAÇÃO CONCLUÍDA':'INSTALAÇÃO ATUALIZADA',`Agendada ${fmtDate(o.installation.scheduledDate)} • Responsável ${o.installation.responsible||'-'}`);queueSave();closeModal();renderInstall();renderOrders();renderKpis()}}
function openInstallValue(n){if(!isGestor())return;const o=db.orders.find(x=>Number(x.numero)===n);if(!o)return;o.installation=o.installation||{};openModal(`<h2>Valor do serviço • Pedido ${String(n).padStart(6,'0')}</h2><p><strong>Instalador:</strong> ${esc(o.installation.responsible||'Não definido')}</p><label class="field">Valor devido ao instalador (R$)<input id="instServiceValue" type="number" min="0" step="0.01" value="${Number(o.installation.serviceValue||0)}"></label><button id="instValueSave" class="btn primary">Salvar</button>`);$('instValueSave').onclick=()=>{o.installation.serviceValue=Number($('instServiceValue').value||0);o.installation.serviceValueBy=currentUsername();o.installation.serviceValueAt=new Date().toISOString();queueSave();closeModal();renderInstall()}}
function openInstallationClosing(){if(!isGestor())return;const prov=installerProviders();openModal(`<h2>Fechamento de Instalações</h2><div class="grid three"><label class="field">Instalador<select id="ficInstaller"><option value="">TODOS</option>${prov.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label class="field">De<input id="ficFrom" type="date"></label><label class="field">Até<input id="ficTo" type="date"></label></div><div id="ficRows" style="margin-top:12px"></div><div id="ficActions" style="margin-top:12px"></div>`);const draw=()=>{const pid=$('ficInstaller').value,f=$('ficFrom').value,t=$('ficTo').value;const rows=db.orders.filter(o=>{const i=o.installation||{},d=i.completedDate||i.scheduledDate||'';return i.responsibleId&&(!pid||i.responsibleId===pid)&&(!f||d>=f)&&(!t||d<=t)});$('ficRows').innerHTML=`<div class="table-wrap"><table class="table"><thead><tr><th></th><th>Data</th><th>Pedido</th><th>Cliente</th><th>Instalador</th><th>Valor devido</th><th>Status</th></tr></thead><tbody>${rows.map(o=>{const i=o.installation||{};return `<tr><td><input type="checkbox" data-fic="${o.numero}" ${i.closingId?'disabled':''}></td><td>${fmtDate(i.completedDate||i.scheduledDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(i.responsible)}</td><td>${money(i.serviceValue||0)}</td><td>${i.closingId?'FECHADO':'PENDENTE'}</td></tr>`}).join('')||'<tr><td colspan="7">Nenhuma instalação.</td></tr>'}</tbody></table></div>`;document.querySelectorAll('[data-fic]').forEach(x=>x.onchange=actions);actions()};const selected=()=>[...document.querySelectorAll('[data-fic]:checked')].map(x=>Number(x.dataset.fic));const actions=()=>{const n=selected().length;$('ficActions').innerHTML=n?`${n>1?'<button id="ficDaily" class="btn secondary">VALOR DE DIÁRIA</button> ':''}<button id="ficClose" class="btn primary">FECHAR SELECIONADOS</button>`:'';if($('ficDaily'))$('ficDaily').onclick=()=>{const v=prompt('Valor acordado da diária (R$):','0,00');if(v===null)return;const num=Number(String(v).replace('.','').replace(',','.'));if(!Number.isFinite(num)||num<0)return alert('Valor inválido.');finish(num)};if($('ficClose'))$('ficClose').onclick=()=>finish(null)};const finish=(daily)=>{const nums=selected(),orders=nums.map(n=>db.orders.find(o=>Number(o.numero)===n)).filter(Boolean);if(!orders.length)return;const installers=new Set(orders.map(o=>o.installation?.responsibleId));if(installers.size>1)return alert('Selecione instalações do mesmo instalador para um fechamento.');const total=daily===null?orders.reduce((a,o)=>a+Number(o.installation?.serviceValue||0),0):daily,id='FI-'+String(Date.now()).slice(-8);db.settings.installationClosings=db.settings.installationClosings||[];db.settings.installationClosings.unshift({id,installerId:orders[0].installation.responsibleId,installer:orders[0].installation.responsible,orderNumbers:nums,mode:daily===null?'SERVIÇO':'DIÁRIA',total,createdAt:new Date().toISOString(),by:currentUsername(),paid:false});orders.forEach(o=>{o.installation.closingId=id;o.installation.closingMode=daily===null?'SERVIÇO':'DIÁRIA'});queueSave();closeModal();renderInstall();alert(`Fechamento ${id} criado: ${money(total)}`)};['ficInstaller','ficFrom','ficTo'].forEach(id=>$(id).oninput=draw);draw()}
function openInstallerStatement(){if(!isInstaller())return;const mine=db.orders.filter(o=>norm(o.installation?.responsibleUser)===currentUsername()),closings=db.settings?.installationClosings||[];openModal(`<h2>Meus serviços de instalação</h2><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Situação</th></tr></thead><tbody>${mine.map(o=>{const i=o.installation||{},c=closings.find(x=>x.id===i.closingId);return `<tr><td>${fmtDate(i.completedDate||i.scheduledDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${money(i.serviceValue||0)}</td><td>${c?(c.paid?'PAGO':'FECHADO'):'A RECEBER'}</td></tr>`}).join('')||'<tr><td colspan="5">Nenhum serviço.</td></tr>'}</tbody></table></div>`)}
function renderProduction(){const box=$('productionList');if(!box)return;box.innerHTML='';for(const o of db.orders.filter(o=>isGestor()||isProduction()?true:canSeeOrder(o))){const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="card-title">Pedido ${String(o.numero).padStart(6,'0')} • ${esc(o.client)}</div><div class="stage-row">${STAGES.map(st=>canManageProduction()?`<button class="stage ${o.productionStage===st?'active':''}" data-stage-order="${o.numero}" data-stage="${st}">${st}</button>`:`<span class="stage ${o.productionStage===st?'active':''}">${st}</span>`).join('')}</div><p class="muted">Entrega: ${fmtDate(o.deliveryDate)} • ${o.environments?.length||0} ambiente(s).</p>${canManageProduction()?`<button class="btn secondary" data-production-open="${o.numero}">Abrir / Ver OP</button>`:''}`;box.appendChild(c)}document.querySelectorAll('[data-production-open]').forEach(b=>b.onclick=()=>printProductionOrder(db.orders.find(x=>Number(x.numero)===Number(b.dataset.productionOpen))));document.querySelectorAll('[data-stage-order]').forEach(b=>b.onclick=()=>{if(!canManageProduction())return;const o=db.orders.find(x=>Number(x.numero)===Number(b.dataset.stageOrder));if(!o)return;o.productionStage=b.dataset.stage;o.productionHistory=o.productionHistory||[];o.productionHistory.push({stage:b.dataset.stage,at:new Date().toISOString(),by:currentUsername()});addOrderEvent(o,'ETAPA DE PRODUÇÃO',b.dataset.stage);queueSave();renderProduction();renderOrders();renderInstall()})}
// clicks introduced in 11.3.9
document.addEventListener('click',e=>{if(e.target?.id==='pastAgendaBtn')openPastAgenda();if(e.target?.id==='installationClosingBtn')openInstallationClosing();if(e.target?.id==='installerStatementBtn')openInstallerStatement()});

function partnerCommissionForDiscount(username,discount){const u=allUsers().find(x=>norm(x.username)===norm(username));if(norm(u?.role)!=='partner')return sellerCommission(username);const d=Number(discount||0);return d>5?0:Math.max(0,Number(u?.commission??6)-d)}
function openUser(){openModal(`<h2>Novo usuário</h2><div class="grid two"><label class="field">Usuário<input id="uUser"></label><label class="field">Nome completo<input id="uName"></label><label class="field">Senha<input id="uPass" type="password"></label><label class="field">Perfil<select id="uRole"><option value="sales">VENDAS</option><option value="partner">PARCEIRO (ARQUITETO / DESIGNER)</option><option value="production">PRODUÇÃO</option><option value="installer">INSTALADOR</option><option value="gestor">GESTOR</option></select></label><label class="field">Comissão padrão (%)<input id="uComm" type="number" step="0.01" value="6"></label><label class="field">Desconto máximo (%)<input id="uMaxDisc" type="number" min="0" max="100" step="0.01" value="5"></label><label class="field">DEFINIR ACRÉSCIMO (%)<select id="uMarkup">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1===5?'selected':''}>${i+1}%</option>`).join('')}</select></label></div><h3>Áreas que poderá acessar</h3>${permissionChecklist(['quote','quotes','clients','orders','install','agenda'])}<button id="uSave" class="btn primary" style="margin-top:12px">Criar usuário</button>`);$('uRole').onchange=()=>{const role=$('uRole').value,def=role==='gestor'?permissionKeys():role==='production'?['orders','production','install']:role==='installer'?['install']:['quote','quotes','clients','orders','install','agenda'];document.querySelectorAll('[data-perm]').forEach(x=>x.checked=def.includes(x.dataset.perm));if(role==='partner'){$('uComm').value=6}$('uMaxDisc').disabled=!['sales','partner'].includes(role);$('uMarkup').disabled=!['sales','partner'].includes(role)};$('uSave').onclick=async()=>{const username=norm($('uUser').value),name=$('uName').value.trim(),pass=$('uPass').value,role=$('uRole').value;if(username.length<3||pass.length<6)return alert('Usuário deve ter 3+ caracteres e senha 6+ caracteres.');if(allUsers().some(x=>norm(x.username)===username))return alert('Usuário já existe.');db.users.push({username,name,role,commission:Number($('uComm').value||0),maxDiscount:['sales','partner'].includes(role)?Number($('uMaxDisc').value||0):0,markupPercent:['sales','partner'].includes(role)?Math.max(1,Math.min(10,Number($('uMarkup').value||1))):0,hash:await sha256(pass),builtIn:false,createdBy:currentUsername(),createdAt:new Date().toISOString(),permissions:collectPermissions()});await saveCloud();closeModal();renderUsers();alert('Usuário criado e liberado para login.')}}
function openUserProfile(username){if(!isGestor())return;const key=norm(username),custom=(db.users||[]).find(x=>norm(x.username)===key),u=userPermissionRecord(username);openModal(`<h2>Editar usuário • ${esc(username)}</h2><div class="grid two"><label class="field">Nome completo<input id="ueName" value="${esc(u.name||'')}"></label><label class="field">Perfil<select id="ueRole"><option value="sales">VENDAS</option><option value="partner">PARCEIRO</option><option value="production">PRODUÇÃO</option><option value="installer">INSTALADOR</option><option value="gestor">GESTOR</option></select></label><label class="field">Comissão padrão (%)<input id="ueComm" type="number" step="0.01" value="${Number(u.commission||0)}"></label><label class="field">Desconto máximo (%)<input id="ueMaxDisc" type="number" min="0" max="100" step="0.01" value="${Number(u.maxDiscount??5)}"></label><label class="field">DEFINIR ACRÉSCIMO (%)<select id="ueMarkup">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${Number(u.markupPercent??5)===i+1?'selected':''}>${i+1}%</option>`).join('')}</select></label></div><button id="ueSave" class="btn primary">Salvar</button>`);$('ueRole').value=u.role||'sales';const syncPartnerEdit=()=>{const role=norm($('ueRole').value);$('ueMaxDisc').disabled=!['SALES','PARTNER'].includes(role);$('ueMarkup').disabled=!['SALES','PARTNER'].includes(role)};$('ueRole').onchange=syncPartnerEdit;syncPartnerEdit();$('ueSave').onclick=async()=>{const role=$('ueRole').value;const data={name:$('ueName').value.trim()||u.name,role,commission:Number($('ueComm').value||0),maxDiscount:['SALES','PARTNER'].includes(norm(role))?Number($('ueMaxDisc').value||0):0,markupPercent:['SALES','PARTNER'].includes(norm(role))?Math.max(1,Math.min(10,Number($('ueMarkup').value||1))):0};if(custom)Object.assign(custom,data);else{db.settings=db.settings||{};db.settings.builtInUserProfiles=db.settings.builtInUserProfiles||{};db.settings.builtInUserProfiles[key]=data}await saveCloud();closeModal();renderUsers();refreshSellerControl(draft.sellerUser)}}
function openProvider(e=null){openModal(`<h2>${e?'Editar':'Novo'} prestador de serviços</h2><div class="grid two"><label class="field">Tipo<select id="pvService"><option>COSTUREIRA</option><option ${norm(e?.service)==='INSTALADOR'?'selected':''}>INSTALADOR</option></select></label><label class="field">Nome completo<input id="pvName" value="${esc(e?.name||'')}"></label><label class="field">Telefone<input id="pvPhone" inputmode="numeric" value="${esc(e?.phone||'')}"></label><label class="field">Número do documento<input id="pvDoc" value="${esc(e?.document||'')}"></label><label class="field">Prazo de recebimento (informativo)<input id="pvReceipt" value="${esc(e?.receiptTerm||'')}"></label><label class="field">Usuário vinculado<select id="pvUser"><option value="">SEM LOGIN</option>${allUsers().filter(u=>norm(u.role)==='installer').map(u=>`<option value="${u.username}" ${norm(e?.username)===norm(u.username)?'selected':''}>${esc(u.name||u.username)}</option>`).join('')}</select></label><label class="field">Status<select id="pvActive"><option value="1">ATIVO</option><option value="0" ${e?.active===false?'selected':''}>INATIVO</option></select></label></div><button id="pvSave" class="btn primary">Salvar</button>`);$('pvSave').onclick=()=>{const h=hrData(),obj={...(e||{}),id:e?.id||uid(),personType:'PF',name:$('pvName').value.trim(),phone:$('pvPhone').value.replace(/\D/g,''),document:$('pvDoc').value.trim(),service:$('pvService').value,receiptTerm:$('pvReceipt').value.trim(),username:norm($('pvUser').value),value:0,periodicity:'POR SERVIÇO',active:$('pvActive').value==='1',updatedAt:new Date().toISOString()};if(!obj.name)return alert('Informe o prestador.');const i=h.providers.findIndex(x=>x.id===obj.id);if(i>=0)h.providers[i]=obj;else h.providers.unshift(obj);queueSave();closeModal();renderHR()}}
function refreshSellerControl(preferred=''){ensureSellerControl();const el=$('qSeller');if(!el)return;const active=allUsers().filter(u=>['SALES','PARTNER','GESTOR'].includes(norm(u.role)));el.innerHTML=active.map(u=>`<option value="${esc(u.username)}">${esc(u.name||u.username)}</option>`).join('');const wanted=norm(preferred||draft.sellerUser||currentUser?.username);if([...el.options].some(o=>norm(o.value)===wanted))el.value=wanted;else if(el.options.length)el.selectedIndex=0;el.disabled=!isGestor();el.onchange=()=>{draft.sellerUser=norm(el.value);draft.seller=sellerName(draft.sellerUser)}}
const _renderInstall1139=renderInstall;
renderInstall=function(){_renderInstall1139();if($('installationClosingBtn'))$('installationClosingBtn').style.display=isGestor()?'inline-flex':'none';if($('installerStatementBtn'))$('installerStatementBtn').style.display=isInstaller()?'inline-flex':'none'};

/* === V11.32: fechamento de instalações, navegação e alertas === */
function installationDueDate(iso){if(!iso)return '';const d=new Date(iso+'T12:00:00');if(d.getDate()<=15)d.setDate(15);else d.setMonth(d.getMonth()+1,0);return d.toISOString().slice(0,10)}
function closingStore(){db.settings=db.settings||{};db.settings.installationClosings=db.settings.installationClosings||[];return db.settings.installationClosings}
function installationClosingById(id){return closingStore().find(x=>x.id===id)}
function renderInstall(){const tb=$('installTable');if(!tb)return;const list=db.orders.filter(o=>isGestor()||isProduction()?true:isInstaller()?norm(o.installation?.responsibleUser)===currentUsername():canSeeOrder(o)).slice().sort((a,b)=>String(a.installation?.scheduledDate||a.deliveryDate).localeCompare(String(b.installation?.scheduledDate||b.deliveryDate)));tb.innerHTML='';for(const o of list){const ready=o.productionStage==='EXPEDIÇÃO',done=!!o.installation?.completedDate,i=o.installation||{},d=i.scheduledDate||o.deliveryDate||'',late=!done&&d&&d<today(),dueToday=!done&&d===today(),tr=document.createElement('tr');if(late)tr.style.background='#ffe3e3';else if(dueToday)tr.style.background='#fff9d9';tr.innerHTML=`<td>${fmtDate(d)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(o.productionStage)}</td><td><span class="badge ${done?'ok':late?'danger':ready?'blue':'warn'}">${done?'INSTALADO':late?'ATRASADA':ready?'PRONTO PARA INSTALAÇÃO':'EM PRODUÇÃO'}</span></td><td>${esc(i.responsible||'-')} ${!isInstaller()?`<button class="btn ghost" data-install="${o.numero}">Agendar / Atualizar</button>${i.scheduledDate?` <button class="btn danger" data-install-revert="${o.numero}">Reverter agendamento</button>`:''}`:''}</td>${isGestor()?`<td>${money(i.serviceValue||0)} <button class="btn secondary" data-install-value="${o.numero}">INSERIR VALOR DO SERVIÇO</button></td>`:''}`;tb.appendChild(tr)}document.querySelectorAll('[data-install]').forEach(b=>b.onclick=()=>openInstall(Number(b.dataset.install)));document.querySelectorAll('[data-install-value]').forEach(b=>b.onclick=()=>openInstallValue(Number(b.dataset.installValue)));document.querySelectorAll('[data-install-revert]').forEach(b=>b.onclick=()=>revertInstallSchedule(Number(b.dataset.installRevert)));if($('installationClosingBtn'))$('installationClosingBtn').style.display=isGestor()?'inline-flex':'none';if($('installerStatementBtn'))$('installerStatementBtn').style.display=isInstaller()?'inline-flex':'none'}
function revertInstallSchedule(n){if(!isGestor())return;const o=db.orders.find(x=>Number(x.numero)===n);if(!o?.installation?.scheduledDate)return;if(!confirm(`Reverter o agendamento do pedido ${String(n).padStart(6,'0')}?`))return;const old=clone(o.installation);o.installation={...(o.installation||{}),scheduledDate:'',responsibleId:'',responsible:'',responsibleUser:'',completedDate:''};o.installation.history=o.installation.history||[];o.installation.history.push({action:'AGENDAMENTO REVERTIDO',at:new Date().toISOString(),by:currentUsername(),previousDate:old.scheduledDate,previousResponsible:old.responsible});addOrderEvent(o,'AGENDAMENTO REVERTIDO',`Data anterior ${fmtDate(old.scheduledDate)} • ${old.responsible||'-'}`);queueSave();renderInstall()}
function openInstallationClosing(){if(!isGestor())return;openInternalView('installationClosing');const sel=$('ficInstallerPage');if(sel){const val=sel.value;sel.innerHTML='<option value="">TODOS</option>'+installerProviders().map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');sel.value=val;sel.onchange=renderInstallationClosingPage;$('ficFromPage').oninput=renderInstallationClosingPage;$('ficToPage').oninput=renderInstallationClosingPage}renderInstallationClosingPage()}
function eligibleInstallationOrders(){return db.orders.filter(o=>o.installation?.responsibleId&&(o.installation.completedDate||o.installation.scheduledDate))}
function renderInstallationClosingPage(){const root=$('installationClosingPage');if(!root)return;const pid=$('ficInstallerPage')?.value||'',f=$('ficFromPage')?.value||'',t=$('ficToPage')?.value||'';const rows=eligibleInstallationOrders().filter(o=>{const i=o.installation||{},d=i.completedDate||i.scheduledDate||'';return (!pid||i.responsibleId===pid)&&(!f||d>=f)&&(!t||d<=t)});root.innerHTML=`<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th><input id="ficAll" type="checkbox"></th><th>Data</th><th>Pedido</th><th>Cliente</th><th>Instalador</th><th>Valor devido</th><th>Situação</th></tr></thead><tbody>${rows.map(o=>{const i=o.installation||{},c=installationClosingById(i.closingId);return `<tr><td><input type="checkbox" data-fic-page="${o.numero}" ${c&&!c.reversed?'disabled':''}></td><td>${fmtDate(i.completedDate||i.scheduledDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(i.responsible)}</td><td>${money(i.serviceValue||0)}</td><td>${c&&!c.reversed?'FECHADO':'PENDENTE'}</td></tr>`}).join('')||'<tr><td colspan="7">Nenhuma instalação.</td></tr>'}</tbody></table></div><div id="ficPageActions" class="actions" style="margin-top:14px"></div></div><div class="card" style="margin-top:14px"><div class="card-title">Fechamentos realizados</div><div class="table-wrap"><table class="table"><thead><tr><th>Fechamento</th><th>Data</th><th>Instalador</th><th>Pedidos</th><th>Modalidade</th><th>Total</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead><tbody>${closingStore().map(c=>`<tr><td>${esc(c.id)}</td><td>${fmtDate((c.confirmedAt||c.createdAt||'').slice(0,10))}</td><td>${esc(c.installer)}</td><td>${(c.orderNumbers||[]).map(n=>String(n).padStart(6,'0')).join(', ')}</td><td>${esc(c.mode)}</td><td>${money(c.total)}</td><td>${fmtDate(c.dueDate)}</td><td>${c.reversed?'REVERTIDO':c.confirmed?'CONFIRMADO':'ABERTO'}</td><td><button class="btn ghost" data-fic-pdf="${c.id}">PDF</button>${!c.confirmed&&!c.reversed?` <button class="btn primary" data-fic-confirm="${c.id}">CONFIRMAR INSTALAÇÕES</button>`:''}${c.confirmed&&!c.reversed?` <button class="btn danger" data-fic-reverse="${c.id}">REVERTER</button>`:''}</td></tr>`).join('')||'<tr><td colspan="9">Nenhum fechamento.</td></tr>'}</tbody></table></div></div>`;bindClosingPage()}
function selectedClosingOrders(){return [...document.querySelectorAll('[data-fic-page]:checked')].map(x=>Number(x.dataset.ficPage))}
function bindClosingPage(){const all=$('ficAll');if(all)all.onchange=()=>{document.querySelectorAll('[data-fic-page]:not(:disabled)').forEach(x=>x.checked=all.checked);updateClosingActions()};document.querySelectorAll('[data-fic-page]').forEach(x=>x.onchange=updateClosingActions);document.querySelectorAll('[data-fic-pdf]').forEach(b=>b.onclick=()=>printInstallationClosing(installationClosingById(b.dataset.ficPdf)));document.querySelectorAll('[data-fic-confirm]').forEach(b=>b.onclick=()=>confirmInstallationClosing(b.dataset.ficConfirm));document.querySelectorAll('[data-fic-reverse]').forEach(b=>b.onclick=()=>reverseInstallationClosing(b.dataset.ficReverse));updateClosingActions()}
function updateClosingActions(){const box=$('ficPageActions');if(!box)return;const nums=selectedClosingOrders();box.innerHTML=nums.length?`${nums.length>1?'<button id="ficDailyPage" class="btn secondary">VALOR DE DIÁRIA</button> ':''}<button id="ficCreatePage" class="btn primary">CRIAR FECHAMENTO</button>`:'';if($('ficDailyPage'))$('ficDailyPage').onclick=()=>{const v=prompt('Valor acordado da diária (R$):','0,00');if(v===null)return;const num=Number(String(v).replace(/\./g,'').replace(',','.'));if(!Number.isFinite(num)||num<0)return alert('Valor inválido.');createInstallationClosing(num)};if($('ficCreatePage'))$('ficCreatePage').onclick=()=>createInstallationClosing(null)}
function createInstallationClosing(daily){const nums=selectedClosingOrders(),orders=nums.map(n=>db.orders.find(o=>Number(o.numero)===n)).filter(Boolean);if(!orders.length)return;const installers=new Set(orders.map(o=>o.installation?.responsibleId));if(installers.size>1)return alert('Selecione instalações do mesmo instalador.');const total=daily===null?orders.reduce((a,o)=>a+Number(o.installation?.serviceValue||0),0):daily,id='FI-'+String(Date.now()).slice(-8);const c={id,installerId:orders[0].installation.responsibleId,installer:orders[0].installation.responsible,orderNumbers:nums,mode:daily===null?'SERVIÇO':'DIÁRIA',total,createdAt:new Date().toISOString(),by:currentUsername(),confirmed:false,reversed:false};closingStore().unshift(c);orders.forEach(o=>{o.installation.closingId=id;o.installation.closingMode=c.mode});queueSave();renderInstallationClosingPage();alert(`Fechamento ${id} criado. Confira e clique em CONFIRMAR INSTALAÇÕES.`)}
function confirmInstallationClosing(id){const c=installationClosingById(id);if(!c||c.confirmed||c.reversed)return;if(!confirm(`Confirmar ${c.id} no valor de ${money(c.total)}?`))return;const confirmDate=today(),due=installationDueDate(confirmDate);c.confirmed=true;c.confirmedAt=new Date().toISOString();c.confirmedBy=currentUsername();c.dueDate=due;const payableId='INST-'+c.id;db.payables=db.payables||[];db.payables=db.payables.filter(p=>p.installationClosingId!==c.id);db.payables.unshift({id:payableId,title:c.id,documentNumber:c.id,definition:`INSTALAÇÕES • ${c.installer}`,quoteNumber:(c.orderNumbers||[]).map(n=>String(n).padStart(6,'0')).join(', '),dueDate:due,value:Number(c.total||0),paidValue:0,paidDate:'',notes:`Fechamento de instalações ${c.id} • ${c.mode}`,installationClosingId:c.id});queueSave();renderInstallationClosingPage();alert(`Instalações confirmadas. Contas a Pagar: ${fmtDate(due)}.`)}
function reverseInstallationClosing(id){const c=installationClosingById(id);if(!c||c.reversed)return;if(!confirm(`Reverter o fechamento ${c.id}?`))return;const p=(db.payables||[]).find(x=>x.installationClosingId===c.id);if(p&&Number(p.paidValue||0)>0)return alert('Este fechamento já possui pagamento registrado. Reverta o pagamento antes.');db.payables=(db.payables||[]).filter(x=>x.installationClosingId!==c.id);c.reversed=true;c.reversedAt=new Date().toISOString();c.reversedBy=currentUsername();(c.orderNumbers||[]).forEach(n=>{const o=db.orders.find(x=>Number(x.numero)===Number(n));if(o?.installation?.closingId===c.id){o.installation.closingId='';o.installation.closingMode=''}});queueSave();renderInstallationClosingPage();renderInstall()}
function printInstallationClosing(c){if(!c)return;const rows=(c.orderNumbers||[]).map(n=>db.orders.find(o=>Number(o.numero)===Number(n))).filter(Boolean);printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><strong>FECHAMENTO DE INSTALAÇÕES ${esc(c.id)}</strong><br><br><strong>Instalador:</strong> ${esc(c.installer)}<br><strong>Modalidade:</strong> ${esc(c.mode)}<br><strong>Vencimento:</strong> ${fmtDate(c.dueDate)}<br><strong>Status:</strong> ${c.reversed?'REVERTIDO':c.confirmed?'CONFIRMADO':'ABERTO'}</div></div><table class="summary-table"><tr><th>Data</th><th>Pedido</th><th>Cliente</th><th>Valor do serviço</th></tr>${rows.map(o=>`<tr><td>${fmtDate(o.installation?.completedDate||o.installation?.scheduledDate)}</td><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${money(o.installation?.serviceValue||0)}</td></tr>`).join('')}</table><p class="totals">TOTAL DO FECHAMENTO: ${money(c.total)}</p>${c.mode==='DIÁRIA'?'<p class="conditions">O total deste fechamento foi acordado por diária e substitui a soma dos valores unitários dos serviços selecionados.</p>':''}`)}
const _renderHR1132=renderHR;renderHR=function(){_renderHR1132();document.querySelectorAll('[data-emp-edit]').forEach(b=>{const td=b.parentElement;if(td&&!td.querySelector('[data-emp-del]'))td.insertAdjacentHTML('beforeend',` <button class="btn danger" data-emp-del="${b.dataset.empEdit}">Excluir</button>`)});document.querySelectorAll('[data-prov-edit]').forEach(b=>{const td=b.parentElement;if(td&&!td.querySelector('[data-prov-del]'))td.insertAdjacentHTML('beforeend',` <button class="btn danger" data-prov-del="${b.dataset.provEdit}">Excluir</button>`)});document.querySelectorAll('[data-emp-del]').forEach(b=>b.onclick=()=>deleteHRPerson('employee',b.dataset.empDel));document.querySelectorAll('[data-prov-del]').forEach(b=>b.onclick=()=>deleteHRPerson('provider',b.dataset.provDel))}
function deleteHRPerson(kind,id){if(!isGestor())return;const h=hrData(),arr=kind==='employee'?h.employees:h.providers,p=arr.find(x=>x.id===id);if(!p)return;if(kind==='provider'&&db.orders.some(o=>o.installation?.responsibleId===id))return alert('Este prestador possui histórico de instalações. Para preservar os registros, deixe-o INATIVO em vez de excluir.');if(!confirm(`Excluir ${p.name}?`))return;if(kind==='employee')h.employees=h.employees.filter(x=>x.id!==id);else h.providers=h.providers.filter(x=>x.id!==id);queueSave();renderHR()}



/* === V11.32.1: correcoes consolidadas === */
let internalReturnView='home';
function currentActiveView(){const v=document.querySelector('.view.active');return v?.id?.replace(/^view-/,'')||'home'}
function openInternalView(id,from){internalReturnView=from||currentActiveView()||'home';document.querySelectorAll('.view').forEach(v=>v.classList.remove('active','print-target'));const target=$('view-'+id);if(!target){setView(internalReturnView);return}target.classList.add('active');window.scrollTo(0,0)}
function returnInternalView(fallback='home'){const target=internalReturnView||fallback;if($('view-'+target))setView(target);else setView(fallback)}
document.addEventListener('click',e=>{if(e.target?.id==='ficBackBtn')setView('install')});

function supplierPaymentLabel(x){return x.paymentType||x.condition||'-'}
renderSuppliers=function(){const root=$('supplierList');if(!root)return;root.innerHTML=`<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>NOME DO FORNECEDOR</th><th>TIPO DE PRODUTO</th><th>RESPONSÁVEL</th><th>PRAZO MÉDIO DE ENTREGA</th><th>SALDO DEVEDOR NA DATA</th><th>TIPO DE PAGAMENTO</th><th>AÇÕES</th></tr></thead><tbody>${(db.suppliers||[]).map(x=>{const ps=supplierPayables(x.id),open=ps.reduce((a,p)=>a+Math.max(0,Number(p.value||0)-Number(p.paidValue||0)),0);return `<tr><td>${esc(x.name)}</td><td>${esc(x.productType||'-')}</td><td>${esc(x.contact||'-')}</td><td>${Number(x.avgDays||0)} dias</td><td>${money(open)}</td><td>${esc(supplierPaymentLabel(x))}</td><td><div class="actions"><button class="btn ghost" data-sup-edit="${x.id}">Editar</button><button class="btn ghost" data-sup-titles="${x.id}">Ver títulos</button><button class="btn ghost" data-sup-orders="${x.id}">Ver OCs</button><button class="btn secondary" data-sup-order="${x.id}">Nova OC</button><button class="btn danger" data-sup-del="${x.id}">Excluir</button></div></td></tr>`}).join('')||'<tr><td colspan="7">Nenhum fornecedor cadastrado.</td></tr>'}</tbody></table></div></div>`;document.querySelectorAll('[data-sup-edit]').forEach(b=>b.onclick=()=>openSupplier(db.suppliers.find(x=>x.id===b.dataset.supEdit)));document.querySelectorAll('[data-sup-titles]').forEach(b=>b.onclick=()=>openSupplierHistory(b.dataset.supTitles,'titles'));document.querySelectorAll('[data-sup-orders]').forEach(b=>b.onclick=()=>openSupplierHistory(b.dataset.supOrders,'orders'));document.querySelectorAll('[data-sup-order]').forEach(b=>b.onclick=()=>openPurchase(null,b.dataset.supOrder));document.querySelectorAll('[data-sup-del]').forEach(b=>b.onclick=()=>{const has=(db.purchaseOrders||[]).some(o=>o.supplierId===b.dataset.supDel);if(has&&!confirm('Este fornecedor possui ordens de compra. Deseja excluir o cadastro mesmo assim?'))return;if(!has&&!confirm('Excluir fornecedor?'))return;db.suppliers=db.suppliers.filter(x=>x.id!==b.dataset.supDel);queueSave();renderSuppliers()})}
const _openSupplier11321=openSupplier;openSupplier=function(s=null){_openSupplier11321(s);const cond=$('supCond');if(cond){cond.parentElement.querySelector('span')?.remove();cond.parentElement.childNodes[0].textContent='Tipo de pagamento';cond.value=s?.paymentType||s?.condition||''}const save=$('supSave');if(save){const old=save.onclick;save.onclick=()=>{const v=cond?.value?.trim()||'';old();const found=(db.suppliers||[]).find(x=>x.name===$('supName')?.value?.trim());if(found){found.paymentType=v;queueSave()}}}}

function ignorePurchaseAlert(alertId){const a=(db.purchaseAlerts||[]).find(x=>x.id===alertId);if(!a)return;if(!confirm('Ignorar esta solicitação de compra?'))return;a.ignored=true;a.resolved=true;a.ignoredAt=new Date().toISOString();a.ignoredBy=currentUsername();queueSave();renderPurchaseAlerts();if(document.querySelector('[data-internal-view=\"purchaseRequest\"]'))returnInternalView('home')}
function purchaseRequestDetail(alertId){const a=(db.purchaseAlerts||[]).find(x=>x.id===alertId),o=db.orders.find(x=>Number(x.numero)===Number(a?.orderNumber));if(!o)return alert('Pedido não encontrado.');const mats=purchaseMaterialsForOrder(o);openInternalView('purchaseRequest');$('purchaseRequestBody').innerHTML=`<div class="card"><div class="detail-list"><div class="detail-item"><span>Pedido</span><strong>${String(o.numero).padStart(6,'0')}</strong></div><div class="detail-item"><span>Cliente</span><strong>${esc(o.client)}</strong></div><div class="detail-item"><span>Vendedor</span><strong>${esc(displaySeller(o))}</strong></div><div class="detail-item"><span>Instalação</span><strong>${fmtDate(o.deliveryDate)}</strong></div></div><div class="table-wrap" style="margin-top:14px"><table class="table"><thead><tr><th>MATERIAL</th><th>COR / REFERÊNCIA</th><th>QUANTIDADE</th><th>UNIDADE</th></tr></thead><tbody>${mats.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.color||'-')}</td><td>${Number(x.qty||0).toFixed(x.unit==='M'?2:0)}</td><td>${esc(x.unit||'-')}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum material externo identificado.</td></tr>'}</tbody></table></div><div class="actions" style="margin-top:14px"><button id="purchaseReqBack" class="btn secondary">← VOLTAR</button><button id="purchaseReqIgnore" class="btn ghost">IGNORAR</button><button id="purchaseReqNew" class="btn primary">+ NOVA ORDEM DE COMPRA</button></div></div>`;$('purchaseReqBack').onclick=(ev)=>{ev.preventDefault();returnInternalView('home')};$('purchaseReqIgnore').onclick=()=>ignorePurchaseAlert(alertId);$('purchaseReqNew').onclick=()=>{setView('suppliers');openPurchase(null,'',o,a)}}
renderPurchaseAlerts=function(){const box=$('purchaseAlerts');if(!box)return;if(!isGestor()){box.innerHTML='';return}syncPurchaseAlerts();const pending=(db.purchaseAlerts||[]).filter(a=>!a.resolved&&!a.ignored).map(a=>({...a,order:db.orders.find(o=>Number(o.numero)===Number(a.orderNumber))})).filter(a=>a.order&&orderNeedsPurchase(a.order));box.innerHTML=pending.map(a=>`<div class="notice" style="margin:0 0 12px;text-align:left"><strong>VOCÊ TEM MATERIAIS PARA SOLICITAR!</strong><br>Pedido ${String(a.order.numero).padStart(6,'0')} • ${esc(a.order.client)} • Instalação: <strong>${fmtDate(a.order.deliveryDate)}</strong><br><button class="btn primary" style="margin-top:8px" data-purchase-alert="${a.id}">ABRIR</button> <button class="btn ghost" style="margin-top:8px" data-purchase-ignore="${a.id}">IGNORAR</button></div>`).join('');document.querySelectorAll('[data-purchase-alert]').forEach(b=>b.onclick=()=>purchaseRequestDetail(b.dataset.purchaseAlert));document.querySelectorAll('[data-purchase-ignore]').forEach(b=>b.onclick=()=>ignorePurchaseAlert(b.dataset.purchaseIgnore))}

function reworkEligibleOrders(){return db.orders.filter(o=>o.installation?.scheduledDate||o.installation?.completedDate)}
openRework=function(orderNumber=null,existing=null){if(orderNumber&&typeof orderNumber==='object')orderNumber=null;const cats=['MEDIÇÃO','CONFECÇÃO','INSTALAÇÃO','MATERIAL / FORNECEDOR','CLIENTE','OUTROS'];const opts=reworkEligibleOrders().map(o=>`<option value="${o.numero}" ${Number(existing?.orderNumber||orderNumber)===Number(o.numero)?'selected':''}>${String(o.numero).padStart(6,'0')} • ${esc(o.client)} • ${fmtDate(o.installation?.scheduledDate||o.deliveryDate)}</option>`).join('');openModal(`<h2>${existing?'Retrabalho '+esc(existing.number):'Novo retrabalho'}</h2><div class="grid two"><label class="field">Pedido<select id="rwOrder"><option value="">Selecione o pedido</option>${opts}</select></label><label class="field">Data<input id="rwDate" type="date" value="${existing?.date||today()}"></label><label class="field">Categoria<select id="rwCat">${cats.map(x=>`<option ${existing?.category===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Etapa<input value="RETRABALHO / PRODUÇÃO" disabled></label><label class="field" style="grid-column:1/-1">Descrição / observações<textarea id="rwSummary">${esc(existing?.summary||'')}</textarea></label><label class="field" style="grid-column:1/-1">Materiais utilizados / necessários<textarea id="rwMaterials">${esc(existing?.materials||'')}</textarea></label></div><p class="notice">Ao salvar, o pedido retorna para PRODUÇÃO identificado como RETRABALHO.</p><button id="rwSave" class="btn primary">Salvar retrabalho</button>`);$('rwSave').onclick=()=>{const order=$('rwOrder').value,summary=$('rwSummary').value.trim();if(!order||!summary)return alert('Selecione o pedido e informe a descrição.');const original=db.orders.find(o=>Number(o.numero)===Number(order));if(!original)return alert('Pedido não encontrado.');const obj={...(existing||{}),id:existing?.id||uid(),number:existing?.number||`RT-${String((db.settings.nextReworkNumber||1)).padStart(4,'0')}`,orderNumber:order,date:$('rwDate').value,category:$('rwCat').value,summary,materials:$('rwMaterials').value.trim(),status:'PRODUÇÃO',updatedAt:new Date().toISOString(),by:currentUsername()};if(!existing){db.settings.nextReworkNumber=Number(db.settings.nextReworkNumber||1)+1;db.reworks.unshift(obj)}else{const idx=db.reworks.findIndex(x=>x.id===obj.id);db.reworks[idx]=obj}original.productionStage='RECEPÇÃO';original.hasOpenRework=true;original.reworkId=obj.id;original.productionHistory=original.productionHistory||[];original.productionHistory.push({stage:'RETRABALHO',at:new Date().toISOString(),by:currentUsername()});addOrderEvent(original,'RETRABALHO',`${obj.number} • ${obj.category} • RETORNO À PRODUÇÃO`);queueSave();closeModal();renderAll()}}

renderProduction=function(){const box=$('productionList');if(!box)return;const rows=db.orders.filter(o=>isGestor()||isProduction()?true:canSeeOrder(o));box.innerHTML=`<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>ENTREGA</th><th>AMBIENTES</th><th>STATUS</th><th>ETAPA DA PRODUÇÃO</th><th>AÇÕES</th></tr></thead><tbody>${rows.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${fmtDate(o.deliveryDate)}</td><td>${o.environments?.length||0}</td><td>${o.hasOpenRework?'<span class="badge danger">RETRABALHO</span>':'<span class="badge blue">NORMAL</span>'}</td><td><div class="stage-row">${STAGES.map(st=>canManageProduction()?`<button class="stage ${o.productionStage===st?'active':''}" data-stage-order="${o.numero}" data-stage="${st}">${st}</button>`:`<span class="stage ${o.productionStage===st?'active':''}">${st}</span>`).join('')}</div></td><td>${canManageProduction()?`<button class="btn secondary" data-production-open="${o.numero}">Abrir / Ver OP</button>`:''}</td></tr>`).join('')}</tbody></table></div></div>`;document.querySelectorAll('[data-production-open]').forEach(b=>b.onclick=()=>printProductionOrder(db.orders.find(x=>Number(x.numero)===Number(b.dataset.productionOpen))));document.querySelectorAll('[data-stage-order]').forEach(b=>b.onclick=()=>{if(!canManageProduction())return;const o=db.orders.find(x=>Number(x.numero)===Number(b.dataset.stageOrder));if(!o)return;o.productionStage=b.dataset.stage;if(o.hasOpenRework&&b.dataset.stage==='EXPEDIÇÃO')o.hasOpenRework=false;o.productionHistory=o.productionHistory||[];o.productionHistory.push({stage:b.dataset.stage,at:new Date().toISOString(),by:currentUsername()});addOrderEvent(o,'ETAPA DE PRODUÇÃO',b.dataset.stage);queueSave();renderProduction();renderOrders();renderInstall()})}

/* === V11.32.2 hotfix navegacao === */
document.addEventListener('click',function(e){const b=e.target.closest?.('[data-purchase-alert]');if(b){e.preventDefault();e.stopPropagation();purchaseRequestDetail(b.getAttribute('data-purchase-alert'));return;}if(e.target.closest?.('#purchaseReqBack')){e.preventDefault();returnInternalView('home');return;}if(e.target.closest?.('#ficBackBtn')){e.preventDefault();setView('install');return;}},true);


/* === V11.32.6 • PAINEL COMERCIAL VENDEDOR / PARCEIRO === */
function commercialPanelCommissionPercent(o){
  const p=Number(o?.commissionPercent);
  return Number.isFinite(p)?p:sellerCommission(resolveSellerUser(o));
}
function commercialPanelCommissionGenerated(o){return Number(o?.agreedValue||0)*commercialPanelCommissionPercent(o)/100}
function commercialPanelCommissionReleased(o){
  const sale=Math.max(0,Number(o?.agreedValue||0));
  if(!sale)return 0;
  const ratio=Math.min(1,Math.max(0,orderPaid(o)/sale));
  return commercialPanelCommissionGenerated(o)*ratio;
}
function commercialPanelCommissionPaid(o){return Math.max(0,Number(o?.commissionPaid||0))}
function renderCommercialPanel(){
  const box=$('commercialPanelBody');if(!box)return;
  const month=$('commercialPanelMonth')?.value||today().slice(0,7);
  const role=norm(userPermissionRecord(currentUsername()).role);
  if(!isGestor()&&!['SALES','PARTNER'].includes(role)){box.innerHTML='<div class="card"><p class="muted">Painel disponível para vendedores e parceiros.</p></div>';return}
  const sellerEl=$('commercialPanelSeller');
  if(sellerEl){
    const cur=sellerEl.value;
    const users=allUsers().filter(u=>['SALES','PARTNER'].includes(norm(u.role)));
    sellerEl.innerHTML=isGestor()?'<option value="">TODOS OS VENDEDORES / PARCEIROS</option>'+users.map(u=>`<option value="${esc(u.username)}">${esc(u.name||u.username)}</option>`).join(''):`<option value="${esc(currentUsername())}">${esc(sellerName(currentUsername()))}</option>`;
    sellerEl.value=isGestor()?(cur||''):currentUsername();sellerEl.disabled=!isGestor();
  }
  const seller=isGestor()?norm(sellerEl?.value||''):currentUsername();
  const orders=(db.orders||[]).filter(o=>String(o.createdDate||o.date||'').slice(0,7)===month&&(!seller||resolveSellerUser(o)===seller));
  const sold=orders.reduce((a,o)=>a+Number(o.agreedValue||0),0);
  const received=orders.reduce((a,o)=>a+orderPaid(o),0);
  const generated=orders.reduce((a,o)=>a+commercialPanelCommissionGenerated(o),0);
  const released=orders.reduce((a,o)=>a+commercialPanelCommissionReleased(o),0);
  const paid=orders.reduce((a,o)=>a+commercialPanelCommissionPaid(o),0);
  const balance=Math.max(0,released-paid);
  const cards=$('commercialPanelCards');if(cards)cards.innerHTML=[['Vendido no mês',money(sold)],['Recebido',money(received)],['Saldo dos clientes',money(Math.max(0,sold-received))],['Comissão gerada',money(generated)],['Comissão liberada',money(released)],['Comissão paga',money(paid)],['Comissão a receber',money(balance)],['Pedidos fechados',orders.length]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
  box.innerHTML=`<div class="card"><div class="card-title">Meus pedidos no período</div><div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Venda</th><th>Recebido</th><th>Saldo</th><th>Comissão %</th><th>Gerada</th><th>Liberada</th><th>Status</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client||'-')}</td><td>${money(o.agreedValue)}</td><td>${money(orderPaid(o))}</td><td>${money(orderBalance(o))}</td><td>${commercialPanelCommissionPercent(o).toFixed(2)}%</td><td>${money(commercialPanelCommissionGenerated(o))}</td><td>${money(commercialPanelCommissionReleased(o))}</td><td>${financialStatus(o)}</td></tr>`).join('')||'<tr><td colspan="9">Nenhum pedido fechado nesta competência.</td></tr>'}</tbody></table></div><p class="muted" style="margin-top:12px">A comissão liberada acompanha proporcionalmente os pagamentos recebidos do cliente. Alterações futuras na comissão do usuário não mudam o percentual já congelado no pedido.</p></div>`;
}
document.addEventListener('change',function(e){if(e.target?.id==='commercialPanelMonth'||e.target?.id==='commercialPanelSeller')renderCommercialPanel()});
(function initCommercialPanelDefaults(){const run=()=>{const m=$('commercialPanelMonth');if(m&&!m.value)m.value=today().slice(0,7)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})();


/* === V11.4 — Portal do Cliente + NPS === */
function npsFeedback(){return Array.isArray(db.customerFeedback)?db.customerFeedback:[]}
function npsAvg(rows,key){return rows.length?rows.reduce((a,r)=>a+Number(r[key]||0),0)/rows.length:0}
function npsScore(rows){if(!rows.length)return 0;const p=rows.filter(r=>Number(r.nps)>=9).length/rows.length*100,d=rows.filter(r=>Number(r.nps)<=6).length/rows.length*100;return p-d}
function npsRowsFiltered(from='',to='',seller=''){return npsFeedback().filter(r=>(!from||r.submittedDate>=from)&&(!to||r.submittedDate<=to)&&(!seller||norm(r.sellerUser)===norm(seller)))}
function fillNpsSellerFilter(id,handler){const s=$(id);if(!s)return;const v=s.value;s.innerHTML='<option value="">LOJA TODA</option>'+allUsers().filter(u=>['SALES','PARTNER'].includes(norm(u.role))).map(u=>`<option value="${esc(u.username)}">${esc(u.name||u.username)}</option>`).join('');s.value=v;s.onchange=handler}
function fillNpsFilters(){fillNpsSellerFilter('npsSeller',renderNpsResults)}
function renderNpsResults(){if(!isGestor()||!$('npsCards'))return;fillNpsFilters();['npsFrom','npsTo'].forEach(id=>{$(id).oninput=renderNpsResults});const rows=npsRowsFiltered($('npsFrom').value,$('npsTo').value,$('npsSeller').value),score=npsScore(rows),avg=(npsAvg(rows,'service')+npsAvg(rows,'deadline')+npsAvg(rows,'product')+npsAvg(rows,'installation'))/4,totalCompleted=(db.orders||[]).filter(o=>o.installation?.completedDate).length,responseRate=totalCompleted?rows.length/totalCompleted*100:0;const cards=[['NPS',`${score>=0?'+':''}${score.toFixed(0)}`],['Atendimento',npsAvg(rows,'service').toFixed(1)],['Prazo',npsAvg(rows,'deadline').toFixed(1)],['Produto',npsAvg(rows,'product').toFixed(1)],['Instalação',npsAvg(rows,'installation').toFixed(1)],['Média geral',avg.toFixed(2)],['Avaliações',rows.length],['Taxa de resposta',responseRate.toFixed(1)+'%']];$('npsCards').innerHTML=cards.map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');const promoters=rows.filter(r=>r.nps>=9).length,neutral=rows.filter(r=>r.nps>=7&&r.nps<=8).length,detr=rows.filter(r=>r.nps<=6).length;$('npsDistribution').innerHTML=`<div class="card-title">Distribuição NPS</div><div class="grid three"><div><strong>Promotores (9–10)</strong><div>${promoters}</div></div><div><strong>Neutros (7–8)</strong><div>${neutral}</div></div><div><strong>Detratores (0–6)</strong><div>${detr}</div></div></div>`;$('npsTable').innerHTML=rows.slice().sort((a,b)=>String(b.submittedAt).localeCompare(String(a.submittedAt))).map(r=>`<tr><td>${fmtDate(r.submittedDate)}</td><td>${String(r.orderNumber).padStart(6,'0')}</td><td>${esc(r.client)}</td><td>${esc(r.seller||'-')}</td><td>${esc(r.installer||'-')}</td><td>${r.service}</td><td>${r.deadline}</td><td>${r.product}</td><td>${r.installation}</td><td>${r.nps}</td><td>${((r.service+r.deadline+r.product+r.installation)/4).toFixed(1)}</td><td>${esc(r.comment||'-')}</td></tr>`).join('')||'<tr><td colspan="12">Nenhuma avaliação recebida.</td></tr>'}
function monthKey(d){return String(d||'').slice(0,7)}
function svgLineChart(el,series,min,max){if(!el)return;const labels=[...new Set(series.flatMap(s=>s.data.map(x=>x.label)))].sort();if(!labels.length){el.innerHTML='<p class="muted">Ainda não há avaliações suficientes para gerar o gráfico.</p>';return}const W=900,H=300,pad=48,x=i=>labels.length===1?W/2:pad+i*(W-2*pad)/(labels.length-1),y=v=>H-pad-(Number(v)-min)*(H-2*pad)/(max-min);let svg=`<svg viewBox="0 0 ${W} ${H}" role="img">`;for(let t=0;t<=4;t++){const val=min+(max-min)*t/4,yy=y(val);svg+=`<line x1="${pad}" y1="${yy}" x2="${W-pad}" y2="${yy}" class="chart-grid"/><text x="8" y="${yy+4}" class="chart-text">${val.toFixed(max===10?1:0)}</text>`}labels.forEach((l,i)=>svg+=`<text x="${x(i)}" y="${H-12}" text-anchor="middle" class="chart-text">${l.split('-').reverse().join('/')}</text>`);series.forEach((s,si)=>{const map=Object.fromEntries(s.data.map(d=>[d.label,d.value])),pts=labels.filter(l=>map[l]!=null).map(l=>`${x(labels.indexOf(l))},${y(map[l])}`).join(' ');svg+=`<polyline points="${pts}" class="chart-line chart-line-${si}"/>`;labels.filter(l=>map[l]!=null).forEach(l=>svg+=`<circle cx="${x(labels.indexOf(l))}" cy="${y(map[l])}" r="4" class="chart-dot chart-dot-${si}"/>`)});svg+='</svg><div class="chart-legend">'+series.map((s,i)=>`<span class="legend-${i}">● ${esc(s.name)}</span>`).join('')+'</div>';el.innerHTML=svg}
function renderNpsEvolution(){if(!isGestor()||!$('npsScoreChart'))return;fillNpsSellerFilter('npsEvoSeller',renderNpsEvolution);['npsEvoFrom','npsEvoTo'].forEach(id=>{$(id).oninput=renderNpsEvolution});const rows=npsRowsFiltered($('npsEvoFrom').value,$('npsEvoTo').value,$('npsEvoSeller')?.value||''),months=[...new Set(rows.map(r=>monthKey(r.submittedDate)))].sort(),by=m=>rows.filter(r=>monthKey(r.submittedDate)===m);svgLineChart($('npsScoreChart'),[{name:'NPS',data:months.map(m=>({label:m,value:npsScore(by(m))}))}],-100,100);svgLineChart($('npsSatisfactionChart'),['service','deadline','product','installation'].map((k,i)=>({name:['Atendimento','Prazo','Produto','Instalação'][i],data:months.map(m=>({label:m,value:npsAvg(by(m),k)}))})),1,10);const recent=rows.filter(r=>{const d=new Date(r.submittedDate+'T12:00:00'),cut=new Date();cut.setDate(cut.getDate()-30);return d>=cut}),prev=rows.filter(r=>{const d=new Date(r.submittedDate+'T12:00:00'),a=new Date();a.setDate(a.getDate()-60);const b=new Date();b.setDate(b.getDate()-30);return d>=a&&d<b}),names={service:'Atendimento',deadline:'Prazo',product:'Qualidade do produto',installation:'Qualidade da instalação'},alerts=[];for(const k of Object.keys(names)){const a=npsAvg(recent,k),b=npsAvg(prev,k);if(recent.length&&a<8)alerts.push(`${names[k]} está em ${a.toFixed(1)}/10 nos últimos 30 dias.`);else if(recent.length&&prev.length&&b-a>=.7)alerts.push(`${names[k]} caiu ${ (b-a).toFixed(1)} ponto(s): ${b.toFixed(1)} → ${a.toFixed(1)}.`)}$('npsAlerts').innerHTML=alerts.length?alerts.map(a=>`<div class="nps-alert">⚠️ <strong>ATENÇÃO</strong> — ${esc(a)}</div>`).join(''):'<div class="nps-ok">Indicadores sem alertas no período recente.</div>'}
async function doClientLogin(){const order=String($('clientOrderNumber').value||'').replace(/\D/g,''),password=String($('clientOrderPassword').value||'').replace(/\D/g,'').slice(0,6);$('clientOrderPassword').value=password;if(!order||password.length!==6)return $('clientLoginError').textContent='Informe o pedido e a senha de 6 dígitos.';try{$('clientLoginBtn').disabled=true;$('clientLoginError').textContent='';const r=await fetch('/api/client',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'login',orderNumber:order,password})}),j=await r.json();if(!r.ok)throw new Error(j.error||'Não foi possível acessar o pedido.');sessionStorage.setItem('novaClientSession',JSON.stringify(j));openClientPortal(j)}catch(e){$('clientLoginError').textContent=e.message}finally{$('clientLoginBtn').disabled=false}}
function closeClientPortal(){sessionStorage.removeItem('novaClientSession');$('clientPortal').classList.add('hidden');$('clientLoginScreen').classList.add('hidden');$('loginScreen').classList.remove('hidden')}
function clientStageLabel(stage){return ({'RECEPÇÃO':'Pedido confirmado','CORTE':'Em produção — corte','COSTURA':'Em produção — costura','BARRA':'Em produção — acabamento','PASSADORIA':'Em produção — passadoria','EXPEDIÇÃO':'Pronto para instalação'})[norm(stage)]||'Pedido em andamento'}
function openClientPortal(j){$('loginScreen').classList.add('hidden');$('clientLoginScreen').classList.add('hidden');$('clientPortal').classList.remove('hidden');const o=j.order,done=!!o.completedDate,ready=o.productionStage==='EXPEDIÇÃO',scheduled=o.scheduledDate||o.deliveryDate;let msg=ready&&o.installer?'<div class="client-goodnews"><strong>Boas novidades!</strong> Seu pedido está pronto e em breve nosso prestador de serviços confirmará o horário da instalação!</div>':'';if(done)msg='<div class="client-goodnews"><strong>Seu ambiente está pronto! ✨</strong><br>A Nova Imagem agradece pela confiança. Esperamos que você aproveite cada detalhe do seu novo ambiente.</div>';const feedback=done&&!o.feedback?`<div class="client-feedback"><h2>Avalie sua experiência</h2><div class="grid two">${[['fbService','Atendimento'],['fbDeadline','Prazo'],['fbProduct','Qualidade do produto'],['fbInstallation','Qualidade da instalação']].map(x=>`<label class="field">${x[1]}<select id="${x[0]}"><option value="">Selecione uma nota</option>${Array.from({length:10},(_,i)=>`<option>${i+1}</option>`).join('')}</select></label>`).join('')}<label class="field" style="grid-column:1/-1">O quanto você recomendaria a Nova Imagem para um amigo ou familiar? (NPS)<select id="fbNps"><option value="">Selecione de 0 a 10</option>${Array.from({length:11},(_,i)=>`<option>${i}</option>`).join('')}</select></label><label class="field" style="grid-column:1/-1">Conte-nos sobre sua experiência!<textarea id="fbComment" rows="4" placeholder="Opcional"></textarea></label></div><button id="fbSend" class="btn primary">ENVIAR RESPOSTAS</button><div id="fbError" class="login-error"></div></div>`:done&&o.feedback?'<div class="client-thanks"><strong>Obrigado pela sua avaliação! ❤️</strong><br>Sua opinião é muito importante para continuarmos melhorando.</div>':'';$('clientPortalContent').innerHTML=`<h1>Bem-vindo(a), ${esc(o.client)}</h1><p class="client-order-no">Pedido ${String(o.orderNumber).padStart(6,'0')}</p><div class="client-status-card"><span>Seu pedido está na etapa</span><strong>${esc(done?'Instalação concluída':clientStageLabel(o.productionStage))}</strong></div><div class="client-status-card"><span>Instalação ${o.scheduledDate?'agendada':'prevista'}</span><strong>${fmtDate(scheduled)}</strong>${o.installer?`<small>Responsável: ${esc(String(o.installer).split(' ')[0])}</small>`:''}</div>${msg}${feedback}<p class="client-slogan">Bom gosto e sofisticação em cada detalhe.</p>`;if($('fbSend'))$('fbSend').onclick=()=>submitClientFeedback(j)}
async function submitClientFeedback(session){const ids=['fbService','fbDeadline','fbProduct','fbInstallation','fbNps'],vals=ids.map(id=>$(id).value);if(vals.some(v=>v===''))return $('fbError').textContent='Selecione todas as notas antes de enviar.';try{$('fbSend').disabled=true;const r=await fetch('/api/client',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'feedback',orderNumber:session.order.orderNumber,password:session.clientToken,service:Number(vals[0]),deadline:Number(vals[1]),product:Number(vals[2]),installation:Number(vals[3]),nps:Number(vals[4]),comment:$('fbComment').value.trim()})}),j=await r.json();if(!r.ok)throw new Error(j.error||'Não foi possível enviar.');session.order.feedback=true;sessionStorage.setItem('novaClientSession',JSON.stringify(session));openClientPortal(session)}catch(e){$('fbError').textContent=e.message}finally{if($('fbSend'))$('fbSend').disabled=false}}

// ===== V11.5.1 — FIXAÇÕES POR CAMADA + APROVAÇÃO DE DESCONTO + HOME OPERACIONAL =====
function isTubePleat(p){return ['FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO'].includes(String(p||''));}
const _v1151UpdateModelFields=updateModelFields;
updateModelFields=function(){_v1151UpdateModelFields();const m=$('eModel')?.value,fp=$('eFinishPleat')?.value,lp=$('eLiningPleat')?.value,tube=isTubePleat(fp)||isTubePleat(lp);$('eFixationWrap')?.classList.toggle('hidden',tube);$('eRailProductWrap')?.classList.toggle('hidden',tube||$('eFixation')?.value!=='TRILHO SUÍÇO');$('eFinishTubeWrap')?.classList.toggle('hidden',!tube||m==='LINING');$('eLiningTubeWrap')?.classList.toggle('hidden',!tube||m==='FINISH');if(tube&&$('eFixColorWrap'))$('eFixColorWrap').classList.remove('hidden');};
const _v1151EnvFromForm=envFromForm;
envFromForm=function(){const e=_v1151EnvFromForm();const tube=isTubePleat(e.finishPleat)||isTubePleat(e.liningPleat);if(tube){e.finishTube=$('eFinishTube')?.value||'TUBO 28 MM';e.liningTube=$('eLiningTube')?.value||'TUBO 19 MM';e.fixation=e.model==='COMPLETE'?`${e.finishTube} + ${e.liningTube}`:(e.model==='LINING'?e.liningTube:e.finishTube);e.tubeFixation=true;}return e;};
['eFinishPleat','eLiningPleat','eFinishTube','eLiningTube'].forEach(id=>{const el=$(id);if(el)el.addEventListener('change',()=>{updateModelFields();updatePreview();});});

function userDiscountLimit(username){const u=userPermissionRecord(username);return ['SALES','PARTNER'].includes(norm(u.role))?Math.max(0,Number(u.maxDiscount??0)):100;}
function pendingDiscountApprovalForQuote(n){return (db.discountApprovals||[]).find(a=>Number(a.quoteNumber)===Number(n)&&a.status==='PENDENTE');}
function pushUserAlert(username,type,message,quoteNumber=0,orderNumber=0){db.userAlerts=db.userAlerts||[];db.userAlerts.unshift({id:uid(),username:norm(username),type,message,quoteNumber,orderNumber,createdAt:new Date().toISOString(),read:false});}
function renderUserHomeAlerts(){const box=$('userHomeAlerts');if(!box)return;const rows=(db.userAlerts||[]).filter(a=>norm(a.username)===currentUsername()&&!a.read);box.innerHTML=rows.map(a=>`<div class="notice" style="margin:0 0 12px;text-align:left;background:#fff3cd;border-color:#e6b94a"><strong>${esc(a.message)}</strong><br>${a.orderNumber?`Pedido ${String(a.orderNumber).padStart(6,'0')}`:a.quoteNumber?`Orçamento ${String(a.quoteNumber).padStart(6,'0')}`:''}<br><button class="btn primary" style="margin-top:8px" data-user-alert="${a.id}">${a.orderNumber?'VER PEDIDO':'ABRIR ORÇAMENTO'}</button></div>`).join('');document.querySelectorAll('[data-user-alert]').forEach(b=>b.onclick=()=>{const a=db.userAlerts.find(x=>x.id===b.dataset.userAlert);if(!a)return;a.read=true;queueSave();if(a.orderNumber)setView('orders');else{const q=db.quotes.find(x=>Number(x.numero)===Number(a.quoteNumber));if(q){draft=clone(q);quoteEditingEnvironmentId=null;quoteExcludeFixation=false;renderQuote();clearEnv();setView('quote')}}});}
function renderAgendaHome(){const box=$('agendaHomeAlerts');if(!box)return;const start=today(),d=new Date(start+'T12:00:00');d.setDate(d.getDate()+2);const end=d.toISOString().slice(0,10);const rows=agendaVisibleItems().filter(a=>a.date>=start&&a.date<=end).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));box.innerHTML=rows.length?`<div class="notice" style="margin:0 0 12px;text-align:left;background:#e7f6ea;border-color:#72b77d"><strong>AGENDA • PRÓXIMOS 3 DIAS</strong>${rows.map(a=>`<div style="margin-top:7px"><strong>${fmtDate(a.date)} ${esc(a.time||'')}</strong> • ${esc(a.client||'-')} • ${esc(a.description||'')}</div>`).join('')}<button class="btn primary" style="margin-top:8px" id="homeAgendaOpen">ABRIR AGENDA</button></div>`:'';if($('homeAgendaOpen'))$('homeAgendaOpen').onclick=()=>setView('agenda');}
function renderDiscountApprovalAlerts(){const box=$('discountApprovalAlerts');if(!box)return;if(!isGestor()){box.innerHTML='';return;}const rows=(db.discountApprovals||[]).filter(a=>a.status==='PENDENTE');box.innerHTML=rows.map(a=>{const q=db.quotes.find(x=>Number(x.numero)===Number(a.quoteNumber));return `<div class="notice" style="margin:0 0 12px;text-align:left;background:#ffe0b2;border-color:#ef9a3d"><strong>VOCÊ TEM UMA SOLICITAÇÃO DE DESCONTO PARA APROVAR!</strong><br>Orçamento ${String(a.quoteNumber).padStart(6,'0')} • ${esc(q?.client||a.client||'-')} • Instalação: <strong>${fmtDate(a.deliveryDate)}</strong><br>Desconto solicitado: <strong>${Number(a.totalDiscount||0).toFixed(2)}%</strong> • Limite: ${Number(a.userLimit||0).toFixed(2)}%<br><button class="btn primary" style="margin-top:8px" data-disc-approval="${a.id}">ABRIR</button></div>`}).join('');document.querySelectorAll('[data-disc-approval]').forEach(b=>b.onclick=()=>openDiscountApproval(b.dataset.discApproval));}
function openDiscountApproval(id){const a=(db.discountApprovals||[]).find(x=>x.id===id),q=db.quotes.find(x=>Number(x.numero)===Number(a?.quoteNumber));if(!a||!q)return alert('Solicitação não encontrada.');openModal(`<h2>APROVAÇÃO DE ORÇAMENTO</h2><div class="detail-list"><div class="detail-item"><span>Orçamento</span><strong>${String(q.numero).padStart(6,'0')}</strong></div><div class="detail-item"><span>Cliente</span><strong>${esc(q.client)}</strong></div><div class="detail-item"><span>Instalação</span><strong>${fmtDate(a.deliveryDate)}</strong></div><div class="detail-item"><span>Desconto solicitado</span><strong>${Number(a.totalDiscount).toFixed(2)}%</strong></div></div><div class="actions" style="margin-top:16px"><button id="daOpen" class="btn ghost">ABRIR ORÇAMENTO</button><button id="daReject" class="btn danger">RECUSAR SOLICITAÇÃO</button><button id="daAccept" class="btn primary">ACEITAR SOLICITAÇÃO</button><button id="daBack" class="btn secondary">VOLTAR</button></div>`);$('daOpen').onclick=()=>{closeModal();draft=clone(q);renderQuote();setView('quote')};$('daBack').onclick=closeModal;$('daReject').onclick=()=>{a.status='RECUSADO';a.decidedAt=new Date().toISOString();a.decidedBy=currentUsername();q.status='ORÇAMENTO';pushUserAlert(a.requestedBy,'REAJUSTE','REAJUSTE O DESCONTO!',q.numero);audit('ORÇAMENTO','DESCONTO RECUSADO',q.numero,`${a.totalDiscount}% • limite ${a.userLimit}%`);queueSave();closeModal();renderAll()};$('daAccept').onclick=async()=>{if(!confirm('Aprovar o desconto e converter automaticamente em pedido?'))return;const order=await finalizeQuoteOrder(q,a.condition,a.deliveryDate,a.additionalDiscount,a.reason,`APROVADO PELO GESTOR ${currentUser?.name||currentUsername()}`);if(!order)return;a.status='APROVADO';a.decidedAt=new Date().toISOString();a.decidedBy=currentUsername();pushUserAlert(a.requestedBy,'APROVADO','SEU PEDIDO FOI APROVADO, INFORME O CLIENTE!',q.numero,order.numero);audit('ORÇAMENTO','DESCONTO APROVADO',q.numero,`${a.totalDiscount}% • Gestor ${currentUser?.name||currentUsername()}`);queueSave();closeModal();renderAll()};}
async function finalizeQuoteOrder(q,cond,date,disc,reason,approvalNote=''){if(db.orders.some(o=>Number(o.quoteNumber)===Number(q.numero))){alert('Este orçamento já possui pedido.');return null;}const t=quoteTotals(q),base=cond==='cash'?t.cash:cond==='p18'?t.p18:t.p4;const order={id:uid(),numero:nextOrderNumber(),clientAccessCode:String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0'),quoteNumber:q.numero,partnerMarkupPercent:quotePartnerMarkup(q),ownerUser:q.ownerUser||currentUsername(),client:q.client,address:q.address,document:q.document||'',street:q.street||'',number:q.number||'',complement:q.complement||'',neighborhood:q.neighborhood||'',cep:q.cep||'',contact:q.contact,seller:displaySeller(q),sellerUser:resolveSellerUser(q),environments:clone(q.environments),blinds:clone(q.blinds||[]),looseProducts:clone(q.looseProducts||[]),createdDate:today(),deliveryDate:date,paymentCondition:cond,originalValue:base,discountPercent:Number(disc||0),discountReason:reason,agreedValue:base*(1-Number(disc||0)/100),notes:approvalNote,productionStage:'RECEPÇÃO',productionHistory:[{stage:'RECEPÇÃO',at:new Date().toISOString(),by:currentUsername()}],installation:{responsible:'',completedDate:''},payments:[],createdAt:new Date().toISOString()};const total=Number(q.discountPercent||0)+Number(disc||0);order.commissionPercent=partnerCommissionForDiscount(resolveSellerUser(q),total);order.partnerDiscountPercent=total;order.costSnapshot={createdAt:new Date().toISOString(),installationMatrix:clone(db.priceConfig.installationMatrix),environments:(order.environments||[]).map(e=>{const c=calcEnvironment(e);return {name:e.name,installation:Number(c?.installCost||0),production:Number((c?.sewingCost||0)+(c?.finishPleat||0)+(c?.liningPleat||0)+(c?.customPleat||0)),cashSale:Number(c?.cash||0)*(1+quotePartnerMarkup(q)/100)}})};const official=await consumeOfficialStock(q,order);if(!official.ok){alert(official.error);return null;}const stock=validateAndConsumeStock(q,order);if(!stock.ok){await restoreOfficialStock(order);alert(stock.error);return null;}db.orders.unshift(order);createPurchaseAlertForOrder(order);q.status='PEDIDO';q.convertedOrderNumber=order.numero;return order;}

// substitui conversão: acima do limite individual vira solicitação ao gestor
convertQuote=function(n){if(conversionInProgress)return alert('Conversão já está em andamento. Aguarde.');const q=db.quotes.find(x=>Number(x.numero)===Number(n));if(!q)return;if(db.orders.some(o=>Number(o.quoteNumber)===n))return alert('Este orçamento já foi convertido em pedido.');if(pendingDiscountApprovalForQuote(n))return alert('Este orçamento já está aguardando aprovação do gestor.');const t=quoteTotals(q);openModal(`<h2>Converter em pedido</h2><div class="grid two"><label class="field">Condição<select id="convCond"><option value="cash">À vista</option><option value="p4">Até 4x</option><option value="p18">Até 18x</option></select></label><label class="field">Data de instalação / entrega<input id="convDate" type="date" value="${q.suggestedDeliveryDate||suggestedInstallDate(today())}"></label><label class="field">Desconto adicional (%)<input id="convDiscount" type="number" min="0" max="100" value="0"></label><label class="field">Justificativa<input id="convReason"></label></div><p class="muted">À vista ${money(t.cash)} • 4x ${money(t.p4)} • 18x ${money(t.p18)}</p><button id="convGo" class="btn primary">Gerar pedido</button>`);$('convGo').onclick=async()=>{const cond=$('convCond').value,date=$('convDate').value,disc=Number($('convDiscount').value||0),reason=$('convReason').value.trim();if(!date)return alert('Informe a data.');if(disc>0&&!reason)return alert('Justifique o desconto.');const seller=resolveSellerUser(q),role=norm(userPermissionRecord(seller).role),total=Number(q.discountPercent||0)+disc,limit=userDiscountLimit(seller);if(['SALES','PARTNER'].includes(role)&&total>limit){db.discountApprovals=db.discountApprovals||[];db.discountApprovals.unshift({id:uid(),quoteNumber:q.numero,client:q.client,requestedBy:seller,requestedAt:new Date().toISOString(),condition:cond,deliveryDate:date,additionalDiscount:disc,totalDiscount:total,userLimit:limit,reason,status:'PENDENTE'});q.status='PENDENTE DE APROVAÇÃO';audit('ORÇAMENTO','SOLICITAÇÃO DE DESCONTO',q.numero,`${total}% • limite ${limit}%`);queueSave();closeModal();renderAll();return alert('Desconto acima do seu limite. Orçamento enviado para aprovação do gestor.');}conversionInProgress=true;const order=await finalizeQuoteOrder(q,cond,date,disc,reason);conversionInProgress=false;if(order){queueSave();closeModal();renderAll();setView('orders')}}};
const _v1151CalcEnvironment=calcEnvironment;
function tubeHardwareCalc(e,c){const w=Number(e.width||0)/100,model=e.model,color=e.fixColor||'',mat=norm(e.supportMaterial)==='PVC'?'PVC':'ALUMINIO',supports=w<=2?2:w<=3.5?3:w<=4.5?4:5;const tubes=[];if(model!=='LINING')tubes.push(e.finishTube||'TUBO 28 MM');if(model!=='FINISH')tubes.push(e.liningTube||'TUBO 19 MM');const supportName=model==='COMPLETE'?`SUPORTE 19/28 ${mat}`:`SUPORTE ${(tubes[0]||'TUBO 28 MM').includes('19')?'19':'28'}MM ${mat}`;const support=officialProductByName(supportName,color)||officialProductLike(supportName.split(' '),color);const parts=[{productId:support?.id||null,name:supportName,qty:supports,unit:'UN'}];let total=supports*Number(support?.price_4x||0);for(const t of tubes){const size=t.includes('19')?'19':'28',capName=`TAMPA PARA TUBO EM ALUMINIO ${size}MM`,cap=officialProductByName(capName,color)||officialProductLike(['TAMPA','TUBO',size],color);parts.push({productId:cap?.id||null,name:capName,qty:2,unit:'UN'});total+=2*Number(cap?.price_4x||0);}return {kind:tubes.join(' + '),meters:w*tubes.length,supports,ends:tubes.length*2,supportName,supportProductId:support?.id||null,parts,total,hardwareBase:total,detail:`${tubes.join(' + ')} • ${supports} ${supportName.toLowerCase()} • ${tubes.length*2} tampas • tubo sem preço cadastrado`};}
calcEnvironment=function(e){const c=_v1151CalcEnvironment(e);if(!c)return c;if(e.tubeFixation||isTubePleat(e.finishPleat)||isTubePleat(e.liningPleat)){const oldFix=Number(c.fixationCalc?.total||0),oldSlider=Number(c.sliderCost||0),f=tubeHardwareCalc(e,c);c.fixationCalc=f;c.finishSliders=0;c.liningSliders=0;c.sliderCost=0;c.base4=c.base4-oldFix-oldSlider+f.total;c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);}return c;};

/* ===== V11.6 • INSPIRAÇÕES / PORTAL PÚBLICO / CANDIDATURAS ===== */
const V117_DEFAULT_ABOUT=`A Nova Imagem nasceu como uma empresa familiar em Ponta Grossa, no Paraná, e construiu sua história através do trabalho, da experiência e, principalmente, da confiança de seus clientes.

São mais de 40 anos de conhecimento acumulado no mercado de cortinas e persianas. Ao longo desse tempo, técnicas mudaram, materiais evoluíram e novas tecnologias surgiram. A essência, porém, permanece a mesma: entender o que cada cliente precisa e transformar essa necessidade em uma solução que una funcionalidade, qualidade e bom gosto.

Para nós, uma cortina nunca é apenas um tecido sobre uma porta ou janela. Ela faz parte do ambiente, interfere na luz, no conforto e na privacidade e, sobretudo, ajuda a construir a personalidade de cada espaço.

Hoje, a Nova Imagem une essa experiência construída ao longo de décadas a uma nova etapa de profissionalização, tecnologia e crescimento. Evoluímos nossos processos, ampliamos nossas soluções e investimos constantemente em novas formas de atender, produzir e instalar, sem abrir mão da proximidade e da confiança que fizeram parte da nossa história desde o início.`;
const V117_MISSION='Transformar o conhecimento e a experiência acumulados em mais de 40 anos no mercado de cortinas e persianas em soluções de qualidade, bom gosto e preço justo. Queremos proporcionar aos nossos clientes uma experiência confiável e consistente, ao mesmo tempo em que desenvolvemos pessoas, aprimoramos processos e construímos uma cultura permanente de excelência.';
const V117_VISION='Transformar a Nova Imagem em uma marca de referência nacional em cortinas, persianas e soluções para interiores, com processos claros, alta capacidade produtiva e um modelo de negócio replicável. Crescer em escala, atender diferentes públicos e alcançar novos mercados sem abrir mão da qualidade, do bom gosto e da essência construída ao longo da nossa história.';
const V117_VALUES=[['Excelência','Buscar excelência em cada etapa, do orçamento à instalação, para que a cortina seja parte de um ambiente de bom gosto e sofisticação.'],['Conhecimento','Valorizar mais de 40 anos de experiência e transformá-los em conhecimento compartilhado, processos e evolução contínua.'],['Cliente','Entender que públicos diferentes possuem necessidades diferentes e oferecer a solução adequada mantendo o mesmo padrão de qualidade.'],['Evolução','Não parar no tempo: questionar processos, identificar gargalos, incorporar tecnologia e buscar maneiras melhores de trabalhar.'],['Pessoas','Construir uma cultura baseada em respeito, desenvolvimento, responsabilidade e colaboração.'],['Honestidade','Agir com transparência, responsabilidade e compromisso para construir relacionamentos duradouros.']];
const V116_DEFAULT_INSPIRATIONS=[
 {id:'INS-001',title:'Linho Sintético • Wave',fabric:'LINHO SINTÉTICO',pleat:'FITA WAVE',fixation:'TRILHO SUÍÇO DUPLO ESPAÇADO BRANCO',colors:['BRANCO','CINZA','AREIA','BEGE','OFF WHITE','TRIGO'],environment:'Sala • Quarto • Escritório',description:'Elegância e leveza com caimento ondulado e contemporâneo.',care:'Aspiração regular; pano levemente úmido; não utilizar alvejantes; secagem à sombra.',image:'inspiration-1.jpg',keywords:'linho wave suíço trilho sala quarto',published:true},
 {id:'INS-002',title:'Linho Sintético • Sobreposta',fabric:'LINHO SINTÉTICO',pleat:'PREGA SOBREPOSTA',fixation:'TRILHO SUÍÇO DUPLO ESPAÇADO BRANCO',colors:['BRANCO','CINZA','AREIA','BEGE','OFF WHITE','TRIGO'],environment:'Sala • Quarto',description:'Visual volumoso e sofisticado, com franzimento 4:1.',care:'Aspiração regular; limpeza delicada; secagem à sombra.',image:'inspiration-2.jpg',keywords:'linho sobreposta suíço trilho',published:true},
 {id:'INS-003',title:'Linho Composto • Wave',fabric:'LINHO COMPOSTO 6%',pleat:'FITA WAVE',fixation:'VARÃO WAVE',colors:['BRANCO','CRU','TRIGO','CINZA'],environment:'Sala • Área gourmet',description:'Textura nobre e visual contemporâneo para ambientes de destaque.',care:'Aspiração regular e lavagem profissional quando necessário.',image:'inspiration-3.jpg',keywords:'linho composto wave varão',published:true},
 {id:'INS-004',title:'Blackout • Ilhós',fabric:'BLACKOUT 100% LEVE',pleat:'ILHÓS REDONDO',fixation:'TUBO 28 MM',colors:['BRANCO','MARFIM'],environment:'Quarto • Home theater',description:'Maior controle de luminosidade com visual prático e marcante.',care:'Pano úmido e secagem natural; não usar alvejantes.',image:'inspiration-4.jpg',keywords:'blackout ilhos ilhós varão tubo quarto',published:true},
 {id:'INS-005',title:'Voil • Franzido Suíço',fabric:'VOIL LISO',pleat:'FRANZIDO SUÍÇO',fixation:'TRILHO SUÍÇO',colors:['BRANCO','MARFIM'],environment:'Sala • Quarto',description:'Leveza e transparência com acabamento clássico e atemporal.',care:'Lavagem delicada; não torcer; secagem à sombra.',image:'inspiration-5.jpg',keywords:'voil franzido suíço trilho',published:true},
 {id:'INS-006',title:'Motorizada • Wave',fabric:'LINHO SINTÉTICO',pleat:'FITA WAVE',fixation:'TRILHO SUÍÇO MOTORIZADO',colors:['BRANCO','CINZA','AREIA','BEGE','OFF WHITE','TRIGO'],environment:'Sala • Quarto • Ambientes integrados',description:'Conforto, automação e design em uma solução de alto padrão.',care:'Aspiração regular; manter motor e trilho sem contato com água.',image:'inspiration-6.jpg',keywords:'motorizada motor wave linho suíço automação',published:true}
];
function ensureV116Data(){db.inspirations=db.inspirations||[];db.candidates=db.candidates||[];db.jobs=db.jobs||[];db.settings=db.settings||{};if(!db.inspirations.length&&isGestor()){db.inspirations=clone(V116_DEFAULT_INSPIRATIONS);db.settings.publicAbout=db.settings.publicAbout||V117_DEFAULT_ABOUT;queueSave()}}
const swatchColor=n=>({BRANCO:'#f6f3ea','OFF WHITE':'#eee8dc',MARFIM:'#e5d6b7',AREIA:'#d4b58c',BEGE:'#b99a78',TRIGO:'#b18b5f',CINZA:'#8f918f',CRU:'#d6c3a4',AZUL:'#7891a3',ROSA:'#d4a4a5',IMBUIA:'#694733','PRATA ESCOVADO':'#a9abad',CROMADO:'#d6d8da'}[norm(n)]||'#c9b9a5');
function inspirationCard(x){const samples=(x.colorImages||[]).length?x.colorImages.map((im,i)=>`<i class="color-swatch" title="${esc((x.colors||[])[i]||'Amostra')}" style="background-image:url('${im}');background-size:cover"></i>`).join(''):(x.colors||[]).slice(0,12).map(c=>`<i class="color-swatch" title="${esc(c)}" style="background:${swatchColor(c)}"></i>`).join('');return `<article class="inspiration-card"><img src="${esc(x.image||'inspiration-1.jpg')}" alt="${esc(x.title)}"><div class="inspiration-card-body"><h3>${esc(x.title)}</h3><small>${esc(x.fixation||'')}</small><div class="inspiration-tags">${[x.fabric,x.pleat,...String(x.environment||'').split('•')].filter(Boolean).slice(0,5).map(t=>`<span>${esc(String(t).trim())}</span>`).join('')}</div><p>${esc(x.description||'')}</p><div class="color-swatches">${samples}</div><div class="actions"><button class="btn primary" onclick="openInspirationDetail('${x.id}')">VER MODELO</button><button class="btn ghost" onclick="wantInspiration('${x.id}')">QUERO ESTE MODELO</button></div></div></article>`}
function inspirationsMarkup(items,publicMode=false){return `<section class="public-hero"><div><small>INSPIRAÇÕES</small><h1>Seu ambiente,<br>ainda mais completo.</h1><p>Explore nossos modelos e encontre a solução ideal para cada espaço.</p></div><div><input id="inspSearch${publicMode?'Pub':'Int'}" class="public-search" placeholder="Qual modelo inspira o seu ambiente?"><p>Pesquise por modelo, tecido, fixação, cor ou ambiente.</p></div></section><div class="inspiration-cats">${['TODOS','LINHO','VOIL','WAVE','SOBREPOSTA','ILHÓS','ARGOLAS','TRILHO SUÍÇO','VARÃO','MOTORIZADA','BLACKOUT','FORRO'].map((c,i)=>`<button class="inspiration-cat ${i===0?'active':''}" data-insp-cat="${c}">${c}</button>`).join('')}</div><div class="inspiration-layout"><aside class="inspiration-filters"><h3>FILTROS</h3><strong>Tipo de tecido</strong>${['LINHO SINTÉTICO','LINHO COMPOSTO','VOIL','GABARDINE','BLACKOUT'].map(x=>`<label><input type="checkbox" data-insp-filter="${x}"> ${x}</label>`).join('')}<br><strong>Tipo de fixação</strong>${['TRILHO SUÍÇO','VARÃO','MOTORIZADA'].map(x=>`<label><input type="checkbox" data-insp-filter="${x}"> ${x}</label>`).join('')}<br><button class="btn ghost" data-show-all>VER TODOS OS MODELOS</button></aside><section><div id="inspCount" class="muted" style="margin-bottom:10px"></div><div id="inspGrid" class="inspiration-grid">${items.map(inspirationCard).join('')}</div></section></div>`}
function wireInspirationSearch(root,items){const input=root.querySelector('.public-search'),grid=root.querySelector('#inspGrid'),count=root.querySelector('#inspCount');const apply=(term='')=>{const checks=[...root.querySelectorAll('[data-insp-filter]:checked')].map(x=>norm(x.dataset.inspFilter));const q=norm(term);const filtered=items.filter(x=>{const hay=norm([x.title,x.fabric,x.pleat,x.fixation,x.environment,x.description,x.keywords,...(x.colors||[])].join(' '));return (!q||hay.includes(q))&&checks.every(c=>hay.includes(c))});grid.innerHTML=filtered.map(inspirationCard).join('');if(count)count.textContent=`${filtered.length} modelo(s) encontrado(s)`};input.oninput=()=>apply(input.value);root.querySelectorAll('[data-insp-filter]').forEach(x=>x.onchange=()=>apply(input.value));root.querySelectorAll('[data-insp-cat]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-insp-cat]').forEach(x=>x.classList.remove('active'));b.classList.add('active');input.value=b.dataset.inspCat==='TODOS'?'':b.dataset.inspCat;apply(input.value)});root.querySelector('[data-show-all]')?.addEventListener('click',()=>{input.value='';root.querySelectorAll('[data-insp-filter]').forEach(x=>x.checked=false);apply('')});apply('')}
window.openInspirationDetail=function(id){const x=[...(db.inspirations||[]),...(window._publicInspirations||[]),...V116_DEFAULT_INSPIRATIONS].find(y=>y.id===id);if(!x)return;openModal(`<img src="${esc(x.image)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px"><h2>${esc(x.title)}</h2><p><strong>${esc(x.fixation)}</strong></p><div class="color-photo-grid">${(x.colors||[]).map((c,i)=>`<div class="color-photo-card">${x.colorImages?.[i]?`<img src="${x.colorImages[i]}" alt="${esc(c)}">`:`<span style="background:${swatchColor(c)}"></span>`}${esc(c)}</div>`).join('')}</div><p>${esc(x.description)}</p><h3>Ideal para</h3><p>${esc(x.environment)}</p><h3>Limpeza e conservação</h3><p>${esc(x.care)}</p><button class="btn primary" onclick="wantInspiration('${x.id}')">QUERO ESTE MODELO • WHATSAPP</button>`)};
window.wantInspiration=function(id){const x=[...(db.inspirations||[]),...(window._publicInspirations||[]),...V116_DEFAULT_INSPIRATIONS].find(y=>y.id===id);if(!x)return;const phone='5542988011435',text=`Olá! Vi este modelo no catálogo de Inspirações da Nova Imagem e gostaria de fazer um orçamento.\n\nModelo: ${x.title}\nFixação: ${x.fixation||'-'}\nReferência: ${x.id}`;window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank')};
function renderInspirations(){ensureV116Data();const root=$('internalInspirations');if(!root)return;const items=(db.inspirations||[]).filter(x=>x.published!==false);root.innerHTML=inspirationsMarkup(items,false);wireInspirationSearch(root,items);if($('manageInspirationsBtn'))$('manageInspirationsBtn').style.display=isGestor()?'':'none'}
function fileData(input,max=1500000){return new Promise((resolve,reject)=>{const f=input.files?.[0];if(!f)return resolve('');if(f.size>max)return reject(new Error('Arquivo muito grande. Limite 1,5 MB.'));const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)})}
function manageInspirations(){if(!isGestor())return;openModal(`<h2>GERENCIAR INSPIRAÇÕES</h2><button id="newInsp" class="btn primary">+ NOVA INSPIRAÇÃO</button> <button id="editAbout" class="btn secondary">EDITAR SOBRE NÓS</button> <button id="editPortalCover" class="btn secondary">TROCAR FOTO DA CAPA</button><div style="margin-top:15px">${(db.inspirations||[]).map(x=>`<div class="inspiration-admin-row"><img src="${esc(x.image||'inspiration-1.jpg')}"><div><strong>${esc(x.title)}</strong><br><small>${x.published===false?'DESPUBLICADA':'PUBLICADA'} • ${esc((x.colors||[]).join(', '))}</small></div><button class="btn ghost" data-edit-insp="${x.id}">Editar</button></div>`).join('')}</div>`);$('newInsp').onclick=()=>editInspiration();$('editAbout').onclick=editPublicAbout;$('editPortalCover').onclick=editPortalCover;document.querySelectorAll('[data-edit-insp]').forEach(b=>b.onclick=()=>editInspiration(b.dataset.editInsp))}
function editInspiration(id){const x=(db.inspirations||[]).find(y=>y.id===id)||{id:'INS-'+String((db.inspirations||[]).length+1).padStart(3,'0'),published:true,colors:[],colorImages:[]};let workColors=(x.colors||[]).map((name,i)=>({name,image:(x.colorImages||[])[i]||''}));const colorRows=()=>workColors.map((c,i)=>`<div class="color-admin-item"><div class="color-admin-thumb" style="${c.image?`background-image:url('${c.image}')`:`background:${swatchColor(c.name)}`}"></div><strong>${esc(c.name)}</strong><button type="button" class="btn danger" data-remove-color="${i}">Remover</button></div>`).join('')||'<p class="muted">Nenhuma cor cadastrada. Adicione somente as cores realmente disponíveis.</p>';openModal(`<h2>${id?'Editar':'Nova'} inspiração</h2><div class="grid two"><label class="field">Nome do modelo<input id="iTitle" value="${esc(x.title||'')}"></label><label class="field">Tecido<input id="iFabric" value="${esc(x.fabric||'')}"></label><label class="field">Tipo de prega<input id="iPleat" value="${esc(x.pleat||'')}"></label><label class="field">Fixação<input id="iFix" value="${esc(x.fixation||'')}"></label><label class="field">Ambientes recomendados<input id="iEnv" value="${esc(x.environment||'')}"></label><label class="field">Palavras-chave<input id="iKeys" value="${esc(x.keywords||'')}"></label><label class="field" style="grid-column:1/-1">Descrição<textarea id="iDesc">${esc(x.description||'')}</textarea></label><label class="field" style="grid-column:1/-1">Limpeza e conservação<textarea id="iCare">${esc(x.care||'')}</textarea></label><label class="field">Foto principal<input id="iImage" type="file" accept="image/*"></label><label><input id="iPub" type="checkbox" ${x.published!==false?'checked':''}> Publicada</label></div><section class="card" style="margin:15px 0"><div class="card-title">CORES DISPONÍVEIS</div><div id="colorAdminList" class="color-admin-list">${colorRows()}</div><div class="grid two"><label class="field">Nome da cor<input id="newColorName" placeholder="Ex.: Marfim"></label><label class="field">Foto / amostra desta cor<input id="newColorImage" type="file" accept="image/*"></label></div><button id="addColorBtn" type="button" class="btn secondary" style="margin-top:10px">+ ADICIONAR COR</button></section><div class="actions"><button id="iSave" class="btn primary">SALVAR</button>${id?'<button id="iDelete" class="btn danger">EXCLUIR</button>':''}</div>`);const redraw=()=>{const el=$('colorAdminList');if(el)el.innerHTML=colorRows();document.querySelectorAll('[data-remove-color]').forEach(b=>b.onclick=()=>{workColors.splice(Number(b.dataset.removeColor),1);redraw()})};redraw();$('addColorBtn').onclick=async()=>{try{const name=$('newColorName').value.trim();if(!name)return alert('Informe o nome da cor.');const image=await fileData($('newColorImage'),450000);workColors.push({name,image});$('newColorName').value='';$('newColorImage').value='';redraw()}catch(e){alert(e.message)}};$('iSave').onclick=async()=>{try{const img=await fileData($('iImage'));Object.assign(x,{title:$('iTitle').value.trim(),fabric:$('iFabric').value.trim(),pleat:$('iPleat').value.trim(),fixation:$('iFix').value.trim(),colors:workColors.map(c=>c.name),colorImages:workColors.map(c=>c.image||''),environment:$('iEnv').value.trim(),description:$('iDesc').value.trim(),care:$('iCare').value.trim(),keywords:$('iKeys').value.trim(),published:$('iPub').checked,image:img||x.image||'inspiration-1.jpg'});if(!id)db.inspirations.push(x);await saveCloud();closeModal();renderInspirations()}catch(e){alert(e.message)}};if($('iDelete'))$('iDelete').onclick=async()=>{if(confirm('Excluir esta inspiração?')){db.inspirations=db.inspirations.filter(y=>y.id!==x.id);await saveCloud();closeModal();renderInspirations()}}}
function editPortalCover(){openModal(`<h2>Foto da capa do portal</h2><p class="muted">Envie uma imagem horizontal. Ela será usada na página inicial pública.</p><img src="${esc(db.settings?.portalHeroImage||'portal-cover.jpg')}" style="width:100%;max-height:300px;object-fit:cover;border-radius:14px;margin-bottom:12px"><label class="field">Nova foto<input id="portalHeroFile" type="file" accept="image/*"></label><div class="actions"><button id="savePortalHero" class="btn primary">SALVAR CAPA</button><button id="defaultPortalHero" class="btn ghost">USAR CAPA PADRÃO</button></div>`);$('savePortalHero').onclick=async()=>{try{const img=await fileData($('portalHeroFile'),1200000);if(!img)return alert('Selecione uma imagem.');db.settings=db.settings||{};db.settings.portalHeroImage=img;await saveCloud();closeModal();alert('Foto da capa atualizada.')}catch(e){alert(e.message)}};$('defaultPortalHero').onclick=async()=>{db.settings=db.settings||{};db.settings.portalHeroImage='portal-cover.jpg';await saveCloud();closeModal();alert('Capa padrão restaurada.')}}
function editPublicAbout(){openModal(`<h2>Editar Sobre Nós</h2><label class="field">Breve história<textarea id="aboutText" rows=9>${esc(db.settings?.publicAbout||'')}</textarea></label><button id="saveAbout" class="btn primary">SALVAR</button>`);$('saveAbout').onclick=async()=>{db.settings.publicAbout=$('aboutText').value.trim();await saveCloud();closeModal();alert('Texto atualizado no portal.')}}

function blogPublicMarkup(posts){return `<section class="public-section"><small style="color:#08736f;font-weight:900;letter-spacing:.15em">BLOG NOVA IMAGEM</small><h1>Ideias, ambientes e inspiração.</h1><p>Conteúdos selecionados para ajudar você a escolher cada detalhe do seu ambiente.</p>${posts.length?`<div class="blog-strip">${posts.map(p=>`<article class="blog-card"><img src="${esc(p.image||'inspiration-1.jpg')}" alt="${esc(p.title||'Postagem')}"><div><small>${esc(fmtDate(p.date||p.createdAt||today()))}</small><h3>${esc(p.title||'Sem título')}</h3><p>${esc(p.summary||p.text||'')}</p><button class="site-text-link" data-blog-open="${esc(p.id)}">LER POSTAGEM →</button></div></article>`).join('')}</div>`:'<div class="card"><p class="muted">Nenhuma postagem publicada no momento.</p></div>'}</section>`}
function openBlogPost(post){if(!post)return;openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">${esc(post.title||'Postagem')}</h2></div>${post.image?`<img src="${esc(post.image)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:14px;margin:14px 0">`:''}<p class="muted">${fmtDate(post.date||post.createdAt||today())}</p>${String(post.content||post.text||post.summary||'').split('\n').filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('')}`);bindManagementBack()}
function wireBlogPublic(posts){document.querySelectorAll('[data-blog-open]').forEach(b=>b.onclick=()=>openBlogPost(posts.find(x=>String(x.id)===String(b.dataset.blogOpen))))}
function manageBlog(){if(!isGestor())return;db.blogPosts=db.blogPosts||[];openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">CONFIGURAÇÕES DO BLOG</h2><button id="newBlogPost" class="btn primary">+ NOVA POSTAGEM</button></div><p class="muted">Máximo de 10 postagens cadastradas.</p><div>${db.blogPosts.map(p=>`<div class="inspiration-admin-row"><img src="${esc(p.image||'inspiration-1.jpg')}"><div><strong>${esc(p.title||'Sem título')}</strong><br><small>${p.published===false?'DESPUBLICADA':'PUBLICADA'} • ${fmtDate(p.date||p.createdAt)}</small></div><div class="actions"><button class="btn ghost" data-blog-edit="${p.id}">Editar</button><button class="btn danger" data-blog-del="${p.id}">Excluir</button></div></div>`).join('')||'<p class="muted">Nenhuma postagem cadastrada.</p>'}</div>`);bindManagementBack();$('newBlogPost').onclick=()=>{if(db.blogPosts.length>=10)return alert('O blog está limitado a 10 postagens. Exclua uma postagem antes de criar outra.');editBlogPost()};document.querySelectorAll('[data-blog-edit]').forEach(b=>b.onclick=()=>editBlogPost(db.blogPosts.find(x=>String(x.id)===String(b.dataset.blogEdit))));document.querySelectorAll('[data-blog-del]').forEach(b=>b.onclick=async()=>{const p=db.blogPosts.find(x=>String(x.id)===String(b.dataset.blogDel));if(!p||!confirm(`Excluir a postagem “${p.title}”?`))return;db.blogPosts=db.blogPosts.filter(x=>x.id!==p.id);await saveCloud();manageBlog()})}
function editBlogPost(post=null){const p=post||{id:uid(),published:true,date:today()};openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">${post?'EDITAR':'NOVA'} POSTAGEM</h2></div><div class="grid two" style="margin-top:14px"><label class="field">Título<input id="blogTitle" value="${esc(p.title||'')}"></label><label class="field">Data<input id="blogDate" type="date" value="${esc(p.date||today())}"></label><label class="field" style="grid-column:1/-1">Resumo curto<textarea id="blogSummary" rows="3">${esc(p.summary||'')}</textarea></label><label class="field" style="grid-column:1/-1">Texto completo<textarea id="blogContent" rows="9">${esc(p.content||'')}</textarea></label><label class="field">Foto<input id="blogImage" type="file" accept="image/*"></label><label class="field">Publicação<select id="blogPublished"><option value="1">PUBLICADA</option><option value="0" ${p.published===false?'selected':''}>DESPUBLICADA</option></select></label></div>${p.image?`<img src="${esc(p.image)}" style="width:220px;height:140px;object-fit:cover;border-radius:10px;margin:12px 0">`:''}<div><button id="saveBlogPost" class="btn primary">SALVAR POSTAGEM</button></div>`);bindManagementBack();$('saveBlogPost').onclick=async()=>{try{const title=$('blogTitle').value.trim();if(!title)return alert('Informe o título.');let image=p.image||'';if($('blogImage').files?.[0])image=await fileData($('blogImage'),900000);Object.assign(p,{title,date:$('blogDate').value||today(),summary:$('blogSummary').value.trim(),content:$('blogContent').value.trim(),image,published:$('blogPublished').value==='1',updatedAt:new Date().toISOString(),createdAt:p.createdAt||new Date().toISOString()});db.blogPosts=db.blogPosts||[];if(!post){if(db.blogPosts.length>=10)return alert('O blog está limitado a 10 postagens.');db.blogPosts.unshift(p)}await saveCloud();manageBlog()}catch(e){alert(e.message)}}}
async function loadPublicPortal(tab='inspirations'){try{const r=await fetch('/api/portal'),j=await r.json();const root=$('publicPortalContent');if(tab==='inspirations'){const items=j.inspirations?.length?j.inspirations:V116_DEFAULT_INSPIRATIONS;window._publicInspirations=items;root.innerHTML=inspirationsMarkup(items,true);wireInspirationSearch(root,items)}else if(tab==='blog'){const posts=(j.blogPosts||j.blog||[]).filter(x=>x.published!==false).slice(0,10);root.innerHTML=blogPublicMarkup(posts);wireBlogPublic(posts)}else if(tab==='about'){root.innerHTML=`<section class="public-section"><small style="color:#08736f;font-weight:900;letter-spacing:.15em">NOSSA HISTÓRIA</small><h1>Sobre nós</h1><div class="grid two"><div><h2>Uma história de trabalho, experiência e confiança.</h2>${String(j.about||V117_DEFAULT_ABOUT).split('\n').filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}</div><img src="inspiration-2.jpg" style="width:100%;border-radius:16px;min-height:360px;object-fit:cover"></div><div class="grid two" style="margin-top:30px"><div class="card"><h2>Missão</h2><p>${esc(V117_MISSION)}</p></div><div class="card"><h2>Visão</h2><p>${esc(V117_VISION)}</p></div></div><h2 style="margin-top:35px;color:#075b5b">Nossos valores</h2><div class="about-values">${V117_VALUES.map(v=>`<article class="about-value"><h3>${v[0]}</h3><p>${v[1]}</p></article>`).join('')}</div></section>`}else if(tab==='work'){renderPublicWork(root,j.jobs||[])}else root.innerHTML=`<section class="public-section"><h1>Contato</h1><p>Fale conosco pelo WhatsApp.</p><button class="btn primary" onclick="window.open('https://wa.me/5542988011435','_blank')">WHATSAPP • 42 98801-1435</button></section>`}catch(e){$('publicPortalContent').innerHTML='<section class="public-section"><h2>Não foi possível carregar o portal.</h2></section>'}}
function renderPublicWork(root,jobs){root.innerHTML=`<section class="public-section"><h1>Trabalhe junto conosco</h1><p>Venha fazer parte da nossa equipe ou seja nosso parceiro de negócios.</p><div class="portal-tabs"><button class="btn primary active" data-work-type="VAGA">QUERO UMA VAGA</button><button class="btn ghost" data-work-type="PARCERIA">SOU ARQUITETO / DESIGNER</button></div><div class="public-form"><div class="grid two"><label class="field">Nome completo<input id="cName"></label><label class="field">Telefone / WhatsApp<input id="cContact"></label><label class="field">E-mail<input id="cEmail" type="email"></label><label class="field">Cargo / Interesse<select id="cInterest"><option value="CANDIDATURA ESPONTÂNEA">Candidatura espontânea</option>${jobs.map(x=>`<option value="${esc(x.role)}">${esc(x.role)}</option>`).join('')}</select></label><label class="field" style="grid-column:1/-1">Mensagem<textarea id="cMessage"></textarea></label><label class="field" id="resumeWrap">Currículo (PDF/DOC/DOCX • até 1 MB)<input id="cResume" type="file" accept=".pdf,.doc,.docx"></label></div><button id="sendCandidate" class="btn primary">ENVIAR</button><div id="candidateMsg"></div></div>${jobs.length?`<h2 style="margin-top:32px">Vagas abertas</h2>${jobs.map(x=>`<div class="card"><h3>${esc(x.role)}</h3><p>${esc(x.description)}</p><p><strong>Carga horária:</strong> ${esc(x.hours)} • <strong>Faixa salarial:</strong> ${esc(x.salary)} • <strong>Benefícios:</strong> ${esc(x.benefits)}</p></div>`).join('')}`:''}</section>`;let type='VAGA';root.querySelectorAll('[data-work-type]').forEach(b=>b.onclick=()=>{type=b.dataset.workType;root.querySelectorAll('[data-work-type]').forEach(x=>x.classList.toggle('active',x===b));$('resumeWrap').style.display=type==='VAGA'?'':'none';if(type==='PARCERIA')$('cInterest').innerHTML='<option>PARCERIA DE NEGÓCIOS</option>'});$('sendCandidate').onclick=async()=>{try{let resume='';if(type==='VAGA'&&$('cResume').files?.[0])resume=await fileData($('cResume'),1000000);const f=$('cResume').files?.[0];const r=await fetch('/api/portal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'CANDIDATE',candidate:{type,name:$('cName').value,contact:$('cContact').value,email:$('cEmail').value,interest:$('cInterest').value,message:$('cMessage').value,resume,resumeName:f?.name||''}})}),j=await r.json();if(!r.ok)throw new Error(j.error);$('candidateMsg').innerHTML='<p style="color:#075b5b;font-weight:800">Recebemos seus dados. Obrigado pelo interesse!</p>'}catch(e){$('candidateMsg').textContent=e.message}}}
function renderCandidates(){openModal(`<h2>VER CANDIDATURAS</h2><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Nome</th><th>Contato</th><th>Tipo</th><th>Interesse</th><th>Status</th><th>Ações</th></tr></thead><tbody>${(db.candidates||[]).map(c=>`<tr><td>${fmtDate(String(c.createdAt||'').slice(0,10))}</td><td>${esc(c.name)}</td><td>${esc(c.contact)}</td><td>${esc(c.type)}</td><td>${esc(c.interest)}</td><td>${esc(c.status)}</td><td><button class="btn ghost" data-candidate="${c.id}">Ver</button></td></tr>`).join('')}</tbody></table></div>`);document.querySelectorAll('[data-candidate]').forEach(b=>b.onclick=()=>openCandidate(b.dataset.candidate))}
function openCandidate(id){const c=(db.candidates||[]).find(x=>x.id===id);if(!c)return;openModal(`<h2>${esc(c.name)}</h2><p><strong>${esc(c.type)}</strong> • ${esc(c.interest)}</p><p>${esc(c.contact)} • ${esc(c.email)}</p><p>${esc(c.message)}</p>${c.resume?`<a class="btn secondary" href="${c.resume}" download="${esc(c.resumeName||'curriculo')}">ABRIR CURRÍCULO</a>`:''}<label class="field">Status<select id="candidateStatus">${['NOVA','EM ANÁLISE','CONTATADO','ENCERRADO'].map(x=>`<option ${c.status===x?'selected':''}>${x}</option>`).join('')}</select></label><button id="saveCandidateStatus" class="btn primary">SALVAR STATUS</button>`);$('saveCandidateStatus').onclick=async()=>{c.status=$('candidateStatus').value;await saveCloud();closeModal();renderCandidates()}}
function manageJobs(){openModal(`<h2>VAGAS PUBLICADAS</h2><button id="newJob" class="btn primary">+ ADICIONAR VAGA NO PORTAL</button><div style="margin-top:14px">${(db.jobs||[]).map(j=>`<div class="card"><strong>${esc(j.role)}</strong> • ${j.published===false?'DESPUBLICADA':'PUBLICADA'}<button class="btn ghost" style="float:right" data-job="${j.id}">Editar</button></div>`).join('')}</div>`);$('newJob').onclick=()=>editJob();document.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>editJob(b.dataset.job))}
function editJob(id){const j=(db.jobs||[]).find(x=>x.id===id)||{id:uid(),published:true};openModal(`<h2>${id?'Editar':'Adicionar'} vaga no portal</h2><div class="grid two"><label class="field">Cargo<input id="jRole" value="${esc(j.role||'')}"></label><label class="field">Carga horária<input id="jHours" value="${esc(j.hours||'')}"></label><label class="field">Faixa salarial<input id="jSalary" value="${esc(j.salary||'')}"></label><label class="field">Benefícios<input id="jBenefits" value="${esc(j.benefits||'')}"></label><label class="field" style="grid-column:1/-1">Descrição<textarea id="jDesc">${esc(j.description||'')}</textarea></label><label><input id="jPub" type="checkbox" ${j.published!==false?'checked':''}> Publicar no portal</label></div><button id="jSave" class="btn primary">SALVAR</button>`);$('jSave').onclick=async()=>{Object.assign(j,{role:$('jRole').value,hours:$('jHours').value,salary:$('jSalary').value,benefits:$('jBenefits').value,description:$('jDesc').value,published:$('jPub').checked});if(!id)db.jobs.push(j);await saveCloud();closeModal();manageJobs()}}
// integrações V11.6 sem alterar fluxos existentes
const _v116RenderAll=renderAll;renderAll=function(){ensureV116Data();_v116RenderAll();renderInspirations()};
const _v116SetView=setView;setView=function(id){_v116SetView(id);if(id==='inspirations')renderInspirations()};
document.addEventListener('DOMContentLoaded',()=>{const pub=$('publicInspirationsOpen');if(pub)pub.onclick=()=>{$('loginScreen').classList.add('hidden');$('publicPortal').classList.remove('hidden');loadPublicPortal('inspirations')};$('publicPortalClose')?.addEventListener('click',()=>{$('publicPortal').classList.add('hidden');$('loginScreen').classList.remove('hidden')});document.querySelectorAll('[data-public-tab]').forEach(b=>b.onclick=()=>loadPublicPortal(b.dataset.publicTab));$('manageInspirationsBtn')?.addEventListener('click',manageInspirations);$('manageBlogBtn')?.addEventListener('click',manageBlog);$('viewCandidatesBtn')?.addEventListener('click',renderCandidates);$('manageJobsBtn')?.addEventListener('click',manageJobs)});


/* ===== V11.8 • HOME PÚBLICA ===== */
async function loadPublicHome(){try{const r=await fetch('/api/portal'),j=await r.json();const hero=document.querySelector('.site-hero');if(hero)hero.style.backgroundImage=`url(\"${String(j.heroImage||'portal-cover.jpg').replace(/\"/g,'')}\")`;const items=(j.inspirations?.length?j.inspirations:V116_DEFAULT_INSPIRATIONS).slice(0,3),root=$('homeFeaturedInspirations');if(root)root.innerHTML=items.map(x=>`<article class="site-featured-card"><img src="${esc(x.image||'inspiration-1.jpg')}" alt="${esc(x.title)}"><div><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p><button class="site-text-link" onclick="openPublicTab('inspirations')">VER MODELO →</button></div></article>`).join('')}catch(e){}}
function openPublicTab(tab){$('publicHome')?.classList.add('hidden');$('loginScreen')?.classList.add('hidden');$('publicPortal')?.classList.remove('hidden');loadPublicPortal(tab)}
function showPublicHome(){$('publicPortal')?.classList.add('hidden');$('loginScreen')?.classList.add('hidden');$('clientLoginScreen')?.classList.add('hidden');$('publicHome')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});loadPublicHome()}
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-home-tab]').forEach(b=>b.onclick=()=>openPublicTab(b.dataset.homeTab));document.querySelectorAll('[data-home-top]').forEach(b=>b.onclick=showPublicHome);$('siteLoginBtn')?.addEventListener('click',()=>{$('publicHome').classList.add('hidden');$('loginScreen').classList.remove('hidden');setTimeout(()=>$('loginUser')?.focus(),50)});$('siteClientBtn')?.addEventListener('click',()=>{$('publicHome').classList.add('hidden');$('clientLoginScreen').classList.remove('hidden')});$('siteMenuToggle')?.addEventListener('click',()=>$('siteNav')?.classList.toggle('open'));$('publicPortalClose')?.addEventListener('click',showPublicHome)});
window.openPublicTab=openPublicTab;
document.addEventListener('DOMContentLoaded',()=>{$('clientLoginBack')?.addEventListener('click',showPublicHome);});

/* ===== V11.8 • CONFECÇÃO / BARRAS / TUBOS / ESTOQUE ===== */
const V118_TUBE_COLORS=['PRATA ESCOVADO','CROMADO','IMBUIA','DOURADO','OURO VELHO','MARFIM','BRANCO','PRETO'];
const _v118SetupSelectors=setupSelectors;
setupSelectors=function(){
  _v118SetupSelectors();
  // WAVE: forro compatível e trilho suíço duplo espaçado branco como padrão.
  v118ApplyConditionalForm();
};
function v118DefaultSwissRail(){const rails=officialSwissRails();return rails.find(p=>String(p.internal_code||'').replace(/[^A-Z0-9]/gi,'').toUpperCase()==='NI0007')||rails.find(p=>norm(p.product_name).includes('DUPLO ESPAÇADO')&&norm(p.color)==='BRANCO')||null}
function v118ApplyConditionalForm(){
  const liningOnly=($('eModel')?.value||'')==='LINING';
  const fp=$('eFinishPleat')?.value||'', tube=!liningOnly&&isTubePleat(fp), wave=!liningOnly&&fp==='WAVE';
  // Em APENAS FORRO, o acabamento está oculto e não pode filtrar a prega do forro.
  if(wave){
    const lining=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','WAVE','SOBREPOSTO'];
    if(lining){const old=lining.value;fillSelect(lining,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}
    // WAVE é prega de acabamento. NÃO define nem altera a família de fixação.
  }
  $('eSupportMaterialWrap')?.classList.toggle('hidden',!tube);
  const bar=$('eFinishBar')?.value||'BARRA SIMPLES';$('eSoutacheColorWrap')?.classList.toggle('hidden',!['BARRA SOUTACHE','BARRA SOUTACHE DUPLA'].includes(bar));
  if(tube){setSelectOptions($('eFixColor'),V118_TUBE_COLORS,$('eFixColor')?.value)}
}
const _v118UpdateModelFields=updateModelFields;
updateModelFields=function(){_v118UpdateModelFields();v118ApplyConditionalForm()};
const _v118EnvFromForm=envFromForm;
envFromForm=function(){const e=_v118EnvFromForm();e.finishBar=$('eFinishBar')?.value||'BARRA SIMPLES';e.soutacheColor=$('eSoutacheColor')?.value||'';e.tubeFixation=isTubePleat(e.finishPleat)||isTubePleat(e.liningPleat);if(e.tubeFixation){e.fixColor=$('eFixColor')?.value||e.fixColor;}return e};
const _v118TubeHardwareCalc=tubeHardwareCalc;
tubeHardwareCalc=function(e,c){
  const w=Number(e.width||0)/100,model=e.model,color=e.fixColor||'',mat=norm(e.supportMaterial)==='PVC'?'PVC':'ALUMINIO',supports=w<=2?2:w<=3.5?3:w<=4.5?4:5;
  const tubes=[];if(model!=='LINING')tubes.push(e.finishTube||'TUBO 28 MM');if(model!=='FINISH')tubes.push(e.liningTube||'TUBO 19 MM');
  const supportName=model==='COMPLETE'?`SUPORTE 19/28 ${mat}`:`SUPORTE ${(tubes[0]||'TUBO 28 MM').includes('19')?'19':'28'}MM ${mat}`;
  const support=officialProductByName(supportName,color)||officialProductLike(supportName.split(' '),color);const parts=[];let total=0;
  if(support){parts.push({productId:support.id,name:supportName,qty:supports,unit:'UN'});total+=supports*Number(support.price_4x||0)}
  for(const t of tubes){const size=t.includes('19')?'19':'28',tube=officialProductByName(`TUBO ${size} MM`,color),capName=`TAMPA PARA TUBO EM ALUMINIO ${size}MM`,cap=officialProductByName(capName,color)||officialProductLike(['TAMPA','TUBO',size],color);if(tube){parts.push({productId:tube.id,name:tube.product_name,qty:w,unit:'M'});total+=w*Number(tube.price_4x||0)}if(cap){parts.push({productId:cap.id,name:capName,qty:2,unit:'UN'});total+=2*Number(cap.price_4x||0)}}
  return {kind:tubes.join(' + '),meters:w*tubes.length,supports,ends:tubes.length*2,supportName,supportProductId:support?.id||null,parts,total,hardwareBase:total,detail:`${tubes.join(' + ')} • ${supports} ${supportName.toLowerCase()} • ${tubes.length*2} tampas`};
};
const _v118CalcEnvironment=calcEnvironment;
calcEnvironment=function(e){
  const c=_v118CalcEnvironment(e);if(!c)return c;
  const bar=e.finishBar||'BARRA SIMPLES',barMeters=Number(c.finishCalc?.gathered||0);let laborRate=0,soutacheFactor=0;
  if(bar==='BARRA TOMBADA')laborRate=15;if(bar==='BARRA SOUTACHE'){laborRate=20;soutacheFactor=1}if(bar==='BARRA SOUTACHE DUPLA'){laborRate=35;soutacheFactor=2}
  const barLabor=barMeters*laborRate,soutacheMeters=barMeters*soutacheFactor,soutache=soutacheMeters?officialProductByName('SOUTACHE',e.soutacheColor):null,soutacheCost=soutacheMeters*Number(soutache?.price_4x||0);
  c.barType=bar;c.barMeters=barMeters;c.barLabor=barLabor;c.soutacheMeters=soutacheMeters;c.soutacheProductId=soutache?.id||null;c.soutacheCost=soutacheCost;c.laborTotal=Number(c.laborTotal||0)+barLabor;c.base4=Number(c.base4||0)+barLabor+soutacheCost;c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);return c;
};
const _v118OfficialOrderRequirements=officialOrderRequirements;
officialOrderRequirements=function(q){const rows=_v118OfficialOrderRequirements(q);for(const e of q.environments||[]){const c=calcEnvironment(e);if(c?.soutacheMeters>0){const p=officialProductById(c.soutacheProductId);if(p)rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'M',qty:c.soutacheMeters,environment:e.name,environments:[e.name],source:'SOUTACHE DA BARRA',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)})}if(e.tubeFixation&&Array.isArray(c?.fixationCalc?.parts)){for(const x of c.fixationCalc.parts){const p=officialProductById(x.productId);if(p&&!rows.some(r=>r.product_id===Number(p.id)&&r.environment===e.name&&r.source===x.name))rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||x.unit||'UN',qty:Number(x.qty||0),environment:e.name,environments:[e.name],source:x.name,cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)})}}}return rows};
function v118TechnicalSummary(e){const c=calcEnvironment(e);if(!c)return '';return [e.finishPleat,e.finish,e.finishColor,e.liningPleat,e.fixation,e.railProductName||'',e.finishBar,e.soutacheColor?`SOUTACHE ${e.soutacheColor}`:''].filter(Boolean).join(' • ')}
document.addEventListener('DOMContentLoaded',()=>{
  $('eFinishPleat')?.addEventListener('change',()=>{v118ApplyConditionalForm();updatePreview()});
  $('eFinishBar')?.addEventListener('change',()=>{v118ApplyConditionalForm();updatePreview()});
  $('eSoutacheColor')?.addEventListener('change',updatePreview);
  $('eFixColor')?.addEventListener('change',updatePreview);
});

/* ===== V11.9 • CONSOLIDAÇÃO ===== */
const V119_WARRANTY=`GARANTIA, USO E CONSERVAÇÃO\n\nA Nova Imagem Cortinas e Persianas oferece garantia de 12 (doze) meses, contados a partir da data de instalação ou entrega do produto, contra defeitos de fabricação e/ou instalação atribuíveis aos produtos e serviços fornecidos pela empresa.\n\nA garantia compreende, mediante avaliação técnica, a correção de defeitos relacionados à confecção, montagem ou instalação do produto.\n\nEXCLUSÕES DA GARANTIA\nA garantia não cobre danos decorrentes de mau uso, acidentes, impactos, cortes, rasgos, manchas, contato com produtos químicos, umidade inadequada, exposição a condições incompatíveis com o produto, alterações realizadas por terceiros, desgaste normal ou utilização em desacordo com as orientações de conservação. Também não estão cobertas intervenções, desmontagens, reparos ou modificações realizadas por pessoas não autorizadas pela Nova Imagem.\n\nLIMPEZA E CONSERVAÇÃO\nA limpeza rotineira deverá ser realizada preferencialmente por aspiração suave, com equipamento e acessórios adequados para tecidos. Quando necessária a lavagem, recomenda-se profissional ou empresa especializada em limpeza de cortinas. Caso a lavagem seja realizada por conta do cliente, deverão ser respeitadas as orientações fornecidas pela Nova Imagem, utilizando exclusivamente sabão ou detergente neutro, sem alvejantes, abrasivos, solventes ou agentes químicos incompatíveis.\n\nDanos decorrentes de lavagem inadequada, realizada sem observância destas orientações ou com produtos incompatíveis, não são cobertos pela garantia. A lavagem, manutenção ou intervenção inadequada que comprovadamente cause ou contribua para o defeito reclamado poderá resultar na perda da garantia relacionada ao dano ocasionado.\n\nA conservação adequada é indispensável para preservar aparência, funcionamento e durabilidade do produto.`;
const V119_BLINDS=[
{id:'INS-P01',title:'Persiana Rolô Blackout',fabric:'PERSIANA',pleat:'ROLÔ BLACKOUT',fixation:'PERSIANA ROLÔ',colors:['BRANCO','MARFIM'],environment:'Quarto • Home theater • Escritório',description:'Controle intenso de luminosidade e privacidade com visual limpo e contemporâneo.',care:'Limpeza por aspiração suave ou pano seco. Não utilizar produtos abrasivos.',image:'inspiration-4.jpg',keywords:'persiana rolo rolô blackout quarto',published:true,category:'PERSIANAS'},
{id:'INS-P02',title:'Persiana Rolô Screen',fabric:'PERSIANA',pleat:'ROLÔ SCREEN',fixation:'PERSIANA ROLÔ',colors:['BRANCO','BEGE','CINZA'],environment:'Sala • Escritório • Ambientes integrados',description:'Filtra a incidência solar preservando a leveza visual e a integração com o ambiente externo.',care:'Aspiração suave ou pano levemente úmido.',image:'inspiration-3.jpg',keywords:'persiana rolo rolô screen solar tela',published:true,category:'PERSIANAS'},
{id:'INS-P03',title:'Persiana Double Vision',fabric:'PERSIANA',pleat:'DOUBLE VISION',fixation:'PERSIANA',colors:['BRANCO','MARFIM','CINZA'],environment:'Sala • Quarto • Escritório',description:'Faixas alternadas que permitem modular luz e privacidade com praticidade.',care:'Aspiração suave. Evitar umidade excessiva e produtos químicos.',image:'inspiration-2.jpg',keywords:'persiana double vision dupla visão',published:true,category:'PERSIANAS'},
{id:'INS-P04',title:'Persiana Romana',fabric:'PERSIANA',pleat:'ROMANA',fixation:'PERSIANA ROMANA',colors:['BRANCO','MARFIM','BEGE'],environment:'Sala • Quarto • Escritório',description:'Dobras horizontais elegantes para ambientes que pedem acabamento sofisticado.',care:'Aspiração suave e limpeza especializada conforme o tecido.',image:'inspiration-1.jpg',keywords:'persiana romana dobra',published:true,category:'PERSIANAS'}];
function ensureV119(){db.settings=db.settings||{};const c=companySettings();c.version='V11.9';c.warranty=c.warranty||V119_WARRANTY;c.installCost=Number(c.installCost||0);c.sewingCost=Number(c.sewingCost||db.priceConfig?.sewingCost||0);db.settings.documentVersions=db.settings.documentVersions||[];db.portalAnalytics=db.portalAnalytics||{views:0,visitors:0,events:{}};db.inspirations=db.inspirations||[];for(const x of V119_BLINDS)if(!db.inspirations.some(y=>y.id===x.id))db.inspirations.push(clone(x))}
const _v119LoadCloud=loadCloud;loadCloud=async function(){await _v119LoadCloud();ensureV119();renderAll()};
// Argolas: WAVE não é opção de forro.
const _v119Conditional=v118ApplyConditionalForm;v118ApplyConditionalForm=function(){_v119Conditional();const fp=$('eFinishPleat')?.value||'';if(['FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM'].includes(fp)){const el=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];if(el){const old=el.value;fillSelect(el,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}}};
// Cortina em ângulo (L): largura de cálculo = soma dos trechos, preservando medidas.
const _v119EnvFromForm=envFromForm;envFromForm=function(){const e=_v119EnvFromForm();if($('eAngle')?.checked){const a=Number($('eAngleA')?.value||0),b=Number($('eAngleB')?.value||0);if(a>0&&b>0){e.angle=true;e.angleA=a;e.angleB=b;e.width=a+b}}else e.angle=false;return e};
document.addEventListener('DOMContentLoaded',()=>{$('eAngle')?.addEventListener('change',()=>{$('eAngleFields')?.classList.toggle('hidden',!$('eAngle').checked);if($('eAngle').checked&&$('eWidth').value&&!$('eAngleA').value)$('eAngleA').value=$('eWidth').value;updatePreview()});['eAngleA','eAngleB'].forEach(id=>$(id)?.addEventListener('input',updatePreview))});
// Configurações, histórico e versionamento documental.
function v119DocVersion(type,text){db.settings.documentVersions=db.settings.documentVersions||[];const last=[...db.settings.documentVersions].reverse().find(x=>x.type===type);if(last?.text===text)return last.version;const version=(db.settings.documentVersions.filter(x=>x.type===type).length+1);db.settings.documentVersions.push({type,version,text,at:new Date().toISOString(),by:currentUsername()});return version}
renderSettings=function(){ensureV119();const c=companySettings();[['cfgTradeName','tradeName'],['cfgLegalName','legalName'],['cfgCnpj','cnpj'],['cfgIe','ie'],['cfgAddress','address'],['cfgPhone','phone'],['cfgVersion','version'],['cfgClauses','clauses'],['cfgWarranty','warranty'],['cfgSewingCost','sewingCost'],['cfgInstallCost','installCost']].forEach(([id,k])=>{if($(id))$(id).value=c[k]??''})};
saveCompanySettings=function(){ensureV119();const c=companySettings(),before=clone(c);Object.assign(c,{tradeName:$('cfgTradeName').value.trim(),legalName:$('cfgLegalName').value.trim(),cnpj:$('cfgCnpj').value.trim(),ie:$('cfgIe').value.trim(),address:$('cfgAddress').value.trim(),phone:$('cfgPhone').value.trim(),version:'V11.9',sewingCost:Number($('cfgSewingCost').value||0),installCost:Number($('cfgInstallCost').value||0),clauses:$('cfgClauses').value.trim(),warranty:$('cfgWarranty').value.trim()||V119_WARRANTY});if(before.clauses!==c.clauses)v119DocVersion('CONTRATO',c.clauses);if(before.warranty!==c.warranty)v119DocVersion('GARANTIA',c.warranty);for(const k of Object.keys(c))if(JSON.stringify(before[k])!==JSON.stringify(c[k]))audit('CONFIGURAÇÕES','ALTERAÇÃO',k,`Anterior: ${String(before[k]??'').slice(0,600)} | Novo: ${String(c[k]??'').slice(0,600)}`);if(db.priceConfig)db.priceConfig.sewingCost=c.sewingCost;queueSave();alert('Configurações salvas e versionadas.')};
const _v119Finalize=finalizeQuoteOrder;finalizeQuoteOrder=async function(...args){ensureV119();const o=await _v119Finalize(...args);if(o){const c=companySettings();o.documentVersions={contractVersion:v119DocVersion('CONTRATO',c.clauses||''),warrantyVersion:v119DocVersion('GARANTIA',c.warranty||V119_WARRANTY),contractText:c.clauses||'',warrantyText:c.warranty||V119_WARRANTY,frozenAt:new Date().toISOString()};queueSave()}return o};
function printWarranty(order=null){ensureV119();const c=companySettings(),text=order?.documentVersions?.warrantyText||c.warranty||V119_WARRANTY;printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>${esc(c.tradeName)}</strong><br>${esc(c.address)}<br>${esc(c.phone)}<br><br><strong>TERMO DE GARANTIA</strong></div></div>${order?`<p><strong>Pedido:</strong> ${String(order.numero).padStart(6,'0')} • <strong>Cliente:</strong> ${esc(order.client)}</p>`:''}<div style="white-space:pre-line;line-height:1.55">${esc(text)}</div><br><p>Cliente: ____________________________________ &nbsp;&nbsp; CPF: ____________________</p><p>Data: ____/____/________ &nbsp;&nbsp; Assinatura: ____________________________________</p><p class="muted">Documento emitido em ${new Date().toLocaleString('pt-BR')} • Nova Imagem Cortinas e Persianas</p>`)}
const _v119Commercial=renderCommercialPanel;renderCommercialPanel=function(){_v119Commercial();const box=$('commercialPanelBody');if(box&&!$('commercialWarrantyBtn'))box.insertAdjacentHTML('afterbegin','<div class="card" style="margin-bottom:14px"><div class="card-title">Documentos comerciais</div><button id="commercialWarrantyBtn" class="btn secondary">TERMO DE GARANTIA • PDF</button></div>');$('commercialWarrantyBtn')?.addEventListener('click',()=>printWarranty())};
// Auditoria com filtros combináveis e PDF.
function filteredAudit(){const u=$('auditUser')?.value||'',ar=$('auditArea')?.value||'',ac=$('auditAction')?.value||'',f=$('auditFrom')?.value||'',t=$('auditTo')?.value||'';return (db.auditLog||[]).filter(x=>(!u||x.by===u)&&(!ar||x.area===ar)&&(!ac||x.action===ac)&&(!f||String(x.at).slice(0,10)>=f)&&(!t||String(x.at).slice(0,10)<=t))}
renderAudit=function(){const tb=$('auditTable');if(!tb)return;const set=(id,vals)=>{const e=$(id),cur=e?.value||'';if(e){e.innerHTML='<option value="">TODOS</option>'+vals.map(v=>`<option>${esc(v)}</option>`).join('');e.value=cur}};set('auditUser',[...new Set((db.auditLog||[]).map(x=>x.by).filter(Boolean))].sort());set('auditArea',[...new Set((db.auditLog||[]).map(x=>x.area).filter(Boolean))].sort());set('auditAction',[...new Set((db.auditLog||[]).map(x=>x.action).filter(Boolean))].sort());const rows=filteredAudit().slice(0,2000);tb.innerHTML=rows.map(a=>`<tr><td>${new Date(a.at).toLocaleString('pt-BR')}</td><td>${esc(a.by||'-')}</td><td>${esc(a.area||'-')}</td><td>${esc(a.action||'-')}</td><td>${esc(a.reference||'-')}</td><td>${esc(a.detail||'-')}</td></tr>`).join('')||'<tr><td colspan="6">Nenhum evento registrado.</td></tr>'}
function printAudit(){const rows=filteredAudit();printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas e Persianas</strong><br><strong>RELATÓRIO DE AUDITORIA</strong><br>Gerado por ${esc(sellerName(currentUsername()))} em ${new Date().toLocaleString('pt-BR')}</div></div><table class="summary-table"><tr><th>Data/hora</th><th>Usuário</th><th>Área</th><th>Ação</th><th>Referência</th><th>Detalhe</th></tr>${rows.map(a=>`<tr><td>${new Date(a.at).toLocaleString('pt-BR')}</td><td>${esc(a.by)}</td><td>${esc(a.area)}</td><td>${esc(a.action)}</td><td>${esc(a.reference)}</td><td>${esc(a.detail)}</td></tr>`).join('')}</table>`)}
document.addEventListener('change',e=>{if(['auditUser','auditArea','auditAction','auditFrom','auditTo'].includes(e.target?.id))renderAudit()});document.addEventListener('click',e=>{if(e.target?.id==='auditPdfBtn')printAudit()});
// Inspirações: persianas como categoria própria e origem do lead no WhatsApp.
const _v119EnsureInsp=ensureV116Data;ensureV116Data=function(){_v119EnsureInsp();for(const x of V119_BLINDS)if(!db.inspirations.some(y=>y.id===x.id))db.inspirations.push(clone(x))};
const _v119InspMarkup=inspirationsMarkup;inspirationsMarkup=function(items,publicMode=false){let html=_v119InspMarkup(items,publicMode);html=html.replace('<div class="inspiration-cats">','<div class="inspiration-segments"><button class="btn primary" data-insp-segment="TODOS">Todos</button><button class="btn ghost" data-insp-segment="CORTINAS">Cortinas</button><button class="btn ghost" data-insp-segment="PERSIANAS">Persianas</button></div><div class="inspiration-cats">');return html};
const _v119Wire=wireInspirationSearch;wireInspirationSearch=function(root,items){_v119Wire(root,items);root.querySelectorAll('[data-insp-segment]').forEach(b=>b.onclick=()=>{const seg=b.dataset.inspSegment;root.querySelectorAll('[data-insp-segment]').forEach(x=>{x.classList.toggle('primary',x===b);x.classList.toggle('ghost',x!==b)});const grid=root.querySelector('#inspGrid'),count=root.querySelector('#inspCount');const arr=items.filter(x=>seg==='TODOS'||(seg==='PERSIANAS'?norm(x.category)==='PERSIANAS':norm(x.category)!=='PERSIANAS'));grid.innerHTML=arr.map(inspirationCard).join('');if(count)count.textContent=`${arr.length} modelo(s) encontrado(s)`})};
window.wantInspiration=function(id){const x=[...(db.inspirations||[]),...(window._publicInspirations||[]),...V116_DEFAULT_INSPIRATIONS,...V119_BLINDS].find(y=>y.id===id);if(!x)return;portalEvent('WHATSAPP_INSPIRACAO',{ref:x.id});const phone='5542988011435',text=`Olá! Vi este modelo no catálogo de Inspirações da Nova Imagem e gostaria de fazer um orçamento.\n\nModelo: ${x.title}\nFixação: ${x.fixation||'-'}\nReferência: ${x.id}\nOrigem: Portal Nova Imagem — Inspirações`;window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank')};
// Candidatura: áreas, consentimento e exclusão pelo gestor.
renderPublicWork=function(root,jobs){root.innerHTML=`<section class="public-section"><h1>Trabalhe junto conosco</h1><p>Venha fazer parte da nossa equipe ou seja nosso parceiro de negócios.</p><div class="portal-tabs"><button class="btn primary active" data-work-type="VAGA">QUERO UMA VAGA</button><button class="btn ghost" data-work-type="PARCERIA">SOU ARQUITETO / DESIGNER</button></div><div class="public-form"><div class="grid two"><label class="field">Nome completo<input id="cName"></label><label class="field">Telefone / WhatsApp<input id="cContact"></label><label class="field">E-mail<input id="cEmail" type="email"></label><label class="field">Cargo / Interesse<select id="cInterest"><option value="CANDIDATURA ESPONTÂNEA">Candidatura espontânea</option>${jobs.map(x=>`<option value="${esc(x.role)}">${esc(x.role)}</option>`).join('')}</select></label><label class="field" id="candidateAreaWrap">Área de interesse<select id="cArea"><option>VENDAS</option><option>INSTALAÇÕES</option><option>CONFECÇÃO</option><option>ADMINISTRATIVO</option><option>ESTÁGIO</option></select></label><label class="field" style="grid-column:1/-1">Mensagem<textarea id="cMessage"></textarea></label><label class="field" id="resumeWrap">Currículo (PDF/DOC/DOCX • até 1 MB)<input id="cResume" type="file" accept=".pdf,.doc,.docx"></label></div><label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0"><input id="cConsent" type="checkbox" style="width:auto;margin-top:3px"> Autorizo o uso dos dados e do currículo para contato e participação nos processos seletivos da Nova Imagem.</label><button id="sendCandidate" class="btn primary">ENVIAR</button><div id="candidateMsg"></div></div>${jobs.length?`<h2 style="margin-top:32px">Vagas abertas</h2>${jobs.map(x=>`<div class="card"><h3>${esc(x.role)}</h3><p>${esc(x.description)}</p><p><strong>Carga horária:</strong> ${esc(x.hours)} • <strong>Faixa salarial:</strong> ${esc(x.salary)} • <strong>Benefícios:</strong> ${esc(x.benefits)}</p></div>`).join('')}`:''}</section>`;let type='VAGA';const refresh=()=>{$('resumeWrap').style.display=type==='VAGA'?'':'none';$('candidateAreaWrap').style.display=type==='VAGA'&&$('cInterest').value==='CANDIDATURA ESPONTÂNEA'?'':'none'};root.querySelectorAll('[data-work-type]').forEach(b=>b.onclick=()=>{type=b.dataset.workType;root.querySelectorAll('[data-work-type]').forEach(x=>x.classList.toggle('active',x===b));if(type==='PARCERIA')$('cInterest').innerHTML='<option>PARCERIA DE NEGÓCIOS</option>';refresh()});$('cInterest').onchange=refresh;refresh();$('sendCandidate').onclick=async()=>{try{if(!$('cConsent').checked)return alert('Confirme a autorização para uso dos dados.');let resume='';if(type==='VAGA'&&$('cResume').files?.[0])resume=await fileData($('cResume'),1000000);const f=$('cResume').files?.[0],interest=$('cInterest').value,area=(type==='VAGA'&&interest==='CANDIDATURA ESPONTÂNEA')?$('cArea').value:'';const r=await fetch('/api/portal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'CANDIDATE',candidate:{type,name:$('cName').value,contact:$('cContact').value,email:$('cEmail').value,interest,area,message:$('cMessage').value,resume,resumeName:f?.name||'',consent:true}})}),j=await r.json();if(!r.ok)throw new Error(j.error);portalEvent('CANDIDATURA',{type,area});$('candidateMsg').innerHTML='<p style="color:#075b5b;font-weight:800">Recebemos seus dados. Obrigado pelo interesse!</p>'}catch(e){$('candidateMsg').textContent=e.message}}};
const _v119OpenCandidate=openCandidate;openCandidate=function(id){_v119OpenCandidate(id);const c=(db.candidates||[]).find(x=>x.id===id);if(c&&$('modalBody')){$('modalBody').insertAdjacentHTML('beforeend',`<p><strong>Área:</strong> ${esc(c.area||'-')}</p><button id="deleteCandidate" class="btn danger">EXCLUIR CANDIDATURA / CURRÍCULO</button>`);$('deleteCandidate').onclick=async()=>{if(confirm('Excluir definitivamente esta candidatura e o currículo?')){db.candidates=db.candidates.filter(x=>x.id!==id);audit('DEPARTAMENTO PESSOAL','EXCLUSÃO','CANDIDATURA',c.name);await saveCloud();closeModal();renderCandidates()}}}};
// Analytics do portal.
async function portalEvent(event,meta={}){try{await fetch('/api/portal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'EVENT',event,meta,visitor:localStorage.getItem('niVisitor')||''})})}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{let v=localStorage.getItem('niVisitor');if(!v){v=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random());localStorage.setItem('niVisitor',v)}portalEvent('PAGE_VIEW',{path:location.pathname});document.querySelectorAll('[data-home-tab="inspirations"]').forEach(b=>b.addEventListener('click',()=>portalEvent('INSPIRACOES_ABERTAS')));$('siteClientBtn')?.addEventListener('click',()=>portalEvent('ACOMPANHAR_PEDIDO'));});
const _v119Nps=renderNpsResults;renderNpsResults=function(){_v119Nps();const a=db.portalAnalytics||{},events=a.events||{},box=$('portalAnalyticsCards');if(box)box.innerHTML=[['Visualizações',a.views||0],['Visitantes',a.visitors||0],['Interações',a.interactions||0],['WhatsApp / modelo',events.WHATSAPP_INSPIRACAO||0],['Inspirações',events.INSPIRACOES_ABERTAS||0],['Acompanhar pedido',events.ACOMPANHAR_PEDIDO||0],['Candidaturas',events.CANDIDATURA||0]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');if($('portalAnalyticsDetail'))$('portalAnalyticsDetail').textContent='Métricas acumuladas do portal público. Visualizações e visitantes são separados quando o navegador permite identificação anônima local.'};
// Banco ampliado de frases (curadoria de temas: filosofia, economia, inovação e trabalho).
const V119_QUOTES=[['A dificuldade não está nas novas ideias, mas em escapar das antigas.','John Maynard Keynes'],['O valor de uma ideia está no uso que se faz dela.','Thomas Edison'],['A excelência é um hábito construído pela repetição.','Aristóteles — ideia atribuída à tradição aristotélica'],['Sorte é o que acontece quando preparação encontra oportunidade.','Sêneca — atribuição tradicional'],['Não explique sua filosofia. Incorpore-a.','Epicteto'],['Conhecimento é poder.','Francis Bacon'],['A inovação distingue um líder de um seguidor.','Steve Jobs'],['Qualidade significa fazer certo quando ninguém está olhando.','Henry Ford'],['O que pode ser medido pode ser melhor administrado.','Princípio de gestão'],['Planos são inúteis; planejamento é indispensável.','Dwight D. Eisenhower'],['Não há vento favorável para quem não sabe aonde vai.','Sêneca — atribuição tradicional'],['A simplicidade é o último grau de sofisticação.','Leonardo da Vinci — atribuição tradicional'],['A experiência é o nome que damos aos nossos erros.','Oscar Wilde'],['O começo é a parte mais importante do trabalho.','Platão — atribuição tradicional'],['A ação é a chave fundamental de todo sucesso.','Pablo Picasso'],['O progresso depende da mudança.','George Bernard Shaw'],['A melhor maneira de prever o futuro é criá-lo.','Peter Drucker — atribuição popular'],['Tempo é o recurso mais escasso.','Peter Drucker'],['Resultados são obtidos explorando oportunidades, não resolvendo problemas.','Peter Drucker'],['A produtividade é tornar o trabalho mais inteligente.','Princípio de gestão'],['O cliente é a razão de existir de uma empresa.','Princípio de gestão'],['Preço é o que você paga; valor é o que você recebe.','Warren Buffett'],['Risco vem de não saber o que você está fazendo.','Warren Buffett'],['O conhecimento cresce quando é compartilhado.','Princípio de aprendizagem'],['Toda melhoria começa com uma pergunta.','Princípio de melhoria contínua'],['Processos claros libertam energia para criar.','Princípio de gestão'],['Tecnologia é melhor quando aproxima as pessoas.','Matt Mullenweg'],['A estratégia é escolher o que não fazer.','Michael Porter'],['Competição é a força que impulsiona a melhoria.','Princípio econômico'],['Inovação é a combinação de conhecimento com execução.','Princípio de inovação'],['Uma empresa aprende quando suas pessoas aprendem.','Princípio organizacional'],['Excelência não é um ato isolado, mas uma prática.','Princípio de excelência'],['Quem tem um porquê enfrenta quase qualquer como.','Friedrich Nietzsche — paráfrase'],['A vida sem reflexão não vale a pena ser vivida.','Sócrates — tradição platônica'],['Nenhum homem é livre se não for senhor de si mesmo.','Epicteto'],['Faça cada coisa como se fosse a última.','Marco Aurélio — paráfrase'],['A riqueza das nações nasce da produtividade do trabalho.','Adam Smith — síntese'],['A destruição criativa renova a economia.','Joseph Schumpeter — síntese'],['Informação reduz incerteza; decisão transforma informação em ação.','Princípio de gestão'],['Melhorar um pouco todos os dias produz grandes mudanças.','Princípio de melhoria contínua'],['Uma boa reputação é construída em muitas decisões pequenas.','Princípio empresarial'],['Não basta estar ocupado; é preciso saber com quê.','Henry David Thoreau — paráfrase'],['A disciplina transforma intenção em resultado.','Princípio de execução'],['A confiança leva anos para ser construída e minutos para ser perdida.','Princípio empresarial'],['A pergunta certa vale mais que uma resposta apressada.','Princípio de investigação'],['O trabalho bem feito é uma forma de respeito.','Princípio de excelência'],['Crescer sem processo é apenas aumentar a desordem.','Princípio de gestão'],['O melhor sistema é aquele que ajuda pessoas a decidir melhor.','Princípio de design'],['Bom design torna o complexo compreensível.','Princípio de design'],['Toda empresa é, antes de tudo, uma organização de pessoas.','Princípio organizacional']];
const _v119Home=renderHome;renderHome=function(){_v119Home();const q=V119_QUOTES[Math.floor(Math.random()*V119_QUOTES.length)];if($('homeQuote'))$('homeQuote').textContent='“'+q[0]+'”';if($('homeQuoteAuthor'))$('homeQuoteAuthor').textContent='— '+q[1]};

/* ===== V11.9.1 • MOTOR DE CONFECÇÃO / CADASTRO PF-PJ ===== */
function v1191IsBlackout(name){const n=norm(name);return n.includes('BLACKOUT 100% LEVE')||n.includes('BLACKOUT 100% PESADO')}
function v1191GatherOptions(selectId){const el=$(selectId);if(!el)return;const isFinish=selectId==='eFinishGather',fabric=$(isFinish?'eFinish':'eLining')?.value||'',pleat=$(isFinish?'eFinishPleat':'eLiningPleat')?.value||'';let opts=pleat==='WAVE'?['2.0','2.5','3.0','3.5','4.0']:['1.5','2.0','2.5','3.0','3.5','4.0'];if(v1191IsBlackout(fabric)&&pleat!=='WAVE')opts.push('PAINEL');const old=el.value;fillSelect(el,opts,opts.includes(old)?old:(pleat==='SOBREPOSTO'?'4.0':(pleat==='WAVE'?(isFinish?'3.0':'2.0'):(isFinish?'3.0':'2.0'))));if(pleat==='SOBREPOSTO'){el.value='4.0';el.disabled=true}else el.disabled=false}
function v1191CompatibleFixations(){const fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'',tube=isTubePleat(fp)||isTubePleat(lp);if(tube)return [];const opts=[];if(officialSwissRails().length)opts.push('TRILHO SUÍÇO');if(fixationColors('VARÃO WAVE').length)opts.push('VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA');opts.push('TRILHO MOTORIZADO');return opts}
function v1191FixProducts(kind){const n=norm(kind);if(n==='TRILHO SUÍÇO')return officialSwissRails();if(n.startsWith('VARÃO WAVE'))return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).includes('VARÃO WAVE 28'));if(n==='TUBO 19 MM'||n==='TUBO 28 MM')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name)===n);return []}
function v1191RefreshFixProduct(){const kind=$('eFixation')?.value||'',sel=$('eRailProduct'),wrap=$('eRailProductWrap'),colorWrap=$('eFixColorWrap');if(!sel)return;const list=v1191FixProducts(kind),show=list.length>0;if(wrap)wrap.classList.toggle('hidden',!show);if(colorWrap)colorWrap.classList.toggle('hidden',show);if(show){const old=sel.value;sel.innerHTML='<option value="">SELECIONE O PRODUTO</option>'+list.map(p=>`<option value="${p.id}">${esc(p.product_name)} • ${esc(p.color||'SEM COR')} • ${esc(p.internal_code||'-')} • ${money(p.price_4x||0)}/${esc(p.unit||'M')} • estoque ${Number(p.stock_quantity||0).toFixed(2)} ${esc(p.unit||'M')}</option>`).join('');if([...sel.options].some(o=>o.value===old))sel.value=old;else if(kind==='TRILHO SUÍÇO'){const d=v118DefaultSwissRail();if(d)sel.value=String(d.id)}}}
function v1191Conditional(){const liningOnly=($('eModel')?.value||'')==='LINING';const fp=$('eFinishPleat')?.value||'',tube=(!liningOnly&&isTubePleat(fp))||isTubePleat($('eLiningPleat')?.value||''),wave=!liningOnly&&fp==='WAVE';if(liningOnly){const el=$('eLiningPleat'),all=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];if(el){const old=el.value;fillSelect(el,all,all.includes(old)?old:'FRANZIDO SUÍÇO')}}else if(['FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM'].includes(fp)){const el=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];if(el){const old=el.value;fillSelect(el,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}}else if(wave){const el=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];if(el){const old=el.value;fillSelect(el,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}}else{const el=$('eLiningPleat'),all=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];if(el){const old=el.value;fillSelect(el,all,all.includes(old)?old:'FRANZIDO SUÍÇO')}}
  if(!tube){const fix=v1191CompatibleFixations(),el=$('eFixation');if(el){const old=el.value;setSelectOptions(el,fix,fix.includes(old)?old:fix[0])}}
  v1191GatherOptions('eFinishGather');v1191GatherOptions('eLiningGather');v1191RefreshFixProduct();const motorL=$('eAngle')?.checked&&$('eFixation')?.value==='TRILHO MOTORIZADO';$('eMotorAngleWrap')?.classList.toggle('hidden',!motorL);if($('eWidth'))$('eWidth').readOnly=!!$('eAngle')?.checked;
}
const _v1191FabricCalc=fabricCalc;
fabricCalc=function(type,name,widthM,heightM,gather,productId,color){if(String(gather)==='PAINEL'){const category=type==='finish'?'TECIDO DE ACABAMENTO':'TECIDO DE FORRO';const hCm=heightM*100;let sku=(priceProducts||[]).find(p=>Number(p.id)===Number(productId));if(!sku)sku=resolveOfficialFabric(category,name,color,hCm);if(!sku)return null;const gathered=widthM+1,fabricWidth=officialFabricWidthCm(sku),cutLength=heightM+0.10+(heightM*0.10),panels=Math.ceil(gathered/(fabricWidth/100)),consumption=panels*cutLength,unitPrice=Number(sku.price_4x||0);return {name,gathered,mode:'ALTURA',panels,cutLength,consumption,unitPrice,pricePct:0,cost:consumption*unitPrice,productId:sku.id,internalCode:sku.internal_code,officialName:sku.product_name,fabricWidthCm:fabricWidth,panelMode:true}}return _v1191FabricCalc(type,name,widthM,heightM,gather,productId,color)};
function v1191AngleLayer(type,e,sideWidthCm,sideHeightCm){const finish=type==='finish',name=finish?e.finish:e.lining,color=finish?e.finishColor:e.liningColor,gather=finish?e.finishGather:e.liningGather,pid=finish?e.finishProductId:e.liningProductId;return fabricCalc(type,name,sideWidthCm/100,sideHeightCm/100,gather,pid,color)}
const _v1191CalcEnvironment=calcEnvironment;
calcEnvironment=function(e){if(!e.angle)return _v1191CalcEnvironment(e);const aW=Number(e.angleA||0),bW=Number(e.angleB||0),aH=Number(e.angleAHeight||e.height||0),bH=Number(e.angleBHeight||e.height||0);if(!aW||!bW||!aH||!bH)return _v1191CalcEnvironment(e);const proxy={...e,angle:false,width:aW+bW,height:Math.max(aH,bH)};let c=_v1191CalcEnvironment(proxy);if(!c)return c;const fa=e.model!=='LINING'?v1191AngleLayer('finish',e,aW,aH):null,fb=e.model!=='LINING'?v1191AngleLayer('finish',e,bW,bH):null,la=e.model!=='FINISH'?v1191AngleLayer('lining',e,aW,aH):null,lb=e.model!=='FINISH'?v1191AngleLayer('lining',e,bW,bH):null;function merge(x,y){if(!x&&!y)return null;const z=x||y;return {...z,gathered:Number(x?.gathered||0)+Number(y?.gathered||0),panels:Number(x?.panels||0)+Number(y?.panels||0),consumption:Number(x?.consumption||0)+Number(y?.consumption||0),cost:Number(x?.cost||0)+Number(y?.cost||0),angleParts:[x,y]}}const oldFabric=Number(c.finishCalc?.cost||0)+Number(c.liningCalc?.cost||0),finish=merge(fa,fb),lining=merge(la,lb),newFabric=Number(finish?.cost||0)+Number(lining?.cost||0);c.finishCalc=finish;c.liningCalc=lining;c.base4+=newFabric-oldFabric;c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);c.angleDetail=`Lado A ${aW}×${aH} cm • Lado B ${bW}×${bH} cm`;if(e.fixation==='TRILHO MOTORIZADO'&&e.motorAngleMode==='MULTIPLOS'){const motors=e.model==='COMPLETE'?4:2,old=Number(c.fixationCalc?.total||0),railsBase=Number(c.fixationCalc?.hardwareBase||0),total=motors*2000+railsBase;c.fixationCalc={...c.fixationCalc,total,detail:`MOTORIZAÇÃO EM L — MÚLTIPLOS MOTORES • ${motors} motores × ${money(2000)} + trilhos`,motors};c.base4=c.base4-old+total;c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100)}return c};
const _v1191EnvFromForm=envFromForm;
envFromForm=function(){const e=_v1191EnvFromForm();if($('eAngle')?.checked){e.angle=true;e.angleA=Number($('eAngleA')?.value||0);e.angleB=Number($('eAngleB')?.value||0);e.angleAHeight=Number($('eAngleAHeight')?.value||0);e.angleBHeight=Number($('eAngleBHeight')?.value||0);e.width=e.angleA+e.angleB;e.height=Math.max(e.angleAHeight,e.angleBHeight);e.motorAngleMode=$('eMotorAngleMode')?.value||'CURVA';if($('eWidth'))$('eWidth').value=e.width||'';if($('eHeight'))$('eHeight').value=e.height||''}const p=officialProductById($('eRailProduct')?.value);if(p&&['VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TUBO 19 MM','TUBO 28 MM'].includes(e.fixation)){e.fixProductId=p.id;e.fixColor=p.color||e.fixColor;e.fixProductName=p.product_name||''}return e};
function v1191PfPj(){const d=($('qDocument')?.value||'').replace(/\D/g,'').slice(0,14),pj=d.length>11;if($('qDocument'))$('qDocument').value=d;if($('qDocumentLabel'))$('qDocumentLabel').textContent=pj?'CNPJ':'CPF';if($('qClientLabel'))$('qClientLabel').textContent=pj?'RAZÃO SOCIAL':'NOME';$('qFantasyWrap')?.classList.toggle('hidden',!pj);$('qStateRegWrap')?.classList.toggle('hidden',!pj);return pj}
const _v1191SyncDraft=syncDraft;syncDraft=function(){_v1191SyncDraft();const pj=v1191PfPj();draft.personType=pj?'PJ':'PF';draft.fantasyName=pj?($('qFantasyName')?.value.trim()||''):'';draft.stateRegistration=pj?($('qStateRegistration')?.value.trim()||''):''};
const _v1191RenderQuote=renderQuote;renderQuote=function(){_v1191RenderQuote();if($('qFantasyName'))$('qFantasyName').value=draft.fantasyName||'';if($('qStateRegistration'))$('qStateRegistration').value=draft.stateRegistration||'';v1191PfPj();v1191Conditional()};
const _v1191Upsert=upsertClientFromQuote;upsertClientFromQuote=function(q){_v1191Upsert(q);const c=(db.clients||[]).find(x=>norm(x.name)===norm(q.client));if(c){c.fantasyName=q.fantasyName||c.fantasyName||'';c.stateRegistration=q.stateRegistration||c.stateRegistration||'';c.personType=q.personType||c.personType||''}};
document.addEventListener('DOMContentLoaded',()=>{const doc=$('qDocument');doc?.addEventListener('input',()=>{v1191PfPj();syncDraft()});['qFantasyName','qStateRegistration'].forEach(id=>$(id)?.addEventListener('input',syncDraft));$('eAngle')?.addEventListener('change',()=>{const on=$('eAngle').checked;$('eAngleFields')?.classList.toggle('hidden',!on);if(on){if($('eWidth').value&&!$('eAngleA').value)$('eAngleA').value=$('eWidth').value;if($('eHeight').value){if(!$('eAngleAHeight').value)$('eAngleAHeight').value=$('eHeight').value;if(!$('eAngleBHeight').value)$('eAngleBHeight').value=$('eHeight').value}}v1191Conditional();updatePreview()});['eAngleA','eAngleB','eAngleAHeight','eAngleBHeight'].forEach(id=>$(id)?.addEventListener('input',()=>{const a=Number($('eAngleA')?.value||0),b=Number($('eAngleB')?.value||0);if($('eWidth'))$('eWidth').value=a+b||'';updatePreview()}));['eFinish','eLining','eFinishPleat','eLiningPleat','eFixation'].forEach(id=>$(id)?.addEventListener('change',()=>{v1191Conditional();updatePreview()}));$('eRailProduct')?.addEventListener('change',()=>{const p=officialProductById($('eRailProduct').value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview()});$('eMotorAngleMode')?.addEventListener('change',updatePreview);v1191Conditional();v1191PfPj()});

/* ===== V12.0 • FIXAÇÕES DIRETAS DO ESTOQUE / COMPATIBILIDADE ===== */
function v12StockLabel(p){return `${p.product_name||'PRODUTO'} — ${p.color||'SEM COR'} • ${p.internal_code||'-'} • estoque ${Number(p.stock_quantity||0).toFixed(2)} ${p.unit||''}`}
function v12TubeProducts(size){return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name)===norm(`TUBO ${size} MM`));}
function v12RailProducts(){return officialSwissRails();}
function v12WaveProducts(){return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).includes('VARÃO WAVE 28'));}
function v12FillProductSelect(el,list,placeholder,preferred){if(!el)return;const old=String(el.value||'');el.innerHTML=`<option value="">${placeholder}</option>`+list.map(p=>`<option value="${p.id}">${esc(v12StockLabel(p))}</option>`).join('');const wanted=String(preferred||old||'');if([...el.options].some(o=>o.value===wanted))el.value=wanted;}
function v12AllowedLiningPleats(fp){
  // Matriz rígida de compatibilidade da confecção.
  if(fp==='WAVE')return ['FRANZIDO SUÍÇO','SOBREPOSTO'];
  if(fp==='ILHÓS REDONDO'||fp==='ILHÓS QUADRADO')return ['FRANZIDO COM ARGOLAS 19MM'];
  if(fp==='FRANZIDO COM ARGOLAS 29MM')return ['FRANZIDO COM ARGOLAS 19MM'];
  if(fp==='FRANZIDO COM ARGOLAS 19MM')return ['FRANZIDO COM ARGOLAS 19MM'];
  return ['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
}
function v12RefreshFixations(){
  const m=$('eModel')?.value||'COMPLETE',fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'';
  const lining=$('eLiningPleat'),allowed=v12AllowedLiningPleats(fp);if(lining){const old=lining.value,def=(fp==='ILHÓS REDONDO'||fp==='ILHÓS QUADRADO'||fp==='FRANZIDO COM ARGOLAS 19MM'||fp==='FRANZIDO COM ARGOLAS 29MM')?'FRANZIDO COM ARGOLAS 19MM':'FRANZIDO SUÍÇO';fillSelect(lining,allowed,allowed.includes(old)?old:def);}
  const fTube=isTubePleat(fp),lTube=isTubePleat($('eLiningPleat')?.value||'');
  const fw=$('eFinishTubeWrap'),lw=$('eLiningTubeWrap'),generic=$('eFixationWrap'),prod=$('eRailProductWrap'),color=$('eFixColorWrap');
  generic?.classList.toggle('hidden',fTube||lTube);prod?.classList.add('hidden');color?.classList.add('hidden');
  fw?.classList.toggle('hidden',m==='LINING'||!fTube);lw?.classList.toggle('hidden',m==='FINISH'||!lTube);
  if(fTube){const size=fp.includes('19MM')?'19':'28';v12FillProductSelect($('eFinishTube'),v12TubeProducts(size),'SELECIONE A FIXAÇÃO DO ACABAMENTO');}
  if(lTube){const lpp=$('eLiningPleat').value,size=lpp.includes('19MM')?'19':'28';v12FillProductSelect($('eLiningTube'),v12TubeProducts(size),'SELECIONE A FIXAÇÃO DO FORRO');}
  if(!(fTube||lTube)){
    const kind=$('eFixation')?.value||'';let list=[];
    if(kind==='TRILHO SUÍÇO')list=v12RailProducts();else if(kind.startsWith('VARÃO WAVE'))list=v12WaveProducts();
    if(list.length){prod?.classList.remove('hidden');v12FillProductSelect($('eRailProduct'),list,kind==='TRILHO SUÍÇO'?'SELECIONE O TRILHO DO ESTOQUE':'SELECIONE O VARÃO DO ESTOQUE',kind==='TRILHO SUÍÇO'?v118DefaultSwissRail()?.id:null);}
  }
  v1191GatherOptions('eFinishGather');v1191GatherOptions('eLiningGather');
}
const _v12EnvFromForm=envFromForm;
envFromForm=function(){const e=_v12EnvFromForm();const fp=e.finishPleat||'',lp=e.liningPleat||'';if(isTubePleat(fp)||isTubePleat(lp)){
  const f=officialProductById($('eFinishTube')?.value),l=officialProductById($('eLiningTube')?.value);e.finishTubeProductId=f?.id||null;e.liningTubeProductId=l?.id||null;e.finishTube=f?.product_name||'';e.liningTube=l?.product_name||'';e.finishTubeColor=f?.color||'';e.liningTubeColor=l?.color||'';e.tubeFixation=true;e.fixation=[f?.product_name,l?.product_name].filter(Boolean).join(' + ');
 }return e;};
tubeHardwareCalc=function(e,c){const w=Number(e.width||0)/100,model=e.model,mat=norm(e.supportMaterial)==='PVC'?'PVC':'ALUMINIO',supports=w<=2?2:w<=3.5?3:w<=4.5?4:5;const layers=[];if(model!=='LINING'&&e.finishTubeProductId)layers.push({p:officialProductById(e.finishTubeProductId),layer:'ACABAMENTO'});if(model!=='FINISH'&&e.liningTubeProductId)layers.push({p:officialProductById(e.liningTubeProductId),layer:'FORRO'});let total=0,parts=[];for(const x of layers){const p=x.p;if(!p)continue;const size=norm(p.product_name).includes('19')?'19':'28',color=p.color||'';parts.push({productId:p.id,name:`${p.product_name} — ${color}`,qty:w,unit:'M'});total+=w*Number(p.price_4x||0);const cap=officialProductLike(['TAMPA','TUBO',size],color);if(cap){parts.push({productId:cap.id,name:`${cap.product_name} — ${color}`,qty:2,unit:'UN'});total+=2*Number(cap.price_4x||0);}}
  const sizes=layers.map(x=>norm(x.p?.product_name).includes('19')?'19':'28');const colors=[...new Set(layers.map(x=>x.p?.color||'').filter(Boolean))];let supportName;if(model==='COMPLETE')supportName=`SUPORTE 19/28 ${mat}`;else supportName=`SUPORTE ${sizes[0]||'28'}MM ${mat}`;let support=null;for(const cor of colors){support=officialProductByName(supportName,cor)||officialProductLike(supportName.split(' '),cor);if(support)break;}support=support||officialProductLike(supportName.split(' '),'');if(support){parts.push({productId:support.id,name:`${support.product_name} — ${support.color||''}`,qty:supports,unit:'UN'});total+=supports*Number(support.price_4x||0);}return {kind:layers.map(x=>`${x.p.product_name} — ${x.p.color}`).join(' + '),meters:w*layers.length,supports,ends:layers.length*2,supportName,supportProductId:support?.id||null,parts,total,hardwareBase:total,detail:`${layers.map(x=>`${x.p.product_name} — ${x.p.color}`).join(' + ')} • ${supports} suportes • ${layers.length*2} tampas`};};
const _v12UpdateModelFields=updateModelFields;updateModelFields=function(){_v12UpdateModelFields();v12RefreshFixations();};
const _v12SetupSelectors=setupSelectors;setupSelectors=function(){_v12SetupSelectors();v12RefreshFixations();};
const _v12RenderQuote=renderQuote;renderQuote=function(){_v12RenderQuote();v12RefreshFixations();};
document.addEventListener('DOMContentLoaded',()=>{['eFinishPleat','eLiningPleat','eModel','eFixation'].forEach(id=>$(id)?.addEventListener('change',()=>{v12RefreshFixations();updatePreview()}));['eFinishTube','eLiningTube','eRailProduct'].forEach(id=>$(id)?.addEventListener('change',updatePreview));v12RefreshFixations();});


/* ===== V12.0.4 • APENAS FORRO INDEPENDENTE + PORTAL CONFIG/ANALYTICS ===== */
const V1204_LINING_PLEATS=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
const _v1204Allowed=v12AllowedLiningPleats;
v12AllowedLiningPleats=function(fp){
  // Em APENAS FORRO, o tecido de forro é a própria cortina: não herda restrições do acabamento inexistente.
  if(($('eModel')?.value||'')==='LINING')return V1204_LINING_PLEATS;
  return _v1204Allowed(fp);
};
const _v1204Refresh=v12RefreshFixations;
v12RefreshFixations=function(){
  const liningOnly=($('eModel')?.value||'')==='LINING';
  _v1204Refresh();
  if(liningOnly){
    const lp=$('eLiningPleat'); if(lp){const old=lp.value;fillSelect(lp,V1204_LINING_PLEATS,V1204_LINING_PLEATS.includes(old)?old:'FRANZIDO SUÍÇO');}
    // WAVE sozinho continua sendo apenas uma prega; não força a família de fixação.
    if(($('eLiningPleat')?.value||'')==='WAVE'){
      const generic=$('eFixationWrap'); generic?.classList.remove('hidden');
      v1191Conditional();
    }
    v1191GatherOptions('eLiningGather');
  }
};
// Portal: captura origem rastreável (?origem=flyer, instagram, feira, parceiro...).
function v1204PortalSource(){try{return (new URLSearchParams(location.search).get('origem')||'DIRETO').trim().toUpperCase().slice(0,40)}catch(e){return 'DIRETO'}}
const _v1204PortalEvent=portalEvent;
portalEvent=async function(event,meta={}){return _v1204PortalEvent(event,{...meta,source:v1204PortalSource()})};
function renderPortalConfig(){
  if(!isGestor())return;
  const a=db.portalAnalytics||{},events=a.events||{},sources=a.sources||{},daily=a.daily||{};
  const box=$('portalConfigAnalytics'); if(box)box.innerHTML=`<div class="kpis">${[['Visualizações',a.views||0],['Visitantes',a.visitors||0],['Interações',a.interactions||0],['WhatsApp / modelo',events.WHATSAPP_INSPIRACAO||0],['Inspirações abertas',events.INSPIRACOES_ABERTAS||0],['Acompanhar pedido',events.ACOMPANHAR_PEDIDO||0],['Candidaturas',events.CANDIDATURA||0]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}</div><div class="grid two" style="margin-top:14px"><div class="card"><div class="card-title">Origem dos acessos</div>${Object.keys(sources).length?Object.entries(sources).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>${esc(k)}</span><strong>${v}</strong></div>`).join(''):'<p class="muted">Os novos acessos rastreáveis aparecerão aqui.</p>'}</div><div class="card"><div class="card-title">Acessos recentes</div>${Object.keys(daily).length?Object.entries(daily).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>${esc(k)}</span><strong>${v}</strong></div>`).join(''):'<p class="muted">Sem histórico diário ainda.</p>'}</div></div>`;
}
const _v1204RenderInspirations=renderInspirations;
renderInspirations=function(){_v1204RenderInspirations();renderPortalConfig()};
const _v1204SetView=setView;
setView=function(id){_v1204SetView(id);if(id==='inspirations')renderPortalConfig()};

/* ===== V12.1.3 • ATACADO / RETRABALHO / FIXAÇÕES PRONTAS / PARCELAMENTO / PDF ===== */
const V1213_WHOLESALE_CLIENTS=['IRMA SCHWAB','TEREZINHA DIRCE F. DE LIMA','FERNANDO GELAK','DEUSMARA - MARAVILHA CORTINAS','ESTILO CORTINAS','CASA BELA CORTINAS','CLAUDIO - BELISSIMA CORTINAS','THAIS','JHULLY - ATELIE CORTINAS'];
const V1213_SPECIAL_SPECS={
  motor:[{m:1.5,c:990},{m:2,c:1060},{m:2.5,c:1100},{m:3,c:1200},{m:4,c:1300},{m:5,c:1400},{m:6,c:1500}],
  cordRod:[{m:2,c:150},{m:3,c:190},{m:4,c:240},{m:5,c:300},{m:6,c:340}],
  square:[{m:2,c:147},{m:3,c:198},{m:4,c:245},{m:5,c:270},{m:6,c:340}]
};
function v1213TierName(prefix,m){return `${prefix} ATÉ ${String(m).replace('.',',')}M`}
function v1213FindTierProduct(prefix,width,color=''){const arr=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith(norm(prefix))&&(!color||norm(p.color)===norm(color)));const parsed=arr.map(p=>{const mm=norm(p.product_name).match(/ATE\s*([0-9]+(?:[,.][0-9]+)?)M/);return {p,m:mm?Number(mm[1].replace(',','.')):999}}).sort((a,b)=>a.m-b.m);return parsed.find(x=>width<=x.m+1e-9)?.p||null}
function v1213SpecialProductList(kind){const k=norm(kind);if(k==='VARAO WAVE COM COMANDO POR CORDA')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('VARAO COM COMANDO POR CORDA'));if(k==='TRILHO SQUARE COM COMANDO')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('TRILHO SQUARE COM COMANDO'));if(k==='TRILHO MOTORIZADO')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('TRILHO MOTORIZADO ATE'));return []}
function v1213EnsureWholesaleClients(){db.wholesaleClients=db.wholesaleClients||[];let changed=false;for(const name of V1213_WHOLESALE_CLIENTS){if(!db.wholesaleClients.some(c=>norm(c.fantasyName||c.legalName)===norm(name))){db.wholesaleClients.push({id:uid(),fantasyName:name,legalName:'',responsible:'',phone:'',email:'',street:'',number:'',neighborhood:'',cep:'',city:'',state:'',complement:'',active:true,storeType:'',creditLimit:0,monthlyGoal:0,defaultMarkup:65,defaultTermDays:28,notes:'Pré-cadastrado na V12.1.3',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});changed=true}}if(changed)queueSave()}
async function v1213EnsureSpecialProducts(){if(!isGestor())return;const specs=[];for(const x of V1213_SPECIAL_SPECS.motor)for(const color of ['BRANCO','PRETO'])specs.push({name:v1213TierName('TRILHO MOTORIZADO',x.m),color,cost:x.c});specs.push({name:'CONTROLE REMOTO TRILHO MOTORIZADO',color:'SEM COR',cost:140});for(const x of V1213_SPECIAL_SPECS.cordRod)for(const color of ['CROMADO','BRANCO','PRETO','PRATA ESCOVADO','OURO VELHO'])specs.push({name:v1213TierName('VARÃO COM COMANDO POR CORDA',x.m),color,cost:x.c});for(const x of V1213_SPECIAL_SPECS.square)for(const color of ['BRANCO','PRETO'])specs.push({name:v1213TierName('TRILHO SQUARE COM COMANDO',x.m),color,cost:x.c});let created=0;for(const s of specs){if((priceProducts||[]).some(p=>Number(p.active??1)===1&&norm(p.product_name)===norm(s.name)&&norm(p.color)===norm(s.color)))continue;try{await api('prices',{method:'POST',body:JSON.stringify({action:'CRIAR',supplier:'A DEFINIR',supplier_code:'',category:'ACESSÓRIO',product_name:s.name,color:s.color,width_cm:0,unit:'UN',stock_quantity:0,cost:s.cost,markup_percent:80,ncm:'',cfop_internal:'',cfop_interstate:''})});created++}catch(e){console.warn('V12.1.3 cadastro especial:',s.name,s.color,e.message)}}try{await api('prices',{method:'POST',body:JSON.stringify({action:'SINCRONIZAR_PRECOS_ESPECIAIS'})})}catch(e){console.warn('V12.1.5 sincronização de preços especiais:',e.message)}await reloadOfficialProducts()}

if(!NAV.some(x=>x[0]==='wholesaleQuotes'))NAV.splice(NAV.findIndex(x=>x[0]==='wholesaleDashboard')+1,0,['wholesaleQuotes','Orçamentos Atacado','gestor']);
const v1213wg=NAV_GROUPS.find(g=>g.id==='wholesale');if(v1213wg&&!v1213wg.items.includes('wholesaleQuotes'))v1213wg.items.splice(1,0,'wholesaleQuotes');
HELP_TEXT.wholesaleQuotes=['Orçamentos Atacado','Orçamentos de clientes atacadistas, inclusive pedidos retornados para orçamento.'];

const _v1213LoadCloud=loadCloud;loadCloud=async function(){await _v1213LoadCloud();db.wholesaleQuotes=db.wholesaleQuotes||[];v1213EnsureWholesaleClients();await v1213EnsureSpecialProducts();renderAll()};
const _v1213RenderAll=renderAll;renderAll=function(){_v1213RenderAll();renderWholesaleQuotes()};
const _v1213SetView=setView;setView=function(id){_v1213SetView(id);if(id==='wholesaleQuotes')renderWholesaleQuotes()};

function renderWholesaleQuotes(){const tb=$('wholesaleQuotesTable');if(!tb)return;db.wholesaleQuotes=db.wholesaleQuotes||[];const sr=norm($('wholesaleQuoteSearch')?.value||'');const rows=db.wholesaleQuotes.filter(q=>q.status!=='PEDIDO'&&(!sr||norm(`${q.number} ${q.clientName}`).includes(sr))).sort((a,b)=>String(b.createdAt||b.date).localeCompare(String(a.createdAt||a.date)));tb.innerHTML=rows.map(q=>`<tr><td>${String(q.number||0).padStart(6,'0')}</td><td>${fmtDate(q.date)}</td><td>${esc(q.clientName||'-')}</td><td>${money(q.total||0)}</td><td>5 dias</td><td><button class="btn ghost" data-wq-open="${q.id}">Abrir</button> <button class="btn primary" data-wq-convert="${q.id}">Converter</button> <button class="btn danger" data-wq-delete="${q.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum orçamento de atacado.</td></tr>';document.querySelectorAll('[data-wq-open]').forEach(b=>b.onclick=()=>openWholesaleQuote(b.dataset.wqOpen));document.querySelectorAll('[data-wq-convert]').forEach(b=>b.onclick=()=>convertWholesaleQuote(b.dataset.wqConvert));document.querySelectorAll('[data-wq-delete]').forEach(b=>b.onclick=()=>{if(!confirm('Excluir este orçamento de atacado?'))return;db.wholesaleQuotes=db.wholesaleQuotes.filter(q=>q.id!==b.dataset.wqDelete);queueSave();renderWholesaleQuotes()})}
function openWholesaleQuote(id){const q=(db.wholesaleQuotes||[]).find(x=>x.id===id);if(!q)return;openModal(`<h2>Orçamento Atacado ${String(q.number||0).padStart(6,'0')}</h2><p><strong>${esc(q.clientName||'-')}</strong> • ${fmtDate(q.date)}</p><div class="table-wrap"><table class="table"><tr><th>Produto</th><th>Qtd.</th><th>Valor unit.</th><th>Total</th></tr>${(q.items||[]).map(x=>`<tr><td>${esc(x.internalCode||'')} • ${esc(x.name||'')} ${x.color?'/ '+esc(x.color):''}</td><td>${Number(x.qty||0)} ${esc(x.unit||'')}</td><td>${money(x.unitPrice)}</td><td>${money(Number(x.qty||0)*Number(x.unitPrice||0))}</td></tr>`).join('')}</table></div><p class="totals">Total: ${money(q.total||0)}</p><button id="wqConvertNow" class="btn primary">Converter em pedido</button>`);$('wqConvertNow').onclick=()=>{closeModal();convertWholesaleQuote(q.id)}}
function convertWholesaleQuote(id){const q=(db.wholesaleQuotes||[]).find(x=>x.id===id);if(!q)return;wholesaleDraft={clientId:q.clientId,date:today(),termDays:Number(q.termDays||28),dueDate:'',items:(q.items||[]).map(x=>({...clone(x),id:uid()})),sourceQuoteId:q.id};wholesaleDraft.dueDate=wholesaleAddDays(wholesaleDraft.date,wholesaleDraft.termDays);setView('wholesaleSale');alert('Orçamento carregado. Confira estoque, quantidades e preços antes de finalizar.')}
const _v1213SaveWholesaleSale=saveWholesaleSale;saveWholesaleSale=async function(){const sourceId=wholesaleDraft.sourceQuoteId;await _v1213SaveWholesaleSale();if(sourceId&&($('view-wholesaleOrders')?.classList.contains('active'))){const q=(db.wholesaleQuotes||[]).find(x=>x.id===sourceId);if(q){q.status='PEDIDO';q.convertedAt=new Date().toISOString();queueSave()}}};

async function v1213WholesaleOrderAction(id,action){const s=(db.wholesaleSales||[]).find(x=>x.id===id);if(!s)return;const label=action==='RETURN_TO_QUOTE'?'retornar este pedido para Orçamento Atacado':'excluir este pedido';if(!confirm(`Deseja ${label}? O estoque será estornado.`))return;try{await api('wholesale-sale',{method:'POST',body:JSON.stringify({action,saleId:id})});const data=await api('data');db={...db,...data,priceConfig:mergeConfig(data.priceConfig)};db.wholesaleClients=db.wholesaleClients||[];db.wholesaleSales=db.wholesaleSales||[];db.wholesaleQuotes=db.wholesaleQuotes||[];await reloadOfficialProducts();renderAll();if(action==='RETURN_TO_QUOTE')setView('wholesaleQuotes')}catch(e){alert(e.message||'Não foi possível concluir a operação.')}}
renderWholesaleOrders=function(){const tb=$('wholesaleOrdersTable');if(!tb)return;const sr=norm($('wholesaleOrderSearch')?.value),sf=$('wholesaleOrderStatus')?.value||'';const rows=(db.wholesaleSales||[]).filter(s=>s.cancelled!==true&&(!sr||norm(`${s.number} ${s.clientName}`).includes(sr))&&(!sf||(s.logisticsStatus||'SEPARAÇÃO')===sf)).slice().sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||'')));tb.innerHTML=rows.map(s=>{const paid=wholesaleSalePaid(s),bal=wholesaleSaleBalance(s),fin=wholesaleFinancialStatus(s),cls=fin==='QUITADO'?'ok':fin==='VENCIDO'?'warn':fin==='PARCIAL'?'blue':'warn';return `<tr><td>${String(s.number||0).padStart(6,'0')}</td><td>${fmtDate(s.date)}</td><td>${fmtDate(s.dueDate||s.date)}</td><td>${esc(s.clientName||'-')}</td><td>${money(s.total)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td><span class="badge ${cls}">${fin}</span></td><td><select data-ws-logistics="${s.id}"><option ${s.logisticsStatus==='SEPARAÇÃO'||!s.logisticsStatus?'selected':''}>SEPARAÇÃO</option><option ${s.logisticsStatus==='PRONTO'?'selected':''}>PRONTO</option><option ${s.logisticsStatus==='RETIRADO/ENVIADO'?'selected':''}>RETIRADO/ENVIADO</option><option ${s.logisticsStatus==='CONCLUÍDO'?'selected':''}>CONCLUÍDO</option></select></td><td>${bal>0.005?`<button class="btn primary" data-ws-pay="${s.id}">Pagamento</button>`:''} <button class="btn ghost" data-ws-open="${s.id}">Abrir</button> <button class="btn secondary" data-ws-dup="${s.id}">Duplicar</button> <button class="btn secondary" data-ws-return="${s.id}">Retornar a orçamento</button> <button class="btn danger" data-ws-delete="${s.id}">Apagar</button></td></tr>`}).join('')||'<tr><td colspan="10">Nenhum pedido de atacado registrado.</td></tr>';document.querySelectorAll('[data-ws-open]').forEach(b=>b.onclick=()=>openWholesaleOrder(b.dataset.wsOpen));document.querySelectorAll('[data-ws-pay]').forEach(b=>b.onclick=()=>openWholesalePayment(b.dataset.wsPay));document.querySelectorAll('[data-ws-dup]').forEach(b=>b.onclick=()=>duplicateWholesaleOrder(b.dataset.wsDup));document.querySelectorAll('[data-ws-return]').forEach(b=>b.onclick=()=>v1213WholesaleOrderAction(b.dataset.wsReturn,'RETURN_TO_QUOTE'));document.querySelectorAll('[data-ws-delete]').forEach(b=>b.onclick=()=>v1213WholesaleOrderAction(b.dataset.wsDelete,'DELETE'));document.querySelectorAll('[data-ws-logistics]').forEach(el=>el.onchange=()=>{const s=(db.wholesaleSales||[]).find(x=>x.id===el.dataset.wsLogistics);if(!s)return;s.logisticsStatus=el.value;s.logisticsHistory=s.logisticsHistory||[];s.logisticsHistory.push({status:el.value,at:new Date().toISOString(),by:currentUsername()});queueSave();renderWholesaleDashboard()})};

function v1213SendReworkToProduction(id){const r=(db.reworks||[]).find(x=>x.id===id);if(!r)return;const o=(db.orders||[]).find(x=>Number(x.numero)===Number(r.orderNumber));if(!o)return alert('Pedido do retrabalho não encontrado.');r.status='PRODUÇÃO';r.sentToProductionAt=new Date().toISOString();o.productionStage='RECEPÇÃO';o.hasOpenRework=true;o.reworkId=r.id;o.reworkActive=true;o.installation=o.installation||{};o.installation.reworkPending=true;o.productionHistory=o.productionHistory||[];o.productionHistory.push({stage:'RETRABALHO • RECEPÇÃO',at:new Date().toISOString(),by:currentUsername()});addOrderEvent(o,'RETRABALHO ENVIADO À PRODUÇÃO',`${r.number} • reinício em RECEPÇÃO`);queueSave();renderAll();alert('Retrabalho enviado para PRODUÇÃO e mantido visível em INSTALAÇÕES.')}
function v1213FinishRework(id){const r=(db.reworks||[]).find(x=>x.id===id);if(!r)return;if(!confirm('Concluir este retrabalho?'))return;r.status='CONCLUÍDO';r.completedAt=new Date().toISOString();const o=(db.orders||[]).find(x=>Number(x.numero)===Number(r.orderNumber));if(o){o.hasOpenRework=false;o.reworkActive=false;if(o.installation)o.installation.reworkPending=false;addOrderEvent(o,'RETRABALHO CONCLUÍDO',r.number)}queueSave();renderAll()}
renderReworks=function(){const tb=$('reworksTable');if(!tb)return;tb.innerHTML=(db.reworks||[]).map(r=>`<tr class="${r.status==='PRODUÇÃO'?'rework-red-row':''}"><td>${esc(r.number)}</td><td>${esc(r.orderNumber)}</td><td>${fmtDate(r.date)}</td><td>${esc(r.category||'-')}</td><td>${esc(r.summary)}</td><td><span class="badge ${r.status==='CONCLUÍDO'?'ok':'warn'}">${esc(r.status||'ABERTO')}</span></td><td><button class="btn ghost" data-rw-open="${r.id}">Abrir</button> <button class="btn danger" data-rw-prod="${r.id}">ENVIAR PARA PRODUÇÃO</button> <button class="btn secondary" data-rw-done="${r.id}">CONCLUIR</button></td></tr>`).join('');document.querySelectorAll('[data-rw-open]').forEach(b=>b.onclick=()=>openRework(null,db.reworks.find(x=>x.id===b.dataset.rwOpen)));document.querySelectorAll('[data-rw-prod]').forEach(b=>b.onclick=()=>v1213SendReworkToProduction(b.dataset.rwProd));document.querySelectorAll('[data-rw-done]').forEach(b=>b.onclick=()=>v1213FinishRework(b.dataset.rwDone))};
if(!document.getElementById('v1213style')){const st=document.createElement('style');st.id='v1213style';st.textContent='.rework-red-row{background:#ffe3e3!important;border-left:5px solid #b42318}.rework-red-row td{border-color:#f1b7b7!important}';document.head.appendChild(st)}

const _v1213SetupSelectors=setupSelectors;setupSelectors=function(){_v1213SetupSelectors();const el=$('eFixation');if(el){const vals=[...el.options].map(o=>o.value);for(const v of ['TRILHO SQUARE COM COMANDO'])if(!vals.includes(v))el.add(new Option(v,v));}v12RefreshFixations()};
const _v1213RefreshFix=v12RefreshFixations;v12RefreshFixations=function(){_v1213RefreshFix();const el=$('eFixation');if(el){[...el.options].filter(o=>o.value==='TRILHO SQUARE COM COMANDO').forEach(o=>o.remove())}const kind=el?.value||'',prod=$('eRailProductWrap');if(['VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'].includes(kind)){const list=v1213SpecialProductList(kind);if(list.length){prod?.classList.remove('hidden');v12FillProductSelect($('eRailProduct'),list,'SELECIONE O CONJUNTO POR TAMANHO');}}};
const _v1213EnvFromForm=envFromForm;envFromForm=function(){const e=_v1213EnvFromForm();if(['VARÃO WAVE COM COMANDO POR CORDA','TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(e.fixation)){const p=officialProductById($('eRailProduct')?.value);e.fixProductId=p?.id||null;e.fixProductName=p?.product_name||'';e.fixColor=p?.color||e.fixColor;e.railProductId=p?.id||null;e.railProductName=p?.product_name||'';e.railInternalCode=p?.internal_code||'';}return e};
const _v1213FixationCalc=fixationCalc;fixationCalc=function(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){if(kind==='TRILHO MOTORIZADO'){const rail=officialProductById(railProductId)||v1213FindTierProduct('TRILHO MOTORIZADO',widthM,fixColor)||v1213FindTierProduct('TRILHO MOTORIZADO',widthM);if(!rail)return {kind,total:0,hardwareBase:0,meters:0,detail:widthM>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o trilho motorizado'};const remote=officialProductByName('CONTROLE REMOTO TRILHO MOTORIZADO')||officialProductLike(['CONTROLE','REMOTO','MOTORIZADO']);const total=Number(rail.price_4x||0)+Number(remote?.price_4x||0);return {kind,total,hardwareBase:total,meters:0,units:1,railProductId:rail.id,railName:rail.product_name,remoteProductId:remote?.id||null,detail:`${rail.product_name} • 1 un • controle remoto incluído`}}if(kind==='VARÃO WAVE COM COMANDO POR CORDA'){const rod=officialProductById(railProductId)||v1213FindTierProduct('VARÃO COM COMANDO POR CORDA',widthM,fixColor)||v1213FindTierProduct('VARÃO COM COMANDO POR CORDA',widthM);if(!rod)return {kind,total:0,hardwareBase:0,detail:widthM>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o varão por tamanho'};const supports=widthM<=2?2:widthM<=3.5?3:widthM<=4.5?4:5;const sup=officialProductByName('SUPORTE WAVE 28',fixColor)||officialProductLike(['SUPORTE','WAVE','28'],fixColor);const total=Number(rod.price_4x||0)+supports*Number(sup?.price_4x||0);return {kind,total,hardwareBase:total,meters:0,units:1,supports,supportProductId:sup?.id||null,supportName:sup?.product_name||'SUPORTE WAVE 28',railProductId:rod.id,detail:`${rod.product_name} • 1 un • ${supports} suportes`}}if(kind==='TRILHO SQUARE COM COMANDO'){const rail=officialProductById(railProductId)||v1213FindTierProduct('TRILHO SQUARE COM COMANDO',widthM,fixColor)||v1213FindTierProduct('TRILHO SQUARE COM COMANDO',widthM);if(!rail)return {kind,total:0,hardwareBase:0,detail:widthM>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o Square por tamanho'};const claws=Math.max(2,Math.ceil(widthM/0.60));const claw=officialProductLike(['GARRA','TRILHO'],fixColor)||officialProductLike(['GARRA']);const total=Number(rail.price_4x||0)+claws*Number(claw?.price_4x||0);return {kind,total,hardwareBase:total,meters:0,units:1,clamps:claws,railProductId:rail.id,clawProductId:claw?.id||null,detail:`${rail.product_name} • 1 un • ${claws} garras`}}return _v1213FixationCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial)};

const _v1213Req=officialOrderRequirements;officialOrderRequirements=function(q){const base=_v1213Req(q).filter(x=>{const n=norm(x.product_name);return !(n.includes('TRILHO BASE MOTORIZADO')||n==='TRILHO MOTORIZADO'||n.includes('VARAO WAVE 28')&&String(x.source||'').includes('VARÃO WAVE COM COMANDO'));});const add=(p,qty,e,source)=>{if(!p||qty<=0)return;base.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment:e,environments:[e],source,cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)})};for(const e of q.environments||[]){const w=Number(e.width||0)/100,c=calcEnvironment(e),f=c?.fixationCalc||{};if(e.fixation==='TRILHO MOTORIZADO'){add(officialProductById(f.railProductId||e.railProductId),1,e.name,'TRILHO MOTORIZADO SOB MEDIDA');add(officialProductById(f.remoteProductId)||officialProductByName('CONTROLE REMOTO TRILHO MOTORIZADO'),1,e.name,'CONTROLE REMOTO')}else if(e.fixation==='VARÃO WAVE COM COMANDO POR CORDA'){add(officialProductById(f.railProductId||e.railProductId),1,e.name,'VARÃO COM COMANDO SOB MEDIDA')}else if(e.fixation==='TRILHO SQUARE COM COMANDO'){add(officialProductById(f.railProductId||e.railProductId),1,e.name,'TRILHO SQUARE SOB MEDIDA');add(officialProductById(f.clawProductId),Math.max(2,Math.ceil(w/0.60)),e.name,'GARRA TRILHO')}}const g={};for(const r of base){const k=`${r.product_id}|${r.environment||''}`;if(!g[k])g[k]={...r,qty:0,environments:r.environments||[]};g[k].qty+=Number(r.qty||0)}return Object.values(g)};
purchaseMaterialsForOrder=function(o){const out=[];for(const b of (o?.blinds||[]))out.push({name:`PERSIANA${b.model?' • '+b.model:''}`,color:[b.color,b.bando?`Bandô: ${b.bando}`:'',b.commandSide?`Comando: ${b.commandSide}`:''].filter(Boolean).join(' • '),qty:Math.max(1,Number(b.qty||1)),unit:'UN',isBlind:true,category:'PERSIANA'});for(const e of (o?.environments||[])){const fix=String(e.fixation||'').toUpperCase(),w=Number(e.width||0)/100,c=calcEnvironment(e),f=c?.fixationCalc||{};if(fix.includes('MOTORIZADO')){out.push({name:f.railName||e.railProductName||'TRILHO MOTORIZADO',color:e.fixColor||'',qty:1,unit:'UN',category:'ACESSÓRIO',environment:e.name,measure:w});out.push({name:'CONTROLE REMOTO TRILHO MOTORIZADO',color:'SEM COR',qty:1,unit:'UN',category:'ACESSÓRIO',environment:e.name})}else if(fix.includes('SQUARE')&&fix.includes('COMANDO'))out.push({name:e.railProductName||f.detail?.split(' • ')[0]||'TRILHO SQUARE COM COMANDO',color:e.fixColor||'',qty:1,unit:'UN',category:'ACESSÓRIO',environment:e.name,measure:w});else if(fix.includes('VARÃO WAVE COM COMANDO')||fix.includes('VARAO WAVE COM COMANDO'))out.push({name:e.railProductName||f.detail?.split(' • ')[0]||'VARÃO COM COMANDO POR CORDA',color:e.fixColor||'',qty:1,unit:'UN',category:'ACESSÓRIO',environment:e.name,measure:w})}return out};

paymentConditionLabel=function(cond,order=null){if(cond==='cash')return'À VISTA (PIX/DINHEIRO)';if(cond==='p18')return'18X';if(cond==='custom')return `${Number(order?.installments||0)||''}X`;return'EM ATÉ 4X'};
function v1213PaymentLabel(o){return paymentConditionLabel(o.paymentCondition,o)}
convertQuote=function(n){if(conversionInProgress)return alert('Conversão já está em andamento. Aguarde.');const q=db.quotes.find(x=>Number(x.numero)===n);if(!q)return;if(db.orders.some(o=>Number(o.quoteNumber)===n))return alert('Este orçamento já foi convertido em pedido.');if(pendingDiscountApprovalForQuote(n))return alert('Este orçamento já está aguardando aprovação do gestor.');const t=quoteTotals(q);openModal(`<h2>Converter em pedido</h2><div class="grid two"><label class="field">Condição<select id="convCond"><option value="cash">À VISTA (PIX/DINHEIRO)</option><option value="p4">EM ATÉ 4X</option><option value="p18">18X</option><option value="custom">OUTRO</option></select></label><label id="convInstallmentsWrap" class="field hidden">Número de parcelas<input id="convInstallments" type="number" min="1" max="99" step="1" value="6"></label><label class="field">Data de instalação / entrega<input id="convDate" type="date" value="${q.suggestedDeliveryDate||suggestedInstallDate(today())}"></label><label class="field">Desconto adicional (%)<input id="convDiscount" type="number" min="0" max="100" value="0"></label><label class="field">Justificativa<input id="convReason"></label></div><p class="muted">À vista ${money(t.cash)} • 4x ${money(t.p4)} • 18x ${money(t.p18)}</p><button id="convGo" class="btn primary">Gerar pedido</button>`);$('convCond').onchange=()=>$('convInstallmentsWrap').classList.toggle('hidden',$('convCond').value!=='custom');$('convGo').onclick=async()=>{const cond=$('convCond').value,date=$('convDate').value,disc=Number($('convDiscount').value||0),reason=$('convReason').value.trim(),installments=cond==='custom'?Math.max(1,Number($('convInstallments').value||0)):null;if(!date)return alert('Informe a data.');if(cond==='custom'&&!installments)return alert('Informe o número de parcelas.');if(disc>0&&!reason)return alert('Justifique o desconto.');const seller=resolveSellerUser(q),role=norm(userPermissionRecord(seller).role),total=Number(q.discountPercent||0)+disc,limit=userDiscountLimit(seller);if(['SALES','PARTNER'].includes(role)&&total>limit){db.discountApprovals=db.discountApprovals||[];db.discountApprovals.unshift({id:uid(),quoteNumber:q.numero,client:q.client,requestedBy:seller,requestedAt:new Date().toISOString(),condition:cond,installments,deliveryDate:date,additionalDiscount:disc,totalDiscount:total,userLimit:limit,reason,status:'PENDENTE'});q.status='PENDENTE DE APROVAÇÃO';queueSave();closeModal();renderAll();return alert('Desconto acima do seu limite. Orçamento enviado para aprovação do gestor.');}conversionInProgress=true;const order=await finalizeQuoteOrder(q,cond==='custom'?'p4':cond,date,disc,reason);conversionInProgress=false;if(order){order.paymentCondition=cond;order.installments=installments;queueSave();closeModal();renderAll();setView('orders')}}};
const _v1213PrintCustomerOrder=printCustomerOrder;printCustomerOrder=function(o){ensureV119();const original=paymentConditionLabel;o.paymentConditionLabel=v1213PaymentLabel(o);const q=db.quotes.find(x=>Number(x.numero)===Number(o.quoteNumber));const cond=v1213PaymentLabel(o);let envs='';for(const e of o.environments||[]){const c=calcEnvironment(e);if(!c)continue;const mats=environmentMaterialRows(e,o.paymentCondition==='custom'?'p4':o.paymentCondition);envs+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td colspan="3">${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td></tr><tr><th>${esc(cond)}</th><td colspan="3"><strong>${money(o.agreedValue)}</strong></td></tr></table><div class="section-title">Materiais deste ambiente</div><table class="summary-table"><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>${mats||'<tr><td colspan="6">Sem material oficial vinculado.</td></tr>'}</table></div>`}const cset=companySettings(),warranty=o.documentVersions?.warrantyText||cset.warranty||V119_WARRANTY;const body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas e Persianas</strong><br>Luiz Sergio Delgobo ME<br>CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330<br><br><strong>PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br><strong>Cliente:</strong> ${esc(o.client||'-')}<br><strong>Contato:</strong> ${esc(o.contact||'-')}<br><strong>Endereço:</strong> ${esc(o.address||'-')}<br><strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}</div></div>${envs}<div class="section-title">Acompanhe seu pedido</div><div class="customer-access-box"><img class="customer-qr" src="${customerPortalQrUrl(o.numero)}" alt="QR Code para acompanhar o pedido"><div><strong>Portal do Cliente Nova Imagem</strong><br>Aponte a câmera para o QR Code.<br><br>Pedido: <strong>${String(o.numero).padStart(6,'0')}</strong><br>Senha: <strong>${esc(o.clientAccessCode||'NÃO GERADA')}</strong><br><a class="customer-portal-link" href="${customerPortalUrl(o.numero)}" target="_blank">Clique aqui para acompanhar seu pedido</a></div></div><div class="section-title">Condição contratada</div><p class="totals">${esc(cond)}: ${money(o.agreedValue)}</p><div class="section-title">CONTRATO DE FORNECIMENTO E INSTALAÇÃO</div><div class="conditions"><p><strong>CONTRATADA:</strong> Luiz Sergio Delgobo ME, CNPJ 15.115.803/0001-69.</p><p><strong>CONTRATANTE:</strong> ${esc(o.client||'-')}, endereço ${esc(o.address||'-')}.</p><p><strong>OBJETO:</strong> fornecimento e instalação dos produtos descritos neste pedido.</p><p><strong>CONDIÇÃO:</strong> ${esc(cond)}, valor contratado de ${money(o.agreedValue)}.</p><p><strong>PRAZO PREVISTO:</strong> instalação/entrega em ${fmtDate(o.deliveryDate)}.</p></div><div class="signature-grid"><div><div class="signature-line"></div><strong>Cliente / Contratante</strong></div><div><div class="signature-line"></div><strong>Nova Imagem / Vendedor</strong></div></div><div style="page-break-before:always"></div><div class="section-title">TERMO DE GARANTIA</div><div style="white-space:pre-line;line-height:1.55">${esc(warranty)}</div><br><p><strong>Pedido:</strong> ${String(o.numero).padStart(6,'0')} • <strong>Cliente:</strong> ${esc(o.client||'-')}</p><div class="signature-grid"><div><div class="signature-line"></div><strong>Cliente</strong></div><div><div class="signature-line"></div><strong>Nova Imagem</strong></div></div>`;printWindow(body)};

document.addEventListener('DOMContentLoaded',()=>{if($('newWholesaleQuoteBtn'))$('newWholesaleQuoteBtn').onclick=()=>{wholesaleDraft={clientId:'',date:today(),termDays:Number(wholesaleSettings().defaultTermDays||28),dueDate:'',items:[]};setView('wholesaleSale')};if($('wholesaleQuoteSearch'))$('wholesaleQuoteSearch').oninput=renderWholesaleQuotes});

/* ===== V12.1.4 • HOTFIX FIXAÇÕES / PDF ORÇAMENTO / CONTRATO ===== */
function v1214TierLimitFromName(name){
  const m=norm(name).match(/ATE\s*([0-9]+(?:[,.][0-9]+)?)M/);
  return m?Number(m[1].replace(',','.')):null;
}
function v1214FixProductsForCurrentWidth(kind){
  const k=norm(kind),w=Math.max(0,Number($('eWidth')?.value||0)/100);
  if(k==='TRILHO SUICO')return officialSwissRails().filter(p=>Number(p.active??1)===1);
  if(k==='VARAO WAVE')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name)==='VARAO WAVE 28');
  let list=[];
  if(k==='VARAO WAVE COM COMANDO POR CORDA')list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE'));
  else if(k==='TRILHO SQUARE COM COMANDO')list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('TRILHO SQUARE COM COMANDO ATE'));
  else if(k==='TRILHO MOTORIZADO')list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&norm(p.product_name).startsWith('TRILHO MOTORIZADO ATE'));
  else return [];
  if(!list.length)return [];
  const tiers=[...new Set(list.map(p=>v1214TierLimitFromName(p.product_name)).filter(x=>x!=null))].sort((a,b)=>a-b);
  const tier=tiers.find(x=>w<=x+1e-9) ?? null;
  if(tier==null)return [];
  return list.filter(p=>Math.abs(Number(v1214TierLimitFromName(p.product_name))-tier)<1e-9);
}
function v1214RefreshFixProduct(){
  const kind=$('eFixation')?.value||'',sel=$('eRailProduct'),wrap=$('eRailProductWrap'),colorWrap=$('eFixColorWrap');
  if(!sel)return;
  const oldP=officialProductById(sel.value),oldColor=oldP?.color||$('eFixColor')?.value||'';
  const list=v1214FixProductsForCurrentWidth(kind);
  const usesProduct=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'].includes(kind);
  if(!usesProduct){wrap?.classList.add('hidden');return;}
  wrap?.classList.remove('hidden');colorWrap?.classList.add('hidden');
  let placeholder='SELECIONE A FIXAÇÃO DO ESTOQUE';
  if(kind==='TRILHO SUÍÇO')placeholder='SELECIONE O TRILHO DO ESTOQUE';
  else if(kind==='VARÃO WAVE')placeholder='SELECIONE A COR DO VARÃO WAVE';
  else if(kind==='VARÃO WAVE COM COMANDO POR CORDA')placeholder='SELECIONE A COR DO VARÃO COM COMANDO';
  else if(kind==='TRILHO SQUARE COM COMANDO')placeholder='SELECIONE A COR DO TRILHO SQUARE';
  else if(kind==='TRILHO MOTORIZADO')placeholder='SELECIONE A COR DO TRILHO MOTORIZADO';
  if(!list.length){
    const w=Number($('eWidth')?.value||0)/100;
    sel.innerHTML=`<option value="">${w>6?'MEDIDA ACIMA DE 6M — DEFINIR SOLUÇÃO ESPECIAL':'NENHUM PRODUTO COMPATÍVEL CADASTRADO NO ESTOQUE'}</option>`;
    return;
  }
  v12FillProductSelect(sel,list,placeholder);
  const sameColor=list.find(p=>norm(p.color)===norm(oldColor));
  if(sameColor)sel.value=String(sameColor.id);
  else if(kind==='TRILHO SUÍÇO'){
    const d=v118DefaultSwissRail();if(d&&list.some(p=>Number(p.id)===Number(d.id)))sel.value=String(d.id);
  }
  const p=officialProductById(sel.value);
  if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';
}
const _v1214RefreshFix=v12RefreshFixations;
v12RefreshFixations=function(){
  _v1214RefreshFix();
  const el=$('eFixation');
  if(el){
    for(const k of ['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO']){
      if(![...el.options].some(o=>o.value===k))el.add(new Option(k,k));
    }
  }
  v1214RefreshFixProduct();
};
const _v1214LoadCloud=loadCloud;
loadCloud=async function(){await _v1214LoadCloud();try{await v1213EnsureSpecialProducts();}catch(e){console.warn('V12.1.4 produtos especiais:',e)}v1214RefreshFixProduct();};

function v1214MaterialRowsNoPrice(e){
  const rows=officialOrderRequirements({environments:[e]}).filter(x=>{
    const n=norm(x.product_name||'');
    return !n.includes('CONFECCAO')&&!n.includes('INSTALACAO')&&!n.includes('MAO DE OBRA')&&!n.includes('PRODUCAO');
  });
  return rows.map(x=>`<tr><td>${esc(x.internal_code||'-')}</td><td>${esc(x.product_name||'-')}</td><td>${esc(x.color||'-')}</td><td>${Number(x.qty||0).toFixed(norm(x.unit)==='M'?2:0)} ${esc(norm(x.unit||'UN'))}</td></tr>`).join('');
}
printQuote=function(q,type='summary'){
  const t=quoteTotals(q);let body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas & Persianas</strong><br><span>ORÇAMENTO COMERCIAL</span><br><br><strong>Cliente:</strong> ${esc(q.client||'-')}<br><strong>Contato:</strong> ${esc(q.contact||'-')}<br><strong>Endereço:</strong> ${esc(q.address||'-')}<br><strong>Vendedor:</strong> ${esc(displaySeller(q))}<br><strong>Data:</strong> ${fmtDate(q.date)}</div></div><div class="quote-number">ORÇAMENTO Nº ${String(q.numero).padStart(6,'0')}</div>`;
  for(const e of q.environments||[]){
    const c=calcEnvironment(e);if(!c)continue;
    const mats=v1214MaterialRowsNoPrice(e);
    const pm=1+quotePartnerMarkup(q)/100,qd=1-Math.max(0,Math.min(100,Number(q.discountPercent||0)))/100;
    const envCash=Number(c.cash||0)*pm*qd,envP4=Number(c.base4||0)*pm*qd,envP18=Number(c.p18||0)*pm*qd,envLabor18=Number(c.laborTotal||0)*(1+Number(db.priceConfig.terms.p18AddPct||0)/100)*pm*qd;
    body+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td>${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td><th>CONFECÇÃO</th><td><strong>${money(envLabor18)}</strong></td></tr><tr><th>VALORES</th><td><strong>Até 18x</strong><br>${money(envP18)}</td><td><strong>Até 4x</strong><br>${money(envP4)}</td><td><strong>À VISTA</strong><br>${money(envCash)}</td></tr>${e.notes?`<tr><th>Observações</th><td colspan="3">${esc(e.notes)}</td></tr>`:''}</table><div class="section-title">Materiais previstos para este ambiente</div><table class="summary-table"><tr><th>SKU</th><th>Material</th><th>Cor</th><th>Quantidade</th></tr>${mats||'<tr><td colspan="4">Sem material oficial vinculado.</td></tr>'}</table></div>`;
  }
  if((q.blinds||[]).length){body+=`<div class="section-title">Persianas</div><table class="summary-table"><tr><th>Ambiente</th><th>Modelo</th><th>Cor</th><th>Medidas</th><th>Qtd.</th></tr>${q.blinds.map(x=>`<tr><td>${esc(x.environment||'PERSIANA')}</td><td>${esc(x.model||'-')}</td><td>${esc(x.color||'-')}</td><td>${x.width} × ${x.height} cm</td><td>${Number(x.qty||1)} un.</td></tr>`).join('')}</table>`;}
  if((q.looseProducts||[]).length){body+=`<div class="section-title">Produtos adicionais</div><table class="summary-table"><tr><th>Descrição</th><th>Produto</th><th>Cor</th><th>Quantidade</th></tr>${q.looseProducts.map(a=>`<tr><td>${esc(a.description||a.name)}</td><td>${esc(a.name||'-')}</td><td>${esc(a.color||'-')}</td><td>${Number(a.qty||0)} ${esc(a.unit||'UN')}</td></tr>`).join('')}</table>`;}
  body+=`<div class="section-title">VALORES FINAIS</div><table class="summary-table"><tr><th>Condição</th><th>Valor final</th></tr><tr><td>À vista (PIX/Dinheiro)</td><td class="totals">${money(t.cash)}</td></tr><tr><td>Em até 4x</td><td class="totals">${money(t.p4)}</td></tr><tr><td>Em até 18x</td><td class="totals">${money(t.p18)}</td></tr></table>${q.discountPercent?`<p><strong>Desconto:</strong> ${q.discountPercent}% • ${esc(q.discountReason||'')}</p>`:''}<div class="section-title">Condições comerciais</div><div class="conditions">Validade do orçamento: 5 dias. Medidas, tecidos, cores e fixações devem ser conferidos antes da ordem de produção. Prazo sugerido para a instalação de 30 dias, devendo ser agendado no pedido.</div><p class="sign"><strong>Atenciosamente, ${esc(displaySeller(q))}</strong></p>`;
  printWindow(body);
};

function v1214OrderInstallments(o){if(o.paymentCondition==='cash')return 1;if(o.paymentCondition==='p18')return 18;if(o.paymentCondition==='custom')return Math.max(1,Number(o.installments||1));return 4;}
function v1214ContractPaymentText(o){
  const total=Number(o.agreedValue||0),n=v1214OrderInstallments(o);
  if(o.paymentCondition==='cash')return `Valor contratado de ${money(total)}, pago à vista via PIX/dinheiro.`;
  return `Valor contratado de ${money(total)}, sendo pago em ${n} parcelas de ${money(total/n)}.`;
}
function v1214EnvironmentOrderValue(e,o,q){
  const c=calcEnvironment(e);if(!c)return 0;
  const cond=o.paymentCondition==='cash'?'cash':o.paymentCondition==='p18'?'p18':'p4';
  const raw=cond==='cash'?Number(c.cash||0):cond==='p18'?Number(c.p18||0):Number(c.base4||0);
  const pm=1+Number(quotePartnerMarkup(q||o)||0)/100;
  const qd=1-Math.max(0,Math.min(100,Number(q?.discountPercent||0)))/100;
  const od=1-Math.max(0,Math.min(100,Number(o.discountPercent||0)))/100;
  return raw*pm*qd*od;
}
printCustomerOrder=function(o){
  ensureV119();
  if(!/^\d{6}$/.test(String(o.clientAccessCode||''))){o.clientAccessCode=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');queueSave();}
  const q=db.quotes.find(x=>Number(x.numero)===Number(o.quoteNumber));
  const cond=v1213PaymentLabel(o),n=v1214OrderInstallments(o),payText=v1214ContractPaymentText(o);
  let envs='';
  for(const e of o.environments||[]){
    const c=calcEnvironment(e);if(!c)continue;
    const envValue=v1214EnvironmentOrderValue(e,o,q);
    const mats=environmentMaterialRows(e,o.paymentCondition==='custom'?'p4':o.paymentCondition);
    envs+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td colspan="3">${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td></tr><tr><th>Valor deste ambiente</th><td colspan="3"><strong>${money(envValue)}</strong>${o.paymentCondition!=='cash'?` • ${n}x de ${money(envValue/n)}`:''}</td></tr></table><div class="section-title">Materiais deste ambiente</div><table class="summary-table"><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>${mats||'<tr><td colspan="6">Sem material oficial vinculado.</td></tr>'}</table></div>`;
  }
  const cset=companySettings(),warranty=o.documentVersions?.warrantyText||cset.warranty||V119_WARRANTY;
  const body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas e Persianas</strong><br>Luiz Sergio Delgobo ME<br>CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330<br><br><strong>PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br><strong>Cliente:</strong> ${esc(o.client||'-')}<br><strong>Contato:</strong> ${esc(o.contact||'-')}<br><strong>Endereço:</strong> ${esc(o.address||'-')}<br><strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}</div></div>${envs}<div class="section-title">Acompanhe seu pedido</div><div class="customer-access-box"><img class="customer-qr" src="${customerPortalQrUrl(o.numero)}" alt="QR Code para acompanhar o pedido"><div><strong>Portal do Cliente Nova Imagem</strong><br>Aponte a câmera para o QR Code.<br><br>Pedido: <strong>${String(o.numero).padStart(6,'0')}</strong><br>Senha: <strong>${esc(o.clientAccessCode)}</strong><br><a class="customer-portal-link" href="${customerPortalUrl(o.numero)}" target="_blank">Clique aqui para acompanhar seu pedido</a></div></div><div class="section-title">Condição contratada</div><p class="totals">${esc(payText)}</p><div class="section-title">CONTRATO DE FORNECIMENTO E INSTALAÇÃO</div><div class="conditions"><p><strong>CONTRATADA:</strong> Luiz Sergio Delgobo ME, CNPJ 15.115.803/0001-69.</p><p><strong>CONTRATANTE:</strong> ${esc(o.client||'-')}, endereço ${esc(o.address||'-')}.</p><p><strong>OBJETO:</strong> fornecimento e instalação dos produtos descritos neste pedido.</p><p><strong>CONDIÇÃO:</strong> ${esc(payText)}</p><p><strong>PRAZO PREVISTO:</strong> instalação/entrega em ${fmtDate(o.deliveryDate)}.</p></div><div class="signature-grid"><div><div class="signature-line"></div><strong>${esc(o.client||'Cliente')}</strong><br><small>Cliente / Contratante</small></div><div><div class="signature-line"></div><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><small>Eric Luiz Delgobo</small></div></div><div style="page-break-before:always"></div><div class="section-title">TERMO DE GARANTIA</div><div style="white-space:pre-line;line-height:1.55">${esc(warranty)}</div><br><p><strong>Pedido:</strong> ${String(o.numero).padStart(6,'0')} • <strong>Cliente:</strong> ${esc(o.client||'-')}</p><div class="signature-grid"><div><div class="signature-line"></div><strong>${esc(o.client||'Cliente')}</strong><br><small>Cliente / Contratante</small></div><div><div class="signature-line"></div><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><small>Eric Luiz Delgobo</small></div></div>`;
  printWindow(body);
};

document.addEventListener('DOMContentLoaded',()=>{
  $('eFixation')?.addEventListener('change',()=>{v1214RefreshFixProduct();updatePreview();});
  $('eWidth')?.addEventListener('input',()=>{v1214RefreshFixProduct();updatePreview();});
  $('eRailProduct')?.addEventListener('change',()=>{const p=officialProductById($('eRailProduct')?.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview();});
  v1214RefreshFixProduct();
});

/* ===== V12.1.5 • PRECIFICAÇÃO ESPECIAL: BASE 80% / À VISTA -8% / 18X = À VISTA ÷ 0,82 ===== */

/* ===== V12.1.6 • FIX DEFINITIVO SELEÇÃO FIXAÇÕES + SUPORTES/GARRAS ===== */
const v1216Fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
function v1216SupportCount(widthM){
  const w=Number(widthM||0);
  if(w<=2)return 2;
  if(w<=3)return 3;
  if(w<=4)return 4;
  if(w<=5)return 5;
  return 6; // de 5,01 até 6,00 m
}
function v1216TierLimit(name){
  const m=v1216Fold(name).match(/ATE\s*([0-9]+(?:[,.][0-9]+)?)M/);
  return m?Number(m[1].replace(',','.')):null;
}
function v1216SpecialList(kind,widthM){
  const k=v1216Fold(kind),w=Math.max(0,Number(widthM||0));
  let prefix='';
  if(k==='VARAO WAVE COM COMANDO POR CORDA')prefix='VARAO COM COMANDO POR CORDA';
  else if(k==='TRILHO SQUARE COM COMANDO')prefix='TRILHO SQUARE COM COMANDO';
  else if(k==='TRILHO MOTORIZADO')prefix='TRILHO MOTORIZADO';
  else return [];
  let list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&v1216Fold(p.product_name).startsWith(prefix+' ATE'));
  const tiers=[...new Set(list.map(p=>v1216TierLimit(p.product_name)).filter(x=>x!=null))].sort((a,b)=>a-b);
  const tier=tiers.find(x=>w<=x+1e-9);
  if(tier==null)return [];
  return list.filter(p=>Math.abs(Number(v1216TierLimit(p.product_name))-tier)<1e-9);
}
function v1216FixProducts(kind){
  const k=v1216Fold(kind),w=Math.max(0,Number($('eWidth')?.value||0)/100);
  if(k==='TRILHO SUICO')return officialSwissRails().filter(p=>Number(p.active??1)===1);
  if(k==='VARAO WAVE')return (priceProducts||[]).filter(p=>Number(p.active??1)===1&&v1216Fold(p.product_name)==='VARAO WAVE 28');
  return v1216SpecialList(kind,w);
}
function v1216RefreshFixProduct(){
  const kind=$('eFixation')?.value||'',sel=$('eRailProduct'),wrap=$('eRailProductWrap'),colorWrap=$('eFixColorWrap');
  if(!sel)return;
  const eligible=['TRILHO SUICO','VARAO WAVE','VARAO WAVE COM COMANDO POR CORDA','TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(v1216Fold(kind));
  if(!eligible){wrap?.classList.add('hidden');return;}
  wrap?.classList.remove('hidden');colorWrap?.classList.add('hidden');
  const old=officialProductById(sel.value),oldColor=old?.color||$('eFixColor')?.value||'';
  const list=v1216FixProducts(kind);
  let placeholder='SELECIONE A FIXAÇÃO DO ESTOQUE';
  if(v1216Fold(kind)==='TRILHO SUICO')placeholder='SELECIONE O TRILHO DO ESTOQUE';
  else if(v1216Fold(kind)==='VARAO WAVE')placeholder='SELECIONE O VARÃO WAVE / COR';
  else if(v1216Fold(kind)==='VARAO WAVE COM COMANDO POR CORDA')placeholder='SELECIONE O VARÃO COM COMANDO / COR';
  else if(v1216Fold(kind)==='TRILHO SQUARE COM COMANDO')placeholder='SELECIONE O TRILHO SQUARE / COR';
  else if(v1216Fold(kind)==='TRILHO MOTORIZADO')placeholder='SELECIONE O TRILHO MOTORIZADO / COR';
  if(!list.length){
    const w=Number($('eWidth')?.value||0)/100;
    sel.innerHTML=`<option value="">${w>6?'MEDIDA ACIMA DE 6M — DEFINIR SOLUÇÃO ESPECIAL':'NENHUM PRODUTO COMPATÍVEL CADASTRADO NO ESTOQUE'}</option>`;
    return;
  }
  v12FillProductSelect(sel,list,placeholder);
  const same=list.find(p=>v1216Fold(p.color)===v1216Fold(oldColor));
  if(same)sel.value=String(same.id);
  else if(v1216Fold(kind)==='TRILHO SUICO'){
    const d=v118DefaultSwissRail();if(d&&list.some(p=>Number(p.id)===Number(d.id)))sel.value=String(d.id);
  }
  const p=officialProductById(sel.value);
  if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';
}

const _v1216RefreshFix=v12RefreshFixations;
v12RefreshFixations=function(){
  _v1216RefreshFix();
  const el=$('eFixation');
  if(el){for(const k of ['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'])if(![...el.options].some(o=>o.value===k))el.add(new Option(k,k));}
  v1216RefreshFixProduct();
};

const _v1216EnvFromForm=envFromForm;
envFromForm=function(){
  const e=_v1216EnvFromForm();
  const k=v1216Fold(e.fixation),p=officialProductById($('eRailProduct')?.value);
  if(p&&['TRILHO SUICO','VARAO WAVE','VARAO WAVE COM COMANDO POR CORDA','TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(k)){
    e.railProductId=p.id;e.fixProductId=p.id;e.railProductName=p.product_name||'';e.fixProductName=p.product_name||'';e.railInternalCode=p.internal_code||'';e.fixColor=p.color||'';
  }
  return e;
};

const _v1216FixationCalc=fixationCalc;
fixationCalc=function(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){
  const k=v1216Fold(kind),w=Number(widthM||0),selected=officialProductById(railProductId);
  if(k==='VARAO WAVE'){
    const rod=selected&&v1216Fold(selected.product_name)==='VARAO WAVE 28'?selected:(priceProducts||[]).find(p=>Number(p.active??1)===1&&v1216Fold(p.product_name)==='VARAO WAVE 28'&&v1216Fold(p.color)===v1216Fold(fixColor));
    if(!rod)return {kind,total:0,hardwareBase:0,detail:'Selecione o Varão Wave do estoque'};
    const supports=v1216SupportCount(w),multiplier=model==='COMPLETE'?2:1,meters=w*multiplier,ends=model==='COMPLETE'?4:2;
    const supportName=model==='COMPLETE'?'SUPORTE 28/28':'SUPORTE WAVE 28';
    const sup=(priceProducts||[]).find(p=>Number(p.active??1)===1&&v1216Fold(p.product_name)===v1216Fold(supportName)&&v1216Fold(p.color)===v1216Fold(rod.color))||officialProductLike(['SUPORTE','WAVE','28'],rod.color);
    const cap=officialProductByName('TAMPA VARÃO WAVE 28',rod.color)||officialProductLike(['TAMPA','VARÃO','WAVE'],rod.color);
    const total=meters*Number(rod.price_4x||0)+supports*Number(sup?.price_4x||0)+ends*Number(cap?.price_4x||0);
    return {kind,total,hardwareBase:total,meters,supports,ends,railProductId:rod.id,railName:rod.product_name,railColor:rod.color,supportProductId:sup?.id||null,supportName:sup?.product_name||supportName,capProductId:cap?.id||null,detail:`${rod.product_name} • ${rod.color||''} • ${meters.toFixed(2)}m • ${supports} suportes • ${ends} tampas`};
  }
  if(k==='VARAO WAVE COM COMANDO POR CORDA'){
    const rod=(selected&&v1216Fold(selected.product_name).startsWith('VARAO COM COMANDO POR CORDA'))?selected:(v1216SpecialList(kind,w).find(p=>v1216Fold(p.color)===v1216Fold(fixColor))||v1216SpecialList(kind,w)[0]);
    if(!rod)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o varão com comando'};
    const supports=v1216SupportCount(w);
    const sup=officialProductByName('SUPORTE WAVE 28',rod.color)||officialProductLike(['SUPORTE','WAVE','28'],rod.color);
    const total=Number(rod.price_4x||0)+supports*Number(sup?.price_4x||0);
    return {kind,total,hardwareBase:total,meters:0,units:1,supports,railProductId:rod.id,railName:rod.product_name,railColor:rod.color,supportProductId:sup?.id||null,supportName:sup?.product_name||'SUPORTE WAVE 28',detail:`${rod.product_name} • ${rod.color||''} • 1 un • ${supports} suportes`};
  }
  if(k==='TRILHO SQUARE COM COMANDO'){
    const rail=(selected&&v1216Fold(selected.product_name).startsWith('TRILHO SQUARE COM COMANDO'))?selected:(v1216SpecialList(kind,w).find(p=>v1216Fold(p.color)===v1216Fold(fixColor))||v1216SpecialList(kind,w)[0]);
    if(!rail)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o Trilho Square'};
    const claws=Math.max(2,Math.ceil(w/0.60));
    const claw=officialProductLike(['GARRA','TRILHO'],rail.color)||officialProductLike(['GARRA']);
    const total=Number(rail.price_4x||0)+claws*Number(claw?.price_4x||0);
    return {kind,total,hardwareBase:total,meters:0,units:1,clamps:claws,railProductId:rail.id,railName:rail.product_name,railColor:rail.color,clawProductId:claw?.id||null,detail:`${rail.product_name} • ${rail.color||''} • 1 un • ${claws} garras`};
  }
  if(k==='TRILHO MOTORIZADO'){
    const rail=(selected&&v1216Fold(selected.product_name).startsWith('TRILHO MOTORIZADO'))?selected:(v1216SpecialList(kind,w).find(p=>v1216Fold(p.color)===v1216Fold(fixColor))||v1216SpecialList(kind,w)[0]);
    if(!rail)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o trilho motorizado'};
    const remote=(priceProducts||[]).find(p=>Number(p.active??1)===1&&v1216Fold(p.product_name)==='CONTROLE REMOTO TRILHO MOTORIZADO');
    const total=Number(rail.price_4x||0)+Number(remote?.price_4x||0);
    return {kind,total,hardwareBase:total,meters:0,units:1,railProductId:rail.id,railName:rail.product_name,railColor:rail.color,remoteProductId:remote?.id||null,detail:`${rail.product_name} • ${rail.color||''} • 1 un • controle remoto incluído`};
  }
  return _v1216FixationCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial);
};

document.addEventListener('DOMContentLoaded',()=>{
  $('eFixation')?.addEventListener('change',()=>{v1216RefreshFixProduct();updatePreview();});
  $('eWidth')?.addEventListener('input',()=>{v1216RefreshFixProduct();updatePreview();});
  $('eRailProduct')?.addEventListener('change',()=>{const p=officialProductById($('eRailProduct')?.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview();});
  v1216RefreshFixProduct();
});


/* ===== V12.1.7 • ESTOQUE EXPLÍCITO DE FIXAÇÕES ESPECIAIS ===== */
function v1217PriceFields(cost,markup=80){
  const c=Number(cost||0),m=Number(markup||80),p4=c*(1+m/100),cash=p4*0.92,p18=cash/0.82;
  return {cost:c,markup_percent:m,price_4x:p4,price_cash:cash,price_18x:p18};
}
function v1217SpecialSpecs(){
  const out=[];
  // Motorizado: um SKU por limite de tamanho, produto pronto/sob encomenda, estoque inicial zero.
  for(const x of V1213_SPECIAL_SPECS.motor)out.push({name:v1213TierName('TRILHO MOTORIZADO',x.m),color:'SEM COR',cost:x.c,tag:`MOT-${String(x.m).replace('.','')}`});
  out.push({name:'CONTROLE REMOTO TRILHO MOTORIZADO',color:'SEM COR',cost:140,tag:'CTRL-MOT'});
  // Varão com comando: todas as cores do Varão Wave 28.
  const rodColors=['CROMADO','BRANCO','PRETO','PRATA ESCOVADO','OURO VELHO'];
  for(const x of V1213_SPECIAL_SPECS.cordRod)for(const color of rodColors)out.push({name:v1213TierName('VARÃO COM COMANDO POR CORDA',x.m),color,cost:x.c,tag:`VC-${x.m}-${color}`});
  // Square: branco e preto.
  for(const x of V1213_SPECIAL_SPECS.square)for(const color of ['BRANCO','PRETO'])out.push({name:v1213TierName('TRILHO SQUARE COM COMANDO',x.m),color,cost:x.c,tag:`SQ-${x.m}-${color}`});
  return out;
}
function v1217VirtualId(spec){
  let h=2166136261; const str=`${spec.name}|${spec.color}`;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
  return -Math.abs(h||1);
}
function v1217VirtualProduct(spec){
  const pr=v1217PriceFields(spec.cost,80),id=v1217VirtualId(spec);
  return {id,internal_code:`NI-SP-${String(Math.abs(id)).slice(0,6)}`,supplier:'A DEFINIR',supplier_code:'',category:'ACESSÓRIO',product_name:spec.name,color:spec.color,width_cm:0,unit:'UN',stock_quantity:0,minimum_stock:0,active:1,ncm:'',cfop_internal:'',cfop_interstate:'',...pr,_virtual_special:true};
}
function v1217InjectMissingSpecials(){
  priceProducts=Array.isArray(priceProducts)?priceProducts:[];
  for(const spec of v1217SpecialSpecs()){
    const exists=priceProducts.some(p=>Number(p.active??1)===1&&v1216Fold(p.product_name)===v1216Fold(spec.name)&&v1216Fold(p.color)===v1216Fold(spec.color));
    if(!exists)priceProducts.push(v1217VirtualProduct(spec));
  }
}
async function v1217EnsureSpecialProducts(){
  if(!isGestor()){v1217InjectMissingSpecials();return;}
  const supplier=((db.suppliers||[]).find(x=>String(x.name||'').trim())||{}).name||'A DEFINIR';
  for(const spec of v1217SpecialSpecs()){
    const exists=(priceProducts||[]).some(p=>Number(p.active??1)===1&&!p._virtual_special&&v1216Fold(p.product_name)===v1216Fold(spec.name)&&v1216Fold(p.color)===v1216Fold(spec.color));
    if(exists)continue;
    try{
      await api('prices',{method:'POST',body:JSON.stringify({action:'CRIAR',supplier,supplier_code:'',category:'ACESSÓRIO',product_name:spec.name,color:spec.color,width_cm:0,unit:'UN',stock_quantity:0,cost:spec.cost,markup_percent:80,ncm:'',cfop_internal:'',cfop_interstate:''})});
    }catch(e){console.warn('V12.1.7 • não foi possível persistir SKU especial, usando fallback local:',spec.name,spec.color,e.message)}
  }
  try{await api('prices',{method:'POST',body:JSON.stringify({action:'SINCRONIZAR_PRECOS_ESPECIAIS'})})}catch(e){console.warn('V12.1.7 sincronização de preços:',e.message)}
  try{await reloadOfficialProducts()}catch(e){console.warn('V12.1.7 recarga de produtos:',e.message)}
  v1217InjectMissingSpecials();
}
function v1217IsSpecialProduct(p){
  const n=v1216Fold(p?.product_name);
  return n.startsWith('TRILHO MOTORIZADO ATE')||n==='CONTROLE REMOTO TRILHO MOTORIZADO'||n.startsWith('VARAO COM COMANDO POR CORDA ATE')||n.startsWith('TRILHO SQUARE COM COMANDO ATE');
}
function v1217TierList(prefix,widthM){
  const w=Math.max(0,Number(widthM||0));
  let list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&v1216Fold(p.product_name).startsWith(v1216Fold(prefix)+' ATE'));
  const tiers=[...new Set(list.map(p=>v1216TierLimit(p.product_name)).filter(x=>x!=null))].sort((a,b)=>a-b);
  const tier=tiers.find(x=>w<=x+1e-9); if(tier==null)return [];
  return list.filter(p=>Math.abs(Number(v1216TierLimit(p.product_name))-tier)<1e-9);
}
function v1217FixProducts(kind){
  const k=v1216Fold(kind),w=Math.max(0,Number($('eWidth')?.value||0)/100);
  if(k==='TRILHO SUICO')return officialSwissRails().filter(p=>Number(p.active??1)===1);
  if(k==='VARAO WAVE')return (priceProducts||[]).filter(p=>{
    const n=v1216Fold(p.product_name);return Number(p.active??1)===1&&n.includes('VARAO')&&n.includes('WAVE')&&!n.includes('TAMPA')&&!n.includes('SUPORTE')&&!n.includes('COMANDO');
  });
  if(k==='VARAO WAVE COM COMANDO POR CORDA')return v1217TierList('VARÃO COM COMANDO POR CORDA',w);
  if(k==='TRILHO SQUARE COM COMANDO')return v1217TierList('TRILHO SQUARE COM COMANDO',w);
  if(k==='TRILHO MOTORIZADO'){
    const all=v1217TierList('TRILHO MOTORIZADO',w),single=all.filter(p=>v1216Fold(p.color)==='SEM COR');
    return single.length?single:all;
  }
  return [];
}
function v1217RefreshFixProduct(){
  const kind=$('eFixation')?.value||'',sel=$('eRailProduct'),wrap=$('eRailProductWrap'),colorWrap=$('eFixColorWrap'); if(!sel)return;
  const k=v1216Fold(kind),eligible=['TRILHO SUICO','VARAO WAVE','VARAO WAVE COM COMANDO POR CORDA','TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(k);
  if(!eligible){wrap?.classList.add('hidden');colorWrap?.classList.remove('hidden');return;}
  wrap?.classList.remove('hidden');colorWrap?.classList.add('hidden');
  const old=officialProductById(sel.value),oldColor=old?.color||$('eFixColor')?.value||'',list=v1217FixProducts(kind);
  let placeholder='SELECIONE A FIXAÇÃO DO ESTOQUE';
  if(k==='TRILHO SUICO')placeholder='SELECIONE O TRILHO DO ESTOQUE';
  if(k==='VARAO WAVE')placeholder='SELECIONE O VARÃO WAVE / COR';
  if(k==='VARAO WAVE COM COMANDO POR CORDA')placeholder='SELECIONE O VARÃO COM COMANDO / COR';
  if(k==='TRILHO SQUARE COM COMANDO')placeholder='SELECIONE O TRILHO SQUARE / COR';
  if(k==='TRILHO MOTORIZADO')placeholder='TRILHO MOTORIZADO ADEQUADO À MEDIDA';
  if(!list.length){sel.innerHTML=`<option value="">${Number($('eWidth')?.value||0)/100>6?'MEDIDA ACIMA DE 6M — DEFINIR SOLUÇÃO ESPECIAL':'NENHUM PRODUTO COMPATÍVEL CADASTRADO NO ESTOQUE'}</option>`;return;}
  v12FillProductSelect(sel,list,placeholder);
  let same=list.find(p=>v1216Fold(p.color)===v1216Fold(oldColor));
  if(!same&&k==='TRILHO MOTORIZADO'&&list.length===1)same=list[0];
  if(same)sel.value=String(same.id); else if(k==='TRILHO SUICO'){const d=v118DefaultSwissRail();if(d&&list.some(p=>Number(p.id)===Number(d.id)))sel.value=String(d.id)}
  const p=officialProductById(sel.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';
}
// Não baixar os produtos prontos/sob encomenda do estoque zerado. Eles entram em “materiais para solicitar”.
const _v1217ConsumeOfficialStock=consumeOfficialStock;
consumeOfficialStock=async function(q,order){
  const all=officialOrderRequirements(q),specialIds=new Set((priceProducts||[]).filter(v1217IsSpecialProduct).map(p=>Number(p.id)));
  if(!all.some(x=>specialIds.has(Number(x.product_id))))return _v1217ConsumeOfficialStock(q,order);
  const original=officialOrderRequirements;
  officialOrderRequirements=function(qq){return original(qq).filter(x=>!specialIds.has(Number(x.product_id)))};
  try{return await _v1217ConsumeOfficialStock(q,order)}finally{officialOrderRequirements=original}
};
const _v1217LoadCloud=loadCloud;
loadCloud=async function(){await _v1217LoadCloud();await v1217EnsureSpecialProducts();v1217RefreshFixProduct();renderAll()};
const _v1217RenderOfficialStock=renderOfficialStock;
renderOfficialStock=function(){v1217InjectMissingSpecials();return _v1217RenderOfficialStock()};
document.addEventListener('DOMContentLoaded',()=>{
  $('eFixation')?.addEventListener('change',()=>{v1217RefreshFixProduct();updatePreview()});
  $('eWidth')?.addEventListener('input',()=>{v1217RefreshFixProduct();updatePreview()});
  $('eRailProduct')?.addEventListener('change',()=>{const p=officialProductById($('eRailProduct')?.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview()});
  setTimeout(()=>{v1217InjectMissingSpecials();v1217RefreshFixProduct()},0);
});

/* ===== V12.1.8 • CORREÇÃO DEFINITIVA DO SELETOR DE FIXAÇÕES =====
   Motivo: a rotina antiga v1191Conditional() forçava WAVE de volta para TRILHO SUÍÇO
   em todo change, impedindo selecionar Varão Wave, Varão com comando, Square e Motorizado.
*/
(function(){
  const SPECIAL_FIXES=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'];
  const FOLD=x=>v1216Fold(x||'');

  // Todas as fixações compatíveis ficam disponíveis quando não é família de tubo/argola.
  v1191CompatibleFixations=function(){
    const fp=$('eFinishPleat')?.value||'', lp=$('eLiningPleat')?.value||'';
    if(isTubePleat(fp)||isTubePleat(lp))return [];
    return [...SPECIAL_FIXES];
  };

  // Preserva a escolha do usuário. A versão antiga forçava TRILHO SUÍÇO sempre que a prega era WAVE.
  const oldConditional=v1191Conditional;
  v1191Conditional=function(){
    const fixEl=$('eFixation');
    const wanted=fixEl?.value||'';
    oldConditional();
    const fp=$('eFinishPleat')?.value||'', lp=$('eLiningPleat')?.value||'';
    if(!(isTubePleat(fp)||isTubePleat(lp)) && fixEl){
      const current=fixEl.value;
      const options=SPECIAL_FIXES;
      setSelectOptions(fixEl,options,options.includes(wanted)?wanted:(options.includes(current)?current:'TRILHO SUÍÇO'));
      if(options.includes(wanted))fixEl.value=wanted;
    }
    v1218RefreshFixProduct();
  };

  function motorTierProducts(widthM){
    const w=Math.max(0,Number(widthM||0));
    let list=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&FOLD(p.product_name).startsWith('TRILHO MOTORIZADO ATE'));
    const tiers=[...new Set(list.map(p=>v1216TierLimit(p.product_name)).filter(x=>x!=null))].sort((a,b)=>a-b);
    const tier=tiers.find(x=>w<=x+1e-9); if(tier==null)return [];
    list=list.filter(p=>Math.abs(Number(v1216TierLimit(p.product_name))-tier)<1e-9);
    // Na V12.1.8 o motorizado é sempre BRANCO ou PRETO. SKUs antigos SEM COR ficam ocultos do orçamento.
    return list.filter(p=>['BRANCO','PRETO'].includes(FOLD(p.color)));
  }

  // Sobrescreve a lista para cada família, sem depender de categoria/nome genérico.
  function v1218FixProducts(kind){
    const k=FOLD(kind),w=Math.max(0,Number($('eWidth')?.value||0)/100);
    if(k==='TRILHO SUICO')return officialSwissRails().filter(p=>Number(p.active??1)===1);
    if(k==='VARAO WAVE')return (priceProducts||[]).filter(p=>{
      const n=FOLD(p.product_name);
      return Number(p.active??1)===1 && n==='VARAO WAVE 28' && !n.includes('COMANDO');
    });
    if(k==='VARAO WAVE COM COMANDO POR CORDA')return v1217TierList('VARÃO COM COMANDO POR CORDA',w)
      .filter(p=>['CROMADO','BRANCO','PRETO','PRATA ESCOVADO','OURO VELHO'].includes(FOLD(p.color)));
    if(k==='TRILHO SQUARE COM COMANDO')return v1217TierList('TRILHO SQUARE COM COMANDO',w)
      .filter(p=>['BRANCO','PRETO'].includes(FOLD(p.color)));
    if(k==='TRILHO MOTORIZADO')return motorTierProducts(w);
    return [];
  }

  window.v1218RefreshFixProduct=function(){
    const kind=$('eFixation')?.value||'', sel=$('eRailProduct'), wrap=$('eRailProductWrap'), colorWrap=$('eFixColorWrap');
    if(!sel)return;
    const k=FOLD(kind),eligible=SPECIAL_FIXES.map(FOLD).includes(k);
    if(!eligible){wrap?.classList.add('hidden');colorWrap?.classList.remove('hidden');return;}
    wrap?.classList.remove('hidden'); colorWrap?.classList.add('hidden');
    const previous=officialProductById(sel.value), oldColor=previous?.color||$('eFixColor')?.value||'';
    const list=v1218FixProducts(kind);
    let placeholder='SELECIONE A FIXAÇÃO DO ESTOQUE';
    if(k==='TRILHO SUICO')placeholder='SELECIONE O TRILHO DO ESTOQUE';
    else if(k==='VARAO WAVE')placeholder='SELECIONE O VARÃO WAVE / COR';
    else if(k==='VARAO WAVE COM COMANDO POR CORDA')placeholder='SELECIONE O VARÃO COM COMANDO / COR';
    else if(k==='TRILHO SQUARE COM COMANDO')placeholder='SELECIONE O TRILHO SQUARE / COR';
    else if(k==='TRILHO MOTORIZADO')placeholder='SELECIONE A COR DO TRILHO MOTORIZADO';
    if(!list.length){
      const over=Number($('eWidth')?.value||0)/100>6;
      sel.innerHTML=`<option value="">${over?'MEDIDA ACIMA DE 6M — DEFINIR SOLUÇÃO ESPECIAL':'NENHUM PRODUTO COMPATÍVEL CADASTRADO NO ESTOQUE'}</option>`;
      return;
    }
    v12FillProductSelect(sel,list,placeholder);
    let same=list.find(p=>FOLD(p.color)===FOLD(oldColor));
    if(!same&&k==='TRILHO SUICO'){
      const d=v118DefaultSwissRail();if(d&&list.some(p=>Number(p.id)===Number(d.id)))same=d;
    }
    if(same)sel.value=String(same.id);
    const p=officialProductById(sel.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';
  };

  // Garante que qualquer rotina legada que chame v12RefreshFixations termine no seletor correto.
  const oldV12Refresh=v12RefreshFixations;
  v12RefreshFixations=function(){
    const wanted=$('eFixation')?.value||'';
    oldV12Refresh();
    const el=$('eFixation');
    if(el && SPECIAL_FIXES.includes(wanted)){
      if(![...el.options].some(o=>o.value===wanted))el.add(new Option(wanted,wanted));
      el.value=wanted;
    }
    v1218RefreshFixProduct();
  };

  // Produtos especiais: motorizado ganha SKU por COR e FAIXA, ambos com estoque zero.
  const oldSpecialSpecs=v1217SpecialSpecs;
  v1217SpecialSpecs=function(){
    const base=oldSpecialSpecs().filter(s=>!(FOLD(s.name).startsWith('TRILHO MOTORIZADO ATE')));
    for(const x of V1213_SPECIAL_SPECS.motor){
      for(const color of ['BRANCO','PRETO'])base.push({name:v1213TierName('TRILHO MOTORIZADO',x.m),color,cost:x.c,tag:`MOT-${String(x.m).replace('.','')}-${color}`});
    }
    return base;
  };

  // Quantidade de suportes para Varão Wave e Varão com comando: mínimo 2, chegando a 6 em 6 m.
  function rodSupports(w){w=Number(w||0);return w<=2?2:w<=3?3:w<=4?4:w<=5?5:6;}
  const oldFixCalc=fixationCalc;
  fixationCalc=function(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){
    const k=FOLD(kind),w=Number(widthM||0),selected=officialProductById(railProductId);
    if(k==='VARAO WAVE'){
      const rod=(selected&&FOLD(selected.product_name)==='VARAO WAVE 28')?selected:(v1218FixProducts(kind).find(p=>FOLD(p.color)===FOLD(fixColor))||v1218FixProducts(kind)[0]);
      if(!rod)return {kind,total:0,hardwareBase:0,detail:'Selecione o Varão Wave / cor'};
      const supports=rodSupports(w),sup=officialProductByName('SUPORTE WAVE 28',rod.color)||officialProductLike(['SUPORTE','WAVE','28'],rod.color),cap=officialProductByName('TAMPA VARÃO WAVE 28',rod.color)||officialProductLike(['TAMPA','VARÃO','WAVE'],rod.color);
      const ends=model==='COMPLETE'?4:2;
      const total=w*Number(rod.price_4x||0)+supports*Number(sup?.price_4x||0)+ends*Number(cap?.price_4x||0);
      return {kind,total,hardwareBase:total,meters:w,supports,ends,railProductId:rod.id,railName:rod.product_name,railColor:rod.color,supportProductId:sup?.id||null,capProductId:cap?.id||null,detail:`${rod.product_name} • ${rod.color} • ${w.toFixed(2)} m • ${supports} suportes • ${ends} tampas`};
    }
    if(k==='VARAO WAVE COM COMANDO POR CORDA'){
      const rod=(selected&&FOLD(selected.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE'))?selected:(v1218FixProducts(kind).find(p=>FOLD(p.color)===FOLD(fixColor))||v1218FixProducts(kind)[0]);
      if(!rod)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o varão com comando / cor'};
      const supports=rodSupports(w),sup=officialProductByName('SUPORTE WAVE 28',rod.color)||officialProductLike(['SUPORTE','WAVE','28'],rod.color);
      const total=Number(rod.price_4x||0)+supports*Number(sup?.price_4x||0);
      return {kind,total,hardwareBase:total,meters:0,units:1,supports,railProductId:rod.id,railName:rod.product_name,railColor:rod.color,supportProductId:sup?.id||null,detail:`${rod.product_name} • ${rod.color} • 1 un • ${supports} suportes`};
    }
    if(k==='TRILHO SQUARE COM COMANDO'){
      const rail=(selected&&FOLD(selected.product_name).startsWith('TRILHO SQUARE COM COMANDO ATE'))?selected:(v1218FixProducts(kind).find(p=>FOLD(p.color)===FOLD(fixColor))||v1218FixProducts(kind)[0]);
      if(!rail)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione o Square / cor'};
      const claws=Math.max(2,Math.ceil(w/0.60)),claw=officialProductLike(['GARRA','TRILHO'],rail.color)||officialProductLike(['GARRA']);
      const total=Number(rail.price_4x||0)+claws*Number(claw?.price_4x||0);
      return {kind,total,hardwareBase:total,meters:0,units:1,clamps:claws,railProductId:rail.id,railName:rail.product_name,railColor:rail.color,clawProductId:claw?.id||null,detail:`${rail.product_name} • ${rail.color} • 1 un • ${claws} garras`};
    }
    if(k==='TRILHO MOTORIZADO'){
      const rail=(selected&&FOLD(selected.product_name).startsWith('TRILHO MOTORIZADO ATE'))?selected:(v1218FixProducts(kind).find(p=>FOLD(p.color)===FOLD(fixColor))||v1218FixProducts(kind)[0]);
      if(!rail)return {kind,total:0,hardwareBase:0,detail:w>6?'ACIMA DE 6M • DEFINIR SOLUÇÃO ESPECIAL':'Selecione BRANCO ou PRETO'};
      const remote=(priceProducts||[]).find(p=>Number(p.active??1)===1&&FOLD(p.product_name)==='CONTROLE REMOTO TRILHO MOTORIZADO');
      const total=Number(rail.price_4x||0)+Number(remote?.price_4x||0);
      return {kind,total,hardwareBase:total,meters:0,units:1,railProductId:rail.id,railName:rail.product_name,railColor:rail.color,remoteProductId:remote?.id||null,detail:`${rail.product_name} • ${rail.color} • 1 un • controle remoto incluído`};
    }
    return oldFixCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial);
  };

  // Salva o produto real escolhido em todas as famílias do novo seletor.
  const oldEnv=envFromForm;
  envFromForm=function(){
    const e=oldEnv();
    const k=FOLD(e.fixation),p=officialProductById($('eRailProduct')?.value);
    if(p&&SPECIAL_FIXES.map(FOLD).includes(k)){
      e.fixProductId=p.id;e.fixProductName=p.product_name||'';e.fixColor=p.color||'';
      e.railProductId=p.id;e.railProductName=p.product_name||'';e.railInternalCode=p.internal_code||'';
    }
    return e;
  };

  document.addEventListener('DOMContentLoaded',()=>{
    const f=$('eFixation');
    if(f){
      f.addEventListener('change',()=>{setTimeout(()=>{v1218RefreshFixProduct();updatePreview()},0)});
    }
    $('eWidth')?.addEventListener('input',()=>setTimeout(()=>{v1218RefreshFixProduct();updatePreview()},0));
    $('eRailProduct')?.addEventListener('change',()=>{const p=officialProductById($('eRailProduct')?.value);if(p&&$('eFixColor'))$('eFixColor').value=p.color||'';updatePreview()});
    setTimeout(async()=>{
      try{await v1217EnsureSpecialProducts()}catch(e){console.warn('V12.1.8 produtos especiais',e)}
      v1218RefreshFixProduct();
    },50);
  });
})();


/* ===== V12.1.9 • NOVO FLUXO INDEPENDENTE DE FIXAÇÃO E DESLIZAMENTO =====
   Reconstrução do seletor para não depender do eFixation legado.
*/
(function(){
  const F=x=>v1216Fold(x||'');
  const FAMILIES=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO COM COMANDO','TRILHO MOTORIZADO'];
  const INTERNAL={
    'TRILHO SUÍÇO':'TRILHO SUÍÇO',
    'VARÃO WAVE':'VARÃO WAVE',
    'TRILHO SQUARE COM COMANDO':'TRILHO SQUARE COM COMANDO',
    'VARÃO COM COMANDO':'VARÃO WAVE COM COMANDO POR CORDA',
    'TRILHO MOTORIZADO':'TRILHO MOTORIZADO'
  };
  function currentFamily(){return $('eFixationMode')?.value||'TRILHO SUÍÇO'}
  function internalFamily(){return INTERNAL[currentFamily()]||'TRILHO SUÍÇO'}
  function widthM(){return Math.max(0,Number($('eWidth')?.value||0)/100)}
  function activeProducts(){return (priceProducts||[]).filter(p=>Number(p.active??1)===1)}
  function swissProducts(){return activeProducts().filter(p=>officialSwissRails().some(r=>Number(r.id)===Number(p.id)))}
  function tierLimit(name){return v1216TierLimit(name)}
  function chooseTier(list,w){
    const limits=[...new Set(list.map(p=>tierLimit(p.product_name)).filter(x=>x!=null))].sort((a,b)=>a-b);
    const t=limits.find(x=>w<=x+1e-9); if(t==null)return [];
    return list.filter(p=>Math.abs(Number(tierLimit(p.product_name))-t)<1e-9);
  }
  function familyProducts(fam){
    const w=widthM(), all=activeProducts();
    if(fam==='TRILHO SUÍÇO')return swissProducts();
    if(fam==='VARÃO WAVE')return all.filter(p=>F(p.product_name)==='VARAO WAVE 28');
    if(fam==='VARÃO COM COMANDO')return chooseTier(all.filter(p=>F(p.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE')),w);
    if(fam==='TRILHO SQUARE COM COMANDO')return chooseTier(all.filter(p=>F(p.product_name).startsWith('TRILHO SQUARE COM COMANDO ATE')),w);
    if(fam==='TRILHO MOTORIZADO')return chooseTier(all.filter(p=>F(p.product_name).startsWith('TRILHO MOTORIZADO ATE')),w);
    return [];
  }
  function uniq(arr){return [...new Set(arr.filter(Boolean))]}
  function swissModelName(p){return String(p.product_name||'').trim()}
  function selectedSwissModel(){return $('eSwissModel')?.value||''}
  function allowedColors(fam){
    if(['TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(fam))return ['BRANCO','PRETO'];
    if(fam==='VARÃO COM COMANDO')return ['CROMADO','BRANCO','PRETO','PRATA ESCOVADO','OURO VELHO'];
    if(fam==='VARÃO WAVE')return uniq(familyProducts(fam).map(p=>String(p.color||'').toUpperCase()));
    if(fam==='TRILHO SUÍÇO'){
      const m=selectedSwissModel();
      return uniq(familyProducts(fam).filter(p=>!m||swissModelName(p)===m).map(p=>String(p.color||'').toUpperCase()));
    }
    return [];
  }
  function setSimpleOptions(sel,values,wanted,placeholder){
    if(!sel)return;
    sel.innerHTML='';
    if(placeholder){const o=new Option(placeholder,'');sel.add(o)}
    values.forEach(v=>sel.add(new Option(v,v)));
    if(wanted&&values.includes(wanted))sel.value=wanted;
    else if(values.length)sel.value=values[0];
  }
  function resolveProduct(){
    const fam=currentFamily(), color=$('eFixColor')?.value||'', list=familyProducts(fam);
    if(fam==='TRILHO SUÍÇO'){
      const model=selectedSwissModel();
      return list.find(p=>swissModelName(p)===model&&F(p.color)===F(color))||list.find(p=>swissModelName(p)===model)||null;
    }
    return list.find(p=>F(p.color)===F(color))||list[0]||null;
  }
  function syncLegacy(){
    const old=$('eFixation'), fam=internalFamily();
    if(old){if(![...old.options].some(o=>o.value===fam))old.add(new Option(fam,fam));old.value=fam}
    const p=resolveProduct();
    if(p&&$('eRailProduct')){
      const rp=$('eRailProduct');
      if(![...rp.options].some(o=>String(o.value)===String(p.id)))rp.add(new Option(`${p.product_name} — ${p.color}`,String(p.id)));
      rp.value=String(p.id);
    }
  }
  function refreshUI(preserve=true){
    const fam=currentFamily();
    const modelWrap=$('eSwissModelWrap'), color=$('eFixColor');
    modelWrap?.classList.toggle('hidden',fam!=='TRILHO SUÍÇO');
    const oldModel=preserve?selectedSwissModel():'';
    if(fam==='TRILHO SUÍÇO'){
      const models=uniq(familyProducts(fam).map(swissModelName));
      setSimpleOptions($('eSwissModel'),models,oldModel,'SELECIONE O MODELO');
    }
    const oldColor=preserve?(color?.value||''):'';
    setSimpleOptions(color,allowedColors(fam),oldColor,'SELECIONE A COR');
    const p=resolveProduct();
    const info=$('eFixResolved');
    if(info){
      if(p)info.textContent=`SKU selecionado: ${p.product_name} • ${p.color||'SEM COR'}${p.internal_code?' • '+p.internal_code:''}`;
      else if(widthM()>6&&fam!=='TRILHO SUÍÇO'&&fam!=='VARÃO WAVE')info.textContent='Medida acima de 6,00 m — definir solução especial.';
      else info.textContent='Nenhum SKU compatível encontrado para esta combinação.';
    }
    syncLegacy();
  }
  function buildUI(){
    if($('eFixationMode'))return;
    const legacyWrap=$('eFixationWrap');
    if(!legacyWrap)return;
    legacyWrap.classList.add('hidden');
    const fam=document.createElement('label');fam.className='field';fam.id='eFixationModeWrap';fam.innerHTML='<span>FIXAÇÃO E DESLIZAMENTO</span><select id="eFixationMode"></select>';
    legacyWrap.parentNode.insertBefore(fam,legacyWrap);
    const swiss=document.createElement('label');swiss.className='field';swiss.id='eSwissModelWrap';swiss.innerHTML='<span>MODELO DO TRILHO SUÍÇO</span><select id="eSwissModel"></select>';
    fam.parentNode.insertBefore(swiss,legacyWrap);
    const colorWrap=$('eFixColorWrap');if(colorWrap){colorWrap.classList.remove('hidden');colorWrap.firstChild.textContent='PADRÃO DE COR';}
    const railWrap=$('eRailProductWrap');if(railWrap)railWrap.classList.add('hidden');
    const info=document.createElement('div');info.id='eFixResolved';info.style.cssText='grid-column:1/-1;font-size:12px;color:#47606a;margin-top:-4px';
    swiss.parentNode.insertBefore(info,$('eMotorAngleWrap')||legacyWrap.nextSibling);
    setSimpleOptions($('eFixationMode'),FAMILIES,'TRILHO SUÍÇO');
    refreshUI(false);
    $('eFixationMode')?.addEventListener('change',()=>{refreshUI(false);updatePreview()});
    $('eSwissModel')?.addEventListener('change',()=>{refreshUI(true);updatePreview()});
    $('eFixColor')?.addEventListener('change',()=>{syncLegacy();updatePreview()});
    $('eWidth')?.addEventListener('input',()=>{refreshUI(true);updatePreview()});
  }
  const previousEnv=envFromForm;
  envFromForm=function(){
    const e=previousEnv();
    if(!$('eFixationMode'))return e;
    const fam=currentFamily(), internal=internalFamily(), p=resolveProduct();
    e.fixation=internal;
    e.fixColor=$('eFixColor')?.value||p?.color||'';
    e.fixProductId=p?.id||null;e.fixProductName=p?.product_name||'';
    e.railProductId=p?.id||null;e.railProductName=p?.product_name||'';e.railInternalCode=p?.internal_code||'';
    return e;
  };
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{buildUI();refreshUI(false);updatePreview()},120));
  const oldLoad=loadCloud;
  loadCloud=async function(){await oldLoad();setTimeout(()=>{buildUI();refreshUI(true);updatePreview()},0)};
})();

/* ===== V12.2.0 • FIXAÇÃO RECONSTRUÍDA NO SELETOR ORIGINAL =====
   O seletor eFixation passa a ser a fonte única da família de fixação.
   Neutraliza rotinas legadas que forçavam WAVE -> TRILHO SUÍÇO.
*/
(function(){
  const FAMILY_OPTIONS=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO COM COMANDO','TRILHO MOTORIZADO'];
  const INTERNAL={
    'TRILHO SUÍÇO':'TRILHO SUÍÇO',
    'VARÃO WAVE':'VARÃO WAVE',
    'TRILHO SQUARE COM COMANDO':'TRILHO SQUARE COM COMANDO',
    'VARÃO COM COMANDO':'VARÃO WAVE COM COMANDO POR CORDA',
    'TRILHO MOTORIZADO':'TRILHO MOTORIZADO'
  };
  const DISPLAY={
    'TRILHO SUÍÇO':'TRILHO SUÍÇO',
    'VARÃO WAVE':'VARÃO WAVE',
    'TRILHO SQUARE COM COMANDO':'TRILHO SQUARE COM COMANDO',
    'VARÃO WAVE COM COMANDO POR CORDA':'VARÃO COM COMANDO',
    'TRILHO MOTORIZADO':'TRILHO MOTORIZADO'
  };
  const fold=x=>v1216Fold(x||'');
  const active=()=> (priceProducts||[]).filter(p=>Number(p.active??1)===1);
  const widthM=()=>Math.max(0,Number($('eWidth')?.value||0)/100);
  let desired='TRILHO SUÍÇO';
  let refreshing=false;
  const uniq=a=>[...new Set(a.filter(Boolean))];
  function tierLimit(name){return v1216TierLimit(name)}
  function chooseTier(list,w){
    const limits=uniq(list.map(p=>tierLimit(p.product_name)).filter(x=>x!=null)).sort((a,b)=>a-b);
    const t=limits.find(x=>w<=Number(x)+1e-9);if(t==null)return [];
    return list.filter(p=>Math.abs(Number(tierLimit(p.product_name))-Number(t))<1e-9);
  }
  function swissProducts(){
    const ids=new Set((officialSwissRails()||[]).map(p=>Number(p.id)));
    return active().filter(p=>ids.has(Number(p.id)));
  }
  function currentDisplay(){
    const v=$('eFixation')?.value||desired||'TRILHO SUÍÇO';
    return DISPLAY[v]||v;
  }
  function currentInternal(){return INTERNAL[currentDisplay()]||currentDisplay()}
  function familyProducts(display){
    const all=active(),w=widthM();
    if(display==='TRILHO SUÍÇO')return swissProducts();
    if(display==='VARÃO WAVE')return all.filter(p=>fold(p.product_name)==='VARAO WAVE 28');
    if(display==='VARÃO COM COMANDO')return chooseTier(all.filter(p=>fold(p.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE')),w);
    if(display==='TRILHO SQUARE COM COMANDO')return chooseTier(all.filter(p=>fold(p.product_name).startsWith('TRILHO SQUARE COM COMANDO ATE')),w);
    if(display==='TRILHO MOTORIZADO')return chooseTier(all.filter(p=>fold(p.product_name).startsWith('TRILHO MOTORIZADO ATE')),w);
    return [];
  }
  function swissModelKey(p){return String(p.product_name||'').trim()}
  function colorsFor(display,model){
    if(['TRILHO SQUARE COM COMANDO','TRILHO MOTORIZADO'].includes(display))return ['BRANCO','PRETO'];
    if(display==='VARÃO COM COMANDO')return ['CROMADO','BRANCO','PRETO','PRATA ESCOVADO','OURO VELHO'];
    const list=familyProducts(display);
    if(display==='TRILHO SUÍÇO')return uniq(list.filter(p=>!model||swissModelKey(p)===model).map(p=>String(p.color||'').toUpperCase()));
    return uniq(list.map(p=>String(p.color||'').toUpperCase()));
  }
  function populate(sel,vals,wanted,placeholder){
    if(!sel)return;sel.innerHTML='';
    if(placeholder)sel.add(new Option(placeholder,''));
    vals.forEach(v=>sel.add(new Option(v,v)));
    if(wanted&&vals.includes(wanted))sel.value=wanted; else if(vals.length)sel.value=vals[0];
  }
  function resolveProduct(){
    const display=currentDisplay(), color=$('eFixColor')?.value||'', list=familyProducts(display);
    if(display==='TRILHO SUÍÇO'){
      const model=$('eRailProduct')?.value||'';
      return list.find(p=>swissModelKey(p)===model&&fold(p.color)===fold(color))||list.find(p=>swissModelKey(p)===model)||null;
    }
    return list.find(p=>fold(p.color)===fold(color))||list[0]||null;
  }
  function relabel(){
    const fw=$('eFixationWrap');if(fw){fw.classList.remove('hidden');for(const n of fw.childNodes){if(n.nodeType===3&&n.textContent.trim()){n.textContent='FIXAÇÃO E DESLIZAMENTO';break}}}
    const rw=$('eRailProductWrap');if(rw){for(const n of rw.childNodes){if(n.nodeType===3&&n.textContent.trim()){n.textContent='MODELO DO TRILHO SUÍÇO';break}}}
    const cw=$('eFixColorWrap');if(cw){cw.classList.remove('hidden');for(const n of cw.childNodes){if(n.nodeType===3&&n.textContent.trim()){n.textContent='PADRÃO DE COR';break}}}
  }
  function removeParallelSelector(){
    $('eFixationModeWrap')?.remove();$('eSwissModelWrap')?.remove();$('eFixResolved')?.remove();
  }
  function refresh(preserve=true){
    if(refreshing)return;refreshing=true;
    try{
      removeParallelSelector();relabel();
      const f=$('eFixation'),r=$('eRailProduct'),rw=$('eRailProductWrap'),c=$('eFixColor');if(!f||!r||!c)return;
      const previous=preserve?(DISPLAY[f.value]||f.value||desired):desired;
      if(FAMILY_OPTIONS.includes(previous))desired=previous;
      populate(f,FAMILY_OPTIONS,desired);
      desired=f.value||desired;
      const display=currentDisplay();
      if(display==='TRILHO SUÍÇO'){
        rw?.classList.remove('hidden');
        const oldModel=preserve?r.value:'';
        const models=uniq(swissProducts().map(swissModelKey));
        populate(r,models,models.includes(oldModel)?oldModel:'','SELECIONE O MODELO');
        const oldColor=preserve?c.value:'';
        populate(c,colorsFor(display,r.value),oldColor,'SELECIONE A COR');
      }else{
        rw?.classList.add('hidden');
        const oldColor=preserve?c.value:'';
        populate(c,colorsFor(display,''),oldColor,'SELECIONE A COR');
      }
      const motorL=$('eAngle')?.checked&&display==='TRILHO MOTORIZADO';$('eMotorAngleWrap')?.classList.toggle('hidden',!motorL);
    }finally{refreshing=false}
  }
  function syncAndPreview(){refresh(true);try{updatePreview()}catch(e){console.warn('V12.2 preview',e)}}

  // Impede que rotinas antigas alterem a escolha do usuário.
  document.addEventListener('change',function(ev){
    if(ev.target?.id==='eFixation'){
      const chosen=DISPLAY[ev.target.value]||ev.target.value;
      if(FAMILY_OPTIONS.includes(chosen))desired=chosen;
      setTimeout(syncAndPreview,0);
    }else if(['eRailProduct','eFixColor'].includes(ev.target?.id))setTimeout(syncAndPreview,0);
  },true);
  document.addEventListener('input',function(ev){if(ev.target?.id==='eWidth')setTimeout(syncAndPreview,0)},true);

  // Mantém compatibilidade com chamadas antigas sem permitir reset para trilho suíço.
  if(typeof v118ApplyConditionalForm==='function'){
    const old118=v118ApplyConditionalForm;
    v118ApplyConditionalForm=function(){const keep=desired;old118();desired=keep;refresh(true)};
  }
  if(typeof v1191Conditional==='function'){
    const old1191=v1191Conditional;
    v1191Conditional=function(){const keep=desired;old1191();desired=keep;refresh(true)};
  }
  if(typeof v12RefreshFixations==='function'){
    const old12=v12RefreshFixations;
    v12RefreshFixations=function(){const keep=desired;old12();desired=keep;refresh(true)};
  }

  const previousEnv=envFromForm;
  envFromForm=function(){
    const e=previousEnv();
    const display=currentDisplay(),internal=currentInternal(),p=resolveProduct();
    e.fixation=internal;e.fixColor=$('eFixColor')?.value||p?.color||'';
    e.fixProductId=p?.id||null;e.fixProductName=p?.product_name||'';
    e.railProductId=p?.id||null;e.railProductName=p?.product_name||'';e.railInternalCode=p?.internal_code||'';
    return e;
  };

  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{desired='TRILHO SUÍÇO';refresh(false);try{updatePreview()}catch(e){}},180));
  if(typeof loadCloud==='function'){
    const oldLoad220=loadCloud;loadCloud=async function(){await oldLoad220();setTimeout(()=>{refresh(true);try{updatePreview()}catch(e){}},10)};
  }
})();

/* ===== V12.2.2 • WAVE SEM RESET DE FIXAÇÃO + PADRONIZAÇÃO SEM SQUARE =====
   Correção baseada no fluxo real observado: ao selecionar prega WAVE, rotinas legadas
   ainda retornavam a fixação para TRILHO SUÍÇO. Esta camada final preserva a fixação
   escolhida pelo vendedor e remove TRILHO SQUARE COM COMANDO do orçamento.
*/
(function(){
  const ALLOWED=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'];
  const fold=x=>v1216Fold(x||'');

  function cleanFixOptions(preserve=true){
    const el=$('eFixation'); if(!el)return;
    const old=preserve?el.value:'';
    setSelectOptions(el,ALLOWED,ALLOWED.includes(old)?old:'TRILHO SUÍÇO');
    if(ALLOWED.includes(old))el.value=old;
  }

  // Não permitir que WAVE determine a fixação. WAVE define apenas prega/aviamentos.
  v118ApplyConditionalForm=function(){
    const fp=$('eFinishPleat')?.value||'', tube=isTubePleat(fp), wave=fp==='WAVE';
    if(wave){
      const lining=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','WAVE','SOBREPOSTO'];
      if(lining){const old=lining.value;fillSelect(lining,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}
    }
    $('eSupportMaterialWrap')?.classList.toggle('hidden',!tube);
    const bar=$('eFinishBar')?.value||'BARRA SIMPLES';
    $('eSoutacheColorWrap')?.classList.toggle('hidden',!['BARRA SOUTACHE','BARRA SOUTACHE DUPLA'].includes(bar));
    if(tube) setSelectOptions($('eFixColor'),V118_TUBE_COLORS,$('eFixColor')?.value);
  };

  v1191CompatibleFixations=function(){
    const fp=$('eFinishPleat')?.value||'', lp=$('eLiningPleat')?.value||'';
    if(isTubePleat(fp)||isTubePleat(lp))return [];
    return [...ALLOWED];
  };

  // Substitui a regra antiga que fazia: if(wave) eFixation='TRILHO SUÍÇO'.
  v1191Conditional=function(){
    const fp=$('eFinishPleat')?.value||'', lp=$('eLiningPleat')?.value||'';
    const wanted=$('eFixation')?.value||'TRILHO SUÍÇO';
    if(['FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM'].includes(fp)){
      const el=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];
      if(el){const old=el.value;fillSelect(el,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}
    }else if(fp==='WAVE'){
      const el=$('eLiningPleat'),allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];
      if(el){const old=el.value;fillSelect(el,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO')}
    }else{
      const el=$('eLiningPleat'),all=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
      if(el){const old=el.value;fillSelect(el,all,all.includes(old)?old:'FRANZIDO SUÍÇO')}
    }
    const tube=isTubePleat(fp)||isTubePleat($('eLiningPleat')?.value||'');
    if(!tube){ cleanFixOptions(true); if(ALLOWED.includes(wanted))$('eFixation').value=wanted; }
    if(typeof v1218RefreshFixProduct==='function')v1218RefreshFixProduct();
    v1191GatherOptions('eFinishGather');v1191GatherOptions('eLiningGather');
  };

  // Refresh final: preserva a família escolhida mesmo ao trocar prega para WAVE.
  v12RefreshFixations=function(){
    const m=$('eModel')?.value||'COMPLETE',fp=$('eFinishPleat')?.value||'';
    const wanted=$('eFixation')?.value||'TRILHO SUÍÇO';
    const lining=$('eLiningPleat'),allowed=v12AllowedLiningPleats(fp);
    if(lining){const old=lining.value,def=(fp==='ILHÓS REDONDO'||fp==='ILHÓS QUADRADO'||fp==='FRANZIDO COM ARGOLAS 19MM'||fp==='FRANZIDO COM ARGOLAS 29MM')?'FRANZIDO COM ARGOLAS 19MM':'FRANZIDO SUÍÇO';fillSelect(lining,allowed,allowed.includes(old)?old:def)}
    const fTube=isTubePleat(fp),lTube=isTubePleat($('eLiningPleat')?.value||'');
    const fw=$('eFinishTubeWrap'),lw=$('eLiningTubeWrap'),generic=$('eFixationWrap');
    generic?.classList.toggle('hidden',fTube||lTube);
    fw?.classList.toggle('hidden',m==='LINING'||!fTube);lw?.classList.toggle('hidden',m==='FINISH'||!lTube);
    if(fTube){const size=fp.includes('19MM')?'19':'28';v12FillProductSelect($('eFinishTube'),v12TubeProducts(size),'SELECIONE A FIXAÇÃO DO ACABAMENTO')}
    if(lTube){const lpp=$('eLiningPleat').value,size=lpp.includes('19MM')?'19':'28';v12FillProductSelect($('eLiningTube'),v12TubeProducts(size),'SELECIONE A FIXAÇÃO DO FORRO')}
    if(!(fTube||lTube)){
      cleanFixOptions(false);
      if(ALLOWED.includes(wanted))$('eFixation').value=wanted;
      if(typeof v1218RefreshFixProduct==='function')v1218RefreshFixProduct();
    }
    v1191GatherOptions('eFinishGather');v1191GatherOptions('eLiningGather');
  };

  function finalSync(){
    cleanFixOptions(true);
    // remove qualquer opção Square reinserida por rotinas antigas
    const el=$('eFixation'); if(el){[...el.options].filter(o=>fold(o.value).includes('SQUARE')).forEach(o=>o.remove())}
    if(typeof v1218RefreshFixProduct==='function')v1218RefreshFixProduct();
  }

  // Captura mudança de prega e restaura a fixação escolhida após todos os listeners legados.
  document.addEventListener('DOMContentLoaded',()=>{
    const pleat=$('eFinishPleat');
    if(pleat){
      pleat.addEventListener('change',()=>{
        const chosen=$('eFixation')?.value||'TRILHO SUÍÇO';
        setTimeout(()=>{
          cleanFixOptions(false);
          if(ALLOWED.includes(chosen))$('eFixation').value=chosen;
          v1191Conditional();
          finalSync();
          updatePreview();
        },0);
      });
    }
    const fix=$('eFixation');
    if(fix){fix.addEventListener('change',()=>setTimeout(()=>{finalSync();updatePreview()},0))}
    setTimeout(finalSync,150);
  });

  const oldLoad1221=loadCloud;
  loadCloud=async function(){await oldLoad1221();setTimeout(()=>{finalSync();updatePreview()},0)};
})();

/* ===== V12.2.2 • WAVE NÃO BLOQUEIA FIXAÇÃO =====
   Regra final: a prega WAVE não altera nem restringe a família de fixação.
   O vendedor pode usar TRILHO SUÍÇO, VARÃO WAVE, VARÃO WAVE COM COMANDO POR CORDA
   ou TRILHO MOTORIZADO. O seletor de produto do estoque acompanha a família escolhida.
   TRILHO SQUARE COM COMANDO permanece removido do orçamento.
*/
(function(){
  const FIXES=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'];
  let lastFix='TRILHO SUÍÇO';

  function syncWaveFixation(preferred){
    const fix=$('eFixation'); if(!fix)return;
    const keep=FIXES.includes(preferred)?preferred:(FIXES.includes(fix.value)?fix.value:lastFix);
    setSelectOptions(fix,FIXES,FIXES.includes(keep)?keep:'TRILHO SUÍÇO');
    fix.value=FIXES.includes(keep)?keep:'TRILHO SUÍÇO';
    lastFix=fix.value;
    if(typeof v1218RefreshFixProduct==='function')v1218RefreshFixProduct();
    else if(typeof v1217RefreshFixProduct==='function')v1217RefreshFixProduct();
    else if(typeof v1191RefreshFixProduct==='function')v1191RefreshFixProduct();
  }

  function applyWavePleatRules(){
    const lining=$('eLiningPleat');
    if(lining){
      const allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];
      const old=lining.value;
      fillSelect(lining,allowed,allowed.includes(old)?old:'FRANZIDO SUÍÇO');
    }
    v1191GatherOptions('eFinishGather');
    v1191GatherOptions('eLiningGather');
    syncWaveFixation(lastFix);
    try{updateModelFields()}catch(_){ }
    try{updatePreview()}catch(_){ }
  }

  // Captura ANTES dos listeners legados. Quando a prega é WAVE, nenhum listener antigo
  // pode trocar a fixação escolhida para TRILHO SUÍÇO.
  document.addEventListener('change',function(ev){
    const t=ev.target;
    if(!t)return;

    if(t.id==='eFixation'){
      const fp=$('eFinishPleat')?.value||'';
      if(fp==='WAVE'){
        ev.stopImmediatePropagation();
        lastFix=FIXES.includes(t.value)?t.value:'TRILHO SUÍÇO';
        syncWaveFixation(lastFix);
        try{updatePreview()}catch(_){ }
      }else if(FIXES.includes(t.value)){
        lastFix=t.value;
      }
      return;
    }

    if(t.id==='eFinishPleat' && t.value==='WAVE'){
      const current=$('eFixation')?.value;
      if(FIXES.includes(current))lastFix=current;
      ev.stopImmediatePropagation();
      applyWavePleatRules();
      return;
    }
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    const fix=$('eFixation');
    if(fix&&FIXES.includes(fix.value))lastFix=fix.value;
    // Se o formulário abrir já em WAVE, deixa todas as quatro famílias disponíveis.
    setTimeout(()=>{
      if(($('eFinishPleat')?.value||'')==='WAVE')syncWaveFixation(lastFix);
    },250);
  });
})();

/* ===== V12.2.4 • WAVE USA A MESMA MATRIZ DE FIXAÇÃO DO FRANZIDO SUÍÇO =====
   Correção definitiva: rotinas legadas ainda podiam reescrever eFixation para TRILHO SUÍÇO
   durante updatePreview()/updateModelFields(). Para pregas que NÃO usam tubo, a prega não
   interfere mais na família de fixação. WAVE e FRANZIDO SUÍÇO exibem a mesma lista.
*/
(function(){
  const FIXES=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'];
  let rememberedFix='TRILHO SUÍÇO';
  let rememberedLiningPleat='FRANZIDO SUÍÇO';
  const prior1191=v1191Conditional;
  const prior12=v12RefreshFixations;

  function preserveFix(){
    const el=$('eFixation');
    if(!el)return rememberedFix;
    if(FIXES.includes(el.value))rememberedFix=el.value;
    return rememberedFix;
  }

  function setFixes(preferred){
    const el=$('eFixation');if(!el)return;
    const keep=FIXES.includes(preferred)?preferred:(FIXES.includes(el.value)?el.value:rememberedFix);
    setSelectOptions(el,FIXES,FIXES.includes(keep)?keep:'TRILHO SUÍÇO');
    el.value=FIXES.includes(keep)?keep:'TRILHO SUÍÇO';
    rememberedFix=el.value;
  }

  function applyLiningCompatibility(){
    const fp=$('eFinishPleat')?.value||'';
    const lining=$('eLiningPleat');if(!lining)return;
    let allowed;
    if(($('eModel')?.value||'')==='LINING')allowed=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
    else if(fp==='WAVE')allowed=['FRANZIDO SUÍÇO','SOBREPOSTO'];
    else if(fp==='ILHÓS REDONDO'||fp==='ILHÓS QUADRADO')allowed=['FRANZIDO COM ARGOLAS 19MM'];
    else if(fp==='FRANZIDO COM ARGOLAS 29MM'||fp==='FRANZIDO COM ARGOLAS 19MM')allowed=['FRANZIDO COM ARGOLAS 19MM'];
    else allowed=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
    const old=lining.value;
    fillSelect(lining,allowed,allowed.includes(old)?old:(allowed.includes('FRANZIDO SUÍÇO')?'FRANZIDO SUÍÇO':allowed[0]));
  }

  function refreshNonTube(preferred){
    setFixes(preferred);
    const generic=$('eFixationWrap');generic?.classList.remove('hidden');
    if(typeof v1218RefreshFixProduct==='function')v1218RefreshFixProduct();
    else if(typeof v1217RefreshFixProduct==='function')v1217RefreshFixProduct();
    else if(typeof v1191RefreshFixProduct==='function')v1191RefreshFixProduct();
    const motorL=$('eAngle')?.checked&&$('eFixation')?.value==='TRILHO MOTORIZADO';
    $('eMotorAngleWrap')?.classList.toggle('hidden',!motorL);
    if($('eWidth'))$('eWidth').readOnly=!!$('eAngle')?.checked;
    v1191GatherOptions('eFinishGather');
    v1191GatherOptions('eLiningGather');
  }

  v1191Conditional=function(){
    const fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'';
    const preferred=preserveFix();
    if(isTubePleat(fp)||isTubePleat(lp))return prior1191();
    applyLiningCompatibility();
    refreshNonTube(preferred);
  };

  v12RefreshFixations=function(){
    const fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'';
    const preferred=preserveFix();
    if(isTubePleat(fp)||isTubePleat(lp))return prior12();
    applyLiningCompatibility();
    refreshNonTube(preferred);
  };

  // O updatePreview chama updateModelFields; esta proteção restaura a escolha depois de toda
  // atualização visual, evitando que qualquer camada antiga volte para TRILHO SUÍÇO.
  const priorUpdateModelFields=updateModelFields;
  updateModelFields=function(){
    const preferred=preserveFix();
    priorUpdateModelFields();
    const fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'';
    if(!(isTubePleat(fp)||isTubePleat(lp)))refreshNonTube(preferred);
  };

  document.addEventListener('DOMContentLoaded',()=>{
    const f=$('eFixation');if(f&&FIXES.includes(f.value))rememberedFix=f.value;
    setTimeout(()=>{
      const fp=$('eFinishPleat')?.value||'',lp=$('eLiningPleat')?.value||'';
      if(!(isTubePleat(fp)||isTubePleat(lp)))refreshNonTube(rememberedFix);
    },300);
  });
})();

/* ===== V12.2.4 • INVARIANTE DE DOMÍNIO =====
   Prega de acabamento e fixação são dimensões independentes.
   WAVE nunca altera eFixation. A seleção de fixação só muda por ação do vendedor.
*/


/* ============================================================
   V12.2.5 - HOTFIX FINAL
   PREGA E FIXAÇÃO SÃO INDEPENDENTES

   WAVE = modelo de confecção/franzimento.
   WAVE NÃO escolhe nem força a fixação.

   Corrige especificamente o problema em que:
   PREGA WAVE -> sistema retornava para TRILHO SUÍÇO.
   ============================================================ */

(function () {

  const FIXACOES_LIVRES = [
    'TRILHO SUÍÇO',
    'VARÃO WAVE',
    'VARÃO WAVE COM COMANDO POR CORDA',
    'TRILHO MOTORIZADO'
  ];

  let FIXACAO_ESCOLHIDA_PELO_VENDEDOR = null;

  function el(id) {
    return document.getElementById(id);
  }

  function pregaUsaTubo(prega) {
    const p = String(prega || '').toUpperCase();

    return (
      p.includes('ARGOLAS') ||
      p.includes('ILHÓS')
    );
  }

  function montagemLivreDeFixacao() {

    const acabamento = el('eFinishPleat')?.value || '';
    const forro = el('eLiningPleat')?.value || '';

    return !pregaUsaTubo(acabamento) && !pregaUsaTubo(forro);
  }

  function atualizarProdutosDaFixacao() {

    try {

      if (typeof v1218RefreshFixProduct === 'function') {
        v1218RefreshFixProduct();
        return;
      }

      if (typeof v1217RefreshFixProduct === 'function') {
        v1217RefreshFixProduct();
        return;
      }

      if (typeof v1191RefreshFixProduct === 'function') {
        v1191RefreshFixProduct();
      }

    } catch (erro) {
      console.warn(
        'V12.2.5 - erro ao atualizar produto da fixação:',
        erro
      );
    }
  }

  function reconstruirFixacoes() {

    const campo = el('eFixation');

    if (!campo) return;

    if (!montagemLivreDeFixacao()) {
      return;
    }

    let desejada =
      FIXACAO_ESCOLHIDA_PELO_VENDEDOR ||
      campo.value ||
      'TRILHO SUÍÇO';

    if (!FIXACOES_LIVRES.includes(desejada)) {
      desejada = 'TRILHO SUÍÇO';
    }

    campo.innerHTML = '';

    FIXACOES_LIVRES.forEach(nome => {

      const option = document.createElement('option');

      option.value = nome;
      option.textContent = nome;

      campo.appendChild(option);
    });

    campo.value = desejada;

    FIXACAO_ESCOLHIDA_PELO_VENDEDOR = desejada;

    atualizarProdutosDaFixacao();
  }

  function aplicarRegraWave() {

    const prega = el('eFinishPleat')?.value || '';

    if (prega !== 'WAVE') {
      reconstruirFixacoes();
      return;
    }

    const gather = el('eFinishGather');

    if (gather) {

      const valorAnterior = gather.value;

      const opcoes = [
        '2.0',
        '2.5',
        '3.0',
        '3.5',
        '4.0'
      ];

      gather.innerHTML = '';

      opcoes.forEach(valor => {

        const option = document.createElement('option');

        option.value = valor;
        option.textContent = valor;

        gather.appendChild(option);
      });

      gather.value =
        opcoes.includes(valorAnterior)
          ? valorAnterior
          : '3.0';
    }

    reconstruirFixacoes();
  }

  document.addEventListener(
    'change',

    function (evento) {

      const alvo = evento.target;

      if (!alvo) return;

      if (alvo.id === 'eFixation') {

        if (FIXACOES_LIVRES.includes(alvo.value)) {
          FIXACAO_ESCOLHIDA_PELO_VENDEDOR =
            alvo.value;
        }

        setTimeout(function () {

          reconstruirFixacoes();

          try {
            if (typeof updatePreview === 'function') {
              updatePreview();
            }
          } catch (e) {}

        }, 0);

        setTimeout(function () {
          reconstruirFixacoes();
        }, 50);

        return;
      }

      if (
        alvo.id === 'eFinishPleat' ||
        alvo.id === 'eLiningPleat'
      ) {

        const antes =
          FIXACAO_ESCOLHIDA_PELO_VENDEDOR ||
          el('eFixation')?.value ||
          'TRILHO SUÍÇO';

        if (FIXACOES_LIVRES.includes(antes)) {
          FIXACAO_ESCOLHIDA_PELO_VENDEDOR =
            antes;
        }

        setTimeout(function () {

          aplicarRegraWave();

          try {
            if (typeof updatePreview === 'function') {
              updatePreview();
            }
          } catch (e) {}

        }, 0);

        setTimeout(function () {
          aplicarRegraWave();
        }, 50);

      }

    },

    true
  );

  document.addEventListener(
    'DOMContentLoaded',

    function () {

      setTimeout(function () {

        const atual = el('eFixation')?.value;

        if (FIXACOES_LIVRES.includes(atual)) {
          FIXACAO_ESCOLHIDA_PELO_VENDEDOR =
            atual;
        }

        aplicarRegraWave();

      }, 500);

    }
  );

})();




/* ===== V12.3.1 • APENAS FORRO LIBERA TODAS AS PREGAS =====
   Em APENAS O FORRO, o forro passa a ser a cortina principal.
   Logo:
   - eLiningPleat exibe todas as pregas disponíveis;
   - a fixação passa a obedecer à prega do forro;
   - WAVE no forro não força TRILHO SUÍÇO;
   - ARGOLAS/ILHÓS usam o seletor de tubo do forro.
*/
(function(){
  const LINING_PLEATS=['FRANZIDO SUÍÇO','FRANZIDO COM ARGOLAS 19MM','FRANZIDO COM ARGOLAS 29MM','ILHÓS REDONDO','ILHÓS QUADRADO','WAVE','SOBREPOSTO','OUTRO'];
  const FREE_FIXES=['TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA','TRILHO MOTORIZADO'];
  let rememberedFix='TRILHO SUÍÇO';
  let rememberedLiningPleat='FRANZIDO SUÍÇO';

  function byId(id){return document.getElementById(id)}
  function isLiningOnly(){return (byId('eModel')?.value||'')==='LINING'}
  function pleatUsesTube(pleat){
    const p=String(pleat||'').toUpperCase();
    return p.includes('ARGOLAS') || p.includes('ILHÓS');
  }
  function rememberFix(){
    const current=byId('eFixation')?.value||'';
    if(FREE_FIXES.includes(current))rememberedFix=current;
    return rememberedFix;
  }
  function refreshFixProduct(){
    try{
      if(typeof v1218RefreshFixProduct==='function')return v1218RefreshFixProduct();
      if(typeof v1217RefreshFixProduct==='function')return v1217RefreshFixProduct();
      if(typeof v1191RefreshFixProduct==='function')return v1191RefreshFixProduct();
    }catch(_){ }
  }
  function refillLiningPleats(){
    const lp=byId('eLiningPleat');
    if(!lp)return;
    const current=lp.value;
    if(LINING_PLEATS.includes(current))rememberedLiningPleat=current;
    const keep=LINING_PLEATS.includes(rememberedLiningPleat)?rememberedLiningPleat:'FRANZIDO SUÍÇO';
    fillSelect(lp,LINING_PLEATS,keep);
    lp.value=keep;
  }
  function refreshLiningOnly(){
    if(!isLiningOnly())return;
    refillLiningPleats();
    const lp=byId('eLiningPleat')?.value||'FRANZIDO SUÍÇO';
    const tube=pleatUsesTube(lp);
    const genericWrap=byId('eFixationWrap');
    const railWrap=byId('eRailProductWrap');
    const finishTubeWrap=byId('eFinishTubeWrap');
    const liningTubeWrap=byId('eLiningTubeWrap');
    const fixColorWrap=byId('eFixColorWrap');

    genericWrap?.classList.toggle('hidden',tube);
    finishTubeWrap?.classList.add('hidden');
    liningTubeWrap?.classList.toggle('hidden',!tube);
    if(fixColorWrap)fixColorWrap.classList.remove('hidden');

    if(tube){
      railWrap?.classList.add('hidden');
      if(typeof v12FillProductSelect==='function' && typeof v12TubeProducts==='function'){
        const size=(lp.includes('19MM') || lp.includes('REDONDO')) ? '19' : '28';
        v12FillProductSelect(byId('eLiningTube'),v12TubeProducts(size),'SELECIONE A FIXAÇÃO DO FORRO');
      }
    }else{
      const fix=byId('eFixation');
      const preferred=rememberFix();
      if(fix){
        const chosen=FREE_FIXES.includes(preferred)?preferred:(FREE_FIXES.includes(fix.value)?fix.value:'TRILHO SUÍÇO');
        setSelectOptions(fix,FREE_FIXES,chosen);
        fix.value=chosen;
        rememberedFix=chosen;
      }
      railWrap?.classList.toggle('hidden',(byId('eFixation')?.value||'')!=='TRILHO SUÍÇO');
      refreshFixProduct();
    }

    if(typeof v1191GatherOptions==='function')v1191GatherOptions('eLiningGather');
  }

  const prevAllowed=(typeof v12AllowedLiningPleats==='function')?v12AllowedLiningPleats:null;
  if(prevAllowed){
    v12AllowedLiningPleats=function(fp){
      if(isLiningOnly())return LINING_PLEATS;
      return prevAllowed(fp);
    };
  }

  const prev1191=(typeof v1191Conditional==='function')?v1191Conditional:null;
  if(prev1191){
    v1191Conditional=function(){
      if(isLiningOnly())return refreshLiningOnly();
      return prev1191();
    };
  }

  const prevRefresh=(typeof v12RefreshFixations==='function')?v12RefreshFixations:null;
  if(prevRefresh){
    v12RefreshFixations=function(){
      if(isLiningOnly())return refreshLiningOnly();
      return prevRefresh();
    };
  }

  const prevUpdate=(typeof updateModelFields==='function')?updateModelFields:null;
  if(prevUpdate){
    updateModelFields=function(){
      prevUpdate();
      if(isLiningOnly())refreshLiningOnly();
    };
  }

  document.addEventListener('change',function(ev){
    const t=ev.target;
    if(!t)return;

    // APENAS FORRO: captura a escolha antes dos listeners legados,
    // evitando que eles devolvam a prega para FRANZIDO SUÍÇO.
    if(t.id==='eLiningPleat' && isLiningOnly()){
      if(LINING_PLEATS.includes(t.value))rememberedLiningPleat=t.value;
      ev.stopImmediatePropagation();
      refreshLiningOnly();
      try{ if(typeof applyPleatGatherRules==='function')applyPleatGatherRules(); }catch(_){ }
      setTimeout(()=>{
        refreshLiningOnly();
        try{ if(typeof updatePreview==='function')updatePreview(); }catch(_){ }
        setTimeout(refreshLiningOnly,0);
      },0);
      return;
    }

    if(t.id==='eFixation' && FREE_FIXES.includes(t.value))rememberedFix=t.value;
    if(['eModel','eFixation','eLiningTube'].includes(t.id)){
      setTimeout(()=>{
        if(isLiningOnly()){
          const lp=byId('eLiningPleat');
          if(lp && LINING_PLEATS.includes(lp.value))rememberedLiningPleat=lp.value;
          refreshLiningOnly();
          try{ if(typeof updatePreview==='function')updatePreview(); }catch(_){ }
        }
      },0);
      setTimeout(()=>{ if(isLiningOnly())refreshLiningOnly(); },80);
    }
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
      rememberFix();
      const lp=byId('eLiningPleat');
      if(lp && LINING_PLEATS.includes(lp.value))rememberedLiningPleat=lp.value;
      refreshLiningOnly();
    },450);
  });

  if(typeof loadCloud==='function'){
    const oldLoadCloud=loadCloud;
    loadCloud=async function(){
      await oldLoadCloud();
      setTimeout(()=>refreshLiningOnly(),0);
    };
  }
})();

/* === V12.2.9 • DESLIZANTES COMPLETOS + CABEÇALHO DE VALORES DO ORÇAMENTO ===
   - Cortina completa: 1 deslizante/3 cm no total, arredondado para cima em múltiplo de 4.
   - PDF do orçamento: mão de obra ao lado da fixação e VALORES em 18x | 4x | à vista.
*/

/* === V12.2.6 • CONJUNTOS POR CAMADA + PRAZO/OP ===
   Cortina completa usa 2 conjuntos independentes para:
   - TRILHO MOTORIZADO: 2 trilhos/motores; 1 controle remoto por ambiente.
   - VARÃO WAVE COM COMANDO POR CORDA: 2 varões; suportes calculados por varão.
   Precificação base permanece inalterada; apenas a quantidade do conjunto é multiplicada.
*/
const _v1226FixationCalc=fixationCalc;
fixationCalc=function(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){
  const base=_v1226FixationCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial);
  const k=v1216Fold(kind),layers=model==='COMPLETE'?2:1;
  if(k==='VARAO WAVE COM COMANDO POR CORDA' && base?.railProductId){
    const rod=officialProductById(base.railProductId),sup=officialProductById(base.supportProductId)||officialProductByName('SUPORTE WAVE 28',base.railColor||fixColor)||officialProductLike(['SUPORTE','WAVE','28'],base.railColor||fixColor);
    const perRodSupports=Math.max(2,Number(base.supports||0));
    const supports=perRodSupports*layers,units=layers;
    const total=units*Number(rod?.price_4x||0)+supports*Number(sup?.price_4x||0);
    return {...base,total,hardwareBase:total,units,supports,detail:`${rod?.product_name||base.railName||'VARÃO COM COMANDO'} • ${rod?.color||base.railColor||fixColor||''} • ${units} un • ${supports} suportes`};
  }
  if(k==='TRILHO MOTORIZADO' && base?.railProductId){
    const rail=officialProductById(base.railProductId),remote=officialProductById(base.remoteProductId)||officialProductByName('CONTROLE REMOTO TRILHO MOTORIZADO')||officialProductLike(['CONTROLE','REMOTO','MOTORIZADO']);
    const units=layers;
    const total=units*Number(rail?.price_4x||0)+Number(remote?.price_4x||0);
    return {...base,total,hardwareBase:total,units,motors:units,detail:`${rail?.product_name||base.railName||'TRILHO MOTORIZADO'} • ${rail?.color||base.railColor||fixColor||''} • ${units} un / ${units} motor(es) • 1 controle remoto`};
  }
  return base;
};

const _v1226PurchaseMaterialsForOrder=purchaseMaterialsForOrder;
purchaseMaterialsForOrder=function(o){
  const out=_v1226PurchaseMaterialsForOrder(o);
  for(const e of (o?.environments||[])){
    const layers=e.model==='COMPLETE'?2:1,env=String(e.name||''),fix=v1216Fold(e.fixation||'');
    for(const x of out){
      if(String(x.environment||'')!==env)continue;
      const n=v1216Fold(x.name||'');
      if(fix==='TRILHO MOTORIZADO' && n.startsWith('TRILHO MOTORIZADO') && !n.includes('CONTROLE'))x.qty=layers;
      if(fix==='VARAO WAVE COM COMANDO POR CORDA' && (n.startsWith('VARAO COM COMANDO POR CORDA')||n.startsWith('VARAO WAVE COM COMANDO')))x.qty=layers;
    }
  }
  return out;
};


/* === V12.2.9 • DP, PAGAMENTOS, PEDIDOS POR VENDEDOR E MATERIAIS AGRUPADOS === */
function orderResultData(o){
 const raw=(o.officialStockSnapshot||[]).map(x=>({sku:x.internal_code||'-',name:x.product_name||'-',color:x.color||'-',qty:Number(x.qty||0),unit:norm(x.unit||'UN'),unitCost:Number(x.cost||0),total:Number(x.qty||0)*Number(x.cost||0),environments:x.environments||[]}));
 const grouped=new Map();
 for(const x of raw){const key=String(x.sku||'-');if(!grouped.has(key))grouped.set(key,{...x,qty:0,total:0,environments:[]});const g=grouped.get(key);g.qty+=x.qty;g.total+=x.total;g.environments=[...new Set([...(g.environments||[]),...(x.environments||[])])];if(!g.name||g.name==='-')g.name=x.name;if(!g.color||g.color==='-')g.color=x.color;if(!g.unit||g.unit==='-')g.unit=x.unit}
 const materialRows=[...grouped.values()].map(g=>({...g,unitCost:g.qty?g.total/g.qty:Number(g.unitCost||0)})).sort((a,b)=>String(a.sku).localeCompare(String(b.sku),'pt-BR',{numeric:true}));
 const officialCost=materialRows.reduce((a,x)=>a+x.total,0),env=environmentResultRows(o),envSale=env.reduce((a,x)=>a+x.sale,0),envInstallation=env.reduce((a,x)=>a+x.installation,0),envProduction=env.reduce((a,x)=>a+x.production,0),envCommission=env.reduce((a,x)=>a+x.commission,0);
 const legacyCost=(o.stockMovements||[]).reduce((a,m)=>{const p=(db.products||[]).find(x=>x.id===m.productId);return a+Number(m.qty||0)*Number(p?.cost||0)},0),blindSale=(o.blinds||[]).reduce((a,b)=>a+Number(b.cash||0)*Number(b.qty||1),0)*(1-Number(o.discountPercent||0)/100),blindPOs=(db.purchaseOrders||[]).filter(po=>Number(po.sourceOrderNumber)===Number(o.numero)&&['RECEBIDA','FINALIZADA'].includes(po.status)),actualBlindCost=blindPOs.reduce((a,po)=>a+(po.items||[]).filter(x=>x.isBlind||norm(x.category)==='PERSIANA').reduce((z,x)=>z+Number(x.qty||0)*Number(x.unitValue||0),0),0),blindsCost=actualBlindCost||((o.blinds||[]).reduce((a,b)=>a+(Number(b.cash||0)/1.60)*Number(b.qty||1),0)),specialCost=(o.looseProducts||[]).reduce((a,x)=>a+Number(x.cost||0)*Number(x.qty||0),0);
 const travelCost=Number(o.resultAdjustments?.travelCost||0),otherCost=Number(o.resultAdjustments?.otherCost||0),materialCost=officialCost+legacyCost+blindsCost+specialCost,totalCost=materialCost+envInstallation+envProduction+envCommission+travelCost+otherCost,revenue=envSale+blindSale,result=revenue-totalCost,margin=revenue?result/revenue*100:0,paid=orderPaid(o),cashResult=paid-totalCost;
 return {materialRows,officialCost,legacyCost,blindSale,blindsCost,specialCost,materialCost,commission:envCommission,installation:envInstallation,production:envProduction,travelCost,otherCost,totalCost,revenue,result,margin,paid,cashResult};
}

function managementPeriod(){return {from:$('kpiFrom')?.value||'',to:$('kpiTo')?.value||''}}
function managementSellerOrders(username){const {from,to}=managementPeriod(),u=norm(username);return (db.orders||[]).filter(o=>{const d=String(o.createdDate||o.date||'').slice(0,10);return resolveSellerUser(o)===u&&(!from||d>=from)&&(!to||d<=to)})}
function orderCashSale(o){return Number(orderResultData(o).revenue||0)}
function managementBackButton(){return '<button class="btn ghost" data-management-back>← VOLTAR</button>'}
function bindManagementBack(){document.querySelectorAll('[data-management-back]').forEach(b=>b.onclick=()=>closeModal())}
function sellerOrdersReportHtml(username){
 const orders=managementSellerOrders(username),{from,to}=managementPeriod(),total=orders.reduce((a,o)=>a+orderCashSale(o),0),amb=orders.reduce((a,o)=>a+Number(o.environments?.length||0),0);
 return `<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS & PERSIANAS</strong><br><strong>RESUMO DE PEDIDOS POR VENDEDOR</strong><br><br><strong>Vendedor:</strong> ${esc(sellerName(username))}<br><strong>Período:</strong> ${from?fmtDate(from):'início'} até ${to?fmtDate(to):'hoje'}</div></div><table class="summary-table"><tr><th>Pedido</th><th>Cliente</th><th>Contato</th><th>Ambientes</th><th>Data pedido</th><th>Entrega / instalação</th><th>Venda à vista</th></tr>${orders.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client||'-')}</td><td>${esc(o.contact||'-')}</td><td>${o.environments?.length||0}</td><td>${fmtDate(o.createdDate)}</td><td>${fmtDate(o.installation?.completedDate||o.deliveryDate)}</td><td>${money(orderCashSale(o))}</td></tr>`).join('')||'<tr><td colspan="7">Nenhum pedido no período.</td></tr>'}</table><div class="section-title">Resumo</div><table class="summary-table"><tr><th>Quantidade de pedidos</th><td>${orders.length}</td><th>Total de ambientes</th><td>${amb}</td></tr><tr><th colspan="3">Valor total vendido à vista</th><td><strong>${money(total)}</strong></td></tr></table>`;
}
function openSellerOrders(username){
 const orders=managementSellerOrders(username),{from,to}=managementPeriod(),total=orders.reduce((a,o)=>a+orderCashSale(o),0),amb=orders.reduce((a,o)=>a+Number(o.environments?.length||0),0);
 openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">Pedidos • ${esc(sellerName(username))}</h2><button id="sellerOrdersPdf" class="btn primary">EXPORTAR EM PDF</button></div><p class="muted">Período: ${from?fmtDate(from):'início'} até ${to?fmtDate(to):'hoje'}</p><div class="kpis" style="margin:12px 0"><div class="kpi"><span>Pedidos</span><strong>${orders.length}</strong></div><div class="kpi"><span>Ambientes</span><strong>${amb}</strong></div><div class="kpi"><span>Vendido à vista</span><strong>${money(total)}</strong></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Contato</th><th>Ambientes</th><th>Data pedido</th><th>Entrega / instalação</th><th>Venda à vista</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${esc(o.client||'-')}</td><td>${esc(o.contact||'-')}</td><td>${o.environments?.length||0}</td><td>${fmtDate(o.createdDate)}</td><td>${fmtDate(o.installation?.completedDate||o.deliveryDate)}</td><td><strong>${money(orderCashSale(o))}</strong></td></tr>`).join('')||'<tr><td colspan="7">Nenhum pedido no período.</td></tr>'}</tbody></table></div>`);
 bindManagementBack();$('sellerOrdersPdf').onclick=()=>printWindow(sellerOrdersReportHtml(username));
}

function inssEmployee2026(gross){
 gross=Math.max(0,Number(gross||0));const bands=[[1621,0.075],[2902.84,0.09],[4354.27,0.12],[8475.55,0.14]];let prev=0,sum=0;
 for(const [cap,rate] of bands){const slice=Math.max(0,Math.min(gross,cap)-prev);sum+=slice*rate;prev=cap;if(gross<=cap)break}return Math.round(sum*100)/100;
}
function inssProlabore2026(gross){return Math.round(Math.min(Math.max(0,Number(gross||0)),8475.55)*0.11*100)/100}
function irrf2026(gross,inss=0){
 gross=Math.max(0,Number(gross||0));const legal=Math.max(0,Number(inss||0)),ded=Math.max(legal,607.20),base=Math.max(0,gross-ded);let tax=0;
 if(base<=2428.80)tax=0;else if(base<=2826.65)tax=base*.075-182.16;else if(base<=3751.05)tax=base*.15-394.16;else if(base<=4664.68)tax=base*.225-675.49;else tax=base*.275-908.73;
 tax=Math.max(0,tax);let reduction=0;if(gross<=5000)reduction=Math.min(tax,312.89);else if(gross<=7350)reduction=Math.max(0,978.62-(0.133145*gross));return Math.round(Math.max(0,tax-reduction)*100)/100;
}
function sellerEmployee(username){return hrData().employees.find(e=>e.active!==false&&norm(e.username)===norm(username))}
function sellerCommissionTotal(username){const u=norm(username);return managementSellerOrders(u).reduce((a,o)=>a+orderCashSale(o)*Number(o.commissionPercent??sellerCommission(u))/100,0)}
function sellerPayrollCalculation(username,mode='internalize'){
 const emp=sellerEmployee(username),salary=Number(emp?.salary||0),commission=sellerCommissionTotal(username),taxable=mode==='internalize'?salary+commission:salary,inss=inssEmployee2026(taxable),irrf=irrf2026(taxable,inss),gross=salary+commission,net=mode==='internalize'?gross-inss-irrf:(salary-inss-irrf)+commission;
 return {emp,salary,commission,taxable,inss,irrf,gross,net,mode};
}
function payrollSlipHtml(username,mode){
 const p=sellerPayrollCalculation(username,mode),{from,to}=managementPeriod(),title=mode==='internalize'?'INTERNALIZAR COMISSÕES':'TRATAR COMISSÕES COMO GRATIFICAÇÃO',emp=p.emp||{},sales=managementSellerOrders(username).reduce((a,o)=>a+orderCashSale(o),0),commPct=sales?p.commission/sales*100:0,inssPct=p.taxable?p.inss/p.taxable*100:0,irrfPct=p.taxable?p.irrf/p.taxable*100:0;
 return `<div style="border:1px solid #cfdedd;border-radius:14px;overflow:hidden;background:#fff"><div style="background:#075b5b;color:#fff;padding:18px;display:flex;align-items:center;gap:14px"><img src="icon-512.png" style="width:58px;height:58px;object-fit:contain;background:#fff;border-radius:12px"><div><div style="font-size:20px;font-weight:800">NOVA IMAGEM • DEMONSTRATIVO DE PAGAMENTO</div><div style="margin-top:6px"><strong>NOME:</strong> ${esc(emp.name||sellerName(username))} &nbsp; • &nbsp; <strong>FUNÇÃO:</strong> ${esc(emp.role||'-')} &nbsp; • &nbsp; <strong>CPF:</strong> ${esc(emp.cpf||emp.document||'-')}</div><div style="margin-top:4px">${esc(title)}</div></div></div><div style="padding:18px"><table class="summary-table"><tr><th>Período considerado</th><td>${from?fmtDate(from):'início'} a ${to?fmtDate(to):'hoje'}</td><th>Pedidos</th><td>${managementSellerOrders(username).length}</td></tr><tr><th>Salário-base</th><td>${money(p.salary)}</td><th>Comissões</th><td>${money(p.commission)}</td></tr></table><div class="section-title">Proventos e descontos</div><table class="summary-table"><tr><th>Descrição</th><th>Referência</th><th>Provento</th><th>Desconto</th></tr><tr><td>Salário-base</td><td>Mensal</td><td>${money(p.salary)}</td><td>-</td></tr><tr><td>${mode==='internalize'?`Comissões tributáveis (${commPct.toFixed(2)}%)`:`Gratificação por vendas (${commPct.toFixed(2)}%)`}</td><td>${managementSellerOrders(username).length} pedido(s)</td><td>${money(p.commission)}</td><td>-</td></tr><tr><td>INSS 2026 (${inssPct.toFixed(2)}% efetivo)</td><td>Base ${money(p.taxable)}</td><td>-</td><td>${money(p.inss)}</td></tr><tr><td>IRRF 2026 (${irrfPct.toFixed(2)}% efetivo)</td><td>Base legal/simplificada</td><td>-</td><td>${money(p.irrf)}</td></tr><tr><th>TOTAIS</th><th></th><th>${money(p.gross)}</th><th>${money(p.inss+p.irrf)}</th></tr><tr><th colspan="3">VALOR LÍQUIDO</th><th>${money(p.net)}</th></tr></table>${!p.emp?'<p class="notice">Este vendedor ainda não está vinculado a um colaborador no Departamento Pessoal. O salário-base foi considerado como R$ 0,00.</p>':''}<p class="muted" style="font-size:12px">Simulação gerencial. A incidência tributária efetiva deve seguir a orientação contábil aplicável à empresa e ao vínculo do colaborador.</p></div></div>`;
}
function openSellerPayment(username){
 const draw=(mode)=>{openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">Gerar pagamento • ${esc(sellerName(username))}</h2></div><div class="actions" style="margin:14px 0"><button id="payModeInternal" class="btn ${mode==='internalize'?'primary':'secondary'}">INTERNALIZAR COMISSÕES</button><button id="payModeBonus" class="btn ${mode==='bonus'?'primary':'secondary'}">TRATAR COMISSÕES COMO GRATIFICAÇÃO</button><button id="payPrint" class="btn ghost">IMPRIMIR / PDF</button></div><div id="paySlip">${payrollSlipHtml(username,mode)}</div>`);bindManagementBack();$('payModeInternal').onclick=()=>draw('internalize');$('payModeBonus').onclick=()=>draw('bonus');$('payPrint').onclick=()=>printWindow($('paySlip').innerHTML)};draw('internalize');
}

function providerReceiptHtml(provider,opt={}){const p=provider||{},period=opt.period||$('providerReceiptPeriod')?.value||$('hrCompetence')?.value||new Date().toISOString().slice(0,7),value=Number(opt.value??$('providerReceiptValue')?.value??p.value??0),description=opt.description??$('providerReceiptDescription')?.value??p.service??'Prestação de serviço';return `<div style="border:1px solid #cfdedd;border-radius:14px;overflow:hidden;background:#fff"><div style="background:#075b5b;color:#fff;padding:18px;display:flex;align-items:center;gap:14px"><img src="icon-512.png" style="width:58px;height:58px;object-fit:contain;background:#fff;border-radius:12px"><div><div style="font-size:20px;font-weight:800">NOVA IMAGEM • RECIBO DE PRESTAÇÃO DE SERVIÇO</div><div style="margin-top:6px"><strong>NOME / RAZÃO SOCIAL:</strong> ${esc(p.name||'-')} &nbsp; • &nbsp; <strong>CPF/CNPJ:</strong> ${esc(p.document||'-')}</div><div style="margin-top:4px"><strong>SERVIÇO CADASTRADO:</strong> ${esc(p.service||'-')}</div></div></div><div style="padding:18px"><table class="summary-table"><tr><th>Competência</th><td>${esc(period)}</td><th>Periodicidade / referência</th><td>${esc(p.periodicity||p.receiptTerm||'POR SERVIÇO')}</td></tr><tr><th>Descrição</th><td>${esc(description||p.service||'Prestação de serviço')}</td><th>Valor</th><td><strong>${money(value)}</strong></td></tr></table><p style="margin-top:28px">Declaro o recebimento do valor acima referente aos serviços prestados à Nova Imagem Cortinas e Persianas.</p><div style="margin-top:55px;border-top:1px solid #789;max-width:360px;padding-top:7px;text-align:center">${esc(p.name||'Prestador de serviço')}</div></div></div>`}
function openProviderReceipt(id){const p=hrData().providers.find(x=>x.id===id);if(!p)return;const initialPeriod=$('hrCompetence')?.value||new Date().toISOString().slice(0,7);openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap">${managementBackButton()}<h2 style="margin:0">Recibo de prestação de serviço</h2><button id="providerReceiptPrint" class="btn primary">IMPRIMIR / PDF</button></div><div class="grid three" style="margin:14px 0"><label class="field">Competência<input id="providerReceiptPeriod" type="month" value="${esc(initialPeriod)}"></label><label class="field">Valor do recibo<input id="providerReceiptValue" type="number" min="0" step="0.01" value="${Number(p.value||0).toFixed(2)}"></label><label class="field">Descrição<input id="providerReceiptDescription" value="${esc(p.service||'Prestação de serviço')}"></label></div><div id="providerReceiptBox">${providerReceiptHtml(p,{period:initialPeriod,value:Number(p.value||0),description:p.service||'Prestação de serviço'})}</div>`);bindManagementBack();const refresh=()=>{$('providerReceiptBox').innerHTML=providerReceiptHtml(p)};['providerReceiptPeriod','providerReceiptValue','providerReceiptDescription'].forEach(id=>$(id)?.addEventListener('input',refresh));$('providerReceiptPrint').onclick=()=>{refresh();printWindow($('providerReceiptBox').innerHTML)}}

function renderKpis(){
 const cards=$('kpiCards'),seller=$('sellerKpis');if(!cards)return;const f=$('kpiFrom')?.value||'',t=$('kpiTo')?.value||'',sel=$('kpiSeller')?.value||'';const sellerSelect=$('kpiSeller');if(sellerSelect){const cur=sellerSelect.value;const names=[...new Set((db.orders||[]).map(o=>resolveSellerUser(o)).filter(Boolean))].sort();sellerSelect.innerHTML='<option value="">LOJA TODA</option>'+names.map(n=>`<option value="${esc(n)}">${esc(sellerName(n))}</option>`).join('');sellerSelect.value=cur}const inRange=d=>{const x=(d||'').slice(0,10);return(!f||x>=f)&&(!t||x<=t)};const orders=(db.orders||[]).filter(o=>inRange(o.createdDate||o.date||'')&&(!sel||resolveSellerUser(o)===norm(sel))),quotes=(db.quotes||[]).filter(q=>inRange(q.date||q.createdAt||'')&&(!sel||resolveSellerUser(q)===norm(sel))),rr=orders.map(orderResultData);const revenue=rr.reduce((a,x)=>a+x.revenue,0),paid=orders.reduce((a,o)=>a+orderPaid(o),0),cost=rr.reduce((a,x)=>a+x.totalCost,0),result=rr.reduce((a,x)=>a+x.result,0),ticket=orders.length?revenue/orders.length:0,conversion=quotes.length?orders.length/quotes.length*100:0,margin=revenue?result/revenue*100:0;cards.innerHTML=[['Vendas / pedidos',orders.length],['Faturamento contratado',money(revenue)],['Receita recebida',money(paid)],['Saldo a receber',money(Math.max(0,revenue-paid))],['Custos atribuídos',money(cost)],['Resultado comercial',money(result)],['Margem consolidada',margin.toFixed(1)+'%'],['Ticket médio',money(ticket)],['Conversão',conversion.toFixed(1)+'%'],['Em produção',orders.filter(o=>o.productionStage!=='EXPEDIÇÃO').length],['Prontos / expedição',orders.filter(o=>o.productionStage==='EXPEDIÇÃO'&&!o.installation?.completedDate).length],['Instalados',orders.filter(o=>!!o.installation?.completedDate).length],['Retrabalhos',(db.reworks||[]).filter(r=>inRange(r.date||'')).length],['Estoque crítico',(priceProducts||[]).filter(p=>Number(p.active??1)===1&&Number(p.stock_quantity||0)<officialMinimumStock(p)).length]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');const by={};for(const o of orders){const k=resolveSellerUser(o)||'-',r=orderResultData(o);by[k]??={count:0,total:0,result:0};by[k].count++;by[k].total+=r.revenue;by[k].result+=r.result}seller.innerHTML=Object.entries(by).map(([k,v])=>`<div class="detail-item" style="margin:6px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="min-width:180px"><strong>${esc(sellerName(k))}</strong></span><span style="flex:1">${v.count} pedido(s) • ${money(v.total)} • Resultado ${money(v.result)} • Comissão ${money(v.total*sellerCommission(k)/100)}</span><button class="btn ghost" data-seller-orders="${esc(k)}">VER PEDIDOS</button><button class="btn primary" data-seller-pay="${esc(k)}">GERAR PAGAMENTO</button></div>`).join('')||'<p class="muted">Nenhum pedido no filtro selecionado.</p>';document.querySelectorAll('[data-seller-orders]').forEach(b=>b.onclick=()=>openSellerOrders(b.dataset.sellerOrders));document.querySelectorAll('[data-seller-pay]').forEach(b=>b.onclick=()=>openSellerPayment(b.dataset.sellerPay));
}

function hrData(){
 db.settings=db.settings||{};db.settings.hr=db.settings.hr||{employees:[],providers:[],payrollClosings:[],partners:[]};const h=db.settings.hr;h.employees=h.employees||[];h.providers=h.providers||[];h.payrollClosings=h.payrollClosings||[];h.partners=h.partners||[];
 const defs=[{id:'partner-luiz-sergio',name:'Luiz Sergio Delgobo',role:'Sócio proprietário',prolabore:3000,active:true},{id:'partner-eliane-delgobo',name:'Eliane do Rocio Fontana Delgobo',role:'Sócia proprietária',prolabore:3000,active:true}];for(const d of defs)if(!h.partners.some(x=>x.id===d.id||norm(x.name)===norm(d.name)))h.partners.push(d);return h;
}
function renderHR(){
 const h=hrData(),et=$('employeeTable'),pt=$('providerTable');if(!et||!pt)return;et.innerHTML=h.employees.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.role||'-')}</td><td>${fmtDate(e.admissionDate)}</td><td>${money(e.salary)}</td><td><span class="badge ${e.active===false?'danger':'ok'}">${e.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-emp-edit="${e.id}">Editar</button></td></tr>`).join('');pt.innerHTML=h.providers.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.personType||'-')}</td><td>${esc(e.service||'-')}</td><td>${money(e.value)}</td><td><span class="badge ${e.active===false?'danger':'ok'}">${e.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-prov-edit="${e.id}">Editar</button> <button class="btn primary" data-prov-receipt="${e.id}">GERAR RECIBO</button></td></tr>`).join('');const activeEmp=h.employees.filter(x=>x.active!==false),activeProv=h.providers.filter(x=>x.active!==false),activePartners=h.partners.filter(x=>x.active!==false);if($('hrSummary'))$('hrSummary').innerHTML=[['Colaboradores ativos',activeEmp.length],['Prestadores ativos',activeProv.length],['Sócios / pró-labore',activePartners.length],['Folha-base',money(activeEmp.reduce((a,x)=>a+Number(x.salary||0),0))],['Pró-labore-base',money(activePartners.reduce((a,x)=>a+Number(x.prolabore||0),0))],['Serviços recorrentes',money(activeProv.reduce((a,x)=>a+Number(x.value||0),0))]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');let box=$('partnerPayrollBox');if(!box){box=document.createElement('section');box.id='partnerPayrollBox';box.className='card';box.style.marginTop='14px';const anchor=$('payrollPreview')?.closest('.card');anchor?.parentNode?.insertBefore(box,anchor)}if(box)box.innerHTML=`<div class="card-title">Sócios / Pró-labore</div><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Vínculo</th><th>Pró-labore</th><th>INSS estimado</th><th>IRRF estimado</th><th>Líquido estimado</th></tr></thead><tbody>${activePartners.map(p=>{const i=inssProlabore2026(p.prolabore),ir=irrf2026(p.prolabore,i);return `<tr><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${money(p.prolabore)}</td><td>${money(i)}</td><td>${money(ir)}</td><td><strong>${money(Number(p.prolabore)-i-ir)}</strong></td></tr>`}).join('')}</tbody></table></div>`;document.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>openEmployee(h.employees.find(x=>x.id===b.dataset.empEdit)));document.querySelectorAll('[data-prov-edit]').forEach(b=>b.onclick=()=>openProvider(h.providers.find(x=>x.id===b.dataset.provEdit)));document.querySelectorAll('[data-prov-receipt]').forEach(b=>b.onclick=()=>openProviderReceipt(b.dataset.provReceipt));
}
function payrollRows(competence){const h=hrData(),rows=[];for(const e of h.employees.filter(x=>x.active!==false)){const username=norm(e.username),commission=username?(db.orders||[]).filter(o=>resolveSellerUser(o)===username&&String(o.createdDate||'').slice(0,7)===competence).reduce((a,o)=>a+orderCashSale(o)*Number(o.commissionPercent??sellerCommission(username))/100,0):0;rows.push({kind:'CLT',refId:e.id,name:e.name,username,base:Number(e.salary||0),commission,total:Number(e.salary||0)+commission})}for(const p of h.partners.filter(x=>x.active!==false))rows.push({kind:'PROLABORE',refId:p.id,name:p.name,base:Number(p.prolabore||0),commission:0,total:Number(p.prolabore||0)});for(const p of h.providers.filter(x=>x.active!==false&&x.periodicity==='MENSAL'))rows.push({kind:'PRESTADOR',refId:p.id,name:p.name,base:Number(p.value||0),commission:0,total:Number(p.value||0)});return rows}

// Navegação do Dashboard de Gestão: toda abertura desta versão inclui VOLTAR ao nível anterior, preservando filtros.

/* === V12.3.0 • BLOG + HOLERITE/RECIBOS + PDF PEDIDOS === */


/* ===== V12.3.2 • APENAS FORRO: WAVE ISOLADO + MATERIAIS NO ORÇAMENTO =====
   Escopo estrito: somente quando eModel === LINING.
   Não altera CORTINA COMPLETA nem APENAS ACABAMENTO.
   Garante no PDF/orçamento os materiais WAVE do forro: fita e deslizantes.
*/
(function(){
  const oldMaterialRows=v1214MaterialRowsNoPrice;
  v1214MaterialRowsNoPrice=function(e){
    let html=oldMaterialRows(e);
    if(!e || e.model!=='LINING' || e.liningPleat!=='WAVE')return html;

    const c=calcEnvironment(e);
    if(!c || !c.liningCalc)return html;

    const hasTape=/FITA WAVE/i.test(html);
    const hasSlider=/DESLIZANTE WAVE/i.test(html);

    if(!hasTape){
      const tapeName=(typeof WAVE_TAPE_BY_GATHER!=='undefined' && WAVE_TAPE_BY_GATHER[String(e.liningGather)]) ||
        ({'2.0':'FITA WAVE 10X10','2.5':'FITA WAVE 12X12','3.0':'FITA WAVE 10X15','3.5':'FITA WAVE 12X16','4.0':'FITA WAVE 18X16'}[String(e.liningGather)]) || 'FITA WAVE';
      const tape=officialProductByName(tapeName)||officialProductLike(['FITA','WAVE']);
      const qty=Number(c.liningCalc.gathered||0);
      html+=`<tr><td>${esc(tape?.internal_code||'-')}</td><td>${esc(tape?.product_name||tapeName)}</td><td>${esc(tape?.color||'SEM COR')}</td><td>${qty.toFixed(2)} M</td></tr>`;
    }

    if(!hasSlider){
      const slider=officialSliderProduct(e.fixColor);
      const qty=Number(c.liningSliders||0);
      if(qty>0)html+=`<tr><td>${esc(slider?.internal_code||'-')}</td><td>${esc(slider?.product_name||'DESLIZANTE WAVE')}</td><td>${esc(slider?.color||e.fixColor||'BRANCO')}</td><td>${qty.toFixed(0)} UN</td></tr>`;
    }
    return html;
  };
})();


/* ===== V12.3.3 • HOTFIX FORRO WAVE + PADRÃO NI-0007 =====
   - Corrige a causa raiz: rotinas antigas não podem usar a prega de acabamento oculta
     para filtrar o forro quando o modelo é APENAS O FORRO.
   - CORTINA COMPLETA e APENAS ACABAMENTO mantêm a matriz anterior.
   - TRILHO DUPLO ESPAÇADO BRANCO NI-0007 é a sugestão padrão do trilho suíço.
     O vendedor continua podendo selecionar qualquer outro trilho.
*/
(function(){
  let railChangedByUser=false;
  function el(id){return document.getElementById(id)}
  function defaultRail(){
    if(typeof v118DefaultSwissRail!=='function')return null;
    return v118DefaultSwissRail();
  }
  function suggestDefaultRail(force=false){
    const fix=el('eFixation'),sel=el('eRailProduct');
    if(!fix||!sel||fix.value!=='TRILHO SUÍÇO')return;
    if(railChangedByUser&&!force)return;
    const d=defaultRail();
    if(d&&[...sel.options].some(o=>String(o.value)===String(d.id))){
      sel.value=String(d.id);
      const color=el('eFixColor'); if(color)color.value=d.color||'BRANCO';
    }
  }

  document.addEventListener('change',ev=>{
    const t=ev.target;if(!t)return;
    if(t.id==='eRailProduct')railChangedByUser=true;
    if(t.id==='eFixation'&&t.value==='TRILHO SUÍÇO')setTimeout(()=>suggestDefaultRail(false),0);
  });

  const oldClear=(typeof clearEnv==='function')?clearEnv:null;
  if(oldClear){
    clearEnv=function(){
      const r=oldClear.apply(this,arguments);
      railChangedByUser=false;
      setTimeout(()=>suggestDefaultRail(true),0);
      return r;
    };
  }

  const oldReset=(typeof resetQuote==='function')?resetQuote:null;
  if(oldReset){
    resetQuote=function(){
      const r=oldReset.apply(this,arguments);
      railChangedByUser=false;
      setTimeout(()=>suggestDefaultRail(true),20);
      return r;
    };
  }

  const oldLoad=(typeof loadCloud==='function')?loadCloud:null;
  if(oldLoad){
    loadCloud=async function(){
      const r=await oldLoad.apply(this,arguments);
      railChangedByUser=false;
      setTimeout(()=>suggestDefaultRail(true),80);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>suggestDefaultRail(true),650));
})();

/* ===== V12.3.4 • SEM TRILHO E SEM INSTALAÇÃO =====
   Opção comercial para venda somente da cortina, quando o cliente já possui
   trilho/varão/tubo ou quando a cortina será despachada.
   - aparece como última opção do campo FIXAÇÃO;
   - não cobra trilho, varão, tubo, suportes, garras ou tampas;
   - não cobra mão de obra de instalação;
   - preserva tecidos, aviamentos da cortina, costura e mão de obra de confecção.
*/
(function(){
  const NO_FIX='SEM TRILHO E SEM INSTALAÇÃO';
  const TERMS=()=>db?.priceConfig?.terms||{};
  let noFixSelected=false;

  function el(id){return document.getElementById(id)}
  function isNoFix(v){return String(v||'').trim().toUpperCase()===NO_FIX}

  function ensureNoFixOption(){
    const sel=el('eFixation');
    if(!sel)return;
    const current=noFixSelected?NO_FIX:sel.value;
    const existing=[...sel.options].find(o=>isNoFix(o.value));
    if(!existing)sel.add(new Option(NO_FIX,NO_FIX));
    else sel.appendChild(existing); // sempre por último
    if(noFixSelected || isNoFix(current)){
      sel.value=NO_FIX;
      noFixSelected=true;
    }
    syncNoFixUI();
  }

  function syncNoFixUI(){
    const sel=el('eFixation');
    const active=noFixSelected || isNoFix(sel?.value);
    if(active){
      noFixSelected=true;
      if(sel)sel.value=NO_FIX;
      el('eRailProductWrap')?.classList.add('hidden');
      el('eFixColorWrap')?.classList.add('hidden');
      el('eFinishTubeWrap')?.classList.add('hidden');
      el('eLiningTubeWrap')?.classList.add('hidden');
      el('eMotorAngleWrap')?.classList.add('hidden');
    }else{
      noFixSelected=false;
    }
  }

  // Custo da fixação zerado.
  const oldFixationCalc=fixationCalc;
  fixationCalc=function(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial='ALUMINIO'){
    if(isNoFix(kind))return {kind:NO_FIX,total:0,hardwareBase:0,meters:0,supports:0,ends:0,clamps:0,detail:NO_FIX};
    return oldFixationCalc(kind,widthM,model,leaves,fixColor,railProductId,supportMaterial);
  };

  // Remove exclusivamente a instalação do cálculo. Costura/confecção e aviamentos permanecem.
  const oldCalcEnvironment=calcEnvironment;
  calcEnvironment=function(e){
    const c=oldCalcEnvironment(e);
    if(!c || !isNoFix(e?.fixation))return c;
    const install=Number(c.installCost||0);
    const laborTotal=Math.max(0,Number(c.laborTotal||0)-install);
    const base4=Math.max(0,Number(c.base4||0)-install);
    const p18=base4*(1+Number(TERMS().p18AddPct||0)/100);
    const cash=base4*(1-Number(TERMS().cashDiscountPct||0)/100);
    return {...c,fixationCalc:{kind:NO_FIX,total:0,hardwareBase:0,meters:0,supports:0,ends:0,clamps:0,detail:NO_FIX},installCost:0,laborTotal,base4,p18,cash};
  };

  // Garante que o ambiente salvo leve a opção SEM TRILHO, sem SKU/cor de fixação.
  const oldEnvFromForm=envFromForm;
  envFromForm=function(){
    const e=oldEnvFromForm();
    if(noFixSelected || isNoFix(el('eFixation')?.value)){
      e.fixation=NO_FIX;
      e.fixColor='';
      e.fixProductId=null;e.fixProductName='';
      e.railProductId=null;e.railProductName='';e.railInternalCode='';
    }
    return e;
  };

  // Rotinas antigas reconstruem o select; recoloca SEM TRILHO sempre ao final.
  ['v118ApplyConditionalForm','v1191Conditional','v12RefreshFixations','updateModelFields'].forEach(name=>{
    try{
      const old=window[name];
      if(typeof old!=='function')return;
      window[name]=function(){
        const keep=noFixSelected || isNoFix(el('eFixation')?.value);
        const r=old.apply(this,arguments);
        if(keep)noFixSelected=true;
        ensureNoFixOption();
        return r;
      };
    }catch(_){ }
  });

  document.addEventListener('change',ev=>{
    const t=ev.target;if(!t)return;
    if(t.id==='eFixation'){
      noFixSelected=isNoFix(t.value);
      ensureNoFixOption();
      syncNoFixUI();
      setTimeout(()=>{ensureNoFixOption();try{updatePreview()}catch(_){ }},0);
      setTimeout(ensureNoFixOption,80);
    }else if(['eFinishPleat','eLiningPleat','eModel'].includes(t.id)){
      setTimeout(ensureNoFixOption,0);
      setTimeout(ensureNoFixOption,100);
    }
  },true);

  const oldClear=typeof clearEnv==='function'?clearEnv:null;
  if(oldClear){
    clearEnv=function(){
      noFixSelected=false;
      const r=oldClear.apply(this,arguments);
      setTimeout(ensureNoFixOption,0);
      return r;
    };
  }

  const oldReset=typeof resetQuote==='function'?resetQuote:null;
  if(oldReset){
    resetQuote=function(){
      noFixSelected=false;
      const r=oldReset.apply(this,arguments);
      setTimeout(ensureNoFixOption,20);
      return r;
    };
  }

  const oldLoad=typeof loadCloud==='function'?loadCloud:null;
  if(oldLoad){
    loadCloud=async function(){
      const r=await oldLoad.apply(this,arguments);
      noFixSelected=false;
      setTimeout(ensureNoFixOption,100);
      return r;
    };
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureNoFixOption,800));
})();

/* ============================================================================
   V12.5 • FOLHA DE PAGAMENTO + PEDIDOS + PRESTADORES + PDFs PADRONIZADOS
   ============================================================================ */
(function(){
  const V125='V12.5';
  const BR_DATE=d=>{try{return new Date(String(d)+'T12:00:00').toLocaleDateString('pt-BR')}catch{return d||'-'}};
  const monthLabel=m=>{if(!m)return '-';const [y,mo]=String(m).split('-');return `${mo}/${y}`};
  function ensureV125(){
    db.settings=db.settings||{};
    db.settings.hr=db.settings.hr||{};
    db.settings.hr.employees=db.settings.hr.employees||[];
    db.settings.hr.providers=db.settings.hr.providers||[];
    db.settings.hr.payrollClosings=db.settings.hr.payrollClosings||[];
    db.settings.hr.payrollRecords=db.settings.hr.payrollRecords||[];
    const c=companySettings();c.version=V125;
  }
  ensureV125();

  // ---- Navegação / nova tela Folha de Pagamento ----
  if(!NAV.some(x=>x[0]==='payroll')) NAV.push(['payroll','Folha de Pagamento','gestor']);
  const mg=NAV_GROUPS.find(x=>x.id==='management');
  if(mg&&!mg.items.includes('payroll')){
    const i=mg.items.indexOf('hr'); mg.items.splice(i>=0?i+1:mg.items.length,0,'payroll');
  }
  const oldSetView=setView;
  setView=function(id){oldSetView(id);if(id==='payroll')renderPayrollV125()};
  const oldRenderAll=renderAll;
  renderAll=function(){oldRenderAll();renderPayrollV125()};

  function commissionForEmployeeMonth(e,comp){
    const u=norm(e?.username||''); if(!u)return 0;
    return (db.orders||[]).filter(o=>resolveSellerUser(o)===u&&String(o.createdDate||'').slice(0,7)===comp)
      .reduce((a,o)=>a+orderCashSale(o)*Number(o.commissionPercent??sellerCommission(u))/100,0);
  }
  function payrollCalcV125(e,comp,extraGrants=[],extraDiscounts=[]){
    const salary=Number(e?.salary||0);
    const salesGrant=commissionForEmployeeMonth(e,comp); // regra solicitada: apresentada como GRATIFICAÇÃO não tributável
    const otherGrants=(extraGrants||[]).reduce((a,x)=>a+Number(x.value||0),0);
    const extraDisc=(extraDiscounts||[]).reduce((a,x)=>a+Number(x.value||0),0);
    const taxable=salary;
    const inss=inssEmployee2026(taxable),irrf=irrf2026(taxable,inss);
    const fgts=Math.round(taxable*.08*100)/100; // encargo patronal informativo, não desconta do líquido
    const gross=salary+salesGrant+otherGrants;
    const deductions=inss+irrf+extraDisc;
    return {salary,salesGrant,otherGrants,extraDisc,taxable,inss,irrf,fgts,gross,deductions,net:Math.max(0,gross-deductions)};
  }
  function payrollSlipV125(e,comp,due,grants=[],discounts=[]){
    const p=payrollCalcV125(e,comp,grants,discounts);
    const grantRows=[p.salesGrant?`<tr><td>Gratificação por vendas / comissões</td><td>Não tributável (regra gerencial)</td><td>${money(p.salesGrant)}</td><td>-</td></tr>`:'',...(grants||[]).map(x=>`<tr><td>${esc(x.nature||'Gratificação')}</td><td>${esc(x.justification||'-')}</td><td>${money(x.value)}</td><td>-</td></tr>`)].join('');
    const discountRows=(discounts||[]).map(x=>`<tr><td>${esc(x.nature||'Desconto')}</td><td>${esc(x.justification||'-')}</td><td>-</td><td>${money(x.value)}</td></tr>`).join('');
    return `<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br>Luiz Sergio Delgobo ME<br>CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>Av. Bonifácio Vilela, 170 • Ponta Grossa–PR<br><br><strong>HOLERITE / DEMONSTRATIVO DE PAGAMENTO</strong><br>Competência: ${monthLabel(comp)} • Vencimento: ${fmtDate(due)}</div></div>
    <div class="section-title">Dados do colaborador</div><table class="summary-table"><tr><th>Nome</th><td>${esc(e.name||'-')}</td><th>Cargo</th><td>${esc(e.role||'-')}</td></tr><tr><th>CPF</th><td>${esc(e.cpf||'-')}</td><th>Admissão</th><td>${fmtDate(e.admissionDate)}</td></tr></table>
    <div class="section-title">Proventos e descontos</div><table class="summary-table"><tr><th>Descrição</th><th>Referência</th><th>Provento</th><th>Desconto</th></tr><tr><td>Salário-base</td><td>Base tributável</td><td>${money(p.salary)}</td><td>-</td></tr>${grantRows}<tr><td>INSS</td><td>Sobre ${money(p.taxable)}</td><td>-</td><td>${money(p.inss)}</td></tr><tr><td>IRRF</td><td>Base legal aplicável</td><td>-</td><td>${money(p.irrf)}</td></tr>${discountRows}<tr><th>TOTAIS</th><th></th><th>${money(p.gross)}</th><th>${money(p.deductions)}</th></tr><tr><th colspan="3">LÍQUIDO A PAGAR</th><th>${money(p.net)}</th></tr></table>
    <div class="section-title">Encargos da empresa</div><table class="summary-table"><tr><th>FGTS estimado</th><td>${money(p.fgts)}</td><td colspan="2">Informativo: encargo do empregador, não descontado do colaborador.</td></tr></table>
    <p class="muted" style="font-size:11px">Demonstrativo gerencial do ERP. O enquadramento tributário das verbas deve seguir a orientação contábil vigente e a natureza efetiva de cada pagamento.</p>`;
  }

  window.openEmployeePayrollV125=function(id){
    ensureV125();const e=hrData().employees.find(x=>x.id===id);if(!e)return;
    const comp=new Date().toISOString().slice(0,7);const due=today();
    let pdfOpened=false;
    openModal(`<h2>Gerar folha de pagamento • ${esc(e.name)}</h2><div class="grid two"><label class="field">Competência<input id="v125PayComp" type="month" value="${comp}"></label><label class="field">Data de pagamento / vencimento<input id="v125PayDue" type="date" value="${due}"></label></div><div id="v125PayPreview" style="margin-top:14px"></div><div class="actions" style="margin-top:14px"><button id="v125PayPdf" class="btn secondary">VER EM PDF</button><button id="v125PayGenerate" class="btn primary" style="display:none">GERAR CONTAS A PAGAR</button><button id="v125PayBack" class="btn ghost">RETORNAR</button></div>`);
    const draw=()=>{$('v125PayPreview').innerHTML=payrollSlipV125(e,$('v125PayComp').value,$('v125PayDue').value)};draw();
    $('v125PayComp').onchange=()=>{pdfOpened=false;$('v125PayGenerate').style.display='none';draw()};$('v125PayDue').onchange=draw;
    $('v125PayPdf').onclick=()=>{draw();printWindow($('v125PayPreview').innerHTML);pdfOpened=true;$('v125PayGenerate').style.display='inline-flex'};
    $('v125PayBack').onclick=closeModal;
    $('v125PayGenerate').onclick=()=>{
      if(!pdfOpened)return alert('Abra o PDF antes de gerar o Contas a Pagar.');
      const comp=$('v125PayComp').value,due=$('v125PayDue').value;if(!comp||!due)return alert('Informe competência e vencimento.');
      const h=hrData();if((h.payrollRecords||[]).some(r=>r.employeeId===e.id&&r.competence===comp&&!r.returnedAt))return alert('Já existe uma folha ativa para este colaborador nesta competência.');
      const p=payrollCalcV125(e,comp,[],[]),rid=uid(),pid=uid();
      const rec={id:rid,employeeId:e.id,name:e.name,role:e.role||'',competence:comp,dueDate:due,salary:p.salary,salesGrant:p.salesGrant,grants:[],discounts:[],inss:p.inss,irrf:p.irrf,fgts:p.fgts,gross:p.gross,net:p.net,payableId:pid,createdAt:new Date().toISOString(),by:currentUsername()};
      h.payrollRecords.unshift(rec);db.payables.unshift({id:pid,title:`FOLHA-${comp}-${e.id}`,documentNumber:`FOLHA-${comp}-${e.id}`,definition:`FOLHA DE PAGAMENTO • ${e.name}`,quoteNumber:comp,dueDate:due,value:p.net,paidValue:0,paidDate:'',notes:`Salário ${money(p.salary)} + gratificações ${money(p.salesGrant)} - INSS/IRRF`,hrCompetence:comp,hrRefId:e.id,payrollRecordId:rid});
      audit('DEPARTAMENTO PESSOAL','GERAR FOLHA',e.name,`Competência ${comp} • líquido ${money(p.net)}`);queueSave();closeModal();renderAll();setView('payroll');
    };
  };

  function updatePayrollRecordV125(r){
    const e=hrData().employees.find(x=>x.id===r.employeeId);if(!e)return;
    const p=payrollCalcV125(e,r.competence,r.grants,r.discounts);Object.assign(r,{salary:p.salary,salesGrant:p.salesGrant,inss:p.inss,irrf:p.irrf,fgts:p.fgts,gross:p.gross,net:p.net,updatedAt:new Date().toISOString()});
    const pay=(db.payables||[]).find(x=>x.id===r.payableId);if(pay){pay.value=p.net;pay.dueDate=r.dueDate;pay.notes=`Folha ${r.competence} • bruto ${money(p.gross)} • líquido ${money(p.net)}`}
  }
  function payrollStatusV125(r){
    const pay=(db.payables||[]).find(x=>x.id===r.payableId);if(pay&&Number(pay.paidValue||0)>=Number(pay.value||0)-.005)return {label:'PAGO',cls:'ok'};
    const t=today();if(r.dueDate<t)return {label:'ATRASADO',cls:'danger'};if(r.dueDate===t)return {label:'VENCE HOJE',cls:'warn'};return {label:'A VENCER',cls:'ok'};
  }
  window.renderPayrollV125=function(){
    const tb=$('payrollTableV125');if(!tb)return;ensureV125();const rows=(hrData().payrollRecords||[]).filter(r=>!r.returnedAt).slice().sort((a,b)=>String(b.competence).localeCompare(String(a.competence))||String(a.name).localeCompare(String(b.name)));
    tb.innerHTML=rows.map(r=>{const s=payrollStatusV125(r);return `<tr><td>${monthLabel(r.competence)}</td><td>${esc(r.name)}</td><td>${money(r.salary)}</td><td>${money(Number(r.salesGrant||0)+(r.grants||[]).reduce((a,x)=>a+Number(x.value||0),0))}</td><td>${money((r.discounts||[]).reduce((a,x)=>a+Number(x.value||0),0))}</td><td><strong>${money(r.net)}</strong></td><td>${fmtDate(r.dueDate)}</td><td><span class="badge ${s.cls}">${s.label}</span></td><td><button class="btn ghost" data-payroll-pdf="${r.id}">PDF</button> <button class="btn secondary" data-payroll-disc="${r.id}">ADICIONAR DESCONTO</button> <button class="btn secondary" data-payroll-grant="${r.id}">ADICIONAR GRATIFICAÇÃO</button> <button class="btn danger" data-payroll-return="${r.id}">RETORNAR PAGAMENTO</button></td></tr>`}).join('')||'<tr><td colspan="9">Nenhuma folha enviada ao Contas a Pagar.</td></tr>';
    document.querySelectorAll('[data-payroll-pdf]').forEach(b=>b.onclick=()=>{const r=rows.find(x=>x.id===b.dataset.payrollPdf),e=hrData().employees.find(x=>x.id===r?.employeeId);if(r&&e)printWindow(payrollSlipV125(e,r.competence,r.dueDate,r.grants,r.discounts))});
    document.querySelectorAll('[data-payroll-disc]').forEach(b=>b.onclick=()=>openPayrollAdjustmentV125(b.dataset.payrollDisc,'discount'));
    document.querySelectorAll('[data-payroll-grant]').forEach(b=>b.onclick=()=>openPayrollAdjustmentV125(b.dataset.payrollGrant,'grant'));
    document.querySelectorAll('[data-payroll-return]').forEach(b=>b.onclick=()=>returnPayrollV125(b.dataset.payrollReturn));
  };
  window.openPayrollAdjustmentV125=function(id,type){const r=(hrData().payrollRecords||[]).find(x=>x.id===id);if(!r)return;const isGrant=type==='grant';openModal(`<h2>${isGrant?'Adicionar gratificação':'Adicionar desconto'} • ${esc(r.name)}</h2><div class="grid two"><label class="field">Valor<input id="v125AdjValue" type="number" min="0.01" step="0.01"></label><label class="field">Data<input id="v125AdjDate" type="date" value="${today()}"></label><label class="field">Natureza<input id="v125AdjNature" placeholder="${isGrant?'Serviço extra, prêmio...':'Adiantamento, ajuste...'}"></label><label class="field" style="grid-column:1/-1">Justificativa do gestor<textarea id="v125AdjJust" rows="3"></textarea></label></div><button id="v125AdjSave" class="btn primary">Salvar</button>`);$('v125AdjSave').onclick=()=>{const value=Number($('v125AdjValue').value||0),date=$('v125AdjDate').value,nature=$('v125AdjNature').value.trim(),justification=$('v125AdjJust').value.trim();if(!value||!date||!nature||!justification)return alert('Informe valor, data, natureza e justificativa.');const arr=isGrant?(r.grants=r.grants||[]):(r.discounts=r.discounts||[]);arr.push({id:uid(),value,date,nature,justification,by:currentUsername(),at:new Date().toISOString()});updatePayrollRecordV125(r);audit('FOLHA DE PAGAMENTO',isGrant?'GRATIFICAÇÃO':'DESCONTO',r.name,`${money(value)} • ${nature} • ${justification}`);queueSave();closeModal();renderPayrollV125();renderPayables()}};
  window.returnPayrollV125=function(id){const h=hrData(),r=(h.payrollRecords||[]).find(x=>x.id===id);if(!r)return;if(!confirm(`Retornar a folha de ${r.name} (${monthLabel(r.competence)}) ao Departamento Pessoal? O lançamento correspondente será removido do Contas a Pagar.`))return;const pay=(db.payables||[]).find(x=>x.id===r.payableId);if(pay&&Number(pay.paidValue||0)>0)return alert('Esta folha já possui pagamento registrado. Estorne o pagamento no financeiro antes de retornar a folha.');db.payables=(db.payables||[]).filter(x=>x.id!==r.payableId);r.returnedAt=new Date().toISOString();r.returnedBy=currentUsername();audit('FOLHA DE PAGAMENTO','RETORNAR',r.name,`Competência ${r.competence}`);queueSave();renderAll();setView('hr')};

  // ---- Prestadores: descontos, gratificações e contrato ----
  function providerNetV125(p){const g=(p.grants||[]).reduce((a,x)=>a+Number(x.value||0),0),d=(p.discounts||[]).reduce((a,x)=>a+Number(x.value||0),0);return Math.max(0,Number(p.value||0)+g-d)}
  window.openProviderAdjustmentV125=function(id,type){const p=hrData().providers.find(x=>x.id===id);if(!p)return;const isGrant=type==='grant';openModal(`<h2>${isGrant?'Inserir gratificação':'Inserir desconto'} • ${esc(p.name)}</h2><div class="grid two"><label class="field">Valor<input id="pvAdjValue" type="number" min="0.01" step="0.01"></label><label class="field">Data<input id="pvAdjDate" type="date" value="${today()}"></label><label class="field">Natureza<input id="pvAdjNature" placeholder="${isGrant?'Serviço extra':'Adiantamento / desconto'}"></label><label class="field" style="grid-column:1/-1">Justificativa do gestor<textarea id="pvAdjJust" rows="3"></textarea></label></div><button id="pvAdjSave" class="btn primary">Salvar</button>`);$('pvAdjSave').onclick=()=>{const value=Number($('pvAdjValue').value||0),date=$('pvAdjDate').value,nature=$('pvAdjNature').value.trim(),justification=$('pvAdjJust').value.trim();if(!value||!date||!nature||!justification)return alert('Preencha todos os campos.');const arr=isGrant?(p.grants=p.grants||[]):(p.discounts=p.discounts||[]);arr.push({id:uid(),value,date,nature,justification,by:currentUsername(),at:new Date().toISOString()});audit('PRESTADORES',isGrant?'GRATIFICAÇÃO':'DESCONTO',p.name,`${money(value)} • ${nature}`);queueSave();closeModal();renderHR()}};
  window.deleteEmployeeV125=function(id){const h=hrData(),e=h.employees.find(x=>x.id===id);if(!e||!confirm(`Excluir ${e.name} do cadastro de colaboradores?`))return;h.employees=h.employees.filter(x=>x.id!==id);audit('DEPARTAMENTO PESSOAL','EXCLUSÃO',e.name,'Colaborador removido');queueSave();renderHR()};
  window.deleteProviderV125=function(id){const h=hrData(),p=h.providers.find(x=>x.id===id);if(!p||!confirm(`Excluir ${p.name} do cadastro de prestadores?`))return;h.providers=h.providers.filter(x=>x.id!==id);audit('PRESTADORES','EXCLUSÃO',p.name,'Prestador removido');queueSave();renderHR()};

  const oldOpenProvider=openProvider;
  openProvider=function(e=null){
    openModal(`<h2>${e?'Editar':'Novo'} prestador de serviços</h2><div class="grid two"><label class="field">PF/PJ<select id="pvType"><option>PF</option><option ${e?.personType==='PJ'?'selected':''}>PJ</option></select></label><label class="field">Nome / Razão social<input id="pvName" value="${esc(e?.name||'')}"></label><label class="field">CPF/CNPJ<input id="pvDoc" value="${esc(e?.document||'')}"></label><label class="field">Natureza do serviço<input id="pvService" value="${esc(e?.service||'')}"></label><label class="field">Valor recorrente / referência<input id="pvValue" type="number" step="0.01" value="${Number(e?.value||0)}"></label><label class="field">Periodicidade<select id="pvPeriod"><option>MENSAL</option><option>POR SERVIÇO</option><option>OUTRO</option></select></label><label class="field">Início contrato<input id="pvStart" type="date" value="${e?.contractStart||''}"></label><label class="field">Fim contrato<input id="pvEnd" type="date" value="${e?.contractEnd||''}"></label><label class="field">Status<select id="pvActive"><option value="1">ATIVO</option><option value="0" ${e?.active===false?'selected':''}>INATIVO</option></select></label><label class="field">Contrato / observações<textarea id="pvContract">${esc(e?.contract||'')}</textarea></label><label class="field" style="grid-column:1/-1">Contrato de prestação de serviços (PDF ou imagem, até 1 MB)<input id="pvContractFile" type="file" accept="application/pdf,image/*"></label>${e?.contractFile?.dataUrl?`<div style="grid-column:1/-1" class="notice">Contrato armazenado: <strong>${esc(e.contractFile.name)}</strong> • ${(Number(e.contractFile.size||0)/1024).toFixed(0)} KB &nbsp; <a class="btn ghost" href="${e.contractFile.dataUrl}" target="_blank" download="${esc(e.contractFile.name)}">ABRIR CONTRATO</a></div>`:''}</div><button id="pvSave" class="btn primary">Salvar</button>`);
    if(e?.periodicity)$('pvPeriod').value=e.periodicity;
    $('pvSave').onclick=()=>{const f=$('pvContractFile').files[0];if(f&&f.size>1024*1024)return alert('O contrato deve ter no máximo 1 MB.');const finish=(fileObj)=>{const h=hrData(),obj={...(e||{}),id:e?.id||uid(),personType:$('pvType').value,name:$('pvName').value.trim(),document:$('pvDoc').value.trim(),service:$('pvService').value.trim(),value:Number($('pvValue').value||0),periodicity:$('pvPeriod').value,contractStart:$('pvStart').value,contractEnd:$('pvEnd').value,active:$('pvActive').value==='1',contract:$('pvContract').value.trim(),contractFile:fileObj||e?.contractFile||null,grants:e?.grants||[],discounts:e?.discounts||[],updatedAt:new Date().toISOString()};if(!obj.name)return alert('Informe o prestador.');const i=h.providers.findIndex(x=>x.id===obj.id);if(i>=0)h.providers[i]=obj;else h.providers.unshift(obj);audit('PRESTADORES',e?'ALTERAÇÃO':'INCLUSÃO',obj.name,fileObj?`Contrato anexado: ${fileObj.name}`:'Cadastro atualizado');queueSave();closeModal();renderHR()};if(!f)return finish(null);const rd=new FileReader();rd.onload=()=>finish({name:f.name,mime:f.type,size:f.size,dataUrl:rd.result,uploadedAt:new Date().toISOString(),by:currentUsername()});rd.readAsDataURL(f)};
  };

  // ---- Departamento pessoal: botões de folha / ajustes ----
  renderHR=function(){
    ensureV125();const h=hrData(),et=$('employeeTable'),pt=$('providerTable');if(!et||!pt)return;
    et.innerHTML=h.employees.map(e=>`<tr><td>${esc(e.name)}</td><td>${esc(e.role||'-')}</td><td>${fmtDate(e.admissionDate)}</td><td>${money(e.salary)}</td><td><span class="badge ${e.active===false?'danger':'ok'}">${e.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-emp-edit="${e.id}">Editar</button> <button class="btn primary" data-emp-payroll="${e.id}">GERAR FOLHA</button> <button class="btn danger" data-emp-delete="${e.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum colaborador CLT.</td></tr>';
    pt.innerHTML=h.providers.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.personType||'-')}</td><td>${esc(p.service||'-')}</td><td>${money(providerNetV125(p))}</td><td><span class="badge ${p.active===false?'danger':'ok'}">${p.active===false?'INATIVO':'ATIVO'}</span></td><td><button class="btn ghost" data-prov-edit="${p.id}">Editar</button> <button class="btn secondary" data-prov-disc="${p.id}">DESCONTO</button> <button class="btn secondary" data-prov-grant="${p.id}">GRATIFICAÇÃO</button> ${p.contractFile?.dataUrl?`<a class="btn ghost" href="${p.contractFile.dataUrl}" target="_blank" download="${esc(p.contractFile.name)}">CONTRATO</a>`:''} <button class="btn primary" data-prov-receipt="${p.id}">GERAR RECIBO</button> <button class="btn danger" data-prov-delete="${p.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum prestador.</td></tr>';
    const activeEmp=h.employees.filter(x=>x.active!==false),activeProv=h.providers.filter(x=>x.active!==false),partners=(h.partners||[]).filter(x=>x.active!==false);if($('hrSummary'))$('hrSummary').innerHTML=[['Colaboradores ativos',activeEmp.length],['Prestadores ativos',activeProv.length],['Sócios / pró-labore',partners.length],['Folha-base',money(activeEmp.reduce((a,x)=>a+Number(x.salary||0),0))],['Pró-labore-base',money(partners.reduce((a,x)=>a+Number(x.prolabore||0),0))],['Serviços recorrentes',money(activeProv.reduce((a,x)=>a+providerNetV125(x),0))]].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    let box=$('partnerPayrollBox');if(!box){box=document.createElement('section');box.id='partnerPayrollBox';box.className='card';box.style.marginTop='14px';$('view-hr')?.appendChild(box)}if(box&&partners.length)box.innerHTML=`<div class="card-title">Sócios / Pró-labore</div><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Vínculo</th><th>Pró-labore</th><th>INSS estimado</th><th>IRRF estimado</th><th>Líquido estimado</th></tr></thead><tbody>${partners.map(p=>{const i=inssProlabore2026(p.prolabore),ir=irrf2026(p.prolabore,i);return `<tr><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${money(p.prolabore)}</td><td>${money(i)}</td><td>${money(ir)}</td><td><strong>${money(Number(p.prolabore)-i-ir)}</strong></td></tr>`}).join('')}</tbody></table></div>`;
    document.querySelectorAll('[data-emp-edit]').forEach(b=>b.onclick=()=>openEmployee(h.employees.find(x=>x.id===b.dataset.empEdit)));document.querySelectorAll('[data-emp-payroll]').forEach(b=>b.onclick=()=>openEmployeePayrollV125(b.dataset.empPayroll));document.querySelectorAll('[data-emp-delete]').forEach(b=>b.onclick=()=>deleteEmployeeV125(b.dataset.empDelete));document.querySelectorAll('[data-prov-edit]').forEach(b=>b.onclick=()=>openProvider(h.providers.find(x=>x.id===b.dataset.provEdit)));document.querySelectorAll('[data-prov-disc]').forEach(b=>b.onclick=()=>openProviderAdjustmentV125(b.dataset.provDisc,'discount'));document.querySelectorAll('[data-prov-grant]').forEach(b=>b.onclick=()=>openProviderAdjustmentV125(b.dataset.provGrant,'grant'));document.querySelectorAll('[data-prov-receipt]').forEach(b=>b.onclick=()=>openProviderReceipt(b.dataset.provReceipt));document.querySelectorAll('[data-prov-delete]').forEach(b=>b.onclick=()=>deleteProviderV125(b.dataset.provDelete));
  };

  // Recibo de prestador passa a considerar gratificações e descontos cadastrados.
  openProviderReceipt=function(id){const p=hrData().providers.find(x=>x.id===id);if(!p)return;const initialPeriod=new Date().toISOString().slice(0,7),initialValue=providerNetV125(p);openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><button id="v125ProviderBack" class="btn ghost">← VOLTAR</button><h2 style="margin:0">Recibo de prestação de serviço</h2><button id="providerReceiptPrint" class="btn primary">IMPRIMIR / PDF</button></div><div class="grid three" style="margin:14px 0"><label class="field">Competência<input id="providerReceiptPeriod" type="month" value="${initialPeriod}"></label><label class="field">Valor do recibo<input id="providerReceiptValue" type="number" min="0" step="0.01" value="${initialValue.toFixed(2)}"></label><label class="field">Descrição<input id="providerReceiptDescription" value="${esc(p.service||'Prestação de serviço')}"></label></div><div id="providerReceiptBox"></div>`);const draw=()=>{const period=$('providerReceiptPeriod').value,value=Number($('providerReceiptValue').value||0),description=$('providerReceiptDescription').value;const adj=(p.grants||[]).length||(p.discounts||[]).length?`<p><strong>Ajustes considerados:</strong> Gratificações ${money((p.grants||[]).reduce((a,x)=>a+Number(x.value||0),0))} • Descontos ${money((p.discounts||[]).reduce((a,x)=>a+Number(x.value||0),0))}</p>`:'';$('providerReceiptBox').innerHTML=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM • RECIBO DE PRESTAÇÃO DE SERVIÇO</strong><br><strong>NOME / RAZÃO SOCIAL:</strong> ${esc(p.name)} • <strong>CPF/CNPJ:</strong> ${esc(p.document||'-')}<br><strong>SERVIÇO CADASTRADO:</strong> ${esc(p.service||'-')}</div></div><div class="section-title">Recibo</div><table class="summary-table"><tr><th>Competência</th><td>${monthLabel(period)}</td><th>Valor</th><td><strong>${money(value)}</strong></td></tr><tr><th>Descrição</th><td colspan="3">${esc(description)}</td></tr></table>${adj}<p>Declaro o recebimento do valor acima referente aos serviços prestados à Nova Imagem Cortinas e Persianas.</p><div class="signature-grid"><div><div class="signature-line"></div><strong>${esc(p.name)}</strong></div><div><div class="signature-line"></div><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong></div></div>`};draw();['providerReceiptPeriod','providerReceiptValue','providerReceiptDescription'].forEach(x=>$(x).oninput=draw);$('providerReceiptPrint').onclick=()=>{draw();printWindow($('providerReceiptBox').innerHTML)};$('v125ProviderBack').onclick=closeModal};

  // ---- Pedidos: filtros, PDF e alteração de data ----
  function orderFiltersV125(){return {seller:norm($('orderFilterSeller')?.value||''),from:$('orderFilterFrom')?.value||'',to:$('orderFilterTo')?.value||''}}
  function filteredOrdersV125(){const f=orderFiltersV125();return (db.orders||[]).filter(canSeeOrder).filter(o=>(!f.seller||resolveSellerUser(o)===f.seller)&&(!f.from||String(o.createdDate||'')>=f.from)&&(!f.to||String(o.createdDate||'')<=f.to))}
  function fillOrderSellersV125(){const s=$('orderFilterSeller');if(!s)return;const cur=s.value;const users=[...new Set((db.orders||[]).map(o=>resolveSellerUser(o)).filter(Boolean))];s.innerHTML='<option value="">TODOS OS VENDEDORES</option>'+users.map(u=>`<option value="${esc(u)}">${esc(sellerName(u))}</option>`).join('');s.value=cur}
  renderOrders=function(){const tb=$('ordersTable');if(!tb)return;fillOrderSellersV125();tb.innerHTML='';for(const o of filteredOrdersV125()){const install=o.installation?.completedDate?'CONCLUÍDA':o.productionStage==='EXPEDIÇÃO'?'PRONTO PARA INSTALAÇÃO':'AGUARDANDO',paid=orderPaid(o),bal=orderBalance(o),fs=financialStatus(o);const tr=document.createElement('tr');tr.innerHTML=`<td>${String(o.numero).padStart(6,'0')}</td><td>${String(o.quoteNumber).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(displaySeller(o))}</td><td>${money(o.agreedValue)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td><span class="badge ${fs==='QUITADO'?'ok':fs==='PARCIAL'?'blue':'warn'}">${fs}</span></td><td><span class="badge blue">${esc(o.productionStage||'RECEPÇÃO')}</span></td><td><span class="badge ${install==='CONCLUÍDA'?'ok':'warn'}">${install}</span></td><td><button class="btn primary" data-order-pay="${o.numero}">Inserir pagamento</button> <button class="btn ghost" data-order-open="${o.numero}">Abrir</button> ${isGestor()?`<button class="btn danger" data-order-delete="${o.numero}">Excluir</button>`:''}</td>`;tb.appendChild(tr)}if(!tb.children.length)tb.innerHTML='<tr><td colspan="11">Nenhum pedido nos filtros informados.</td></tr>';document.querySelectorAll('[data-order-open]').forEach(b=>b.onclick=()=>openOrder(Number(b.dataset.orderOpen)));document.querySelectorAll('[data-order-pay]').forEach(b=>b.onclick=()=>openPayment(Number(b.dataset.orderPay)));document.querySelectorAll('[data-order-delete]').forEach(b=>b.onclick=()=>deleteOrder(Number(b.dataset.orderDelete)))};
  window.printOrdersV125=function(){const rows=filteredOrdersV125(),f=orderFiltersV125(),total=rows.reduce((a,o)=>a+orderCashSale(o),0);let commission=0;if(f.seller)commission=rows.reduce((a,o)=>a+orderCashSale(o)*Number(o.commissionPercent??sellerCommission(f.seller))/100,0);const body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><strong>RELATÓRIO DE PEDIDOS</strong><br><br>Vendedor: <strong>${f.seller?esc(sellerName(f.seller)):'Todos'}</strong><br>Período: ${f.from?fmtDate(f.from):'início'} até ${f.to?fmtDate(f.to):'hoje'}</div></div><table class="summary-table"><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Vendedor</th><th>Valor à vista</th></tr>${rows.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${fmtDate(o.createdDate)}</td><td>${esc(o.client)}</td><td>${esc(displaySeller(o))}</td><td>${money(orderCashSale(o))}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum pedido.</td></tr>'}</table><div class="section-title">Fechamento</div><table class="summary-table"><tr><th>Total de pedidos</th><td>${rows.length}</td><th>Soma dos pedidos a valor à vista</th><td><strong>${money(total)}</strong></td></tr>${f.seller?`<tr><th colspan="3">Comissão do vendedor no período</th><td><strong>${money(commission)}</strong></td></tr>`:''}</table>`;printWindow(body)};
  window.changeOrderDateV125=function(n){if(!isGestor())return alert('Somente o GESTOR pode alterar a data do pedido.');const o=db.orders.find(x=>Number(x.numero)===Number(n));if(!o)return;openModal(`<h2>Alterar data do pedido ${String(o.numero).padStart(6,'0')}</h2><p>Data atual: <strong>${fmtDate(o.createdDate)}</strong></p><label class="field">Nova data do pedido<input id="v125NewOrderDate" type="date" value="${o.createdDate||today()}"></label><div id="v125DateImpact" class="notice" style="margin-top:12px"></div><div class="actions" style="margin-top:14px"><button id="v125DateConfirm" class="btn primary">CONFIRMAR</button><button id="v125DateCancel" class="btn ghost">CANCELAR</button></div>`);const impact=()=>{const nd=$('v125NewOrderDate').value,oldM=String(o.createdDate||'').slice(0,7),newM=String(nd||'').slice(0,7),v=orderCashSale(o);$('v125DateImpact').innerHTML=oldM===newM?`A alteração permanece na mesma competência (${monthLabel(oldM)}), sem mudança no total mensal.`:`Esta alteração <strong>reduzirá ${monthLabel(oldM)} em ${money(v)}</strong> e <strong>aumentará ${monthLabel(newM)} em ${money(v)}</strong> no fechamento a valor à vista.`};impact();$('v125NewOrderDate').onchange=impact;$('v125DateCancel').onclick=closeModal;$('v125DateConfirm').onclick=()=>{const nd=$('v125NewOrderDate').value;if(!nd)return alert('Informe a nova data.');const old=o.createdDate;o.dateHistory=o.dateHistory||[];o.dateHistory.push({from:old,to:nd,at:new Date().toISOString(),by:currentUsername()});o.createdDate=nd;addOrderEvent(o,'DATA DO PEDIDO ALTERADA',`${fmtDate(old)} → ${fmtDate(nd)}`);audit('PEDIDOS','ALTERAÇÃO DE DATA',`PEDIDO ${o.numero}`,`${fmtDate(old)} → ${fmtDate(nd)} • impacto ${money(orderCashSale(o))}`);queueSave();closeModal();renderAll()}};
  const oldOpenOrder=openOrder;
  openOrder=function(n){oldOpenOrder(n);if(isGestor()){const actions=$('openCustomerOrder')?.parentElement;if(actions&&!$('v125ChangeOrderDate')){const b=document.createElement('button');b.id='v125ChangeOrderDate';b.className='btn secondary';b.textContent='ALTERAR DATA DO PEDIDO';b.onclick=()=>changeOrderDateV125(n);actions.appendChild(b)}}};

  // ---- Pedido do cliente: valor do ambiente + insumos + confecção ----
  printCustomerOrder=function(o){
    ensureV119();if(!/^\d{6}$/.test(String(o.clientAccessCode||''))){o.clientAccessCode=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');queueSave()}
    const q=db.quotes.find(x=>Number(x.numero)===Number(o.quoteNumber)),n=v1214OrderInstallments(o),payText=v1214ContractPaymentText(o);let envs='';
    for(const e of o.environments||[]){const c=calcEnvironment(e);if(!c)continue;const envValue=v1214EnvironmentOrderValue(e,o,q),base4=Number(c.base4||0)||1,materials4=Math.max(0,base4-Number(c.laborTotal||0)),labor4=Math.max(0,Number(c.laborTotal||0)),ratio=envValue/base4,insumos=materials4*ratio,confeccao=labor4*ratio,mats=environmentMaterialRows(e,o.paymentCondition==='custom'?'p4':o.paymentCondition);envs+=`<div class="env-block"><div class="env-title">${esc(e.name)}</div><table class="env-table"><tr><th>Medidas</th><td>${e.width} × ${e.height} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td><th>Forro</th><td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td></tr><tr><th>Fixação</th><td colspan="3">${esc(e.fixation||'-')} • ${esc(e.fixColor||'')}</td></tr></table><table class="summary-table" style="margin-top:6px"><tr><th>VALOR DESTE AMBIENTE</th><th>TOTAL DE INSUMOS</th><th>TOTAL DE CONFECÇÃO</th></tr><tr><td><strong>${money(envValue)}</strong>${o.paymentCondition!=='cash'?`<br><small>${n}x de ${money(envValue/n)}</small>`:''}</td><td><strong>${money(insumos)}</strong></td><td><strong>${money(confeccao)}</strong><br><small>confecção + instalação</small></td></tr></table><div class="section-title">Materiais deste ambiente</div><table class="summary-table"><tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>${mats||'<tr><td colspan="6">Sem material oficial vinculado.</td></tr>'}</table></div>`}
    const cset=companySettings(),warranty=o.documentVersions?.warrantyText||cset.warranty||V119_WARRANTY,body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>Nova Imagem Cortinas e Persianas</strong><br>Luiz Sergio Delgobo ME<br>CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330<br><br><strong>PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br><strong>Cliente:</strong> ${esc(o.client||'-')}<br><strong>Contato:</strong> ${esc(o.contact||'-')}<br><strong>Endereço:</strong> ${esc(o.address||'-')}<br><strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br><strong>Vendedor:</strong> ${esc(displaySeller(o))}</div></div>${envs}<div class="section-title">Acompanhe seu pedido</div><div class="customer-access-box"><img class="customer-qr" src="${customerPortalQrUrl(o.numero)}"><div><strong>Portal do Cliente Nova Imagem</strong><br>Aponte a câmera para o QR Code.<br><br>Pedido: <strong>${String(o.numero).padStart(6,'0')}</strong><br>Senha: <strong>${esc(o.clientAccessCode)}</strong><br><a class="customer-portal-link" href="${customerPortalUrl(o.numero)}" target="_blank">Clique aqui para acompanhar seu pedido</a></div></div><div class="section-title">Condição contratada</div><p class="totals">${esc(payText)}</p><div class="section-title">CONTRATO DE FORNECIMENTO E INSTALAÇÃO</div><div class="conditions"><p><strong>CONTRATADA:</strong> Luiz Sergio Delgobo ME, CNPJ 15.115.803/0001-69.</p><p><strong>CONTRATANTE:</strong> ${esc(o.client||'-')}, endereço ${esc(o.address||'-')}.</p><p><strong>OBJETO:</strong> fornecimento e instalação dos produtos descritos neste pedido.</p><p><strong>CONDIÇÃO:</strong> ${esc(payText)}</p><p><strong>PRAZO PREVISTO:</strong> instalação/entrega em ${fmtDate(o.deliveryDate)}.</p></div><div class="signature-grid"><div><div class="signature-line"></div><strong>${esc(o.client||'Cliente')}</strong><br><small>Cliente / Contratante</small></div><div><div class="signature-line"></div><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><small>Eric Luiz Delgobo</small></div></div><div style="page-break-before:always"></div><div class="section-title">TERMO DE GARANTIA</div><div style="white-space:pre-line;line-height:1.55">${esc(warranty)}</div><br><p><strong>Pedido:</strong> ${String(o.numero).padStart(6,'0')} • <strong>Cliente:</strong> ${esc(o.client||'-')}</p><div class="signature-grid"><div><div class="signature-line"></div><strong>${esc(o.client||'Cliente')}</strong></div><div><div class="signature-line"></div><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong></div></div>`;printWindow(body)
  };

  // ---- Remove TERMO DE GARANTIA do Painel Comercial (permanece no Pedido) ----
  const oldCommercialV125=renderCommercialPanel;
  renderCommercialPanel=function(){oldCommercialV125();const b=$('commercialWarrantyBtn');if(b)b.closest('.card')?.remove()};

  // ---- PDF universal com padrão visual Nova Imagem ----
  printWindow=function(body){
    const w=window.open('about:blank','_blank');if(!w)return alert('O navegador bloqueou a abertura do PDF. Libere pop-ups para este site.');
    const hasHead=/class=["']pdf-head["']/.test(String(body));const brand=hasHead?'':`<div class="pdf-head auto-brand"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><span>Documento gerado pelo ERP • ${V125}</span></div></div>`;
    w.document.write(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nova Imagem • ${V125}</title><style>*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;margin:9mm;color:#173638;font-size:9.5pt;background:#fff}h1,h2,h3{color:#075b5b}h2{font-size:16pt;margin:0}.pdf-head{display:grid;grid-template-columns:42mm 1fr;gap:14px;align-items:center;border-bottom:3px solid #075b5b;padding-bottom:10px;margin-bottom:14px}.pdf-head img{width:38mm;height:28mm;object-fit:contain;object-position:left center}.store-client{font-size:10.5pt;line-height:1.42}.store-client strong:first-child{font-size:13pt;color:#075b5b}.quote-number{font-size:12pt;font-weight:800;margin:8px 0 12px;color:#075b5b}.env-block{margin:0 0 14px;break-inside:avoid;border:1px solid #c7d8d6;border-radius:8px;overflow:hidden}.env-title{font-size:11pt;font-weight:800;padding:7px 9px;background:#e8f3f1;color:#075b5b}.env-table,.summary-table{width:100%;border-collapse:collapse}.env-table th,.env-table td,.summary-table th,.summary-table td{border:1px solid #c7d8d6;padding:6px 7px;font-size:9.3pt;text-align:left;vertical-align:top}.env-table th,.summary-table th{background:#f0f7f6;color:#075b5b;font-weight:800}.section-title{font-size:11pt;font-weight:800;color:#075b5b;margin:15px 0 7px;border-left:4px solid #075b5b;padding-left:7px}.totals{font-size:11pt;font-weight:800;color:#075b5b}.conditions{font-size:9.5pt;line-height:1.5}.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:24mm;margin-top:22mm;text-align:center;break-inside:avoid}.signature-line{border-top:1px solid #173638;margin-bottom:5px}.customer-access-box{display:grid;grid-template-columns:32mm 1fr;gap:12px;align-items:center;border:1px solid #b9d1cf;border-radius:8px;padding:9px;background:#f8fbfa;break-inside:avoid}.customer-qr{width:29mm;height:29mm;object-fit:contain}.customer-portal-link{color:#075b5b;font-weight:700}.muted{color:#587072}.notice{background:#fff8df;border:1px solid #e7d795;border-radius:7px;padding:8px}.screen-only{position:sticky;top:0;background:#fff;padding:7px 0 10px;z-index:5}.screen-only button{padding:9px 14px;border:0;border-radius:7px;background:#075b5b;color:#fff;font-weight:800;margin-right:7px}@page{size:A4 portrait;margin:9mm}@media print{body{margin:0}.screen-only{display:none!important}.env-block{border-radius:0}}</style></head><body><div class="screen-only"><button onclick="window.print()">IMPRIMIR / SALVAR PDF</button><button onclick="window.close()">← RETORNAR</button></div>${brand}${body}<script>document.title='Nova Imagem • ${V125}';<\/script></body></html>`);w.document.close();w.focus();
  };

  document.addEventListener('DOMContentLoaded',()=>{
    ensureV125();
    ['orderFilterSeller','orderFilterFrom','orderFilterTo'].forEach(id=>$(id)?.addEventListener('change',renderOrders));
    $('orderFilterPdf')?.addEventListener('click',printOrdersV125);$('orderFilterClear')?.addEventListener('click',()=>{if($('orderFilterSeller'))$('orderFilterSeller').value='';if($('orderFilterFrom'))$('orderFilterFrom').value='';if($('orderFilterTo'))$('orderFilterTo').value='';renderOrders()});
    setTimeout(()=>{renderNav();renderHR();renderOrders();renderPayrollV125()},250);
  });
})();



/* ============================================================================
   V12.6.3 • VENDAS: PEDIDOS, ETIQUETAS E CONVERSÃO SEGURA
   ============================================================================ */
(function(){
  const VERSION='V12.7';
  try{companySettings().version=VERSION}catch(_){}

  // Evita exibir Novo Orçamento antes da home terminar de carregar.
  try{
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    $('view-home')?.classList.add('active');
  }catch(_){}

  // PEDIDOS: filtros por usuários cadastrados + PDF
  function orderDate1263(o){return String(o?.createdDate||o?.date||o?.createdAt||'').slice(0,10)}
  function filters1263(){return {seller:norm($('orderFilterSeller')?.value||''),from:$('orderFilterFrom')?.value||'',to:$('orderFilterTo')?.value||''}}
  function visible1263(){const f=filters1263();return (db.orders||[]).filter(canSeeOrder).filter(o=>{const d=orderDate1263(o),u=resolveSellerUser(o);return (!f.seller||u===f.seller)&&(!f.from||d>=f.from)&&(!f.to||d<=f.to)})}
  function fillSellers1263(){
    const s=$('orderFilterSeller');if(!s)return;
    const cur=norm(s.value||'');
    const fromUsers=(typeof allUsers==='function'?allUsers():[]).filter(u=>['SALES','GESTOR','PARTNER'].includes(norm(u.role))).map(u=>norm(u.username)).filter(Boolean);
    const fromOrders=(db.orders||[]).map(o=>resolveSellerUser(o)).filter(Boolean);
    const users=[...new Set([...fromUsers,...fromOrders])].sort((a,b)=>sellerName(a).localeCompare(sellerName(b),'pt-BR'));
    s.innerHTML='<option value="">TODOS OS VENDEDORES</option>'+users.map(u=>`<option value="${esc(u)}">${esc(sellerName(u))}</option>`).join('');
    if([...s.options].some(o=>norm(o.value)===cur))s.value=cur;
  }
  const oldRenderOrders1263=renderOrders;
  renderOrders=function(){
    fillSellers1263();
    const tb=$('ordersTable');if(!tb)return oldRenderOrders1263();
    tb.innerHTML='';
    for(const o of visible1263()){
      const install=o.installation?.completedDate?'CONCLUÍDA':o.productionStage==='EXPEDIÇÃO'?'PRONTO PARA INSTALAÇÃO':'AGUARDANDO',paid=orderPaid(o),bal=orderBalance(o),fs=financialStatus(o);
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${String(o.numero).padStart(6,'0')}</td><td>${String(o.quoteNumber).padStart(6,'0')}</td><td>${esc(o.client)}</td><td>${esc(displaySeller(o))}</td><td>${money(o.agreedValue)}</td><td>${money(paid)}</td><td><strong>${money(bal)}</strong></td><td><span class="badge ${fs==='QUITADO'?'ok':fs==='PARCIAL'?'blue':'warn'}">${fs}</span></td><td><span class="badge blue">${esc(o.productionStage||'RECEPÇÃO')}</span></td><td><span class="badge ${install==='CONCLUÍDA'?'ok':'warn'}">${install}</span></td><td><button class="btn primary" data-order-pay="${o.numero}">Inserir pagamento</button> <button class="btn ghost" data-order-open="${o.numero}">Abrir</button> ${isGestor()?`<button class="btn danger" data-order-delete="${o.numero}">Excluir</button>`:''}</td>`;
      tb.appendChild(tr)
    }
    if(!tb.children.length)tb.innerHTML='<tr><td colspan="11">Nenhum pedido nos filtros informados.</td></tr>';
    document.querySelectorAll('[data-order-open]').forEach(b=>b.onclick=()=>openOrder(Number(b.dataset.orderOpen)));
    document.querySelectorAll('[data-order-pay]').forEach(b=>b.onclick=()=>openPayment(Number(b.dataset.orderPay)));
    document.querySelectorAll('[data-order-delete]').forEach(b=>b.onclick=()=>deleteOrder(Number(b.dataset.orderDelete)));
  };
  window.printOrdersV1263=function(){
    const rows=visible1263(),f=filters1263(),total=rows.reduce((a,o)=>a+orderCashSale(o),0),pct=f.seller?Number(sellerCommission(f.seller)||0):0;
    const commission=f.seller?rows.reduce((a,o)=>a+orderCashSale(o)*Number(o.commissionPercent??pct)/100,0):0;
    printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><strong>RELATÓRIO DE PEDIDOS</strong><br><br>Vendedor: <strong>${f.seller?esc(sellerName(f.seller)):'Todos'}</strong><br>Período: ${f.from?fmtDate(f.from):'início'} até ${f.to?fmtDate(f.to):'hoje'}</div></div><table class="summary-table"><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Vendedor</th><th>Valor à vista</th></tr>${rows.map(o=>`<tr><td>${String(o.numero).padStart(6,'0')}</td><td>${fmtDate(orderDate1263(o))}</td><td>${esc(o.client)}</td><td>${esc(displaySeller(o))}</td><td>${money(orderCashSale(o))}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum pedido.</td></tr>'}</table><div class="section-title">Fechamento</div><table class="summary-table"><tr><th>Total de pedidos</th><td>${rows.length}</td><th>Soma dos pedidos a valor à vista</th><td><strong>${money(total)}</strong></td></tr>${f.seller?`<tr><th>Percentual de comissão</th><td>${pct.toFixed(2)}%</td><th>Comissão do vendedor no período</th><td><strong>${money(commission)}</strong></td></tr>`:''}</table>`)
  };
  function bindFilters1263(){
    const s=$('orderFilterSeller'),fr=$('orderFilterFrom'),to=$('orderFilterTo'),pdf=$('orderFilterPdf'),cl=$('orderFilterClear');
    if(s)s.onchange=renderOrders;if(fr)fr.onchange=renderOrders;if(to)to.onchange=renderOrders;
    if(pdf)pdf.onclick=window.printOrdersV1263;
    if(cl)cl.onclick=()=>{if(s)s.value='';if(fr)fr.value='';if(to)to.value='';renderOrders()};
  }
  const oldSetView1263=setView;
  setView=function(id){oldSetView1263(id);if(id==='orders'){bindFilters1263();renderOrders()}};

  // ETIQUETAS
  window.generateLabelsV1263=function(orderNumber){
    const o=(db.orders||[]).find(x=>Number(x.numero)===Number(orderNumber));if(!o)return alert('Pedido não encontrado.');
    const labels=[];
    for(const e of o.environments||[]){
      const n=Math.max(1,Number(e.leaves||1));
      if(e.model!=='LINING')for(let i=1;i<=n;i++)labels.push({env:e.name,size:`${e.width} x ${e.height} cm`,fabric:[e.finish,e.finishColor].filter(Boolean).join(' • '),id:`ACABAMENTO ${i}/${n}`});
      if(e.model!=='FINISH')for(let i=1;i<=n;i++)labels.push({env:e.name,size:`${e.width} x ${e.height} cm`,fabric:[e.lining,e.liningColor].filter(Boolean).join(' • '),id:`FORRO ${i}/${n}`});
    }
    const w=window.open('about:blank','_blank');if(!w)return alert('Libere pop-ups para gerar as etiquetas.');
    w.document.write(`<html><head><title>Etiquetas • Pedido ${String(o.numero).padStart(6,'0')}</title><style>@page{size:A4 portrait;margin:8mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#000}.tools{margin:0 0 6mm}.tools button{padding:8px 12px;margin-right:6px}.sheet{display:grid;grid-template-columns:repeat(4,40mm);gap:3mm;align-items:start}.label{width:40mm;height:55mm;border:1.2px solid #000;padding:2.2mm;overflow:hidden;break-inside:avoid;font-size:7.2pt;line-height:1.12}.logo{height:8mm;text-align:center;border-bottom:1px solid #000;margin-bottom:1.5mm}.logo img{height:7mm;max-width:25mm;object-fit:contain}.client{font-size:8pt;font-weight:800;margin-bottom:1mm}.row{margin:.8mm 0}.check{font-size:7pt;margin:1.2mm 0;border-top:1px solid #bbb;border-bottom:1px solid #bbb;padding:.8mm 0}.leaf{font-weight:900;font-size:8.3pt;margin-top:1mm}@media print{.tools{display:none}.sheet{gap:3mm}}</style></head><body><div class="tools"><button onclick="window.print()">IMPRIMIR</button><button onclick="window.close()">RETORNAR</button> ${labels.length} etiqueta(s)</div><div class="sheet">${labels.map(l=>`<div class="label"><div class="logo"><img src="${location.origin}/icon-512.png"></div><div class="client">${esc(o.client||'-')}</div><div class="row"><b>PEDIDO:</b> ${String(o.numero).padStart(6,'0')}</div><div class="row"><b>AMBIENTE:</b> ${esc(l.env||'-')}</div><div class="row"><b>MEDIDA:</b> ${esc(l.size)}</div><div class="check">☐ EXATO &nbsp;&nbsp; ☐ DAR DESCONTO</div><div class="row"><b>TECIDO:</b> ${esc(l.fabric||'-')}</div><div class="leaf">${esc(l.id)}</div></div>`).join('')}</div></body></html>`);
    w.document.close();w.focus();
  };
  const oldPrintProductionOrder1263=printProductionOrder;
  printProductionOrder=function(o){
    oldPrintProductionOrder1263(o);
    setTimeout(()=>{try{const w=window.open('','_blank');}catch(_){}},0);
  };

  // CONVERSÃO SEGURA + CHECKLIST
  const oldConvertQuote1263=convertQuote;
  function address1263(q){return [[q.street,q.number].filter(Boolean).join(', '),q.complement,q.neighborhood,q.cep?`CEP ${q.cep}`:''].filter(Boolean).join(' • ')||q.address||'-'}
  function condition1263(cond,installments){if(cond==='cash')return 'À VISTA (PIX/DINHEIRO)';if(cond==='p4')return 'EM ATÉ 4X';if(cond==='p18')return '18X';if(cond==='custom')return `OUTRO • ${Math.max(1,Number(installments||1))} parcela(s)`;return cond||'-'}
  function envSummary1263(e){
    const details=[];details.push(e.model==='COMPLETE'?'Cortina completa':e.model==='LINING'?'Apenas forro':'Apenas acabamento');
    if(e.finish)details.push(`Acabamento: ${e.finish}${e.finishColor?' / '+e.finishColor:''}${e.finishPleat?' / '+e.finishPleat+' '+(e.finishGather||'')+':1':''}`);
    if(e.lining)details.push(`Forro: ${e.lining}${e.liningColor?' / '+e.liningColor:''}${e.liningPleat?' / '+e.liningPleat+' '+(e.liningGather||'')+':1':''}`);
    if(e.finishBar)details.push(`Barra: ${e.finishBar}${e.soutacheColor?' / '+e.soutacheColor:''}`);
    return `<tr><td><strong>${esc(e.name||'-')}</strong></td><td>${Number(e.width||0)} × ${Number(e.height||0)} cm</td><td>${Math.max(0,Number(e.leaves||1)-1)}</td><td>${details.map(esc).join('<br>')}</td><td>${esc(e.excludeFixation?'FIXAÇÃO EXCLUÍDA PARA ESTA PEÇA':[e.fixation,e.fixColor].filter(Boolean).join(' • ')||'-')}</td></tr>`
  }
  function installChecklist1263(q){
    const btn=$('convGo');if(!btn||$('convChecklistBox'))return;
    const box=document.createElement('div');box.id='convChecklistBox';box.style.cssText='margin:14px 0;border:1px solid #c7d8d6;border-radius:10px;overflow:hidden;background:#fff';
    box.innerHTML=`<div style="background:#e8f3f1;color:#075b5b;font-weight:900;padding:10px 12px">CHECKLIST ANTES DE GERAR O PEDIDO</div><div style="padding:10px 12px"><div class="grid two" style="margin-bottom:10px"><div><small class="muted">NOME DO CLIENTE</small><br><strong>${esc(q.client||'-')}</strong></div><div><small class="muted">ENDEREÇO</small><br><strong>${esc(address1263(q))}</strong></div><div><small class="muted">CONDIÇÃO ESCOLHIDA</small><br><strong id="convChecklistCondition">-</strong></div><div><small class="muted">DATA DE INSTALAÇÃO</small><br><strong id="convChecklistDate">-</strong></div><div><small class="muted">VALOR TOTAL DO PEDIDO</small><br><strong id="convChecklistTotal">-</strong></div></div><div style="font-weight:900;color:#075b5b;margin:8px 0 5px">RESUMO POR AMBIENTE</div><div class="table-wrap"><table class="table"><thead><tr><th>Ambiente</th><th>Largura × Altura</th><th>Aberturas</th><th>Detalhes / barra / cores</th><th>Fixação</th></tr></thead><tbody>${(q.environments||[]).map(envSummary1263).join('')}</tbody></table></div><label style="display:flex;gap:8px;align-items:flex-start;margin-top:12px;font-weight:800"><input id="convChecklistOk" type="checkbox" style="margin-top:2px"> CONFERI OS DADOS ACIMA E AUTORIZO A GERAÇÃO DO PEDIDO.</label></div>`;
    btn.parentNode.insertBefore(box,btn);
    function refresh(){const condition=$('convCond')?.value||'cash',installments=$('convInstallments')?.value||'',date=$('convDate')?.value||'',disc=Number($('convDiscount')?.value||0),t=quoteTotals(q);let base=condition==='cash'?t.cash:condition==='p18'?t.p18:t.p4;base=Number(base||0)*(1-disc/100);$('convChecklistCondition').textContent=condition1263(condition,installments);$('convChecklistDate').textContent=date?fmtDate(date):'NÃO INFORMADA';$('convChecklistTotal').textContent=money(base)}
    ['convCond','convInstallments','convDate','convDiscount'].forEach(id=>{const el=$(id);if(el){el.addEventListener('input',refresh);el.addEventListener('change',refresh)}});refresh();
    const original=btn.onclick;
    btn.onclick=async function(ev){
      if(!$('convChecklistOk')?.checked)return alert('Confira os dados e marque a confirmação do checklist antes de gerar o pedido.');
      if(btn.dataset.processing==='1')return;
      btn.dataset.processing='1';btn.disabled=true;const old=btn.textContent;btn.textContent='PROCESSANDO...';
      try{await original?.call(btn,ev)}finally{if(document.body.contains(btn)){btn.dataset.processing='0';btn.disabled=false;btn.textContent=old}}
    }
  }
  convertQuote=function(n){
    const existing=(db.orders||[]).find(o=>Number(o.quoteNumber)===Number(n));
    if(existing)return alert(`Este orçamento já foi convertido no pedido ${String(existing.numero).padStart(6,'0')}.`);
    oldConvertQuote1263(n);
    const q=(db.quotes||[]).find(x=>Number(x.numero)===Number(n));if(q)setTimeout(()=>installChecklist1263(q),0)
  };

  function boot1263(){bindFilters1263();fillSellers1263();applyEnvironmentFixationUI();try{renderQuote()}catch(e){console.error('V12.6.3 renderQuote',e)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot1263,250));else setTimeout(boot1263,250);
})();

