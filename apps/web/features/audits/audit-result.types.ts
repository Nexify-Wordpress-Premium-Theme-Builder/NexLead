import type { Tables } from "@nexlead/types";

import type { AuditStatus } from "@/features/websites/website.types";

export type FindingCategory = Tables<"audit_findings">["category"];
export type FindingSeverity = Tables<"audit_findings">["severity"];

export type AuditFindingItem = {
  id: string;
  title: string;
  description: string;
  recommendation: string | null;
  category: FindingCategory;
  severity: FindingSeverity;
  evidenceSummary: string | null;
  created_at: string;
};

export type AuditCategoryScore = {
  category: FindingCategory;
  score: number;
  weight: number;
};

export type AuditScoresView = {
  overallScore: number | null;
  categories: AuditCategoryScore[];
};

export type AuditResultAuditRef = {
  id: string;
  status: AuditStatus;
  created_at: string;
  completed_at: string | null;
};

export type AuditResultState =
  | "no_audit"
  | "queued"
  | "running"
  | "completed_empty"
  | "completed_with_data"
  | "failed"
  | "cancelled";

export type WebsiteAuditResult = {
  state: AuditResultState;
  latestAudit: AuditResultAuditRef | null;
  scores: AuditScoresView | null;
  findings: AuditFindingItem[];
};
