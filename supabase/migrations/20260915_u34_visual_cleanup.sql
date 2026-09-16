-- U3/U4 · limpieza de listas planas y cuadros visuales

update course_sections
set body_html = replace(body_html,
$$<p>Reglas principales:</p>
<p>Elemento libre: 0.</p>
<p>Ion monoatómico: igual a su carga.</p>
<p>Grupo 1: +1. Grupo 2: +2.</p>
<p>F: −1.</p>
<p>O: generalmente −2; en peróxidos, −1.</p>
<p>H: generalmente +1 con no metales y −1 en hidruros metálicos.</p>$$,
$$<h3>Reglas principales</h3><div class="noxRules"><div class="noxRule"><b>Elemento libre</b><span>NOX = 0</span></div><div class="noxRule"><b>Ion monoatómico</b><span>NOX = carga del ion</span></div><div class="noxRule"><b>Grupo 1</b><span>+1</span></div><div class="noxRule"><b>Grupo 2</b><span>+2</span></div><div class="noxRule"><b>Flúor</b><span>−1</span></div><div class="noxRule"><b>Oxígeno</b><span>generalmente −2; peróxidos: −1</span></div><div class="noxRule"><b>Hidrógeno</b><span>+1 con no metales; −1 en hidruros metálicos</span></div><div class="noxRule"><b>Especie neutra</b><span>Σ NOX = 0</span></div><div class="noxRule"><b>Ion poliatómico</b><span>Σ NOX = carga del ion</span></div></div>$$)
where subject='chemistry' and unit_no=3 and section_key='numero-de-oxidacion';

update course_sections
set body_html = replace(body_html,
$$<p>AX₂: lineal, 180°.</p>
<p>AX₃: triangular plana, 120°.</p>
<p>AX₄: tetraédrica, 109,5°.</p>
<p>AX₃E: piramidal trigonal, aproximadamente 107° en NH₃.</p>
<p>AX₂E₂: angular, aproximadamente 104,5° en H₂O.</p>
<p>AX₅: bipiramidal trigonal, 90° y 120°.</p>
<p>AX₆: octaédrica, 90°.</p>$$,
$$<div class="vseprTable"><p><strong>AX₂</strong> · lineal · 180°</p><p><strong>AX₃</strong> · triangular plana · 120°</p><p><strong>AX₄</strong> · tetraédrica · 109,5°</p><p><strong>AX₃E</strong> · piramidal trigonal · ≈107° · NH₃</p><p><strong>AX₂E₂</strong> · angular · ≈104,5° · H₂O</p><p><strong>AX₅</strong> · bipiramidal trigonal · 90°/120°</p><p><strong>AX₆</strong> · octaédrica · 90°</p></div>$$)
where subject='chemistry' and unit_no=4 and section_key='geometrias-fundamentales';
