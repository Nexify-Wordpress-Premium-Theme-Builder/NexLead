import type { PipelineCard, PipelineStage } from "@shared/types/pipeline";
import type { PipelineColumnData } from "@/types/pages";

export const mockPipelineStages: PipelineStage[] = [
  { id: "stage-new", label: "Yeni", status: "new", order: 1 },
  { id: "stage-audited", label: "Analiz Edildi", status: "audited", order: 2 },
  { id: "stage-message", label: "Mesaj Hazır", status: "message_ready", order: 3 },
  { id: "stage-sent", label: "Gönderildi", status: "sent", order: 4 },
  { id: "stage-replied", label: "Yanıt Geldi", status: "replied", order: 5 },
  { id: "stage-meeting", label: "Görüşme", status: "meeting", order: 6 },
  { id: "stage-closed", label: "Kapandı", status: "closed", order: 7 },
];

export const mockPipelineCards: PipelineCard[] = [
  {
    id: "card-1",
    leadId: "1",
    companyName: "TechNova Solutions",
    opportunityScore: 92,
    status: "audited",
  },
  {
    id: "card-2",
    leadId: "2",
    companyName: "BrightPath Consulting",
    opportunityScore: 87,
    status: "message_ready",
  },
];

export const mockPipelineColumns: PipelineColumnData[] = [
  {
    id: "new",
    label: "Yeni",
    count: 512,
    cards: [
      {
        id: "p1",
        company: "Nova Dental Clinic",
        industry: "Sağlık",
        score: 91,
        nextAction: "Analizi Başlat",
        badge: "Yeni",
      },
    ],
  },
  {
    id: "audited",
    label: "Analiz Edildi",
    count: 312,
    cards: [
      {
        id: "p2",
        company: "TechNova Solutions",
        industry: "SaaS",
        score: 92,
        nextAction: "Analiz Gönder",
        badge: "Analiz Edildi",
      },
      {
        id: "p3",
        company: "BrightPath Consulting",
        industry: "Danışmanlık",
        score: 87,
        nextAction: "Analiz Gönder",
        badge: "Analiz Edildi",
      },
    ],
  },
  {
    id: "message_ready",
    label: "Mesaj Hazır",
    count: 246,
    cards: [
      {
        id: "p4",
        company: "GrowthLab Marketing",
        industry: "Pazarlama",
        score: 84,
        nextAction: "Kişiselleştir",
        badge: "Hazır",
      },
    ],
  },
  {
    id: "sent",
    label: "Gönderildi",
    count: 1014,
    cards: [],
  },
  {
    id: "replied",
    label: "Yanıt Geldi",
    count: 186,
    cards: [
      {
        id: "p5",
        company: "Pinnacle Logistics",
        industry: "Lojistik",
        score: 78,
        nextAction: "Takip Et",
        badge: "Yanıt Geldi",
      },
    ],
  },
  {
    id: "meeting",
    label: "Görüşme",
    count: 86,
    cards: [
      {
        id: "p6",
        company: "Elevate HR Advisors",
        industry: "İK Hizmetleri",
        score: 72,
        nextAction: "Özeti görüntüle",
        badge: "Görüşme",
      },
    ],
  },
  {
    id: "closed",
    label: "Kapandı",
    count: 24,
    cards: [],
  },
];
