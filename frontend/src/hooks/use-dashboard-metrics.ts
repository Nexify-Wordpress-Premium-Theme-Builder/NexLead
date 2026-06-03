import { mockDashboardKpis } from "@/data/mock-dashboard";
import type { DashboardKpi } from "@/types/dashboard";

export function useDashboardMetrics(): DashboardKpi[] {
  return mockDashboardKpis;
}
