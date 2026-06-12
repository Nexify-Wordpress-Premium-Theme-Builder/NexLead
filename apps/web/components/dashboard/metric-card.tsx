import type { ReactNode } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { MiniSparkline } from "@/components/dashboard/mini-sparkline";
import { PremiumCard } from "@/components/ui/premium-card";
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
  const tone = isUp
    ? "bg-[#16A34A]/10 text-[#16A34A]"
    : isDown
      ? "bg-[#DC2626]/10 text-[#DC2626]"
      : "bg-[#F1F5F9] text-[#64748B]";

  return (
    <span className={`trend-pill ${tone}`}>
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
  accentClassName = "bg-[#2563EB]/10 text-[#2563EB]",
  delayClassName,
  displayValue,
}: MetricCardProps) {
  return (
    <PremiumCard
      padding="kpi"
      className={`dashboard-stagger-item flex h-[158px] flex-col ${delayClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`icon-badge ${accentClassName}`}>{icon}</div>
        {sparkline ? (
          <MiniSparkline values={sparkline} color={sparklineColor} className="h-9 w-[84px] shrink-0" />
        ) : (
          <span className="h-9 w-[84px] shrink-0" aria-hidden="true" />
        )}
      </div>

      <p className="dashboard-label mt-3">{label}</p>

      <div className="mt-auto flex items-end justify-between gap-2 pt-1">
        <p className="dashboard-metric-value tabular-nums">
          {displayValue ?? <AnimatedNumber value={value} />}
        </p>
        {trend ? <TrendBadge trend={trend} /> : null}
      </div>

      {trend ? (
        <p className="mt-1 text-[12px] font-medium text-[#94A3B8]">önceki 30 güne göre</p>
      ) : (
        <span className="mt-1 block h-[18px]" aria-hidden="true" />
      )}
    </PremiumCard>
  );
}
