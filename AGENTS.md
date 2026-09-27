# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync: proyecto de práctica del curso LIDR AI4Devs (gestión de tareas en equipo). API en AdonisJS 7 (`backend/`) + frontend en React 19 + Vite (`frontend/`). El `frontend/` todavía es el boilerplate por defecto de Vite (sin lógica propia); todo el desarrollo real hasta ahora está en `backend/`.

Este clon es la "copia con harness" de un ejercicio sobre medir el efecto de un harness de Claude Code (ver `README.md` y `prompts.md`). No tocar `prompts.md` salvo para añadir los prompts realmente lanzados, tal cual, sin reescribirlos.

## Comandos

### Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev          # arranca en http://localhost:3333 con HMR
npm run build        # node ace build
npm run test         # node ace test
npm run lint         # eslint .
npm run format       # prettier --write .
npm run typecheck    # tsc --noEmit
```

Un único test: `node ace test --files "tests/functional/mi_archivo.spec.ts"` (sustituir por la ruta real; hay dos suites definidas en `adonisrc.ts`: `unit` en `tests/unit/**` y `functional` en `tests/functional/**`, ninguna con specs todavía).

### Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev       # vite, arranca en http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint       # oxlint
npm run preview
```

Backend y frontend se ejecutan en terminales separadas (el backend se queda corriendo en la primera).

## Arquitectura del backend

- **AdonisJS 7** con arquitectura por capas típica: `app/controllers`, `app/models`, `app/validators` (VineJS), `app/transformers` (serialización de salida), `app/middleware`. Rutas en `start/routes.ts`, kernel/middleware global en `start/kernel.ts`.
- **Imports por subpath** (`package.json` → `imports`): usar siempre `#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, `#database/*`, `#generated/*`, etc. en lugar de rutas relativas.
- **Esquema autogenerado**: `database/schema.ts` se regenera automáticamente al correr `node ace migration:run` (cabecera "DO NOT EDIT manually" — no editarlo a mano). Cada tabla produce una clase `*Schema` (p.ej. `UserSchema`) con columnas tipadas desde las migraciones. Los modelos reales (p.ej. `app/models/user.ts`) extienden esa clase generada vía `compose(...)`, no `BaseModel` directamente, y ahí es donde va la lógica de negocio (getters, mixins de auth, etc.). `database/schema_rules.ts` permite anular reglas de generación por tabla/columna si el generador infiere algo incorrecto.
- **Auth**: dos guards configurados en `config/auth.ts` — `api` (tokens vía `@adonisjs/auth/access_tokens`, guard por defecto) para el API stateless, y `web` (sesión) para navegador. `User` usa `withAuthFinder` + `DbAccessTokensProvider` para login/verificación de credenciales y emisión de tokens.
- **Rutas** viven bajo `/api/v1`, agrupadas en `auth` (`POST auth/signup`, `POST auth/login`, sin middleware) y `profile` (`GET account/profile`, `POST account/logout`, protegidas con `middleware.auth()`). Los controladores se referencian desde el registro generado `#generated/controllers` (`controllers.NewAccount`, `controllers.AccessTokens`, `controllers.Profile`), no importándolos directamente — ese registro se recompila automáticamente (hook `indexEntities` en `adonisrc.ts`).
- **Tuyau** (`@tuyau/core`) genera un registro/cliente tipado de la API (hook `generateRegistry()` en `adonisrc.ts`, salida en `.adonisjs/client/`) pensado para ser consumido por el frontend, aunque el frontend aún no lo usa.
- Los archivos bajo `.adonisjs/` (client y server) son **generados**; no editarlos a mano, se regeneran al arrancar/compilar.
- Serialización de salida: los controladores no devuelven modelos crudos, pasan por un `*Transformer` (`BaseTransformer`, método `toObject()` con `this.pick(...)`) y se envían con el helper `serialize()` del `HttpContext`.
- Validación de entrada: los controladores llaman `request.validateUsing(xValidator)` con validadores VineJS definidos en `app/validators/`.
- Base de datos: SQLite (`better-sqlite3`) vía Lucid, fichero en `tmp/db.sqlite3` (gitignored). `.env.test` existe para la suite de tests.
- CORS: configurable por `CORS_ORIGIN` en `.env` (ver `.env.example`); por defecto sin restringir a un origen del frontend.

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
con la URL del PR.

