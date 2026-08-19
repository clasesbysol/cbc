async function loadUnit1(){
  if(!sb){unit1Sections=[];return;}
  const {data,error}=await sb.from('course_sections').select('section_key,section_type,title,sort_order,body_html,is_public').eq('subject','chemistry').eq('unit_no',1).order('sort_order');
  if(error){console.error(error);msg='No pude cargar el contenido de la Unidad 1.';unit1Sections=[];return;}
  unit1Sections=(data||[]).map(s=>({key:s.section_key,type:s.section_type,title:s.title,order:s.sort_order,html:s.body_html,isPublic:s.is_public}));
}

async function applySession(next){
  session=next;
  if(next){
    guest=false;
    localStorage.setItem('cbc-mode','account');
    await loadOwn();
    if(isAdmin()){
      view='admin';
      await loadAdmin();
    } else if(view==='admin') {
      view='subjects';
    }
  } else {
    profile=null;
    myGrants=[];
    if(localStorage.getItem('cbc-mode')==='account') localStorage.removeItem('cbc-mode');
    if(view==='admin') view='subjects';
  }
  render();
}

async function init(){
  try{
    if(CFG.supabaseUrl&&CFG.supabaseAnonKey){
      const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      sb=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

      const {data:{session:initialSession},error:sessionError}=await sb.auth.getSession();
      if(sessionError) console.error(sessionError);
      session=initialSession;

      await loadUnit1();

      if(session){
        guest=false;
        localStorage.setItem('cbc-mode','account');
        await loadOwn();
        if(isAdmin()){
          view='admin';
          await loadAdmin();
        }
      }

      // No hacer consultas a Supabase dentro del callback de auth.
      // Supabase mantiene un lock durante este evento; esperar otras consultas aquí
      // puede dejar congelado el retorno desde Google OAuth.
      sb.auth.onAuthStateChange((_event,next)=>{
        window.setTimeout(()=>{
          applySession(next).catch(err=>{
            console.error(err);
            msg='La sesión se inició, pero hubo un problema al cargar tu acceso. Recargá la página.';
            render();
          });
        },0);
      });
    }
  }catch(err){
    console.error(err);
    msg='No pude iniciar la conexión. Recargá la página e intentá nuevamente.';
  }
  render();
}