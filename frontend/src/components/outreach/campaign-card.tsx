import type { OutreachCampaign } from "@shared/types/outreach";

export function CampaignCard({ campaign }: { campaign: OutreachCampaign }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-text-primary">{campaign.name}</p>
      <p className="text-sm text-text-secondary">{campaign.leadCount} leads</p>
    </div>
  );
}
