import Link from "next/link";

import { IconActivity, IconChevronRight } from "@/components/ui/icons";
import type { DashboardActivityItem } from "@/features/dashboard/dashboard.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

const TYPE_LABELS = {
  lead: "Lead",
  website: "Web Sitesi",
  audit: "Analiz",
} as const;

type RecentActivityCardProps = {
  items: DashboardActivityItem[];
};

export function RecentActivityCard({ items }: RecentActivityCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Son Aktiviteler</h2>
          <p className="mt-0.5 text-sm text-text-muted">Lead, web sitesi ve analiz hareketleri</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <IconActivity className="h-4 w-4" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">Henüz aktivite bulunmuyor.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Yeni kayıtlar oluştukça burada listelenecek.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {TYPE_LABELS[item.type]}
                    </span>
                    <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{item.subtitle}</p>
                  <p className="mt-2 text-xs text-text-muted">{formatWebsiteDate(item.createdAt)}</p>
                </div>
                {item.href ? <IconChevronRight className="h-4 w-4 shrink-0 text-text-muted" /> : null}
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-soft/60"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-5 py-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
