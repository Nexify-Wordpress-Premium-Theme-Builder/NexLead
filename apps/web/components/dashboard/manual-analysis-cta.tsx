import Link from "next/link";

export function ManualAnalysisCta() {
  return (
    <section className="dashboard-stagger-item mt-6 rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-soft p-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div className="max-w-2xl">
        <h2 className="text-base font-semibold text-text-primary">Manuel Site Analizi Başlat</h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          Herhangi bir web sitesini anında analiz edin, skorları görün ve rapor oluşturun.
        </p>
      </div>
      <Link
        href="/dashboard/websites"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 sm:mt-0"
      >
        Analizi Başlat
      </Link>
    </section>
  );
}
