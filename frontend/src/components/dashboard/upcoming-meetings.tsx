import type { Meeting } from "@shared/types/meeting";

export function UpcomingMeetings({ meetings }: { meetings: Meeting[] }) {
  return (
    <ul className="space-y-2">
      {meetings.map((meeting) => (
        <li key={meeting.id} className="text-sm text-text-primary">
          {meeting.title} — {meeting.attendeeName}
        </li>
      ))}
    </ul>
  );
}
