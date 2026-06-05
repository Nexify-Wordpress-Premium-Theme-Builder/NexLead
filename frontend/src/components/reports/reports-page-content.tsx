"use client";

import {
  mockAuditTrends,
  mockIndustryPerformance,
  mockLeadQualityData,
  mockMeetingConversion,
  mockOutreachPerformance,
  mockReportsKpis,
} from "@/data/mock-reports";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

export function ReportsPageContent() {
  const maxOutreach = Math.max(...mockOutreachPerformance.map((d) => d.value));

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockReportsKpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Lead Quality Overview</h3>
          <div className="space-y-3">
            {mockLeadQualityData.map((item, i) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="font-semibold text-text-primary">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary animate-bar-grow"
                    style={{
                      width: `${(item.value / item.max) * 100}%`,
                      animationDelay: `${300 + i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Outreach Performance</h3>
          <div className="flex items-end gap-3 h-[140px]">
            {mockOutreachPerformance.map((item, i) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary/80 animate-bar-grow"
                  style={{
                    height: `${(item.value / maxOutreach) * 100}px`,
                    animationDelay: `${350 + i * 60}ms`,
                  }}
                />
                <span className="text-[10px] font-medium text-text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Audit Issue Trends</h3>
          <div className="space-y-2.5">
            {mockAuditTrends.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2">
                <span className="text-[13px] text-text-secondary">{item.label}</span>
                <span className="text-[13px] font-bold text-red">{item.issues}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-450")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Meeting Conversion</h3>
          <div className="flex items-end gap-2 h-[120px]">
            {mockMeetingConversion.map((item, i) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-green/70 animate-bar-grow"
                  style={{
                    height: `${(item.rate / 10) * 100}px`,
                    animationDelay: `${450 + i * 50}ms`,
                  }}
                />
                <span className="text-[10px] text-text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-500")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Best Performing Industries</h3>
          <div className="space-y-2.5">
            {mockIndustryPerformance.map((item, i) => (
              <div
                key={item.industry}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border-soft px-3 py-2.5",
                  "animate-fade-up-row",
                  [
                    "animation-delay-200",
                    "animation-delay-250",
                    "animation-delay-300",
                    "animation-delay-350",
                    "animation-delay-400",
                  ][i],
                )}
              >
                <span className="text-[13px] font-medium text-text-primary">{item.industry}</span>
                <span className="text-[13px] font-bold text-green">{item.replyRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
