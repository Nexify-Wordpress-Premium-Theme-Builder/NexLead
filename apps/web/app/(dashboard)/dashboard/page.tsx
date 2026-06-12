import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardOverview } from "@/features/dashboard/dashboard.service";
import {
  applyDashboardPreview,
  createEmptyDashboardOverview,
} from "@/features/dashboard/dashboard-preview.utils";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return (
      <div className="nx-card mx-auto max-w-2xl p-8">
        <h1 className="text-xl font-semibold text-text-primary">Çalışma alanı bulunamadı</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Aktif bir çalışma alanına erişilemiyor. Lütfen oturumu kapatıp tekrar giriş yapın.
        </p>
      </div>
    );
  }

  const workspaceName = workspace.workspaceName ?? "Çalışma Alanı";

  try {
    const overview = applyDashboardPreview(
      await getDashboardOverview(workspace.workspaceId, workspaceName),
    );
    return <DashboardOverview data={overview} />;
  } catch {
    const overview = applyDashboardPreview(
      createEmptyDashboardOverview(workspace.workspaceId, workspaceName),
    );
    return <DashboardOverview data={overview} />;
  }
}
