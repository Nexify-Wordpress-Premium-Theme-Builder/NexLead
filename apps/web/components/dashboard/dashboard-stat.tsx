import type { ReactNode } from "react";

import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { Card } from "@/components/ui/card";

type DashboardStatProps = {
  label: string;
  value: number;
  displayValue?: string;
  hint?: string;
  icon?: ReactNode;
};

export function DashboardStat({ label, value, displayValue, hint, icon }: DashboardStatProps) {
  return (
    <Card padding="md" hover className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="nx-stat-label">{label}</p>
        {icon ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            {icon}
          </div>
        ) : null}
      </div>
      <p className="nx-stat-value">
        {displayValue ?? <AnimatedNumber value={value} />}
      </p>
      {hint ? <p className="text-[12px] font-medium text-text-muted">{hint}</p> : null}
    </Card>
  );
}
