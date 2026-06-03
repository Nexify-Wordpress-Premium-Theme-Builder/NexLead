import type { DashboardOverview } from "@/types/dashboard";
import { mockLeads } from "./mock-leads";
import { mockMeetings } from "./mock-meetings";

export const mockDashboardOverview: DashboardOverview = {
  metrics: [
    { id: "metric-leads", label: "Active Leads", value: 48, change: 12, trend: "up" },
    { id: "metric-audits", label: "Audits This Week", value: 14, change: 4, trend: "up" },
    { id: "metric-replies", label: "Reply Rate", value: "22%", change: 3, trend: "up" },
    { id: "metric-meetings", label: "Upcoming Meetings", value: 6, trend: "neutral" },
  ],
  recentActivity: [
    {
      id: "activity-1",
      title: "Audit completed",
      description: `${mockLeads[0].companyName} website scored 58/100`,
      timestamp: "2026-05-28T11:00:00.000Z",
      type: "audit",
    },
    {
      id: "activity-2",
      title: "Meeting scheduled",
      description: `${mockMeetings[0].attendeeName} discovery call booked`,
      timestamp: "2026-05-28T09:30:00.000Z",
      type: "meeting",
    },
  ],
};

export const mockTopOpportunityLeads = mockLeads.slice(0, 3);
