import type { IndustryPerformance, PageKpi } from "@/types/pages";

export const mockReportsKpis: PageKpi[] = [
  {
    id: "growth",
    label: "Lead Growth",
    numericValue: 186,
    prefix: "+",
    suffix: "%",
    decimals: 1,
    accent: "green",
  },
  {
    id: "audit",
    label: "Audit Completion",
    numericValue: 74,
    suffix: "%",
    accent: "blue",
  },
  {
    id: "reply",
    label: "Reply Rate",
    numericValue: 183,
    suffix: "%",
    decimals: 1,
    accent: "purple",
  },
  {
    id: "conversion",
    label: "Meeting Conversion",
    numericValue: 84,
    suffix: "%",
    decimals: 1,
    accent: "orange",
  },
];

export const mockLeadQualityData = [
  { label: "High Opportunity", value: 612, max: 2482 },
  { label: "Audited", value: 1840, max: 2482 },
  { label: "Message Ready", value: 246, max: 2482 },
  { label: "Meeting Booked", value: 86, max: 2482 },
];

export const mockOutreachPerformance = [
  { label: "Sent", value: 1014 },
  { label: "Opened", value: 642 },
  { label: "Replied", value: 186 },
  { label: "Booked", value: 86 },
];

export const mockAuditTrends = [
  { label: "SEO", issues: 24 },
  { label: "Speed", issues: 31 },
  { label: "Mobile", issues: 15 },
  { label: "CTA", issues: 18 },
  { label: "Tracking", issues: 12 },
];

export const mockMeetingConversion = [
  { month: "Jan", rate: 6.2 },
  { month: "Feb", rate: 7.1 },
  { month: "Mar", rate: 7.8 },
  { month: "Apr", rate: 8.0 },
  { month: "May", rate: 8.4 },
];

export const mockIndustryPerformance: IndustryPerformance[] = [
  { industry: "SaaS", replyRate: 24.5 },
  { industry: "Consulting", replyRate: 19.2 },
  { industry: "Marketing", replyRate: 16.8 },
  { industry: "Logistics", replyRate: 12.4 },
  { industry: "Healthcare", replyRate: 11.6 },
];

export type ReportRange = "7d" | "30d" | "90d";

export const reportRangeOptions = [
  { id: "7d" as const, label: "Last 7 days" },
  { id: "30d" as const, label: "Last 30 days" },
  { id: "90d" as const, label: "Last 90 days" },
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
      { id: "growth", label: "Lead Growth", numericValue: 92, prefix: "+", suffix: "%", decimals: 1, accent: "green" },
      { id: "audit", label: "Audit Completion", numericValue: 68, suffix: "%", accent: "blue" },
      { id: "reply", label: "Reply Rate", numericValue: 162, suffix: "%", decimals: 1, accent: "purple" },
      { id: "conversion", label: "Meeting Conversion", numericValue: 72, suffix: "%", decimals: 1, accent: "orange" },
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
      { id: "growth", label: "Lead Growth", numericValue: 224, prefix: "+", suffix: "%", decimals: 1, accent: "green" },
      { id: "audit", label: "Audit Completion", numericValue: 81, suffix: "%", accent: "blue" },
      { id: "reply", label: "Reply Rate", numericValue: 196, suffix: "%", decimals: 1, accent: "purple" },
      { id: "conversion", label: "Meeting Conversion", numericValue: 96, suffix: "%", decimals: 1, accent: "orange" },
    ],
    leadQuality: mockLeadQualityData,
    outreach: mockOutreachPerformance.map((item) => ({ ...item, value: Math.round(item.value * 1.2) })),
    industries: mockIndustryPerformance.map((item) => ({ ...item, replyRate: Number((item.replyRate * 1.08).toFixed(1)) })),
  },
};
