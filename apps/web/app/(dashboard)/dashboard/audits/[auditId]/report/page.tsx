import { notFound } from "next/navigation";

import { AuditReportPageContent } from "@/components/reports/audit-report-page-content";
import { getAuditReport } from "@/features/reports/report.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

type AuditReportPageProps = {
  params: Promise<{ auditId: string }>;
};

export default async function AuditReportPage({ params }: AuditReportPageProps) {
  const { auditId } = await params;
  const workspace = await requireWorkspace();

  if (!workspace) {
    notFound();
  }

  let report;

  try {
    report = await getAuditReport(workspace.workspaceId, auditId);
  } catch {
    throw new Error("Analiz raporu yüklenemedi");
  }

  if (!report) {
    notFound();
  }

  return <AuditReportPageContent report={report} />;
}
