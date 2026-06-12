import Link from "next/link";

import { IconActivity, IconChevronRight } from "@/components/ui/icons";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardActivityItem } from "@/features/dashboard/dashboard.types";
import { formatWebsiteDate } from "@/features/websites/website.utils";

const TYPE_COLORS = {
  lead: "bg-[#2563EB]",
  website: "bg-[#7C3AED]",
  audit: "bg-[#16A34A]",
} as const;

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
    <PremiumCard padding="panel" hover={false}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="dashboard-section-title">Son Aktiviteler</h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
          <IconActivity className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="dashboard-body mt-4 text-center">Henüz aktivite bulunmuyor.</p>
      ) : (
        <ul className="mt-4 space-y-0">
          {items.slice(0, compact ? 5 : undefined).map((item, index) => {
            const row = (
              <div className="flex items-start gap-3 py-3">
                <span className="relative mt-1.5 flex flex-col items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${TYPE_COLORS[item.type]}`} />
                  {index < items.length - 1 ? (
                    <span className="absolute top-3 h-full w-px bg-[#E2E8F0]" aria-hidden="true" />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1 border-b border-[rgba(15,23,42,0.05)] pb-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-bold text-[#0F172A]">{item.title}</p>
                    {item.href ? <IconChevronRight className="h-4 w-4 shrink-0 text-[#94A3B8]" /> : null}
                  </div>
                  <p className="mt-0.5 text-[12px] font-medium text-[#64748B]">
                    <span className="font-bold text-[#475569]">{TYPE_LABELS[item.type]}</span>
                    {" · "}
                    {item.subtitle}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#94A3B8]">{formatWebsiteDate(item.createdAt)}</p>
                </div>
              </div>
            );

            return (
              <li key={item.id} className="dashboard-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                {item.href ? (
                  <Link href={item.href} className="block transition-colors hover:bg-[#F8FAFC]/60">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PremiumCard>
  );
}
