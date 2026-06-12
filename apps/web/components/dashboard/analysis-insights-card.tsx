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
    pill: "bg-[#DC2626]/12 text-[#DC2626]",
  },
  seo: {
    icon: IconTarget,
    accent: "text-[#7C3AED]",
    bg: "bg-[#7C3AED]/10",
    pill: "bg-[#7C3AED]/12 text-[#7C3AED]",
  },
  lead: {
    icon: IconLink,
    accent: "text-[#2563EB]",
    bg: "bg-[#2563EB]/10",
    pill: "bg-[#2563EB]/12 text-[#2563EB]",
  },
  performance: {
    icon: IconTrendingUp,
    accent: "text-[#16A34A]",
    bg: "bg-[#16A34A]/10",
    pill: "bg-[#16A34A]/12 text-[#16A34A]",
  },
  info: {
    icon: IconZap,
    accent: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    pill: "bg-[#F97316]/12 text-[#F97316]",
  },
};

const TONE_PILL_LABEL: Record<DashboardInsightTone, string> = {
  critical: "Kritik",
  seo: "SEO",
  lead: "Aksiyon",
  performance: "Performans",
  info: "Bilgi",
};

export function AnalysisInsightsCard({ insights }: AnalysisInsightsCardProps) {
  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item">
      <h3 className="dashboard-section-title">Analiz İçgörüleri</h3>
      <p className="dashboard-body mt-1">Öncelikli bulgular ve önerilen aksiyonlar</p>

      <ul className="mt-4 space-y-2.5">
        {insights.map((insight, index) => {
          const tone = TONE_STYLES[insight.tone];
          const Icon = tone.icon;

          return (
            <li
              key={insight.id}
              className="insight-row-stagger insight-action-row group flex items-start gap-3 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] p-3.5 transition-colors hover:border-[rgba(37,99,235,0.12)] hover:bg-[#F1F5FF]"
              style={{ animationDelay: `${0.12 + index * 0.07}s` }}
            >
              <div className={`insight-icon-badge flex shrink-0 items-center justify-center rounded-2xl ${tone.bg} ${tone.accent}`}>
                <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold text-[#0B1220]">{insight.title}</p>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#64748B]">{insight.description}</p>
              </div>
              <span className={`shrink-0 self-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${tone.pill}`}>
                {TONE_PILL_LABEL[insight.tone]}
              </span>
            </li>
          );
        })}
      </ul>
    </PremiumCard>
  );
}
