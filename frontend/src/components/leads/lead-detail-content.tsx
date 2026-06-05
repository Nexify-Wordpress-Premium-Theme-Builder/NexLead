import type { LeadDetailProfile } from "@/types/pages";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

const sectionDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
  "animation-delay-350",
] as const;

export function LeadDetailContent({ lead }: { lead: LeadDetailProfile }) {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Fırsat Skoru", value: `${lead.opportunityScore}/100`, accent: "text-green" },
          { label: "Site Durumu", value: lead.websiteStatus, accent: "text-orange" },
          { label: "İletişim Durumu", value: lead.outreachStatus, accent: "text-primary" },
          { label: "Sonraki Aksiyon", value: lead.nextAction, accent: "text-purple" },
        ].map((card, i) => (
          <div
            key={card.label}
            className={cn(
              panelClass("p-5"),
              "animate-fade-up",
              sectionDelays[i],
            )}
          >
            <p className="text-[13px] font-medium text-text-secondary">{card.label}</p>
            <p className={cn("mt-1 text-xl font-bold tracking-tight", card.accent)}>{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-200")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Firma Özeti</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Sektör", lead.industry],
              ["Web Sitesi", lead.website],
              ["Konum", lead.location],
              ["Firma Ölçeği", lead.companySize],
              ["İletişim Durumu", lead.contactStatus],
            ].map(([key, val]) => (
              <div key={key} className="rounded-xl border border-border-soft bg-surface-muted/40 px-3.5 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{key}</dt>
                <dd className="mt-1 text-[13px] font-medium text-text-primary">{val}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-250")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Site Analizi Özeti</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {lead.auditSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border-soft bg-surface-muted/40 px-3 py-2.5 text-center"
              >
                <p className="text-[11px] font-semibold text-text-muted">{item.label}</p>
                <p className="mt-0.5 text-lg font-bold text-red">{item.issues}</p>
                <p className="text-[10px] text-text-muted">sorun</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Fırsat Nedenleri</h3>
          <ul className="space-y-2.5">
            {lead.opportunityReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 rounded-xl border border-border-soft bg-surface-muted/40 px-3.5 py-2.5 text-[13px] text-text-secondary"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Önerilen Hizmetler</h3>
          <div className="flex flex-wrap gap-2">
            {lead.suggestedServices.map((service) => (
              <Badge key={service} variant="default">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">İletişim Mesajı Önizlemesi</h3>
        <div className="rounded-xl border border-border-soft bg-surface-muted/30 p-5">
          <p className="text-[13px] font-semibold text-text-primary">Konu: {lead.outreachSubject}</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-text-secondary">
            {lead.outreachBody}
          </pre>
        </div>
      </div>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-450")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Hareket Geçmişi</h3>
        <ul className="space-y-0">
          {lead.timeline.map((item, index) => (
            <li
              key={item.label}
              className={cn(
                "relative flex gap-4 pb-5 pl-6 last:pb-0",
                "animate-fade-up-row",
                sectionDelays[index % sectionDelays.length],
              )}
            >
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface" />
              {index < lead.timeline.length - 1 && (
                <span className="absolute left-[4px] top-4 h-full w-px bg-border-soft" />
              )}
              <div>
                <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
