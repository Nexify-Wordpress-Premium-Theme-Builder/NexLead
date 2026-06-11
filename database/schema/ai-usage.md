# AI Usage Şeması

AI operasyonlarının loglanması, maliyet takibi ve billing entegrasyonu.

## `ai_usage_logs`

Her AI API çağrısı için kayıt.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `user_id` | UUID FK | Tetikleyen kullanıcı (nullable — job) |
| `operation_type` | ENUM | `ai_operation_type` |
| `model` | TEXT | `gpt-4o`, `claude-3-5-sonnet` |
| `provider` | TEXT | `openai`, `anthropic` |
| `input_tokens` | INTEGER | |
| `output_tokens` | INTEGER | |
| `total_tokens` | INTEGER | |
| `estimated_cost_cents` | INTEGER | |
| `latency_ms` | INTEGER | |
| `reference_type` | TEXT | `lead`, `audit`, `report`, `outreach_message` |
| `reference_id` | UUID | |
| `job_run_id` | UUID FK | |
| `status` | TEXT | `success`, `failed` |
| `error_message` | TEXT | |
| `metadata` | JSONB | Prompt versiyonu, cache hit vb. |
| `created_at` | TIMESTAMPTZ | |

**Not:** Prompt içeriği ve PII DB'de saklanmaz; yalnızca referans ve token metrikleri.

## `ai_prompt_templates`

Workspace veya sistem düzeyinde prompt şablonları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | NULL = global şablon |
| `operation_type` | ENUM | |
| `name` | TEXT | |
| `version` | INTEGER | |
| `system_prompt` | TEXT | |
| `user_prompt_template` | TEXT | Merge field'lar: `{{company_name}}` |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

## Operasyon ↔ Tablo Eşlemesi

| operation_type | Tetikleyen | reference_type |
|----------------|------------|----------------|
| `lead_enrichment` | lead_discovery job | `lead` |
| `audit_analysis` | website_audit job | `audit` |
| `report_generation` | report_generation job | `audit_report` |
| `email_compose` | outreach flow | `outreach_message` |
| `reply_classification` | inbox_sync job | `inbox_message` |

## Billing Entegrasyonu

Her başarılı log → `usage_quotas.ai_tokens_used` artırılır.

Kota kontrolü AI çağrısı **öncesi** yapılır.

## Index Önerileri

- `ai_usage_logs(workspace_id, created_at DESC)`
- `ai_usage_logs(workspace_id, operation_type, created_at)`
- `ai_usage_logs(reference_type, reference_id)`

## Ölçeklenebilirlik

- Yüksek hacimde aylık partition (`created_at`).
- Aggregated günlük özet tablosu `ai_usage_daily` ileride eklenebilir.
- Ham log 12 ay saklanır; özet kalıcı.

## Gizlilik

- GDPR: log retention [data-retention.md](./data-retention.md) ile uyumlu.
- Müşteri verisi prompt'ta minimize edilir (yalnızca gerekli alanlar).
