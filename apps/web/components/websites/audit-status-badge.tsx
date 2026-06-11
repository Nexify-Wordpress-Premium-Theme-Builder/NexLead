import type { AuditStatus } from "@/features/websites/website.types";

const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  queued: "Kuyrukta",
  running: "Çalışıyor",
  completed: "Tamamlandı",
  failed: "Başarısız",
  cancelled: "İptal Edildi",
};

const AUDIT_STATUS_STYLES: Record<AuditStatus, string> = {
  queued: "bg-amber-50 text-amber-800",
  running: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-surface-soft text-text-muted",
};

type AuditStatusBadgeProps = {
  status: AuditStatus | null;
};

export function AuditStatusBadge({ status }: AuditStatusBadgeProps) {
  if (!status) {
    return <span className="text-sm text-text-muted">Henüz analiz yok</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${AUDIT_STATUS_STYLES[status]}`}
    >
      {AUDIT_STATUS_LABELS[status]}
    </span>
  );
}
