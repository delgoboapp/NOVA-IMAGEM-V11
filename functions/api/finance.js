import {verifyToken,json} from './_shared.js';
const accounts=[['TON - NOVA IMAGEM','COMPANY'],['MERCADO PAGO - NOVA IMAGEM','COMPANY'],['SICREDI - NOVA IMAGEM','COMPANY'],['CAIXA DA LOJA','COMPANY'],['ERIC','PERSONAL'],['LUIZ','PERSONAL'],['ELIANE','PERSONAL']];
const err=(msg,status=400)=>json({error:msg},status);
async function setup(env){
 if(!env.DB)throw Error('Binding DB ausente');
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS ni_accounts (id TEXT PRIMARY KEY,kind TEXT NOT NULL,opening INTEGER NOT NULL DEFAULT 0,opening_at TEXT,created_at TEXT NOT NULL)').run();
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS ni_movements (id TEXT PRIMARY KEY,account_id TEXT NOT NULL,amount INTEGER NOT NULL,date TEXT NOT NULL,kind TEXT NOT NULL,description TEXT NOT NULL,person TEXT NOT NULL,reference TEXT,transfer_id TEXT,created_at TEXT NOT NULL)').run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ni_mov_account_date ON ni_movements(account_id,date)').run();
 await env.DB.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_ni_mov_reference ON ni_movements(reference) WHERE reference IS NOT NULL').run();
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS ni_personal_titles (id TEXT PRIMARY KEY,owner TEXT NOT NULL,kind TEXT NOT NULL,name TEXT NOT NULL,due_date TEXT NOT NULL,amount INTEGER NOT NULL,paid INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL)').run();
 for(const [id,kind] of accounts)await env.DB.prepare('INSERT OR IGNORE INTO ni_accounts(id,kind,created_at) VALUES(?,?,?)').bind(id,kind,new Date().toISOString()).run();
}
function cents(n){let v=Number(n);if(!Number.isFinite(v)||v<=0||v>1e10)throw Error('Valor inválido');return Math.round(v*100)}
function validDate(d){if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||Number.isNaN(Date.parse(d+'T12:00:00Z')))throw Error('Data inválida');return d}
async function account(env,id){return env.DB.prepare('SELECT * FROM ni_accounts WHERE id=?').bind(id).first()}
async function balance(env,id){const r=await env.DB.prepare('SELECT COALESCE(SUM(amount),0) total FROM ni_movements WHERE account_id=?').bind(id).first();const a=await account(env,id);return Number(a.opening)+Number(r.total)}
export async function onRequest({env,request}){
 const u=await verifyToken(env,request);if(!u)return err('Sessão inválida',401);if(u.role!=='gestor')return err('Acesso restrito a gestores',403);
 try{
 await setup(env);const url=new URL(request.url),action=url.searchParams.get('action')||'list';
 if(request.method==='GET'&&action==='list'){
  const rows=(await env.DB.prepare('SELECT * FROM ni_accounts ORDER BY CASE kind WHEN \'COMPANY\' THEN 0 ELSE 1 END,id').all()).results;
  const sums=(await env.DB.prepare('SELECT account_id,SUM(amount) total FROM ni_movements GROUP BY account_id').all()).results;
  const map=Object.fromEntries(sums.map(x=>[x.account_id,Number(x.total)]));
  return json({accounts:rows.map(a=>({...a,balance:(Number(a.opening)+(map[a.id]||0))/100}))});
 }
 if(request.method==='GET'&&action==='statement'){
  const id=url.searchParams.get('account');if(!await account(env,id))return err('Conta inexistente',404);
  const from=url.searchParams.get('from')||'1900-01-01',to=url.searchParams.get('to')||'2999-12-31';validDate(from);validDate(to);
  const opening=await env.DB.prepare('SELECT COALESCE(SUM(amount),0) total FROM ni_movements WHERE account_id=? AND date<?').bind(id,from).first();
  const a=await account(env,id);
  const rows=(await env.DB.prepare('SELECT id,date,kind,description,person,reference,transfer_id,amount FROM ni_movements WHERE account_id=? AND date>=? AND date<=? ORDER BY date,created_at,id').bind(id,from,to).all()).results;
  return json({account:id,from,to,opening:(Number(a.opening)+Number(opening.total))/100,rows:rows.map(r=>({...r,amount:r.amount/100}))});
 }
 if(request.method==='GET'&&action==='titles'){
  const owner=url.searchParams.get('owner');if(!await account(env,owner))return err('Conta inexistente');
  return json({titles:(await env.DB.prepare('SELECT * FROM ni_personal_titles WHERE owner=? ORDER BY due_date').bind(owner).all()).results.map(t=>({...t,amount:t.amount/100,paid:t.paid/100}))});
 }
 if(request.method!=='POST')return err('Método não permitido',405);
 const p=await request.json(),now=new Date().toISOString();
 if(action==='transfer'){
  const from=String(p.from||''),to=String(p.to||'');if(from===to)return err('Contas precisam ser diferentes');
  if(!await account(env,from)||!await account(env,to))return err('Conta inexistente');
  const value=cents(p.value),date=validDate(p.date),reason=String(p.reason||'').trim().slice(0,500);if(!reason)return err('Informe justificativa');
  if(await balance(env,from)<value)return err('Saldo insuficiente');
  const ref=crypto.randomUUID(),person=u.username;
  await env.DB.batch([
   env.DB.prepare('INSERT INTO ni_movements VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),from,-value,date,'TRANSFERÊNCIA',reason,person,null,ref,now),
   env.DB.prepare('INSERT INTO ni_movements VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),to,value,date,'TRANSFERÊNCIA',reason,person,null,ref,now)
  ]);return json({ok:true,transferId:ref});
 }
 if(action==='movement'){
  const id=String(p.account||''),a=await account(env,id);if(!a)return err('Conta inválida');
  const value=cents(p.value),sign=p.direction==='IN'?1:p.direction==='OUT'?-1:0;if(!sign)return err('Direção inválida');
  const reason=String(p.reason||'').trim().slice(0,500);if(!reason)return err('Informe a origem/justificativa');
  if(sign<0&&await balance(env,id)<value)return err('Saldo insuficiente');
  const reference=p.reference?String(p.reference).slice(0,200):null;
  await env.DB.prepare('INSERT INTO ni_movements VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,sign*value,validDate(p.date),p.kind||'MOVIMENTAÇÃO',reason,u.username,reference,null,now).run();return json({ok:true});
 }
 if(action==='opening'){
  const id=String(p.account||'');if(!await account(env,id))return err('Conta inválida');
  const existing=await env.DB.prepare('SELECT COUNT(*) n FROM ni_movements WHERE account_id=?').bind(id).first();
  if(existing.n)return err('Conta possui movimentações. Não altere abertura; faça ajuste documentado.');
  const value=Number(p.value);if(!Number.isFinite(value)||value<0)return err('Saldo inválido');
  await env.DB.prepare('UPDATE ni_accounts SET opening=?,opening_at=? WHERE id=?').bind(Math.round(value*100),now,id).run();return json({ok:true});
 }
 if(action==='account'){
  const id=String(p.name||'').trim().slice(0,100);if(!id||await account(env,id))return err('Nome inválido ou existente');
  const kind=p.kind==='PERSONAL'?'PERSONAL':'COMPANY';await env.DB.prepare('INSERT INTO ni_accounts VALUES(?,?,0,NULL,?)').bind(id,kind,now).run();return json({ok:true});
 }
 if(action==='title'){
  const owner=String(p.owner||'');const a=await account(env,owner);if(!a||a.kind!=='PERSONAL')return err('Pessoa inválida');
  const id=p.id||crypto.randomUUID(),kind=p.kind==='RECEBER'?'RECEBER':'PAGAR',name=String(p.name||'').trim().slice(0,200);if(!name)return err('Descrição obrigatória');
  await env.DB.prepare('INSERT INTO ni_personal_titles(id,owner,kind,name,due_date,amount,paid,created_at) VALUES(?,?,?,?,?,?,0,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,due_date=excluded.due_date,amount=excluded.amount').bind(id,owner,kind,name,validDate(p.date),cents(p.value),now).run();return json({ok:true});
 }
 if(action==='settle-title'){
  const title=await env.DB.prepare('SELECT * FROM ni_personal_titles WHERE id=?').bind(p.id).first();if(!title)return err('Título não localizado');
  const amount=cents(p.value),remaining=title.amount-title.paid;if(amount>remaining)return err('Valor superior ao saldo do título');
  const sign=title.kind==='PAGAR'?-1:1;if(sign<0&&await balance(env,title.owner)<amount)return err('Saldo insuficiente');
  await env.DB.batch([
   env.DB.prepare('UPDATE ni_personal_titles SET paid=paid+? WHERE id=? AND paid+?<=amount').bind(amount,title.id,amount),
   env.DB.prepare('INSERT INTO ni_movements VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),title.owner,sign*amount,validDate(p.date),title.kind,title.name,u.username,'PESSOAL:'+title.id+':'+crypto.randomUUID(),null,now)
  ]);return json({ok:true});
 }
 return err('Ação desconhecida',404);
 }catch(e){return err(e.message||'Erro financeiro',/UNIQUE constraint/.test(String(e))?409:400)}
}
