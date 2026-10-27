/* Nova Imagem V14.3.8 — deslizantes WAVE por camada da cortina completa.
   Aplicado por último para impedir que adaptadores antigos restaurem 1/5 cm.
   Largura pronta em centímetros; cada camada da cortina completa: 1/3 cm;
   cortina simples: 1/5 cm. Quantidades inteiras; completa arredonda
   o total para multiplo de 4. Não altera quantidades manuais já lançadas. */
(function(){'use strict';
  const previousCalc=calcEnvironment;
  calcEnvironment=function(e){
    const c=previousCalc(e);if(!c)return c;
    const complete=e.model==='COMPLETE' || (!!c.finishCalc&&!!c.liningCalc);
    const fw=!!c.finishCalc&&e.finishPleat==='WAVE';
    const lw=!!c.liningCalc&&e.liningPleat==='WAVE';
    if(!fw&&!lw)return c;
    const segments=e.angle&&Number(e.angleA)>0&&Number(e.angleB)>0
      ?[Number(e.angleA),Number(e.angleB)]:[Number(e.width||0)];
    const perLayer=segments.reduce((s,w)=>s+Math.ceil(Math.max(0,w)/(complete?3:5)),0);
    const target=complete?Math.ceil((perLayer*2)/4)*4:perLayer;
    // Duas camadas WAVE compartilham a quantidade total; quando uma
    // camada nao e WAVE, o SKU unico da cortina deve carregar o total.
    const finishQty=fw?(lw?Math.ceil(target/2):target):0;
    const liningQty=lw?(fw?target-finishQty:target):0;
    const oldPrice=Number(c.sliderCost||0);
    const finishPrice=Number(db.priceConfig?.sliders?.finish||0);
    const liningPrice=Number(db.priceConfig?.sliders?.lining||0);
    const newPrice=finishQty*finishPrice+liningQty*liningPrice;
    c.finishSliders=finishQty;c.liningSliders=liningQty;
    c.sliderQtyPerLayer=perLayer;c.sliderCost=newPrice;
    const delta=newPrice-oldPrice;
    c.base4=Number(c.base4||0)+delta;
    const terms=db.priceConfig?.terms||{};
    c.cash=c.base4*(1-Number(terms.cashDiscountPct||0)/100);
    c.p18=c.base4*(1+Number(terms.p18AddPct||0)/100);
    return c;
  };
})();
