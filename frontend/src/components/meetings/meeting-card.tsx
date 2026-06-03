import type { Meeting } from "@shared/types/meeting";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{meeting.title}</p>
      <p className="text-sm text-text-secondary">{meeting.attendeeName}</p>
    </div>
  );
}
