import type { ReportListItem, ReportsListSummary } from "@/features/reports/reports-list.types";

export const REPORT_LIST_PREVIEW_SUMMARY: ReportsListSummary = {
  totalReports: 3,
  last30Days: 2,
  averageScore: 72,
  criticalReports: 1,
};

export const REPORT_LIST_PREVIEW_ITEMS: ReportListItem[] = [
  {
    auditId: "preview-audit-1",
    websiteId: "preview-website-1",
    websiteLabel: "acme.com",
    leadCompanyName: "Acme Teknoloji",
    overallScore: 68,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    findingsCount: 12,
    criticalHighCount: 2,
    status: "completed",
  },
  {
    auditId: "preview-audit-2",
    websiteId: "preview-website-2",
    websiteLabel: "novahealth.io",
    leadCompanyName: "Nova Health",
    overallScore: 81,
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    findingsCount: 7,
    criticalHighCount: 0,
    status: "completed",
  },
  {
    auditId: "preview-audit-3",
    websiteId: "preview-website-3",
    websiteLabel: "bluestore.shop",
    leadCompanyName: "Blue Store",
    overallScore: 54,
    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    findingsCount: 18,
    criticalHighCount: 4,
    status: "completed",
  },
];
