import { AuditCategoryBadge } from "@/components/websites/audit-category-badge";
import { AuditSeverityBadge } from "@/components/websites/audit-severity-badge";
import type { PriorityAction } from "@/features/reports/report.types";

type PriorityActionsCardProps = {
  actions: PriorityAction[];
};

export function PriorityActionsCard({ actions }: PriorityActionsCardProps) {
  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Öncelikli Aksiyonlar</h2>

      {actions.length === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">Öncelikli aksiyon bulunmuyor.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {actions.map((action, index) => (
            <li
              key={action.id}
              className="rounded-xl border border-border bg-surface-soft/40 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <AuditSeverityBadge severity={action.severity} />
                <AuditCategoryBadge category={action.category} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-text-primary">{action.title}</h3>
              {action.recommendation ? (
                <p className="mt-2 break-words text-sm text-text-secondary">
                  {action.recommendation}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
