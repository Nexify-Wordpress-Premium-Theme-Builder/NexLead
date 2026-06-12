import Link from "next/link";

import type { AuditReport, AuditReportState } from "@/features/reports/report.types";

type ReportNotReadyProps = {
  report: AuditReport;
};

const NOT_READY_CONTENT: Record<
  Extract<
    AuditReportState,
    "not_ready_queued" | "not_ready_running" | "not_ready_failed" | "not_ready_cancelled"
  >,
  { title: string; description: string }
> = {
  not_ready_queued: {
    title: "Rapor henüz hazır değil",
    description: "Analiz kuyrukta. Analiz tamamlandığında rapor burada görüntülenecek.",
  },
  not_ready_running: {
    title: "Analiz devam ediyor",
    description: "Rapor analiz tamamlandığında hazır olacak.",
  },
  not_ready_failed: {
    title: "Rapor oluşturulamadı",
    description: "Analiz tamamlanamadı.",
  },
  not_ready_cancelled: {
    title: "Rapor hazır değil",
    description: "Analiz iptal edildi.",
  },
};

export function ReportNotReady({ report }: ReportNotReadyProps) {
  const content =
    report.state in NOT_READY_CONTENT
      ? NOT_READY_CONTENT[report.state as keyof typeof NOT_READY_CONTENT]
      : NOT_READY_CONTENT.not_ready_failed;

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
      <h2 className="text-lg font-semibold text-text-primary">{content.title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary">{content.description}</p>
      <Link
        href={`/dashboard/websites/${report.website.id}`}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-soft"
      >
        Web site detayına dön
      </Link>
    </section>
  );
}
