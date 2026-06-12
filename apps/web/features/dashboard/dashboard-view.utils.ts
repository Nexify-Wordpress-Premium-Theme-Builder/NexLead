import { DASHBOARD_PREVIEW_DISPLAY } from "@/features/dashboard/dashboard-preview-data";
import { isDashboardPreviewId } from "@/features/dashboard/dashboard.utils";

import type {
  DashboardDisplay,
  DashboardLeadTableRow,
  DashboardOverview,
  DashboardOverviewData,
  DashboardPreviewField,
} from "./dashboard.types";

const LEAD_STATUS_LABELS: Record<DashboardLeadTableRow["status"], string> = {
  new: "Yeni",
  enriched: "Zenginleştirildi",
  qualified: "Nitelikli",
  contacted: "İletişimde",
  replied: "Yanıt Verdi",
  meeting_scheduled: "Toplantı Planlandı",
  won: "Kazanıldı",
  lost: "Kaybedildi",
  archived: "Arşiv",
};

const NEXT_ACTION_BY_STATUS: Record<DashboardLeadTableRow["status"], string> = {
  new: "Analiz Başlat",
  enriched: "Veri İncele",
  qualified: "Rapor İncele",
  contacted: "Takip Et",
  replied: "Yanıtla",
  meeting_scheduled: "Toplantı Hazırlığı",
  won: "Bakım Planla",
  lost: "Arşivle",
  archived: "—",
};

function scoreQualityLabel(score: number): string {
  if (score >= 90) return "Mükemmel";
  if (score >= 80) return "Çok İyi";
  if (score >= 70) return "İyi";
  if (score >= 60) return "Orta";
  return "Geliştirilmeli";
}

function buildCircularScoresFromReal(
  overview: DashboardOverviewData,
): DashboardDisplay["circularScores"] {
  const categoryLabels: Record<string, string> = {
    technical: "Teknik",
    performance: "Hız",
    seo: "SEO",
    security: "Güven",
    ux: "UX",
    content: "İçerik",
  };

  const order = ["performance", "technical", "seo", "security", "ux", "content"];
  const fromReal = order
    .map((category) => {
      const match = overview.scoreSummary.categoryAverages.find((item) => item.category === category);
      if (!match) return null;
      return {
        label: categoryLabels[category] ?? category,
        score: match.score,
        qualityLabel: scoreQualityLabel(match.score),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 5);

  if (fromReal.length >= 3) {
    return fromReal;
  }

  return DASHBOARD_PREVIEW_DISPLAY.circularScores;
}

function buildLeadTableFromReal(overview: DashboardOverviewData): DashboardLeadTableRow[] {
  const rows: DashboardLeadTableRow[] = overview.recentLeads.map((lead) => ({
    id: lead.id,
    companyName: lead.companyName,
    website: lead.normalizedDomain ?? "—",
    sector: "—",
    score: overview.kpis.averageScore,
    status: lead.status,
    statusLabel: LEAD_STATUS_LABELS[lead.status],
    nextAction: NEXT_ACTION_BY_STATUS[lead.status],
    href: isDashboardPreviewId(lead.id) ? null : `/dashboard/leads/${lead.id}`,
    isPreview: isDashboardPreviewId(lead.id),
  }));

  return rows;
}

function buildFunnelFromReal(overview: DashboardOverviewData): DashboardDisplay["funnelSteps"] {
  const lead = overview.kpis.totalLeads;
  const website = overview.kpis.activeWebsites;
  const audit = overview.kpis.completedAudits + overview.kpis.pendingAudits;
  const report = overview.kpis.completedAudits;

  if (lead === 0 && website === 0) {
    return DASHBOARD_PREVIEW_DISPLAY.funnelSteps;
  }

  const pct = (current: number, previous: number) =>
    previous > 0 ? Math.round((current / previous) * 100) : null;

  return [
    { label: "Lead", value: lead, conversionPercent: null },
    { label: "Web Sitesi", value: website, conversionPercent: pct(website, lead) },
    { label: "Analiz", value: audit, conversionPercent: pct(audit, website) },
    { label: "Rapor", value: report, conversionPercent: pct(report, audit) },
    { label: "Aksiyon", value: Math.max(report - overview.kpis.criticalFindings, 0), conversionPercent: pct(Math.max(report - overview.kpis.criticalFindings, 0), report) },
  ];
}

function buildInsightsFromReal(overview: DashboardOverviewData): string[] {
  const insights: string[] = [];

  if (overview.kpis.criticalFindings > 0) {
    insights.push(`${overview.kpis.criticalFindings} kritik/yüksek bulgu öncelikli inceleme gerektiriyor.`);
  }

  if (overview.kpis.pendingAudits > 0) {
    insights.push(`${overview.kpis.pendingAudits} analiz hâlâ kuyrukta veya çalışıyor.`);
  }

  if (overview.kpis.averageScore !== null && overview.kpis.averageScore < 75) {
    insights.push("Ortalama site skoru iyileştirme fırsatlarına işaret ediyor.");
  }

  if (insights.length >= 2) {
    return insights.slice(0, 3);
  }

  return DASHBOARD_PREVIEW_DISPLAY.insights;
}

export function buildDashboardDisplay(
  overview: DashboardOverviewData,
  previewFields: DashboardPreviewField[] = [],
): DashboardOverview {
  const fields = new Set(previewFields);

  const leadTableRows = (() => {
    const real = buildLeadTableFromReal(overview);
    if (real.length >= 4) return real;
    const merged = [...real];
    for (const row of DASHBOARD_PREVIEW_DISPLAY.leadTableRows) {
      if (merged.length >= 5) break;
      if (!merged.some((item) => item.companyName === row.companyName)) {
        merged.push(row);
      }
    }
    if (real.length === 0) fields.add("leadTable");
    return merged;
  })();

  const circularScores = (() => {
    const scores = buildCircularScoresFromReal(overview);
    if (scores === DASHBOARD_PREVIEW_DISPLAY.circularScores) fields.add("circularScores");
    return scores;
  })();

  const funnelSteps = (() => {
    const steps = buildFunnelFromReal(overview);
    if (steps === DASHBOARD_PREVIEW_DISPLAY.funnelSteps) fields.add("funnel");
    return steps;
  })();

  const insights = (() => {
    const items = buildInsightsFromReal(overview);
    if (items === DASHBOARD_PREVIEW_DISPLAY.insights) fields.add("insights");
    return items;
  })();

  const upcomingTasks =
    overview.recentAudits.length > 0
      ? overview.recentAudits.slice(0, 3).map((audit) => ({
          id: audit.id,
          title: audit.websiteLabel,
          subtitle: audit.status === "completed" ? "Rapor hazır" : "Analiz takibi",
          timeLabel: "Yakında",
        }))
      : DASHBOARD_PREVIEW_DISPLAY.upcomingTasks;

  if (overview.recentAudits.length === 0) {
    fields.add("upcomingTasks");
  }

  const trends = {
    ...overview.trends,
    reports: overview.trends.reports?.length
      ? overview.trends.reports
      : overview.trends.audits.map((value) => Math.max(value - 1, 0)),
  };

  return {
    ...overview,
    trends,
    previewFields: [...fields],
    display: {
      kpiTrends: DASHBOARD_PREVIEW_DISPLAY.kpiTrends,
      circularScores,
      insights,
      leadTableRows,
      funnelSteps,
      upcomingTasks,
    },
  };
}
