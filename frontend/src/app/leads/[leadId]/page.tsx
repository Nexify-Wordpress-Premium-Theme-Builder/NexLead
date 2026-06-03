import { getLeadById } from "@/services/leads-client";

interface LeadDetailPageProps {
  params: Promise<{ leadId: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;
  const lead = getLeadById(leadId);

  return (
    <main>
      <h1>{lead?.companyName ?? "Lead Detail"}</h1>
      <p>Review lead profile, audit insights, outreach history, and next actions.</p>
    </main>
  );
}
