import type { CampaignStatus, OutreachCampaign, OutreachMessage, OutreachStatus } from "@/types/outreach";

export function filterCampaignsByStatus(
  campaigns: OutreachCampaign[],
  status: CampaignStatus | "all",
): OutreachCampaign[] {
  if (status === "all") return campaigns;
  return campaigns.filter((campaign) => campaign.status === status);
}

export function searchCampaigns(campaigns: OutreachCampaign[], query: string): OutreachCampaign[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return campaigns;

  return campaigns.filter((campaign) => campaign.name.toLowerCase().includes(normalizedQuery));
}

export function filterMessagesByStatus(
  messages: OutreachMessage[],
  status: OutreachStatus | "all",
): OutreachMessage[] {
  if (status === "all") return messages;
  return messages.filter((message) => message.status === status);
}

export function searchMessages(messages: OutreachMessage[], query: string): OutreachMessage[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return messages;

  return messages.filter((message) =>
    [message.subject, message.body].join(" ").toLowerCase().includes(normalizedQuery),
  );
}
