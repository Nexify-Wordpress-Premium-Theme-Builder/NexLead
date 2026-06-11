import type { ReactNode } from "react";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";

type LeadDetailHeaderProps = {
  lead: LeadWithPrimaryContact;
  actions?: ReactNode;
};

export function LeadDetailHeader({ lead, actions }: LeadDetailHeaderProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-muted">Lead Detayı</p>
        <h1 className="mt-1 truncate text-3xl font-semibold tracking-[-0.03em] text-text-primary">
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
