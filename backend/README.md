# Serenitree — Backend

Hono.js + Drizzle ORM API. See the [root README](../README.md) for the full picture.

## Run

```bash
npm install
cp .env.example .env
npm run seed     # optional demo data (demo / serenitree123)
npm run dev      # http://localhost:3000
```

Leave `DATABASE_URL` blank in `.env` to use the zero-setup PGlite database, or set it to a
real Postgres (e.g. `docker compose up -d` from the repo root).

## Scripts

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start with hot reload                             |
| `npm start`         | Start the server                                  |
| `npm run generate`  | Generate a Drizzle migration from `schema.ts`     |
| `npm run migrate`   | Apply migrations to the configured database       |
| `npm run seed`      | Seed a demo account                               |
| `npm test`          | Unit + API integration tests (Vitest)             |
| `npm run typecheck` | `tsc --noEmit`                                     |

## Migrations

The `drizzle/` folder holds a single migration for the current schema. There is no upgrade
path from any earlier schema — start from an empty database. For a deployment, point
`DATABASE_URL` at an empty Postgres and run `npm run migrate`. Future changes should be
additive: edit `schema.ts`, run `npm run generate`, then `migrate`.

## API

All `/api/*` routes return JSON. Protected routes require `Authorization: Bearer <jwt>`.

| Method | Path                         | Auth | Description                          |
| ------ | ---------------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`         | —    | Create an account → `{ token, user }`|
| POST   | `/api/auth/login`            | —    | Log in → `{ token, user }`           |
| GET    | `/api/auth/me`               | ✅   | Current user + plant progress        |
| GET    | `/api/quests`                | ✅   | List the user's quests               |
| POST   | `/api/quests`                | ✅   | Create a quest                       |
| GET    | `/api/quests/:id`            | ✅   | Get one quest                        |
| PATCH  | `/api/quests/:id`            | ✅   | Update a quest                       |
| DELETE | `/api/quests/:id`            | ✅   | Delete a quest                       |
| POST   | `/api/quests/:id/complete`   | ✅   | Complete → award XP → grow tree      |
| POST   | `/api/quests/:id/uncomplete` | ✅   | Undo completion → remove XP          |
| GET    | `/api/plant`                 | ✅   | Plant/tree progress derived from XP  |
| GET    | `/api/reflections`           | ✅   | List reflections (`?questId=` filter)|
| POST   | `/api/reflections`           | ✅   | Create a reflection                  |
| DELETE | `/api/reflections/:id`       | ✅   | Delete a reflection                  |
| GET    | `/api/insights/status`       | —    | Whether AI is enabled                |
| POST   | `/api/insights/reflection-prompt` | ✅ | A journaling prompt                |
| POST   | `/api/insights/quest-ideas`  | ✅   | Suggested quests for a theme         |
| GET    | `/api/insights/weekly-recap` | ✅   | Weekly summary + stats               |
