# ☀️ CBC x SOLved

Primera versión funcional de **CBC x SOLved**, la plataforma de clases y estudio para materias del CBC.

## Qué trae v0.1.0

- App web estática + PWA instalable, sin proceso de build.
- Pantalla inicial con **Instalar app**, **Ver como invitado** e **Ingresar con Gmail**.
- Sesión persistente: después del primer ingreso, abre directo a la app hasta cerrar sesión.
- Inicio por materias: **Química** y **Matemática**.
- Química con las 13 unidades ya estructuradas.
- Invitado: Unidad 1 completa + preview de Unidades 2–13.
- Matemática: reservada, vacía por ahora.
- Buscador global y botón siempre disponible.
- Índice lateral con las 13 unidades.
- Paleta turquesa sólida, sin degradados, con selector de color personalizado.
- Panel **Accesos** visible únicamente al administrador.
- Gestión por mail: agregar alumno, elegir unidad máxima y suspender/reactivar.
- Preparado para Supabase Auth + Google y seguridad RLS.
- Sin sincronización de progreso, favoritos o resaltados para alumnos: sólo persisten localmente preferencias visuales y la sesión de acceso.

## Probar la interfaz

Como no hay build, alcanza con servir la carpeta con cualquier servidor estático. Por ejemplo:

```bash
python -m http.server 8080
```

Luego abrir `http://localhost:8080`.

## Activar Gmail + accesos reales

1. Crear un proyecto en Supabase.
2. Activar **Authentication → Providers → Google**.
3. Ejecutar `supabase/schema.sql` en el SQL Editor.
4. Completar `config.js` con la URL y anon key del proyecto.
5. Confirmar el mail administrador en `config.js` y en `supabase/schema.sql`.
6. Configurar la URL publicada como Site URL / Redirect URL de Supabase.

La anon key puede estar en el navegador; la protección real está en las políticas RLS del esquema.

## Contenido protegido

El contenido premium no debe quedar escondido dentro del HTML público. La arquitectura deja preparado Supabase para que:

- Unidad 1 pueda ser pública.
- Los previews de Unidades 2–13 sean públicos.
- El contenido completo de Unidades 2–13 sólo se entregue si el mail tiene acceso suficiente.

## Próxima etapa

Cargar Química unidad por unidad a partir de los PDFs de diapositivas, ejercitación y parciales, manteniendo teoría, ejercicios resueltos, glosario y navegación de clase.
