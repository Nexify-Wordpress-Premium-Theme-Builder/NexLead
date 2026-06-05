import type { PipelineCard, PipelineStage } from "@shared/types/pipeline";
import type { PipelineColumnData } from "@/types/pages";

export const mockPipelineStages: PipelineStage[] = [
  { id: "stage-new", label: "New", status: "new", order: 1 },
  { id: "stage-audited", label: "Audited", status: "audited", order: 2 },
  { id: "stage-message", label: "Message Ready", status: "message_ready", order: 3 },
  { id: "stage-sent", label: "Sent", status: "sent", order: 4 },
  { id: "stage-replied", label: "Replied", status: "replied", order: 5 },
  { id: "stage-meeting", label: "Meeting", status: "meeting", order: 6 },
  { id: "stage-closed", label: "Closed", status: "closed", order: 7 },
];

export const mockPipelineCards: PipelineCard[] = [
  {
    id: "card-1",
    leadId: "1",
    companyName: "TechNova Solutions",
    opportunityScore: 92,
    status: "audited",
  },
  {
    id: "card-2",
    leadId: "2",
    companyName: "BrightPath Consulting",
    opportunityScore: 87,
    status: "message_ready",
  },
];

export const mockPipelineColumns: PipelineColumnData[] = [
  {
    id: "new",
    label: "New",
    count: 512,
    cards: [
      {
        id: "p1",
        company: "Nova Dental Clinic",
        industry: "Healthcare",
        score: 91,
        nextAction: "Run Audit",
        badge: "New",
      },
    ],
  },
  {
    id: "audited",
    label: "Audited",
    count: 312,
    cards: [
      {
        id: "p2",
        company: "TechNova Solutions",
        industry: "SaaS",
        score: 92,
        nextAction: "Send Audit",
        badge: "Audited",
      },
      {
        id: "p3",
        company: "BrightPath Consulting",
        industry: "Consulting",
        score: 87,
        nextAction: "Send Audit",
        badge: "Audited",
      },
    ],
  },
  {
    id: "message_ready",
    label: "Message Ready",
    count: 246,
    cards: [
      {
        id: "p4",
        company: "GrowthLab Marketing",
        industry: "Marketing",
        score: 84,
        nextAction: "Personalize",
        badge: "Ready",
      },
    ],
  },
  {
    id: "sent",
    label: "Sent",
    count: 1014,
    cards: [],
  },
  {
    id: "replied",
    label: "Replied",
    count: 186,
    cards: [
      {
        id: "p5",
        company: "Pinnacle Logistics",
        industry: "Logistics",
        score: 78,
        nextAction: "Follow Up",
        badge: "Replied",
      },
    ],
  },
  {
    id: "meeting",
    label: "Meeting",
    count: 86,
    cards: [
      {
        id: "p6",
        company: "Elevate HR Advisors",
        industry: "HR Services",
        score: 72,
        nextAction: "View Brief",
        badge: "Meeting",
      },
    ],
  },
  {
    id: "closed",
    label: "Closed",
    count: 24,
    cards: [],
  },
];
