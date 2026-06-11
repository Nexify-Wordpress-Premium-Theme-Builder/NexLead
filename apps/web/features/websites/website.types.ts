import type { Tables, TablesInsert } from "@nexlead/types";

export type WebsiteRow = Tables<"websites">;
export type WebsiteInsert = TablesInsert<"websites">;
export type WebsiteStatus = WebsiteRow["status"];
export type AuditStatus = Tables<"audits">["status"];

export type LatestAudit = {
  id: string;
  status: AuditStatus;
  created_at: string;
};

export type WebsiteWithRelations = WebsiteRow & {
  leadCompanyName: string | null;
  latestAudit: LatestAudit | null;
  isAuditRunning: boolean;
};

export type WebsiteFormInput = {
  websiteUrl: string;
  leadId?: string;
  description?: string;
};

export type WebsiteActionState = {
  error?: string;
  success?: string;
};

export type LeadOption = {
  id: string;
  companyName: string;
  suggestedUrl: string | null;
};
