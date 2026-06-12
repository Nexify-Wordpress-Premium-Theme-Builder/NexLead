import type { DashboardPreviewField } from "@/features/dashboard/dashboard.types";

type DashboardPreviewBannerProps = {
  fields: DashboardPreviewField[];
};

export function DashboardPreviewBanner({ fields }: DashboardPreviewBannerProps) {
  if (fields.length === 0) return null;

  return (
    <span
      className="nx-badge bg-accent-soft text-accent"
      role="status"
      title="Bazı alanlarda kontrollü frontend önizleme verisi kullanılıyor"
    >
      Önizleme modu
    </span>
  );
}
