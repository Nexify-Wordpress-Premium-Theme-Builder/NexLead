# Veritabanı Mimarisi

NexLead veri katmanı — PostgreSQL + Supabase.

## Teknoloji Seçimi

| Bileşen | Seçim | Gerekçe |
|---------|-------|---------|
| Veritabanı | PostgreSQL 17 | İlişkisel veri, JSONB, full-text |
| Platform | Supabase | Auth, RLS, Storage, Realtime |
| ORM (ileride) | TBD | Drizzle veya Prisma — migration sonrası |
| Object storage | Supabase Storage | Snapshot, PDF, büyük HTML |

## Remote Supabase Projesi

| Alan | Değer |
|------|-------|
| Proje | NexLead |
| Project ref | `mjoeimeabwqsymqczvyd` |
| Region | `ap-southeast-2` |
| Durum | `ACTIVE_HEALTHY` |
| `public` tablolar | Henüz yok |
| Migration | Henüz uygulanmadı |

Bağlantı detayları: [database/supabase/connection.md](../../database/supabase/connection.md)

## Mimari Diyagram

```
┌─────────────────────────────────────────────────────────┐
│                     Supabase                            │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ auth     │  │ public       │  │ storage         │  │
│  │ .users   │  │ (app tables) │  │ (snapshots,     │  │
│  │          │  │ + RLS        │  │  reports)       │  │
│  └────┬─────┘  └──────┬───────┘  └─────────────────┘  │
└───────┼───────────────┼────────────────────────────────┘
        │               │
   Frontend          Backend API
   (anon key)       (service role)
        │               │
        └───────┬───────┘
                │
         workspace_id context
```

## Tenant Modeli

Tüm iş verisi `workspace_id` ile scope'lanır. Detay: [multi-tenant.md](./multi-tenant.md)

## Domain Modülleri

| Sıra | Modül | Doküman |
|------|-------|---------|
| 1 | Overview & ER | [database/schema/overview.md](../../database/schema/overview.md) |
| 2 | Auth & Users | [auth.md](../../database/schema/auth.md), [users.md](../../database/schema/users.md) |
| 3 | Workspaces | [workspaces.md](../../database/schema/workspaces.md) |
| 4 | Leads & Websites | [leads.md](../../database/schema/leads.md), [websites.md](../../database/schema/websites.md) |
| 5 | Audits & Reports | [audits.md](../../database/schema/audits.md), [reports.md](../../database/schema/reports.md) |
| 6 | Outreach & Inbox | [outreach.md](../../database/schema/outreach.md), [inbox.md](../../database/schema/inbox.md) |
| 7 | Meetings | [meetings.md](../../database/schema/meetings.md) |
| 8 | Notifications | [notifications.md](../../database/schema/notifications.md) |
| 9 | Billing | [billing.md](../../database/schema/billing.md) |
| 10 | AI & Jobs | [ai-usage.md](../../database/schema/ai-usage.md), [jobs.md](../../database/schema/jobs.md) |

## Cross-Cutting Concerns

| Konu | Doküman |
|------|---------|
| Enum tanımları | [enums.md](../../database/schema/enums.md) |
| Index stratejisi | [indexes.md](../../database/schema/indexes.md) |
| RLS politikaları | [rls-policies.md](../../database/schema/rls-policies.md) |
| Veri saklama | [data-retention.md](../../database/schema/data-retention.md) |

## Veri Akışı Özeti

```
Lead Discovery ──► leads
    └── websites ──► audits ──► audit_findings
                        └── audit_reports
                                └── outreach_messages
                                        └── inbox_threads
                                                └── meetings
```

Her adımda `job_runs` loglanır; AI operasyonları `ai_usage_logs` ile takip edilir.

## API ↔ DB Sınırı

| Katman | Sorumluluk |
|--------|------------|
| Frontend | Supabase client (RLS korumalı), anon key |
| Backend API | Service role, job processing, webhook |
| Edge Functions | Auth trigger, hafif işlemler (opsiyonel) |

Frontend doğrudan DB'ye erişebilir (RLS ile); karmaşık iş mantığı backend'den geçer.

## Schema Finalization (Step 5)

Migration öncesi final plan onaylandı:

- **MVP:** 24 tablo — [final-schema.md](../../database/schema/final-schema.md)
- **Faz 2:** 14 tablo — [mvp-scope.md](../../database/schema/mvp-scope.md)
- **Migration sırası:** M001–M016 — [migration-order.md](../../database/schema/migration-order.md)
- **Ön kontrol:** [pre-migration-checklist.md](../../database/schema/pre-migration-checklist.md)

## Migration Yol Haritası (Step 6)

1. M001 — extensions + enums
2. M002–M003 — workspace + membership
3. M004–M007 — leads → websites → audits → reports
4. M008–M010 — outreach → inbox → meetings
5. M011–M013 — notifications → billing → jobs/ai
6. M014–M016 — RLS helpers → policies → indexes

## Ölçeklenebilirlik

| Eşik | Aksiyon |
|------|---------|
| 1M+ lead | Read replica, search index |
| 10M+ ai_usage_logs | Partition by month |
| Yüksek job hacmi | Harici queue (Redis) + DB log |
| Multi-region | Read replica, CDN for Storage |

Detaylı notlar: [database/schema/overview.md](../../database/schema/overview.md)
