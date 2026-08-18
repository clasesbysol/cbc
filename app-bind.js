function render(){if(!session&&!guest){app.className='';app.innerHTML=welcome();bind();return}let content=subjects();if(view==='chemistry')content=chemistry();if(view==='unit')content=unitPage();if(view==='math')content=math();if(view==='admin'&&isAdmin())content=admin();app.className='appShell';app.innerHTML=`${sidebar()}<div class="main">${top()}<main class="content">${msg?`<div class="notice inline">${esc(msg)}</div>`:''}${content}</main></div>${searchOpen?searchModal():''}${themeOpen?themeModal():''}`;bind()}
function bind(){
  document.querySelectorAll('[data-v]').forEach(x=>x.onclick=async()=>{view=x.dataset.v;side=false;if(view==='admin')await loadAdmin();render()});
  document.querySelectorAll('[data-u]').forEach(x=>x.onclick=()=>{unit=Number(x.dataset.u);view='unit';side=false;render()});
  const on=(q,fn)=>{const x=document.querySelector(q);if(x)x.onclick=fn};
  on('[data-a="google"]',google);on('[data-a="guest"]',()=>{guest=true;localStorage.setItem('cbc-mode','guest');render()});
  on('[data-a="install"]',async()=>{if(installPrompt){installPrompt.prompt();installPrompt=null}else{msg='En Chrome: menú ⋮ → Instalar app o Agregar a pantalla principal.';render()}});
  on('[data-a="logout"]',logout);on('[data-a="openSide"]',()=>{side=true;render()});document.querySelectorAll('[data-a="closeSide"]').forEach(x=>x.onclick=()=>{side=false;render()});
  on('[data-a="search"]',()=>{searchOpen=true;render();setTimeout(()=>document.querySelector('#q')?.focus(),20)});on('[data-a="closeSearch"]',()=>{searchOpen=false;render()});
  on('[data-a="theme"]',()=>{themeOpen=true;render()});on('[data-a="closeTheme"]',()=>{themeOpen=false;render()});
  on('[data-a="saveAccess"]',saveAccess);on('[data-a="resetForm"]',resetForm);
  document.querySelectorAll('[data-edit]').forEach(x=>x.onclick=()=>editUser(x.dataset.edit));document.querySelectorAll('[data-toggle-user]').forEach(x=>x.onclick=()=>toggleUser(x.dataset.toggleUser,x.dataset.active!=='true'));
  document.querySelectorAll('[data-duration]').forEach(x=>x.onclick=()=>{durationMode=x.dataset.duration;if(durationMode!=='custom')customDate='';document.querySelectorAll('[data-duration]').forEach(b=>b.classList.toggle('selected',b.dataset.duration===durationMode));});
  const date=document.querySelector('#expiryDate');if(date)date.onchange=e=>{customDate=e.target.value;durationMode='custom';document.querySelectorAll('[data-duration]').forEach(b=>b.classList.remove('selected'));};
  document.querySelectorAll('[data-scroll]').forEach(x=>x.onclick=()=>document.querySelector(`#sec-${CSS.escape(x.dataset.scroll)}`)?.scrollIntoView({behavior:'smooth',block:'start'}));
  document.querySelectorAll('[data-mode]').forEach(x=>x.onclick=()=>{mode=x.dataset.mode;localStorage.setItem('cbc-theme',mode);applyTheme();render()});
  document.querySelectorAll('[data-color]').forEach(x=>x.onclick=()=>{accent=x.dataset.color;localStorage.setItem('cbc-accent',accent);applyTheme();render()});
  const ac=document.querySelector('#accentColor');if(ac)ac.oninput=e=>{accent=e.target.value;localStorage.setItem('cbc-accent',accent);applyTheme()};
  const q=document.querySelector('#q');if(q)q.oninput=e=>{const s=e.target.value.toLowerCase();const items=[['Química','chemistry'],['Matemática','math'],...UNITS.map(u=>[`Química · Unidad ${u}`,`unit:${u}`]),...unit1Sections.map(x=>[`Unidad 1 · ${x.title}`,`section:${x.key}`])].filter(([t])=>t.toLowerCase().includes(s));document.querySelector('#results').innerHTML=items.map(([t,k])=>`<button data-result="${k}"><b>${esc(t)}</b><span>›</span></button>`).join('')||'<div class="empty">Sin resultados.</div>';document.querySelectorAll('[data-result]').forEach(r=>r.onclick=()=>goResult(r.dataset.result))};
  document.querySelectorAll('[data-result]').forEach(r=>r.onclick=()=>goResult(r.dataset.result));
}
function goResult(k){if(k.startsWith('unit:')){unit=Number(k.split(':')[1]);view='unit'}else if(k.startsWith('section:')){unit=1;view='unit';searchOpen=false;render();setTimeout(()=>document.querySelector(`#sec-${CSS.escape(k.split(':')[1])}`)?.scrollIntoView({behavior:'smooth'}),60);return}else view=k;searchOpen=false;render()}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
init();