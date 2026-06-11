import { notFound } from "next/navigation";

import { WebsiteDetailPageContent } from "@/components/websites/website-detail-page-content";
import {
  getLeadOptionsForWorkspace,
  getWebsiteDetail,
} from "@/features/websites/website.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

type WebsiteDetailPageProps = {
  params: Promise<{ websiteId: string }>;
};

export default async function WebsiteDetailPage({ params }: WebsiteDetailPageProps) {
  const { websiteId } = await params;
  const workspace = await requireWorkspace();

  if (!workspace) {
    notFound();
  }

  let website;
  let leads;

  try {
    const [websiteResult, leadOptions] = await Promise.all([
      getWebsiteDetail(workspace.workspaceId, websiteId),
      getLeadOptionsForWorkspace(workspace.workspaceId),
    ]);

    if (!websiteResult) {
      notFound();
    }

    website = websiteResult;
    leads = leadOptions;
  } catch {
    throw new Error("Web site detayı yüklenemedi");
  }

  return <WebsiteDetailPageContent website={website} leads={leads} />;
}
