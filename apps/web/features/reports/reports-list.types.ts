import type { AuditStatus } from "@/features/websites/website.types";

export type ReportListItem = {
  auditId: string;
  websiteId: string;
  websiteLabel: string;
  leadCompanyName: string | null;
  overallScore: number | null;
  completedAt: string | null;
  findingsCount: number;
  criticalHighCount: number;
  status: AuditStatus;
};

export type ReportsListSummary = {
  totalReports: number;
  last30Days: number;
  averageScore: number | null;
  criticalReports: number;
};

export type ReportsListData = {
  items: ReportListItem[];
  summary: ReportsListSummary;
  isEmpty: boolean;
};
