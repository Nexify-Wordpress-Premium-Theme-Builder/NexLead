import Link from "next/link";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { IconChevronRight } from "@/components/ui/icons";
import type { DashboardRecentLead } from "@/features/dashboard/dashboard.types";
import { formatLeadDate } from "@/features/leads/lead.utils";

type RecentLeadsCardProps = {
  leads: DashboardRecentLead[];
};

export function RecentLeadsCard({ leads }: RecentLeadsCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Son Leadler</h2>
          <p className="mt-0.5 text-sm text-text-muted">En son eklenen kayıtlar</p>
        </div>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Tümü
          <IconChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">Henüz lead eklenmedi.</p>
          <p className="mt-2 text-sm text-text-secondary">
            İlk lead&apos;inizi ekleyerek başlayın.
          </p>
          <Link
            href="/dashboard/leads"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
          >
            Lead Ekle
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {leads.map((lead) => (
            <li key={lead.id} className="flex items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-text-primary">{lead.companyName}</p>
                <p className="mt-1 truncate text-sm text-text-secondary">
                  {lead.normalizedDomain ?? "Domain yok"}
                </p>
                <p className="mt-2 text-xs text-text-muted">{formatLeadDate(lead.createdAt)}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
