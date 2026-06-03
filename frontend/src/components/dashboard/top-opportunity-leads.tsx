import Link from "next/link";
import { Mail, Pencil, Phone } from "lucide-react";
import { mockOpportunityLeads } from "@/data/mock-dashboard";
import type { OpportunityLeadRow } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

const statusStyles = {
  needs_work: "bg-orange-soft text-orange",
  okay: "bg-[#FEF9C3] text-[#A16207]",
  good: "bg-green-soft text-green",
} as const;

const statusLabels = {
  needs_work: "Needs Work",
  okay: "Okay",
  good: "Good",
} as const;

function ActionIcon({ type }: { type: OpportunityLeadRow["actionType"] }) {
  if (type === "personalize") return <Pencil className="h-3.5 w-3.5" />;
  if (type === "follow_up") return <Phone className="h-3.5 w-3.5" />;
  return <Mail className="h-3.5 w-3.5" />;
}

export function TopOpportunityLeads() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Top Opportunity Leads</h3>
        <Link
          href={ROUTES.app.leads}
          className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-text-muted">
              <th className="pb-3 pr-3 font-medium">Company</th>
              <th className="pb-3 pr-3 font-medium">Industry</th>
              <th className="pb-3 pr-3 font-medium">Website Status</th>
              <th className="pb-3 pr-3 font-medium">Opp. Score</th>
              <th className="pb-3 font-medium">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOpportunityLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-border/80 transition-colors duration-200 last:border-0 hover:bg-slate-50/60"
              >
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-primary">
                      {lead.company.charAt(0)}
                    </div>
                    <span className="font-medium text-text-primary">{lead.company}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-3 text-text-secondary">{lead.industry}</td>
                <td className="py-3.5 pr-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[lead.websiteStatus],
                    )}
                  >
                    {statusLabels[lead.websiteStatus]}
                  </span>
                </td>
                <td className="py-3.5 pr-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-soft text-xs font-semibold text-green">
                    {lead.opportunityScore}
                  </span>
                </td>
                <td className="py-3.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
                  >
                    <ActionIcon type={lead.actionType} />
                    {lead.nextAction}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
