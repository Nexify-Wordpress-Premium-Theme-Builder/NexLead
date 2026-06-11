import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { LeadOption, WebsiteFormInput, WebsiteWithRelations } from "./website.types";
import { buildWebsitePayload, leadToOption, mapWebsiteRow } from "./website.utils";
import { getLeadById } from "@/features/leads/lead.service";

async function attachLatestAudits(
  workspaceId: string,
  websites: WebsiteWithRelations[],
): Promise<WebsiteWithRelations[]> {
  if (websites.length === 0) {
    return websites;
  }

  const supabase = await createServerSupabaseClient();
  const websiteIds = websites.map((website) => website.id);

  const { data: audits, error } = await supabase
    .from("audits")
    .select("id, website_id, status, created_at")
    .eq("workspace_id", workspaceId)
    .in("website_id", websiteIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const latestByWebsite = new Map<string, WebsiteWithRelations["latestAudit"]>();

  for (const audit of audits ?? []) {
    if (!latestByWebsite.has(audit.website_id)) {
      latestByWebsite.set(audit.website_id, {
        id: audit.id,
        status: audit.status,
        created_at: audit.created_at,
      });
    }
  }

  return websites.map((website) =>
    mapWebsiteRow(website, website.leadCompanyName, latestByWebsite.get(website.id) ?? null),
  );
}

async function mapWebsitesWithLeads(
  workspaceId: string,
  rows: Array<WebsiteWithRelations & { leads?: { company_name: string } | null }>,
): Promise<WebsiteWithRelations[]> {
  const mapped = rows.map((row) => {
    const { leads, ...website } = row;

    return mapWebsiteRow(website, leads?.company_name ?? null, null);
  });

  return attachLatestAudits(workspaceId, mapped);
}

export async function getWebsitesForWorkspace(workspaceId: string): Promise<WebsiteWithRelations[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*, leads ( company_name )")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapWebsitesWithLeads(workspaceId, (data ?? []) as Array<
    WebsiteWithRelations & { leads?: { company_name: string } | null }
  >);
}

export async function getWebsiteById(
  workspaceId: string,
  websiteId: string,
): Promise<WebsiteWithRelations | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*, leads ( company_name )")
    .eq("workspace_id", workspaceId)
    .eq("id", websiteId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const [website] = await mapWebsitesWithLeads(workspaceId, [
    data as WebsiteWithRelations & { leads?: { company_name: string } | null },
  ]);

  return website ?? null;
}

export async function getLeadOptionsForWorkspace(workspaceId: string): Promise<LeadOption[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, company_name, metadata")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("company_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(leadToOption);
}

async function verifyLeadInWorkspace(workspaceId: string, leadId: string): Promise<boolean> {
  const lead = await getLeadById(workspaceId, leadId);
  return lead !== null;
}

export async function createWebsiteForWorkspace(
  workspaceId: string,
  userId: string,
  input: WebsiteFormInput,
): Promise<{ website: WebsiteWithRelations; warning?: string }> {
  if (input.leadId) {
    const validLead = await verifyLeadInWorkspace(workspaceId, input.leadId);

    if (!validLead) {
      throw new Error("Seçilen lead bulunamadı.");
    }
  }

  const supabase = await createServerSupabaseClient();
  const { payload, warning } = buildWebsitePayload(workspaceId, userId, input, input.leadId);

  const { data, error } = await supabase.from("websites").insert(payload).select("*").single();

  if (error || !data) {
    if (error?.code === "23505") {
      throw new Error("Bu web sitesi zaten bu çalışma alanında kayıtlı.");
    }

    throw new Error(error?.message ?? "Web site oluşturulamadı");
  }

  const website = await getWebsiteById(workspaceId, data.id);

  if (!website) {
    throw new Error("Web site oluşturulamadı");
  }

  return { website, warning };
}

export async function createWebsiteFromLead(
  workspaceId: string,
  userId: string,
  leadId: string,
): Promise<{ website: WebsiteWithRelations; warning?: string }> {
  const lead = await getLeadById(workspaceId, leadId);

  if (!lead) {
    throw new Error("Seçilen lead bulunamadı.");
  }

  const domain = lead.normalizedDomain;

  if (!domain) {
    throw new Error("Lead üzerinde kullanılabilir bir domain bulunamadı.");
  }

  return createWebsiteForWorkspace(workspaceId, userId, {
    websiteUrl: domain,
    leadId,
    description: lead.notes_summary ?? undefined,
  });
}

export async function updateWebsiteForWorkspace(
  workspaceId: string,
  websiteId: string,
  input: WebsiteFormInput,
): Promise<{ website: WebsiteWithRelations; warning?: string }> {
  const existing = await getWebsiteById(workspaceId, websiteId);

  if (!existing) {
    throw new Error("Web site bulunamadı.");
  }

  if (input.leadId) {
    const validLead = await verifyLeadInWorkspace(workspaceId, input.leadId);

    if (!validLead) {
      throw new Error("Seçilen lead bulunamadı.");
    }
  }

  const supabase = await createServerSupabaseClient();
  const { payload, warning } = buildWebsitePayload(workspaceId, existing.created_by ?? "", input, input.leadId);

  const { data, error } = await supabase
    .from("websites")
    .update({
      lead_id: input.leadId ?? null,
      url: payload.url,
      domain: payload.domain,
      normalized_url: payload.normalized_url,
      description: payload.description,
    })
    .eq("workspace_id", workspaceId)
    .eq("id", websiteId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Web site güncellenemedi");
  }

  const website = await getWebsiteById(workspaceId, data.id);

  if (!website) {
    throw new Error("Web site güncellenemedi");
  }

  return { website, warning };
}

export async function archiveWebsiteForWorkspace(
  workspaceId: string,
  websiteId: string,
): Promise<void> {
  const existing = await getWebsiteById(workspaceId, websiteId);

  if (!existing) {
    throw new Error("Web site arşivlenemedi");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("archive_website", {
    target_website_id: websiteId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function startWebsiteAuditForWorkspace(
  workspaceId: string,
  userId: string,
  websiteId: string,
): Promise<WebsiteWithRelations> {
  const website = await getWebsiteById(workspaceId, websiteId);

  if (!website) {
    throw new Error("Web site bulunamadı.");
  }

  if (website.isAuditRunning) {
    throw new Error("Bu web sitesi için devam eden bir analiz isteği var.");
  }

  const supabase = await createServerSupabaseClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .insert({
      workspace_id: workspaceId,
      website_id: websiteId,
      lead_id: website.lead_id,
      type: "manual",
      status: "queued",
      created_by: userId,
    })
    .select("id")
    .single();

  if (auditError || !audit) {
    if (auditError?.code === "23505") {
      throw new Error("Bu web sitesi için devam eden bir analiz isteği var.");
    }

    throw new Error(auditError?.message ?? "Analiz isteği oluşturulamadı");
  }

  const { error: websiteError } = await supabase
    .from("websites")
    .update({
      status: "active",
      last_audit_id: audit.id,
    })
    .eq("workspace_id", workspaceId)
    .eq("id", websiteId)
    .is("deleted_at", null);

  if (websiteError) {
    throw new Error(websiteError.message);
  }

  const updated = await getWebsiteById(workspaceId, websiteId);

  if (!updated) {
    throw new Error("Analiz isteği oluşturuldu ancak web sitesi güncellenemedi.");
  }

  return updated;
}
