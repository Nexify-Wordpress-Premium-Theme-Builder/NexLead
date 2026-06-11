import type { ReactNode } from "react";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import type { WebsiteDetail } from "@/features/websites/website.types";

type WebsiteDetailHeaderProps = {
  website: WebsiteDetail;
  actions?: ReactNode;
};

export function WebsiteDetailHeader({ website, actions }: WebsiteDetailHeaderProps) {
  const displayUrl = website.url ?? website.domain ?? "Web sitesi";

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-muted">Web Site Detayı</p>
        <h1 className="mt-1 break-all text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:break-words">
          {displayUrl}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <WebsiteStatusBadge status={website.status} />
          <AuditStatusBadge status={website.latestAudit?.status ?? null} />
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
