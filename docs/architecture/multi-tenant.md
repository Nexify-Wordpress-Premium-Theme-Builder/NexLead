# Multi-Tenant Mimarisi

NexLead workspace-scoped SaaS tenant modeli.

## Tenant Tanımı

Bir **workspace** = bir müşteri organizasyonu (ajans, şirket, ekip).

```
User A ──► Workspace 1 (owner)
        ──► Workspace 2 (member)    ← ajans çalışanı birden fazla workspace'te

User B ──► Workspace 1 (admin)
```

## İzolasyon Katmanları

| Katman | Mekanizma |
|--------|-----------|
| 1. Veritabanı | `workspace_id` FK + RLS |
| 2. API | Request header / JWT'den workspace context |
| 3. Frontend | Aktif workspace seçimi (session) |
| 4. Storage | Path prefix: `{workspace_id}/...` |
| 5. Job queue | Payload'da `workspace_id` zorunlu |

Defense in depth: RLS son savunma hattı; API katmanı da doğrular.

## Workspace Context Akışı

```
1. Kullanıcı giriş yapar (Supabase Auth)
2. workspace_members'dan erişilebilir workspace listesi çekilir
3. Kullanıcı aktif workspace seçer (veya son kullanılan otomatik)
4. Tüm API istekleri X-Workspace-Id header taşır
5. Backend: üyelik + rol kontrolü
6. DB sorgusu: workspace_id filtresi + RLS
```

## Rol Modeli

| Rol | Kapsam |
|-----|--------|
| `owner` | Tam yetki, billing, workspace silme |
| `admin` | Üye yönetimi, entegrasyonlar |
| `member` | Operasyonel işler (lead, audit, outreach) |
| `viewer` | Salt okunur dashboard |

Detay: [database/schema/users.md](../../database/schema/users.md)

## Veri Sınırları

### Workspace içinde paylaşılan
- Leads, websites, audits, reports
- Outreach campaigns, email accounts
- Inbox, meetings
- Billing, usage quotas

### Kullanıcıya özel
- `profiles` (kişisel ayarlar)
- `notifications` (hedef kullanıcı)
- `notification_preferences`

### Global (tenant dışı)
- `plans` (sistem plan tanımları)
- `ai_prompt_templates` (workspace_id NULL olanlar)

## Billing Bağlantısı

- Abonelik workspace seviyesinde (`subscriptions.workspace_id` UNIQUE).
- Kullanıcı başına değil, workspace başına kota.
- Team member sayısı plan limitine tabi.

## Davet ve Onboarding

```
Owner kayıt olur
    → workspace otomatik oluşur
    → trial subscription atanır
    → owner admin panelden üye davet eder
    → workspace_invites → email
    → Davetli kayıt olur / giriş yapar
    → workspace_members.status = active
```

## Workspace Silme

Soft delete → 30 gün grace → arşiv → fiziksel silme.

Bkz. [database/schema/data-retention.md](../../database/schema/data-retention.md)

## Güvenlik Kontrolleri

| Risk | Önlem |
|------|-------|
| Cross-tenant veri sızıntısı | RLS + API workspace doğrulama |
| Privilege escalation | Rol bazlı policy |
| ID enumeration | UUID + RLS (boş sonuç) |
| Service role abuse | Yalnızca backend, IP kısıtı |

## Ölçek Senaryoları

| Senaryo | Destek |
|---------|--------|
| Tek kullanıcı / tek workspace | ✓ MVP |
| Ekip (3–10 kişi) | ✓ workspace_members |
| Ajans (çoklu workspace) | ✓ user → N workspace |
| Enterprise (SSO) | İleride — Supabase SAML |
| White-label | İleride — custom domain per workspace |

## İlgili Dokümanlar

- [database/schema/workspaces.md](../../database/schema/workspaces.md)
- [database/schema/rls-policies.md](../../database/schema/rls-policies.md)
- [database.md](./database.md)
