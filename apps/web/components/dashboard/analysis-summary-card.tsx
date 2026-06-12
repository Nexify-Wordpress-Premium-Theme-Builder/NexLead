import { CircularScore } from "@/components/dashboard/circular-score";
import { AnalysisInsightsCard } from "@/components/dashboard/analysis-insights-card";
import type {
  DashboardCircularScoreItem,
  DashboardInsightItem,
  DashboardScoreSummary,
} from "@/features/dashboard/dashboard.types";

const SCORE_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F97316", "#0891B2"];

type AnalysisSummaryCardProps = {
  circularScores: DashboardCircularScoreItem[];
  insights: DashboardInsightItem[];
  scoreSummary: DashboardScoreSummary;
};

export function AnalysisSummaryCard({
  circularScores,
  insights,
  scoreSummary,
}: AnalysisSummaryCardProps) {
  return (
    <div className="dashboard-right-panel flex h-full flex-col gap-3.5">
      <div className="dashboard-right-panel-item rounded-2xl border border-border/90 bg-surface p-4 shadow-soft sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="dashboard-section-title">Site Analizi Özeti</h2>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-text-secondary">
              Tamamlanan analizlerden türetilen skor özeti
            </p>
          </div>
          {scoreSummary.scoredAuditCount > 0 ? (
            <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
              {scoreSummary.scoredAuditCount} analiz
            </span>
          ) : null}
        </div>

        {scoreSummary.averageScore !== null ? (
          <p className="mt-3 text-[13px] text-text-secondary">
            Ortalama skor:{" "}
            <span className="font-bold text-text-primary">{scoreSummary.averageScore}</span>
            <span className="text-text-muted"> / 100</span>
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3">
          {circularScores.map((item, index) => (
            <CircularScore
              key={item.label}
              score={item.score}
              label={item.label}
              qualityLabel={item.qualityLabel}
              size="sm"
              color={SCORE_COLORS[index % SCORE_COLORS.length]}
            />
          ))}
        </div>
      </div>

      <AnalysisInsightsCard insights={insights} />
    </div>
  );
}
