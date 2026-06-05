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
        title="Lead not found"
        description="This lead does not exist in the current demo state."
        action={
          <button type="button" className="btn-campaign" onClick={() => router.push(ROUTES.app.leads)}>
            Back to Leads
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
      message: `Profile updated for ${companyForm.company.trim()}`,
    });
    setIsSavingProfile(false);
    toast.success("Lead profile saved", `${companyForm.company.trim()} details updated.`);
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
      message: `Outreach draft updated for ${companyForm.company}`,
    });
    setIsSavingMessage(false);
    toast.success("Message saved", "Outreach draft updated.");
  };

  const handleCopyMessage = async () => {
    const previewText = `Subject: ${messageForm.outreachSubject}\n\n${messageForm.outreachBody}`;
    try {
      await navigator.clipboard.writeText(previewText);
      toast.success("Copied", "Outreach draft copied to clipboard.");
    } catch {
      toast.error("Copy failed", "Clipboard access is not available.");
    }
  };

  const runLeadAction = async (action: "audit" | "personalize" | "meeting" | "close") => {
    if (action === "personalize") {
      router.push(`${ROUTES.app.outreach}?leadId=${leadId}`);
      toast.info("Opening outreach", `${lead.companyName} personalization view opened.`);
      return;
    }
    if (action === "meeting") {
      router.push(`${ROUTES.app.meetings}?leadId=${leadId}`);
      toast.info("Opening meetings", `${lead.companyName} meeting workflow opened.`);
      return;
    }

    setBusyAction(action);
    await wait(getRandomDelay());

    if (action === "audit") {
      updateLeadStatus(leadId, "audited");
      updateLeadDetail(leadId, { nextAction: "Personalize", outreachStatus: "Draft" });
      addActivity({ type: "audit", message: `Audit sent to ${lead.companyName}` });
      toast.success("Audit sent", `${lead.companyName} moved to audited.`);
    }

    if (action === "close") {
      updateLeadStatus(leadId, "closed");
      updateLeadDetail(leadId, { nextAction: "Archived", outreachStatus: "Closed" });
      addActivity({ type: "lead", message: `${lead.companyName} marked as closed` });
      toast.success("Lead closed", `${lead.companyName} is now archived.`);
    }

    setBusyAction(null);
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Opportunity Score",
            value: `${companyForm.opportunityScore}/100`,
            accent: "text-green",
          },
          { label: "Website Status", value: detail.websiteStatus, accent: "text-orange" },
          { label: "Outreach Status", value: detail.outreachStatus, accent: "text-primary" },
          { label: "Next Action", value: detail.nextAction, accent: "text-purple" },
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
            <LoadingButtonState isLoading={busyAction === "audit"} loadingText="Sending...">
              Send Audit
            </LoadingButtonState>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={() => runLeadAction("personalize")}
          >
            Personalize
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={() => runLeadAction("meeting")}
          >
            Schedule Meeting
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-red/30 bg-red-soft px-4 text-sm font-semibold text-red transition-colors hover:bg-red-soft/80"
            onClick={() => runLeadAction("close")}
            disabled={busyAction === "close"}
          >
            <LoadingButtonState isLoading={busyAction === "close"} loadingText="Closing...">
              Mark Closed
            </LoadingButtonState>
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-350")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Company Overview</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Company</label>
              <Input
                value={companyForm.company}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, company: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Industry</label>
              <Input
                value={companyForm.industry}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, industry: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Website</label>
              <Input
                value={companyForm.website}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, website: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Location</label>
              <Input
                value={companyForm.location}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, location: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Company Size</label>
              <Input
                value={companyForm.companySize}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, companySize: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Contact Status</label>
              <Input
                value={companyForm.contactStatus}
                onChange={(event) =>
                  setCompanyForm((current) => ({ ...current, contactStatus: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Opportunity Score</label>
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
              <LoadingButtonState isLoading={isSavingProfile} loadingText="Saving...">
                Save Profile
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
              Reset
            </button>
          </div>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Website Audit Summary</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {detail.auditSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border-soft bg-surface-muted/40 px-3 py-2.5 text-center"
              >
                <p className="text-[11px] font-semibold text-text-muted">{item.label}</p>
                <p className="mt-0.5 text-lg font-bold text-red">{item.issues}</p>
                <p className="text-[10px] text-text-muted">issues</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Suggested Services
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
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Outreach Message Preview</h3>
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Subject</label>
            <Input
              value={messageForm.outreachSubject}
              onChange={(event) =>
                setMessageForm((current) => ({ ...current, outreachSubject: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Message Body</label>
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
            <LoadingButtonState isLoading={isSavingMessage} loadingText="Saving...">
              Save Message
            </LoadingButtonState>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            onClick={handleCopyMessage}
          >
            Copy Message
          </button>
        </div>
      </div>

      <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-500")}>
        <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Activity Timeline</h3>
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
