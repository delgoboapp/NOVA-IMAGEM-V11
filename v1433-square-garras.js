/* V14.3.3 — correção efetiva das garras Trilho Square: por trilho e por ambiente. */
(function(){'use strict';
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
 const square=e=>normalize(e?.fixation)==='TRILHO SQUARE COM COMANDO';
 const product=()=>{const p=(priceProducts||[]).filter(p=>Number(p.active??1)===1&&normalize(p.product_name).includes('GARRA')&&normalize(p.product_name).includes('TRILHO')&&normalize(p.product_name).includes('SIMPLES'));
   return p.find(x=>normalize(x.color)==='BRANCO')||p[0]||null};
 const quantity=e=>{const widths=e.angle&&Number(e.angleA)>0&&Number(e.angleB)>0?[Number(e.angleA),Number(e.angleB)]:[Number(e.width||0)];const layers=e.model==='COMPLETE'?2:1;return widths.reduce((sum,w)=>sum+Math.max(2,Math.ceil(w/60)),0)*layers};
 const previousCalc=calcEnvironment;
 calcEnvironment=function(e){const c=previousCalc(e);if(!c||!square(e)||e.excludeFixation)return c;const p=product(),f=c.fixationCalc;if(!p||!f){if(f)f.detail=(f.detail||'')+' • GARRA SIMPLES NÃO CADASTRADA';return c}
   const oldProduct=officialRailClaw(officialProductById(f.railProductId||e.railProductId));const oldQty=Number(f.clamps||0);const newQty=quantity(e);
   const delta=newQty*Number(p.price_4x||0)-oldQty*Number(oldProduct?.price_4x||0);
   f.clamps=newQty;f.clawProductId=p.id;f.clawName=p.product_name;f.total=Number(f.total||0)+delta;f.hardwareBase=Number(f.hardwareBase||0)+delta;
   f.detail=(f.detail||'').replace(/\d+ garras(?: simples)?/gi,newQty+' garras simples')+' • '+newQty+' GARRAS PARA TRILHO SUÍÇO SIMPLES';
   c.base4=Number(c.base4||0)+delta;const terms=db.priceConfig?.terms||{};c.cash=c.base4*(1-Number(terms.cashDiscountPct||0)/100);c.p18=c.base4*(1+Number(terms.p18AddPct||0)/100);return c;
 };
 const previousRequirements=officialOrderRequirements;
 officialOrderRequirements=function(q){const rows=previousRequirements(q)||[];for(const e of q?.environments||[]){if(!square(e)||e.excludeFixation)continue;const p=product();if(!p)continue;
    // A garra pertence apenas a este ambiente; não alterar outros trilhos do orçamento.
    for(let i=rows.length-1;i>=0;i--){const r=rows[i],name=normalize(r.product_name);if(String(r.environment||'')===String(e.name||'')&&name.includes('GARRA')&&name.includes('TRILHO'))rows.splice(i,1)}
    rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty:quantity(e),environment:e.name,environments:[e.name],source:'TRILHO SQUARE - GARRAS SIMPLES POR TRILHO V14.3.3',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)});
   }return rows};
})();