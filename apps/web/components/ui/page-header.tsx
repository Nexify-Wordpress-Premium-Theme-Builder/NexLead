import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="nx-page-header-title">{title}</h1>
          {badge}
        </div>
        {description ? <p className="nx-page-header-desc">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
