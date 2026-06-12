import type { LeadRow } from "@/features/leads/lead.types";
import { mapLeadRow } from "@/features/leads/lead.utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type {
  DashboardActivityItem,
  DashboardKpis,
  DashboardOverview,
  DashboardRecentAudit,
  DashboardRecentLead,
  DashboardRecentWebsite,
  DashboardScoreSummary,
  DashboardSeveritySummary,
  DashboardStats,
  DashboardTrendSeries,
  FindingSeverity,
} from "./dashboard.types";
import {
  averageRounded,
  countRecordsByDay,
  formatTrendLabel,
  getTrendDayKeys,
} from "./dashboard.utils";

const TREND_DAYS = 14;
const TREND_FETCH_LIMIT = 200;
const ACTIVITY_LIMIT = 8;

function getTrendSinceIso(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (TREND_DAYS - 1));
  return date.toISOString();
}

export async function getDashboardStats(
  workspaceId: string,
): Promise<DashboardStats & { totalAudits: number }> {
  const supabase = await createServerSupabaseClient();

  const [leadsResult, websitesResult, pendingAuditsResult, completedAuditsResult, totalAuditsResult] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null),
      supabase
        .from("websites")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .neq("status", "archived"),
      supabase
        .from("audits")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .in("status", ["queued", "running"]),
      supabase
        .from("audits")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "completed"),
      supabase
        .from("audits")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId),
    ]);

  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }

  if (websitesResult.error) {
    throw new Error(websitesResult.error.message);
  }

  if (pendingAuditsResult.error) {
    throw new Error(pendingAuditsResult.error.message);
  }

  if (completedAuditsResult.error) {
    throw new Error(completedAuditsResult.error.message);
  }

  if (totalAuditsResult.error) {
    throw new Error(totalAuditsResult.error.message);
  }

  return {
    totalLeads: leadsResult.count ?? 0,
    activeWebsites: websitesResult.count ?? 0,
    pendingAudits: pendingAuditsResult.count ?? 0,
    completedAudits: completedAuditsResult.count ?? 0,
    totalAudits: totalAuditsResult.count ?? 0,
  };
}

async function getScoreAndFindingCounts(workspaceId: string): Promise<{
  averageScore: number | null;
  criticalFindings: number;
}> {
  const supabase = await createServerSupabaseClient();

  const [auditsResult, criticalResult, highResult] = await Promise.all([
    supabase
      .from("audits")
      .select("overall_score")
      .eq("workspace_id", workspaceId)
      .eq("status", "completed")
      .not("overall_score", "is", null)
      .limit(100),
    supabase
      .from("audit_findings")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("severity", "critical"),
    supabase
      .from("audit_findings")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("severity", "high"),
  ]);

  if (auditsResult.error) {
    throw new Error(auditsResult.error.message);
  }

  if (criticalResult.error) {
    throw new Error(criticalResult.error.message);
  }

  if (highResult.error) {
    throw new Error(highResult.error.message);
  }

  const scores = (auditsResult.data ?? [])
    .map((row) => row.overall_score)
    .filter((score): score is number => score !== null);

  return {
    averageScore: averageRounded(scores),
    criticalFindings: (criticalResult.count ?? 0) + (highResult.count ?? 0),
  };
}

export async function getDashboardKpis(workspaceId: string): Promise<DashboardKpis> {
  const [stats, scoreData] = await Promise.all([
    getDashboardStats(workspaceId),
    getScoreAndFindingCounts(workspaceId),
  ]);

  const { totalAudits: _totalAudits, ...dashboardStats } = stats;

  return {
    ...dashboardStats,
    averageScore: scoreData.averageScore,
    criticalFindings: scoreData.criticalFindings,
  };
}

export async function getDashboardTrends(workspaceId: string): Promise<DashboardTrendSeries> {
  const supabase = await createServerSupabaseClient();
  const since = getTrendSinceIso();

  const [leadsResult, websitesResult, auditsResult] = await Promise.all([
    supabase
      .from("leads")
      .select("created_at")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(TREND_FETCH_LIMIT),
    supabase
      .from("websites")
      .select("created_at")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(TREND_FETCH_LIMIT),
    supabase
      .from("audits")
      .select("created_at")
      .eq("workspace_id", workspaceId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(TREND_FETCH_LIMIT),
  ]);

  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }

  if (websitesResult.error) {
    throw new Error(websitesResult.error.message);
  }

  if (auditsResult.error) {
    throw new Error(auditsResult.error.message);
  }

  const dayKeys = getTrendDayKeys(TREND_DAYS);

  return {
    labels: dayKeys.map(formatTrendLabel),
    leads: countRecordsByDay(leadsResult.data ?? [], TREND_DAYS),
    websites: countRecordsByDay(websitesResult.data ?? [], TREND_DAYS),
    audits: countRecordsByDay(auditsResult.data ?? [], TREND_DAYS),
  };
}

export async function getAuditScoreSummary(workspaceId: string): Promise<DashboardScoreSummary> {
  const supabase = await createServerSupabaseClient();

  const [auditsResult, scoresResult] = await Promise.all([
    supabase
      .from("audits")
      .select("overall_score")
      .eq("workspace_id", workspaceId)
      .eq("status", "completed")
      .not("overall_score", "is", null)
      .limit(100),
    supabase
      .from("audit_scores")
      .select("category, score")
      .eq("workspace_id", workspaceId)
      .limit(200),
  ]);

  if (auditsResult.error) {
    throw new Error(auditsResult.error.message);
  }

  if (scoresResult.error) {
    throw new Error(scoresResult.error.message);
  }

  const overallScores = (auditsResult.data ?? [])
    .map((row) => row.overall_score)
    .filter((score): score is number => score !== null);

  const categoryTotals = new Map<string, { sum: number; count: number }>();

  for (const row of scoresResult.data ?? []) {
    const current = categoryTotals.get(row.category) ?? { sum: 0, count: 0 };
    categoryTotals.set(row.category, {
      sum: current.sum + row.score,
      count: current.count + 1,
    });
  }

  const categoryAverages = [...categoryTotals.entries()]
    .map(([category, value]) => ({
      category,
      score: Math.round(value.sum / value.count),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
    .slice(0, 6);

  return {
    averageScore: averageRounded(overallScores),
    scoredAuditCount: overallScores.length,
    categoryAverages,
  };
}

export async function getFindingSeveritySummary(
  workspaceId: string,
): Promise<DashboardSeveritySummary> {
  const supabase = await createServerSupabaseClient();
  const severities: FindingSeverity[] = ["critical", "high", "medium", "low", "info"];

  const results = await Promise.all(
    severities.map((severity) =>
      supabase
        .from("audit_findings")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("severity", severity),
    ),
  );

  const counts: Record<FindingSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (let index = 0; index < severities.length; index += 1) {
    const result = results[index];

    if (result.error) {
      throw new Error(result.error.message);
    }

    counts[severities[index]] = result.count ?? 0;
  }

  const total =
    counts.critical + counts.high + counts.medium + counts.low + counts.info;

  return { ...counts, total };
}

export async function getRecentActivity(workspaceId: string): Promise<DashboardActivityItem[]> {
  const supabase = await createServerSupabaseClient();

  const [leadsResult, websitesResult, auditsResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id, company_name, created_at")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("websites")
      .select("id, url, domain, normalized_url, created_at")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("audits")
      .select(
        "id, status, created_at, website_id, websites!website_id ( url, domain, normalized_url )",
      )
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }

  if (websitesResult.error) {
    throw new Error(websitesResult.error.message);
  }

  if (auditsResult.error) {
    throw new Error(auditsResult.error.message);
  }

  const activities: DashboardActivityItem[] = [];

  for (const lead of leadsResult.data ?? []) {
    activities.push({
      id: `lead-${lead.id}`,
      type: "lead",
      title: lead.company_name,
      subtitle: "Yeni lead eklendi",
      createdAt: lead.created_at,
      href: `/dashboard/leads/${lead.id}`,
    });
  }

  for (const website of websitesResult.data ?? []) {
    activities.push({
      id: `website-${website.id}`,
      type: "website",
      title: website.url ?? website.domain ?? website.normalized_url,
      subtitle: "Web sitesi kaydı oluşturuldu",
      createdAt: website.created_at,
      href: `/dashboard/websites/${website.id}`,
    });
  }

  for (const audit of auditsResult.data ?? []) {
    const website = audit.websites as {
      url: string;
      domain: string;
      normalized_url: string;
    } | null;

    activities.push({
      id: `audit-${audit.id}`,
      type: "audit",
      title: website?.url ?? website?.domain ?? website?.normalized_url ?? "Analiz",
      subtitle: `Analiz ${audit.status === "completed" ? "tamamlandı" : "başlatıldı"}`,
      createdAt: audit.created_at,
      href:
        audit.status === "completed"
          ? `/dashboard/audits/${audit.id}/report`
          : `/dashboard/websites/${audit.website_id}`,
    });
  }

  return activities
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, ACTIVITY_LIMIT);
}

export async function getRecentLeads(workspaceId: string): Promise<DashboardRecentLead[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, company_name, status, created_at, metadata, location, contact_name, contact_email, contact_phone",
    )
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const lead = mapLeadRow(row as LeadRow);

    return {
      id: lead.id,
      companyName: lead.company_name,
      normalizedDomain: lead.normalizedDomain,
      status: lead.status,
      createdAt: lead.created_at,
    };
  });
}

async function attachLatestAuditStatuses(
  workspaceId: string,
  websites: Array<DashboardRecentWebsite & { lastAuditId: string | null }>,
): Promise<DashboardRecentWebsite[]> {
  if (websites.length === 0) {
    return websites;
  }

  const supabase = await createServerSupabaseClient();
  const auditIds = [
    ...new Set(
      websites
        .map((website) => website.lastAuditId)
        .filter((auditId): auditId is string => Boolean(auditId)),
    ),
  ];

  const statusByAuditId = new Map<string, DashboardRecentWebsite["latestAuditStatus"]>();

  if (auditIds.length > 0) {
    const { data: audits, error } = await supabase
      .from("audits")
      .select("id, status")
      .eq("workspace_id", workspaceId)
      .in("id", auditIds);

    if (error) {
      throw new Error(error.message);
    }

    for (const audit of audits ?? []) {
      statusByAuditId.set(audit.id, audit.status);
    }
  }

  return websites.map(({ lastAuditId, ...website }) => ({
    ...website,
    latestAuditStatus: lastAuditId ? (statusByAuditId.get(lastAuditId) ?? null) : null,
  }));
}

export async function getRecentWebsites(workspaceId: string): Promise<DashboardRecentWebsite[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select(
      "id, url, domain, normalized_url, status, created_at, last_audit_id, leads ( company_name )",
    )
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  const websites = (data ?? []).map((row) => {
    const leads = row.leads as { company_name: string } | null;

    return {
      id: row.id,
      label: row.url ?? row.domain ?? row.normalized_url,
      leadCompanyName: leads?.company_name ?? null,
      status: row.status,
      latestAuditStatus: null,
      createdAt: row.created_at,
      lastAuditId: row.last_audit_id,
    };
  });

  return attachLatestAuditStatuses(workspaceId, websites);
}

export async function getRecentAudits(workspaceId: string): Promise<DashboardRecentAudit[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .select(
      "id, status, type, created_at, completed_at, websites!website_id ( url, domain, normalized_url )",
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const website = row.websites as {
      url: string;
      domain: string;
      normalized_url: string;
    } | null;

    return {
      id: row.id,
      status: row.status,
      type: row.type,
      websiteLabel: website?.url ?? website?.domain ?? website?.normalized_url ?? "—",
      createdAt: row.created_at,
      completedAt: row.completed_at,
    };
  });
}

export async function getDashboardOverview(
  workspaceId: string,
  workspaceName = "Çalışma Alanı",
): Promise<DashboardOverview> {
  const [
    stats,
    kpis,
    trends,
    scoreSummary,
    severitySummary,
    recentActivity,
    recentLeads,
    recentWebsites,
    recentAudits,
  ] = await Promise.all([
    getDashboardStats(workspaceId),
    getDashboardKpis(workspaceId),
    getDashboardTrends(workspaceId),
    getAuditScoreSummary(workspaceId),
    getFindingSeveritySummary(workspaceId),
    getRecentActivity(workspaceId),
    getRecentLeads(workspaceId),
    getRecentWebsites(workspaceId),
    getRecentAudits(workspaceId),
  ]);

  const { totalAudits, ...dashboardStats } = stats;

  return {
    workspaceId,
    workspaceName,
    stats: dashboardStats,
    kpis,
    trends,
    scoreSummary,
    severitySummary,
    recentActivity,
    recentLeads,
    recentWebsites,
    recentAudits,
    isFullyEmpty:
      dashboardStats.totalLeads === 0 &&
      dashboardStats.activeWebsites === 0 &&
      totalAudits === 0,
  };
}
