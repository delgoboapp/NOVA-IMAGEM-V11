(()=>{'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BR=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const isoToday=()=>new Date().toLocaleDateString('en-CA');
const COLORS=['#0a6c69','#2e8b87','#4aa39f','#7cbdb9','#a8d1cf','#0d4f4d','#2f6f6c','#4b8a87'];
async function api(path,opts={}){
  const res=await fetch('/api/'+path,{...opts,headers:{Authorization:'Bearer '+token,...(opts.headers||{})}});
  const ct=res.headers.get('content-type')||'';
  if(!ct.includes('application/json'))throw Error('Resposta inesperada do servidor');
  const data=await res.json();
  if(!res.ok)throw Error(data.error||('Erro HTTP '+res.status));
  return data;
}
function monthRange(month){
  const m=(month||isoToday().slice(0,7));
  const y=Number(m.slice(0,4)),mo=Number(m.slice(5,7));
  const last=new Date(y,mo,0).getDate();
  return [m+'-01',m+'-'+String(last).padStart(2,'0')];
}
function canManage(){try{return typeof isGestor==='function'&&isGestor()}catch(_){return false}}
function safeOrderByNumber(n){return (db?.orders||[]).find(o=>Number(o.numero)===Number(n));}
function injectCashFlowButton(){
  const actions=document.querySelector('#view-accounts .topbar .actions');
  if(!actions||$('ni145CashFlowBtn'))return;
  const btn=document.createElement('button');
  btn.id='ni145CashFlowBtn';
  btn.className='btn secondary';
  btn.textContent='Fluxo de Caixa';
  btn.onclick=()=>window.ni145CashFlow();
  actions.insertBefore(btn,actions.firstChild);
}
function pieGradient(items,total){
  if(total<=0||!items.length)return 'conic-gradient(#d9e5e4 0 100%)';
  let acc=0;
  const parts=[];
  items.forEach((item,idx)=>{
    const pct=(Number(item.balance||0)/total)*100;
    const start=acc;
    acc+=pct;
    const end=idx===items.length-1?100:acc;
    parts.push(`${item.color} ${start.toFixed(4)}% ${end.toFixed(4)}%`);
  });
  return 'conic-gradient('+parts.join(', ')+')';
}
async function renderResourceWidgets(){
  const host=$('ni144Accounts');
  if(!host)return;
  const old=$('ni145ResourcesWrap');
  if(old)old.remove();
  let data;
  try{data=await api('finance?action=list')}catch(_){return;}
  const accounts=(data.accounts||[]).filter(a=>a.kind==='COMPANY');
  if(!accounts.length)return;
  const enriched=accounts.map((a,i)=>({...a,color:COLORS[i%COLORS.length]}));
  const positive=enriched.filter(a=>Number(a.balance||0)>0.000001);
  const total=enriched.reduce((sum,a)=>sum+Number(a.balance||0),0);
  const legend=enriched.map(a=>{
    const pct=total>0?(Number(a.balance||0)/total*100):0;
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #edf4f3"><div style="display:flex;align-items:center;gap:8px"><span style="width:12px;height:12px;border-radius:50%;background:${a.color};display:inline-block"></span><span>${esc(a.id)}</span></div><strong>${pct.toFixed(1)}%</strong></div>`;
  }).join('');
  const html=`<div id="ni145ResourcesWrap"><div class="ni144-cards" style="margin-bottom:15px;align-items:stretch"><div class="card" style="min-width:260px"><div class="card-title">RECURSOS</div><h2>${BR(total)}</h2><p class="muted" style="margin:8px 0 0">Soma dos saldos atuais das contas da loja.</p></div><div class="card" style="flex:1;min-width:320px"><div class="card-title">RECURSOS POR CONTA</div><div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center"><div style="width:190px;height:190px;border-radius:50%;background:${pieGradient(positive,total)};position:relative;flex:0 0 auto;margin:10px auto 0"><div style="position:absolute;inset:22%;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;font-weight:700;color:#0a6c69">${BR(total)}</div></div><div style="flex:1;min-width:240px">${legend}</div></div></div></div></div>`;
  host.insertAdjacentHTML('afterbegin',html);
}
function flowReportMarkup(month){
  const r=monthlyCloseData(month);
  const rate=Number(localStorage.getItem('ni144TaxRate')||9);
  const taxes=r.sales*rate/100;
  const netRevenue=r.sales-taxes;
  const dreResult=netRevenue-r.directCosts;
  const receiptRows=(r.payments||[]).slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).map(p=>`<tr><td>${fmtDate(p.date||p.createdAt)}</td><td>${String(p.order).padStart(6,'0')}</td><td>${esc(p.client||'-')}</td><td>${esc(paymentMethodLabel(p.method)||p.method||'-')}</td><td>${BR(Number(p.value||p.amount||0))}</td></tr>`).join('');
  const payableRows=(r.paidPayables||[]).slice().sort((a,b)=>String(b.paidDate||b.paymentDate||b.updatedAt||'').localeCompare(String(a.paidDate||a.paymentDate||a.updatedAt||''))).map(x=>`<tr><td>${fmtDate(x.paidDate||x.paymentDate||x.datePaid||x.updatedAt)}</td><td>${esc(x.title||x.definition||x.description||x.name||'-')}</td><td>${BR(Number(x.paidValue??x.value??x.amount??0))}</td></tr>`).join('');
  const html=`<div class="kpis" style="margin-bottom:14px"><div class="kpi"><span>Recebimentos dos pedidos</span><strong>${BR(r.received)}</strong></div><div class="kpi"><span>Contas pagas</span><strong>${BR(r.expenses)}</strong></div><div class="kpi"><span>Fluxo de caixa</span><strong>${BR(r.cashResult)}</strong></div><div class="kpi"><span>Resultado comercial (DRE)</span><strong>${BR(dreResult)}</strong></div></div><div class="card"><div class="card-title">Resumo do Fluxo de Caixa</div><table class="summary-table"><tr><th>Recebimentos efetivos dos pedidos</th><td>${BR(r.received)}</td><th>Contas efetivamente pagas</th><td>${BR(r.expenses)}</td></tr><tr><th>FLUXO DE CAIXA DO MÊS</th><td colspan="3"><strong>${BR(r.cashResult)}</strong></td></tr></table></div><div class="card" style="margin-top:14px"><div class="card-title">DRE Gerencial do Mês</div><table class="summary-table"><tr><th>Receita bruta (pedidos gerados no mês)</th><td>${BR(r.sales)}</td><th>Tributos estimados (${rate.toFixed(2)}%)</th><td>${BR(taxes)}</td></tr><tr><th>Receita líquida estimada</th><td>${BR(netRevenue)}</td><th>Custos diretos dos pedidos</th><td>${BR(r.directCosts)}</td></tr><tr><th>RESULTADO COMERCIAL (DRE)</th><td colspan="3"><strong>${BR(dreResult)}</strong></td></tr></table><p class="muted" style="margin-top:10px">O DRE considera os pedidos gerados no mês. O fluxo de caixa considera somente o que efetivamente entrou e saiu no período.</p></div><div class="card" style="margin-top:14px"><div class="card-title">Recebimentos dos pedidos</div><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Pedido</th><th>Cliente</th><th>Forma</th><th>Valor</th></tr></thead><tbody>${receiptRows||'<tr><td colspan="5">Nenhum recebimento no período.</td></tr>'}</tbody></table></div></div><div class="card" style="margin-top:14px"><div class="card-title">Contas pagas</div><div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>${payableRows||'<tr><td colspan="3">Nenhuma conta paga no período.</td></tr>'}</tbody></table></div></div>`;
  return {r,html,rate,taxes,netRevenue,dreResult};
}
window.ni145CashFlow=function(initialMonth){
  const defaultMonth=initialMonth||$('monthlyCloseMonth')?.value||isoToday().slice(0,7);
  openModal(`<h2>Fluxo de Caixa</h2><div class="grid three"><label class="field">Competência<input id="ni145FlowMonth" type="month" value="${esc(defaultMonth)}"></label><div class="field"><span>&nbsp;</span><button id="ni145FlowView" class="btn primary">VISUALIZAR</button></div><div class="field"><span>&nbsp;</span><button id="ni145FlowPdf" class="btn secondary">EXPORTAR PDF</button></div></div><div id="ni145FlowBody" style="margin-top:14px"></div>`);
  const show=(pdf=false)=>{
    const month=$('ni145FlowMonth').value||defaultMonth;
    const data=flowReportMarkup(month);
    if(pdf){
      const [from,to]=monthRange(month);
      printWindow(`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS & PERSIANAS</strong><br><strong>FLUXO DE CAIXA — ${esc(month)}</strong><br>Período: ${fmtDate(from)} a ${fmtDate(to)}<br>Gerado em: ${esc(new Date().toLocaleString('pt-BR'))}</div></div>${data.html.replaceAll('class="table"','class="summary-table"').replaceAll('class="table-wrap"','')}`);
    }else $('ni145FlowBody').innerHTML=data.html;
  };
  $('ni145FlowView').onclick=()=>show(false);
  $('ni145FlowPdf').onclick=()=>show(true);
  show(false);
};
function injectEditOrderButton(orderNo){
  if(!canManage())return;
  const order=safeOrderByNumber(orderNo);
  if(!order||order.simplifiedImport)return;
  const actions=document.querySelector('#modalBody .actions');
  if(!actions||$('ni145EditOrderValueBtn'))return;
  const btn=document.createElement('button');
  btn.id='ni145EditOrderValueBtn';
  btn.className='btn ghost';
  btn.textContent='EDITAR VALOR DO PEDIDO';
  btn.onclick=()=>window.ni145EditOrderValue(orderNo);
  const addPay=$('addPay');
  if(addPay)actions.insertBefore(btn,addPay); else actions.appendChild(btn);
}
window.ni145EditOrderValue=function(orderNo){
  const o=safeOrderByNumber(orderNo);
  if(!o)return alert('Pedido não localizado.');
  if(o.simplifiedImport)return alert('Esta função não está disponível para venda histórica.');
  const currentValue=Number(o.agreedValue||0);
  const paid=orderPaid(o);
  openModal(`<h2>Editar valor do pedido ${String(o.numero).padStart(6,'0')}</h2><p class="muted">O novo valor será aplicado proporcionalmente aos itens monetários do pedido para manter a coerência do resultado gerencial.</p><div class="grid two"><label class="field">Valor atual<input value="${currentValue.toFixed(2)}" disabled></label><label class="field">Total já recebido<input value="${paid.toFixed(2)}" disabled></label><label class="field">Novo valor do pedido<input id="ni145NewOrderValue" type="number" min="0.01" step="0.01" value="${currentValue.toFixed(2)}"></label><label class="field">Justificativa<input id="ni145OrderReason" placeholder="Ex.: negociação final com o cliente"></label></div><button id="ni145SaveOrderValue" class="btn primary">SALVAR</button>`);
  $('ni145SaveOrderValue').onclick=()=>{
    const nextValue=Number($('ni145NewOrderValue').value||0);
    const reason=String($('ni145OrderReason').value||'').trim();
    if(!Number.isFinite(nextValue)||nextValue<=0)return alert('Informe um novo valor válido.');
    if(nextValue<paid-0.005)return alert('O novo valor não pode ficar abaixo do total já recebido.');
    if(Math.abs(nextValue-currentValue)<=0.004)return closeModal();
    if(reason.length<5)return alert('Informe uma justificativa com pelo menos 5 caracteres.');
    const factor=currentValue>0?nextValue/currentValue:1;
    if(o.costSnapshot?.environments?.length){
      o.costSnapshot.environments=o.costSnapshot.environments.map(e=>({...e,cashSale:Number(Number(e.cashSale||0)*factor).toFixed?Number((Number(e.cashSale||0)*factor).toFixed(2)):Number(e.cashSale||0)}));
    }
    if(Array.isArray(o.blinds))o.blinds.forEach(b=>['cash','p4','p18'].forEach(k=>{if(Number.isFinite(Number(b[k])))b[k]=Number((Number(b[k])*factor).toFixed(2));}));
    if(Array.isArray(o.looseProducts))o.looseProducts.forEach(a=>['cash','p4','p18','total','standardCash'].forEach(k=>{if(Number.isFinite(Number(a[k])))a[k]=Number((Number(a[k])*factor).toFixed(2));}));
    if(Number.isFinite(Number(o.originalValue)))o.originalValue=Number((Number(o.originalValue||0)*factor).toFixed(2));
    o.agreedValue=Number(nextValue.toFixed(2));
    o.valueChangeHistory=o.valueChangeHistory||[];
    o.valueChangeHistory.unshift({
      at:new Date().toISOString(),
      by:currentUsername(),
      from:currentValue,
      to:o.agreedValue,
      factor:Number(factor.toFixed(6)),
      reason,
      type:'PEDIDO'
    });
    try{audit('PEDIDOS','ALTERAÇÃO DE VALOR',`PEDIDO ${String(o.numero).padStart(6,'0')}`,`${BR(currentValue)} → ${BR(o.agreedValue)} • Fator ${factor.toFixed(6)} • ${reason}`)}catch(_){}
    try{addOrderEvent(o,'VALOR DO PEDIDO ALTERADO',`${BR(currentValue)} → ${BR(o.agreedValue)} • ${reason}`)}catch(_){}
    queueSave();
    closeModal();
    renderAll();
    setTimeout(()=>window.openOrder(orderNo),0);
  };
};
const oldNi144Open=window.ni144Open;
if(typeof oldNi144Open==='function'){
  window.ni144Open=async function(view){
    await oldNi144Open(view);
    if(view==='accounts'){
      injectCashFlowButton();
      await renderResourceWidgets();
    }
  };
}
const oldOpenOrder=window.openOrder;
if(typeof oldOpenOrder==='function'){
  window.openOrder=function(orderNo){
    oldOpenOrder(orderNo);
    setTimeout(()=>injectEditOrderButton(orderNo),0);
  };
}
setTimeout(()=>{
  injectCashFlowButton();
  if(document.querySelector('#view-accounts.active'))renderResourceWidgets();
},600);
})();
