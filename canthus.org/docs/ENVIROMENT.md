## Environment setup

This project uses separate environment files for client (Vite) and server (Bun/Hono). Do not commit real secrets. Copy the example files and fill them for each environment.

### Server (Bun/Hono)

Files live in `server/`:

- `.env.staging`
- `.env.production`
- `.env.example` (template, committed)

Variables (example):

```
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_WEBHOOK_SECRET=whsec_...
WORKOS_REDIRECT_URI=https://staging.example.com/callback
WORKOS_COOKIE_PASSWORD=please_change_me_to_a_strong_password
APP_BASE_URL=https://staging.example.com
NODE_ENV=staging
```

Run with a specific env file using Bun:

```
bun --env-file=.env.staging run src/index.ts   # dev or staging
bun --env-file=.env.production run dist/index.js
```

In code, access vars via `process.env` or `Bun.env`.

### Client (Vite/React)

Files live in `client/` and must use the `VITE_` prefix to be exposed to the browser:

- `.env.staging`
- `.env.production`
- `.env.example` (template, committed)

Variables (example):

```
VITE_WORKOS_CLIENT_ID=client_...
VITE_API_BASE_URL=https://staging.api.example.com
VITE_ENV_NAME=staging
```

Use Vite modes to pick the file:

```
vite build --mode staging
vite build --mode production
```

Or via scripts included in `client/package.json`.

### Git ignore

`.env.example` files are committed. Real `.env.*` files are ignored in the repo via the root `.gitignore`.

### WorkOS notes

- Keep `WORKOS_API_KEY` server-side only.
- The client can safely use `WORKOS_CLIENT_ID` (prefixed as `VITE_WORKOS_CLIENT_ID`).
- Configure redirect URLs in WorkOS to match your `WORKOS_REDIRECT_URI`.
