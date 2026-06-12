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
    ? "bg-[#16A34A]/12 text-[#16A34A]"
    : isDown
      ? "bg-[#DC2626]/12 text-[#DC2626]"
      : "bg-[#F1F5F9] text-[#64748B]";

  return (
    <span className={`trend-pill text-[12px] font-extrabold ${tone}`}>
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
  const sparklineValues = sparkline ?? [3, 4, 3, 5, 4, 6, 5, 7, 6, 8];

  return (
    <PremiumCard
      padding="kpi"
      className={`dashboard-stagger-item kpi-card flex h-[150px] flex-col ${delayClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`icon-badge kpi-icon-badge ${accentClassName}`}>{icon}</div>
        <MiniSparkline
          values={sparklineValues}
          color={sparklineColor}
          className="sparkline-draw h-[38px] w-[92px] shrink-0"
        />
      </div>

      <div className="mt-2.5 min-w-0">
        <p className="dashboard-label truncate">{label}</p>
        <p className="dashboard-metric-value mt-1 tabular-nums">
          {displayValue ?? <AnimatedNumber value={value} />}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        {trend ? <TrendBadge trend={trend} /> : <span />}
        <span className="text-[11px] font-semibold text-[#94A3B8]">önceki 30 güne göre</span>
      </div>
    </PremiumCard>
  );
}
