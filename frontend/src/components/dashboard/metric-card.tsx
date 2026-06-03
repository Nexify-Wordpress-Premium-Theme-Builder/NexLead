import { Calendar, Send, Target, TrendingUp, Users } from "lucide-react";
import type { DashboardKpi, MetricAccent } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";

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
  const width = 92;
  const height = 36;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible opacity-90" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MetricCard({
  metric,
  className,
}: {
  metric: DashboardKpi;
  className?: string;
}) {
  const styles = accentStyles[metric.accent];
  const Icon = icons[metric.id as keyof typeof icons] ?? Users;

  return (
    <div
      className={cn(
        panelClass("flex min-h-[156px] flex-col justify-between p-6"),
        "animate-fade-up",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-[42px] w-[42px] items-center justify-center rounded-[14px]",
            styles.iconBg,
            styles.iconText,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <Sparkline data={metric.sparkline} color={styles.spark} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#64748B]">{metric.label}</p>
        <p className="mt-1 text-[30px] font-bold leading-9 tracking-[-0.03em] text-text-primary">
          {metric.value}
        </p>
        <p className={cn("mt-2 flex items-center gap-1 text-xs font-medium", styles.trend)}>
          <TrendingUp className="h-3.5 w-3.5" />
          <span>↗ {metric.trendPercent}%</span>
          <span className="font-normal text-text-muted">{metric.trendLabel}</span>
        </p>
      </div>
    </div>
  );
}
