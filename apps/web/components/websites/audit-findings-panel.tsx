import { AuditFindingCard } from "@/components/websites/audit-finding-card";
import type { AuditFindingItem } from "@/features/audits/audit-result.types";

type AuditFindingsPanelProps = {
  findings: AuditFindingItem[];
};

export function AuditFindingsPanel({ findings }: AuditFindingsPanelProps) {
  if (findings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">Bulgular</h3>
      <div className="space-y-3">
        {findings.map((finding) => (
          <AuditFindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </div>
  );
}
