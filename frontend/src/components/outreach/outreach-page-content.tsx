"use client";

import { mockMessagePreview, mockOutreachCampaignCards, mockOutreachKpis } from "@/data/mock-outreach";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { Badge } from "@/components/ui/badge";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

const statusVariant = {
  active: "success",
  draft: "warning",
  paused: "default",
} as const;

export function OutreachPageContent() {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockOutreachKpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={cn(panelClass("p-6 xl:col-span-2"), "animate-fade-up animation-delay-300")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Campaigns</h3>
          <div className="space-y-3">
            {mockOutreachCampaignCards.map((campaign, index) => (
              <div
                key={campaign.id}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface-muted/40 px-4 py-3.5 transition-all duration-200 hover:border-border hover:bg-surface",
                  "animate-fade-up-row",
                  ["animation-delay-150", "animation-delay-200", "animation-delay-250"][index],
                )}
              >
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">{campaign.name}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {campaign.leads} leads · {campaign.replies} replies
                  </p>
                </div>
                <Badge variant={statusVariant[campaign.status]}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Message Preview</h3>
          <div className="rounded-xl border border-border-soft bg-surface-muted/30 p-4">
            <p className="text-[13px] font-semibold text-text-primary">
              Subject: {mockMessagePreview.subject}
            </p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-text-secondary">
              {mockMessagePreview.body}
            </pre>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-secondary">Personalization score</span>
              <span className="font-bold text-green">{mockMessagePreview.personalizationScore}%</span>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-text-muted">Tone</p>
              <div className="flex flex-wrap gap-1.5">
                {mockMessagePreview.tones.map((tone, i) => (
                  <span
                    key={tone}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      i === 0
                        ? "bg-primary-soft text-primary"
                        : "border border-border-soft text-text-secondary",
                    )}
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-text-muted">CTA style</p>
              <div className="flex flex-wrap gap-1.5">
                {mockMessagePreview.ctaStyles.map((cta, i) => (
                  <span
                    key={cta}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      i === 0
                        ? "bg-primary-soft text-primary"
                        : "border border-border-soft text-text-secondary",
                    )}
                  >
                    {cta}
                  </span>
                ))}
              </div>
            </div>
            <button type="button" className="btn-campaign w-full">
              Send Test
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
