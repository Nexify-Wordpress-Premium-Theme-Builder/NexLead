"use client";

import Link from "next/link";
import { Calendar, Check, MessageCircle, Send, UserPlus } from "lucide-react";
import { useDemoData } from "@/hooks/use-demo-data";
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
  lead: { bg: "bg-slate-100 text-slate-500", icon: UserPlus },
};

const itemDelays = [
  "animation-delay-100",
  "animation-delay-150",
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
] as const;

export function RecentActivity({ className }: { className?: string }) {
  const { activityFeed } = useDemoData();

  return (
    <div className={cn(panelClass("p-6"), "animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text-primary">Recent Activity</h3>
        <Link href="#" className="link-section">
          View all activity →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {activityFeed.slice(0, 5).map((item, index) => {
          const style = activityStyles[item.type];
          const Icon = style.icon;
          return (
            <div
              key={item.id}
              className={cn(
                "flex gap-2.5 rounded-xl border border-border-soft bg-surface-muted/40 p-3.5 transition-all duration-200 hover:border-border hover:bg-surface",
                "animate-fade-up-row",
                itemDelays[index],
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  style.bg,
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug text-text-primary">{item.message}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">{item.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
