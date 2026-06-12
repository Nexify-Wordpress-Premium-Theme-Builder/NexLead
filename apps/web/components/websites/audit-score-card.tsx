import { NULL_SCORE_LABEL } from "@/features/audits/audit-result.utils";

type AuditScoreCardProps = {
  label: string;
  score: number | null;
};

export function AuditScoreCard({ label, score }: AuditScoreCardProps) {
  const hasScore = score !== null && Number.isFinite(score);
  const clampedScore = hasScore ? Math.max(0, Math.min(100, score)) : null;

  return (
    <div className="rounded-xl border border-border bg-surface-soft/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-lg font-semibold tabular-nums text-text-primary">
          {hasScore ? clampedScore : "—"}
        </p>
      </div>
      {hasScore ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-primary/70 transition-all"
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      ) : (
        <p className="mt-2 text-xs text-text-muted">{NULL_SCORE_LABEL}</p>
      )}
    </div>
  );
}
