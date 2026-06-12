import Link from "next/link";

import { IconChevronRight } from "@/components/ui/icons";
import type { DashboardLeadTableRow } from "@/features/dashboard/dashboard.types";

type PotentialLeadsTableProps = {
  rows: DashboardLeadTableRow[];
};

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-xs text-text-muted">—</span>;
  }

  const tone =
    score >= 80 ? "bg-success/10 text-success" : score >= 60 ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning";

  return (
    <span className={`inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-semibold tabular-nums ${tone}`}>
      {score}
    </span>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-surface-soft px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
      {label}
    </span>
  );
}

export function PotentialLeadsTable({ rows }: PotentialLeadsTableProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="dashboard-section-title">Potansiyel Müşteri Listesi</h2>
          <p className="mt-0.5 text-[12px] font-medium text-text-secondary">Son eklenen ve takip edilen leadler</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {rows.length} lead
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-text-muted">
              <th className="px-4 py-2.5 font-medium sm:px-5">Şirket Adı</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Website</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Sektör</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Skor</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Durum</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Sonraki Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className="dashboard-table-row border-b border-border/70 transition-colors last:border-b-0 hover:bg-surface-soft/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
                      {row.companyName.slice(0, 1).toUpperCase()}
                    </span>
                    {row.href ? (
                      <Link href={row.href} className="font-medium text-text-primary hover:text-accent">
                        {row.companyName}
                      </Link>
                    ) : (
                      <span className="font-medium text-text-primary">{row.companyName}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-accent sm:px-5">{row.website}</td>
                <td className="px-4 py-3 text-text-secondary sm:px-5">{row.sector}</td>
                <td className="px-4 py-3 sm:px-5">
                  <ScorePill score={row.score} />
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <StatusBadge label={row.statusLabel} />
                </td>
                <td className="px-4 py-3 text-text-secondary sm:px-5">{row.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-4 py-3 sm:px-5">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          Tüm Leadleri Gör
          <IconChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
