import type { LeadRow } from "@/features/leads/lead.types";
import { mapLeadRow } from "@/features/leads/lead.utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type {
  DashboardOverview,
  DashboardRecentAudit,
  DashboardRecentLead,
  DashboardRecentWebsite,
  DashboardStats,
} from "./dashboard.types";

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
    .select("id, status, type, created_at, completed_at, websites ( url, domain, normalized_url )")
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
  const [stats, recentLeads, recentWebsites, recentAudits] = await Promise.all([
    getDashboardStats(workspaceId),
    getRecentLeads(workspaceId),
    getRecentWebsites(workspaceId),
    getRecentAudits(workspaceId),
  ]);

  const { totalAudits, ...dashboardStats } = stats;

  return {
    workspaceId,
    workspaceName,
    stats: dashboardStats,
    recentLeads,
    recentWebsites,
    recentAudits,
    isFullyEmpty:
      dashboardStats.totalLeads === 0 &&
      dashboardStats.activeWebsites === 0 &&
      totalAudits === 0,
  };
}
