import type { IncomingMessage, ServerResponse } from "node:http";

import { sendJson } from "../../auth/http";
import { getJobWorkerSecret, isJobWorkerConfigured } from "../../config/job-worker-env";
import { isApiSupabaseAdminConfigured } from "../../supabase/env";

import { processNextQueuedAudit } from "./audit-worker.service";

function getJobSecretHeader(req: IncomingMessage): string | null {
  const header = req.headers["x-job-secret"];

  if (typeof header === "string" && header.trim()) {
    return header.trim();
  }

  if (Array.isArray(header) && header[0]?.trim()) {
    return header[0].trim();
  }

  return null;
}

export async function handleProcessNextAuditJob(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!isJobWorkerConfigured()) {
    sendJson(res, 503, { error: "job_worker_not_configured" });
    return;
  }

  if (!isApiSupabaseAdminConfigured()) {
    sendJson(res, 503, { error: "supabase_admin_not_configured" });
    return;
  }

  const providedSecret = getJobSecretHeader(req);
  const expectedSecret = getJobWorkerSecret();

  if (!providedSecret || !expectedSecret || providedSecret !== expectedSecret) {
    sendJson(res, 401, { error: "unauthorized" });
    return;
  }

  try {
    const result = await processNextQueuedAudit();
    sendJson(res, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit worker failed";
    sendJson(res, 500, { error: "worker_error", message });
  }
}
