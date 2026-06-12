import { AuditMetadataCard } from "@/components/reports/audit-metadata-card";
import { AuditReportHeader } from "@/components/reports/audit-report-header";
import { AuditSummaryCard } from "@/components/reports/audit-summary-card";
import { PriorityActionsCard } from "@/components/reports/priority-actions-card";
import { ReportContextCard } from "@/components/reports/report-context-card";
import { ReportFindingsSection } from "@/components/reports/report-findings-section";
import { ReportNotReady } from "@/components/reports/report-not-ready";
import { ReportScoreOverview } from "@/components/reports/report-score-overview";
import { TechnicalSignalsCard } from "@/components/reports/technical-signals-card";
import type { AuditReport } from "@/features/reports/report.types";

type AuditReportPageContentProps = {
  report: AuditReport;
};

export function AuditReportPageContent({ report }: AuditReportPageContentProps) {
  const showFullReport =
    report.state === "ready" || report.state === "limited";

  return (
    <div className="animate-fade-up mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden">
      <AuditReportHeader report={report} />

      {!showFullReport ? (
        <ReportNotReady report={report} />
      ) : (
        <>
          <AuditSummaryCard report={report} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <ReportScoreOverview scores={report.scores} />
              <PriorityActionsCard actions={report.priorityActions} />
              <ReportFindingsSection findings={report.findings} />
            </div>

            <div className="space-y-6">
              <TechnicalSignalsCard signals={report.technicalSignals} />
              <ReportContextCard report={report} />
              <AuditMetadataCard report={report} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
