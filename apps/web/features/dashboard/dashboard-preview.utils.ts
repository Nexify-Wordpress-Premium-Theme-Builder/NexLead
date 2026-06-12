import { DASHBOARD_PREVIEW_DATA } from "@/features/dashboard/dashboard-preview-data";

const PREVIEW_ID_PREFIX = "preview-";

export function isDashboardPreviewId(id: string): boolean {
  return id.startsWith(PREVIEW_ID_PREFIX);
}
import type { DashboardOverview, DashboardPreviewField } from "@/features/dashboard/dashboard.types";
import { hasTrendData } from "@/features/dashboard/dashboard.utils";

function isTrendSeriesEmpty(trends: DashboardOverview["trends"]): boolean {
  return (
    !hasTrendData(trends.leads) &&
    !hasTrendData(trends.websites) &&
    !hasTrendData(trends.audits)
  );
}

function isScoreSummaryEmpty(scoreSummary: DashboardOverview["scoreSummary"]): boolean {
  return scoreSummary.averageScore === null && scoreSummary.scoredAuditCount === 0;
}

/**
 * Gerçek workspace verisini korur; boş kalan bölümlere kontrollü önizleme verisi uygular.
 */
export function applyDashboardPreview(overview: DashboardOverview): DashboardOverview {
  const previewFields: DashboardPreviewField[] = [];
  const preview = DASHBOARD_PREVIEW_DATA;

  if (overview.isFullyEmpty) {
    return {
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
  }

  const kpis = { ...overview.kpis };
  let trends = overview.trends;
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

  if (previewFields.length === 0) {
    return overview;
  }

  return {
    ...overview,
    kpis,
    trends,
    scoreSummary,
    severitySummary,
    recentActivity,
    recentLeads,
    recentWebsites,
    recentAudits,
    previewFields,
  };
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
};
