-- Unidad 1: normalización de la estructura pública.
-- Las consignas y resoluciones se importan por el canal privado de administración;
-- las resoluciones nunca se publican en el repositorio ni en el shell de la PWA.
begin;

delete from public.course_sections
where subject='chemistry' and unit_no=1
  and section_key in (
    'como-estudiar','guia-base','guia-extra','resoluciones-extra',
    'lista-control','parciales','fuentes','simuladores'
  );

update public.course_sections
set title=case section_key
  when 'cap-1' then '1. Materia y modelos'
  when 'cap-2' then '2. Estados de agregación'
  when 'cap-3' then '3. Propiedades y densidad'
  when 'cap-4' then '4. Sistemas materiales'
  when 'cap-5' then '5. Sustancias y fórmulas'
  when 'cap-6' then '6. Separaciones'
  when 'cap-7' then '7. Composición centesimal'
  else title end
where subject='chemistry' and unit_no=1;

commit;
