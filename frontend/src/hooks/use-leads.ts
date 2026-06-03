import { mockLeads } from "@/data/mock-leads";
import type { Lead } from "@shared/types/lead";

export function useLeads(): Lead[] {
  return mockLeads;
}
