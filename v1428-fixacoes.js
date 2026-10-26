/* NOVA IMAGEM V14.2.8 - Correções de fixação e Trilho Square.
 * Não migra, altera ou exclui dados do D1/R2.
 */
(function(){
 'use strict';
 const $id=id=>document.getElementById(id);
 const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
 const ROD='VARÃO WAVE COM COMANDO POR CORDA', SQUARE='TRILHO SQUARE COM COMANDO';
 let chosen=null, syncing=false;
 const isRod=s=>['VARAO COM COMANDO','VARAO WAVE COM COMANDO POR CORDA'].includes(fold(s));
 const isSquare=s=>fold(s)===fold(SQUARE);
 function ensureRod(){
   if(!isRod(chosen)||syncing)return;
   const el=$id('eFixation');if(!el)return;
   syncing=true;
   try{
     if(![...el.options].some(o=>o.value===ROD))el.add(new Option(ROD,ROD));
     el.value=ROD;
     const rw=$id('eRailProductWrap'),r=$id('eRailProduct');
     if(rw)rw.classList.remove('hidden');
     if(r){
       const label=rw?.querySelector('label');if(label)label.textContent='MODELO DO VARÃO COM COMANDO';
       const w=Number($id('eWidth')?.value||0)/100, color=fold($id('eFixColor')?.value);
       const products=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&fold(p.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE'));
       const tiers=products.map(p=>({p,t:Number(fold(p.product_name).match(/ATE\s*(\d+(?:[.,]\d+)?)\s*M/)?.[1]?.replace(',','.')||Infinity)}));
       const tier=Math.min(...tiers.filter(x=>x.t>=w).map(x=>x.t));
       const candidates=tiers.filter(x=>x.t===tier).map(x=>x.p);
       const previous=r.value;
       r.innerHTML='<option value="">SELECIONE O VARÃO COM COMANDO / COR</option>';
       candidates.forEach(p=>r.add(new Option(`${p.product_name} • ${p.color} • ${p.internal_code||''}`,String(p.id))));
       const byColor=candidates.find(p=>fold(p.color)===color);
       const value=candidates.some(p=>String(p.id)===previous)?previous:String(byColor?.id||candidates[0]?.id||'');
       r.value=value;
       if(!candidates.length)r.title='Não há varão com comando compatível no estoque oficial';
       else r.title='';
     }
   }finally{syncing=false}
 }
 document.addEventListener('change',ev=>{
   if(ev.target?.id==='eFixation'){
     const v=ev.target.value;
     chosen=isRod(v)?ROD:null;
     if(chosen){ev.stopImmediatePropagation();ensureRod();try{updatePreview()}catch(_){} }
   }else if(chosen&&['eWidth','eFixColor','eFinish','eLining','eFinishPleat','eLiningPleat','eModel'].includes(ev.target?.id)){
     setTimeout(()=>{ensureRod();try{updatePreview()}catch(_){}},0);
   }
 },true);
 document.addEventListener('input',ev=>{if(chosen&&ev.target?.id==='eWidth')setTimeout(ensureRod,0)},true);
 // Mantém o identificador oficial do produto no orçamento e na validação de salvar.
 const oldEnv=envFromForm;
 envFromForm=function(){
   if(chosen)ensureRod();
   const e=oldEnv();
   if(chosen){
     const p=officialProductById($id('eRailProduct')?.value);
     e.fixation=ROD;e.railProductId=p?.id||null;e.fixProductId=p?.id||null;
     e.railProductName=p?.product_name||'';e.fixProductName=p?.product_name||'';
     e.fixColor=p?.color||$id('eFixColor')?.value||'';e.railInternalCode=p?.internal_code||'';
   }
   return e;
 };
 // Retorna ao modo normal após abrir novo orçamento ou editar outra fixação.
 const oldSet=typeof setupSelectors==='function'?setupSelectors:null;
 if(oldSet)setupSelectors=function(){chosen=null;return oldSet.apply(this,arguments)};
 const oldCalc=calcEnvironment;
 calcEnvironment=function(e){
   const c=oldCalc(e);if(!c||!isSquare(e?.fixation)||e.excludeFixation)return c;
   // Largura PRONTA, nunca metragem de pano nem franzimento.
   const ws=e.angle&&Number(e.angleA)>0&&Number(e.angleB)>0?[Number(e.angleA),Number(e.angleB)]:[Number(e.width||0)];
   const finish=e.model!=='LINING',lining=e.model!=='FINISH';
   const fq=finish?ws.reduce((n,w)=>n+Math.ceil(w/5),0):0;
   const lq=lining?ws.reduce((n,w)=>n+Math.ceil(w/7),0):0;
   const oldSliders=Number(c.sliderCost||0);
   const newSliders=fq*Number(db.priceConfig?.sliders?.finish||0)+lq*Number(db.priceConfig?.sliders?.lining||0);
   const fix={...(c.fixationCalc||{})};
   const count=(finish?1:0)+(lining?1:0);
   const oldUnits=Number(fix.units||1);
   const p=officialProductById(fix.railProductId||e.railProductId);
   const extra=Math.max(0,count-oldUnits)*Number(p?.price_4x||0);
   const previousFix=Number(fix.total||0);
   fix.units=count;fix.total=previousFix+extra;fix.hardwareBase=Number(fix.hardwareBase||previousFix)+extra;
   fix.detail=`${p?.product_name||fix.railName||'TRILHO SQUARE'} • ${e.fixColor||p?.color||''} • ${count} trilho(s) • ${(Number(e.width||0)/100).toFixed(2)}m cada`;
   const delta=(newSliders-oldSliders)+extra;
   c.finishSliders=fq;c.liningSliders=lq;c.sliderCost=newSliders;c.sliderQtyPerLayer=fq;
   c.fixationCalc=fix;c.base4=Number(c.base4||0)+delta;
   const terms=db.priceConfig?.terms||{};
   c.cash=c.base4*(1-Number(terms.cashDiscountPct||0)/100);
   c.p18=c.base4*(1+Number(terms.p18AddPct||0)/100);
   return c;
 };
 // Lista de materiais e baixa de estoque: dois trilhos para cortina completa.
 const oldReq=officialOrderRequirements;
 officialOrderRequirements=function(q){
   const rows=oldReq(q)||[];
   for(const e of q?.environments||[]){
     if(!isSquare(e.fixation)||e.excludeFixation)continue;
     const needed=(e.model==='COMPLETE'?2:1);
     const c=calcEnvironment(e),p=officialProductById(c?.fixationCalc?.railProductId||e.railProductId);
     if(!p)continue;
     const same=rows.filter(r=>String(r.environment||'')===String(e.name||'')&&Number(r.product_id)===Number(p.id));
     const first=same[0];
     if(first){first.qty=needed;for(let i=rows.length-1;i>=0;i--)if(rows[i]!==first&&same.includes(rows[i]))rows.splice(i,1)}
     else rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty:needed,environment:e.name,environments:[e.name],source:'TRILHO SQUARE - ACABAMENTO E FORRO',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)});
   }
   return rows;
 };
})();
