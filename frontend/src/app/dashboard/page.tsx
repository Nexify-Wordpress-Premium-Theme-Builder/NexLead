import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OutreachPipeline } from "@/components/dashboard/outreach-pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopOpportunityLeads } from "@/components/dashboard/top-opportunity-leads";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import { WebsiteAuditInsights } from "@/components/dashboard/website-audit-insights";
import { PageHeader } from "@/components/layout/page-header";
import { mockDashboardKpis } from "@/data/mock-dashboard";

const kpiDelays = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Dashboard"
        description="Track leads, audits, outreach, and opportunities in one place."
        action={
          <button type="button" className="btn-campaign inline-flex items-center justify-center">
            + New Campaign
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockDashboardKpis.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            className={kpiDelays[index]}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardChart className="animation-delay-450" />
        </div>
        <TopOpportunityLeads className="animation-delay-500" />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <WebsiteAuditInsights className="animation-delay-450" />
        <OutreachPipeline className="animation-delay-500" />
        <UpcomingMeetings className="animation-delay-600" />
      </section>

      <RecentActivity className="animation-delay-600" />
    </div>
  );
}
