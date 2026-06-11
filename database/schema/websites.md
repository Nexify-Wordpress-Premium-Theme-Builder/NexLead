# Websites Şeması

Hedef web siteleri ve tarama öncesi metadata.

## `websites`

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `lead_id` | UUID FK | Nullable — manuel audit için boş |
| `url` | TEXT | Orijinal URL |
| `normalized_url` | TEXT | Normalize edilmiş (unique per workspace) |
| `domain` | TEXT | Çıkarılmış domain |
| `title` | TEXT | Sayfa başlığı |
| `description` | TEXT | Meta description |
| `favicon_url` | TEXT | |
| `status` | ENUM | `website_status` |
| `is_primary` | BOOLEAN | Lead'in ana sitesi mi |
| `last_audited_at` | TIMESTAMPTZ | |
| `last_audit_id` | UUID FK | Son audit referansı |
| `metadata` | JSONB | Teknoloji stack, CMS tahmini vb. |
| `created_by` | UUID FK | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | |

**Kısıt:** `(workspace_id, normalized_url)` UNIQUE

## `website_snapshots`

Audit öncesi/sonrası HTML veya yapısal snapshot (büyük içerik storage'da).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `website_id` | UUID FK | |
| `audit_id` | UUID FK | Nullable |
| `storage_path` | TEXT | Supabase Storage yolu |
| `content_hash` | TEXT | Değişiklik tespiti |
| `page_count` | INTEGER | |
| `captured_at` | TIMESTAMPTZ | |

**Not:** Ham HTML DB'de tutulmaz; Storage + referans.

## Lead ↔ Website Senaryoları

| Senaryo | `lead_id` | Açıklama |
|---------|-----------|----------|
| Lead keşfi | Dolu | Keşif sırasında website otomatik eklenir |
| Lead'e site ekleme | Dolu | Kullanıcı ek URL girer |
| Manuel audit | NULL | "Kendi sitemi analiz et" akışı |
| Sonradan lead'e bağlama | Güncellenir | Manuel site lead'e atanabilir |

## Website Yaşam Döngüsü

```
URL girilir / keşfedilir
    → normalize + domain çıkar
    → status: pending
    → audit job tetiklenir
    → audit tamamlanır → last_audited_at güncellenir
    → status: active veya unreachable
```

## Index Önerileri

- `(workspace_id, lead_id)`
- `(workspace_id, domain)`
- `(workspace_id, normalized_url)` UNIQUE
- `(workspace_id, last_audited_at DESC)`

## Ölçeklenebilirlik

- Snapshot dosyaları Storage lifecycle policy ile 90 gün sonra silinebilir.
- `metadata` içindeki sık sorgulanan alanlar (cms, has_ssl) ileride kolonlaştırılabilir.
