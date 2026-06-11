import type { WebsiteStatus } from "@/features/websites/website.types";

const STATUS_LABELS: Record<WebsiteStatus, string> = {
  pending: "Bekliyor",
  active: "Aktif",
  unreachable: "Erişilemiyor",
  archived: "Arşivlendi",
};

const STATUS_STYLES: Record<WebsiteStatus, string> = {
  pending: "bg-surface-soft text-text-secondary",
  active: "bg-green-50 text-green-700",
  unreachable: "bg-red-50 text-red-700",
  archived: "bg-surface-soft text-text-muted",
};

type WebsiteStatusBadgeProps = {
  status: WebsiteStatus;
};

export function WebsiteStatusBadge({ status }: WebsiteStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
