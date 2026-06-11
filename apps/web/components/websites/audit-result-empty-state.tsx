import type { AuditResultState } from "@/features/audits/audit-result.types";

const STATE_MESSAGES: Record<
  Exclude<AuditResultState, "completed_with_data">,
  { title: string; description: string }
> = {
  no_audit: {
    title: "Henüz analiz başlatılmadı.",
    description: "Bu web sitesi için analiz başlatarak sonuçları burada görebilirsiniz.",
  },
  queued: {
    title: "Analiz kuyruğa alındı.",
    description: "Sonuçlar hazır olduğunda burada görünecek.",
  },
  running: {
    title: "Analiz çalışıyor.",
    description: "Sonuçlar hazır olduğunda bu alan güncellenecek.",
  },
  completed_empty: {
    title: "Analiz tamamlandı.",
    description: "Bu analiz için henüz detaylı bulgu veya skor üretilmedi.",
  },
  failed: {
    title: "Analiz tamamlanamadı.",
    description: "Daha sonra tekrar analiz başlatabilirsiniz.",
  },
  cancelled: {
    title: "Analiz iptal edildi.",
    description: "Yeni bir analiz başlatarak sonuçları burada görebilirsiniz.",
  },
};

type AuditResultEmptyStateProps = {
  state: Exclude<AuditResultState, "completed_with_data">;
};

export function AuditResultEmptyState({ state }: AuditResultEmptyStateProps) {
  const content = STATE_MESSAGES[state];

  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-soft/30 px-4 py-8 text-center sm:px-6">
      <p className="text-sm font-medium text-text-primary">{content.title}</p>
      <p className="mt-2 text-sm text-text-secondary">{content.description}</p>
    </div>
  );
}
