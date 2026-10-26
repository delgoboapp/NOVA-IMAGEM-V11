/* V14.2.1 - UI safe fixes; no database writes or pricing overrides. */
(function(){'use strict';
 const fix=document.getElementById('eFixation');
 if(!fix)return;
 const canonical='TRILHO SQUARE COM COMANDO';
 const options=['TRILHO MOTORIZADO','TRILHO SUÍÇO','VARÃO WAVE','VARÃO WAVE COM COMANDO POR CORDA',canonical];
 let busy=false,previous='';
 function normalize(){
  if(busy)return;
  const before=fix.value;
  const exists=[...fix.options].map(x=>x.value);
  const need=options.some(x=>!exists.includes(x))||exists.some(x=>/SEM TRILHO E SEM INSTALAÇÃO|VARÃO WAVE SEM INSTALAÇÃO/.test(x));
  if(!need)return;
  busy=true;
  try{
   const valid=before&&options.includes(before)?before:(previous&&options.includes(previous)?previous:'TRILHO SUÍÇO');
   fix.replaceChildren(...options.map(x=>new Option(x,x)));
   fix.value=valid;
  }finally{busy=false}
 }
 const observer=new MutationObserver(()=>normalize());
 observer.observe(fix,{childList:true,subtree:true});
 fix.addEventListener('change',()=>{previous=fix.value;queueMicrotask(normalize)});
 document.addEventListener('DOMContentLoaded',normalize);normalize();
})();
