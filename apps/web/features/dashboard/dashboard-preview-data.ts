import type { DashboardDisplay, DashboardOverview } from "@/features/dashboard/dashboard.types";
import { formatTrendLabel, getTrendDayKeys } from "@/features/dashboard/dashboard.utils";

const PREVIEW_NOW = new Date().toISOString();
const trendDayKeys = getTrendDayKeys(14);

export const DASHBOARD_PREVIEW_DISPLAY: DashboardDisplay = {
  kpiTrends: {
    leads: { percent: 18.6, direction: "up" },
    websites: { percent: 16.2, direction: "up" },
    reports: { percent: 22.4, direction: "up" },
    pending: { percent: 4.1, direction: "down" },
    score: { percent: 6.3, direction: "up" },
    critical: { percent: 2.8, direction: "down" },
  },
  circularScores: [
    { label: "Hız", score: 92, qualityLabel: "Mükemmel" },
    { label: "SEO", score: 76, qualityLabel: "İyi" },
    { label: "Güven", score: 84, qualityLabel: "Çok İyi" },
    { label: "UX", score: 79, qualityLabel: "İyi" },
    { label: "İçerik", score: 70, qualityLabel: "İyi" },
  ],
  insights: [
    "Meta açıklaması eksik sitelerde dönüşüm potansiyeli düşüyor.",
    "Canonical etiketi olmayan sayfalarda SEO riski artıyor.",
    "Lead bağlantısı olmayan web siteleri takip sürecini zorlaştırıyor.",
  ],
  leadTableRows: [
    {
      id: "preview-lead-1",
      companyName: "Örnek Teknoloji A.Ş.",
      website: "ornekteknoloji.com",
      sector: "Teknoloji",
      score: 88,
      status: "qualified",
      statusLabel: "Nitelikli",
      nextAction: "Rapor İncele",
      href: null,
      isPreview: true,
    },
    {
      id: "preview-lead-2",
      companyName: "Demo Pazarlama Ltd.",
      website: "demopazarlama.com",
      sector: "Pazarlama",
      score: 74,
      status: "contacted",
      statusLabel: "İletişimde",
      nextAction: "Analiz Başlat",
      href: null,
      isPreview: true,
    },
    {
      id: "preview-lead-3",
      companyName: "Atlas Yazılım",
      website: "atlasyazilim.io",
      sector: "Yazılım",
      score: 91,
      status: "meeting_scheduled",
      statusLabel: "Toplantı Planlandı",
      nextAction: "Toplantı Hazırlığı",
      href: null,
      isPreview: true,
    },
    {
      id: "preview-lead-4",
      companyName: "Nova E-Ticaret",
      website: "novaecom.shop",
      sector: "E-Ticaret",
      score: 68,
      status: "new",
      statusLabel: "Yeni",
      nextAction: "Analiz Başlat",
      href: null,
      isPreview: true,
    },
  ],
  funnelSteps: [
    { label: "Lead", value: 48, conversionPercent: null },
    { label: "Web Sitesi", value: 36, conversionPercent: 75 },
    { label: "Analiz", value: 28, conversionPercent: 78 },
    { label: "Rapor", value: 22, conversionPercent: 79 },
    { label: "Aksiyon", value: 14, conversionPercent: 64 },
  ],
  upcomingTasks: [
    {
      id: "preview-task-1",
      title: "example.com",
      subtitle: "Tamamlanan analiz raporu",
      timeLabel: "Bugün",
    },
    {
      id: "preview-task-2",
      title: "staging-preview.test",
      subtitle: "Analiz devam ediyor",
      timeLabel: "Yarın",
    },
    {
      id: "preview-task-3",
      title: "Demo Pazarlama Ltd.",
      subtitle: "Lead takibi",
      timeLabel: "2 gün içinde",
    },
  ],
};

/**
 * Kontrollü frontend önizleme verisi.
 * Yalnızca apps/web dashboard UI görünümünü test etmek için kullanılır.
 */
export const DASHBOARD_PREVIEW_DATA: Pick<
  DashboardOverview,
  | "kpis"
  | "trends"
  | "scoreSummary"
  | "severitySummary"
  | "recentActivity"
  | "recentLeads"
  | "recentWebsites"
  | "recentAudits"
> = {
  kpis: {
    totalLeads: 48,
    activeWebsites: 36,
    pendingAudits: 3,
    completedAudits: 22,
    averageScore: 82,
    criticalFindings: 5,
  },
  trends: {
    labels: trendDayKeys.map(formatTrendLabel),
    leads: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9],
    websites: [1, 2, 2, 3, 2, 4, 3, 5, 4, 5, 6, 5, 7, 6],
    audits: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8],
    reports: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
  },
  scoreSummary: {
    averageScore: 82,
    scoredAuditCount: 22,
    categoryAverages: [
      { category: "performance", score: 92 },
      { category: "seo", score: 76 },
      { category: "security", score: 84 },
      { category: "ux", score: 79 },
      { category: "content", score: 70 },
    ],
  },
  severitySummary: {
    critical: 1,
    high: 4,
    medium: 8,
    low: 10,
    info: 5,
    total: 28,
  },
  recentActivity: [
    {
      id: "preview-activity-1",
      type: "audit",
      title: "example.com",
      subtitle: "Analiz tamamlandı",
      createdAt: PREVIEW_NOW,
      href: null,
    },
    {
      id: "preview-activity-2",
      type: "lead",
      title: "Örnek Teknoloji A.Ş.",
      subtitle: "Yeni lead eklendi",
      createdAt: PREVIEW_NOW,
      href: null,
    },
    {
      id: "preview-activity-3",
      type: "website",
      title: "https://preview-demo.test",
      subtitle: "Web sitesi kaydı oluşturuldu",
      createdAt: PREVIEW_NOW,
      href: null,
    },
  ],
  recentLeads: [
    {
      id: "preview-lead-1",
      companyName: "Örnek Teknoloji A.Ş.",
      normalizedDomain: "ornekteknoloji.com",
      status: "qualified",
      createdAt: PREVIEW_NOW,
    },
    {
      id: "preview-lead-2",
      companyName: "Demo Pazarlama Ltd.",
      normalizedDomain: "demopazarlama.com",
      status: "contacted",
      createdAt: PREVIEW_NOW,
    },
  ],
  recentWebsites: [
    {
      id: "preview-website-1",
      label: "https://preview-demo.test",
      leadCompanyName: "Örnek Teknoloji A.Ş.",
      status: "active",
      latestAuditStatus: "completed",
      createdAt: PREVIEW_NOW,
    },
    {
      id: "preview-website-2",
      label: "https://staging-preview.test",
      leadCompanyName: null,
      status: "active",
      latestAuditStatus: "running",
      createdAt: PREVIEW_NOW,
    },
  ],
  recentAudits: [
    {
      id: "preview-audit-1",
      status: "running",
      type: "full",
      websiteLabel: "https://staging-preview.test",
      createdAt: PREVIEW_NOW,
      completedAt: null,
    },
    {
      id: "preview-audit-2",
      status: "queued",
      type: "quick",
      websiteLabel: "https://preview-demo.test",
      createdAt: PREVIEW_NOW,
      completedAt: null,
    },
  ],
};
