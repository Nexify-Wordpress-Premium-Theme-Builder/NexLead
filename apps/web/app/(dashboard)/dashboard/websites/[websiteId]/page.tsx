import { notFound } from "next/navigation";

import { WebsiteDetailPageContent } from "@/components/websites/website-detail-page-content";
import { getWebsiteAuditResult } from "@/features/audits/audit-result.service";
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
  let auditResult;

  try {
    const [websiteResult, leadOptions, auditResultData] = await Promise.all([
      getWebsiteDetail(workspace.workspaceId, websiteId),
      getLeadOptionsForWorkspace(workspace.workspaceId),
      getWebsiteAuditResult(workspace.workspaceId, websiteId),
    ]);

    if (!websiteResult || !auditResultData) {
      notFound();
    }

    website = websiteResult;
    leads = leadOptions;
    auditResult = auditResultData;
  } catch {
    throw new Error("Web site detayı yüklenemedi");
  }

  return (
    <WebsiteDetailPageContent website={website} leads={leads} auditResult={auditResult} />
  );
}
