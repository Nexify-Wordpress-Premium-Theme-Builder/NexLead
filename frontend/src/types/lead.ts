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

export interface LeadAuditSummaryItem {
  label: string;
  issues: number;
}

export interface LeadTimelineItem {
  label: string;
  time: string;
}

export interface LeadDetail {
  id: string;
  company: string;
  industry: string;
  website: string;
  location: string;
  companySize: string;
  contactStatus: string;
  opportunityScore: number;
  websiteStatus: string;
  outreachStatus: string;
  nextAction: string;
  auditSummary: LeadAuditSummaryItem[];
  opportunityReasons: string[];
  suggestedServices: string[];
  outreachSubject: string;
  outreachBody: string;
  timeline: LeadTimelineItem[];
}

export type LeadDetailMap = Record<string, LeadDetail>;

export interface LeadCreateInput {
  companyName: string;
  website: string;
  industry: string;
  location?: string;
  opportunityScore?: number;
  websiteStatus?: WebsiteStatus;
}
