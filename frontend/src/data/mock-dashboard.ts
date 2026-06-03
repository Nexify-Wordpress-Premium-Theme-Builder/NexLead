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
    label: "Total Leads",
    value: "2,482",
    numericValue: 2482,
    trendLabel: "vs last 30 days",
    trendPercent: 18.6,
    accent: "blue",
    sparkline: [40, 55, 48, 62, 58, 70, 75, 82],
  },
  {
    id: "high-opportunity",
    label: "High Opportunity Leads",
    value: "612",
    numericValue: 612,
    trendLabel: "vs last 30 days",
    trendPercent: 24.3,
    accent: "green",
    sparkline: [30, 38, 42, 50, 55, 60, 68, 72],
  },
  {
    id: "outreach-sent",
    label: "Outreach Sent",
    value: "1,732",
    numericValue: 1732,
    trendLabel: "vs last 30 days",
    trendPercent: 15.2,
    accent: "purple",
    sparkline: [50, 52, 58, 61, 65, 68, 72, 78],
  },
  {
    id: "meetings-booked",
    label: "Meetings Booked",
    value: "86",
    numericValue: 86,
    trendLabel: "vs last 30 days",
    trendPercent: 16.7,
    accent: "orange",
    sparkline: [20, 24, 22, 28, 30, 32, 35, 38],
  },
];

export const mockChartData: ChartDataPoint[] = [
  { date: "Apr 20", leadsAcquired: 120, outreachSent: 95, meetingsBooked: 18 },
  { date: "Apr 24", leadsAcquired: 145, outreachSent: 110, meetingsBooked: 22 },
  { date: "Apr 28", leadsAcquired: 130, outreachSent: 105, meetingsBooked: 20 },
  { date: "May 2", leadsAcquired: 165, outreachSent: 130, meetingsBooked: 28 },
  { date: "May 6", leadsAcquired: 150, outreachSent: 125, meetingsBooked: 25 },
  { date: "May 10", leadsAcquired: 175, outreachSent: 140, meetingsBooked: 32 },
  { date: "May 14", leadsAcquired: 160, outreachSent: 135, meetingsBooked: 30 },
  { date: "May 18", leadsAcquired: 190, outreachSent: 155, meetingsBooked: 35 },
];

export const mockOpportunityLeads: OpportunityLeadRow[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    industry: "SaaS",
    websiteStatus: "needs_work",
    opportunityScore: 92,
    nextAction: "Send Audit",
    actionType: "send_audit",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    industry: "Consulting",
    websiteStatus: "needs_work",
    opportunityScore: 87,
    nextAction: "Send Audit",
    actionType: "send_audit",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    industry: "Marketing",
    websiteStatus: "needs_work",
    opportunityScore: 84,
    nextAction: "Personalize",
    actionType: "personalize",
  },
  {
    id: "4",
    company: "Pinnacle Logistics",
    industry: "Logistics",
    websiteStatus: "okay",
    opportunityScore: 78,
    nextAction: "Send Audit",
    actionType: "send_audit",
  },
  {
    id: "5",
    company: "Elevate HR Advisors",
    industry: "HR Services",
    websiteStatus: "good",
    opportunityScore: 72,
    nextAction: "Follow Up",
    actionType: "follow_up",
  },
];

export const mockAuditInsights: AuditInsightTile[] = [
  { id: "seo", label: "SEO", issues: 24 },
  { id: "speed", label: "Speed", issues: 31 },
  { id: "mobile", label: "Mobile", issues: 15 },
  { id: "cta", label: "CTA", issues: 18 },
  { id: "tracking", label: "Tracking", issues: 12 },
];

export const mockPipelineStages: PipelineStageMetric[] = [
  { id: "new", label: "New", count: 512, percent: 21, tone: "blue" },
  { id: "audited", label: "Audited", count: 312, percent: 13, tone: "slate" },
  { id: "message_ready", label: "Message Ready", count: 246, percent: 10, tone: "indigo" },
  { id: "sent", label: "Sent", count: 1014, percent: 41, tone: "purple" },
  { id: "replied", label: "Replied", count: 186, percent: 8, tone: "green" },
  { id: "meeting", label: "Meeting", count: 86, percent: 3, tone: "lime" },
];

export const mockUpcomingMeetings: UpcomingMeetingRow[] = [
  {
    id: "1",
    company: "TechNova Solutions",
    date: "May 20, 2025",
    time: "10:00 AM",
    assignee: "John Carter",
    assigneeInitials: "JC",
  },
  {
    id: "2",
    company: "BrightPath Consulting",
    date: "May 21, 2025",
    time: "2:30 PM",
    assignee: "Sarah Lin",
    assigneeInitials: "SL",
  },
  {
    id: "3",
    company: "GrowthLab Marketing",
    date: "May 22, 2025",
    time: "11:00 AM",
    assignee: "Mike Johnson",
    assigneeInitials: "MJ",
  },
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "1",
    message: "Website audit completed for TechNova Solutions",
    timeAgo: "2 minutes ago",
    type: "audit",
  },
  {
    id: "2",
    message: "Outreach email sent to BrightPath Consulting",
    timeAgo: "15 minutes ago",
    type: "outreach",
  },
  {
    id: "3",
    message: "New reply received from GrowthLab Marketing",
    timeAgo: "1 hour ago",
    type: "reply",
  },
  {
    id: "4",
    message: "Meeting booked with Pinnacle Logistics",
    timeAgo: "2 hours ago",
    type: "meeting",
  },
  {
    id: "5",
    message: "New lead added: Elevate HR Advisors",
    timeAgo: "3 hours ago",
    type: "lead",
  },
];

export const mockAverageWebsiteScore = 62;
