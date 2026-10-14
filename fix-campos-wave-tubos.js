/* Nova Imagem: correção restrita aos controles de montagem, 14/10/2026. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const tidy=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
const isTube=()=>['eFinishPleat','eLiningPleat'].some(id=>/ILHOS|ARGOLAS/.test(tidy($(id)?.value)));
function display(el,visible){
 if(!el)return;
 el.classList.toggle('hidden',!visible);
 el.style.setProperty('display',visible?'block':'none','important');
}
function synchronize(){
 const kind=tidy($('eFixation')?.value);
 const tube=isTube();
 const wave=!tube&&kind==='VARAO WAVE';
 display($('eWaveMountWrap'),wave);
 display($('eRailProductWrap'),!tube&&['VARAO WAVE','TRILHO SUICO','TRILHO MOTORIZADO','VARAO WAVE COM COMANDO POR CORDA'].includes(kind));
 if(wave && !$('eWaveMount')?.value)$('eWaveMount').value='PAREDE';
 if(!tube)return;
 const f=$('eFinishTube'),l=$('eLiningTube');
 if(!f||!l||!f.value)return;
 const prod=(typeof officialProductById==='function')?officialProductById(f.value):null;
 if(!prod)return;
 const color=tidy(prod.color);
 const size=/19MM/.test(tidy($('eLiningPleat')?.value))?'19':'28';
 const candidates=Array.from(l.options);
 let target=candidates.find(option=>{
  const product=(typeof officialProductById==='function')?officialProductById(option.value):null;
  return product&&tidy(product.color)===color&&tidy(product.product_name).includes('TUBO '+size+' MM');
 });
 if(target&&l.value!==target.value){l.value=target.value;l.dispatchEvent(new Event('input',{bubbles:false}));}
}
let busy=false;
function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;synchronize()});}
function init(){
 synchronize();
 for(const id of ['eFixation','eFinishPleat','eLiningPleat','eModel','eFinishTube','eWaveMount']){
  $(id)?.addEventListener('change',schedule);
 }
 // Atualizações programáticas do ERP não disparam evento 'change'.
 const boxes=['eWaveMountWrap','eRailProductWrap','eFixationWrap','eFinishTubeWrap','eLiningTubeWrap'];
 const observer=new MutationObserver(records=>{
  if(records.some(r=>boxes.includes(r.target.id)))schedule();
 });
 boxes.forEach(id=>{const el=$(id);if(el)observer.observe(el,{attributes:true,attributeFilter:['class']});});
 synchronize();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
