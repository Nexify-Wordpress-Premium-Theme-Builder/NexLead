import Link from "next/link";

import { IconChevronRight } from "@/components/ui/icons";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardLeadTableRow } from "@/features/dashboard/dashboard.types";

type PotentialLeadsTableProps = {
  rows: DashboardLeadTableRow[];
};

function ScorePill({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-[#94A3B8]">—</span>;

  const tone =
    score >= 80
      ? "bg-[#16A34A]/10 text-[#16A34A]"
      : score >= 60
        ? "bg-[#2563EB]/10 text-[#2563EB]"
        : "bg-[#F97316]/10 text-[#F97316]";

  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-extrabold tabular-nums ${tone}`}>
      {score}
    </span>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-bold text-[#475569]">
      {label}
    </span>
  );
}

function ActionPill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
      {label}
    </span>
  );
}

export function PotentialLeadsTable({ rows }: PotentialLeadsTableProps) {
  return (
    <PremiumCard padding="panel" hover={false} className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] px-5 py-4">
        <div>
          <h2 className="dashboard-section-title">Potansiyel Müşteri Listesi</h2>
          <p className="dashboard-body mt-1">Son eklenen ve takip edilen leadler</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#2563EB]/10 px-3 py-1 text-[12px] font-extrabold text-[#2563EB]">
          {rows.length} lead
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[rgba(15,23,42,0.06)] text-[12px] font-bold uppercase tracking-wide text-[#94A3B8]">
              <th className="px-5 py-3">Şirket Adı</th>
              <th className="px-5 py-3">Website</th>
              <th className="px-5 py-3">Sektör</th>
              <th className="px-5 py-3">Skor</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Sonraki Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className="dashboard-table-row h-14 border-b border-[rgba(15,23,42,0.04)] transition-colors last:border-b-0 hover:bg-[#F8FAFC]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[13px] font-extrabold text-[#2563EB]">
                      {row.companyName.slice(0, 1).toUpperCase()}
                    </span>
                    {row.href ? (
                      <Link href={row.href} className="text-[14px] font-bold text-[#0F172A] hover:text-[#2563EB]">
                        {row.companyName}
                      </Link>
                    ) : (
                      <span className="text-[14px] font-bold text-[#0F172A]">{row.companyName}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-[#2563EB]">{row.website}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-[#64748B]">{row.sector}</td>
                <td className="px-5 py-3">
                  <ScorePill score={row.score} />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge label={row.statusLabel} />
                </td>
                <td className="px-5 py-3">
                  <ActionPill label={row.nextAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[rgba(15,23,42,0.06)] px-5 py-3.5">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1 text-[14px] font-bold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          Tüm Leadleri Gör
          <IconChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </div>
    </PremiumCard>
  );
}
