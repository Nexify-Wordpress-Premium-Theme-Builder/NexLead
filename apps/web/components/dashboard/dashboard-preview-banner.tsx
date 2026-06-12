import {
  DASHBOARD_PREVIEW_FIELD_LABELS,
} from "@/features/dashboard/dashboard-preview.utils";
import type { DashboardPreviewField } from "@/features/dashboard/dashboard.types";

type DashboardPreviewBannerProps = {
  fields: DashboardPreviewField[];
};

export function DashboardPreviewBanner({ fields }: DashboardPreviewBannerProps) {
  if (fields.length === 0) {
    return null;
  }

  const labels = fields.map((field) => DASHBOARD_PREVIEW_FIELD_LABELS[field]).join(", ");

  return (
    <div
      className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-text-secondary"
      role="status"
    >
      <p className="font-medium text-text-primary">Önizleme verisi aktif</p>
      <p className="mt-1">
        Gerçek veri olmayan alanlarda kontrollü frontend önizlemesi gösteriliyor: {labels}.
      </p>
    </div>
  );
}
