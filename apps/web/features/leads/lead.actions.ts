"use server";

import { revalidatePath } from "next/cache";

import { requireWorkspace } from "@/lib/workspace/require-workspace";

import {
  archiveLeadForWorkspace,
  createLeadForWorkspace,
  updateLeadForWorkspace,
} from "./lead.service";
import type { LeadActionState } from "./lead.types";
import { formDataToLeadInput, normalizeDomain, validateLeadForm } from "./lead.utils";

const LEADS_PATH = "/dashboard/leads";

async function getWorkspaceOrError(): Promise<WorkspaceResult> {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return {
      ok: false,
      state: {
        error: "Aktif çalışma alanı bulunamadı. Lütfen oturumu yenileyin veya destek ile iletişime geçin.",
      },
    };
  }

  return { ok: true, workspace };
}

type WorkspaceResult =
  | { ok: true; workspace: { userId: string; workspaceId: string } }
  | { ok: false; state: LeadActionState };

export async function createLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  const input = formDataToLeadInput(formData);
  const validation = validateLeadForm(input);

  if (!validation.valid) {
    return { error: validation.error };
  }

  const domain = normalizeDomain(input.website);

  try {
    await createLeadForWorkspace(
      workspaceResult.workspace.workspaceId,
      workspaceResult.workspace.userId,
      input,
    );
    revalidatePath(LEADS_PATH);

    return {
      success: domain.warning
        ? `Lead başarıyla oluşturuldu. ${domain.warning}`
        : "Lead başarıyla oluşturuldu.",
    };
  } catch {
    return { error: "Lead oluşturulurken bir sorun oluştu." };
  }
}

export async function updateLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  const leadId = String(formData.get("leadId") ?? "").trim();

  if (!leadId) {
    return { error: "Lead bulunamadı." };
  }

  const input = formDataToLeadInput(formData);
  const validation = validateLeadForm(input);

  if (!validation.valid) {
    return { error: validation.error };
  }

  const domain = normalizeDomain(input.website);

  try {
    await updateLeadForWorkspace(workspaceResult.workspace.workspaceId, leadId, input);
    revalidatePath(LEADS_PATH);

    return {
      success: domain.warning
        ? `Lead başarıyla güncellendi. ${domain.warning}`
        : "Lead başarıyla güncellendi.",
    };
  } catch {
    return { error: "Lead güncellenirken bir sorun oluştu." };
  }
}

export async function archiveLeadAction(leadId: string): Promise<LeadActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  if (!leadId) {
    return { error: "Lead bulunamadı." };
  }

  try {
    await archiveLeadForWorkspace(workspaceResult.workspace.workspaceId, leadId);
    revalidatePath(LEADS_PATH);
    return { success: "Lead arşivlendi." };
  } catch {
    return { error: "Lead arşivlenirken bir sorun oluştu." };
  }
}
