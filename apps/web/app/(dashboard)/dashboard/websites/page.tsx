import { WebsitesPageContent } from "@/components/websites/websites-page-content";
import {
  getLeadOptionsForWorkspace,
  getWebsitesForWorkspace,
} from "@/features/websites/website.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function WebsitesPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-xl font-semibold text-text-primary">Çalışma alanı bulunamadı</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Aktif bir çalışma alanına erişilemiyor. Lütfen oturumu kapatıp tekrar giriş yapın veya
          destek ile iletişime geçin.
        </p>
      </div>
    );
  }

  try {
    const [websites, leads] = await Promise.all([
      getWebsitesForWorkspace(workspace.workspaceId),
      getLeadOptionsForWorkspace(workspace.workspaceId),
    ]);

    return <WebsitesPageContent websites={websites} leads={leads} />;
  } catch {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-xl font-semibold text-text-primary">Web siteleri yüklenemedi</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Web site listesi alınırken bir sorun oluştu. Lütfen sayfayı yenileyin.
        </p>
      </div>
    );
  }
}
