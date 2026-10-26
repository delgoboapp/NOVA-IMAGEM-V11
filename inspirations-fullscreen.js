/* V14.2.4 — Fullscreen inspirations viewer. Presentation-only: no D1/R2 writes. */
(()=>{
  'use strict';
  let overlay=null,previousFocus=null,previousOverflow='';
  function closeViewer(){
    if(!overlay)return;
    overlay.remove();overlay=null;
    document.body.style.overflow=previousOverflow;
    document.removeEventListener('keydown',onKey);
    if(previousFocus&&document.contains(previousFocus))previousFocus.focus({preventScroll:true});
    previousFocus=null;
  }
  function onKey(e){if(e.key==='Escape'){e.preventDefault();closeViewer();}}
  function showViewer(img){
    if(!img||!img.getAttribute('src'))return;
    closeViewer();
    previousFocus=document.activeElement;
    previousOverflow=document.body.style.overflow;
    overlay=document.createElement('div');overlay.className='ni-insp-fullscreen';
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Foto da inspiração em tela cheia');
    const back=document.createElement('button');back.type='button';back.className='ni-insp-return';back.textContent='← RETORNAR';back.addEventListener('click',closeViewer);
    const photo=document.createElement('img');photo.src=img.currentSrc||img.src;photo.alt=img.alt||'Foto de inspiração';photo.decoding='async';
    overlay.append(back,photo);overlay.addEventListener('click',e=>{if(e.target===overlay)closeViewer()});
    document.body.appendChild(overlay);document.body.style.overflow='hidden';document.addEventListener('keydown',onKey);back.focus();
  }
  // Delegated click works with dynamically refreshed inspiration galleries and R2 image URLs.
  document.addEventListener('click',e=>{
    const img=e.target.closest?.('.inspiration-card > img, .site-featured-card > img');
    if(!img)return;
    e.preventDefault();showViewer(img);
  });
})();
