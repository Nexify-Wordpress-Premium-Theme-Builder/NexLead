import { CircularScore } from "@/components/dashboard/circular-score";
import { AnalysisInsightsCard } from "@/components/dashboard/analysis-insights-card";
import type { DashboardCircularScoreItem } from "@/features/dashboard/dashboard.types";

const SCORE_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#EA580C", "#0891B2"];

type AnalysisSummaryCardProps = {
  circularScores: DashboardCircularScoreItem[];
  insights: string[];
};

export function AnalysisSummaryCard({ circularScores, insights }: AnalysisSummaryCardProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
        <h2 className="text-base font-semibold text-text-primary">Site Analizi Özeti</h2>
        <p className="mt-1 text-sm text-text-muted">
          Tamamlanan analizlerden türetilen skor özeti
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
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
