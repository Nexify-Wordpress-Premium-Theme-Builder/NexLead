import { WebsiteAuditContent } from "@/components/audit/website-audit-content";
import { PageHeader } from "@/components/layout/page-header";

export default function WebsiteAuditPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Web Sitesi Analizi"
        description="Herhangi bir web sitesini analiz edin; dönüşüm, SEO, hız ve takip fırsatlarını belirleyin."
      />
      <WebsiteAuditContent />
    </div>
  );
}
