# Inbox Şeması

Gelen e-posta ve cevap takibi — outreach'in devamı.

## `inbox_threads`

Konuşma thread'i — bir lead veya outreach mesajı etrafında gruplanır.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `lead_id` | UUID FK | |
| `outreach_message_id` | UUID FK | İlk tetikleyen gönderim (nullable) |
| `email_account_id` | UUID FK | Hangi hesaptan sync |
| `subject` | TEXT | Thread konusu |
| `status` | ENUM | `inbox_thread_status` |
| `last_message_at` | TIMESTAMPTZ | |
| `unread_count` | INTEGER | Denormalize sayaç |
| `assigned_to` | UUID FK | Sorumlu kullanıcı |
| `snoozed_until` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

## `inbox_messages`

Thread içindeki tekil mesajlar.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `thread_id` | UUID FK | |
| `direction` | ENUM | `inbox_message_direction` |
| `from_email` | TEXT | |
| `to_email` | TEXT | |
| `subject` | TEXT | |
| `body_html` | TEXT | |
| `body_text` | TEXT | |
| `provider_message_id` | TEXT | IMAP/Resend ID |
| `in_reply_to` | TEXT | RFC Message-ID |
| `is_read` | BOOLEAN | |
| `sentiment` | TEXT | AI sınıflandırma: positive, neutral, negative |
| `ai_summary` | TEXT | Kısa özet |
| `ai_usage_log_id` | UUID FK | |
| `received_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

## Reply Tracking Akışı

```
outreach_message gönderildi
    → provider webhook / inbox_sync job
    → inbox_thread oluştur veya mevcut thread'e ekle
    → inbox_message (inbound)
    → AI: sentiment + summary
    → lead.status = replied
    → notification: reply_received
    → outreach_message.replied_at güncelle
```

## Thread Birleştirme Kuralları

- Aynı `lead_id` + benzer `subject` + aynı `email_account` → mevcut thread'e ekle.
- `in_reply_to` header ile kesin eşleşme tercih edilir.

## Index Önerileri

- `inbox_threads(workspace_id, status, last_message_at DESC)`
- `inbox_threads(workspace_id, assigned_to, unread_count)`
- `inbox_messages(thread_id, received_at)`
- `inbox_messages(provider_message_id)` UNIQUE

## Sync Stratejisi

- `job_runs` (type: `inbox_sync`) periyodik çalışır.
- `email_accounts.last_synced_at` güncellenir.
- Webhook destekleyen provider'larda anlık sync.

## Ölçeklenebilirlik

- Eski thread'ler `closed` + 6 ay sonra arşiv.
- `body_html` büyükse Storage'a taşınabilir; DB'de özet tutulur.
