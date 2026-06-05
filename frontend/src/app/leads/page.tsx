import { LeadsPageContent } from "@/components/leads/leads-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function LeadsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Leads"
        description="Manage, score, and prioritize your client acquisition opportunities."
        action={
          <button type="button" className="btn-campaign">
            Add Lead
          </button>
        }
      />
      <LeadsPageContent />
    </div>
  );
}
