export const DEFAULT_USERS = [
  { username:'VENDAS1', name:'Vendas 1', role:'sales', hash:'1602b4048b35882a346c6887360d0343cde72797314f81a36065c71320562615', builtIn:true },
  { username:'VENDAS2', name:'Vendas 2', role:'sales', hash:'68d31642d5ee64f81c7706f66f82a8041540bd682d0318634a45614385a7a322', builtIn:true },
  { username:'GESTOR', name:'Gestor', role:'gestor', hash:'c4240fe88a529a7242f70c1faef6e41697368c175499a49910fef9813585e7a3', builtIn:true },
  { username:'ERIC.DELGOBO', name:'Eric Luiz Delgobo', role:'gestor', hash:'c4240fe88a529a7242f70c1faef6e41697368c175499a49910fef9813585e7a3', builtIn:true },
  { username:'LUIZ.SERGIO', name:'Luiz Sergio Delgobo', role:'gestor', hash:'e3961846e5b6bf7d0afb975960d838306df6ccf09afe952150b534fbd8932647', builtIn:true }
];

const EMPTY_DB = () => ({
  quotes:[], orders:[], clients:[], users:[], disabledUsers:[], products:[], suppliers:[], payables:[], purchaseOrders:[], reworks:[], agenda:[], purchaseAlerts:[], auditLog:[], attachments:[],
  priceConfig:null, settings:{}, updatedAt:null
});

export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})}

async function ensureSchema(env){
  if(!env.DB) throw new Error('D1 binding DB não configurado.');
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT)`).run();
}

function normalize(parsed={}){
  const base=EMPTY_DB();
  for(const k of ['quotes','orders','clients','users','disabledUsers','products','suppliers','payables','purchaseOrders','reworks','agenda','purchaseAlerts','auditLog','attachments']) base[k]=Array.isArray(parsed[k])?parsed[k]:[];
  base.priceConfig=parsed.priceConfig&&typeof parsed.priceConfig==='object'?parsed.priceConfig:null;
  base.settings=parsed.settings&&typeof parsed.settings==='object'?parsed.settings:{};
  base.updatedAt=parsed.updatedAt||null;
  return base;
}

export async function readDB(env){
  await ensureSchema(env);
  const row=await env.DB.prepare('SELECT data FROM app_state WHERE id = 1').first();
  if(!row?.data) return EMPTY_DB();
  try{return normalize(JSON.parse(row.data))}catch{return EMPTY_DB()}
}

export async function writeDB(env,db){
  await ensureSchema(env);
  const clean=normalize(db);
  clean.updatedAt=new Date().toISOString();
  await env.DB.prepare(`INSERT INTO app_state (id,data,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`).bind(JSON.stringify(clean),clean.updatedAt).run();
  return clean;
}

function bytesToB64Url(bytes){let binary='';for(const b of bytes) binary+=String.fromCharCode(b);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}
function b64UrlToBytes(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const binary=atob(s);return Uint8Array.from(binary,c=>c.charCodeAt(0))}
function encodePayload(obj){return bytesToB64Url(new TextEncoder().encode(JSON.stringify(obj)))}
async function hmac(secret,body){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body)))}
function secret(env){return env.NOVA_IMAGEM_SECRET||'nova-imagem-erp-v8-change-this-secret'}
export async function signToken(env,user){const p={u:user.username,r:user.role,n:user.name||user.username,exp:Date.now()+12*60*60*1000};const body=encodePayload(p);const sig=bytesToB64Url(await hmac(secret(env),body));return `${body}.${sig}`}
function safeEqual(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a[i]^b[i];return x===0}
export async function verifyToken(env,request){try{const h=request.headers.get('authorization')||'';const token=h.startsWith('Bearer ')?h.slice(7):'';const [body,sigText]=token.split('.');if(!body||!sigText)return null;const expected=await hmac(secret(env),body),provided=b64UrlToBytes(sigText);if(!safeEqual(expected,provided))return null;const p=JSON.parse(new TextDecoder().decode(b64UrlToBytes(body)));if(!p.exp||p.exp<Date.now())return null;return {username:p.u,role:p.r,name:p.n}}catch{return null}}
