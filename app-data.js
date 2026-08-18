async function loadUnit1(){
  if(!sb){unit1Sections=[];return;}
  const {data,error}=await sb.from('course_sections').select('section_key,section_type,title,sort_order,body_html,is_public').eq('subject','chemistry').eq('unit_no',1).order('sort_order');
  if(error){console.error(error);msg='No pude cargar el contenido de la Unidad 1.';unit1Sections=[];return;}
  unit1Sections=(data||[]).map(s=>({key:s.section_key,type:s.section_type,title:s.title,order:s.sort_order,html:s.body_html,isPublic:s.is_public}));
}
async function init(){
  if(CFG.supabaseUrl&&CFG.supabaseAnonKey){
    const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    sb=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    session=(await sb.auth.getSession()).data.session;
    await loadUnit1();
    if(session){guest=false;localStorage.setItem('cbc-mode','account');await loadOwn();if(isAdmin()){view='admin';await loadAdmin();}}
    sb.auth.onAuthStateChange(async(_,next)=>{session=next;if(next){guest=false;localStorage.setItem('cbc-mode','account');await loadOwn();if(isAdmin()){view='admin';await loadAdmin();}}render();});
  }
  render();
}