# Leads Şeması

Potansiyel müşteri yönetimi — NexLead'in çekirdek iş verisi.

## `leads`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | Tenant |
| `company_name` | TEXT | Firma adı |
| `contact_name` | TEXT | Yetkili kişi |
| `contact_email` | TEXT | |
| `contact_phone` | TEXT | |
| `industry` | TEXT | Sektör |
| `location` | TEXT | Şehir / ülke |
| `status` | ENUM | `lead_status` |
| `priority` | ENUM | `lead_priority` |
| `score` | INTEGER | 0–100 lead skoru |
| `score_breakdown` | JSONB | Skor bileşenleri |
| `source_type` | ENUM | `lead_source_type` |
| `source_id` | UUID FK | `lead_sources.id` (nullable) |
| `assigned_to` | UUID FK | Sorumlu kullanıcı |
| `notes_summary` | TEXT | AI özet not (opsiyonel) |
| `metadata` | JSONB | Esnek ek alanlar |
| `last_contacted_at` | TIMESTAMPTZ | |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | |

## `lead_sources`

Keşif veya import kaynağı tanımı.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `name` | TEXT | Kaynak adı |
| `type` | ENUM | `lead_source_type` |
| `config` | JSONB | API anahtarı referansı, filtreler |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

## `lead_tags` + `lead_tag_assignments`

| Tablo | Açıklama |
|-------|----------|
| `lead_tags` | Workspace bazlı etiket tanımları |
| `lead_tag_assignments` | `lead_id` + `tag_id` M:N |

## `lead_notes`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `lead_id` | UUID FK | |
| `author_id` | UUID FK | |
| `body` | TEXT | Not içeriği |
| `is_pinned` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

## Lead ↔ Website İlişkisi

```
leads (1) ──► (N) websites
```

- Bir lead'in birden fazla websitesi olabilir.
- Bir website yalnızca bir lead'e bağlı olabilir veya `lead_id = NULL` (manuel audit).
- Primary website: `websites.is_primary = true` (lead başına en fazla bir).

## Lead Skorlama

`score` ve `score_breakdown` audit sonuçlarından türetilir:

| Bileşen | Ağırlık (örnek) |
|---------|-----------------|
| Audit skoru | %40 |
| İletişim bilgisi tamlığı | %20 |
| Sektör uyumu | %15 |
| Website kalitesi | %15 |
| Etkileşim geçmişi | %10 |

Skor güncellemesi `job_runs` veya audit tamamlanma event'i ile tetiklenir.

## Durum Geçişleri

```
new → enriched → qualified → contacted → replied → meeting_scheduled → won
                                              ↘ lost
                                              ↘ archived (herhangi aşamadan)
```

Geçişler uygulama katmanında validate edilir; isteğe bağlı `lead_status_history` tablosu ileride eklenebilir.

## Index Önerileri

- `(workspace_id, status)` — pipeline filtreleme
- `(workspace_id, score DESC)` — fırsat sıralama
- `(workspace_id, assigned_to)` — kullanıcı bazlı liste
- `(workspace_id, company_name)` — arama
- Full-text: `company_name`, `contact_name`, `contact_email`

## Veri Saklama

- `archived` lead'ler 12 ay sonra cold storage'a taşınabilir.
- `won` / `lost` lead'ler silinmez; raporlama için tutulur.
