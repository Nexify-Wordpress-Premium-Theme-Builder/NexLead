"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { LeadContactCard } from "@/components/leads/lead-contact-card";
import { LeadDetailHeader } from "@/components/leads/lead-detail-header";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadInfoCard } from "@/components/leads/lead-info-card";
import { LeadWebsitesCard } from "@/components/leads/lead-websites-card";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";
import { createWebsiteFromLeadAction } from "@/features/websites/website.actions";
import type { WebsiteWithRelations } from "@/features/websites/website.types";

type LeadDetailPageContentProps = {
  lead: LeadWithPrimaryContact;
  websites: WebsiteWithRelations[];
};

export function LeadDetailPageContent({ lead, websites }: LeadDetailPageContentProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState<string | null>(null);
  const [quickPending, startQuickTransition] = useTransition();

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    router.refresh();
  }, [router]);

  const handleQuickCreateFromDomain = () => {
    startQuickTransition(async () => {
      setQuickMessage(null);
      const result = await createWebsiteFromLeadAction(lead.id);

      if (result.error) {
        setQuickMessage(result.error);
        return;
      }

      setQuickMessage(result.success ?? "Lead domaininden web sitesi oluşturuldu.");
      router.refresh();
    });
  };

  return (
    <div className="animate-fade-up mx-auto max-w-7xl">
      <BackLink href="/dashboard/leads">Leadler&apos;e dön</BackLink>

      <LeadDetailHeader
        lead={lead}
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}>
              Lead Düzenle
            </Button>
            <Link
              href={`/dashboard/websites?leadId=${lead.id}`}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
            >
              Web Site Ekle
            </Link>
            {lead.normalizedDomain ? (
              <Button
                type="button"
                variant="ghost"
                loading={quickPending}
                onClick={handleQuickCreateFromDomain}
              >
                Domain&apos;den oluştur
              </Button>
            ) : null}
          </>
        }
      />

      {quickMessage ? (
        <p className="mt-4 text-sm text-text-secondary">{quickMessage}</p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <LeadInfoCard lead={lead} />
          <LeadContactCard lead={lead} />
        </div>
        <LeadWebsitesCard websites={websites} />
      </div>

      <Modal
        open={editOpen}
        title="Lead Düzenle"
        description="Lead bilgilerini güncelleyin."
        onClose={() => setEditOpen(false)}
      >
        <LeadForm
          mode="edit"
          lead={lead}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
