import {
  IconActivity,
  IconCheckCircle,
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

export function AuditFunnelCard({ steps }: AuditFunnelCardProps) {
  const maxValue = Math.max(...steps.map((step) => step.value), 1);

  return (
    <PremiumCard padding="panel" className="dashboard-right-panel-item">
      <h2 className="dashboard-section-title">Analiz Hunisi</h2>
      <p className="dashboard-body mt-1">Lead&apos;den aksiyona dönüşüm</p>

      <div className="mt-5 space-y-4">
        {steps.map((step, index) => {
          const width = Math.max((step.value / maxValue) * 100, 12);
          const isLast = index === steps.length - 1;
          const Icon = STEP_ICONS[step.label] ?? IconCheckCircle;

          return (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-white text-[#2563EB] shadow-sm">
                <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-[#0F172A]">{step.label}</span>
                  <span className="text-[14px] font-extrabold tabular-nums text-[#0B1220]">{step.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#16A34A] transition-all duration-700"
                    style={{ width: `${width}%` }}
                  />
                </div>
                {!isLast && step.conversionPercent !== null ? (
                  <p className="mt-1 text-[11px] font-semibold text-[#94A3B8]">Dönüşüm %{step.conversionPercent}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}
