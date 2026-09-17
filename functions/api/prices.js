import {verifyToken,json} from './_shared.js';

export async function onRequestGet(context){
  const user=await verifyToken(context.env,context.request);

  if(!user){
    return json({error:'Sessão inválida ou expirada.'},401);
  }

  try{
    if(!context.env.DB){
      throw new Error('D1 binding DB não configurado.');
    }

    const result=await context.env.DB.prepare(`
      SELECT
        id,
        internal_code,
        supplier_code,
        category,
        supplier,
        product_name,
        color,
        width_cm,
        unit,
        stock_quantity,
        multiplier,
        cost,
        markup_percent,
        price_cash,
        price_4x,
        price_18x,
        ncm,
        cfop_internal,
        cfop_interstate,
        active,
        price_manual,
        created_at,
        updated_at
      FROM price_products
      ORDER BY category, product_name, color, internal_code
    `).all();

    return json({
      ok:true,
      products:result.results||[]
    });

  }catch(e){
    return json({
      error:e?.message||'Não foi possível carregar a tabela de preços.'
    },500);
  }
}

export function onRequest(){
  return json({error:'Método não permitido.'},405);
}
