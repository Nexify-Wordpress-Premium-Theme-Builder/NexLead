import Link from "next/link";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { IconChevronRight } from "@/components/ui/icons";
import type { AuditType, DashboardRecentAudit } from "@/features/dashboard/dashboard.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  full: "Tam",
  quick: "Hızlı",
  manual: "Manuel",
  scheduled: "Zamanlanmış",
};

type RecentAuditsCardProps = {
  audits: DashboardRecentAudit[];
};

export function RecentAuditsCard({ audits }: RecentAuditsCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Son Analiz İstekleri</h2>
          <p className="mt-0.5 text-sm text-text-muted">En son başlatılan analizler</p>
        </div>
        <Link
          href="/dashboard/websites"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Web Site Analizleri
          <IconChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {audits.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">Henüz analiz isteği yok.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Web sitelerinizden bir analiz başlatabilirsiniz.
          </p>
          <Link
            href="/dashboard/websites"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
          >
            Web Site Analizlerine Git
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {audits.map((audit) => (
            <li key={audit.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium text-text-primary">{audit.websiteLabel}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {AUDIT_TYPE_LABELS[audit.type]} analiz
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Oluşturulma: {formatWebsiteDate(audit.createdAt)}
                  {audit.completedAt ? ` · Tamamlanma: ${formatWebsiteDate(audit.completedAt)}` : ""}
                </p>
              </div>
              <AuditStatusBadge status={audit.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
