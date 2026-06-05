import type { Meeting, MeetingBrief } from "@shared/types/meeting";
import type { MeetingBriefData, MeetingListItem, PageKpi } from "@/types/pages";

export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    leadId: "1",
    title: "Discovery Call",
    scheduledAt: "2026-05-20T10:00:00.000Z",
    attendeeName: "John Carter",
    attendeeEmail: "john@technova.io",
    notes: "TechNova evaluating website improvements.",
  },
  {
    id: "meeting-2",
    leadId: "2",
    title: "Strategy Review",
    scheduledAt: "2026-05-21T14:30:00.000Z",
    attendeeName: "Sarah Lin",
    attendeeEmail: "sarah@brightpath.co",
  },
  {
    id: "meeting-3",
    leadId: "3",
    title: "Intro Call",
    scheduledAt: "2026-05-22T11:00:00.000Z",
    attendeeName: "Mike Johnson",
    attendeeEmail: "mike@growthlab.io",
  },
];

export const mockMeetingBriefs: MeetingBrief[] = [
  {
    meetingId: "meeting-1",
    summary: "TechNova is evaluating website conversion improvements.",
    talkingPoints: [
      "Focus on mobile conversion gaps",
      "Highlight missing tracking infrastructure",
    ],
    risks: ["Budget review pending"],
  },
];

export const mockMeetingsKpis: PageKpi[] = [
  { id: "upcoming", label: "Upcoming", numericValue: 8, accent: "blue" },
  { id: "week", label: "This Week", numericValue: 5, accent: "purple" },
  { id: "briefs", label: "Prepared Briefs", numericValue: 6, accent: "green" },
  { id: "calls", label: "Conversion Calls", numericValue: 3, accent: "orange" },
];

export const mockMeetingList: MeetingListItem[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    date: "May 20, 2025",
    time: "10:00 AM",
    assignee: "John Carter",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    date: "May 21, 2025",
    time: "2:30 PM",
    assignee: "Sarah Lin",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    date: "May 22, 2025",
    time: "11:00 AM",
    assignee: "Mike Johnson",
  },
];

export const mockMeetingBriefData: MeetingBriefData = {
  companySummary:
    "TechNova Solutions is a growing SaaS company with conversion gaps on mobile and missing tracking infrastructure.",
  mainIssues: [
    "Slow mobile load time",
    "CTA below the fold",
    "No Meta Pixel detected",
    "Weak above-the-fold clarity",
  ],
  salesAngle:
    "Focus on mobile conversion gaps and missing tracking infrastructure.",
  recommendedOffer:
    "Website conversion audit + landing page improvement package.",
  notes: "Decision maker confirmed. Follow up with audit summary before the call.",
};
