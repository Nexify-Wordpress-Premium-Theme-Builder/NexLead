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
