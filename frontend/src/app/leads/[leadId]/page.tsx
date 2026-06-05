import { LeadDetailPageContent } from "@/components/leads/lead-detail-page-content";
import { PageHeader } from "@/components/layout/page-header";

interface LeadDetailPageProps {
  params: Promise<{ leadId: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;

  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Lead Detail"
        description="Review profile, outreach draft, and progression actions for this lead."
      />
      <LeadDetailPageContent leadId={leadId} />
    </div>
  );
}
