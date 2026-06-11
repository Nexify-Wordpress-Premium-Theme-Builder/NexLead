# Notifications Şeması

Uygulama içi ve çok kanallı bildirim sistemi.

## `notifications`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `user_id` | UUID FK | Hedef kullanıcı |
| `type` | ENUM | `notification_type` |
| `title` | TEXT | |
| `body` | TEXT | |
| `action_url` | TEXT | Tıklanınca gidilecek route |
| `reference_type` | TEXT | `lead`, `audit`, `inbox_thread` |
| `reference_id` | UUID | |
| `is_read` | BOOLEAN | |
| `read_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

## `notification_preferences`

Kullanıcı bazlı kanal tercihleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `workspace_id` | UUID FK | |
| `notification_type` | ENUM | |
| `channel` | ENUM | `notification_channel` |
| `is_enabled` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Kısıt:** `(user_id, workspace_id, notification_type, channel)` UNIQUE

## `notification_deliveries` (email/push log)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `notification_id` | UUID FK | |
| `channel` | ENUM | |
| `status` | TEXT | `pending`, `sent`, `failed` |
| `sent_at` | TIMESTAMPTZ | |
| `error_message` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

## Tetikleyici Olaylar

| Olay | notification_type |
|------|-------------------|
| Lead atandı | `lead_assigned` |
| Audit tamamlandı | `audit_completed` |
| Inbox cevabı | `reply_received` |
| Toplantı 24h kala | `meeting_reminder` |
| Kota %80 doldu | `billing_alert` |

## Realtime (ileride)

Supabase Realtime `notifications` tablosunda `user_id` filtresi ile dinlenir.

## Index Önerileri

- `notifications(user_id, is_read, created_at DESC)`
- `notifications(workspace_id, created_at DESC)`
- `notification_preferences(user_id, workspace_id)`

## Saklama

- Okunmuş bildirimler 90 gün sonra silinebilir.
- `notification_deliveries` 30 gün retention.
