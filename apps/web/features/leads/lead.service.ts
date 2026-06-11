import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  const { error } = await supabase
    .from("leads")
    .update({
      deleted_at: new Date().toISOString(),
      status: "archived",
    })
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message);
  }
}
