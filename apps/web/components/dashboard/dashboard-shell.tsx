"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { NexLeadLogo } from "@/components/brand/nexlead-logo";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { IconClose } from "@/components/ui/icons";

type DashboardShellProps = {
  userEmail: string | null;
  workspaceName: string | null;
  children: ReactNode;
};

export function DashboardShell({ userEmail, workspaceName, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-[#0F172A]/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[rgba(15,23,42,0.08)] bg-white transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-[rgba(15,23,42,0.06)] px-[18px]">
          <div className="min-w-0 flex-1">
            <NexLeadLogo variant="full" className="h-9 max-w-full" priority />
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-[#64748B] transition-colors hover:bg-[#F8FAFC] lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <DashboardSidebar userEmail={userEmail} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-[260px]">
        <DashboardHeader
          workspaceName={workspaceName}
          userEmail={userEmail}
          showMenuButton
          onMenuOpen={() => setMobileOpen(true)}
        />

        <main className="overflow-x-hidden px-4 py-5 sm:px-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
