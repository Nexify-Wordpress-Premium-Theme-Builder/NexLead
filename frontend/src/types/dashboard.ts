import type { LucideIcon } from "lucide-react";

export type MetricAccent = "blue" | "green" | "purple" | "orange";

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  trendLabel: string;
  trendPercent: number;
  accent: MetricAccent;
  sparkline: number[];
}

export interface ChartDataPoint {
  date: string;
  leadsAcquired: number;
  outreachSent: number;
  meetingsBooked: number;
}

export interface OpportunityLeadRow {
  id: string;
  company: string;
  industry: string;
  websiteStatus: "needs_work" | "okay" | "good";
  opportunityScore: number;
  nextAction: string;
  actionType: "send_audit" | "personalize" | "follow_up";
}

export interface AuditInsightTile {
  id: string;
  label: string;
  issues: number;
}

export interface PipelineStageMetric {
  id: string;
  label: string;
  count: number;
  percent: number;
  tone: "blue" | "slate" | "indigo" | "purple" | "green" | "lime";
}

export interface UpcomingMeetingRow {
  id: string;
  company: string;
  date: string;
  time: string;
  assignee: string;
  assigneeInitials: string;
}

export interface ActivityFeedItem {
  id: string;
  message: string;
  timeAgo: string;
  type: "audit" | "outreach" | "reply" | "meeting" | "lead";
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "lead" | "audit" | "outreach" | "meeting";
}

export interface DashboardOverview {
  metrics: DashboardMetric[];
  recentActivity: ActivityItem[];
}

export type IconComponent = LucideIcon;
