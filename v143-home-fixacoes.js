/* NOVA IMAGEM 14.3 — Home, correção das fixações. Sem DDL, sem migração D1/R2. */
(function(){'use strict';
 const el=id=>document.getElementById(id);
 const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
 const isRod=s=>fold(s)==='VARAO WAVE COM COMANDO POR CORDA';
 const isSquare=s=>fold(s)==='TRILHO SQUARE COM COMANDO';
 const rodName='VARÃO WAVE COM COMANDO POR CORDA';
 const ids=[['agenda','AGENDA','▦'],['quote','NOVO ORÇAMENTO','＋'],['quotes','ORÇAMENTOS','▤'],['orders','PEDIDOS','🛒'],['production','PRODUÇÃO','☼'],['install','INSTALAÇÕES','🔧']];
 let rodActive=false, changing=false, currentCalcEnv=null;
 function rodProduct(){
   const products=typeof priceProducts!=='undefined'?priceProducts:[];
   const w=Number(el('eWidth')?.value||0)/100,chosen=el('eRailProduct')?.value;
   const candidates=(products||[]).filter(p=>Number(p.active??1)===1&&fold(p.product_name).startsWith('VARAO COM COMANDO POR CORDA ATE')).map(p=>({p,limit:Number(fold(p.product_name).match(/ATE\s*(\d+(?:[.,]\d+)?)\s*M/)?.[1]?.replace(',','.')||0)}));
   const tier=Math.min(...candidates.filter(x=>x.limit>=w&&x.limit<=6).map(x=>x.limit));
   const available=candidates.filter(x=>x.limit===tier).map(x=>x.p);
   const old=available.find(p=>String(p.id)===String(chosen));
   const color=fold(el('eFixColor')?.value||'BRANCO');
   return {available,product:old||available.find(p=>fold(p.color)===color)||available[0]};
 }
 function ensureRod(){
   if(!rodActive||changing)return;
   const select=el('eFixation'),product=el('eRailProduct'),wrap=el('eRailProductWrap');if(!select||!product)return;
   changing=true;
   try{
     if(![...select.options].some(o=>o.value===rodName))select.add(new Option(rodName,rodName));
     select.value=rodName;
     const info=rodProduct(),previous=product.value;
     product.replaceChildren(new Option('SELECIONE COR E COMPRIMENTO',''));
     for(const p of info.available)product.add(new Option(`${p.product_name} — ${p.color} — ${p.internal_code||''}`,String(p.id)));
     const found=info.available.find(p=>String(p.id)===String(previous))||info.product;
     if(found){product.value=String(found.id);if(el('eFixColor'))el('eFixColor').value=found.color||'';}
     wrap?.classList.remove('hidden');wrap.style.display='';
     const label=wrap?.querySelector('label');if(label)label.textContent='MODELO DO VARÃO COM COMANDO';
     const mount=el('eWaveMountWrap');if(mount){mount.classList.remove('hidden');mount.style.display='';}
   }finally{changing=false}
 }
 document.addEventListener('change',ev=>{
   if(ev.target?.id==='eFixation'){
     rodActive=isRod(ev.target.value);
     if(rodActive){ev.stopImmediatePropagation();ensureRod();try{updatePreview()}catch(_){}}
   }else if(rodActive&&['eWidth','eFinish','eLining','eModel','eFixColor','eFinishPleat','eLiningPleat','eWaveMount'].includes(ev.target?.id)){
     setTimeout(()=>{ensureRod();try{updatePreview()}catch(_){ }},0);
   }
 },true);
 document.addEventListener('input',ev=>{if(rodActive&&ev.target?.id==='eWidth')setTimeout(ensureRod,200)},true);
 const originalEnv=envFromForm;
 envFromForm=function(){if(rodActive)ensureRod();const env=originalEnv();if(rodActive){const p=officialProductById(el('eRailProduct')?.value);env.fixation=rodName;env.railProductId=p?.id||null;env.fixProductId=p?.id||null;env.railProductName=p?.product_name||'';env.fixProductName=p?.product_name||'';env.railInternalCode=p?.internal_code||'';env.fixColor=p?.color||el('eFixColor')?.value||'';env.waveMount=el('eWaveMount')?.value||'PAREDE'}return env};
 const origCalcEnvironment=calcEnvironment;
 calcEnvironment=function(e){const previous=currentCalcEnv;currentCalcEnv=e;try{return origCalcEnvironment(e)}finally{currentCalcEnv=previous}};
 const origFixCalc=fixationCalc;
 fixationCalc=function(kind,w,model,leaves,color,id,supportMaterial){
   const f=origFixCalc.apply(this,arguments);
   if(!f)return f;
   if(isRod(kind)){
     const mount=currentCalcEnv?.waveMount||(rodActive?el('eWaveMount')?.value:'PAREDE')||'PAREDE';
     const oldQty=Number(f.supports||0),oldProduct=officialProductById(f.supportProductId),oldValue=oldQty*Number(oldProduct?.price_4x||0);
     let qty,prod;
     if(mount==='TETO'){
       qty=Math.max(2,Math.ceil(Number(w||0)/0.60));
       prod=(priceProducts||[]).find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TETO')&&fold(p.product_name).includes('WAVE'));
     }else{
       qty=Number(w)<=2?2:Number(w)<=3.5?3:Number(w)<=4.5?4:5;
       prod=oldProduct;
     }
     // Nunca cobra material inexistente silenciosamente.
     if(!prod){f.detail=(f.detail||'')+' • FIXADOR NÃO CADASTRADO';return f}
     const total=Number(f.total||0)-oldValue+qty*Number(prod.price_4x||0);
     f.total=total;f.hardwareBase=total;f.supports=qty;f.supportProductId=prod.id;f.supportName=prod.product_name;
     f.detail=`${f.railName||rodName} • ${f.railColor||color} • ${mount} • ${qty} ${mount==='TETO'?'garras':'suportes'}`;
   }
   if(isSquare(kind)){
     const layers=currentCalcEnv?.model==='COMPLETE'?2:1;
     const oldQty=Number(f.clamps||0),oldP=officialProductById(f.clawProductId);
     const colorWanted=fold(f.railColor||color);
     const good=(priceProducts||[]).find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TRILHO')&&fold(p.product_name).includes('SIMPLES')&&fold(p.color)===colorWanted)
       ||(priceProducts||[]).find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TRILHO')&&fold(p.product_name).includes('SIMPLES'));
     if(!good){f.detail=(f.detail||'')+' • GARRA SIMPLES NÃO CADASTRADA';return f}
     const qty=Math.max(2,Math.ceil(Number(w||0)/0.60))*layers;
     const delta=qty*Number(good.price_4x||0)-oldQty*Number(oldP?.price_4x||0);
     f.total=Number(f.total||0)+delta;f.hardwareBase=Number(f.hardwareBase||0)+delta;f.clamps=qty;f.clawProductId=good.id;
     f.detail=`${f.railName||kind} • ${layers} trilho(s) • ${qty} garras simples`;
   }
   return f;
 };
 const origReq=officialOrderRequirements;
 officialOrderRequirements=function(q){
   const rows=origReq(q)||[];
   for(const env of q?.environments||[]){
     if(env.excludeFixation)continue;
     const c=calcEnvironment(env),f=c?.fixationCalc||{};
     if(isRod(env.fixation)||isSquare(env.fixation)){
       // Remove somente fixadores da fixação especial do ambiente; preserva acessórios dos tecidos.
       for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(String(r.environment||'')!==String(env.name||''))continue;
         if(fold(r.product_name).includes('GARRA TRILHO 3 VIAS')||(fold(r.product_name).includes('GARRA')&&isSquare(env.fixation))||(fold(r.product_name).includes('SUPORTE')&&isRod(env.fixation)))rows.splice(i,1);
       }
       const p=officialProductById(isRod(env.fixation)?f.supportProductId:f.clawProductId),qty=isRod(env.fixation)?Number(f.supports||0):Number(f.clamps||0);
       if(p&&qty>0)rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment:env.name,source:'FIXAÇÃO CORRIGIDA V14.3',cost:Number(p.cost||0),price_4x:Number(p.price_4x||0),price_cash:Number(p.price_cash||0),price_18x:Number(p.price_18x||0)});
     }
   }
   return rows;
 };
 // Itens avulsos vinculados ao ambiente: persistem em D1 dentro do próprio orçamento, sem esquema novo.
 const reqBeforeExtras=officialOrderRequirements;
 officialOrderRequirements=function(q){const rows=reqBeforeExtras(q)||[];for(const env of q?.environments||[])for(const item of env.manualExtraItems||[]){const qty=Number(item.qty||0);if(qty<=0)continue;rows.push({...item,environment:env.name,qty,source:'ITEM AVULSO DO AMBIENTE'})}return rows};
 const calcBeforeExtras=calcEnvironment;
 calcEnvironment=function(e){const c=calcBeforeExtras(e);if(!c)return c;let extra=0;for(const r of e.manualExtraItems||[])extra+=Math.max(0,Number(r.qty||0))*Math.max(0,Number(r.price_4x||0));if(!extra)return c;c.base4=Number(c.base4||0)+extra;const t=db.priceConfig?.terms||{};c.cash=c.base4*(1-Number(t.cashDiscountPct||0)/100);c.p18=c.base4*(1+Number(t.p18AddPct||0)/100);return c};
 function home(){
   const wrap=el('niHomeShortcuts');if(!wrap)return;
   wrap.innerHTML='';for(const [id,name,symbol] of ids){const b=document.createElement('button');b.type='button';b.className='ni-home-link';b.innerHTML=`<span class="ni-home-icon" aria-hidden="true">${symbol}</span><span>${name}</span>`;b.onclick=()=>setView(id);wrap.appendChild(b)}
   const target=el('ni143Alerts');if(!target)return;
   const ignored=(()=>{try{return JSON.parse(localStorage.getItem('ni143IgnoredAlerts')||'{}')}catch(_){return {}}})();
   const alerts=[];const day=today();
   for(const a of db.purchaseAlerts||[]){if(a.resolved||!isGestor())continue;const order=(db.orders||[]).find(o=>Number(o.numero)===Number(a.orderNumber));if(!order)continue;alerts.push({key:'compra-'+a.id,type:'COMPRA PENDENTE',description:`Pedido ${order.numero} • ${order.client||''}`,open:()=>openPurchase(null,'',order,a)})}
   for(const o of db.orders||[]){const date=o.installation?.scheduledDate||o.deliveryDate;if(date!==day||o.installation?.completedDate)continue;if(!(isGestor()||isProduction()||canSeeOrder(o)))continue;alerts.push({key:'instalacao-'+o.id+'-'+date,type:'INSTALAÇÃO DE HOJE',description:`Pedido ${o.numero} • ${o.client||''}`,open:()=>setView('install')})}
   for(const a of agendaVisibleItems().filter(a=>a.date===day)){alerts.push({key:'agenda-'+(a.id||a.date+'-'+a.time+'-'+a.description),type:'COMPROMISSO DE HOJE',description:`${a.time||''} • ${a.client||''} • ${a.description||''}`,open:()=>setView('agenda')})}
   const visible=alerts.filter(a=>!ignored[a.key]);target.innerHTML='';
   if(!visible.length){target.innerHTML='<div class="ni-alert">Tudo em ordem por enquanto. Nenhum alerta pendente.</div>';return}
   for(const a of visible){const row=document.createElement('div');row.className='ni-alert';const info=document.createElement('div');info.className='ni-alert-info';const strong=document.createElement('strong');strong.textContent=a.type;const desc=document.createElement('span');desc.textContent=a.description;info.append(strong,desc);const actions=document.createElement('div');actions.className='ni-alert-actions';const ignore=document.createElement('button');ignore.type='button';ignore.className='btn secondary';ignore.textContent='IGNORAR';ignore.onclick=()=>{ignored[a.key]=true;try{localStorage.setItem('ni143IgnoredAlerts',JSON.stringify(ignored))}catch(_){}row.remove();if(!target.children.length)target.textContent='Tudo em ordem por enquanto. Nenhum alerta pendente.'};const view=document.createElement('button');view.type='button';view.className='btn primary';view.textContent='VER';view.onclick=a.open;actions.append(ignore,view);row.append(info,actions);target.appendChild(row)}
 }
 const origHome=renderHome;
 renderHome=function(){origHome();home()};
 document.addEventListener('DOMContentLoaded',()=>{home();const select=el('eFixation');if(select&&isRod(select.value)){rodActive=true;ensureRod()}});
})();
