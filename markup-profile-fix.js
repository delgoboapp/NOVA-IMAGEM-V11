/* Nova Imagem V14.4.11 — markup de perfil: gestor/parceiro, prévia e comparação. */
(function(){
 'use strict';
 const valid=(n)=>Math.max(0,Math.min(60,Number(n)||0));
 // O acréscimo do perfil é um atributo individual, independente da função do usuário.
 partnerMarkupPercent=function(username){
   const key=norm(username||currentUsername());
   const profile=db.settings?.personalQuoteProfiles?.[key];
   const user=allUsers().find(u=>norm(u.username)===key);
   const val=profile?.marginPercent??user?.markupPercent??0;
   return valid(val);
 };
 const earlierQuoteMarkup=quotePartnerMarkup;
 quotePartnerMarkup=function(q){
   if(q?.partnerMarkupPercent!==undefined&&q?.partnerMarkupPercent!==null&&q?.partnerMarkupPercent!=='')return valid(q.partnerMarkupPercent);
   // Orçamentos já gravados, sem percentual explícito, não herdam alterações futuras.
   if(q?.numero!==undefined&&q?.numero!==null&&q?.numero!=='')return 0;
   return partnerMarkupPercent(q?.sellerUser||q?.ownerUser||currentUsername());
 };
 const earlierRender=renderQuote;
 renderQuote=function(){
   // Inicia cada orçamento novo com o percentual persistido do respectivo vendedor.
   if(!draft.numero && (draft.partnerMarkupPercent===undefined||draft.partnerMarkupPercent===null||draft.partnerMarkupPercent==='')){
     draft.partnerMarkupPercent=partnerMarkupPercent(draft.sellerUser||currentUsername());
   }
   earlierRender.apply(this,arguments);
   const marginControl=$('niQuoteMarginSelect');if(marginControl){const prior=marginControl.onchange;marginControl.onchange=function(){if(prior)prior.apply(this,arguments);updatePreview();};}
   const box=$('niMarkupFooter');
   const host=$('sumCash')?.closest('.card')||$('envTable')?.closest('.card');
   if(!host)return;
   const footer=box||document.createElement('div');footer.id='niMarkupFooter';
   const pct=quotePartnerMarkup(draft),standard=partnerMarkupPercent(draft.sellerUser||currentUsername());
   footer.style.cssText='display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap;margin:8px 0 0;';
   footer.innerHTML=pct>0?`<span style="font-size:12px;color:#8a6b13;background:#fff9e4;border:1px solid #f1dea3;border-radius:7px;padding:7px 10px">● Seu markup está ativado (${pct}%)</span><button type="button" class="btn secondary" id="niMarkupCompareBtn">Ver markup</button>`:`<button type="button" class="btn secondary" id="niMarkupCompareBtn">Ver markup</button>`;
   if(footer.parentElement!==host)host.appendChild(footer);
   $('niMarkupCompareBtn').onclick=()=>{
     const base=quoteTotals({...draft,partnerMarkupPercent:0});const marked=quoteTotals(draft);
     const rows=[['À vista','cash'],['4x','p4'],['18x','p18']];
     openModal(`<h2>Comparativo de markup</h2><p>Vendedor: ${esc(sellerName(draft.sellerUser||currentUsername()))} • Acréscimo aplicado: <strong>${pct}%</strong> (padrão do perfil: ${standard}%).</p><div class="table-wrap"><table class="table"><thead><tr><th>Condição</th><th>Preço Nova Imagem</th><th>Preço do usuário</th></tr></thead><tbody>${rows.map(([title,key])=>`<tr><td>${title}</td><td>${money(base[key])}</td><td><strong>${money(marked[key])}</strong></td></tr>`).join('')}</tbody></table></div><p class="muted">Os custos internos e a tabela oficial não são alterados. Os valores refletem os descontos configurados no orçamento.</p><button type="button" id="niMarkupClose" class="btn secondary">Fechar</button>`);
     $('niMarkupClose').onclick=closeModal;
   };
 };
 const earlierPreview=updatePreview;
 updatePreview=function(){
   const result=earlierPreview.apply(this,arguments);
   const container=$('calcPreview');if(!container)return result;
   const pct=quotePartnerMarkup(draft);if(pct<=0)return result;
   const factors=container.querySelectorAll('.price-strip .price-box');
   if(factors.length<3)return result;
   const env=envFromForm();
   if(quoteEditingEnvironmentId){const saved=(draft.environments||[]).find(x=>String(x.id)===String(quoteEditingEnvironmentId));if(saved){env.manualItems=clone(saved.manualItems||{});env.manualPrices=clone(saved.manualPrices||{});env.manualExtraItems=clone(saved.manualExtraItems||[]);}}
   if(!env.name||!env.width||!env.height)return result;
   const c=calcEnvironment(env);if(!c)return result;
   const mult=1+pct/100;
   [c.p18,c.base4,c.cash].forEach((v,i)=>{const strong=factors[i].querySelector('strong');if(strong)strong.textContent=money(v*mult)});
   return result;
 };
})();
