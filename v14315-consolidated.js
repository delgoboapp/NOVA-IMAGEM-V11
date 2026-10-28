/* V14.3.15 — Consolidado: montagem de varão com comando + acessórios inclusos + R2 de orçamentos */
(function(){
 'use strict';
 const COMMAND='VARÃO WAVE COM COMANDO POR CORDA',SQUARE='TRILHO SQUARE COM COMANDO';
 const $=id=>document.getElementById(id);
 const isCommand=e=>String(e?.fixation||'')===COMMAND;
 const isKit=e=>[COMMAND,SQUARE].includes(String(e?.fixation||''));
 const mount=e=>e?.waveMount==='TETO'?'TETO':'PAREDE';
 const count=e=>{const rods=e.model==='COMPLETE'?2:1,w=Number(e.width||0)/100;return Math.max(2*rods,Math.ceil(w/0.60)*rods)};
 const findingClaw=()=>((typeof priceProducts!=='undefined'?priceProducts:[])||[]).find(p=>String(p.internal_code||'').toUpperCase()==='NI-0350')||null;
 const oldEnv=envFromForm;
 envFromForm=function(){const e=oldEnv();if(isCommand(e))e.waveMount=$('eWaveMount')?.value||e.waveMount||'PAREDE';return e};
 const oldLoad=loadEnvironmentForEdit;
 loadEnvironmentForEdit=function(e){oldLoad(e);if(isCommand(e)&&$('eWaveMount')){$('eWaveMount').value=mount(e);updateVisibility()}};
 function updateVisibility(){const e=$('eFixation')?.value,show=e==='VARÃO WAVE'||e===COMMAND;const box=$('eWaveMountWrap');if(!box)return;box.classList.toggle('hidden',!show);box.style.display=show?'':'none';if(show&&!$('eWaveMount')?.value)$('eWaveMount').value='PAREDE'}
 document.addEventListener('change',ev=>{if(['eFixation','eWaveMount','eModel'].includes(ev.target.id))setTimeout(()=>{updateVisibility();if(ev.target.id==='eWaveMount')updatePreview()},0)},true);
 setTimeout(updateVisibility,1000);
 // Ao montar no teto, substituir os suportes do varão por garras, com duas camadas independentes.
 const prevCalc=calcEnvironment;
 calcEnvironment=function(e){const c=prevCalc(e);if(!c)return c;
  if(isKit(e)){const removed=Number(c.sliderCost||0);c.sliderCost=0;c.base4=Math.max(0,Number(c.base4||0)-removed);c.cash=Math.max(0,Number(c.cash||0)-removed*(1-Number(db.priceConfig?.terms?.cashDiscountPct||0)/100));c.p18=Math.max(0,Number(c.p18||0)-removed*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100));}
  if(!isCommand(e)||mount(e)!=='TETO'||e.excludeFixation)return c;
  const f=c.fixationCalc||{},p=findingClaw();if(!p){c.alerts=[...(c.alerts||[]),'GARRA NI-0350 NÃO CADASTRADA'];return c}
  const qty=count(e),support=typeof officialProductById==='function'?officialProductById(f.supportProductId):null;
  const supportPrice=Number(support?.price_4x??0),previous=Number(f.total||0);
  const newFix=Math.max(0,previous-Number(f.supports||0)*supportPrice+qty*Number(p.price_4x||0));
  const delta=newFix-previous;
  c.fixationCalc={...f,total:newFix,hardwareBase:newFix,supports:0,supportProductId:null,clamps:qty,clawProductId:p.id,waveMount:'TETO',detail:`${f.detail?.split(' • ')[0]||'VARÃO COM COMANDO'} • ${e.model==='COMPLETE'?2:1} varão(ões) • ${qty} garras de teto (NI-0350)`};
  c.base4=Number(c.base4||0)+delta;
  c.cash=Number(c.cash||0)+delta*(1-Number(db.priceConfig?.terms?.cashDiscountPct||0)/100);
  c.p18=Number(c.p18||0)+delta*(1+Number(db.priceConfig?.terms?.p18AddPct||0)/100);
  return c;
 };
 // Itens incluídos nos conjuntos não devem reaparecer em separação de materiais ou pedido.
 const oldReq=officialOrderRequirements;
 officialOrderRequirements=function(q){let req=oldReq(q)||[];
  const kits=(q.environments||[]).filter(isKit);
  req=req.filter(r=>!kits.some(e=>String(r.environment||'').toUpperCase()===String(e.name||'').toUpperCase() && /DESLIZANTE|TAMPA|CORD.O WAVE/.test(String(r.product_name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''))));
  for(const e of kits.filter(e=>isCommand(e)&&mount(e)==='TETO')){
   const p=findingClaw();if(!p)continue;
   req=req.filter(r=>!(String(r.environment||'').toUpperCase()===String(e.name||'').toUpperCase()&&/SUPORTE.*WAVE|GARRA.*VARAO/.test(String(r.product_name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''))));
   req.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty:count(e),environment:e.name,environments:[e.name],source:'VARÃO COM COMANDO NO TETO',cost:Number(p.cost||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0),price_cash:Number(p.price_cash||0)});
  }
  return req;
 };
 // Fotos e vídeos: anexos exclusivamente no R2; metadados em tabela dedicada no D1.
 const url=(num,action,id='')=>`/api/quote-attachments?orcamento=${encodeURIComponent(num)}&action=${encodeURIComponent(action)}${id?'&id='+encodeURIComponent(id):''}`;
 async function req(num,action,options={}){const r=await fetch(url(num,action,options.id),{method:options.method||'GET',headers:{...(token?{Authorization:'Bearer '+token}: {})},body:options.body});if(options.blob){if(!r.ok)throw Error('Não foi possível carregar o arquivo');return r.blob()}const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Falha no R2');return j}
 const number=()=>{const n=Number(draft.numero||0);return (n&&(db.quotes||[]).some(q=>Number(q.numero)===n))?n:null};
 async function refresh(){const el=$('quoteR2AttachmentList');if(!el)return;const n=number();if(!n){el.innerHTML='<small>Salve o orçamento para adicionar fotos e vídeos.</small>';return}try{const j=await req(n,'list');el.innerHTML=(j.attachments||[]).slice(0,12).map(a=>`<div style="font-size:12px;margin:5px 0"><strong>${esc(a.ambiente)}</strong> · ${esc(a.nome)} <button type="button" class="btn secondary" style="padding:3px 6px" data-ni-view="${a.id}">VER</button></div>`).join('')||'<small>Nenhum anexo neste orçamento.</small>';el.querySelectorAll('[data-ni-view]').forEach(b=>b.onclick=()=>view(n,b.dataset.niView))}catch(e){el.textContent=e.message}}
 async function view(n,id){try{const blob=await req(n,'view',{id,blob:true});const objectUrl=URL.createObjectURL(blob);window.open(objectUrl,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(objectUrl),60000)}catch(e){alert(e.message)}}
 async function open(){const n=number();if(!n)return alert('Salve o orçamento e aguarde a sincronização na nuvem antes de inserir anexos.');const environments=[...(draft.environments||[]).map(e=>e.name),...(draft.blinds||[]).map(b=>b.environment)].filter(Boolean);if(!environments.length)return alert('Adicione um ambiente primeiro.');
 openModal(`<h2>ANEXOS DO ORÇAMENTO ${n}</h2><p>Arquivos armazenados no Cloudflare R2. Ambiente obrigatório por arquivo.</p><label class="field">Ambiente obrigatório<select id="niAttEnv"><option value="">Selecione o ambiente</option>${environments.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('')}</select></label><label class="field">Comentários e observações<textarea id="niAttNotes" rows="3" placeholder="Detalhes da janela, medidas, instalação..."></textarea></label><label class="field">Fotos e vídeos<input id="niAttFiles" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"></label><p class="muted">Sem limite de quantidade • Até 10 MB por foto e 50 MB por vídeo.</p><button id="niAttUpload" class="btn primary">ENVIAR PARA R2</button><p id="niAttStatus"></p><div id="niAttRows"></div>`);
 async function redraw(){const j=await req(n,'list');$('niAttRows').innerHTML=(j.attachments||[]).map(a=>`<div style="padding:8px;border-bottom:1px solid #ddd"><strong>${esc(a.ambiente)}</strong> — ${esc(a.nome)}<br><small>${esc(a.observacoes||'')}</small><br><button class="btn secondary" data-ni-open="${a.id}">VER</button> <button class="btn danger" data-ni-del="${a.id}">EXCLUIR</button></div>`).join('')||'Nenhum anexo.';$('niAttRows').querySelectorAll('[data-ni-open]').forEach(b=>b.onclick=()=>view(n,b.dataset.niOpen));$('niAttRows').querySelectorAll('[data-ni-del]').forEach(b=>b.onclick=async()=>{if(!confirm('Excluir anexo do R2?'))return;try{await req(n,'delete',{id:b.dataset.niDel,method:'DELETE'});await redraw();await refresh()}catch(e){alert(e.message)}})}
 $('niAttUpload').onclick=async()=>{const ambiente=$('niAttEnv').value,files=[...$('niAttFiles').files],notes=$('niAttNotes').value;if(!ambiente)return alert('Selecione obrigatoriamente o ambiente.');if(!files.length)return alert('Selecione os arquivos.');const btn=$('niAttUpload');btn.disabled=true;let sent=0;try{for(const file of files){const fd=new FormData();fd.append('ambiente',ambiente);fd.append('observacoes',notes);fd.append('file',file);$('niAttStatus').textContent=`Enviando ${sent+1}/${files.length}: ${file.name}`;await req(n,'upload',{method:'POST',body:fd});sent++}$('niAttStatus').textContent=`${sent} anexo(s) enviado(s).`;$('niAttFiles').value='';await redraw();await refresh()}catch(e){$('niAttStatus').textContent=`${sent} enviado(s); erro: ${e.message}`}finally{btn.disabled=false}};
 await redraw();}
 document.addEventListener('click',ev=>{if(ev.target.id==='quoteR2AttachBtn')open()});
 const prevRender=renderQuote;renderQuote=function(){prevRender();refresh()};
 setTimeout(refresh,1300);
})();
