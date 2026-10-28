/* Nova Imagem — compatibilidade final do trilho suíço ao salvar um ambiente.
 * Preserva o produto real do estoque e evita a divergência ID x nome do modelo.
 * Não altera preços, quantidades, banco ou estoque. */
(function(){
 'use strict';
 const el=id=>document.getElementById(id);
 const fold=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase().replace(/\s+/g,' ');
 const oldForm=envFromForm;
 envFromForm=function(){
   const e=oldForm.apply(this,arguments);
   if(e.fixation!=='TRILHO SUÍÇO'||e.excludeFixation)return e;
   const products=(typeof priceProducts!=='undefined'?priceProducts:[])||[];
   const select=el('eRailProduct');
   const selected=String(select?.value||'').trim();
   const color=fold(el('eFixColor')?.value||e.fixColor||'');
   const candidates=products.filter(p=>Number(p.active??1)===1&&fold(p.product_name).startsWith('TRILHO')&&!fold(p.product_name).includes('MOTORIZADO'));
   const byId=candidates.find(p=>String(p.id)===selected);
   const match=candidates.filter(p=>fold(p.product_name)===fold(selected));
   const resolved=byId||match.find(p=>fold(p.color)===color)||match[0]||null;
   // Se nenhuma escolha foi feita, não aprovar um trilho arbitrário.
   if(resolved){
     e.railProductId=resolved.id;
     e.fixProductId=resolved.id;
     e.railInternalCode=resolved.internal_code||'';
     e.railProductName=resolved.product_name||'';
     e.fixProductName=resolved.product_name||'';
     e.fixColor=resolved.color||e.fixColor||'';
   }
   return e;
 };
})();
