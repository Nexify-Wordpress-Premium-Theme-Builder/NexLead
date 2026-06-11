import type { Json } from "@nexlead/types";

import type { AuditFindingItem, FindingCategory, FindingSeverity } from "./audit-result.types";

export const FINDING_CATEGORY_LABELS: Record<FindingCategory, string> = {
  performance: "Performans",
  seo: "SEO",
  accessibility: "Erişilebilirlik",
  security: "Güvenlik",
  ux: "UX",
  content: "İçerik",
  technical: "Teknik",
};

export const FINDING_SEVERITY_LABELS: Record<FindingSeverity, string> = {
  info: "Bilgi",
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  critical: "Kritik",
};

const SEVERITY_ORDER: Record<FindingSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

export const SCORE_CATEGORY_ORDER: FindingCategory[] = [
  "performance",
  "seo",
  "accessibility",
  "security",
  "ux",
  "content",
  "technical",
];

export function formatEvidenceSummary(evidence: Json | null): string | null {
  if (evidence === null || evidence === undefined) {
    return null;
  }

  if (typeof evidence === "string") {
    const trimmed = evidence.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof evidence === "number" || typeof evidence === "boolean") {
    return String(evidence);
  }

  if (Array.isArray(evidence)) {
    const items = evidence
      .slice(0, 3)
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)));

    return items.length > 0 ? items.join(" · ") : null;
  }

  if (typeof evidence === "object") {
    const record = evidence as Record<string, unknown>;

    if (typeof record.summary === "string" && record.summary.trim()) {
      return record.summary.trim();
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message.trim();
    }

    const parts = Object.entries(record)
      .filter(([, value]) => typeof value === "string" || typeof value === "number")
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${value}`);

    if (parts.length > 0) {
      return parts.join(" · ");
    }
  }

  return "Teknik kanıt kayıt altına alındı.";
}

export function sortFindingsBySeverity(findings: AuditFindingItem[]): AuditFindingItem[] {
  return [...findings].sort((left, right) => {
    const severityDiff = SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity];

    if (severityDiff !== 0) {
      return severityDiff;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
}
