import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseLeadMetadata } from "@/features/leads/lead.utils";
import { sortFindingsBySeverity } from "@/features/audits/audit-result.utils";

import type { AuditReport, ReportJobInfo, ReportLead, ReportWebsite } from "./report.types";
import {
  buildPriorityActions,
  buildSummaryText,
  countHighSeverityFindings,
  extractTechnicalSignals,
  mapFindingRows,
  resolveReportState,
} from "./report.utils";

const MAX_FINDINGS = 50;

async function getReportWebsite(
  workspaceId: string,
  websiteId: string,
): Promise<ReportWebsite | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("id, url, domain, status, last_audited_at, created_at")
    .eq("workspace_id", workspaceId)
    .eq("id", websiteId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getReportLead(workspaceId: string, leadId: string): Promise<ReportLead | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, company_name, contact_name, contact_email, contact_phone, metadata")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const metadata = parseLeadMetadata(data.metadata);

  return {
    id: data.id,
    companyName: data.company_name,
    normalizedDomain: metadata.normalized_domain ?? null,
    contactName: data.contact_name,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
  };
}

async function getReportScores(workspaceId: string, auditId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audit_scores")
    .select("category, score, weight")
    .eq("workspace_id", workspaceId)
    .eq("audit_id", auditId)
    .order("category", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    category: row.category,
    score: row.score,
    weight: Number(row.weight),
  }));
}

async function getReportFindings(workspaceId: string, auditId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audit_findings")
    .select(
      "id, title, description, recommendation, category, severity, evidence, created_at",
    )
    .eq("workspace_id", workspaceId)
    .eq("audit_id", auditId)
    .order("created_at", { ascending: false })
    .limit(MAX_FINDINGS);

  if (error) {
    throw new Error(error.message);
  }

  return mapFindingRows(data ?? []);
}

async function getReportJobInfo(
  workspaceId: string,
  jobRunId: string | null,
): Promise<ReportJobInfo | null> {
  if (!jobRunId) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("job_runs")
    .select("status, result, completed_at")
    .eq("workspace_id", workspaceId)
    .eq("id", jobRunId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const result =
    data.result && typeof data.result === "object" && !Array.isArray(data.result)
      ? (data.result as Record<string, unknown>)
      : null;

  return {
    status: data.status,
    engine: typeof result?.engine === "string" ? result.engine : null,
    fetchOk: typeof result?.fetchOk === "boolean" ? result.fetchOk : null,
    completedAt: data.completed_at,
  };
}

export async function getAuditReport(
  workspaceId: string,
  auditId: string,
): Promise<AuditReport | null> {
  const supabase = await createServerSupabaseClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select(
      "id, status, type, created_at, started_at, completed_at, duration_ms, overall_score, error_message, website_id, lead_id, job_run_id, workspace_id",
    )
    .eq("workspace_id", workspaceId)
    .eq("id", auditId)
    .maybeSingle();

  if (auditError) {
    throw new Error(auditError.message);
  }

  if (!audit) {
    return null;
  }

  const website = await getReportWebsite(workspaceId, audit.website_id);

  if (!website) {
    return null;
  }

  const leadId = audit.lead_id;
  const isCompleted = audit.status === "completed";

  const [lead, categories, findingRows, jobInfo] = await Promise.all([
    leadId ? getReportLead(workspaceId, leadId) : Promise.resolve(null),
    isCompleted ? getReportScores(workspaceId, audit.id) : Promise.resolve([]),
    isCompleted ? getReportFindings(workspaceId, audit.id) : Promise.resolve([]),
    getReportJobInfo(workspaceId, audit.job_run_id),
  ]);

  const findings = sortFindingsBySeverity(
    findingRows.map(({ evidence: _evidence, ...finding }) => finding),
  );
  const findingsWithEvidence = findingRows;
  const highSeverityCount = countHighSeverityFindings(findings);
  const state = resolveReportState(
    audit.status,
    audit.overall_score,
    findings.length,
    categories.length,
  );

  const scores =
    categories.length > 0 || audit.overall_score !== null
      ? {
          overallScore: audit.overall_score,
          categories,
        }
      : null;

  const priorityActions = buildPriorityActions(findings);
  const technicalSignals = isCompleted ? extractTechnicalSignals(findingsWithEvidence) : [];
  const summaryText = buildSummaryText(audit.overall_score, findings.length, highSeverityCount);
  const generatedAt = audit.completed_at ?? audit.created_at;

  return {
    state,
    audit: {
      id: audit.id,
      status: audit.status,
      type: audit.type,
      created_at: audit.created_at,
      started_at: audit.started_at,
      completed_at: audit.completed_at,
      duration_ms: audit.duration_ms,
      overall_score: audit.overall_score,
      error_message: audit.error_message,
      website_id: audit.website_id,
      job_run_id: audit.job_run_id,
    },
    website,
    lead,
    scores,
    findings,
    priorityActions,
    technicalSignals,
    summaryText,
    generatedAt,
    isReportReady: state === "ready" || state === "limited",
    jobInfo,
    highSeverityCount,
    findingCount: findings.length,
  };
}
