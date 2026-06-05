export type MeetingStatus = "scheduled" | "cancelled" | "completed";

export interface Meeting {
  id: string;
  leadId: string;
  title: string;
  scheduledAt: string;
  attendeeName: string;
  attendeeEmail?: string;
  notes?: string;
  status?: MeetingStatus;
}

export interface MeetingBrief {
  meetingId: string;
  summary: string;
  talkingPoints: string[];
  risks: string[];
}

export interface MeetingCreateInput {
  leadId: string;
  title: string;
  scheduledAt: string;
  attendeeName: string;
  attendeeEmail?: string;
  notes?: string;
}
