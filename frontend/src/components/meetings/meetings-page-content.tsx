"use client";

import { useMemo, useState } from "react";
import { Copy, Plus, XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { mockMeetingBriefData } from "@/data/mock-meetings";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function MeetingsPageContent() {
  const toast = useToast();
  const { meetings, leads, addMeeting, cancelMeeting, getLeadDetail, addActivity } = useDemoData();

  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? "");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [preparedMeetingIds, setPreparedMeetingIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    leadId: leads[0]?.id ?? "",
    title: "Discovery Call",
    date: "",
    time: "",
    attendeeName: "",
    attendeeEmail: "",
    notes: "",
  });

  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId);
  const selectedLead = leads.find((lead) => lead.id === selectedMeeting?.leadId);
  const selectedLeadDetail = selectedMeeting?.leadId ? getLeadDetail(selectedMeeting.leadId) : undefined;

  const brief = useMemo(
    () => ({
      companySummary: selectedLeadDetail?.company
        ? `${selectedLeadDetail.company} is in ${selectedLeadDetail.industry} with score ${selectedLeadDetail.opportunityScore}/100.`
        : mockMeetingBriefData.companySummary,
      mainIssues:
        selectedLeadDetail?.opportunityReasons.length && selectedLeadDetail.opportunityReasons.length > 0
          ? selectedLeadDetail.opportunityReasons
          : mockMeetingBriefData.mainIssues,
      salesAngle: selectedLeadDetail?.suggestedServices[0]
        ? `Position ${selectedLeadDetail.suggestedServices[0]} as the fastest win before the meeting.`
        : mockMeetingBriefData.salesAngle,
      recommendedOffer: selectedLeadDetail?.suggestedServices.length
        ? selectedLeadDetail.suggestedServices.join(" + ")
        : mockMeetingBriefData.recommendedOffer,
      notes: selectedMeeting?.notes ?? mockMeetingBriefData.notes,
    }),
    [selectedLeadDetail, selectedMeeting?.notes],
  );

  const kpis = useMemo(
    () => [
      { id: "upcoming", label: "Upcoming", numericValue: meetings.length, accent: "blue" as const },
      {
        id: "prepared",
        label: "Prepared Briefs",
        numericValue: preparedMeetingIds.length,
        accent: "green" as const,
      },
      {
        id: "this-week",
        label: "This Week",
        numericValue: meetings.filter((meeting) => {
          const date = new Date(meeting.scheduledAt);
          const now = new Date();
          const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 7;
        }).length,
        accent: "purple" as const,
      },
      {
        id: "conversion-calls",
        label: "Conversion Calls",
        numericValue: meetings.filter((meeting) => meeting.title.toLowerCase().includes("strategy")).length,
        accent: "orange" as const,
      },
    ],
    [meetings, preparedMeetingIds.length],
  );

  const handleScheduleMeeting = async () => {
    if (!form.leadId || !form.date || !form.time || !form.attendeeName.trim()) {
      toast.warning("Missing fields", "Lead, date, time, and attendee name are required.");
      return;
    }

    setIsScheduling(true);
    await wait(getRandomDelay());
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString();

    const meeting = addMeeting({
      leadId: form.leadId,
      title: form.title.trim() || "Discovery Call",
      scheduledAt,
      attendeeName: form.attendeeName.trim(),
      attendeeEmail: form.attendeeEmail.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
    addActivity({
      type: "meeting",
      message: `Meeting scheduled with ${meeting.attendeeName}`,
    });
    setSelectedMeetingId(meeting.id);
    setIsScheduling(false);
    setIsScheduleModalOpen(false);
    setForm({
      leadId: leads[0]?.id ?? "",
      title: "Discovery Call",
      date: "",
      time: "",
      attendeeName: "",
      attendeeEmail: "",
      notes: "",
    });
    toast.success("Meeting scheduled", `${meeting.title} added to calendar.`);
  };

  const handleCopyBrief = async () => {
    const summary = [
      `Meeting Brief`,
      `Lead: ${selectedLead?.companyName ?? "N/A"}`,
      `Summary: ${brief.companySummary}`,
      "",
      "Main issues:",
      ...brief.mainIssues.map((issue) => `- ${issue}`),
      "",
      `Sales angle: ${brief.salesAngle}`,
      `Recommended offer: ${brief.recommendedOffer}`,
      `Notes: ${brief.notes}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Brief copied", "Meeting brief copied to clipboard.");
    } catch {
      toast.error("Copy failed", "Clipboard access is unavailable.");
    }
  };

  const handleMarkPrepared = () => {
    if (!selectedMeetingId) return;
    setPreparedMeetingIds((current) =>
      current.includes(selectedMeetingId)
        ? current.filter((id) => id !== selectedMeetingId)
        : [...current, selectedMeetingId],
    );
    toast.success("Prepared status updated", "Meeting preparation status saved.");
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    setIsCancelling(true);
    await wait(getRandomDelay());
    cancelMeeting(cancelTargetId);
    setPreparedMeetingIds((current) => current.filter((id) => id !== cancelTargetId));
    setIsCancelling(false);
    setCancelTargetId(null);
    toast.success("Meeting cancelled", "Selected meeting has been cancelled.");
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
            className={`animation-delay-${(index + 1) * 100}`}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">Upcoming Meetings</h3>
            <button
              type="button"
              className="btn-campaign inline-flex h-10 items-center gap-2 px-4"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Schedule
            </button>
          </div>

          {meetings.length === 0 ? (
            <EmptyState
              title="No meetings scheduled"
              description="Schedule a meeting to start preparing a brief."
              action={
                <button type="button" className="btn-campaign" onClick={() => setIsScheduleModalOpen(true)}>
                  Schedule Meeting
                </button>
              }
            />
          ) : (
            <ul className="space-y-2">
              {meetings.map((meeting) => {
                const datetime = formatDateTime(meeting.scheduledAt);
                const company = leads.find((lead) => lead.id === meeting.leadId)?.companyName ?? "Unknown";

                return (
                  <li key={meeting.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                        selectedMeetingId === meeting.id
                          ? "border-primary/20 bg-primary-soft/60"
                          : "border-border-soft bg-surface-muted/40 hover:border-border hover:bg-surface",
                      )}
                    >
                      <p className="text-[13px] font-semibold text-text-primary">{company}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {datetime.date} · {datetime.time}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">{meeting.attendeeName}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Meeting Brief</h3>

          {selectedMeeting ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Company Summary</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{brief.companySummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Main Website Issues</p>
                <ul className="mt-1.5 space-y-1">
                  {brief.mainIssues.map((issue) => (
                    <li key={issue} className="text-[13px] text-text-secondary">
                      · {issue}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary-soft/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Best Sales Angle</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{brief.salesAngle}</p>
              </div>
              <div className="rounded-xl border border-green/10 bg-green-soft/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-green">Recommended Offer</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                  {brief.recommendedOffer}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Notes</p>
                <p className="mt-1.5 text-[13px] text-text-secondary">{brief.notes}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                  onClick={handleCopyBrief}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Brief
                </button>
                <button
                  type="button"
                  className="btn-campaign inline-flex h-10 items-center justify-center px-3"
                  onClick={handleMarkPrepared}
                >
                  {preparedMeetingIds.includes(selectedMeeting.id) ? "Prepared" : "Mark Prepared"}
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-red/30 bg-red-soft px-3 text-sm font-semibold text-red transition-colors hover:bg-red-soft/80"
                  onClick={() => setCancelTargetId(selectedMeeting.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Select a meeting"
              description="Choose a meeting from the list to view its preparation brief."
            />
          )}
        </div>
      </section>

      <Modal
        open={isScheduleModalOpen}
        onClose={() => (isScheduling ? undefined : setIsScheduleModalOpen(false))}
        title="Schedule Meeting"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              disabled={isScheduling}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleScheduleMeeting}
              disabled={isScheduling}
              className="btn-campaign inline-flex h-10 items-center justify-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoadingButtonState isLoading={isScheduling} loadingText="Scheduling...">
                Schedule
              </LoadingButtonState>
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Lead</label>
            <Select
              value={form.leadId}
              onChange={(event) => setForm((current) => ({ ...current, leadId: event.target.value }))}
              options={leads.map((lead) => ({ label: lead.companyName, value: lead.id }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Meeting Title</label>
            <Input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Time</label>
              <Input
                type="time"
                value={form.time}
                onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Attendee Name</label>
              <Input
                value={form.attendeeName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, attendeeName: event.target.value }))
                }
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Attendee Email</label>
              <Input
                value={form.attendeeEmail}
                onChange={(event) =>
                  setForm((current) => ({ ...current, attendeeEmail: event.target.value }))
                }
                placeholder="jane@company.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={Boolean(cancelTargetId)}
        title="Cancel meeting?"
        description="This will remove the selected meeting from your calendar."
        confirmLabel="Cancel Meeting"
        cancelLabel="Keep"
        loading={isCancelling}
        destructive
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
}
