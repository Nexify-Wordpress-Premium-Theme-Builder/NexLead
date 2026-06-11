import type { LeadStatus } from "@/features/leads/lead.types";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Yeni",
  enriched: "Zenginleştirildi",
  qualified: "Nitelikli",
  contacted: "İletişime Geçildi",
  replied: "Yanıt Geldi",
  meeting_scheduled: "Toplantı Planlandı",
  won: "Kazanıldı",
  lost: "Kaybedildi",
  archived: "Arşivlendi",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-surface-soft text-text-primary",
  enriched: "bg-surface-soft text-text-secondary",
  qualified: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-800",
  replied: "bg-violet-50 text-violet-700",
  meeting_scheduled: "bg-indigo-50 text-indigo-700",
  won: "bg-green-50 text-green-700",
  lost: "bg-red-50 text-red-700",
  archived: "bg-surface-soft text-text-muted",
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
