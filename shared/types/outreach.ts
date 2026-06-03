export type OutreachStatus =
  | "draft"
  | "ready"
  | "sent"
  | "opened"
  | "replied"
  | "failed";

export interface OutreachMessage {
  id: string;
  leadId: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdAt: string;
}

export interface OutreachCampaign {
  id: string;
  name: string;
  leadCount: number;
  replyRate: number;
  status: "active" | "paused" | "completed";
}
