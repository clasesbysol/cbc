(()=>{
  'use strict';
  const LOGO='./cbc-logo.png?v=0.15.0';
  let scheduled=false;

  const img=(className,alt='CBC x SOLved')=>{
    const el=document.createElement('img');
    el.className=className;
    el.src=LOGO;
    el.alt=alt;
    el.decoding='async';
    return el;
  };

  function ensureBrandImages(){
    document.querySelectorAll('.brand img,.loading img').forEach(el=>{
      if(el.getAttribute('src')!==LOGO)el.src=LOGO;
      el.style.objectFit='contain';
      el.style.objectPosition='center';
    });
  }

  function ensureTopbar(){
    const top=document.querySelector('.top');
    if(!top||top.querySelector('.cbc-top-logo'))return;
    const menu=top.querySelector('[data-a="openSide"]');
    const logo=img('cbc-top-logo','');
    if(menu)menu.after(logo);else top.prepend(logo);
  }

  function ensureHome(){
    const subjects=document.querySelector('.subjects');
    const hero=subjects?.previousElementSibling;
    if(hero?.classList.contains('hero')&&!hero.querySelector('.cbc-home-emblem')){
      hero.classList.add('cbc-home-hero');
      const emblem=document.createElement('aside');
      emblem.className='cbc-home-emblem';
      emblem.setAttribute('aria-hidden','true');
      emblem.innerHTML=`<img src="${LOGO}" alt=""><b>CBC × SOLved</b><small>Clases del CBC</small>`;
      hero.append(emblem);
    }
    const chemistry=subjects?.querySelector('.subject:not(.disabled)');
    if(chemistry&&!chemistry.querySelector('.cbc-subject-seal'))chemistry.append(img('cbc-subject-seal',''));
  }

  function ensureSidebar(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar||sidebar.querySelector('.cbc-side-decor'))return;
    const decor=document.createElement('div');
    decor.className='cbc-side-decor';
    decor.setAttribute('aria-hidden','true');
    decor.innerHTML=`<img src="${LOGO}" alt=""><span>CBC × SOLved<br>Clases del CBC</span>`;
    const bottom=sidebar.querySelector('.sideBottom');
    if(bottom)sidebar.insertBefore(decor,bottom);else sidebar.append(decor);
  }

  function ensureWelcome(){
    const card=document.querySelector('.welcomeCard');
    if(!card||card.querySelector('.cbc-welcome-seal'))return;
    const seal=img('cbc-welcome-seal','');
    seal.setAttribute('aria-hidden','true');
    card.append(seal);
  }

  function ensureUnitHero(){
    document.querySelectorAll('.masterHero').forEach(hero=>{
      if(!hero.querySelector('.cbc-unit-logo')){
        const logo=img('cbc-unit-logo','');
        logo.setAttribute('aria-hidden','true');
        hero.append(logo);
      }
    });
  }

  function ensureSettings(){
    const modal=document.querySelector('.themeModal');
    if(!modal||modal.querySelector('.cbc-settings-logo'))return;
    const logo=img('cbc-settings-logo','CBC x SOLved');
    modal.prepend(logo);
  }

  function ensurePeriodic(){
    const header=document.querySelector('.periodicModal>header');
    if(header&&!header.querySelector('.cbc-periodic-brand')){
      const text=header.firstElementChild;
      if(text){
        const wrap=document.createElement('div');
        wrap.className='cbc-periodic-brand';
        wrap.append(img('',''));
        text.replaceWith(wrap);
        wrap.append(text);
      }
    }
    const fab=document.querySelector('.periodicFab');
    if(fab&&!fab.querySelector('img'))fab.innerHTML=`<img src="${LOGO}" alt=""><span>Tabla periódica</span>`;
  }

  function apply(){
    scheduled=false;
    ensureBrandImages();
    ensureTopbar();
    ensureHome();
    ensureSidebar();
    ensureWelcome();
    ensureUnitHero();
    ensureSettings();
    ensurePeriodic();
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(apply);
  }

  const start=()=>{
    new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
    apply();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
