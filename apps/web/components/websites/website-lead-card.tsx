import Link from "next/link";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import type { WebsiteDetail } from "@/features/websites/website.types";

type WebsiteLeadCardProps = {
  linkedLead: WebsiteDetail["linkedLead"];
};

export function WebsiteLeadCard({ linkedLead }: WebsiteLeadCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Bağlı Lead</h2>

      {linkedLead ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-text-muted">Şirket adı</p>
            <p className="mt-1 font-medium text-text-primary">{linkedLead.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Domain</p>
            <p className="mt-1 text-sm text-text-primary">
              {linkedLead.normalizedDomain ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Lead durumu</p>
            <div className="mt-1">
              <LeadStatusBadge status={linkedLead.status} />
            </div>
          </div>
          <Link
            href={`/dashboard/leads/${linkedLead.id}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
          >
            Lead detayına git
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">
          Bu web sitesi herhangi bir lead&apos;e bağlı değil.
        </p>
      )}
    </section>
  );
}
