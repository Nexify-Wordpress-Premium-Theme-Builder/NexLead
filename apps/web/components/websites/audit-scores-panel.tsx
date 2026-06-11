import { AuditScoreCard } from "@/components/websites/audit-score-card";
import type { AuditScoresView } from "@/features/audits/audit-result.types";
import { FINDING_CATEGORY_LABELS, SCORE_CATEGORY_ORDER } from "@/features/audits/audit-result.utils";

type AuditScoresPanelProps = {
  scores: AuditScoresView;
};

export function AuditScoresPanel({ scores }: AuditScoresPanelProps) {
  const categoryMap = new Map(scores.categories.map((item) => [item.category, item.score]));

  const orderedCategories = SCORE_CATEGORY_ORDER.filter((category) => categoryMap.has(category)).map(
    (category) => ({
      category,
      score: categoryMap.get(category) ?? null,
    }),
  );

  const extraCategories = scores.categories
    .filter((item) => !SCORE_CATEGORY_ORDER.includes(item.category))
    .map((item) => ({ category: item.category, score: item.score }));

  const allCategories = [...orderedCategories, ...extraCategories];
  const showOverall = scores.overallScore !== null;

  if (!showOverall && allCategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">Skorlar</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {showOverall ? <AuditScoreCard label="Genel Skor" score={scores.overallScore} /> : null}
        {allCategories.map((item) => (
          <AuditScoreCard
            key={item.category}
            label={FINDING_CATEGORY_LABELS[item.category]}
            score={item.score}
          />
        ))}
      </div>
    </div>
  );
}
