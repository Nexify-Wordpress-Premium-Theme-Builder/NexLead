import Link from "next/link";
import { Calendar } from "lucide-react";
import { mockUpcomingMeetings } from "@/data/mock-dashboard";
import { ROUTES } from "@/lib/routes";

export function UpcomingMeetings() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Upcoming Meetings</h3>
        <Link
          href={ROUTES.app.meetings}
          className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          View calendar →
        </Link>
      </div>

      <ul className="space-y-3">
        {mockUpcomingMeetings.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center gap-3 rounded-xl border border-border/80 p-3 transition-all duration-200 hover:bg-slate-50/80"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
              {meeting.company.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">{meeting.company}</p>
              <p className="text-xs text-text-muted">
                {meeting.date} · {meeting.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-text-secondary"
                title={meeting.assignee}
              >
                {meeting.assigneeInitials}
              </div>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-all duration-200 hover:bg-primary-soft hover:text-primary"
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
