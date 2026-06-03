import { mockLeads } from "@/data/mock-leads";
import type { Lead } from "@shared/types/lead";

export const leadsClient = {
  getLeads: async (): Promise<Lead[]> => mockLeads,
  getLeadById: async (leadId: string): Promise<Lead | undefined> =>
    mockLeads.find((lead) => lead.id === leadId),
};

export function getLeads(): Lead[] {
  return mockLeads;
}

export function getLeadById(leadId: string): Lead | undefined {
  return mockLeads.find((lead) => lead.id === leadId);
}
