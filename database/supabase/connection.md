# Supabase Bağlantı Notları

NexLead remote Supabase projesinin Cursor MCP üzerinden doğrulanmış bağlantı kaydı.

**Doğrulama tarihi:** 2026-06-08  
**Doğrulama yöntemi:** Cursor `user-supabase` MCP (`list_projects`, `get_project`, `list_tables`, `list_migrations`)

---

## MCP Bağlantı Durumu

| Kontrol | Sonuç |
|---------|-------|
| Supabase MCP aktif | ✓ (`user-supabase` authenticated) |
| Proje listesi okunabiliyor | ✓ |
| NexLead projesi bulundu | ✓ (hesapta tek proje) |
| Proje metadata okunabiliyor | ✓ |
| `public` şemasında özel tablo | ✗ (boş) |
| Migration kaydı | ✗ (boş) |
| Edge Function | ✗ (boş) |

---

## Proje Kimliği

| Alan | Değer |
|------|-------|
| **project_name** | NexLead |
| **project_id** | `mjoeimeabwqsymqczvyd` |
| **project_ref** | `mjoeimeabwqsymqczvyd` |
| **region** | `ap-southeast-2` (Sydney, Avustralya) |
| **status** | `ACTIVE_HEALTHY` |
| **created_at** | `2026-06-08T08:55:19Z` |

## Organizasyon

| Alan | Değer |
|------|-------|
| **organization_id** | `aoczkcqrahzqlsnqhdsc` |
| **organization_name** | Samet Karaman |
| **plan** | free |

## Veritabanı

| Alan | Değer |
|------|-------|
| **database_host** | `db.mjoeimeabwqsymqczvyd.supabase.co` |
| **postgres_engine** | 17 |
| **postgres_version** | 17.6.1.127 |
| **release_channel** | ga |

## API Endpoint

| Alan | Değer |
|------|-------|
| **project_url** | `https://mjoeimeabwqsymqczvyd.supabase.co` |

> **Not:** Publishable (anon) key ve service role key bu dosyaya yazılmaz. Gerekli olduğunda Supabase Dashboard veya MCP `get_publishable_keys` aracı kullanılır. Service role yalnızca backend ortam değişkenlerinde tutulur.

---

## Şema Durumu (Doğrulama Anı)

| Kaynak | Durum |
|--------|-------|
| `public` tablolar | Yok (`[]`) |
| Supabase migrations | Yok (`[]`) |
| Edge functions | Yok (`[]`) |
| `database/supabase/migrations/` (lokal) | Boş (`.gitkeep` only) |

Bu durum Step 3 database planlama dokümantasyonu ile uyumludur — henüz şema uygulanmamıştır.

---

## Ortam Değişkenleri (şablon)

Lokal geliştirme için `.env` dosyalarına **secret olmayan** URL eklenebilir; key'ler boş bırakılır:

```env
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://mjoeimeabwqsymqczvyd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# apps/api/.env
SUPABASE_URL=https://mjoeimeabwqsymqczvyd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
```

Key değerleri: [Supabase Dashboard → Project Settings → API](https://supabase.com/dashboard/project/mjoeimeabwqsymqczvyd/settings/api)

---

## MCP ile Kullanılabilir Araçlar (Sonraki Adımlar)

Migration yönetimi için hazır MCP araçları:

| Araç | Amaç |
|------|------|
| `list_tables` | Şema durumunu kontrol |
| `list_migrations` | Uygulanan migration'ları listele |
| `apply_migration` | Remote'a migration uygula (Step 5+) |
| `execute_sql` | Read-only sorgular / debug |
| `generate_typescript_types` | `@nexlead/types` için tip üretimi |
| `get_advisors` | Güvenlik ve performans önerileri |
| `list_branches` | Branching (ileride) |

---

## Proje Seçimi

Hesapta yalnızca **1 proje** bulunmaktadır (`NexLead`). Çoklu proje senaryosunda seçim kriterleri:

1. `name` = NexLead
2. En güncel `created_at`
3. `status` = ACTIVE_HEALTHY

**Aktif project_id:** `mjoeimeabwqsymqczvyd`

---

## Dashboard Linkleri

- [Proje Overview](https://supabase.com/dashboard/project/mjoeimeabwqsymqczvyd)
- [Database](https://supabase.com/dashboard/project/mjoeimeabwqsymqczvyd/database/tables)
- [SQL Editor](https://supabase.com/dashboard/project/mjoeimeabwqsymqczvyd/sql)
- [API Settings](https://supabase.com/dashboard/project/mjoeimeabwqsymqczvyd/settings/api)

---

## Sonraki Adım (Step 5)

1. `database/schema/` planına göre ilk migration setini `database/supabase/migrations/` altında yaz
2. MCP `apply_migration` veya Supabase CLI ile remote'a uygula
3. RLS policy'leri `database/supabase/policies/` altında dokümante et ve migration'a dahil et
4. `generate_typescript_types` ile paylaşılan tipleri güncelle
