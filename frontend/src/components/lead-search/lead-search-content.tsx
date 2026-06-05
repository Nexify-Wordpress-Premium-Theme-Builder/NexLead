"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockSearchFilterChips, mockSearchPreviewRows } from "@/data/mock-leads";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";
import { searchDemoLeads, type LeadSearchFilters } from "@/services/demo-leads-service";

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
] as const;

const defaultFilters: LeadSearchFilters = {
  industry: "",
  location: "",
  businessType: "",
  websiteStatus: "",
  minOpportunity: 75,
  activeSignals: ["Has website"],
  query: "",
};

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function applyWebsiteStatus(
  rows: typeof mockSearchPreviewRows,
  websiteStatus: string,
): typeof mockSearchPreviewRows {
  if (!websiteStatus) return rows;

  if (websiteStatus === "needs_work") {
    return rows.filter((row) => row.opportunity >= 75);
  }
  if (websiteStatus === "okay") {
    return rows.filter((row) => row.opportunity >= 60 && row.opportunity < 75);
  }
  if (websiteStatus === "good") {
    return rows.filter((row) => row.opportunity < 60);
  }

  return rows;
}

export function LeadSearchContent() {
  const { leads, addLead, markSearchAnalyzed, analyzedSearchIds, addActivity } = useDemoData();
  const toast = useToast();
  const [filters, setFilters] = useState<LeadSearchFilters>(defaultFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const computedResults = useMemo(() => {
    const filtered = searchDemoLeads(mockSearchPreviewRows, filters);
    return applyWebsiteStatus(filtered, filters.websiteStatus);
  }, [filters]);

  const results = hasSearched ? computedResults : mockSearchPreviewRows;

  const toggleChip = (chip: string) => {
    setFilters((current) => ({
      ...current,
      activeSignals: current.activeSignals.includes(chip)
        ? current.activeSignals.filter((item) => item !== chip)
        : [...current.activeSignals, chip],
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    await wait(getRandomDelay());
    setHasSearched(true);
    setIsSearching(false);
    toast.success("Search completed", `${computedResults.length} opportunities matched your filters.`);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setHasSearched(false);
    toast.info("Filters reset", "Search criteria cleared.");
  };

  const handleAnalyze = async (row: (typeof mockSearchPreviewRows)[number]) => {
    if (analyzedSearchIds.includes(row.id)) {
      toast.info("Already analyzed", `${row.company} has already been analyzed.`);
      return;
    }

    setAnalyzingId(row.id);
    await wait(getRandomDelay());

    const hasExistingLead = leads.some(
      (lead) =>
        lead.companyName.toLowerCase() === row.company.toLowerCase() ||
        lead.website.replace("https://", "").replace("http://", "") === row.website,
    );

    markSearchAnalyzed(row.id);

    if (!hasExistingLead) {
      addLead({
        companyName: row.company,
        website: row.website.startsWith("http") ? row.website : `https://${row.website}`,
        industry: row.industry,
        location: row.location,
        opportunityScore: row.opportunity,
        websiteStatus: "needs_work",
      });
    }

    addActivity({
      type: "lead",
      message: `Search analyzed: ${row.company}`,
    });

    setAnalyzingId(null);
    toast.success("Lead analyzed", `${row.company} is now available in Leads.`);
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Search Campaign</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Industry</label>
              <Input
                placeholder="e.g. Healthcare, SaaS"
                value={filters.industry}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, industry: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Location</label>
              <Input
                placeholder="City or region"
                value={filters.location}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, location: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Business Type</label>
              <Input
                placeholder="e.g. Clinic, Agency"
                value={filters.businessType}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, businessType: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Website Status</label>
              <Select
                value={filters.websiteStatus}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, websiteStatus: event.target.value }))
                }
                options={[
                  { label: "Any", value: "" },
                  { label: "Needs Work", value: "needs_work" },
                  { label: "Okay", value: "okay" },
                  { label: "Good", value: "good" },
                ]}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">
                Opportunity Threshold
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Min score"
                value={filters.minOpportunity}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    minOpportunity: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Keyword</label>
              <Input
                placeholder="Search company, signal, or website"
                value={filters.query}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-campaign inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              <LoadingButtonState isLoading={isSearching} loadingText="Searching...">
                Start Search
              </LoadingButtonState>
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
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
                  filters.activeSignals.includes(chip)
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
          <div className="mt-4 rounded-xl border border-primary/10 bg-primary-soft/35 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-primary">
              {results.length} companies currently match your active filters.
            </p>
          </div>
        </div>
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Search Preview</h3>

        {results.length === 0 ? (
          <EmptyState
            title="No opportunities found"
            description="Try lowering opportunity threshold or removing one signal filter."
            action={
              <button type="button" className="btn-campaign inline-flex items-center gap-2" onClick={handleClear}>
                <Sparkles className="h-4 w-4" />
                Reset Filters
              </button>
            }
          />
        ) : (
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
                {results.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                      "animate-fade-up-row",
                      rowDelays[index % rowDelays.length],
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
                        onClick={() => handleAnalyze(row)}
                        disabled={analyzingId === row.id}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <LoadingButtonState
                          isLoading={analyzingId === row.id}
                          loadingText="Analyzing..."
                        >
                          {analyzedSearchIds.includes(row.id) ? "Analyzed" : "Analyze"}
                        </LoadingButtonState>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
