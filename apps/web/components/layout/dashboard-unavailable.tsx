import Link from "next/link";

type DashboardUnavailableProps = {
  title?: string;
  description?: string;
};

export function DashboardUnavailable({
  title = "Panel geçici olarak yüklenemedi",
  description = "Bağlantı veya oturum kaynaklı geçici bir sorun oluştu. Sayfayı yenileyin; sorun sürerse oturumu kapatıp tekrar giriş yapın.",
}: DashboardUnavailableProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="nx-card max-w-lg p-8 text-center">
        <h1 className="text-[22px] font-bold text-text-primary">{title}</h1>
        <p className="mt-3 text-[14px] font-medium leading-relaxed text-text-muted">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-[14px] font-semibold text-white"
          >
            Sayfayı Yenile
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-[14px] font-semibold text-text-primary"
            style={{ borderColor: "var(--nx-border)" }}
          >
            Giriş Sayfası
          </Link>
        </div>
      </div>
    </div>
  );
}
