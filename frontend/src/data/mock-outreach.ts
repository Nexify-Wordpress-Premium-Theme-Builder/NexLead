import type { OutreachCampaign, OutreachMessage } from "@shared/types/outreach";
import type { OutreachCampaignCard, PageKpi } from "@/types/pages";

export const mockOutreachMessages: OutreachMessage[] = [
  {
    id: "msg-1",
    leadId: "1",
    subject: "TechNova Solutions için kısa bir web sitesi fırsatı",
    body: "Merhaba John,\n\nTechNova'nın web sitesini inceledim ve mobil hız, CTA yerleşimi ve takip altyapısı tarafında birkaç dönüşüm fırsatı gördüm.\n\nBunlar küçük ama müşteri kalitesini ve kampanya performansını etkileyebilecek önemli iyileştirmeler.\n\nSize kısa bir analiz özeti göndermemi ister misiniz?",
    status: "draft",
    createdAt: "2026-05-27T16:00:00.000Z",
  },
];

export const mockOutreachCampaigns: OutreachCampaign[] = [
  {
    id: "camp-1",
    name: "Web Sitesi Analiz Teklifi",
    leadCount: 184,
    replyRate: 23,
    status: "active",
  },
  {
    id: "camp-2",
    name: "SEO Fırsatı Kampanyası",
    leadCount: 96,
    replyRate: 19,
    status: "paused",
  },
];

export const mockOutreachKpis: PageKpi[] = [
  { id: "drafts", label: "Taslaklar", numericValue: 246, accent: "blue" },
  { id: "sent", label: "Gönderilenler", numericValue: 1014, accent: "purple" },
  { id: "replies", label: "Yanıtlar", numericValue: 186, accent: "green" },
  { id: "reply-rate", label: "Yanıt Oranı", numericValue: 183, suffix: "%", decimals: 1, accent: "orange" },
];

export const mockOutreachCampaignCards: OutreachCampaignCard[] = [
  {
    id: "c1",
    name: "Web Sitesi Analiz Teklifi",
    leads: 184,
    replies: 42,
    status: "active",
  },
  {
    id: "c2",
    name: "SEO Fırsatı Kampanyası",
    leads: 96,
    replies: 18,
    status: "draft",
  },
  {
    id: "c3",
    name: "Takip Altyapısı Kampanyası",
    leads: 72,
    replies: 11,
    status: "active",
  },
];

export const mockMessagePreview = {
  subject: "TechNova Solutions için kısa bir web sitesi fırsatı",
  body: `Merhaba John,

TechNova'nın web sitesini inceledim ve mobil hız, CTA yerleşimi ve takip altyapısı tarafında birkaç dönüşüm fırsatı gördüm.

Bunlar küçük ama müşteri kalitesini ve kampanya performansını etkileyebilecek önemli iyileştirmeler.

Size kısa bir analiz özeti göndermemi ister misiniz?`,
  personalizationScore: 87,
  tones: ["Profesyonel", "Samimi", "Direkt"],
  ctaStyles: ["Görüşme planla", "Analiz gönder", "E-postaya yanıt iste"],
};
