import { FINDING_SEVERITY_LABELS } from "@/features/audits/audit-result.utils";
import type { FindingSeverity } from "@/features/audits/audit-result.types";

const SEVERITY_STYLES: Record<FindingSeverity, string> = {
  info: "bg-surface-soft text-text-muted",
  low: "bg-blue-50 text-blue-700",
  medium: "bg-amber-50 text-amber-800",
  high: "bg-orange-50 text-orange-800",
  critical: "bg-red-50 text-red-700",
};

type AuditSeverityBadgeProps = {
  severity: FindingSeverity;
};

export function AuditSeverityBadge({ severity }: AuditSeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${SEVERITY_STYLES[severity]}`}
    >
      {FINDING_SEVERITY_LABELS[severity]}
    </span>
  );
}
