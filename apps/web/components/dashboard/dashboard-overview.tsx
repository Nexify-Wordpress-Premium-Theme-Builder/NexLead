import { IconCheckCircle, IconClock, IconGlobe, IconUsers } from "@/components/ui/icons";
import { DashboardEmptyPanel } from "@/components/dashboard/dashboard-empty-panel";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { RecentAuditsCard } from "@/components/dashboard/recent-audits-card";
import { RecentLeadsCard } from "@/components/dashboard/recent-leads-card";
import { RecentWebsitesCard } from "@/components/dashboard/recent-websites-card";
import type { DashboardOverview } from "@/features/dashboard/dashboard.types";

type DashboardOverviewProps = {
  data: DashboardOverview;
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { stats, workspaceName, isFullyEmpty } = data;

  return (
    <div className="animate-fade-up mx-auto max-w-7xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">Genel Bakış</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
          Çalışma alanınızdaki lead, web sitesi ve analiz süreçlerini tek ekrandan takip edin.
        </p>
        <p className="mt-3 text-sm text-text-muted">
          Aktif çalışma alanı: <span className="font-medium text-text-secondary">{workspaceName}</span>
        </p>
      </div>

      {isFullyEmpty ? (
        <div className="mt-8">
          <DashboardEmptyPanel />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard
              icon={<IconUsers className="h-5 w-5" />}
              label="Toplam Lead"
              value={stats.totalLeads}
              description="Çalışma alanınızdaki aktif lead sayısı"
            />
            <DashboardStatCard
              icon={<IconGlobe className="h-5 w-5" />}
              label="Web Siteleri"
              value={stats.activeWebsites}
              description="Takip edilen web sitesi kayıtları"
            />
            <DashboardStatCard
              icon={<IconClock className="h-5 w-5" />}
              label="Bekleyen Analiz"
              value={stats.pendingAudits}
              description="Kuyrukta veya çalışan analizler"
            />
            <DashboardStatCard
              icon={<IconCheckCircle className="h-5 w-5" />}
              label="Tamamlanan Analiz"
              value={stats.completedAudits}
              description="Tamamlanan analiz kayıtları"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <RecentLeadsCard leads={data.recentLeads} />
            <RecentWebsitesCard websites={data.recentWebsites} />
          </div>

          <div className="mt-6">
            <RecentAuditsCard audits={data.recentAudits} />
          </div>
        </>
      )}
    </div>
  );
}
