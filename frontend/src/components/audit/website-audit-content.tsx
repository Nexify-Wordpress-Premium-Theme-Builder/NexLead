"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import {
  mockAuditCategories,
  mockAuditIssues,
  mockAuditKpis,
  mockAuditTypes,
} from "@/data/mock-audits";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

const severityVariant = {
  low: "default",
  medium: "warning",
  high: "danger",
} as const;

export function WebsiteAuditContent() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredIssues =
    activeCategory === "All"
      ? mockAuditIssues
      : mockAuditIssues.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-5">
      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Run Website Audit</h3>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Website URL</label>
            <Input placeholder="https://example.com" defaultValue="https://technova.io" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Audit Type</label>
            <select className="flex h-10 w-full min-w-[160px] rounded-lg border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              {mockAuditTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <button type="button" className="btn-campaign inline-flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Run Audit
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {mockAuditKpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            suffix={kpi.suffix}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
              activeCategory === "All"
                ? "border border-primary/15 bg-primary-soft text-primary"
                : "border border-border-soft text-text-secondary hover:bg-surface-muted",
            )}
          >
            All
          </button>
          {mockAuditCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                activeCategory === cat
                  ? "border border-primary/15 bg-primary-soft text-primary"
                  : "border border-border-soft text-text-secondary hover:bg-surface-muted",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {filteredIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={cn(
                "rounded-xl border border-border-soft bg-surface-muted/40 p-4 transition-all duration-200 hover:border-border",
                "animate-fade-up-row",
                [
                  "animation-delay-100",
                  "animation-delay-150",
                  "animation-delay-200",
                  "animation-delay-250",
                  "animation-delay-300",
                ][index],
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant={severityVariant[issue.severity]}>{issue.severity}</Badge>
                <span className="text-[11px] font-semibold text-text-muted">{issue.category}</span>
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
    </div>
  );
}
