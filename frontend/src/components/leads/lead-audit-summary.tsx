import type { WebsiteAudit } from "@shared/types/audit";

export function LeadAuditSummary({ audit }: { audit: WebsiteAudit }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm text-text-secondary">Audit score</p>
      <p className="text-2xl font-semibold text-text-primary">{audit.score}</p>
    </div>
  );
}
