import type { AuditCategory, AuditIssue, AuditSeverity, WebsiteAudit } from "@/types/audit";

export function getAuditByLeadId(audits: WebsiteAudit[], leadId: string): WebsiteAudit | undefined {
  return audits.find((audit) => audit.leadId === leadId);
}

export function filterAuditsByScore(
  audits: WebsiteAudit[],
  minimumScore: number,
  maximumScore: number = 100,
): WebsiteAudit[] {
  return audits.filter((audit) => audit.score >= minimumScore && audit.score <= maximumScore);
}

export function filterAuditIssuesBySeverity(
  issues: AuditIssue[],
  severity: AuditSeverity | "all",
): AuditIssue[] {
  if (severity === "all") return issues;
  return issues.filter((issue) => issue.severity === severity);
}

export function filterAuditIssuesByCategory(
  issues: AuditIssue[],
  category: AuditCategory | "all",
): AuditIssue[] {
  if (category === "all") return issues;
  return issues.filter((issue) => issue.category === category);
}

export function searchAuditIssues(issues: AuditIssue[], query: string): AuditIssue[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return issues;

  return issues.filter((issue) =>
    [issue.title, issue.description, issue.category].join(" ").toLowerCase().includes(normalizedQuery),
  );
}
