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
    <div className="min-h-screen bg-background">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-[#0f172a]/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r bg-surface transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderColor: "var(--nx-border)" }}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b px-4" style={{ borderColor: "var(--nx-border)" }}>
          <NexLeadLogo variant="full" className="h-8 max-w-full" priority />
          <button
            type="button"
            className="rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-soft lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <DashboardSidebar userEmail={userEmail} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-[248px]">
        <DashboardHeader
          workspaceName={workspaceName}
          userEmail={userEmail}
          showMenuButton
          onMenuOpen={() => setMobileOpen(true)}
        />

        <main className="overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
