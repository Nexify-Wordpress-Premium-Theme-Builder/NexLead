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
        <div className="nx-icon-badge nx-icon-badge--blue mb-4 h-12 w-12">{icon}</div>
      ) : null}
      <p className="text-[17px] font-bold text-[var(--nx-text)]">{title}</p>
      <p className="mt-2 max-w-md text-[13px] font-medium leading-[1.45] text-[var(--nx-text-muted)] sm:text-[14px]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
