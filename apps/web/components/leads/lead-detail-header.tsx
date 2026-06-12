import type { ReactNode } from "react";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";

type LeadDetailHeaderProps = {
  lead: LeadWithPrimaryContact;
  actions?: ReactNode;
};

export function LeadDetailHeader({ lead, actions }: LeadDetailHeaderProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-text-muted">Lead Detayı</p>
        <h1 className="nx-page-header-title mt-1 truncate">
          {lead.company_name}
        </h1>
        <div className="mt-3">
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
