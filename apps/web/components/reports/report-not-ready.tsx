import Link from "next/link";

import type { AuditReport } from "@/features/reports/report.types";

type ReportNotReadyProps = {
  report: AuditReport;
};

export function ReportNotReady({ report }: ReportNotReadyProps) {
  const title =
    report.state === "not_ready_queued"
      ? "Rapor henüz hazır değil"
      : report.state === "not_ready_running"
        ? "Analiz devam ediyor"
        : "Rapor oluşturulamadı";

  const description =
    report.state === "not_ready_queued"
      ? "Analiz kuyrukta. Analiz tamamlandığında rapor burada görüntülenecek."
      : report.state === "not_ready_running"
        ? "Analiz devam ediyor. Tamamlandığında rapor burada görüntülenecek."
        : "Analiz tamamlanamadığı için rapor hazır değil.";

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft sm:p-8">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary">{description}</p>
      <Link
        href={`/dashboard/websites/${report.website.id}`}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
      >
        Web site detayına dön
      </Link>
    </section>
  );
}
