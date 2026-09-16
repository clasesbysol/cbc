(() => {
  'use strict';

  const groups = [
    ['Diatómicas y enlaces básicos', [
      ['H₂','2 e⁻','H—H','1 + 1 = 2 e⁻. Se unen los H con un enlace simple. Cada H completa el dueto.'],
      ['F₂','14 e⁻','F(··)(··)(··)—F(··)(··)(··)','7 + 7 = 14 e⁻. Enlace simple y tres pares libres en cada F.'],
      ['Cl₂','14 e⁻','Cl(··)(··)(··)—Cl(··)(··)(··)','7 + 7 = 14 e⁻. Enlace simple y tres pares libres en cada Cl.'],
      ['O₂','12 e⁻','O(··)(··)=O(··)(··)','6 + 6 = 12 e⁻. El enlace simple no completa ambos octetos; se forma O=O.'],
      ['N₂','10 e⁻',':N≡N:','5 + 5 = 10 e⁻. Se necesitan tres pares compartidos; queda un par libre en cada N.'],
      ['HF','8 e⁻','H—F(··)(··)(··)','1 + 7 = 8 e⁻. H completa dueto y F completa octeto.'],
      ['HCl','8 e⁻','H—Cl(··)(··)(··)','1 + 7 = 8 e⁻. Enlace simple; tres pares libres en Cl.'],
      ['HBr','8 e⁻','H—Br(··)(··)(··)','1 + 7 = 8 e⁻. Enlace simple; tres pares libres en Br.'],
      ['HI','8 e⁻','H—I(··)(··)(··)','1 + 7 = 8 e⁻. Enlace simple; tres pares libres en I.'],
      ['CO','10 e⁻','⁻:C≡O:⁺','4 + 6 = 10 e⁻. El triple enlace completa octetos; queda un par libre en cada átomo y aparecen C⁻/O⁺.']
    ]],
    ['Moléculas frecuentes', [
      ['H₂O','8 e⁻','H—O(··)(··)—H','2(1) + 6 = 8 e⁻. Dos enlaces O—H y dos pares libres sobre O.'],
      ['H₂S','8 e⁻','H—S(··)(··)—H','2(1) + 6 = 8 e⁻. Dos enlaces S—H y dos pares libres sobre S.'],
      ['NH₃','8 e⁻','H₃N:','5 + 3(1) = 8 e⁻. Tres enlaces N—H y un par libre en N.'],
      ['PH₃','8 e⁻','H₃P:','5 + 3(1) = 8 e⁻. Tres enlaces P—H y un par libre en P.'],
      ['CH₄','8 e⁻','CH₄','4 + 4(1) = 8 e⁻. Cuatro enlaces simples C—H; C completa octeto.'],
      ['C₂H₆','14 e⁻','H₃C—CH₃','2(4) + 6(1) = 14 e⁻. Un enlace C—C y seis C—H.'],
      ['C₂H₄','12 e⁻','H₂C=CH₂','2(4) + 4(1) = 12 e⁻. Para completar los octetos se forma C=C.'],
      ['C₂H₂','10 e⁻','HC≡CH','2(4) + 2(1) = 10 e⁻. Para completar los octetos se forma C≡C.'],
      ['CO₂','16 e⁻','O(··)(··)=C=O(··)(··)','4 + 2(6) = 16 e⁻. Dos dobles enlaces C=O completan todos los octetos.'],
      ['HCN','10 e⁻','H—C≡N:','1 + 4 + 5 = 10 e⁻. H—C simple y C≡N triple; N conserva un par libre.']
    ]],
    ['Pares libres, halógenos y excepciones', [
      ['SO₂','18 e⁻','O=S—O ↔ O—S=O','6 + 2(6) = 18 e⁻. S queda con un par libre; las posiciones del doble enlace generan resonancia.'],
      ['SO₃','24 e⁻','SO₃ · formas resonantes','6 + 3(6) = 24 e⁻. Tres regiones S—O; se representan contribuyentes resonantes equivalentes.'],
      ['NO','11 e⁻','N=O·','5 + 6 = 11 e⁻. Al ser impar queda un electrón desapareado: excepción al octeto.'],
      ['NO₂','17 e⁻','O=N—O· ↔ ·O—N=O','5 + 2(6) = 17 e⁻. Radical con resonancia; necesariamente queda un electrón desapareado.'],
      ['BF₃','24 e⁻','BF₃','3 + 3(7) = 24 e⁻. Tres enlaces B—F; B queda rodeado por 6 e⁻: octeto incompleto.'],
      ['BeCl₂','16 e⁻','Cl—Be—Cl','2 + 2(7) = 16 e⁻. Be forma dos enlaces y queda rodeado por 4 e⁻: octeto incompleto.'],
      ['PCl₅','40 e⁻','PCl₅','5 + 5(7) = 40 e⁻. Cinco enlaces P—Cl; P queda rodeado por 10 e⁻.'],
      ['SF₆','48 e⁻','SF₆','6 + 6(7) = 48 e⁻. Seis enlaces S—F; S queda rodeado por 12 e⁻.'],
      ['NF₃','26 e⁻','NF₃ · N con 1 par libre','5 + 3(7) = 26 e⁻. Tres enlaces N—F y un par libre en N.'],
      ['PCl₃','26 e⁻','PCl₃ · P con 1 par libre','5 + 3(7) = 26 e⁻. Tres enlaces P—Cl y un par libre en P.']
    ]],
    ['Moléculas sustituidas e iones simples', [
      ['CH₂Cl₂','20 e⁻','CH₂Cl₂','4 + 2(1) + 2(7) = 20 e⁻. C central con cuatro enlaces simples; cada Cl tiene tres pares libres.'],
      ['CCl₄','32 e⁻','CCl₄','4 + 4(7) = 32 e⁻. Cuatro enlaces C—Cl; cada Cl conserva tres pares libres.'],
      ['CN⁻','10 e⁻','[:C≡N:]⁻','4 + 5 + 1 = 10 e⁻. Triple enlace, un par libre en cada átomo y carga total −1.'],
      ['OCN⁻','16 e⁻','⁻O—C≡N ↔ O=C=N⁻','6 + 4 + 5 + 1 = 16 e⁻. C central; dos contribuyentes importantes de resonancia.'],
      ['NH₄⁺','8 e⁻','[NH₄]⁺','5 + 4(1) − 1 = 8 e⁻. Cuatro enlaces N—H; N queda sin pares libres.'],
      ['H₃O⁺','8 e⁻','[H₃O:]⁺','6 + 3(1) − 1 = 8 e⁻. Tres enlaces O—H y un par libre sobre O.'],
      ['OH⁻','8 e⁻','[H—O(··)(··)(··)]⁻','1 + 6 + 1 = 8 e⁻. Un enlace O—H y tres pares libres sobre O.'],
      ['ClO⁻','14 e⁻','[Cl—O]⁻','7 + 6 + 1 = 14 e⁻. Enlace simple; la carga formal negativa se ubica preferentemente en O.'],
      ['ClO₂⁻','20 e⁻','[ClO₂]⁻ · resonancia','7 + 2(6) + 1 = 20 e⁻. Cl central con dos O; las formas de menor carga formal se relacionan por resonancia.'],
      ['ClO₃⁻','26 e⁻','[ClO₃]⁻ · resonancia','7 + 3(6) + 1 = 26 e⁻. Tres regiones Cl—O; contribuyentes resonantes.']
    ]],
    ['Oxoaniones y oxoácidos', [
      ['NO₂⁻','18 e⁻','[O=N—O⁻ ↔ ⁻O—N=O]','5 + 2(6) + 1 = 18 e⁻. Un par libre en N y dos formas resonantes.'],
      ['NO₃⁻','24 e⁻','[NO₃]⁻ · 3 formas resonantes','5 + 3(6) + 1 = 24 e⁻. Un N=O y dos N—O⁻ por contribuyente; tres posiciones equivalentes.'],
      ['CO₃²⁻','24 e⁻','[CO₃]²⁻ · 3 formas resonantes','4 + 3(6) + 2 = 24 e⁻. Un C=O y dos C—O⁻ por contribuyente.'],
      ['HCO₃⁻','24 e⁻','HO—C(=O)—O⁻ ↔ HO—C(—O⁻)=O','1 + 4 + 3(6) + 1 = 24 e⁻. El H queda unido a un O; resonancia entre los dos O restantes.'],
      ['SO₃²⁻','26 e⁻','[SO₃]²⁻','6 + 3(6) + 2 = 26 e⁻. S central con un par libre; carga total −2 y resonancia.'],
      ['SO₄²⁻','32 e⁻','[SO₄]²⁻','6 + 4(6) + 2 = 32 e⁻. Cuatro regiones S—O; la suma de cargas formales debe ser −2.'],
      ['PO₄³⁻','32 e⁻','[PO₄]³⁻','5 + 4(6) + 3 = 32 e⁻. Cuatro regiones P—O; carga total −3 y formas resonantes.'],
      ['ClO₄⁻','32 e⁻','[ClO₄]⁻ · resonancia','7 + 4(6) + 1 = 32 e⁻. Cuatro regiones Cl—O; contribuyentes equivalentes.'],
      ['HNO₃','24 e⁻','HO—N(=O)—O ↔ HO—N(—O)=O','1 + 5 + 3(6) = 24 e⁻. H unido a O; resonancia entre los dos O no protonados.'],
      ['H₂SO₄','32 e⁻','HO—S(=O)₂—OH','2(1) + 6 + 4(6) = 32 e⁻. Dos grupos O—H y dos S=O en la representación habitual.']
    ]]
  ];

  function makeCard(item){
    const [formula, electrons, structure, explanation] = item;
    return `<article class="lewisCard"><header><b>${formula}</b><small>${electrons}</small></header><p class="lewisStructure">${structure}</p><p><strong>Conteo y armado:</strong> ${explanation}</p></article>`;
  }

  function libraryHtml(){
    return `<section class="lewisLibraryIntro" data-lewis-library="50"><h3>Biblioteca de estructuras de Lewis</h3><p><strong>50 especies frecuentes</strong>, agrupadas para comparar rápidamente conteo, enlaces, pares libres, cargas y resonancia.</p></section>` + groups.map((group,index) => `<details class="lewisGroup" ${index===0?'open':''}><summary>${group[0]} · ${group[1].length} estructuras</summary><div class="lewisGrid">${group[1].map(makeCard).join('')}</div></details>`).join('');
  }

  function enhance(){
    const unitText=document.querySelector('.unitNumber')?.textContent||'';
    if(!/Unidad\s*3\b/i.test(unitText)) return;
    const section=document.querySelector('.studySection[data-section="guia-lewis-obligatoria-para-los-ejercicios-4-7-4-10"] article');
    if(!section || section.querySelector('[data-lewis-library="50"]')) return;
    section.insertAdjacentHTML('beforeend', libraryHtml());
  }

  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;enhance();});
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
