"use client";

import { Calendar, Send, Target, TrendingUp, Users } from "lucide-react";
import type { DashboardKpi, MetricAccent } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/formatters";
import { panelClass } from "@/lib/panel";
import { useCountUp } from "@/hooks/use-count-up";

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

const countDurations: Record<string, number> = {
  "total-leads": 1300,
  "high-opportunity": 1200,
  "outreach-sent": 1250,
  "meetings-booked": 1000,
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 88;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="animate-reveal-x overflow-visible opacity-80"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
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
  const count = useCountUp(metric.numericValue, {
    duration: countDurations[metric.id] ?? 1100,
    delay: 200,
  });

  return (
    <div
      className={cn(
        panelClass("flex min-h-[148px] flex-col justify-between p-6"),
        "animate-fade-up",
        className,
      )}
      style={{ animationDuration: "600ms" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[13px]",
            styles.iconBg,
            styles.iconText,
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <Sparkline data={metric.sparkline} color={styles.spark} />
      </div>
      <div>
        <p className="text-[13px] font-medium text-text-secondary">{metric.label}</p>
        <p
          className="mt-1 text-[28px] font-bold leading-8 tracking-[-0.03em] text-text-primary tabular-nums"
          aria-label={metric.value}
        >
          {formatNumber(count)}
        </p>
        <p className={cn("mt-1.5 flex items-center gap-1 text-xs font-medium", styles.trend)}>
          <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
          <span>{metric.trendPercent}%</span>
          <span className="font-normal text-text-muted">{metric.trendLabel}</span>
        </p>
      </div>
    </div>
  );
}
