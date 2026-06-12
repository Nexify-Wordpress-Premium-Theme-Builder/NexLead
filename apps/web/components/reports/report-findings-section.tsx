import { AuditFindingCard } from "@/components/websites/audit-finding-card";
import type { AuditFindingItem } from "@/features/audits/audit-result.types";

type ReportFindingsSectionProps = {
  findings: AuditFindingItem[];
};

export function ReportFindingsSection({ findings }: ReportFindingsSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Bulgular</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Önem sırasına göre listelenmiş analiz bulguları.
      </p>

      {findings.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">Bu rapor için bulgu kaydı bulunmuyor.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {findings.map((finding) => (
            <AuditFindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      )}
    </section>
  );
}
