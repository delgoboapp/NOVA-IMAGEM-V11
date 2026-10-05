
/* V12.5.7 — hotfix isolado do PDF do pedido.
   Carregado DEPOIS do app.js para eliminar conflito entre definições antigas. */
(function(){
  const VERSION='V12.5.7';

  function condKey(o){
    if(o?.paymentCondition==='cash')return 'cash';
    if(o?.paymentCondition==='p18')return 'p18';
    return 'p4';
  }
  function installments(o){
    if(typeof v1214OrderInstallments==='function')return Math.max(1,Number(v1214OrderInstallments(o)||1));
    if(o?.paymentCondition==='cash')return 1;
    if(o?.paymentCondition==='p18')return 18;
    return 4;
  }
  function noFix(e){
    const f=norm(e?.fixation||'');
    return !!e?.excludeFixation ||
      f==='SEM FIXACAO' ||
      f==='SEM FIXACAO / SEM INSTALACAO' ||
      f==='SEM TRILHO E SEM INSTALACAO';
  }
  function hardware(r){
    const t=norm([r?.product_name,r?.name,r?.source,r?.category].filter(Boolean).join(' '));
    if(t.includes('DESLIZANTE')||t.includes('CORDAO WAVE')||t.includes('FITA WAVE')||
       t.includes('TECIDO')||t.includes('FORRO')||t.includes('ARGOLA')||t.includes('ILHOS')) return false;
    return t.includes('TRILHO')||t.includes('GARRA')||t.includes('TAMPA')||
      t.includes('VARAO')||t.includes('SUPORTE')||t.includes('TUBO ')||
      t.includes('MOTOR')||t.includes('MOTORIZADO')||t.includes('CONTROLE REMOTO')||
      t.includes('SQUARE')||t.includes('COMANDO POR CORDA');
  }
  function rowsFor(e){
    let rows=[];
    try{ rows=officialOrderRequirements({environments:[e]})||[]; }catch(_){}
    if(noFix(e)) rows=rows.filter(r=>!hardware(r));
    return rows;
  }
  function unitFor(r,o){
    const k=condKey(o);
    if(k==='cash')return Number(r?.price_cash||0);
    if(k==='p18')return Number(r?.price_18x||0);
    return Number(r?.price_4x||0);
  }
  function envValue(e,o,q){
    if(typeof v1214EnvironmentOrderValue==='function'){
      const v=Number(v1214EnvironmentOrderValue(e,o,q)||0);
      if(Number.isFinite(v)&&v>0)return v;
    }
    const c=calcEnvironment(e);
    if(!c)return 0;
    const k=condKey(o);
    return k==='cash'?Number(c.cash||0):k==='p18'?Number(c.p18||0):Number(c.base4||0);
  }

  window.printCustomerOrderV1276=function(o){
    ensureV119();

    if(!/^\d{6}$/.test(String(o.clientAccessCode||''))){
      o.clientAccessCode=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');
      queueSave();
    }

    const q=(db.quotes||[]).find(x=>Number(x.numero)===Number(o.quoteNumber));
    const n=installments(o);
    const cond=typeof v1213PaymentLabel==='function'?v1213PaymentLabel(o):paymentConditionLabel(o.paymentCondition);
    const payText=typeof v1214ContractPaymentText==='function'
      ? v1214ContractPaymentText(o)
      : `${cond}: ${money(o.agreedValue)}`;

    let envs='';

    for(const e of o.environments||[]){
      const c=calcEnvironment(e);
      if(!c)continue;

      const rows=rowsFor(e);
      const inputValue=rows.reduce((a,r)=>a+unitFor(r,o)*Number(r.qty||0),0);
      const sale=envValue(e,o,q);
      const labor=Math.max(0,sale-inputValue);
      const isNoFix=noFix(e);

      const mats=rows.map(r=>{
        const qty=Number(r.qty||0),unit=unitFor(r,o);
        return `<tr>
          <td>${esc(r.internal_code||'-')}</td>
          <td>${esc(r.product_name||'-')}</td>
          <td>${esc(r.color||'-')}</td>
          <td>${qty.toFixed(norm(r.unit)==='M'?2:0)} ${esc(norm(r.unit||'UN'))}</td>
          <td>${money(unit)}</td>
          <td>${money(unit*qty)}</td>
        </tr>`;
      }).join('');

      envs+=`
        <div class="env-block">
          <div class="env-title">${esc(e.name||'-')}</div>

          <table class="env-table">
            <tr>
              <th>Medidas</th><td>${Number(e.width||0)} × ${Number(e.height||0)} cm</td>
              <th>Aberturas</th><td>${Math.max(0,Number(e.leaves||1)-1)}</td>
            </tr>
            <tr>
              <th>Acabamento</th>
              <td>${c.finishCalc?esc(`${e.finish} / ${e.finishColor} / ${e.finishPleat} ${e.finishGather}:1`):'—'}</td>
              <th>Forro</th>
              <td>${c.liningCalc?esc(`${e.lining} / ${e.liningColor} / ${e.liningPleat} ${e.liningGather}:1`):'—'}</td>
            </tr>
            <tr>
              <th>Fixação</th>
              <td colspan="3"><strong>${isNoFix?'SEM FIXAÇÃO':esc(`${e.fixation||'-'}${e.fixColor?' • '+e.fixColor:''}`)}</strong></td>
            </tr>
            <tr>
              <th>Valor deste ambiente</th>
              <td colspan="3"><strong>${money(sale)}</strong>${n>1?` • ${n}x de ${money(sale/n)}`:''}</td>
            </tr>
          </table>

          <table class="summary-table" style="margin:7px 0 8px">
            <tr>
              <th style="width:50%">MÃO DE OBRA</th>
              <th style="width:50%">INSUMOS</th>
            </tr>
            <tr>
              <td><strong>${money(labor)}</strong><br><small>${isNoFix?'confecção / costura':'confecção + instalação'}</small></td>
              <td><strong>${money(inputValue)}</strong><br><small>soma dos materiais abaixo</small></td>
            </tr>
          </table>

          <div class="section-title">Materiais deste ambiente</div>
          <table class="summary-table">
            <tr><th>SKU</th><th>Produto</th><th>Cor</th><th>Quantidade</th><th>Valor Unitário</th><th>Valor Total</th></tr>
            ${mats||'<tr><td colspan="6">Sem material oficial vinculado.</td></tr>'}
            <tr><th colspan="5" style="text-align:right">TOTAL DOS INSUMOS</th><th>${money(inputValue)}</th></tr>
          </table>
        </div>`;
    }

    const cset=companySettings();
    const warranty=o.documentVersions?.warrantyText||cset.warranty||V119_WARRANTY;

    const body=`
      <div class="pdf-head">
        <img src="${location.origin}/icon-512.png">
        <div class="store-client">
          <strong>Nova Imagem Cortinas e Persianas</strong><br>
          Luiz Sergio Delgobo ME<br>
          CNPJ 15.115.803/0001-69 • IE 90.588.753-06<br>
          Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330<br><br>
          <strong>PEDIDO Nº ${String(o.numero).padStart(6,'0')}</strong><br>
          <strong>Cliente:</strong> ${esc(o.client||'-')}<br>
          <strong>Contato:</strong> ${esc(o.contact||'-')}<br>
          <strong>Endereço:</strong> ${esc(o.address||'-')}<br>
          <strong>Instalação prevista:</strong> ${fmtDate(o.deliveryDate)}<br>
          <strong>Vendedor:</strong> ${esc(displaySeller(o))}
        </div>
      </div>

      ${envs}

      <div class="section-title">Acompanhe seu pedido</div>
      <div class="customer-access-box">
        <img class="customer-qr" src="${customerPortalQrUrl(o.numero)}" alt="QR Code para acompanhar o pedido">
        <div>
          <strong>Portal do Cliente Nova Imagem</strong><br>
          Aponte a câmera para o QR Code.<br><br>
          Pedido: <strong>${String(o.numero).padStart(6,'0')}</strong><br>
          Senha: <strong>${esc(o.clientAccessCode||'NÃO GERADA')}</strong><br>
          <a class="customer-portal-link" href="${customerPortalUrl(o.numero)}" target="_blank">Clique aqui para acompanhar seu pedido</a>
        </div>
      </div>

      <div class="section-title">Condição contratada</div>
      <p class="totals">${esc(payText)}</p>

      <div class="section-title">CONTRATO DE FORNECIMENTO E INSTALAÇÃO</div>
      <div class="conditions">
        <p><strong>CONTRATADA:</strong> Luiz Sergio Delgobo ME, CNPJ 15.115.803/0001-69.</p>
        <p><strong>CONTRATANTE:</strong> ${esc(o.client||'-')}, endereço ${esc(o.address||'-')}.</p>
        <p><strong>OBJETO:</strong> fornecimento e instalação dos produtos descritos neste pedido.</p>
        <p><strong>CONDIÇÃO:</strong> ${esc(payText)}</p>
        <p><strong>PRAZO PREVISTO:</strong> instalação/entrega em ${fmtDate(o.deliveryDate)}.</p>
      </div>

      <div class="signature-grid">
        <div><div class="signature-line"></div><strong>Cliente / Contratante</strong></div>
        <div><div class="signature-line"></div><strong>Nova Imagem / Vendedor</strong></div>
      </div>

      <div style="page-break-before:always"></div>
      <div class="section-title">TERMO DE GARANTIA</div>
      <div style="white-space:pre-line;line-height:1.55">${esc(warranty)}</div>
      <br>
      <p><strong>Pedido:</strong> ${String(o.numero).padStart(6,'0')} • <strong>Cliente:</strong> ${esc(o.client||'-')}</p>
      <div class="signature-grid">
        <div><div class="signature-line"></div><strong>Cliente</strong></div>
        <div><div class="signature-line"></div><strong>Nova Imagem</strong></div>
      </div>

      <div style="font-size:8px;color:#667a79;margin-top:8px">PDF do Pedido • ERP Nova Imagem V12.5.7</div>`;

    printWindow(body);
  };

  // Sobrescreve explicitamente o nome legado.
  window.printCustomerOrder=window.printCustomerOrderV1276;

  // E, além disso, reata o botão ABRIR PEDIDO diretamente ao hotfix,
  // sem depender de qual definição antiga esteja ativa.
  if(typeof window.openOrder==='function'){
    const previousOpenOrder=window.openOrder;
    window.openOrder=function(n){
      previousOpenOrder(n);
      const o=(db.orders||[]).find(x=>Number(x.numero)===Number(n));
      const b=$('openCustomerOrder');
      if(b&&o)b.onclick=()=>window.printCustomerOrderV1276(o);
    };
  }
})();
