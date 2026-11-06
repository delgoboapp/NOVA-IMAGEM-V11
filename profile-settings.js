/* Nova Imagem V14.4.8 — configurações individuais do perfil e identidade do orçamento. */
(function(){
 'use strict';
 const DEFAULT_BRAND={name:'Nova Imagem Cortinas e Persianas',address:'Av. Bonifácio Vilela, 170 • Ponta Grossa–PR • CEP 84010-330',logo:''};
 const ownKey=()=>currentUsername();
 function getProfile(key=ownKey()) {return db.settings?.personalQuoteProfiles?.[norm(key)]||{};}
 function canProfile(){return !!currentUser;}
 function secureText(v){return esc(String(v||''));}
 function viewProfile(){
   if(!canProfile())return;
   const profile=getProfile(), current=partnerMarkupPercent(ownKey());
   const markup=profile.marginPercent===undefined?current:Number(profile.marginPercent);
   const div=$('view-profileSettings');if(!div)return;
   div.innerHTML=`<header class="topbar"><div><h1>Configurações do Perfil</h1><p>Preferências do seu usuário e identidade visual dos seus orçamentos.</p></div></header>
   <div class="card" style="margin-bottom:14px"><div class="card-title">Senha de acesso</div><div class="grid two">
   <label class="field">Senha atual<input id="pfOld" type="password" autocomplete="current-password"></label><div></div>
   <label class="field">Nova senha<input id="pfNew" type="password" autocomplete="new-password" minlength="6"></label>
   <label class="field">Confirmar nova senha<input id="pfConfirm" type="password" autocomplete="new-password" minlength="6"></label></div>
   <button id="pfChangePass" class="btn secondary" type="button">Alterar minha senha</button><p id="pfPassStatus" class="muted"></p></div>
   <div class="card" style="margin-bottom:14px"><div class="card-title">Margem padrão dos meus orçamentos</div>
   <label class="field" style="max-width:260px">Acréscimo padrão (%)<select id="pfMargin">${Array.from({length:13},(_,i)=>i*5).map(m=>`<option value="${m}" ${markup===m?'selected':''}>${m}%</option>`).join('')}</select></label>
   <p class="muted">Novos orçamentos usarão este acréscimo. Você poderá escolher outro valor dentro de cada orçamento. Os já salvos não serão recalculados.</p></div>
   <div class="card"><div class="card-title">Cabeçalho e logomarca do orçamento</div>
   <p class="muted">Padrão: Nova Imagem Cortinas e Persianas. Alterações feitas aqui só afetam os documentos de orçamento emitidos pelo seu usuário; os dados oficiais, contratos e pedidos da Nova Imagem não serão alterados.</p>
   <label class="field"><input type="checkbox" id="pfCustom" ${profile.customBrand?'checked':''}> Usar identidade personalizada nos orçamentos</label>
   <div id="pfBrandFields" class="grid two" style="margin-top:12px">
   <label class="field">Nome da empresa no cabeçalho<input id="pfBusiness" maxlength="120" value="${secureText(profile.name||DEFAULT_BRAND.name)}"></label>
   <label class="field">Endereço exibido<input id="pfAddress" maxlength="250" value="${secureText(profile.address||DEFAULT_BRAND.address)}"></label>
   <label class="field">Logomarca (PNG, JPG, WebP — até 250 KB)<input id="pfLogoFile" type="file" accept="image/png,image/jpeg,image/webp"></label>
   <div><small>Prévia da logomarca</small><div id="pfLogoPreview" style="margin-top:7px;padding:10px;border:1px solid #d3e1dd;border-radius:8px;min-height:70px"><img style="max-width:170px;max-height:88px;object-fit:contain" id="pfLogoImage" alt="Logomarca"></div>
   <button id="pfRemoveLogo" class="btn ghost" type="button" style="margin-top:6px">Voltar à logomarca padrão</button></div></div>
   <div class="actions" style="margin-top:16px"><button id="pfSave" class="btn primary" type="button">Salvar configurações</button><button id="pfDefault" class="btn ghost" type="button">Restaurar identidade Nova Imagem</button></div>
   <p id="pfStatus" class="muted"></p></div>`;
   let logo=profile.logo||'';
   const updateBrand=()=>{const custom=$('pfCustom').checked;$('pfBrandFields').style.opacity=custom?'1':'.5';$('pfBrandFields').querySelectorAll('input').forEach(el=>el.disabled=!custom);$('pfLogoImage').src=custom&&logo?logo:location.origin+'/icon-512.png'};
   $('pfCustom').onchange=updateBrand;updateBrand();
   $('pfLogoFile').onchange=async()=>{const file=$('pfLogoFile').files?.[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>250*1024){alert('Escolha PNG, JPG ou WebP de no máximo 250 KB.');$('pfLogoFile').value='';return;}const reader=new FileReader();reader.onload=()=>{logo=String(reader.result||'');updateBrand()};reader.readAsDataURL(file)};
   $('pfRemoveLogo').onclick=()=>{logo='';updateBrand()};
   $('pfDefault').onclick=()=>{$('pfCustom').checked=false;$('pfBusiness').value=DEFAULT_BRAND.name;$('pfAddress').value=DEFAULT_BRAND.address;logo='';updateBrand()};
   $('pfSave').onclick=async()=>{if(!cloudLoaded||cloudLocked)return alert('Sincronize com a nuvem antes de salvar.');const custom=$('pfCustom').checked,name=$('pfBusiness').value.trim(),address=$('pfAddress').value.trim(),margin=Number($('pfMargin').value);if(custom&&(!name||!address))return alert('Preencha o nome da empresa e o endereço.');const key=ownKey(),previous=getProfile(key);db.settings=db.settings||{};db.settings.personalQuoteProfiles=db.settings.personalQuoteProfiles||{};db.settings.personalQuoteProfiles[key]={...previous,marginPercent:margin,customBrand:custom,name:custom?name:DEFAULT_BRAND.name,address:custom?address:DEFAULT_BRAND.address,logo:custom?logo:''};
     const own=(db.users||[]).find(u=>norm(u.username)===key);
     if(own)own.markupPercent=margin;
     else{db.settings.builtInUserProfiles=db.settings.builtInUserProfiles||{};db.settings.builtInUserProfiles[key]={...(db.settings.builtInUserProfiles[key]||{}),markupPercent:margin};}
     try{await saveCloud();$('pfStatus').textContent='Configurações gravadas na nuvem.';renderNav()}catch(e){$('pfStatus').textContent='Falha ao salvar: '+e.message;alert(e.message)}
   };
   $('pfChangePass').onclick=async()=>{const old=$('pfOld').value,p=$('pfNew').value,confirm=$('pfConfirm').value;if(!old||p.length<6||p!==confirm)return alert('Informe a senha atual e confirme uma nova senha de pelo menos 6 caracteres.');const user=userPermissionRecord(ownKey()),expected=db.settings?.userPasswordOverrides?.[ownKey()]||user.hash;
     if(await sha256(old)!==expected)return alert('Senha atual incorreta.');
     db.settings=db.settings||{};db.settings.userPasswordOverrides=db.settings.userPasswordOverrides||{};db.settings.userPasswordOverrides[ownKey()]=await sha256(p);
     try{await saveCloud();$('pfOld').value='';$('pfNew').value='';$('pfConfirm').value='';$('pfPassStatus').textContent='Senha atualizada. Use-a no próximo login.'}catch(e){alert('Não foi possível gravar a nova senha: '+e.message)}
   };
 }
 const navOrig=renderNav;
 renderNav=function(){navOrig();const nav=$('nav');if(!nav||nav.querySelector('#niProfileNav'))return;const b=document.createElement('button');b.id='niProfileNav';b.type='button';b.className='nav-group-title';b.textContent='⚙ CONFIGURAÇÕES DO PERFIL';b.onclick=()=>setView('profileSettings');nav.appendChild(b)};
 const setViewOrig=setView;
 setView=function(id){if(id!=='profileSettings')return setViewOrig(id);document.querySelectorAll('.view').forEach(v=>v.classList.remove('active','print-target'));$('view-profileSettings')?.classList.add('active');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));viewProfile()};
 // Registra a identidade escolhida no orçamento, preservando-a após mudanças futuras no perfil.
 const saveQuoteOrig=saveQuote;
 saveQuote=function(print=false){const key=norm(draft.sellerUser||ownKey()),p=getProfile(key);draft.quoteBrand=p.customBrand?{name:p.name,address:p.address,logo:p.logo||''}:null;return saveQuoteOrig(print)};
 const basePrint=printQuote,baseWindow=printWindow;
 let brandDuringPrint=null;
 printQuote=function(q,type='summary'){const key=norm(q.sellerUser||q.ownerUser||ownKey()),p=getProfile(key);brandDuringPrint=q.quoteBrand||(p.customBrand?{name:p.name,address:p.address,logo:p.logo||''}:null);try{return basePrint(q,type)}finally{brandDuringPrint=null}};
 printWindow=function(body){const brand=brandDuringPrint;if(brand&&brand.name){const name=secureText(brand.name),addr=secureText(brand.address),logo=brand.logo&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(brand.logo)?brand.logo:location.origin+'/icon-512.png';
   body=body.replace(/(<div class="pdf-head"><img src=")[^"]+("\s*>)/,(_m,a,b)=>a+logo+b);
   body=body.replace(/(<div class="store-client"><strong>)(?:Nova Imagem Cortinas\s*(?:&|e)\s*Persianas)(<\/strong>)/i,(_m,a,b)=>a+name+b);
   body=body.replace(/(<span>ORÇAMENTO COMERCIAL<\/span>)/i,`$1<br><small>${addr}</small>`);
 }return baseWindow(body)};
})();
