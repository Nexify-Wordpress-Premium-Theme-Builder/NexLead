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
