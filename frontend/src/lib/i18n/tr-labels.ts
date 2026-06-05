import type { LeadStatus, WebsiteStatus } from "@/types/lead";
import type { PipelineStageId } from "@/types/pipeline";

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Yeni",
  audited: "Analiz Edildi",
  message_ready: "Mesaj Hazır",
  sent: "Gönderildi",
  replied: "Yanıt Geldi",
  meeting: "Görüşme",
  closed: "Kapandı",
};

export const websiteStatusLabels: Record<WebsiteStatus, string> = {
  needs_work: "İyileştirme Gerekli",
  okay: "Orta",
  good: "İyi",
};

export const outreachStatusLabels = {
  draft: "Taslak",
  ready: "Hazır",
  sent: "Gönderildi",
  opened: "Açıldı",
  replied: "Yanıt Geldi",
  failed: "Başarısız",
  active: "Aktif",
  paused: "Duraklatıldı",
  completed: "Tamamlandı",
} as const;

export const severityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
} as const;

export const auditCategoryLabels = {
  seo: "SEO",
  speed: "Hız",
  mobile: "Mobil",
  cta: "CTA",
  tracking: "Takip",
  design: "Tasarım",
} as const;

export const pipelineStageLabels: Record<PipelineStageId, string> = {
  new: "Yeni",
  audited: "Analiz Edildi",
  message_ready: "Mesaj Hazır",
  sent: "Gönderildi",
  replied: "Yanıt Geldi",
  meeting: "Görüşme",
  closed: "Kapandı",
};

export const industryLabels: Record<string, string> = {
  SaaS: "SaaS",
  Consulting: "Danışmanlık",
  Marketing: "Pazarlama",
  Logistics: "Lojistik",
  "HR Services": "İK Hizmetleri",
  Healthcare: "Sağlık",
  "Real Estate": "Gayrimenkul",
  Wellness: "Wellness",
  "B2B Consulting": "B2B Danışmanlık",
  "Design Agency": "Tasarım Ajansı",
  "Legal Services": "Hukuk Hizmetleri",
};

export function formatIndustry(industry: string): string {
  return industryLabels[industry] ?? industry;
}

export function formatPercentTr(value: number, decimals = 1): string {
  return `%${value.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
