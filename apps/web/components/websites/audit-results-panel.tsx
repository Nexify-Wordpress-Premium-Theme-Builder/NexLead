import { AuditFindingsPanel } from "@/components/websites/audit-findings-panel";
import { AuditResultEmptyState } from "@/components/websites/audit-result-empty-state";
import { AuditScoresPanel } from "@/components/websites/audit-scores-panel";
import type { WebsiteAuditResult } from "@/features/audits/audit-result.types";

type AuditResultsPanelProps = {
  result: WebsiteAuditResult;
};

export function AuditResultsPanel({ result }: AuditResultsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Analiz Sonuçları</h2>

      <div className="mt-4 space-y-6">
        {result.state === "completed_with_data" ? (
          <>
            {result.scores ? <AuditScoresPanel scores={result.scores} /> : null}
            <AuditFindingsPanel findings={result.findings} />
          </>
        ) : (
          <AuditResultEmptyState state={result.state} />
        )}
      </div>
    </section>
  );
}
