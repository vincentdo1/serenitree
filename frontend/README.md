# Serenitree — Frontend

Next.js 14 (App Router) + Tailwind CSS. See the [root README](../README.md) for the full
picture.

## Run

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev                  # http://localhost:4000
```

The backend must be running (default `http://localhost:3000`).

## Scripts

| Script              | Description                  |
| ------------------- | --------------------------- |
| `npm run dev`       | Dev server on port 4000     |
| `npm run build`     | Production build            |
| `npm start`         | Serve the production build  |
| `npm run lint`      | ESLint                      |
| `npm run typecheck` | `tsc --noEmit`              |

## Structure

- `src/app` — routes. Public **landing** (`/`) and **login** (`/login`); the authenticated
  app lives in the `(app)` route group (`/dashboard`, `/quests`, `/tree`, `/reflect`,
  `/recap`) behind an auth guard.
- `src/components` — UI kit, `AuthProvider` (JWT + user state), and `AppShell` (nav).
- `src/lib` — typed `api` client, shared `types`, and game metadata (stages, difficulties).
