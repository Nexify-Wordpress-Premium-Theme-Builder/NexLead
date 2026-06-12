import type { Enums, Json, Tables } from "@nexlead/types";

import type { WebsiteFetchSnapshot } from "./website-fetch.types";

export type FindingCategory = Enums<"finding_category">;
export type FindingSeverity = Enums<"finding_severity">;

export type AuditRow = Tables<"audits">;
export type WebsiteRow = Tables<"websites">;
export type LeadRow = Tables<"leads">;

export type AuditEvidence = {
  check_key: string;
  checked_value?: string | null;
  expected_value?: string | null;
  source_table?: string;
  source_field?: string;
  status_code?: number | null;
  requested_url?: string | null;
  final_url?: string | null;
  content_type?: string | null;
  response_time_ms?: number | null;
  source?: string;
  expected?: string | null;
  actual?: string | null;
};

export type AuditOutputContext = {
  audit: AuditRow;
  website: WebsiteRow;
  lead: LeadRow | null;
  fetchSnapshot: WebsiteFetchSnapshot | null;
};

export type DeterministicAuditCheck = {
  key: string;
  passed: boolean;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation: string;
  evidence: AuditEvidence;
  scoreImpacts: Partial<Record<FindingCategory, number>>;
};

export type AuditScoreInput = {
  category: FindingCategory;
  score: number;
  weight?: number;
};

export type AuditFindingInput = {
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation: string;
  evidence: AuditEvidence;
  affected_url?: string | null;
};

export type ScoreBreakdown = Record<FindingCategory, number>;

export type GenerateAuditOutputResult = {
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  scoresCreated: number;
  findingsCreated: number;
  skipped: boolean;
  fetchAttempted: boolean;
  fetchOk: boolean;
};

export type AuditOutputJobResult = {
  engine: "safe_fetch_foundation";
  findingsGenerated: boolean;
  scoresGenerated: boolean;
  overallScore: number;
  findingsCount: number;
  scoresCount: number;
  fetchAttempted: boolean;
  fetchOk: boolean;
};

export function toJsonValue(value: ScoreBreakdown): Json {
  return value as Json;
}
