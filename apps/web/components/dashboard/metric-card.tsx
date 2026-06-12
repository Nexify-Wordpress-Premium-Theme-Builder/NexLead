import type { ReactNode } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { MiniSparkline } from "@/components/dashboard/mini-sparkline";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
  sparkline?: number[];
  accentClassName?: string;
  delayClassName?: string;
  displayValue?: string;
};

export function MetricCard({
  icon,
  label,
  value,
  description,
  sparkline,
  accentClassName = "bg-accent/10 text-accent",
  delayClassName,
  displayValue,
}: MetricCardProps) {
  return (
    <article
      className={`dashboard-stagger-item group rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${delayClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text-primary">
            {displayValue ?? <AnimatedNumber value={value} />}
          </p>
          <p className="mt-2 text-sm text-text-muted">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClassName}`}
        >
          {icon}
        </div>
      </div>
      {sparkline ? (
        <div className="mt-4 border-t border-border pt-3">
          <MiniSparkline values={sparkline} className="h-7 w-[72px]" />
        </div>
      ) : null}
    </article>
  );
}
