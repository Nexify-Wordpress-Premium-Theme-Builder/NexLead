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
        title="Müşteri Detayı"
        description="Bu müşteri için profil, outreach taslağı ve ilerleme aksiyonlarını inceleyin."
      />
      <LeadDetailPageContent leadId={leadId} />
    </div>
  );
}
