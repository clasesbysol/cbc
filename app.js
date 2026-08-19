// CBC x SOLved — módulo único de aplicación.
// La configuración pública permanece en window.CBCLASES_CONFIG; el resto no expone globals.
const CFG=window.CBCLASES_CONFIG||{};
const UNITS=[...Array(13)].map((_,i)=>i+1);
let sb=null,session=null,guest=localStorage.getItem('cbc-mode')==='guest';
let view='subjects',unit=1,side=false,searchOpen=false,themeOpen=false,tocOpen=false,msg='',installPrompt=null;
let profile=null,myGrants=[],users=[],allGrants=[],unit1Sections=[],editing=null,durationMode='1m',customDate='';
let sectionsByUnit={},exercisesByUnit={},solutionsByExercise={},searchItems=[],adminExercises=[],adminSolutions=[];
const UNIT_TITLES={1:'Materia y sistemas materiales',2:'Estructura atómica y periodicidad',8:'Gases',9:'Soluciones y diluciones',10:'Reacciones y estequiometría',11:'Cinética química',12:'Equilibrio químico',13:'Ácidos y bases'};
let accent=localStorage.getItem('cbc-accent')||'#0f9f9a';
let mode=localStorage.getItem('cbc-theme')||'light';
const app=document.querySelector('#app');
const mail=()=>String(session?.user?.email||'').toLowerCase();
const isAdmin=()=>mail()===String(CFG.adminEmail||'').toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=v=>v?new Intl.DateTimeFormat('es-AR',{dateStyle:'medium'}).format(new Date(v)):'Sin vencimiento';
function applyTheme(){document.documentElement.dataset.theme=mode;document.documentElement.style.setProperty('--accent',accent)}
applyTheme();

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
async function loadAdmin(){if(!sb||!isAdmin())return;users=(await sb.from('access_profiles').select('*').order('email')).data||[];allGrants=(await sb.from('access_grants').select('*')).data||[];adminExercises=(await sb.from('exercises').select('*').order('unit_no').order('sort_order')).data||[];adminSolutions=(await sb.from('exercise_solutions').select('*')).data||[];const sectionRows=(await sb.from('course_sections').select('unit_no,section_key,section_type,title,sort_order,body_html,is_public').eq('subject','chemistry').order('unit_no').order('sort_order')).data||[];UNITS.forEach(u=>sectionsByUnit[u]=sectionRows.filter(s=>Number(s.unit_no)===u).map(s=>({key:s.section_key,type:s.section_type,title:s.title,order:s.sort_order,html:s.body_html,isPublic:s.is_public})));unit1Sections=sectionsByUnit[1]||[]}

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
async function setSolutionVisibility(exerciseId,visible){const {error}=await sb.from('exercise_solutions').update({student_visible:visible}).eq('exercise_id',exerciseId);if(error){msg=error.message}else await loadAdmin();render()}
async function setUnitSolutionsVisibility(unitNo,visible){const ids=adminExercises.filter(x=>Number(x.unit_no)===Number(unitNo)).map(x=>x.id);if(ids.length){const {error}=await sb.from('exercise_solutions').update({student_visible:visible}).in('exercise_id',ids);if(error)msg=error.message;else await loadAdmin()}render()}

async function loadUnit(targetUnit){
  if(!sb)return;
  const [{data:sectionRows,error:sectionError},{data:exerciseRows,error:exerciseError}]=await Promise.all([
    sb.from('course_sections').select('section_key,section_type,title,sort_order,body_html,is_public').eq('subject','chemistry').eq('unit_no',targetUnit).order('sort_order'),
    sb.from('exercises').select('*').eq('subject','chemistry').eq('unit_no',targetUnit).order('sort_order')
  ]);
  if(sectionError){console.error(sectionError);msg=`No pude cargar la Unidad ${targetUnit}.`;return}
  if(exerciseError&&exerciseError.code!=='42P01')console.error(exerciseError);
  sectionsByUnit[targetUnit]=(sectionRows||[]).map(s=>({key:s.section_key,type:s.section_type,title:s.title,order:s.sort_order,html:s.body_html,isPublic:s.is_public}));
  exercisesByUnit[targetUnit]=exerciseRows||[];
  if(targetUnit===1)unit1Sections=sectionsByUnit[1];
  const ids=(exerciseRows||[]).map(x=>x.id);
  if(ids.length){const {data,error}=await sb.from('exercise_solutions').select('*').in('exercise_id',ids);if(!error)(data||[]).forEach(x=>solutionsByExercise[x.exercise_id]=x)}
}
async function loadSearch(){if(!sb)return;const [{data:s},{data:e}]=await Promise.all([sb.from('course_sections').select('unit_no,section_key,title,body_html'),sb.from('exercises').select('id,unit_no,title,statement_html')]);searchItems=[...(s||[]).map(x=>({label:`Unidad ${x.unit_no} · ${x.title}`,key:`section:${x.unit_no}:${x.section_key}`,text:`${x.title} ${x.body_html}`.replace(/<[^>]+>/g,' ')})),...(e||[]).map(x=>({label:`Unidad ${x.unit_no} · ${x.title}`,key:`exercise:${x.unit_no}:${x.id}`,text:`${x.title} ${x.statement_html}`.replace(/<[^>]+>/g,' ')}))]}

function showStartupError(err){
  console.error(err);
  msg='Hubo un problema al conectar con el servidor. La app sigue disponible; podés reintentar recargando.';
  render();
}

async function hydrateSession(){
  if(!session)return;
  try{
    await loadOwn();
    render();
    if(isAdmin()){
      await loadAdmin();
      render();
    }
  }catch(err){
    console.error(err);
    msg='Tu sesión inició correctamente, pero no pude cargar todos tus datos.';
    render();
  }
}

function applySession(next){
  session=next;
  if(next){
    guest=false;
    localStorage.setItem('cbc-mode','account');
    if(isAdmin()) view='admin';
    else if(view==='admin') view='subjects';
  }else{
    profile=null;
    myGrants=[];
    if(localStorage.getItem('cbc-mode')==='account') localStorage.removeItem('cbc-mode');
    if(view==='admin') view='subjects';
  }
  render();
  if(next) window.setTimeout(()=>hydrateSession(),0);
}

async function init(){
  // Nunca bloquear la primera pintura de la interfaz por una consulta de red.
  render();

  if(!(CFG.supabaseUrl&&CFG.supabaseAnonKey)){
    msg='Falta la configuración de conexión.';
    render();
    return;
  }

  try{
    const modulePromise=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const timeoutPromise=new Promise((_,reject)=>setTimeout(()=>reject(new Error('Timeout cargando Supabase')),10000));
    const {createClient}=await Promise.race([modulePromise,timeoutPromise]);

    sb=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

    // Escuchar cambios sin hacer consultas dentro del lock de Auth.
    sb.auth.onAuthStateChange((_event,next)=>{
      window.setTimeout(()=>applySession(next),0);
    });

    const {data:{session:initialSession},error:sessionError}=await sb.auth.getSession();
    if(sessionError) console.error(sessionError);
    applySession(initialSession);

    // Contenido y datos se cargan después de que la UI ya está visible.
    window.setTimeout(async()=>{
      try{await Promise.all([loadUnit(1),loadSearch()]);render();}catch(err){console.error(err);}
    },0);
  }catch(err){
    showStartupError(err);
  }
}

function brand(){return `<div class="brand"><img src="./sun.svg" alt=""><div><b>CBC x SOLved</b><small>Clases del CBC</small></div></div>`}
function welcome(){return `<main class="welcome"><section class="welcomeCard">${brand()}<div class="welcomeHero"><span class="eyebrow">Tu espacio de estudio</span><h1>Química CBC, organizada para aprender de verdad.</h1><p>Entrá con tu cuenta o recorré la Unidad 1 completa como invitado.</p></div><div class="welcomeActions"><button class="primary" data-a="google">G&nbsp; Ingresar con Gmail</button><button class="secondary" data-a="guest">☀ Ver como invitado</button><button class="ghost" data-a="install">↓ Instalar app</button></div>${msg?`<div class="notice">${esc(msg)}</div>`:''}</section></main>`}
function navBtn(v,label,icon){return `<button data-v="${v}" class="${view===v||(v==='chemistry'&&view==='unit')?'active':''}"><span>${icon}</span>${label}</button>`}
function sidebar(){return `<aside class="sidebar ${side?'open':''}"><div class="sideHead">${brand()}<button class="icon mobileOnly" data-a="closeSide">×</button></div><nav>${navBtn('subjects','Materias','⌂')}${navBtn('chemistry','Química','⚗')}${navBtn('math','Matemática','Σ')}${isAdmin()?navBtn('admin','Panel de control','⚙'):''}</nav><div class="unitIndex"><div class="sideLabel">Química</div>${UNITS.map(u=>`<button data-u="${u}" class="${view==='unit'&&unit===u?'active':''}"><span>${u}</span><b>Unidad ${u}</b><em>${canUnit(u)?'':'🔒'}</em></button>`).join('')}</div><div class="sideBottom"><button data-a="theme">◐ Apariencia</button><button data-a="logout">↪ ${guest?'Salir de invitado':'Cerrar sesión'}</button></div></aside>${side?'<button class="backdrop" data-a="closeSide"></button>':''}`}
function renderTopbar(){const t=view==='subjects'?'Materias':view==='chemistry'?'Química':view==='math'?'Matemática':view==='admin'?'Panel de control':`Química · Unidad ${unit}`;const pill=guest?'Invitado':isAdmin()?'Administrador':currentAccess()?'Alumno':'Sin acceso';return `<header class="top"><button class="icon" data-a="openSide">☰</button><b>${t}</b><div class="topActions"><button class="icon" data-a="search">⌕</button><span class="pill">${pill}</span></div></header>`}
function subjects(){return `<section class="hero"><span class="eyebrow">CBC x SOLved</span><h1>¿Qué querés estudiar?</h1><p>Elegí una materia para entrar.</p></section><div class="subjects"><button class="subject" data-v="chemistry"><div class="subjectIcon">⚗</div><div><small>Disponible</small><h2>Química</h2><p>Unidad 1 completa y estructura preparada para las 13 unidades.</p></div><b>›</b></button><button class="subject disabled" data-v="math"><div class="subjectIcon">Σ</div><div><small>Próximamente</small><h2>Matemática</h2><p>El espacio está creado; todavía sin contenido.</p></div><b>›</b></button></div>`}
function chemistry(){return `<section class="hero compact"><span class="eyebrow">Química CBC</span><h1>Elegí la unidad.</h1><p>Los permisos pueden ser salteados: una unidad habilitada no implica acceso a las anteriores.</p></section><div class="units">${UNITS.map(u=>`<button class="unitCard ${canUnit(u)?'':'locked'}" data-u="${u}"><span>${String(u).padStart(2,'0')}</span><div><small>${u===1?'Acceso libre':canUnit(u)?'Habilitada':'Vista previa'}</small><h3>Unidad ${u}</h3><p>${UNIT_TITLES[u]||'Contenido en preparación.'}</p></div><b>${canUnit(u)?'☀':'🔒'}</b></button>`).join('')}</div>`}
function sectionLabel(type){return({chapter:'CAPÍTULO',theory:'TEORÍA',example:'EJEMPLO',formula:'FÓRMULAS',guide:'GUÍA',practice:'PRÁCTICA',evaluation:'EVALUACIÓN',simulator:'SIMULADOR',review:'REPASO',resource:'RECURSO'})[type]||type.toUpperCase()}
function exerciseCard(x,index){const sol=solutionsByExercise[x.id];return `<article id="exercise-${x.id}" class="exerciseCard"><div class="exerciseHead"><span>EJERCICIO ${String(index+1).padStart(2,'0')}</span><h3>${esc(x.title)}</h3></div><div class="exerciseStatement">${x.statement_html}</div>${sol?`<details class="solutionCard"><summary>Ver respuesta</summary><div class="solutionSteps">${sol.solution_html}${sol.final_answer?`<div class="finalAnswer"><b>Resultado</b>${sol.final_answer}</div>`:''}${isAdmin()?`<small class="adminSolutionState">Admin · ${sol.student_visible?'Visible para alumnos':'Oculta para alumnos'}</small>`:''}</div></details>`:''}</article>`}
function unitVisual(s){if(unit!==1)return'';const visuals={
  'cap-1':['matter-models.svg','Tres niveles para representar la materia: macroscópico, submicroscópico y simbólico'],
  'cap-2':['states-particles.svg','Esquema de partículas en sólido, líquido y gas'],
  'cap-3':['density-lab.svg','Relación entre masa, volumen y densidad medida con balanza y probeta'],
  'cap-4':['phases-components.svg','Comparación entre fases y componentes de sistemas materiales'],
  'cap-5':['substances-molecules.svg','Modelos de sustancias simples, moleculares compuestas y redes iónicas'],
  'cap-6':['separation-methods.svg','Esquemas de filtración, decantación, destilación y cromatografía'],
  'cap-7':['composition-percent.svg','Diagrama de composición centesimal como partes de una masa total']
};const v=visuals[s.key];return v?`<figure class="chapterVisual"><img loading="lazy" src="./assets/chemistry/unit-01/${v[0]}" alt="${v[1]}"><figcaption>${v[1]}</figcaption></figure>`:''}
function u1Simulator(s){if(unit!==1)return'';if(s.key==='cap-2')return `<section class="inlineSimulator" data-sim="states"><div class="simTitle"><span>SIMULADOR</span><h3>Estados de la materia</h3></div><div class="stateButtons"><button data-state="solid" class="active">Sólido</button><button data-state="liquid">Líquido</button><button data-state="gas">Gas</button></div><label>Temperatura relativa <input type="range" min="0" max="100" value="15" data-sim-input="temp"></label><svg class="particleStage" viewBox="0 0 520 230" role="img" aria-label="Partículas animadas del estado seleccionado"></svg><output data-sim-output></output></section>`;if(s.key==='cap-3')return `<section class="inlineSimulator" data-sim="density"><div class="simTitle"><span>SIMULADOR</span><h3>Laboratorio de densidad</h3></div><label>Masa (g) <input type="range" min="10" max="250" value="100" data-sim-input="mass"></label><label>Volumen (mL) <input type="range" min="10" max="200" value="80" data-sim-input="volume"></label><div class="densityScene"><div class="beaker"><span data-level></span></div><div class="scale">⚖ <b data-mass></b></div></div><output data-sim-output></output></section>`;if(s.key==='cap-6')return `<section class="inlineSimulator" data-sim="separation"><div class="simTitle"><span>SIMULADOR</span><h3>Elegí un método de separación</h3></div><label>Sistema <select data-sim-input="mixture"><option value="sand-water">Arena + agua</option><option value="oil-water">Aceite + agua</option><option value="salt-water">Sal disuelta + agua</option><option value="ink">Pigmentos de tinta</option></select></label><button class="primary small" data-check-separation>Comprobar método</button><output data-sim-output>Observá las propiedades de las fases y elegí el método.</output></section>`;return''}
function simulatorWidget(s){const t=s.title.toLowerCase();if(t.includes('recipiente')||t.includes('gases'))return `<div class="simLab" data-sim="gas"><label>Moles <input type="range" min="1" max="10" value="2" step=".5" data-sim-input="n"></label><label>Temperatura (K) <input type="range" min="200" max="600" value="300" data-sim-input="t"></label><label>Volumen (L) <input type="range" min="2" max="30" value="10" data-sim-input="v"></label><output>Presión: <b data-sim-output></b></output></div>`;if(t.includes('dilución'))return `<div class="simLab" data-sim="dilution"><label>C₁ (M) <input type="number" value="1" step=".1" data-sim-input="c1"></label><label>V₁ (mL) <input type="number" value="100" data-sim-input="v1"></label><label>V₂ (mL) <input type="number" value="500" data-sim-input="v2"></label><output>C₂: <b data-sim-output></b></output></div>`;if(t.includes('pH')||t.includes('ácido'))return `<div class="simLab" data-sim="ph"><label>Tipo <select data-sim-input="kind"><option value="acid">Ácido fuerte</option><option value="base">Base fuerte</option></select></label><label>Concentración (M) <input type="number" value="0.01" min="0.0000001" step=".001" data-sim-input="c"></label><output>pH: <b data-sim-output></b></output></div>`;if(t.includes('choques')||t.includes('velocidad'))return `<div class="simLab" data-sim="rate"><label>Concentración relativa <input type="range" min="1" max="5" value="1" data-sim-input="c"></label><label>Temperatura relativa <input type="range" min="1" max="4" value="1" data-sim-input="t"></label><output>Choques eficaces relativos: <b data-sim-output></b></output></div>`;return ''}
function updateSimulator(lab){const val=k=>Number(lab.querySelector(`[data-sim-input="${k}"]`)?.value||0),out=lab.querySelector('[data-sim-output]');if(!out)return;if(lab.dataset.sim==='gas')out.textContent=`${(val('n')*.082057*val('t')/val('v')).toFixed(2)} atm`;if(lab.dataset.sim==='dilution')out.textContent=`${(val('c1')*val('v1')/val('v2')).toFixed(3)} M`;if(lab.dataset.sim==='rate')out.textContent=`${(val('c')**2*val('t')).toFixed(1)}×`;if(lab.dataset.sim==='ph'){const c=Math.max(val('c'),1e-14),kind=lab.querySelector('[data-sim-input="kind"]').value;out.textContent=(kind==='acid'?-Math.log10(c):14+Math.log10(c)).toFixed(2)}}
function drawParticles(lab,state='solid'){
  const svg=lab.querySelector('.particleStage');if(!svg)return;const temp=Number(lab.querySelector('[data-sim-input="temp"]')?.value||15),count=state==='gas'?18:state==='liquid'?34:40,points=[];
  for(let i=0;i<count;i++){let x,y;if(state==='solid'){x=105+(i%8)*42;y=36+Math.floor(i/8)*39}else if(state==='liquid'){x=42+(i%9)*52+(i%2)*8;y=92+Math.floor(i/9)*35}else{x=28+((i*83)%460);y=24+((i*59)%180)}points.push(`<circle cx="${x}" cy="${y}" r="9" style="--dx:${((i%5)-2)*(2+temp/15)}px;--dy:${((i%7)-3)*(2+temp/18)}px;animation-duration:${Math.max(.35,2-temp/70)}s"/>`)}
  svg.innerHTML=`<rect x="8" y="8" width="504" height="214" rx="18"/>${points.join('')}`;lab.dataset.state=state;lab.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===state));lab.querySelector('[data-sim-output]').textContent=state==='solid'?'Partículas próximas, ordenadas y vibrando en posiciones fijas.':state==='liquid'?'Partículas próximas que se deslizan y cambian de vecinas.':'Partículas muy separadas, rápidas y con choques frecuentes.'
}
function updateStudySimulator(lab){const out=lab.querySelector('[data-sim-output]');if(lab.dataset.sim==='states'){drawParticles(lab,lab.dataset.state||'solid');return}if(lab.dataset.sim==='density'){const m=Number(lab.querySelector('[data-sim-input="mass"]').value),v=Number(lab.querySelector('[data-sim-input="volume"]').value),rho=m/v;lab.querySelector('[data-level]').style.height=`${Math.max(12,Math.min(92,v/2))}%`;lab.querySelector('[data-mass]').textContent=`${m} g`;out.innerHTML=`ρ = ${m} g ÷ ${v} mL = <b>${rho.toFixed(2)} g/mL</b> · ${rho>1?'Se hundiría en agua.':'Flotaría en agua.'}`;return}}
function initSectionTracking(){const buttons=[...document.querySelectorAll('.unitToc [data-scroll]')],sections=[...document.querySelectorAll('[data-section]')];if(!buttons.length||!sections.length||!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;buttons.forEach(b=>b.classList.toggle('active',b.dataset.scroll===visible.target.dataset.section))},{rootMargin:'-18% 0px -65% 0px',threshold:[0,.2,.6]});sections.forEach(s=>observer.observe(s))}
function unitPage(){if(!canUnit(unit))return `<section class="lockedPage"><div class="bigIcon">🔒</div><span class="eyebrow">Unidad ${unit}</span><h1>Esta unidad no está habilitada.</h1><p>El acceso se asigna por unidad, capítulo o evaluación y puede vencer en una fecha determinada.</p></section>`;const sections=(sectionsByUnit[unit]||[]).filter(s=>canSection(unit,s));const exercises=exercisesByUnit[unit]||[];if(!sections.length&&!exercises.length)return `<section class="hero"><span class="eyebrow">Química · Unidad ${unit}</span><h1>${UNIT_TITLES[unit]||`Unidad ${unit}`}</h1><p>La estructura está lista; el contenido se incorporará más adelante.</p></section>`;const u1=unit===1,navSections=sections.filter(s=>s.key!=='intro');return `<section class="unitHero ${u1?'masterHero':''}"><span class="eyebrow">Química CBC</span><span class="unitNumber">Unidad ${unit}</span><h1>${UNIT_TITLES[unit]||`Unidad ${unit}`}</h1><p>${u1?'Materia, propiedades y transformaciones explicadas desde lo observable hasta el modelo de partículas.':'Teoría, ejemplos y práctica organizados para estudiar con claridad.'}</p>${u1?'<div class="heroMotif" aria-hidden="true">⚗</div>':''}<div class="unitStats"><span>${sections.length} secciones</span><span>${exercises.length} ejercicios</span></div></section><button class="mobileTocButton" data-a="toggleToc" aria-expanded="${tocOpen}">☰ Contenido de la unidad</button><div class="studyLayout"><nav class="unitToc ${tocOpen?'open':''}" aria-label="Índice de la unidad"><b>Contenido de la unidad</b><div>${navSections.map((s,i)=>`<button data-scroll="${s.key}"><span>${String(i+1).padStart(2,'0')}</span>${esc(s.title.replace(/^\d+\.\s*/,''))}</button>`).join('')}${exercises.length?'<button data-scroll="exercises"><span>08</span>Ejercicios</button>':''}<button data-scroll="repaso"><span>10</span>Repaso</button></div></nav><div class="studyFlow">${u1?`<section id="sec-map" class="unitMap"><div><span class="eyebrow">Mapa de la unidad</span><h2>De la materia a su composición</h2><p>Observamos propiedades, construimos modelos, clasificamos sistemas y terminamos calculando cuánto aporta cada componente.</p></div><div class="mapSteps"><span>Observar</span><b>→</b><span>Modelar</span><b>→</b><span>Clasificar</span><b>→</b><span>Calcular</span></div></section>`:''}<div class="studySections">${navSections.map((s,i)=>`<section id="sec-${s.key}" class="studySection ${s.type}" data-section="${s.key}"><header><small>${sectionLabel(s.type)} · ${String(i+1).padStart(2,'0')}</small><h2>${esc(s.title.replace(/^\d+\.\s*/,''))}</h2></header><article>${unitVisual(s)}${s.html}${/simulador|calculadora/i.test(s.title)?simulatorWidget(s):''}${u1Simulator(s)}</article></section>`).join('')}</div>${exercises.length?`<section id="sec-exercises" class="exerciseBook" data-section="exercises"><div class="sectionHeading"><span>PRÁCTICA · 08</span><h2>Ejercicios</h2><p>Intentá cada consigna antes de abrir la respuesta. Si no está habilitada para tu cuenta, el botón no aparece.</p></div>${exercises.map(exerciseCard).join('')}</section>`:''}<section id="sec-repaso" class="reviewStrip" data-section="repaso"><span>REPASO · 10</span><h2>Antes de cerrar la unidad</h2><div><p>¿Podés distinguir fase de componente?</p><p>¿Justificás un método de separación?</p><p>¿Controlás unidades y porcentajes?</p></div></section></div></div>`}
function math(){return `<section class="lockedPage"><div class="bigIcon">Σ</div><span class="eyebrow">Matemática CBC</span><h1>Próximamente.</h1><p>Por ahora vamos a trabajar sólo sobre Química.</p></section>`}
function expiryLabel(u){if(!u.active)return'Suspendido';if(!u.access_expires_at)return'Sin vencimiento';const d=new Date(u.access_expires_at);if(d<Date.now())return'Vencido';return`Vence ${fmtDate(d)}`}
function grantSummary(email){const gs=userGrants(email);if(!gs.length)return'Sin permisos privados';const by=[...new Set(gs.map(g=>`U${g.unit_no}`))];return by.join(' · ')}
function unitGrantCard(u){const full=hasDraftFull(u),sections=sectionsByUnit[u]||[],chapters=sections.filter(s=>s.type==='chapter'),others=sections.filter(s=>s.type!=='chapter').slice(0,20);return `<div class="grantUnit"><div class="grantUnitHead"><div><span>Unidad ${u}</span>${u===1?'<small>Pública para invitados</small>':''}</div><label class="checkRow"><input type="checkbox" data-full-unit="${u}" ${full?'checked':''}> Toda la unidad</label></div>${chapters.length?`<div class="grantSub"><b>Capítulos</b>${chapters.map(s=>`<label class="checkRow"><input type="checkbox" data-grant-section="${u}|chapter|${s.key}" ${hasDraftSection(u,'chapter',s.key)?'checked':''} ${full?'disabled':''}> ${esc(s.title.replace(/^\d+\.\s*/,''))}</label>`).join('')}</div>`:''}${others.length?`<div class="grantSub"><b>Secciones</b>${others.map(s=>`<label class="checkRow"><input type="checkbox" data-grant-section="${u}|${s.type}|${s.key}" ${hasDraftSection(u,s.type,s.key)?'checked':''} ${full?'disabled':''}> ${esc(s.title.replace(/^\d+\.\s*/,''))}</label>`).join('')}</div>`:''}${!sections.length&&u>1?'<small class="muted">Todavía no hay secciones cargadas; se puede habilitar la unidad completa.</small>':''}</div>`}
function admin(){return `<section class="hero compact"><span class="eyebrow">Administración</span><h1>Panel de control</h1><p>Elegí exactamente qué unidades, capítulos y evaluaciones ve cada alumno y por cuánto tiempo.</p></section><section class="adminEditor"><div class="editorHead"><div><h2>${editing?'Editar acceso':'Nuevo acceso'}</h2><p>El acceso empieza al guardarlo.</p></div>${editing?'<button class="secondary small" data-a="resetForm">Nuevo</button>':''}</div><label class="field">Email<input id="accessEmail" type="email" value="${esc(editing?.email||'')}" placeholder="alumno@gmail.com" ${editing?'readonly':''}></label><div class="duration"><b>Duración</b><div class="durationPresets">${[['1m','1 mes'],['2m','2 meses'],['3m','3 meses'],['forever','Por siempre']].map(([k,l])=>`<button data-duration="${k}" class="${durationMode===k?'selected':''}">${l}</button>`).join('')}${editing?`<button data-duration="keep" class="${durationMode==='keep'?'selected':''}">Mantener actual</button>`:''}</div><label class="field dateField">Elegir otra fecha<input id="expiryDate" type="date" value="${customDate}"></label></div><h3 class="subheading">Permisos de Química</h3><div class="grantGrid">${UNITS.map(unitGrantCard).join('')}</div><button class="primary saveAccess" data-a="saveAccess">Guardar acceso</button></section><section class="adminList"><div class="listHead"><h2>Alumnos y testers</h2><span>${users.filter(u=>u.role!=='admin').length} registrados</span></div>${users.filter(u=>u.role!=='admin').length?users.filter(u=>u.role!=='admin').map(u=>`<div class="userRow"><div><b>${esc(u.email)}</b><small>${grantSummary(u.email)}</small></div><div><span class="status ${expiryLabel(u)==='Suspendido'||expiryLabel(u)==='Vencido'?'bad':''}">${expiryLabel(u)}</span><button class="secondary small" data-edit="${esc(u.email)}">Editar</button><button class="ghost small" data-toggle-user="${esc(u.email)}" data-active="${u.active}">${u.active?'Suspender':'Reactivar'}</button></div></div>`).join(''):'<div class="empty">Todavía no agregaste alumnos.</div>'}</section>`}
function adminSolutionsPanel(){const units=[...new Set(adminExercises.map(x=>x.unit_no))].sort((a,b)=>a-b);return `<section class="adminList solutionAdmin"><div class="listHead"><div><span class="eyebrow">Contenido</span><h2>Resoluciones de ejercicios</h2></div><span>${adminExercises.length} ejercicios</span></div>${units.map(u=>{const ex=adminExercises.filter(x=>x.unit_no===u),sol=ex.map(x=>adminSolutions.find(s=>s.exercise_id===x.id)).filter(Boolean),visible=sol.filter(s=>s.student_visible).length;return `<details class="solutionUnit"><summary><div><b>Unidad ${u} · ${UNIT_TITLES[u]||''}</b><small>${ex.length} ejercicios · ${sol.length} resueltos · ${visible} visibles</small></div><span>${sol.length===ex.length?'✓':'⚠'}</span></summary><div class="bulkActions"><button class="secondary small" data-solution-bulk="${u}" data-visible="true">Mostrar todas</button><button class="ghost small" data-solution-bulk="${u}" data-visible="false">Ocultar todas</button></div>${ex.map(x=>{const s=adminSolutions.find(y=>y.exercise_id===x.id);return `<label class="solutionToggle"><span><b>${esc(x.title)}</b><small>${s?'✓ Solución cargada':'⚠ Falta solución'}</small></span>${s?`<input type="checkbox" data-solution="${s.exercise_id}" ${s.student_visible?'checked':''}>`:''}</label>`}).join('')}</details>`}).join('')||'<div class="empty">Todavía no hay ejercicios cargados.</div>'}</section>`}
function searchModal(){const items=[{label:'Química',key:'chemistry'},{label:'Matemática',key:'math'},...UNITS.map(u=>({label:`Química · Unidad ${u} · ${UNIT_TITLES[u]||''}`,key:`unit:${u}`})),...searchItems];return `<div class="modalLayer"><div class="searchModal"><div class="searchBox">⌕<input id="q" autofocus placeholder="Buscar Boyle, densidad, Arrhenius, pH…"><button class="icon" data-a="closeSearch">×</button></div><div id="results" class="results">${items.slice(0,8).map(x=>`<button data-result="${x.key}"><b>${esc(x.label)}</b><span>›</span></button>`).join('')}</div></div></div>`}
function themeModal(){return `<div class="modalLayer"><div class="themeModal"><div class="modalTitle"><div><span class="eyebrow">Apariencia</span><h2>Personalizá CBC x SOLved</h2></div><button class="icon" data-a="closeTheme">×</button></div><div class="themeModes"><button data-mode="light" class="${mode==='light'?'selected':''}">☀ Claro</button><button data-mode="dark" class="${mode==='dark'?'selected':''}">☾ Oscuro</button></div><label class="colorField">Color principal <input id="accentColor" type="color" value="${accent}"></label><div class="swatches">${['#0f9f9a','#06b6d4','#14b8a6','#22c55e','#3b82f6','#8b5cf6','#ec4899','#f59e0b'].map(c=>`<button data-color="${c}" style="--sw:${c}"></button>`).join('')}</div><p>El color y el modo quedan guardados en este dispositivo.</p></div></div>`}

function render(){if(!session&&!guest){app.className='';app.innerHTML=welcome();bind();return}let content=subjects();if(view==='chemistry')content=chemistry();if(view==='unit')content=unitPage();if(view==='math')content=math();if(view==='admin'&&isAdmin())content=admin()+adminSolutionsPanel();app.className='appShell';app.innerHTML=`${sidebar()}<div class="main">${renderTopbar()}<main class="content">${msg?`<div class="notice inline">${esc(msg)}</div>`:''}${content}</main></div>${searchOpen?searchModal():''}${themeOpen?themeModal():''}`;bind()}
function bind(){
  document.querySelectorAll('[data-v]').forEach(x=>x.onclick=async()=>{view=x.dataset.v;side=false;if(view==='admin')await loadAdmin();render()});
  document.querySelectorAll('[data-u]').forEach(x=>x.onclick=async()=>{unit=Number(x.dataset.u);view='unit';side=false;render();await loadUnit(unit);render()});
  const on=(q,fn)=>{const x=document.querySelector(q);if(x)x.onclick=fn};
  on('[data-a="google"]',google);on('[data-a="guest"]',()=>{guest=true;localStorage.setItem('cbc-mode','guest');render()});
  on('[data-a="install"]',async()=>{if(installPrompt){installPrompt.prompt();installPrompt=null}else{msg='En Chrome: menú ⋮ → Instalar app o Agregar a pantalla principal.';render()}});
  on('[data-a="logout"]',logout);on('[data-a="openSide"]',()=>{side=true;render()});document.querySelectorAll('[data-a="closeSide"]').forEach(x=>x.onclick=()=>{side=false;render()});
  on('[data-a="search"]',()=>{searchOpen=true;render();setTimeout(()=>document.querySelector('#q')?.focus(),20)});on('[data-a="closeSearch"]',()=>{searchOpen=false;render()});
  on('[data-a="theme"]',()=>{themeOpen=true;render()});on('[data-a="closeTheme"]',()=>{themeOpen=false;render()});
  on('[data-a="saveAccess"]',saveAccess);on('[data-a="resetForm"]',resetForm);
  document.querySelectorAll('[data-edit]').forEach(x=>x.onclick=()=>editUser(x.dataset.edit));document.querySelectorAll('[data-toggle-user]').forEach(x=>x.onclick=()=>toggleUser(x.dataset.toggleUser,x.dataset.active!=='true'));
  document.querySelectorAll('[data-solution]').forEach(x=>x.onchange=()=>setSolutionVisibility(x.dataset.solution,x.checked));document.querySelectorAll('[data-solution-bulk]').forEach(x=>x.onclick=()=>setUnitSolutionsVisibility(x.dataset.solutionBulk,x.dataset.visible==='true'));
  document.querySelectorAll('[data-duration]').forEach(x=>x.onclick=()=>{durationMode=x.dataset.duration;if(durationMode!=='custom')customDate='';document.querySelectorAll('[data-duration]').forEach(b=>b.classList.toggle('selected',b.dataset.duration===durationMode));});
  const date=document.querySelector('#expiryDate');if(date)date.onchange=e=>{customDate=e.target.value;durationMode='custom';document.querySelectorAll('[data-duration]').forEach(b=>b.classList.remove('selected'));};
  on('[data-a="toggleToc"]',()=>{tocOpen=!tocOpen;render()});
  document.querySelectorAll('[data-scroll]').forEach(x=>x.onclick=()=>{tocOpen=false;document.querySelector(`#sec-${CSS.escape(x.dataset.scroll)}`)?.scrollIntoView({behavior:'smooth',block:'start'})});
  document.querySelectorAll('[data-sim]').forEach(lab=>{lab.querySelectorAll('input,select').forEach(x=>x.oninput=()=>updateSimulator(lab));updateSimulator(lab)});
  document.querySelectorAll('.inlineSimulator').forEach(lab=>{lab.querySelectorAll('input,select').forEach(x=>x.oninput=()=>updateStudySimulator(lab));lab.querySelectorAll('[data-state]').forEach(x=>x.onclick=()=>drawParticles(lab,x.dataset.state));const check=lab.querySelector('[data-check-separation]');if(check)check.onclick=()=>{const value=lab.querySelector('[data-sim-input="mixture"]').value,answers={'sand-water':'Filtración: el sólido insoluble queda retenido por el filtro.','oil-water':'Decantación: las fases inmiscibles se separan por densidad.','salt-water':'Destilación para recuperar agua, o cristalización para recuperar la sal.','ink':'Cromatografía: los pigmentos migran distinto según su afinidad.'};lab.querySelector('[data-sim-output]').textContent=answers[value]};updateStudySimulator(lab)});
  document.querySelectorAll('[data-mode]').forEach(x=>x.onclick=()=>{mode=x.dataset.mode;localStorage.setItem('cbc-theme',mode);applyTheme();render()});
  document.querySelectorAll('[data-color]').forEach(x=>x.onclick=()=>{accent=x.dataset.color;localStorage.setItem('cbc-accent',accent);applyTheme();render()});
  const ac=document.querySelector('#accentColor');if(ac)ac.oninput=e=>{accent=e.target.value;localStorage.setItem('cbc-accent',accent);applyTheme()};
  const q=document.querySelector('#q');if(q)q.oninput=e=>{const s=e.target.value.toLowerCase().trim();const items=[{label:'Química',key:'chemistry',text:'química'},{label:'Matemática',key:'math',text:'matemática'},...UNITS.map(u=>({label:`Química · Unidad ${u} · ${UNIT_TITLES[u]||''}`,key:`unit:${u}`,text:`unidad ${u} ${UNIT_TITLES[u]||''}`})),...searchItems].filter(x=>(x.text||x.label).toLowerCase().includes(s)).slice(0,40);document.querySelector('#results').innerHTML=items.map(x=>`<button data-result="${x.key}"><b>${esc(x.label)}</b><span>›</span></button>`).join('')||'<div class="empty">Sin resultados.</div>';document.querySelectorAll('[data-result]').forEach(r=>r.onclick=()=>goResult(r.dataset.result))};
  document.querySelectorAll('[data-result]').forEach(r=>r.onclick=()=>goResult(r.dataset.result));
  initSectionTracking();
}
async function goResult(k){let anchor='';if(k.startsWith('unit:')){unit=Number(k.split(':')[1]);view='unit'}else if(k.startsWith('section:')){const p=k.split(':');unit=Number(p[1]);anchor=`sec-${p.slice(2).join(':')}`;view='unit'}else if(k.startsWith('exercise:')){const p=k.split(':');unit=Number(p[1]);anchor=`exercise-${p[2]}`;view='unit'}else view=k;searchOpen=false;render();if(view==='unit'){await loadUnit(unit);render();if(anchor)setTimeout(()=>document.getElementById(anchor)?.scrollIntoView({behavior:'smooth'}),60)}}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
init();

