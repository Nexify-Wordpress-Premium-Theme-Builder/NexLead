import Link from "next/link";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { BackLink } from "@/components/ui/back-link";
import type { AuditReport } from "@/features/reports/report.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type AuditReportHeaderProps = {
  report: AuditReport;
};

export function AuditReportHeader({ report }: AuditReportHeaderProps) {
  const websiteLabel = report.website.url || report.website.domain;

  return (
    <header className="nx-card p-5 sm:p-6">
      <BackLink href={`/dashboard/websites/${report.website.id}`}>
        Web site detayına dön
      </BackLink>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-muted">Web Site Analiz Raporu</p>
          <h1 className="mt-1 break-words text-2xl font-semibold tracking-[-0.02em] text-text-primary sm:text-3xl">
            {websiteLabel}
          </h1>
          {report.website.domain && report.website.domain !== report.website.url ? (
            <p className="mt-1 truncate text-sm text-text-secondary">{report.website.domain}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <AuditStatusBadge status={report.audit.status} />
            {report.lead ? (
              <span className="inline-flex items-center rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-text-secondary">
                {report.lead.companyName}
              </span>
            ) : null}
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-text-muted">Rapor tarihi</dt>
              <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(report.generatedAt)}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Son analiz</dt>
              <dd className="mt-0.5 text-text-primary">
                {formatWebsiteDate(report.website.last_audited_at ?? report.audit.completed_at)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/dashboard/websites/${report.website.id}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
          >
            Web site detayına dön
          </Link>
        </div>
      </div>
    </header>
  );
}
