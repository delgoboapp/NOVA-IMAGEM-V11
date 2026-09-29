import {readDB,verifyToken,json} from './_shared.js';

const text=v=>String(v??'').trim();
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const uid=()=>crypto.randomUUID();

export async function onRequestPost(context){
  const user=await verifyToken(context.env,context.request);
  if(!user)return json({error:'Sessão inválida ou expirada.'},401);
  if(String(user.role||'').toLowerCase()!=='gestor')return json({error:'Apenas usuários GESTOR podem finalizar vendas de atacado.'},403);
  try{
    const body=await context.request.json();
    const db=await readDB(context.env);
    db.wholesaleClients=db.wholesaleClients||[];
    db.wholesaleSales=db.wholesaleSales||[];
    db.wholesaleQuotes=db.wholesaleQuotes||[];
    db.auditLog=db.auditLog||[];
    db.settings=db.settings||{};

    const action=text(body.action).toUpperCase();
    if(action==='DELETE'||action==='RETURN_TO_QUOTE'){
      const sale=db.wholesaleSales.find(s=>s.id===body.saleId&&s.cancelled!==true);
      if(!sale)return json({error:'Pedido de atacado não encontrado.'},404);
      const statements=[];
      for(const m of sale.stockMovements||[]){
        const product=await context.env.DB.prepare('SELECT * FROM price_products WHERE id=?').bind(Number(m.product_id)).first();
        if(!product)continue;
        const current=num(product.stock_quantity,0),next=current+num(m.qty,0);
        statements.push(context.env.DB.prepare('UPDATE price_products SET stock_quantity=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(next,Number(m.product_id)));
        statements.push(context.env.DB.prepare(`INSERT INTO price_product_history (product_id,internal_code,action,field_name,old_value,new_value,reason,changed_by) VALUES (?,?,?,?,?,?,?,?)`).bind(Number(m.product_id),text(product.internal_code),'ESTORNO ATACADO','stock_quantity',String(current),String(next),`Estorno do pedido ${sale.number} • ${action==='RETURN_TO_QUOTE'?'retorno a orçamento':'exclusão'}`,text(user.username)));
      }
      let quote=null;
      if(action==='RETURN_TO_QUOTE'){
        const qn=Math.max(1,Number(db.settings.nextWholesaleQuoteNumber||1));
        quote={id:uid(),number:qn,date:new Date().toISOString().slice(0,10),clientId:sale.clientId,clientName:sale.clientName,items:(sale.items||[]).map(x=>({...x,id:uid()})),total:num(sale.total,0),termDays:num(sale.termDays,0),dueDate:sale.dueDate||'',sourceSaleNumber:sale.number,status:'ORÇAMENTO',createdAt:new Date().toISOString(),createdBy:text(user.username)};
        db.wholesaleQuotes.unshift(quote);db.settings.nextWholesaleQuoteNumber=qn+1;
      }
      sale.cancelled=true;sale.cancelledAt=new Date().toISOString();sale.cancelledBy=text(user.username);sale.cancelReason=action==='RETURN_TO_QUOTE'?'RETORNADO A ORÇAMENTO':'EXCLUÍDO';
      db.auditLog.unshift({id:uid(),at:new Date().toISOString(),module:'ATACADO',action:action==='RETURN_TO_QUOTE'?'RETORNO A ORÇAMENTO':'EXCLUSÃO',target:sale.clientName,details:`Pedido ${sale.number}`,user:text(user.username)});
      db.updatedAt=new Date().toISOString();
      statements.push(context.env.DB.prepare(`INSERT INTO app_state (id,data,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`).bind(JSON.stringify(db),db.updatedAt));
      await context.env.DB.batch(statements);
      return json({ok:true,quote,updatedAt:db.updatedAt});
    }

    const client=db.wholesaleClients.find(c=>c.id===body.clientId&&c.active!==false);
    if(!client)return json({error:'Cliente de atacado não encontrado ou inativo.'},400);
    const items=Array.isArray(body.items)?body.items:[];
    if(!items.length)return json({error:'Adicione pelo menos um produto.'},400);

    const prepared=[];
    for(const item of items){
      const id=Number(item.productId),qty=num(item.qty,0),markup=Math.max(0,num(item.markup,0));
      if(!id||qty<=0)return json({error:'Produto ou quantidade inválida.'},400);
      const p=await context.env.DB.prepare('SELECT * FROM price_products WHERE id=?').bind(id).first();
      if(!p||Number(p.active)===0)return json({error:`Produto oficial não encontrado ou inativo: ${id}.`},400);
      const current=num(p.stock_quantity,0),next=current-qty;
      const name=text(p.product_name).toUpperCase();
      const allowNegative=name.includes('MOTORIZAD')||(name.includes('VARÃO')&&name.includes('COMANDO'))||(name.includes('SQUARE')&&name.includes('COMANDO'));
      if(!allowNegative&&next<0)return json({error:`Estoque insuficiente de ${p.product_name} / ${p.color||'-'}. Disponível: ${current} ${p.unit||'UN'}.`},400);
      const cost=num(p.cost,0),unitPrice=cost*(1+markup/100);
      prepared.push({p,qty,markup,cost,unitPrice,current,next});
    }

    const number=Math.max(1,Number(db.settings.nextWholesaleSaleNumber||1));
    const orderNumber=`ATACADO-${String(number).padStart(6,'0')}`;
    const saleItems=prepared.map(x=>({
      id:uid(),productId:Number(x.p.id),internalCode:text(x.p.internal_code),name:text(x.p.product_name),color:text(x.p.color),unit:text(x.p.unit)||'UN',qty:x.qty,cost:x.cost,markup:x.markup,unitPrice:x.unitPrice
    }));
    const total=saleItems.reduce((a,x)=>a+x.qty*x.unitPrice,0);
    const cost=saleItems.reduce((a,x)=>a+x.qty*x.cost,0);
    const sale={
      id:uid(),number,date:text(body.date)||new Date().toISOString().slice(0,10),dueDate:text(body.dueDate),termDays:num(body.termDays,0),clientId:client.id,clientName:client.fantasyName||client.legalName||'',clientDocument:client.document||'',items:saleItems,total,cost,grossProfit:total-cost,grossMargin:total>0?(total-cost)/total*100:0,payments:[],logisticsStatus:'SEPARAÇÃO',creditOverride:!!body.creditOverride,lowMarkupOverride:!!body.lowMarkupOverride,createdAt:new Date().toISOString(),createdBy:text(user.username),stockMovements:prepared.map(x=>({product_id:Number(x.p.id),internal_code:x.p.internal_code,product_name:x.p.product_name,color:x.p.color,unit:x.p.unit,qty:x.qty,before:x.current,after:x.next}))
    };
    db.wholesaleSales.unshift(sale);
    db.settings.nextWholesaleSaleNumber=number+1;
    db.auditLog.unshift({id:uid(),at:new Date().toISOString(),module:'ATACADO',action:'VENDA',target:sale.clientName,details:`Venda ${String(number).padStart(6,'0')} • R$ ${total.toFixed(2).replace('.',',')} • venc. ${sale.dueDate||'-'}`,user:text(user.username)});
    db.updatedAt=new Date().toISOString();

    const statements=[];
    for(const x of prepared){
      statements.push(context.env.DB.prepare('UPDATE price_products SET stock_quantity=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(x.next,Number(x.p.id)));
      statements.push(context.env.DB.prepare(`INSERT INTO price_product_history (product_id,internal_code,action,field_name,old_value,new_value,reason,changed_by) VALUES (?,?,?,?,?,?,?,?)`).bind(Number(x.p.id),text(x.p.internal_code),'CONSUMIR_PEDIDO','stock_quantity',String(x.current),String(x.next),`Saída do pedido ${orderNumber} • ATACADO`,text(user.username)));
    }
    statements.push(context.env.DB.prepare(`INSERT INTO app_state (id,data,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`).bind(JSON.stringify(db),db.updatedAt));
    await context.env.DB.batch(statements);
    return json({ok:true,sale,updatedAt:db.updatedAt});
  }catch(e){return json({error:e?.message||'Não foi possível finalizar a venda de atacado.'},400)}
}

export function onRequest(){return json({error:'Método não permitido.'},405)}
