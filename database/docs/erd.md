# NexLead ERD (Planned)

**Purpose:** High-level entity relationship model for the NexLead data layer.

- `users` belong to one or more `workspaces` through `workspace_members`.
- `workspaces` own `leads`, `outreach_campaigns`, `pipeline_stages`, and `subscriptions`.
- Each `lead` can have many `lead_audits`, `outreach_messages`, and `meetings`.
- `lead_audits` contain many `audit_issues`.
- `outreach_messages` may optionally link to `outreach_campaigns`.

```mermaid
erDiagram
  users ||--o{ workspace_members : has
  workspaces ||--o{ workspace_members : has
  workspaces ||--o{ leads : owns
  leads ||--o{ lead_audits : has
  lead_audits ||--o{ audit_issues : has
  leads ||--o{ outreach_messages : has
  workspaces ||--o{ outreach_campaigns : owns
  leads ||--o{ meetings : has
  workspaces ||--o{ subscriptions : has
```
