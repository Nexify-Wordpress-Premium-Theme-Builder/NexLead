export function AuditScoreCard({ score }: { score: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <p className="text-sm text-text-secondary">Overall score</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">{score}</p>
    </div>
  );
}
