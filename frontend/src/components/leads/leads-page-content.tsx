"use client";

import { useState } from "react";
import Link from "next/link";
import { mockLeadFilters, mockLeadTableRows, mockLeadsKpis } from "@/data/mock-leads";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { FilterPills } from "@/components/shared/filter-pills";
import { Badge } from "@/components/ui/badge";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

const statusVariant = {
  warning: "warning",
  success: "success",
  default: "default",
  purple: "purple",
  danger: "danger",
} as const;

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

export function LeadsPageContent() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockLeadsKpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
        <FilterPills
          items={[...mockLeadFilters]}
          active={activeFilter}
          onChange={setActiveFilter}
          className="mb-5"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft">
                {[
                  "Company",
                  "Industry",
                  "Website",
                  "Status",
                  "Opportunity Score",
                  "Last Activity",
                  "Next Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted last:pr-0"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLeadTableRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "group border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                    "animate-fade-up-row",
                    rowDelays[index],
                  )}
                >
                  <td className="py-3 pr-3">
                    <Link
                      href={`${ROUTES.app.leads}/${row.id}`}
                      className="text-[13px] font-semibold text-text-primary transition-colors group-hover:text-primary"
                    >
                      {row.company}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-[13px] text-text-secondary">{row.industry}</td>
                  <td className="py-3 pr-3 text-[13px] text-primary">{row.website}</td>
                  <td className="py-3 pr-3">
                    <Badge variant={statusVariant[row.statusTone]}>{row.status}</Badge>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[11px] font-bold text-green">
                      {row.opportunityScore}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[13px] text-text-secondary">{row.lastActivity}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-[13px] font-semibold text-primary transition-colors group-hover:text-primary-hover"
                    >
                      {row.nextAction}
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
