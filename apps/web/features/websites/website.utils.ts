import { normalizeDomain, normalizeWebsiteInput } from "@/lib/url/normalize-domain";

import type { LeadOption, WebsiteFormInput, WebsiteRow, WebsiteWithRelations } from "./website.types";
import type { AuditStatus } from "./website.types";
import { parseLeadMetadata } from "@/features/leads/lead.utils";

const RUNNING_AUDIT_STATUSES: AuditStatus[] = ["queued", "running"];

export function isAuditInProgress(status: AuditStatus | undefined): boolean {
  return status !== undefined && RUNNING_AUDIT_STATUSES.includes(status);
}

export function mapWebsiteRow(
  row: WebsiteRow,
  leadCompanyName: string | null,
  latestAudit: WebsiteWithRelations["latestAudit"],
): WebsiteWithRelations {
  return {
    ...row,
    leadCompanyName,
    latestAudit,
    isAuditRunning: isAuditInProgress(latestAudit?.status),
  };
}

export function validateWebsiteForm(input: WebsiteFormInput): { valid: true } | { valid: false; error: string } {
  const websiteUrl = input.websiteUrl?.trim() ?? "";

  if (!websiteUrl) {
    return { valid: false, error: "Web site adresi zorunludur." };
  }

  if (websiteUrl.length < 3) {
    return { valid: false, error: "Web site adresi geçerli görünmüyor." };
  }

  const normalized = normalizeDomain(websiteUrl);

  if (!normalized.normalized) {
    return { valid: false, error: "Web site adresi geçerli görünmüyor." };
  }

  return { valid: true };
}

export function formDataToWebsiteInput(formData: FormData): WebsiteFormInput {
  const leadId = String(formData.get("leadId") ?? "").trim();

  return {
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    leadId: leadId || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
  };
}

export function buildWebsitePayload(
  workspaceId: string,
  userId: string,
  input: WebsiteFormInput,
  leadId?: string | null,
) {
  const normalized = normalizeWebsiteInput(input.websiteUrl.trim());

  return {
    payload: {
      workspace_id: workspaceId,
      lead_id: leadId ?? null,
      url: normalized.url,
      domain: normalized.domain,
      normalized_url: normalized.normalizedUrl,
      description: input.description?.trim() || null,
      status: "pending" as const,
      is_primary: false,
      created_by: userId,
      metadata: {},
    },
    warning: normalized.warning,
  };
}

export function leadToOption(lead: {
  id: string;
  company_name: string;
  metadata: WebsiteRow["metadata"];
}): LeadOption {
  const metadata = parseLeadMetadata(lead.metadata);
  const domain = metadata.normalized_domain ?? metadata.website ?? null;

  return {
    id: lead.id,
    companyName: lead.company_name,
    suggestedUrl: domain,
  };
}

export function formatWebsiteDate(iso: string | null): string {
  if (!iso) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
