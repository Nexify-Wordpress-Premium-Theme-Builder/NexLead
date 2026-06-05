import { ReportsPageContent } from "@/components/reports/reports-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Raporlar"
        description="Müşteri kalitesini, outreach performansını ve görüşme dönüşüm trendlerini ölçün."
      />
      <ReportsPageContent />
    </div>
  );
}
