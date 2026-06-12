import {
  IconAlertTriangle,
  IconLink,
  IconTarget,
  IconTrendingUp,
  IconZap,
} from "@/components/ui/icons";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardInsightItem, DashboardInsightTone } from "@/features/dashboard/dashboard.types";

type AnalysisInsightsCardProps = {
  insights: DashboardInsightItem[];
};

const TONE_STYLES: Record<
  DashboardInsightTone,
  { icon: typeof IconAlertTriangle; accent: string; bg: string; pill: string }
> = {
  critical: {
    icon: IconAlertTriangle,
    accent: "text-[#DC2626]",
    bg: "bg-[#DC2626]/10",
    pill: "bg-[#DC2626]/10 text-[#DC2626]",
  },
  seo: {
    icon: IconTarget,
    accent: "text-[#7C3AED]",
    bg: "bg-[#7C3AED]/10",
    pill: "bg-[#7C3AED]/10 text-[#7C3AED]",
  },
  lead: {
    icon: IconLink,
    accent: "text-[#2563EB]",
    bg: "bg-[#2563EB]/10",
    pill: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  performance: {
    icon: IconTrendingUp,
    accent: "text-[#16A34A]",
    bg: "bg-[#16A34A]/10",
    pill: "bg-[#16A34A]/10 text-[#16A34A]",
  },
  info: {
    icon: IconZap,
    accent: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    pill: "bg-[#F97316]/10 text-[#F97316]",
  },
};

const TONE_PILL_LABEL: Record<DashboardInsightTone, string> = {
  critical: "Kritik",
  seo: "SEO",
  lead: "Lead",
  performance: "Performans",
  info: "Bilgi",
};

export function AnalysisInsightsCard({ insights }: AnalysisInsightsCardProps) {
  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item">
      <h3 className="dashboard-section-title">Analiz İçgörüleri</h3>
      <p className="dashboard-body mt-1">Öncelikli bulgular ve önerilen aksiyonlar</p>

      <ul className="mt-4 space-y-3">
        {insights.map((insight, index) => {
          const tone = TONE_STYLES[insight.tone];
          const Icon = tone.icon;

          return (
            <li
              key={insight.id}
              className="insight-row-stagger flex gap-3 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] p-3.5"
              style={{ animationDelay: `${0.12 + index * 0.07}s` }}
            >
              <div className={`icon-badge icon-badge-lg ${tone.bg} ${tone.accent}`}>
                <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-extrabold text-[#0F172A]">{insight.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tone.pill}`}>
                    {TONE_PILL_LABEL[insight.tone]}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">{insight.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </PremiumCard>
  );
}
