import { IconClock } from "@/components/ui/icons";
import type { DashboardUpcomingTask } from "@/features/dashboard/dashboard.types";

type UpcomingTasksCardProps = {
  tasks: DashboardUpcomingTask[];
};

export function UpcomingTasksCard({ tasks }: UpcomingTasksCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Yaklaşan İşler</h2>
          <p className="mt-1 text-xs text-text-muted">Takip edilecek analiz ve leadler</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
          <IconClock className="h-4 w-4" />
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-surface-soft/40 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{task.title}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{task.subtitle}</p>
            </div>
            <span className="shrink-0 text-[11px] font-medium text-text-muted">{task.timeLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
