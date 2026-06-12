"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { LeadEmptyState } from "@/components/leads/lead-empty-state";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadsTable } from "@/components/leads/leads-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";

type LeadsPageContentProps = {
  leads: LeadWithPrimaryContact[];
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; lead: LeadWithPrimaryContact };

export function LeadsPageContent({ leads }: LeadsPageContentProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ type: "closed" });

  const closeModal = useCallback(() => setModal({ type: "closed" }), []);

  const handleSuccess = useCallback(() => {
    closeModal();
    router.refresh();
  }, [closeModal, router]);

  return (
    <div className="animate-fade-up mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">Leadler</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
            Potansiyel müşterilerinizi çalışma alanınıza göre yönetin.
          </p>
        </div>
        <Button type="button" onClick={() => setModal({ type: "create" })}>
          Yeni Lead Ekle
        </Button>
      </div>

      <div className="mt-8">
        {leads.length === 0 ? (
          <LeadEmptyState onCreate={() => setModal({ type: "create" })} />
        ) : (
          <LeadsTable leads={leads} onEdit={(lead) => setModal({ type: "edit", lead })} />
        )}
      </div>

      <Modal
        open={modal.type === "create"}
        title="Yeni Lead Ekle"
        description="Potansiyel müşteri bilgilerini girin."
        onClose={closeModal}
      >
        <LeadForm mode="create" onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>

      <Modal
        open={modal.type === "edit"}
        title="Lead Düzenle"
        description="Lead bilgilerini güncelleyin."
        onClose={closeModal}
      >
        {modal.type === "edit" ? (
          <LeadForm
            mode="edit"
            lead={modal.lead}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>
    </div>
  );
}
