import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import type { AuditHistoryItem } from "@/features/websites/website.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";
import type { AuditType } from "@/features/dashboard/dashboard.types";

const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  full: "Tam",
  quick: "Hızlı",
  manual: "Manuel",
  scheduled: "Zamanlanmış",
};

type WebsiteAuditHistoryCardProps = {
  audits: AuditHistoryItem[];
};

export function WebsiteAuditHistoryCard({ audits }: WebsiteAuditHistoryCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Analiz Geçmişi</h2>

      {audits.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">Henüz analiz kaydı bulunmuyor.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {audits.map((audit) => (
            <li key={audit.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <AuditStatusBadge status={audit.status} />
                <span className="text-xs text-text-muted">
                  {AUDIT_TYPE_LABELS[audit.type]} analiz
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-text-muted">Oluşturulma</dt>
                  <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Başlangıç</dt>
                  <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.started_at)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Tamamlanma</dt>
                  <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.completed_at)}</dd>
                </div>
              </dl>
              {audit.error_message ? (
                <p className="mt-3 rounded-lg border border-error/20 bg-red-50 px-3 py-2 text-sm text-error">
                  {audit.error_message}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
