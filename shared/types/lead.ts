export type LeadStatus =
  | "new"
  | "audited"
  | "message_ready"
  | "sent"
  | "replied"
  | "meeting"
  | "closed";

export type WebsiteStatus = "needs_work" | "okay" | "good";

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  location?: string;
  status: LeadStatus;
  opportunityScore: number;
  websiteStatus: WebsiteStatus;
  createdAt: string;
  updatedAt: string;
}
