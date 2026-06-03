"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronDown, Sparkles } from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-[260px] flex-col border-r border-border bg-surface px-5 py-6",
        className,
      )}
    >
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#4F46E5] text-sm font-bold text-white shadow-sm">
          N
        </div>
        <span className="text-lg font-bold tracking-tight text-text-primary">NexLead</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-text-secondary hover:bg-slate-50 hover:text-text-primary",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-text-muted")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary-soft to-white p-4">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">AI-Powered Growth</span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          NexLead finds high-opportunity prospects, audits their websites, and helps you close
          more clients—faster.
        </p>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          Learn more →
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-slate-50/80 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Acme Marketing</p>
            <p className="text-xs text-text-muted">Growth Plan</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </div>
    </aside>
  );
}
