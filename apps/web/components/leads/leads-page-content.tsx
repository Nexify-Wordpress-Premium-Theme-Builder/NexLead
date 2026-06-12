"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { LeadEmptyState } from "@/components/leads/lead-empty-state";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadsTable } from "@/components/leads/leads-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
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
  const [search, setSearch] = useState("");

  const closeModal = useCallback(() => setModal({ type: "closed" }), []);

  const handleSuccess = useCallback(() => {
    closeModal();
    router.refresh();
  }, [closeModal, router]);

  const summary = useMemo(() => {
    return {
      total: leads.length,
      qualified: leads.filter((l) => l.status === "qualified").length,
      contacted: leads.filter((l) => ["contacted", "replied", "meeting_scheduled"].includes(l.status)).length,
      newLeads: leads.filter((l) => l.status === "new").length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return leads;
    return leads.filter(
      (lead) =>
        lead.company_name.toLowerCase().includes(query) ||
        (lead.normalizedDomain?.toLowerCase().includes(query) ?? false) ||
        (lead.industry?.toLowerCase().includes(query) ?? false),
    );
  }, [leads, search]);

  return (
    <div className="nx-page space-y-6">
      <PageHeader
        title="Leadler"
        description="Potansiyel müşterilerinizi yönetin, durumlarını takip edin ve web site analizlerine bağlayın."
        actions={
          <Button type="button" onClick={() => setModal({ type: "create" })}>
            Yeni Lead Ekle
          </Button>
        }
      />

      {leads.length > 0 ? (
        <div className="nx-stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Toplam", value: summary.total },
            { label: "Nitelikli", value: summary.qualified },
            { label: "İletişimde", value: summary.contacted },
            { label: "Yeni", value: summary.newLeads },
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
          <label className="block">
            <span className="sr-only">Lead ara</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şirket, domain veya sektör ara..."
              className="nx-input max-w-md"
            />
          </label>
        </Card>
      ) : null}

      <div>
        {leads.length === 0 ? (
          <LeadEmptyState onCreate={() => setModal({ type: "create" })} />
        ) : (
          <LeadsTable leads={filteredLeads} onEdit={(lead) => setModal({ type: "edit", lead })} />
        )}
      </div>

      <Modal open={modal.type === "create"} title="Yeni Lead Ekle" description="Potansiyel müşteri bilgilerini girin." onClose={closeModal}>
        <LeadForm mode="create" onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>

      <Modal open={modal.type === "edit"} title="Lead Düzenle" description="Lead bilgilerini güncelleyin." onClose={closeModal}>
        {modal.type === "edit" ? (
          <LeadForm mode="edit" lead={modal.lead} onSuccess={handleSuccess} onCancel={closeModal} />
        ) : null}
      </Modal>
    </div>
  );
}
