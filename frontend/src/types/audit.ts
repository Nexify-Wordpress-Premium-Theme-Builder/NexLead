export type AuditCategory = "seo" | "speed" | "mobile" | "cta" | "tracking" | "design";
export type AuditSeverity = "low" | "medium" | "high";

export interface AuditIssue {
  id: string;
  category: AuditCategory;
  title: string;
  severity: AuditSeverity;
  description: string;
}

export interface WebsiteAudit {
  id: string;
  leadId: string;
  websiteUrl: string;
  score: number;
  issues: AuditIssue[];
  createdAt: string;
}
