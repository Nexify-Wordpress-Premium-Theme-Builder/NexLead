import type { TablesInsert, TablesUpdate } from "@nexlead/types";

import { createAdminSupabaseClient } from "../../supabase/admin-client";

import { generateAuditOutput } from "./audit-output.service";
import type { AuditOutputJobResult, GenerateAuditOutputResult } from "./audit-output.types";
import type {
  AuditClaimResult,
  AuditRow,
  AuditWorkerResult,
  WebsiteRow,
} from "./audit-worker.types";

const MAX_CLAIM_ATTEMPTS = 5;

function nowIso(): string {
  return new Date().toISOString();
}

function durationMs(startedAt: string | null): number | null {
  if (!startedAt) {
    return null;
  }

  return Math.max(0, Date.now() - new Date(startedAt).getTime());
}

function isWebsiteUrlValid(website: WebsiteRow): boolean {
  const url = website.url?.trim() ?? "";
  const domain = website.domain?.trim() ?? "";
  const normalizedUrl = website.normalized_url?.trim() ?? "";

  return url.length >= 3 && domain.length >= 3 && normalizedUrl.length >= 3;
}

export async function getNextQueuedAudit(): Promise<AuditRow | null> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function claimAudit(auditId: string): Promise<AuditClaimResult> {
  const supabase = createAdminSupabaseClient();
  const startedAt = nowIso();

  const { data, error } = await supabase
    .from("audits")
    .update({
      status: "running",
      started_at: startedAt,
      error_message: null,
    })
    .eq("id", auditId)
    .eq("status", "queued")
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { claimed: false, reason: "not_queued" };
  }

  return { claimed: true, audit: data };
}

export async function createAuditJobRun(audit: AuditRow): Promise<string> {
  const supabase = createAdminSupabaseClient();
  const startedAt = nowIso();

  const payload: TablesInsert<"job_runs"> = {
    workspace_id: audit.workspace_id,
    type: "website_audit",
    status: "running",
    reference_type: "audit",
    reference_id: audit.id,
    started_at: startedAt,
    payload: {
      auditId: audit.id,
      websiteId: audit.website_id,
      engine: "safe_fetch_foundation",
    },
    created_by: audit.created_by,
  };

  const { data, error } = await supabase.from("job_runs").insert(payload).select("id").single();

  if (error || !data) {
    throw new Error(error?.message ?? "job_run oluşturulamadı");
  }

  const { error: linkError } = await supabase
    .from("audits")
    .update({ job_run_id: data.id })
    .eq("id", audit.id)
    .eq("status", "running");

  if (linkError) {
    throw new Error(linkError.message);
  }

  return data.id;
}

export async function updateAuditJobRun(
  jobRunId: string,
  status: "completed" | "failed",
  errorMessage?: string,
  outputResult?: AuditOutputJobResult,
): Promise<void> {
  const supabase = createAdminSupabaseClient();
  const completedAt = nowIso();

  const update: TablesUpdate<"job_runs"> = {
    status,
    completed_at: completedAt,
    error_message: errorMessage ?? null,
  };

  if (status === "completed" && outputResult) {
    update.result = outputResult;
  }

  const { error } = await supabase.from("job_runs").update(update).eq("id", jobRunId);

  if (error) {
    throw new Error(error.message);
  }
}

function toJobOutputResult(output: GenerateAuditOutputResult): AuditOutputJobResult {
  const scoresCount = Object.keys(output.scoreBreakdown).length;

  return {
    engine: "safe_fetch_foundation",
    findingsGenerated: output.findingsCreated > 0,
    scoresGenerated: scoresCount > 0,
    overallScore: output.overallScore,
    findingsCount: output.findingsCreated,
    scoresCount,
    fetchAttempted: output.fetchAttempted,
    fetchOk: output.fetchOk,
  };
}

export async function completeAudit(
  auditId: string,
  jobRunId: string | null,
  output?: GenerateAuditOutputResult,
): Promise<AuditRow> {
  const supabase = createAdminSupabaseClient();
  const completedAt = nowIso();

  const { data: runningAudit, error: readError } = await supabase
    .from("audits")
    .select("started_at, website_id, workspace_id")
    .eq("id", auditId)
    .eq("status", "running")
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!runningAudit) {
    throw new Error("Audit running durumunda değil");
  }

  const { data, error } = await supabase
    .from("audits")
    .update({
      status: "completed",
      completed_at: completedAt,
      duration_ms: durationMs(runningAudit.started_at),
      error_message: null,
    })
    .eq("id", auditId)
    .eq("status", "running")
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Audit tamamlanamadı");
  }

  const { error: websiteError } = await supabase
    .from("websites")
    .update({
      last_audited_at: completedAt,
      last_audit_id: auditId,
    })
    .eq("id", runningAudit.website_id)
    .eq("workspace_id", runningAudit.workspace_id)
    .is("deleted_at", null);

  if (websiteError) {
    throw new Error(websiteError.message);
  }

  if (jobRunId) {
    await updateAuditJobRun(
      jobRunId,
      "completed",
      undefined,
      output ? toJobOutputResult(output) : undefined,
    );
  }

  return data;
}

export async function failAudit(
  auditId: string,
  jobRunId: string | null,
  errorMessage: string,
): Promise<AuditRow> {
  const supabase = createAdminSupabaseClient();

  const { data: runningAudit, error: readError } = await supabase
    .from("audits")
    .select("started_at")
    .eq("id", auditId)
    .eq("status", "running")
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!runningAudit) {
    throw new Error("Audit running durumunda değil");
  }

  const { data, error } = await supabase
    .from("audits")
    .update({
      status: "failed",
      duration_ms: durationMs(runningAudit.started_at),
      error_message: errorMessage,
    })
    .eq("id", auditId)
    .eq("status", "running")
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Audit başarısız olarak işaretlenemedi");
  }

  if (jobRunId) {
    await updateAuditJobRun(jobRunId, "failed", errorMessage);
  }

  return data;
}

async function loadWebsiteForAudit(audit: AuditRow): Promise<WebsiteRow | null> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("id", audit.website_id)
    .eq("workspace_id", audit.workspace_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function processAudit(auditId: string): Promise<AuditWorkerResult> {
  const supabase = createAdminSupabaseClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("*")
    .eq("id", auditId)
    .maybeSingle();

  if (auditError) {
    throw new Error(auditError.message);
  }

  if (!audit) {
    return { processed: false, reason: "audit_not_found" };
  }

  if (audit.status !== "running") {
    return { processed: false, reason: "audit_not_running" };
  }

  let jobRunId: string | null = audit.job_run_id;

  try {
    if (!jobRunId) {
      jobRunId = await createAuditJobRun(audit);
    }

    const website = await loadWebsiteForAudit(audit);

    if (!website) {
      await failAudit(auditId, jobRunId, "Web sitesi kaydı bulunamadı.");
      return {
        processed: true,
        auditId,
        status: "failed",
        error: "website_not_found",
      };
    }

    if (website.workspace_id !== audit.workspace_id) {
      await failAudit(auditId, jobRunId, "Web sitesi çalışma alanı ile uyuşmuyor.");
      return {
        processed: true,
        auditId,
        status: "failed",
        error: "workspace_mismatch",
      };
    }

    if (!isWebsiteUrlValid(website)) {
      await failAudit(auditId, jobRunId, "Web sitesi adresi geçersiz veya eksik.");
      return {
        processed: true,
        auditId,
        status: "failed",
        error: "invalid_website_url",
      };
    }

    const output = await generateAuditOutput(auditId);
    await completeAudit(auditId, jobRunId, output);

    return {
      processed: true,
      auditId,
      status: "completed",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit işlenirken beklenmeyen hata";

    if (jobRunId) {
      try {
        await failAudit(auditId, jobRunId, "Analiz işlemi tamamlanamadı.");
      } catch {
        // Controlled failure path; original error is returned below.
      }
    }

    return {
      processed: true,
      auditId,
      status: "failed",
      error: message,
    };
  }
}

export async function processNextQueuedAudit(): Promise<AuditWorkerResult> {
  for (let attempt = 0; attempt < MAX_CLAIM_ATTEMPTS; attempt += 1) {
    const queued = await getNextQueuedAudit();

    if (!queued) {
      return { processed: false, reason: "no_queued_audit" };
    }

    const claim = await claimAudit(queued.id);

    if (!claim.claimed) {
      continue;
    }

    return processAudit(claim.audit.id);
  }

  return { processed: false, reason: "claim_conflict" };
}
