import type { LeadStatus } from "./lead";

export interface PipelineStage {
  id: string;
  label: string;
  status: LeadStatus;
  order: number;
}

export interface PipelineCard {
  id: string;
  leadId: string;
  companyName: string;
  opportunityScore: number;
  status: LeadStatus;
}
