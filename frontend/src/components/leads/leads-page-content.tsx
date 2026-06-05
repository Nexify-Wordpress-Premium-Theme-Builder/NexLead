"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { FilterPills } from "@/components/shared/filter-pills";
import { Badge } from "@/components/ui/badge";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { formatIndustry, leadStatusLabels, websiteStatusLabels } from "@/lib/i18n/tr-labels";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";
import {
  filterLeadsByStatus,
  searchLeads,
  sortLeadsByOpportunity,
} from "@/services/demo-leads-service";
import type { Lead, LeadStatus, WebsiteStatus } from "@/types/lead";
import type { LeadFilterStatus } from "@/services/demo-leads-service";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

const rowDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

const statusVariantByKey = {
  needs_work: "warning",
  okay: "default",
  good: "success",
  audited: "default",
  message_ready: "purple",
  sent: "default",
  replied: "success",
  meeting: "success",
  closed: "default",
} as const;

const filterItems = [
  "Tümü",
  websiteStatusLabels.needs_work,
  leadStatusLabels.audited,
  leadStatusLabels.message_ready,
  leadStatusLabels.sent,
  leadStatusLabels.replied,
  leadStatusLabels.meeting,
] as const;

const filterToStatus: Record<string, LeadFilterStatus> = {
  Tümü: "all",
  [websiteStatusLabels.needs_work]: "needs_work",
  [leadStatusLabels.audited]: "audited",
  [leadStatusLabels.message_ready]: "message_ready",
  [leadStatusLabels.sent]: "sent",
  [leadStatusLabels.replied]: "replied",
  [leadStatusLabels.meeting]: "meeting",
};

const actionLabelsByStatus: Record<LeadStatus, string> = {
  new: "Analiz Gönder",
  audited: "Analiz Gönder",
  message_ready: "Gönder",
  sent: "Takip Et",
  replied: "Takip Et",
  meeting: "Brifi Gör",
  closed: "Arşivle",
};

function getLeadStatusMeta(lead: Lead) {
  if (lead.status === "new") {
    return {
      label: websiteStatusLabels[lead.websiteStatus],
      variant: statusVariantByKey[lead.websiteStatus],
    };
  }

  return {
    label: leadStatusLabels[lead.status],
    variant: statusVariantByKey[lead.status],
  };
}

const nextStatusMap: Partial<Record<LeadStatus, LeadStatus>> = {
  new: "audited",
  audited: "message_ready",
  message_ready: "sent",
  sent: "replied",
  replied: "meeting",
  meeting: "closed",
};

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function LeadsPageContent() {
  const router = useRouter();
  const toast = useToast();
  const { leads, addLead, updateLeadStatus, addActivity } = useDemoData();

  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [actionLoadingLeadId, setActionLoadingLeadId] = useState<string | null>(null);
  const [newLeadForm, setNewLeadForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    location: "",
    opportunityScore: 75,
    websiteStatus: "needs_work" as WebsiteStatus,
  });

  const kpis = useMemo(
    () => [
      { id: "total", label: "Toplam Müşteri", numericValue: leads.length, accent: "blue" as const },
      {
        id: "needs-work",
        label: websiteStatusLabels.needs_work,
        numericValue: leads.filter((lead) => lead.websiteStatus === "needs_work").length,
        accent: "orange" as const,
      },
      {
        id: "message-ready",
        label: leadStatusLabels.message_ready,
        numericValue: leads.filter((lead) => lead.status === "message_ready").length,
        accent: "purple" as const,
      },
      {
        id: "meetings",
        label: "Görüşmeler",
        numericValue: leads.filter((lead) => lead.status === "meeting").length,
        accent: "green" as const,
      },
    ],
    [leads],
  );

  const filteredLeads = useMemo(() => {
    const status = filterToStatus[activeFilter] ?? "all";
    const byStatus = filterLeadsByStatus(leads, status);
    const byQuery = searchLeads(byStatus, searchQuery);
    return sortLeadsByOpportunity(byQuery, sortDirection);
  }, [activeFilter, leads, searchQuery, sortDirection]);

  const handleCreateLead = async () => {
    if (!newLeadForm.companyName.trim() || !newLeadForm.website.trim()) {
      toast.warning("Zorunlu alanlar eksik", "Şirket ve web sitesi alanları zorunludur.");
      return;
    }

    setIsAdding(true);
    await wait(getRandomDelay());

    const lead = addLead({
      companyName: newLeadForm.companyName.trim(),
      website: newLeadForm.website.trim(),
      industry: newLeadForm.industry.trim() || "Genel",
      location: newLeadForm.location.trim() || "Bilinmiyor",
      opportunityScore: Number(newLeadForm.opportunityScore) || 70,
      websiteStatus: newLeadForm.websiteStatus,
    });

    setIsAdding(false);
    setIsAddModalOpen(false);
    setNewLeadForm({
      companyName: "",
      website: "",
      industry: "",
      location: "",
      opportunityScore: 75,
      websiteStatus: "needs_work",
    });

    toast.success("Müşteri eklendi", `${lead.companyName} satış sürecinize eklendi.`);
  };

  const handleAction = async (leadId: string) => {
    const targetLead = leads.find((lead) => lead.id === leadId);
    if (!targetLead) return;

    const actionLabel = actionLabelsByStatus[targetLead.status];

    if (targetLead.status === "meeting") {
      router.push(ROUTES.app.meetings);
      toast.info("Görüşme brifi açılıyor", `${targetLead.companyName} görüşme detayları hazır.`);
      return;
    }

    const nextStatus = nextStatusMap[targetLead.status];
    if (!nextStatus) {
      toast.info("Ek aksiyon yok", `${targetLead.companyName} zaten kapatılmış durumda.`);
      return;
    }

    setActionLoadingLeadId(leadId);
    await wait(getRandomDelay());
    updateLeadStatus(leadId, nextStatus);
    addActivity({
      type: "outreach",
      message: `${targetLead.companyName} için "${actionLabel}" aksiyonu tamamlandı`,
    });
    setActionLoadingLeadId(null);

    toast.success("Müşteri güncellendi", `${targetLead.companyName} "${leadStatusLabels[nextStatus]}" aşamasına taşındı.`);
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            placeholder="Şirket, web sitesi veya sektöre göre ara..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-[240px] flex-1"
          />
          <button
            type="button"
            onClick={() =>
              setSortDirection((current) => (current === "desc" ? "asc" : "desc"))
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
          >
            <ArrowUpDown className="h-4 w-4" />
            Puan {sortDirection === "desc" ? "Yüksek → Düşük" : "Düşük → Yüksek"}
          </button>
          <button
            type="button"
            className="btn-campaign inline-flex h-10 items-center gap-2 px-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Müşteri Ekle
          </button>
        </div>

        <FilterPills
          items={[...filterItems]}
          active={activeFilter}
          onChange={setActiveFilter}
          className="mb-5"
        />

        {filteredLeads.length === 0 ? (
          <EmptyState
            title="Bu filtrelere uyan müşteri yok"
            description="Arama sorgunuzu güncelleyin veya farklı bir durum filtresi seçin."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("Tümü");
                }}
                className="btn-campaign"
              >
                Görünümü Sıfırla
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  {[
                    "Şirket",
                    "Sektör",
                    "Web Sitesi",
                    "Durum",
                    "Fırsat Puanı",
                    "Son Güncelleme",
                    "Sonraki Aksiyon",
                  ].map((col) => (
                    <th
                      key={col}
                      className="pb-2.5 pr-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted last:pr-0"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => {
                  const statusMeta = getLeadStatusMeta(lead);
                  const actionLabel = actionLabelsByStatus[lead.status];
                  return (
                    <tr
                      key={lead.id}
                      className={cn(
                        "group border-b border-border-soft transition-colors duration-200 last:border-0 hover:bg-surface-muted/70",
                        "animate-fade-up-row",
                        rowDelays[index % rowDelays.length],
                      )}
                    >
                      <td className="py-3 pr-3">
                        <Link
                          href={ROUTES.app.leadDetail(lead.id)}
                          className="text-[13px] font-semibold text-text-primary transition-colors group-hover:text-primary"
                        >
                          {lead.companyName}
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-[13px] text-text-secondary">
                        {formatIndustry(lead.industry)}
                      </td>
                      <td className="py-3 pr-3 text-[13px] text-primary">{lead.website}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusMeta.variant ?? "default"}>
                          {statusMeta.label}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-[11px] font-bold text-green">
                          {lead.opportunityScore}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-[13px] text-text-secondary">
                        {new Date(lead.updatedAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors group-hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleAction(lead.id)}
                          disabled={actionLoadingLeadId === lead.id}
                        >
                          <LoadingButtonState
                            isLoading={actionLoadingLeadId === lead.id}
                            loadingText="Güncelleniyor..."
                          >
                            {actionLabel}
                          </LoadingButtonState>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={isAddModalOpen}
        onClose={() => (isAdding ? undefined : setIsAddModalOpen(false))}
        title="Yeni Müşteri Ekle"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isAdding}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleCreateLead}
              className="btn-campaign inline-flex h-10 items-center justify-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isAdding}
            >
              <LoadingButtonState isLoading={isAdding} loadingText="Ekleniyor...">
                Müşteriyi Kaydet
              </LoadingButtonState>
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Şirket</label>
            <Input
              value={newLeadForm.companyName}
              onChange={(event) =>
                setNewLeadForm((current) => ({ ...current, companyName: event.target.value }))
              }
              placeholder="Acme Growth Studio"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Web Sitesi</label>
            <Input
              value={newLeadForm.website}
              onChange={(event) =>
                setNewLeadForm((current) => ({ ...current, website: event.target.value }))
              }
              placeholder="https://acmegrowth.com"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Sektör</label>
              <Input
                value={newLeadForm.industry}
                onChange={(event) =>
                  setNewLeadForm((current) => ({ ...current, industry: event.target.value }))
                }
                placeholder="SaaS"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Konum</label>
              <Input
                value={newLeadForm.location}
                onChange={(event) =>
                  setNewLeadForm((current) => ({ ...current, location: event.target.value }))
                }
                placeholder="İstanbul"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Fırsat Puanı</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={newLeadForm.opportunityScore}
                onChange={(event) =>
                  setNewLeadForm((current) => ({
                    ...current,
                    opportunityScore: Number(event.target.value) || 70,
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Web Sitesi Durumu</label>
              <Select
                value={newLeadForm.websiteStatus}
                onChange={(event) =>
                  setNewLeadForm((current) => ({
                    ...current,
                    websiteStatus: event.target.value as WebsiteStatus,
                  }))
                }
                options={[
                  { label: websiteStatusLabels.needs_work, value: "needs_work" },
                  { label: websiteStatusLabels.okay, value: "okay" },
                  { label: websiteStatusLabels.good, value: "good" },
                ]}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
