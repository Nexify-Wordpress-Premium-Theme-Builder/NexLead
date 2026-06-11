# Jobs Şeması

Arka plan iş kuyruğu, çalışma logları ve hata takibi.

## `job_runs`

Tekil job çalışması.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `type` | ENUM | `job_type` |
| `status` | ENUM | `job_status` |
| `priority` | INTEGER | 1 (yüksek) – 10 (düşük) |
| `payload` | JSONB | Job parametreleri |
| `result` | JSONB | Çıktı özeti |
| `error_message` | TEXT | |
| `retry_count` | INTEGER | |
| `max_retries` | INTEGER | Varsayılan 3 |
| `parent_job_id` | UUID FK | Zincirleme job |
| `reference_type` | TEXT | İlgili entity |
| `reference_id` | UUID | |
| `scheduled_at` | TIMESTAMPTZ | |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |

## `job_run_steps`

Çok adımlı job'lar için ara log.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `job_run_id` | UUID FK | |
| `step_name` | TEXT | `crawl`, `analyze`, `score` |
| `status` | ENUM | `job_status` |
| `message` | TEXT | |
| `duration_ms` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |

## Job Türleri ve Payload Örnekleri

### `lead_discovery`
```json
{ "source_id": "uuid", "filters": { "industry": "saas", "city": "Istanbul" } }
```

### `website_audit`
```json
{ "website_id": "uuid", "audit_type": "full" }
```

### `report_generation`
```json
{ "audit_id": "uuid", "template_id": "uuid", "language": "tr" }
```

### `outreach_send`
```json
{ "outreach_message_id": "uuid" }
```

### `inbox_sync`
```json
{ "email_account_id": "uuid", "since": "2026-01-01T00:00:00Z" }
```

## Durum Makinesi

```
pending → running → completed
              ↘ failed → retrying → running
              ↘ cancelled
```

## Entity Bağlantıları

| job_type | Oluşturduğu / Güncellediği |
|----------|---------------------------|
| `website_audit` | `audits` |
| `report_generation` | `audit_reports` |
| `outreach_send` | `outreach_messages` |
| `inbox_sync` | `inbox_messages` |
| `lead_discovery` | `leads` |

## Index Önerileri

- `job_runs(workspace_id, status, scheduled_at)` — kuyruk tüketimi
- `job_runs(type, status, created_at DESC)`
- `job_runs(reference_type, reference_id)`
- `job_run_steps(job_run_id, created_at)`

## Queue Uygulaması

DB tablosu kuyruk olarak kullanılabilir (MVP) veya Redis/BullMQ ile senkron:

| Yaklaşım | MVP | Ölçek |
|----------|-----|-------|
| DB polling (`FOR UPDATE SKIP LOCKED`) | ✓ | Orta |
| Harici queue + DB log | — | Yüksek |

`job_runs` her iki durumda da **source of truth** log tablosu kalır.

## Saklama

- Tamamlanan job'lar 90 gün sonra arşiv.
- Failed job'lar 180 gün tutulur (debug).
