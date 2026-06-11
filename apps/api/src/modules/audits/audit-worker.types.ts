import type { Tables } from "@nexlead/types";

export type AuditRow = Tables<"audits">;
export type JobRunRow = Tables<"job_runs">;
export type WebsiteRow = Tables<"websites">;

export type AuditWorkerProcessStatus = "completed" | "failed" | "running";

export type AuditWorkerResult = {
  processed: boolean;
  auditId?: string;
  status?: AuditWorkerProcessStatus;
  reason?: string;
  error?: string;
};

export type AuditClaimResult =
  | { claimed: true; audit: AuditRow }
  | { claimed: false; reason: "not_found" | "not_queued" };
