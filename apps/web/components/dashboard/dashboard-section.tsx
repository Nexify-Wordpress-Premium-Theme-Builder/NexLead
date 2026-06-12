import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delayClassName?: string;
};

export function DashboardSection({
  title,
  description,
  action,
  children,
  className,
  delayClassName,
}: DashboardSectionProps) {
  return (
    <section className={`dashboard-stagger-item ${delayClassName ?? ""} ${className ?? ""}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-text-primary">{title}</h2>
          {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
