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
  const circumference = 2 * Math.PI * 26;
  const progress = (mockAverageWebsiteScore / 100) * circumference;

  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Website Audit Insights</h3>
        <Link href={ROUTES.app.websiteAudit} className="link-section">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mockAuditInsights.map((tile) => {
          const Icon = insightIcons[tile.id as keyof typeof insightIcons] ?? Search;
          return (
            <div
              key={tile.id}
              className="flex flex-col items-center rounded-[14px] border border-border-soft bg-surface px-3 py-3.5 text-center transition-all duration-200 hover:border-primary/15 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
            >
              <Icon className="mb-2 h-5 w-5 text-text-secondary" />
              <span className="text-xs font-semibold text-text-primary">{tile.label}</span>
              <span className="mt-1 text-xl font-bold text-red">{tile.issues}</span>
              <span className="text-[11px] text-text-muted">issues</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-[14px] border border-border-soft bg-primary-soft/50 px-4 py-3.5">
        <div className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center">
          <svg className="-rotate-90" width="60" height="60" aria-hidden>
            <circle cx="30" cy="30" r="26" fill="none" stroke="#E2E8F0" strokeWidth="5" />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="#2563EB"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <Gauge className="absolute h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">Average Website Score</p>
          <p className="text-[22px] font-bold tracking-tight text-text-primary">
            {mockAverageWebsiteScore}
            <span className="text-base font-semibold text-text-muted">/100</span>
          </p>
        </div>
      </div>
    </div>
  );
}
