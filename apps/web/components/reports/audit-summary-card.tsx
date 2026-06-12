import { NULL_SCORE_LABEL } from "@/features/audits/audit-result.utils";
import type { AuditReport } from "@/features/reports/report.types";

type AuditSummaryCardProps = {
  report: AuditReport;
};

export function AuditSummaryCard({ report }: AuditSummaryCardProps) {
  const overallScore = report.scores?.overallScore ?? report.audit.overall_score;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Özet</h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">{report.summaryText}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-text-muted">Bulgu sayısı</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-text-primary">
                {report.findingCount}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Kritik / yüksek</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-text-primary">
                {report.highSeverityCount}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Genel skor</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-text-primary">
                {overallScore !== null ? overallScore : NULL_SCORE_LABEL}
              </dd>
            </div>
          </dl>
        </div>

        {report.jobInfo?.fetchOk !== null && report.jobInfo?.fetchOk !== undefined ? (
          <div className="rounded-xl border border-border bg-surface-soft/50 px-4 py-3 text-sm">
            <p className="text-text-muted">Fetch durumu</p>
            <p className="mt-1 font-medium text-text-primary">
              {report.jobInfo.fetchOk ? "Web sitesi erişimi doğrulandı" : "Web sitesi erişimi sınırlı"}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
