# Billing Şeması

SaaS abonelik, plan ve kullanım kotası yapısı.

## `plans`

Sistem geneli plan tanımları (workspace'e özel değil).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `name` | TEXT | Starter, Pro, Agency |
| `slug` | TEXT UNIQUE | |
| `description` | TEXT | |
| `interval` | ENUM | `plan_interval` |
| `price_cents` | INTEGER | |
| `currency` | TEXT | `TRY`, `USD` |
| `features` | JSONB | Özellik bayrakları |
| `limits` | JSONB | Kota tanımları |
| `is_active` | BOOLEAN | |
| `sort_order` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |

### `limits` JSONB örneği

```json
{
  "max_leads": 500,
  "max_audits_per_month": 100,
  "max_outreach_per_month": 1000,
  "max_team_members": 3,
  "max_email_accounts": 1,
  "ai_credits_per_month": 5000
}
```

## `subscriptions`

Workspace başına aktif abonelik.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK UNIQUE | Aktif abonelik |
| `plan_id` | UUID FK | |
| `status` | ENUM | `subscription_status` |
| `provider` | TEXT | `stripe`, `iyzico` (ileride) |
| `provider_subscription_id` | TEXT | |
| `trial_ends_at` | TIMESTAMPTZ | |
| `current_period_start` | TIMESTAMPTZ | |
| `current_period_end` | TIMESTAMPTZ | |
| `cancelled_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

## `usage_quotas`

Dönemsel kullanım sayaçları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `subscription_id` | UUID FK | |
| `period_start` | TIMESTAMPTZ | |
| `period_end` | TIMESTAMPTZ | |
| `leads_count` | INTEGER | |
| `audits_count` | INTEGER | |
| `outreach_sent_count` | INTEGER | |
| `ai_tokens_used` | BIGINT | |
| `updated_at` | TIMESTAMPTZ | |

**Kısıt:** `(workspace_id, period_start)` UNIQUE

## `usage_events` (opsiyonel, detaylı faturalama)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `event_type` | TEXT | `audit`, `outreach`, `ai_tokens` |
| `quantity` | INTEGER | |
| `reference_id` | UUID | İlgili kayıt |
| `created_at` | TIMESTAMPTZ | |

## Billing ↔ Feature Entegrasyonu

| İşlem | Kota Kontrolü |
|-------|---------------|
| Audit başlat | `audits_count < limits.max_audits_per_month` |
| Outreach gönder | `outreach_sent_count < limits.max_outreach_per_month` |
| AI çağrısı | `ai_tokens_used < limits.ai_credits_per_month` |
| Üye davet | `team_members < limits.max_team_members` |

Kota aşımında işlem reddedilir veya `billing_alert` notification gönderilir.

## Workspace Plan Yaşam Döngüsü

```
Workspace oluştur → trial subscription
    → 14 gün trial
    → ödeme → active
    → yenileme / upgrade
    → iptal → cancelled (dönem sonuna kadar erişim)
    → past_due → suspended
```

## Index Önerileri

- `subscriptions(workspace_id)` UNIQUE
- `subscriptions(status, current_period_end)`
- `usage_quotas(workspace_id, period_start)`

## Notlar

- Ödeme detayları (kart) DB'de tutulmaz; payment provider'da kalır.
- Fatura PDF'leri ileride `invoices` tablosu ile eklenebilir.
