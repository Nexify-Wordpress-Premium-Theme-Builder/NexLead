import type { LeadStatus } from "@/types/lead";

export type PipelineStageId =
  | "new"
  | "audited"
  | "message_ready"
  | "sent"
  | "replied"
  | "meeting"
  | "closed";

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

export interface FlattenedPipelineCard {
  id: string;
  stageId: PipelineStageId;
  company: string;
  industry: string;
  score: number;
  nextAction: string;
  badge: string;
  leadId?: string;
}

export const PIPELINE_STAGE_ORDER: PipelineStageId[] = [
  "new",
  "audited",
  "message_ready",
  "sent",
  "replied",
  "meeting",
  "closed",
];
