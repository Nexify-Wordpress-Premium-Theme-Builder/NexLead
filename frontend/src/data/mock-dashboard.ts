import type {
  ActivityFeedItem,
  AuditInsightTile,
  ChartDataPoint,
  DashboardKpi,
  OpportunityLeadRow,
  PipelineStageMetric,
  UpcomingMeetingRow,
} from "@/types/dashboard";

export const mockDashboardKpis: DashboardKpi[] = [
  {
    id: "total-leads",
    label: "Toplam Potansiyel Müşteri",
    value: "2,482",
    numericValue: 2482,
    trendLabel: "son 30 güne göre",
    trendPercent: 18.6,
    accent: "blue",
    sparkline: [40, 55, 48, 62, 58, 70, 75, 82],
  },
  {
    id: "high-opportunity",
    label: "Yüksek Fırsatlı Müşteriler",
    value: "612",
    numericValue: 612,
    trendLabel: "son 30 güne göre",
    trendPercent: 24.3,
    accent: "green",
    sparkline: [30, 38, 42, 50, 55, 60, 68, 72],
  },
  {
    id: "outreach-sent",
    label: "Gönderilen İletişim",
    value: "1,732",
    numericValue: 1732,
    trendLabel: "son 30 güne göre",
    trendPercent: 15.2,
    accent: "purple",
    sparkline: [50, 52, 58, 61, 65, 68, 72, 78],
  },
  {
    id: "meetings-booked",
    label: "Planlanan Görüşmeler",
    value: "86",
    numericValue: 86,
    trendLabel: "son 30 güne göre",
    trendPercent: 16.7,
    accent: "orange",
    sparkline: [20, 24, 22, 28, 30, 32, 35, 38],
  },
];

export const mockChartData: ChartDataPoint[] = [
  { date: "20 Nisan", leadsAcquired: 120, outreachSent: 95, meetingsBooked: 18 },
  { date: "24 Nisan", leadsAcquired: 145, outreachSent: 110, meetingsBooked: 22 },
  { date: "28 Nisan", leadsAcquired: 130, outreachSent: 105, meetingsBooked: 20 },
  { date: "2 Mayıs", leadsAcquired: 165, outreachSent: 130, meetingsBooked: 28 },
  { date: "6 Mayıs", leadsAcquired: 150, outreachSent: 125, meetingsBooked: 25 },
  { date: "10 Mayıs", leadsAcquired: 175, outreachSent: 140, meetingsBooked: 32 },
  { date: "14 Mayıs", leadsAcquired: 160, outreachSent: 135, meetingsBooked: 30 },
  { date: "18 Mayıs", leadsAcquired: 190, outreachSent: 155, meetingsBooked: 35 },
];

export const mockOpportunityLeads: OpportunityLeadRow[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    industry: "SaaS",
    websiteStatus: "needs_work",
    opportunityScore: 92,
    nextAction: "Analiz Gönder",
    actionType: "send_audit",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    industry: "Danışmanlık",
    websiteStatus: "needs_work",
    opportunityScore: 87,
    nextAction: "Analiz Gönder",
    actionType: "send_audit",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    industry: "Pazarlama",
    websiteStatus: "needs_work",
    opportunityScore: 84,
    nextAction: "Kişiselleştir",
    actionType: "personalize",
  },
  {
    id: "4",
    company: "Pinnacle Logistics",
    industry: "Lojistik",
    websiteStatus: "okay",
    opportunityScore: 78,
    nextAction: "Analiz Gönder",
    actionType: "send_audit",
  },
  {
    id: "5",
    company: "Elevate HR Advisors",
    industry: "İK Hizmetleri",
    websiteStatus: "good",
    opportunityScore: 72,
    nextAction: "Takip Et",
    actionType: "follow_up",
  },
];

export const mockAuditInsights: AuditInsightTile[] = [
  { id: "seo", label: "SEO", issues: 24 },
  { id: "speed", label: "Hız", issues: 31 },
  { id: "mobile", label: "Mobil", issues: 15 },
  { id: "cta", label: "CTA", issues: 18 },
  { id: "tracking", label: "Takip", issues: 12 },
];

export const mockPipelineStages: PipelineStageMetric[] = [
  { id: "new", label: "Yeni", count: 512, percent: 21, tone: "blue" },
  { id: "audited", label: "Analiz Edildi", count: 312, percent: 13, tone: "slate" },
  { id: "message_ready", label: "Mesaj Hazır", count: 246, percent: 10, tone: "indigo" },
  { id: "sent", label: "Gönderildi", count: 1014, percent: 41, tone: "purple" },
  { id: "replied", label: "Yanıt Geldi", count: 186, percent: 8, tone: "green" },
  { id: "meeting", label: "Görüşme", count: 86, percent: 3, tone: "lime" },
];

export const mockUpcomingMeetings: UpcomingMeetingRow[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    date: "20 Mayıs 2025",
    time: "10:00",
    assignee: "John Carter",
    assigneeInitials: "JC",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    date: "21 Mayıs 2025",
    time: "14:30",
    assignee: "Sarah Lin",
    assigneeInitials: "SL",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    date: "22 Mayıs 2025",
    time: "11:00",
    assignee: "Mike Johnson",
    assigneeInitials: "MJ",
  },
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "1",
    message: "TechNova Solutions için site analizi tamamlandı",
    timeAgo: "2 dakika önce",
    type: "audit",
  },
  {
    id: "2",
    message: "BrightPath Consulting için iletişim mesajı gönderildi",
    timeAgo: "15 dakika önce",
    type: "outreach",
  },
  {
    id: "3",
    message: "GrowthLab Marketing tarafından yeni yanıt alındı",
    timeAgo: "1 saat önce",
    type: "reply",
  },
  {
    id: "4",
    message: "Pinnacle Logistics ile görüşme planlandı",
    timeAgo: "2 saat önce",
    type: "meeting",
  },
  {
    id: "5",
    message: "Yeni potansiyel müşteri eklendi: Elevate HR Advisors",
    timeAgo: "3 saat önce",
    type: "lead",
  },
];

export const mockAverageWebsiteScore = 62;
