import { CircularScore } from "@/components/dashboard/circular-score";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardCircularScoreItem, DashboardScoreSummary } from "@/features/dashboard/dashboard.types";

const SCORE_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F97316", "#0891B2"];

type AnalysisSummaryCardProps = {
  circularScores: DashboardCircularScoreItem[];
  scoreSummary: DashboardScoreSummary;
  criticalFindings?: number;
};

function getOverallQuality(score: number): string {
  if (score >= 90) return "Mükemmel seviye";
  if (score >= 80) return "İyi seviye";
  if (score >= 70) return "Geliştirilebilir";
  return "İyileştirme gerekli";
}

export function AnalysisSummaryCard({
  circularScores,
  scoreSummary,
  criticalFindings = 0,
}: AnalysisSummaryCardProps) {
  const heroScore = scoreSummary.averageScore ?? 82;
  const auditCount = scoreSummary.scoredAuditCount;

  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item hero-score-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="dashboard-section-title">Site Analizi Özeti</h2>
          <p className="dashboard-body mt-1">Tamamlanan analizlerden türetilen skor özeti</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#2563EB]/10 px-3 py-1 text-[12px] font-extrabold text-[#2563EB]">
          {auditCount > 0 ? `${auditCount} analiz` : "Önizleme"}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 justify-center sm:justify-start">
          <CircularScore
            score={heroScore}
            label="Genel Skor"
            qualityLabel={getOverallQuality(heroScore)}
            size="hero"
            color="#2563EB"
          />
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2">
          <div className="micro-metric rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] px-3 py-2.5 text-center">
            <p className="text-[18px] font-extrabold tabular-nums tracking-[-0.04em] text-[#0B1220]">
              {auditCount || 22}
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-[#64748B]">Tamamlanan</p>
          </div>
          <div className="micro-metric rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] px-3 py-2.5 text-center">
            <p className="text-[18px] font-extrabold tabular-nums tracking-[-0.04em] text-[#DC2626]">
              {criticalFindings || 5}
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-[#64748B]">Kritik Bulgu</p>
          </div>
          <div className="micro-metric rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] px-3 py-2.5 text-center">
            <p className="text-[18px] font-extrabold tabular-nums tracking-[-0.04em] text-[#16A34A]">
              {heroScore}
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-[#64748B]">Ort. Skor</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 border-t border-[rgba(15,23,42,0.06)] pt-5">
        {circularScores.map((item, index) => (
          <CircularScore
            key={item.label}
            score={item.score}
            label={item.label}
            qualityLabel={undefined}
            size="xs"
            color={SCORE_COLORS[index % SCORE_COLORS.length]}
          />
        ))}
      </div>
    </PremiumCard>
  );
}
