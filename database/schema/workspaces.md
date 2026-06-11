# Workspaces Şeması

Multi-tenant izolasyonun kök entity'si.

## `workspaces`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `name` | TEXT | Workspace / şirket adı |
| `slug` | TEXT UNIQUE | URL-friendly tanımlayıcı |
| `logo_url` | TEXT | |
| `industry` | TEXT | Sektör (opsiyonel) |
| `settings` | JSONB | Workspace genel ayarları |
| `plan_id` | UUID FK | Aktif plan referansı |
| `subscription_id` | UUID FK | Aktif abonelik |
| `status` | TEXT | `active`, `suspended`, `closed` |
| `created_by` | UUID FK | İlk owner |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | Soft delete |

### `settings` JSONB örnek yapısı

```json
{
  "default_locale": "tr",
  "lead_scoring_enabled": true,
  "audit_auto_run": false,
  "outreach_daily_limit": 50
}
```

**Kural:** Sık sorgulanan ayarlar ileride ayrı kolonlara çıkarılabilir.

## Multi-Tenant Stratejisi

| Yaklaşım | NexLead Kararı |
|----------|----------------|
| Database per tenant | Hayır — operasyonel maliyet yüksek |
| Schema per tenant | Hayır |
| Shared DB + `workspace_id` | **Evet** |
| RLS ile satır izolasyonu | **Evet** |

Her iş tablosu `workspace_id` taşır. API katmanı da workspace context doğrular (defense in depth).

## Workspace Yaşam Döngüsü

```
Oluşturma (owner kayıt)
    → trial subscription atanır
    → varsayılan ayarlar
    → kullanım başlar
    → plan yükseltme / downgrade
    → iptal veya suspension
    → soft delete (veri retention politikasına göre arşiv)
```

## İlişkili Tablolar

Bir workspace şunlara sahiptir:

- `workspace_members`
- `leads`, `websites`, `audits`, `audit_reports`
- `outreach_campaigns`, `email_accounts`
- `inbox_threads`, `meetings`
- `subscriptions`, `usage_quotas`
- `ai_usage_logs`, `job_runs`
- `notifications`

## Slug Kuralları

- Küçük harf, tire ile ayrılmış
- Global unique (tüm sistemde)
- Değiştirilebilir ama nadiren; eski slug redirect tablosu ileride eklenebilir

## Index Önerileri

- `workspaces(slug)` UNIQUE
- `workspaces(status)` WHERE `deleted_at IS NULL`

## Ölçeklenebilirlik

- Workspace sayısı arttıkça billing ve usage tabloları partition adayıdır.
- Workspace kapatıldığında veriler hemen silinmez; [data-retention.md](./data-retention.md) politikası uygulanır.
