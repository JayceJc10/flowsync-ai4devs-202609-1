# PRD — FlowSync MVP

> Fecha: 2026-10-18. Base: [`alcance-mvp.md`](./alcance-mvp.md) (alcance consensuado).
> Documento de producto: describe **qué** debe hacer el sistema y para quién. No incluye endpoints, tablas, modelo de datos ni arquitectura.
> Todo lo marcado como **[SUPUESTO]** es una decisión tomada para poder escribir requisitos testables sin que la confirmara nadie; debe validarse o corregirse antes de implementar.

## 1. Problema y contexto

En un equipo remoto pequeño nadie ve en qué está cada persona sin interrumpirla. El hueco se tapa con el "¿en qué estás?" constante por chat y con una ronda en la daily que se come la mitad de sus 15 minutos. Cuando no se tapa, sale caro: en el caso de estudio, dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera, y se perdieron dos días.

Lo que **no** se promete: la daily no desaparece. Desaparece la ronda de "¿en qué estás?". La parte de bloqueos sigue, y este MVP no la resuelve.

Punto de partida del producto: hoy FlowSync solo tiene cuentas de usuario (registro abierto, inicio de sesión, ver el perfil propio y cerrar sesión). Las tareas no existen todavía.

**Hipótesis que el MVP valida:** ver de un vistazo el estado de las tareas del equipo basta para quitar la ronda de "¿en qué estás?".

## 2. Usuarios y jobs-to-be-done

**Usuario:** miembro de un equipo remoto de 3 a 10 personas que trabajan entre pares. Roles planos: todos ven y editan lo mismo. No hay lead ni manager como usuario, ni reporte hacia arriba.

**Primer usuario (caso de estudio, no cliente real):** equipo de producto SaaS de 6 personas en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.

**Espacio:** una instalación es un equipo. Hay un único espacio compartido y cualquiera que se registre entra en él.

| # | Job-to-be-done |
|---|---|
| JTBD-1 | *Cuando* voy a empezar algo, *quiero* ver si alguien ya lo está tocando, *para* no duplicar trabajo. |
| JTBD-2 | *Cuando* termino una tarea, *quiero* ver qué está libre, *para* elegir lo siguiente sin preguntar a nadie. |
| JTBD-3 | *Cuando* llego por la mañana o vuelvo de una reunión, *quiero* ver el estado actual de las tareas del equipo, *para* ponerme al día sin interrumpir ni preguntar. |
| JTBD-4 | *Cuando* cambio lo que estoy haciendo, *quiero* reflejarlo en segundos, *para* que nadie me tenga que preguntar cómo voy. |
| JTBD-5 | *Cuando* organizo mi día, *quiero* reconocer en la lista única lo mío (por el responsable) y lo que se ha pasado de plazo (por su marca), *para* decidir qué cojo sin mantener otra lista aparte. |

## 3. Propuesta de valor

FlowSync es **donde se hace el trabajo, no donde se cuenta**: sustituye al gestor de tareas en lugar de convivir con él, y crea sus propias tareas.

- **Para quien escribe:** la lista es su cola de trabajo. Actualizarla son dos clics, sin campos que configurar, y le ahorra que le pregunten cómo va.
- **Para los demás:** la misma lista dice quién está en qué y qué queda pendiente. Así no empiezan algo que otro ya está tocando, y eligen lo siguiente sabiendo qué está libre.
- **Frescura, no presencia ni avisos:** el estado es de la tarea, no de la persona. La lista se pone al día sola en segundos y espera a que la mires; no interrumpe.

**Riesgo n.º 1:** que la información se quede vieja. Si pasa, el producto pierde el sentido. Se mitiga abaratando la actualización (dos clics), nunca obligando a nadie.

## 4. Alcance / Fuera de alcance

### Dentro

1. Una sola lista con todas las tareas del equipo, que es lo primero que se ve al entrar.
2. Crear una tarea en segundos: título y responsable obligatorios; el responsable viene propuesto como quien la crea.
3. Tres estados fijos y no configurables: **pendiente**, **en curso** y **hecho**, cambiables en dos clics desde la lista.
4. Editar cualquier tarea (título, responsable, fecha). Cualquiera puede coger una tarea pendiente reasignándosela.
5. Fecha de vencimiento opcional, con marca de "vencida" cuando se ha pasado.
6. Filtrar la lista por estado.
7. La lista abierta se pone al día sola en 5-10 segundos, sin recargar.
8. Se reutilizan las cuentas que ya existen (registro, login, perfil propio, logout).

### Fuera (con la razón respecto a la hipótesis)

| Excluido | Por qué no ayuda a validar la hipótesis |
|---|---|
| Notificaciones push | La señal espera a que la mires; un aviso reintroduce la interrupción. |
| Integración con Slack | Devuelve la conversación de estado al canal del que se quiere sacar. |
| Roles y permisos | Equipo de pares; una jerarquía no valida nada. |
| Analítica y reporting | No hay nadie aguas arriba que lo lea. |
| Comentarios en tareas | Convierten la lista en conversación. |
| Sincronización instantánea | Para no pisarse bastan 5-10 s; la colisión en el mismo segundo es rara con 3-10 personas. |
| Estado "bloqueado" / gestión de bloqueos | Es la otra mitad de la daily; mezclaría dos hipótesis. |
| Tareas sin responsable | No dicen quién está en qué; lo libre se reconoce por estar pendiente. |
| Historial de cambios / "novedades desde tu última visita" | La hipótesis es que basta el estado actual. |
| Quién está conectado / indicadores de actividad | Es vigilancia; se rechaza a propósito. |
| Chat, videollamada, edición simultánea | No es lo que aquí significa "tiempo real". |
| Varios equipos, invitaciones, gestión de miembros | Un único espacio valida lo mismo. |
| Integraciones con Git, PRs, CI o calendario | Derivar el estado de señales externas es otro producto. |
| Importar tareas de otro gestor | Es adopción, no validación. |
| Sprints, estimaciones, épicas como entidad del backlog, prioridad, orden del backlog, etiquetas | Un equipo que los necesite no es nuestro usuario. |
| Descripción larga, adjuntos, subtareas, checklists | Cada campo de más encarece actualizar (riesgo n.º 1). |
| Estados o flujos configurables | Es el "rollo tipo Jira" del que se huye. |
| Filtrar por persona o fecha, búsqueda, orden a medida | La lista de 3-10 personas cabe en una pantalla. |
| Detección automática de trabajo duplicado | Exige definir "lo mismo"; el MVP apuesta por que la gente mire la lista. |
| Eliminar o archivar tareas | Lo hecho se aparta filtrando; una semana aguanta algo de ruido. |
| Editar perfil, recuperar contraseña, app móvil, modo offline | No cambian si la ronda desaparece. |

## 5. Épicas del MVP

- **E1 «Cuentas y acceso»** — lo que ya existe (registro, inicio y cierre de sesión, perfil propio) más lo nuevo: entrar directamente a la lista, ver a los demás miembros del espacio y que solo ellos vean y toquen las tareas.
- **E2 «Gestión de tareas»** — la lista única, crear, editar, reasignar/coger, cambiar de estado, fecha de vencimiento con marca de vencida y filtro por estado.
- **E3 «Actividad del equipo»** — que la lista abierta refleje sin recargar, en segundos, el estado actual de lo que cambian los demás, para ver quién está en qué y qué queda libre.

## 6. Requisitos funcionales

Cada requisito indica su épica. "Usuario" = persona con cuenta y sesión iniciada; todos los usuarios tienen los mismos permisos.

### E1 · Cuentas y acceso

- **RF-1** [E1] Cualquier persona puede crear una cuenta con email y contraseña, según las reglas de registro actuales (contraseña de 8 a 32 caracteres, repetida para confirmarla; nombre opcional), y, al hacerlo, pasa a formar parte del único espacio del equipo.
- **RF-2** [E1] Un usuario puede iniciar sesión con su email y contraseña, y cerrarla. Tras cerrarla, no puede ver ni modificar tareas hasta volver a iniciarla.
- **RF-3** [E1] Una persona sin sesión iniciada no puede ver, crear ni modificar tareas; si intenta acceder a la lista, se le lleva a iniciar sesión.
- **RF-4** [E1] Al iniciar sesión (o al abrir la aplicación con sesión ya iniciada), lo primero que ve el usuario es la lista de tareas del equipo.
- **RF-5** [E1] En todo lugar donde aparezca un usuario (responsable de una tarea, selector de responsable), se le identifica por su nombre o, si no tiene nombre, por su email.

### E2 · Gestión de tareas

- **RF-6** [E2] El sistema muestra una única lista con todas las tareas del espacio, sean de quien sean. Cada tarea muestra título, responsable, estado, fecha de vencimiento (si tiene) y, si aplica, la marca de vencida.
- **RF-7** [E2] Si no hay tareas (o ninguna cumple el filtro activo), la lista muestra un mensaje que lo indica y da acceso directo a crear una tarea.
- **RF-8** [E2] Un usuario puede crear una tarea desde la propia lista indicando un título; el responsable viene preseleccionado como el propio usuario y puede cambiarse antes de guardar. La fecha de vencimiento es opcional. Crear una tarea con los valores propuestos no requiere más que escribir el título y confirmar.
- **RF-9** [E2] Toda tarea nueva se crea en estado **pendiente**.
- **RF-10** [E2] El sistema rechaza crear o guardar una tarea con el título vacío o formado solo por espacios, y con un título de más de 200 caracteres [SUPUESTO: límite de 200], mostrando el motivo en castellano junto al campo.
- **RF-11** [E2] Una tarea tiene siempre exactamente un responsable, que debe ser un usuario del espacio. No se puede guardar una tarea sin responsable.
- **RF-12** [E2] Los únicos estados posibles son **pendiente**, **en curso** y **hecho**. No se pueden añadir, renombrar ni eliminar estados.
- **RF-13** [E2] Un usuario puede cambiar el estado de cualquier tarea a cualquiera de los otros dos estados desde la propia lista, en un máximo de dos clics y sin abrir otra pantalla. Se permite cualquier transición, incluida volver de hecho a pendiente o en curso [SUPUESTO].
- **RF-14** [E2] Un usuario puede editar el título, el responsable y la fecha de vencimiento de cualquier tarea, también de las que no son suyas. Puede quitar la fecha de una tarea que la tenía.
- **RF-15** [E2] Un usuario puede coger una tarea pendiente de otra persona asignándose a sí mismo como responsable. Reasignar no cambia el estado de la tarea [SUPUESTO].
- **RF-16** [E2] La fecha de vencimiento es un día del calendario, sin hora. Una tarea se marca como **vencida** si tiene fecha de vencimiento, esa fecha es anterior al día de hoy y su estado no es **hecho**. El propio día de vencimiento aún no está vencida. Una tarea sin fecha nunca está vencida. "Hoy" es una única referencia para todo el espacio, de modo que todos los usuarios ven la misma marca sea cual sea su huso horario. Caso de prueba: una tarea pendiente que vence el día 18 no aparece vencida para nadie el día 18 y aparece vencida para todos el día 19. [SUPUESTO: las tareas hechas no se marcan como vencidas; el día se cuenta en una zona horaria de referencia común (UTC), lo que con 3 husos horarios puede adelantar o retrasar unas horas el cambio de día para algunos usuarios.]
- **RF-17** [E2] Se puede asignar una fecha de vencimiento pasada; la tarea aparece vencida desde que se guarda [SUPUESTO].
- **RF-18** [E2] El usuario puede filtrar la lista por un estado (pendiente, en curso o hecho) o verlas todas. Al entrar se muestran todas [SUPUESTO]. Con un filtro activo solo aparecen las tareas en ese estado, y una tarea que cambia a otro estado desaparece de la vista filtrada.
- **RF-19** [E2] La lista se presenta en un orden fijo y predecible, el mismo para todos los usuarios: primero las más recientes por fecha de creación [SUPUESTO: decisión de diseño pendiente de validar; con este orden una tarea editada o vencida no sube en la lista]. El usuario no puede reordenarla.
- **RF-20** [E2] El sistema no permite eliminar ni archivar tareas.

### E3 · Actividad del equipo

- **RF-21** [E3] Con la lista abierta, cuando otro usuario crea una tarea, la edita o cambia su estado, el cambio aparece en la lista del resto en un máximo de 10 segundos, sin que nadie recargue la página ni haga ninguna acción.
- **RF-22** [E3] Los cambios que hace el propio usuario se reflejan en su lista en cuanto el sistema los confirma, sin esperar a la siguiente actualización periódica.
- **RF-23** [E3] Al volver a la lista tras un rato fuera (otra pestaña, equipo suspendido, pérdida de conexión), el usuario ve el estado actual de todas las tareas en un máximo de 10 segundos desde que la lista vuelve a estar visible y hay conexión.
- **RF-24** [E3] La actualización automática respeta el filtro activo: aplica las mismas reglas de RF-18 a las tareas que llegan o cambian.
- **RF-25** [E3] Un guardado solo cambia los campos que ese usuario ha modificado. Si dos usuarios guardan cambios sobre la misma tarea antes de que el segundo vea el cambio del primero, se conservan los cambios de ambos en campos distintos; si los dos han cambiado el mismo campo, prevalece el último guardado. En un máximo de 10 segundos ambos ven el mismo resultado. Caso de prueba: A cambia el título y B, sin haberlo visto, cambia el estado: la tarea queda con el título de A y el estado de B. [SUPUESTO: "el último gana" por campo, sin aviso de conflicto.]
- **RF-26** [E3] La actualización automática no muestra notificaciones, avisos, sonidos ni contadores de novedades, ni información sobre qué usuarios están conectados o activos.

## 7. Requisitos no funcionales

- **RNF-1 Frescura:** el retraso entre que el sistema confirma un cambio a quien lo hace y ese cambio aparece en otra lista abierta, visible y con conexión, es ≤ 10 s en cada comprobación de aceptación (el alcance fija 5-10 s). Tras recuperar visibilidad o conexión rige el mismo límite, contado desde ese momento (RF-23).
- **RNF-2 Coste de actualizar:** cambiar el estado de una tarea cuesta ≤ 2 clics desde la lista; crear una tarea con valores propuestos cuesta escribir el título + 1 confirmación.
- **RNF-3 Rapidez percibida:** crear una tarea o cambiar su estado se confirma en pantalla en ≤ 1 s en el 95 % de las operaciones, con una latencia de red de hasta 150 ms [SUPUESTO: umbral y condiciones de red].
- **RNF-4 Volumen:** con 10 usuarios con la lista abierta a la vez y 500 tareas en el espacio se siguen cumpliendo RNF-1 y RNF-3 [SUPUESTO: dimensionado para una semana de prueba de un equipo de 3-10 personas con margen].
- **RNF-5 Seguridad:** ninguna información de tareas ni de usuarios es accesible sin sesión iniciada; las contraseñas nunca se muestran ni se devuelven al cliente.
- **RNF-6 Idioma:** toda la interfaz y todos los mensajes de error están en castellano. Un error de validación aparece junto al campo afectado y nombra la regla incumplida (p. ej., «El título no puede estar vacío»); un error que no es de un campo se muestra como mensaje general (p. ej., «No se ha podido guardar el cambio. Inténtalo de nuevo»).
- **RNF-7 Fiabilidad de los datos:** un cambio que el sistema ha confirmado al usuario no se pierde, salvo que otro usuario lo sobrescriba después según RF-25; un cambio que falla se indica en pantalla y la lista no muestra un estado que no se ha guardado.
- **RNF-8 Compatibilidad:** funciona en las dos últimas versiones de Chrome, Firefox, Safari y Edge de escritorio [SUPUESTO]. No se exige experiencia móvil específica.
- **RNF-9 Calidad:** cada requisito funcional se entrega con tests automatizados que lo cubren (forma parte de la Definition of Done, no es una capability).

## 8. Restricciones

- **Stack actual:** backend AdonisJS 7 y frontend React 19, ya en el repositorio. El MVP se construye sobre ellos; no se cambia de stack.
- **Auth ya existe:** registro, login, perfil propio y logout están construidos y se reutilizan. No se rehacen ni se amplían con edición de perfil o recuperación de contraseña. Lo único nuevo en cuentas es que los miembros del espacio se vean entre sí (RF-5, RF-11), necesario para elegir responsable, y que la pantalla de entrada sea la lista (RF-4); hoy se entra al perfil.
- **Espacio único:** no existe la entidad "equipo"; una instalación es un equipo, y el registro abierto actual da acceso a ese espacio.
- **Sin terceros:** ninguna integración externa (Slack, Git, CI, calendario, push) ni OAuth de terceros.
- **Frescura no instantánea:** el requisito de E3 es ≤ 10 s; no se exige sincronización instantánea.
- **El estado lo escribe la persona:** el sistema no infiere ni cambia estados por su cuenta.

## 9. Métricas de éxito

| # | Métrica | Objetivo | Cómo se mide |
|---|---|---|---|
| M1 (principal) | El equipo cancela la ronda de "¿en qué estás?" de la daily tras una semana de uso real y nadie pide que vuelva. | Sí / No | Observación de la daily y pregunta directa al equipo al cerrar la semana. Al ser un caso de estudio, **no se puede medir de verdad**: la hipótesis queda sin validar hasta tener un equipo real. |
| M2 | Episodios de trabajo duplicado (dos personas en lo mismo sin saberlo) durante la semana. | 0 [SUPUESTO] | Pregunta en la retro de cierre de semana. |
| M3 (riesgo n.º 1) | Tareas "en curso" que no reflejan la realidad al revisarlas en la daily. | ≤ 1 por persona [SUPUESTO] | Repaso rápido de la lista en la daily durante la semana de prueba. |
| M4 | Preguntas "¿en qué estás?" por chat durante la semana frente a la semana anterior. | Baja claramente [SUPUESTO: −50 %] | Recuento manual en el canal del equipo. |
| M5 | Frescura: retraso en ver el cambio de otro usuario. | ≤ 10 s en cada comprobación | Prueba manual o automatizada con dos sesiones abiertas (RF-21). |
| M6 | Coste de actualizar. | Cambio de estado ≤ 2 clics; crear tarea = título + confirmar | Verificación de aceptación (RF-8, RF-13). |

Las métricas M1-M4 se recogen por observación y conversación con el equipo, no con analítica dentro del producto (fuera de alcance).
