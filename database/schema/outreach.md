# Outreach Şeması

E-posta kampanyaları, sequence'lar ve gönderim kayıtları.

## `outreach_campaigns`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `name` | TEXT | Kampanya adı |
| `status` | ENUM | `campaign_status` |
| `email_account_id` | UUID FK | Gönderen hesap |
| `sender_identity_id` | UUID FK | From name / reply-to |
| `description` | TEXT | |
| `settings` | JSONB | Günlük limit, saat aralığı |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

## `outreach_sequences`

Kampanya içindeki adım dizisi (multi-touch).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `campaign_id` | UUID FK | |
| `workspace_id` | UUID FK | |
| `step_order` | INTEGER | 1, 2, 3... |
| `delay_days` | INTEGER | Önceki adımdan sonra bekleme |
| `subject_template` | TEXT | |
| `body_template` | TEXT | AI merge field'ları içerir |
| `created_at` | TIMESTAMPTZ | |

## `outreach_messages`

Tekil gönderim kaydı — lead + sequence adımı birleşimi.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `campaign_id` | UUID FK | |
| `sequence_id` | UUID FK | |
| `lead_id` | UUID FK | |
| `audit_report_id` | UUID FK | Eklenen rapor (opsiyonel) |
| `email_account_id` | UUID FK | |
| `recipient_email` | TEXT | |
| `subject` | TEXT | Kişiselleştirilmiş konu |
| `body_html` | TEXT | |
| `body_text` | TEXT | |
| `status` | ENUM | `outreach_message_status` |
| `scheduled_at` | TIMESTAMPTZ | |
| `sent_at` | TIMESTAMPTZ | |
| `opened_at` | TIMESTAMPTZ | |
| `clicked_at` | TIMESTAMPTZ | |
| `replied_at` | TIMESTAMPTZ | |
| `provider_message_id` | TEXT | Email provider ID |
| `error_message` | TEXT | |
| `job_run_id` | UUID FK | |
| `ai_usage_log_id` | UUID FK | E-posta AI ile yazıldıysa |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |

## Email Account / Sender Identity

Bkz. aşağıdaki tablolar — outreach bu hesaplara bağlanır.

### `email_accounts`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `provider` | ENUM | `email_provider` |
| `email_address` | TEXT | |
| `display_name` | TEXT | |
| `status` | ENUM | `email_account_status` |
| `credentials_ref` | TEXT | Vault/secret referansı — DB'de şifre tutulmaz |
| `daily_send_limit` | INTEGER | |
| `sent_today_count` | INTEGER | Sıfırlanan sayaç |
| `last_synced_at` | TIMESTAMPTZ | Inbox sync |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |

### `sender_identities`

Aynı hesaptan farklı gönderen kimlikleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `email_account_id` | UUID FK | |
| `workspace_id` | UUID FK | |
| `from_name` | TEXT | |
| `reply_to_email` | TEXT | |
| `signature_html` | TEXT | |
| `is_default` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

## Kampanya Akışı

```
Campaign oluştur (draft)
    → Sequence adımları tanımla
    → Lead'ler ekle / filtrele
    → AI ile e-posta kişiselleştir
    → Mesajlar scheduled/queued
    → job: outreach_send
    → status: sent → opened → replied
    → reply gelince inbox_thread açılır
```

## Index Önerileri

- `outreach_messages(workspace_id, status, scheduled_at)`
- `outreach_messages(lead_id, created_at DESC)`
- `outreach_messages(provider_message_id)`
- `outreach_campaigns(workspace_id, status)`

## Limitler

Workspace `settings.outreach_daily_limit` ve `email_accounts.daily_send_limit` birlikte kontrol edilir.
Billing `usage_quotas` ile entegre edilir.
