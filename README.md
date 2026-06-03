# NexLead

NexLead is an AI-powered client acquisition, website audit, outreach, and sales pipeline SaaS for agencies and B2B service providers.

## Overview

This repository is organized as a full-stack monorepo with separate frontend, backend, database, and shared packages. The current phase focuses on architecture scaffolding — not production feature implementation.

## Folder Structure

```txt
frontend/   Next.js App Router UI
backend/    API server architecture
database/   SQL schema, migrations, seeds, docs
shared/     Framework-agnostic types and constants
docs/       Product, technical, design, partnership docs
scripts/    Dev and maintenance scripts
config/     Tooling and deployment reference config
tests/      Frontend, backend, and e2e test placeholders
```

## Frontend

- Location: `frontend/`
- Stack: Next.js, TypeScript, Tailwind CSS
- Dev: `cd frontend && npm install && npm run dev`

## Backend

- Location: `backend/`
- Layered architecture: routes → controllers → services → repositories
- Dev placeholder: `cd backend && npm install && npm run typecheck`

## Database

- Location: `database/schema`, `database/migrations`, `database/seeds`
- Entity docs: `database/docs/`

## Shared

- Location: `shared/types`, `shared/constants`, `shared/schemas`, `shared/utils`
- Imported by frontend and backend via TypeScript path aliases

## Environment Variables

Copy `.env.example` to `.env` and fill values locally. Never commit secrets.

## Development Setup

1. `cp .env.example .env`
2. `cd frontend && npm install && npm run dev`
3. (Optional) `cd backend && npm install && npm run typecheck`

## Roadmap

- Dashboard UI implementation
- Auth and workspace APIs
- Website audit and outreach automation
- Lead search integrations
- Billing and team management
