import { AuditScoreCard } from "@/components/websites/audit-score-card";
import type { AuditScoresView } from "@/features/audits/audit-result.types";
import {
  FINDING_CATEGORY_LABELS,
  NULL_SCORE_LABEL,
  SCORE_CATEGORY_ORDER,
} from "@/features/audits/audit-result.utils";

type ReportScoreOverviewProps = {
  scores: AuditScoresView | null;
};

export function ReportScoreOverview({ scores }: ReportScoreOverviewProps) {
  if (!scores) {
    return (
      <section className="nx-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-text-primary">Skor Özeti</h2>
        <p className="mt-3 text-sm text-text-secondary">Bu analiz için skor verisi bulunmuyor.</p>
      </section>
    );
  }

  const categoryMap = new Map(scores.categories.map((item) => [item.category, item.score]));

  const orderedCategories = SCORE_CATEGORY_ORDER.map((category) => ({
    category,
    score: categoryMap.get(category) ?? null,
  }));

  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Skor Özeti</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AuditScoreCard label="Genel Skor" score={scores.overallScore} />
        {orderedCategories.map((item) => (
          <AuditScoreCard
            key={item.category}
            label={
              item.score !== null
                ? FINDING_CATEGORY_LABELS[item.category]
                : `${FINDING_CATEGORY_LABELS[item.category]}`
            }
            score={item.score}
          />
        ))}
      </div>
      {orderedCategories.every((item) => item.score === null) && scores.overallScore === null ? (
        <p className="mt-3 text-sm text-text-muted">{NULL_SCORE_LABEL}</p>
      ) : null}
    </section>
  );
}
