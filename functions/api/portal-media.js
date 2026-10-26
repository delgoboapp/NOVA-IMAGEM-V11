import {verifyToken,json} from './_shared.js';
const categories=new Set(['inspiracoes','amostras','blog','capas']);
const mimeExt={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
const fail=(message,status=400)=>json({error:message},status);
function validMagic(bytes,type){
 if(type==='image/jpeg')return bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
 if(type==='image/png')return bytes.slice(0,8).every((b,i)=>b===[137,80,78,71,13,10,26,10][i]);
 if(type==='image/webp')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 return false;
}
export async function onRequest(context){
 const {request,env}=context;
 try{
  if(!env.ANEXOS_R2)return fail('Binding ANEXOS_R2 não configurado.',503);
  const url=new URL(request.url);
  if(request.method==='GET'){
   const key=url.searchParams.get('key')||'';
   if(!/^portal\/(inspiracoes|amostras|blog|capas)\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key))return fail('Imagem inválida.',404);
   const object=await env.ANEXOS_R2.get(key);if(!object)return fail('Imagem não encontrada.',404);
   return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'image/jpeg','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
  }
  if(request.method==='POST'){
   const user=await verifyToken(env,request);if(!user||String(user.role).toLowerCase()!=='gestor')return fail('Acesso reservado a gestores.',403);
   const form=await request.formData(),category=String(form.get('category')||''),file=form.get('file');
   if(!categories.has(category))return fail('Categoria inválida.');
   if(!file||typeof file.arrayBuffer!=='function')return fail('Selecione uma imagem.');
   if(!mimeExt[file.type]||!file.size||file.size>10*1024*1024)return fail('Use JPG, PNG ou WEBP com até 10 MB.');
   const bytes=new Uint8Array(await file.arrayBuffer());
   if(!validMagic(bytes,file.type))return fail('Formato da imagem não confere com o arquivo.');
   const key=`portal/${category}/${crypto.randomUUID()}.${mimeExt[file.type]}`;
   await env.ANEXOS_R2.put(key,bytes,{httpMetadata:{contentType:file.type}});
   return json({ok:true,url:`/api/portal-media?key=${encodeURIComponent(key)}`});
  }
  return fail('Método não permitido.',405);
 }catch(e){return fail(e?.message||'Falha ao acessar R2.',500)}
}
