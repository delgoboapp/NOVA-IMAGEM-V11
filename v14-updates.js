/* NOVA IMAGEM V14.0 — medidas em L, deslizantes, etiquetas e ajustes por ambiente.
   Correções manuais preservadas no campo manualItems de cada ambiente. */
(function(){
'use strict';
const htmlEscape=v=>esc(String(v??''));
const details=e=>e?.angle?`CORTINA EM L — PARTE 1 (LADO A): ${Number(e.angleA||0)} × ${Number(e.angleAHeight||e.height||0)} cm — PARTE 2 (LADO B): ${Number(e.angleB||0)} × ${Number(e.angleBHeight||e.height||0)} cm`:'';
const yellow=e=>{const d=details(e);return d||e.notes?`<div style="background:#fff3a8;border:1px solid #e2bd38;padding:7px 9px;margin:5px 0;font-weight:700"><strong>OBSERVAÇÕES</strong><br>${d?htmlEscape(d)+'<br>':''}${e.notes?htmlEscape(e.notes).replace(/\n/g,'<br>'):''}</div>`:''};
const itemKey=r=>String(r.product_id);
const manual=e=>e.manualItems||{};
const baseRequirements=e=>officialOrderRequirements({environments:[{...e,manualItems:{},manualPrices:{}}]});
const rawOfficialRequirements=officialOrderRequirements;
officialOrderRequirements=function(q){
 const result=rawOfficialRequirements(q);
 for(const e of q?.environments||[]){for(let i=result.length-1;i>=0;i--){const r=result[i];if(String(r.environment||'')!==String(e.name||''))continue;const m=manual(e)[itemKey(r)];if(m===undefined)continue;if(m===null){result.splice(i,1);continue}r.qty=Math.max(0,Number(m));if(!r.qty)result.splice(i,1)}}
 return result;
};
// Custos das quantidades alteradas: diferença de preços dos produtos oficiais, sem mudar o catálogo.
const rawCalc=calcEnvironment;
calcEnvironment=function(e){const c=rawCalc(e);if(!c||!Object.keys(manual(e)).length)return c;
 let diff=0;
 for(const r of baseRequirements(e)){const change=manual(e)[itemKey(r)];if(change===undefined)continue;const qty=change===null?0:Math.max(0,Number(change));diff+=(qty-Number(r.qty||0))*Number(r.price_4x||0)}
 const sew=manual(e).__sewing,inst=manual(e).__installation;
 if(sew!==undefined){const before=Number(c.sewingCost||0);c.sewingMeters=sew===null?0:Math.max(0,Number(sew));c.sewingCost=c.sewingMeters*Number(db.priceConfig.sewingPerMeter||0);diff+=c.sewingCost-before}
 if(inst!==undefined){const before=Number(c.installCost||0);c.installCost=inst===null?0:Math.max(0,Number(inst))*before;diff+=c.installCost-before}
 c.laborTotal=Number(c.laborTotal||0)+(sew!==undefined?c.sewingCost-Number(rawCalc({...e,manualItems:{}}).sewingCost||0):0)+(inst!==undefined?c.installCost-Number(rawCalc({...e,manualItems:{}}).installCost||0):0);
 c.base4+=diff;c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);
 return c;
};
// V14.1: os preços são locais ao ambiente, nunca gravados no cadastro do estoque.
const v141CalcBeforePrices=calcEnvironment;
calcEnvironment=function(e){
 const c=v141CalcBeforePrices(e);if(!c)return c;
 const prices=e.manualPrices||{};if(!Object.keys(prices).length)return c;
 let delta=0;
 const req=baseRequirements(e);
 for(const r of req){const key=itemKey(r);if(!Object.prototype.hasOwnProperty.call(prices,key))continue;
  const override=e.manualItems?.[key];const qty=override===null?0:override===undefined?Number(r.qty||0):Number(override);
  const price=Number(prices[key]);if(Number.isFinite(price)&&price>=0)delta+=qty*(price-Number(r.price_4x||0));
 }
 const sew=Number(prices.__sewing),install=Number(prices.__installation);
 if(Object.prototype.hasOwnProperty.call(prices,'__sewing')&&Number.isFinite(sew)&&sew>=0){const qty=e.manualItems?.__sewing===null?0:e.manualItems?.__sewing===undefined?Number(c.sewingMeters||0):Number(e.manualItems.__sewing);delta+=qty*sew-Number(c.sewingCost||0)}
 if(Object.prototype.hasOwnProperty.call(prices,'__installation')&&Number.isFinite(install)&&install>=0){const qty=e.manualItems?.__installation===null?0:e.manualItems?.__installation===undefined?(c.installCost?1:0):Number(e.manualItems.__installation);delta+=qty*install-Number(c.installCost||0)}
 c.base4=Math.max(0,c.base4+delta);
 c.cash=c.base4*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);
 c.p18=c.base4*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);
 return c;
};
const v141RequirementsBeforePrices=officialOrderRequirements;
officialOrderRequirements=function(q){const rows=v141RequirementsBeforePrices(q);for(const e of q?.environments||[]){for(const r of rows){if(String(r.environment||'')!==String(e.name||''))continue;const value=e.manualPrices?.[itemKey(r)];if(value===undefined)continue;const price=Number(value);if(!Number.isFinite(price)||price<0)continue;r.price_4x=price;r.price_cash=price*(1-Number(db.priceConfig.terms.cashDiscountPct||0)/100);r.price_18x=price*(1+Number(db.priceConfig.terms.p18AddPct||0)/100)}}return rows};
const originalRender=renderQuote;
renderQuote=function(){originalRender();for(const e of draft.environments||[]){const row=document.querySelector(`[data-edit-env="${CSS.escape(String(e.id))}"]`)?.closest('tr');if(row&&e.angle){row.cells[0].insertAdjacentHTML('beforeend',yellow(e));row.cells[1].insertAdjacentHTML('beforeend',`<br><b>${htmlEscape(details(e))}</b>`)} }};
const originalPrint=printQuote;
printQuote=function(q,type){
 // Inject the detailed note as a temporary display-only addition, without modifying stored data.
 const copy=clone(q);copy.environments=(q.environments||[]).map(e=>e.angle?{...e,notes:[details(e),e.notes||''].filter(Boolean).join('\n')}:e);
 return originalPrint(copy,type);
};
const originalOS=printProductionOrder;
printProductionOrder=function(o){
 const copy={...o,environments:(o.environments||[]).map(e=>e.angle?{...e,notes:[details(e),e.notes||''].filter(Boolean).join('\n')}:e)};
 return originalOS(copy);
};
function labelsV14(orderNumber){
 const o=(db.orders||[]).find(x=>Number(x.numero)===Number(orderNumber));if(!o)return alert('Pedido não encontrado.');
 const labels=[];
 for(const e of o.environments||[]){
 const parts=e.angle&&Number(e.angleA)>0&&Number(e.angleB)>0?[{side:'LADO A',w:Number(e.angleA),h:Number(e.angleAHeight||e.height)},{side:'LADO B',w:Number(e.angleB),h:Number(e.angleBHeight||e.height)}]:Array.from({length:Math.max(1,Number(e.leaves||1))},(_,i)=>({side:`FOLHA ${i+1}`,w:Number(e.width)/Math.max(1,Number(e.leaves||1)),h:Number(e.height)}));
 const layers=[['ACABAMENTO','finish','finishColor','finishPleat'],['FORRO','lining','liningColor','liningPleat']];
 for(const [kind,product,color,pleat] of layers){if((kind==='ACABAMENTO'&&e.model==='LINING')||(kind==='FORRO'&&e.model==='FINISH'))continue;
 parts.forEach((p,i)=>labels.push({env:e.name,total:`${e.width} × ${e.height} cm`,side:p.side,size:`${p.w} × ${p.h} cm`,fabric:[e[product],e[color]].filter(Boolean).join(' — '),pleat:e[pleat]||'-',id:`${kind} ${i+1}/${parts.length}`,angle:e.angle}));}}
 if(!labels.length)return alert('Pedido sem folhas para etiquetar.');
 const w=window.open('about:blank','_blank');if(!w)return alert('Libere pop-ups para gerar etiquetas.');
 const rows=labels.map(l=>`<div class="label"><div class="head">NOVA IMAGEM</div><b>${htmlEscape(o.client||'-')}</b><div>PEDIDO: ${String(o.numero).padStart(6,'0')}</div><div>AMBIENTE: ${htmlEscape(l.env||'-')}</div>${l.angle?'<b>CORTINA EM L</b><br>':''}<div>TOTAL: ${htmlEscape(l.total)}</div><div><b>${htmlEscape(l.side)}: ${htmlEscape(l.size)}</b></div><div>☐ EXATO &nbsp; ☐ DAR DESCONTO</div><div>TECIDO: ${htmlEscape(l.fabric)}</div><div>PREGA: ${htmlEscape(l.pleat)}</div><div class="foot">${htmlEscape(l.id)}</div></div>`).join('');
 w.document.write(`<html><head><meta charset="utf-8"><title>Etiquetas V14 • Pedido ${o.numero}</title><style>@page{size:A4;margin:8mm}body{font-family:Arial,sans-serif}.sheet{display:grid;grid-template-columns:repeat(4,40mm);gap:3mm}.label{height:55mm;width:40mm;border:1px solid #111;padding:2mm;font-size:7pt;box-sizing:border-box;break-inside:avoid;overflow:hidden;line-height:1.32}.label>div{margin-bottom:1mm}.head{text-align:center;font-weight:bold;border-bottom:1px solid #000}.foot{text-align:center;font-weight:900;border-top:1px solid #000;padding-top:2mm}@media print{.tools{display:none}}</style></head><body><div class="tools"><button onclick="print()">IMPRIMIR</button><button onclick="close()">RETORNAR</button></div><div class="sheet">${rows}</div></body></html>`);w.document.close();w.focus();
}
generateOrderLabelsV127=labelsV14;
window.generateLabelsV1263=labelsV14;
function editor(){
 const selected=(draft.environments||[]).find(e=>String(e.id)===String(quoteEditingEnvironmentId));
 const e=selected||envFromForm();if(!e.name||!e.width||!e.height)return alert('Preencha o ambiente e as medidas antes de editar os itens.');
 const rows=baseRequirements(e),computed=calcEnvironment({...e,manualItems:{}});
 const labor=[{product_id:'__sewing',product_name:'MÃO DE OBRA — COSTURA',qty:computed.sewingMeters,unit:'M'}, {product_id:'__installation',product_name:'MÃO DE OBRA — INSTALAÇÃO',qty:computed.installCost?1:0,unit:'SERVIÇO'}];
 const overrides={...manual(e)};
 const prices={...(e.manualPrices||{})};
 const all=[...rows,...labor];
 const getQty=r=>{const v=overrides[itemKey(r)];return v===null?0:v===undefined?Number(r.qty||0):Number(v)};
 const baseUnit=r=>{if(r.product_id==='__sewing')return Number(db.priceConfig.sewingPerMeter||0);if(r.product_id==='__installation')return Number(computed.installCost||0);return Number(r.price_4x||0)};
 const unit=r=>prices[itemKey(r)]===undefined?baseUnit(r):Number(prices[itemKey(r)]);
 const show=()=>{openModal(`<h2>EDITAR ITENS — ${htmlEscape(e.name)}</h2><p>Valores de venda em 4x, exclusivos deste ambiente; descontos e acréscimos são calculados automaticamente.</p><div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Quantidade</th><th>Valor unitário (4x)</th><th>Valor total (4x)</th><th>Ações</th></tr></thead><tbody>${all.map((r,i)=>{const k=itemKey(r),v=overrides[k],qty=getQty(r),price=unit(r);return `<tr><td>${htmlEscape(r.product_name)}<br><small>${htmlEscape(r.color||'')} ${htmlEscape(r.internal_code||'')}</small></td><td>${Number(qty).toFixed(r.unit==='M'?2:0)} ${htmlEscape(r.unit||'UN')}${v!==undefined?' <b>(MANUAL)</b>':''}</td><td>${money(price)}${prices[k]!==undefined?' <b>(MANUAL)</b>':''}</td><td>${money(price*qty)}</td><td style="min-width:350px"><button class="btn secondary" data-v14-change="${i}">ALTERAR QUANTIDADE</button> <button class="btn secondary" data-v141-price="${i}">ALTERAR VALOR</button> <button class="btn danger" data-v14-remove="${i}">EXCLUIR ITEM</button></td></tr>`}).join('')}</tbody></table></div><div class="actions" style="margin-top:12px"><button class="btn primary" id="v14-save">SALVAR ALTERAÇÕES</button><button class="btn secondary" id="v14-reset">RECALCULAR TODOS</button><button class="btn ghost" id="v14-cancel">CANCELAR</button></div>`);
 document.querySelectorAll('[data-v141-price]').forEach(b=>b.onclick=()=>{const r=all[Number(b.dataset.v141Price)],k=itemKey(r);const x=prompt(`Novo valor UNITÁRIO em 4x para ${r.product_name} (R$):`,String(unit(r).toFixed(2)).replace('.',','));if(x===null)return;const n=Number(x.trim().replace(',','.'));if(!Number.isFinite(n)||n<0||!x.trim())return alert('Informe um preço válido, maior ou igual a zero.');prices[k]=n;show()});
 document.querySelectorAll('[data-v14-change]').forEach(b=>b.onclick=()=>{const r=all[Number(b.dataset.v14Change)],k=itemKey(r),cur=overrides[k]===undefined?r.qty:overrides[k]??0;const x=prompt(`Nova quantidade para ${r.product_name}:`,String(cur));if(x===null)return;const n=Number(x.replace(',','.'));if(!Number.isFinite(n)||n<0)return alert('Informe uma quantidade válida, maior ou igual a zero.');overrides[k]=n;show()});
 document.querySelectorAll('[data-v14-remove]').forEach(b=>b.onclick=()=>{const r=all[Number(b.dataset.v14Remove)];if(confirm(`Excluir ${r.product_name} deste ambiente?`)){overrides[itemKey(r)]=null;show()}});
 $('v14-save').onclick=()=>{const index=(draft.environments||[]).findIndex(x=>String(x.id)===String(e.id));if(index<0){alert('Primeiro adicione o ambiente ao orçamento. Depois edite os itens dele.');return}draft.environments[index].manualItems={...overrides};draft.environments[index].manualPrices={...prices};closeModal();renderQuote();updatePreview()};
 $('v14-reset').onclick=()=>{if(!confirm('Restaurar todas as quantidades E valores originais deste ambiente?'))return;for(const k of Object.keys(overrides))delete overrides[k];for(const k of Object.keys(prices))delete prices[k];show()};$('v14-cancel').onclick=closeModal;
 };show();
}
document.addEventListener('DOMContentLoaded',()=>{$('v14EditItemsBtn')?.addEventListener('click',editor);
 // Evita dezenas de prévias síncronas em cada tecla. O valor digitado aparece imediatamente.
 for(const id of ['eWidth','eHeight']){const field=$(id);if(!field)continue;let timer;
 field.addEventListener('input',event=>{if(!event.isTrusted)return;event.stopImmediatePropagation();clearTimeout(timer);timer=setTimeout(()=>{field.dispatchEvent(new Event('change',{bubbles:true}));updatePreview()},240)},true);
 }
});
})();
