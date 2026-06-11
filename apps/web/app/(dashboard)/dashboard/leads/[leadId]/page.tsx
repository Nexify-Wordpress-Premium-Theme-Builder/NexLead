import { notFound } from "next/navigation";

import { LeadDetailPageContent } from "@/components/leads/lead-detail-page-content";
import { getLeadDetail, getLeadWebsites } from "@/features/leads/lead.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{ leadId: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;
  const workspace = await requireWorkspace();

  if (!workspace) {
    notFound();
  }

  let lead;
  let websites;

  try {
    lead = await getLeadDetail(workspace.workspaceId, leadId);

    if (!lead) {
      notFound();
    }

    websites = await getLeadWebsites(workspace.workspaceId, leadId, lead.company_name);
  } catch {
    throw new Error("Lead detayı yüklenemedi");
  }

  return <LeadDetailPageContent lead={lead} websites={websites} />;
}
