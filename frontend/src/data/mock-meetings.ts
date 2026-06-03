import type { Meeting, MeetingBrief } from "@shared/types/meeting";

export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    leadId: "lead-3",
    title: "Discovery Call",
    scheduledAt: "2026-06-05T15:00:00.000Z",
    attendeeName: "Jordan Lee",
    attendeeEmail: "jordan@brightpath.io",
    notes: "BrightPath is evaluating website redesign vendors.",
  },
];

export const mockMeetingBriefs: MeetingBrief[] = [
  {
    meetingId: "meeting-1",
    summary: "BrightPath is evaluating website redesign vendors.",
    talkingPoints: [
      "Highlight audit findings on mobile performance",
      "Share similar agency case study",
    ],
    risks: ["Budget approval pending until Q3"],
  },
];
