import { mockPipelineColumns } from "@/data/mock-pipeline";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

const columnDelays = [
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
  "animation-delay-350",
  "animation-delay-400",
  "animation-delay-450",
  "animation-delay-500",
] as const;

const cardDelays = [
  "animation-delay-250",
  "animation-delay-300",
  "animation-delay-350",
] as const;

export function PipelineBoard() {
  return (
    <div className="animate-fade-up animation-delay-200 -mx-1 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-4 px-1">
        {mockPipelineColumns.map((column, colIndex) => (
          <div
            key={column.id}
            className={cn(
              "w-[220px] shrink-0 rounded-[18px] border border-border-soft bg-surface-muted/50 p-3",
              "animate-fade-up",
              columnDelays[colIndex],
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h4 className="text-[13px] font-semibold text-text-primary">{column.label}</h4>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-text-muted">
                {column.count}
              </span>
            </div>
            <div className="space-y-2">
              {column.cards.map((card, cardIndex) => (
                <div
                  key={card.id}
                  className={cn(
                    panelClass("p-3"),
                    "animate-fade-up-row",
                    cardDelays[cardIndex % cardDelays.length],
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-text-primary">{card.company}</p>
                    <Badge variant="default">{card.badge}</Badge>
                  </div>
                  <p className="text-xs text-text-muted">{card.industry}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-soft text-[10px] font-bold text-green">
                      {card.score}
                    </span>
                    <span className="text-[11px] font-semibold text-primary">{card.nextAction}</span>
                  </div>
                </div>
              ))}
              {column.cards.length === 0 && (
                <p className="px-1 py-4 text-center text-xs text-text-muted">No leads</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
