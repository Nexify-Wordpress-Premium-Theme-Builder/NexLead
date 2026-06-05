import type { Meeting } from "@/types/meeting";

export function getUpcomingMeetings(meetings: Meeting[], referenceDate: Date = new Date()): Meeting[] {
  return meetings
    .filter((meeting) => new Date(meeting.scheduledAt).getTime() >= referenceDate.getTime())
    .sort(
      (leftMeeting, rightMeeting) =>
        new Date(leftMeeting.scheduledAt).getTime() - new Date(rightMeeting.scheduledAt).getTime(),
    );
}

export function getPastMeetings(meetings: Meeting[], referenceDate: Date = new Date()): Meeting[] {
  return meetings
    .filter((meeting) => new Date(meeting.scheduledAt).getTime() < referenceDate.getTime())
    .sort(
      (leftMeeting, rightMeeting) =>
        new Date(rightMeeting.scheduledAt).getTime() - new Date(leftMeeting.scheduledAt).getTime(),
    );
}

export function searchMeetings(meetings: Meeting[], query: string): Meeting[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return meetings;

  return meetings.filter((meeting) =>
    [meeting.title, meeting.attendeeName, meeting.attendeeEmail ?? "", meeting.notes ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getMeetingById(meetings: Meeting[], meetingId: string): Meeting | undefined {
  return meetings.find((meeting) => meeting.id === meetingId);
}
