import {readDB,writeDB,verifyToken,json} from './_shared.js';
export async function onRequestGet(context){const user=await verifyToken(context.env,context.request);if(!user)return json({error:'Sessão inválida ou expirada.'},401);try{const data=await readDB(context.env);if(user.role!=='gestor'&&data.settings?.blindInventory){data.settings={...data.settings,blindInventory:data.settings.blindInventory.filter(x=>String(x.supplier||'').toUpperCase()==='AMORIM')}}return json(data)}catch(e){return json({error:e?.message||'Não foi possível carregar os dados.'},500)}}
export async function onRequestPost(context){const user=await verifyToken(context.env,context.request);if(!user)return json({error:'Sessão inválida ou expirada.'},401);try{const incoming=await context.request.json(),current=await readDB(context.env);if(user.role!=='gestor'){
const byId=new Map((current.quotes||[]).map(q=>[String(q.id||q.numero),new Set((q.blinds||[]).map(b=>String(b.id)))]));
const forbidden=(incoming.quotes||[]).some(q=>(q.blinds||[]).some(b=>{
  const brand=String(b.brand||'').toUpperCase();
  const isReq=brand==='REQUINTE'||String(b.sourceSku||'').toUpperCase().startsWith('RQ-')||String(b.blindModel||'').toUpperCase()==='HORIZONTAL 25MM';
  return isReq&&!byId.get(String(q.id||q.numero))?.has(String(b.id));
}));
if(forbidden)return json({error:'Somente GESTOR pode inserir produtos Requinte em orçamentos.'},403);
incoming.wholesaleClients=current.wholesaleClients||[];incoming.wholesaleSales=current.wholesaleSales||[];incoming.users=current.users||[];incoming.disabledUsers=current.disabledUsers||[];incoming.priceConfig=current.priceConfig||null;incoming.products=current.products||[];incoming.suppliers=current.suppliers||[];incoming.payables=current.payables||[];incoming.settings=current.settings||{};incoming.customerFeedback=current.customerFeedback||[];incoming.inspirations=current.inspirations||[];incoming.candidates=current.candidates||[];incoming.jobs=current.jobs||[];incoming.portalAnalytics=current.portalAnalytics||{}}const saved=await writeDB(context.env,incoming);return json({ok:true,updatedAt:saved.updatedAt})}catch(e){return json({error:e?.message||'Não foi possível salvar os dados.'},400)}}
export function onRequest(){return json({error:'Método não permitido.'},405)}
