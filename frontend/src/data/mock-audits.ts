import type { WebsiteAudit } from "@shared/types/audit";
import type { AuditIssueItem, PageKpi } from "@/types/pages";

export const mockAudits: WebsiteAudit[] = [
  {
    id: "audit-1",
    leadId: "1",
    websiteUrl: "https://technova.io",
    score: 62,
    createdAt: "2026-05-28T11:00:00.000Z",
    issues: [
      {
        id: "issue-1",
        title: "Meta açıklaması eksik",
        description: "Temel açılış sayfalarında benzersiz meta açıklamaları bulunmuyor.",
        category: "seo",
        severity: "medium",
      },
      {
        id: "issue-2",
        title: "Mobil yükleme süresi yavaş",
        description: "Mobilde Largest Contentful Paint önerilen eşiği aşıyor.",
        category: "speed",
        severity: "high",
      },
    ],
  },
];

export const mockAuditKpis: PageKpi[] = [
  { id: "score", label: "Ortalama Skor", numericValue: 62, suffix: "/100", accent: "blue" },
  { id: "seo", label: "SEO Sorunları", numericValue: 24, accent: "orange" },
  { id: "speed", label: "Hız Sorunları", numericValue: 31, accent: "purple" },
  { id: "mobile", label: "Mobil Sorunları", numericValue: 15, accent: "green" },
  { id: "tracking", label: "Takip Sorunları", numericValue: 12, accent: "blue" },
];

export const mockAuditCategories = [
  "SEO",
  "Hız",
  "Mobil",
  "CTA",
  "Takip",
  "Tasarım",
] as const;

export const mockAuditIssues: AuditIssueItem[] = [
  {
    id: "a1",
    category: "SEO",
    severity: "medium",
    title: "Meta açıklaması eksik",
    explanation: "Birçok kritik sayfada arama görünürlüğü için benzersiz meta açıklaması bulunmuyor.",
    fix: "Tüm ana açılış sayfalarına benzersiz meta açıklamaları ekleyin.",
    impact: "Görünürlük etkisi yüksek",
  },
  {
    id: "a2",
    category: "Hız",
    severity: "high",
    title: "Mobil yükleme süresi yavaş",
    explanation: "Ana sayfada mobil LCP 4 saniyeyi aşıyor.",
    fix: "Hero görsellerini optimize edin ve kritik olmayan scriptleri erteleyin.",
    impact: "Dönüşüm riski",
  },
  {
    id: "a3",
    category: "CTA",
    severity: "high",
    title: "CTA katlanma çizgisinin altında",
    explanation: "Birincil CTA mobilde kaydırmadan görünmüyor.",
    fix: "Birincil CTA'yı daha net kontrastla üst bölüme taşıyın.",
    impact: "Müşteri kazanım etkisi",
  },
  {
    id: "a4",
    category: "Takip",
    severity: "medium",
    title: "Meta Pixel tespit edilmedi",
    explanation: "Kritik sayfalarda dönüşüm takip pikseli bulunamadı.",
    fix: "Meta Pixel kurulumunu yapın ve standart eventleri yapılandırın.",
    impact: "Atıf boşluğu",
  },
  {
    id: "a5",
    category: "Tasarım",
    severity: "low",
    title: "İletişim formunda güven unsurları eksik",
    explanation: "Form alanında referanslar, logolar veya güven göstergeleri yer almıyor.",
    fix: "Form yakınına güven rozetleri ve sosyal kanıt öğeleri ekleyin.",
    impact: "Güven ve dönüşüm",
  },
];

export const mockAuditTypes = [
  "Tam Analiz",
  "Sadece SEO",
  "Sadece Dönüşüm",
  "Sadece Takip",
] as const;
