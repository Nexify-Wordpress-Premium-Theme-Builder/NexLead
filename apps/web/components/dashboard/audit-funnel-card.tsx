import type { DashboardFunnelStep } from "@/features/dashboard/dashboard.types";

type AuditFunnelCardProps = {
  steps: DashboardFunnelStep[];
};

export function AuditFunnelCard({ steps }: AuditFunnelCardProps) {
  const maxValue = Math.max(...steps.map((step) => step.value), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <h2 className="text-sm font-semibold text-text-primary">Analiz Hunisi</h2>
      <p className="mt-1 text-xs text-text-muted">Lead&apos;den aksiyona dönüşüm</p>

      <div className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const width = Math.max((step.value / maxValue) * 100, 8);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-text-secondary">{step.label}</span>
                <span className="tabular-nums text-text-primary">{step.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-purple transition-all duration-700"
                  style={{ width: `${width}%` }}
                />
              </div>
              {!isLast && step.conversionPercent !== null ? (
                <p className="mt-1 text-[11px] text-text-muted">
                  Dönüşüm: %{step.conversionPercent}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
