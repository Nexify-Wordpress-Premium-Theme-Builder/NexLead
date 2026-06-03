import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 rounded-lg bg-primary-soft" />
      </CardContent>
    </Card>
  );
}
