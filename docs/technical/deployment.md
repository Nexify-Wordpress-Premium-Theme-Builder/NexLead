# NexLead Deployment (Vercel)

**Purpose:** Document how to deploy the NexLead frontend on Vercel.

## Vercel project settings

| Setting | Value |
|--------|--------|
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Node.js Version | 20.x (recommended) |

## Environment variables

Configure in the Vercel dashboard (never commit secrets):

- `NEXT_PUBLIC_APP_URL` — production app URL
- `NEXT_PUBLIC_API_URL` — backend API base URL when available

Copy placeholders from the repository root `.env.example`.

## Monorepo note

This repository stores the Next.js app in `frontend/`. Set **Root Directory** to `frontend` in Vercel so builds run against the correct `package.json`.

## Local production check

```bash
cd frontend
npm install
npm run build
npm run start
```

## Backend

Backend deployment is out of scope for the initial Vercel frontend setup. API hosting can be added later (e.g. Render) and connected via `NEXT_PUBLIC_API_URL`.
