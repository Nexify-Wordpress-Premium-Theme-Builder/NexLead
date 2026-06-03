export interface AuditIssue {
  id: string;
  category: "seo" | "speed" | "mobile" | "cta" | "tracking" | "design";
  title: string;
  severity: "low" | "medium" | "high";
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
