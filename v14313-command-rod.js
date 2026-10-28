/* Nova Imagem V14.3.13 - varão com comando: seleção, montagem e custos. */
(function(){
 'use strict';
 const KIND='VARÃO WAVE COM COMANDO POR CORDA';
 const $id=id=>document.getElementById(id);
 const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
 const isCommand=s=>['VARAO WAVE COM COMANDO POR CORDA','VARAO COM COMANDO'].includes(fold(s));
 const isCommandProduct=p=>fold(p?.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE');
 const active=()=>typeof priceProducts!=='undefined'&&Array.isArray(priceProducts)?priceProducts.filter(p=>Number(p.active??1)===1):[];
 let chosen=false, restoring=false;
 function product(){
  const w=Number($id('eWidth')?.value||0)/100,color=fold($id('eFixColor')?.value);
  const list=active().filter(isCommandProduct).filter(p=>{const m=fold(p.product_name).match(/ATE\s*(\d+(?:[,.]\d+)?)\s*M/);return m&&Number(m[1].replace(',','.'))>=w-0.00001}).sort((a,b)=>{
   const get=x=>Number(fold(x.product_name).match(/ATE\s*(\d+(?:[,.]\d+)?)\s*M/)?.[1]?.replace(',','.')||99);
   return get(a)-get(b);
  });
  if(!list.length)return null;
  const tier=fold(list[0].product_name),options=list.filter(p=>fold(p.product_name)===tier);
  return options.find(p=>fold(p.color)===color)||options[0]||null;
 }
 function restore(){
  if(!chosen||restoring)return;
  const f=$id('eFixation');if(!f)return;
  restoring=true;
  try{
   if(![...f.options].some(o=>o.value===KIND))f.add(new Option('VARÃO COM COMANDO POR CORDA',KIND));
   f.value=KIND;
   const rw=$id('eRailProductWrap'),r=$id('eRailProduct'),p=product();
   if(rw)rw.classList.remove('hidden');
   if(r){
    if(p&&!([...r.options].some(o=>String(o.value)===String(p.id))))r.add(new Option(`${p.product_name} — ${p.color} — ${p.internal_code}`,String(p.id)));
    if(p)r.value=String(p.id);
    if(rw){const text=[...rw.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(text)text.textContent='MODELO DO VARÃO COM COMANDO';}
   }
   const mount=$id('eWaveMountWrap');if(mount)mount.classList.remove('hidden');
  }finally{restoring=false}
 }
 document.addEventListener('change',ev=>{
   if(ev.target?.id==='eFixation'){
    chosen=isCommand(ev.target.value);
    if(chosen){restore();[0,30,120].forEach(ms=>setTimeout(()=>{restore();if(ms===120)try{updatePreview()}catch(_){}},ms));}
   }
   if(chosen&&['eFixColor','eWidth','eWaveMount'].includes(ev.target?.id))setTimeout(()=>{restore();try{updatePreview()}catch(_){}},0);
 },true);
 document.addEventListener('click',ev=>{
  if(ev.target?.closest?.('[data-edit-env], [data-edit-environment]')){chosen=false;setTimeout(()=>{chosen=isCommand($id('eFixation')?.value);restore()},80)}
 },true);
 // O SKU é determinado pelo comprimento e pela cor, nunca pelo seletor genérico de trilho.
 const previousForm=envFromForm;
 envFromForm=function(){
  const e=previousForm();
  if(chosen||isCommand($id('eFixation')?.value)){
   const p=product();e.fixation=KIND;
   e.waveMount=$id('eWaveMount')?.value||'PAREDE';
   if(p){e.fixColor=p.color;e.fixProductId=p.id;e.fixProductName=p.product_name;e.railProductId=p.id;e.railProductName=p.product_name;e.railInternalCode=p.internal_code;}
   else {e.fixProductId=null;e.railProductId=null;}
  }
  return e;
 };
 const previousPreview=updatePreview;
 updatePreview=function(){const result=previousPreview.apply(this,arguments);if(chosen)restore();return result};
 // O preço de referência já calcula o kit do varão com comando para montagem na parede.
 // No teto, substitui suportes por garras de teto NI-0350, usando a regra por varão.
 const oldCalc=calcEnvironment;
 calcEnvironment=function(e){
  const c=oldCalc(e);
  if(!c||!isCommand(e?.fixation)||!['TETO','NO TETO'].includes(fold(e.waveMount))||e.excludeFixation)return c;
  const p=active().find(p=>fold(p.internal_code)==='NI-0350');
  const f=c.fixationCalc||{},rods=e.model==='COMPLETE'?2:1;
  const claws=Math.max(2,Math.ceil(Number(e.width||0)/60))*rods;
  if(!p){c.fixationCalc={...f,missingWaveClaw:true,detail:'ATENÇÃO: GARRA DE TETO NI-0350 NÃO DISPONÍVEL — conferir compatibilidade'};return c;}
  const oldUnit=Number(officialProductById(f.supportProductId)?.price_4x||0);
  const previous=Number(f.total||0),adjusted=Math.max(0,previous-Number(f.supports||0)*oldUnit)+claws*Number(p.price_4x||0);
  const diff=adjusted-previous,base4=Number(c.base4||0)+diff;
  c.fixationCalc={...f,total:adjusted,hardwareBase:adjusted,supports:0,supportProductId:null,clamps:claws,clawProductId:p.id,waveMount:'TETO',detail:`${f.railName||e.railProductName||'VARÃO COM COMANDO'} • ${claws} garras de teto (${Math.max(2,Math.ceil(Number(e.width||0)/60))} por varão) • CONFERIR COMPATIBILIDADE`};
  return {...c,base4,p18:Number(c.p18||0)+diff*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100),cash:Number(c.cash||0)+diff*(1-Number(db.priceConfig?.terms?.cashDiscountPct||0)/100)};
 };
 const oldReq=officialOrderRequirements;
 officialOrderRequirements=function(q){
  const rows=oldReq(q);
  for(const e of q?.environments||[]){
   if(!isCommand(e.fixation)||!['TETO','NO TETO'].includes(fold(e.waveMount))||e.excludeFixation)continue;
   const qty=Math.max(2,Math.ceil(Number(e.width||0)/60))*(e.model==='COMPLETE'?2:1);
   for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(r.environment===e.name&&fold(r.product_name).includes('SUPORTE')&&fold(r.source).includes('VARAO'))rows.splice(i,1)}
   const p=active().find(p=>fold(p.internal_code)==='NI-0350');
   if(p)rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment:e.name,environments:[e.name],source:'GARRA TETO VARÃO COM COMANDO - CONFERIR COMPATIBILIDADE',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)});
  }
  return rows;
 };
 document.addEventListener('DOMContentLoaded',()=>{
  const f=$id('eFixation');if(f){f.addEventListener('change',()=>{chosen=isCommand(f.value);if(chosen)restore()});}
  const mount=$id('eWaveMount');if(mount)mount.addEventListener('change',()=>{if(chosen)restore()});
 });
})();
