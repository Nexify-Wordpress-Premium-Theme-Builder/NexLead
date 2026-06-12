import type { AuditStatus } from "@/features/websites/website.types";

type AuditFeedbackBannerProps = {
  status: AuditStatus | null;
};

const BANNER_CONFIG: Record<
  AuditStatus,
  { title: string; description: string; className: string }
> = {
  queued: {
    title: "Analiz kuyruğa alındı.",
    description: "Sistem bu web sitesini analiz etmek için sıraya aldı.",
    className: "border-amber-200/80 bg-amber-50/60",
  },
  running: {
    title: "Analiz çalışıyor.",
    description: "Web sitesi analiz ediliyor. Sonuçlar hazır olduğunda burada görünecek.",
    className: "border-blue-200/80 bg-blue-50/60",
  },
  completed: {
    title: "Son analiz tamamlandı.",
    description: "Analiz geçmişinden detayları inceleyebilirsiniz.",
    className: "border-green-200/80 bg-green-50/60",
  },
  failed: {
    title: "Son analiz tamamlanamadı.",
    description: "Tekrar analiz başlatabilirsiniz.",
    className: "border-red-200/80 bg-red-50/60",
  },
  cancelled: {
    title: "Son analiz iptal edildi.",
    description: "İsterseniz yeni bir analiz başlatabilirsiniz.",
    className: "border-border bg-surface-soft/80",
  },
};

export function AuditFeedbackBanner({ status }: AuditFeedbackBannerProps) {
  if (!status) {
    return null;
  }

  const config = BANNER_CONFIG[status];

  return (
    <div className={`mt-6 rounded-2xl border p-4 shadow-soft sm:p-5 ${config.className}`}>
      <p className="text-sm font-medium text-text-primary">{config.title}</p>
      <p className="mt-1 text-sm text-text-secondary">{config.description}</p>
    </div>
  );
}
