/* ERP NOVA IMAGEM V14.5.0 - edição de documentos por pedido e navegação do portal */
(function(){'use strict';
const $=id=>document.getElementById(id);
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function home(){const close=$('publicPortalClose');if(close){close.click();return;}if(typeof showPublicHome==='function')showPublicHome();else window.location.assign('/');}
function bindHome(){const brand=$('ni145PortalHome')||document.querySelector('.public-brand');if(!brand)return;brand.style.cursor='pointer';brand.setAttribute('role','button');brand.tabIndex=0;brand.addEventListener('click',home);brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();home()}})}
function editor(q){
 const company=companySettings();const prevC=String(q._ni145Contract??company.clauses??'').trim();const prevW=String(q._ni145Warranty??company.warranty??V119_WARRANTY);
 const fallback='CONTRATO DE FORNECIMENTO E INSTALAÇÃO\n\nCONTRATADA: Luiz Sergio Delgobo ME — Nova Imagem Cortinas e Persianas.\nCONTRATANTE: '+String(q.client||'')+'\n\nOBJETO: Fornecimento e instalação dos produtos descritos no pedido.\nVALOR E PAGAMENTO: Conforme condição de pagamento escolhida na conversão do orçamento.\nPRAZO: Conforme data de entrega/instalação indicada no pedido.';
 const container=$('convDocuments145');if(!container)return;
 const parent=$('convGo')?.closest('#modalBody')||$('modalBody');const original=parent?.innerHTML;
 // Do not destroy the confirmation form. Hide it and restore after editing.
 const holder=document.createElement('div');holder.id='ni145DocumentEditor';holder.innerHTML=`<h2>Editar contrato e termo de garantia</h2><p class="muted">Textos exclusivos deste orçamento/pedido. O contrato padrão da empresa não será alterado. Não suprima direitos legais obrigatórios.</p><label class="field">CONTRATO<textarea id="ni145Contract" rows="11" style="width:100%">${safe(prevC||fallback)}</textarea></label><label class="field">TERMO DE GARANTIA<textarea id="ni145Warranty" rows="11" style="width:100%">${safe(prevW)}</textarea></label><div class="actions"><button type="button" class="btn primary" id="ni145DocSave">Salvar alterações deste pedido</button><button type="button" class="btn ghost" id="ni145DocCancel">Voltar sem salvar</button></div>`;
 const prior=[...parent.children];prior.forEach(x=>x.style.display='none');parent.appendChild(holder);
 function back(){holder.remove();prior.forEach(x=>x.style.display='')}
 $('ni145DocCancel').onclick=back;
 $('ni145DocSave').onclick=()=>{const c=$('ni145Contract').value.trim(),w=$('ni145Warranty').value.trim();if(c.length<30||w.length<30)return alert('O contrato e o termo de garantia devem conter pelo menos 30 caracteres.');if(!confirm('Salvar a personalização apenas para este pedido? Confira as cláusulas e direitos legais aplicáveis.'))return;q._ni145Contract=c;q._ni145Warranty=w;q._ni145DocumentEdited={at:new Date().toISOString(),by:currentUsername()};audit('DOCUMENTOS','EDITAR MODELOS DO PEDIDO','ORÇAMENTO '+q.numero,`Personalização temporária antes da conversão. Contrato: ${c.length} caracteres; garantia: ${w.length} caracteres.`);back();container.textContent='Editar contrato e garantia ✓';};
}
function attach(n){const go=$('convGo');if(!go||$('convDocuments145'))return;const q=(db.quotes||[]).find(x=>Number(x.numero)===Number(n));if(!q)return;const btn=document.createElement('button');btn.id='convDocuments145';btn.type='button';btn.className='btn secondary';btn.textContent=q._ni145DocumentEdited?'Editar contrato e garantia ✓':'Editar contrato e garantia';btn.onclick=()=>editor(q);const row=$('convActionRow149')||go.parentElement;row.appendChild(btn);}
function boot(){bindHome();if(typeof convertQuote==='function'){const previous=convertQuote;convertQuote=function(n){const result=previous.apply(this,arguments);setTimeout(()=>attach(n),45);return result;}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
