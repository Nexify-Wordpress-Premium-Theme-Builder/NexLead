import { IconClock } from "@/components/ui/icons";
import { PremiumCard } from "@/components/ui/premium-card";
import type { DashboardUpcomingTask } from "@/features/dashboard/dashboard.types";

type UpcomingTasksCardProps = {
  tasks: DashboardUpcomingTask[];
};

export function UpcomingTasksCard({ tasks }: UpcomingTasksCardProps) {
  return (
    <PremiumCard padding="panel">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="dashboard-section-title">Yaklaşan İşler</h2>
          <p className="dashboard-body mt-1">Takip edilecek analiz ve raporlar</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
          <IconClock className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className="dashboard-table-row flex items-start justify-between gap-3 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-[#F8FAFC] p-3.5"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-[#0F172A]">{task.title}</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#64748B]">{task.subtitle}</p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#475569]">
              {task.timeLabel}
            </span>
          </li>
        ))}
      </ul>
    </PremiumCard>
  );
}
