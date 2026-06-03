import { mockAudits } from "@/data/mock-audits";
import type { WebsiteAudit } from "@shared/types/audit";

export const auditClient = {
  getAudits: async (): Promise<WebsiteAudit[]> => mockAudits,
  getAuditByLeadId: async (leadId: string): Promise<WebsiteAudit | undefined> =>
    mockAudits.find((audit) => audit.leadId === leadId),
};

export function getAudits(): WebsiteAudit[] {
  return mockAudits;
}

export function getAuditByLeadId(leadId: string): WebsiteAudit | undefined {
  return mockAudits.find((audit) => audit.leadId === leadId);
}
