/* === V12.5.8 • ESTOQUE DE PERSIANAS + MOTOR REQUINTE === */
(function(){
  const MODELS=['ROLO SEM BANDO','ROLO COM BANDO','ROMANA','HORIZONTAL 25MM','STRIPE SEM BANDO','STRIPE COM BANDO'];
  const BANDO_COLORS=['BRANCO','PRETO','CINZA','MARFIM','MARROM'];
  const REQ=[
    {n:2,c:'SCREEN DOHA 3%',colors:['WHITE','GREY'],max:2.95,price:{'ROLO SEM BANDO':123,'ROLO COM BANDO':148,'ROMANA':168}},
    {n:3,c:'SCREEN DH 5%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':130,'ROLO COM BANDO':150,'ROMANA':162}},
    {n:4,c:'SCREEN DH 3%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':138,'ROLO COM BANDO':159,'ROMANA':169}},
    {n:5,c:'SCREEN DH 1%',colors:['BRANCO','BEGE','CINZA','PRETO'],max:2.50,price:{'ROLO SEM BANDO':152,'ROLO COM BANDO':169}},
    {n:6,c:'SCREEN ORION LIGHT 5%',colors:['WHITE','BEIGE','IVORY'],max:2.50,price:{'ROLO SEM BANDO':112.32,'ROLO COM BANDO':140.40,'ROMANA':155}},
    {n:7,c:'SCREEN ORION 5%',colors:['BOURBON','ASH MESCLA','IVORY MESCLA','GREY MESCLA'],max:2.50,price:{'ROLO SEM BANDO':120,'ROLO COM BANDO':146.50,'ROMANA':161.50}},
    {n:8,c:'SCREEN ORION 3%',colors:['BOURBON','IVORY','ASH','MUSHROOM','BROWN'],max:2.50,price:{'ROLO SEM BANDO':126,'ROLO COM BANDO':149.50,'ROMANA':169}},
    {n:9,c:'SCREEN ORION 1%',colors:['IVORY DUO','TITANIO DUO'],max:2.50,price:{'ROLO SEM BANDO':149,'ROLO COM BANDO':173}},
    {n:10,c:'SCREEN ORION 0,5%',colors:['WHITE','TITANIO','BLACK','GREY MESCLA','ASH MESCLA'],max:2.50,price:{'ROLO SEM BANDO':142,'ROLO COM BANDO':165}},
    {n:11,c:'STRIPE',colors:['RAMI PALHA','PRETO','BRANCO','CINZA'],max:2.20,price:{'STRIPE SEM BANDO':166.40,'STRIPE COM BANDO':190.32}},
    {n:12,c:'MADRID (PRESTIGE) BLACK OUT',colors:['WHITE NEVE','WHITE','CREAM','SANDO','GREY'],max:1.95,price:{'ROLO SEM BANDO':151.84,'ROLO COM BANDO':177.68,'ROMANA':200.41}},
    {n:13,c:'TJ 2606 BK',colors:['NATURAL'],max:1.95,price:{'ROLO SEM BANDO':159.12,'ROLO COM BANDO':195.31,'ROMANA':197.96}},
    {n:14,c:'DUNA BLACKOUT',colors:['WHITE','ICE','NATURAL','IVORY','BROWN'],max:2.35,price:{'ROLO SEM BANDO':146.80,'ROLO COM BANDO':170.35,'ROMANA':190.79}},
    {n:15,c:'NÁPOLES BLACK-OUT',colors:['TODAS AS CORES'],max:2.35,price:{'ROLO SEM BANDO':153.71,'ROLO COM BANDO':180.44,'ROMANA':192.50}},
    {n:16,c:'VANCOUVER BLACK-OUT',colors:['BRANCO','BEGE','CINZA','CHUMBO','PRETO'],max:2.45,price:{'ROLO SEM BANDO':145.60,'ROLO COM BANDO':172.64,'ROMANA':182}},
    {n:17,c:'TRANSLÚCIDO AM 2861',colors:['NATURAL','BRANCO'],max:1.95,price:{'ROLO SEM BANDO':128.70,'ROLO COM BANDO':148.98,'ROMANA':164.48}}
  ];
  const PH25=[
    [1,'LISA',145.95],[2,'METALIZADA',149.10],[3,'DUPLA FACE',171.15],[4,'LISA SEM FURO APARENTE',181.65],[5,'METALIZADO SEM FURO APARENTE',189.00],[6,'TEXTURIZADO',199.50],[7,'DUPLA FACE SEM FURO APARENTE',207.90],[8,'TEXTURIZADO SEM FURO APARENTE',233.10],[9,'PERFURADA',221.55]
  ];
  function cfg(){
    db.settings=db.settings||{};
    db.settings.blindsV1258=db.settings.blindsV1258||{minArea:1.2,cashDiscount:5,p10Divider:.82,wifiMotorCost:1015,control4Cost:185,largeWidthPct:10,reinforcedPct:10,bandMaxHeightCm:440};
    db.settings.blindInventory=db.settings.blindInventory||[];
    db.settings.deletedBlindSeedKeys=db.settings.deletedBlindSeedKeys||[];
    return db.settings.blindsV1258;
  }
  function seed(){
    cfg();
    const inv=db.settings.blindInventory;
    const deleted=new Set(db.settings.deletedBlindSeedKeys||[]);
    const keys=new Set(inv.map(x=>x.seedKey).filter(Boolean));
    for(const r of REQ){for(const [model,cost] of Object.entries(r.price)){for(const color of r.colors){
      const k=`REQ-${r.n}-${model}-${color}`; if(keys.has(k)||deleted.has(k))continue;
      inv.push({id:uid(),seedKey:k,sku:`PR-${String(r.n).padStart(2,'0')}-${model.replace(/[^A-Z]/g,'').slice(0,5)}-${color.replace(/[^A-Z0-9]/g,'').slice(0,6)}`,supplier:'REQUINTE',model,collection:r.c,color,maxWidthM:r.max,maxHeightCm:model.includes('COM BANDO')?440:0,cost:Number(cost),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:r.n});
    }}}
    for(const [n,collection,cost] of PH25){const k=`PH25-${n}`;if(keys.has(k)||deleted.has(k))continue;inv.push({id:uid(),seedKey:k,sku:`PH25-${String(n).padStart(2,'0')}`,supplier:'REQUINTE',model:'HORIZONTAL 25MM',collection,color:'CÓDIGO DIGITÁVEL',maxWidthM:0,maxHeightCm:0,cost:Number(cost),markup:100,stockMode:'ILIMITADO',qty:0,active:true,sourceItem:n});}
  }
  function inv(){seed();return db.settings.blindInventory||[]}
  function available(){return inv().filter(x=>x.active!==false&&(x.stockMode==='ILIMITADO'||Number(x.qty||0)>0));}
  function itemById(id){return inv().find(x=>String(x.id)===String(id));}
  function p4PerM2(item){return Number(item.cost||0)*(1+Number(item.markup??100)/100)}
  function calc(item,wCm,hCm,drive){
    const c=cfg(),w=Number(wCm)/100,h=Number(hCm)/100,area=w*h,billArea=Math.max(Number(c.minArea||1.2),area); if(!(w>0&&h>0))return null;
    if(Number(item.maxWidthM||0)>0&&w>Number(item.maxWidthM)+1e-9)return {error:`Largura máxima desta coleção: ${Number(item.maxWidthM).toFixed(2).replace('.',',')} m.`};
    if(item.model.includes('COM BANDO')&&Number(c.bandMaxHeightCm||440)>0&&Number(hCm)>Number(c.bandMaxHeightCm))return {error:`Altura máxima para persiana com bandô: ${Number(c.bandMaxHeightCm)} cm.`};
    const notes=[];let baseCost=billArea*Number(item.cost||0);
    if(w>2.5){baseCost*=1+Number(c.largeWidthPct||10)/100;notes.push('ACRÉSCIMO TUBO 50MM');}
    if(area>6){baseCost*=1+Number(c.reinforcedPct||10)/100;notes.push('TUBO REFORÇADO');}
    let motorCost=0;if(drive==='ELETRÔNICO'){motorCost=Number(c.wifiMotorCost||1015)+Number(c.control4Cost||185);notes.push('ACIONAMENTO ELETRÔNICO');}
    const totalCost=baseCost+motorCost,markup=Number(item.markup??100),p4=totalCost*(1+markup/100),cash=p4*(1-Number(c.cashDiscount||5)/100),p10=cash/Number(c.p10Divider||.82);
    // Compatibilidade com o ERP: a coluna 18x continua seguindo os parâmetros gerais do Nova Imagem.
    const p18=p4*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100);
    const fabricP4=p4PerM2(item),fabricCash=fabricP4*(1-Number(c.cashDiscount||5)/100),fabricP10=fabricCash/Number(c.p10Divider||.82);
    return {area,billArea,baseCost,motorCost,totalCost,p4,cash,p10,p18,fabricP4,fabricCash,fabricP10,notes};
  }

  // ----- MENU / TELA DE ESTOQUE DE PERSIANAS -----
  if(!NAV.some(x=>x[0]==='blindInventory'))NAV.splice(NAV.findIndex(x=>x[0]==='inventory')+1,0,['blindInventory','ESTOQUE DE PERSIANAS','gestor']);
  const sg=NAV_GROUPS.find(x=>x.id==='stock');if(sg&&!sg.items.includes('blindInventory'))sg.items.splice(sg.items.indexOf('inventory')+1,0,'blindInventory');
  function ensureView(){
    if(document.getElementById('view-blindInventory'))return;
    const main=document.querySelector('.main');if(!main)return;
    const s=document.createElement('section');s.id='view-blindInventory';s.className='view';s.innerHTML=`<header class="topbar"><div><h1>Estoque de Persianas</h1><p>Modelos, coleções, cores, custos, markup, disponibilidade e estoque.</p></div><div class="actions"><button id="blindNewBtn" class="btn primary">+ NOVO ITEM</button></div></header><div id="blindInventorySummary" class="kpis" style="margin-bottom:14px"></div><div class="card"><div class="toolbar"><input id="blindInventorySearch" class="search" placeholder="Buscar modelo, coleção, cor ou SKU"><select id="blindInventoryModelFilter"><option value="">TODOS OS MODELOS</option></select></div><div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Modelo</th><th>Coleção</th><th>Cor</th><th>Larg. máx.</th><th>Estoque</th><th>Custo/m²</th><th>Markup</th><th>4x/m²</th><th>À vista/m²</th><th>10x/m²</th><th>Status</th><th>Ações</th></tr></thead><tbody id="blindInventoryTable"></tbody></table></div></div>`;main.insertBefore(s,document.getElementById('view-receivables')||null);
    document.getElementById('blindNewBtn').onclick=()=>openBlindItemEditor();document.getElementById('blindInventorySearch').oninput=renderBlindInventory;document.getElementById('blindInventoryModelFilter').onchange=renderBlindInventory;
  }
  window.renderBlindInventory=function(){
    ensureView();seed();const list=inv(),q=norm(document.getElementById('blindInventorySearch')?.value||''),mf=document.getElementById('blindInventoryModelFilter')?.value||'';
    const models=[...new Set(list.map(x=>x.model).filter(Boolean))].sort();const sel=document.getElementById('blindInventoryModelFilter');if(sel){const old=sel.value;sel.innerHTML='<option value="">TODOS OS MODELOS</option>'+models.map(x=>`<option ${old===x?'selected':''}>${esc(x)}</option>`).join('')}
    const rows=list.filter(x=>(!mf||x.model===mf)&&(!q||norm([x.sku,x.model,x.collection,x.color].join(' ')).includes(q))).sort((a,b)=>String(`${a.model} ${a.collection} ${a.color}`).localeCompare(String(`${b.model} ${b.collection} ${b.color}`),'pt-BR'));
    document.getElementById('blindInventorySummary').innerHTML=[['Itens cadastrados',list.length],['Disponíveis',available().length],['Estoque zerado',list.filter(x=>x.stockMode==='CONTROLADO'&&Number(x.qty||0)<=0).length],['Markup padrão','100%']].map(x=>`<div class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    document.getElementById('blindInventoryTable').innerHTML=rows.map(x=>{const p4=p4PerM2(x),ca=p4*.95,p10=ca/.82;return `<tr><td>${esc(x.sku||'-')}</td><td><strong>${esc(x.model||'-')}</strong></td><td>${esc(x.collection||'-')}</td><td>${esc(x.color||'-')}</td><td>${Number(x.maxWidthM||0)>0?Number(x.maxWidthM).toFixed(2)+' m':'—'}</td><td>${x.stockMode==='ILIMITADO'?'<span class="badge ok">ILIMITADO</span>':Number(x.qty||0)}</td><td>${money(x.cost||0)}</td><td>${Number(x.markup??100).toFixed(0)}%</td><td>${money(p4)}</td><td>${money(ca)}</td><td>${money(p10)}</td><td>${x.active===false?'<span class="badge warn">INATIVO</span>':'<span class="badge ok">ATIVO</span>'}</td><td><div class="actions"><button class="btn ghost" data-be="${x.id}">Editar</button><button class="btn secondary" data-bd="${x.id}">Duplicar</button><button class="btn danger" data-bx="${x.id}">Excluir</button></div></td></tr>`}).join('')||'<tr><td colspan="13">Nenhum item encontrado.</td></tr>';
    document.querySelectorAll('[data-be]').forEach(b=>b.onclick=()=>openBlindItemEditor(itemById(b.dataset.be)));
    document.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>duplicateBlindItem(b.dataset.bd));
    document.querySelectorAll('[data-bx]').forEach(b=>b.onclick=()=>deleteBlindItem(b.dataset.bx));
  };
  window.openBlindItemEditor=function(p=null){
    if(!isGestor())return alert('Somente o gestor pode alterar o estoque de persianas.');
    openModal(`<h2>${p?'Editar':'Novo'} item • Estoque de Persianas</h2><div class="grid two"><label class="field">SKU<input id="biSku" value="${esc(p?.sku||'')}"></label><label class="field">Fornecedor<input id="biSupplier" value="${esc(p?.supplier||'REQUINTE')}"></label><label class="field">Modelo<input id="biModel" list="biModels" value="${esc(p?.model||'ROLO SEM BANDO')}"><datalist id="biModels">${MODELS.map(x=>`<option value="${x}">`).join('')}</datalist></label><label class="field">Coleção<input id="biCollection" value="${esc(p?.collection||'')}"></label><label class="field">Cor<input id="biColor" value="${esc(p?.color||'')}"></label><label class="field">Largura máxima (m)<input id="biMaxW" type="number" step="0.01" min="0" value="${Number(p?.maxWidthM||0)}"></label><label class="field">Altura máxima (cm)<input id="biMaxH" type="number" step="1" min="0" value="${Number(p?.maxHeightCm||0)}"></label><label class="field">Custo por m²<input id="biCost" type="number" step="0.01" min="0" value="${Number(p?.cost||0)}"></label><label class="field">Markup (%)<input id="biMarkup" type="number" step="0.01" min="0" value="${Number(p?.markup??100)}"></label><label class="field">Controle de estoque<select id="biStockMode"><option value="ILIMITADO">ILIMITADO</option><option value="CONTROLADO">CONTROLADO</option></select></label><label class="field">Quantidade<input id="biQty" type="number" step="1" min="0" value="${Number(p?.qty||0)}"></label><label class="field">Status<select id="biActive"><option value="1">ATIVO</option><option value="0">INATIVO</option></select></label></div><div class="actions" style="margin-top:14px"><button id="biSave" class="btn primary">SALVAR</button></div>`);
    document.getElementById('biStockMode').value=p?.stockMode||'ILIMITADO';document.getElementById('biActive').value=p?.active===false?'0':'1';
    document.getElementById('biSave').onclick=()=>{const o=p||{id:uid()};Object.assign(o,{sku:document.getElementById('biSku').value.trim()||('PER-'+String(Date.now()).slice(-8)),supplier:document.getElementById('biSupplier').value.trim()||'REQUINTE',model:document.getElementById('biModel').value.trim().toUpperCase(),collection:document.getElementById('biCollection').value.trim().toUpperCase(),color:document.getElementById('biColor').value.trim().toUpperCase(),maxWidthM:Number(document.getElementById('biMaxW').value||0),maxHeightCm:Number(document.getElementById('biMaxH').value||0),cost:Number(document.getElementById('biCost').value||0),markup:Number(document.getElementById('biMarkup').value||100),stockMode:document.getElementById('biStockMode').value,qty:Number(document.getElementById('biQty').value||0),active:document.getElementById('biActive').value==='1',seedKey:p?.seedKey||''});if(!o.model||!o.collection||!o.color)return alert('Informe modelo, coleção e cor.');if(!p)inv().push(o);queueSave();closeModal();renderBlindInventory();};
  };
  window.duplicateBlindItem=function(id){const p=itemById(id);if(!p)return;const c=clone(p);c.id=uid();c.seedKey='';c.sku=(p.sku||'PER')+'-COPIA';c.collection=p.collection+' • CÓPIA';inv().push(c);queueSave();renderBlindInventory();openBlindItemEditor(c);};
  window.deleteBlindItem=function(id){const p=itemById(id);if(!p||!confirm(`Excluir ${p.model} • ${p.collection} • ${p.color}?`))return;if(p.seedKey){db.settings.deletedBlindSeedKeys=db.settings.deletedBlindSeedKeys||[];if(!db.settings.deletedBlindSeedKeys.includes(p.seedKey))db.settings.deletedBlindSeedKeys.push(p.seedKey)}db.settings.blindInventory=inv().filter(x=>String(x.id)!==String(id));queueSave();renderBlindInventory();};

  // ----- NOVO MOTOR +PERSIANA -----
  function bindBlindButton(){const old=document.getElementById('addBlindBtn');if(!old||old.dataset.v1258)return;const b=old.cloneNode(true);b.dataset.v1258='1';old.parentNode.replaceChild(b,old);b.onclick=openBlindV1258;}
  function blindOptions(items,field){return [...new Set(items.map(x=>x[field]).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join('')}
  window.openBlindV1258=function(){
    seed();const items=available();if(!items.length)return alert('Não há persianas disponíveis no Estoque de Persianas.');
    openModal(`<h2>+ Persiana</h2><p class="muted">Motor Requinte • área mínima 1,20 m² • preços calculados automaticamente.</p><div class="grid two"><label class="field">Ambiente<input id="bpEnv" placeholder="Ex.: SALA"></label><label class="field">Modelo<select id="bpModel"></select></label><label class="field">Coleção<select id="bpCollection"></select></label><label class="field">Cor<select id="bpColor"></select></label><label class="field" id="bpColorCodeWrap" style="display:none">Código da cor<input id="bpColorCode" placeholder="Digite o código da cor"></label><label class="field">Largura (cm)<input id="bpW" type="number" min="1"></label><label class="field">Altura (cm)<input id="bpH" type="number" min="1"></label><label class="field">Quantidade<input id="bpQty" type="number" min="1" step="1" value="1"></label><label class="field">Lado do comando<select id="bpCmd"><option>DIREITO</option><option>ESQUERDO</option><option>SEM COMANDO</option></select></label><label class="field">Altura do comando (cm)<input id="bpCmdH" type="number" min="0" value="120"></label><label class="field" id="bpBandoWrap" style="display:none">Cor do bandô<select id="bpBando">${BANDO_COLORS.map(x=>`<option>${x}</option>`).join('')}</select></label><label class="field">Acionamento<select id="bpDrive"><option value="MANUAL">MANUAL</option><option value="ELETRÔNICO">ELETRÔNICO</option></select></label></div><div id="bpPreview" class="notice" style="margin-top:14px">Informe as medidas para calcular.</div><div class="actions" style="margin-top:14px"><button id="bpSave" class="btn primary">ADICIONAR PERSIANA AO ORÇAMENTO</button></div>`);
    const model=document.getElementById('bpModel'),collection=document.getElementById('bpCollection'),color=document.getElementById('bpColor');
    function modelItems(){return items.filter(x=>x.model===model.value)}function collectionItems(){return modelItems().filter(x=>x.collection===collection.value)}
    function fillModels(){model.innerHTML=blindOptions(items,'model');fillCollections()}
    function fillCollections(){const a=modelItems();collection.innerHTML=blindOptions(a,'collection');fillColors()}
    function fillColors(){const a=collectionItems();color.innerHTML=blindOptions(a,'color');refresh()}
    function selected(){return collectionItems().find(x=>x.color===color.value)||collectionItems()[0]}
    function refresh(){const p=selected();if(!p)return;const code=p.model==='HORIZONTAL 25MM'||String(p.color).includes('DIGITÁVEL');document.getElementById('bpColorCodeWrap').style.display=code?'block':'none';const hasBando=p.model.includes('COM BANDO');document.getElementById('bpBandoWrap').style.display=hasBando?'block':'none';const r=calc(p,document.getElementById('bpW').value,document.getElementById('bpH').value,document.getElementById('bpDrive').value);if(!r){document.getElementById('bpPreview').innerHTML=`Custo ${money(p.cost)}/m² • Markup ${Number(p.markup??100)}% • Largura máxima ${p.maxWidthM?Number(p.maxWidthM).toFixed(2)+' m':'conforme fabricante'}`;return;}if(r.error){document.getElementById('bpPreview').innerHTML=`<strong style="color:#a33">${esc(r.error)}</strong>`;return;}document.getElementById('bpPreview').innerHTML=`<strong>Área real:</strong> ${r.area.toFixed(2)} m² • <strong>Área de cálculo:</strong> ${r.billArea.toFixed(2)} m²<br><strong>Valor/m²:</strong> 10x ${money(r.fabricP10)} • 4x ${money(r.fabricP4)} • à vista ${money(r.fabricCash)}<br><strong>Total:</strong> 10x ${money(r.p10)} • 4x ${money(r.p4)} • à vista ${money(r.cash)}${r.notes.length?`<br><strong>${esc(r.notes.join(' • '))}</strong>`:''}`;}
    model.onchange=fillCollections;collection.onchange=fillColors;color.onchange=refresh;['bpW','bpH','bpDrive'].forEach(id=>document.getElementById(id).oninput=refresh);fillModels();
    document.getElementById('bpSave').onclick=()=>{const p=selected(),w=Number(document.getElementById('bpW').value),h=Number(document.getElementById('bpH').value),qty=Math.max(1,Number(document.getElementById('bpQty').value||1)),drive=document.getElementById('bpDrive').value,r=calc(p,w,h,drive);if(!p||!r)return alert('Informe produto e medidas.');if(r.error)return alert(r.error);const code=(document.getElementById('bpColorCode').value||'').trim();if((p.model==='HORIZONTAL 25MM'||String(p.color).includes('DIGITÁVEL'))&&!code)return alert('Informe o código da cor.');const blindColor=code||p.color,bando=p.model.includes('COM BANDO')?document.getElementById('bpBando').value:'';draft.blinds=draft.blinds||[];draft.blinds.push({id:uid(),inventoryId:p.id,environment:document.getElementById('bpEnv').value.trim()||'PERSIANA',blindModel:p.model,collection:p.collection,model:`${p.model} • ${p.collection}`,color:blindColor,bando,width:w,height:h,qty,area:r.area,billArea:r.billArea,commandSide:`${document.getElementById('bpCmd').value} • ALT. ${Number(document.getElementById('bpCmdH').value||0)} CM`,commandHeight:Number(document.getElementById('bpCmdH').value||0),drive,notes:r.notes,p10:r.p10,p18:r.p18,p4:r.p4,cash:r.cash,perM2P10:r.fabricP10,perM2P4:r.fabricP4,perM2Cash:r.fabricCash,cost:Number(p.cost||0),markup:Number(p.markup??100),sourceSku:p.sku});closeModal();renderQuote();};
  };

  // Recarrega dados e semeia defaults sem apagar itens editados/criados.
  const oldLoad=loadCloud;loadCloud=async function(){await oldLoad();seed();if(isGestor())queueSave();};
  const oldSet=setView;setView=function(id){oldSet(id);if(id==='blindInventory')renderBlindInventory();};
  ensureView();seed();bindBlindButton();setTimeout(()=>{renderNav();bindBlindButton();},50);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensureView();seed();renderNav();bindBlindButton();},250));
})();
