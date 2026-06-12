import type { Json } from "@nexlead/types";

import type { AuditFindingItem } from "@/features/audits/audit-result.types";
import { formatEvidenceSummary } from "@/features/audits/audit-result.utils";

import type { AuditReportState, PriorityAction, TechnicalSignal } from "./report.types";

const SEVERITY_ORDER: Record<AuditFindingItem["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

const HIGH_SEVERITIES = new Set<AuditFindingItem["severity"]>(["critical", "high"]);

export function getAuditReportPath(auditId: string): string {
  return `/dashboard/audits/${auditId}/report`;
}

export function shortenAuditId(auditId: string): string {
  return auditId.length > 12 ? `${auditId.slice(0, 8)}…` : auditId;
}

export function truncateReportText(value: string, maxLength = 80): string {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function readEvidenceField(evidence: Json | null, key: string): string | number | null {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    return null;
  }

  const value = (evidence as Record<string, unknown>)[key];

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return null;
}

function addSignal(signals: TechnicalSignal[], seen: Set<string>, label: string, value: string | null) {
  if (!value?.trim()) {
    return;
  }

  const key = `${label}:${value}`;

  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  signals.push({ label, value: truncateReportText(value, 120) });
}

export function extractTechnicalSignals(
  findings: Array<AuditFindingItem & { evidence?: Json | null }>,
): TechnicalSignal[] {
  const signals: TechnicalSignal[] = [];
  const seen = new Set<string>();

  for (const finding of findings) {
    const evidence = finding.evidence ?? null;
    const checkKey = readEvidenceField(evidence, "check_key");

    if (typeof checkKey === "string") {
      if (checkKey === "fetch_https") {
        const finalUrl = readEvidenceField(evidence, "final_url");
        addSignal(
          signals,
          seen,
          "HTTPS",
          typeof finalUrl === "string" && finalUrl.toLowerCase().startsWith("https://")
            ? "Aktif"
            : "Pasif",
        );
      }

      if (checkKey === "fetch_title_present") {
        const actual = readEvidenceField(evidence, "actual");
        addSignal(
          signals,
          seen,
          "Title",
          actual === "non-empty-title" || finding.title.includes("bulunamadı") ? "Eksik" : "Mevcut",
        );
      }

      if (checkKey === "fetch_meta_description") {
        addSignal(
          signals,
          seen,
          "Meta description",
          finding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Mevcut",
        );
      }

      if (checkKey === "fetch_viewport_meta") {
        addSignal(
          signals,
          seen,
          "Viewport meta",
          finding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Mevcut",
        );
      }

      if (checkKey === "fetch_canonical") {
        addSignal(
          signals,
          seen,
          "Canonical",
          finding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Mevcut",
        );
      }
    }

    const statusCode = readEvidenceField(evidence, "status_code");
    if (statusCode !== null) {
      addSignal(signals, seen, "HTTP durum kodu", String(statusCode));
    }

    const finalUrl = readEvidenceField(evidence, "final_url");
    if (typeof finalUrl === "string") {
      addSignal(signals, seen, "Final URL", finalUrl);
    }

    const requestedUrl = readEvidenceField(evidence, "requested_url");
    if (typeof requestedUrl === "string") {
      addSignal(signals, seen, "İstenen URL", requestedUrl);
    }

    const responseTime = readEvidenceField(evidence, "response_time_ms");
    if (responseTime !== null) {
      addSignal(signals, seen, "Yanıt süresi", `${responseTime} ms`);
    }

    const contentType = readEvidenceField(evidence, "content_type");
    if (typeof contentType === "string") {
      addSignal(signals, seen, "Content-Type", contentType);
    }
  }

  const titleFinding = findings.find((item) => item.title.toLowerCase().includes("title"));
  const viewportFinding = findings.find((item) => item.title.toLowerCase().includes("viewport"));
  const canonicalFinding = findings.find((item) => item.title.toLowerCase().includes("canonical"));

  if (!seen.has("Title:Mevcut") && !seen.has("Title:Eksik")) {
    if (titleFinding) {
      addSignal(
        signals,
        seen,
        "Title",
        titleFinding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Kontrol edildi",
      );
    }
  }

  if (viewportFinding) {
    addSignal(
      signals,
      seen,
      "Viewport meta",
      viewportFinding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Mevcut",
    );
  }

  if (canonicalFinding) {
    addSignal(
      signals,
      seen,
      "Canonical",
      canonicalFinding.title.toLowerCase().includes("bulunamadı") ? "Eksik" : "Mevcut",
    );
  }

  return signals;
}

export function buildPriorityActions(findings: AuditFindingItem[], limit = 5): PriorityAction[] {
  return [...findings]
    .sort((left, right) => SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity])
    .slice(0, limit)
    .map((finding) => ({
      id: finding.id,
      title: finding.title,
      recommendation: finding.recommendation,
      severity: finding.severity,
      category: finding.category,
    }));
}

export function countHighSeverityFindings(findings: AuditFindingItem[]): number {
  return findings.filter((finding) => HIGH_SEVERITIES.has(finding.severity)).length;
}

export function buildSummaryText(
  overallScore: number | null,
  findingCount: number,
  highSeverityCount: number,
): string {
  if (overallScore === null && findingCount === 0) {
    return "Analiz tamamlandı ancak detaylı skor veya bulgu üretilmedi.";
  }

  if (highSeverityCount > 0) {
    return "Öncelikli teknik ve SEO kontrolleri öneriliyor.";
  }

  if (overallScore !== null && overallScore >= 85 && findingCount === 0) {
    return "Genel durum iyi görünüyor.";
  }

  if (overallScore !== null && overallScore >= 70) {
    return "İyileştirilmesi gereken bazı alanlar var.";
  }

  return "Öncelikli teknik ve SEO kontrolleri öneriliyor.";
}

export function resolveReportState(
  status: AuditReportState | string,
  overallScore: number | null,
  findingCount: number,
  scoreCount: number,
): AuditReportState {
  if (status === "queued") {
    return "not_ready_queued";
  }

  if (status === "running") {
    return "not_ready_running";
  }

  if (status === "failed") {
    return "not_ready_failed";
  }

  if (status !== "completed") {
    return "limited";
  }

  if (overallScore === null && findingCount === 0 && scoreCount === 0) {
    return "limited";
  }

  return "ready";
}

export function mapFindingRows(
  rows: Array<{
    id: string;
    title: string;
    description: string;
    recommendation: string | null;
    category: AuditFindingItem["category"];
    severity: AuditFindingItem["severity"];
    evidence: Json | null;
    created_at: string;
  }>,
): Array<AuditFindingItem & { evidence: Json | null }> {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    recommendation: row.recommendation,
    category: row.category,
    severity: row.severity,
    evidenceSummary: formatEvidenceSummary(row.evidence),
    created_at: row.created_at,
    evidence: row.evidence,
  }));
}
