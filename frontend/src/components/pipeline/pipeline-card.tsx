import type { PipelineCard as PipelineCardType } from "@shared/types/pipeline";

export function PipelineCard({ card }: { card: PipelineCardType }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-sm font-medium text-text-primary">{card.companyName}</p>
      <p className="text-xs text-text-muted">Score {card.opportunityScore}</p>
    </div>
  );
}
