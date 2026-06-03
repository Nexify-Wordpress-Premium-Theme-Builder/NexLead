import { Calendar, Send, Target, TrendingUp, Users } from "lucide-react";
import type { DashboardKpi, MetricAccent } from "@/types/dashboard";
import { cn } from "@/lib/cn";

const accentStyles: Record<
  MetricAccent,
  { iconBg: string; iconText: string; spark: string; trend: string }
> = {
  blue: {
    iconBg: "bg-primary-soft",
    iconText: "text-primary",
    spark: "#2563EB",
    trend: "text-primary",
  },
  green: {
    iconBg: "bg-green-soft",
    iconText: "text-green",
    spark: "#16A34A",
    trend: "text-green",
  },
  purple: {
    iconBg: "bg-purple-soft",
    iconText: "text-purple",
    spark: "#7C3AED",
    trend: "text-purple",
  },
  orange: {
    iconBg: "bg-orange-soft",
    iconText: "text-orange",
    spark: "#F59E0B",
    trend: "text-orange",
  },
};

const icons = {
  "total-leads": Users,
  "high-opportunity": Target,
  "outreach-sent": Send,
  "meetings-booked": Calendar,
} as const;

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 88;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MetricCard({ metric }: { metric: DashboardKpi }) {
  const styles = accentStyles[metric.accent];
  const Icon = icons[metric.id as keyof typeof icons] ?? Users;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            styles.iconBg,
            styles.iconText,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <Sparkline data={metric.sparkline} color={styles.spark} />
      </div>
      <p className="mt-4 text-sm font-medium text-text-secondary">{metric.label}</p>
      <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-text-primary">
        {metric.value}
      </p>
      <p className={cn("mt-2 flex items-center gap-1 text-xs font-medium", styles.trend)}>
        <TrendingUp className="h-3.5 w-3.5" />
        <span>↗ {metric.trendPercent}%</span>
        <span className="font-normal text-text-muted">{metric.trendLabel}</span>
      </p>
    </div>
  );
}
