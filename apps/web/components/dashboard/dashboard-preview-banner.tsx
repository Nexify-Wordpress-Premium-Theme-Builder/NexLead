import type { DashboardPreviewField } from "@/features/dashboard/dashboard.types";

type DashboardPreviewBannerProps = {
  fields: DashboardPreviewField[];
};

export function DashboardPreviewBanner({ fields }: DashboardPreviewBannerProps) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/8 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]"
      role="status"
      title="Bazı alanlarda kontrollü frontend önizleme verisi kullanılıyor"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
      Önizleme modu
    </span>
  );
}
