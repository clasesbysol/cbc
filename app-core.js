const CFG=window.CBCLASES_CONFIG||{};
const UNITS=[...Array(13)].map((_,i)=>i+1);
let sb=null,session=null,guest=localStorage.getItem('cbc-mode')==='guest';
let view='subjects',unit=1,side=false,searchOpen=false,themeOpen=false,msg='',installPrompt=null;
let profile=null,myGrants=[],users=[],allGrants=[],unit1Sections=[],editing=null,durationMode='1m',customDate='';
let accent=localStorage.getItem('cbc-accent')||'#0f9f9a';
let mode=localStorage.getItem('cbc-theme')||'light';
const app=document.querySelector('#app');
const mail=()=>String(session?.user?.email||'').toLowerCase();
const isAdmin=()=>mail()===String(CFG.adminEmail||'').toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=v=>v?new Intl.DateTimeFormat('es-AR',{dateStyle:'medium'}).format(new Date(v)):'Sin vencimiento';
function applyTheme(){document.documentElement.dataset.theme=mode;document.documentElement.style.setProperty('--accent',accent)}
applyTheme();

async function init(){
  await loadUnit1();
  if(CFG.supabaseUrl&&CFG.supabaseAnonKey){
    const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    sb=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    session=(await sb.auth.getSession()).data.session;
    if(session){guest=false;localStorage.setItem('cbc-mode','account');await loadOwn();if(isAdmin()){view='admin';await loadAdmin();}}
    sb.auth.onAuthStateChange(async(_,next)=>{session=next;if(next){guest=false;localStorage.setItem('cbc-mode','account');await loadOwn();if(isAdmin()){view='admin';await loadAdmin();}}render();});
  }
  render();
}
async function loadUnit1(){
  try{
    const raw=await fetch('./content/unidad1.md?v=2').then(r=>r.text());
    const {marked}=await import('https://cdn.jsdelivr.net/npm/marked@15/+esm');
    const blocks=[...raw.matchAll(/^# (.+)$/gm)];
    const meta=blocks.find(x=>x[1].startsWith('INSTRUCCIONES'));
    if(meta){
      const end=blocks[blocks.indexOf(meta)+1]?.index||raw.length;
      const body=raw.slice(meta.index,end);
      const idx=body.indexOf('**Química CBC · Unidad 1**');
      if(idx>=0) unit1Sections.push({key:'intro',type:'resource',title:'Bienvenida',order:0,html:marked.parse(body.slice(idx))});
    }
    const mapTitle=t=>{
      if(t==='Cómo estudiar esta unidad')return['como-estudiar','resource',5];
      if(/^([1-7])\./.test(t)){const n=Number(t.match(/^(\d+)/)[1]);return[`cap-${n}`,'chapter',n*10]}
      if(t.startsWith('8. '))return['guia-base','evaluation',80];
      if(t.startsWith('9. '))return['guia-extra','evaluation',90];
      if(t.startsWith('10. '))return['resoluciones-extra','evaluation',100];
      if(t.startsWith('11. '))return['lista-control','resource',110];
      if(t.startsWith('12. '))return['parciales','evaluation',120];
      if(t.startsWith('Fuentes'))return['fuentes','resource',130];
      if(t.startsWith('SIMULADORES'))return['simuladores','resource',140];
      return null;
    };
    blocks.forEach((m,i)=>{const spec=mapTitle(m[1]);if(!spec)return;const end=blocks[i+1]?.index||raw.length;unit1Sections.push({key:spec[0],type:spec[1],title:m[1],order:spec[2],html:marked.parse(raw.slice(m.index+m[0].length,end).trim())})});
    unit1Sections.sort((a,b)=>a.order-b.order);
  }catch(e){console.error(e);msg='No pude cargar el contenido de la Unidad 1.'}
}
async function loadOwn(){
  if(!sb||!session)return;
  if(isAdmin()){profile={email:mail(),active:true,role:'admin',access_starts_at:new Date().toISOString(),access_expires_at:null};myGrants=[];return;}
  profile=(await sb.from('access_profiles').select('*').eq('email',mail()).maybeSingle()).data||null;
  myGrants=(await sb.from('access_grants').select('*').eq('email',mail())).data||[];
}
function currentAccess(){if(isAdmin())return true;if(!profile||!profile.active)return false;const now=Date.now(),s=new Date(profile.access_starts_at).getTime(),e=profile.access_expires_at?new Date(profile.access_expires_at).getTime():Infinity;return now>=s&&now<=e}
function grantsFor(u){return myGrants.filter(g=>g.subject==='chemistry'&&Number(g.unit_no)===u)}
function canUnit(u){return u===1||isAdmin()||(currentAccess()&&grantsFor(u).length>0)}
function canSection(u,s){if(u===1||isAdmin())return true;if(!currentAccess())return false;const gs=grantsFor(u);return gs.some(g=>g.grant_type==='unit'&&g.grant_key==='*')||gs.some(g=>g.grant_type===s.type&&g.grant_key===s.key)}
async function google(){if(!sb)return;const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}${location.pathname}`}});if(error){msg=error.message;render()}}
async function logout(){if(sb&&session)await sb.auth.signOut();session=null;guest=false;profile=null;myGrants=[];localStorage.removeItem('cbc-mode');view='subjects';render()}
async function loadAdmin(){if(!sb||!isAdmin())return;users=(await sb.from('access_profiles').select('*').order('email')).data||[];allGrants=(await sb.from('access_grants').select('*')).data||[]}

function expiryFromMode(){if(durationMode==='forever')return null;let d=new Date();if(durationMode==='custom'){if(!customDate)return undefined;d=new Date(`${customDate}T23:59:59`);return d.toISOString()}const months=Number(durationMode[0]);d.setMonth(d.getMonth()+months);d.setHours(23,59,59,999);return d.toISOString()}
function draftGrantsFromForm(){const out=[];document.querySelectorAll('[data-full-unit]:checked').forEach(x=>out.push({unit_no:Number(x.dataset.fullUnit),grant_type:'unit',grant_key:'*'}));document.querySelectorAll('[data-grant-section]:checked').forEach(x=>{const [u,t,k]=x.dataset.grantSection.split('|');if(!document.querySelector(`[data-full-unit="${u}"]`)?.checked)out.push({unit_no:Number(u),grant_type:t,grant_key:k})});return out}
async function saveAccess(){
  const email=document.querySelector('#accessEmail')?.value.trim().toLowerCase();if(!email)return;
  const expiry=expiryFromMode();if(durationMode==='custom'&&expiry===undefined){msg='Elegí una fecha de vencimiento.';render();return}
  const grants=draftGrantsFromForm();
  const starts=editing?.email===email&&durationMode==='keep'?editing.access_starts_at:new Date().toISOString();
  const finalExpiry=durationMode==='keep'?editing?.access_expires_at??null:expiry;
  const {error}=await sb.from('access_profiles').upsert({email,active:true,role:editing?.role==='admin'?'admin':'student',access_starts_at:starts,access_expires_at:finalExpiry},{onConflict:'email'});
  if(error){msg=error.message;render();return}
  await sb.from('access_grants').delete().eq('email',email);
  if(grants.length){const rows=grants.map(g=>({email,subject:'chemistry',...g}));const e=(await sb.from('access_grants').insert(rows)).error;if(e){msg=e.message;render();return}}
  editing=null;durationMode='1m';customDate='';await loadAdmin();render();
}
async function toggleUser(email,active){await sb.from('access_profiles').update({active}).eq('email',email);await loadAdmin();render()}
function editUser(email){editing=users.find(u=>u.email===email)||null;durationMode='keep';customDate='';render();setTimeout(()=>document.querySelector('#accessEmail')?.scrollIntoView({behavior:'smooth',block:'center'}),50)}
function resetForm(){editing=null;durationMode='1m';customDate='';render()}
function userGrants(email){return allGrants.filter(g=>g.email===email)}
function hasDraftFull(u){return editing&&userGrants(editing.email).some(g=>Number(g.unit_no)===u&&g.grant_type==='unit'&&g.grant_key==='*')}
function hasDraftSection(u,t,k){return editing&&userGrants(editing.email).some(g=>Number(g.unit_no)===u&&g.grant_type===t&&g.grant_key===k)}
