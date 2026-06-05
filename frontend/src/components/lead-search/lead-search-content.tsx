"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { mockSearchFilterChips, mockSearchPreviewRows } from "@/data/mock-leads";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
] as const;

export function LeadSearchContent() {
  const [activeChips, setActiveChips] = useState<string[]>(["Has website"]);

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Search Campaign</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Industry</label>
              <Input placeholder="e.g. Healthcare, SaaS" defaultValue="Healthcare" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Location</label>
              <Input placeholder="City or region" defaultValue="Istanbul" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Business Type</label>
              <Input placeholder="e.g. Clinic, Agency" defaultValue="Clinic" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Website Status</label>
              <Input placeholder="Any status" defaultValue="Needs improvement" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">
                Opportunity Threshold
              </label>
              <Input type="number" placeholder="Min score" defaultValue="75" />
            </div>
          </div>
          <button type="button" className="btn-campaign mt-5 inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Start Search
          </button>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-200")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Signal Filters</h3>
          <div className="flex flex-wrap gap-2">
            {mockSearchFilterChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                  activeChips.includes(chip)
                    ? "border border-primary/15 bg-primary-soft text-primary"
                    : "border border-border-soft bg-surface text-text-secondary hover:border-border",
                )}
              >
                {chip}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
            Combine industry, location, and website signals to surface high-opportunity companies
            ready for outreach.
          </p>
        </div>
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Search Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft">
                {["Company", "Industry", "Location", "Website", "Signal", "Est. Opportunity", "Action"].map(
                  (col) => (
                    <th
                      key={col}
                      className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted last:pr-0"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {mockSearchPreviewRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                    "animate-fade-up-row",
                    rowDelays[index],
                  )}
                >
                  <td className="py-3 pr-3 text-[13px] font-semibold text-text-primary">{row.company}</td>
                  <td className="py-3 pr-3 text-[13px] text-text-secondary">{row.industry}</td>
                  <td className="py-3 pr-3 text-[13px] text-text-secondary">{row.location}</td>
                  <td className="py-3 pr-3 text-[13px] text-primary">{row.website}</td>
                  <td className="py-3 pr-3">
                    <Badge variant="warning">{row.signal}</Badge>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[11px] font-bold text-green">
                      {row.opportunity}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
