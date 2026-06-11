import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapLeadRow } from "@/features/leads/lead.utils";

import type {
  DashboardOverview,
  DashboardRecentAudit,
  DashboardRecentLead,
  DashboardRecentWebsite,
  DashboardStats,
} from "./dashboard.types";

async function getWorkspaceName(workspaceId: string): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    return "Çalışma Alanı";
  }

  return data.name;
}

export async function getDashboardStats(workspaceId: string): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [leadsResult, websitesResult, pendingAuditsResult, completedAuditsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null),
      supabase
        .from("websites")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .neq("status", "archived"),
      supabase
        .from("audits")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .in("status", ["queued", "running"]),
      supabase
        .from("audits")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .eq("status", "completed"),
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

  return {
    totalLeads: leadsResult.count ?? 0,
    activeWebsites: websitesResult.count ?? 0,
    pendingAudits: pendingAuditsResult.count ?? 0,
    completedAudits: completedAuditsResult.count ?? 0,
  };
}

export async function getRecentLeads(workspaceId: string): Promise<DashboardRecentLead[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const lead = mapLeadRow(row);

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
  websites: DashboardRecentWebsite[],
): Promise<DashboardRecentWebsite[]> {
  if (websites.length === 0) {
    return websites;
  }

  const supabase = await createServerSupabaseClient();
  const websiteIds = websites.map((website) => website.id);

  const { data: audits, error } = await supabase
    .from("audits")
    .select("website_id, status, created_at")
    .eq("workspace_id", workspaceId)
    .in("website_id", websiteIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const latestByWebsite = new Map<string, DashboardRecentWebsite["latestAuditStatus"]>();

  for (const audit of audits ?? []) {
    if (!latestByWebsite.has(audit.website_id)) {
      latestByWebsite.set(audit.website_id, audit.status);
    }
  }

  return websites.map((website) => ({
    ...website,
    latestAuditStatus: latestByWebsite.get(website.id) ?? null,
  }));
}

export async function getRecentWebsites(workspaceId: string): Promise<DashboardRecentWebsite[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("id, url, domain, normalized_url, status, created_at, leads ( company_name )")
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

async function getTotalAuditCount(workspaceId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from("audits")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getDashboardOverview(workspaceId: string): Promise<DashboardOverview> {
  const [workspaceName, stats, recentLeads, recentWebsites, recentAudits, totalAudits] =
    await Promise.all([
      getWorkspaceName(workspaceId),
      getDashboardStats(workspaceId),
      getRecentLeads(workspaceId),
      getRecentWebsites(workspaceId),
      getRecentAudits(workspaceId),
      getTotalAuditCount(workspaceId),
    ]);

  return {
    workspaceId,
    workspaceName,
    stats,
    recentLeads,
    recentWebsites,
    recentAudits,
    isFullyEmpty: stats.totalLeads === 0 && stats.activeWebsites === 0 && totalAudits === 0,
  };
}
