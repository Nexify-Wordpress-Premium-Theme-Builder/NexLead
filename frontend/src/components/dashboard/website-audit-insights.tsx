import Link from "next/link";
import { Gauge, MousePointerClick, Search, Smartphone, Timer, Zap } from "lucide-react";
import { mockAuditInsights, mockAverageWebsiteScore } from "@/data/mock-dashboard";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

const insightIcons = {
  seo: Search,
  speed: Timer,
  mobile: Smartphone,
  cta: MousePointerClick,
  tracking: Zap,
} as const;

export function WebsiteAuditInsights({ className }: { className?: string }) {
  const circumference = 2 * Math.PI * 24;
  const progress = (mockAverageWebsiteScore / 100) * circumference;

  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">Web Sitesi Analiz İçgörüleri</h3>
        <Link href={ROUTES.app.websiteAudit} className="link-section">
          Tümünü gör →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {mockAuditInsights.map((tile) => {
          const Icon = insightIcons[tile.id as keyof typeof insightIcons] ?? Search;
          return (
            <div
              key={tile.id}
              className="flex flex-col items-center rounded-xl border border-border-soft bg-surface-muted/50 px-2.5 py-3 text-center transition-all duration-200 hover:border-border hover:bg-surface"
            >
              <Icon className="mb-1.5 h-4 w-4 text-text-muted" strokeWidth={2} />
              <span className="text-[11px] font-semibold text-text-secondary">{tile.label}</span>
              <span className="mt-0.5 text-lg font-bold text-red">{tile.issues}</span>
              <span className="text-[10px] text-text-muted">sorun</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3.5 rounded-xl border border-border-soft bg-primary-soft/40 px-4 py-3">
        <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
          <svg className="-rotate-90" width="52" height="52" aria-hidden>
            <circle cx="26" cy="26" r="24" fill="none" stroke="#E2E8F0" strokeWidth="4" />
            <circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <Gauge className="absolute h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-secondary">Ortalama Web Sitesi Skoru</p>
          <p className="text-xl font-bold tracking-tight text-text-primary">
            {mockAverageWebsiteScore}
            <span className="text-sm font-semibold text-text-muted">/100</span>
          </p>
        </div>
      </div>
    </div>
  );
}
