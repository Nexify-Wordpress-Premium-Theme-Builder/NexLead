# @nexlead/api

NexLead backend API servisi.

## Klasör Yapısı

| Klasör | Açıklama |
|--------|----------|
| `src/modules/` | Domain modülleri (auth, leads, audits, vb.) |
| `src/common/` | Paylaşılan middleware, guard, validator ve hata yönetimi |
| `src/jobs/` | Arka plan iş kuyruğu görevleri |
| `src/services/` | Harici servis entegrasyonları (AI, email, queue, storage) |
| `src/database/` | Veritabanı bağlantısı ve repository katmanı |
| `tests/` | Unit, integration ve e2e testler |

## Geliştirme

```bash
pnpm --filter @nexlead/api dev
```
