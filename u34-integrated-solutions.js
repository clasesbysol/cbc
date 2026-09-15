(() => {
  'use strict';

  const solutions = {
    'por-que-se-enlazan-los-atomos': {
      steps: [
        ['H₂', 'Cada H aporta un electrón. Al formar H₂, ambos electrones ocupan una región enlazante compartida entre los núcleos. A la distancia de enlace, las atracciones superan a las repulsiones y la energía del sistema queda por debajo de la de dos H separados.'],
        ['He₂', 'Cada He ya tiene completa la capa 1s. Al intentar combinar dos He no aparece una estabilización neta comparable a la de H₂; en el modelo de orbitales moleculares se ocupan por igual regiones enlazantes y antienlazantes, por lo que el orden de enlace neto es cero.'],
        ['NaCl', 'Na cede un electrón y forma Na⁺; Cl lo gana y forma Cl⁻. La estabilización importante no es la de una pareja aislada, sino la atracción electrostática colectiva entre muchos iones de cargas opuestas organizados en una red cristalina.']
      ],
      final: 'Los tres casos se entienden con el mismo criterio: una estructura será estable si la interacción produce una disminución neta de energía. El octeto ayuda a describir muchos casos, pero no es la causa última del enlace.'
    },
    'redes-infinitas-y-moleculas-discretas': {
      steps: [
        ['CO₂', 'C y O son no metales y forman enlaces covalentes. En condiciones habituales existen moléculas discretas O=C=O; la fórmula CO₂ representa una molécula individual.'],
        ['SiO₂', 'En el sólido, cada Si está unido covalentemente a varios O y cada O conecta centros de Si. Se forma una red covalente extendida; no hay moléculas discretas de SiO₂ dentro del cristal. La fórmula expresa la proporción 1:2.'],
        ['Na₂O', 'Na forma Na⁺ y O forma O²⁻. El sólido es una red iónica y la fórmula Na₂O indica la menor proporción entera que neutraliza las cargas: 2 Na⁺ por cada O²⁻.']
      ],
      final: 'Una fórmula parecida no implica la misma estructura: CO₂ es molecular, SiO₂ es una red covalente y Na₂O es una red iónica.'
    },
    'electronegatividad-y-clasificacion-de-enlaces': {
      steps: [
        ['Comparar electronegatividades', 'La electronegatividad aumenta hacia la derecha y hacia arriba. Para los halógenos del desafío se cumple F > Cl > Br. El carbono es el mismo en los tres enlaces, así que cambia únicamente la electronegatividad del halógeno.'],
        ['Comparar ΔEN', 'Como F es el más electronegativo, |EN(F) − EN(C)| es la mayor diferencia. Luego sigue C–Cl y finalmente C–Br.'],
        ['Traducir a polaridad de enlace', 'A mayor diferencia de electronegatividad, mayor separación de carga parcial en esta comparación entre enlaces semejantes.']
      ],
      final: 'Orden de polaridad: C–F > C–Cl > C–Br.'
    },
    'enlace-ionico': {
      steps: [
        ['Escribir las cargas', 'El aluminio aporta Al³⁺ y el oxígeno O²⁻. El compuesto total debe ser eléctricamente neutro.'],
        ['Buscar la menor carga común', 'El mínimo común múltiplo entre 3 y 2 es 6. Se necesitan 2 Al³⁺ para aportar +6 y 3 O²⁻ para aportar −6.'],
        ['Comprobar neutralidad', '2(+3) + 3(−2) = +6 − 6 = 0. Los subíndices 2 y 3 ya están en la menor proporción entera posible.']
      ],
      final: 'La fórmula mínima es Al₂O₃.'
    },
    'enlace-covalente-y-estructuras-de-lewis': {
      steps: [
        ['CO', 'Tiene 10 electrones de valencia. Una estructura de Lewis adecuada posee un enlace triple C≡O y un par libre sobre cada átomo. Es una especie diatómica, por lo tanto su geometría es lineal. En la estructura dominante aparecen cargas formales C⁻ y O⁺.'],
        ['CO₂', 'Tiene 16 electrones de valencia. La estructura O=C=O usa dos enlaces dobles; el C central no posee pares libres. Hay dos dominios alrededor del C, por lo que la geometría es lineal.'],
        ['CO₃²⁻', 'Tiene 24 electrones de valencia. Al completar octetos se obtiene una estructura con un C=O y dos C–O⁻. Ese doble enlace puede ubicarse sobre cualquiera de los tres O, por lo que existen tres contribuyentes de resonancia equivalentes. El C tiene tres dominios y la geometría es trigonal plana.']
      ],
      final: 'CO muestra un enlace múltiple en una especie diatómica; CO₂ tiene dos dobles enlaces sin resonancia equivalente necesaria; CO₃²⁻ presenta resonancia y tres enlaces C–O equivalentes en el híbrido real.'
    },
    'metodo-para-dibujar-estructuras-de-lewis': {
      steps: [
        ['Contar electrones', 'S aporta 6, los cuatro O aportan 4×6 = 24 y la carga 2− agrega 2 electrones: total = 32 electrones de valencia.'],
        ['Armar el esqueleto', 'Se coloca S en el centro y cuatro O alrededor. Cuatro enlaces simples S–O consumen 8 electrones.'],
        ['Completar terminales', 'Los 24 electrones restantes se distribuyen como tres pares libres sobre cada O. Todos los O completan octeto.'],
        ['Evaluar cargas formales', 'Con cuatro enlaces simples, cada O posee carga formal −1 y el S queda con +2; la suma total es −2.'],
        ['Minimizar cargas y reconocer resonancia', 'En el tratamiento de Lewis habitual del CBC pueden transformarse pares de O en enlaces S=O, obteniendo contribuyentes con menores cargas formales. Las posiciones de esos dobles enlaces pueden intercambiarse, por lo que se describen formas resonantes equivalentes.']
      ],
      final: 'SO₄²⁻ tiene 32 electrones de valencia. La carga total de todas las estructuras debe sumar −2 y la distribución electrónica se describe mediante resonancia.'
    },
    'regla-del-octeto-y-excepciones': {
      steps: [
        ['BF₃: octeto incompleto', 'B aporta 3 electrones de valencia y forma tres enlaces B–F. Al completar los octetos de los F, el B queda rodeado por 6 electrones. Es una excepción estable de octeto incompleto.'],
        ['NO: número impar', 'N aporta 5 y O aporta 6: en total hay 11 electrones de valencia. Al ser un número impar, necesariamente queda un electrón desapareado; no es posible dar octeto simultáneo a ambos átomos usando pares completos.'],
        ['SF₆: octeto expandido', 'S forma seis enlaces S–F. En la representación de Lewis queda rodeado por 12 electrones, superando el octeto.']
      ],
      final: 'BF₃, NO y SF₆ rompen la regla por motivos distintos: octeto incompleto, número impar de electrones y octeto expandido, respectivamente.'
    },
    'enlace-metalico': {
      steps: [
        ['Cu sólido', 'En un metal los electrones de valencia están deslocalizados y pueden moverse a través de la red. Por eso el Cu conduce electricidad incluso en estado sólido.'],
        ['NaCl fundido', 'En NaCl sólido los iones están fijos en posiciones de la red y no pueden transportar carga a larga distancia. Al fundirse, Na⁺ y Cl⁻ adquieren movilidad y el líquido conduce.'],
        ['Sacarosa', 'La sacarosa es una sustancia molecular covalente. No posee electrones deslocalizados ni genera una concentración apreciable de iones móviles al fundirse o disolverse en agua, por lo que no es buena conductora.']
      ],
      final: 'La conductividad requiere portadores de carga móviles: electrones deslocalizados en Cu o iones móviles en NaCl fundido. La sacarosa no aporta ninguno de esos portadores.'
    },
    'polaridad-de-enlace-y-momento-dipolar': {
      steps: [
        ['Dirección de los tres dipolos', 'En C–O, C=O y O–H el O es el átomo más electronegativo, por lo que el extremo δ− está sobre O y el vector dipolar apunta hacia O.'],
        ['Qué informa ΔEN', 'C–O y C=O involucran el mismo par de elementos, de modo que tienen el mismo ΔEN. O–H presenta otra diferencia de electronegatividad. ΔEN permite anticipar el sentido y una tendencia cualitativa de separación de carga.'],
        ['Qué NO informa ΔEN por sí sola', 'El momento dipolar cumple μ = |q|·d. La separación efectiva de carga q y la distancia de enlace d dependen de la estructura electrónica y del tipo de enlace. Por eso no se puede obtener ni ordenar con exactitud los módulos de C–O y C=O usando solamente ΔEN. Tampoco puede deducirse la polaridad de una molécula completa sin conocer su geometría.']
      ],
      final: 'ΔEN sirve para decidir hacia dónde se polariza un enlace, pero el módulo exacto del dipolo y la polaridad molecular requieren información adicional.'
    },
    'numero-de-oxidacion': {
      steps: [
        ['Mn en KMnO₄', 'K vale +1 y cada O vale −2. Como el compuesto es neutro: (+1) + x + 4(−2) = 0. Entonces 1 + x − 8 = 0 y x = +7.'],
        ['S promedio en S₂O₃²⁻', 'Cada O vale −2, por lo que los tres O suman −6. Si x representa la suma de los NOX de los dos S: x − 6 = −2. Entonces x = +4 y el NOX promedio del S es +2.'],
        ['Detalle importante del tiosulfato', 'Los dos átomos de S no son equivalentes. En una asignación estructural más precisa, uno se toma como +5 y el otro como −1; el promedio sigue siendo +2.']
      ],
      final: 'Mn en KMnO₄ = +7. En S₂O₃²⁻ el NOX promedio del S = +2; estructuralmente los dos S pueden distinguirse como +5 y −1.'
    },
    'clasificacion-y-nomenclatura-de-compuestos-inorganicos': {
      steps: [
        ['Fe₂O₃', 'Está formado por un metal y oxígeno sin grupo OH: es un óxido metálico. Como 3 O aportan −6, los 2 Fe deben aportar +6; cada Fe vale +3. Nombre Stock: óxido de hierro(III).'],
        ['H₂SO₃', 'Contiene H, un no metal central y O, con carácter ácido: es un oxoácido. Se denomina ácido sulfuroso.'],
        ['NaHCO₃', 'Está formado por Na⁺ y el oxoanión HCO₃⁻. Es una oxosal ácida porque el anión conserva un H ionizable del ácido de origen. Se llama hidrogenocarbonato de sodio o bicarbonato de sodio.'],
        ['Cu(OH)₂', 'Contiene el grupo OH⁻ unido a un catión metálico: es un hidróxido. Dos OH⁻ suman −2, por lo que Cu vale +2. Nombre Stock: hidróxido de cobre(II).']
      ],
      final: 'Familias: Fe₂O₃ = óxido; H₂SO₃ = oxoácido; NaHCO₃ = oxosal ácida; Cu(OH)₂ = hidróxido.'
    },
    'trepev-y-dominios-electronicos': {
      steps: [
        ['CO₂', 'El C central tiene dos regiones de enlace: cada doble enlace C=O cuenta como un solo dominio. No tiene pares libres. Notación AX₂; geometría lineal; ángulo de 180°.'],
        ['SO₂', 'S tiene 18 electrones de valencia totales en la especie. En torno al S central hay dos dominios enlazantes y un par libre: tres dominios en total. Notación AX₂E; geometría electrónica trigonal plana y geometría molecular angular, con ángulo menor que 120°.'],
        ['NO₂⁻', 'Tiene 18 electrones de valencia. El N central queda con dos enlaces N–O y un par libre; las formas resonantes intercambian el enlace doble. Hay tres dominios: AX₂E. La geometría molecular es angular, menor que 120°.']
      ],
      final: 'CO₂ es lineal porque no tiene pares libres en el centro; SO₂ y NO₂⁻ son angulares porque poseen un par libre central que modifica la forma molecular.'
    },
    'geometrias-fundamentales': {
      steps: [
        ['CH₄', 'C posee cuatro dominios enlazantes y ningún par libre: AX₄. Geometría tetraédrica, ángulo ideal 109,5°.'],
        ['NH₃', 'N posee tres dominios enlazantes y un par libre: AX₃E. La geometría electrónica es tetraédrica, pero la molecular es piramidal trigonal. El ángulo H–N–H es aproximadamente 107°.'],
        ['H₂O', 'O posee dos dominios enlazantes y dos pares libres: AX₂E₂. La geometría electrónica es tetraédrica y la molecular angular. El ángulo H–O–H es aproximadamente 104,5°.'],
        ['Por qué disminuye el ángulo', 'Los pares libres ocupan más espacio electrónico y repelen con mayor intensidad que los pares enlazantes. Al aumentar la cantidad de pares libres, los enlaces quedan comprimidos.']
      ],
      final: 'CH₄: AX₄, 109,5°; NH₃: AX₃E, ≈107°; H₂O: AX₂E₂, ≈104,5°.'
    },
    'efecto-de-los-pares-libres': {
      steps: [
        ['CH₄', 'No tiene pares libres sobre el C central. Los cuatro pares enlazantes se distribuyen tetraédricamente y mantienen el ángulo ideal de 109,5°.'],
        ['NH₃', 'Tiene un par libre sobre N. La repulsión par libre–par enlazante es mayor que enlazante–enlazante y comprime los ángulos H–N–H hasta aproximadamente 107°.'],
        ['H₂O', 'Tiene dos pares libres sobre O. Aparecen repulsiones libre–libre y libre–enlazante adicionales, que comprimen todavía más el ángulo H–O–H hasta aproximadamente 104,5°.']
      ],
      final: 'Orden de ángulos: CH₄ > NH₃ > H₂O, porque aumenta la cantidad de pares libres y, con ella, la repulsión que comprime los enlaces.'
    },
    'polaridad-molecular': {
      steps: [
        ['CO₂', 'Los enlaces C=O son polares, pero la molécula es lineal y simétrica. Los dos vectores tienen igual módulo y sentidos opuestos, por lo que se cancelan: molécula apolar.'],
        ['SO₂', 'Los enlaces S–O son polares y la molécula es angular. Los vectores no están a 180° y no se cancelan: molécula polar.'],
        ['BF₃', 'Los enlaces B–F son muy polares, pero la molécula es trigonal plana y simétrica. Los tres vectores se cancelan: molécula apolar.'],
        ['NH₃', 'Los enlaces N–H son polares y la molécula es piramidal trigonal. La geometría no permite cancelación total: molécula polar.']
      ],
      final: 'Enlaces polares no garantizan una molécula polar. La geometría y la simetría determinan si la suma vectorial de dipolos es cero o no.'
    },
    'fuerzas-de-dispersion-de-london': {
      steps: [
        ['Qué tienen en común', 'F₂ e I₂ son moléculas diatómicas homonucleares y, por lo tanto, apolares. Entre sus moléculas actúan esencialmente fuerzas de dispersión de London.'],
        ['Comparar tamaño y electrones', 'I₂ posee muchos más electrones y una nube electrónica mucho más grande que F₂. Esa nube se deforma con mayor facilidad: I₂ es más polarizable.'],
        ['Conectar con el estado físico', 'La mayor polarizabilidad produce fuerzas de London más intensas. Se necesita más energía para separar moléculas de I₂, elevando sus temperaturas de fusión y ebullición. F₂, mucho menos polarizable, permanece gaseoso a temperatura ambiente.']
      ],
      final: 'I₂ es sólido y F₂ gas porque las fuerzas de London son mucho más intensas en I₂ debido a su mayor tamaño y polarizabilidad.'
    },
    'interacciones-dipolo-dipolo': {
      steps: [
        ['Interacciones presentes', 'HCl, HBr e HI son moléculas polares, de modo que presentan dipolo–dipolo. Además, como todas las moléculas, también presentan London.'],
        ['Tendencia del dipolo', 'Al bajar de Cl a Br e I disminuye la diferencia de electronegatividad con H, por lo que el dipolo permanente tiende a hacerse menor. Si solo miráramos polaridad, esperaríamos HCl como el más favorecido.'],
        ['Tendencia de polarizabilidad', 'Sin embargo, aumenta mucho el número de electrones y el tamaño de la nube: HI es más polarizable que HBr, y HBr más que HCl. Las fuerzas de London crecen en ese sentido.'],
        ['Resultado global', 'En esta serie, el aumento de London domina sobre la disminución del dipolo permanente. Por eso la temperatura de ebullición aumenta aproximadamente HCl < HBr < HI.']
      ],
      final: 'No alcanza con mirar el momento dipolar: al comparar HCl, HBr e HI, la polarizabilidad creciente hace que HI tenga las atracciones intermoleculares globales más intensas.'
    },
    'puentes-de-hidrogeno': {
      steps: [
        ['CH₃OH', 'Tiene un enlace O–H: puede donar H para puente de hidrógeno. El O posee pares libres: también puede aceptar. Entre moléculas de metanol hay puentes de hidrógeno.'],
        ['CH₃OCH₃', 'El O posee pares libres y puede aceptar un puente de hidrógeno proveniente de otra especie, pero la molécula no tiene O–H, N–H ni F–H. Por eso no puede donar y, en el líquido puro, no forma una red de puentes entre moléculas idénticas.'],
        ['NH₃', 'Posee enlaces N–H y un par libre sobre N. Puede actuar como donante y como aceptor; entre moléculas de NH₃ hay puentes de hidrógeno.'],
        ['CH₄', 'Los H están unidos a C y el C no posee un par libre adecuado. No actúa como donante ni como aceptor de puente de hidrógeno.']
      ],
      final: 'CH₃OH y NH₃ forman puentes de hidrógeno entre sí mismos; CH₃OCH₃ es aceptor pero no donante; CH₄ no es ni donante ni aceptor.'
    },
    'interacciones-ion-dipolo': {
      steps: [
        ['Disociación', 'Al entrar en agua, MgCl₂ se separa en Mg²⁺ y 2 Cl⁻. Los iones quedan rodeados por moléculas de agua orientadas.'],
        ['Alrededor de Mg²⁺', 'El O del agua tiene carga parcial δ−. Ese extremo se orienta hacia Mg²⁺ y forma interacciones ion–dipolo intensas.'],
        ['Alrededor de Cl⁻', 'Los H del agua tienen carga parcial δ+. Esos extremos se orientan hacia Cl⁻.'],
        ['Mg²⁺ frente a Na⁺', 'Mg²⁺ posee mayor carga y además un radio iónico menor que Na⁺. La mayor densidad de carga genera un campo eléctrico más intenso y, por lo tanto, una hidratación ion–dipolo más fuerte.']
      ],
      final: 'El agua orienta Oδ− hacia Mg²⁺ y Hδ+ hacia Cl⁻. Mg²⁺ atrae al dipolo del agua más intensamente que Na⁺ por su mayor densidad de carga.'
    },
    'relacion-entre-fuerzas-y-propiedades': {
      steps: [
        ['CH₄', 'Es pequeño y apolar. Solo presenta London muy débiles. Por eso tiene la menor temperatura de ebullición del grupo.'],
        ['CH₃Cl', 'Es polar y más pesado que CH₄. Presenta London más intensas y además dipolo–dipolo, por lo que hierve a mayor temperatura que CH₄.'],
        ['CH₃OH', 'Es polar y posee enlace O–H, de modo que forma puentes de hidrógeno además de London y dipolo–dipolo. Esto eleva mucho su temperatura de ebullición respecto de CH₃Cl.'],
        ['C₈H₁₈', 'Es apolar, pero es muchísimo más grande, tiene muchos más electrones y gran superficie de contacto. Sus fuerzas de London son tan intensas que superan en conjunto a las interacciones presentes en las moléculas pequeñas del resto de la lista.']
      ],
      final: 'Orden esperado de ebullición: CH₄ < CH₃Cl < CH₃OH < C₈H₁₈. Este ejemplo muestra por qué no se debe usar un ranking de fuerzas sin considerar tamaño y polarizabilidad.'
    },
    'estrategia-integral-de-resolucion': {
      steps: [
        ['Contar electrones', 'SO₂Cl₂: S aporta 6, dos O aportan 12 y dos Cl aportan 14. Total = 32 electrones de valencia.'],
        ['Lewis', 'S ocupa el centro. La representación habitual usa dos enlaces S=O y dos enlaces S–Cl; cada O conserva dos pares libres y cada Cl tres. El S queda con cuatro regiones de enlace.'],
        ['TRePEV y geometría', 'Hay cuatro dominios alrededor de S y ningún par libre central en esa representación: AX₄. La geometría molecular es tetraédrica.'],
        ['Polaridad', 'La forma tetraédrica no es simétrica respecto de los cuatro enlaces porque hay dos O y dos Cl. Los dipolos S=O y S–Cl no se cancelan completamente; SO₂Cl₂ es polar.'],
        ['Interacciones', 'Entre moléculas actúan London y dipolo–dipolo. No puede haber puente de hidrógeno porque la molécula no contiene H unido a N, O o F.'],
        ['Solubilidad', 'Su polaridad favorece interacciones con medios polares, pero en agua no conviene hablar solo de “se disuelve”: SO₂Cl₂ se hidroliza y reacciona formando productos ácidos. Por eso la reactividad debe considerarse junto con la polaridad.'],
        ['Ebullición', 'Su masa, polarizabilidad y dipolo permanente hacen que las atracciones sean apreciables. Frente a una molécula no polar de tamaño comparable, el dipolo–dipolo tendería a elevar la ebullición; para un orden cuantitativo frente a moléculas de tamaños muy distintos hace falta comparar todos esos factores o usar datos experimentales.']
      ],
      final: 'SO₂Cl₂: 32 electrones de valencia, AX₄ tetraédrica, polar, con London + dipolo–dipolo. En agua además reacciona, así que una predicción de “solubilidad” basada solo en polaridad sería incompleta.'
    },
    'hibridacion-puente-entre-lewis-y-la-geometria': {
      steps: [
        ['C en CO₂', 'El C central tiene dos dominios electrónicos, uno por cada doble enlace C=O. Dos dominios corresponden a hibridación sp y geometría lineal de 180°.'],
        ['N en NH₃', 'El N tiene cuatro dominios: tres enlaces N–H y un par libre. Cuatro dominios corresponden a sp³. La geometría electrónica es tetraédrica, pero al ignorar el par libre la forma molecular es piramidal trigonal.'],
        ['O en H₂O', 'El O también tiene cuatro dominios: dos enlaces O–H y dos pares libres. Por eso también es sp³. Sin embargo, al haber dos pares libres, la geometría molecular es angular.'],
        ['Comparación', 'NH₃ y H₂O comparten hibridación sp³ porque ambos tienen cuatro dominios electrónicos, no porque tengan la misma cantidad de enlaces ni la misma forma molecular.']
      ],
      final: 'CO₂: sp y lineal. NH₃: sp³ y piramidal trigonal. H₂O: sp³ y angular. La hibridación sigue el número de dominios; la forma molecular depende de cuántos de esos dominios son enlaces y cuántos pares libres.'
    }
  };

  const stepHtml = (label, item) => `<div class="solutionStep"><span>${label}</span><div><h4>${item[0]}</h4><p>${item[1]}</p></div></div>`;
  const render = data => `${data.steps.map((item, index) => stepHtml(`Paso ${index + 1}`, item)).join('')}<div class="finalAnswer"><strong>Conclusión</strong><p>${data.final}</p></div>`;

  function enhanceIntegratedChallenges(root = document) {
    root.querySelectorAll('.studySection[data-section]').forEach(section => {
      const key = section.dataset.section;
      const data = solutions[key];
      if (!data) return;
      const challenge = section.querySelector('.quickGuide > details');
      if (!challenge || challenge.querySelector(':scope > .integratedSolution')) return;
      const details = document.createElement('details');
      details.className = 'integratedSolution';
      details.innerHTML = `<summary>✓ Ver resolución paso a paso</summary><div class="integratedSolutionBody">${render(data)}</div>`;
      challenge.appendChild(details);
    });
  }

  const observer = new MutationObserver(() => enhanceIntegratedChallenges());
  const start = () => {
    enhanceIntegratedChallenges();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
