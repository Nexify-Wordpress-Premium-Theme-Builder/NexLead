import Link from "next/link";
import { mockPipelineStages } from "@/data/mock-dashboard";
import type { PipelineStageMetric } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

const toneStyles: Record<PipelineStageMetric["tone"], string> = {
  blue: "bg-primary-soft text-primary border-primary/10",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  purple: "bg-purple-soft text-purple border-purple/10",
  green: "bg-green-soft text-green border-green/10",
  lime: "bg-[#ECFCCB] text-[#65A30D] border-lime-200",
};

export function OutreachPipeline() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Outreach Pipeline</h3>
        <Link
          href={ROUTES.app.pipeline}
          className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          View pipeline →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {mockPipelineStages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "rounded-xl border px-3 py-3 transition-all duration-200",
              toneStyles[stage.tone],
            )}
          >
            <p className="text-xs font-medium opacity-90">{stage.label}</p>
            <p className="mt-1 text-lg font-bold">{stage.count.toLocaleString()}</p>
            <p className="text-xs opacity-80">{stage.percent}%</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-text-secondary">Overall Reply Rate</span>
          <span className="font-bold text-text-primary">18.3%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-green transition-all duration-200"
            style={{ width: "18.3%" }}
          />
        </div>
      </div>
    </div>
  );
}
