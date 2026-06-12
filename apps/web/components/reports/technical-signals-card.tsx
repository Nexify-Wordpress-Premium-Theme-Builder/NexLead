import type { TechnicalSignal } from "@/features/reports/report.types";

type TechnicalSignalsCardProps = {
  signals: TechnicalSignal[];
};

export function TechnicalSignalsCard({ signals }: TechnicalSignalsCardProps) {
  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Teknik Sinyaller</h2>

      {signals.length === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">Teknik sinyal verisi bulunmuyor.</p>
      ) : (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {signals.map((signal) => (
            <div
              key={`${signal.label}-${signal.value}`}
              className="rounded-xl border border-border bg-surface-soft/40 px-4 py-3"
            >
              <dt className="text-xs font-medium text-text-muted">{signal.label}</dt>
              <dd className="mt-1 break-words text-sm text-text-primary">{signal.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
