"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Textarea } from "@/components/ui/textarea";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { websiteStatusLabels } from "@/lib/i18n/tr-labels";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const detailLabelMap: Record<string, string> = {
  "Not Sent": "Gönderilmedi",
  Draft: "Taslak",
  Sent: "Gönderildi",
  Closed: "Kapandı",
  Personalize: "Kişiselleştir",
  Archived: "Arşivlendi",
  "Send Audit": "Analiz Gönder",
  "Follow Up": "Takip Et",
  "View Brief": "Brifi Gör",
  "Needs Work": websiteStatusLabels.needs_work,
  Okay: websiteStatusLabels.okay,
  Good: websiteStatusLabels.good,
};

function toTrDetailLabel(value: string) {
  return detailLabelMap[value] ?? value;
}

interface LeadDetailPageContentProps {
  leadId: string;
}

export function LeadDetailPageContent({ leadId }: LeadDetailPageContentProps) {
  const router = useRouter();
  const toast = useToast();
  const { leads, getLeadDetail, updateLeadDetail, updateLeadStatus, addActivity } = useDemoData();
  const lead = useMemo(() => leads.find((item) => item.id === leadId), [leadId, leads]);
  const detail = getLeadDetail(leadId);

  const [companyForm, setCompanyForm] = useState({
    company: detail?.company ?? "",
    industry: detail?.industry ?? "",
    website: detail?.website ?? "",
    location: detail?.location ?? "",
    companySize: detail?.companySize ?? "",
    contactStatus: detail?.contactStatus ?? "",
    opportunityScore: detail?.opportunityScore ?? 70,
  });
  const [messageForm, setMessageForm] = useState({
    outreachSubject: detail?.outreachSubject ?? "",
    outreachBody: detail?.outreachBody ?? "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingMessage, setIsSavingMessage] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    if (!detail) return;

    setCompanyForm({
      company: detail.company,
      industry: detail.industry,
      website: detail.website,
      location: detail.location,
      companySize: detail.companySize,
      contactStatus: detail.contactStatus,
      opportunityScore: detail.opportunityScore,
    });
    setMessageForm({
      outreachSubject: detail.outreachSubject,
      outreachBody: detail.outreachBody,
    });
  }, [detail]);

  if (!lead || !detail) {
    return (
      <EmptyState
        title="Müşteri bulunamadı"
        description="Bu müşteri mevcut demo durumunda bulunmuyor."
        action={
          <button type="button" className="btn-campaign" onClick={() => router.push(ROUTES.app.leads)}>
            Müşterilere Dön
          </button>
        }
      />
    );
  }

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    await wait(getRandomDelay());

    updateLeadDetail(leadId, {
      company: companyForm.company.trim(),
      industry: companyForm.industry.trim(),
      website: companyForm.website.trim(),
      location: companyForm.location.trim(),
      companySize: companyForm.companySize.trim(),
      contactStatus: companyForm.contactStatus.trim(),
      opportunityScore: Number(companyForm.opportunityScore) || 70,
    });

    addActivity({
      type: "lead",
      message: `${companyForm.company.trim()} için profil güncellendi`,
    });
    setIsSavingProfile(false);
    toast.success("Müşteri profili kaydedildi", `${companyForm.company.trim()} detayları güncellendi.`);
  };

  const handleSaveMessage = async () => {
    setIsSavingMessage(true);
    await wait(getRandomDelay());
    updateLeadDetail(leadId, {
      outreachSubject: messageForm.outreachSubject,
      outreachBody: messageForm.outreachBody,
    });
    addActivity({
      type: "outreach",
      message: `${companyForm.company} için iletişim taslağı güncellendi`,
    });
    setIsSavingMessage(false);
    toast.success("Mesaj kaydedildi", "İletişim taslağı güncellendi.");
  };

  const handleCopyMessage = async () => {
    const previewText = `Konu: ${messageForm.outreachSubject}\n\n${messageForm.outreachBody}`;
    try {
      await navigator.clipboard.writeText(previewText);
      toast.success("Kopyalandı", "İletişim taslağı panoya kopyalandı.");
    } catch {
      toast.error("Kopyalama başarısız", "Pano erişimi kullanılamıyor.");
    }
  };

  const runLeadAction = async (action: "audit" | "personalize" | "meeting" | "close") => {
    if (action === "personalize") {
      router.push(`${ROUTES.app.outreach}?leadId=${leadId}`);
      toast.info("İletişim açılıyor", `${lead.companyName} kişiselleştirme görünümü açıldı.`);
      return;
    }
    if (action === "meeting") {
      router.push(`${ROUTES.app.meetings}?leadId=${leadId}`);
      toast.info("Görüşmeler açılıyor", `${lead.companyName} görüşme akışı açıldı.`);
      return;
    }

    setBusyAction(action);
    await wait(getRandomDelay());

    if (action === "audit") {
      updateLeadStatus(leadId, "audited");
      updateLeadDetail(leadId, { nextAction: "Kişiselleştir", outreachStatus: "Taslak" });
      addActivity({ type: "audit", message: `${lead.companyName} için analiz gönderildi` });
      toast.success("Analiz gönderildi", `${lead.companyName} analiz edildi aşamasına taşındı.`);
    }

    if (action === "close") {
      updateLeadStatus(leadId, "closed");
      updateLeadDetail(leadId, { nextAction: "Arşivlendi", outreachStatus: "Kapandı" });
      addActivity({ type: "lead", message: `${lead.companyName} kapalı olarak işaretlendi` });
      toast.success("Müşteri kapatıldı", `${lead.companyName} arşive alındı.`);
    }

    setBusyAction(null);
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Fırsat Skoru",
            value: `${companyForm.opportunityScore}/100`,
            accent: "text-green",
          },
          { label: "Site Durumu", value: toTrDetailLabel(detail.websiteStatus), accent: "text-orange" },
          { label: "İletişim Durumu", value: toTrDetailLabel(detail.outreachStatus), accent: "text-primary" },
          { label: "Sonraki Aksiyon", value: toTrDetailLabel(detail.nextAction), accent: "text-purple" },
        ].map((card, index) => (
          <div
            key={card.label}
            className={cn(panelClass("p-5"), "animate-fade-up", `animation-delay-${(index + 1) * 100}`)}
          >
            <p className="text-[13px] font-medium text-text-secondary">{card.label}</p>
            <p className={cn("mt-1 text-xl font-bold tracking-tight", card.accent)}>{card.value}</p>
          </div>
        ))}
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-campaign inline-flex h-10 items-center px-4"
            onClick={() => runLeadAction("audit")}
            disabled={busyAction === "audit"}
          >
            <LoadingButtonState isLoading={busyAction === "audit"} loadingText="Gönderiliyor...">
              Analiz Gönder
            </LoadingButtonState>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={() => runLeadAction("personalize")}
          >
            Kişiselleştir
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={() => runLeadAction("meeting")}
          >
            Görüşme Planla
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-red/30 bg-red-soft px-4 text-sm font-semibold text-red transition-colors hover:bg-red-soft/80"
            onClick={() => runLeadAction("close")}
            disabled={busyAction === "close"}
          >
            <LoadingButtonState isLoading={busyAction === "close"} loadingText="Kapatılıyor...">
              Kapalı Olarak İşaretle
            </LoadingButtonState>
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Şirket Özeti</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Şirket</label>
              <Input
                value={companyForm.company}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, company: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Sektör</label>
              <Input
                value={companyForm.industry}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, industry: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Web Sitesi</label>
              <Input
                value={companyForm.website}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, website: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Konum</label>
              <Input
                value={companyForm.location}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, location: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Şirket Büyüklüğü</label>
              <Input
                value={companyForm.companySize}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, companySize: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">İletişim Durumu</label>
              <Input
                value={companyForm.contactStatus}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, contactStatus: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Fırsat Puanı</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={companyForm.opportunityScore}
                onChange={(event) =>
                  setCompanyForm((current) => ({
                    ...current,
                    opportunityScore: Number(event.target.value) || 70,
                  }))
                }
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-campaign inline-flex h-10 items-center px-4"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              <LoadingButtonState isLoading={isSavingProfile} loadingText="Kaydediliyor...">
                Profili Kaydet
              </LoadingButtonState>
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              onClick={() => {
                setCompanyForm({
                  company: detail.company,
                  industry: detail.industry,
                  website: detail.website,
                  location: detail.location,
                  companySize: detail.companySize,
                  contactStatus: detail.contactStatus,
                  opportunityScore: detail.opportunityScore,
                });
              }}
            >
              Sıfırla
            </button>
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Web Sitesi Analiz Özeti</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {detail.auditSummary.map((item) => (
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

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Önerilen Hizmetler
            </p>
            <div className="flex flex-wrap gap-2">
              {detail.suggestedServices.map((service) => (
                <Badge key={service} variant="default">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-450")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">İletişim Mesajı Önizlemesi</h3>
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Konu</label>
            <Input
              value={messageForm.outreachSubject}
              onChange={(event) =>
                setMessageForm((current) => ({ ...current, outreachSubject: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Mesaj İçeriği</label>
            <Textarea
              value={messageForm.outreachBody}
              onChange={(event) =>
                setMessageForm((current) => ({ ...current, outreachBody: event.target.value }))
              }
              className="min-h-[170px]"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-campaign inline-flex h-10 items-center px-4"
            onClick={handleSaveMessage}
            disabled={isSavingMessage}
          >
            <LoadingButtonState isLoading={isSavingMessage} loadingText="Kaydediliyor...">
              Mesajı Kaydet
            </LoadingButtonState>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={handleCopyMessage}
          >
            Mesajı Kopyala
          </button>
        </div>
      </div>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-500")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Aktivite Zaman Çizelgesi</h3>
        <ul className="space-y-0">
          {detail.timeline.map((item, index) => (
            <li key={`${item.label}-${index}`} className="relative flex gap-4 pb-5 pl-6 last:pb-0">
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface" />
              {index < detail.timeline.length - 1 && (
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
