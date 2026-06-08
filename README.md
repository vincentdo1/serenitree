# 🌳 Serenitree

A full-stack, fantasy-themed self-growth app. Turn your goals into **quests**, defeat
monsters to earn XP, reflect on your week, and watch a **magical tree grow** through five
living stages as you make progress.

Originally built in a weekend at **HackIllinois 2024**, Serenitree has since been rebuilt
from the ground up into a production-minded full-stack application: real authentication,
a typed API with a tested domain model, a polished and responsive UI, and a pluggable
LLM integration.

---

## ✨ Features

- **Quests** — create goals and pick a difficulty (a "monster" to defeat): 🫧 Slime,
  👺 Goblin, 🧙 Witch, or 🐉 Dragon. Harder monsters award more XP.
- **A living tree** — every completed quest grows your tree through five stages
  (seedling → sapling → blooming → mature → ancient), driven entirely by server-side XP.
- **Levels & progress** — a transparent XP curve with per-level progress bars.
- **Reflections** — journal what you did and how it felt, per-quest or free-form.
- **Weekly recap** — a celebratory summary of your last seven days.
- **AI-assisted (optional)** — suggest quests, spark reflection prompts, and write your
  recap using Claude or OpenAI. Works with deterministic fallbacks when no key is set.
- **Real auth** — register/login with hashed passwords and JWTs; every user's data is
  isolated.

---

## 🧱 Tech stack

| Layer        | Tech                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS             |
| **Backend**  | Hono.js, TypeScript, Drizzle ORM, Zod, JWT (`hono/jwt`), bcrypt         |
| **Database** | PostgreSQL (Docker / managed) — with a zero-setup PGlite fallback       |
| **AI**       | Pluggable `LlmProvider` skeleton — Claude / OpenAI over HTTP (no SDK dep)|
| **Tests**    | Vitest (unit + full API integration tests on an in-process database)    |

---

## 🗂️ Architecture

```
serenitree/
├── backend/          Hono API — auth, quests, plant, reflections, AI insights
│   └── src/
│       ├── app.ts            route wiring (testable, no server)
│       ├── index.ts          server entry (migrate + serve)
│       ├── schema.ts         Drizzle schema (users, plants, quests, reflections)
│       ├── db/               singleton connection (Postgres or PGlite) + seed
│       ├── lib/              leveling math, auth helpers, pluggable LLM
│       ├── middleware/       JWT auth guard
│       └── services/         one Hono sub-app per resource
├── frontend/         Next.js app — landing, auth, dashboard, quests, tree, reflect, recap
│   └── src/
│       ├── app/              routes ((app) shell + public landing/login)
│       ├── components/       UI kit + AuthProvider + AppShell
│       └── lib/              typed API client, types, game metadata
└── docker-compose.yml        local Postgres
```

The frontend talks to the backend over a typed `fetch` client; auth is a JWT sent as a
`Bearer` token. **All game logic (XP, levels, tree stage) lives on the server** as a single
source of truth — the client only renders it.

---

## 🚀 Quick start

**Prerequisites:** Node.js 20+.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit if you like
```

You have two database options:

- **Zero setup (recommended to just try it):** leave `DATABASE_URL` blank in `.env`. The
  backend runs against an in-process **PGlite** database (a WASM build of Postgres) — no
  Docker, no install.
- **Docker Postgres (production-parity):** from the repo root run `docker compose up -d`,
  then set `DATABASE_URL=postgres://serenitree:serenitree@localhost:5432/serenitree` in
  `backend/.env`.

Then:

```bash
npm run seed        # optional: creates a demo account (demo / serenitree123)
npm run dev         # API on http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev                  # app on http://localhost:4000
```

Open **http://localhost:4000** and sign in with the demo account, or create your own.

---

## 🔐 Environment variables (backend)

| Variable            | Default                        | Notes                                              |
| ------------------- | ------------------------------ | -------------------------------------------------- |
| `PORT`              | `3000`                         | API port                                           |
| `CORS_ORIGIN`       | `http://localhost:4000`        | Comma-separated allowed origins                    |
| `DATABASE_URL`      | _(blank → PGlite)_             | Postgres connection string for real DB             |
| `PGLITE_PATH`       | `./.pglite`                    | Where the fallback DB persists                     |
| `JWT_SECRET`        | `dev-insecure-secret-change-me`| **Required to change in production**               |
| `JWT_TTL_SECONDS`   | `604800` (7 days)              | Token lifetime                                     |
| `LLM_PROVIDER`      | `auto`                         | `auto` \| `anthropic` \| `openai` \| `stub`        |
| `ANTHROPIC_API_KEY` | —                              | Enables Claude                                     |
| `ANTHROPIC_MODEL`   | `claude-haiku-4-5`             | Cheapest Claude tier                               |
| `OPENAI_API_KEY`    | —                              | Enables OpenAI                                     |
| `OPENAI_MODEL`      | `gpt-4o-mini`                  | Cheapest OpenAI tier                               |

The frontend uses a single variable: `NEXT_PUBLIC_API_URL`.

---

## 🤖 LLM integration

AI is wired as a **deliberate skeleton, not enabled in the demo** — the integration points,
provider abstraction, request/response shapes, and graceful fallbacks are all real and
tested, but it ships off. It's the foundation for a feature to switch on later.

It lives behind one small interface in [`backend/src/lib/llm.ts`](backend/src/lib/llm.ts):

```ts
interface LlmProvider {
  readonly name: string
  readonly enabled: boolean
  complete(input: { system?: string; prompt: string; maxTokens?: number }): Promise<string>
}
```

- **Claude** (`claude-haiku-4-5`) and **OpenAI** (`gpt-4o-mini`) providers, both calling the
  vendor HTTP API directly — **no SDK dependency** to keep the footprint minimal.
- **No key? No problem.** Every AI endpoint falls back to deterministic local content, so
  the app works with zero setup and the request/response shapes stay real and testable.

To turn it on, set `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) in `backend/.env`. The UI shows
an `✨ AI` vs `Sample` badge so you can always tell where content came from.

**Which is cheaper, Claude or ChatGPT?** For this app the cost is negligible either way
(tiny prompts, short outputs). Per-token, OpenAI's `gpt-4o-mini` is the cheapest option;
Claude's cheapest is `claude-haiku-4-5`. Claude is wired as the default for its clean
first-party SDK — swap providers with one env var.

---

## ✅ Testing

```bash
cd backend
npm test          # unit tests for the leveling/XP math + full API integration tests
npm run typecheck # strict TypeScript, no emit
```

The API tests spin up the **real Hono app against an in-memory PGlite database** and
exercise registration, auth, quest completion → XP → tree growth (incl. idempotency),
ownership checks, reflections, and the AI fallbacks.

```bash
cd frontend
npm run typecheck
npm run build     # full production build
```

---

## 🏭 Notes for production

This is built as a polished **demo / portfolio** project. If you ever harden it for
production:

- Set a strong `JWT_SECRET` (the server refuses to boot in production with the default).
- Point `DATABASE_URL` at a managed Postgres (Neon, Supabase, RDS, …) and run
  `npm run migrate`.
- Tokens are stored client-side and sent as `Bearer` headers — fine for a demo; for a
  hardened deployment, move to httpOnly, `Secure`, `SameSite` cookies.
- Restrict `CORS_ORIGIN` to your real frontend origin(s).
- **Dependency advisories:** the backend is clean (`npm audit` → 0). The frontend's
  `npm audit` still reports Next.js advisories — these are all **self-hosted SSR** issues
  (Image Optimizer, middleware/proxy/rewrites/i18n, RSC cache poisoning) that this app
  doesn't use, and the only "fix" npm offers is a major upgrade to Next 16. Staying on the
  latest Next 14.2.x is the right call for a demo; revisit if you self-host with those
  features.

---

## 👥 Credits

Created by Vincent Do, Sengdao Inthavong, Richard Yang, and Sreyansh Mamidi at
**HackIllinois 2024**, and rebuilt as a full-stack showcase.
