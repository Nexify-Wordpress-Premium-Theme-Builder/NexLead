"use server";

import { revalidatePath } from "next/cache";

import { requireWorkspace } from "@/lib/workspace/require-workspace";

import type { WebsiteActionState } from "./website.types";
import {
  archiveWebsiteForWorkspace,
  createWebsiteForWorkspace,
  createWebsiteFromLead,
  startWebsiteAuditForWorkspace,
  updateWebsiteForWorkspace,
} from "./website.service";
import { formDataToWebsiteInput, validateWebsiteForm } from "./website.utils";

const WEBSITES_PATH = "/dashboard/websites";

type WorkspaceResult =
  | { ok: true; workspace: { userId: string; workspaceId: string } }
  | { ok: false; state: WebsiteActionState };

async function getWorkspaceOrError(): Promise<WorkspaceResult> {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return {
      ok: false,
      state: {
        error: "Aktif çalışma alanı bulunamadı. Lütfen oturumu yenileyin.",
      },
    };
  }

  return { ok: true, workspace };
}

export async function createWebsiteAction(
  _prevState: WebsiteActionState,
  formData: FormData,
): Promise<WebsiteActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  const input = formDataToWebsiteInput(formData);
  const validation = validateWebsiteForm(input);

  if (!validation.valid) {
    return { error: validation.error };
  }

  try {
    const { warning } = await createWebsiteForWorkspace(
      workspaceResult.workspace.workspaceId,
      workspaceResult.workspace.userId,
      input,
    );
    revalidatePath(WEBSITES_PATH);

    return {
      success: warning
        ? `Web sitesi oluşturuldu. ${warning}`
        : "Web sitesi başarıyla oluşturuldu.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Web site oluşturulurken bir sorun oluştu.";
    return { error: message };
  }
}

export async function updateWebsiteAction(
  _prevState: WebsiteActionState,
  formData: FormData,
): Promise<WebsiteActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  const websiteId = String(formData.get("websiteId") ?? "").trim();

  if (!websiteId) {
    return { error: "Web site bulunamadı." };
  }

  const input = formDataToWebsiteInput(formData);
  const validation = validateWebsiteForm(input);

  if (!validation.valid) {
    return { error: validation.error };
  }

  try {
    const { warning } = await updateWebsiteForWorkspace(
      workspaceResult.workspace.workspaceId,
      websiteId,
      input,
    );
    revalidatePath(WEBSITES_PATH);

    return {
      success: warning
        ? `Web sitesi güncellendi. ${warning}`
        : "Web sitesi başarıyla güncellendi.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Web site güncellenirken bir sorun oluştu.";
    return { error: message };
  }
}

export async function archiveWebsiteAction(websiteId: string): Promise<WebsiteActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  if (!websiteId) {
    return { error: "Web site bulunamadı." };
  }

  try {
    await archiveWebsiteForWorkspace(workspaceResult.workspace.workspaceId, websiteId);
    revalidatePath(WEBSITES_PATH);
    return { success: "Web sitesi arşivlendi." };
  } catch {
    return { error: "Web site arşivlenirken bir sorun oluştu." };
  }
}

export async function createWebsiteFromLeadAction(leadId: string): Promise<WebsiteActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  if (!leadId) {
    return { error: "Seçilen lead bulunamadı." };
  }

  try {
    const { warning } = await createWebsiteFromLead(
      workspaceResult.workspace.workspaceId,
      workspaceResult.workspace.userId,
      leadId,
    );
    revalidatePath(WEBSITES_PATH);

    return {
      success: warning
        ? `Lead domaininden web sitesi oluşturuldu. ${warning}`
        : "Lead domaininden web sitesi oluşturuldu.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Web site oluşturulurken bir sorun oluştu.";
    return { error: message };
  }
}

export async function startWebsiteAuditAction(websiteId: string): Promise<WebsiteActionState> {
  const workspaceResult = await getWorkspaceOrError();

  if (!workspaceResult.ok) {
    return workspaceResult.state;
  }

  if (!websiteId) {
    return { error: "Web site bulunamadı." };
  }

  try {
    await startWebsiteAuditForWorkspace(
      workspaceResult.workspace.workspaceId,
      workspaceResult.workspace.userId,
      websiteId,
    );
    revalidatePath(WEBSITES_PATH);
    return { success: "Analiz isteği oluşturuldu." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analiz isteği oluşturulurken bir sorun oluştu.";
    return { error: message };
  }
}
