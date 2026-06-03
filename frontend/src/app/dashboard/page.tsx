import { Plus } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OutreachPipeline } from "@/components/dashboard/outreach-pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopOpportunityLeads } from "@/components/dashboard/top-opportunity-leads";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import { WebsiteAuditInsights } from "@/components/dashboard/website-audit-insights";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { mockDashboardKpis } from "@/data/mock-dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Dashboard"
        description="Track leads, audits, outreach, and opportunities in one place."
        action={
          <Button size="lg" className="h-11 gap-2 rounded-xl px-5 shadow-sm">
            <Plus className="h-4 w-4" />
            + New Campaign
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
        {mockDashboardKpis.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardChart />
        </div>
        <TopOpportunityLeads />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <WebsiteAuditInsights />
        <OutreachPipeline />
        <UpcomingMeetings />
      </section>

      <RecentActivity />
    </div>
  );
}
