import {verifyToken,json} from './_shared.js';

function gestorOnly(user){
  return user && String(user.role||'').toLowerCase()==='gestor';
}

function text(v){
  return String(v??'').trim();
}

function num(v,def=0){
  const n=Number(v);
  return Number.isFinite(n)?n:def;
}

async function getProduct(env,id){
  return await env.DB.prepare(
    'SELECT * FROM price_products WHERE id = ?'
  ).bind(Number(id)).first();
}

async function history(env,{
  productId,
  internalCode,
  action,
  fieldName='',
  oldValue='',
  newValue='',
  reason='',
  changedBy=''
}){
  await env.DB.prepare(`
    INSERT INTO price_product_history
    (
      product_id,
      internal_code,
      action,
      field_name,
      old_value,
      new_value,
      reason,
      changed_by
    )
    VALUES (?,?,?,?,?,?,?,?)
  `).bind(
    Number(productId),
    text(internalCode),
    text(action),
    text(fieldName),
    text(oldValue),
    text(newValue),
    text(reason),
    text(changedBy)
  ).run();
}

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

export async function onRequestPost(context){
  const user=await verifyToken(context.env,context.request);

  if(!user){
    return json({error:'Sessão inválida ou expirada.'},401);
  }

  try{
    if(!context.env.DB){
      throw new Error('D1 binding DB não configurado.');
    }

    const body=await context.request.json();
    const action=text(body.action).toUpperCase();

    if(action==='CONSUMIR_PEDIDO'||action==='ESTORNAR_PEDIDO'){
      const items=Array.isArray(body.items)?body.items:[];
      const orderNumber=text(body.order_number);
      if(!items.length)return json({error:'Nenhum item de estoque informado.'},400);
      const prepared=[];
      for(const item of items){
        const id=Number(item.product_id),qty=num(item.qty,0);
        if(!id||qty<=0)return json({error:'Item ou quantidade inválida para movimentação.'},400);
        const product=await getProduct(context.env,id);
        if(!product)return json({error:`Produto oficial não encontrado: ${id}.`},404);
        if(Number(product.active)===0)return json({error:`Produto inativo: ${product.internal_code}.`},400);
        const current=Number(product.stock_quantity||0);
        const isRestore=action==='ESTORNAR_PEDIDO';
        const next=isRestore?current+qty:current-qty;
        const name=text(product.product_name).toUpperCase();
        const allowNegative=name.includes('MOTORIZAD')||(name.includes('VARÃO')&&name.includes('COMANDO'));
        if(!isRestore&&!allowNegative&&next<0){
          return json({error:`Estoque insuficiente de ${product.product_name} / ${product.color||'-'}. Necessário ${qty.toFixed(String(product.unit).toUpperCase()==='M'?2:0)} ${product.unit||'UN'}; disponível ${current.toFixed(String(product.unit).toUpperCase()==='M'?2:0)} ${product.unit||'UN'}.`},400);
        }
        prepared.push({product,qty,current,next,environment:text(item.environment)});
      }
      const statements=[];
      for(const x of prepared){
        statements.push(context.env.DB.prepare(`UPDATE price_products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(x.next,Number(x.product.id)));
        statements.push(context.env.DB.prepare(`INSERT INTO price_product_history (product_id,internal_code,action,field_name,old_value,new_value,reason,changed_by) VALUES (?,?,?,?,?,?,?,?)`).bind(Number(x.product.id),text(x.product.internal_code),action,'stock_quantity',String(x.current),String(x.next),`${action==='ESTORNAR_PEDIDO'?'Estorno':'Saída'} do pedido ${orderNumber}${x.environment?' • '+x.environment:''}`,text(user.username)));
      }
      await context.env.DB.batch(statements);
      return json({ok:true,movements:prepared.map(x=>({product_id:Number(x.product.id),internal_code:x.product.internal_code,product_name:x.product.product_name,color:x.product.color,unit:x.product.unit,qty:x.qty,before:x.current,after:x.next}))});
    }

    if(!gestorOnly(user)){
      return json({error:'Apenas usuários GESTOR podem editar ou inativar produtos.'},403);
    }

    if(action==='EDITAR'){
      const id=Number(body.id);
      const reason=text(body.reason);

      if(!id){
        return json({error:'Produto inválido.'},400);
      }

      if(!reason){
        return json({
          error:'Informe o motivo da alteração.'
        },400);
      }

      const product=await getProduct(context.env,id);

      if(!product){
        return json({error:'Produto não encontrado.'},404);
      }

      if(Number(product.active)===0){
        return json({error:'Produto inativo não pode ser editado.'},400);
      }

      const stockQuantity=num(body.stock_quantity,Number(product.stock_quantity||0));
      const cost=num(body.cost,Number(product.cost||0));
      const markupPercent=num(body.markup_percent,Number(product.markup_percent||0));

      if(stockQuantity<0){
        return json({error:'A quantidade não pode ser negativa.'},400);
      }

      if(cost<0){
        return json({error:'O custo não pode ser negativo.'},400);
      }

      if(markupPercent<0){
        return json({error:'O markup não pode ser negativo.'},400);
      }

      const multiplier=1+(markupPercent/100);
      const price4x=cost*multiplier;
      const priceCash=price4x*0.929;
      const price18x=priceCash/0.83;

      const changes=[
        ['stock_quantity',product.stock_quantity,stockQuantity],
        ['cost',product.cost,cost],
        ['markup_percent',product.markup_percent,markupPercent],
        ['multiplier',product.multiplier,multiplier],
        ['price_4x',product.price_4x,price4x],
        ['price_cash',product.price_cash,priceCash],
        ['price_18x',product.price_18x,price18x]
      ];

      await context.env.DB.prepare(`
        UPDATE price_products
        SET
          stock_quantity = ?,
          cost = ?,
          markup_percent = ?,
          multiplier = ?,
          price_4x = ?,
          price_cash = ?,
          price_18x = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        stockQuantity,
        cost,
        markupPercent,
        multiplier,
        price4x,
        priceCash,
        price18x,
        id
      ).run();

      for(const [fieldName,oldValue,newValue] of changes){
        if(Number(oldValue)!==Number(newValue)){
          await history(context.env,{
            productId:id,
            internalCode:product.internal_code,
            action:'EDITAR',
            fieldName,
            oldValue,
            newValue,
            reason,
            changedBy:user.username
          });
        }
      }

      const updated=await getProduct(context.env,id);

      return json({
        ok:true,
        message:'Produto atualizado com sucesso.',
        product:updated
      });
    }

    if(action==='INATIVAR'){
      const id=Number(body.id);
      const reason=text(body.reason);

      if(!id){
        return json({error:'Produto inválido.'},400);
      }

      if(!reason){
        return json({
          error:'Informe o motivo da exclusão/inativação.'
        },400);
      }

      const product=await getProduct(context.env,id);

      if(!product){
        return json({error:'Produto não encontrado.'},404);
      }

      if(Number(product.active)===0){
        return json({
          error:'Este produto já está inativo.'
        },400);
      }

      await context.env.DB.prepare(`
        UPDATE price_products
        SET
          active = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(id).run();

      await history(context.env,{
        productId:id,
        internalCode:product.internal_code,
        action:'INATIVAR',
        fieldName:'active',
        oldValue:'1',
        newValue:'0',
        reason,
        changedBy:user.username
      });

      return json({
        ok:true,
        message:'Produto inativado.',
        id
      });
    }

    return json({
      error:'Ação de estoque ainda não habilitada.'
    },400);

  }catch(e){
    return json({
      error:e?.message||'Não foi possível alterar o estoque.'
    },500);
  }
}

export function onRequest(){
  return json({error:'Método não permitido.'},405);
}
