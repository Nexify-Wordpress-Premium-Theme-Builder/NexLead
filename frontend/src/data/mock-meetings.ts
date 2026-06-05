import type { Meeting, MeetingBrief } from "@shared/types/meeting";
import type { MeetingBriefData, MeetingListItem, PageKpi } from "@/types/pages";

export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    leadId: "1",
    title: "Keşif Görüşmesi",
    scheduledAt: "2026-05-20T10:00:00.000Z",
    attendeeName: "John Carter",
    attendeeEmail: "john@technova.io",
    notes: "TechNova web sitesi iyileştirmelerini değerlendiriyor.",
  },
  {
    id: "meeting-2",
    leadId: "2",
    title: "Strateji Değerlendirmesi",
    scheduledAt: "2026-05-21T14:30:00.000Z",
    attendeeName: "Sarah Lin",
    attendeeEmail: "sarah@brightpath.co",
  },
  {
    id: "meeting-3",
    leadId: "3",
    title: "Tanışma Görüşmesi",
    scheduledAt: "2026-05-22T11:00:00.000Z",
    attendeeName: "Mike Johnson",
    attendeeEmail: "mike@growthlab.io",
  },
];

export const mockMeetingBriefs: MeetingBrief[] = [
  {
    meetingId: "meeting-1",
    summary: "TechNova, web sitesi dönüşüm iyileştirmelerini değerlendiriyor.",
    talkingPoints: [
      "Mobil dönüşüm boşluklarına odaklan",
      "Eksik takip altyapısını öne çıkar",
    ],
    risks: ["Bütçe onayı bekleniyor"],
  },
];

export const mockMeetingsKpis: PageKpi[] = [
  { id: "upcoming", label: "Yaklaşan", numericValue: 8, accent: "blue" },
  { id: "week", label: "Bu Hafta", numericValue: 5, accent: "purple" },
  { id: "briefs", label: "Hazır Brifler", numericValue: 6, accent: "green" },
  { id: "calls", label: "Dönüşüm Görüşmeleri", numericValue: 3, accent: "orange" },
];

export const mockMeetingList: MeetingListItem[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    date: "20 Mayıs 2025",
    time: "10:00",
    assignee: "John Carter",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    date: "21 Mayıs 2025",
    time: "14:30",
    assignee: "Sarah Lin",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    date: "22 Mayıs 2025",
    time: "11:00",
    assignee: "Mike Johnson",
  },
];

export const mockMeetingBriefData: MeetingBriefData = {
  companySummary:
    "TechNova Solutions, mobil tarafta dönüşüm boşlukları ve eksik takip altyapısı bulunan büyüyen bir SaaS şirketidir.",
  mainIssues: [
    "Yavaş Web Sitesi",
    "Zayıf CTA",
    "Takip Altyapısı Eksik",
    "Üst bölüm netliği zayıf",
  ],
  salesAngle:
    "Mobil dönüşüm boşluklarına ve eksik takip altyapısına odaklan.",
  recommendedOffer:
    "Web sitesi dönüşüm analizi + landing page iyileştirme paketi.",
  notes: "Karar verici doğrulandı. Görüşmeden önce analiz özeti ile takip yap.",
};
