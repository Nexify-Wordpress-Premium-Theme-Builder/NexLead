# Final Database Schema — Migration Öncesi

NexLead MVP için onaylanmış tablo mimarisi. **SQL içermez.**

> Kapsam: [mvp-scope.md](./mvp-scope.md) · Sıra: [migration-order.md](./migration-order.md) · Enum: [enums.md](./enums.md)

## Standart Kolonlar

Tüm MVP tablolarında (istisnalar belirtilmiş):

| Kolon | Tip | Zorunlu | Açıklama |
|-------|-----|---------|----------|
| `id` | UUID | PK | `gen_random_uuid()` |
| `created_at` | TIMESTAMPTZ | ✓ | `now()` |
| `updated_at` | TIMESTAMPTZ | ✓ | trigger |

Ek standartlar:
- `workspace_id` → tenant-scoped tablolarda NOT NULL
- `deleted_at` → soft delete tablolarında nullable
- `created_by` → user-initiated kayıtlarda nullable UUID → `auth.users`

---

## 1. Auth & Workspace

### `profiles`
| Scope | Global (user) |
|-------|---------------|

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK = auth.users.id | |
| full_name | TEXT | ✓ | | |
| avatar_url | TEXT | ✓ | | |
| locale | TEXT | | | default `tr` |
| timezone | TEXT | | | default `Europe/Istanbul` |
| onboarding_completed_at | TIMESTAMPTZ | ✓ | | |
| last_seen_at | TIMESTAMPTZ | ✓ | | |
| last_active_workspace_id | UUID | ✓ | workspaces.id | UI state |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**İlişkiler:** `auth.users` 1:1  
**RLS:** SELECT own + workspace peers (sınırlı); UPDATE own  
**Index:** PK yeterli

---

### `workspaces`
| Scope | Tenant root |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| name | TEXT | | | |
| slug | TEXT | | | UNIQUE global |
| logo_url | TEXT | ✓ | | |
| industry | TEXT | ✓ | | |
| settings | JSONB | | | `{}` default |
| status | TEXT | | | `active`, `suspended`, `closed` |
| created_by | UUID | | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |
| deleted_at | TIMESTAMPTZ | ✓ | | soft delete |

**İlişkiler:** 1:N tüm tenant tabloları  
**RLS:** member SELECT; owner/admin UPDATE; owner DELETE (soft)  
**Index:** `slug` UNIQUE, `(status)` partial active

---

### `workspace_members`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| user_id | UUID | | auth.users | |
| role | workspace_role | | | enum |
| status | workspace_member_status | | | enum |
| invited_by | UUID | ✓ | auth.users | |
| joined_at | TIMESTAMPTZ | ✓ | | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**Unique:** `(workspace_id, user_id)`  
**RLS:** member SELECT; admin+ INSERT/UPDATE; owner DELETE  
**Index:** `(user_id)`, `(workspace_id, status)`

---

### `workspace_invites`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| email | TEXT | | | |
| role | workspace_role | | | |
| status | invite_status | | | enum |
| token_hash | TEXT | | | |
| invited_by | UUID | | auth.users | |
| expires_at | TIMESTAMPTZ | | | |
| accepted_at | TIMESTAMPTZ | ✓ | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** admin+ CRUD  
**Index:** `(workspace_id, email, status)`, `(token_hash)`

---

## 2. Leads

### `leads`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| company_name | TEXT | | | |
| contact_name | TEXT | ✓ | | |
| contact_email | TEXT | ✓ | | |
| contact_phone | TEXT | ✓ | | |
| industry | TEXT | ✓ | | |
| location | TEXT | ✓ | | |
| status | lead_status | | | enum |
| priority | lead_priority | | | enum, default `medium` |
| score | INTEGER | | | 0–100, default 0 |
| score_breakdown | JSONB | | | `{}` |
| source_type | lead_source_type | | | enum |
| assigned_to | UUID | ✓ | auth.users | |
| notes_summary | TEXT | ✓ | | AI özet |
| metadata | JSONB | | | `{}` |
| last_contacted_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |
| deleted_at | TIMESTAMPTZ | ✓ | | |

**İlişkiler:** 1:N websites, audits, outreach, inbox, meetings  
**RLS:** member+ CRUD; viewer SELECT  
**Index:** `(workspace_id, status)`, `(workspace_id, score DESC)`, `(workspace_id, assigned_to)`

---

### `lead_notes`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| lead_id | UUID | | leads | |
| author_id | UUID | | auth.users | |
| body | TEXT | | | |
| is_pinned | BOOLEAN | | | default false |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD  
**Index:** `(lead_id, created_at DESC)`

---

## 3. Websites

### `websites`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| lead_id | UUID | ✓ | leads | manuel audit = null |
| url | TEXT | | | |
| normalized_url | TEXT | | | |
| domain | TEXT | | | |
| title | TEXT | ✓ | | |
| description | TEXT | ✓ | | |
| favicon_url | TEXT | ✓ | | |
| status | website_status | | | enum |
| is_primary | BOOLEAN | | | default false |
| last_audited_at | TIMESTAMPTZ | ✓ | | |
| last_audit_id | UUID | ✓ | audits | |
| metadata | JSONB | | | `{}` |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |
| deleted_at | TIMESTAMPTZ | ✓ | | |

**Unique:** `(workspace_id, normalized_url)`  
**İlişkiler:** N:1 lead; 1:N audits  
**RLS:** member+ CRUD; viewer SELECT  
**Index:** `(workspace_id, lead_id)`, `(workspace_id, domain)`

---

## 4. Audits

### `audits`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| website_id | UUID | | websites | |
| lead_id | UUID | ✓ | leads | denormalize |
| type | audit_type | | | enum |
| status | audit_status | | | enum |
| overall_score | INTEGER | ✓ | | 0–100 |
| score_breakdown | JSONB | ✓ | | |
| pages_crawled | INTEGER | ✓ | | |
| duration_ms | INTEGER | ✓ | | |
| error_message | TEXT | ✓ | | |
| job_run_id | UUID | ✓ | job_runs | |
| started_at | TIMESTAMPTZ | ✓ | | |
| completed_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**Not:** completed audit immutable — UPDATE yalnızca `running` durumunda.  
**RLS:** member+ INSERT; member+ SELECT; UPDATE service + running state  
**Index:** `(workspace_id, website_id, created_at DESC)`, `(workspace_id, status)`

---

### `audit_scores`
| Scope | workspace_id (denormalize) |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| audit_id | UUID | | audits | |
| category | finding_category | | | enum |
| score | INTEGER | | | 0–100 |
| weight | NUMERIC(4,2) | | | |
| created_at | TIMESTAMPTZ | | | |

**Unique:** `(audit_id, category)`  
**RLS:** audit ile aynı erişim  
**Index:** `(audit_id)`

---

### `audit_findings`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| audit_id | UUID | | audits | |
| category | finding_category | | | |
| severity | finding_severity | | | |
| title | TEXT | | | |
| description | TEXT | | | |
| recommendation | TEXT | ✓ | | |
| affected_url | TEXT | ✓ | | |
| evidence | JSONB | ✓ | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** member SELECT; service INSERT  
**Index:** `(audit_id, severity)`, `(workspace_id, category)`

---

## 5. Reports

### `audit_reports`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| audit_id | UUID | | audits | |
| lead_id | UUID | ✓ | leads | |
| website_id | UUID | ✓ | websites | |
| title | TEXT | | | |
| status | report_status | | | enum |
| format | report_format | | | enum |
| language | TEXT | | | default `tr` |
| summary | TEXT | ✓ | | |
| content_storage_path | TEXT | ✓ | | Storage |
| pdf_storage_path | TEXT | ✓ | | Storage |
| share_token | TEXT | ✓ | | hashed |
| share_expires_at | TIMESTAMPTZ | ✓ | | |
| generated_by_ai | BOOLEAN | | | default true |
| ai_usage_log_id | UUID | ✓ | ai_usage_logs | |
| job_run_id | UUID | ✓ | job_runs | |
| sent_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD (draft update); anon SELECT via share_token (ayrı policy)  
**Index:** `(workspace_id, lead_id, created_at DESC)`, `(audit_id)`, `(share_token)` partial

---

### `report_sections`
| Scope | audit_report üzerinden |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| report_id | UUID | | audit_reports | |
| order_index | INTEGER | | | |
| section_type | TEXT | | | |
| title | TEXT | | | |
| body | TEXT | | | |
| metadata | JSONB | ✓ | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** parent report policy cascade  
**Index:** `(report_id, order_index)`

---

## 6. Outreach & Email

### `email_accounts`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| provider | email_provider | | | enum |
| email_address | TEXT | | | |
| display_name | TEXT | ✓ | | MVP sender identity |
| status | email_account_status | | | enum |
| credentials_ref | TEXT | ✓ | | Vault ref, not secret |
| daily_send_limit | INTEGER | | | default 50 |
| sent_today_count | INTEGER | | | default 0 |
| last_synced_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |
| deleted_at | TIMESTAMPTZ | ✓ | | |

**RLS:** admin+ CRUD; member SELECT  
**Index:** `(workspace_id, status)`

---

### `outreach_campaigns`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| name | TEXT | | | |
| status | campaign_status | | | enum |
| email_account_id | UUID | | email_accounts | |
| description | TEXT | ✓ | | |
| settings | JSONB | | | `{}` |
| started_at | TIMESTAMPTZ | ✓ | | |
| completed_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD  
**Index:** `(workspace_id, status)`

---

### `outreach_messages`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| campaign_id | UUID | | outreach_campaigns | |
| lead_id | UUID | | leads | |
| audit_report_id | UUID | ✓ | audit_reports | |
| email_account_id | UUID | | email_accounts | |
| recipient_email | TEXT | | | |
| subject | TEXT | | | |
| body_html | TEXT | | | |
| body_text | TEXT | ✓ | | |
| status | outreach_message_status | | | enum |
| scheduled_at | TIMESTAMPTZ | ✓ | | |
| sent_at | TIMESTAMPTZ | ✓ | | |
| opened_at | TIMESTAMPTZ | ✓ | | |
| clicked_at | TIMESTAMPTZ | ✓ | | |
| replied_at | TIMESTAMPTZ | ✓ | | |
| provider_message_id | TEXT | ✓ | | |
| error_message | TEXT | ✓ | | |
| job_run_id | UUID | ✓ | job_runs | |
| ai_usage_log_id | UUID | ✓ | ai_usage_logs | |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD  
**Index:** `(workspace_id, status, scheduled_at)`, `(lead_id)`, `(provider_message_id)` UNIQUE

---

## 7. Inbox

### `inbox_threads`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| lead_id | UUID | | leads | |
| outreach_message_id | UUID | ✓ | outreach_messages | |
| email_account_id | UUID | | email_accounts | |
| subject | TEXT | | | |
| status | inbox_thread_status | | | enum |
| last_message_at | TIMESTAMPTZ | | | |
| unread_count | INTEGER | | | default 0 |
| assigned_to | UUID | ✓ | auth.users | |
| snoozed_until | TIMESTAMPTZ | ✓ | | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD  
**Index:** `(workspace_id, last_message_at DESC)`, `(workspace_id, assigned_to, unread_count)`

---

### `inbox_messages`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| thread_id | UUID | | inbox_threads | |
| direction | inbox_message_direction | | | enum |
| from_email | TEXT | | | |
| to_email | TEXT | | | |
| subject | TEXT | ✓ | | |
| body_html | TEXT | ✓ | | |
| body_text | TEXT | ✓ | | |
| provider_message_id | TEXT | ✓ | | |
| in_reply_to | TEXT | ✓ | | RFC Message-ID |
| is_read | BOOLEAN | | | default false |
| sentiment | TEXT | ✓ | | AI: positive/neutral/negative |
| ai_summary | TEXT | ✓ | | |
| ai_usage_log_id | UUID | ✓ | ai_usage_logs | |
| received_at | TIMESTAMPTZ | | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD; service INSERT (sync)  
**Index:** `(thread_id, received_at)`, `(provider_message_id)` UNIQUE

---

## 8. Meetings

### `meetings`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| lead_id | UUID | | leads | |
| title | TEXT | | | |
| description | TEXT | ✓ | | |
| status | meeting_status | | | enum |
| scheduled_start | TIMESTAMPTZ | | | |
| scheduled_end | TIMESTAMPTZ | | | |
| timezone | TEXT | | | |
| location | TEXT | ✓ | | |
| meeting_url | TEXT | ✓ | | |
| contact_email | TEXT | ✓ | | MVP participant |
| contact_name | TEXT | ✓ | | |
| outreach_message_id | UUID | ✓ | outreach_messages | |
| audit_report_id | UUID | ✓ | audit_reports | |
| brief | TEXT | ✓ | | AI özet |
| notes | TEXT | ✓ | | Toplantı sonrası |
| assigned_to | UUID | ✓ | auth.users | |
| created_by | UUID | | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member+ CRUD  
**Index:** `(workspace_id, scheduled_start)`, `(lead_id)`

---

## 9. Notifications

### `notifications`
| Scope | workspace_id + user_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| user_id | UUID | | auth.users | |
| type | notification_type | | | enum |
| title | TEXT | | | |
| body | TEXT | | | |
| action_url | TEXT | ✓ | | |
| reference_type | TEXT | ✓ | | |
| reference_id | UUID | ✓ | | |
| is_read | BOOLEAN | | | default false |
| read_at | TIMESTAMPTZ | ✓ | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** user SELECT/UPDATE own; service INSERT  
**Index:** `(user_id, is_read, created_at DESC)`

---

## 10. Billing

### `plans`
| Scope | Global (sistem) |

| Kolon | Tip | Null | Açıklama |
|-------|-----|------|----------|
| id | UUID | PK | |
| name | TEXT | | |
| slug | TEXT | UNIQUE | |
| description | TEXT | ✓ | |
| interval | plan_interval | | |
| price_cents | INTEGER | | |
| currency | TEXT | | `TRY` |
| features | JSONB | | |
| limits | JSONB | | kota tanımları |
| is_active | BOOLEAN | | |
| sort_order | INTEGER | | |
| created_at | TIMESTAMPTZ | | |
| updated_at | TIMESTAMPTZ | | |

**RLS:** authenticated SELECT; service/manage only  
**Index:** `(slug)` UNIQUE

---

### `subscriptions`
| Scope | workspace_id (1:1 aktif) |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | UNIQUE |
| plan_id | UUID | | plans | |
| status | subscription_status | | | enum |
| provider | TEXT | ✓ | | stripe, iyzico |
| provider_subscription_id | TEXT | ✓ | | |
| trial_ends_at | TIMESTAMPTZ | ✓ | | |
| current_period_start | TIMESTAMPTZ | | | |
| current_period_end | TIMESTAMPTZ | | | |
| cancelled_at | TIMESTAMPTZ | ✓ | | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member SELECT; admin+ limited; service manage  
**Index:** `(workspace_id)` UNIQUE

---

### `usage_quotas`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| subscription_id | UUID | | subscriptions | |
| period_start | TIMESTAMPTZ | | | |
| period_end | TIMESTAMPTZ | | | |
| leads_count | INTEGER | | | default 0 |
| audits_count | INTEGER | | | default 0 |
| outreach_sent_count | INTEGER | | | default 0 |
| ai_tokens_used | BIGINT | | | default 0 |
| updated_at | TIMESTAMPTZ | | | |

**Unique:** `(workspace_id, period_start)`  
**RLS:** member SELECT; service UPDATE  
**Index:** `(workspace_id, period_start)`

---

## 11. Jobs & AI

### `job_runs`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| type | job_type | | | enum |
| status | job_status | | | enum |
| priority | INTEGER | | | default 5 |
| payload | JSONB | | | |
| result | JSONB | ✓ | | |
| error_message | TEXT | ✓ | | |
| retry_count | INTEGER | | | default 0 |
| max_retries | INTEGER | | | default 3 |
| reference_type | TEXT | ✓ | | |
| reference_id | UUID | ✓ | | |
| scheduled_at | TIMESTAMPTZ | ✓ | | |
| started_at | TIMESTAMPTZ | ✓ | | |
| completed_at | TIMESTAMPTZ | ✓ | | |
| created_by | UUID | ✓ | auth.users | |
| created_at | TIMESTAMPTZ | | | |
| updated_at | TIMESTAMPTZ | | | |

**RLS:** member SELECT; service INSERT/UPDATE  
**Index:** `(workspace_id, status, scheduled_at)`, `(reference_type, reference_id)`

---

### `ai_usage_logs`
| Scope | workspace_id |

| Kolon | Tip | Null | FK | Açıklama |
|-------|-----|------|-----|----------|
| id | UUID | | PK | |
| workspace_id | UUID | | workspaces | |
| user_id | UUID | ✓ | auth.users | |
| operation_type | ai_operation_type | | | enum |
| model | TEXT | | | |
| provider | TEXT | | | |
| input_tokens | INTEGER | | | |
| output_tokens | INTEGER | | | |
| total_tokens | INTEGER | | | |
| estimated_cost_cents | INTEGER | ✓ | | |
| latency_ms | INTEGER | ✓ | | |
| reference_type | TEXT | ✓ | | |
| reference_id | UUID | ✓ | | |
| job_run_id | UUID | ✓ | job_runs | |
| status | TEXT | | | success/failed |
| error_message | TEXT | ✓ | | |
| metadata | JSONB | ✓ | | |
| created_at | TIMESTAMPTZ | | | |

**RLS:** admin SELECT; service INSERT  
**Index:** `(workspace_id, created_at DESC)`, `(workspace_id, operation_type)`

---

## ER Diyagramı (MVP)

```
workspaces ─┬─ workspace_members ── auth.users ── profiles
            ├─ leads ─┬─ websites ── audits ─┬─ audit_scores
            │         │                       ├─ audit_findings
            │         │                       └─ audit_reports ── report_sections
            │         ├─ lead_notes
            │         ├─ outreach_messages ◄── outreach_campaigns
            │         ├─ inbox_threads ── inbox_messages
            │         └─ meetings
            ├─ email_accounts
            ├─ notifications
            ├─ subscriptions ── plans
            ├─ usage_quotas
            ├─ job_runs
            └─ ai_usage_logs
```

---

## Workspace Scope Özet Tablosu

| Tablo | workspace_id | Not |
|-------|--------------|-----|
| profiles | — | Global user |
| workspaces | — | Tenant root |
| workspace_members | ✓ | |
| workspace_invites | ✓ | |
| leads | ✓ | |
| lead_notes | ✓ | |
| websites | ✓ | |
| audits | ✓ | |
| audit_scores | ✓ | denormalize |
| audit_findings | ✓ | |
| audit_reports | ✓ | |
| report_sections | — | via report FK |
| email_accounts | ✓ | |
| outreach_campaigns | ✓ | |
| outreach_messages | ✓ | |
| inbox_threads | ✓ | |
| inbox_messages | ✓ | |
| meetings | ✓ | |
| notifications | ✓ | + user_id |
| plans | — | Global |
| subscriptions | ✓ | |
| usage_quotas | ✓ | |
| job_runs | ✓ | |
| ai_usage_logs | ✓ | |

---

## RLS Özet (MVP)

| Pattern | Tablolar |
|---------|----------|
| User owns record | `profiles`, `notifications` |
| Workspace member read | Tüm `workspace_id` tabloları |
| member+ write | leads, websites, audits, reports, outreach, inbox, meetings |
| admin+ write | email_accounts, workspace_invites, members |
| owner only | workspace delete, billing cancel |
| Service role only | job_runs write, ai_usage_logs insert, audit_findings insert |
| Viewer read-only | member tablolarında SELECT only |

Detay: [rls-policies.md](./rls-policies.md)

---

## Onay Durumu

| Kontrol | Durum |
|---------|-------|
| MVP tablo listesi net | ✓ |
| Faz 2 ayrımı net | ✓ |
| Kolon planları tamam | ✓ |
| FK bağımlılıkları tutarlı | ✓ |
| RLS stratejisi tanımlı | ✓ |
| Index ihtiyaçları tanımlı | ✓ |
| Migration sırası belirlendi | ✓ |
| SQL yazılmadı | ✓ |

**Sonraki adım:** [pre-migration-checklist.md](./pre-migration-checklist.md) tamamla → Migration M001 başlat.
