import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { ReportListItem, ReportsListData, ReportsListSummary } from "./reports-list.types";

const LIST_LIMIT = 100;

function averageRounded(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildSummary(items: ReportListItem[]): ReportsListSummary {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const last30Days = items.filter((item) => {
    if (!item.completedAt) return false;
    return new Date(item.completedAt).getTime() >= thirtyDaysAgo;
  }).length;

  const scores = items
    .map((item) => item.overallScore)
    .filter((score): score is number => score !== null);

  return {
    totalReports: items.length,
    last30Days,
    averageScore: averageRounded(scores),
    criticalReports: items.filter((item) => item.criticalHighCount > 0).length,
  };
}

export async function getReportsList(workspaceId: string): Promise<ReportsListData> {
  const supabase = await createServerSupabaseClient();

  const { data: audits, error } = await supabase
    .from("audits")
    .select(
      "id, status, completed_at, overall_score, website_id, websites!website_id ( id, url, domain, normalized_url, leads ( company_name ) )",
    )
    .eq("workspace_id", workspaceId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (error) {
    throw new Error(error.message);
  }

  const auditRows = audits ?? [];
  const auditIds = auditRows.map((row) => row.id);

  const findingsByAudit = new Map<string, { total: number; criticalHigh: number }>();

  if (auditIds.length > 0) {
    const { data: findings, error: findingsError } = await supabase
      .from("audit_findings")
      .select("audit_id, severity")
      .eq("workspace_id", workspaceId)
      .in("audit_id", auditIds);

    if (findingsError) {
      throw new Error(findingsError.message);
    }

    for (const finding of findings ?? []) {
      const current = findingsByAudit.get(finding.audit_id) ?? { total: 0, criticalHigh: 0 };
      current.total += 1;
      if (finding.severity === "critical" || finding.severity === "high") {
        current.criticalHigh += 1;
      }
      findingsByAudit.set(finding.audit_id, current);
    }
  }

  const items: ReportListItem[] = auditRows.map((row) => {
    const website = row.websites as {
      id: string;
      url: string;
      domain: string;
      normalized_url: string;
      leads: { company_name: string } | null;
    } | null;

    const counts = findingsByAudit.get(row.id) ?? { total: 0, criticalHigh: 0 };

    return {
      auditId: row.id,
      websiteId: row.website_id,
      websiteLabel: website?.url ?? website?.domain ?? website?.normalized_url ?? "—",
      leadCompanyName: website?.leads?.company_name ?? null,
      overallScore: row.overall_score,
      completedAt: row.completed_at,
      findingsCount: counts.total,
      criticalHighCount: counts.criticalHigh,
      status: row.status,
    };
  });

  const summary = buildSummary(items);

  return {
    items,
    summary,
    isEmpty: items.length === 0,
  };
}
