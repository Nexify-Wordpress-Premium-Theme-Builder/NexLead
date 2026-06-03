import type { AuditIssue } from "@shared/types/audit";

export function AuditIssueCard({ issue }: { issue: AuditIssue }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{issue.title}</p>
      <p className="text-sm text-text-secondary">{issue.description}</p>
    </div>
  );
}
