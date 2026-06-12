import Link from "next/link";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import type { WebsiteWithRelations } from "@/features/websites/website.types";
import { formatLastAuditAt } from "@/features/websites/website.utils";

type LeadWebsitesCardProps = {
  websites: WebsiteWithRelations[];
};

export function LeadWebsitesCard({ websites }: LeadWebsitesCardProps) {
  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Bağlı Web Siteleri</h2>

      {websites.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">
          Bu lead&apos;e bağlı web sitesi bulunmuyor.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {websites.map((website) => {
            const displayUrl = website.url ?? website.domain ?? "—";

            return (
              <li key={website.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">{displayUrl}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <WebsiteStatusBadge status={website.status} />
                    <AuditStatusBadge status={website.latestAudit?.status ?? null} />
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    Son analiz: {formatLastAuditAt(website)}
                  </p>
                </div>
                <Link
                  href={`/dashboard/websites/${website.id}`}
                  className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
                >
                  Detaya git
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
