# Enum Tanımları — Final (MVP)

Migration M001'de oluşturulacak PostgreSQL ENUM tipleri. Faz 2 enum'ları ayrı migration ile eklenir.

## MVP Enum Listesi (18 tip)

| # | Enum Adı | Kullanan Tablolar |
|---|----------|-------------------|
| 1 | `workspace_role` | workspace_members, workspace_invites |
| 2 | `workspace_member_status` | workspace_members |
| 3 | `invite_status` | workspace_invites |
| 4 | `lead_status` | leads |
| 5 | `lead_source_type` | leads |
| 6 | `lead_priority` | leads |
| 7 | `website_status` | websites |
| 8 | `audit_status` | audits |
| 9 | `audit_type` | audits |
| 10 | `finding_severity` | audit_findings |
| 11 | `finding_category` | audit_findings, audit_scores |
| 12 | `report_status` | audit_reports |
| 13 | `report_format` | audit_reports |
| 14 | `campaign_status` | outreach_campaigns |
| 15 | `outreach_message_status` | outreach_messages |
| 16 | `email_account_status` | email_accounts |
| 17 | `email_provider` | email_accounts |
| 18 | `inbox_thread_status` | inbox_threads |
| 19 | `inbox_message_direction` | inbox_messages |
| 20 | `meeting_status` | meetings |
| 21 | `notification_type` | notifications |
| 22 | `subscription_status` | subscriptions |
| 23 | `plan_interval` | plans |
| 24 | `ai_operation_type` | ai_usage_logs |
| 25 | `job_type` | job_runs |
| 26 | `job_status` | job_runs |

> **Not:** `notification_channel` Faz 2'de (`notification_preferences`).

---

## Değer Tanımları

### `workspace_role`
`owner` · `admin` · `member` · `viewer`

### `workspace_member_status`
`active` · `invited` · `suspended` · `removed`

### `invite_status`
`pending` · `accepted` · `expired` · `revoked`

### `lead_status`
`new` · `enriched` · `qualified` · `contacted` · `replied` · `meeting_scheduled` · `won` · `lost` · `archived`

### `lead_source_type`
`manual` · `import` · `discovery` · `referral` · `inbound`

### `lead_priority`
`low` · `medium` · `high` · `urgent`

### `website_status`
`pending` · `active` · `unreachable` · `archived`

### `audit_status`
`queued` · `running` · `completed` · `failed` · `cancelled`

### `audit_type`
`full` · `quick` · `manual` · `scheduled`

### `finding_severity`
`info` · `low` · `medium` · `high` · `critical`

### `finding_category`
`performance` · `seo` · `accessibility` · `security` · `ux` · `content` · `technical`

### `report_status`
`draft` · `generating` · `ready` · `sent` · `failed`

### `report_format`
`html` · `pdf` · `markdown`

### `campaign_status`
`draft` · `active` · `paused` · `completed` · `archived`

### `outreach_message_status`
`draft` · `scheduled` · `queued` · `sent` · `delivered` · `opened` · `clicked` · `replied` · `bounced` · `failed` · `cancelled`

### `email_account_status`
`pending` · `verified` · `error` · `disconnected`

### `email_provider`
`smtp` · `resend` · `google` · `microsoft`

### `inbox_thread_status`
`open` · `snoozed` · `closed` · `spam`

### `inbox_message_direction`
`inbound` · `outbound`

### `meeting_status`
`scheduled` · `confirmed` · `completed` · `cancelled` · `no_show` · `rescheduled`

### `notification_type`
`lead_assigned` · `audit_completed` · `reply_received` · `meeting_reminder` · `billing_alert` · `system`

### `subscription_status`
`trialing` · `active` · `past_due` · `cancelled` · `expired`

### `plan_interval`
`monthly` · `yearly`

### `ai_operation_type`
`lead_enrichment` · `audit_analysis` · `report_generation` · `email_compose` · `reply_classification`

### `job_type`
`lead_discovery` · `website_audit` · `report_generation` · `outreach_send` · `inbox_sync`

### `job_status`
`pending` · `running` · `completed` · `failed` · `retrying` · `cancelled`

---

## TEXT + CHECK Alternatifi

ENUM yerine `TEXT` + `CHECK` constraint kullanılabilir — avantaj: yeni değer eklemek migration gerektirmez. NexLead MVP'de **PostgreSQL ENUM** tercih edilir (tip güvenliği, daha az hata).

Yeni enum değeri eklemek: `ALTER TYPE ... ADD VALUE` migration.

---

## Faz 2 Enum'ları

| Enum | Tablo |
|------|-------|
| `notification_channel` | notification_preferences |
| `integration_provider` | integrations |
| `integration_status` | integrations |
