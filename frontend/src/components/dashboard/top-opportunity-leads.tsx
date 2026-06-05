"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Pencil, Phone } from "lucide-react";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { formatIndustry, leadStatusLabels, websiteStatusLabels } from "@/lib/i18n/tr-labels";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";
import { sortLeadsByOpportunity } from "@/services/demo-leads-service";
import type { Lead } from "@/types/lead";

const companyColors = [
  "bg-primary-soft text-primary",
  "bg-purple-soft text-purple",
  "bg-green-soft text-green",
  "bg-orange-soft text-orange",
  "bg-[#EEF2FF] text-[#4338CA]",
];

const statusStyles: Record<string, string> = {
  new: "bg-orange-soft text-[#B45309]",
  needs_work: "bg-orange-soft text-[#B45309]",
  audited: "bg-primary-soft text-primary",
  message_ready: "bg-purple-soft text-purple",
  sent: "bg-[#EEF2FF] text-[#4338CA]",
  replied: "bg-[#ECFDF5] text-[#15803D]",
  meeting: "bg-green-soft text-green",
  closed: "bg-slate-100 text-slate-600",
  good: "bg-green-soft text-green",
  okay: "bg-[#FFFBEB] text-[#A16207]",
} as const;

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

function ActionIcon({ type }: { type: "send_audit" | "personalize" | "follow_up" }) {
  if (type === "personalize") return <Pencil className="h-3 w-3" />;
  if (type === "follow_up") return <Phone className="h-3 w-3" />;
  return <Mail className="h-3 w-3" />;
}

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function resolveAction(lead: Lead): { label: string; type: "send_audit" | "personalize" | "follow_up" } {
  if (lead.status === "message_ready") {
    return { label: "Kişiselleştir", type: "personalize" };
  }
  if (lead.status === "sent" || lead.status === "replied" || lead.status === "meeting") {
    return { label: "Takip Et", type: "follow_up" };
  }

  return { label: "Analiz Gönder", type: "send_audit" };
}

export function TopOpportunityLeads({ className }: { className?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { leads, updateLeadStatus, addActivity } = useDemoData();
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  const rankedLeads = useMemo(() => sortLeadsByOpportunity(leads).slice(0, 5), [leads]);

  const handleAction = async (lead: Lead) => {
    const action = resolveAction(lead);

    if (action.type === "personalize") {
      toast.info("İletişim düzenleyici açılıyor", `${lead.companyName} mesaj kişiselleştirme için hazır.`);
      router.push(`${ROUTES.app.outreach}?leadId=${lead.id}`);
      return;
    }

    setLoadingLeadId(lead.id);
    await wait(getRandomDelay());

    if (action.type === "send_audit") {
      updateLeadStatus(lead.id, "audited");
      addActivity({
        type: "audit",
        message: `${lead.companyName} için analiz gönderildi`,
      });
      toast.success("Analiz gönderildi", `${lead.companyName} "Analiz Edildi" aşamasına taşındı.`);
    } else {
      addActivity({
        type: "outreach",
        message: `${lead.companyName} için takip planlandı`,
      });
      toast.info("Takip planlandı", `${lead.companyName} için hatırlatma eklendi.`);
    }

    setLoadingLeadId(null);
  };

  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">En Yüksek Fırsatlı Müşteriler</h3>
        <Link href={ROUTES.app.leads} className="link-section">
          Tümünü gör →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft">
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Şirket
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Sektör
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Durum
              </th>
              <th className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Puan
              </th>
              <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Sonraki Aksiyon
              </th>
            </tr>
          </thead>
          <tbody>
            {rankedLeads.map((lead, index) => {
              const action = resolveAction(lead);
              const statusKey = lead.status === "new" ? lead.websiteStatus : lead.status;
              const statusLabel =
                lead.status === "new"
                  ? websiteStatusLabels[lead.websiteStatus]
                  : leadStatusLabels[lead.status];
              return (
                <tr
                  key={lead.id}
                  className={cn(
                    "group border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                    "animate-fade-up-row",
                    rowDelays[index],
                  )}
                >
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
                        companyColors[index % companyColors.length],
                      )}
                    >
                      {lead.companyName.charAt(0)}
                    </div>
                    <Link
                      href={ROUTES.app.leadDetail(lead.id)}
                      className="text-[13px] font-semibold text-text-primary transition-colors hover:text-primary"
                    >
                      {lead.companyName}
                    </Link>
                  </div>
                </td>
                <td className="py-3 pr-3 text-[13px] text-text-secondary">{formatIndustry(lead.industry)}</td>
                <td className="py-3 pr-3">
                  <span
                    className={cn(
                      "inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-semibold",
                      statusStyles[statusKey] ?? "bg-slate-100 text-slate-600",
                    )}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td className="py-3 pr-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[11px] font-bold text-green">
                    {lead.opportunityScore}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => handleAction(lead)}
                    disabled={loadingLeadId === lead.id}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors duration-200 group-hover:text-primary-hover"
                  >
                    <ActionIcon type={action.type} />
                    <LoadingButtonState
                      isLoading={loadingLeadId === lead.id}
                      loadingText="İşleniyor..."
                    >
                      {action.label}
                    </LoadingButtonState>
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
