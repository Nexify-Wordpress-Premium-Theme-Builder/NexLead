import { LeadsPageContent } from "@/components/leads/leads-page-content";
import { getLeadsForWorkspace } from "@/features/leads/lead.service";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const workspace = await requireWorkspace();

  if (!workspace) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-xl font-semibold text-text-primary">Çalışma alanı bulunamadı</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Aktif bir çalışma alanına erişilemiyor. Lütfen oturumu kapatıp tekrar giriş yapın veya
          destek ile iletişime geçin.
        </p>
      </div>
    );
  }

  let leads;

  try {
    leads = await getLeadsForWorkspace(workspace.workspaceId);
  } catch {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-xl font-semibold text-text-primary">Leadler yüklenemedi</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Lead listesi alınırken bir sorun oluştu. Lütfen sayfayı yenileyin.
        </p>
      </div>
    );
  }

  return <LeadsPageContent leads={leads} />;
}
