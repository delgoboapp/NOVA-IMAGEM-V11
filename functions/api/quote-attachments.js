import {readDB,verifyToken,json} from './_shared.js';
const error=(error,status=400)=>json({error},status);
const MIME=new Set(['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime']);
const safe=s=>String(s||'').trim().slice(0,240);
async function contextFor(ctx){
 const user=await verifyToken(ctx.env,ctx.request);if(!user)return {fail:error('Sessão inválida.',401)};
 const numero=new URL(ctx.request.url).searchParams.get('orcamento');
 if(!numero||!/^\d{1,12}$/.test(numero))return {fail:error('Salve o orçamento antes de anexar arquivos.')};
 const state=await readDB(ctx.env);
 const quote=(state.quotes||[]).find(q=>Number(q.numero)===Number(numero));
 if(!quote)return {fail:error('Orçamento não encontrado no D1. Salve o orçamento e aguarde a sincronização.',404)};
 const role=String(user.role||'').toLowerCase();
 if(!['gestor','production'].includes(role)){
  const owners=[quote.ownerUser,quote.sellerUser,quote.createdBy].filter(Boolean).map(s=>String(s).toUpperCase());
  if(!owners.includes(String(user.username).toUpperCase()))return {fail:error('Sem permissão para este orçamento.',403)};
 }
 return {user,numero:String(Number(numero)),quote};
}
async function ready(env){
 if(!env.ANEXOS_R2||!env.DB)throw new Error('Configure os bindings ANEXOS_R2 e DB.');
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS orcamento_anexos_r2 (id TEXT PRIMARY KEY,orcamento_numero TEXT NOT NULL,ambiente TEXT NOT NULL,observacoes TEXT NOT NULL DEFAULT '',nome TEXT NOT NULL,r2_key TEXT NOT NULL UNIQUE,mime TEXT NOT NULL,tamanho INTEGER NOT NULL,usuario TEXT NOT NULL,criado_em TEXT NOT NULL)`).run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_orcamento_anexos_r2_orcamento ON orcamento_anexos_r2 (orcamento_numero)').run();
}
export async function onRequest(ctx){
 try{
  const auth=await contextFor(ctx);if(auth.fail)return auth.fail;
  const {env,request}=ctx;await ready(env);
  const url=new URL(request.url),action=url.searchParams.get('action')||'list';
  if(request.method==='GET'&&action==='list'){
   const data=await env.DB.prepare('SELECT id,ambiente,observacoes,nome,mime,tamanho,usuario,criado_em FROM orcamento_anexos_r2 WHERE orcamento_numero=? ORDER BY criado_em DESC').bind(auth.numero).all();
   return json({attachments:data.results||[]});
  }
  if(request.method==='GET'&&['view','download'].includes(action)){
   const row=await env.DB.prepare('SELECT * FROM orcamento_anexos_r2 WHERE id=? AND orcamento_numero=?').bind(url.searchParams.get('id'),auth.numero).first();
   if(!row)return error('Anexo não encontrado.',404);
   const obj=await env.ANEXOS_R2.get(row.r2_key);if(!obj)return error('Arquivo ausente no R2.',404);
   return new Response(obj.body,{headers:{'Content-Type':row.mime,'Content-Disposition':action==='view'?'inline':`attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(row.nome)}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }
  if(request.method==='POST'&&action==='upload'){
   const fd=await request.formData(),file=fd.get('file'),ambiente=safe(fd.get('ambiente')),observacoes=safe(fd.get('observacoes'));
   if(!ambiente)return error('Informe obrigatoriamente o ambiente.');
   const valid=(auth.quote.environments||[]).some(e=>String(e.name||'').trim().toUpperCase()===ambiente.toUpperCase())||(auth.quote.blinds||[]).some(e=>String(e.environment||'').trim().toUpperCase()===ambiente.toUpperCase());
   if(!valid)return error('Selecione um ambiente pertencente ao orçamento.');
   if(!file||typeof file.stream!=='function')return error('Selecione uma foto ou vídeo.');
   if(!MIME.has(file.type))return error('Formato inválido: JPG, PNG, WEBP, MP4, WEBM ou MOV.');
   const limit=file.type.startsWith('video/')?50*1024*1024:10*1024*1024;
   if(file.size<1||file.size>limit)return error('Arquivo fora do limite (imagem 10 MB, vídeo 50 MB).');
   const id=crypto.randomUUID(),name=safe(file.name).replace(/[\\/\r\n<>"']/g,'_'),key=`orcamentos/${auth.numero}/${id}`;
   await env.ANEXOS_R2.put(key,file.stream(),{httpMetadata:{contentType:file.type},customMetadata:{orcamento:auth.numero,ambiente}});
   try{await env.DB.prepare('INSERT INTO orcamento_anexos_r2 (id,orcamento_numero,ambiente,observacoes,nome,r2_key,mime,tamanho,usuario,criado_em) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,auth.numero,ambiente,observacoes,name,key,file.type,file.size,auth.user.username,new Date().toISOString()).run()}catch(e){await env.ANEXOS_R2.delete(key).catch(()=>{});throw e}
   return json({ok:true,id});
  }
  if(request.method==='DELETE'&&action==='delete'){
   const row=await env.DB.prepare('SELECT * FROM orcamento_anexos_r2 WHERE id=? AND orcamento_numero=?').bind(url.searchParams.get('id'),auth.numero).first();
   if(!row)return error('Anexo não encontrado.',404);
   await env.ANEXOS_R2.delete(row.r2_key);
   await env.DB.prepare('DELETE FROM orcamento_anexos_r2 WHERE id=? AND orcamento_numero=?').bind(row.id,auth.numero).run();
   return json({ok:true});
  }
  return error('Método não permitido.',405);
 }catch(e){return error(e?.message||'Erro ao tratar anexo.',500)}
}
