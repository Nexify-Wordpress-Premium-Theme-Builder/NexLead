import type { ReactNode } from "react";

type DashboardStatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
};

export function DashboardStatCard({ icon, label, value, description }: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text-primary">{value}</p>
          <p className="mt-2 text-sm text-text-muted">{description}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-text-secondary">
          {icon}
        </div>
      </div>
    </article>
  );
}
