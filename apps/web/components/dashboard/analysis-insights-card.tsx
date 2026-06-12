type AnalysisInsightsCardProps = {
  insights: string[];
};

export function AnalysisInsightsCard({ insights }: AnalysisInsightsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <h3 className="text-sm font-semibold text-text-primary">Analiz İçgörüleri</h3>
      <p className="mt-1 text-xs text-text-muted">En kritik bulgular ve öneriler</p>

      <ul className="mt-4 space-y-2.5">
        {insights.map((insight) => (
          <li key={insight} className="flex gap-2 text-sm text-text-secondary">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
