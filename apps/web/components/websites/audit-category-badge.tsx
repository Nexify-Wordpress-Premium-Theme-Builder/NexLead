import { FINDING_CATEGORY_LABELS } from "@/features/audits/audit-result.utils";
import type { FindingCategory } from "@/features/audits/audit-result.types";

type AuditCategoryBadgeProps = {
  category: FindingCategory;
};

export function AuditCategoryBadge({ category }: AuditCategoryBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-text-secondary">
      {FINDING_CATEGORY_LABELS[category]}
    </span>
  );
}
