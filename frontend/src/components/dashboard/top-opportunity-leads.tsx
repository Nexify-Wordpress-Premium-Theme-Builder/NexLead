import Link from "next/link";
import { Mail, Pencil, Phone } from "lucide-react";
import { mockOpportunityLeads } from "@/data/mock-dashboard";
import type { OpportunityLeadRow } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";

const companyColors = [
  "bg-primary-soft text-primary",
  "bg-purple-soft text-purple",
  "bg-green-soft text-green",
  "bg-orange-soft text-orange",
  "bg-[#EEF2FF] text-[#4338CA]",
];

const statusStyles = {
  needs_work: "bg-orange-soft text-[#B45309]",
  okay: "bg-[#FFFBEB] text-[#A16207]",
  good: "bg-green-soft text-green",
} as const;

const statusLabels = {
  needs_work: "Needs Work",
  okay: "Okay",
  good: "Good",
} as const;

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

function ActionIcon({ type }: { type: OpportunityLeadRow["actionType"] }) {
  if (type === "personalize") return <Pencil className="h-3 w-3" />;
  if (type === "follow_up") return <Phone className="h-3 w-3" />;
  return <Mail className="h-3 w-3" />;
}

export function TopOpportunityLeads({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">Top Opportunity Leads</h3>
        <Link href={ROUTES.app.leads} className="link-section">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft">
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Company
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Industry
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Status
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Score
              </th>
              <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Next Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mockOpportunityLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className={cn(
                  "group border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                  "animate-fade-up-row",
                  rowDelays[index],
                )}
              >
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
                        companyColors[index % companyColors.length],
                      )}
                    >
                      {lead.company.charAt(0)}
                    </div>
                    <span className="text-[13px] font-semibold text-text-primary">{lead.company}</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-[13px] text-text-secondary">{lead.industry}</td>
                <td className="py-3 pr-3">
                  <span
                    className={cn(
                      "inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-semibold",
                      statusStyles[lead.websiteStatus],
                    )}
                  >
                    {statusLabels[lead.websiteStatus]}
                  </span>
                </td>
                <td className="py-3 pr-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[11px] font-bold text-green">
                    {lead.opportunityScore}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors duration-200 group-hover:text-primary-hover"
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
