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
  "bg-[#E0E7FF] text-[#4338CA]",
];

const statusStyles = {
  needs_work: "bg-orange-soft text-[#C2410C]",
  okay: "bg-[#FEF9C3] text-[#A16207]",
  good: "bg-green-soft text-green",
} as const;

const statusLabels = {
  needs_work: "Needs Work",
  okay: "Okay",
  good: "Good",
} as const;

const rowDelays = [200, 270, 340, 410, 480];

function ActionIcon({ type }: { type: OpportunityLeadRow["actionType"] }) {
  if (type === "personalize") return <Pencil className="h-3.5 w-3.5" />;
  if (type === "follow_up") return <Phone className="h-3.5 w-3.5" />;
  return <Mail className="h-3.5 w-3.5" />;
}

export function TopOpportunityLeads({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Top Opportunity Leads</h3>
        <Link href={ROUTES.app.leads} className="link-section">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft">
              <th className="pb-3 pr-3 text-xs font-semibold text-text-muted">Company</th>
              <th className="pb-3 pr-3 text-xs font-semibold text-text-muted">Industry</th>
              <th className="pb-3 pr-3 text-xs font-semibold text-text-muted">Website Status</th>
              <th className="pb-3 pr-3 text-xs font-semibold text-text-muted">Opp. Score</th>
              <th className="pb-3 text-xs font-semibold text-text-muted">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOpportunityLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className="animate-fade-up-row group table-row-hover border-b border-border-soft last:border-0"
                style={{ animationDelay: `${rowDelays[index] ?? 200}ms` }}
              >
                <td className="py-[14px] pr-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-bold",
                        companyColors[index % companyColors.length],
                      )}
                    >
                      {lead.company.charAt(0)}
                    </div>
                    <span className="font-semibold text-text-primary">{lead.company}</span>
                  </div>
                </td>
                <td className="py-[14px] pr-3 text-text-secondary">{lead.industry}</td>
                <td className="py-[14px] pr-3">
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-full px-[9px] text-xs font-semibold",
                      statusStyles[lead.websiteStatus],
                    )}
                  >
                    {statusLabels[lead.websiteStatus]}
                  </span>
                </td>
                <td className="py-[14px] pr-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-soft text-xs font-bold text-green">
                    {lead.opportunityScore}
                  </span>
                </td>
                <td className="py-[14px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-160 group-hover:text-primary-hover hover:underline"
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
