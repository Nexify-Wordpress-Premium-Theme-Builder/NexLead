# MVP vs Sonraki Faz — Tablo Kapsamı

Migration yazımından önce tablo önceliklendirmesi.

## Özet

| Kategori | Tablo Sayısı |
|----------|--------------|
| MVP (Migration 1) | 24 |
| Faz 2 | 14 |
| Faz 3+ | 6 |
| Supabase built-in | `auth.users` (dokunulmaz) |

---

## MVP Tabloları (Migration 1)

İlk migration setinde oluşturulacak tablolar.

### Auth & Workspace (4)
| Tablo | Gerekçe |
|-------|---------|
| `profiles` | Kullanıcı profili |
| `workspaces` | Tenant kökü |
| `workspace_members` | Multi-tenant erişim |
| `workspace_invites` | Ekip daveti |

### Leads (2)
| Tablo | Gerekçe |
|-------|---------|
| `leads` | Çekirdek iş verisi |
| `lead_notes` | Lead üzerinde not |

> MVP'de `lead_sources` yok — `leads.source_type` enum yeterli.

### Websites (1)
| Tablo | Gerekçe |
|-------|---------|
| `websites` | Audit hedefi |

> MVP'de `website_snapshots` yok — büyük içerik Storage + `audits` metadata.

### Audits (3)
| Tablo | Gerekçe |
|-------|---------|
| `audits` | Denetim çalışması |
| `audit_findings` | Bulgular |
| `audit_scores` | Kategori skorları |

### Reports (2)
| Tablo | Gerekçe |
|-------|---------|
| `audit_reports` | AI rapor |
| `report_sections` | Yapılandırılmış bölümler |

> MVP'de `report_templates` yok — tek varsayılan şablon kodda.

### Outreach (3)
| Tablo | Gerekçe |
|-------|---------|
| `email_accounts` | Gönderen hesap |
| `outreach_campaigns` | Kampanya |
| `outreach_messages` | Tekil gönderim |

> MVP'de `outreach_sequences` yok — kampanya = tek adımlı e-posta.  
> MVP'de `sender_identities` yok — `email_accounts.display_name` kullanılır.

### Inbox (2)
| Tablo | Gerekçe |
|-------|---------|
| `inbox_threads` | Konuşma thread'i |
| `inbox_messages` | Gelen/giden mesaj |

### Meetings (1)
| Tablo | Gerekçe |
|-------|---------|
| `meetings` | Randevu |

> MVP'de `meeting_participants` yok — `meetings` üzerinde `contact_email` yeterli.

### Notifications (1)
| Tablo | Gerekçe |
|-------|---------|
| `notifications` | Uygulama içi bildirim |

### Billing (3)
| Tablo | Gerekçe |
|-------|---------|
| `plans` | Sistem plan tanımları |
| `subscriptions` | Workspace aboneliği |
| `usage_quotas` | Dönemsel kota sayacı |

### Altyapı (2)
| Tablo | Gerekçe |
|-------|---------|
| `job_runs` | Arka plan iş logu |
| `ai_usage_logs` | AI maliyet takibi |

---

## Faz 2 Tabloları

MVP sonrası, ürün olgunlaştıkça eklenecek.

| Tablo | Modül | Gerekçe |
|-------|-------|---------|
| `lead_sources` | Leads | Keşif kaynağı yönetimi |
| `lead_tags` | Leads | Etiketleme |
| `lead_tag_assignments` | Leads | M:N etiket |
| `outreach_sequences` | Outreach | Multi-touch sequence |
| `sender_identities` | Outreach | Çoklu gönderen kimliği |
| `website_snapshots` | Websites | HTML snapshot Storage ref |
| `report_templates` | Reports | Özelleştirilebilir şablon |
| `meeting_participants` | Meetings | Çoklu katılımcı |
| `notification_preferences` | Notifications | Kanal tercihleri |
| `notification_deliveries` | Notifications | Email delivery log |
| `job_run_steps` | Jobs | Çok adımlı job log |
| `ai_prompt_templates` | AI | Versiyonlu prompt yönetimi |
| `usage_events` | Billing | Detaylı kullanım olayları |
| `integrations` | Settings | Harici entegrasyon kayıtları |

---

## Faz 3+ Tabloları

| Tablo | Modül | Gerekçe |
|-------|-------|---------|
| `invoices` | Billing | Fatura geçmişi |
| `lead_status_history` | Leads | Durum geçiş audit trail |
| `workspace_api_keys` | Settings | API erişimi |
| `webhook_endpoints` | Integrations | Webhook yönetimi |
| `audit_report_shares` | Reports | Paylaşım link analytics |
| `saved_filters` | Dashboard | Kayıtlı filtreler |

---

## MVP'de Bilinçli Olarak Ertelenen Özellikler

| Özellik | MVP Alternatifi |
|---------|-----------------|
| Multi-step outreach | Tek `outreach_messages` per campaign |
| Lead tagging | `leads.metadata` JSONB |
| Report templates | Hardcoded default template |
| Calendar sync | Manuel `meeting_url` |
| Email preferences | Tüm bildirimler in-app |
| Detailed job steps | Tek `job_runs` kaydı |
| Integration registry | Env-based provider config |

---

## Karar Özeti

MVP **24 tablo** ile tam ürün akışını destekler:

```
Auth → Lead → Website → Audit → Report → Outreach → Inbox → Meeting
```

Billing ve job/AI altyapısı MVP'de minimal ama **şema hazır** tutulur; Faz 2 tabloları sonradan additive migration ile eklenir — breaking change yok.
