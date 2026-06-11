import type { Tables } from "@nexlead/types";

import type { LeadStatus } from "@/features/leads/lead.types";
import type { AuditStatus, WebsiteStatus } from "@/features/websites/website.types";

export type AuditType = Tables<"audits">["type"];

export type DashboardStats = {
  totalLeads: number;
  activeWebsites: number;
  pendingAudits: number;
  completedAudits: number;
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

export type DashboardOverview = {
  workspaceId: string;
  workspaceName: string;
  stats: DashboardStats;
  recentLeads: DashboardRecentLead[];
  recentWebsites: DashboardRecentWebsite[];
  recentAudits: DashboardRecentAudit[];
  isFullyEmpty: boolean;
};
