import { CircularScore } from "@/components/dashboard/circular-score";
import type {
  DashboardScoreSummary,
  DashboardSeveritySummary,
} from "@/features/dashboard/dashboard.types";

const SEVERITY_LABELS = {
  critical: "Kritik",
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
  info: "Bilgi",
} as const;

const SEVERITY_COLORS = {
  critical: "bg-error",
  high: "bg-warning",
  medium: "bg-accent",
  low: "bg-accent-purple/70",
  info: "bg-text-muted",
} as const;

type AnalysisSummaryCardProps = {
  scoreSummary: DashboardScoreSummary;
  severitySummary: DashboardSeveritySummary;
};

export function AnalysisSummaryCard({
  scoreSummary,
  severitySummary,
}: AnalysisSummaryCardProps) {
  const severityItems = (
    ["critical", "high", "medium", "low", "info"] as const
  ).filter((key) => severitySummary[key] > 0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Site Analizi Özeti</h2>
      <p className="mt-1 text-sm text-text-muted">
        Tamamlanan analizlerden türetilmiş skor ve bulgu dağılımı
      </p>

      <div className="mt-6 flex flex-col items-center">
        <CircularScore score={scoreSummary.averageScore} label="Ortalama Skor" />
        <p className="mt-4 text-center text-sm text-text-secondary">
          {scoreSummary.scoredAuditCount > 0
            ? `${scoreSummary.scoredAuditCount} tamamlanmış analiz skoru`
            : "Henüz analiz sonucu bulunmuyor"}
        </p>
      </div>

      {severitySummary.total > 0 ? (
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <p className="text-sm font-medium text-text-primary">Bulgu Önem Dağılımı</p>
          {severityItems.map((severity) => {
            const count = severitySummary[severity];
            const width = Math.max((count / severitySummary.total) * 100, 6);

            return (
              <div key={severity}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{SEVERITY_LABELS[severity]}</span>
                  <span className="font-medium tabular-nums text-text-primary">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
                  <div
                    className={`h-full rounded-full ${SEVERITY_COLORS[severity]}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface-soft/40 px-4 py-5 text-center">
          <p className="text-sm text-text-secondary">Henüz bulgu kaydı bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}
