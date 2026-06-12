import type { Tables } from "@nexlead/types";

import type {
  AuditCategoryScore,
  AuditFindingItem,
  AuditScoresView,
} from "@/features/audits/audit-result.types";
import type { AuditStatus, WebsiteStatus } from "@/features/websites/website.types";

export type AuditType = Tables<"audits">["type"];

export type AuditReportState =
  | "not_ready_queued"
  | "not_ready_running"
  | "not_ready_failed"
  | "limited"
  | "ready";

export type AuditReportAudit = {
  id: string;
  status: AuditStatus;
  type: AuditType;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
  overall_score: number | null;
  error_message: string | null;
  website_id: string;
  job_run_id: string | null;
};

export type ReportWebsite = {
  id: string;
  url: string;
  domain: string;
  status: WebsiteStatus;
  last_audited_at: string | null;
  created_at: string;
};

export type ReportLead = {
  id: string;
  companyName: string;
  normalizedDomain: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

export type PriorityAction = {
  id: string;
  title: string;
  recommendation: string | null;
  severity: AuditFindingItem["severity"];
  category: AuditFindingItem["category"];
};

export type TechnicalSignal = {
  label: string;
  value: string;
};

export type ReportJobInfo = {
  status: string;
  engine: string | null;
  fetchOk: boolean | null;
  completedAt: string | null;
};

export type AuditReport = {
  state: AuditReportState;
  audit: AuditReportAudit;
  website: ReportWebsite;
  lead: ReportLead | null;
  scores: AuditScoresView | null;
  findings: AuditFindingItem[];
  priorityActions: PriorityAction[];
  technicalSignals: TechnicalSignal[];
  summaryText: string;
  generatedAt: string;
  isReportReady: boolean;
  jobInfo: ReportJobInfo | null;
  highSeverityCount: number;
  findingCount: number;
};

export type ReportCategoryScore = AuditCategoryScore;
