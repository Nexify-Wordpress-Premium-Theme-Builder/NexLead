import type { WebsiteAudit } from "@shared/types/audit";

export const mockAudits: WebsiteAudit[] = [
  {
    id: "audit-1",
    leadId: "lead-1",
    websiteUrl: "https://northlinestudio.com",
    score: 58,
    createdAt: "2026-05-28T11:00:00.000Z",
    issues: [
      {
        id: "issue-1",
        title: "Slow mobile load time",
        description: "Largest Contentful Paint exceeds recommended threshold.",
        category: "speed",
        severity: "high",
      },
      {
        id: "issue-2",
        title: "Missing meta descriptions",
        description: "Several key pages lack unique meta descriptions.",
        category: "seo",
        severity: "medium",
      },
    ],
  },
];
