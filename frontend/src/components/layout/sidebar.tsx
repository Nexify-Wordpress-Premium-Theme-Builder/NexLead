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
        "animate-fade-left flex h-screen w-[260px] flex-col border-r border-border-soft bg-[rgba(255,255,255,0.88)] px-5 py-5 backdrop-blur-md",
        className,
      )}
    >
      <div className="mb-7 flex items-center gap-3 px-0.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.28)]">
          N
        </div>
        <span className="text-[18px] font-bold tracking-tight text-text-primary">NexLead</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
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
                  ? "border border-[rgba(37,99,235,0.12)] bg-gradient-to-br from-[#EFF6FF] to-[#EEF2FF] text-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  isActive ? "text-primary" : "text-text-muted",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[16px] border border-[rgba(37,99,235,0.1)] bg-gradient-to-br from-primary-soft via-white to-white p-4 shadow-[0_4px_16px_rgba(37,99,235,0.06)]">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft-2">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold">AI-Powered Growth</span>
        </div>
        <p className="text-xs leading-[1.55] text-text-secondary">
          NexLead finds high-opportunity prospects, audits their websites, and helps you close
          more clients—faster.
        </p>
        <button
          type="button"
          className="mt-3 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          Learn more →
        </button>
      </div>

      <div className="mt-4 flex cursor-pointer items-center justify-between rounded-[14px] border border-border-soft bg-surface px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 hover:border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-soft bg-surface text-text-secondary">
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
