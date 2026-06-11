import { getServerAuthSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getServerAuthSessionUser();
  const displayName = user?.email?.split("@")[0] ?? "Kullanıcı";

  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <p className="text-sm font-medium text-accent">NexLead Çalışma Alanı</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-primary">
          Hoş geldiniz, {displayName}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
          Hesabınız hazır. Bu alan, müşteri adayı yönetimi ve web denetim modüllerinin
          açılacağı premium çalışma yüzeyidir.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface-soft px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
              Durum
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">Oturum aktif</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-soft px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
              Workspace
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">Bootstrap tamamlandı</p>
          </div>
        </div>
      </section>
    </div>
  );
}
