---
name: pr-evidence
description: Graba en gif el flujo de pruebas manuales hechas sobre un PR ya abierto
(navegando la app en Chrome) y lo adjunta como comentario en GitHub. Úsala siempre que
el usuario pida documentar, grabar o adjuntar evidencia de las pruebas de un PR o
ticket, o pida un gif/vídeo que demuestre que el cambio funciona — aunque no diga la
palabra "skill" ni "evidencia" explícitamente (p. ej. "graba cómo lo probé", "añade un
gif al PR", "demuestra en la PR que esto funciona", "documenta las pruebas del ticket").
---

# PR evidence

Graba una demo en gif de lo que se probó a mano para un PR ya abierto, y la deja
comentada en el PR para que cualquiera que la revise pueda ver el cambio funcionando
sin tener que levantar el entorno. Un texto como "probado manualmente, funciona" no
convence a nadie; un gif sí.

## Precondición

Tiene que existir ya un PR abierto para la rama actual (creado con `/commit` +
`gh pr create`, siguiendo el flujo normal del repo). Si no lo hay, dilo y para aquí —
este skill adjunta evidencia a un PR existente, no crea uno nuevo.

## 1. Reunir contexto

```bash
gh pr view --json url,number,headRefName,baseRefName
gh repo view --json nameWithOwner
gh pr diff
```

De aquí sacas: la URL/número del PR, la rama (`headRefName`) sobre la que vas a
commitear, el `owner/repo`, y qué cambió — el diff te dice qué merece la pena grabar
(no grabes toda la app, solo lo que el PR cambia).

Saca también un slug corto para la carpeta de evidencia: si el nombre de la rama trae
un identificador de ticket (p. ej. `feat/flow-8-login-frontend` → `flow-8`), úsalo; si
no, usa una versión abreviada del nombre de la rama.

Si por el diff o la descripción del PR no queda claro qué flujo probar a mano, o no
sabes en qué URL local corre la app, pregúntale al usuario antes de grabar nada — grabar
lo que no toca es peor que preguntar.

## 2. Levantar la app

Comprueba primero si ya está corriendo (un `curl` rápido a la URL esperada) antes de
arrancar nada — puede que el usuario ya la tenga abierta. Si hace falta arrancarla,
usa la skill `run` de este proyecto si está disponible, o los comandos de arranque del
README/CLAUDE.md. Si tú arrancaste el servidor, párralo tú también al terminar; si ya
estaba corriendo, no lo toques.

## 3. Grabar el gif

Carga las herramientas de Chrome que necesites en una sola llamada a ToolSearch,
incluyendo `gif_creator` (por ejemplo:
`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__gif_creator,mcp__claude-in-chrome__form_input`).
Abre una pestaña nueva para esto (no reutilices pestañas de otra tarea).

Secuencia de grabación:

1. `gif_creator` `action: "start_recording"`.
2. Screenshot inmediato — es el primer frame del gif.
3. Realiza la secuencia real de interacciones que demuestran el cambio: navega, rellena
   formularios, haz clic, espera lo necesario. Incluye también el caso de error
   relevante si el PR lo maneja (p. ej. credenciales inválidas) — es más convincente
   un solo gif que muestra el camino feliz y un error manejado, que uno que solo
   muestra que "algo cargó".
4. Screenshot inmediato antes de parar — es el último frame.
5. `gif_creator` `action: "stop_recording"`.
6. `gif_creator` `action: "export"`, con `download: true` y un `filename` explícito y
   descriptivo (p. ej. `flow-8-login-registro.gif`) — pásalo siempre, así luego lo
   encuentras en la carpeta de descargas por nombre en vez de tener que adivinar un
   nombre con timestamp.

Si el flujo a demostrar tiene partes claramente independientes (p. ej. "login" y
"gestión de tareas" no tienen nada que ver entre sí), graba un gif por cada una en vez
de forzarlo todo en uno solo.

Cierra la pestaña de Chrome cuando termines de grabar.

## 4. Guardar el archivo en el repo

El gif se descarga al directorio de descargas del navegador; localízalo por el
`filename` que le pusiste. Cópialo a `docs/pr-evidence/<slug>/<nombre-descriptivo>.gif`
dentro del repo (crea la carpeta si no existe).

Antes de tocar git, mira `git status`: añade solo el/los gif(s) que acabas de crear,
nunca `git add -A` ni similares — puede haber cambios sin commitear de otra tarea que
no son tuyos y no debes arrastrarlos en este commit.

```bash
git add docs/pr-evidence/<slug>/
git commit -m "docs(<slug>): añade evidencia en gif de las pruebas manuales"
git push
```

## 5. Comentar en el PR

Comenta en el PR embebiendo el gif con la URL raw de GitHub sobre la rama que acabas
de pushear (funciona igual que con imágenes estáticas: GitHub sirve el gif animado y
se reproduce solo al abrir el comentario):

```bash
gh pr comment <numero-o-url> --body "$(cat <<'EOF'
## Evidencia de las pruebas manuales

<breve descripción de qué se ve en el gif>

![demo](https://raw.githubusercontent.com/<owner>/<repo>/<rama>/docs/pr-evidence/<slug>/<nombre>.gif)
EOF
)"
```

Si grabaste varios gifs, un bloque por cada uno con su propia descripción.

## 6. Cerrar

Responde con la URL del comentario del PR. No repitas en el chat todo lo que se ve en
el gif — para eso está el gif.
