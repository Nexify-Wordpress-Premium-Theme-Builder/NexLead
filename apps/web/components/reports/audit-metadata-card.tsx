import type { AuditReport } from "@/features/reports/report.types";
import { shortenAuditId } from "@/features/reports/report.utils";
import { formatWebsiteDate } from "@/features/websites/website.utils";

const AUDIT_TYPE_LABELS = {
  full: "Tam",
  quick: "Hızlı",
  manual: "Manuel",
  scheduled: "Zamanlanmış",
} as const;

type AuditMetadataCardProps = {
  report: AuditReport;
};

function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return "—";
  }

  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1000).toFixed(1)} sn`;
}

export function AuditMetadataCard({ report }: AuditMetadataCardProps) {
  const { audit, jobInfo } = report;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Analiz Meta Verisi</h2>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Audit ID</dt>
          <dd className="mt-0.5 font-mono text-xs text-text-primary">{shortenAuditId(audit.id)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Analiz tipi</dt>
          <dd className="mt-0.5 text-text-primary">{AUDIT_TYPE_LABELS[audit.type]}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Durum</dt>
          <dd className="mt-0.5 text-text-primary">{audit.status}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Süre</dt>
          <dd className="mt-0.5 text-text-primary">{formatDuration(audit.duration_ms)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Oluşturulma</dt>
          <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.created_at)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Başlangıç</dt>
          <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.started_at)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Tamamlanma</dt>
          <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(audit.completed_at)}</dd>
        </div>
        {jobInfo ? (
          <>
            <div>
              <dt className="text-text-muted">Worker durumu</dt>
              <dd className="mt-0.5 text-text-primary">{jobInfo.status}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Motor</dt>
              <dd className="mt-0.5 text-text-primary">{jobInfo.engine ?? "—"}</dd>
            </div>
          </>
        ) : null}
      </dl>
    </section>
  );
}
