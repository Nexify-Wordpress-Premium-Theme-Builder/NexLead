# Meetings Şeması

Randevu ve toplantı planlama.

## `meetings`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `lead_id` | UUID FK | |
| `title` | TEXT | |
| `description` | TEXT | |
| `status` | ENUM | `meeting_status` |
| `scheduled_start` | TIMESTAMPTZ | |
| `scheduled_end` | TIMESTAMPTZ | |
| `timezone` | TEXT | |
| `location` | TEXT | Zoom link, adres |
| `meeting_url` | TEXT | Video konferans |
| `calendar_event_id` | TEXT | Google/Outlook referansı |
| `outreach_message_id` | UUID FK | Hangi e-postadan türedi |
| `audit_report_id` | UUID FK | Toplantı brief'i için |
| `brief` | TEXT | AI toplantı özeti |
| `notes` | TEXT | Toplantı sonrası notlar |
| `assigned_to` | UUID FK | Sorumlu satışçı |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

## `meeting_participants`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `meeting_id` | UUID FK | |
| `workspace_id` | UUID FK | |
| `participant_type` | TEXT | `user`, `lead_contact`, `external` |
| `user_id` | UUID FK | Dahili kullanıcı |
| `name` | TEXT | Harici katılımcı |
| `email` | TEXT | |
| `response_status` | TEXT | `accepted`, `declined`, `tentative` |
| `created_at` | TIMESTAMPTZ | |

## Lead Pipeline Entegrasyonu

```
inbox'ta olumlu cevap
    → meeting oluştur (scheduled)
    → lead.status = meeting_scheduled
    → notification: meeting_reminder (24h, 1h önce)
    → meeting tamamlanır → lead.status = won veya qualified
```

## Calendar Entegrasyonu (ileride)

- `calendar_event_id` Google Calendar API ile senkron.
- İptal/yeniden planlama iki yönlü sync.

## Index Önerileri

- `meetings(workspace_id, scheduled_start)`
- `meetings(workspace_id, assigned_to, status)`
- `meetings(lead_id)`

## Brief Üretimi

Toplantı oluşturulurken `audit_report_id` varsa AI brief üretilir → `ai_usage_logs` kaydı.
