import { ReportsPageContent } from "@/components/reports/reports-page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Reports"
        description="Measure lead quality, outreach performance, and meeting conversion trends."
        action={
          <button type="button" className="btn-campaign">
            Export Summary
          </button>
        }
      />
      <ReportsPageContent />
    </div>
  );
}
