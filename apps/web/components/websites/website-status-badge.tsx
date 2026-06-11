import type { WebsiteStatus, WebsiteWithRelations } from "@/features/websites/website.types";

const STATUS_LABELS: Record<WebsiteStatus, string> = {
  pending: "Bekliyor",
  active: "Aktif",
  unreachable: "Başarısız",
  archived: "Arşivlendi",
};

const STATUS_STYLES: Record<WebsiteStatus, string> = {
  pending: "bg-surface-soft text-text-secondary",
  active: "bg-green-50 text-green-700",
  unreachable: "bg-red-50 text-red-700",
  archived: "bg-surface-soft text-text-muted",
};

type WebsiteStatusBadgeProps = {
  website: WebsiteWithRelations;
};

export function WebsiteStatusBadge({ website }: WebsiteStatusBadgeProps) {
  if (website.isAuditRunning) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        Analiz Sürüyor
      </span>
    );
  }

  if (website.latestAudit?.status === "completed" && website.status === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
        Analiz Edildi
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[website.status]}`}
    >
      {STATUS_LABELS[website.status]}
    </span>
  );
}
