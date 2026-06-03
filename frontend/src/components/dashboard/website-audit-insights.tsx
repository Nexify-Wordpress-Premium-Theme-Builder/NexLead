import Link from "next/link";
import { Gauge, MousePointerClick, Search, Smartphone, Timer, Zap } from "lucide-react";
import { mockAuditInsights, mockAverageWebsiteScore } from "@/data/mock-dashboard";
import { ROUTES } from "@/lib/routes";

const insightIcons = {
  seo: Search,
  speed: Timer,
  mobile: Smartphone,
  cta: MousePointerClick,
  tracking: Zap,
} as const;

export function WebsiteAuditInsights() {
  const circumference = 2 * Math.PI * 28;
  const progress = (mockAverageWebsiteScore / 100) * circumference;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Website Audit Insights</h3>
        <Link
          href={ROUTES.app.websiteAudit}
          className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mockAuditInsights.map((tile) => {
          const Icon = insightIcons[tile.id as keyof typeof insightIcons] ?? Search;
          return (
            <div
              key={tile.id}
              className="flex flex-col items-center rounded-xl border border-border bg-slate-50/50 px-3 py-4 text-center transition-all duration-200 hover:border-primary/20 hover:bg-primary-soft/30"
            >
              <Icon className="mb-2 h-5 w-5 text-text-secondary" />
              <span className="text-xs font-medium text-text-primary">{tile.label}</span>
              <span className="mt-1 text-lg font-bold text-red">{tile.issues}</span>
              <span className="text-[11px] text-text-muted">issues</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-primary-soft/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="-rotate-90" width="64" height="64" aria-hidden>
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#2563EB"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
              />
            </svg>
            <Gauge className="absolute h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Average Website Score</p>
            <p className="text-xl font-bold text-text-primary">
              {mockAverageWebsiteScore}
              <span className="text-base font-semibold text-text-muted">/100</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
