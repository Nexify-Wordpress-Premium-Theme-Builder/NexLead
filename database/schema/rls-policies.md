# RLS Policy Stratejisi

Supabase Row Level Security planı — workspace bazlı veri izolasyonu.

## Temel Prensip

Her tenant-scoped tabloda RLS **açık** olacak. Erişim `workspace_members` üzerinden doğrulanır.

## Yardımcı Fonksiyonlar (migration'da oluşturulacak)

| Fonksiyon | Dönüş | Açıklama |
|-----------|-------|----------|
| `auth.uid()` | UUID | Supabase built-in |
| `is_workspace_member(ws_id)` | BOOLEAN | Aktif üye mi |
| `has_workspace_role(ws_id, roles[])` | BOOLEAN | Rol kontrolü |
| `get_user_workspaces()` | SETOF UUID | Kullanıcının workspace ID'leri |

## Policy Şablonları

### Okuma (SELECT)

```text
workspace_id IN (SELECT workspace_id FROM workspace_members
                 WHERE user_id = auth.uid() AND status = 'active')
```

### Ekleme (INSERT)

```text
WITH CHECK: is_workspace_member(workspace_id)
AND has_workspace_role(workspace_id, ARRAY['owner','admin','member'])
```

### Güncelleme (UPDATE)

```text
USING: is_workspace_member(workspace_id)
WITH CHECK: is_workspace_member(workspace_id)
```

### Silme (DELETE)

Çoğu tabloda fiziksel DELETE kapalı; soft delete UPDATE ile yapılır.

`owner` ve `admin` için soft delete UPDATE policy'si.

## Tablo Bazlı Policy Matrisi

| Tablo | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Kendi + workspace arkadaşları | Trigger | Kendi | — |
| `workspaces` | Üye | Auth sonrası | owner, admin | owner |
| `workspace_members` | Üye | admin+ | admin+ | owner |
| `workspace_invites` | admin+ | admin+ | admin+ | admin+ |
| `leads` | Üye | member+ | member+ | admin+ (soft) |
| `websites` | Üye | member+ | member+ | admin+ |
| `audits` | Üye | member+ | — (immutable) | — |
| `audit_findings` | Üye | service role | — | — |
| `audit_reports` | Üye | member+ | member+ (draft) | admin+ |
| `outreach_*` | Üye | member+ | member+ | admin+ |
| `email_accounts` | Üye | admin+ | admin+ | admin+ |
| `inbox_*` | Üye | service/member | member+ | admin+ |
| `meetings` | Üye | member+ | member+ | member+ |
| `notifications` | Kendi user_id | service | Kendi | Kendi |
| `subscriptions` | Üye | service | service | — |
| `usage_quotas` | Üye | service | service | — |
| `ai_usage_logs` | admin+ | service | — | — |
| `job_runs` | Üye | service | service | — |

`member+` = member, admin, owner  
`admin+` = admin, owner  
`service` = backend service role (bypass RLS veya özel policy)

## Service Role Kullanımı

Backend API ve job worker'lar `service_role` key kullanır:

- Audit crawling, AI çağrıları, email gönderimi
- Inbox sync
- Billing webhook'ları

Service role **yalnızca backend'de** tutulur; frontend'e asla verilmez.

## Viewer Rolü

`viewer` rolü için INSERT/UPDATE/DELETE policy'leri hariç tutulur:

```text
has_workspace_role(workspace_id, ARRAY['owner','admin','member'])
```

## Güvenlik Kontrol Listesi

- [ ] Tüm public tablolarda RLS enabled
- [ ] `workspace_id` client'tan gelen değer API'de doğrulanır
- [ ] Service role key environment variable'da
- [ ] `auth.users` doğrudan client'tan erişilemez
- [ ] Paylaşım linkleri (`share_token`) ayrı anon policy ile sınırlı süre

## Anonim Erişim

`audit_reports.share_token` için isteğe bağlı anon SELECT policy:

- Yalnızca `share_token` eşleşmesi
- `share_expires_at > now()`
- Sınırlı kolonlar (view veya security barrier view)

## Test Stratejisi

Migration sonrası her policy için:

1. Workspace A üyesi → Workspace A verisi ✓
2. Workspace A üyesi → Workspace B verisi ✗
3. Viewer → yazma işlemi ✗
4. Anon → share link ✓ (süreli)
