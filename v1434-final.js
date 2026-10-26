/* V14.3.4 — layout final da home + correções consolidadas de fixação. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
const ROD_NAME='VARÃO WAVE COM COMANDO POR CORDA';
const isSquareFix=s=>fold(s)==='TRILHO SQUARE COM COMANDO';
const isRodFix=s=>fold(s)===fold(ROD_NAME);
const isRodProduct=p=>fold(p?.product_name).startsWith('VARAO COM COMANDO POR CORDA');
const shortcuts=[
  {view:'agenda',label:'AGENDA',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></svg>`},
  {view:'quote',label:'NOVO<br>ORÇAMENTO',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>`},
  {view:'quotes',label:'ORÇAMENTOS',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M14 3v5h5"></path></svg>`},
  {view:'orders',label:'PEDIDOS',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 8H7"></path></svg>`},
  {view:'production',label:'PRODUÇÃO',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"></path></svg>`},
  {view:'install',label:'INSTALAÇÕES',icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.9l-5.5 5.5 2.8 2.8 5.5-5.5a4 4 0 0 0 5.9-5.4l-3 3-2.3-.3-.3-2.3 3-3z"></path></svg>`}
];
function injectStyle(){
  if($('v1434-final-style')) return;
  const style=document.createElement('style');
  style.id='v1434-final-style';
  style.textContent=`
  .ni-home{padding:0 2px 6px}
  .ni-home-banner{background:linear-gradient(90deg,#06585b 0%,#07887f 100%);border-radius:22px;min-height:92px;padding:16px 24px;display:flex;align-items:center;gap:22px;color:#fff;box-shadow:0 10px 22px rgba(0,96,91,.14)}
  .ni-home-banner img{width:58px;height:58px;object-fit:contain;border:8px solid #fff;background:#fff;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
  .ni-home-intro{flex:1;min-width:0}
  .ni-home-intro h1{font-size:22px;line-height:1.15;letter-spacing:.01em;color:#fff;margin:0 0 4px;font-weight:900}
  .ni-home-intro strong{display:block;font-size:12px;letter-spacing:.02em;color:#d9efea;font-weight:700}
  .ni-home-clock{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
  .ni-home-clock strong{font-size:28px;line-height:1;font-weight:900;color:#fff}
  .ni-home-clock span{text-transform:capitalize;font-size:12px;color:#def1ef}
  .ni-home-links{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin:22px 0}
  .ni-home-link{background:#fff;border:1px solid #d9e6e4;border-radius:19px;padding:16px 8px 14px;min-height:130px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#075b5b;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 3px 12px rgba(0,72,69,.08);text-align:center;line-height:1.18}
  .ni-home-link:hover{background:#f7fbfa;transform:translateY(-1px)}
  .ni-home-link .ni-home-icon{width:52px;height:52px;border-radius:14px;background:#eaf4f2;display:grid;place-items:center;color:#0c6a67}
  .ni-home-link .ni-home-icon svg{width:24px;height:24px}
  .ni-home-quote{border-top:1px solid #d9e6e4;border-bottom:1px solid #d9e6e4;margin:4px 0 18px;padding:18px 0 20px;text-align:center;color:#557875}
  .ni-home-quote blockquote{font-style:italic;font-size:17px;line-height:1.45;margin:0 0 6px}
  .ni-home-quote strong{display:block;font-size:13px;color:#0a6360}
  .ni-home-alerts{border-top:none;padding-top:0;margin-top:0}
  .ni-home-alerts h2{display:none}
  .ni-alert-empty,.ni-alert{background:#f8faf9;border:1px dashed #d7e4e1;border-radius:14px;padding:18px 16px;color:#496866}
  .ni-alert{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;background:#f7efd9;border:1px solid #e5d6a9;box-shadow:none;padding:12px 14px}
  .ni-alert-info{flex:1;font-size:12px;line-height:1.35}
  .ni-alert-info strong{display:block;color:#ac6e06;font-size:12px;font-weight:900;text-transform:uppercase;margin-bottom:2px}
  .ni-alert-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .ni-alert-actions .btn{font-size:12px;height:32px;padding:0 12px;border-radius:8px}
  .ni-alert-actions .btn.primary{background:#0b7a76;border-color:#0b7a76}
  .ni-alert-actions .btn.secondary{background:#fff;border-color:#d0d6d8;color:#324d4d}
  @media (max-width:1180px){.ni-home-links{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @media (max-width:700px){.ni-home-banner{padding:14px 16px;gap:14px;flex-wrap:wrap}.ni-home-clock{width:100%;align-items:flex-start;text-align:left}.ni-home-links{grid-template-columns:repeat(2,minmax(0,1fr))}.ni-alert{flex-wrap:wrap}.ni-alert-actions{width:100%}}
  `;
  document.head.appendChild(style);
}
function shortcutMarkup(){
  return shortcuts.map(item=>`<button type="button" class="ni-home-link" data-v1434-view="${item.view}"><span class="ni-home-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span></button>`).join('');
}
function getIgnored(){ try{return JSON.parse(localStorage.getItem('ni1434IgnoredAlerts')||'{}')}catch(_){return{}} }
function setIgnored(v){ try{localStorage.setItem('ni1434IgnoredAlerts',JSON.stringify(v))}catch(_){} }
function buildAlerts(){
  const ignored=getIgnored();
  const alerts=[];
  const day=(typeof today==='function'?today():new Date().toISOString().slice(0,10));
  if(typeof db!=='undefined'){
    for(const a of (db.purchaseAlerts||[])){
      if(a.resolved||!(typeof isGestor==='function'&&isGestor())) continue;
      const order=(db.orders||[]).find(o=>Number(o.numero)===Number(a.orderNumber));
      if(!order) continue;
      alerts.push({key:'compra-'+a.id,title:'VOCÊ TEM MATERIAIS PARA SOLICITAR!',description:`Pedido ${String(order.numero).padStart(6,'0')} • ${order.client||''}${order.installation?.scheduledDate?` • Instalação: ${order.installation.scheduledDate}`:''}`,open:()=>typeof openPurchase==='function'&&openPurchase(null,'',order,a)});
    }
    for(const o of (db.orders||[])){
      const date=o.installation?.scheduledDate||o.deliveryDate;
      if(date!==day||o.installation?.completedDate) continue;
      if(typeof isGestor==='function' && !(isGestor()||(typeof isProduction==='function'&&isProduction())||(typeof canSeeOrder==='function'&&canSeeOrder(o)))) continue;
      alerts.push({key:'instalacao-'+o.id+'-'+date,title:'VOCÊ TEM INSTALAÇÕES PARA HOJE!',description:`Pedido ${String(o.numero).padStart(6,'0')} • ${o.client||''} • ${date}`,open:()=>typeof setView==='function'&&setView('install')});
    }
  }
  if(typeof agendaVisibleItems==='function'){
    for(const a of agendaVisibleItems().filter(x=>x.date===day)){
      alerts.push({key:'agenda-'+(a.id||a.date+'-'+a.time+'-'+a.description),title:'VOCÊ TEM COMPROMISSOS NA AGENDA!',description:`${a.time||''} ${a.client?`• ${a.client}`:''} ${a.description?`• ${a.description}`:''}`.trim(),open:()=>typeof setView==='function'&&setView('agenda')});
    }
  }
  return alerts.filter(a=>!ignored[a.key]);
}
function renderHomeExact(){
  injectStyle();
  const shortcutsWrap=$('niHomeShortcuts');
  if(shortcutsWrap){
    shortcutsWrap.innerHTML=shortcutMarkup();
    shortcutsWrap.querySelectorAll('[data-v1434-view]').forEach(btn=>btn.addEventListener('click',()=>{ if(typeof setView==='function') setView(btn.dataset.v1434View); }));
  }
  const quote=$('homeQuote')?.parentElement;
  const alertsSection=document.querySelector('#view-home .ni-home-alerts');
  if(quote&&alertsSection&&quote.nextElementSibling!==alertsSection){
    alertsSection.parentNode.insertBefore(quote,alertsSection);
  }
  const versionLabel=document.querySelector('.ni-home-intro strong');
  if(versionLabel) versionLabel.textContent='ERP NOVA IMAGEM • V14.3.4';
  const alertHost=$('ni1434Alerts');
  if(!alertHost) return;
  const items=buildAlerts();
  if(!items.length){
    alertHost.innerHTML='<div class="ni-alert-empty">Tudo em ordem por enquanto. Nenhum alerta pendente.</div>';
    return;
  }
  alertHost.innerHTML='';
  const ignored=getIgnored();
  items.forEach(item=>{
    const row=document.createElement('div');
    row.className='ni-alert';
    row.innerHTML=`<div class="ni-alert-info"><strong>${item.title}</strong><span>${item.description}</span></div><div class="ni-alert-actions"><button type="button" class="btn primary">VER</button><button type="button" class="btn secondary">IGNORAR</button></div>`;
    const [ver,ignorar]=row.querySelectorAll('button');
    ver.onclick=()=>item.open&&item.open();
    ignorar.onclick=()=>{ignored[item.key]=true;setIgnored(ignored);row.remove();if(!alertHost.children.length)alertHost.innerHTML='<div class="ni-alert-empty">Tudo em ordem por enquanto. Nenhum alerta pendente.</div>'};
    alertHost.appendChild(row);
  });
}

/* ===== Correção consolidada do varão com comando por corda ===== */
if(typeof envFromForm==='function'){
  const prevEnvFromForm=envFromForm;
  envFromForm=function(){
    const env=prevEnvFromForm();
    const p=(typeof officialProductById==='function')?officialProductById($('eRailProduct')?.value):null;
    if(isRodProduct(p) || isRodFix($('eFixation')?.value)){
      env.fixation=ROD_NAME;
      env.railProductId=p?.id||env.railProductId||null;
      env.fixProductId=p?.id||env.fixProductId||null;
      env.railProductName=p?.product_name||env.railProductName||'';
      env.fixProductName=p?.product_name||env.fixProductName||'';
      env.railInternalCode=p?.internal_code||env.railInternalCode||'';
      env.fixColor=p?.color||env.fixColor||$('eFixColor')?.value||'';
      env.waveMount=$('eWaveMount')?.value||env.waveMount||'PAREDE';
    }
    return env;
  };
}
function rodSupportProduct(mount,currentColor,currentSupportProductId){
  const items=(typeof priceProducts!=='undefined'?priceProducts:[])||[];
  if(fold(mount)==='TETO'){
    return items.find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TETO')&&fold(p.product_name).includes('WAVE'))||null;
  }
  return (typeof officialProductById==='function'&&currentSupportProductId)?officialProductById(currentSupportProductId):null;
}
function rodSupportQty(widthMeters,mount){
  if(fold(mount)==='TETO') return Math.max(2,Math.ceil(Number(widthMeters||0)/0.60));
  const w=Number(widthMeters||0);
  return w<=2?2:w<=3.5?3:w<=4.5?4:5;
}
if(typeof calcEnvironment==='function'){
  const prevCalcEnvironment=calcEnvironment;
  calcEnvironment=function(env){
    const c=prevCalcEnvironment(env);
    if(!c||env?.excludeFixation) return c;
    const selected=(typeof officialProductById==='function')?officialProductById(env.railProductId||env.fixProductId||$('eRailProduct')?.value):null;
    const rodMode=isRodFix(env.fixation)||isRodProduct(selected);
    if(rodMode && c.fixationCalc){
      const f=c.fixationCalc;
      const widthM=Number(env.width||0)/100;
      const mount=env.waveMount||$('eWaveMount')?.value||'PAREDE';
      const qty=rodSupportQty(widthM,mount);
      const oldP=(typeof officialProductById==='function')?officialProductById(f.supportProductId):null;
      const prod=rodSupportProduct(mount,env.fixColor||selected?.color,f.supportProductId);
      if(prod){
        const delta=qty*Number(prod.price_4x||0)-Number(f.supports||0)*Number(oldP?.price_4x||0);
        f.supports=qty;
        f.supportProductId=prod.id;
        f.supportName=prod.product_name;
        f.detail=`${selected?.product_name||ROD_NAME} • ${(selected?.color||env.fixColor||'').trim()} • ${mount} • ${qty} ${fold(mount)==='TETO'?'garras':'suportes'}`;
        f.total=Number(f.total||0)+delta;
        f.hardwareBase=Number(f.hardwareBase||0)+delta;
        c.base4=Number(c.base4||0)+delta;
        const terms=db?.priceConfig?.terms||{};
        c.cash=c.base4*(1-Number(terms.cashDiscountPct||0)/100);
        c.p18=c.base4*(1+Number(terms.p18AddPct||0)/100);
      }
    }
    if(isSquareFix(env.fixation) && c.fixationCalc){
      const f=c.fixationCalc;
      const widths=(env.angle&&Number(env.angleA)>0&&Number(env.angleB)>0)?[Number(env.angleA||0),Number(env.angleB||0)]:[Number(env.width||0)];
      const layers=env.model==='COMPLETE'?2:1;
      const qty=widths.reduce((sum,w)=>sum+Math.max(2,Math.ceil(Number(w||0)/60)),0)*layers;
      const items=(typeof priceProducts!=='undefined'?priceProducts:[])||[];
      const wanted=fold(f.railColor||env.fixColor||selected?.color);
      const prod=items.find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TRILHO')&&fold(p.product_name).includes('SIMPLES')&&fold(p.color)===wanted)
        || items.find(p=>Number(p.active??1)===1&&fold(p.product_name).includes('GARRA')&&fold(p.product_name).includes('TRILHO')&&fold(p.product_name).includes('SIMPLES'));
      const oldP=(typeof officialProductById==='function')?officialProductById(f.clawProductId):null;
      if(prod){
        const delta=qty*Number(prod.price_4x||0)-Number(f.clamps||0)*Number(oldP?.price_4x||0);
        f.clamps=qty;
        f.clawProductId=prod.id;
        f.clawName=prod.product_name;
        f.detail=`${f.railName||env.fixation} • ${layers} trilho(s) • ${qty} garras simples`;
        f.total=Number(f.total||0)+delta;
        f.hardwareBase=Number(f.hardwareBase||0)+delta;
        c.base4=Number(c.base4||0)+delta;
        const terms=db?.priceConfig?.terms||{};
        c.cash=c.base4*(1-Number(terms.cashDiscountPct||0)/100);
        c.p18=c.base4*(1+Number(terms.p18AddPct||0)/100);
      }
    }
    return c;
  };
}
if(typeof officialOrderRequirements==='function'){
  const prevRequirements=officialOrderRequirements;
  officialOrderRequirements=function(q){
    const rows=prevRequirements(q)||[];
    const envs=q?.environments||[];
    envs.forEach(env=>{
      if(env?.excludeFixation) return;
      const onlyThis=envs.length===1;
      const envName=String(env.name||'');
      if(isSquareFix(env.fixation)){
        const calc=typeof calcEnvironment==='function'?calcEnvironment(env):null;
        const f=calc?.fixationCalc||{};
        for(let i=rows.length-1;i>=0;i--){
          const r=rows[i],name=fold(r.product_name),sameEnv=String(r.environment||'')===envName;
          if((sameEnv||onlyThis) && name.includes('GARRA') && name.includes('TRILHO')) rows.splice(i,1);
        }
        const p=(typeof officialProductById==='function')?officialProductById(f.clawProductId):null;
        const qty=Number(f.clamps||0);
        if(p&&qty>0) rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment:env.name,source:'V14.3.4 SQUARE',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)});
      }
      const pSel=(typeof officialProductById==='function')?officialProductById(env.railProductId||env.fixProductId):null;
      if(isRodFix(env.fixation)||isRodProduct(pSel)){
        const calc=typeof calcEnvironment==='function'?calcEnvironment(env):null;
        const f=calc?.fixationCalc||{};
        for(let i=rows.length-1;i>=0;i--){
          const r=rows[i],name=fold(r.product_name),sameEnv=String(r.environment||'')===envName;
          if((sameEnv||onlyThis) && (name.includes('SUPORTE')||name.includes('GARRA'))) rows.splice(i,1);
        }
        const p=(typeof officialProductById==='function')?officialProductById(f.supportProductId):null;
        const qty=Number(f.supports||0);
        if(p&&qty>0) rows.push({product_id:Number(p.id),internal_code:p.internal_code,product_name:p.product_name,color:p.color,unit:p.unit||'UN',qty,environment:env.name,source:'V14.3.4 VARÃO COM COMANDO',cost:Number(p.cost||0),markup_percent:Number(p.markup_percent||0),price_cash:Number(p.price_cash||0),price_4x:Number(p.price_4x||0),price_18x:Number(p.price_18x||0)});
      }
    });
    return rows;
  };
}

function install(){ renderHomeExact(); }
if(typeof renderHome==='function'){
  const prevRenderHome=renderHome;
  renderHome=function(){ prevRenderHome(); install(); };
}
document.addEventListener('DOMContentLoaded',()=>{ setTimeout(install,0); });
})();
