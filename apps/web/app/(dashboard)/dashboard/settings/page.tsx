import { SettingsPageContent } from "@/components/settings/settings-page-content";
import { getSettingsPageData } from "@/features/settings/settings.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return null;
  }

  try {
    const data = await getSettingsPageData(workspace.workspaceId, workspace.userId);

    if (!data) {
      return null;
    }

    return <SettingsPageContent data={data} />;
  } catch {
    return (
      <div className="nx-page">
        <div className="nx-card p-8 text-center">
          <h1 className="text-[18px] font-bold text-text-primary">Ayarlar yüklenemedi</h1>
          <p className="mt-2 text-[14px] font-medium text-text-muted">
            Veriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
        </div>
      </div>
    );
  }
}
