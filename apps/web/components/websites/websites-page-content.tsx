"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  AUDIT_LIST_REFRESH_INTERVAL_MS,
  AuditStatusRefresh,
} from "@/components/websites/audit-status-refresh";
import { WebsiteEmptyState } from "@/components/websites/website-empty-state";
import { WebsiteForm } from "@/components/websites/website-form";
import { WebsitesTable } from "@/components/websites/websites-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterPills } from "@/components/ui/filter-pills";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import type { LeadOption, WebsiteWithRelations } from "@/features/websites/website.types";
import { createWebsiteFromLeadAction } from "@/features/websites/website.actions";
import { isAuditInProgress } from "@/features/websites/website.utils";

type WebsitesPageContentProps = {
  websites: WebsiteWithRelations[];
  leads: LeadOption[];
  initialLeadId?: string;
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; website: WebsiteWithRelations };

type AuditStatusFilter = "all" | "running" | "completed" | "none";

export function WebsitesPageContent({ websites, leads, initialLeadId }: WebsitesPageContentProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [createLeadId, setCreateLeadId] = useState(initialLeadId ?? "");
  const [quickLeadId, setQuickLeadId] = useState("");
  const [search, setSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState<AuditStatusFilter>("all");
  const [quickMessage, setQuickMessage] = useState<string | null>(null);
  const [quickPending, startQuickTransition] = useTransition();

  const closeModal = useCallback(() => setModal({ type: "closed" }), []);

  const handleSuccess = useCallback(() => {
    closeModal();
    router.refresh();
  }, [closeModal, router]);

  const handleActionComplete = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (initialLeadId) {
      setCreateLeadId(initialLeadId);
      setModal({ type: "create" });
    }
  }, [initialLeadId]);

  const hasActiveAudit = websites.some((website) =>
    isAuditInProgress(website.latestAudit?.status ?? undefined),
  );

  const summary = useMemo(
    () => ({
      total: websites.length,
      running: websites.filter((w) => isAuditInProgress(w.latestAudit?.status ?? undefined)).length,
      completed: websites.filter((w) => w.latestAudit?.status === "completed").length,
      withLead: websites.filter((w) => w.lead_id).length,
    }),
    [websites],
  );

  const filteredWebsites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return websites.filter((website) => {
      const auditStatus = website.latestAudit?.status ?? null;

      if (auditFilter === "running" && !isAuditInProgress(auditStatus ?? undefined)) return false;
      if (auditFilter === "completed" && auditStatus !== "completed") return false;
      if (auditFilter === "none" && auditStatus !== null) return false;

      if (!query) return true;

      const haystack = [website.url, website.domain, website.leadCompanyName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [websites, search, auditFilter]);

  const handleQuickCreateFromLead = () => {
    if (!quickLeadId) {
      setQuickMessage("Lütfen bir lead seçin.");
      return;
    }

    startQuickTransition(async () => {
      setQuickMessage(null);
      const result = await createWebsiteFromLeadAction(quickLeadId);
      if (result.error) {
        setQuickMessage(result.error);
        return;
      }
      setQuickMessage(result.success ?? "Lead domaininden web sitesi oluşturuldu.");
      setQuickLeadId("");
      router.refresh();
    });
  };

  return (
    <div className="nx-page space-y-6">
      <PageHeader
        title="Web Site Analizleri"
        description="Web sitelerini yönetin, analiz başlatın ve raporlara hızlıca ulaşın."
        actions={
          <Button type="button" onClick={() => setModal({ type: "create" })}>
            Yeni Web Site Ekle
          </Button>
        }
      />

      {websites.length > 0 ? (
        <div className="nx-stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Toplam Site", value: summary.total },
            { label: "Analizde", value: summary.running },
            { label: "Tamamlanan", value: summary.completed },
            { label: "Lead Bağlı", value: summary.withLead },
          ].map((item) => (
            <Card key={item.label} padding="md">
              <p className="nx-stat-label">{item.label}</p>
              <p className="nx-stat-value mt-2">{item.value}</p>
            </Card>
          ))}
        </div>
      ) : null}

      {leads.length > 0 ? (
        <Card padding="md">
          <p className="text-[14px] font-semibold text-text-primary">Lead domaininden hızlı oluştur</p>
          <p className="mt-1 text-[13px] font-medium text-text-muted">
            Bir lead seçerek domain bilgisinden web sitesi kaydı oluşturabilirsiniz.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 space-y-2">
              <span className="text-[14px] font-semibold text-text-primary">Bağlı lead</span>
              <select
                value={quickLeadId}
                onChange={(event) => setQuickLeadId(event.target.value)}
                className="nx-input"
              >
                <option value="">Lead seç</option>
                {leads
                  .filter((lead) => lead.suggestedUrl)
                  .map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.companyName} — {lead.suggestedUrl}
                    </option>
                  ))}
              </select>
            </label>
            <Button type="button" variant="secondary" loading={quickPending} onClick={handleQuickCreateFromLead}>
              Domain&apos;den oluştur
            </Button>
          </div>
          {quickMessage ? <p className="mt-3 text-[13px] font-medium text-text-muted">{quickMessage}</p> : null}
        </Card>
      ) : null}

      {hasActiveAudit ? (
        <AuditStatusRefresh
          isActive={hasActiveAudit}
          intervalMs={AUDIT_LIST_REFRESH_INTERVAL_MS}
          message="Analiz durumları otomatik güncelleniyor"
        />
      ) : null}

      {websites.length > 0 ? (
        <Card padding="md" className="space-y-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Web sitesi veya lead ara..."
            className="nx-input max-w-md"
            aria-label="Web sitesi ara"
          />
          <FilterPills
            value={auditFilter}
            onChange={setAuditFilter}
            ariaLabel="Analiz durumu filtresi"
            options={[
              { value: "all", label: "Tümü" },
              { value: "running", label: "Analizde" },
              { value: "completed", label: "Tamamlandı" },
              { value: "none", label: "Analiz yok" },
            ]}
          />
        </Card>
      ) : null}

      <div>
        {websites.length === 0 ? (
          <WebsiteEmptyState onCreate={() => setModal({ type: "create" })} />
        ) : (
          <WebsitesTable
            websites={filteredWebsites}
            onEdit={(website) => setModal({ type: "edit", website })}
            onActionComplete={handleActionComplete}
          />
        )}
      </div>

      <Modal
        open={modal.type === "create"}
        size="md"
        title="Yeni Web Site Ekle"
        description="Manuel website ekleyin veya bir lead ile ilişkilendirin."
        onClose={closeModal}
      >
        <WebsiteForm
          key={createLeadId || "create"}
          mode="create"
          leads={leads}
          defaultLeadId={createLeadId || undefined}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={modal.type === "edit"}
        size="md"
        title="Web Site Düzenle"
        description="Web sitesi bilgilerini güncelleyin."
        onClose={closeModal}
      >
        {modal.type === "edit" ? (
          <WebsiteForm mode="edit" website={modal.website} leads={leads} onSuccess={handleSuccess} onCancel={closeModal} />
        ) : null}
      </Modal>
    </div>
  );
}
