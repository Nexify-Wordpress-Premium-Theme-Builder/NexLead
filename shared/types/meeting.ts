export interface Meeting {
  id: string;
  leadId: string;
  title: string;
  scheduledAt: string;
  attendeeName: string;
  attendeeEmail?: string;
  notes?: string;
}

export interface MeetingBrief {
  meetingId: string;
  summary: string;
  talkingPoints: string[];
  risks: string[];
}
