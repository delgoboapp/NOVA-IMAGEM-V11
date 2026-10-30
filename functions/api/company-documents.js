import {verifyToken,json} from './_shared.js';
const error=(message,status=400)=>json({error:message},status);
const safeName=s=>String(s||'arquivo').replace(/[\\/\r\n<>"']/g,'_').slice(0,180);
export async function onRequest({env,request}){
 const u=await verifyToken(env,request);if(!u)return error('Sessão inválida',401);if(u.role!=='gestor')return error('Apenas gestores podem acessar documentos',403);
 try{
 if(!env.ANEXOS_R2||!env.DB)throw Error('Configure DB e ANEXOS_R2 no Cloudflare.');
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS ni_documents (id TEXT PRIMARY KEY,name TEXT NOT NULL,original_name TEXT NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL,r2_key TEXT NOT NULL,username TEXT NOT NULL,created_at TEXT NOT NULL)').run();
 const url=new URL(request.url),action=url.searchParams.get('action')||'list';
 if(request.method==='GET'&&action==='list')return json({documents:(await env.DB.prepare('SELECT id,name,original_name,mime,size,username,created_at FROM ni_documents ORDER BY created_at DESC').all()).results});
 if(request.method==='GET'&&['download','view'].includes(action)){
  const row=await env.DB.prepare('SELECT * FROM ni_documents WHERE id=?').bind(url.searchParams.get('id')).first();if(!row)return error('Documento inexistente',404);
  const object=await env.ANEXOS_R2.get(row.r2_key);if(!object)return error('Arquivo não localizado',404);
  const inline=action==='view'&&['application/pdf','image/png','image/jpeg','image/webp'].includes(row.mime);
  return new Response(object.body,{headers:{'Content-Type':row.mime,'Content-Disposition':`${inline?'inline':'attachment'}; filename="download"; filename*=UTF-8''${encodeURIComponent(row.original_name)}`,'Cache-Control':'private,no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(request.method==='POST'&&action==='upload'){
  const form=await request.formData(),file=form.get('file'),name=String(form.get('name')||'').trim().slice(0,200);
  if(!name||!file||typeof file.stream!=='function')return error('Informe o nome e anexe um arquivo');
  if(!file.size||file.size>25*1024*1024)return error('Arquivo vazio ou maior que 25MB');
  const ext=String(file.name).split('.').pop().toLowerCase();
  const allow=['pdf','jpg','jpeg','png','webp','zip','txt','doc','docx','xls','xlsx','csv'];
  if(!allow.includes(ext))return error('Tipo de arquivo não permitido.');
  const id=crypto.randomUUID(),key='documentos-empresa/'+id,original=safeName(file.name);
  await env.ANEXOS_R2.put(key,file.stream(),{httpMetadata:{contentType:file.type||'application/octet-stream'}});
  try{await env.DB.prepare('INSERT INTO ni_documents VALUES(?,?,?,?,?,?,?,?)').bind(id,name,original,file.type||'application/octet-stream',file.size,key,u.username,new Date().toISOString()).run()}
  catch(e){await env.ANEXOS_R2.delete(key);throw e}
  return json({ok:true});
 }
 if(request.method==='POST'&&action==='rename'){
  const p=await request.json(),name=String(p.name||'').trim().slice(0,200);if(!name)return error('Nome obrigatório');
  await env.DB.prepare('UPDATE ni_documents SET name=? WHERE id=?').bind(name,p.id).run();return json({ok:true});
 }
 if(request.method==='DELETE'&&action==='delete'){
  const row=await env.DB.prepare('SELECT * FROM ni_documents WHERE id=?').bind(url.searchParams.get('id')).first();if(!row)return error('Não encontrado',404);
  await env.ANEXOS_R2.delete(row.r2_key);await env.DB.prepare('DELETE FROM ni_documents WHERE id=?').bind(row.id).run();return json({ok:true});
 }
 return error('Método não permitido',405);
 }catch(e){return error(e.message||'Falha no módulo documental',500)}
}
