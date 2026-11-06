/* V14.4.9 – prévia gerencial no modal de conversão. Não grava, não consome estoque. */
(function(){'use strict';
const byId=id=>document.getElementById(id);
const fmt=n=>typeof money==='function'?money(n):Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const safe=x=>typeof esc==='function'?esc(String(x??'')):String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>Number(x)||0;
function manager(){try{return typeof isGestor==='function'&&isGestor()}catch(_){return false}}
function rate(n){const r=niRateFor(n===0?'cash':'card'+n);return r===null?0:r}
function count(){const c=byId('convCond')?.value;return c==='cash'?0:/^card(?:[1-9]|1[0-8])$/.test(c)?Number(c.slice(4)):c==='p18'?18:c==='custom'?Math.max(1,Math.min(18,num(byId('convInstallments')?.value)||1)):4}
function quotedTotal(q){const t=quoteTotals(q),c=byId('convCond')?.value||'cash',base=num(t.cash)*(1-Math.max(0,Math.min(100,num(byId('convDiscount')?.value)))/100);return Math.max(0,base)}
function openPreview(q){
 if(!manager())return alert('Apenas gestores podem acessar o resultado do pedido.');
 const condition=byId('convCond')?.value||'cash';if(condition!=='cash'&&niRateFor(condition)===null)return alert('Cadastre a taxa desta condição em Gestão → Taxas de Parcelamento.');
 const installments=count(),feeRate=rate(installments),revenue=quotedTotal(q),charge=feeRate<1?Math.round(revenue/(1-feeRate)*100)/100:revenue,fee=charge-revenue;
 let requirements=[];try{requirements=officialOrderRequirements(q)||[]}catch(err){console.error('Prévia de insumos',err)}
 const grouped=new Map();for(const x of requirements){const key=String(x.product_id||x.internal_code||x.product_name);if(!grouped.has(key))grouped.set(key,{...x,qty:0});grouped.get(key).qty+=num(x.qty)}
 const rows=[...grouped.values()].sort((a,b)=>String(a.product_name||'').localeCompare(String(b.product_name||''),'pt-BR'));
 const materials=rows.reduce((s,x)=>s+num(x.cost)*num(x.qty),0);
 let sewing=0,installation=0;for(const e of q.environments||[]){try{const c=calcEnvironment(e);if(c){sewing+=num(c.sewingCost)+num(c.finishPleat)+num(c.liningPleat)+num(c.customPleat);installation+=num(c.installCost)}}catch(err){console.error('Custo por ambiente',err)}}
 const blindCost=(q.blinds||[]).reduce((s,b)=>s+num(b.cash)/1.60*Math.max(1,num(b.qty)),0);
 const looseCost=(q.looseProducts||[]).reduce((s,x)=>s+num(x.cost)*num(x.qty),0);
 const seller=typeof resolveSellerUser==='function'?resolveSellerUser(q):'',commissionPct=typeof sellerCommission==='function'?num(sellerCommission(seller)):0;
 const commission=revenue*commissionPct/100;
 const allMaterials=materials+blindCost+looseCost;
 const result=revenue-allMaterials-sewing-installation-commission;
 const tableRows=rows.map(x=>`<tr><td>${safe(x.internal_code||'-')}</td><td>${safe(x.product_name||'-')}</td><td>${safe(x.color||'-')}</td><td>${num(x.qty).toFixed(String(x.unit||'').toUpperCase()==='M'?2:0)} ${safe(x.unit||'UN')}</td><td>${fmt(num(x.cost))}</td><td>${fmt(num(x.qty)*num(x.cost))}</td></tr>`).join('');
 const modalHtml=`<h2>Resultado previsto do pedido — somente gestor</h2><p class="muted">Orçamento ${safe(q.numero)} • ${safe(q.client||'-')} • ${installments?installments+'x no crédito':'PIX / dinheiro'}</p>
 <p class="notice">Prévia sem gerar pedido ou movimentar estoque. Custos estimados conforme preços cadastrados. A taxa de cartão usa a tabela configurada em Gestão → Taxas de Parcelamento e é repassada integralmente ao cliente.</p>
 <div class="table-wrap"><table class="table"><thead><tr><th>Código</th><th>Material agrupado (trilho, garra, suporte, tecidos etc.)</th><th>Cor</th><th>Quantidade</th><th>Custo unitário</th><th>Total</th></tr></thead><tbody>${tableRows||'<tr><td colspan="6">Nenhum insumo oficial encontrado no orçamento.</td></tr>'}</tbody></table></div>
 <div class="table-wrap" style="margin-top:14px"><table class="table"><tbody>
 <tr><th>PREÇO-BASE À VISTA (após desconto)</th><td><strong>${fmt(revenue)}</strong></td></tr><tr><th>TOTAL COBRADO DO CLIENTE</th><td><strong>${fmt(charge)}</strong></td></tr>
 <tr><th>Custo dos materiais oficiais</th><td>${fmt(materials)}</td></tr>
 ${blindCost?`<tr><th>Custo estimado de persianas</th><td>${fmt(blindCost)}</td></tr>`:''}
 ${looseCost?`<tr><th>Custo de produtos avulsos</th><td>${fmt(looseCost)}</td></tr>`:''}
 <tr><th>Custo de costura / confecção</th><td>${fmt(sewing)}</td></tr>
 <tr><th>Custo de instalação</th><td>${fmt(installation)}</td></tr>
 <tr><th>Comissão estimada (${commissionPct.toFixed(1)}%)</th><td>${fmt(commission)}</td></tr>
 <tr><th>TAXAS DA OPERADORA REPASSADAS AO CLIENTE (${(feeRate*100).toFixed(2)}%)</th><td>${fmt(fee)}</td></tr>
 <tr style="background:#fff0de;color:#753c08"><th>RESULTADO PREVISTO DO PEDIDO</th><td><strong>${fmt(result)} (${revenue?(100*result/revenue).toFixed(1):'0,0'}%)</strong></td></tr>
 </tbody></table></div><p class="muted">O resultado efetivo poderá variar conforme os custos reais, a operadora, descontos e ajustes posteriores. Prévia interna e confidencial.</p><button type="button" class="btn secondary" id="previewReturn149">Voltar à conversão</button>`;
 // Preserva intactos os campos, seleção e confirmação da conversão original.
 const modal=byId('modalBody');if(!modal)return;const holder=document.createElement('div');holder.id='managerPreview149';holder.innerHTML=modalHtml;for(const el of [...modal.children])el.style.display='none';modal.appendChild(holder);
 byId('previewReturn149').onclick=()=>{holder.remove();for(const el of [...modal.children])el.style.display=''};
}
function attach(q){
 if(!manager())return;
 const go=byId('convGo');
 if(!go||byId('previewResult149'))return;
 const btn=document.createElement('button');
 btn.id='previewResult149';
 btn.type='button';
 btn.className='btn secondary';
 btn.textContent='Ver resultado antes de gerar';
 btn.onclick=()=>openPreview(q);
 let row=byId('convActionRow149');
 if(!row){
  row=document.createElement('div');
  row.id='convActionRow149';
  row.style.cssText='display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px';
  if(go.parentNode){
   go.parentNode.insertBefore(row,go);
   row.appendChild(go);
  }
 }
 row.appendChild(btn);
}
function hook(){if(typeof convertQuote!=='function')return;const original=convertQuote;convertQuote=function(n){const result=original.apply(this,arguments);if(manager()){const q=(db.quotes||[]).find(x=>num(x.numero)===num(n));if(q)setTimeout(()=>attach(q),20)}return result}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
