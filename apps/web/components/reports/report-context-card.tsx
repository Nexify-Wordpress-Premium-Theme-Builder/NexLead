import type { AuditReport } from "@/features/reports/report.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";

type ReportContextCardProps = {
  report: AuditReport;
};

export function ReportContextCard({ report }: ReportContextCardProps) {
  const { website, lead } = report;

  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Bağlam</h2>

      <div className="mt-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Web Sitesi</h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-text-muted">URL</dt>
              <dd className="mt-0.5 break-all text-text-primary">{website.url}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Domain</dt>
              <dd className="mt-0.5 break-words text-text-primary">{website.domain}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Durum</dt>
              <dd className="mt-1">
                <WebsiteStatusBadge status={website.status} />
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Son analiz</dt>
              <dd className="mt-0.5 text-text-primary">
                {formatWebsiteDate(website.last_audited_at)}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Oluşturulma</dt>
              <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(website.created_at)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-primary">Lead</h3>
          {lead ? (
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-text-muted">Şirket</dt>
                <dd className="mt-0.5 text-text-primary">{lead.companyName}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Domain</dt>
                <dd className="mt-0.5 break-words text-text-primary">
                  {lead.normalizedDomain ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">İletişim adı</dt>
                <dd className="mt-0.5 text-text-primary">{lead.contactName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">E-posta</dt>
                <dd className="mt-0.5 break-all text-text-primary">{lead.contactEmail ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Telefon</dt>
                <dd className="mt-0.5 text-text-primary">{lead.contactPhone ?? "—"}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">
              Bu rapor herhangi bir lead kaydına bağlı değil.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
