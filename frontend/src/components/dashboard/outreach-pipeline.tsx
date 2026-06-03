import Link from "next/link";
import { mockPipelineStages } from "@/data/mock-dashboard";
import type { PipelineStageMetric } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";

const toneStyles: Record<PipelineStageMetric["tone"], string> = {
  blue: "bg-primary-soft/80 text-primary border-primary/10",
  slate: "bg-slate-50 text-slate-700 border-slate-200/80",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  purple: "bg-purple-soft text-purple border-purple/10",
  green: "bg-green-soft text-green border-green/10",
  lime: "bg-[#ECFCCB]/80 text-[#65A30D] border-lime-200/80",
};

export function OutreachPipeline({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Outreach Pipeline</h3>
        <Link href={ROUTES.app.pipeline} className="link-section">
          View pipeline →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {mockPipelineStages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "flex min-h-[92px] flex-col justify-center rounded-[14px] border px-3 py-3.5 transition-all duration-200 hover:-translate-y-px",
              toneStyles[stage.tone],
            )}
          >
            <p className="text-xs font-semibold text-[#64748B]">{stage.label}</p>
            <p className="mt-1 text-[22px] font-bold leading-none tracking-tight text-text-primary">
              {stage.count.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">{stage.percent}%</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border-soft pt-4">
        <div className="mb-2.5 flex items-center justify-between text-sm">
          <span className="font-medium text-text-secondary">Overall Reply Rate</span>
          <span className="text-base font-bold text-text-primary">18.3%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-[#6366F1] to-green transition-all duration-500"
            style={{ width: "18.3%" }}
          />
        </div>
      </div>
    </div>
  );
}
