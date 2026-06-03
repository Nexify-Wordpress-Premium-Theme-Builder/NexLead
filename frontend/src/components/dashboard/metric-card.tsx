import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types/dashboard";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{metric.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-text-primary">{metric.value}</p>
      </CardContent>
    </Card>
  );
}
