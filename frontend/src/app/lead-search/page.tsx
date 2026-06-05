import { LeadSearchContent } from "@/components/lead-search/lead-search-content";
import { PageHeader } from "@/components/layout/page-header";

export default function LeadSearchPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Lead Search"
        description="Find high-opportunity companies by industry, location, and website signals."
        action={
          <button type="button" className="btn-campaign">
            Start Search
          </button>
        }
      />
      <LeadSearchContent />
    </div>
  );
}
