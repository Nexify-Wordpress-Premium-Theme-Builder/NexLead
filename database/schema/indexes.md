# Index Stratejisi — MVP Final

Migration M016'da uygulanacak index seti. [final-schema.md](./final-schema.md) ile uyumlu.

## Kurallar

1. `workspace_id` composite index'lerin ilk kolonu
2. Partial index: `WHERE deleted_at IS NULL` (soft delete tabloları)
3. FK kolonları indexlenir
4. UNIQUE constraint'ler ayrı index oluşturur

## MVP Index Tablosu

| Tablo | Index | Tip | Amaç |
|-------|-------|-----|------|
| **workspaces** | `(slug)` | UNIQUE | Slug lookup |
| **workspaces** | `(status) WHERE deleted_at IS NULL` | partial | Aktif workspace |
| **workspace_members** | `(user_id)` | btree | Kullanıcı workspace listesi |
| **workspace_members** | `(workspace_id, status)` | btree | Aktif üyeler |
| **workspace_members** | `(workspace_id, user_id)` | UNIQUE | Duplicate önleme |
| **workspace_invites** | `(workspace_id, email, status)` | btree | Bekleyen davet |
| **workspace_invites** | `(token_hash)` | btree | Token lookup |
| **leads** | `(workspace_id, status) WHERE deleted_at IS NULL` | partial | Pipeline |
| **leads** | `(workspace_id, score DESC) WHERE deleted_at IS NULL` | partial | Fırsat sıralama |
| **leads** | `(workspace_id, assigned_to) WHERE deleted_at IS NULL` | partial | Atama filtresi |
| **leads** | `(workspace_id, created_at DESC)` | btree | Son eklenenler |
| **lead_notes** | `(lead_id, created_at DESC)` | btree | Not geçmişi |
| **websites** | `(workspace_id, normalized_url) WHERE deleted_at IS NULL` | UNIQUE partial | Duplicate URL |
| **websites** | `(workspace_id, lead_id)` | btree | Lead siteleri |
| **websites** | `(workspace_id, domain)` | btree | Domain arama |
| **audits** | `(workspace_id, website_id, created_at DESC)` | btree | Audit geçmişi |
| **audits** | `(workspace_id, status)` | btree | Aktif audit |
| **audit_scores** | `(audit_id)` | btree | Skor listesi |
| **audit_scores** | `(audit_id, category)` | UNIQUE | Kategori başına bir |
| **audit_findings** | `(audit_id, severity)` | btree | Bulgu filtresi |
| **audit_findings** | `(workspace_id, category)` | btree | Kategori raporu |
| **audit_reports** | `(workspace_id, lead_id, created_at DESC)` | btree | Lead raporları |
| **audit_reports** | `(audit_id)` | btree | Audit raporları |
| **audit_reports** | `(share_token) WHERE share_token IS NOT NULL` | partial | Paylaşım linki |
| **report_sections** | `(report_id, order_index)` | btree | Sıralı bölümler |
| **email_accounts** | `(workspace_id, status) WHERE deleted_at IS NULL` | partial | Aktif hesaplar |
| **outreach_campaigns** | `(workspace_id, status)` | btree | Kampanya listesi |
| **outreach_messages** | `(workspace_id, status, scheduled_at)` | btree | Gönderim kuyruğu |
| **outreach_messages** | `(lead_id, created_at DESC)` | btree | Lead iletişim |
| **outreach_messages** | `(provider_message_id) WHERE provider_message_id IS NOT NULL` | UNIQUE partial | Webhook eşleşme |
| **inbox_threads** | `(workspace_id, last_message_at DESC)` | btree | Inbox sıralama |
| **inbox_threads** | `(workspace_id, assigned_to, unread_count)` | btree | Okunmamış |
| **inbox_messages** | `(thread_id, received_at)` | btree | Thread mesajları |
| **inbox_messages** | `(provider_message_id) WHERE provider_message_id IS NOT NULL` | UNIQUE partial | Dedup |
| **meetings** | `(workspace_id, scheduled_start)` | btree | Takvim |
| **meetings** | `(lead_id)` | btree | Lead toplantıları |
| **notifications** | `(user_id, is_read, created_at DESC)` | btree | Bildirim listesi |
| **notifications** | `(workspace_id, created_at DESC)` | btree | Workspace feed |
| **plans** | `(slug)` | UNIQUE | Plan lookup |
| **subscriptions** | `(workspace_id)` | UNIQUE | Aktif abonelik |
| **usage_quotas** | `(workspace_id, period_start)` | UNIQUE | Dönem kotası |
| **job_runs** | `(workspace_id, status, scheduled_at)` | btree | Job kuyruğu |
| **job_runs** | `(reference_type, reference_id)` | btree | Entity job geçmişi |
| **ai_usage_logs** | `(workspace_id, created_at DESC)` | btree | Kullanım raporu |
| **ai_usage_logs** | `(workspace_id, operation_type, created_at)` | btree | Operasyon filtresi |

## Faz 2 Index'leri

Faz 2 tabloları eklendiğinde [indexes.md](./indexes.md) bu bölüme genişletilecek.

## Full-Text (Faz 2)

| Tablo | Kolonlar |
|-------|----------|
| `leads` | `company_name`, `contact_name` |
| `inbox_messages` | `body_text` |

## İzleme

Production'da `pg_stat_user_indexes` ile kullanılmayan index'ler quarterly review edilir.
