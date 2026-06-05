import Link from "next/link";
import { mockPipelineStages } from "@/data/mock-dashboard";
import type { PipelineStageMetric } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { pipelineStageLabels } from "@/lib/i18n/tr-labels";
import type { PipelineStageId } from "@/types/pipeline";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";

const toneStyles: Record<PipelineStageMetric["tone"], string> = {
  blue: "bg-primary-soft/60 text-primary border-primary/8",
  slate: "bg-slate-50/80 text-slate-600 border-slate-200/60",
  indigo: "bg-indigo-50/80 text-indigo-600 border-indigo-100/80",
  purple: "bg-purple-soft/80 text-purple border-purple/8",
  green: "bg-green-soft/80 text-green border-green/8",
  lime: "bg-[#F7FEE7]/80 text-[#65A30D] border-lime-200/60",
};

export function OutreachPipeline({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">İletişim Süreci</h3>
        <Link href={ROUTES.app.pipeline} className="link-section">
          Süreci görüntüle →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {mockPipelineStages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "flex min-h-[80px] flex-col justify-center rounded-xl border px-3 py-2.5 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]",
              toneStyles[stage.tone],
            )}
          >
            <p className="text-[11px] font-semibold text-text-muted">
              {pipelineStageLabels[stage.id as PipelineStageId] ?? stage.label}
            </p>
            <p className="mt-0.5 text-lg font-bold leading-none tracking-tight text-text-primary tabular-nums">
              {stage.count.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-text-muted">{stage.percent}%</p>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-border-soft pt-3.5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-text-secondary">Genel Yanıt Oranı</span>
          <span className="font-bold text-text-primary">18.3%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-green transition-all duration-700 ease-out"
            style={{ width: "18.3%" }}
          />
        </div>
      </div>
    </div>
  );
}
