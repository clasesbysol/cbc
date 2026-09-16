(() => {
  'use strict';

  const imageFixes = new Map([
    ['ionic-bonding-nacl.jpeg','ionic-bonding-nacl.jpg'],
    ['metallic-bonding.png','metallic-bonding.jpg'],
    ['octet-exceptions.jpeg','octet-exceptions.jpg']
  ]);

  const headingReplacements = new Map([
    ['Qué significa realmente “más estable”','Estabilidad y energía'],
    ['Cómo usar la electronegatividad sin convertirla en una regla mecánica','Diferencia de electronegatividad'],
    ['Los tres controles que evitan casi todos los errores','Control de una estructura de Lewis'],
    ['Número de oxidación: una herramienta de contabilidad','Cómo se calcula'],
    ['La cadena lógica completa','Resolución integrada'],
    ['El ranking es una orientación, no una calculadora automática','Comparación entre interacciones'],
    ['Control final antes de cerrar el ejercicio','Control final']
  ]);

  const currentUnit = () => {
    const text = document.querySelector('.unitNumber')?.textContent || '';
    const match = text.match(/(\d+)/);
    return match ? Number(match[1]) : null;
  };

  function repairImage(img){
    if (!img || img.dataset.u34ImageChecked === '1') return;
    const source = img.getAttribute('src') || '';
    for (const [bad, good] of imageFixes){
      if (source.includes(bad)){
        img.setAttribute('src', source.replace(bad, good));
        img.dataset.u34ImageChecked = '1';
        return;
      }
    }
    img.dataset.u34ImageChecked = '1';
  }

  function repairImages(root=document){
    root.querySelectorAll?.('img').forEach(repairImage);
  }

  function cleanHeadings(root=document){
    if (![3,4].includes(currentUnit())) return;
    root.querySelectorAll?.('.studySection h3').forEach(h => {
      const replacement = headingReplacements.get(h.textContent.trim());
      if (replacement) h.textContent = replacement;
    });
  }

  function takeUsefulStep(step){
    const wrap = step.querySelector(':scope > div') || step;
    const clone = wrap.cloneNode(true);
    const oldHeading = clone.querySelector('h4');
    const heading = oldHeading?.textContent.trim() || '';
    oldHeading?.remove();
    return {heading, node: clone};
  }

  function normalizeSolution(container){
    if (!container || container.dataset.compactSolution === '1') return;
    const steps = [...container.querySelectorAll(':scope > .solutionStep')];
    if (!steps.length) return;

    let useful = steps.filter(step => {
      const text = step.textContent.toLowerCase();
      if (step.classList.contains('verification')) return false;
      if (text.includes('leer la consigna') || text.includes('elegir el criterio')) return false;
      if (text.includes('comprobar el resultado') && text.includes('verificar')) return false;
      return true;
    });
    if (!useful.length) return;

    const first = useful.shift();
    const firstData = takeUsefulStep(first);

    const plan = document.createElement('section');
    plan.className = 'solutionBlock solutionPlan';
    const planTitle = document.createElement('h4');
    planTitle.textContent = 'Planteo';
    plan.appendChild(planTitle);
    plan.appendChild(firstData.node);

    const development = document.createElement('section');
    development.className = 'solutionBlock solutionDevelopment';
    const devTitle = document.createElement('h4');
    devTitle.textContent = 'Desarrollo';
    development.appendChild(devTitle);

    useful.forEach(step => {
      const data = takeUsefulStep(step);
      const item = document.createElement('div');
      item.className = 'developmentItem';
      if (data.heading && !/continuar el desarrollo|plantear y justificar/i.test(data.heading)){
        const h = document.createElement('h5');
        h.textContent = data.heading;
        item.appendChild(h);
      }
      while (data.node.firstChild) item.appendChild(data.node.firstChild);
      development.appendChild(item);
    });

    const firstStep = steps[0];
    firstStep.parentNode.insertBefore(plan, firstStep);
    if (useful.length) firstStep.parentNode.insertBefore(development, firstStep);
    steps.forEach(step => step.remove());

    const final = container.querySelector(':scope > .finalAnswer');
    if (final){
      const label = final.querySelector(':scope > b:first-child, :scope > strong:first-child');
      if (label) label.textContent = 'Resultado';
    }
    container.dataset.compactSolution = '1';
  }

  function normalizeSolutions(root=document){
    if (![3,4].includes(currentUnit())) return;
    root.querySelectorAll?.('.solutionSteps, .integratedSolutionBody').forEach(normalizeSolution);
    root.querySelectorAll?.('.solutionCard>summary').forEach(summary => {
      if (/paso a paso/i.test(summary.textContent)) summary.textContent = 'Ver resolución';
    });
    root.querySelectorAll?.('.integratedSolution>summary').forEach(summary => {
      summary.textContent = '✓ Ver resolución';
    });
  }

  function run(){
    repairImages();
    cleanHeadings();
    normalizeSolutions();
  }

  document.addEventListener('error', event => {
    const target = event.target;
    if (target instanceof HTMLImageElement){
      target.dataset.u34ImageChecked = '';
      repairImage(target);
    }
  }, true);

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  });

  observer.observe(document.documentElement, {subtree:true, childList:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
