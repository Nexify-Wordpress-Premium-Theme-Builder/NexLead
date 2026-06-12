import {
  IconAlertTriangle,
  IconLink,
  IconTarget,
  IconTrendingUp,
  IconZap,
} from "@/components/ui/icons";
import type { DashboardInsightItem, DashboardInsightTone } from "@/features/dashboard/dashboard.types";

type AnalysisInsightsCardProps = {
  insights: DashboardInsightItem[];
};

const TONE_STYLES: Record<
  DashboardInsightTone,
  { icon: typeof IconAlertTriangle; accent: string; bg: string }
> = {
  critical: { icon: IconAlertTriangle, accent: "text-error", bg: "bg-error/10" },
  seo: { icon: IconTarget, accent: "text-accent-purple", bg: "bg-accent-purple/10" },
  lead: { icon: IconLink, accent: "text-accent", bg: "bg-accent/10" },
  performance: { icon: IconTrendingUp, accent: "text-success", bg: "bg-success/10" },
  info: { icon: IconZap, accent: "text-warning", bg: "bg-warning/10" },
};

export function AnalysisInsightsCard({ insights }: AnalysisInsightsCardProps) {
  return (
    <div className="dashboard-right-panel-item rounded-2xl border border-border/90 bg-surface p-4 shadow-soft sm:p-5">
      <h3 className="dashboard-section-title">Analiz İçgörüleri</h3>
      <p className="mt-1 text-[12px] font-medium text-text-secondary">
        Öncelikli bulgular ve önerilen aksiyonlar
      </p>

      <ul className="mt-4 space-y-3">
        {insights.map((insight) => {
          const tone = TONE_STYLES[insight.tone];
          const Icon = tone.icon;

          return (
            <li
              key={insight.id}
              className="flex gap-3 rounded-xl border border-border/70 bg-surface-soft/35 p-3"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${tone.bg} ${tone.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-text-heading">{insight.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-text-secondary">
                  {insight.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
