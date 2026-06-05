import type { OutreachCampaign, OutreachMessage } from "@shared/types/outreach";
import type { OutreachCampaignCard, PageKpi } from "@/types/pages";

export const mockOutreachMessages: OutreachMessage[] = [
  {
    id: "msg-1",
    leadId: "1",
    subject: "Quick website opportunity for TechNova Solutions",
    body: "Hi John,\n\nI reviewed TechNova's website and noticed a few conversion opportunities around mobile speed, CTA placement, and tracking setup.\n\nThese are small but important fixes that could improve lead quality and campaign performance.\n\nWould you like me to send over a short audit summary?",
    status: "draft",
    createdAt: "2026-05-27T16:00:00.000Z",
  },
];

export const mockOutreachCampaigns: OutreachCampaign[] = [
  {
    id: "camp-1",
    name: "Website Audit Offer",
    leadCount: 184,
    replyRate: 23,
    status: "active",
  },
  {
    id: "camp-2",
    name: "SEO Opportunity Outreach",
    leadCount: 96,
    replyRate: 19,
    status: "paused",
  },
];

export const mockOutreachKpis: PageKpi[] = [
  { id: "drafts", label: "Drafts", numericValue: 246, accent: "blue" },
  { id: "sent", label: "Sent", numericValue: 1014, accent: "purple" },
  { id: "replies", label: "Replies", numericValue: 186, accent: "green" },
  { id: "reply-rate", label: "Reply Rate", numericValue: 183, suffix: "%", decimals: 1, accent: "orange" },
];

export const mockOutreachCampaignCards: OutreachCampaignCard[] = [
  {
    id: "c1",
    name: "Website Audit Offer",
    leads: 184,
    replies: 42,
    status: "active",
  },
  {
    id: "c2",
    name: "SEO Opportunity Outreach",
    leads: 96,
    replies: 18,
    status: "draft",
  },
  {
    id: "c3",
    name: "Tracking Setup Campaign",
    leads: 72,
    replies: 11,
    status: "active",
  },
];

export const mockMessagePreview = {
  subject: "Quick website opportunity for TechNova Solutions",
  body: `Hi John,

I reviewed TechNova's website and noticed a few conversion opportunities around mobile speed, CTA placement, and tracking setup.

These are small but important fixes that could improve lead quality and campaign performance.

Would you like me to send over a short audit summary?`,
  personalizationScore: 87,
  tones: ["Professional", "Friendly", "Direct"],
  ctaStyles: ["Soft ask", "Direct CTA", "Value-first"],
};
