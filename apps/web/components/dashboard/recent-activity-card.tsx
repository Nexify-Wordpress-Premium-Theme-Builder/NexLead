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
  compact?: boolean;
};

export function RecentActivityCard({ items, compact = false }: RecentActivityCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className={`flex items-center justify-between gap-3 border-b border-border ${compact ? "px-4 py-3" : "px-5 py-4"}`}>
        <div>
          <h2 className={`font-semibold text-text-primary ${compact ? "text-sm" : "text-base"}`}>
            Son Aktiviteler
          </h2>
          {!compact ? (
            <p className="mt-0.5 text-sm text-text-muted">Lead, web sitesi ve analiz hareketleri</p>
          ) : null}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <IconActivity className="h-4 w-4" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`text-center ${compact ? "px-4 py-6" : "px-5 py-10"}`}>
          <p className="text-sm font-medium text-text-primary">Henüz aktivite bulunmuyor.</p>
          {!compact ? (
            <p className="mt-2 text-sm text-text-secondary">
              Yeni kayıtlar oluştukça burada listelenecek.
            </p>
          ) : null}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.slice(0, compact ? 4 : undefined).map((item) => {
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {TYPE_LABELS[item.type]}
                    </span>
                    <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{item.subtitle}</p>
                  <p className="mt-1.5 text-[11px] text-text-muted">{formatWebsiteDate(item.createdAt)}</p>
                </div>
                {item.href ? <IconChevronRight className="h-4 w-4 shrink-0 text-text-muted" /> : null}
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 transition-colors hover:bg-surface-soft/60 ${compact ? "px-4 py-3" : "px-5 py-4"}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={`flex items-center gap-3 ${compact ? "px-4 py-3" : "px-5 py-4"}`}>
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
