"use client";

import { Calendar, Send, Target, TrendingUp, Users } from "lucide-react";
import type { DashboardKpi, MetricAccent } from "@/types/dashboard";
import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber } from "@/lib/formatters";
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

const countDelays = [100, 180, 260, 340] as const;

function Sparkline({
  data,
  color,
  delay = 0,
}: {
  data: number[];
  color: string;
  delay?: number;
}) {
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
    <div
      className="animate-reveal-x overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <svg width={width} height={height} className="overflow-visible" aria-hidden>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

export function MetricCard({
  metric,
  className,
  index = 0,
}: {
  metric: DashboardKpi;
  className?: string;
  index?: number;
}) {
  const styles = accentStyles[metric.accent];
  const Icon = icons[metric.id as keyof typeof icons] ?? Users;
  const countDelay = countDelays[index] ?? 100;
  const sparkDelay = countDelay + 120;

  const animatedValue = useCountUp({
    end: metric.numericValue,
    start: 0,
    duration: 1100,
    delay: countDelay,
  });

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
        <Sparkline data={metric.sparkline} color={styles.spark} delay={sparkDelay} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#64748B]">{metric.label}</p>
        <p
          className="mt-1 text-[30px] font-bold leading-9 tracking-[-0.03em] text-text-primary tabular-nums"
          suppressHydrationWarning
        >
          {formatNumber(animatedValue)}
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
