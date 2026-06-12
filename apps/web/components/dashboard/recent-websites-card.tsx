import Link from "next/link";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import { IconChevronRight } from "@/components/ui/icons";
import type { DashboardRecentWebsite } from "@/features/dashboard/dashboard.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

type RecentWebsitesCardProps = {
  websites: DashboardRecentWebsite[];
};

export function RecentWebsitesCard({ websites }: RecentWebsitesCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Son Web Siteleri</h2>
          <p className="mt-0.5 text-sm text-text-muted">Takip edilen siteler</p>
        </div>
        <Link
          href="/dashboard/websites"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Tümü
          <IconChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">Henüz web sitesi eklenmedi.</p>
          <p className="mt-2 text-sm text-text-secondary">
            İlk web sitenizi ekleyerek analiz sürecini başlatın.
          </p>
          <Link
            href="/dashboard/websites"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
          >
            Web Site Ekle
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {websites.map((website) => (
            <li key={website.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{website.label}</p>
                  <p className="mt-1 truncate text-sm text-text-secondary">
                    {website.leadCompanyName ?? "Bağlı lead yok"}
                  </p>
                </div>
                <WebsiteStatusBadge status={website.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <AuditStatusBadge status={website.latestAuditStatus} />
                <span className="text-xs text-text-muted">{formatWebsiteDate(website.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
