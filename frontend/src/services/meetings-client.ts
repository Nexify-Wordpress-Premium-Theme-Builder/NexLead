import { mockMeetingBriefs, mockMeetings } from "@/data/mock-meetings";
import type { Meeting, MeetingBrief } from "@shared/types/meeting";

export const meetingsClient = {
  getMeetings: async (): Promise<Meeting[]> => mockMeetings,
  getMeetingBrief: async (meetingId: string): Promise<MeetingBrief | undefined> =>
    mockMeetingBriefs.find((brief) => brief.meetingId === meetingId),
};
