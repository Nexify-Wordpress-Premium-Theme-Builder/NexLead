import { mockDashboardOverview } from "@/data/mock-dashboard";
import type { DashboardMetric } from "@/types/dashboard";

export function useDashboardMetrics(): DashboardMetric[] {
  return mockDashboardOverview.metrics;
}
