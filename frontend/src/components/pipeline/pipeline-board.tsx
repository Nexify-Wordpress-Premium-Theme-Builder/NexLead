import type { PipelineCard, PipelineStage } from "@shared/types/pipeline";
import { PipelineColumn } from "./pipeline-column";

export function PipelineBoard({
  stages,
  cards,
}: {
  stages: PipelineStage[];
  cards: PipelineCard[];
}) {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {stages.map((stage) => (
        <PipelineColumn
          key={stage.id}
          stage={stage}
          cards={cards.filter((card) => card.status === stage.status)}
        />
      ))}
    </div>
  );
}
