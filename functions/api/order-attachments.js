import {readDB,verifyToken,json} from './_shared.js';

const MAX_SIZE = 10 * 1024 * 1024;
const MIME = new Set(['application/pdf','image/jpeg','image/png','image/webp']);
const TYPES = new Set(['FOTO DE MEDIÇÃO','FOTO DO AMBIENTE','INSTALAÇÃO CONCLUÍDA','COMPROVANTE','CONTRATO ASSINADO','OUTRO']);
const error=(message,status=400)=>json({error:message},status);
async function ready(env){
 if(!env.ANEXOS_R2)throw new Error('Binding ANEXOS_R2 não configurado.');
 if(!env.DB)throw new Error('Binding DB não configurado.');
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS pedido_anexos_r2 (id TEXT PRIMARY KEY, pedido_numero TEXT NOT NULL, tipo TEXT NOT NULL, nome TEXT NOT NULL, r2_key TEXT NOT NULL UNIQUE, mime TEXT NOT NULL, tamanho INTEGER NOT NULL, usuario TEXT NOT NULL, criado_em TEXT NOT NULL)`).run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_pedido_anexos_r2_pedido ON pedido_anexos_r2(pedido_numero)').run();
}
async function authorize(context){
 const user=await verifyToken(context.env,context.request);
 if(!user)return {fail:error('Sessão inválida.',401)};
 const url=new URL(context.request.url),numero=url.searchParams.get('pedido');
 if(!numero||!/^\d{1,12}$/.test(numero))return {fail:error('Número do pedido inválido.')};
 const state=await readDB(context.env);
 const order=(state.orders||[]).find(o=>Number(o.numero)===Number(numero));
 if(!order)return {fail:error('Pedido inexistente.',404)};
 const role=String(user.role||'').toLowerCase();
 if(role!=='gestor'&&role!=='production'){
  const keys=[order.sellerUsername,order.sellerUser,order.seller,order.vendedorUsername,order.createdBy,order.sellerLogin].filter(Boolean).map(x=>String(x).trim().toUpperCase());
  if(!keys.includes(String(user.username).toUpperCase()))return {fail:error('Sem permissão para os anexos deste pedido.',403)};
 }
 return {user,numero:String(Number(numero))};
}
function safeName(name){return String(name||'arquivo').replace(/[\\/\r\n<>"']/g,'_').slice(0,180)}
function disposition(name){return `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(name)}`}
export async function onRequest(context){
 try{
  const auth=await authorize(context);if(auth.fail)return auth.fail;
  const {env,request}=context;await ready(env);
  const url=new URL(request.url), action=url.searchParams.get('action')||'list';
  if(request.method==='GET'&&action==='list'){
   const rows=await env.DB.prepare('SELECT id,tipo,nome,mime,tamanho,usuario,criado_em FROM pedido_anexos_r2 WHERE pedido_numero=? ORDER BY criado_em DESC').bind(auth.numero).all();
   return json({attachments:rows.results||[]});
  }
  if(request.method==='GET'&&(action==='download'||action==='view')){
   const id=url.searchParams.get('id');if(!id)return error('Anexo não informado.');
   const row=await env.DB.prepare('SELECT * FROM pedido_anexos_r2 WHERE id=? AND pedido_numero=?').bind(id,auth.numero).first();
   if(!row)return error('Anexo não encontrado.',404);
   const object=await env.ANEXOS_R2.get(row.r2_key);if(!object)return error('Arquivo não encontrado no R2.',404);
   const headers={'Content-Type':row.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':action==='view'?'inline':disposition(row.nome)};
   return new Response(object.body,{headers});
  }
  if(request.method==='POST'&&action==='upload'){
   const form=await request.formData(),file=form.get('file'),tipo=String(form.get('tipo')||'OUTRO');
   if(!file||typeof file.arrayBuffer!=='function')return error('Selecione um arquivo.');
   if(!TYPES.has(tipo))return error('Tipo inválido.');
   if(!MIME.has(file.type))return error('Formato não permitido. Use PDF, JPG, PNG ou WEBP.');
   if(!file.size||file.size>MAX_SIZE)return error('Arquivo vazio ou maior que 10 MB.');
   const id=crypto.randomUUID(),name=safeName(file.name),key=`pedidos/${auth.numero}/${id}`;
   await env.ANEXOS_R2.put(key,file.stream(),{httpMetadata:{contentType:file.type},customMetadata:{pedido:auth.numero}});
   try{
    await env.DB.prepare('INSERT INTO pedido_anexos_r2 (id,pedido_numero,tipo,nome,r2_key,mime,tamanho,usuario,criado_em) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,auth.numero,tipo,name,key,file.type,file.size,auth.user.username,new Date().toISOString()).run();
   }catch(e){await env.ANEXOS_R2.delete(key).catch(()=>{});throw e}
   return json({ok:true,id});
  }
  if(request.method==='DELETE'&&action==='delete'){
   const id=url.searchParams.get('id');if(!id)return error('Anexo não informado.');
   const row=await env.DB.prepare('SELECT * FROM pedido_anexos_r2 WHERE id=? AND pedido_numero=?').bind(id,auth.numero).first();
   if(!row)return error('Anexo não encontrado.',404);
   // Delete object first: a DB failure retains a record that can be retried, rather than an orphan file.
   await env.ANEXOS_R2.delete(row.r2_key);
   await env.DB.prepare('DELETE FROM pedido_anexos_r2 WHERE id=? AND pedido_numero=?').bind(id,auth.numero).run();
   return json({ok:true});
  }
  return error('Método não permitido.',405);
 }catch(e){return error(e?.message||'Erro nos anexos.',500)}
}
