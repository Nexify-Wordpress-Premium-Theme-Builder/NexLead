# Supabase

NexLead remote Supabase projesi — migration, seed, RLS ve edge function dosyaları.

## Bağlantı

Remote proje MCP ile doğrulandı. Detaylar: **[connection.md](./connection.md)**

| Alan | Değer |
|------|-------|
| Project | NexLead |
| Project ref | `mjoeimeabwqsymqczvyd` |
| Region | `ap-southeast-2` |
| API URL | `https://mjoeimeabwqsymqczvyd.supabase.co` |
| Şema durumu | Boş (migration uygulanmadı) |

## Klasör Yapısı

| Klasör | Açıklama |
|--------|----------|
| `migrations/` | SQL migration dosyaları (henüz boş) |
| `seed/` | Geliştirme ortamı seed verileri |
| `policies/` | RLS policy referans dosyaları |
| `functions/` | Supabase Edge Functions |
| `connection.md` | MCP bağlantı ve proje metadata kaydı |

## MCP (Cursor)

Cursor içinde `user-supabase` MCP sunucusu ile proje yönetilir. İlk kullanımda `mcp_auth` ile kimlik doğrulama gerekir.

## İlgili Dokümanlar

- [database/schema/overview.md](../schema/overview.md) — planlanan şema
- [database/schema/rls-policies.md](../schema/rls-policies.md) — RLS stratejisi
- [docs/architecture/database.md](../../docs/architecture/database.md)
