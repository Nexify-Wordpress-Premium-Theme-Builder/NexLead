# Users Şeması

Kullanıcı profili ve workspace üyelik ilişkileri.

## `profiles`

Bkz. [auth.md](./auth.md) — temel kullanıcı profili.

## `workspace_members`

Kullanıcı ↔ workspace çoktan çoğa ilişkisi. **Multi-tenant erişim kontrolünün merkezi tablosu.**

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `user_id` | UUID FK | `auth.users.id` |
| `role` | ENUM | `workspace_role` |
| `status` | ENUM | `workspace_member_status` |
| `invited_by` | UUID FK | Davet eden kullanıcı |
| `joined_at` | TIMESTAMPTZ | Üyelik başlangıcı |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Kısıtlar:**
- `(workspace_id, user_id)` unique
- Workspace başına en az bir `owner` bulunmalı

## `workspace_invites`

Henüz kayıtlı olmayan veya henüz katılmamış kullanıcılar için davet.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | |
| `workspace_id` | UUID FK | |
| `email` | TEXT | Davet edilen e-posta |
| `role` | ENUM | Atanacak rol |
| `status` | ENUM | `invite_status` |
| `token_hash` | TEXT | Güvenli davet token'ı (hash) |
| `invited_by` | UUID FK | |
| `expires_at` | TIMESTAMPTZ | |
| `accepted_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

## Rol Yetki Matrisi (özet)

| Yetki | owner | admin | member | viewer |
|-------|-------|-------|--------|--------|
| Workspace silme | ✓ | — | — | — |
| Billing yönetimi | ✓ | ✓ | — | — |
| Üye davet | ✓ | ✓ | — | — |
| Lead CRUD | ✓ | ✓ | ✓ | R |
| Audit başlat | ✓ | ✓ | ✓ | R |
| Outreach gönder | ✓ | ✓ | ✓ | — |
| Email hesabı bağla | ✓ | ✓ | — | — |

R = Read only

## Kullanıcı Yaşam Döngüsü

```
Kayıt → profile oluştur
    → Yeni workspace (owner) VEYA davet kabul (member/admin)
    → workspace_members.status = active
    → Uygulama modüllerine erişim (RLS)
```

## Index Önerileri

- `workspace_members(user_id)` — kullanıcının workspace listesi
- `workspace_members(workspace_id, status)` — aktif üyeler
- `workspace_invites(workspace_id, email, status)`

## Notlar

- Bir kullanıcı birden fazla workspace'e üye olabilir (ajans senaryosu).
- Aktif workspace seçimi frontend session'da tutulur; DB'de `profiles.last_active_workspace_id` opsiyonel kolon olarak eklenebilir.
