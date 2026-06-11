# Database

NexLead veritabanı mimarisi — PostgreSQL + Supabase.

## Amaç

Bu klasör, NexLead'in multi-tenant SaaS veri modelini tanımlar. **Migration ve SQL bu adımda yazılmaz**; sadece planlama ve uygulama rehberi sunulur.

## Klasör Yapısı

| Klasör / Dosya | Açıklama |
|----------------|----------|
| `schema/overview.md` | Genel mimari, ER diyagramı, modül haritası |
| `schema/*.md` | Domain bazlı tablo ve ilişki planları |
| `schema/enums.md` | Tüm status ve type enum tanımları |
| `schema/indexes.md` | Index stratejisi |
| `schema/rls-policies.md` | Supabase RLS policy planı |
| `schema/data-retention.md` | Silme, arşivleme ve saklama politikaları |
| `supabase/` | Migration, seed, policy ve function dosyaları |
| `supabase/connection.md` | Remote Supabase MCP bağlantı kaydı |

## Remote Supabase

Proje MCP ile doğrulandı → [supabase/connection.md](./supabase/connection.md)  
Project ref: `mjoeimeabwqsymqczvyd` · Region: `ap-southeast-2` · Şema: boş

## Temel İlkeler

1. **Tenant sınırı:** `workspace_id` — tüm iş verisi workspace kapsamında izole edilir.
2. **Kimlik:** Supabase Auth (`auth.users`) + `profiles` + `workspace_members`.
3. **Soft delete:** Kritik iş verilerinde `deleted_at` tercih edilir; fiziksel silme sınırlı kullanılır.
4. **Audit trail:** AI kullanımı, job çalışmaları ve kritik durum geçişleri loglanır.
5. **Ölçeklenebilirlik:** JSONB yalnızca esnek/tekil metadata için; sorgulanan alanlar ayrı kolonlarda tutulur.

## Okuma Sırası

### Migration öncesi (Step 5 — güncel)
1. [schema/final-schema.md](./schema/final-schema.md) — **ana referans**
2. [schema/mvp-scope.md](./schema/mvp-scope.md)
3. [schema/migration-order.md](./schema/migration-order.md)
4. [schema/pre-migration-checklist.md](./schema/pre-migration-checklist.md)

### Domain detayları (Step 3)
1. [schema/overview.md](./schema/overview.md)
2. [schema/workspaces.md](./schema/workspaces.md) + [schema/users.md](./schema/users.md)
3. Domain modülleri (leads → websites → audits → reports → outreach → inbox → meetings)
4. [schema/enums.md](./schema/enums.md) + [schema/indexes.md](./schema/indexes.md)
5. [schema/rls-policies.md](./schema/rls-policies.md) + [schema/data-retention.md](./schema/data-retention.md)

## İlgili Dokümanlar

- [docs/architecture/database.md](../docs/architecture/database.md)
- [docs/architecture/multi-tenant.md](../docs/architecture/multi-tenant.md)
