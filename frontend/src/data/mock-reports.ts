import type { IndustryPerformance, PageKpi } from "@/types/pages";

export const mockReportsKpis: PageKpi[] = [
  {
    id: "growth",
    label: "Müşteri Artışı",
    numericValue: 186,
    prefix: "+",
    suffix: "%",
    decimals: 1,
    accent: "green",
  },
  {
    id: "audit",
    label: "Analiz Tamamlanma",
    numericValue: 74,
    suffix: "%",
    accent: "blue",
  },
  {
    id: "reply",
    label: "Yanıt Oranı",
    numericValue: 183,
    suffix: "%",
    decimals: 1,
    accent: "purple",
  },
  {
    id: "conversion",
    label: "Görüşme Dönüşümü",
    numericValue: 84,
    suffix: "%",
    decimals: 1,
    accent: "orange",
  },
];

export const mockLeadQualityData = [
  { label: "Yüksek Fırsat", value: 612, max: 2482 },
  { label: "Analiz Edildi", value: 1840, max: 2482 },
  { label: "Mesaj Hazır", value: 246, max: 2482 },
  { label: "Planlanan Görüşme", value: 86, max: 2482 },
];

export const mockOutreachPerformance = [
  { label: "Gönderildi", value: 1014 },
  { label: "Açıldı", value: 642 },
  { label: "Yanıt Geldi", value: 186 },
  { label: "Planlandı", value: 86 },
];

export const mockAuditTrends = [
  { label: "SEO", issues: 24 },
  { label: "Hız", issues: 31 },
  { label: "Mobil", issues: 15 },
  { label: "CTA", issues: 18 },
  { label: "Takip", issues: 12 },
];

export const mockMeetingConversion = [
  { month: "Oca", rate: 6.2 },
  { month: "Şub", rate: 7.1 },
  { month: "Mar", rate: 7.8 },
  { month: "Nis", rate: 8.0 },
  { month: "May", rate: 8.4 },
];

export const mockIndustryPerformance: IndustryPerformance[] = [
  { industry: "SaaS", replyRate: 24.5 },
  { industry: "Danışmanlık", replyRate: 19.2 },
  { industry: "Pazarlama", replyRate: 16.8 },
  { industry: "Lojistik", replyRate: 12.4 },
  { industry: "Sağlık", replyRate: 11.6 },
];

export type ReportRange = "7d" | "30d" | "90d";

export const reportRangeOptions = [
  { id: "7d" as const, label: "Son 7 gün" },
  { id: "30d" as const, label: "Son 30 gün" },
  { id: "90d" as const, label: "Son 90 gün" },
];

export const reportDataByRange: Record<
  ReportRange,
  {
    kpis: PageKpi[];
    leadQuality: typeof mockLeadQualityData;
    outreach: typeof mockOutreachPerformance;
    industries: IndustryPerformance[];
  }
> = {
  "7d": {
    kpis: [
      { id: "growth", label: "Müşteri Artışı", numericValue: 92, prefix: "+", suffix: "%", decimals: 1, accent: "green" },
      { id: "audit", label: "Analiz Tamamlanma", numericValue: 68, suffix: "%", accent: "blue" },
      { id: "reply", label: "Yanıt Oranı", numericValue: 162, suffix: "%", decimals: 1, accent: "purple" },
      { id: "conversion", label: "Görüşme Dönüşümü", numericValue: 72, suffix: "%", decimals: 1, accent: "orange" },
    ],
    leadQuality: mockLeadQualityData.map((item) => ({ ...item, value: Math.round(item.value * 0.18) })),
    outreach: mockOutreachPerformance.map((item) => ({ ...item, value: Math.round(item.value * 0.15) })),
    industries: mockIndustryPerformance.map((item) => ({ ...item, replyRate: Number((item.replyRate * 0.85).toFixed(1)) })),
  },
  "30d": {
    kpis: mockReportsKpis,
    leadQuality: mockLeadQualityData,
    outreach: mockOutreachPerformance,
    industries: mockIndustryPerformance,
  },
  "90d": {
    kpis: [
      { id: "growth", label: "Müşteri Artışı", numericValue: 224, prefix: "+", suffix: "%", decimals: 1, accent: "green" },
      { id: "audit", label: "Analiz Tamamlanma", numericValue: 81, suffix: "%", accent: "blue" },
      { id: "reply", label: "Yanıt Oranı", numericValue: 196, suffix: "%", decimals: 1, accent: "purple" },
      { id: "conversion", label: "Görüşme Dönüşümü", numericValue: 96, suffix: "%", decimals: 1, accent: "orange" },
    ],
    leadQuality: mockLeadQualityData,
    outreach: mockOutreachPerformance.map((item) => ({ ...item, value: Math.round(item.value * 1.2) })),
    industries: mockIndustryPerformance.map((item) => ({ ...item, replyRate: Number((item.replyRate * 1.08).toFixed(1)) })),
  },
};
