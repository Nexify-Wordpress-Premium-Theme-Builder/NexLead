import type { PipelineCard, PipelineStage } from "@shared/types/pipeline";
import { PipelineCard as PipelineCardItem } from "./pipeline-card";

export function PipelineColumn({
  stage,
  cards,
}: {
  stage: PipelineStage;
  cards: PipelineCard[];
}) {
  return (
    <div className="min-w-56 rounded-xl border border-border bg-surface p-3">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">{stage.label}</h3>
      <div className="space-y-2">
        {cards.map((card) => (
          <PipelineCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
