import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getWebsiteById } from "@/features/websites/website.service";
import type { WebsiteWithRelations } from "@/features/websites/website.types";

import type {
  AuditCategoryScore,
  AuditFindingItem,
  AuditResultAuditRef,
  AuditScoresView,
  WebsiteAuditResult,
} from "./audit-result.types";
import { formatEvidenceSummary, sortFindingsBySeverity } from "./audit-result.utils";

const MAX_FINDINGS = 50;

export async function getLatestCompletedAuditForWebsite(
  workspaceId: string,
  websiteId: string,
): Promise<AuditResultAuditRef & { overall_score: number | null } | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .select("id, status, created_at, completed_at, overall_score")
    .eq("workspace_id", workspaceId)
    .eq("website_id", websiteId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAuditScoresForAudit(
  workspaceId: string,
  auditId: string,
): Promise<AuditCategoryScore[]> {
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

export async function getAuditFindingsForAudit(
  workspaceId: string,
  auditId: string,
  limit = MAX_FINDINGS,
): Promise<AuditFindingItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audit_findings")
    .select(
      "id, title, description, recommendation, category, severity, evidence, created_at",
    )
    .eq("workspace_id", workspaceId)
    .eq("audit_id", auditId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const findings = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    recommendation: row.recommendation,
    category: row.category,
    severity: row.severity,
    evidenceSummary: formatEvidenceSummary(row.evidence),
    created_at: row.created_at,
  }));

  return sortFindingsBySeverity(findings);
}

async function getAuditRef(
  workspaceId: string,
  auditId: string,
): Promise<AuditResultAuditRef & { overall_score: number | null } | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .select("id, status, created_at, completed_at, overall_score")
    .eq("workspace_id", workspaceId)
    .eq("id", auditId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function hasAuditOutput(
  overallScore: number | null,
  categories: AuditCategoryScore[],
  findings: AuditFindingItem[],
): boolean {
  return overallScore !== null || categories.length > 0 || findings.length > 0;
}

type WebsiteAuditResultOptions = {
  latestAudit?: WebsiteWithRelations["latestAudit"];
};

export async function getWebsiteAuditResult(
  workspaceId: string,
  websiteId: string,
  options?: WebsiteAuditResultOptions,
): Promise<WebsiteAuditResult | null> {
  let latest = options?.latestAudit;

  if (latest === undefined) {
    const website = await getWebsiteById(workspaceId, websiteId);

    if (!website) {
      return null;
    }

    latest = website.latestAudit;
  }

  if (!latest) {
    return {
      state: "no_audit",
      latestAudit: null,
      scores: null,
      findings: [],
    };
  }

  if (latest.status === "queued") {
    return {
      state: "queued",
      latestAudit: {
        id: latest.id,
        status: latest.status,
        created_at: latest.created_at,
        completed_at: null,
      },
      scores: null,
      findings: [],
    };
  }

  if (latest.status === "running") {
    return {
      state: "running",
      latestAudit: {
        id: latest.id,
        status: latest.status,
        created_at: latest.created_at,
        completed_at: null,
      },
      scores: null,
      findings: [],
    };
  }

  if (latest.status === "failed") {
    return {
      state: "failed",
      latestAudit: {
        id: latest.id,
        status: latest.status,
        created_at: latest.created_at,
        completed_at: null,
      },
      scores: null,
      findings: [],
    };
  }

  if (latest.status === "cancelled") {
    return {
      state: "cancelled",
      latestAudit: {
        id: latest.id,
        status: latest.status,
        created_at: latest.created_at,
        completed_at: null,
      },
      scores: null,
      findings: [],
    };
  }

  const auditRow = await getAuditRef(workspaceId, latest.id);

  if (!auditRow) {
    return {
      state: "completed_empty",
      latestAudit: {
        id: latest.id,
        status: latest.status,
        created_at: latest.created_at,
        completed_at: null,
      },
      scores: null,
      findings: [],
    };
  }

  const [categories, findings] = await Promise.all([
    getAuditScoresForAudit(workspaceId, auditRow.id),
    getAuditFindingsForAudit(workspaceId, auditRow.id),
  ]);

  const scores: AuditScoresView = {
    overallScore: auditRow.overall_score,
    categories,
  };

  const latestAudit: AuditResultAuditRef = {
    id: auditRow.id,
    status: auditRow.status,
    created_at: auditRow.created_at,
    completed_at: auditRow.completed_at,
  };

  if (!hasAuditOutput(auditRow.overall_score, categories, findings)) {
    return {
      state: "completed_empty",
      latestAudit,
      scores,
      findings: [],
    };
  }

  return {
    state: "completed_with_data",
    latestAudit,
    scores,
    findings,
  };
}
