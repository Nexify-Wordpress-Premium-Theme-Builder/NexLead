import { WebsiteAuditContent } from "@/components/audit/website-audit-content";
import { PageHeader } from "@/components/layout/page-header";

export default function WebsiteAuditPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Website Audit"
        description="Analyze any website and identify conversion, SEO, speed, and tracking opportunities."
      />
      <WebsiteAuditContent />
    </div>
  );
}
