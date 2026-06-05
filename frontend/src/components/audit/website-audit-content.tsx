"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Globe, Save } from "lucide-react";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import { mockAuditCategories, mockAuditIssues, mockAuditTypes } from "@/data/mock-audits";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";
import { filterAuditIssuesByCategory, filterAuditIssuesBySeverity } from "@/services/demo-audit-service";
import type { AuditCategory, AuditSeverity } from "@/types/audit";

const severityVariant = {
  low: "default",
  medium: "warning",
  high: "danger",
} as const;

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function WebsiteAuditContent() {
  const router = useRouter();
  const toast = useToast();
  const { leads, updateLeadStatus, addActivity } = useDemoData();

  const [websiteUrl, setWebsiteUrl] = useState("https://technova.io");
  const [auditType, setAuditType] = useState<string>(mockAuditTypes[0]);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id ?? "");
  const [activeCategory, setActiveCategory] = useState<AuditCategory | "all">("all");
  const [activeSeverity, setActiveSeverity] = useState<AuditSeverity | "all">("all");
  const [score, setScore] = useState(62);
  const [animatedScore, setAnimatedScore] = useState(62);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRunAudit, setHasRunAudit] = useState(false);
  const previousScoreRef = useRef(score);

  const normalizedIssues = useMemo(
    () =>
      mockAuditIssues.map((issue) => ({
        ...issue,
        normalizedCategory: issue.category.toLowerCase() as AuditCategory,
      })),
    [],
  );

  const filteredIssues = useMemo(() => {
    const basicIssues = normalizedIssues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.explanation,
      category: issue.normalizedCategory,
      severity: issue.severity,
    }));
    const byCategory = filterAuditIssuesByCategory(basicIssues, activeCategory);
    const bySeverity = filterAuditIssuesBySeverity(byCategory, activeSeverity);
    const visibleIds = new Set(bySeverity.map((issue) => issue.id));
    return normalizedIssues.filter((issue) => visibleIds.has(issue.id));
  }, [activeCategory, activeSeverity, normalizedIssues]);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;
    const initialValue = previousScoreRef.current;
    const diff = score - initialValue;
    const duration = 1100;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setAnimatedScore(Math.round(initialValue + diff * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    previousScoreRef.current = score;
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId);
  const summaryText = useMemo(() => {
    const issueLines = filteredIssues.slice(0, 5).map((issue) => `- ${issue.title} (${issue.severity})`);
    return [
      `Website Audit Summary`,
      `URL: ${websiteUrl}`,
      `Audit Type: ${auditType}`,
      `Lead: ${selectedLead?.companyName ?? "N/A"}`,
      `Score: ${score}/100`,
      "",
      "Top Issues:",
      ...issueLines,
    ].join("\n");
  }, [auditType, filteredIssues, score, selectedLead?.companyName, websiteUrl]);

  const kpis = useMemo(
    () => [
      { id: "score", label: "Audit Score", numericValue: animatedScore, suffix: "/100", accent: "blue" as const },
      {
        id: "issues",
        label: "Visible Issues",
        numericValue: filteredIssues.length,
        accent: "orange" as const,
      },
      {
        id: "high",
        label: "High Severity",
        numericValue: filteredIssues.filter((issue) => issue.severity === "high").length,
        accent: "purple" as const,
      },
      {
        id: "quick",
        label: "Quick Wins",
        numericValue: filteredIssues.filter((issue) => issue.severity === "low").length,
        accent: "green" as const,
      },
    ],
    [animatedScore, filteredIssues],
  );

  const handleRunAudit = async () => {
    if (!websiteUrl.trim()) {
      toast.warning("Website URL required", "Please provide a website URL to run audit.");
      return;
    }

    setIsRunningAudit(true);
    await wait(getRandomDelay());
    const nextScore = 55 + Math.floor(Math.random() * 41);
    setScore(nextScore);
    setHasRunAudit(true);
    setIsRunningAudit(false);

    if (selectedLeadId) {
      updateLeadStatus(selectedLeadId, "audited");
    }
    addActivity({
      type: "audit",
      message: `Website audit completed for ${selectedLead?.companyName ?? websiteUrl}`,
    });
    toast.success("Audit completed", `New website score: ${nextScore}/100`);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("Summary copied", "Audit summary copied to clipboard.");
    } catch {
      toast.error("Copy failed", "Clipboard permission is unavailable.");
    }
  };

  const handleSaveAudit = async () => {
    setIsSaving(true);
    await wait(getRandomDelay());
    addActivity({
      type: "audit",
      message: `Audit summary saved for ${selectedLead?.companyName ?? websiteUrl}`,
    });
    setIsSaving(false);
    toast.success("Audit saved", "Audit findings have been saved to the activity log.");
  };

  const handleCreateOutreach = () => {
    if (selectedLeadId) {
      router.push(`${ROUTES.app.outreach}?leadId=${selectedLeadId}`);
      return;
    }
    router.push(ROUTES.app.outreach);
  };

  return (
    <div className="space-y-5">
      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Run Website Audit</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Website URL</label>
            <Input
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Audit Type</label>
            <Select
              value={auditType}
              onChange={(event) => setAuditType(event.target.value)}
              options={mockAuditTypes.map((type) => ({ label: type, value: type }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Lead</label>
            <Select
              value={selectedLeadId}
              onChange={(event) => setSelectedLeadId(event.target.value)}
              options={leads.map((lead) => ({ label: lead.companyName, value: lead.id }))}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-campaign inline-flex h-10 items-center gap-2 px-4 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleRunAudit}
            disabled={isRunningAudit}
          >
            <Globe className="h-4 w-4" />
            <LoadingButtonState isLoading={isRunningAudit} loadingText="Running audit...">
              Run Audit
            </LoadingButtonState>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={handleCopySummary}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Summary
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSaveAudit}
            disabled={isSaving}
          >
            <LoadingButtonState isLoading={isSaving} loadingText="Saving...">
              <span className="inline-flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Audit
              </span>
            </LoadingButtonState>
          </button>
          <button type="button" className="btn-campaign" onClick={handleCreateOutreach}>
            Create Outreach
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            suffix={kpi.suffix}
            accent={kpi.accent}
            className={`animation-delay-${(index + 1) * 100}`}
          />
        ))}
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Category</label>
            <Select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value as AuditCategory | "all")}
              options={[
                { label: "All Categories", value: "all" },
                ...mockAuditCategories.map((category) => ({
                  label: category,
                  value: category.toLowerCase(),
                })),
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Severity</label>
            <Select
              value={activeSeverity}
              onChange={(event) => setActiveSeverity(event.target.value as AuditSeverity | "all")}
              options={[
                { label: "All Severities", value: "all" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {filteredIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={cn(
                "rounded-xl border border-border-soft bg-surface-muted/40 p-4 transition-all duration-200 hover:border-border",
                "animate-fade-up-row",
                rowDelays[index % rowDelays.length],
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant={severityVariant[issue.severity]}>{issue.severity}</Badge>
                <span className="text-[11px] font-semibold uppercase text-text-muted">{issue.category}</span>
              </div>
              <h4 className="text-[13px] font-semibold text-text-primary">{issue.title}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{issue.explanation}</p>
              <p className="mt-2 text-xs text-text-muted">
                <span className="font-semibold text-text-secondary">Fix:</span> {issue.fix}
              </p>
              <p className="mt-1 text-xs font-medium text-primary">{issue.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {!hasRunAudit && (
        <p className="text-center text-xs text-text-muted">
          Run an audit to simulate fresh score generation and lead progression.
        </p>
      )}
    </div>
  );
}

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;
