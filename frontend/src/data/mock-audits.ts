import type { WebsiteAudit } from "@shared/types/audit";
import type { AuditIssueItem, PageKpi } from "@/types/pages";

export const mockAudits: WebsiteAudit[] = [
  {
    id: "audit-1",
    leadId: "1",
    websiteUrl: "https://technova.io",
    score: 62,
    createdAt: "2026-05-28T11:00:00.000Z",
    issues: [
      {
        id: "issue-1",
        title: "Missing meta description",
        description: "Key landing pages lack unique meta descriptions.",
        category: "seo",
        severity: "medium",
      },
      {
        id: "issue-2",
        title: "Slow mobile load time",
        description: "Largest Contentful Paint exceeds recommended threshold on mobile.",
        category: "speed",
        severity: "high",
      },
    ],
  },
];

export const mockAuditKpis: PageKpi[] = [
  { id: "score", label: "Average Score", numericValue: 62, suffix: "/100", accent: "blue" },
  { id: "seo", label: "SEO Issues", numericValue: 24, accent: "orange" },
  { id: "speed", label: "Speed Issues", numericValue: 31, accent: "purple" },
  { id: "mobile", label: "Mobile Issues", numericValue: 15, accent: "green" },
  { id: "tracking", label: "Tracking Issues", numericValue: 12, accent: "blue" },
];

export const mockAuditCategories = [
  "SEO",
  "Speed",
  "Mobile",
  "CTA",
  "Tracking",
  "Design",
] as const;

export const mockAuditIssues: AuditIssueItem[] = [
  {
    id: "a1",
    category: "SEO",
    severity: "medium",
    title: "Missing meta description",
    explanation: "Several key pages lack unique meta descriptions for search visibility.",
    fix: "Add unique meta descriptions to all primary landing pages.",
    impact: "High visibility impact",
  },
  {
    id: "a2",
    category: "Speed",
    severity: "high",
    title: "Slow mobile load time",
    explanation: "Mobile LCP exceeds 4s on the homepage.",
    fix: "Optimize hero images and defer non-critical scripts.",
    impact: "Conversion risk",
  },
  {
    id: "a3",
    category: "CTA",
    severity: "high",
    title: "CTA is below the fold",
    explanation: "Primary call-to-action is not visible without scrolling on mobile.",
    fix: "Move primary CTA above the fold with clearer contrast.",
    impact: "Lead capture impact",
  },
  {
    id: "a4",
    category: "Tracking",
    severity: "medium",
    title: "No Meta Pixel detected",
    explanation: "No conversion tracking pixel found on key pages.",
    fix: "Install Meta Pixel and configure standard events.",
    impact: "Attribution gap",
  },
  {
    id: "a5",
    category: "Design",
    severity: "low",
    title: "Contact form lacks trust elements",
    explanation: "Form area missing testimonials, logos, or security cues.",
    fix: "Add trust badges and social proof near the form.",
    impact: "Trust & conversion",
  },
];

export const mockAuditTypes = [
  "Full Audit",
  "SEO Only",
  "Conversion Only",
  "Tracking Only",
] as const;
