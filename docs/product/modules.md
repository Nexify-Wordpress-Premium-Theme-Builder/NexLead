# Modüller

NexLead ürün modülleri ve veritabanı eşlemesi.

## Modül Haritası

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Lead       │────►│  Website     │────►│  Audit      │
│  Discovery  │     │  Management  │     │  Engine     │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                    ┌──────────────┐     ┌───────▼──────┐
                    │  Meeting     │◄────│  Report      │
                    │  Scheduler   │     │  Generator   │
                    └──────▲───────┘     └──────┬───────┘
                           │                   │
                    ┌──────┴───────┐     ┌─────▼──────┐
                    │  Inbox       │◄────│  Outreach  │
                    │  Tracking    │     │  Engine    │
                    └──────────────┘     └────────────┘
```

## Modül Detayları

### 1. Auth & Workspace
**Amaç:** Kayıt, giriş, ekip yönetimi.

| Özellik | DB Tabloları |
|---------|--------------|
| Kayıt / giriş | `auth.users`, `profiles` |
| Workspace oluşturma | `workspaces` |
| Ekip üyeliği | `workspace_members`, `workspace_invites` |

Doküman: [auth.md](../../database/schema/auth.md), [workspaces.md](../../database/schema/workspaces.md)

---

### 2. Lead Discovery
**Amaç:** Potansiyel müşteri bulma ve yönetimi.

| Özellik | DB Tabloları |
|---------|--------------|
| Lead listesi / pipeline | `leads` |
| Keşif kaynakları | `lead_sources` |
| Etiketleme | `lead_tags`, `lead_tag_assignments` |
| Notlar | `lead_notes` |
| Skorlama | `leads.score`, `score_breakdown` |

Doküman: [leads.md](../../database/schema/leads.md)

---

### 3. Website Management
**Amaç:** Hedef sitelerin kaydı ve manuel analiz.

| Özellik | DB Tabloları |
|---------|--------------|
| Site kaydı | `websites` |
| Snapshot | `website_snapshots` |
| Manuel audit | `websites` (lead_id NULL) |

Doküman: [websites.md](../../database/schema/websites.md)

---

### 4. Audit Engine
**Amaç:** Web sitesi tarama, analiz ve skorlama.

| Özellik | DB Tabloları |
|---------|--------------|
| Audit çalıştırma | `audits`, `job_runs` |
| Bulgular | `audit_findings` |
| Kategori skorları | `audit_scores` |

Doküman: [audits.md](../../database/schema/audits.md)

---

### 5. Report Generator
**Amaç:** Kişiselleştirilmiş denetim raporu (AI).

| Özellik | DB Tabloları |
|---------|--------------|
| Rapor üretimi | `audit_reports`, `report_sections` |
| Şablonlar | `report_templates` |
| Paylaşım linki | `audit_reports.share_token` |

Doküman: [reports.md](../../database/schema/reports.md)

---

### 6. Outreach Engine
**Amaç:** Kişiselleştirilmiş e-posta hazırlama ve gönderim.

| Özellik | DB Tabloları |
|---------|--------------|
| Kampanyalar | `outreach_campaigns` |
| Sequence | `outreach_sequences` |
| Gönderim | `outreach_messages` |
| Gönderen hesap | `email_accounts`, `sender_identities` |

Doküman: [outreach.md](../../database/schema/outreach.md)

---

### 7. Inbox Tracking
**Amaç:** Gelen cevapları takip ve sınıflandırma.

| Özellik | DB Tabloları |
|---------|--------------|
| Thread yönetimi | `inbox_threads` |
| Mesajlar | `inbox_messages` |
| AI sınıflandırma | `inbox_messages.sentiment` |

Doküman: [inbox.md](../../database/schema/inbox.md)

---

### 8. Meeting Scheduler
**Amaç:** Randevu oluşturma ve takip.

| Özellik | DB Tabloları |
|---------|--------------|
| Toplantılar | `meetings` |
| Katılımcılar | `meeting_participants` |
| AI brief | `meetings.brief` |

Doküman: [meetings.md](../../database/schema/meetings.md)

---

### 9. Dashboard
**Amaç:** Tüm süreçlerin özet görünümü.

Dashboard doğrudan tablo değil; aggregate sorgular:

| Metrik | Kaynak |
|--------|--------|
| Pipeline özeti | `leads` (status group by) |
| Audit skorları | `audits` (son skorlar) |
| Outreach performans | `outreach_messages` (sent/opened/replied) |
| Bekleyen cevaplar | `inbox_threads` (unread) |
| Yaklaşan toplantılar | `meetings` (scheduled_start) |

---

### 10. Notifications
**Amaç:** Olay bazlı bildirimler.

Doküman: [notifications.md](../../database/schema/notifications.md)

---

### 11. Billing & Plans
**Amaç:** SaaS abonelik ve kota yönetimi.

Doküman: [billing.md](../../database/schema/billing.md)

---

### 12. AI & Jobs (Altyapı)
**Amaç:** AI kullanım takibi ve arka plan işleri.

| Bileşen | DB Tabloları |
|---------|--------------|
| AI log | `ai_usage_logs`, `ai_prompt_templates` |
| Job kuyruğu | `job_runs`, `job_run_steps` |

Doküman: [ai-usage.md](../../database/schema/ai-usage.md), [jobs.md](../../database/schema/jobs.md)

---

## Modül Bağımlılıkları

| Modül | Bağımlı Olduğu |
|-------|----------------|
| Lead Discovery | Auth, Workspace |
| Website | Lead (opsiyonel) |
| Audit | Website |
| Report | Audit |
| Outreach | Lead, Report (opsiyonel), Email Account |
| Inbox | Outreach, Email Account |
| Meeting | Lead, Inbox (opsiyonel) |
| Billing | Workspace |
| Notifications | Tüm modüller (event source) |

## MVP Öncelik Sırası

1. Auth + Workspace
2. Leads + Websites
3. Audits + Reports
4. Outreach + Email Accounts
5. Inbox
6. Meetings
7. Billing
8. Notifications (temel)

## İlgili Dokümanlar

- [database/schema/overview.md](../../database/schema/overview.md)
- [architecture/database.md](../architecture/database.md)
- [architecture/multi-tenant.md](../architecture/multi-tenant.md)
