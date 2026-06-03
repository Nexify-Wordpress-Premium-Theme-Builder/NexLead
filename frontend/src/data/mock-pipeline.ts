import type { PipelineCard, PipelineStage } from "@shared/types/pipeline";

export const mockPipelineStages: PipelineStage[] = [
  { id: "stage-new", label: "New", status: "new", order: 1 },
  { id: "stage-audited", label: "Audited", status: "audited", order: 2 },
  { id: "stage-sent", label: "Sent", status: "sent", order: 3 },
  { id: "stage-meeting", label: "Meeting", status: "meeting", order: 4 },
];

export const mockPipelineCards: PipelineCard[] = [
  {
    id: "card-1",
    leadId: "lead-1",
    companyName: "Northline Studio",
    opportunityScore: 82,
    status: "audited",
  },
  {
    id: "card-2",
    leadId: "lead-3",
    companyName: "BrightPath Consulting",
    opportunityScore: 91,
    status: "meeting",
  },
];
