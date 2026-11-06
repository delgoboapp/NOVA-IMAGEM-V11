import {readDB,writeDB,verifyToken,json} from './_shared.js';
export async function onRequestGet(context){const user=await verifyToken(context.env,context.request);if(!user)return json({error:'Sessão inválida ou expirada.'},401);try{return json(await readDB(context.env))}catch(e){return json({error:e?.message||'Não foi possível carregar os dados.'},500)}}
export async function onRequestPost(context){const user=await verifyToken(context.env,context.request);if(!user)return json({error:'Sessão inválida ou expirada.'},401);try{const incoming=await context.request.json(),current=await readDB(context.env);if(!incoming||typeof incoming!=='object'||!Array.isArray(incoming.orders)||!Array.isArray(incoming.clients)||!Array.isArray(incoming.quotes))return json({error:'Estado incompleto recusado.'},422);if(current.updatedAt&&incoming.updatedAt!==current.updatedAt)return json({error:'Outra sessão alterou o banco. Recarregue a página antes de salvar.'},409);for(const key of ['orders','clients','quotes']){if((current[key]||[]).length>0&&incoming[key].length===0)return json({error:'Proteção D1: tentativa de zerar '+key+' bloqueada.'},409)}if(user.role!=='gestor'){incoming.wholesaleClients=current.wholesaleClients||[];incoming.wholesaleSales=current.wholesaleSales||[];incoming.users=current.users||[];incoming.disabledUsers=current.disabledUsers||[];incoming.priceConfig=current.priceConfig||null;incoming.products=current.products||[];incoming.suppliers=current.suppliers||[];incoming.payables=current.payables||[];// Usuários não gestores podem alterar APENAS as próprias preferências de perfil.
// A tabela de preços, os perfis de terceiros e as demais configurações continuam protegidos.
const username=String(user.username||'').trim().toUpperCase();
const incomingSettings=incoming.settings&&typeof incoming.settings==='object'?incoming.settings:{};
const ownProfile=incomingSettings.personalQuoteProfiles?.[username];
const ownPassword=incomingSettings.userPasswordOverrides?.[username];
incoming.settings={...(current.settings||{})};
if(ownProfile&&typeof ownProfile==='object'&&!Array.isArray(ownProfile)){
  const margin=Number(ownProfile.marginPercent);
  if(!Number.isFinite(margin)||margin<0||margin>60) return json({error:'Acréscimo do perfil deve estar entre 0% e 60%.'},422);
  const customBrand=ownProfile.customBrand===true;
  const name=String(ownProfile.name||'').slice(0,120);
  const address=String(ownProfile.address||'').slice(0,250);
  const logo=String(ownProfile.logo||'');
  if(customBrand&&(!name.trim()||!address.trim()))return json({error:'Nome e endereço são obrigatórios para identidade personalizada.'},422);
  if(logo.length>350000||(logo&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(logo)))return json({error:'Logomarca inválida.'},422);
  const profiles={...(current.settings?.personalQuoteProfiles||{})};
  profiles[username]={...(profiles[username]||{}),marginPercent:margin,customBrand,name,address,logo};
  incoming.settings.personalQuoteProfiles=profiles;
}
if(typeof ownPassword==='string'&&/^[a-f0-9]{64}$/i.test(ownPassword)){
  incoming.settings.userPasswordOverrides={...(current.settings?.userPasswordOverrides||{}),[username]:ownPassword};
}
incoming.customerFeedback=current.customerFeedback||[];incoming.inspirations=current.inspirations||[];incoming.blogPosts=current.blogPosts||[];incoming.candidates=current.candidates||[];incoming.jobs=current.jobs||[];incoming.portalAnalytics=current.portalAnalytics||{}}const saved=await writeDB(context.env,incoming);return json({ok:true,updatedAt:saved.updatedAt})}catch(e){return json({error:e?.message||'Não foi possível salvar os dados.'},400)}}
export function onRequest(){return json({error:'Método não permitido.'},405)}
