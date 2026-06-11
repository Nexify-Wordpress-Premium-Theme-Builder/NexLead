import { AuditCategoryBadge } from "@/components/websites/audit-category-badge";
import { AuditSeverityBadge } from "@/components/websites/audit-severity-badge";
import type { AuditFindingItem } from "@/features/audits/audit-result.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type AuditFindingCardProps = {
  finding: AuditFindingItem;
};

export function AuditFindingCard({ finding }: AuditFindingCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface-soft/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <AuditSeverityBadge severity={finding.severity} />
        <AuditCategoryBadge category={finding.category} />
        <span className="text-xs text-text-muted">{formatWebsiteDate(finding.created_at)}</span>
      </div>

      <h4 className="mt-3 text-sm font-semibold text-text-primary">{finding.title}</h4>
      <p className="mt-2 break-words text-sm text-text-secondary">{finding.description}</p>

      {finding.recommendation ? (
        <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs font-medium text-text-muted">Öneri</p>
          <p className="mt-1 break-words text-sm text-text-primary">{finding.recommendation}</p>
        </div>
      ) : null}

      {finding.evidenceSummary ? (
        <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs font-medium text-text-muted">Kanıt</p>
          <p className="mt-1 break-words text-sm text-text-secondary">{finding.evidenceSummary}</p>
        </div>
      ) : null}
    </article>
  );
}
