# Alcance del MVP de FlowSync

> Alcance consensuado, base del PRD (el PRD aún no está escrito). 2026-10-18.
> Parte del estado real del repo: hoy solo existen cuentas de usuario y auth (registro, login, perfil propio, logout). Las tareas no existen todavía.

## 1. Problema

En un equipo remoto pequeño nadie ve en qué está cada persona sin interrumpirla. El hueco se tapa con el "¿en qué estás?" constante por chat y con una ronda en la daily que se come la mitad de los 15 minutos. Cuando no se tapa, sale caro: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Se perdieron dos días.

Lo que **no** se promete: la daily no desaparece. Desaparece la ronda de "¿en qué estás?"; la parte de bloqueos sigue, y este MVP no la resuelve.

## 2. Usuarios

- **Equipos remotos de 3 a 10 personas, entre pares.** Roles planos: todos ven y editan lo mismo. El valor lo reciben los pares, no un lead. No hay reporte hacia arriba, y un manager no es usuario.
- **Primer usuario: un caso de estudio, no un cliente real.** Un equipo de producto SaaS de 6 personas, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.
- **Un único espacio compartido, sin la entidad "equipo".** Supuesto: una instalación es un equipo. Con el registro abierto que ya existe, cualquiera que se registre entra a ese espacio.

## 3. Propuesta de valor

FlowSync es **donde se hace el trabajo, no donde se cuenta**: sustituye al gestor de tareas, no convive con él, y crea sus propias tareas.

- **Para quien escribe:** la lista es su cola de trabajo. Actualizarla son dos clics, sin campos que configurar, y le ahorra que le pregunten cómo va.
- **Para los demás:** la misma lista dice quién está en qué y qué queda pendiente. Así no empiezan algo que otra persona ya está tocando, y eligen lo siguiente sabiendo qué está libre.
- **Es frescura, no presencia ni avisos.** El estado es de la tarea, no de la persona. Se ve al día en segundos sin recargar, y espera a que lo mires: llegas por la mañana o vuelves de una reunión y ves qué se ha movido.

**Señal de éxito:** tras una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó. Al ser un caso de estudio, esta señal no se puede medir de verdad, y la hipótesis queda sin validar.

**Riesgo número 1:** que la información se quede vieja. Si pasa, el producto pierde el sentido. Se mitiga haciendo que actualizar cueste dos clics, nunca obligando a nadie.

## 4. Alcance (dentro)

Una vertical fina y usable de punta a punta, sobre las cuentas que ya existen:

1. **Una sola lista con todas las tareas del equipo**, que es lo primero que se ve al entrar.
2. **Crear una tarea en segundos.** Título y responsable obligatorios; el responsable viene propuesto como quien la crea.
3. **Tres estados fijos y no configurables: pendiente, en curso y hecho.** Se cambian en dos clics desde la propia lista. "En curso" es la señal que el producto existe para transmitir.
4. **Editar cualquier tarea: título, responsable y fecha.** Cualquiera puede coger una tarea pendiente reasignándosela. Supuesto: "libre" significa pendiente.
5. **Fecha de vencimiento opcional.** Si se ha pasado, la tarea se marca como vencida; sin fecha, nunca lo está.
6. **Filtrar la lista por estado**, para centrarse en lo pendiente.
7. **La lista abierta se pone al día sola en unos segundos (5-10 s), sin recargar.**

Se da por hecho que cada pieza llega con tests. Eso va en la Definition of Done de los tickets, no es una capability.

Supuestos que acompañan al alcance:
- Una tarea tiene un único responsable.
- Evitar que dos personas vayan a lo mismo solo funciona si la tarea se crea o se coge **antes** de empezar el trabajo. El producto no puede imponer ese hábito, y no quiere.

## 5. NO-alcance (fuera)

Cada exclusión lleva al lado la razón por la que no ayuda a validar la hipótesis: que ver de un vistazo el estado del equipo basta para quitar la ronda de "¿en qué estás?".

### Decididas de antemano

- **Notificaciones push.** La señal espera a que la mires. Un aviso reintroduce la interrupción que el producto quiere quitar.
- **Integración con Slack.** Devuelve la conversación de estado al canal del que se quiere sacar.
- **Roles y permisos (también los avanzados).** Es un equipo de pares en el que todos editan lo mismo. Una jerarquía no valida nada.
- **Analítica y reporting.** No hay nadie aguas arriba que lo lea. Es contar el trabajo, no hacerlo.
- **Comentarios en tareas.** Convierten la lista en una conversación, que es lo que se quiere evitar.

### Recorte del MVP

1. **Sincronización instantánea (E3).** Para no empezar lo que otro ya toca bastan 5-10 segundos. La instantánea solo importa si dos personas cogen la misma tarea en el mismo segundo, y en un equipo de 3 a 10 personas eso es raro.
2. **Estado "bloqueado" o cualquier gestión de bloqueos.** Es la mitad de la daily que se declara no resuelta. Meterla mezcla dos hipótesis y no sabrías cuál falló.
3. **Tareas sin responsable.** Una tarea sin dueño no dice quién está en qué. Lo que está libre se reconoce por estar pendiente.
4. **Un apartado de "novedades desde tu última visita" o un historial de cambios.** La hipótesis es que basta con el estado actual. El historial sirve para contar, no para decidir qué coger.
5. **Ver quién está conectado o indicadores de actividad.** El estado es de la tarea, no de la persona. Esto es vigilancia y se rechaza a propósito.
6. **Chat, videollamada o edición simultánea del mismo contenido.** No son lo que significa "tiempo real" aquí, y ninguno cambia la decisión de qué coger.
7. **Varios equipos o espacios, invitaciones, gestión de miembros.** Con un único espacio se valida lo mismo. Queda anotado como supuesto.
8. **Integraciones con Git, PRs, CI o calendario.** Derivar el estado de señales externas es otro producto, con OAuth de terceros. El MVP apuesta por que el estado lo escriba la persona.
9. **Importar tareas desde otro gestor.** Una semana con tareas nuevas basta para ver si la ronda cae. Importar es adopción, no validación.
10. **Sprints, estimaciones, épicas, prioridad u orden del backlog, etiquetas.** Renuncia explícita: un equipo que los necesite no es nuestro usuario.
11. **Descripción larga, adjuntos, subtareas, checklists.** Cada campo de más hace más lento actualizar, y el riesgo número 1 es precisamente que no se actualice.
12. **Estados o flujos configurables.** Es justo el "rollo tipo Jira" del que se huye.
13. **Filtrar por persona o por fecha, buscar, ordenar a medida.** La lista de un equipo de 3 a 10 personas cabe en una pantalla, y filtrar por estado basta para centrarse en lo pendiente.
14. **Detectar automáticamente que dos personas van a lo mismo.** Tienta, porque es el episodio que motiva el producto. Pero exige definir qué es "lo mismo", y el MVP apuesta por que la gente mire la lista.
15. **Eliminar o archivar tareas.** Lo hecho se aparta filtrando por estado, y una semana de prueba aguanta algo de ruido.
16. **Editar el perfil, recuperar la contraseña, app móvil o modo offline.** Ninguno cambia si la ronda de "¿en qué estás?" desaparece.
