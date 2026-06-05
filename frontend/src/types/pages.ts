export type PageAccent = "blue" | "green" | "purple" | "orange";

export interface PageKpi {
  id: string;
  label: string;
  numericValue: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  accent: PageAccent;
}

export interface SearchPreviewRow {
  id: string;
  company: string;
  industry: string;
  location: string;
  website: string;
  signal: string;
  opportunity: number;
}

export interface LeadTableRow {
  id: string;
  company: string;
  industry: string;
  website: string;
  status: string;
  statusTone: "warning" | "success" | "default" | "purple" | "danger";
  opportunityScore: number;
  lastActivity: string;
  nextAction: string;
}

export interface LeadDetailProfile {
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
  auditSummary: { label: string; issues: number }[];
  opportunityReasons: string[];
  suggestedServices: string[];
  outreachSubject: string;
  outreachBody: string;
  timeline: { label: string; time: string }[];
}

export interface AuditIssueItem {
  id: string;
  category: string;
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  fix: string;
  impact: string;
}

export interface OutreachCampaignCard {
  id: string;
  name: string;
  leads: number;
  replies: number;
  status: "active" | "draft" | "paused";
}

export interface PipelineColumnData {
  id: string;
  label: string;
  count: number;
  cards: {
    id: string;
    company: string;
    industry: string;
    score: number;
    nextAction: string;
    badge: string;
  }[];
}

export interface MeetingListItem {
  id: string;
  company: string;
  date: string;
  time: string;
  assignee: string;
}

export interface MeetingBriefData {
  companySummary: string;
  mainIssues: string[];
  salesAngle: string;
  recommendedOffer: string;
  notes: string;
}

export interface IndustryPerformance {
  industry: string;
  replyRate: number;
}
