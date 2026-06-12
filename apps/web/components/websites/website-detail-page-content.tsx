"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { AuditFeedbackBanner } from "@/components/websites/audit-feedback-banner";
import { AuditResultsPanel } from "@/components/websites/audit-results-panel";
import { AuditStatusRefresh } from "@/components/websites/audit-status-refresh";
import { WebsiteAuditHistoryCard } from "@/components/websites/website-audit-history-card";
import { WebsiteDetailHeader } from "@/components/websites/website-detail-header";
import { WebsiteForm } from "@/components/websites/website-form";
import { WebsiteInfoCard } from "@/components/websites/website-info-card";
import { WebsiteLeadCard } from "@/components/websites/website-lead-card";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { WebsiteAuditResult } from "@/features/audits/audit-result.types";
import type { LeadOption, WebsiteDetail } from "@/features/websites/website.types";
import { startWebsiteAuditAction } from "@/features/websites/website.actions";
import { getAuditStartButtonLabel } from "@/features/websites/website.utils";

type WebsiteDetailPageContentProps = {
  website: WebsiteDetail;
  leads: LeadOption[];
  auditResult: WebsiteAuditResult;
};

type AuditFeedback = {
  type: "success" | "error";
  text: string;
};

export function WebsiteDetailPageContent({
  website,
  leads,
  auditResult,
}: WebsiteDetailPageContentProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<AuditFeedback | null>(null);
  const [auditPending, startAuditTransition] = useTransition();

  const latestAuditStatus = website.latestAudit?.status ?? null;
  const auditInProgress = website.isAuditRunning;
  const startButton = getAuditStartButtonLabel(latestAuditStatus, auditPending);

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    router.refresh();
  }, [router]);

  const handleStartAudit = () => {
    if (startButton.disabled) {
      return;
    }

    startAuditTransition(async () => {
      setAuditFeedback(null);
      const result = await startWebsiteAuditAction(website.id);

      if (result.error) {
        setAuditFeedback({ type: "error", text: result.error });
        return;
      }

      setAuditFeedback({
        type: "success",
        text: result.success ?? "Analiz isteği oluşturuldu.",
      });
      router.refresh();
    });
  };

  return (
    <div className="nx-page space-y-6">
      <BackLink href="/dashboard/websites">Web Site Analizleri&apos;ne dön</BackLink>

      <WebsiteDetailHeader
        website={website}
        actions={
          <>
            <Button
              type="button"
              loading={auditPending}
              disabled={startButton.disabled}
              onClick={handleStartAudit}
            >
              {startButton.label}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}>
              Web Site Düzenle
            </Button>
          </>
        }
      />

      <AuditFeedbackBanner status={latestAuditStatus} />

      {auditInProgress ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <AuditStatusRefresh isActive={auditInProgress} />
        </div>
      ) : null}

      {auditFeedback ? (
        <p
          className={`mt-4 text-sm ${
            auditFeedback.type === "error" ? "text-error" : "text-text-secondary"
          }`}
        >
          {auditFeedback.text}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <WebsiteInfoCard website={website} />
          <WebsiteLeadCard linkedLead={website.linkedLead} />
        </div>
        <AuditResultsPanel result={auditResult} />
      </div>

      <div className="mt-6">
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
