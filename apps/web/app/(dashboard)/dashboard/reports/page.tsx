import { ReportsPageContent } from "@/components/reports/reports-page-content";
import {
  REPORT_LIST_PREVIEW_ITEMS,
  REPORT_LIST_PREVIEW_SUMMARY,
} from "@/features/reports/report-preview-data";
import { getReportsList } from "@/features/reports/reports-list.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return null;
  }

  try {
    const data = await getReportsList(workspace.workspaceId);

    if (data.isEmpty) {
      return (
        <ReportsPageContent
          isPreview
          data={{
            items: REPORT_LIST_PREVIEW_ITEMS,
            summary: REPORT_LIST_PREVIEW_SUMMARY,
            isEmpty: false,
          }}
        />
      );
    }

    return <ReportsPageContent data={data} />;
  } catch {
    return (
      <div className="nx-page">
        <div className="nx-card p-8 text-center">
          <h1 className="text-[18px] font-bold text-text-primary">Raporlar yüklenemedi</h1>
          <p className="mt-2 text-[14px] font-medium text-text-muted">
            Veriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
        </div>
      </div>
    );
  }
}
