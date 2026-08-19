async function loadUnit1(){
  if(!sb){unit1Sections=[];return;}
  const {data,error}=await sb.from('course_sections').select('section_key,section_type,title,sort_order,body_html,is_public').eq('subject','chemistry').eq('unit_no',1).order('sort_order');
  if(error){console.error(error);msg='No pude cargar el contenido de la Unidad 1.';unit1Sections=[];return;}
  unit1Sections=(data||[]).map(s=>({key:s.section_key,type:s.section_type,title:s.title,order:s.sort_order,html:s.body_html,isPublic:s.is_public}));
}

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
      try{await loadUnit1();render();}catch(err){console.error(err);}
    },0);
  }catch(err){
    showStartupError(err);
  }
}