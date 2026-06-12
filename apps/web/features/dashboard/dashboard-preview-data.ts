import type { DashboardOverview } from "@/features/dashboard/dashboard.types";
import { formatTrendLabel, getTrendDayKeys } from "@/features/dashboard/dashboard.utils";

const PREVIEW_NOW = new Date().toISOString();

const trendDayKeys = getTrendDayKeys(14);

/**
 * Kontrollü frontend önizleme verisi.
 * Yalnızca apps/web dashboard UI görünümünü test etmek için kullanılır.
 * Supabase'e yazılmaz; gerçek veri varsa merge fonksiyonu bunu kullanmaz.
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
    totalLeads: 12,
    activeWebsites: 8,
    pendingAudits: 2,
    completedAudits: 14,
    averageScore: 82,
    criticalFindings: 3,
  },
  trends: {
    labels: trendDayKeys.map(formatTrendLabel),
    leads: [0, 1, 0, 2, 1, 0, 2, 1, 2, 1, 3, 2, 2, 3],
    websites: [1, 0, 1, 1, 2, 1, 0, 2, 1, 2, 2, 3, 2, 2],
    audits: [0, 0, 1, 1, 2, 2, 3, 2, 4, 3, 3, 4, 4, 5],
  },
  scoreSummary: {
    averageScore: 82,
    scoredAuditCount: 14,
    categoryAverages: [
      { category: "seo", score: 76 },
      { category: "security", score: 91 },
      { category: "technical", score: 88 },
      { category: "ux", score: 79 },
    ],
  },
  severitySummary: {
    critical: 1,
    high: 2,
    medium: 4,
    low: 6,
    info: 3,
    total: 16,
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
      status: "new",
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
