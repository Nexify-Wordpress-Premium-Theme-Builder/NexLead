import { LeadDetailContent } from "@/components/leads/lead-detail-content";
import { PageHeader } from "@/components/layout/page-header";
import { getLeadDetail } from "@/services/leads-client";

interface LeadDetailPageProps {
  params: Promise<{ leadId: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;
  const lead = getLeadDetail(leadId);

  if (!lead) {
    return (
      <div className="space-y-5">
        <PageHeader title="Lead Not Found" description="This lead profile could not be loaded." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title={lead.company}
        description={`${lead.industry} company · ${lead.website} · High opportunity lead`}
        action={
          <button type="button" className="btn-campaign">
            Generate Outreach
          </button>
        }
      />
      <LeadDetailContent lead={lead} />
    </div>
  );
}
