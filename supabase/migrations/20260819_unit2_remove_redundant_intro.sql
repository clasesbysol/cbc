-- El título de Unidad 2 ya vive en la portada. Esta fila repetía el mismo texto
-- como primer bloque y no agregaba contenido académico.
delete from public.course_sections
where subject='chemistry'
  and unit_no=2
  and section_key='estructura-atomica-configuracion-electronica-y-tabla-periodica';
