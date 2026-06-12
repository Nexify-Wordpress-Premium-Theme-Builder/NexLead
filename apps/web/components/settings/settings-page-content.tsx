import { LogoutButton } from "@/components/dashboard/logout-button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { SettingsPageData } from "@/features/settings/settings.types";

type SettingsPageContentProps = {
  data: SettingsPageData;
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Sahip",
  admin: "Yönetici",
  member: "Üye",
  viewer: "İzleyici",
};

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[13px] font-semibold text-text-secondary">{label}</p>
      <p className="rounded-xl border bg-surface-soft px-3.5 py-2.5 text-[14px] font-medium text-text-primary" style={{ borderColor: "var(--nx-border)" }}>
        {value}
      </p>
    </div>
  );
}

export function SettingsPageContent({ data }: SettingsPageContentProps) {
  const roleLabel = data.workspace.role ? (ROLE_LABELS[data.workspace.role] ?? data.workspace.role) : "—";

  return (
    <div className="nx-page space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Hesap ve çalışma alanı tercihlerinizi görüntüleyin."
      />

      <div className="nx-stagger grid gap-4 lg:grid-cols-2">
        <Card padding="lg" className="space-y-5">
          <div>
            <h2 className="nx-section-title">Profil</h2>
            <p className="nx-section-desc">Hesap bilgileriniz</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-lg font-bold text-accent">
              {(data.profile.fullName ?? data.profile.email).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold text-text-primary">
                {data.profile.fullName ?? "İsim belirtilmemiş"}
              </p>
              <p className="truncate text-[13px] font-medium text-text-muted">{data.profile.email}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Ad Soyad" value={data.profile.fullName ?? "—"} />
            <ReadOnlyField label="E-posta" value={data.profile.email || "—"} />
            <ReadOnlyField label="Dil" value={data.profile.locale} />
            <ReadOnlyField label="Saat Dilimi" value={data.profile.timezone} />
          </div>
          <p className="text-[12px] font-medium text-text-muted">Profil düzenleme yakında eklenecek.</p>
        </Card>

        <Card padding="lg" className="space-y-5">
          <div>
            <h2 className="nx-section-title">Çalışma Alanı</h2>
            <p className="nx-section-desc">Aktif workspace bilgileri</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Çalışma Alanı" value={data.workspace.name ?? "—"} />
            <ReadOnlyField label="Rolünüz" value={roleLabel} />
            <ReadOnlyField label="Üyelik Durumu" value={data.workspace.memberStatus ?? "—"} />
            <ReadOnlyField
              label="Oluşturulma"
              value={
                data.workspace.createdAt
                  ? new Date(data.workspace.createdAt).toLocaleDateString("tr-TR")
                  : "—"
              }
            />
          </div>
          <p className="text-[12px] font-medium text-text-muted">Çalışma alanı ayarları yakında eklenecek.</p>
        </Card>

        <Card padding="lg" className="space-y-5">
          <div>
            <h2 className="nx-section-title">Tercihler</h2>
            <p className="nx-section-desc">Bildirim ve görünüm ayarları</p>
          </div>
          <div className="rounded-xl border bg-surface-soft px-4 py-3.5" style={{ borderColor: "var(--nx-border)" }}>
            <p className="text-[14px] font-semibold text-text-primary">Bildirimler</p>
            <p className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted">
              E-posta ve uygulama içi bildirim tercihleri yakında burada yönetilebilecek.
            </p>
          </div>
        </Card>

        <Card padding="lg" className="space-y-5">
          <div>
            <h2 className="nx-section-title">Güvenlik ve Oturum</h2>
            <p className="nx-section-desc">Oturum yönetimi</p>
          </div>
          <div className="rounded-xl border bg-surface-soft px-4 py-3.5" style={{ borderColor: "var(--nx-border)" }}>
            <p className="text-[14px] font-semibold text-text-primary">Aktif oturum</p>
            <p className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted">
              Bu cihazdaki oturumunuz aktif. Çıkış yaptığınızda tekrar giriş yapmanız gerekir.
            </p>
          </div>
          <LogoutButton />
        </Card>
      </div>
    </div>
  );
}
