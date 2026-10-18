# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync es el proyecto de ejercicio de un curso (módulo de *harness engineering*). Es un monorepo con dos apps independientes en TypeScript, cada una con su propio `package.json` y `node_modules` (no hay workspace en la raíz):

- `backend/`: API en **AdonisJS 7** (Lucid ORM + SQLite, VineJS, auth por access tokens). **Ya existe y en esta sesión no se modifica**: solo se lee para conocer el contrato de la API.
- `frontend/`: **React 19 + Vite**, todavía es la plantilla de Vite sin tocar (`src/App.tsx`). Aquí es donde se trabaja. El curso pide **shadcn/ui** para los componentes, pero aún no están instalados ni shadcn ni Tailwind.

`README.md` es el enunciado del ejercicio (generado, no se edita a mano) y `prompts.md` es la plantilla donde el alumno registra sus prompts; ninguno de los dos es documentación del código.

Requiere **Node.js 24+** (con Node 20 el backend falla con `Unknown file extension ".ts"`).

## Comandos

Backend (`cd backend`), sirve en `http://localhost:3333`:

```bash
npm install && cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run      # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev                 # node ace serve --hmr
npm run lint                # eslint
npm run typecheck           # tsc --noEmit
npm run format              # prettier (config @adonisjs/prettier-config)
npm test                    # node ace test
node ace test unit          # una sola suite (unit | functional)
node ace test --files=tests/functional/auth.spec.ts   # un solo archivo
node ace test --tests="nombre del test"               # un solo test
```

Aún no hay tests: solo `tests/bootstrap.ts`. Las suites están declaradas en `adonisrc.ts` (`tests/unit/**/*.spec.ts`, `tests/functional/**/*.spec.ts`); la suite `functional` arranca el servidor HTTP y usa `@japa/api-client` con soporte de auth/session. `.env.test` usa `SESSION_DRIVER=memory`.

Frontend (`cd frontend`), sirve en `http://localhost:5173`:

```bash
npm run dev       # vite
npm run build     # tsc -b && vite build (el type-check va en el build)
npm run lint      # oxlint (.oxlintrc.json)
npm run format    # prettier (.prettierrc.json: sin punto y coma, comillas simples)
```

El frontend no tiene tests configurados. Un hook `PostToolUse` (`.claude/settings.json` → `.claude/hooks/format-frontend.mjs`) pasa Prettier a cada archivo de `frontend/` que Claude edita.

## Arquitectura del backend

Flujo de una petición: `start/routes.ts` → controlador → validador VineJS → modelo Lucid → transformer → `ctx.serialize()`.

- **Rutas** (`start/routes.ts`): todo cuelga de `/api/v1`. Los controladores se referencian vía `controllers` de `#generated/controllers` (`.adonisjs/server/controllers.ts`), un índice **autogenerado** por los hooks de `adonisrc.ts`. Lo mismo ocurre con el registry tipado de rutas en `.adonisjs/client/` (Tuyau). No se editan a mano.
- **Imports**: se usan los alias de `package.json#imports` (`#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`…), con extensión `.js` resuelta a `.ts`.
- **Modelos**: `app/models/user.ts` extiende `UserSchema` de `database/schema.ts`, que **se genera** a partir de las migraciones al ejecutar `node ace migration:run`. Un cambio de esquema es siempre una migración nueva en `database/migrations/`, nunca editar `schema.ts` ni la tabla.
- **Respuestas**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve todo en `{ "data": ... }`. Los **transformers** (`app/transformers/`) deciden qué campos salen; el password nunca se expone.
- **Errores**: `force_json_response_middleware` fuerza `Accept: application/json`, así que todos los errores salen en JSON. Los de validación VineJS son 422 con `errors: [{ field, rule, message }]`; las credenciales inválidas en login (`User.verifyCredentials`) lanzan `E_INVALID_CREDENTIALS` (400).
- **Auth**: el guard por defecto es `api` (`config/auth.ts`), con access tokens opacos (prefijo `oat_`) guardados en `auth_access_tokens`. El cliente los envía como `Authorization: Bearer <token>`. Las rutas de `/account` usan `middleware.auth()`.
- **CORS** (`config/cors.ts`): en desarrollo acepta cualquier origen; en producción la allowlist está vacía.

## Contrato de la API (lo que necesita el frontend)

| Método y ruta | Auth | Body | Respuesta |
|---|---|---|---|
| `POST /api/v1/auth/signup` | no | `fullName`, `email`, `password`, `passwordConfirmation` | `{ data: { user, token } }` |
| `POST /api/v1/auth/login` | no | `email`, `password` | `{ data: { user, token } }` |
| `GET /api/v1/account/profile` | Bearer | — | `{ data: user }` |
| `POST /api/v1/account/logout` | Bearer | — | `{ message }` (sin envolver en `data`) |

Reglas de `app/validators/user.ts` que un ticket de producto no suele mencionar:

- En signup, `fullName` es **obligatorio como clave** aunque admite `null` (si no se envía, falla con `required`).
- En signup, `passwordConfirmation` es obligatorio y debe coincidir con `password`.
- `password` mide entre 8 y 32 caracteres en signup; `email` debe ser válido, de 254 caracteres como máximo y único (si ya existe, la respuesta es un 422 con el error en el campo `email`).
- `user` contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`.

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
con la URL del PR.
