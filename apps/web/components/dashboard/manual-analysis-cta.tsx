import Link from "next/link";

import { PremiumCard } from "@/components/ui/premium-card";

export function ManualAnalysisCta() {
  return (
    <PremiumCard
      padding="panel"
      className="dashboard-stagger-item mt-6 bg-gradient-to-br from-white to-[#F8FAFF] sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="max-w-2xl">
        <h2 className="dashboard-section-title">Manuel Site Analizi Başlat</h2>
        <p className="dashboard-body mt-2">
          Herhangi bir web sitesini anında analiz edin, skorları görün ve rapor oluşturun.
        </p>
      </div>
      <Link
        href="/dashboard/websites"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-[#1D4ED8]/20 bg-[#2563EB] px-6 text-[14px] font-extrabold text-white transition-colors hover:border-[#1D4ED8]/35 hover:bg-[#1D4ED8] sm:mt-0"
      >
        Analizi Başlat
      </Link>
    </PremiumCard>
  );
}
