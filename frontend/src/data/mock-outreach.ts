import type { OutreachCampaign, OutreachMessage } from "@shared/types/outreach";

export const mockOutreachMessages: OutreachMessage[] = [
  {
    id: "msg-1",
    leadId: "lead-2",
    subject: "Quick idea to improve Summit Legal's homepage",
    body: "Hi team — I reviewed your site and found a few quick wins...",
    status: "sent",
    createdAt: "2026-05-27T16:00:00.000Z",
  },
];

export const mockOutreachCampaigns: OutreachCampaign[] = [
  {
    id: "camp-1",
    name: "Q2 Agency Outreach",
    leadCount: 24,
    replyRate: 18,
    status: "active",
  },
];
