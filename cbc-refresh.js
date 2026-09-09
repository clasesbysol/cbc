(()=>{
  'use strict';

  const LOGO='./cbc-logo.png';
  const RECENT_KEY='cbc-recent-units-v2';
  let pendingElement=null;
  let scheduled=false;

  const readRecent=()=>{
    let list=[];
    try{list=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch(_){list=[]}
    if(!Array.isArray(list))list=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||'';
      const m=key.match(/^cbc-unit-progress-(\d+)$/);
      if(m&&!list.includes(Number(m[1])))list.push(Number(m[1]));
    }
    return list.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=13).slice(0,7);
  };

  const rememberUnit=value=>{
    const n=Number(value);
    if(!Number.isInteger(n)||n<1||n>13)return;
    const list=readRecent().filter(x=>x!==n);
    list.unshift(n);
    localStorage.setItem(RECENT_KEY,JSON.stringify(list.slice(0,7)));
  };

  function replaceLogos(root=document){
    root.querySelectorAll?.('.brand img,.loading img').forEach(img=>{
      if(!img.src.endsWith('/cbc-logo.png'))img.src=LOGO;
      img.alt=img.closest('.brand')?'CBC x SOLved':'';
    });
  }

  function enhanceSidebar(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar||sidebar.dataset.cbcRefresh==='1')return;
    sidebar.dataset.cbcRefresh='1';
    replaceLogos(sidebar);

    const nav=sidebar.querySelector('nav');
    const home=nav?.querySelector('[data-v="subjects"]');
    if(home){
      home.innerHTML='<span>⌂</span>Inicio';
      home.setAttribute('aria-label','Inicio');
    }
    nav?.querySelectorAll('[data-v]').forEach(btn=>{
      if(btn.dataset.v!=='subjects')btn.style.display='none';
    });
    if(nav&&!nav.querySelector('.cbc-settings-button')){
      const settings=document.createElement('button');
      settings.type='button';
      settings.className='cbc-settings-button';
      settings.dataset.cbcSettings='1';
      settings.innerHTML='<span>⚙</span>Configuración';
      nav.append(settings);
    }

    const unitIndex=sidebar.querySelector('.unitIndex');
    if(unitIndex)unitIndex.setAttribute('aria-hidden','true');

    const recent=document.createElement('section');
    recent.className='cbc-recent';
    const units=readRecent();
    recent.innerHTML=`<div class="sideLabel">Recientes</div><small class="cbc-recent-subject">Química</small><div class="cbc-recent-list">${units.length?units.map(u=>`<button type="button" class="cbc-recent-item" data-cbc-recent-unit="${u}"><span>${u}</span><b>Unidad ${u}</b></button>`).join(''):'<div class="cbc-recent-empty">Las unidades que abras van a aparecer acá.</div>'}</div>`;
    if(unitIndex)sidebar.insertBefore(recent,unitIndex);else nav?.after(recent);
  }

  function enhanceTopbar(){
    const title=document.querySelector('.top>b');
    if(title&&title.textContent.trim()==='Materias')title.textContent='Inicio';
  }

  function enhanceThemeModal(){
    const modal=document.querySelector('.themeModal');
    if(!modal||modal.dataset.cbcRefresh==='1')return;
    modal.dataset.cbcRefresh='1';
    const eyebrow=modal.querySelector('.eyebrow');
    const h2=modal.querySelector('h2');
    if(eyebrow)eyebrow.textContent='CONFIGURACIÓN';
    if(h2)h2.textContent='Configuración';
    const p=modal.querySelector(':scope > p');
    if(p)p.textContent='Elegí modo claro u oscuro. Los colores quedan fijos con la identidad de CBC x SOLved.';
    const note=document.createElement('div');
    note.className='cbc-config-note';
    note.textContent='Modo claro: fondo blanco. Modo oscuro: azul profundo del logo. La interfaz usa celeste, azul y dorado, sin degradados.';
    modal.append(note);
    const adminHidden=document.querySelector('.sidebar [data-v="admin"]');
    const isAdmin=document.querySelector('.pill')?.textContent.trim()==='Administrador';
    if(isAdmin&&adminHidden){
      const button=document.createElement('button');
      button.type='button';
      button.className='secondary cbc-admin-entry';
      button.dataset.cbcAdmin='1';
      button.textContent='⚙ Abrir panel de control';
      modal.append(button);
    }
  }

  function theoryMarkup(){
    return `<details class="cbc-periodic-theory"><summary>Cómo leer la tabla y por qué cambian las propiedades</summary><div class="cbc-periodic-theory-body"><h4>Cómo está organizada</h4><p>La tabla está ordenada por <b>número atómico Z</b>, es decir, por cantidad de protones. Los períodos reflejan cuál es el nivel principal más externo ocupado y los grupos reúnen átomos con patrones parecidos de electrones de valencia; por eso suelen reaccionar de manera semejante.</p><h4>La causa física de las tendencias</h4><p>Un electrón externo no siente simplemente “todos los protones”. La atracción que experimenta depende de la <b>carga nuclear efectiva</b>, del <b>apantallamiento</b> de los electrones internos, de la <b>distancia al núcleo</b> y de la repulsión entre electrones. Cuando aumenta la atracción neta, la nube electrónica tiende a contraerse; cuando dominan distancia y apantallamiento, se expande.</p><h4>Qué pasa con las propiedades</h4><ul><li><b>Radio atómico:</b> disminuye cuando el núcleo atrae con más fuerza la misma capa electrónica; aumenta cuando aparece una capa nueva más alejada.</li><li><b>Energía de ionización:</b> es mayor cuando cuesta más arrancar un electrón porque está más fuertemente ligado al núcleo.</li><li><b>Electronegatividad:</b> aumenta cuando un átomo puede atraer con mayor intensidad el par electrónico de un enlace.</li><li><b>Afinidad electrónica:</b> depende también de la energía del orbital que se ocupa y de la repulsión electrónica, por eso presenta más excepciones.</li></ul><h4>Por qué existen excepciones</h4><p>Los subniveles s, p, d y f no tienen la misma energía, y el apareamiento de electrones agrega repulsión. Configuraciones semillenas o completas pueden ser especialmente estables. Por eso las tendencias sirven para razonar, no como flechas para memorizar sin mirar la estructura electrónica.</p></div></details>`;
  }

  function enhancePeriodic(){
    const layer=document.querySelector('.periodicLayer');
    if(!layer||layer.dataset.cbcRefresh==='1')return;
    layer.dataset.cbcRefresh='1';

    const learn=layer.querySelector('.periodicLearn');
    if(learn)learn.innerHTML=theoryMarkup();

    const detail=layer.querySelector('.elementDetail');
    const detailHtml=detail?.innerHTML||'';
    detail?.remove();

    if(pendingElement&&detailHtml){
      const overlay=document.createElement('div');
      overlay.className='cbc-element-float-layer';
      overlay.dataset.cbcElementOverlay='1';
      overlay.innerHTML=`<section class="cbc-element-float" role="dialog" aria-modal="true" aria-label="Propiedades de ${pendingElement}"><button type="button" class="cbc-element-close" data-cbc-close-element="1" aria-label="Cerrar">×</button>${detailHtml}</section>`;
      layer.append(overlay);
      pendingElement=null;
    }
  }

  function applyThemeColor(){
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=document.documentElement.dataset.theme==='dark'?'#0f1f53':'#75bef5';
  }

  function enhanceAll(){
    scheduled=false;
    replaceLogos();
    enhanceSidebar();
    enhanceTopbar();
    enhanceThemeModal();
    enhancePeriodic();
    applyThemeColor();
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(enhanceAll);
  }

  document.addEventListener('click',event=>{
    const element=event.target.closest?.('[data-element]');
    if(element)pendingElement=element.dataset.element||null;

    const unit=event.target.closest?.('[data-u]');
    if(unit)rememberUnit(unit.dataset.u);

    const result=event.target.closest?.('[data-result]');
    if(result){
      const key=result.dataset.result||'';
      const m=key.match(/^(?:unit|section|exercise):(\d+)/);
      if(m)rememberUnit(m[1]);
    }

    const recent=event.target.closest?.('[data-cbc-recent-unit]');
    if(recent){
      event.preventDefault();
      event.stopPropagation();
      const hidden=document.querySelector(`.unitIndex [data-u="${recent.dataset.cbcRecentUnit}"]`);
      hidden?.click();
      return;
    }

    if(event.target.closest?.('[data-cbc-settings]')){
      event.preventDefault();
      event.stopPropagation();
      document.querySelector('.sideBottom [data-a="theme"]')?.click();
      return;
    }

    if(event.target.closest?.('[data-cbc-admin]')){
      event.preventDefault();
      event.stopPropagation();
      document.querySelector('.sidebar [data-v="admin"]')?.click();
      return;
    }

    if(event.target.closest?.('[data-cbc-close-element]')){
      event.preventDefault();
      event.stopPropagation();
      event.target.closest('.cbc-element-float-layer')?.remove();
      return;
    }

    if(event.target.classList?.contains('cbc-element-float-layer')){
      event.preventDefault();
      event.stopPropagation();
      event.target.remove();
    }
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const overlay=document.querySelector('.cbc-element-float-layer');
    if(overlay){
      event.stopImmediatePropagation();
      overlay.remove();
    }
  },true);

  const observer=new MutationObserver(schedule);
  const start=()=>{
    observer.observe(document.body,{subtree:true,childList:true});
    new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    enhanceAll();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
