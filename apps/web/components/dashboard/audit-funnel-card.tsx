import {
  IconActivity,
  IconCheckCircle,
  IconFileText,
  IconGlobe,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";
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
    <section className="rounded-2xl border border-border/90 bg-surface p-4 shadow-soft sm:p-5">
      <h2 className="text-dashboard-section text-text-heading">Analiz Hunisi</h2>
      <p className="mt-1 text-[12px] font-medium text-text-secondary">Lead&apos;den aksiyona dönüşüm</p>

      <div className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const width = Math.max((step.value / maxValue) * 100, 10);
          const isLast = index === steps.length - 1;
          const Icon = STEP_ICONS[step.label] ?? IconCheckCircle;

          return (
            <div key={step.label}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-accent">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate text-[12px] font-semibold text-text-heading">{step.label}</span>
                </div>
                <span className="shrink-0 text-[12px] font-bold tabular-nums text-text-primary">{step.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent via-accent-purple to-success transition-all duration-700"
                  style={{ width: `${width}%` }}
                />
              </div>
              {!isLast && step.conversionPercent !== null ? (
                <p className="mt-1 text-[11px] font-medium text-text-muted">
                  Dönüşüm %{step.conversionPercent}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
