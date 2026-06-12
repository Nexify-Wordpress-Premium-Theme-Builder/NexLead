import type { Tables } from "@nexlead/types";

import type { LeadStatus } from "@/features/leads/lead.types";
import type { AuditStatus, WebsiteStatus } from "@/features/websites/website.types";

export type AuditType = Tables<"audits">["type"];
export type FindingSeverity = Tables<"audit_findings">["severity"];

export type DashboardStats = {
  totalLeads: number;
  activeWebsites: number;
  pendingAudits: number;
  completedAudits: number;
};

export type DashboardKpis = DashboardStats & {
  averageScore: number | null;
  criticalFindings: number;
};

export type DashboardTrendSeries = {
  labels: string[];
  leads: number[];
  websites: number[];
  audits: number[];
};

export type DashboardScoreSummary = {
  averageScore: number | null;
  scoredAuditCount: number;
  categoryAverages: Array<{
    category: string;
    score: number;
  }>;
};

export type DashboardSeveritySummary = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
};

export type DashboardActivityType = "lead" | "website" | "audit";

export type DashboardActivityItem = {
  id: string;
  type: DashboardActivityType;
  title: string;
  subtitle: string;
  createdAt: string;
  href: string | null;
};

export type DashboardRecentLead = {
  id: string;
  companyName: string;
  normalizedDomain: string | null;
  status: LeadStatus;
  createdAt: string;
};

export type DashboardRecentWebsite = {
  id: string;
  label: string;
  leadCompanyName: string | null;
  status: WebsiteStatus;
  latestAuditStatus: AuditStatus | null;
  createdAt: string;
};

export type DashboardRecentAudit = {
  id: string;
  status: AuditStatus;
  type: AuditType;
  websiteLabel: string;
  createdAt: string;
  completedAt: string | null;
};

export type DashboardPreviewField =
  | "kpis"
  | "trends"
  | "scoreSummary"
  | "severitySummary"
  | "recentActivity"
  | "recentLeads"
  | "recentWebsites"
  | "recentAudits";

export type DashboardOverview = {
  workspaceId: string;
  workspaceName: string;
  stats: DashboardStats;
  kpis: DashboardKpis;
  trends: DashboardTrendSeries;
  scoreSummary: DashboardScoreSummary;
  severitySummary: DashboardSeveritySummary;
  recentActivity: DashboardActivityItem[];
  recentLeads: DashboardRecentLead[];
  recentWebsites: DashboardRecentWebsite[];
  recentAudits: DashboardRecentAudit[];
  isFullyEmpty: boolean;
  previewFields?: DashboardPreviewField[];
};
