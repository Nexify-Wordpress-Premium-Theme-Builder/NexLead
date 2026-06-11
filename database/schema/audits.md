# Audits Şeması

Web sitesi denetim süreci ve bulgular.

## `audits`

Bir website için tek denetim çalışması.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `website_id` | UUID FK | |
| `lead_id` | UUID FK | Denormalize — sorgu kolaylığı |
| `type` | ENUM | `audit_type` |
| `status` | ENUM | `audit_status` |
| `overall_score` | INTEGER | 0–100 |
| `score_breakdown` | JSONB | Kategori bazlı skorlar |
| `pages_crawled` | INTEGER | |
| `duration_ms` | INTEGER | |
| `error_message` | TEXT | Hata durumunda |
| `job_run_id` | UUID FK | İlgili job |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |

## `audit_scores`

Kategori bazlı skorlar (normalize edilmiş).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `audit_id` | UUID FK | |
| `category` | ENUM | `finding_category` |
| `score` | INTEGER | 0–100 |
| `weight` | DECIMAL | Ağırlık katsayısı |

## `audit_findings`

Tekil bulgu kayıtları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `audit_id` | UUID FK | |
| `category` | ENUM | `finding_category` |
| `severity` | ENUM | `finding_severity` |
| `title` | TEXT | Kısa başlık |
| `description` | TEXT | Detaylı açıklama |
| `recommendation` | TEXT | Önerilen çözüm |
| `affected_url` | TEXT | İlgili sayfa |
| `evidence` | JSONB | Screenshot URL, metrik değerleri |
| `is_resolved` | BOOLEAN | Müşteri çözdü mü (ileride) |
| `created_at` | TIMESTAMPTZ | |

## Audit Veri Modeli Diyagramı

```
websites (1) ──► (N) audits
audits (1) ──► (N) audit_scores
audits (1) ──► (N) audit_findings
audits (1) ──► (N) audit_reports
audits (1) ──► (1) website_snapshots (opsiyonel)
```

## Skor Hesaplama

`overall_score` = kategori skorlarının ağırlıklı ortalaması.

Örnek ağırlıklar:

| Kategori | Ağırlık |
|----------|---------|
| performance | 25% |
| seo | 25% |
| accessibility | 15% |
| security | 20% |
| ux | 10% |
| content | 5% |

## Job Entegrasyonu

Audit başlatma → `job_runs` (type: `website_audit`) oluşturulur → worker tamamlayınca `audits.status = completed` → notification tetiklenir.

## Index Önerileri

- `(workspace_id, website_id, created_at DESC)`
- `(workspace_id, status)`
- `audit_findings(audit_id, severity)`
- `audit_findings(workspace_id, category)`

## Immutable Kural

Tamamlanmış audit kayıtları güncellenmez; yeniden tarama yeni `audits` satırı oluşturur. Bu sayede rapor geçmişi korunur.
