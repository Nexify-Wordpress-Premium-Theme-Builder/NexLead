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

export type AuditHistoryItem = {
  id: string;
  status: AuditStatus;
  type: Tables<"audits">["type"];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
};

export type WebsiteDetail = WebsiteWithRelations & {
  audits: AuditHistoryItem[];
  linkedLead: {
    id: string;
    companyName: string;
    normalizedDomain: string | null;
    status: Tables<"leads">["status"];
  } | null;
};
