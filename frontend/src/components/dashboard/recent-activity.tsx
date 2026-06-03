import Link from "next/link";
import { Calendar, Check, MessageCircle, Send, UserPlus } from "lucide-react";
import { mockActivityFeed } from "@/data/mock-dashboard";
import type { ActivityFeedItem } from "@/types/dashboard";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";

const activityStyles: Record<
  ActivityFeedItem["type"],
  { bg: string; icon: typeof Check }
> = {
  audit: { bg: "bg-green-soft text-green", icon: Check },
  outreach: { bg: "bg-primary-soft text-primary", icon: Send },
  reply: { bg: "bg-purple-soft text-purple", icon: MessageCircle },
  meeting: { bg: "bg-orange-soft text-orange", icon: Calendar },
  lead: { bg: "bg-slate-100 text-slate-600", icon: UserPlus },
};

export function RecentActivity({ className }: { className?: string }) {
  return (
    <div className={cn(panelClass("p-6"), "animate-fade-up", className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Recent Activity</h3>
        <Link href="#" className="link-section">
          View all activity →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {mockActivityFeed.map((item) => {
          const style = activityStyles[item.type];
          const Icon = style.icon;
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-[14px] border border-border-soft bg-surface/60 p-4 transition-all duration-200 hover:border-border hover:bg-surface-muted"
            >
              <div
                className={cn(
                  "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full",
                  style.bg,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-text-primary">{item.message}</p>
                <p className="mt-1 text-xs text-text-muted">{item.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
