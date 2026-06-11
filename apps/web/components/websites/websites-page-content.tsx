"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { WebsiteEmptyState } from "@/components/websites/website-empty-state";
import { WebsiteForm } from "@/components/websites/website-form";
import { WebsitesTable } from "@/components/websites/websites-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { LeadOption, WebsiteWithRelations } from "@/features/websites/website.types";
import { createWebsiteFromLeadAction } from "@/features/websites/website.actions";

type WebsitesPageContentProps = {
  websites: WebsiteWithRelations[];
  leads: LeadOption[];
  initialLeadId?: string;
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; website: WebsiteWithRelations };

export function WebsitesPageContent({ websites, leads, initialLeadId }: WebsitesPageContentProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [createLeadId, setCreateLeadId] = useState(initialLeadId ?? "");
  const [quickLeadId, setQuickLeadId] = useState("");
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
    <div className="animate-fade-up mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">
            Web Site Analizleri
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
            Lead&apos;lere bağlı web sitelerini yönetin ve analiz isteklerini başlatın.
          </p>
        </div>
        <Button type="button" onClick={() => setModal({ type: "create" })}>
          Yeni Web Site Ekle
        </Button>
      </div>

      {leads.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
          <p className="text-sm font-medium text-text-primary">Lead domaininden hızlı oluştur</p>
          <p className="mt-1 text-sm text-text-secondary">
            Bir lead seçerek domain bilgisinden web sitesi kaydı oluşturabilirsiniz.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 space-y-2">
              <span className="text-sm font-medium text-text-primary">Bağlı lead</span>
              <select
                value={quickLeadId}
                onChange={(event) => setQuickLeadId(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
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
            <Button
              type="button"
              variant="secondary"
              loading={quickPending}
              onClick={handleQuickCreateFromLead}
            >
              Lead domaininden doldur
            </Button>
          </div>
          {quickMessage ? (
            <p className="mt-3 text-sm text-text-secondary">{quickMessage}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        {websites.length === 0 ? (
          <WebsiteEmptyState onCreate={() => setModal({ type: "create" })} />
        ) : (
          <WebsitesTable
            websites={websites}
            onEdit={(website) => setModal({ type: "edit", website })}
            onActionComplete={handleActionComplete}
          />
        )}
      </div>

      <Modal
        open={modal.type === "create"}
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
        title="Web Site Düzenle"
        description="Web sitesi bilgilerini güncelleyin."
        onClose={closeModal}
      >
        {modal.type === "edit" ? (
          <WebsiteForm
            mode="edit"
            website={modal.website}
            leads={leads}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>
    </div>
  );
}
