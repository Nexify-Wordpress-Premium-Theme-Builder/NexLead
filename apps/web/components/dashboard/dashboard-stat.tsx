import type { ReactNode } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { Card } from "@/components/ui/card";

type IconTone = "blue" | "violet" | "green" | "cyan" | "amber" | "red";

type DashboardStatProps = {
  label: string;
  value: number;
  displayValue?: string;
  hint?: string;
  icon?: ReactNode;
  iconTone?: IconTone;
};

const ICON_TONE_CLASS: Record<IconTone, string> = {
  blue: "nx-icon-badge nx-icon-badge--blue",
  violet: "nx-icon-badge nx-icon-badge--violet",
  green: "nx-icon-badge nx-icon-badge--green",
  cyan: "nx-icon-badge nx-icon-badge--cyan",
  amber: "nx-icon-badge nx-icon-badge--amber",
  red: "nx-icon-badge nx-icon-badge--red",
};

export function DashboardStat({
  label,
  value,
  displayValue,
  hint,
  icon,
  iconTone = "blue",
}: DashboardStatProps) {
  return (
    <Card padding="md" hover className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="nx-stat-label">{label}</p>
        {icon ? (
          <div className={`h-11 w-11 ${ICON_TONE_CLASS[iconTone]}`}>{icon}</div>
        ) : null}
      </div>
      <p className="nx-stat-value">
        {displayValue ?? <AnimatedNumber value={value} />}
      </p>
      {hint ? <p className="text-[13px] font-medium leading-[1.45] text-text-muted">{hint}</p> : null}
    </Card>
  );
}
