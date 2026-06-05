export interface ReportKpi {
  id: string;
  label: string;
  numericValue: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  accent: "blue" | "green" | "purple" | "orange";
}

export interface LeadQualityDatum {
  label: string;
  value: number;
  max: number;
}

export interface OutreachPerformanceDatum {
  label: string;
  value: number;
}

export interface AuditTrendDatum {
  label: string;
  issues: number;
}

export interface MeetingConversionDatum {
  month: string;
  rate: number;
}

export interface IndustryPerformanceDatum {
  industry: string;
  replyRate: number;
}
