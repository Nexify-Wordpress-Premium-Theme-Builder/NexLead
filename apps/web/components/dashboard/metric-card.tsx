import type { ReactNode } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { MiniSparkline } from "@/components/dashboard/mini-sparkline";
import type { DashboardKpiTrend } from "@/features/dashboard/dashboard.types";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  trend?: DashboardKpiTrend;
  sparkline?: number[];
  sparklineColor?: string;
  accentClassName?: string;
  delayClassName?: string;
  displayValue?: string;
};

function TrendBadge({ trend }: { trend: DashboardKpiTrend }) {
  const isUp = trend.direction === "up";
  const isDown = trend.direction === "down";
  const colorClass = isUp
    ? "text-success"
    : isDown
      ? "text-error"
      : "text-text-muted";

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${colorClass}`}>
      {isUp ? "↑" : isDown ? "↓" : "—"}
      {trend.percent.toFixed(1)}%
    </span>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  sparkline,
  sparklineColor = "#2563EB",
  accentClassName = "bg-accent/10 text-accent",
  delayClassName,
  displayValue,
}: MetricCardProps) {
  return (
    <article
      className={`dashboard-stagger-item group relative overflow-hidden rounded-xl border border-border bg-surface p-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:p-4 ${delayClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClassName}`}
        >
          {icon}
        </div>
        {sparkline ? (
          <MiniSparkline
            values={sparkline}
            color={sparklineColor}
            className="h-6 w-14 opacity-80"
          />
        ) : null}
      </div>

      <p className="mt-2.5 text-xs font-medium text-text-secondary">{label}</p>

      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-[-0.03em] text-text-primary tabular-nums">
          {displayValue ?? <AnimatedNumber value={value} />}
        </p>
        {trend ? <TrendBadge trend={trend} /> : null}
      </div>

      {trend ? (
        <p className="mt-1 text-[11px] text-text-muted">önceki 30 güne göre</p>
      ) : null}
    </article>
  );
}
