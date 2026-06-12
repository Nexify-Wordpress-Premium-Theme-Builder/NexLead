import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--nx-radius-lg)] border border-dashed bg-[var(--nx-surface)] px-6 py-16 text-center" style={{ borderColor: "var(--nx-border-strong)" }}>
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          {icon}
        </div>
      ) : null}
      <p className="text-[16px] font-bold text-[var(--nx-text)]">{title}</p>
      <p className="mt-2 max-w-md text-[14px] font-medium text-[var(--nx-text-muted)]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
