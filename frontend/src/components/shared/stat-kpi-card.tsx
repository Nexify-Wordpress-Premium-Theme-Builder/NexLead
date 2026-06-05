"use client";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/formatters";
import { panelClass } from "@/lib/panel";
import { useCountUp } from "@/hooks/use-count-up";
import type { PageAccent } from "@/types/pages";

const accentStyles: Record<PageAccent, string> = {
  blue: "text-primary",
  green: "text-green",
  purple: "text-purple",
  orange: "text-orange",
};

export interface StatKpiCardProps {
  label: string;
  numericValue: number;
  suffix?: string;
  prefix?: string;
  accent?: PageAccent;
  className?: string;
  duration?: number;
  decimals?: number;
}

function formatKpiValue(value: number, decimals?: number, suffix?: string): string {
  if (decimals && decimals > 0) {
    const factor = Math.pow(10, decimals);
    return `${(value / factor).toFixed(decimals)}${suffix ?? ""}`;
  }
  return `${formatNumber(value)}${suffix ?? ""}`;
}

export function StatKpiCard({
  label,
  numericValue,
  suffix,
  prefix,
  accent = "blue",
  className,
  duration = 1100,
  decimals,
}: StatKpiCardProps) {
  const count = useCountUp(numericValue, { duration, delay: 180 });

  return (
    <div
      className={cn(
        panelClass("flex min-h-[120px] flex-col justify-between p-6"),
        "animate-fade-up",
        className,
      )}
    >
      <p className="text-[13px] font-medium text-text-secondary">{label}</p>
      <p
        className={cn(
          "mt-2 text-[28px] font-bold leading-8 tracking-[-0.03em] tabular-nums text-text-primary",
          accent && accentStyles[accent],
        )}
      >
        {prefix}
        {formatKpiValue(count, decimals, suffix)}
      </p>
    </div>
  );
}
