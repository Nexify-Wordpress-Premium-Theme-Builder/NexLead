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
    <span className={`inline-flex items-center gap-0.5 rounded-md bg-surface-soft/80 px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${colorClass}`}>
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
      className={`dashboard-stagger-item group relative overflow-hidden rounded-xl border border-border/90 bg-surface p-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-card sm:p-4 ${delayClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ring-1 ring-inset ring-black/[0.04] ${accentClassName}`}
        >
          {icon}
        </div>
        {sparkline ? (
          <MiniSparkline
            values={sparkline}
            color={sparklineColor}
            className="h-6 w-16 shrink-0 opacity-90"
          />
        ) : (
          <span className="h-6 w-16 shrink-0" aria-hidden="true" />
        )}
      </div>

      <p className="dashboard-label mt-3">{label}</p>

      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="dashboard-metric-value tabular-nums">
          {displayValue ?? <AnimatedNumber value={value} className="font-bold" />}
        </p>
        {trend ? <TrendBadge trend={trend} /> : null}
      </div>

      {trend ? (
        <p className="mt-1.5 text-[11px] font-medium text-text-muted">önceki 30 güne göre</p>
      ) : null}
    </article>
  );
}
