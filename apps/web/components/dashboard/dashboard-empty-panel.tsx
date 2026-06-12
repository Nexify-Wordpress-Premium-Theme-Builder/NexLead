import Link from "next/link";

export function DashboardEmptyPanel() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center shadow-soft">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-text-primary">
        NexLead çalışma alanınız hazır
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
        İlk lead&apos;inizi ekleyerek müşteri kazanım sürecinizi başlatabilirsiniz.
      </p>
      <Link
        href="/dashboard/leads"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
      >
        İlk Lead&apos;i Ekle
      </Link>
    </div>
  );
}
