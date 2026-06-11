# Veri Saklama ve Arşivleme

Silme, arşivleme ve GDPR uyum stratejisi.

## Genel İlkeler

| İlke | Uygulama |
|------|----------|
| Soft delete varsayılan | `deleted_at` timestamp |
| Fiziksel silme istisna | Log tabloları, süresi dolan geçici veriler |
| Arşiv önce | Cold storage / ayrı schema |
| Kullanıcı talebi | Workspace kapatma + 30 gün grace |

## Tablo Bazlı Politikalar

| Tablo / Veri | Aktif Saklama | Arşiv | Fiziksel Silme |
|--------------|---------------|-------|----------------|
| `leads` (active) | Süresiz | `archived` → 12 ay | Workspace silme sonrası 90 gün |
| `leads` (won/lost) | 24 ay | Evet | 36 ay sonra |
| `websites` | Lead ile bağlı | Lead arşivi ile | Aynı |
| `website_snapshots` | 90 gün | Storage lifecycle | Otomatik |
| `audits` | Süresiz | — | Silinmez (immutable) |
| `audit_findings` | Audit ile | — | Silinmez |
| `audit_reports` | Süresiz | PDF Storage 24 ay | Share link 30 gün |
| `outreach_messages` | 24 ay | 12 ay arşiv | 36 ay |
| `inbox_messages` | 18 ay | 12 ay arşiv | 30 ay |
| `meetings` | 24 ay | — | 36 ay |
| `notifications` (read) | 90 gün | — | Otomatik purge job |
| `ai_usage_logs` | 12 ay detay | Günlük özet kalıcı | 12 ay |
| `job_runs` (completed) | 90 gün | — | Otomatik |
| `job_runs` (failed) | 180 gün | — | Otomatik |

## Soft Delete Uygulaması

Soft delete kullanan tablolar:

- `workspaces`, `leads`, `websites`
- `outreach_campaigns`
- `email_accounts`

Sorgular varsayılan olarak `deleted_at IS NULL` filtresi uygular (view veya API katmanı).

## Workspace Kapatma Akışı

```
1. owner workspace'i kapatır → status = closed, deleted_at set
2. 30 gün grace period — veri export imkânı
3. subscription cancelled
4. Arşiv job: tüm veriler cold storage'a
5. 90 gün sonra fiziksel silme (GDPR right to erasure)
```

## Arşivleme Mekanizması (ileride)

| Aşama | Yöntem |
|-------|--------|
| 1 | `archived_at` kolonu set |
| 2 | Arşiv schema'ya taşı (`archive.leads`) |
| 3 | Storage dosyalarını cold tier'a al |
| 4 | Ana tablodan fiziksel sil |

MVP'de yalnızca `status = archived` + eski kayıtları sorgulardan hariç tutma yeterlidir.

## PII ve Hassas Veri

| Veri | Saklama | Not |
|------|---------|-----|
| E-posta içerikleri | inbox retention | Şifreleme at rest (Supabase) |
| Email credentials | Vault / secret manager | DB'de tutulmaz |
| AI prompt içeriği | Tutulmaz | Yalnızca token log |
| Ödeme kartı | Payment provider | DB'de tutulmaz |

## Purge Job'ları

| Job | Sıklık | Hedef |
|-----|--------|-------|
| `purge_read_notifications` | Günlük | 90+ gün okunmuş |
| `purge_completed_jobs` | Haftalık | 90+ gün completed |
| `purge_ai_logs` | Aylık | 12+ ay |
| `cleanup_expired_shares` | Günlük | share_token null |
| `storage_lifecycle` | Storage policy | Eski snapshot/PDF |

## Yedekleme

- Supabase otomatik günlük backup (Pro plan).
- Kritik migration öncesi manuel snapshot.
- Point-in-time recovery (production).

## Uyumluluk Notları

- KVKK / GDPR: kullanıcı veri export ve silme talebi desteklenmeli.
- Veri işleme kaydı dokümantasyonda tutulur.
- Cross-border: Supabase region seçimi (EU veya US) deployment'da belirlenir.
