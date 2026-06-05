"use client";

import { useState } from "react";
import { mockMeetingBriefData, mockMeetingList, mockMeetingsKpis } from "@/data/mock-meetings";
import { StatKpiCard } from "@/components/shared/stat-kpi-card";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

export function MeetingsPageContent() {
  const [selectedId, setSelectedId] = useState(mockMeetingList[0]?.id ?? "1");

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockMeetingsKpis.map((kpi, index) => (
          <StatKpiCard
            key={kpi.id}
            label={kpi.label}
            numericValue={kpi.numericValue}
            accent={kpi.accent}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-300")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Upcoming Meetings</h3>
          <ul className="space-y-2">
            {mockMeetingList.map((meeting) => (
              <li key={meeting.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(meeting.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                    selectedId === meeting.id
                      ? "border-primary/20 bg-primary-soft/60"
                      : "border-border-soft bg-surface-muted/40 hover:border-border hover:bg-surface",
                  )}
                >
                  <p className="text-[13px] font-semibold text-text-primary">{meeting.company}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {meeting.date} · {meeting.time}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{meeting.assignee}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-400")}>
          <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Meeting Brief</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Company Summary</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                {mockMeetingBriefData.companySummary}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Main Website Issues</p>
              <ul className="mt-1.5 space-y-1">
                {mockMeetingBriefData.mainIssues.map((issue) => (
                  <li key={issue} className="text-[13px] text-text-secondary">
                    · {issue}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary/10 bg-primary-soft/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Best Sales Angle</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                {mockMeetingBriefData.salesAngle}
              </p>
            </div>
            <div className="rounded-xl border border-green/10 bg-green-soft/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green">Recommended Offer</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                {mockMeetingBriefData.recommendedOffer}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Notes</p>
              <p className="mt-1.5 text-[13px] text-text-secondary">{mockMeetingBriefData.notes}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
