import {
  IconActivity,
  IconCheckCircle,
  IconChevronRight,
  IconFileText,
  IconGlobe,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardFunnelStep } from "@/features/dashboard/dashboard.types";

type AuditFunnelCardProps = {
  steps: DashboardFunnelStep[];
};

const STEP_ICONS: Record<string, typeof IconUsers> = {
  Lead: IconUsers,
  "Web Site": IconGlobe,
  "Web Sitesi": IconGlobe,
  Analiz: IconActivity,
  Rapor: IconFileText,
  Aksiyon: IconZap,
};

const STEP_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F97316", "#0891B2"];

export function AuditFunnelCard({ steps }: AuditFunnelCardProps) {
  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item">
      <h2 className="dashboard-section-title">Analiz Hunisi</h2>
      <p className="dashboard-body mt-1">Lead&apos;den aksiyona dönüşüm akışı</p>

      <div className="funnel-stagger mt-5 flex flex-wrap items-start justify-between gap-y-4">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[step.label] ?? IconCheckCircle;
          const color = STEP_COLORS[index % STEP_COLORS.length];
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.label}
              className="funnel-step-item flex min-w-[72px] flex-1 flex-col items-center"
              style={{ animationDelay: `${0.1 + index * 0.06}s` }}
            >
              <div className="flex w-full items-center justify-center">
                {index > 0 ? (
                  <IconChevronRight className="mr-1 hidden h-4 w-4 shrink-0 text-[#CBD5E1] sm:block" strokeWidth={2.2} />
                ) : null}
                <div
                  className="funnel-icon-circle nx-icon-badge nx-icon-badge--blue h-[42px] w-[42px] rounded-full"
                  style={{ color }}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
                </div>
                {!isLast ? (
                  <IconChevronRight className="ml-1 hidden h-4 w-4 shrink-0 text-[#CBD5E1] sm:block" strokeWidth={2.2} />
                ) : null}
              </div>
              <p className="mt-2 text-[18px] font-extrabold tabular-nums tracking-[-0.04em] text-[#0B1220]">
                {step.value}
              </p>
              <p className="mt-0.5 text-center text-[12px] font-bold text-[#475569]">{step.label}</p>
              {step.conversionPercent !== null ? (
                <p className="mt-0.5 text-[10px] font-bold text-[#94A3B8]">%{step.conversionPercent}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}
