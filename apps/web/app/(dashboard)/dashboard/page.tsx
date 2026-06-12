import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardOverview } from "@/features/dashboard/dashboard.service";
import { applyDashboardPreview } from "@/features/dashboard/dashboard-preview.utils";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-xl font-semibold text-text-primary">Çalışma alanı bulunamadı</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Aktif bir çalışma alanına erişilemiyor. Lütfen oturumu kapatıp tekrar giriş yapın.
        </p>
      </div>
    );
  }

  try {
    const overview = applyDashboardPreview(
      await getDashboardOverview(
        workspace.workspaceId,
        workspace.workspaceName ?? "Çalışma Alanı",
      ),
    );
    return <DashboardOverview data={overview} />;
  } catch {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-xl font-semibold text-text-primary">Genel bakış yüklenemedi</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Dashboard verileri alınırken bir sorun oluştu. Lütfen sayfayı yenileyin.
        </p>
      </div>
    );
  }
}
