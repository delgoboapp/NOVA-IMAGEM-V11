/* Nova Imagem V14.3.12 — relatório detalhado solicitado, sem alterar o orçamento comercial padrão. */
(function(){
  'use strict';
  const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const currency=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const tr=(cells)=>'<tr>'+cells.map(x=>'<td>'+x+'</td>').join('')+'</tr>';
  function openDetailedQuote(){
    if(typeof draft==='undefined'||typeof calcEnvironment!=='function'||typeof quoteTotals!=='function')return alert('Não foi possível carregar o orçamento atual.');
    syncDraft();
    if(!(draft.environments||[]).length&&!(draft.blinds||[]).length&&!(draft.looseProducts||[]).length)return alert('Adicione um ambiente ao orçamento antes de visualizar o detalhamento.');
    const q=draft,total=quoteTotals(q),pm=1+quotePartnerMarkup(q)/100;
    const fixed=(q.discountMode||'percent')==='fixed';
    const raw=quoteRawTotalsV1257(q);
    const ratio=raw.p18>0?Number(total.p18)/Number(raw.p18):1;
    let body=`<div class="pdf-head"><img src="${location.origin}/icon-512.png"><div class="store-client"><strong>NOVA IMAGEM CORTINAS E PERSIANAS</strong><br><strong>ORÇAMENTO DETALHADO • 18X</strong><br>Cliente: ${htmlEscape(q.client||'Não informado')}<br>Contato: ${htmlEscape(q.contact||'-')}<br>Endereço: ${htmlEscape(q.address||'-')}<br>Vendedor: ${htmlEscape(q.seller||'-')}<br>Data: ${htmlEscape(q.date||'-')}</div></div><div class="quote-number">ORÇAMENTO ${q.numero?'Nº '+String(q.numero).padStart(6,'0'):'EM ELABORAÇÃO'}</div>`;
    body+='<p class="muted">Detalhamento comercial em 18x, produzido sob solicitação do vendedor. Valores individuais distribuídos proporcionalmente ao preço comercial do ambiente. Este documento não substitui o orçamento comercial padrão.</p>';
    let displayed=0;
    for(const e of q.environments||[]){
      const c=calcEnvironment(e);if(!c)continue;
      const target=Number(c.p18||0)*pm*ratio;displayed+=target;
      let req=[];try{req=officialOrderRequirements({environments:[e]})||[]}catch(err){console.warn('Detalhamento de materiais indisponível',err)}
      if(e.excludeFixation)req=req.filter(x=>!/TRILHO|GARRA|TAMPA|VARÃO|VARAO|SUPORTE|MOTOR|TUBO/.test(String(x.source||'').toUpperCase()));
      const materials=req.map(r=>({label:(r.internal_code?`${r.internal_code} — `:'')+String(r.product_name||r.source||'Insumo'),qty:Number(r.qty||0),unit:String(r.unit||'UN'),base:Number(r.price_18x||0)*Number(r.qty||0)})).filter(r=>r.qty>0);
      const labor=Number(c.laborTotal||0)*(1+Number(db.priceConfig.terms.p18AddPct||0)/100);
      const rawBase=materials.reduce((s,x)=>s+x.base,0)+labor;
      const factor=rawBase>0?target/rawBase:0;
      let rows='',accounted=0;
      for(const r of materials){const subtotal=r.base*factor;accounted+=subtotal;rows+=tr([htmlEscape(r.label),htmlEscape(r.qty.toLocaleString('pt-BR',{maximumFractionDigits:2})+' '+r.unit),currency(r.qty?subtotal/r.qty:0),currency(subtotal)])}
      if(labor>0){const subtotal=labor*factor;accounted+=subtotal;rows+=tr(['MÃO DE OBRA — CONFECÇÃO E INSTALAÇÃO','1 SERVIÇO',currency(subtotal),currency(subtotal)])}
      if(Math.abs(target-accounted)>0.005||!rows)rows+=tr(['AJUSTE COMERCIAL DO AMBIENTE','1',currency(target-accounted),currency(target-accounted)]);
      body+=`<div class="env-block"><div class="env-title">${htmlEscape(e.name||'AMBIENTE')} — VALORES EM 18X</div><table class="env-table"><tr><th>Medidas</th><td>${htmlEscape(e.width)} × ${htmlEscape(e.height)} cm</td><th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td></tr><tr><th>Acabamento</th><td>${htmlEscape(e.model==='LINING'?'—':`${e.finish||''} / ${e.finishColor||''} / ${e.finishPleat||''} ${e.finishGather||''}:1`)}</td><th>Forro</th><td>${htmlEscape(e.model==='FINISH'?'—':`${e.lining||''} / ${e.liningColor||''} / ${e.liningPleat||''} ${e.liningGather||''}:1`)}</td></tr><tr><th>Fixação</th><td colspan="3">${htmlEscape(e.excludeFixation?'SEM FIXAÇÃO':(e.fixation||'-')+' / '+(e.fixColor||''))}</td></tr></table><div class="section-title">Materiais e mão de obra — 18x</div><table class="summary-table"><tr><th>Descrição</th><th>Quantidade</th><th>Valor unitário</th><th>Total 18x</th></tr>${rows}<tr><th colspan="3">TOTAL DO AMBIENTE • 18X</th><th>${currency(target)}</th></tr></table>${e.notes?`<p><strong>Observações:</strong> ${htmlEscape(e.notes)}</p>`:''}</div>`;
    }
    for(const b of q.blinds||[]){const qty=Number(b.qty||1),price=Number(b.p18||0)*qty*ratio;displayed+=price;body+=`<div class="env-block"><div class="env-title">${htmlEscape(b.environment||'PERSIANA')} — 18X</div><table class="summary-table"><tr><th>Produto</th><th>Medidas</th><th>Quantidade</th><th>Total 18x</th></tr>${tr([htmlEscape(`${b.model||'PERSIANA'} / ${b.color||''}`),htmlEscape(`${b.width} × ${b.height} cm`),String(qty),currency(price)])}</table></div>`}
    for(const a of q.looseProducts||[]){const qty=Number(a.qty||1),price=Number(a.p18||0)*qty*ratio;displayed+=price;body+=`<div class="env-block"><div class="env-title">PRODUTO AVULSO — 18X</div><table class="summary-table"><tr><th>Descrição</th><th>Quantidade</th><th>Total 18x</th></tr>${tr([htmlEscape(a.description||a.name||'Produto'),htmlEscape(`${qty} ${a.unit||'UN'}`),currency(price)])}</table></div>`}
    if(Number(q.travel||0)>0){const travel=Number(q.travel||0)*(1+Number(db.priceConfig.terms.p18AddPct||0)/100)*ratio;displayed+=travel;body+=`<p><strong>Deslocamento (18x):</strong> ${currency(travel)}</p>`}
    if(Math.abs(Number(total.p18)-displayed)>0.009)body+=`<p><strong>Ajuste de arredondamento/comercial (18x):</strong> ${currency(total.p18-displayed)}</p>`;
    body+=`<div class="section-title">RESUMO GERAL DO ORÇAMENTO</div><table class="summary-table"><tr><th>CONDIÇÃO</th><th>VALOR TOTAL</th></tr><tr><td>EM 18X</td><td class="totals">${currency(total.p18)}</td></tr><tr><td>EM 4X</td><td class="totals">${currency(total.p4)}</td></tr><tr><td>À VISTA</td><td class="totals">${currency(total.cash)}</td></tr></table>`;
    if(Number(q.discountPercent||0)>0||Number(q.discountAmount||0)>0)body+=`<p><strong>Desconto do orçamento:</strong> ${fixed?currency(q.discountAmount):htmlEscape(q.discountPercent)+'%'} • ${htmlEscape(q.discountReason||'')}</p>`;
    body+='<p class="conditions">Validade do orçamento: 5 dias. Valores sujeitos à conferência de medidas, tecidos e condições comerciais.</p>';
    printWindow(body);
  }
  function mount(){const save=document.getElementById('saveQuoteBottomBtn');if(!save)return;if(document.getElementById('viewDetailedQuoteBtn'))return;const btn=document.createElement('button');btn.id='viewDetailedQuoteBtn';btn.type='button';btn.className='btn secondary';btn.textContent='VER ORÇAMENTO DETALHADO';btn.addEventListener('click',openDetailedQuote);save.parentElement.insertBefore(btn,save)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
