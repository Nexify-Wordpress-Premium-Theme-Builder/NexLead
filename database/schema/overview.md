# Database Overview

NexLead core SaaS veri modelinin üst düzey görünümü.

## Mimari Özet

NexLead, **workspace-scoped multi-tenant** bir PostgreSQL veritabanı kullanır. Her müşteri organizasyonu bir `workspace` olarak temsil edilir; kullanıcılar `workspace_members` üzerinden workspace'lere bağlanır.

```
auth.users (Supabase)
    └── profiles
    └── workspace_members ──► workspaces
                                    ├── leads ──► websites
                                    ├── audits ──► audit_reports
                                    ├── outreach_campaigns ──► outreach_messages
                                    ├── email_accounts
                                    ├── inbox_threads ──► inbox_messages
                                    ├── meetings
                                    ├── notifications
                                    ├── subscriptions / usage_records
                                    ├── ai_usage_logs
                                    └── job_runs
```

## Modül Haritası

| Modül | Ana Tablolar | Tenant Key |
|-------|--------------|------------|
| Auth & Users | `profiles` | `user_id` (global) |
| Workspaces | `workspaces`, `workspace_members`, `workspace_invites` | `workspace_id` |
| Leads | `leads`, `lead_sources`, `lead_tags`, `lead_notes` | `workspace_id` |
| Websites | `websites`, `website_snapshots` | `workspace_id` |
| Audits | `audits`, `audit_findings`, `audit_scores` | `workspace_id` |
| Reports | `audit_reports`, `report_sections` | `workspace_id` |
| Outreach | `outreach_campaigns`, `outreach_sequences`, `outreach_messages` | `workspace_id` |
| Email | `email_accounts`, `sender_identities` | `workspace_id` |
| Inbox | `inbox_threads`, `inbox_messages` | `workspace_id` |
| Meetings | `meetings`, `meeting_participants` | `workspace_id` |
| Notifications | `notifications`, `notification_preferences` | `workspace_id` / `user_id` |
| Billing | `plans`, `subscriptions`, `subscription_items`, `usage_quotas` | `workspace_id` |
| AI | `ai_usage_logs`, `ai_prompt_templates` | `workspace_id` |
| Jobs | `job_runs`, `job_run_steps` | `workspace_id` |

## İlişki Kuralları

### 1. Workspace izolasyonu
Tüm iş tablolarında `workspace_id NOT NULL` zorunludur. Cross-workspace join yasaktır.

### 2. Lead ↔ Website
- Bir lead birden fazla website'e sahip olabilir (ör. ana site + landing page).
- Manuel audit için website, lead'siz de oluşturulabilir (`lead_id` nullable).
- Website URL normalize edilir (`normalized_url` unique per workspace).

### 3. Audit ↔ Report
- Bir audit birden fazla report üretebilir (farklı şablonlar / diller / versiyonlar).
- Report, audit snapshot'ına referans verir; audit güncellense bile rapor immutable kalır.

### 4. Outreach ↔ Inbox
- `outreach_messages` gönderim kaydıdır.
- Gelen cevaplar `inbox_messages` üzerinden thread bazlı takip edilir.
- Thread, `lead_id` ve/veya `outreach_message_id` ile ilişkilendirilir.

### 5. Meeting ↔ Lead
- Toplantılar bir lead'e bağlıdır; isteğe bağlı olarak audit veya outreach context'i taşır.

## Veri Akışı (Happy Path)

```
Lead Discovery → Lead oluştur
    → Website ekle / keşfet
    → Audit job tetikle
    → Audit tamamlanır → Skor + findings
    → Report üret (AI)
    → Outreach campaign / sequence
    → Email gönder
    → Inbox'ta cevap takibi
    → Meeting planla
```

## ID ve Zaman Damgaları

Tüm tablolarda standart kolonlar:

| Kolon | Açıklama |
|-------|----------|
| `id` | UUID v4, primary key |
| `workspace_id` | Tenant FK (auth tabloları hariç) |
| `created_at` | Kayıt oluşturma |
| `updated_at` | Son güncelleme (trigger ile) |
| `deleted_at` | Soft delete (uygun tablolarda) |
| `created_by` | İşlemi yapan kullanıcı (opsiyonel) |

## Supabase Entegrasyonu

| Katman | Kullanım |
|--------|----------|
| `auth.users` | Kayıt, giriş, OAuth |
| `public.*` | Uygulama tabloları |
| RLS | Workspace üyeliği bazlı erişim |
| Service role | Backend job'lar, webhook'lar |
| Realtime | Inbox ve notification (ileride) |

## Ölçeklenebilirlik Notları

- **Partitioning adayı:** `ai_usage_logs`, `job_runs`, `inbox_messages` — workspace_id + created_at ile ileride partition.
- **Read replica:** Dashboard raporları ve analytics için okuma replikası.
- **Object storage:** Büyük HTML snapshot, PDF report → Supabase Storage; DB'de sadece referans URL.
- **Search:** Lead full-text arama için `tsvector` kolonu veya harici search (ileride).

## Final Schema (Step 5)

Migration öncesi onaylanmış mimari:

| Doküman | İçerik |
|---------|--------|
| [final-schema.md](./final-schema.md) | MVP 24 tablo — kolon, FK, RLS, index |
| [mvp-scope.md](./mvp-scope.md) | MVP vs Faz 2/3 ayrımı |
| [migration-order.md](./migration-order.md) | M001–M016 migration sırası |
| [pre-migration-checklist.md](./pre-migration-checklist.md) | Uygulama öncesi kontrol listesi |

## Sonraki Adım

[pre-migration-checklist.md](./pre-migration-checklist.md) tamamlandıktan sonra `database/supabase/migrations/` altında M001'den başlayarak SQL yazılacak.
