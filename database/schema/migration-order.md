# Migration Yazım Sırası

NexLead MVP şemasının migration dosyalarına bölünme planı. **Henüz SQL yazılmadı** — sıra ve bağımlılık rehberidir.

## Genel Kurallar

1. Her migration dosyası tek sorumluluk taşır.
2. FK bağımlılığı olan tablo, referans verdiği tablodan sonra gelir.
3. RLS policy'ler tablo oluşturulduktan hemen sonra veya ayrı migration'da uygulanır.
4. Index'ler veri yüklemesinden önce tanımlanır (boş tabloda hızlı).
5. Dosya adlandırma: `YYYYMMDDHHMMSS_açıklama.sql`

## Önerilen Migration Sırası

### M001 — `extensions_and_enums`
- `uuid-ossp` veya `pgcrypto` (UUID)
- Tüm PostgreSQL ENUM tipleri
- `updated_at` trigger fonksiyonu (paylaşılan)

**Bağımlılık:** yok

---

### M002 — `core_workspace`
- `workspaces`
- `profiles` (+ `auth.users` insert trigger planı)

**Bağımlılık:** M001

---

### M003 — `workspace_membership`
- `workspace_members`
- `workspace_invites`

**Bağımlılık:** M002, `auth.users`

---

### M004 — `leads`
- `leads`
- `lead_notes`

**Bağımlılık:** M002, M003

---

### M005 — `websites`
- `websites`

**Bağımlılık:** M004 (nullable FK `lead_id`)

---

### M006 — `audits`
- `audits`
- `audit_scores`
- `audit_findings`

**Bağımlılık:** M005

---

### M007 — `reports`
- `audit_reports`
- `report_sections`

**Bağımlılık:** M006

---

### M008 — `email_and_outreach`
- `email_accounts`
- `outreach_campaigns`
- `outreach_messages`

**Bağımlılık:** M004, M007 (nullable report FK)

---

### M009 — `inbox`
- `inbox_threads`
- `inbox_messages`

**Bağımlılık:** M004, M008

---

### M010 — `meetings`
- `meetings`

**Bağımlılık:** M004, M008, M007 (nullable FK'ler)

---

### M011 — `notifications`
- `notifications`

**Bağımlılık:** M002, M003

---

### M012 — `billing`
- `plans` (+ seed plan verisi — ayrı seed migration veya bu dosyada)
- `subscriptions`
- `usage_quotas`

**Bağımlılık:** M002

---

### M013 — `jobs_and_ai`
- `job_runs`
- `ai_usage_logs`

**Bağımlılık:** M002 (nullable reference FK'ler çapraz modüllere)

---

### M014 — `rls_helper_functions`
- `is_workspace_member(ws_id)`
- `has_workspace_role(ws_id, roles[])`
- `get_user_workspace_ids()`

**Bağımlılık:** M003

---

### M015 — `rls_policies`
- Tüm MVP tabloları için SELECT / INSERT / UPDATE policy'leri
- Service role bypass notları

**Bağımlılık:** M002–M013, M014

---

### M016 — `indexes`
- [indexes.md](./indexes.md) MVP index seti
- Partial index'ler (`deleted_at IS NULL`)

**Bağımlılık:** M002–M013

---

## Bağımlılık Grafiği

```
M001 (enums)
  └── M002 (workspaces, profiles)
        ├── M003 (members, invites)
        │     └── M014 (RLS helpers)
        │           └── M015 (RLS policies)
        ├── M004 (leads)
        │     └── M005 (websites)
        │           └── M006 (audits)
        │                 └── M007 (reports)
        │                       └── M008 (outreach)
        │                             └── M009 (inbox)
        │                                   └── M010 (meetings)
        ├── M011 (notifications)
        ├── M012 (billing)
        └── M013 (jobs, ai)
              └── M016 (indexes) — tüm tablolar sonrası
```

## Faz 2 Migration'ları (MVP Sonrası)

| Sıra | Dosya | Tablolar |
|------|-------|----------|
| M101 | `lead_enrichment` | `lead_sources`, `lead_tags`, `lead_tag_assignments` |
| M102 | `outreach_advanced` | `outreach_sequences`, `sender_identities` |
| M103 | `website_snapshots` | `website_snapshots` |
| M104 | `report_templates` | `report_templates` |
| M105 | `meetings_advanced` | `meeting_participants` |
| M106 | `notifications_advanced` | `notification_preferences`, `notification_deliveries` |
| M107 | `jobs_advanced` | `job_run_steps` |
| M108 | `ai_templates` | `ai_prompt_templates` |
| M109 | `billing_advanced` | `usage_events`, `integrations` |

## Uygulama Yöntemi

| Yöntem | Ne Zaman |
|--------|----------|
| Lokal `supabase db push` | Geliştirme ve test |
| MCP `apply_migration` | Remote doğrulama |
| CI pipeline | Production deploy |

Remote proje: `mjoeimeabwqsymqczvyd` — bkz. [../supabase/connection.md](../supabase/connection.md)

## Rollback Stratejisi

- MVP öncesi: remote boş — rollback = drop migration
- Production sonrası: forward-only migration; `down` migration yazılmaz
- Breaking change: yeni migration ile additive alter
