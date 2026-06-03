import Link from "next/link";
import { Calendar } from "lucide-react";
import { mockUpcomingMeetings } from "@/data/mock-dashboard";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

export function UpcomingMeetings({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("flex h-full flex-col p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Upcoming Meetings</h3>
        <Link href={ROUTES.app.meetings} className="link-section">
          View calendar →
        </Link>
      </div>

      <ul>
        {mockUpcomingMeetings.map((meeting, index) => (
          <li
            key={meeting.id}
            className={cn(
              "flex items-center gap-3 py-3.5 transition-colors duration-200 hover:bg-surface-muted/80",
              index < mockUpcomingMeetings.length - 1 && "border-b border-border-soft",
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-sm font-bold text-primary">
              {meeting.company.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">{meeting.company}</p>
              <p className="text-[13px] text-[#64748B]">
                {meeting.date} · {meeting.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-text-secondary"
                title={meeting.assignee}
              >
                {meeting.assigneeInitials}
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-soft text-text-muted transition-all duration-200 hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                aria-label={`Open calendar for ${meeting.company}`}
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
