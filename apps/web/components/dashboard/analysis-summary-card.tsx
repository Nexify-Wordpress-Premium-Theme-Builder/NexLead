import { CircularScore } from "@/components/dashboard/circular-score";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardCircularScoreItem, DashboardScoreSummary } from "@/features/dashboard/dashboard.types";

const SCORE_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F97316", "#0891B2"];

type AnalysisSummaryCardProps = {
  circularScores: DashboardCircularScoreItem[];
  scoreSummary: DashboardScoreSummary;
};

export function AnalysisSummaryCard({ circularScores, scoreSummary }: AnalysisSummaryCardProps) {
  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="dashboard-section-title">Site Analizi Özeti</h2>
          <p className="dashboard-body mt-1">Tamamlanan analizlerden türetilen skor özeti</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#2563EB]/10 px-3 py-1 text-[12px] font-extrabold text-[#2563EB]">
          {scoreSummary.scoredAuditCount > 0 ? `${scoreSummary.scoredAuditCount} analiz` : "Önizleme"}
        </span>
      </div>

      {scoreSummary.averageScore !== null ? (
        <p className="mt-3 text-[14px] font-medium text-[#64748B]">
          Ortalama skor:{" "}
          <span className="font-extrabold text-[#0B1220]">{scoreSummary.averageScore}</span>
          <span className="text-[#94A3B8]"> / 100</span>
        </p>
      ) : null}

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
    </PremiumCard>
  );
}
