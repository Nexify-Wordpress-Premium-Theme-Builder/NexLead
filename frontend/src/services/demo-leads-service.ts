import type { Lead, LeadDetailMap, LeadStatus } from "@/types/lead";
import type { SearchPreviewRow } from "@/types/pages";

export type LeadFilterStatus = LeadStatus | "all" | "needs_work";

export interface LeadSearchFilters {
  industry: string;
  location: string;
  businessType: string;
  websiteStatus: string;
  minOpportunity: number;
  activeSignals: string[];
  query: string;
}

const signalMatchers: Record<string, (row: SearchPreviewRow) => boolean> = {
  "Has website": (row) => Boolean(row.website),
  "Poor mobile experience": (row) => row.signal.toLowerCase().includes("mobile"),
  "Missing tracking": (row) => row.signal.toLowerCase().includes("tracking"),
  "Weak CTA": (row) => row.signal.toLowerCase().includes("cta"),
  "Slow website": (row) => row.signal.toLowerCase().includes("slow"),
  "SEO issues": (row) => row.signal.toLowerCase().includes("seo"),
};

export function searchDemoLeads(
  rows: SearchPreviewRow[],
  filters: LeadSearchFilters,
): SearchPreviewRow[] {
  return rows.filter((row) => {
    if (filters.industry && !row.industry.toLowerCase().includes(filters.industry.toLowerCase())) {
      return false;
    }
    if (filters.location && !row.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (
      filters.businessType &&
      !row.industry.toLowerCase().includes(filters.businessType.toLowerCase())
    ) {
      return false;
    }
    if (filters.minOpportunity > 0 && row.opportunity < filters.minOpportunity) {
      return false;
    }
    if (filters.query) {
      const haystack = [row.company, row.industry, row.location, row.website, row.signal]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(filters.query.toLowerCase())) return false;
    }
    if (filters.activeSignals.length > 0) {
      const matchesAny = filters.activeSignals.some((signal) => signalMatchers[signal]?.(row));
      if (!matchesAny) return false;
    }
    return true;
  });
}

const filterLabelToStatus: Record<string, LeadFilterStatus> = {
  All: "all",
  "Needs Work": "needs_work",
  Audited: "audited",
  "Message Ready": "message_ready",
  Sent: "sent",
  Replied: "replied",
  Meeting: "meeting",
};

export function mapFilterLabel(label: string): LeadFilterStatus {
  return filterLabelToStatus[label] ?? "all";
}

export function filterLeadsByStatus(leads: Lead[], status: LeadFilterStatus): Lead[] {
  if (status === "all") return leads;
  if (status === "needs_work") {
    return leads.filter((lead) => lead.websiteStatus === "needs_work" || lead.status === "new");
  }
  return leads.filter((lead) => lead.status === status);
}

export function getLeadDisplayStatus(lead: Lead): string {
  if (lead.websiteStatus === "needs_work" && lead.status === "new") return "Needs Work";
  if (lead.status === "audited") return "Audited";
  if (lead.status === "message_ready") return "Message Ready";
  if (lead.status === "sent") return "Sent";
  if (lead.status === "replied") return "Replied";
  if (lead.status === "meeting") return "Meeting";
  if (lead.websiteStatus === "okay") return "Okay";
  if (lead.websiteStatus === "good") return "Good";
  return "Needs Work";
}

export function getLeadNextAction(lead: Lead): string {
  const actions: Record<LeadStatus, string> = {
    new: "Send Audit",
    audited: "Send Audit",
    message_ready: "Send",
    sent: "Follow Up",
    replied: "Follow Up",
    meeting: "View Brief",
    closed: "Archive",
  };
  return actions[lead.status];
}

export function searchLeads(leads: Lead[], query: string): Lead[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return leads;

  return leads.filter((lead) =>
    [lead.companyName, lead.website, lead.industry, lead.location ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function sortLeadsByOpportunity(leads: Lead[], direction: "asc" | "desc" = "desc"): Lead[] {
  return [...leads].sort((leftLead, rightLead) =>
    direction === "desc"
      ? rightLead.opportunityScore - leftLead.opportunityScore
      : leftLead.opportunityScore - rightLead.opportunityScore,
  );
}

export function getLeadById(leads: Lead[], leadId: string): Lead | undefined {
  return leads.find((lead) => lead.id === leadId);
}

export function getLeadDetailById(details: LeadDetailMap, leadId: string) {
  return details[leadId];
}
