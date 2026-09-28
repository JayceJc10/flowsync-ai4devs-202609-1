# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Este es el ejemplo. Bórralo.

El prompt va aquí dentro, entero y con sus saltos de línea,
para que se sepa dónde empieza y dónde acaba.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.

## Prompt 1

**Modelo:**  Sonnet 5 High effort
**Herramienta:** Claude Code

```
Antes de especificar nada, quiero entender el terreno. Explora este repositorio (backend, frontend, CLAUDE.md/AGENTS.md) y devuélveme:

    Qué capabilities de producto están ya construidas (qué puede hacer hoy un usuario).

    Cómo es el modelo de datos actual, a nivel conceptual: entidades principales y cómo se relacionan.

    No propongas nada nuevo, no sugieras mejoras y no modifiques archivos. Solo describe lo que existe, en pocas líneas.
```

**Qué salió:**
funcionó a la primera.

Qué hay construido: registro, login, perfil y logout, con sus tres pantallas.
Qué modelo de datos hay: User y sus tokens de acceso.
Qué no hay: tareas, equipos, estados.
Qué implica para el MVP: el alcance parte de cero en el dominio de tareas, pero reutiliza cuentas y sesión.

## Prompt 2

**Modelo:**  Sonnet 5 High effort
**Herramienta:** Claude Code

```
Ahora quiero definir el alcance de un MVP. Este es el punto de partida, tal cual me llegó:

«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

Antes de proponer nada, hazme las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. Una sola ronda, sin preguntas de relleno. No bajes al modelo de datos, a los endpoints ni a la arquitectura. No propongas solución todavía.

```

**Qué salió:**

Realizo varias preguntas:

1. ¿Quién sufre hoy este problema y cómo lo resuelve? ¿Qué tamaño y tipo de equipo tiene en mente (3 personas o 30, producto, soporte, agencia…), y qué hacen ahora para saber en qué está cada uno (standups, Slack, Notion, Jira)? ¿Qué falla concretamente en eso?
  R: (SOLO RESPONDO A ESTO)Equipos de 5-10 personas, y lo usaría el equipo entero
2. ¿Quién mira y quién actualiza? ¿Es una herramienta para que el equipo se vea entre sí, o para que un lead o manager tenga visibilidad? Esto cambia quién carga con el esfuerzo de mantenerla al día y qué tanto tolera la gente el "reporting".
3. ¿Qué significa "en tiempo real" en este contexto? ¿Ver al instante lo que hace cada persona ahora mismo, o saber lo que hizo y lo que hará hoy? ¿Alguien lo declara a mano, se infiere de otras herramientas, o ambas? ¿A quién le importa la diferencia entre "actualizado hace 1 minuto" y "hace 1 hora"?
4. ¿Qué es "menos rollo que Jira" en concreto? ¿Qué cosas de Jira (u otras herramientas) NO quiere que existan aquí: estados y flujos configurables, estimaciones, sprints, permisos, jerarquías de tareas, campos obligatorios? ¿Y qué es lo mínimo que sí tiene que haber para que siga siendo útil?
5. ¿Cómo sabría que el MVP funciona? Si dentro de un mes el equipo lo usa, ¿qué habría cambiado (menos reuniones, menos mensajes de "¿en qué vas?", otra cosa)? ¿Y qué queda explícitamente fuera de esta primera versión aunque parezca natural incluirlo?

Con eso quedan cerradas dos cosas: el tamaño (5-10 personas) y que todo el equipo actualiza y consulta, sin una figura de manager aparte. Sigue abierto lo que más pesa en el alcance, y no puedo inferirlo:

- Qué falla hoy (pregunta 1): ¿qué usan ahora para saber en qué está cada uno y por qué no les basta?
- Qué es "tiempo real" (pregunta 3): ¿ver lo que alguien hace ahora mismo, o lo que hizo y hará hoy? ¿Cada uno lo declara a mano?
- Qué es "menos rollo que Jira" (pregunta 4): ¿qué no debe existir en la herramienta y qué es lo mínimo imprescindible?
- Cómo mediría que funciona (pregunta 5), y qué queda fuera de la primera versión.

Con eso quedan cerradas dos cosas: el tamaño (5-10 personas) y que todo el equipo actualiza y consulta, sin una figura de manager aparte. Sigue abierto lo que más pesa en el alcance, y no puedo inferirlo:

- Qué falla hoy (pregunta 1): ¿qué usan ahora para saber en qué está cada uno y por qué no les basta?
- Qué es "tiempo real" (pregunta 3): ¿ver lo que alguien hace ahora mismo, o lo que hizo y hará hoy? ¿Cada uno lo declara a mano?
- Qué es "menos rollo que Jira" (pregunta 4): ¿qué no debe existir en la herramienta y qué es lo mínimo imprescindible?
- Cómo mediría que funciona (pregunta 5), y qué queda fuera de la primera versión.

Si no tienes respuesta para alguna, dime "no lo sé" y la trato como decisión pendiente en lugar de suponerla.

  R: 1. Se revisa el panel de jira las tareas pendientes por    cada usuario una por una.
     2. Que se actualice en tiempo real es decir instantaneamente. Cada uno lo declara a mano y se notifica al resto.
     3. Menos rollo que que se visaualice lo esencial.
    Lo minimo inprescindible es la lectura y modufucacion y cambio de estado de las tareas
    4. no lo se.    

Lo que ya está claro

- Usuarios: equipos de 5-10 personas, y todos actualizan y consultan.
- Problema: hoy hay que abrir el panel de Jira y revisar las tareas pendientes de cada persona una por una. Es lento y no da una vista de conjunto.
- Actualización: cada persona declara a mano el estado de su trabajo, el cambio se refleja al instante y se notifica al resto.
- Mínimo imprescindible: ver, modificar y cambiar de estado las tareas, mostrando solo lo esencial.

Lo que sigue abierto

- Crear y eliminar tareas: citas lectura, modificación y cambio de estado, pero no creación ni borrado. ¿Quedan dentro del MVP o las tareas llegan de otro sitio?
- "Se notifica al resto": no me has dicho por qué canal ni con qué frecuencia. Con 5-10 personas, una notificación por cada cambio de estado puede ser ruido, y eso choca con el "menos rollo".
- Qué es "lo esencial" de una tarea: no está definido y afecta directamente al alcance.
- Criterio de éxito y exclusiones: me dijiste "no lo sé". Lo dejo como decisión pendiente y no lo supongo.

Con esto ya se puede redactar una propuesta de alcance del MVP. ¿La preparo tal cual, marcando esos puntos como supuestos a validar, o prefieres cerrar antes las dos primeras dudas?