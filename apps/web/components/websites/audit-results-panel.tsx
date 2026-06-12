import { AuditReportLink } from "@/components/reports/audit-report-link";
import { AuditFindingsPanel } from "@/components/websites/audit-findings-panel";
import { AuditResultEmptyState } from "@/components/websites/audit-result-empty-state";
import { AuditScoresPanel } from "@/components/websites/audit-scores-panel";
import type { WebsiteAuditResult } from "@/features/audits/audit-result.types";

type AuditResultsPanelProps = {
  result: WebsiteAuditResult;
};

function canOpenReport(state: WebsiteAuditResult["state"]): boolean {
  return state === "completed_with_data" || state === "completed_empty";
}

export function AuditResultsPanel({ result }: AuditResultsPanelProps) {
  const showReportLink = result.latestAudit && canOpenReport(result.state);

  return (
    <section className="nx-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text-primary">Analiz Sonuçları</h2>
        {showReportLink ? <AuditReportLink auditId={result.latestAudit!.id} /> : null}
      </div>

      <div className="mt-4 space-y-6">
        {result.state === "completed_with_data" || result.state === "completed_empty" ? (
          <>
            {result.scores ? <AuditScoresPanel scores={result.scores} /> : null}
            {result.findings.length > 0 ? (
              <AuditFindingsPanel findings={result.findings} />
            ) : (
              <AuditResultEmptyState state="completed_empty" />
            )}
          </>
        ) : (
          <AuditResultEmptyState state={result.state} />
        )}
      </div>
    </section>
  );
}
