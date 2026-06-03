# API Structure

**Purpose:** REST route conventions and backend modules.

- `/api/auth`, `/api/leads`, `/api/audit`, `/api/outreach`
- Thin routes, controller request/response, service business logic
- Repository layer for persistence
- Integration clients isolated under `backend/src/integrations`
