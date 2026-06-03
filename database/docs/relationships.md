# Entity Relationships

**Purpose:** Describe how NexLead entities relate to each other.

- A **workspace** is the top-level tenant boundary for leads, outreach, pipeline, and billing.
- **Users** access workspaces through **workspace_members** with role-based permissions (planned).
- **Leads** always belong to exactly one workspace.
- **Lead audits** and **audit issues** cascade from lead discovery and website analysis workflows.
- **Outreach messages** reference leads and optionally campaigns for reporting.
- **Meetings** reference leads to connect sales conversations with pipeline context.
- **Subscriptions** reference workspaces for plan limits and billing lifecycle.
