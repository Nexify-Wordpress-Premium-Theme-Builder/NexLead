"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { WebsiteAuditHistoryCard } from "@/components/websites/website-audit-history-card";
import { WebsiteDetailHeader } from "@/components/websites/website-detail-header";
import { WebsiteForm } from "@/components/websites/website-form";
import { WebsiteInfoCard } from "@/components/websites/website-info-card";
import { WebsiteLeadCard } from "@/components/websites/website-lead-card";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { LeadOption, WebsiteDetail } from "@/features/websites/website.types";
import { startWebsiteAuditAction } from "@/features/websites/website.actions";

type WebsiteDetailPageContentProps = {
  website: WebsiteDetail;
  leads: LeadOption[];
};

export function WebsiteDetailPageContent({ website, leads }: WebsiteDetailPageContentProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [auditPending, startAuditTransition] = useTransition();

  const auditInProgress = website.isAuditRunning;

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    router.refresh();
  }, [router]);

  const handleStartAudit = () => {
    if (auditInProgress) {
      return;
    }

    startAuditTransition(async () => {
      setAuditMessage(null);
      const result = await startWebsiteAuditAction(website.id);

      if (result.error) {
        setAuditMessage(result.error);
        return;
      }

      setAuditMessage(result.success ?? "Analiz isteği oluşturuldu.");
      router.refresh();
    });
  };

  return (
    <div className="animate-fade-up mx-auto max-w-7xl">
      <BackLink href="/dashboard/websites">Web Site Analizleri&apos;ne dön</BackLink>

      <WebsiteDetailHeader
        website={website}
        actions={
          <>
            <Button
              type="button"
              loading={auditPending}
              disabled={auditInProgress}
              onClick={handleStartAudit}
            >
              {auditInProgress ? "Devam eden analiz var" : "Analiz Başlat"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}>
              Web Site Düzenle
            </Button>
          </>
        }
      />

      {auditMessage ? (
        <p className="mt-4 text-sm text-text-secondary">{auditMessage}</p>
      ) : null}

      {auditInProgress ? (
        <p className="mt-2 text-sm text-text-muted">
          Bu web sitesi için kuyrukta veya çalışan bir analiz isteği bulunuyor.
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <WebsiteInfoCard website={website} />
          <WebsiteLeadCard linkedLead={website.linkedLead} />
        </div>
        <WebsiteAuditHistoryCard audits={website.audits} />
      </div>

      <Modal
        open={editOpen}
        title="Web Site Düzenle"
        description="Web sitesi bilgilerini güncelleyin."
        onClose={() => setEditOpen(false)}
      >
        <WebsiteForm
          mode="edit"
          website={website}
          leads={leads}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
