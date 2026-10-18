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
| JTBD-3 | *Cuando* llego por la mañana o vuelvo de una reunión, *quiero* ver qué se ha movido, *para* ponerme al día sin interrumpir. |
| JTBD-4 | *Cuando* cambio lo que estoy haciendo, *quiero* reflejarlo en segundos, *para* que nadie me tenga que preguntar cómo voy. |
| JTBD-5 | *Cuando* organizo mi día, *quiero* una cola de trabajo propia con lo que tengo asignado y lo que se ha pasado de plazo, *para* decidir qué cojo. |

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

- **E1 «Cuentas y acceso»** — registro, inicio y cierre de sesión, perfil propio y la regla de que solo los miembros del espacio único ven y tocan las tareas (ya construido en su mayor parte; se reutiliza).
- **E2 «Gestión de tareas»** — la lista única, crear, editar, reasignar/coger, cambiar de estado, fecha de vencimiento con marca de vencida y filtro por estado.
- **E3 «Actividad del equipo»** — que la lista abierta refleje sin recargar, en segundos, lo que cambian los demás, para ver quién está en qué y qué se ha movido.

## 6. Requisitos funcionales

Cada requisito indica su épica. "Usuario" = persona con cuenta y sesión iniciada; todos los usuarios tienen los mismos permisos.

### E1 · Cuentas y acceso

- **RF-1** [E1] Cualquier persona puede crear una cuenta con email y contraseña (nombre opcional) y, al hacerlo, pasa a formar parte del único espacio del equipo.
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
- **RF-16** [E2] Una tarea se marca como **vencida** si tiene fecha de vencimiento, esa fecha es anterior al día de hoy y su estado no es **hecho**. El propio día de vencimiento aún no está vencida. Una tarea sin fecha nunca está vencida. [SUPUESTO: "hoy" es la fecha local de quien mira la lista; las tareas hechas no se marcan como vencidas.]
- **RF-17** [E2] Se puede asignar una fecha de vencimiento pasada; la tarea aparece vencida desde que se guarda [SUPUESTO].
- **RF-18** [E2] El usuario puede filtrar la lista por un estado (pendiente, en curso o hecho) o verlas todas. Al entrar se muestran todas [SUPUESTO]. Con un filtro activo solo aparecen las tareas en ese estado, y una tarea que cambia a otro estado desaparece de la vista filtrada.
- **RF-19** [E2] La lista se presenta en un orden fijo y predecible, el mismo para todos los usuarios: primero las más recientes por fecha de creación [SUPUESTO]. El usuario no puede reordenarla.
- **RF-20** [E2] El sistema no permite eliminar ni archivar tareas.

### E3 · Actividad del equipo

- **RF-21** [E3] Con la lista abierta, cuando otro usuario crea una tarea, la edita o cambia su estado, el cambio aparece en la lista del resto en un máximo de 10 segundos, sin que nadie recargue la página ni haga ninguna acción.
- **RF-22** [E3] Los cambios que hace el propio usuario se reflejan en su lista en cuanto el sistema los confirma, sin esperar a la siguiente actualización periódica.
- **RF-23** [E3] Al volver a la lista tras un rato fuera (otra pestaña, equipo suspendido, pérdida de conexión), el usuario ve el estado actual de todas las tareas en un máximo de 10 segundos desde que la lista vuelve a estar visible y hay conexión.
- **RF-24** [E3] La actualización automática respeta el filtro activo: aplica las mismas reglas de RF-18 a las tareas que llegan o cambian.
- **RF-25** [E3] Si dos usuarios modifican la misma tarea casi a la vez, prevalece el último cambio guardado y ambos acaban viendo ese mismo estado en un máximo de 10 segundos [SUPUESTO: "el último gana", sin aviso de conflicto].
- **RF-26** [E3] La actualización automática no muestra notificaciones, avisos, sonidos ni contadores de novedades, ni información sobre qué usuarios están conectados o activos.

## 7. Requisitos no funcionales

- **RNF-1 Frescura:** el retraso entre que un cambio se guarda y aparece en otra lista abierta es ≤ 10 s en el 100 % de los casos con conexión estable; objetivo típico 5 s.
- **RNF-2 Coste de actualizar:** cambiar el estado de una tarea cuesta ≤ 2 clics desde la lista; crear una tarea con valores propuestos cuesta escribir el título + 1 confirmación.
- **RNF-3 Rapidez percibida:** crear una tarea o cambiar su estado se confirma en pantalla en ≤ 1 s en condiciones normales de red [SUPUESTO: umbral].
- **RNF-4 Volumen:** el sistema funciona sin degradación perceptible con 10 usuarios con la lista abierta a la vez y 500 tareas en el espacio [SUPUESTO: dimensionado para una semana de prueba de un equipo de 3-10 personas con margen].
- **RNF-5 Seguridad:** ninguna información de tareas ni de usuarios es accesible sin sesión iniciada; las contraseñas nunca se muestran ni se devuelven al cliente.
- **RNF-6 Idioma:** toda la interfaz y todos los mensajes de error están en castellano y dicen qué ha fallado y, si aplica, en qué campo.
- **RNF-7 Fiabilidad de los datos:** un cambio que el sistema ha confirmado al usuario no se pierde; un cambio que falla se indica en pantalla y la lista no muestra un estado que no se ha guardado.
- **RNF-8 Compatibilidad:** funciona en las dos últimas versiones de Chrome, Firefox, Safari y Edge de escritorio [SUPUESTO]. No se exige experiencia móvil específica.
- **RNF-9 Calidad:** cada requisito funcional se entrega con tests automatizados que lo cubren (forma parte de la Definition of Done, no es una capability).

## 8. Restricciones

- **Stack actual:** backend AdonisJS 7 y frontend React 19, ya en el repositorio. El MVP se construye sobre ellos; no se cambia de stack.
- **Auth ya existe:** registro, login, perfil propio y logout están construidos y se reutilizan tal cual. No se rehacen ni se amplían (sin edición de perfil, sin recuperación de contraseña).
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
| M5 | Frescura: retraso en ver el cambio de otro usuario. | ≤ 10 s en el 100 % de las comprobaciones | Prueba manual o automatizada con dos sesiones abiertas (RF-21). |
| M6 | Coste de actualizar. | Cambio de estado ≤ 2 clics; crear tarea = título + confirmar | Verificación de aceptación (RF-8, RF-13). |

Las métricas M1-M4 se recogen por observación y conversación con el equipo, no con analítica dentro del producto (fuera de alcance).
