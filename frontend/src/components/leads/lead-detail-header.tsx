import type { Lead } from "@shared/types/lead";

export function LeadDetailHeader({ lead }: { lead: Lead }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary">{lead.companyName}</h2>
      <p className="text-sm text-text-secondary">{lead.website}</p>
    </div>
  );
}
