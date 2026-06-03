import type { Lead } from "@shared/types/lead";

export function TopOpportunityLeads({ leads }: { leads: Lead[] }) {
  return (
    <ul className="space-y-2">
      {leads.map((lead) => (
        <li key={lead.id} className="text-sm text-text-primary">
          {lead.companyName} — {lead.opportunityScore}
        </li>
      ))}
    </ul>
  );
}
