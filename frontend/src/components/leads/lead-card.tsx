import type { Lead } from "@shared/types/lead";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{lead.companyName}</p>
      <p className="text-sm text-text-secondary">{lead.industry}</p>
    </div>
  );
}
