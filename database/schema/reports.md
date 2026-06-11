# Reports Şeması

Kişiselleştirilmiş denetim raporları — audit çıktısının sunulabilir formatı.

## `audit_reports`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `audit_id` | UUID FK | Kaynak audit |
| `lead_id` | UUID FK | Denormalize |
| `website_id` | UUID FK | Denormalize |
| `title` | TEXT | Rapor başlığı |
| `status` | ENUM | `report_status` |
| `format` | ENUM | `report_format` |
| `language` | TEXT | `tr`, `en` |
| `template_id` | UUID FK | Kullanılan şablon |
| `summary` | TEXT | Yönetici özeti (AI) |
| `content_storage_path` | TEXT | Tam içerik (Storage) |
| `pdf_storage_path` | TEXT | PDF versiyonu |
| `share_token` | TEXT | Paylaşım linki (hash) |
| `share_expires_at` | TIMESTAMPTZ | |
| `generated_by_ai` | BOOLEAN | |
| `ai_usage_log_id` | UUID FK | |
| `job_run_id` | UUID FK | |
| `sent_at` | TIMESTAMPTZ | Outreach ile gönderildiyse |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

## `report_sections`

Raporun bölümleri — yapılandırılmış içerik.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `report_id` | UUID FK | |
| `order_index` | INTEGER | Sıralama |
| `section_type` | TEXT | `executive_summary`, `findings`, `recommendations`, `cta` |
| `title` | TEXT | |
| `body` | TEXT | Markdown / HTML |
| `metadata` | JSONB | Grafik referansları |
| `created_at` | TIMESTAMPTZ | |

## `report_templates` (workspace veya global)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | NULL = sistem şablonu |
| `name` | TEXT | |
| `structure` | JSONB | Bölüm tanımları |
| `is_default` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

## Audit ↔ Report İlişkisi

- Bir audit'ten birden fazla report üretilebilir (farklı dil, format, şablon).
- Report oluşturulduktan sonra audit findings değişse bile report **immutable** kalır.
- Snapshot: report oluşturulurken `audit_id` ve ilgili `audit_findings` ID listesi `metadata`'da saklanabilir.

## Üretim Akışı

```
audit.status = completed
    → job: report_generation
    → AI: summary + section bodies
    → audit_reports.status = ready
    → Storage'a HTML/PDF yaz
    → notification: audit_completed
```

## Index Önerileri

- `(workspace_id, lead_id, created_at DESC)`
- `(workspace_id, audit_id)`
- `(share_token)` WHERE share_token IS NOT NULL

## Saklama

- PDF/HTML dosyaları Storage'da; DB'de yalnızca path.
- Paylaşım linki süresi dolunca `share_token` null yapılır; dosya retention politikasına göre silinir.
