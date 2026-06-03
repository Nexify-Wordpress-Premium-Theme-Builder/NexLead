import { mockOutreachCampaigns, mockOutreachMessages } from "@/data/mock-outreach";
import type { OutreachCampaign, OutreachMessage } from "@shared/types/outreach";

export const outreachClient = {
  getMessages: async (): Promise<OutreachMessage[]> => mockOutreachMessages,
  getCampaigns: async (): Promise<OutreachCampaign[]> => mockOutreachCampaigns,
};
