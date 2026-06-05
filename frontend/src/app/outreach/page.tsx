import { OutreachPageContent } from "@/components/outreach/outreach-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function OutreachPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Outreach"
        description="Generate, personalize, and track lead-specific outreach messages."
        action={
          <button type="button" className="btn-campaign">
            Create Campaign
          </button>
        }
      />
      <OutreachPageContent />
    </div>
  );
}
