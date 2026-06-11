# Pre-Migration Kontrol Listesi

Supabase MCP veya CLI ile migration uygulamadan **önce** tamamlanması gereken kontroller.

## 1. Dokümantasyon Onayı

- [ ] [final-schema.md](./final-schema.md) ekip tarafından review edildi
- [ ] [mvp-scope.md](./mvp-scope.md) MVP / Faz 2 ayrımı onaylandı
- [ ] [migration-order.md](./migration-order.md) sırası onaylandı
- [ ] [enums.md](./enums.md) enum listesi yeterli
- [ ] [indexes.md](./indexes.md) index seti onaylandı
- [ ] [rls-policies.md](./rls-policies.md) policy planı onaylandı
- [ ] [data-retention.md](./data-retention.md) saklama politikası biliniyor

## 2. Supabase Proje Durumu

MCP ile doğrula (`user-supabase`):

- [ ] `list_projects` → NexLead projesi (`mjoeimeabwqsymqczvyd`) erişilebilir
- [ ] `get_project` → status `ACTIVE_HEALTHY`
- [ ] `list_tables` schemas=`["public"]` → boş `[]`
- [ ] `list_migrations` → boş `[]`
- [ ] Yanlış projeye migration uygulanmadığı doğrulandı

## 3. Bağlantı ve Ortam

- [ ] [connection.md](../supabase/connection.md) güncel
- [ ] `.env` dosyaları oluşturuldu (gitignore'da)
- [ ] `SUPABASE_URL` doğru project URL
- [ ] Service role key yalnızca `apps/api/.env` — repoya commit edilmedi
- [ ] Anon key yalnızca `apps/web/.env.local` — repoya commit edilmedi

## 4. Mimari Tutarlılık

- [ ] Tüm iş tablolarında `workspace_id NOT NULL` (report_sections hariç)
- [ ] UUID PK tüm tablolarda
- [ ] `updated_at` trigger planı M001'de
- [ ] Soft delete tabloları belirlendi: workspaces, leads, websites, email_accounts
- [ ] Immutable tablolar belirlendi: completed audits, audit_findings
- [ ] Storage path kolonları büyük içerik için planlandı
- [ ] Credentials DB'de tutulmuyor (`credentials_ref` only)

## 5. FK Bağımlılık Kontrolü

Migration sırasına göre:

- [ ] M002 önce workspaces
- [ ] M003 members → workspaces + auth.users
- [ ] M005 websites → leads (nullable OK)
- [ ] M006 audits → websites
- [ ] M007 reports → audits
- [ ] M008 outreach → leads, email_accounts, reports (nullable)
- [ ] M009 inbox → leads, outreach, email_accounts
- [ ] M013 jobs/ai → workspaces (cross-ref nullable)
- [ ] Circular FK yok (`websites.last_audit_id` → deferred veya sonradan ALTER)

**Not:** `websites.last_audit_id` ve `audits` circular FK — migration'da `last_audit_id` kolonu audits sonrası ALTER ile eklenmeli veya nullable FK constraint sonradan eklenmeli.

## 6. RLS Hazırlığı

- [ ] M014 helper functions planlandı
- [ ] M015 tüm tablolar oluşturulduktan sonra
- [ ] Service role backend'de izole
- [ ] Viewer rolü MVP'de destekleniyor
- [ ] Anon share link policy (audit_reports) karar verildi — MVP'de opsiyonel

## 7. Index Hazırlığı

- [ ] Composite index'lerde `workspace_id` ilk kolon
- [ ] Partial index'ler `deleted_at IS NULL` için planlandı
- [ ] UNIQUE constraint'ler belirlendi (normalized_url, workspace+user, provider_message_id)

## 8. Seed Planı (Migration Sonrası — Bu Adımda Yazılmaz)

- [ ] `plans` tablosu için Starter/Pro seed ayrı dosyada olacak
- [ ] Demo kullanıcı / mock lead **oluşturulmayacak** (production hygiene)

## 9. Rollback ve Güvenlik

- [ ] Remote proje henüz boş — ilk migration düşük risk
- [ ] Migration dosyaları `database/supabase/migrations/` altında version kontrolünde
- [ ] `apply_migration` öncesi lokal test planı var
- [ ] Backup: Supabase free tier daily backup aktif

## 10. MCP Uygulama Adımları (Migration Yazıldıktan Sonra)

Sırayla:

1. `list_tables` — hâlâ boş mu?
2. Lokal test (`supabase db reset` veya push)
3. MCP `apply_migration` — M001 tek tek
4. `list_migrations` — uygulandı mı?
5. `list_tables` — beklenen tablolar
6. `get_advisors` — güvenlik uyarıları
7. `generate_typescript_types` — `@nexlead/types` güncelleme

## 11. Bilinen Açık Noktalar (Migration'da Çözülecek)

| Konu | Karar Bekliyor | Öneri |
|------|----------------|-------|
| `websites.last_audit_id` circular FK | Evet | ALTER after audits table |
| ENUM vs TEXT+CHECK | Evet | PostgreSQL ENUM (M001) |
| `plans` seed | Evet | M012 içinde veya seed.sql |
| Share link anon policy | Evet | MVP'de erteleyebilir |
| Realtime enable | Hayır | Faz 2 |

## Onay

| Rol | İsim | Tarih | Onay |
|-----|------|-------|------|
| Product | | | ☐ |
| Backend | | | ☐ |
| DevOps | | | ☐ |

Tüm kutular işaretlendikten sonra **Migration Step 6** başlatılabilir.
