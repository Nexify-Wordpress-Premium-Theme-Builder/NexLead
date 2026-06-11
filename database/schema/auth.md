# Auth Şeması

Kimlik doğrulama Supabase Auth üzerinden yönetilir; uygulama tabloları `auth.users` ile ilişkilendirilir.

## Supabase Auth (`auth` schema)

Supabase'in yerleşik `auth.users` tablosu kullanılır. Doğrudan değiştirilmez.

| Alan (özet) | Açıklama |
|-------------|----------|
| `id` | UUID — tüm uygulama tablolarındaki `user_id` referansı |
| `email` | Birincil e-posta |
| `email_confirmed_at` | E-posta doğrulama zamanı |
| `raw_user_meta_data` | Kayıt sırasında isim vb. (geçici) |

## Uygulama Tabloları

### `profiles`

`auth.users` için 1:1 genişletme tablosu.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID PK | `auth.users.id` FK |
| `full_name` | TEXT | Görünen ad |
| `avatar_url` | TEXT | Profil görseli |
| `locale` | TEXT | Varsayılan `tr` |
| `timezone` | TEXT | Örn. `Europe/Istanbul` |
| `onboarding_completed_at` | TIMESTAMPTZ | Onboarding tamamlandı mı |
| `last_seen_at` | TIMESTAMPTZ | Son aktiflik |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Notlar:**
- Kayıt sonrası trigger veya edge function ile otomatik oluşturulur.
- Workspace bilgisi burada tutulmaz; `workspace_members` üzerinden yönetilir.

### `user_sessions` (opsiyonel, ileride)

Backend tarafı refresh token veya cihaz takibi gerekirse eklenebilir. MVP'de Supabase session yeterlidir.

## İlişkiler

```
auth.users (1) ──► (1) profiles
auth.users (1) ──► (N) workspace_members
```

## Güvenlik

- `profiles`: kullanıcı kendi kaydını okur/günceller.
- Başka kullanıcı profili yalnızca aynı workspace üyesi ise sınırlı alanlarla okunabilir (ad, avatar).
- Şifre, token ve provider bilgileri yalnızca `auth` schema'da kalır.

## Auth Akışları

| Akış | Tablo Etkisi |
|------|--------------|
| Kayıt | `auth.users` + `profiles` oluştur |
| İlk giriş | Varsayılan workspace oluştur veya davet kabul et |
| Davet kabul | `workspace_invites` → `workspace_members` |
| Şifre sıfırlama | Yalnızca Supabase Auth |

## RLS Özeti

| Tablo | SELECT | INSERT | UPDATE |
|-------|--------|--------|--------|
| `profiles` | Kendi + workspace arkadaşları (sınırlı) | Trigger | Kendi |

Detay: [rls-policies.md](./rls-policies.md)
