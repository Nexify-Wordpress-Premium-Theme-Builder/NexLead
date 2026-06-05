import { LeadSearchContent } from "@/components/lead-search/lead-search-content";
import { PageHeader } from "@/components/layout/page-header";

export default function LeadSearchPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Müşteri Bul"
        description="Sektör, konum ve web sitesi sinyallerine göre yüksek fırsatlı şirketleri bulun."
      />
      <LeadSearchContent />
    </div>
  );
}
