import { DASHBOARD_PREVIEW_DATA } from "@/features/dashboard/dashboard-preview-data";
import { buildDashboardDisplay } from "@/features/dashboard/dashboard-view.utils";
import type {
  DashboardOverview,
  DashboardOverviewData,
  DashboardPreviewField,
} from "@/features/dashboard/dashboard.types";
import { hasTrendData, isDashboardPreviewId } from "@/features/dashboard/dashboard.utils";

export { isDashboardPreviewId };

export function createEmptyDashboardOverview(
  workspaceId: string,
  workspaceName: string,
): DashboardOverviewData {
  return {
    workspaceId,
    workspaceName,
    stats: {
      totalLeads: 0,
      activeWebsites: 0,
      pendingAudits: 0,
      completedAudits: 0,
    },
    kpis: {
      totalLeads: 0,
      activeWebsites: 0,
      pendingAudits: 0,
      completedAudits: 0,
      averageScore: null,
      criticalFindings: 0,
    },
    trends: {
      labels: [],
      leads: [],
      websites: [],
      audits: [],
      reports: [],
    },
    scoreSummary: {
      averageScore: null,
      scoredAuditCount: 0,
      categoryAverages: [],
    },
    severitySummary: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      total: 0,
    },
    recentActivity: [],
    recentLeads: [],
    recentWebsites: [],
    recentAudits: [],
    isFullyEmpty: true,
  };
}

function isTrendSeriesEmpty(trends: DashboardOverviewData["trends"]): boolean {
  return (
    !hasTrendData(trends.leads) &&
    !hasTrendData(trends.websites) &&
    !hasTrendData(trends.audits)
  );
}

function isScoreSummaryEmpty(scoreSummary: DashboardOverviewData["scoreSummary"]): boolean {
  return scoreSummary.averageScore === null && scoreSummary.scoredAuditCount === 0;
}

/**
 * Gerçek workspace verisini korur; boş kalan bölümlere kontrollü önizleme verisi uygular.
 */
export function applyDashboardPreview(overview: DashboardOverviewData): DashboardOverview {
  const previewFields: DashboardPreviewField[] = [];
  const preview = DASHBOARD_PREVIEW_DATA;

  if (overview.isFullyEmpty) {
    const merged: DashboardOverviewData = {
      ...overview,
      stats: {
        totalLeads: preview.kpis.totalLeads,
        activeWebsites: preview.kpis.activeWebsites,
        pendingAudits: preview.kpis.pendingAudits,
        completedAudits: preview.kpis.completedAudits,
      },
      kpis: preview.kpis,
      trends: preview.trends,
      scoreSummary: preview.scoreSummary,
      severitySummary: preview.severitySummary,
      recentActivity: preview.recentActivity,
      recentLeads: preview.recentLeads,
      recentWebsites: preview.recentWebsites,
      recentAudits: preview.recentAudits,
      isFullyEmpty: false,
      previewFields: [
        "kpis",
        "trends",
        "scoreSummary",
        "severitySummary",
        "recentActivity",
        "recentLeads",
        "recentWebsites",
        "recentAudits",
      ],
    };

    return buildDashboardDisplay(merged, merged.previewFields);
  }

  const kpis = { ...overview.kpis };
  let trends = { ...overview.trends, reports: overview.trends.reports ?? [] };
  let scoreSummary = overview.scoreSummary;
  let severitySummary = overview.severitySummary;
  let recentActivity = overview.recentActivity;
  let recentLeads = overview.recentLeads;
  let recentWebsites = overview.recentWebsites;
  let recentAudits = overview.recentAudits;

  if (overview.kpis.averageScore === null) {
    kpis.averageScore = preview.kpis.averageScore;
    previewFields.push("kpis");
  }

  if (isTrendSeriesEmpty(overview.trends)) {
    trends = preview.trends;
    previewFields.push("trends");
  } else if (!hasTrendData(trends.reports)) {
    trends = {
      ...trends,
      reports: preview.trends.reports,
    };
    previewFields.push("trends");
  }

  if (isScoreSummaryEmpty(overview.scoreSummary)) {
    scoreSummary = preview.scoreSummary;
    previewFields.push("scoreSummary");
  }

  if (overview.severitySummary.total === 0) {
    severitySummary = preview.severitySummary;
    previewFields.push("severitySummary");
  }

  if (overview.recentActivity.length === 0) {
    recentActivity = preview.recentActivity;
    previewFields.push("recentActivity");
  }

  if (overview.recentLeads.length === 0) {
    recentLeads = preview.recentLeads;
    previewFields.push("recentLeads");
  }

  if (overview.recentWebsites.length === 0) {
    recentWebsites = preview.recentWebsites;
    previewFields.push("recentWebsites");
  }

  if (overview.recentAudits.length === 0) {
    recentAudits = preview.recentAudits;
    previewFields.push("recentAudits");
  }

  const base: DashboardOverviewData = {
    ...overview,
    kpis,
    trends,
    scoreSummary,
    severitySummary,
    recentActivity,
    recentLeads,
    recentWebsites,
    recentAudits,
    previewFields: previewFields.length > 0 ? previewFields : undefined,
  };

  return buildDashboardDisplay(base, previewFields);
}

export const DASHBOARD_PREVIEW_FIELD_LABELS: Record<DashboardPreviewField, string> = {
  kpis: "KPI kartları",
  trends: "Trend grafiği ve sparkline",
  scoreSummary: "Dairesel skor özeti",
  severitySummary: "Bulgu önem dağılımı",
  recentActivity: "Son aktiviteler",
  recentLeads: "Son leadler",
  recentWebsites: "Son web siteleri",
  recentAudits: "Son analizler",
  leadTable: "Potansiyel müşteri tablosu",
  funnel: "Analiz hunisi",
  insights: "Analiz içgörüleri",
  upcomingTasks: "Yaklaşan işler",
  circularScores: "Kategori skorları",
};
