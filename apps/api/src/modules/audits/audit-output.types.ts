import type { Enums, Json, Tables } from "@nexlead/types";

export type FindingCategory = Enums<"finding_category">;
export type FindingSeverity = Enums<"finding_severity">;

export type AuditRow = Tables<"audits">;
export type WebsiteRow = Tables<"websites">;
export type LeadRow = Tables<"leads">;

export type AuditEvidence = {
  check_key: string;
  checked_value: string | null;
  expected_value: string | null;
  source_table: string;
  source_field: string;
};

export type AuditOutputContext = {
  audit: AuditRow;
  website: WebsiteRow;
  lead: LeadRow | null;
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
};

export type AuditOutputJobResult = {
  engine: "deterministic_foundation";
  findingsGenerated: boolean;
  scoresGenerated: boolean;
  overallScore: number;
  findingsCount: number;
  scoresCount: number;
};

export function toJsonValue(value: ScoreBreakdown): Json {
  return value as Json;
}
