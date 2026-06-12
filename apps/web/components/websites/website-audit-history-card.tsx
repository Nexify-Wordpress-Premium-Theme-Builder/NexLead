import { AuditReportLink } from "@/components/reports/audit-report-link";
import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import type { AuditType } from "@/features/dashboard/dashboard.types";
import type { AuditHistoryItem } from "@/features/websites/website.types";
import { formatAuditErrorForUser, formatWebsiteDate } from "@/features/websites/website.utils";

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
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Analiz Geçmişi</h2>
      {audits.length > 0 ? (
        <p className="mt-1 text-sm text-text-secondary">
          Son {audits.length} kayıt, en yeniden eskiye.
        </p>
      ) : null}

      {audits.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">Henüz analiz kaydı bulunmuyor.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {audits.map((audit, index) => {
            const isLatest = index === 0;
            const errorInfo = formatAuditErrorForUser(Boolean(audit.error_message));

            return (
              <li
                key={audit.id}
                className="rounded-xl border border-border bg-surface-soft/40 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <AuditStatusBadge status={audit.status} />
                    <span className="text-xs text-text-muted">
                      {AUDIT_TYPE_LABELS[audit.type]} analiz
                    </span>
                    {isLatest ? (
                      <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-secondary">
                        En son
                      </span>
                    ) : null}
                  </div>
                  {audit.status === "completed" ? (
                    <AuditReportLink auditId={audit.id} />
                  ) : null}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-text-muted">Oluşturulma</dt>
                    <dd className="mt-0.5 text-text-primary">
                      {formatWebsiteDate(audit.created_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Başlangıç</dt>
                    <dd className="mt-0.5 text-text-primary">
                      {formatWebsiteDate(audit.started_at)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-text-muted">Tamamlanma</dt>
                    <dd className="mt-0.5 text-text-primary">
                      {formatWebsiteDate(audit.completed_at)}
                    </dd>
                  </div>
                </dl>

                {audit.status === "failed" && errorInfo.message ? (
                  <div className="mt-3 rounded-lg border border-error/20 bg-red-50 px-3 py-2 text-sm">
                    <p className="text-error">{errorInfo.message}</p>
                    {errorInfo.hasTechnicalDetail ? (
                      <p className="mt-1 text-xs text-text-muted">
                        Teknik detay kayıt altına alındı.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
