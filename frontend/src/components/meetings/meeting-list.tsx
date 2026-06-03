import type { Meeting } from "@shared/types/meeting";
import { MeetingCard } from "./meeting-card";

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
