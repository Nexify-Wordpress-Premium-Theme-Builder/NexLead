import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { WebsiteWithRelations } from "@/features/websites/website.types";
import { mapWebsiteRow } from "@/features/websites/website.utils";

import type { LeadFormInput, LeadWithPrimaryContact } from "./lead.types";
import { buildLocation, mapLeadRow, toLeadMetadata } from "./lead.utils";

function buildLeadInsert(workspaceId: string, userId: string, input: LeadFormInput) {
  const metadata = toLeadMetadata(input);

  return {
    workspace_id: workspaceId,
    company_name: input.companyName.trim(),
    industry: input.industry?.trim() || null,
    location: buildLocation(input.city, input.country),
    notes_summary: input.notes?.trim() || null,
    contact_name: input.contactName?.trim() || null,
    contact_email: input.contactEmail?.trim() || null,
    contact_phone: input.contactPhone?.trim() || null,
    status: "new" as const,
    source_type: "manual" as const,
    created_by: userId,
    metadata,
  };
}

export async function getLeadsForWorkspace(workspaceId: string): Promise<LeadWithPrimaryContact[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapLeadRow);
}

export async function getLeadById(
  workspaceId: string,
  leadId: string,
): Promise<LeadWithPrimaryContact | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapLeadRow(data) : null;
}

export async function getLeadDetail(
  workspaceId: string,
  leadId: string,
): Promise<LeadWithPrimaryContact | null> {
  return getLeadById(workspaceId, leadId);
}

export async function getLeadWebsites(
  workspaceId: string,
  leadId: string,
  leadCompanyName: string,
): Promise<WebsiteWithRelations[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("lead_id", leadId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];

  if (rows.length === 0) {
    return [];
  }

  const websiteIds = rows.map((row) => row.id);

  const { data: audits, error: auditError } = await supabase
    .from("audits")
    .select("id, website_id, status, created_at")
    .eq("workspace_id", workspaceId)
    .in("website_id", websiteIds)
    .order("created_at", { ascending: false });

  if (auditError) {
    throw new Error(auditError.message);
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

  return rows.map((row) =>
    mapWebsiteRow(row, leadCompanyName, latestByWebsite.get(row.id) ?? null),
  );
}

export async function createLeadForWorkspace(
  workspaceId: string,
  userId: string,
  input: LeadFormInput,
): Promise<LeadWithPrimaryContact> {
  const supabase = await createServerSupabaseClient();
  const payload = buildLeadInsert(workspaceId, userId, input);

  const { data, error } = await supabase.from("leads").insert(payload).select("*").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Lead oluşturulamadı");
  }

  return mapLeadRow(data);
}

export async function updateLeadForWorkspace(
  workspaceId: string,
  leadId: string,
  input: LeadFormInput,
): Promise<LeadWithPrimaryContact> {
  const supabase = await createServerSupabaseClient();
  const metadata = toLeadMetadata(input);

  const { data, error } = await supabase
    .from("leads")
    .update({
      company_name: input.companyName.trim(),
      industry: input.industry?.trim() || null,
      location: buildLocation(input.city, input.country),
      notes_summary: input.notes?.trim() || null,
      contact_name: input.contactName?.trim() || null,
      contact_email: input.contactEmail?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      metadata,
    })
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Lead güncellenemedi");
  }

  return mapLeadRow(data);
}

export async function archiveLeadForWorkspace(
  workspaceId: string,
  leadId: string,
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const existing = await getLeadById(workspaceId, leadId);

  if (!existing) {
    throw new Error("Lead arşivlenemedi");
  }

  const { error } = await supabase.rpc("archive_lead", {
    target_lead_id: leadId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
