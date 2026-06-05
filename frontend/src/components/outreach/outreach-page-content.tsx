"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Plus, Save, Send } from "lucide-react";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { mockMessagePreview } from "@/data/mock-outreach";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";

const statusVariant = {
  active: "success",
  draft: "warning",
  paused: "default",
  completed: "default",
} as const;

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function OutreachPageContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const {
    campaigns,
    leads,
    addCampaign,
    updateLeadStatus,
    updateLeadDetail,
    getLeadDetail,
    addActivity,
  } = useDemoData();

  const queryLeadId = searchParams.get("leadId");
  const initialLeadId = queryLeadId && leads.some((lead) => lead.id === queryLeadId) ? queryLeadId : leads[0]?.id;

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id ?? "");
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [tone, setTone] = useState(mockMessagePreview.tones[0]);
  const [ctaStyle, setCtaStyle] = useState(mockMessagePreview.ctaStyles[0]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [message, setMessage] = useState({
    subject: mockMessagePreview.subject,
    body: mockMessagePreview.body,
  });

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId);
  const selectedLeadDetail = selectedLeadId ? getLeadDetail(selectedLeadId) : undefined;

  useEffect(() => {
    if (!selectedLeadDetail) return;
    setMessage({
      subject: selectedLeadDetail.outreachSubject || mockMessagePreview.subject,
      body: selectedLeadDetail.outreachBody || mockMessagePreview.body,
    });
  }, [selectedLeadDetail]);

  const kpis = useMemo(
    () => [
      {
        id: "drafts",
        label: "Draft Campaigns",
        numericValue: campaigns.filter((campaign) => campaign.status === "draft").length,
        accent: "blue" as const,
      },
      {
        id: "active",
        label: "Active Campaigns",
        numericValue: campaigns.filter((campaign) => campaign.status === "active").length,
        accent: "purple" as const,
      },
      {
        id: "leads",
        label: "Leads in Outreach",
        numericValue: campaigns.reduce((total, campaign) => total + campaign.leadCount, 0),
        accent: "green" as const,
      },
      {
        id: "reply-rate",
        label: "Avg Reply Rate",
        numericValue: campaigns.length
          ? Math.round(campaigns.reduce((total, campaign) => total + campaign.replyRate, 0) / campaigns.length)
          : 0,
        suffix: "%",
        accent: "orange" as const,
      },
    ],
    [campaigns],
  );

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast.warning("Campaign name required", "Enter a campaign name to continue.");
      return;
    }

    setIsCreatingCampaign(true);
    await wait(getRandomDelay());
    const campaign = addCampaign({
      name: newCampaignName.trim(),
      leadCount: Math.max(1, Math.round((selectedLead ? selectedLead.opportunityScore : 70) / 2)),
      replyRate: 15,
      status: "draft",
    });
    setSelectedCampaignId(campaign.id);
    setIsCreatingCampaign(false);
    setIsModalOpen(false);
    setNewCampaignName("");
    toast.success("Campaign created", `${campaign.name} has been added.`);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${message.subject}\n\n${message.body}`);
      toast.success("Copied", "Message copied to clipboard.");
    } catch {
      toast.error("Copy failed", "Clipboard access is unavailable.");
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedLeadId) return;
    setIsSavingDraft(true);
    await wait(getRandomDelay());
    updateLeadDetail(selectedLeadId, {
      outreachSubject: message.subject,
      outreachBody: message.body,
      outreachStatus: "Draft",
      nextAction: "Send",
    });
    updateLeadStatus(selectedLeadId, "message_ready");
    addActivity({
      type: "outreach",
      message: `Draft saved for ${selectedLead?.companyName ?? "lead"}`,
    });
    setIsSavingDraft(false);
    toast.success("Draft saved", "Outreach draft is ready to send.");
  };

  const handleSend = async () => {
    if (!selectedLeadId) {
      toast.warning("Lead selection required", "Select a lead before sending outreach.");
      return;
    }

    setIsSending(true);
    await wait(getRandomDelay());
    updateLeadStatus(selectedLeadId, "sent");
    updateLeadDetail(selectedLeadId, {
      outreachSubject: message.subject,
      outreachBody: message.body,
      outreachStatus: "Sent",
      nextAction: "Follow Up",
    });
    addActivity({
      type: "outreach",
      message: `Outreach sent to ${selectedLead?.companyName ?? "selected lead"}`,
    });
    setIsSending(false);
    toast.success("Message sent", "Outreach has been sent successfully.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Outreach"
        description="Generate, personalize, and track lead-specific outreach messages."
        action={
          <button
            type="button"
            className="btn-campaign inline-flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            suffix={kpi.suffix}
            accent={kpi.accent}
            className={`animation-delay-${(index + 1) * 100}`}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={cn(panelClass("p-6 xl:col-span-2"), "animate-fade-up animation-delay-300")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">Campaigns</h3>
            <button
              type="button"
              className="btn-campaign inline-flex h-10 items-center gap-2 px-4"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Campaign</label>
              <Select
                value={selectedCampaignId}
                onChange={(event) => setSelectedCampaignId(event.target.value)}
                options={campaigns.map((campaign) => ({ label: campaign.name, value: campaign.id }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Lead</label>
              <Select
                value={selectedLeadId}
                onChange={(event) => setSelectedLeadId(event.target.value)}
                options={leads.map((lead) => ({ label: lead.companyName, value: lead.id }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            {campaigns.map((campaign, index) => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => setSelectedCampaignId(campaign.id)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                  selectedCampaignId === campaign.id
                    ? "border-primary/20 bg-primary-soft/60"
                    : "border-border-soft bg-surface-muted/40 hover:border-border hover:bg-surface",
                  index < 3 ? `animation-delay-${(index + 2) * 100}` : "animation-delay-300",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-text-primary">{campaign.name}</p>
                  <Badge variant={statusVariant[campaign.status]}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {campaign.leadCount} leads · {campaign.replyRate}% reply rate
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Message Composer</h3>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Subject</label>
              <Input
                value={message.subject}
                onChange={(event) => setMessage((current) => ({ ...current, subject: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Message</label>
              <Textarea
                value={message.body}
                onChange={(event) => setMessage((current) => ({ ...current, body: event.target.value }))}
                className="min-h-[180px]"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Tone</label>
                <Select
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  options={mockMessagePreview.tones.map((item) => ({ label: item, value: item }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">CTA Style</label>
                <Select
                  value={ctaStyle}
                  onChange={(event) => setCtaStyle(event.target.value)}
                  options={mockMessagePreview.ctaStyles.map((item) => ({ label: item, value: item }))}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="btn-campaign inline-flex h-10 w-full items-center justify-center gap-2 px-4 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSend}
              disabled={isSending}
            >
              <Send className="h-4 w-4" />
              <LoadingButtonState isLoading={isSending} loadingText="Sending...">
                Send Message
              </LoadingButtonState>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
              >
                <LoadingButtonState isLoading={isSavingDraft} loadingText="Saving...">
                  <span className="inline-flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </span>
                </LoadingButtonState>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                onClick={handleCopyMessage}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={() => (isCreatingCampaign ? undefined : setIsModalOpen(false))}
        title="Create Campaign"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreatingCampaign}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateCampaign}
              disabled={isCreatingCampaign}
              className="btn-campaign inline-flex h-10 items-center justify-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoadingButtonState isLoading={isCreatingCampaign} loadingText="Creating...">
                Create
              </LoadingButtonState>
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Campaign Name</label>
            <Input
              placeholder="Q3 Outreach Push"
              value={newCampaignName}
              onChange={(event) => setNewCampaignName(event.target.value)}
            />
          </div>
          <p className="text-xs text-text-muted">
            The campaign will be created in draft mode and can be sent after reviewing the message.
          </p>
        </div>
      </Modal>
    </div>
  );
}
